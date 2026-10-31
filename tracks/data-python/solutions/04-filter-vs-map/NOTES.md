**Planted bug:** the condition is the comprehension's output expression, so it yields one boolean per song.
**Lesson:** in `[expr for x in xs if cond]`, `expr` transforms and `cond` filters.
**Accepted fixes:** `[s["title"] for s in playlist if s["seconds"] > min_seconds]`, or a loop that appends matching titles.
**Good hint (rung 3):** "How many items does the comprehension give back for a playlist of 3 songs? How many do you want?"
