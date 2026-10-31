const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { savePlaylist, loadPlaylist } = require("./store");

const tempFile = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), "codeops-store-")), "playlist.json");

test("a saved playlist loads back the same", () => {
  const file = tempFile();
  const playlist = [
    { title: "Intro", artist: "Nina", seconds: 60 },
    { title: "Outro", artist: "Sam", seconds: 240 },
  ];
  savePlaylist(file, playlist);
  assert.deepStrictEqual(loadPlaylist(file), playlist);
});

test("an empty playlist round-trips too", () => {
  const file = tempFile();
  savePlaylist(file, []);
  assert.deepStrictEqual(loadPlaylist(file), []);
});
