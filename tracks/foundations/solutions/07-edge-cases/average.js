function averageDuration(songs) {
  if (songs.length === 0) {
    return 0;
  }
  let total = 0;
  for (const song of songs) {
    total += song.seconds;
  }
  return total / songs.length;
}

module.exports = { averageDuration };
