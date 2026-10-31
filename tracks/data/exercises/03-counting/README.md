# 03 · Counting with an object

**Concept.** An object makes a good tally sheet: the keys are the things you're counting, and the values are the counts. But a key that hasn't been set yet is `undefined`, and `undefined + 1` is `NaN` ("not a number"). The first time you see something, its count has to start from `0`.

**Goal.** `countByArtist(playlist)` should give back how many songs each artist has, like `{ Nina: 2, Sam: 1 }`.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
