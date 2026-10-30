# CodeOps

**Learn. Build. Evolve.** · *AI Guides. You Build.*

CodeOps is an open-source [Claude Code](https://code.claude.com/docs) plugin that teaches programming by making you think instead of handing you solutions. You fix small, deliberately broken programs, and an AI tutor coaches you to the answer one hint at a time.

> **Status: v0.1, early.** The first track, Programming Foundations (JavaScript, 10 exercises), works end to end. Expect rough edges, and please [report them](https://github.com/ibrly/codeops/issues/new/choose).

## Why CodeOps exists

AI coding assistants are very good at writing code for you. That's great when you already know how to program and terrible when you're trying to learn: you get working code and no new skills.

CodeOps flips the default. The tutor:

- **Climbs a hint ladder.** It asks clarifying questions first, then points to where the problem is, then gives a small hint, then a partial fix, and only then the full answer.
- **Lets you ask for the answer, at a small honest cost.** You give your best guess first and explain the fix back afterward, and the concept is scheduled for a quick recall check. You're never trapped, but skipping the thinking isn't free.
- **Measures progress with evidence.** An exercise counts as passed only when its tests pass. If you needed the direct answer, it's recorded as *assisted*, not passed.
- **Never edits your code.** It reads your files and runs your tests. You write every fix.

## Quick start

You need [Claude Code](https://code.claude.com/docs) (v2.1.275 or later) and [Node.js](https://nodejs.org/) 18 or later.

1. **Install the plugin.** In Claude Code, run:

   ```text
   /plugin install codeops --marketplace ibrly/codeops
   ```

   On older versions, use two steps: `/plugin marketplace add ibrly/codeops`, then `/plugin install codeops@codeops`.

2. **Make a folder to learn in** and open Claude Code there. CodeOps puts your exercises and progress in this folder.

   ```bash
   mkdir learn-to-code && cd learn-to-code && claude
   ```

3. **Start:**

   ```text
   /codeops:start
   ```

The tutor asks about your goals and experience, then you're off. The first time it runs one of its helper commands (`codeops-check` to run your tests, `codeops-recall` to schedule a review), Claude Code asks for permission. Choose the option to allow it from now on.

## Commands

| Command | What it does |
|---------|--------------|
| `/codeops:start` | Onboarding the first time; after that, recall checks that are due, then "resume where you left off" |
| `/codeops:practice [n]` | Open the next exercise (or exercise `n`) and get coached through it |
| `/codeops:review [path]` | A review of your code: up to three findings that point you at problems without fixing them |
| `/codeops:progress` | Your honest progress: passed, assisted, and what's due for review |
| `/codeops:teach [concept]` | Teach-back: the tutor plays a confused student, and you find and explain its mistake |

## An example session

From one real test run, trimmed with `...` but otherwise word for word. The learner said during onboarding that they're into running.

````text
> /codeops:practice 3

Exercise 3 is set up in codeops-foundations/03-loops/.

The idea: a for loop is like running laps. You need a starting point, a
rule for when to stop, and a step between laps. Arrays number their
items from 0, so a playlist with 3 songs has positions 0, 1, 2. If you
set the stop rule one lap off, you get an off-by-one error.
...
First, run the test from inside the exercise folder:
    cd codeops-foundations/03-loops
    node --test
What does the failure say?

> The test says 300 !== 330. Can you just fix total.js for me?

Sure. Before I show you, what's your best guess, even a rough one?

One clue to help you guess: the playlist is 330 seconds long, but the
code only added up to 300. So one song got left out.

> Oh, the loop stops one early! I changed it to i < songs.length. Is it done?

It passed: RESULT: 03-loops passed. You worked it out yourself from a
single clue, so I didn't need to show you any code.

Why it works: an array with n items has indexes 0 to n - 1. ...

Quick check on a different example:
    const splits = [312, 305, 298, 301, 290];
    for (let i = 0; i <= splits.length; i++) {
      console.log(splits[i]);
    }
Note the <=. What does the very last line it prints show, and why?
````

## Programming Foundations

Ten exercises about a small music-playlist program. Each one has one planted problem and tests that fail until you fix it:

1. Values and types
2. Conditionals
3. Loops
4. Functions
5. Arrays
6. Objects
7. Edge cases
8. Reading error messages
9. Writing your own test (your test has to catch a real bug)
10. **Capstone:** write a function from scratch, with hints capped at "nudge" and no escape hatch. Passing it unassisted is what completing Foundations means.

## Your data stays local

CodeOps keeps everything in the folder you learn in:

- `codeops-foundations/`: your copies of the exercises
- `.codeops/`: your notes, progress, and the concepts you needed help with. This folder ignores itself in git, so it's never committed by accident.

CodeOps itself sends nothing anywhere. Your conversations with the tutor go through Claude Code under its own terms.

## How it works

CodeOps is a Claude Code plugin: plain Markdown and a few small Node.js scripts, with no dependencies or servers.

```text
teaching/CONTRACT.md      the tutor's rules: hint ladder, escape hatch, tone, limits
skills/<name>/SKILL.md    the /codeops:* commands; each loads the contract
agents/code-reviewer.md   the reviewer subagent behind /codeops:review
bin/                      helpers the tutor runs: set up exercises, run tests, schedule recall
tracks/foundations/       exercises (shipped to learners) and solutions (for contributors)
scripts/                  checks: links, exercise verification, behavior smoke test
```

The behavior smoke test (`scripts/smoke-test.sh`) runs real tutoring sessions headlessly. It checks that the tutor doesn't edit the learner's code or paste the fix, that the escape hatch asks for a guess first, that progress is only recorded from test results, and that recall checks get scheduled.

## Roadmap

Ideas, roughly in priority order. Each will become an issue when someone picks it up:

- Learn from your own repo: coaching on real bugs and TODOs in your projects
- A Python version of Foundations
- A pre-commit hook that asks you to explain AI-written code before you commit it
- More tracks (frontend, backend, and others), built by contributors following [the recipe](docs/adding-a-track.md)

## Contributing

Contributions are welcome, including your first one. The most useful thing right now is to **try it as a learner and tell us where the tutor felt wrong**. Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started, and please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
