# 05 · Where to catch an error

**Concept.** When code hits a problem it can't handle, it can *raise* an error: `parse_song` does that with `raise ValueError(...)`. A raised error stops the program unless something catches it. `try: ... except ValueError:` catches that kind of error raised anywhere inside the `try` block, and then carries on *after* the whole block. So where you put `try` decides how much work an error cancels. Wrap the whole loop, and one bad item stops everything. Wrap just the risky line inside the loop, and one bad item is skipped while the rest carry on.

**Goal.** `load_songs(lines)` reads lines like `"Intro,60"`. It should give back every song that parses, plus a count of the lines it had to skip: for `["Intro,60", "oops", "Outro,30"]`, two songs and one skipped. `parse_song` in `parse.py` already works; it raises `ValueError` on a bad line.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
