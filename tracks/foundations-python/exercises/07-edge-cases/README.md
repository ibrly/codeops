# 07 · Edge cases

**Concept.** Code that works for normal input often breaks at the edges: an empty list, zero, a missing value. In Python, dividing by zero doesn't quietly give a strange number. It stops the program with a `ZeroDivisionError`. Good code decides on purpose what should happen at the edges instead of crashing.

**Goal.** `average_duration(songs)` should give the average song length in seconds, and give `0` for an empty playlist.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
