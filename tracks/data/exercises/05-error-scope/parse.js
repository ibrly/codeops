// Turns "Title,seconds" into a song. Throws if the line isn't in that format.
// This file is correct; you don't need to change it.
function parseSong(line) {
  const [title, seconds] = line.split(",");
  if (!title || seconds === undefined || Number.isNaN(Number(seconds))) {
    throw new Error(`Can't read song: "${line}"`);
  }
  return { title, seconds: Number(seconds) };
}

module.exports = { parseSong };
