const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { Playlist } = require("./playlist");

const script = path.join(__dirname, "playlist.js");
const INTRO = { title: "Intro", artist: "Nina", seconds: 60 };
const MIDDLE = { title: "Middle", artist: "Sam", seconds: 150 };
const OUTRO = { title: "Outro", artist: "Sam", seconds: 240 };

const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "codeops-playlist-"));
const run = (dir, ...args) => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: "utf8" });

test("totals, finds the longest song, and sums up", () => {
  const p = new Playlist();
  p.add(INTRO);
  p.add(MIDDLE);
  p.add(OUTRO);
  assert.strictEqual(p.totalSeconds(), 450);
  assert.strictEqual(p.longest().title, "Outro");
  assert.strictEqual(p.summary(), "3 songs, 7:30 total, longest: Outro");
});

test("keeps the first song when two tie for longest", () => {
  const p = new Playlist();
  p.add({ title: "Blue", artist: "Nina", seconds: 100 });
  p.add({ title: "Red", artist: "Sam", seconds: 100 });
  assert.strictEqual(p.longest().title, "Blue");
});

test("an empty playlist", () => {
  const p = new Playlist();
  assert.deepStrictEqual(p.songs, []);
  assert.strictEqual(p.longest(), null);
  assert.strictEqual(p.summary(), "0 songs, 0:00 total");
});

test("two playlists don't share songs", () => {
  const a = new Playlist();
  const b = new Playlist();
  a.add(INTRO);
  assert.deepStrictEqual(b.songs, []);
  assert.strictEqual(b.totalSeconds(), 0);
});

test("loading it with require runs nothing", () => {
  const dir = tempDir();
  const file = path.join(dir, "songs.json");
  const r = spawnSync(process.execPath, ["-e", `require(${JSON.stringify(script)})`, file, "add", "X", "Y", "60"], { cwd: dir, encoding: "utf8" });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.strictEqual(r.stdout, "");
  assert.ok(!fs.existsSync(file), "requiring playlist.js shouldn't create a file");
});

test("adds songs to a file and sums it up", () => {
  const dir = tempDir();
  const file = path.join(dir, "songs.json");
  assert.strictEqual(run(dir, file).stdout.trim(), "0 songs, 0:00 total", "a file that doesn't exist yet is an empty playlist");
  assert.strictEqual(run(dir, file, "add", "Intro", "Nina", "60").stdout.trim(), "Added Intro");
  run(dir, file, "add", "Outro", "Sam", "240");
  assert.strictEqual(run(dir, file).stdout.trim(), "2 songs, 5:00 total, longest: Outro");
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(file, "utf8")), [
    { title: "Intro", artist: "Nina", seconds: 60 },
    { title: "Outro", artist: "Sam", seconds: 240 },
  ]);
});

test("seconds that aren't a whole number are an error, not a crash", () => {
  for (const bad of ["abc", "60.5", "-5", "30abc"]) {
    const dir = tempDir();
    const file = path.join(dir, "songs.json");
    const r = run(dir, file, "add", "Intro", "Nina", bad);
    assert.strictEqual(r.status, 1, `seconds "${bad}" should be refused`);
    assert.match(r.stderr, /^Seconds must be a whole number/m);
    assert.doesNotMatch(r.stderr, /^\s+at /m, "print a clear message, not a stack trace");
    assert.strictEqual(r.stdout, "");
    assert.ok(!fs.existsSync(file), "don't save anything when the seconds are wrong");
  }
});
