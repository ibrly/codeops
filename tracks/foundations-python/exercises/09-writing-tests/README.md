# 09 · Writing your own test

**Concept.** A test is a small program that checks another program. It calls a function with an input you choose and *asserts* what should come back, like `self.assertEqual(actual, expected)`. A good test is one that would catch a real bug. If the code were broken, the test would fail.

**This exercise is different:** `search.py` already works. Your job is to write a test good enough to catch a bug that someone could easily introduce later: making the search **case-sensitive**, so that searching for `"nina"` stops finding songs by `"Nina"`.

**Goal.** Create a file called `test_mine.py` in this folder with at least one test of `search_by_artist`. The grader runs your test twice: once against the working `search.py` (your test must **pass**), and once against a broken, case-sensitive copy (your test must **fail**).

Start from this shape:

```python
import unittest

from search import search_by_artist


class TestSearch(unittest.TestCase):
    def test_describe_what_you_are_checking(self):
        # call search_by_artist with a playlist and an artist name,
        # then assert what should come back
        pass
```

**Run the grader** (it runs your test too):

```bash
python3 -m unittest
```

**Done when** every test passes, including the grader's.
