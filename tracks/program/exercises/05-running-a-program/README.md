# 05 · Waiting for slow work

**Concept.** Reading files and other slow work is often *asynchronous*: an `async` function gives back a *Promise*, an IOU for a value that isn't ready yet. To get the value itself, `await` the promise inside another `async` function. Forget the `await`, and you're working with the IOU instead of the data, so things like `.reduce` aren't there.

**Goal.** `totalSeconds(path)` should load a saved playlist file and give back the total number of seconds.

**Run the test:**

```bash
node --test
```

**Done when** all the tests pass.
