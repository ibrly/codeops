const test = require("node:test");
const assert = require("node:assert");
const { parseSeconds } = require("./duration");

test("turns text into a number", () => {
  assert.strictEqual(parseSeconds("185"), 185);
});

test("the result can be used in math", () => {
  assert.strictEqual(parseSeconds("185") + parseSeconds("60"), 245);
});
