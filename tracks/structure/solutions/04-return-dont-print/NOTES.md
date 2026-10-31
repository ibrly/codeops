**Planted bug:** `songLine` prints its text with `console.log` and returns nothing, so it gives back `undefined` and `report` joins a list of `undefined`s.
**Lesson:** return values so other code can use them; print once, at the edge of the program.
**Accepted fixes:** `return` the template string instead of logging it.
**Good hint (rung 3):** "What does `report` receive from `songLine`? Try `console.log([songLine(INTRO)])`."
**New in this exercise:** none.
**Rejected (see `wrong/`):** logging *and* returning passes the value tests but still prints from inside the function, which the third test catches.
