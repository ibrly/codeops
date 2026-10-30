# 01 · Values and types

**Concept.** Every value in JavaScript has a type: `"185"` (in quotes) is a *string* of characters, and `185` is a *number*. They look the same when you print them, but they behave differently. `"185" + 1` glues text together and gives `"1851"`, while `185 + 1` does math and gives `186`. Data that comes from a file, a form, or the command line usually arrives as a string, so you have to convert it before doing math.

**Goal.** `parseSeconds("185")` should return the *number* `185`, so the playlist can add durations together.

**Run the test:**

```bash
node --test
```

**Done when** the test passes.
