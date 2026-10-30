# Changelog

All notable changes to CodeOps. Versions match `version` in `.claude-plugin/plugin.json`, and each release is tagged `codeops--v<version>`.

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
