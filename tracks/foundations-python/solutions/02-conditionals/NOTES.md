**Planted bug:** `stars >= 3` is checked before `stars == 5`, so 5 matches the first branch and the second can never run.
**Lesson:** an if/elif chain stops at the first true condition; order the checks from most to least specific.
**Accepted fixes:** reorder the branches, or make the first condition `3 <= stars < 5`.
**Good hint (rung 3):** "Walk through the function with `stars = 5`. Which line runs first?"
