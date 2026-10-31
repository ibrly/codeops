// Gives back a new playlist with one more song, without changing the original.
function addSong(playlist, song) {
  const copy = playlist;
  copy.push(song);
  return copy;
}

module.exports = { addSong };
