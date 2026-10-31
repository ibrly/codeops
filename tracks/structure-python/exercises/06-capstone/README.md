# 06 · Capstone: a playlist program

**This is the Structuring a Program capstone,** and your first program built around a class. There's no planted bug: `playlist.py` is empty, and you write it from scratch using this module's skills: classes, methods, keeping state, returning values, and saving objects. Your tutor will mostly ask you questions to help you think it through. If you ask for help, it can point you to where to look or give a small nudge, but it won't show you any code or the answer. Any hint records the capstone as *assisted*. That's fine: you can reset it with a fresh copy and finish it on your own another day, which counts as completing it.

**Goal.** `playlist.py` has a `Playlist` class:

- `Playlist()` starts with an empty `songs` list. Each song is a dictionary like `{"title": "Outro", "artist": "Sam", "seconds": 240}`.
- `add(song)` adds a song, and `total_seconds()` gives back the total length in seconds.
- `longest()` gives back the longest song (the first one, if two tie), or `None` when there are no songs.
- `summary()` gives back text like `"3 songs, 7:30 total, longest: Outro"`, or `"0 songs, 0:00 total"` for an empty playlist.

Importing `playlist.py` must not run anything. Run as a program, it keeps a playlist in a JSON file (a list of songs; a file that doesn't exist yet is an empty playlist):

```bash
python3 playlist.py songs.json add Outro Sam 240
```

adds that song, with its seconds as a number, saves the file, and prints `Added Outro`.

```bash
python3 playlist.py songs.json
```

prints the playlist's `summary()`. If the seconds aren't a whole number, print `Seconds must be a whole number` to the error output, with `print(..., file=sys.stderr)`, exit with code 1 (`sys.exit(1)`), and leave the file as it was.

**Run the test** (it runs your program for you):

```bash
python3 -m unittest
```

**Done when** all the tests pass without any hints. Then you've built a program around a class and completed Structuring a Program.
