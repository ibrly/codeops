**Planted bug:** `str(playlist)` writes Python's notation (`[{'title': 'Intro', ...}]`), which `json.load` rejects. (An empty list happens to survive: `str([])` is valid JSON. Worth pointing out if the learner notices.)
**Lesson:** to save structured data, serialize it in a format you can parse back; JSON is the standard.
**Accepted fixes:** `json.dump(playlist, f)` or `f.write(json.dumps(playlist))`.
**Rejected (see `wrong/`):** `str(playlist).replace("'", '"')` breaks on a title with an apostrophe and on `True`/`None` values.
**Good hint (rung 3):** "Open the file the test writes, or `print(str([{'a': 1}]))`. Is that JSON?"
