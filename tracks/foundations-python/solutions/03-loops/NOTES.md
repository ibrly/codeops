**Planted bug:** `range(len(songs) - 1)` stops one position early, so the last song is never added.
**Lesson:** `range(n)` excludes `n`; looping over items directly avoids index mistakes.
**Accepted fixes:** `range(len(songs))`, `for song in songs`, or `sum(song["seconds"] for song in songs)`.
**Good hint (rung 3):** "What numbers does `list(range(3 - 1))` give you? Try it in `python3`."
