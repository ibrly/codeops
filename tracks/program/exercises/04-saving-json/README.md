# 04 · Saving data as JSON

**Concept.** A file can only hold text, so to save a playlist you have to turn it into text first, in a format you can read back later. JSON is that format: `JSON.stringify(value)` turns data into JSON text, and `JSON.parse(text)` turns it back. `String(value)` isn't a substitute: for an array of objects it gives `"[object Object]"`, and the data is gone.

**Goal.** `savePlaylist(path, playlist)` should save a playlist so that `loadPlaylist(path)` gives back exactly the same songs.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
