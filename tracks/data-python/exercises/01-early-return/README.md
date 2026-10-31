# 01 · Returning early from a loop

**Concept.** `return` ends the whole function immediately, even from inside a loop. That makes it great for "found it!": as soon as you find a match, `return True`. But the "not found" answer can only be given once you've checked *every* item, which means after the loop has finished, not inside it.

**Goal.** `has_artist(playlist, artist)` should be `True` if any song in the playlist is by that artist, and `False` otherwise.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
