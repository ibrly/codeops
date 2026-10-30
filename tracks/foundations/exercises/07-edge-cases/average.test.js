const test = require("node:test");
const assert = require("node:assert");
const { averageDuration } = require("./average");

test("averages the song lengths", () => {
  const playlist = [{ seconds: 100 }, { seconds: 200 }, { seconds: 300 }];
  assert.strictEqual(averageDuration(playlist), 200);
});

test("an empty playlist averages to 0", () => {
  assert.strictEqual(averageDuration([]), 0);
});
