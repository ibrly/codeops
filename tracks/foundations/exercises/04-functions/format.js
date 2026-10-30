// Turns a number of seconds into minutes:seconds, like 185 -> "3:05".
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  console.log(minutes + ":" + rest);
}

module.exports = { formatDuration };
