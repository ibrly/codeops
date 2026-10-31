**Planted bug:** an empty playlist divides by `len([])`, which is 0, and raises `ZeroDivisionError`.
**Lesson:** handle edge cases (empty input) deliberately.
**Accepted fixes:** an early `return 0` when the list is empty (`if not songs`, `if len(songs) == 0`), or a conditional expression.
**Rejected (see `wrong/`):** Dividing by `len(songs) + 1` avoids the crash but makes every average wrong.
**Good hint (rung 3):** "What is `len(songs)` when the playlist is empty?"
