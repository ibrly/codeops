// Plays through a list of songs, one at a time.
class Player {
  // This constructor and current are correct.
  constructor(songs) {
    this.songs = songs;
    this.position = 0;
  }

  current() {
    return this.songs[this.position];
  }

  // Moves on to the next song (back to the first after the last) and gives it back.
  next() {
    const position = (this.position + 1) % this.songs.length;
    return this.songs[position];
  }
}

module.exports = { Player };
