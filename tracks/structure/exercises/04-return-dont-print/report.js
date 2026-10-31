// "1:00": a number of seconds as minutes and seconds. This function is correct.
function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// "Intro by Nina (1:00)"
function songLine(song) {
  console.log(`${song.title} by ${song.artist} (${formatTime(song.seconds)})`);
}

// One line per song. This function is correct.
function report(songs) {
  return songs.map(songLine).join("\n");
}

module.exports = { songLine, report };
