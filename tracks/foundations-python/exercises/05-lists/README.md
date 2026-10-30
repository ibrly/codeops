# 05 · Lists

**Concept.** Some list methods change the list *in place* and give back `None`: `.sort()`, `.append()`, and `.reverse()` all work this way. That makes `return titles.sort()` a classic trap, because the list gets sorted and then the function returns `None`. When you want a new sorted list back, use the built-in `sorted(titles)` instead, or sort first and return the list on the next line.

**Goal.** `sorted_titles(playlist)` should give back the song titles in alphabetical order, like `["Intro", "Long Road", "Outro"]`.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass.
