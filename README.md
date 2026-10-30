# CodeOps

**Learn. Build. Evolve.** · *AI Guides. You Build.*

CodeOps is an open-source [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that teaches programming by making you think instead of handing you solutions.

> **Status: early development.** Nothing is installable yet. This repository currently holds the plan and the project's ground rules. The first working teaching loop is being built in public, one checkpoint at a time. See [Roadmap](#roadmap).

## Why CodeOps exists

AI coding assistants are very good at writing code for you. That's great when you already know how to program and terrible when you're trying to learn: you get working code and no new skills.

CodeOps flips the default. The AI acts as a tutor that:

- **Climbs a hint ladder.** It asks clarifying questions first, then points to where the problem is, then gives a small hint, then a partial fix, and only then the full answer.
- **Lets you ask for the answer, at a small honest cost.** You give your best guess first and explain the fix back afterward, and the concept is scheduled for a quick recall check later. You're never trapped, but skipping the thinking isn't free.
- **Measures progress with evidence.** An exercise counts as passed only when its tests pass, not because you or the AI said so.

## How it will work

The first module, **Programming Foundations**, is a small, deliberately buggy JavaScript program with failing tests. Each exercise is a planted bug that teaches one concept: types, conditionals, loops, functions, arrays, objects, edge cases, reading errors, and writing your own tests. It ends with a capstone you finish without the escape hatch.

Planned commands:

| Command | What it does |
|---------|--------------|
| `/codeops:start` | Onboarding the first time, then recall checks and "resume where you left off" |
| `/codeops:practice` | Open the next exercise and get coached through it |
| `/codeops:review` | Get a review of your changes (up to three findings, no rewrites) |
| `/codeops:progress` | See your honest progress, including what was assisted |
| `/codeops:teach` | Teach-back: the AI plays a confused student and you fix its mistakes |

Your progress stays on your machine in a gitignored `.codeops/` folder. Nothing about you is uploaded by CodeOps itself. Your AI assistant's own privacy terms still apply.

The full build plan, including design decisions and what's deliberately out of scope, is in [docs/mission.md](docs/mission.md).

## Roadmap

1. **The rule works:** the teaching contract and `/codeops:start`.
2. **The exercise works:** the Foundations broken repo, with tests driving progress.
3. **The loop works:** resume, review, recall checks, and teach-back across sessions.
4. **v0.1 release:** installable plugin, CI, and a real example session in this README.

Ideas for after v0.1:

- A Python port of Foundations
- Learning from your own repo's bugs and TODOs
- A pre-commit hook that asks you to explain AI-written code before committing it
- More tracks (frontend, backend, and others), added by contributors following a documented recipe

## Contributing

Contributions are welcome, including your first one. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started, and please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Security issues: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
