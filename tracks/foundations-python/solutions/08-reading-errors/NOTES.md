**Planted bug:** a typo, `cuont`, raises `NameError: name 'cuont' is not defined`.
**Lesson:** read a traceback bottom-up: error type and message, then file and line.
**Accepted fixes:** `return count` or `return len(playlist)`.
**Coaching note:** start at rung 1 by asking the learner to read the last line of the traceback aloud.
