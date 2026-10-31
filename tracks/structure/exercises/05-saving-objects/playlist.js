// A playlist: a name and the songs in it. This class is correct.
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
}

module.exports = { Playlist };
