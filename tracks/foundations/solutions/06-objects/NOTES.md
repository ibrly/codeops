**Planted bug:** `song.field = value` creates a property literally named `"field"`.
**Lesson:** dot notation uses the literal name; bracket notation uses the variable's value.
**Accepted fixes:** `song[field] = value`.
**Good hint (rung 3):** "Add `console.log(song)` before the return. What new property appeared?"
**Rejected (see `wrong/`):** `song["field"]` quotes the name, so it is the same literal property as `song.field`.
