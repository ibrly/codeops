const test = require("node:test");
const assert = require("node:assert");
const { searchByArtist } = require("./search");

test("finds songs by an artist", () => {
  const playlist = [
    { title: "Blue", artist: "Nina" },
    { title: "Red", artist: "Sam" },
  ];
  assert.deepStrictEqual(searchByArtist(playlist, "Nina"), [{ title: "Blue", artist: "Nina" }]);
});
