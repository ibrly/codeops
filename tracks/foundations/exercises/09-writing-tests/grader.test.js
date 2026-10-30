// Grades the learner's my.test.js: it must pass on the real search.js
// and fail on a case-sensitive copy. You don't need to edit this file.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const learnerTest = path.join(__dirname, "my.test.js");

const caseSensitive = `function searchByArtist(playlist, artist) {
  return playlist.filter((song) => song.artist === artist);
}
module.exports = { searchByArtist };
`;

function runLearnerTestWith(searchSource) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codeops-grader-"));
  fs.copyFileSync(learnerTest, path.join(dir, "my.test.js"));
  fs.writeFileSync(path.join(dir, "search.js"), searchSource);
  // Drop NODE_TEST_CONTEXT so the nested run reports its own pass/fail instead of deferring to this one.
  const { NODE_TEST_CONTEXT, ...env } = process.env;
  const result = spawnSync(process.execPath, ["--test", "my.test.js"], { cwd: dir, encoding: "utf8", env });
  fs.rmSync(dir, { recursive: true, force: true });
  return result.status;
}

test("my.test.js exists", () => {
  assert.ok(fs.existsSync(learnerTest), "Create a file called my.test.js in this folder.");
});

test("your test passes on the working search.js", () => {
  const source = fs.readFileSync(path.join(__dirname, "search.js"), "utf8");
  assert.strictEqual(runLearnerTestWith(source), 0, "Your test fails even on the working code. Check what it asserts.");
});

test("your test catches the case-sensitivity bug", () => {
  assert.notStrictEqual(
    runLearnerTestWith(caseSensitive),
    0,
    "Your test still passes when search is case-sensitive, so it wouldn't catch that bug.",
  );
});
