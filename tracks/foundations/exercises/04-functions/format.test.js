const test = require("node:test");
const assert = require("node:assert");
const { formatDuration } = require("./format");

test("formats minutes and seconds", () => {
  assert.strictEqual(formatDuration(185), "3:05");
});

test("pads single-digit seconds", () => {
  assert.strictEqual(formatDuration(61), "1:01");
});

test("can be used to build a label", () => {
  assert.strictEqual("Length: " + formatDuration(240), "Length: 4:00");
});
