**Task:** implement `longest_song` from scratch. Hints are capped at rung 3, and there's no escape hatch.
**Lesson:** combines loops, comparison, dictionary access, and the empty-list edge case.
**Common mistakes:** starting `longest` at `0` or `{}` instead of the first song; using `>=` (breaks the tie rule); forgetting the empty case. `max(playlist, key=...)` works for ties but still needs the empty guard.
**Accepted approaches:** a loop that tracks the best so far, or `max()` with a `key` and an empty-list guard.
**Rejected (see `wrong/`):** `>=` in the comparison picks the last of two tied songs instead of the first.
**Test count differs:** one more test than the JavaScript version. A Python function that's only `pass` returns `None`, which would satisfy the empty-playlist test by accident, so this version also checks that a non-empty playlist gets a song back. (In JavaScript an empty function returns `undefined`, which the `null` check already rejects.)
