# 04 · Filter, then map

**Concept.** `filter` keeps some items and drops the rest: its function answers "keep this one?" with true or false. `map` turns every item into something else, so it always gives back exactly as many items as it got. To get "the titles of the long songs", you need both: `filter` to choose the songs, then `map` to turn each chosen song into its title.

**Goal.** `longSongs(playlist, minSeconds)` should give back the titles of songs **longer than** `minSeconds`, like `["Epic"]`.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
