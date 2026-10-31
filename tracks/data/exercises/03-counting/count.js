// How many songs each artist has in the playlist, e.g. { Nina: 2, Sam: 1 }.
function countByArtist(playlist) {
  const counts = {};
  for (const song of playlist) {
    counts[song.artist] += 1;
  }
  return counts;
}

module.exports = { countByArtist };
