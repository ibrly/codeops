const test = require("node:test");
const assert = require("node:assert");
const { describeSong } = require("./playlist");

test("describes a song with its length", () => {
  assert.strictEqual(describeSong({ title: "Outro", seconds: 240 }), "Outro (4:00)");
});

test("pads the seconds", () => {
  assert.strictEqual(describeSong({ title: "Intro", seconds: 65 }), "Intro (1:05)");
});
