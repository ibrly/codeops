const test = require("node:test");
const assert = require("node:assert");
const { longSongs } = require("./long");

const playlist = [
  { title: "Intro", seconds: 60 },
  { title: "Epic", seconds: 420 },
  { title: "Exactly", seconds: 300 },
];

test("gives back only the titles of long songs", () => {
  assert.deepStrictEqual(longSongs(playlist, 300), ["Epic"]);
});

test("a song exactly at the limit isn't long", () => {
  assert.deepStrictEqual(longSongs([{ title: "Exactly", seconds: 300 }], 300), []);
});

test("an empty playlist has no long songs", () => {
  assert.deepStrictEqual(longSongs([], 300), []);
});
