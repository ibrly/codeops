**Task:** implement `longestSong` from scratch. Hints are capped at rung 3, and there's no escape hatch.
**Lesson:** combines loops, comparison, object access, and the empty-list edge case.
**Common mistakes:** starting `longest` at `0` or `{}` instead of the first song; using `>=` (breaks the tie rule); forgetting the empty case.
**Accepted approaches:** a loop that tracks the best so far, or `reduce` with an empty-list guard.
**Rejected (see `wrong/`):** `>=` lets a later song with the same length replace the first, breaking the tie rule.
