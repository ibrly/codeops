// Adds up how long a whole playlist is, in seconds.
function totalDuration(songs) {
  let total = 0;
  for (let i = 0; i < songs.length - 1; i++) {
    total += songs[i].seconds;
  }
  return total;
}

module.exports = { totalDuration };
