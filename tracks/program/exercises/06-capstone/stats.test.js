const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const script = path.join(__dirname, "stats.js");

function runWith(text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codeops-stats-"));
  const file = path.join(dir, "songs.txt");
  if (text !== null) fs.writeFileSync(file, text);
  return spawnSync(process.execPath, [script, file], { encoding: "utf8" });
}

test("prints the count, total, and longest song", () => {
  const r = runWith("Intro,60\nMiddle,150\nOutro,240\n");
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), "3 songs, 7:30 total, longest: Outro");
});

test("ignores blank lines", () => {
  const r = runWith("\nIntro,60\n\nOutro,5\n");
  assert.strictEqual(r.stdout.trim(), "2 songs, 1:05 total, longest: Intro");
});

test("keeps the first song when two tie for longest", () => {
  assert.strictEqual(runWith("Blue,100\nRed,100\n").stdout.trim(), "2 songs, 3:20 total, longest: Blue");
});

test("a missing file is an error, not a crash", () => {
  const r = runWith(null);
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /^Can't read .*songs\.txt/m);
  assert.strictEqual(r.stdout, "");
});
