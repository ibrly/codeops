**Task:** write `playlist.js` from scratch: a `Playlist` class with `add`, `totalSeconds`, `longest`, and `summary`, plus a command-line part (guarded by `require.main === module`) that loads the JSON file into a Playlist, adds a song or prints the summary, and saves. Any hint makes it assisted.
**Lesson:** puts the module together: an object that owns its data, methods that return values, and rebuilding the object from saved data.
**Common mistakes:** a module-level `songs` array shared by every playlist; `summary()` printing instead of returning; no `require.main` guard, so requiring the file runs the program; saving `seconds` as the text from `argv`; `longest()` using `>=` (keeps the last song on a tie); validating after saving, so a bad call still writes the file; throwing instead of `console.error` plus `process.exit(1)`.
**Rejected (see `wrong/`):** storing the seconds argument without converting it saves `"60"` instead of `60`.
**Not tested:** unknown commands, a corrupt JSON file. If the learner asks, they're good conversations about what the program should do.
**Uses:** child_process (the test runs playlist.js as a program); dynamic-require (the test requires playlist.js in a child process to check that loading it runs nothing).
**Rejected (see `wrong/parse-int/`):** `parseInt(seconds)` with an `isNaN` check accepts `60.5` and `30abc` and saves `60` and `30`.
