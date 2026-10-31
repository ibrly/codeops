class Player {
  constructor(songs) {
    this.songs = songs;
    this.position = 0;
  }

  current() {
    return this.songs[this.position];
  }

  next() {
    this.position += 1;
    return this.songs[this.position];
  }
}

module.exports = { Player };
