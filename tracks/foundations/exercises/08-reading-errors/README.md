# 08 · Reading error messages

**Concept.** When JavaScript crashes, the error message tells you three things: the *kind* of error (like `ReferenceError` or `TypeError`), a short description, and *where* it happened (the file and line number). A `ReferenceError: x is not defined` means the code used a name that doesn't exist, very often a typo. Reading the error carefully, before reading the code, usually takes you straight to the problem.

**Goal.** `countSongs(playlist)` should give back how many songs are in the playlist. Right now it crashes.

**Run the test:**

```bash
node --test
```

Before you change anything, read the error message and find the file and line it points to.

**Done when** all the tests pass.
