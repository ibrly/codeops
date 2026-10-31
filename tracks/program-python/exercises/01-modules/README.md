# 01 · Splitting code into files

**Concept.** Real programs are split across files, called *modules*. In Python, `import helpers` loads `helpers.py` and gives you the module itself, so its functions are reached through it: `helpers.format_time(...)`. To use a name on its own, import that name: `from helpers import format_time`. Mixing the two up gives a `NameError`.

**Goal.** `describe_song(song)` in `playlist.py` should give back text like `"Outro (4:00)"`. It uses `format_time` from `helpers.py`.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
