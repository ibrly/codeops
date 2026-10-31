**Planted bug:** `copy = playlist` binds a second name to the same list, so `append` changes the caller's list.
**Lesson:** assignment doesn't copy lists or dicts; make a new list.
**Accepted fixes:** `playlist + [song]`, `[*playlist, song]`, or `copy = playlist.copy()` then `append`.
**Good hint (rung 3):** "After `copy = playlist`, try `print(copy is playlist)`."
