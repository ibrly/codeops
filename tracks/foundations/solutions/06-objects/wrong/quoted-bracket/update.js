function updateField(song, field, value) {
  song["field"] = value;
  return song;
}

module.exports = { updateField };
