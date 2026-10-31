function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return console.log(minutes + ":" + rest);
}

module.exports = { formatDuration };
