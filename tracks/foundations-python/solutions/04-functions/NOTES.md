**Planted bug:** the function prints the result instead of returning it.
**Lesson:** printing a value is not the same as returning it; a function without `return` gives back `None`.
**Accepted fixes:** replace `print(...)` with `return ...`.
**Good hint (rung 3):** "The third test fails with `TypeError: can only concatenate str (not "NoneType")`. Where did that `None` come from?"
