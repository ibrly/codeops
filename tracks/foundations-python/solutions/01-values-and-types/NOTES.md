**Planted bug:** `parse_seconds` returns the string unchanged.
**Lesson:** strings and integers print the same but behave differently; `+` concatenates strings.
**Accepted fixes:** `int(text)`, `float(text)` (the tests still pass).
**Rejected (see `wrong/`):** Calling `int(text)` on its own line without keeping the result, so the string is still returned.
**Good hint (rung 3):** "What does `type(parse_seconds("185"))` print?"
