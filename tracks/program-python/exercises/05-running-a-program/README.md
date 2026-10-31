# 05 · A file that's both a program and a module

**Concept.** Python runs a file's top-level code whenever the file is *imported*, not only when you run it. So a file that reads `sys.argv` and prints at the top level does that even when a test just wants to import one of its functions. The fix is a guard: code inside `if __name__ == "__main__":` only runs when the file is run directly, as in `python3 totals.py playlist.json`.

**Goal.** `totals.py` should work both ways: `python3 totals.py playlist.json` prints the total seconds of a saved playlist, and `import totals` just makes `total_seconds` available, printing nothing.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
