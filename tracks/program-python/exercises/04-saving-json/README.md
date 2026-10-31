# 04 · Saving data as JSON

**Concept.** A file can only hold text, so to save a playlist you have to turn it into text first, in a format you can read back later. JSON is that format: `json.dump(value, f)` writes data as JSON, and `json.load(f)` reads it back. `str(value)` isn't a substitute: it writes Python's own notation, with single quotes, which JSON can't read.

**Goal.** `save_playlist(path, playlist)` should save a playlist so that `load_playlist(path)` gives back exactly the same songs.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
