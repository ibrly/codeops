const { parseSong } = require("./parse");

function loadSongs(lines) {
  const good = lines.filter((line) => line.includes(","));
  let songs = [];
  try {
    songs = good.map(parseSong);
  } catch {}
  return { songs, skipped: lines.length - good.length };
}

module.exports = { loadSongs };
