# Contributing to CodeOps

Thanks for wanting to help! CodeOps is a project about learning, so first-time contributors are especially welcome. If you've never opened a pull request before, this is a fine place to start.

## Good ways to help

- **Try it as a learner and report friction.** Where did the tutor give too much away, ask too many questions, or confuse you? Use the "The tutor felt wrong" issue form. This is the most useful contribution right now. A confirmed report becomes a scenario in the behavior smoke test (`scripts/smoke-test.sh`), which maintainers run by hand before each release, so the same problem doesn't come back unnoticed.
- **Add or improve an exercise.** Follow the recipe in [docs/adding-a-track.md](docs/adding-a-track.md).
- **Improve the teaching contract** in [teaching/CONTRACT.md](teaching/CONTRACT.md). Changes here affect every lesson, so include an example conversation showing the problem and how your change fixes it.
- **Fix** typos, unclear wording, or broken links.

## How to make a change

1. **Open or find an issue first** for anything bigger than a typo, so we can agree on the approach before you spend time on it.
2. **Fork** the repository and create a branch: `git checkout -b fix-readme-typo`.
3. **Make your change.** Keep it focused: one pull request, one idea.
4. **Run the checks locally** (requires [Node.js](https://nodejs.org/) 20 or newer, no install step):

   ```bash
   node scripts/check-links.mjs
   node scripts/verify-exercises.mjs
   node --test scripts/test-bin.mjs
   ```

   If you have Claude Code, also run `claude plugin validate --strict .`, and for changes to skills or the contract, `scripts/smoke-test.sh`. The smoke test runs real tutoring sessions headlessly with your own Claude login, so it isn't part of CI.

   **Why not `claude plugin eval`?** We tried it (Claude Code 2.1.314). Skills load in eval runs, but the plugin's `bin/` helpers aren't on the PATH there, so cases can't exercise `codeops-check` and the others. That held from both the home folder and a copy outside it. The only workaround is calling helpers by their full `${CLAUDE_PLUGIN_ROOT}/bin/...` path in every skill, which would put long, version-specific paths into learners' permission prompts. So `scripts/smoke-test.sh` stays the behavior test. If a later Claude Code puts plugin `bin/` on the PATH in eval runs, that's worth revisiting.

5. **Open a pull request** and fill in the template. Small, clear PRs get reviewed fastest.

Stuck on any step? Open a draft PR or an issue and ask. Questions are contributions too.

## Exercise review checklist

Exercise tests run on learners' own computers, so every new or changed exercise is reviewed against this list. Contributors: check it yourself before opening the pull request.

- [ ] Standard library only: no packages to install.
- [ ] No network access. Starting processes or using `child_process`/`subprocess` only when the exercise needs it, justified in `NOTES.md` with a `**Uses:**` line (`verify-exercises` enforces this).
- [ ] Tests write only to a temp folder, never to the learner's folder or home.
- [ ] One concept per exercise, and the README doesn't describe the bug.
- [ ] `NOTES.md` has the planted bug, accepted fixes, a rung-3 hint, and a `New in this exercise:` line.
- [ ] At least one `solutions/<id>/wrong/` fixture: a plausible fix that must fail (`verify-exercises` enforces this for new exercises).
- [ ] Someone tried it once as a learner with `/codeops:practice`.

## Ground rules

- **Nothing unbuilt in the repo.** No placeholder files, empty tracks, or "coming soon" stubs. If it isn't working, it lives in an issue, not a directory.
- **No new dependencies** without discussing it first. The project aims to run with plain Node.js.
- **Respect learner privacy.** Never commit real learner progress, transcripts, or personal data, even as examples.
- **Teach, don't solve.** Content and prompts should guide learners toward answers, following the hint ladder described in the plan.

## Code of Conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
