function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function shout(text) {
  return text.toUpperCase();
}

module.exports = { shout };
exports.formatTime = formatTime;
