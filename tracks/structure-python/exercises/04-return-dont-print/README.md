# 04 · Return, don't print

**Concept.** A function that prints its result only *shows* it: the text goes to the screen, and other code can't use it. A function that doesn't `return` anything gives back `None`, even if it printed something first. Return the value instead, so whoever calls the function can join it, test it, or save it, and print only once, at the edge of the program.

**Goal.** `song_line(song)` should give back one line like `"Intro by Nina (1:00)"`, and `report(songs)` should give back all the lines joined, one song per line. Neither should print anything.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
