function mergePlaylists(a, b) {
  const seen = new Set();
  const merged = [];
  for (const song of [...a, ...b]) {
    const key = `${song.title}\u0000${song.artist}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(song);
    }
  }
  return merged;
}

module.exports = { mergePlaylists };
