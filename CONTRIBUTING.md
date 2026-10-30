# Contributing to CodeOps

Thanks for wanting to help! CodeOps is a project about learning, so first-time contributors are especially welcome. If you've never opened a pull request before, this is a fine place to start.

## Where things stand

CodeOps is in early development (see the [README](README.md#roadmap)). Right now the most useful contributions are:

- **Feedback on the plan** in [docs/mission.md](docs/mission.md): open an issue if something seems wrong, missing, or overbuilt.
- **Ideas for Foundations exercises:** a small bug that teaches one concept well. Use the "New exercise or track" issue template.
- **Fixes** to typos, unclear wording, or broken links.

Once the Foundations module lands, adding exercises and tracks will be the main way to contribute, and there will be a written recipe for it.

## How to make a change

1. **Open or find an issue first** for anything bigger than a typo, so we can agree on the approach before you spend time on it.
2. **Fork** the repository and create a branch: `git checkout -b fix-readme-typo`.
3. **Make your change.** Keep it focused: one pull request, one idea.
4. **Run the checks locally** (requires [Node.js](https://nodejs.org/) 18 or newer, no install step):

   ```bash
   node scripts/check-links.mjs
   ```

5. **Open a pull request** and fill in the template. Small, clear PRs get reviewed fastest.

Stuck on any step? Open a draft PR or an issue and ask. Questions are contributions too.

## Ground rules

- **Nothing unbuilt in the repo.** No placeholder files, empty tracks, or "coming soon" stubs. If it isn't working, it lives in an issue, not a directory.
- **No new dependencies** without discussing it first. The project aims to run with plain Node.js.
- **Respect learner privacy.** Never commit real learner progress, transcripts, or personal data, even as examples.
- **Teach, don't solve.** Content and prompts should guide learners toward answers, following the hint ladder described in the plan.

## Code of Conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
