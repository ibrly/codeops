#!/usr/bin/env node
// Deterministic tests for the learner helper scripts in bin/. Runs in CI.
import test from "node:test";
import assert from "node:assert";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const bin = (name) => join(root, "bin", name);

function learner() {
  const dir = mkdtempSync(join(tmpdir(), "codeops-bin-"));
  test.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function run(cwd, name, ...args) {
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const r = spawnSync(process.execPath, [bin(name), ...args], { cwd, encoding: "utf8", env });
  return { status: r.status, out: r.stdout + r.stderr };
}
const progress = (cwd) => JSON.parse(readFileSync(join(cwd, ".codeops", "progress.json"), "utf8"));
const solve = (cwd, track, id) =>
  cpSync(join(root, "tracks", track, "solutions", id), join(cwd, `codeops-${track}`, id), {
    recursive: true,
    filter: (src) => !src.endsWith("NOTES.md"),
  });

test("v0.1 progress.json migrates and keeps its history", () => {
  const cwd = learner();
  mkdirSync(join(cwd, ".codeops"));
  writeFileSync(
    join(cwd, ".codeops", "progress.json"),
    JSON.stringify({ exercises: { "03-loops": { status: "passed", attempts: 1 } } }),
  );
  const list = run(cwd, "codeops-exercise", "--list");
  assert.match(list.out, /03-loops\s+passed/);
  run(cwd, "codeops-exercise", "1");
  const p = progress(cwd);
  assert.strictEqual(p.track, "foundations");
  assert.strictEqual(p.tracks.foundations.exercises["03-loops"].status, "passed");
  assert.strictEqual(p.exercises, undefined);
});

test("setting up an exercise never overwrites the learner's work", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  const file = join(cwd, "codeops-foundations", "03-loops", "total.js");
  writeFileSync(file, "// mine\n");
  assert.match(run(cwd, "codeops-exercise", "3").out, /changes are kept/);
  assert.strictEqual(readFileSync(file, "utf8"), "// mine\n");
  assert.ok(existsSync(join(cwd, ".codeops", ".gitignore")));
  assert.match(readFileSync(join(cwd, "codeops-foundations", ".gitignore"), "utf8"), /__pycache__\//);
});

test("only a passing test run marks an exercise passed", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  assert.match(run(cwd, "codeops-check", "3").out, /RESULT: foundations\/03-loops failing/);
  solve(cwd, "foundations", "03-loops");
  assert.match(run(cwd, "codeops-check", "3").out, /RESULT: foundations\/03-loops passed/);
  assert.strictEqual(progress(cwd).tracks.foundations.exercises["03-loops"].attempts, 2);
});

test("escape-hatch help makes a pass assisted, including legacy bare ids", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "4");
  writeFileSync(join(cwd, ".codeops", "mistakes.md"), "- concept: return\n  exercise: 04-functions\n  how: escape hatch\n");
  solve(cwd, "foundations", "04-functions");
  assert.match(run(cwd, "codeops-check", "4").out, /04-functions assisted/);
});

test("--track rejects unknown tracks", () => {
  const cwd = learner();
  const r = run(cwd, "codeops-exercise", "--track", "nope");
  assert.strictEqual(r.status, 1);
  assert.match(r.out, /No track "nope"/);
});

test("recall moves through 1, 3, 7 days and resets on a miss", () => {
  const cwd = learner();
  mkdirSync(join(cwd, ".codeops"));
  writeFileSync(join(cwd, ".codeops", "mistakes.md"), "- concept: loops\n  interval: 1\n  due: 2000-01-01\n");
  assert.match(run(cwd, "codeops-recall").out, /#1\s+loops/);
  run(cwd, "codeops-recall", "pass", "1");
  assert.match(readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8"), /interval: 3/);
  run(cwd, "codeops-recall", "pass", "1");
  assert.match(readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8"), /interval: 7/);
  run(cwd, "codeops-recall", "miss", "1");
  assert.match(readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8"), /interval: 1/);
  assert.match(run(cwd, "codeops-recall").out, /No recall checks due/);
});

test("the Python track runs its own tests and keeps progress separate", () => {
  const cwd = learner();
  assert.match(run(cwd, "codeops-exercise", "--track", "foundations-python").out, /Active track: foundations-python/);
  assert.match(run(cwd, "codeops-exercise", "--list").out, /tests: python3 -m unittest/);
  run(cwd, "codeops-exercise", "3");
  assert.match(run(cwd, "codeops-check", "3").out, /foundations-python\/03-loops failing/);
  // A bare "03-loops" entry belongs to the JavaScript track and must not affect Python.
  writeFileSync(join(cwd, ".codeops", "mistakes.md"), "- concept: loops\n  exercise: 03-loops\n  how: escape hatch\n");
  solve(cwd, "foundations-python", "03-loops");
  assert.match(run(cwd, "codeops-check", "3").out, /foundations-python\/03-loops passed/);
  assert.ok(!existsSync(join(cwd, "codeops-foundations-python", "03-loops", "__pycache__")));
  const p = progress(cwd);
  assert.strictEqual(p.tracks["foundations-python"].exercises["03-loops"].status, "passed");
  assert.strictEqual(p.tracks.foundations?.exercises["03-loops"], undefined);
});

test("codeops-repo reports the test command without running it", () => {
  const cwd = learner();
  spawnSync("git", ["init", "-q"], { cwd });
  writeFileSync(join(cwd, "sum.js"), "// TODO handle empty lists\nmodule.exports = (a) => a;\n");
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ scripts: { test: "touch RAN && node --test" } }));
  const r = run(cwd, "codeops-repo");
  assert.strictEqual(r.status, 0);
  assert.match(r.out, /sum\.js:1:.*TODO handle empty lists/);
  assert.match(r.out, /npm test\s+\(runs: touch RAN && node --test\)/);
  assert.ok(!existsSync(join(cwd, "RAN")), "the project's test script must never run");
});

test("codeops-repo works outside a git repository", () => {
  const cwd = learner();
  const r = run(cwd, "codeops-repo");
  assert.strictEqual(r.status, 0);
  assert.match(r.out, /isn't a git repository/);
  assert.match(r.out, /unknown: ask the learner/);
});
