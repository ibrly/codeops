class Player {
  constructor(songs) {
    this.songs = songs;
    this.position = 0;
  }

  current() {
    return this.songs[this.position];
  }

  next() {
    this.songs.push(this.songs.shift());
    return this.songs[0];
  }
}

module.exports = { Player };
