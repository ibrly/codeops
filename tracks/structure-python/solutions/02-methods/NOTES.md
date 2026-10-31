**Planted bug:** `summary` calls `total_seconds()` as a bare name, so Python looks for an ordinary function and raises `NameError: name 'total_seconds' is not defined`.
**Lesson:** inside a method, reach the object's other methods (and data) through `self`.
**Accepted fixes:** `self.total_seconds()`; or computing the sum inline from `self.songs`.
**Rejected (see `wrong/`):** `self.total_seconds` without `()` is the method itself, not its result, so `total // 60` raises `TypeError`.
**Good hint (rung 3):** "How does `add` reach *this* playlist's songs? Do the same in `summary`."
**New in this exercise:** method syntax; calling a method through `self.`.
