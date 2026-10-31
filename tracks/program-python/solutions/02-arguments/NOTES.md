**Planted bug:** `argv[0]` is the script's own path, not the first user argument.
**Lesson:** `sys.argv[0]` is the script; user arguments start at index 1.
**Accepted fixes:** `argv[1] if len(argv) > 1 else None`, or slicing `argv[1:2]`.
**Rejected (see `wrong/`):** `argv[-1]` gives back the script path, not `None`, when no file was typed.
**Good hint (rung 3):** "Make a file that runs `import sys; print(sys.argv)` and run it with `python3 that_file.py hello`. Where's `hello`?"
