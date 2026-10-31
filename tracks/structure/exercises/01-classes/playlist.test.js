const test = require("node:test");
const assert = require("node:assert");
const { Playlist } = require("./playlist");

const INTRO = { title: "Intro", artist: "Nina", seconds: 60 };

test("a new playlist has its name", () => {
  assert.strictEqual(new Playlist("Morning Run").name, "Morning Run");
  assert.strictEqual(new Playlist("Evening Walk").name, "Evening Walk");
});

test("a new playlist starts with no songs", () => {
  assert.deepStrictEqual(new Playlist("Morning Run").songs, []);
});

test("each playlist has its own songs", () => {
  const a = new Playlist("Morning Run");
  const b = new Playlist("Evening Walk");
  a.songs.push(INTRO);
  assert.deepStrictEqual(b.songs, []);
});
