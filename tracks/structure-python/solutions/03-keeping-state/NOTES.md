**Planted bug:** `next()` stores the new position in a local variable, so `self.position` never changes: every call gives back the second song, and `current()` stays on the first.
**Lesson:** an object only remembers what you assign to its attributes; a local variable is gone when the method returns.
**Accepted fixes:** `self.position = (self.position + 1) % len(self.songs)` then `return self.current()` (or `self.songs[self.position]`); an `if` that resets to 0 after the last song also works.
**Rejected (see `wrong/`):** `self.position += 1` without wrapping runs off the end of the list: the fourth call raises `IndexError`.
**Good hint (rung 3):** "Print `self.position` at the start of each `next()`. Does it ever change?"
**New in this exercise:** updating an attribute inside a method.
