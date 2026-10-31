# 02 · Copies and references

**Concept.** In JavaScript, `const copy = playlist` doesn't copy anything. Both names now point at the *same* array, so changing one changes "both". To get a real copy, make a new array: `[...playlist]` or `playlist.slice()`. This matters whenever someone else is still using the original.

**Goal.** `addSong(playlist, song)` should give back a **new** playlist with the song added at the end, and leave the original playlist exactly as it was.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
