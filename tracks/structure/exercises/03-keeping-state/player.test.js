const test = require("node:test");
const assert = require("node:assert");
const { Player } = require("./player");

const INTRO = { title: "Intro", artist: "Nina", seconds: 60 };
const MIDDLE = { title: "Middle", artist: "Sam", seconds: 150 };
const OUTRO = { title: "Outro", artist: "Sam", seconds: 240 };

test("starts on the first song", () => {
  assert.deepStrictEqual(new Player([INTRO, MIDDLE, OUTRO]).current(), INTRO);
});

test("next moves through the songs in order", () => {
  const player = new Player([INTRO, MIDDLE, OUTRO]);
  assert.deepStrictEqual(player.next(), MIDDLE);
  assert.deepStrictEqual(player.next(), OUTRO);
});

test("remembers where it is", () => {
  const player = new Player([INTRO, MIDDLE, OUTRO]);
  player.next();
  assert.deepStrictEqual(player.current(), MIDDLE);
});

test("works with any number of songs, and leaves the list alone", () => {
  const songs = [INTRO, MIDDLE];
  const player = new Player(songs);
  player.next();
  assert.deepStrictEqual(songs, [INTRO, MIDDLE]);
  assert.deepStrictEqual(player.next(), INTRO);
});

test("goes back to the first song after the last", () => {
  const player = new Player([INTRO, MIDDLE, OUTRO]);
  player.next();
  player.next();
  assert.deepStrictEqual(player.next(), INTRO);
});
