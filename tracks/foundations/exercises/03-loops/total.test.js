const test = require("node:test");
const assert = require("node:assert");
const { totalDuration } = require("./total");

const playlist = [
  { title: "Intro", seconds: 60 },
  { title: "Long Road", seconds: 240 },
  { title: "Outro", seconds: 30 },
];

test("adds up every song", () => {
  assert.strictEqual(totalDuration(playlist), 330);
});

test("works for a single song", () => {
  assert.strictEqual(totalDuration([{ title: "Solo", seconds: 200 }]), 200);
});
