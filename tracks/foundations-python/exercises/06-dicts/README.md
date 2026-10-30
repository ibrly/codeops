# 06 · Dictionaries

**Concept.** A dictionary maps *keys* to values: `song["title"]` reads the value stored under the key `"title"`. The thing inside the brackets is an ordinary Python expression. `song["field"]` (in quotes) always means the literal key `"field"`, while `song[field]` (no quotes) uses whatever is *stored in* the variable `field`. When the key comes from a variable, leave the quotes off.

**Goal.** `update_field(song, field, value)` should set whichever field it's told to, so `update_field(song, "title", "New Name")` changes the song's title.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
