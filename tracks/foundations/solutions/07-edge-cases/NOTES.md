**Planted bug:** an empty playlist divides 0 by 0 and returns `NaN`.
**Lesson:** check edge cases (empty input) deliberately; `NaN` fails silently.
**Accepted fixes:** an early `return 0` for an empty list, or a ternary on `songs.length`.
**Good hint (rung 3):** "What is `songs.length` when the playlist is empty? What's `0 / 0`?"
**Rejected (see `wrong/`):** `songs === []` is always false (two arrays are never the same object), so the empty case still gives `NaN`.
