# 04 · Return, don't print

**Concept.** A function that prints its result only *shows* it: the text goes to the screen, and no other code can use it. Calling it gives back `undefined`, so there's nothing to join, test, or save. Have the function `return` the value instead, and let the caller decide what to do with it. Print once, at the edge of the program, when the result is ready to show.

**Goal.** `songLine(song)` should give back text like `"Intro by Nina (1:00)"`, and `report(songs)` should give back one such line per song. Neither should print anything.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
