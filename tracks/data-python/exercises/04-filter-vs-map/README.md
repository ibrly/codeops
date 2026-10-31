# 04 · Choosing, then transforming

**Concept.** A list comprehension can do two jobs at once: `[what_to_keep for item in items if condition]`. The part *before* `for` decides what each kept item turns into. The `if` at the end decides which items are kept at all. Put the condition in the wrong place and you get a list of `True`/`False` values instead of the items you wanted.

**Goal.** `long_songs(playlist, min_seconds)` should give back the titles of songs **longer than** `min_seconds`, like `["Epic"]`.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
