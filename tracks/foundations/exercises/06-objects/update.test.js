const test = require("node:test");
const assert = require("node:assert");
const { updateField } = require("./update");

test("updates the title", () => {
  const song = { title: "Old Name", artist: "Nina", seconds: 200 };
  assert.strictEqual(updateField(song, "title", "New Name").title, "New Name");
});

test("updates the artist", () => {
  const song = { title: "Song", artist: "Nina", seconds: 200 };
  assert.strictEqual(updateField(song, "artist", "Sam").artist, "Sam");
});

test("doesn't add a stray property", () => {
  const song = { title: "Song", artist: "Nina", seconds: 200 };
  assert.deepStrictEqual(Object.keys(updateField(song, "seconds", 180)), ["title", "artist", "seconds"]);
});
