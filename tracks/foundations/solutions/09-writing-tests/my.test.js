const test = require("node:test");
const assert = require("node:assert");
const { searchByArtist } = require("./search");

test("finds songs regardless of letter case", () => {
  const playlist = [
    { title: "Blue", artist: "Nina" },
    { title: "Red", artist: "Sam" },
  ];
  assert.deepStrictEqual(searchByArtist(playlist, "nina"), [{ title: "Blue", artist: "Nina" }]);
});
