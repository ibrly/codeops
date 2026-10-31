**Planted bug:** `counts[song.artist] += 1` on a missing key computes `undefined + 1`, which is `NaN`.
**Lesson:** a new key has no starting value; initialize it before adding.
**Accepted fixes:** `(counts[a] || 0) + 1`, `(counts[a] ?? 0) + 1`, or an `if (!(a in counts)) counts[a] = 0` before incrementing.
**Good hint (rung 3):** "What's `({}).Nina`? And what's that plus 1?"
**Rejected (see `wrong/`):** setting `counts[a] = 0` before every increment resets the tally, so every artist ends at 1.
