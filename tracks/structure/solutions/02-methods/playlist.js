// "3:30": a number of seconds as minutes and seconds.
function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

class Playlist {
  constructor(name) {
    this.name = name;
    this.songs = [];
  }

  add(song) {
    this.songs.push(song);
  }

  totalSeconds() {
    return this.songs.reduce((total, song) => total + song.seconds, 0);
  }

  // "Morning Run: 2 songs, 3:30"
  summary() {
    const total = this.totalSeconds();
    return `${this.name}: ${this.songs.length} songs, ${formatTime(total)}`;
  }
}

module.exports = { Playlist };
