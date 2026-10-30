const test = require("node:test");
const assert = require("node:assert");
const { longestSong } = require("./longest");

const intro = { title: "Intro", seconds: 60 };
const epic = { title: "Epic", seconds: 420 };
const outro = { title: "Outro", seconds: 30 };

test("finds the longest song", () => {
  assert.strictEqual(longestSong([intro, epic, outro]), epic);
});

test("works when the longest song is last", () => {
  assert.strictEqual(longestSong([intro, outro, epic]), epic);
});

test("picks the first song when two tie", () => {
  const twin = { title: "Twin", seconds: 420 };
  assert.strictEqual(longestSong([epic, twin]), epic);
});

test("works with a single song", () => {
  assert.strictEqual(longestSong([outro]), outro);
});

test("an empty playlist gives null", () => {
  assert.strictEqual(longestSong([]), null);
});
