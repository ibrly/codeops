const { formatTime } = require("./helpers");

// "Outro (4:00)": a song's title with its length.
function describeSong(song) {
  return `${song.title} (${formatTime(song.seconds)})`;
}

module.exports = { describeSong };
