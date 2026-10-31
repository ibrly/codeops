function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function songLine(song) {
  const line = `${song.title} by ${song.artist} (${formatTime(song.seconds)})`;
  console.log(line);
  return line;
}

function report(songs) {
  return songs.map(songLine).join("\n");
}

module.exports = { songLine, report };
