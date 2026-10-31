**Planted bug:** a typo, `cuont`, causes `ReferenceError: cuont is not defined`.
**Lesson:** read the error type, message, and file:line before reading code.
**Accepted fixes:** `return count` or `return playlist.length`.
**Coaching note:** start at rung 1 by asking the learner to read the error aloud: which kind, which name, which line?
**Rejected (see `wrong/`):** declaring `let cuont;` silences the `ReferenceError` but returns `undefined`.
