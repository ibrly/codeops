# 09 · Writing your own test

**Concept.** A test is a small program that checks another program. It calls a function with an input you choose and *asserts* what should come back: `assert.strictEqual(actual, expected)`. A good test is one that would catch a real bug. If the code were broken, the test would fail.

**This exercise is different:** `search.js` already works. Your job is to write a test good enough to catch a bug that someone could easily introduce later: making the search **case-sensitive**, so that searching for `"nina"` stops finding songs by `"Nina"`.

**Goal.** Create a file called `my.test.js` in this folder with at least one test of `searchByArtist`. The grader runs your test twice: once against the working `search.js` (your test must **pass**), and once against a broken, case-sensitive copy (your test must **fail**).

Start from this shape:

```js
const test = require("node:test");
const assert = require("node:assert");
const { searchByArtist } = require("./search");

test("describe what you're checking", () => {
  // call searchByArtist with a playlist and an artist name,
  // then assert what should come back
});
```

**Run the grader:**

```bash
node --test grader.test.js
```

**Done when** the grader passes.
