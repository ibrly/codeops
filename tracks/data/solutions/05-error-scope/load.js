const { parseSong } = require("./parse");

function loadSongs(lines) {
  const songs = [];
  let skipped = 0;
  for (const line of lines) {
    try {
      songs.push(parseSong(line));
    } catch {
      skipped += 1;
    }
  }
  return { songs, skipped };
}

module.exports = { loadSongs };
