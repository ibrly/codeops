function hasArtist(playlist, artist) {
  for (const song of playlist) {
    if (song.artist === artist) {
      return true;
    }
  }
  return false;
}

module.exports = { hasArtist };
