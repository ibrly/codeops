const test = require("node:test");
const assert = require("node:assert");
const { mergePlaylists } = require("./merge");

const blue = { title: "Blue", artist: "Nina" };
const red = { title: "Red", artist: "Sam" };
const gold = { title: "Gold", artist: "Ade" };

test("keeps songs from a, then from b, in order", () => {
  assert.deepStrictEqual(mergePlaylists([blue, red], [gold]), [blue, red, gold]);
});

test("a song in both playlists appears once", () => {
  assert.deepStrictEqual(mergePlaylists([blue, red], [{ title: "Red", artist: "Sam" }, gold]), [blue, red, gold]);
});

test("same title and artist is a duplicate, even if other details differ", () => {
  const blueLive = { title: "Blue", artist: "Nina", seconds: 260 };
  const blueStudio = { artist: "Nina", title: "Blue", seconds: 240 };
  assert.deepStrictEqual(mergePlaylists([blueLive], [blueStudio]), [blueLive]);
});

test("same title by a different artist is a different song", () => {
  const coverVersion = { title: "Blue", artist: "Sam" };
  assert.deepStrictEqual(mergePlaylists([blue], [coverVersion]), [blue, coverVersion]);
});

test("duplicates inside one playlist are removed too", () => {
  assert.deepStrictEqual(mergePlaylists([blue, { ...blue }], []), [blue]);
});

test("the inputs are left unchanged", () => {
  const a = [blue];
  const b = [red];
  mergePlaylists(a, b);
  assert.deepStrictEqual(a, [blue]);
  assert.deepStrictEqual(b, [red]);
});

test("works with empty playlists", () => {
  assert.deepStrictEqual(mergePlaylists([], []), []);
  assert.deepStrictEqual(mergePlaylists([], [gold]), [gold]);
});
