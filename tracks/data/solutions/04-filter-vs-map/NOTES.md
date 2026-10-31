**Planted bug:** `map` with a true/false function gives back a list of booleans, one per song.
**Lesson:** `filter` chooses items, `map` transforms them; chain them to do both.
**Accepted fixes:** `filter(...).map(...)`, or a loop that pushes matching titles.
**Good hint (rung 3):** "How many items does `map` give back for a playlist of 3 songs? How many do you want?"
**Rejected (see `wrong/`):** `>=` keeps a song exactly at the limit, but the goal is "longer than".
