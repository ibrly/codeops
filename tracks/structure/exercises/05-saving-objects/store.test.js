const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { Playlist } = require("./playlist");
const { savePlaylist, loadPlaylist } = require("./store");

const INTRO = { title: "Intro", artist: "Nina", seconds: 60 };
const MIDDLE = { title: "Middle", artist: "Sam", seconds: 150 };
const OUTRO = { title: "Outro", artist: "Sam", seconds: 240 };

function savedAndLoaded() {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "codeops-store-")), "playlist.json");
  const playlist = new Playlist("Morning Run");
  playlist.add(INTRO);
  playlist.add(MIDDLE);
  savePlaylist(file, playlist);
  return loadPlaylist(file);
}

test("loads back the same name and songs", () => {
  const loaded = savedAndLoaded();
  assert.strictEqual(loaded.name, "Morning Run");
  assert.deepStrictEqual(loaded.songs, [INTRO, MIDDLE]);
});

test("a loaded playlist's methods work", () => {
  assert.strictEqual(savedAndLoaded().totalSeconds(), 210);
});

test("a loaded playlist is a real Playlist you can keep adding to", () => {
  const loaded = savedAndLoaded();
  assert.ok(loaded instanceof Playlist, "loadPlaylist should give back a Playlist");
  loaded.add(OUTRO);
  assert.strictEqual(loaded.totalSeconds(), 450);
});
