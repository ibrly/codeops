const fs = require("node:fs");
const { Playlist } = require("./playlist");

function savePlaylist(path, playlist) {
  fs.writeFileSync(path, JSON.stringify(playlist));
}

function loadPlaylist(path) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const playlist = new Playlist(data.name);
  for (const song of data.songs) playlist.add(song);
  return playlist;
}

module.exports = { savePlaylist, loadPlaylist };
