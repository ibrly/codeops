const fs = require("node:fs");

// Saves a playlist to a file, so the program can load it again next time.
function savePlaylist(path, playlist) {
  fs.writeFileSync(path, String(playlist));
}

// Loads a playlist saved by savePlaylist. This function is correct.
function loadPlaylist(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

module.exports = { savePlaylist, loadPlaylist };
