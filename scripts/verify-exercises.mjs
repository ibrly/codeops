#!/usr/bin/env node
// Checks every exercise in every track: its tests must fail on the shipped code
// and pass once the reference solution files are copied over it.
import { readdirSync, existsSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const tracks = join(root, "tracks");

function runTests(dir) {
  return spawnSync(process.execPath, ["--test"], { cwd: dir, encoding: "utf8" }).status;
}

let failures = 0;
let checked = 0;

for (const track of readdirSync(tracks)) {
  const exercises = join(tracks, track, "exercises");
  if (!existsSync(exercises)) continue;
  for (const id of readdirSync(exercises).sort()) {
    const solution = join(tracks, track, "solutions", id);
    const work = mkdtempSync(join(tmpdir(), "codeops-verify-"));
    cpSync(join(exercises, id), work, { recursive: true });

    const problems = [];
    if (!existsSync(solution)) problems.push("no solution folder");
    if (runTests(work) === 0) problems.push("tests pass on the shipped code (nothing to fix)");
    if (existsSync(solution)) {
      cpSync(solution, work, { recursive: true, filter: (src) => !src.endsWith("NOTES.md") });
      if (runTests(work) !== 0) problems.push("tests fail on the reference solution");
    }
    rmSync(work, { recursive: true, force: true });

    checked++;
    if (problems.length) {
      failures++;
      console.error(`FAIL  ${track}/${id}: ${problems.join("; ")}`);
    } else {
      console.log(`ok    ${track}/${id}`);
    }
  }
}

if (failures) {
  console.error(`\n${failures} of ${checked} exercise(s) failed verification.`);
  process.exit(1);
}
console.log(`\nAll ${checked} exercise(s) verified.`);
