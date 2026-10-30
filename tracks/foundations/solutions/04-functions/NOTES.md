**Planted bug:** the function prints the result with `console.log` instead of returning it.
**Lesson:** printing a value is not the same as returning it; a function without `return` gives back `undefined`.
**Accepted fixes:** replace `console.log(...)` with `return ...`.
**Good hint (rung 3):** "The test output shows `3:05` printed *and* says it got `undefined`. Where does each of those come from?"
