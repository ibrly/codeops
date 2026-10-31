**Planted bug:** `counts[artist] += 1` on a missing key raises `KeyError`.
**Lesson:** a new key has no starting value; initialize it before adding.
**Accepted fixes:** `counts.get(a, 0) + 1`, an `if a not in counts: counts[a] = 0` first, `collections.Counter`, or `defaultdict(int)` (convert to `dict` if needed; the test compares with `==`, so both pass).
**Good hint (rung 3):** "The traceback says `KeyError: 'Nina'`. What was in `counts` at that moment?"
