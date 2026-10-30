function totalDuration(songs) {
  let total = 0;
  for (let i = 0; i < songs.length; i++) {
    total += songs[i].seconds;
  }
  return total;
}

module.exports = { totalDuration };
