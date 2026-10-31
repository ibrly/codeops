**Planted bug:** the `try` wraps the whole loop, so the first bad line ends the loop and every line after it is lost.
**Lesson:** the scope of `try` decides how much an error cancels; put it around the one risky step.
**Accepted fixes:** move the `try`/`except` inside the loop around `parse_song(line)`. A bare `except:` passes the tests but is worth discussing.
**Good hint (rung 3):** "After the `except` block runs, which line of code runs next?"
