# 02 · Command-line arguments

**Concept.** When you run `node stats.js songs.txt`, your program can read what was typed through `process.argv`, a list of strings. It isn't just the arguments, though: item `0` is the path to Node itself and item `1` is the path to your script. The first thing the user typed after the script name is item `2`.

**Goal.** `getFile(argv)` should give back the file name the user typed after the script, like `"songs.txt"`, or `null` if they didn't type one.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
