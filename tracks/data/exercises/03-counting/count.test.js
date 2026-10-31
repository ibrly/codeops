const test = require("node:test");
const assert = require("node:assert");
const { countByArtist } = require("./count");

test("counts songs per artist", () => {
  const playlist = [
    { title: "Blue", artist: "Nina" },
    { title: "Red", artist: "Sam" },
    { title: "Green", artist: "Nina" },
  ];
  assert.deepStrictEqual(countByArtist(playlist), { Nina: 2, Sam: 1 });
});

test("an empty playlist has no counts", () => {
  assert.deepStrictEqual(countByArtist([]), {});
});
