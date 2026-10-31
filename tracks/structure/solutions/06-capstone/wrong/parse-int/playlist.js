const fs = require("node:fs");

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

class Playlist {
  constructor() {
    this.songs = [];
  }

  add(song) {
    this.songs.push(song);
  }

  totalSeconds() {
    return this.songs.reduce((total, song) => total + song.seconds, 0);
  }

  longest() {
    let longest = null;
    for (const song of this.songs) {
      if (longest === null || song.seconds > longest.seconds) longest = song;
    }
    return longest;
  }

  summary() {
    const text = `${this.songs.length} songs, ${formatTime(this.totalSeconds())} total`;
    return this.songs.length ? `${text}, longest: ${this.longest().title}` : text;
  }
}

function load(file) {
  const playlist = new Playlist();
  if (fs.existsSync(file)) {
    for (const song of JSON.parse(fs.readFileSync(file, "utf8"))) playlist.add(song);
  }
  return playlist;
}

module.exports = { Playlist };

if (require.main === module) {
  const [file, command, title, artist, seconds] = process.argv.slice(2);
  const playlist = load(file);
  if (command === "add") {
    if (Number.isNaN(parseInt(seconds))) {
      console.error("Seconds must be a whole number");
      process.exit(1);
    }
    playlist.add({ title, artist, seconds: parseInt(seconds) });
    fs.writeFileSync(file, JSON.stringify(playlist.songs));
    console.log(`Added ${title}`);
  } else {
    console.log(playlist.summary());
  }
}
