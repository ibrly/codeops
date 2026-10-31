# 02 · Command-line arguments

**Concept.** When you run `node stats.js songs.txt`, your program can read what was typed through `process.argv`, a list of strings. It isn't just the arguments, though: item `0` is the path to Node itself and item `1` is the path to your script. The first thing the user typed after the script name is item `2`. And if they typed nothing, reading item `2` gives `undefined`, JavaScript's "nothing here". That's not the same value as `null`, the "deliberately empty" value the goal asks for, so you'll need to turn one into the other.

**Goal.** `getFile(argv)` should give back the file name the user typed after the script, like `"songs.txt"`, or `null` if they didn't type one.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
