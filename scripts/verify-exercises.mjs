#!/usr/bin/env node
// Checks every exercise in every track: its tests must fail on the shipped code
// and pass once the reference solution files are copied over it.
import { readdirSync, readFileSync, existsSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const t = createRequire(import.meta.url)(join(root, "lib", "tracks.js"));

let failures = 0;
let checked = 0;
const fail = (where, problems) => {
  failures++;
  console.error(`FAIL  ${where}: ${problems.join("; ")}`);
};

// Structural rules every track must follow, so contributor mistakes fail CI with a clear message.
function lint(track) {
  const problems = [];
  const allowed = ["title", "language", "test", "capstone", "next"];
  for (const key of Object.keys(track.manifest)) if (!allowed.includes(key)) problems.push(`track.json: unknown key "${key}"`);
  for (const key of ["title", "language", "test", "capstone"]) if (!(key in track.manifest)) problems.push(`track.json: missing "${key}"`);
  if (!Array.isArray(track.test) || !track.test.every((a) => typeof a === "string")) problems.push('track.json: "test" must be a list of strings');
  if (!track.ids.includes(track.capstone)) problems.push(`track.json: capstone "${track.capstone}" isn't one of the exercises`);
  if (track.next && !t.loadTrack(track.next)) problems.push(`track.json: next track "${track.next}" doesn't exist`);
  if (!track.ids.length) problems.push("no exercises");
  track.ids.forEach((id, i) => {
    if (!id.startsWith(String(i + 1).padStart(2, "0") + "-")) problems.push(`exercise numbering has a gap or duplicate at ${id}`);
    const dir = join(track.exercises, id);
    const readme = join(dir, "README.md");
    if (!existsSync(readme)) problems.push(`${id}: no README.md`);
    else if (Array.isArray(track.test) && !readFileSync(readme, "utf8").includes(track.test.join(" "))) {
      problems.push(`${id}: README.md doesn't show the test command "${track.test.join(" ")}"`);
    }
    if (!readdirSync(dir).some(t.isTestFile)) problems.push(`${id}: no test file`);
    if (!existsSync(join(track.dir, "solutions", id, "NOTES.md"))) problems.push(`${id}: no solutions/${id}/NOTES.md`);
  });
  const solutions = join(track.dir, "solutions");
  for (const id of existsSync(solutions) ? readdirSync(solutions) : []) {
    if (!track.ids.includes(id)) problems.push(`solutions/${id} has no matching exercise`);
  }
  return problems;
}

for (const name of readdirSync(t.tracksDir)) {
  const track = t.loadTrack(name);
  if (!track) {
    fail(`tracks/${name}`, ["no track.json"]);
    continue;
  }
  const structural = lint(track);
  if (structural.length) {
    fail(name, structural);
    continue;
  }
  for (const id of track.ids) {
    const solution = join(track.dir, "solutions", id);
    const work = mkdtempSync(join(tmpdir(), "codeops-verify-"));
    cpSync(join(track.exercises, id), work, { recursive: true });

    const problems = [];
    const expected = t.expectedTests(join(track.exercises, id));
    const shipped = await t.runTests(track, work);
    if (shipped.missing) problems.push(shipped.output);
    else if (t.runPassed(track, shipped, expected)) problems.push("tests pass on the shipped code (nothing to fix)");
    if (!expected) problems.push("no test cases found in the shipped test files");
    if (!existsSync(solution)) problems.push("no solution folder");
    else if (!shipped.missing) {
      cpSync(solution, work, { recursive: true, filter: (src) => !src.endsWith("NOTES.md") && !src.includes(`${join(solution, "wrong")}`) });
      if (!t.runPassed(track, await t.runTests(track, work), expected)) problems.push("tests fail on the reference solution");
    }
    rmSync(work, { recursive: true, force: true });

    // solutions/<id>/wrong/<name>/ holds plausible fixes that break the spec. Each must FAIL the tests,
    // so a test that's too loose to catch it is caught here instead of by a learner.
    const wrongDir = join(solution, "wrong");
    for (const name of existsSync(wrongDir) ? readdirSync(wrongDir) : []) {
      const attempt = mkdtempSync(join(tmpdir(), "codeops-verify-"));
      cpSync(join(track.exercises, id), attempt, { recursive: true });
      cpSync(join(wrongDir, name), attempt, { recursive: true });
      if (t.runPassed(track, await t.runTests(track, attempt), expected)) problems.push(`wrong fix "${name}" passes the tests`);
      rmSync(attempt, { recursive: true, force: true });
    }

    checked++;
    if (problems.length) fail(`${name}/${id}`, problems);
    else console.log(`ok    ${name}/${id}`);
  }
}

// Language versions of a module (X and X-python) must line up: same count, numbering, and capstone.
// Names may differ where the languages do (05-arrays vs 05-lists).
for (const name of readdirSync(t.tracksDir)) {
  if (!name.endsWith("-python")) continue;
  const py = t.loadTrack(name);
  const js = t.loadTrack(name.slice(0, -"-python".length));
  if (!py || !js) continue;
  const numbers = (track) => track.ids.map((id) => id.slice(0, 2)).join(",");
  const problems = [];
  if (numbers(js) !== numbers(py)) problems.push(`exercises ${numbers(js)} in ${js.name} but ${numbers(py)} in ${py.name}`);
  if (js.capstone !== py.capstone) problems.push(`capstone ${js.capstone} in ${js.name} but ${py.capstone} in ${py.name}`);
  if (Boolean(js.next) !== Boolean(py.next)) problems.push("only one language version names a next track");
  // Test counts should match too, unless a NOTES.md says why they differ ("Test count differs: ...").
  js.ids.forEach((jsId, i) => {
    const pyId = py.ids[i];
    if (!pyId) return;
    const counts = [t.expectedTests(join(js.exercises, jsId)), t.expectedTests(join(py.exercises, pyId))];
    if (counts[0] === counts[1]) return;
    const explained = [join(js.dir, "solutions", jsId, "NOTES.md"), join(py.dir, "solutions", pyId, "NOTES.md")].some(
      (notes) => existsSync(notes) && /Test count differs:/.test(readFileSync(notes, "utf8")),
    );
    if (!explained) problems.push(`${jsId} has ${counts[0]} tests but ${pyId} has ${counts[1]}; align them or explain in NOTES.md ("Test count differs: ...")`);
  });
  if (problems.length) fail(`${js.name} / ${py.name}`, problems);
}

if (failures) {
  console.error(`\n${failures} problem(s) across ${checked} exercise(s).`);
  process.exit(1);
}
console.log(`\nAll ${checked} exercise(s) verified.`);
