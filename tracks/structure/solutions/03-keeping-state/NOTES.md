**Planted bug:** `next()` computes the new position in a local `const position` and never stores it, so the player is always on the first song and `next()` always gives back the second.
**Lesson:** to change an object's state, assign to `this.<name>`; a local only lasts for the one call.
**Accepted fixes:** `this.position = (this.position + 1) % this.songs.length;` then `return this.current()` (or `return this.songs[this.position]`). An `if` that resets to 0 after the last song is fine too.
**Good hint (rung 3):** "Print `this.position` at the start of each `next()`. Does it ever change?"
**New in this exercise:** updating an attribute (`this.position = ...`) inside a method.
**Rejected (see `wrong/`):** `this.position += 1` stores the move but never wraps, so after the last song `next()` gives back `undefined`.
**Rejected (see `wrong/rotate-the-list/`):** rotating `this.songs` changes the caller's list and never uses `position`.
