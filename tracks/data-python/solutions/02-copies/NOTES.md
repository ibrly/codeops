**Planted bug:** `copy = playlist` binds a second name to the same list, so `append` changes the caller's list.
**Lesson:** assignment doesn't copy lists or dicts; make a new list.
**Accepted fixes:** `playlist + [song]`, `[*playlist, song]`, or `copy = playlist.copy()` then `append`.
**Rejected (see `wrong/`):** `playlist.append(song)` then `return list(playlist)` returns a new list but has already changed the original.
**Good hint (rung 3):** "After `copy = playlist`, try `print(copy is playlist)`."
