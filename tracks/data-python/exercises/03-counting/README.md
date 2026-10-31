# 03 · Counting with a dictionary

**Concept.** A dictionary makes a good tally sheet: the keys are the things you're counting, and the values are the counts. But reading a key that isn't there yet raises a `KeyError`, and `counts[key] += 1` has to read the old count first. The first time you see something, its count has to start from `0`. `counts.get(key, 0)` reads a key with a fallback.

**Goal.** `count_by_artist(playlist)` should give back how many songs each artist has, like `{"Nina": 2, "Sam": 1}`.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
