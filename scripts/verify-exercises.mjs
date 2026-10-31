#!/usr/bin/env node
// Checks every exercise in every track: its tests must fail on the shipped code
// and pass once the reference solution files are copied over it.
import { readdirSync, existsSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const t = createRequire(import.meta.url)(join(root, "lib", "tracks.js"));

let failures = 0;
let checked = 0;
const fail = (where, problems) => {
  failures++;
  console.error(`FAIL  ${where}: ${problems.join("; ")}`);
};

for (const name of readdirSync(join(root, "tracks"))) {
  const track = t.loadTrack(name);
  if (!track) {
    fail(`tracks/${name}`, ["no track.json"]);
    continue;
  }
  for (const id of track.ids) {
    const solution = join(track.dir, "solutions", id);
    const work = mkdtempSync(join(tmpdir(), "codeops-verify-"));
    cpSync(join(track.exercises, id), work, { recursive: true });

    const problems = [];
    const shipped = await t.runTests(track, work);
    if (shipped.missing) problems.push(shipped.output);
    else if (shipped.status === 0) problems.push("tests pass on the shipped code (nothing to fix)");
    if (!existsSync(solution)) problems.push("no solution folder");
    else if (!shipped.missing) {
      cpSync(solution, work, { recursive: true, filter: (src) => !src.endsWith("NOTES.md") });
      if ((await t.runTests(track, work)).status !== 0) problems.push("tests fail on the reference solution");
    }
    rmSync(work, { recursive: true, force: true });

    checked++;
    if (problems.length) fail(`${name}/${id}`, problems);
    else console.log(`ok    ${name}/${id}`);
  }
}

if (failures) {
  console.error(`\n${failures} problem(s) across ${checked} exercise(s).`);
  process.exit(1);
}
console.log(`\nAll ${checked} exercise(s) verified.`);
