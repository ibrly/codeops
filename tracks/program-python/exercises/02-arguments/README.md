# 02 · Command-line arguments

**Concept.** When you run `python3 stats.py songs.txt`, your program can read what was typed through `sys.argv`, a list of strings. Item `0` isn't an argument, though: it's the path to your script. The first thing the user typed after the script name is item `1`.

**Goal.** `get_file(argv)` should give back the file name the user typed after the script, like `"songs.txt"`, or `None` if they didn't type one.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
