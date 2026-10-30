// Edits one field of a song, chosen by name, e.g. updateField(song, "artist", "Nina").
function updateField(song, field, value) {
  song.field = value;
  return song;
}

module.exports = { updateField };
