function mergePlaylists(a, b) {
  const seen = new Set();
  const merged = [];
  for (const song of [...a, ...b]) {
    const key = JSON.stringify(song);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(song);
    }
  }
  return merged;
}

module.exports = { mergePlaylists };
