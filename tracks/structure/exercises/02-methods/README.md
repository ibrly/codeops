# 02 · Methods

**Concept.** Functions written inside a class are called *methods*, and you call them on an object: `p.add(song)`. Inside a method, `this` is the object it was called on, which is how `add` reaches that playlist's own songs. To call another method of the same object, go through `this` too: `this.totalSeconds()`. A bare `totalSeconds()` looks for a separate, ordinary function with that name, and there isn't one, so it fails with `... is not defined`.

**Goal.** `summary()` should give back text like `"Morning Run: 2 songs, 3:30"`: the playlist's name, how many songs it has, and their total length.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
