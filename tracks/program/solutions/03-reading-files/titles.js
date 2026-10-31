const fs = require("node:fs");

function readTitles(path) {
  const text = fs.readFileSync(path, "utf8");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

module.exports = { readTitles };
