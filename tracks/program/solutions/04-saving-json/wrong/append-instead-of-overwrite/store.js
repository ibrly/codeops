const fs = require("node:fs");

function savePlaylist(path, playlist) {
  fs.appendFileSync(path, JSON.stringify(playlist));
}

function loadPlaylist(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

module.exports = { savePlaylist, loadPlaylist };
