# 05 · Saving objects

**Concept.** JSON can store plain data: text, numbers, lists, and dictionaries. It can't store methods, or which class an object was made from. So saving a `Playlist` writes down its name and songs, and loading that file gives back a plain dictionary, not a `Playlist`: it has no `total_seconds()` and no `.name`. To get a real object back, build a new one from the loaded data.

**Goal.** `load_playlist(path)` in `store.py` should give back a real `Playlist`, with the same name and songs that `save_playlist` saved, that you can keep using.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
