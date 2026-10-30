# 03 · Loops

**Concept.** `range(n)` counts from `0` up to, but *not including*, `n`. So `range(3)` gives `0, 1, 2`, which are exactly the positions in a list of 3 items. Python also lets you skip positions entirely and loop over the items themselves: `for song in songs:`. Getting a range one step wrong is so common that it has a name: an *off-by-one* error.

**Goal.** `total_duration(songs)` should add up the `"seconds"` of every song in the playlist.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
