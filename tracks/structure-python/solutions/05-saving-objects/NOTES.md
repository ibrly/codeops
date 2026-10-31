**Planted bug:** `load_playlist` returns what `json.load` gives back, a plain dictionary, so `loaded.name` and `loaded.total_seconds()` raise `AttributeError: 'dict' object has no attribute ...`.
**Lesson:** JSON keeps an object's data, not its class or methods; rebuild the object from the loaded data.
**Accepted fixes:** `playlist = Playlist(data["name"])`, then add each song (or `playlist.songs = data["songs"]`), and return it.
**Rejected (see `wrong/`):** `return Playlist(data["name"])` gives back a real playlist, but with no songs.
**Good hint (rung 3):** "Right after loading, print it: `print(type(loaded))`. Is that a Playlist?"
**New in this exercise:** none (`isinstance` appears only in the tests).
