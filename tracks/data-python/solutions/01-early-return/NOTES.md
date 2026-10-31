**Planted bug:** `else: return False` inside the loop, so the function gives up after checking only the first song.
**Lesson:** `return` exits the function, not just the loop; a "not found" answer belongs after the loop.
**Accepted fixes:** remove the `else` branch; or `any(song["artist"] == artist for song in playlist)`.
**Good hint (rung 3):** "With the playlist in the test, how many songs does the loop look at before it returns?"
