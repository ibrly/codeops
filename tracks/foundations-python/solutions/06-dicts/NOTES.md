**Planted bug:** `song["field"] = value` creates a key literally named `"field"`.
**Lesson:** a quoted string inside brackets is a literal key; an unquoted name is a variable whose value is the key.
**Accepted fixes:** `song[field] = value`.
**Good hint (rung 3):** "Add `print(song)` before the return. What new key appeared?"
