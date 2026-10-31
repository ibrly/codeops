const test = require("node:test");
const assert = require("node:assert");
const { getFile } = require("./args");

test("gives back the file typed after the script", () => {
  assert.strictEqual(getFile(["/usr/bin/node", "/home/me/stats.js", "songs.txt"]), "songs.txt");
});

test("gives back null when no file was typed", () => {
  assert.strictEqual(getFile(["/usr/bin/node", "/home/me/stats.js"]), null);
});
