const test = require("node:test");
const assert = require("node:assert");
const { songTitles } = require("./titles");

test("lists every title in order", () => {
  const playlist = [
    { title: "Intro", seconds: 60 },
    { title: "Long Road", seconds: 240 },
    { title: "Outro", seconds: 30 },
  ];
  assert.deepStrictEqual(songTitles(playlist), ["Intro", "Long Road", "Outro"]);
});

test("an empty playlist has no titles", () => {
  assert.deepStrictEqual(songTitles([]), []);
});
