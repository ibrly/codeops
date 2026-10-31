const { parseSong } = require("./parse");

// Reads a playlist file's lines. Bad lines are skipped and counted, not fatal.
function loadSongs(lines) {
  const songs = [];
  let skipped = 0;
  try {
    for (const line of lines) {
      songs.push(parseSong(line));
    }
  } catch {
    skipped += 1;
  }
  return { songs, skipped };
}

module.exports = { loadSongs };
