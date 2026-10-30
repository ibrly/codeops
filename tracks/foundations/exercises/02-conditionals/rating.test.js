const test = require("node:test");
const assert = require("node:assert");
const { ratingLabel } = require("./rating");

test("5 stars is a favorite", () => {
  assert.strictEqual(ratingLabel(5), "favorite");
});

test("3 and 4 stars are good", () => {
  assert.strictEqual(ratingLabel(3), "good");
  assert.strictEqual(ratingLabel(4), "good");
});

test("1 and 2 stars are skips", () => {
  assert.strictEqual(ratingLabel(1), "skip");
  assert.strictEqual(ratingLabel(2), "skip");
});
