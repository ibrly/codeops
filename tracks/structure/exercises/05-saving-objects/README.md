# 05 · Saving objects

**Concept.** JSON stores plain data: names, numbers, lists, and objects made of those. It doesn't store methods, or which class an object was made from. So when you load it back with `JSON.parse`, you get a plain object with the same data, not a `Playlist`, and calling `loaded.totalSeconds()` fails with `... is not a function`. To get a real object back, rebuild it from the data with the class.

**Goal.** `loadPlaylist(path)` in `store.js` should give back a real `Playlist` with the same name and songs that `savePlaylist` saved, so its methods work.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
