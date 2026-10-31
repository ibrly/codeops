const fs = require("node:fs");
const { Playlist } = require("./playlist");

function savePlaylist(path, playlist) {
  fs.writeFileSync(path, JSON.stringify(playlist));
}

function loadPlaylist(path) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  return new Playlist(data.name);
}

module.exports = { savePlaylist, loadPlaylist };
