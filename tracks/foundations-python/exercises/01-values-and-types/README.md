# 01 · Values and types

**Concept.** Every value in Python has a type: `"185"` (in quotes) is a *string* of characters, and `185` is an *integer*. They look the same when you print them, but they behave differently. `"185" + "60"` glues text together and gives `"18560"`, while `185 + 60` does math and gives `245`. Data that comes from a file, a form, or `input()` usually arrives as a string, so you have to convert it before doing math.

**Goal.** `parse_seconds("185")` should return the *number* `185`, so the playlist can add durations together.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** the tests pass.
