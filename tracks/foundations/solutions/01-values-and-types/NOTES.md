**Planted bug:** `parseSeconds` returns the string unchanged.
**Lesson:** strings and numbers print the same but behave differently; `+` concatenates strings.
**Accepted fixes:** `Number(text)`, `parseInt(text, 10)`, `+text`.
**Good hint (rung 3):** "What does `typeof parseSeconds("185")` print?"
**Rejected (see `wrong/`):** `Number("text")` quotes the variable name, so it converts the word "text" and gives `NaN`.
