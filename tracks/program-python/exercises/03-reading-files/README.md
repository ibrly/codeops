# 03 · Reading a file

**Concept.** `f.readlines()` reads a file into a list of lines, but each line still ends with its newline character, `"\n"`. It's invisible when you print a line, but `"Intro\n"` isn't equal to `"Intro"`. `line.strip()` removes whitespace, newlines included, from both ends.

**Goal.** `read_titles(path)` should read a file with one song title per line and give back the titles as a list, like `["Intro", "Outro"]`, skipping blank lines.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
