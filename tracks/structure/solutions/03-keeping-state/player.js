class Player {
  constructor(songs) {
    this.songs = songs;
    this.position = 0;
  }

  current() {
    return this.songs[this.position];
  }

  next() {
    this.position = (this.position + 1) % this.songs.length;
    return this.current();
  }
}

module.exports = { Player };
