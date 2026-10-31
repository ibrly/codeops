**Task:** write `playlist.py` from scratch: a `Playlist` class with `add`, `total_seconds`, `longest`, and `summary`, plus a program that loads a JSON file into a `Playlist`, adds a song or prints the summary, and saves. A clean error for seconds that aren't a whole number. Any hint makes it assisted.
**Lesson:** puts the module together: a class whose methods return values, state kept on the object, and an object saved as plain data and rebuilt on load.
**Common mistakes:** `songs = []` in the class body (shared between playlists); printing in `summary` instead of returning; program code outside `if __name__ == "__main__":`, so importing reads `sys.argv` and writes the file; `int(seconds)` without a check (the exit code is 1, but stderr shows a traceback, which the test rejects); saving before the check, which creates the file.
**Accepted approaches:** `seconds.isdigit()` or `try: int(seconds)` / `except ValueError:`; saving `playlist.songs` directly or rebuilding the list; `max(self.songs, key=...)` for `longest` (it keeps the first on a tie) with a guard for the empty list.
**Rejected (see `wrong/`):** storing the seconds argument as text (`"60"`) instead of a number. The `add` runs succeed, but the summary run crashes adding text to a number, and the saved file has `"seconds": "60"`.
**Not tested:** unknown commands, a missing song argument, corrupt JSON. If the learner asks, they're good conversations about what the program should do.
**Uses:** subprocess (the test runs playlist.py as a program).
**New in this exercise:** none.
