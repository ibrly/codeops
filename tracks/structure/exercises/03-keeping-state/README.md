# 03 · Keeping state

**Concept.** An object remembers, between one call and the next, only what you store on it. A method that works out a new value in a local variable and returns it leaves the object exactly as it was, so the next call starts from the same place again. To change what the object remembers, assign to it inside the method: `this.position = ...`.

**Goal.** A `Player` plays through a list of songs. `current()` gives back the song it's on, and `next()` should move to the following song and give it back, going round to the first song again after the last.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
