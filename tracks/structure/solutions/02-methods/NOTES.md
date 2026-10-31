**Planted bug:** `summary()` calls `totalSeconds()` as a bare function, so it fails with `ReferenceError: totalSeconds is not defined`; the method lives on the object.
**Lesson:** inside a method, reach the object's other methods (and data) through `this`.
**Accepted fixes:** `this.totalSeconds()`. (Repeating the reduce inside `summary` passes the tests but misses the point; worth discussing.)
**Good hint (rung 3):** "How does `add` reach *this* playlist's songs? Do the same in `summary`."
**New in this exercise:** method syntax; calling a method through `this.`.
**Rejected (see `wrong/`):** `this.totalSeconds` without `()` passes the method itself instead of its result, so the time comes out as `NaN:NaN`.
