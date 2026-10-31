**Planted bug:** `String(playlist)` writes `[object Object],[object Object]`, which isn't JSON and has lost the data.
**Lesson:** to save structured data, serialize it in a format you can parse back; JSON is the standard.
**Accepted fixes:** `JSON.stringify(playlist)`, with or without indentation.
**Good hint (rung 3):** "Open the file the test writes (or `console.log(String([{a: 1}]))`). What's in it?"
**Rejected (see `wrong/`):** `appendFileSync` works on a new file, but saving twice to the same file leaves two JSON values that can't be parsed.
