#!/usr/bin/env node
// Deterministic tests for the learner helper scripts in bin/. Runs in CI.
import test from "node:test";
import assert from "node:assert";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, cpSync, existsSync, rmSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
  const file = join(cwd, ".codeops", "mistakes.md");
  // Each check only counts once it's due, so move the due date back between checks.
  const makeDue = () => writeFileSync(file, readFileSync(file, "utf8").replace(/due: .*/, "due: 2000-01-01"));
  writeFileSync(file, "- concept: loops\n  interval: 1\n  due: 2000-01-01\n");
  assert.match(run(cwd, "codeops-recall").out, /#1\s+loops/);
  run(cwd, "codeops-recall", "pass", "1");
  assert.match(readFileSync(file, "utf8"), /interval: 3/);
  makeDue();
  run(cwd, "codeops-recall", "pass", "1");
  assert.match(readFileSync(file, "utf8"), /interval: 7/);
  makeDue();
  run(cwd, "codeops-recall", "miss", "1");
  assert.match(readFileSync(file, "utf8"), /interval: 1/);
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

test("editing a shipped test can't make an exercise pass", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  const testFile = join(cwd, "codeops-foundations", "03-loops", "total.test.js");
  const weakened = readFileSync(testFile, "utf8").replace("330", "300").replace("200);", "0);");
  writeFileSync(testFile, weakened);
  const r = run(cwd, "codeops-check", "3");
  assert.match(r.out, /03-loops failing/);
  assert.match(r.out, /NOTE: your copy of total\.test\.js differs/);
  assert.strictEqual(readFileSync(testFile, "utf8"), weakened, "the learner's file must be left as they wrote it");
  assert.notStrictEqual(progress(cwd).tracks.foundations.exercises["03-loops"].status, "passed");
});

test("the learner's own test still counts in the writing-tests exercise", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "9");
  const mine = join(cwd, "codeops-foundations", "09-writing-tests", "my.test.js");
  writeFileSync(mine, 'require("node:test")("nothing", () => {});\n');
  assert.match(run(cwd, "codeops-check", "9").out, /09-writing-tests failing/);
  solve(cwd, "foundations", "09-writing-tests");
  const r = run(cwd, "codeops-check", "9");
  assert.match(r.out, /09-writing-tests passed/);
  assert.doesNotMatch(r.out, /NOTE:/);
});

test("a corrupted progress.json is never overwritten", () => {
  const cwd = learner();
  mkdirSync(join(cwd, ".codeops"));
  writeFileSync(join(cwd, ".codeops", "progress.json"), "{bad");
  for (const args of [["codeops-exercise", "3"], ["codeops-exercise", "--list"], ["codeops-check", "3"]]) {
    const r = run(cwd, ...args);
    assert.notStrictEqual(r.status, 0, args.join(" "));
    assert.match(r.out, /isn't valid JSON/);
  }
  assert.strictEqual(readFileSync(join(cwd, ".codeops", "progress.json"), "utf8"), "{bad");
});

test("--taught records teach-back only for passed exercises and keeps other fields", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  assert.strictEqual(run(cwd, "codeops-exercise", "--taught", "3").status, 1);
  solve(cwd, "foundations", "03-loops");
  run(cwd, "codeops-check", "3");
  const before = progress(cwd).tracks.foundations.exercises["03-loops"];
  assert.match(run(cwd, "codeops-exercise", "--taught", "3").out, /taught back/);
  assert.deepStrictEqual(progress(cwd).tracks.foundations.exercises["03-loops"], { ...before, taught: true });
});

test("recall add logs help deterministically and makes a pass assisted", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "4");
  const add = run(cwd, "codeops-recall", "add", "--concept", "return vs print", "--how", "escape hatch", "--exercise", "4", "--guess", "it prints it");
  assert.strictEqual(add.status, 0, add.out);
  const log = readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8");
  assert.match(log, /exercise: foundations\/04-functions/);
  assert.match(log, /interval: 1/);
  assert.match(run(cwd, "codeops-recall").out, /No recall checks due/, "the first check is due tomorrow, not today");
  solve(cwd, "foundations", "04-functions");
  assert.match(run(cwd, "codeops-check", "4").out, /04-functions assisted/);
});

test("recall add rejects bad input and writes nothing", () => {
  const cwd = learner();
  assert.strictEqual(run(cwd, "codeops-recall", "add", "--concept", "x", "--how", "magic").status, 1);
  assert.strictEqual(run(cwd, "codeops-recall", "add", "--concept", "x", "--how", "hint", "--exercise", "99").status, 1);
  assert.ok(!existsSync(join(cwd, ".codeops", "mistakes.md")));
});

test("--reset backs up the learner's attempt and restores the original", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  const file = join(cwd, "codeops-foundations", "03-loops", "total.js");
  const shipped = readFileSync(join(root, "tracks", "foundations", "exercises", "03-loops", "total.js"), "utf8");
  run(cwd, "codeops-check", "3");
  const before = readFileSync(join(cwd, ".codeops", "progress.json"), "utf8");
  writeFileSync(file, "// wrecked 1\n");
  assert.match(run(cwd, "codeops-exercise", "--reset", "3").out, /previous attempt is saved/);
  writeFileSync(file, "// wrecked 2\n");
  run(cwd, "codeops-exercise", "--reset", "3");
  assert.strictEqual(readFileSync(file, "utf8"), shipped);
  const day = new Date();
  const stamp = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
  const backups = join(cwd, ".codeops", "backups");
  assert.strictEqual(readFileSync(join(backups, `foundations-03-loops-${stamp}-1`, "total.js"), "utf8"), "// wrecked 1\n");
  assert.strictEqual(readFileSync(join(backups, `foundations-03-loops-${stamp}-2`, "total.js"), "utf8"), "// wrecked 2\n");
  const after = JSON.parse(readFileSync(join(cwd, ".codeops", "progress.json"), "utf8"));
  const was = JSON.parse(before);
  assert.strictEqual(after.tracks.foundations.exercises["03-loops"].resets, 2);
  delete after.tracks.foundations.exercises["03-loops"].resets;
  assert.deepStrictEqual(after, was, "a reset changes nothing else in progress");
});

test("an escape hatch logged after a pass still makes it assisted", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "4");
  solve(cwd, "foundations", "04-functions");
  assert.match(run(cwd, "codeops-check", "4").out, /04-functions passed/);
  const add = run(cwd, "codeops-recall", "add", "--concept", "return", "--how", "escape hatch", "--exercise", "4");
  assert.match(add.out, /now recorded as assisted/);
  assert.strictEqual(progress(cwd).tracks.foundations.exercises["04-functions"].status, "assisted");
  run(cwd, "codeops-check", "4");
  assert.strictEqual(progress(cwd).tracks.foundations.exercises["04-functions"].status, "assisted");
});

test("recall lists at most 3 due checks, oldest first", () => {
  const cwd = learner();
  mkdirSync(join(cwd, ".codeops"));
  const entries = ["2000-01-05", "2000-01-01", "2000-01-04", "2000-01-02", "2000-01-03"]
    .map((due, i) => `- concept: c${i + 1}\n  interval: 1\n  due: ${due}\n`)
    .join("");
  writeFileSync(join(cwd, ".codeops", "mistakes.md"), entries);
  const out = run(cwd, "codeops-recall").out;
  assert.deepStrictEqual([...out.matchAll(/#\d+\s+(c\d)/g)].map((m) => m[1]), ["c2", "c4", "c5"]);
  assert.match(out, /\+2 more due/);
});

test("a pass at the 30-day step retires the entry", () => {
  const cwd = learner();
  mkdirSync(join(cwd, ".codeops"));
  writeFileSync(join(cwd, ".codeops", "mistakes.md"), "- concept: loops\n  interval: 14\n  due: 2000-01-01\n");
  run(cwd, "codeops-recall", "pass", "1");
  assert.match(readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8"), /interval: 30/);
  writeFileSync(join(cwd, ".codeops", "mistakes.md"), "- concept: loops\n  interval: 30\n  due: 2000-01-01\n");
  assert.match(run(cwd, "codeops-recall", "pass", "1").out, /retired/);
  const log = readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8");
  assert.match(log, /retired: \d{4}-\d{2}-\d{2}/);
  assert.doesNotMatch(log, /due:/);
  assert.match(run(cwd, "codeops-recall").out, /No recall checks due/);
  assert.strictEqual(run(cwd, "codeops-recall", "pass", "1").status, 1);
});

test("an infinite loop can't hang the check, and nothing is left behind", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  writeFileSync(join(cwd, "codeops-foundations", "03-loops", "total.js"), "module.exports = { totalDuration() { for (;;) {} } };\n");
  const tmpBefore = readdirSync(tmpdir()).filter((d) => d.startsWith("codeops-check-")).length;
  const started = Date.now();
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const r = spawnSync(process.execPath, [bin("codeops-check"), "3"], {
    cwd,
    encoding: "utf8",
    env: { ...env, CODEOPS_TEST_TIMEOUT_MS: "1500" },
  });
  assert.ok(Date.now() - started < 15000, "the check must stop on its own");
  assert.match(r.stdout, /RESULT: foundations\/03-loops failing \(timed out\)/);
  assert.match(r.stdout, /looping forever/);
  const tmpAfter = readdirSync(tmpdir()).filter((d) => d.startsWith("codeops-check-")).length;
  assert.ok(tmpAfter <= tmpBefore, "the temp copy must be removed");
  const leftover = spawnSync("pgrep", ["-f", "codeops-check-"], { encoding: "utf8" });
  if (leftover.status !== null && process.platform !== "win32") assert.strictEqual(leftover.stdout.trim(), "", "no test process may outlive the check");
});

test("helpers find the learner's root from inside an exercise folder", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "4");
  const inside = join(cwd, "codeops-foundations", "04-functions");
  assert.strictEqual(run(inside, "codeops-recall", "add", "--concept", "return", "--how", "escape hatch", "--exercise", "4").status, 0);
  assert.ok(!existsSync(join(inside, ".codeops")), "no stray .codeops inside the exercise");
  assert.match(readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8"), /foundations\/04-functions/);
  solve(cwd, "foundations", "04-functions");
  assert.match(run(inside, "codeops-check", "4").out, /04-functions assisted/);
  run(inside, "codeops-exercise", "3");
  assert.ok(existsSync(join(cwd, "codeops-foundations", "03-loops")));
  assert.ok(!existsSync(join(inside, "codeops-foundations")), "no nested workspace");
});

test("an unknown track in progress.json fails cleanly in every helper", () => {
  const cwd = learner();
  mkdirSync(join(cwd, ".codeops"));
  writeFileSync(join(cwd, ".codeops", "progress.json"), JSON.stringify({ track: "frontend", tracks: {} }));
  for (const args of [["codeops-exercise", "--list"], ["codeops-check", "1"], ["codeops-recall", "add", "--concept", "x", "--how", "hint", "--exercise", "1"]]) {
    const r = run(cwd, ...args);
    assert.strictEqual(r.status, 1, args.join(" "));
    assert.match(r.out, /No track "frontend"/);
    assert.doesNotMatch(r.out, /TypeError|at Object/);
  }
});

test("recall can only be passed or missed once it's due", () => {
  const cwd = learner();
  run(cwd, "codeops-recall", "add", "--concept", "loops", "--how", "hint");
  const file = join(cwd, ".codeops", "mistakes.md");
  const before = readFileSync(file, "utf8");
  for (const action of ["pass", "miss"]) {
    const r = run(cwd, "codeops-recall", action, "1");
    assert.strictEqual(r.status, 1);
    assert.match(r.out, /isn't due until/);
  }
  assert.strictEqual(readFileSync(file, "utf8"), before);
});

test("failure output points at the learner's files, not the temp copy", () => {
  for (const track of ["foundations", "foundations-python"]) {
    const cwd = learner();
    run(cwd, "codeops-exercise", "--track", track);
    run(cwd, "codeops-exercise", "8");
    const out = run(cwd, "codeops-check", "8").out;
    const expected = track === "foundations" ? "count.js" : "count.py";
    assert.match(out, new RegExp(`codeops-${track}[/\\\\]08-reading-errors[/\\\\]${expected.replace(".", "\\.")}`), track);
    assert.doesNotMatch(out, /codeops-check-/, track);
    assert.doesNotMatch(out, /\/(private|var|tmp)[^\s"']*codeops-/, `${track}: no leftover temp path prefix`);
  }
});

test("switching to the Python track checks Python is installed first", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "--list");
  const empty = mkdtempSync(join(tmpdir(), "codeops-nopath-"));
  test.after(() => rmSync(empty, { recursive: true, force: true }));
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const r = spawnSync(process.execPath, [bin("codeops-exercise"), "--track", "foundations-python"], {
    cwd,
    encoding: "utf8",
    env: { ...env, PATH: empty, Path: empty },
  });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /needs Python 3\.10 or later/);
  assert.ok(!existsSync(join(cwd, ".codeops", "progress.json")) || progress(cwd).track !== "foundations-python");
});

test("codeops-repo --staged shows staged changes without running anything", () => {
  const cwd = learner();
  const git = (...args) => spawnSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", ...args], { cwd, encoding: "utf8" });
  git("init", "-q");
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ scripts: { test: "touch RAN" } }));
  assert.match(run(cwd, "codeops-repo", "--staged").out, /nothing staged yet/);
  writeFileSync(join(cwd, "sum.js"), "module.exports = (a) => a.reduce((t, n) => t + n, 0);\n");
  git("add", "sum.js");
  const out = run(cwd, "codeops-repo", "--staged").out;
  assert.match(out, /sum\.js \| 1 \+/);
  assert.match(out, /\+module\.exports = \(a\) => a\.reduce/);
  assert.ok(!existsSync(join(cwd, "RAN")));
  assert.match(git("status", "--short").stdout, /^A  sum\.js/m, "the index must be unchanged");
});

// Rewrites mistakes.md entries as if they had been logged on an earlier day.
function backdate(cwd) {
  const file = join(cwd, ".codeops", "mistakes.md");
  writeFileSync(file, readFileSync(file, "utf8").replace(/date: \S+/g, "date: 2000-01-01"));
}

test("after a reset, an unaided redo on a later day earns passed", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  run(cwd, "codeops-recall", "add", "--concept", "loops", "--how", "escape hatch", "--exercise", "3");
  solve(cwd, "foundations", "03-loops");
  assert.match(run(cwd, "codeops-check", "3").out, /03-loops assisted/);
  run(cwd, "codeops-exercise", "--reset", "3");
  solve(cwd, "foundations", "03-loops");
  assert.match(run(cwd, "codeops-check", "3").out, /03-loops assisted/, "a same-day redo doesn't count");
  backdate(cwd);
  assert.match(run(cwd, "codeops-check", "3").out, /03-loops passed/);
  const entry = progress(cwd).tracks.foundations.exercises["03-loops"];
  assert.strictEqual(entry.status, "passed");
  assert.strictEqual(entry.redone, true);
});

test("help logged on the new attempt still makes it assisted", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  run(cwd, "codeops-exercise", "--reset", "3");
  run(cwd, "codeops-recall", "add", "--concept", "loops", "--how", "escape hatch", "--exercise", "3");
  assert.match(readFileSync(join(cwd, ".codeops", "mistakes.md"), "utf8"), /attempt: 1/);
  solve(cwd, "foundations", "03-loops");
  assert.match(run(cwd, "codeops-check", "3").out, /03-loops assisted/);
});

test("the capstone can be completed after an assisted attempt", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "10");
  run(cwd, "codeops-recall", "add", "--concept", "max", "--how", "hint", "--exercise", "10");
  solve(cwd, "foundations", "10-capstone");
  assert.match(run(cwd, "codeops-check", "10").out, /10-capstone assisted/);
  run(cwd, "codeops-exercise", "--reset", "10");
  backdate(cwd);
  solve(cwd, "foundations", "10-capstone");
  assert.match(run(cwd, "codeops-check", "10").out, /10-capstone passed/);
});

// Runs verify-exercises against a copy of one real track with a deliberate mistake in it.
function verifyFixture(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "codeops-tracks-"));
  test.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(join(root, "tracks", "foundations"), join(dir, "foundations"), { recursive: true });
  mutate(join(dir, "foundations"));
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  return spawnSync(process.execPath, [join(root, "scripts", "verify-exercises.mjs")], {
    encoding: "utf8",
    env: { ...env, CODEOPS_TRACKS_DIR: dir },
  });
}

test("verify-exercises catches structural mistakes in a track", () => {
  const manifest = (dir) => join(dir, "track.json");
  const editManifest = (change) => (dir) => {
    const m = JSON.parse(readFileSync(manifest(dir), "utf8"));
    change(m);
    writeFileSync(manifest(dir), JSON.stringify(m));
  };
  const cases = [
    [editManifest((m) => (m.colour = "blue")), /unknown key "colour"/],
    [editManifest((m) => (m.capstone = "99-nope")), /capstone "99-nope" isn't one of the exercises/],
    [editManifest((m) => (m.next = "nowhere")), /next track "nowhere" doesn't exist/],
    [(d) => rmSync(join(d, "exercises", "05-arrays"), { recursive: true }), /gap or duplicate at 06-objects/],
    [(d) => rmSync(join(d, "exercises", "03-loops", "README.md")), /03-loops: no README\.md/],
    [(d) => rmSync(join(d, "exercises", "03-loops", "total.test.js")), /03-loops: no test file/],
    [(d) => rmSync(join(d, "solutions", "03-loops", "NOTES.md")), /no solutions\/03-loops\/NOTES\.md/],
    [(d) => mkdirSync(join(d, "solutions", "11-extra")), /solutions\/11-extra has no matching exercise/],
  ];
  for (const [mutate, expected] of cases) {
    const r = verifyFixture(mutate);
    assert.strictEqual(r.status, 1, String(expected));
    assert.match(r.stderr, expected);
  }
});

test("the list says what comes after the capstone", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "10");
  assert.match(run(cwd, "codeops-exercise", "--list").out, /Next exercise: 01-values-and-types/);
  run(cwd, "codeops-recall", "add", "--concept", "max", "--how", "hint", "--exercise", "10");
  solve(cwd, "foundations", "10-capstone");
  run(cwd, "codeops-check", "10");
  const p = progress(cwd);
  for (const id of readdirSync(join(root, "tracks", "foundations", "exercises"))) {
    p.tracks.foundations.exercises[id] ??= { status: "passed", attempts: 1 };
  }
  writeFileSync(join(cwd, ".codeops", "progress.json"), JSON.stringify(p));
  assert.match(run(cwd, "codeops-exercise", "--list").out, /Capstone assisted: redo it unaided/);
  p.tracks.foundations.exercises["10-capstone"].status = "passed";
  writeFileSync(join(cwd, ".codeops", "progress.json"), JSON.stringify(p));
  assert.match(run(cwd, "codeops-exercise", "--list").out, /Track complete\./);
});

test("exiting early can't fake a pass", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "3");
  writeFileSync(join(cwd, "codeops-foundations", "03-loops", "total.js"), "process.exit(0);\n");
  const r = run(cwd, "codeops-check", "3");
  assert.match(r.out, /03-loops failing/);
  assert.match(r.out, /doesn't count as passed/);

  const py = learner();
  run(py, "codeops-exercise", "--track", "foundations-python");
  run(py, "codeops-exercise", "3");
  writeFileSync(join(py, "codeops-foundations-python", "03-loops", "total.py"), "import os\nos._exit(0)\n");
  assert.match(run(py, "codeops-check", "3").out, /03-loops failing/);
});

test("a learner file named unittest.py can't replace the test runner", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "--track", "foundations-python");
  run(cwd, "codeops-exercise", "3");
  writeFileSync(join(cwd, "codeops-foundations-python", "03-loops", "unittest.py"), "");
  const r = run(cwd, "codeops-check", "3");
  assert.match(r.out, /03-loops failing/);
  assert.match(r.out, /unittest\.py in your folder has the same name/);
});

test("a track name can't point outside the tracks folder", () => {
  const cwd = learner();
  for (const name of ["../../etc", "foundations/../foundations", "Foundations", "foundations/"]) {
    const r = run(cwd, "codeops-exercise", "--track", name);
    assert.strictEqual(r.status, 1, name);
  }
  mkdirSync(join(cwd, ".codeops"), { recursive: true });
  writeFileSync(join(cwd, ".codeops", "progress.json"), JSON.stringify({ track: "../../tracks/foundations", tracks: {} }));
  assert.strictEqual(run(cwd, "codeops-exercise", "1").status, 1);
});

test("a test that prints endlessly is stopped, not a crash", () => {
  const cwd = learner();
  run(cwd, "codeops-exercise", "--track", "foundations-python");
  run(cwd, "codeops-exercise", "3");
  writeFileSync(
    join(cwd, "codeops-foundations-python", "03-loops", "total.py"),
    'import sys\ndef total_duration(songs):\n    while True:\n        sys.stdout.write("x" * 100000)\n',
  );
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const r = spawnSync(process.execPath, [bin("codeops-check"), "3"], { cwd, encoding: "utf8", env: { ...env, CODEOPS_TEST_TIMEOUT_MS: "2000" } });
  assert.match(r.stdout, /RESULT: foundations-python\/03-loops failing \(timed out\)/);
});
