# 05 · Where to catch an error

**Concept.** `try { ... } catch { ... }` catches an error thrown anywhere inside the `try` block, and then carries on *after* the whole block. So where you put `try` decides how much work an error cancels. Wrap the whole loop, and one bad item stops everything. Wrap just the risky line inside the loop, and one bad item is skipped while the rest carry on.

**Goal.** `loadSongs(lines)` reads lines like `"Intro,60"`. It should give back every song that parses, plus a count of the lines it had to skip: for `["Intro,60", "oops", "Outro,30"]`, two songs and one skipped. `parseSong` in `parse.js` already works; it throws on a bad line.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
