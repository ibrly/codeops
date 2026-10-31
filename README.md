# CodeOps

**Learn. Build. Evolve.** · *AI Guides. You Build.*

CodeOps is an open-source [Claude Code](https://code.claude.com/docs) plugin that teaches programming by making you think instead of handing you solutions. You fix small, deliberately broken programs, and an AI tutor coaches you to the answer one hint at a time.

> **Status: early.** Three modules in JavaScript and Python, every exercise verified in CI, and real tutoring sessions smoke-tested in all three: Programming Foundations (10 exercises), Working with Data (6), and Building a Program (6). Expect rough edges, and please [report them](https://github.com/ibrly/codeops/issues/new/choose).

## Why CodeOps exists

AI coding assistants are very good at writing code for you. That's great when you already know how to program and terrible when you're trying to learn: you get working code and no new skills.

CodeOps flips the default. The tutor:

- **Climbs a hint ladder.** It asks clarifying questions first, then points to where the problem is, then gives a small hint, then a partial fix, and only then the full answer.
- **Lets you ask for the answer, at a small honest cost.** You give your best guess first and explain the fix back afterward, and the concept is scheduled for quick recall checks that space out from a day to a month, then retire once you've clearly got it. You're never trapped, but skipping the thinking isn't free.
- **Measures progress with evidence.** An exercise counts as passed only when its tests pass. If you needed the direct answer, it's recorded as *assisted*, not passed.
- **Never edits your code.** It reads your files and runs your exercise's tests (in your own projects, you run them). You write every fix.

### Words you'll see

- **Exercise:** a small program with one bug planted in it, plus tests that fail until you fix it.
- **Track:** a series of exercises in one language. Each one ends with a **capstone**, an exercise you write from scratch, without hints.
- **Hint ladder:** the tutor's help in steps, from a question to the full answer.
- **Escape hatch:** asking for the answer outright. You can, after a guess.
- **Assisted:** an exercise you finished with the answer shown or, on a capstone, with a hint.
- **Recall check:** a quick question, days later, on something you needed help with.
- **Teach-back:** you explain a concept to the tutor, who plays a confused student.

## Quick start

You need [Claude Code](https://code.claude.com/docs) (v2.1.275 or later) and [Node.js](https://nodejs.org/) 20 or later, which the helper scripts run on. For the Python track you also need [Python](https://www.python.org/) 3.10 or later.

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

The tutor asks about your goals, your experience, and whether you want to learn with JavaScript or Python, then you're off. The first time it runs one of its helper commands (`codeops-check` to run your tests, `codeops-recall` to schedule a review), Claude Code asks for permission. Choose the option to allow it from now on.

### How a session works

You'll have two things open:

- **A code editor** for writing your fixes. Any editor works; [VS Code](https://code.visualstudio.com/) is a free, popular choice. Open your learning folder in it, and the exercises appear inside `codeops-<track>/`.
- **Claude Code**, where you talk with the tutor.

To run an exercise's tests yourself, type `!` and the command in Claude Code. It runs in your terminal, and the tutor can see the output too:

```text
! (cd codeops-foundations/01-values-and-types && node --test)
```

The tutor tells you the exact folder and command for each exercise. (A second terminal window works too, if you prefer.)

## If something goes wrong

| What you see | What to do |
|---|---|
| `/codeops:start` stops with `env: node: No such file or directory`, or the tutor says Node.js isn't installed | Install [Node.js](https://nodejs.org/) 20 or later, restart Claude Code, and run `/codeops:start` again. CodeOps' helper commands need it, whichever track you choose. |
| `This track needs Python 3.10 or later` when choosing Python | Install Python from [python.org](https://www.python.org/downloads/), restart your terminal, and choose the Python track again. |
| Claude Code asks permission to run `codeops-check`, `codeops-recall`, or `codeops-exercise` | These are CodeOps' own helpers: running your exercise's tests, scheduling a review, setting up an exercise. Allow them. Choosing "don't ask again" saves you the prompt next time. |
| `/plugin install codeops --marketplace ibrly/codeops` isn't recognized | Your Claude Code is older than 2.1.275. Use the two-step install: `/plugin marketplace add ibrly/codeops`, then `/plugin install codeops@codeops`. Or update Claude Code. |
| The tutor said something that seems wrong | Tell it, in your own words ("I don't think that's right, because…"). It's told to check again against your files or the tests and to admit a mistake plainly. If it keeps being wrong, please [report it](https://github.com/ibrly/codeops/issues/new?template=tutor_behavior.yml). To include a summary of your progress with nothing personal in it, ask the tutor "please run codeops-exercise --report" and paste what it shows. |
| `.codeops/progress.json isn't valid JSON` | The progress file was damaged, and CodeOps stopped rather than overwrite it. Fix it, or move it aside to start progress fresh. |

CodeOps has no servers or account of its own, but the tutor is Claude, so a session counts toward your Claude plan's usage like any other conversation.

## Commands

| Command | What it does |
|---------|--------------|
| `/codeops:start` | Onboarding the first time; after that, recall checks that are due, then "resume where you left off" |
| `/codeops:practice [n]` | Open the next exercise (or exercise `n`) and get coached through it |
| `/codeops:review [path]` | A review of your code: up to three findings that point you at problems without fixing them |
| `/codeops:progress` | Your honest progress: passed, assisted, and what's due for review |
| `/codeops:teach [concept]` | Teach-back: the tutor plays a confused student, and you find and explain its mistake |
| `/codeops:coach [file or error]` | *After Foundations.* Coaching on a bug or a TODO (a note in code about work still to do) in **your own project**. Run it from that project's folder. The tutor reads your code but never edits it or runs it: you run your own tests and paste the output |
| `/codeops:explain` | *If you use git.* Before you commit (save a snapshot of your work): explain your staged changes (the ones you've marked for that commit), one piece at a time, so you understand every line you ship, including code an AI wrote |

## An example session

From one real test run, trimmed with `...` but otherwise word for word. The learner asks for the answer, so this shows the escape hatch and what it costs.

````text
> /codeops:practice 4

You're on 04 · Functions.

A function can do two different things with a result. It can show it:
console.log prints it on the screen for you to read. Or it can give it
back with return, so the rest of the program can use it. ...
Open codeops-foundations/04-functions/format.js. Then, from inside that
folder, run: node --test
What does the failing test say?

> I really don't get it. Just give me the answer please.

Sure. Before I show you, what's your best guess, even a rough one? If you
have no idea, that's fine too.

> My guess: maybe it prints the time but doesn't give it back?

Your guess is exactly right. I've noted this so we can do a quick recall
check later.

The fix. In format.js, line 5, change:
    console.log(minutes + ":" + rest);
to:
    return minutes + ":" + rest;
...
Make that change, then run node --test again. While it runs: in a
sentence or two, how would you explain the difference between
console.log and return?

> console.log only shows it on screen, return hands the value back to
> whoever called the function. I made the change, can you check it?

All 3 tests pass. The result is assisted, because you used the full
answer. That's fine; it only means a recall check will come up tomorrow.
...
Quick check, on a different example. What does this program print?
    function pace(km, minutes) {
      console.log(minutes / km);
    }
    const myPace = pace(5, 25);
    console.log("Pace: " + myPace);
````

## Programming Foundations

Track names: `foundations` (JavaScript) · `foundations-python`

Ten exercises about a small music-playlist program, in **JavaScript** or **Python**. Each one has one planted problem and tests that fail until you fix it. The Python track swaps in Python's own pitfalls where the languages differ, like `list.sort()` returning `None`.

1. Values and types
2. Conditionals
3. Loops
4. Functions
5. Arrays (JavaScript) or lists (Python)
6. Objects (JavaScript) or dictionaries (Python)
7. Edge cases
8. Reading error messages
9. Writing your own test (your test has to catch a real bug)
10. **Capstone:** write a function from scratch. The tutor can nudge but never shows code, and any hint marks it *assisted*. Passing it unassisted is what completing Foundations means.

## Working with Data

Track names: `data` (JavaScript) · `data-python`

The second module, for learners who've finished Foundations. The tutor points you to it when your Foundations capstone passes. It has six exercises on the same playlist program:

1. Returning early from a loop
2. Copies and references
3. Counting with an object (JavaScript) or dictionary (Python)
4. Filter vs map (JavaScript) or choosing vs transforming in a comprehension (Python)
5. Where to catch an error
6. **Capstone:** merge two playlists without duplicates, from scratch

## Building a Program

Track names: `program` (JavaScript) · `program-python`

The third module, where the playlist code becomes a real program you run from the terminal:

1. Splitting code into files (modules)
2. Command-line arguments
3. Reading a file
4. Saving data as JSON
5. Waiting for slow work with `async`/`await`, run as a program (JavaScript), or a file that's both a program and a module (Python)
6. **Capstone:** a complete `stats` command that reads a playlist file and prints a summary, with a clean error for a missing file

## Your data stays local

CodeOps keeps everything in the folder you learn in:

- `codeops-<track>/` (for example `codeops-foundations/` or `codeops-data-python/`): your copies of the exercises
- `.codeops/`: your notes, progress, and the concepts you needed help with. This folder ignores itself in git, so it's never committed by accident.

CodeOps itself sends nothing anywhere. Your conversations with the tutor go through Claude Code under its own terms.

To **keep** your work, copy those folders somewhere safe; to move to another computer, copy them into a new learning folder. To **delete** it, remove `.codeops/` and the `codeops-*` folders from your learning folder. There's nothing stored anywhere else.

## How it works

CodeOps is a Claude Code plugin: plain Markdown and a few small Node.js scripts, with no dependencies or servers.

```text
teaching/CONTRACT.md      the tutor's rules: hint ladder, escape hatch, tone, limits
skills/<name>/SKILL.md    the /codeops:* commands; each loads the contract
agents/code-reviewer.md   the reviewer subagent behind /codeops:review
bin/                      helpers the tutor runs: set up exercises, run tests, schedule recall
tracks/<track>/           track.json, exercises (shipped to learners), solutions (for contributors)
lib/tracks.js             shared track and progress helpers
scripts/                  checks: links, exercise verification, behavior smoke test
```

The behavior smoke test (`scripts/smoke-test.sh`) runs real tutoring sessions headlessly. It checks that the tutor doesn't edit the learner's code or paste the fix, that the escape hatch asks for a guess first, that progress is only recorded from test results, and that recall checks get scheduled.

## Roadmap

Ideas, roughly in priority order. Each will become an issue when someone picks it up:

- More tracks (frontend, backend, and others), built by contributors following [the recipe](docs/adding-a-track.md)

## Contributing

Contributions are welcome, including your first one. The most useful thing right now is to **try it as a learner and tell us where the tutor felt wrong**, using the ["The tutor felt wrong" issue form](https://github.com/ibrly/codeops/issues/new?template=tutor_behavior.yml). Its fields map to the five sections of the [teaching contract](teaching/CONTRACT.md). Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started, and please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues: see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
