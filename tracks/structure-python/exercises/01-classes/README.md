# 01 · Classes and objects

**Concept.** A *class* is a blueprint for objects that carry their own data. `class Playlist:` defines one, and calling it, as in `Playlist("Run")`, makes a new object and runs its `__init__(self, name)` method, with `self` being that new object. A value is stored on the object, as an *attribute*, only if you assign it to `self.something`. A plain variable inside `__init__` disappears when `__init__` ends. `vars(p)` shows which attributes an object really has.

**Goal.** `Playlist("Morning Run")` should make a playlist with a `name` and its own list of `songs`, starting empty.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
