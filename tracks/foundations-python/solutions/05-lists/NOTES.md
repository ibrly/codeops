**Planted bug:** `return titles.sort()` returns `None`, because `.sort()` sorts in place.
**Lesson:** in-place list methods return `None`; `sorted()` returns a new list.
**Accepted fixes:** `return sorted(titles)`, or `titles.sort()` then `return titles` on its own line, or a comprehension inside `sorted()`.
**Good hint (rung 3):** "In `python3`, try `x = [3, 1, 2].sort()` and then `print(x)`."
