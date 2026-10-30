**Task:** implement `longest_song` from scratch. Hints are capped at rung 3, and there's no escape hatch.
**Lesson:** combines loops, comparison, dictionary access, and the empty-list edge case.
**Common mistakes:** starting `longest` at `0` or `{}` instead of the first song; using `>=` (breaks the tie rule); forgetting the empty case. `max(playlist, key=...)` works for ties but still needs the empty guard.
**Accepted approaches:** a loop that tracks the best so far, or `max()` with a `key` and an empty-list guard.
