**Planted bug:** `const copy = playlist` copies the reference, so `push` changes the caller's array.
**Lesson:** assignment doesn't copy arrays or objects; make a new array.
**Accepted fixes:** `[...playlist, song]`, `playlist.concat([song])`, or `const copy = playlist.slice(); copy.push(song)`.
**Good hint (rung 3):** "After `const copy = playlist`, try `console.log(copy === playlist)`."
