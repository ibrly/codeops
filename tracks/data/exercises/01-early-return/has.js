// Is there at least one song by this artist in the playlist?
function hasArtist(playlist, artist) {
  for (const song of playlist) {
    if (song.artist === artist) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

module.exports = { hasArtist };
