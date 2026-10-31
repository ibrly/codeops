const test = require("node:test");
const assert = require("node:assert");
const { Playlist } = require("./playlist");

const INTRO = { title: "Intro", artist: "Nina", seconds: 60 };
const MIDDLE = { title: "Middle", artist: "Sam", seconds: 150 };

test("adds songs and totals their length", () => {
  const p = new Playlist("Morning Run");
  p.add(INTRO);
  p.add(MIDDLE);
  assert.strictEqual(p.totalSeconds(), 210);
});

test("sums up a playlist", () => {
  const p = new Playlist("Morning Run");
  p.add(INTRO);
  p.add(MIDDLE);
  assert.strictEqual(p.summary(), "Morning Run: 2 songs, 3:30");
});

test("sums up an empty playlist", () => {
  assert.strictEqual(new Playlist("Morning Run").summary(), "Morning Run: 0 songs, 0:00");
});
