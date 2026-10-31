**Planted bug:** `readlines()` keeps each line's `"\n"`, so the titles come back as `"Intro\n"`.
**Lesson:** lines read from a file include their line ending; strip it.
**Accepted fixes:** strip each line and skip empty ones; or `f.read().splitlines()` with an empty-line filter.
**Rejected (see `wrong/`):** Stripping each line but keeping the `line != "\n"` filter lets a line of only spaces through as `""`.
**Good hint (rung 3):** "The failure shows `'Intro\n'`. Where does that `\n` come from?"
