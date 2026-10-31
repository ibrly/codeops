const test = require("node:test");
const assert = require("node:assert");
const { loadSongs } = require("./load");

test("keeps every good line and counts the bad one", () => {
  const result = loadSongs(["Intro,60", "oops", "Outro,30"]);
  assert.deepStrictEqual(result.songs, [
    { title: "Intro", seconds: 60 },
    { title: "Outro", seconds: 30 },
  ]);
  assert.strictEqual(result.skipped, 1);
});

test("a line with a comma can still be bad", () => {
  const result = loadSongs(["Intro,60", "Oops,abc", "Outro,30"]);
  assert.strictEqual(result.songs.length, 2);
  assert.strictEqual(result.skipped, 1);
});

test("counts every bad line", () => {
  assert.strictEqual(loadSongs(["bad", "worse", "Ok,10"]).skipped, 2);
});

test("all good lines means nothing skipped", () => {
  assert.deepStrictEqual(loadSongs(["A,1"]), { songs: [{ title: "A", seconds: 1 }], skipped: 0 });
});
