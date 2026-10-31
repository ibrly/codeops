const test = require("node:test");
const assert = require("node:assert");
const { hasArtist } = require("./has");

const playlist = [
  { title: "Blue", artist: "Nina" },
  { title: "Red", artist: "Sam" },
  { title: "Gold", artist: "Ade" },
];

test("finds an artist on the first song", () => {
  assert.strictEqual(hasArtist(playlist, "Nina"), true);
});

test("finds an artist further down the playlist", () => {
  assert.strictEqual(hasArtist(playlist, "Sam"), true);
  assert.strictEqual(hasArtist(playlist, "Ade"), true);
});

test("says no for an artist who isn't there", () => {
  assert.strictEqual(hasArtist(playlist, "Kai"), false);
});

test("says no for an empty playlist", () => {
  assert.strictEqual(hasArtist([], "Nina"), false);
});
