function countByArtist(playlist) {
  const counts = {};
  for (const song of playlist) {
    counts[song.artist] = (counts[song.artist] || 0) + 1;
  }
  return counts;
}

module.exports = { countByArtist };
