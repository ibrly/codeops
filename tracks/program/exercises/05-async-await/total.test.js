const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { totalSeconds } = require("./total");

function saved(playlist) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "codeops-total-")), "playlist.json");
  fs.writeFileSync(file, JSON.stringify(playlist));
  return file;
}

test("adds up the songs in a saved playlist", async () => {
  assert.strictEqual(await totalSeconds(saved([{ seconds: 60 }, { seconds: 30 }])), 90);
});

test("running it as a program prints the total", () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, "total.js"), saved([{ seconds: 60 }, { seconds: 30 }])], { encoding: "utf8" });
  assert.strictEqual(r.stdout.trim(), "90");
});

test("an empty saved playlist totals 0", async () => {
  assert.strictEqual(await totalSeconds(saved([])), 0);
});
