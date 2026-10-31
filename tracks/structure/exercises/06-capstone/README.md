# 06 · Capstone: a playlist program

**This is the Structuring a Program capstone.** There's no planted bug: `playlist.js` is empty, and you write it from scratch using this module's skills: a class with its own data, methods that use `this`, returning values instead of printing them, and rebuilding an object from saved data. Your tutor will mostly ask you questions to help you think it through. If you ask for help, it can point you to where to look or give a small nudge, but it won't show you any code or the answer. Any hint records the capstone as *assisted*. That's fine: you can reset it with a fresh copy and finish it on your own another day, which counts as completing it.

**Goal.** `playlist.js` exports a `Playlist` class (`module.exports = { Playlist }`). A new playlist's `songs` starts empty, and it has these methods:

- `add(song)` adds a song like `{ title: "Intro", artist: "Nina", seconds: 60 }`.
- `totalSeconds()` gives back the total length in seconds.
- `longest()` gives back the longest song (the first one, if two tie), or `null` if there are none.
- `summary()` gives back text like `"3 songs, 7:30 total, longest: Outro"`, or `"0 songs, 0:00 total"` for an empty playlist.

It also works as a program. The playlist is saved in a file as a JSON list of songs (a missing file is an empty playlist). Running

```bash
node playlist.js songs.json add Intro Nina 60
```

adds the song to the file (with `seconds` saved as a number) and prints `Added Intro`. Running `node playlist.js songs.json` prints the summary. If the seconds aren't a whole number (digits only: `60.5`, `-5`, and `30abc` are all refused), print `Seconds must be a whole number` with `console.error`, exit with code 1 (`process.exit(1)`), and leave the file alone. Just loading the file with `require` must not run the program: put the program part inside `if (require.main === module) { ... }`, which is true only when the file is run directly with `node`.

**Run the test** (it runs your program for you):

```bash
node --test
```

**Done when** all the tests pass without any hints. Then you've built a program out of objects and completed Structuring a Program.
