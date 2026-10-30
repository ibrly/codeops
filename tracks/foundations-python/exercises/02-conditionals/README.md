# 02 · Conditionals

**Concept.** An `if` / `elif` / `else` chain checks its conditions from top to bottom and runs the *first* branch whose condition is true. Every branch after that is skipped, even ones that would also be true. So the order of the checks matters: put the most specific condition first.

**Goal.** `rating_label(stars)` should return `"favorite"` for 5 stars, `"good"` for 3 or 4, and `"skip"` for 1 or 2.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
