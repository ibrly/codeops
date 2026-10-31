function addSong(playlist, song) {
  playlist.push(song);
  return [...playlist];
}

module.exports = { addSong };
