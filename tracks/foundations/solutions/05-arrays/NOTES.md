**Planted bug:** `forEach` is used where `map` is needed, so the function returns `undefined`.
**Lesson:** `forEach` is for side effects and returns nothing; `map` builds a new array from return values.
**Accepted fixes:** `map`, or a loop that pushes titles into a new array and returns it.
**Good hint (rung 3):** "What does `[1, 2].forEach(n => n * 2)` give back? Try it in `node`."
**Rejected (see `wrong/`):** `map` with a braced arrow body and no `return` gives an array of `undefined`.
