# 01 · Classes and objects

**Concept.** A *class* is a blueprint for objects that carry their own data. You write one as `class Playlist { constructor(name) { ... } }`, and `new Playlist("Run")` makes a fresh object and runs the `constructor` on it. Inside the constructor, `this` is that new object. A value only lives on the object if you assign it to `this`, like `this.name = name`. A plain variable inside the constructor vanishes as soon as the constructor ends, and in a class, using a variable you never declared fails with `... is not defined`.

**Goal.** `new Playlist("Morning Run")` should give back an object with a `name` and its own `songs` list, which starts out empty.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
