const test = require("node:test");
const assert = require("node:assert");
const { addSong } = require("./add");

test("the new playlist has the song at the end", () => {
  const original = [{ title: "Intro" }];
  const result = addSong(original, { title: "Outro" });
  assert.deepStrictEqual(result, [{ title: "Intro" }, { title: "Outro" }]);
});

test("the original playlist is unchanged", () => {
  const original = [{ title: "Intro" }];
  addSong(original, { title: "Outro" });
  assert.deepStrictEqual(original, [{ title: "Intro" }]);
});

test("the result is a different array from the original", () => {
  const original = [];
  assert.notStrictEqual(addSong(original, { title: "Solo" }), original);
});
