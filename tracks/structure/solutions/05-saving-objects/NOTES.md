**Planted bug:** `loadPlaylist` returns `JSON.parse(...)` directly: a plain object with `name` and `songs` but no methods, so `loaded.totalSeconds()` is not a function.
**Lesson:** JSON keeps data, not classes or methods; rebuild the real object from the loaded data.
**Accepted fixes:** `const p = new Playlist(data.name); for (const s of data.songs) p.add(s); return p;`, or `p.songs = data.songs`. (`Object.assign(new Playlist(data.name), data)` works too; worth asking why.)
**Good hint (rung 3):** "Right after loading, print it: `console.log(loaded)`. Is that a Playlist?"
**New in this exercise:** none (`instanceof` appears only in the tests).
**Rejected (see `wrong/`):** `return new Playlist(data.name)` gives back a real Playlist but drops the saved songs.
