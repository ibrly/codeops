# 02 · Copies and references

**Concept.** In Python, `copy = playlist` doesn't copy anything. Both names now refer to the *same* list, so changing one changes "both". To get a real copy, make a new list: `playlist.copy()`, `list(playlist)`, or `playlist + [song]`. This matters whenever someone else is still using the original.

**Goal.** `add_song(playlist, song)` should give back a **new** playlist with the song added at the end, and leave the original playlist exactly as it was.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
