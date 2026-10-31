**Planted bug:** `song_line` prints its line and returns nothing, so it gives back `None`: the first test sees `None`, and `report` fails joining `None`s with `TypeError: sequence item 0: expected str instance, NoneType found`.
**Lesson:** return values so other code can use them; printing is for the edge of the program.
**Accepted fixes:** `return` the f-string instead of printing it.
**Rejected (see `wrong/`):** printing the line and also returning it. The values are right, but the function still writes to the screen every time it's called.
**Good hint (rung 3):** "What does `report` receive from `song_line`? Try `print([song_line(INTRO)])`."
**New in this exercise:** none.
