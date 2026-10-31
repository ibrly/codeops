**Planted bug:** the `try` wraps the whole loop, so the first bad line ends the loop and every line after it is lost.
**Lesson:** the scope of `try` decides how much an error cancels; put it around the one risky step.
**Accepted fixes:** move the `try`/`catch` inside the loop around `parseSong(line)`.
**Good hint (rung 3):** "After the `catch` runs, which line of code runs next?"
**Rejected (see `wrong/`):** filtering out lines without a comma first. It skips the lesson, and a line like `Oops,abc` still breaks it.
**New in this exercise:** `throw`, `try`/`catch`.
