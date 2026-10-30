const test = require("node:test");
const assert = require("node:assert");
const { countSongs } = require("./count");

test("counts the songs", () => {
  assert.strictEqual(countSongs([{ title: "A" }, { title: "B" }]), 2);
});

test("an empty playlist has 0 songs", () => {
  assert.strictEqual(countSongs([]), 0);
});
