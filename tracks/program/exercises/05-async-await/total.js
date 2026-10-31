const fs = require("node:fs/promises");

// Loads a saved playlist without blocking the program. This function is correct.
async function loadPlaylist(path) {
  return JSON.parse(await fs.readFile(path, "utf8"));
}

// The total length of the playlist saved in a file, in seconds.
async function totalSeconds(path) {
  const songs = loadPlaylist(path);
  return songs.reduce((total, song) => total + song.seconds, 0);
}

module.exports = { loadPlaylist, totalSeconds };

// Run as a program: `node total.js playlist.json` prints the total. This part is correct.
if (require.main === module) {
  totalSeconds(process.argv[2]).then((total) => console.log(total));
}
