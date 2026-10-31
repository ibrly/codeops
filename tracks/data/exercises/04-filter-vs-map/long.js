// Titles of the songs longer than minSeconds, for a "long tracks" list.
function longSongs(playlist, minSeconds) {
  return playlist.map((song) => song.seconds > minSeconds);
}

module.exports = { longSongs };
