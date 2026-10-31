const fs = require("node:fs");
const { Playlist } = require("./playlist");

// Saves a playlist's name and songs as JSON. This function is correct.
function savePlaylist(path, playlist) {
  fs.writeFileSync(path, JSON.stringify(playlist));
}

// Loads a saved playlist back.
function loadPlaylist(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

module.exports = { savePlaylist, loadPlaylist };
