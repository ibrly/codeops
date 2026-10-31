**Planted bug:** `songs = []` is a local variable inside `__init__`, so it vanishes when `__init__` ends and `p.songs` raises `AttributeError: 'Playlist' object has no attribute 'songs'`.
**Lesson:** a value lives on the object only if it's assigned to `self.something`.
**Accepted fixes:** `self.songs = []` in `__init__`.
**Rejected (see `wrong/`):** `songs = []` in the class body makes a class attribute: one list shared by every playlist, so adding to one adds to all of them.
**Good hint (rung 3):** "Right after creating one, print it: `print(vars(p))`. Which of the two values made it onto the object?"
**New in this exercise:** `class`, `__init__`, `self`, attributes, `vars()`.
