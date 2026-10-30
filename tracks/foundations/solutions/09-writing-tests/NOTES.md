**Task:** write `my.test.js` that passes on the working code and fails on a case-sensitive version.
**Lesson:** a test is only useful if it would fail when the code is wrong; choose inputs that exercise the risky behavior.
**Common first attempt:** a test that searches with the exact same casing (`"Nina"` for `"Nina"`). It passes on both versions, so the grader's third check fails. That's the teaching moment.
**Good hint (rung 3):** "What input would behave differently in the two versions?"
