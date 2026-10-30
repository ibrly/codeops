// Gives back just the song titles, for showing a compact track list.
function songTitles(playlist) {
  return playlist.forEach((song) => song.title);
}

module.exports = { songTitles };
