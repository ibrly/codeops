# Changelog

All notable changes to CodeOps. Versions match `version` in `.claude-plugin/plugin.json`, and each release is tagged `codeops--v<version>`.

## 0.8.0

Smoke-tested: 47/47 checks, Claude Code 2.1.314, 2026-10-31.

### Fixed

- **Only the shipped tests count.** A second review found that an early exit plus an extra learner test file (or a skipped Python module plus a learner `test_mine.py`) could still record *passed*. The check now runs only the exercise's shipped test files and requires exactly their number of tests to pass, with none skipped.
- The smoke test now covers a Building a Program exercise too, so all three modules are tested with real tutoring sessions.
- The home-folder rule now holds when the home path's letter case differs (macOS, and Windows where `c:\` vs `C:\` is common).
- On Windows, `--reset` copies and empties a folder that's in use instead of crashing, and progress writes retry briefly when another program has the file open.
- CI requires each reference solution to run exactly the counted number of tests, and applies `wrong/` fixtures on top of the reference solution.

### Added

- **Progress across every track.** `codeops-exercise --tracks` shows passed, assisted, and complete for each track the learner has started, and `/codeops:progress` reports on all of them, so finishing Foundations and moving on doesn't hide it.

- **Safe intake for contributed exercises.** A `CODEOWNERS` file, an exercise review checklist in CONTRIBUTING, and two new `verify-exercises` rules: network or process modules in exercise code must be justified in `NOTES.md` (`**Uses:**`), and new exercises must ship a `wrong/` fixture (older ones are listed in `scripts/wrong-fixture-backlog.txt`).

### Changed

- **When the tutor is wrong.** The contract tells the tutor to re-check when a learner disputes it and to admit a mistake plainly, and never to change progress because of an argument. The README says how to keep or delete your data.
- **Less duplication.** The recall warm-up and the capstone rule are each stated once, in the contract; skills point to it. The methods table in the contract renders all seven rows again. `docs/mission.md`, the original v0.1 build plan, is removed (it's in git history) because it described an outdated layout.

## 0.7.0

### Changed

- **Clearer first steps.** The README explains how a session works (a code editor plus Claude Code, and running tests with the `!` prefix), and the tutor gives the exact `!` command and file for each exercise. Module headings show their track names.
- Every helper has a `--help`, and a missing or wrong argument says what to do instead of printing empty quotes. The recall usage lists `add`.
- Check output drops Node's internal stack frames and test-runner bookkeeping, so every failure's message fits on screen (before, the first failure could be cut off). After a pass, it says what's next; recall says when the next check is due.
- **Behavior evals:** `claude plugin eval` can't run CodeOps' helpers yet, so the smoke test remains the behavior test (see CONTRIBUTING).
- The help log writes `fresh_copy: N` only after a reset, instead of an `attempt: 0` that read like a test-run count. Older `attempt:` entries still work.

## 0.6.0

### Fixed

- **Tests that accepted wrong fixes.** A content audit found fixes that broke the spec but passed: comparing whole songs in the merge capstones, rethrowing after the error message in the JS stats capstone, an argv check instead of the `__main__` guard, and pre-filtering lines in the error-scope exercises. The tests now reject them, and each is kept as a `wrong/` fixture that CI requires to fail.
- The JavaScript and Python `parseSong` in Working with Data now reject the same lines, and `verify-exercises` flags paired exercises whose test counts differ unless `NOTES.md` explains why.
- **One capstone rule everywhere.** The contract now states the capstone exception (help stops at rung 3, no code, any hint makes it assisted), and all capstone READMEs say the same thing.

### Changed

- The README's example session was re-captured from a run that follows the current contract, and its claims now match what's tested (Modules 1 and 2 are smoke-tested; every exercise is verified in CI).
- JavaScript Building a Program exercise `05-running-a-program` is renamed `05-async-await`, matching what it teaches, and its test also runs the file as a program. (Progress recorded under the old name in 0.5.0 isn't carried over.)
- The contract says skills may tighten its rules but never loosen them. The escape hatch logs before giving the answer, in one step. Practice asks one question per reply. Recall pacing is written down once.

## 0.5.0

### Added

- **Module 3: Building a Program**, in JavaScript (`program`) and Python (`program-python`): modules, command-line arguments, reading a file, saving JSON, `async`/`await` (JavaScript) or the `__main__` guard (Python), and a capstone that's a complete command-line program. Working with Data points to it as the next track.
- A **"The tutor felt wrong" issue form** whose fields map to the teaching contract, and a README troubleshooting table.
- `verify-exercises` checks that a module's JavaScript and Python versions line up.
- **Start by asking.** Saying "I want to learn to code" (or asking to be guided rather than given the answer) starts CodeOps without knowing `/codeops:start`. Ordinary coding requests don't.

### Changed

- Onboarding asks three questions instead of five: the conversation language is taken from how the learner writes, and interests are asked after the first exercise.
- After the last module, the tutor connects completion to the learner's own goal and suggests starting it with `/codeops:coach`.

### Fixed

- **A pass now requires the shipped tests to actually run and pass.** Exiting early (`process.exit(0)`, `os._exit(0)`) or a learner `unittest.py` shadowing Python's test runner could record *passed*. The check now needs the runner's own summary with at least the shipped number of tests passing.
- **No lost updates.** A check that runs while help is logged no longer overwrites the *assisted* mark; progress is re-read right before each write, and writes are atomic.
- Track names are validated, so a crafted name can't make helpers write outside the learner's folder.
- Interrupting a check stops its test processes; endless test output is capped instead of crashing the check.
- A `.codeops/` in the home folder no longer captures learning folders below it. Setting up an exercise prints its full path.

## 0.4.0

### Added

- **Module 2: Working with Data**, in JavaScript (`data`) and Python (`data-python`): returning early from a loop, copies vs references, counting with an object or dictionary, filter vs map, where to catch an error, and a capstone that merges two playlists. Foundations points to it as the next track.
- `track.json` can name a `next` track. The exercise list ends with "Track complete. Next: …", "Capstone assisted: redo …", or the next exercise.
- `verify-exercises` lints track structure: allowed `track.json` keys, a valid capstone and next track, gap-free numbering, a README with the test command and a test file in every exercise, `NOTES.md` in every solution, and no orphan solution folders.
- `/codeops:coach` and `/codeops:explain` open with a due recall check, so help logged there comes back.
- **Tutoring in the learner's language.** Onboarding asks which language to talk in. The tutor replies in it, keeps code, commands, errors, and `RESULT:` lines unchanged, and translates quoted errors. Exercises stay in English.
- **Pace.** Experienced learners are offered a jump to exercise 07 or the capstone. A returning learner stuck after 6+ test runs is offered a fresh copy or a short recap.

### Fixed

- **An exercise passed with help can now be redone.** `--reset` starts a new attempt, and an unaided pass on a later day earns *passed* (marked `redone`). Before, an assisted capstone made the track impossible to complete.
- The capstone READMEs said the tutor could give small hints; they now say that any hint records the capstone as *assisted*, matching what's checked.

## 0.3.0

### Added

- **`/codeops:explain`**: before committing, the learner explains their staged changes hunk by hunk, and gaps become recall checks. It reads the staged diff only and never stages, commits, or runs anything. This replaces the idea of a git pre-commit hook, which would have needed installing code into the learner's repo.
- `codeops-exercise --track` checks the track's language is installed (Python 3.10+) and gives install guidance instead of failing later.

### Changed

- **Minimum Node.js is now 20.** Node 18 is end-of-life. CI runs on Linux, macOS, and Windows with Node 20 and 22.
- Check output points at the learner's own files instead of the temp copy the tests ran in, on every platform.
- On Windows, Python is found as `python3`, `python`, or `py -3`.

### Fixed

- A test run that never finishes (an infinite loop) is stopped after 10 seconds and reported as `failing (timed out)`, instead of hanging.
- Helpers find the learner's root folder when run from inside an exercise folder, so help can't be logged to a stray `.codeops/`.
- A recall check can only be passed once it's due.
- An unknown track in `progress.json` gives a clear error instead of a crash.

## 0.2.0

### Added

- **Python Foundations track.** Ten exercises mirroring the JavaScript track, using Python's own pitfalls where the languages differ (`range()` off-by-one, `list.sort()` returning `None`, quoted vs variable dictionary keys, `ZeroDivisionError`, reading tracebacks). Stdlib only, Python 3.10 or later. Learners pick JavaScript or Python during onboarding.
- **`/codeops:coach`** for bugs and TODOs in the learner's own project. A read-only snapshot shows the tutor what changed and where the TODOs are. The tutor never edits the project, never runs its code, and never runs git commands that change anything. The learner runs their own tests.
- **`codeops-exercise --reset <id>`** gives a fresh copy of an exercise and saves the old attempt in `.codeops/backups/`.
- **`codeops-recall add`** logs the help a learner needed, with validated fields and dates, so the tutor never writes the log by hand.
- **`codeops-exercise --taught <id>`** records teach-back, so no skill edits `progress.json` by hand.
- Multiple-track support: each track has a `track.json` (title, language, test command, capstone), and helpers share `lib/tracks.js`.

### Changed

- **Exercises are checked against the original tests.** Editing a test file can no longer make an exercise pass. The learner's files are never modified, and the output says when their copy of a test differs.
- **Help logged after a pass still counts.** An escape hatch logged for an already-passed exercise makes it *assisted*.
- **Recall checks are paced.** At most 3 are shown per session, oldest first. The schedule is now 1 → 3 → 7 → 14 → 30 days, and a pass at 30 days retires the entry.
- `progress.json` is stored per track. Files from 0.1.0 migrate automatically the next time progress is saved.
- Exercise folders get a `.gitignore` for `__pycache__/` and `node_modules/`.

### Fixed

- A corrupted `progress.json` is no longer treated as empty and overwritten. The helpers stop and say what's wrong.
- `codeops-repo` finds TODOs in files that haven't been committed yet.

## 0.1.0

First release: the teaching contract, `/codeops:start`, `/codeops:practice`, `/codeops:review`, `/codeops:progress`, and `/codeops:teach`, with the JavaScript Foundations track.
