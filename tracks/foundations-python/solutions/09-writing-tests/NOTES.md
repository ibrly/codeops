**Task:** write `test_mine.py` that passes on the working code and fails on a case-sensitive version.
**Lesson:** a test is only useful if it would fail when the code is wrong; choose inputs that exercise the risky behavior.
**Common first attempt:** searching with the exact same casing (`"Nina"` for `"Nina"`). It passes on both versions, so the grader's last check fails. That's the teaching moment.
**Rejected (see `wrong/`):** A test that searches with the same casing (`"Nina"`) passes on both versions, so the grader's last check fails.
**Good hint (rung 3):** "What input would behave differently in the two versions?"
**Uses:** subprocess (the grader runs the learner's test against a broken copy).
