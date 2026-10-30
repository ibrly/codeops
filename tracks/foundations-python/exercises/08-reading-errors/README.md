# 08 · Reading error messages

**Concept.** When Python crashes, it prints a *traceback*. Read it from the bottom up. The last line names the *kind* of error and describes it (for example `NameError: name 'x' is not defined`), and the lines just above it show the file and line number where it happened. A `NameError` means the code used a name that doesn't exist, very often a typo.

**Goal.** `count_songs(playlist)` should give back how many songs are in the playlist. Right now it crashes.

**Run the test:**

```bash
python3 -m unittest
```

Before you change anything, read the traceback and find the file and line it points to.

**Done when** all the tests pass.
