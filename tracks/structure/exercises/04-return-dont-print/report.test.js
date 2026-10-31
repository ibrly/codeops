const test = require("node:test");
const assert = require("node:assert");
const { songLine, report } = require("./report");

const INTRO = { title: "Intro", artist: "Nina", seconds: 60 };
const OUTRO = { title: "Outro", artist: "Sam", seconds: 240 };

test("describes one song", () => {
  assert.strictEqual(songLine(INTRO), "Intro by Nina (1:00)");
});

test("reports one line per song", () => {
  assert.strictEqual(report([INTRO, OUTRO]), "Intro by Nina (1:00)\nOutro by Sam (4:00)");
});

test("doesn't print anything", (t) => {
  const log = t.mock.method(console, "log", () => {});
  songLine(INTRO);
  report([INTRO, OUTRO]);
  assert.strictEqual(log.mock.callCount(), 0, "give the text back with return; let the caller print it");
});
