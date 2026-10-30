# 06 · Objects

**Concept.** You can read or set an object's properties in two ways. Dot notation, `song.title`, uses the property name exactly as written. Bracket notation, `song[name]`, uses whatever is *stored in* the variable `name`. When the property name comes from a variable, you need brackets: `song.name` looks for a property literally called `"name"`.

**Goal.** `updateField(song, field, value)` should set whichever field it's told to, so `updateField(song, "title", "New Name")` changes the song's title.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
