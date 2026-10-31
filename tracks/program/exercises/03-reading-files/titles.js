const fs = require("node:fs");

// Reads a file with one song title per line.
function readTitles(path) {
  const text = fs.readFileSync(path);
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

module.exports = { readTitles };
