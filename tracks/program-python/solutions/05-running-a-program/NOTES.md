**Planted bug:** the `print(...)` runs at import time, so importing the module reads `sys.argv[1]` (which isn't a playlist) and fails.
**Lesson:** top-level code runs on import; put "run as a program" code under `if __name__ == "__main__":`.
**Accepted fixes:** the `__main__` guard, optionally around a `main()` function.
**Rejected (see `wrong/`):** `if len(sys.argv) > 1:` instead of the guard. Importing from another program that has its own arguments still runs it.
**Good hint (rung 3):** "When the test does `import totals`, which lines of `totals.py` run?"
