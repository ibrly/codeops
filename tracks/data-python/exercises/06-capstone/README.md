# 06 · Capstone: merge two playlists

**This is the Working with Data capstone.** There's no planted bug. The function is empty, and you write it from scratch using what this module practiced: loops, copies, dictionaries or sets as lookups, and not changing your inputs. Your tutor will mostly ask you questions to help you think it through. If you ask for help, it can point you to where to look or give a small nudge, but it won't show you any code or the answer. Any hint records the capstone as *assisted*. That's fine: you can reset it with a fresh copy and finish it on your own another day, which counts as completing it.

One new tool helps here. A **set** remembers things you've seen and answers `x in seen` quickly: start with `seen = set()` and add to it with `seen.add(x)`. A dictionary can't go in a set, but a **tuple**, a fixed pair of values written `(title, artist)`, can.

**Goal.** `merge_playlists(a, b)` should give back one new playlist with every song from `a`, then every song from `b`, but each song only once. Two songs are the same if they have the same `"title"` **and** `"artist"`. Keep the first copy you see. Don't change `a` or `b`.

**Run the test:**

```bash
python3 -m unittest
```

**Done when** all the tests pass without any hints. Then you've completed Working with Data.
