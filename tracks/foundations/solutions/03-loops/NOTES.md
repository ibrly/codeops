**Planted bug:** the loop condition is `i < songs.length - 1`, so the last song is never added.
**Lesson:** off-by-one errors in loop bounds; indexes run from 0 to length - 1.
**Accepted fixes:** `i < songs.length`, `i <= songs.length - 1`, a `for...of` loop, or `reduce`.
**Good hint (rung 3):** "With 3 songs, which values does `i` take? Write them down."
