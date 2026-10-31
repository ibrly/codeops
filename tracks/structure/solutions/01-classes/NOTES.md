**Planted bug:** the constructor assigns `songs = []` instead of `this.songs = []`. Class bodies are strict, so it fails with `ReferenceError: songs is not defined` (and even if it didn't, the list would never reach the object).
**Lesson:** an object only keeps what you assign to `this`; locals in the constructor disappear when it ends.
**Accepted fixes:** `this.songs = []` in the constructor, or a class field `songs = [];` (each object still gets its own array).
**Good hint (rung 3):** "Right after creating one, print it: `console.log(p)`. Which of the two values made it onto the object?"
**New in this exercise:** `class`, `constructor`, `new`, `this`.
**Rejected (see `wrong/`):** a module-level `const songs = []` with `this.songs = songs` gives every playlist the same array, so adding to one adds to all.
