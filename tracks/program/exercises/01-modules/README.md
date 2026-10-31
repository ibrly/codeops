# 01 · Splitting code into files

**Concept.** Real programs are split across files, called *modules*. In Node.js, a file shares things by listing them in `module.exports`, and another file gets them with `require("./file")`. Anything a file doesn't export stays private to it. So if you `require` something that was never exported, you get `undefined`, and calling it fails with `... is not a function`.

**Goal.** `describeSong(song)` in `playlist.js` should give back text like `"Outro (4:00)"`. It uses `formatTime` from `helpers.js`.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
