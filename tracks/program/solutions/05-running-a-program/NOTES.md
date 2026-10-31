**Planted bug:** `loadPlaylist(path)` is called without `await`, so `songs` is a Promise and `songs.reduce` is not a function.
**Lesson:** an async function returns a Promise; `await` it to get the value.
**Accepted fixes:** `const songs = await loadPlaylist(path)`, or `.then(...)`.
**Good hint (rung 3):** "Add `console.log(songs)` before the reduce. What does it print?"
