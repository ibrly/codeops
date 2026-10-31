# 03 · Reading a file

**Concept.** `fs.readFileSync(path)` reads a file, but on its own it gives back a *Buffer*: raw bytes, not text. Text methods like `.split` don't exist on a Buffer, so you get `... is not a function`. Tell it how to decode the bytes, `fs.readFileSync(path, "utf8")`, and you get a string back.

**Goal.** `readTitles(path)` should read a file with one song title per line and give back the titles as a list, like `["Intro", "Outro"]`, skipping blank lines.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
