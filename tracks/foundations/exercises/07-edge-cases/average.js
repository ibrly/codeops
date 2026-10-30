// The average length of a song in the playlist, in seconds.
function averageDuration(songs) {
  let total = 0;
  for (const song of songs) {
    total += song.seconds;
  }
  return total / songs.length;
}

module.exports = { averageDuration };
