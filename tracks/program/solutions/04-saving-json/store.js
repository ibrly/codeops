const fs = require("node:fs");

function savePlaylist(path, playlist) {
  fs.writeFileSync(path, JSON.stringify(playlist, null, 2));
}

function loadPlaylist(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

module.exports = { savePlaylist, loadPlaylist };
