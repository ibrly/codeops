function longSongs(playlist, minSeconds) {
  return playlist.filter((song) => song.seconds >= minSeconds).map((song) => song.title);
}

module.exports = { longSongs };
