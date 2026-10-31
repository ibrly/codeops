# 03 · Objects that remember

**Concept.** An object remembers between calls only what you store on it. A method that works out a new value in a local variable and returns it leaves the object exactly as it was, so the next call starts from the same place again. To change what the object remembers, assign to its attribute inside the method: `self.position = ...`.

**Goal.** A `Player` plays a list of songs in order. `current()` gives back the song it's on, and `next()` moves on to the next song and gives it back, going back to the first song after the last one.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
