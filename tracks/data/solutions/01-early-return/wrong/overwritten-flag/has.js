function hasArtist(playlist, artist) {
  let found = false;
  for (const song of playlist) {
    if (song.artist === artist) {
      found = true;
    } else {
      found = false;
    }
  }
  return found;
}

module.exports = { hasArtist };
