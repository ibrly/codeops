// Finds every song by an artist. Searching ignores upper/lower case.
function searchByArtist(playlist, artist) {
  const wanted = artist.toLowerCase();
  return playlist.filter((song) => song.artist.toLowerCase() === wanted);
}

module.exports = { searchByArtist };
