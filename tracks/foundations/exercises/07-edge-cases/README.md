# 07 · Edge cases

**Concept.** Code that works for normal input often breaks at the edges: an empty list, zero, a missing value. Dividing by zero in JavaScript doesn't crash. `0 / 0` quietly gives `NaN` ("not a number"), which then spreads through every calculation that touches it. Good code decides on purpose what should happen at the edges.

**Goal.** `averageDuration(songs)` should give the average song length in seconds, and give `0` for an empty playlist.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
