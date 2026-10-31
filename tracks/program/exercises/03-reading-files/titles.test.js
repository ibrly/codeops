const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { readTitles } = require("./titles");

function fileWith(text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codeops-titles-"));
  const file = path.join(dir, "titles.txt");
  fs.writeFileSync(file, text);
  return file;
}

test("reads one title per line", () => {
  assert.deepStrictEqual(readTitles(fileWith("Intro\nLong Road\nOutro\n")), ["Intro", "Long Road", "Outro"]);
});

test("keeps accented titles and skips lines of only spaces", () => {
  assert.deepStrictEqual(readTitles(fileWith("Café\n   \nNiño\n")), ["Café", "Niño"]);
});

test("skips blank lines", () => {
  assert.deepStrictEqual(readTitles(fileWith("Intro\n\nOutro\n\n")), ["Intro", "Outro"]);
});
