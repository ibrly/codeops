**Planted bug:** `argv[1]` is the script's own path, not the first user argument.
**Lesson:** `process.argv` starts with the Node binary and the script path; user arguments start at index 2.
**Accepted fixes:** `argv[2] ?? null`, `argv.length > 2 ? argv[2] : null`, or `argv.slice(2)[0] ?? null`.
**Good hint (rung 3):** "Make a file that runs `console.log(process.argv)` and run it with `node that-file.js hello`. Where's `hello`?"
**New in this exercise:** `process.argv`; `undefined` vs `null`.
