**Planted bug:** `readFileSync(path)` without an encoding returns a Buffer, which has no `.split`.
**Lesson:** files are bytes; you choose how to decode them into text.
**Accepted fixes:** `readFileSync(path, "utf8")`, or `.toString()` on the Buffer.
**Good hint (rung 3):** "What does `console.log(text)` show before the split? Does it look like text?"
