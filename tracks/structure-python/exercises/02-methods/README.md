# 02 · Methods

**Concept.** Functions written inside a class are *methods*, and you call them on an object: `p.add(song)`. Inside a method, `self` is the object it was called on; Python passes it in for you, so `p.add(song)` runs `add(p, song)`. To call another method of the same object, go through it: `self.total_seconds()`. A bare `total_seconds()` looks for a separate, ordinary function with that name.

**Goal.** `summary()` should describe a playlist as `"Morning Run: 2 songs, 3:30"`: its name, how many songs it has, and their total length.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
