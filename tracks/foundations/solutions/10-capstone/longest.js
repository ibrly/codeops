function longestSong(playlist) {
  if (playlist.length === 0) {
    return null;
  }
  let longest = playlist[0];
  for (const song of playlist) {
    if (song.seconds > longest.seconds) {
      longest = song;
    }
  }
  return longest;
}

module.exports = { longestSong };
