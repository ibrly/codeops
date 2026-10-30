# Mission: Build CodeOps v0.1

> **Implementation notes (v0.1).** This is the plan CodeOps was built from. Where the build differs, the docs won the argument:
> - Commands are **skills** (`skills/<name>/SKILL.md`), since Claude Code recommends skills over `commands/` for new plugins.
> - Helper scripts live in **`bin/`**. Skill shell injection can't read files outside the learner's folder, so skills call `codeops-contract`, `codeops-exercise`, `codeops-check`, and `codeops-recall` instead.
> - Recall intervals are 1 → 3 → 7 → 14 → 30 days. A pass at 30 days retires the entry, and `/codeops:start` shows at most 3 due checks per session.
> - Progress records `attempts` and `status`. How much help was needed is recorded in `.codeops/mistakes.md` (which `codeops-check` reads to mark *assisted*), not as a `hints_used` count.

You are building **CodeOps**, an open-source Claude Code plugin that teaches people to program by making them think instead of handing them solutions.

- **Tagline:** Learn. Build. Evolve.
- **Philosophy:** AI Guides. You Build.
- **License:** MIT
- **Repo:** `codeops`, public, on my authenticated GitHub account (published only after my confirmation)

## 0. What this version is, and what it isn't

v0.1 is **one teaching loop that works**, not a framework with six tracks.

The product is a teaching *behavior*: a hint ladder, a priced escape hatch, and progress based on evidence. Everything else is packaging. Only build what a real learner touches in the first module.

**Out of scope for v0.1. Do not create directories, stubs, or "coming soon" entries for:**

- Frontend, backend, fullstack, DevOps, or AI-engineering tracks
- A career-advisor agent
- Essays on pedagogy
- A seeded roadmap or seeded GitHub issues
- Badges, statistics, testimonials, or marketing copy

You can mention future tracks in one README sentence ("more tracks will come from contributors; here's the recipe"). Nothing else.

## 1. Work in checkpoints, not one pass

Do **not** build the whole thing in one autonomous run. Work in four checkpoints and **stop at the end of each one** to give me a short report and ask me to try it. Don't start the next checkpoint until I say so.

| # | Checkpoint | Done when |
|---|------------|-----------|
| 1 | **The rule works** | A single teaching contract file plus a `/codeops:start` command. I can open a real bug, ask for help, and the AI climbs the hint ladder instead of writing the fix. |
| 2 | **The exercise works** | The Foundations broken repo exists. I can fix one exercise, the tests go green, and the progress file updates from the test result. |
| 3 | **The loop works** | Resume, review, recall-due checks, the escape-hatch cost, and teach-back mode all work across two separate sessions. |
| 4 | **Publish** | Community files, CI, and README are done, then GitHub publication after my explicit confirmation. |

At each checkpoint, list what you built, what you tested and how, what broke, and what you'd change. Tell me plainly where the teaching felt wrong: the AI caved and wrote the code, asked too many questions, or was condescending.

## 2. Verify the platform before you build on it

Before checkpoint 1, check against the installed Claude Code version and the official docs:

- The **plugin** format: manifest, how commands, agents, and skills are discovered, and how commands are namespaced. The aim is for `/codeops:start` to come from the plugin namespace rather than a hack.
- The **subagent** frontmatter format.
- The **Agent Skills** format (`SKILL.md` and its frontmatter).
- How a user installs a plugin from a GitHub repo.

If the plugin route doesn't support something, fall back to a clone-and-open repo and say why. Don't invent configuration keys, and cite the docs page for each format you use.

**Test environment:** run all manual tests from a clean directory with no `CLAUDE.md` in any parent folder (e.g. `/tmp/codeops-test`). Claude Code loads `CLAUDE.md` files from parent directories, so unrelated personal instructions (for example in `~/CLAUDE.md`) would leak into the session and contaminate the tutor's behavior.

## 3. The teaching contract (the core of the product)

Write **one** file, `teaching/CONTRACT.md`, that every command and agent loads. It is the single source of truth for how CodeOps behaves.

### 3.1 The hint ladder

When a learner is stuck, climb one rung at a time and wait for an attempt between rungs:

1. **Clarify:** ask what they expect the code to do and what it actually does.
2. **Locate:** point to *where* the wrong assumption is (file, line, or concept), without saying what's wrong.
3. **Nudge:** one small conceptual hint, or a related tiny example that isn't their code.
4. **Partial:** show the shape of the fix (pseudocode, or one line with blanks).
5. **Full:** give the full fix and explain why it works. Only after the escape-hatch cost is paid (3.2).

After the fix, always explain the underlying concept in two or three sentences, then verify with one quick related question.

### 3.2 The priced escape hatch

Learners can always ask for the direct answer. CodeOps must not trap anyone or be preachy. But the answer has a visible, small cost:

- Before the answer: the learner types their best guess, even if it's wrong ("I have no idea" is allowed once per concept).
- After the answer: the learner explains the fix back in their own words.
- The concept goes into `mistakes.md` and gets a recall check scheduled (see 5).
- The exercise is marked `assisted` in progress, which is honest rather than a penalty.

This lives in the contract, not in each agent, so no agent can be "the one that caves."

### 3.3 When to use which method

No pedagogy essays. Claude already knows what Socratic questioning and spaced repetition are. Write **one table** in the contract with seven rows and three columns: *method → when to use it → what it looks like in a CodeOps turn*. Cover Socratic questioning, project-based learning, active recall, spaced repetition, deliberate practice, progressive difficulty, and learning by debugging. Keep each cell to one line.

### 3.4 Tone

Warm, brief, never condescending. One question at a time. No lectures before an attempt. If a learner is clearly frustrated twice in a row, offer the escape hatch proactively.

## 4. Agents: as few as possible

- **Teacher.** The main voice, handling onboarding, explaining, hinting, and choosing the next exercise. It's the main session driven by the commands and the contract, not a subagent, unless the docs show a real benefit.
- **Code reviewer.** A real subagent, because it needs a separate, focused context: it reads the learner's diff and returns at most three findings, ranked, with no rewrites. It follows the contract's ladder.

That's it for v0.1. If you think another agent is justified, propose it at a checkpoint with the reason. A different persona isn't a reason. Different tools or context is.

## 5. Progress: evidence, not claims

Progress is local and gitignored, in `.codeops/` in the learner's workspace:

- `progress.json`: per exercise, `status` (`not_started | in_progress | passed | assisted`), `attempts`, `hints_used` (highest ladder rung reached), and `passed_at`. **`passed` is set only by a test run that actually passes**, never because the learner or the AI says so. Add a small script (`scripts/check.js` or similar) that runs the tests and writes the result, and have commands call it.
- `mistakes.md`: an append-only log of concepts where the learner needed rung 4 or higher, or used the escape hatch, each with a `due:` date for recall.
- `notes.md`: the learner's goals and level from onboarding, in their own words.

**Spaced repetition without a scheduler:** `/codeops:start` reads `mistakes.md` first. If anything is due, it opens with one short recall question on it before new material. Intervals are 1 → 3 → 7 → 14 days, advancing on a correct answer and resetting on a miss.

Never commit learner data. `.gitignore` must cover `.codeops/`.

## 6. The Foundations module: a broken repo

Foundations is a **small, deliberately buggy program with failing tests**, not a set of lesson pages.

- **Language:** JavaScript on Node.js, tests via the built-in `node --test`, **zero npm dependencies**. Justify a different choice at checkpoint 2 if you have one.
- **Shape:** one small, relatable program (e.g. a CLI to-do list or a playlist manager) with 8–10 exercises. Each exercise is a planted bug or a missing function, plus a test that fails until it's fixed.
- **Progression:** the bugs climb in concept order: values and types → conditionals → loops → functions → arrays → objects → off-by-one and edge cases → reading error messages → writing your own test → a small unassisted capstone.
- **The capstone is the gate:** one exercise the learner must finish with the hint ladder capped at rung 3 and no escape hatch. That's what "completed Foundations" means.
- **Each exercise has** a short `README` covering the concept in 3–6 sentences, the goal, how to run its test, and what "done" means. Include an author's note for contributors with the planted bug and the intended lesson. Keep that note out of the learner's view (e.g. in a `solutions/` path the contract tells the AI not to reveal before rung 5).

### Fixed spine, flexible flesh

- **Fixed:** the concept order and the tests. They are what makes progress mean something and keep the repo testable.
- **Flexible:** the teacher may re-theme an exercise's *explanation and examples* to the learner's interests, pace, and level. It never changes the test or what counts as done.

## 7. Search policy

- **Foundations doesn't use web search.** The fundamentals are stable, and Claude knows them.
- **The AI never searches to find a solution** for the learner's exercise.
- **"Research mode" is a skill the learner practices:** when the learner wants to look something up, *they* search, then paste the source. The teacher asks how they judged it ("How old is this? Is it the official docs? Does it match what the test expects?").
- For future fast-moving tracks, search is limited to official documentation (MDN, nodejs.org, Python docs, etc.). Write this down as a rule for contributors. Don't build it now.

## 8. Teach-back mode

Add `/codeops:teach`, a practice mode where **the AI plays a confused student** working on a concept the learner has already passed. The student writes plausible buggy code and asks honest beginner questions. The learner has to find and explain the mistakes. There's no answer to ask for, so the escape hatch doesn't apply.

Keep it small: one prompt section in the contract plus one command. Score it in `progress.json` as `taught: true` on the concept.

## 9. Commands

Implement only these, using the namespace mechanism you verified in section 2:

| Command | Does |
|---------|------|
| `/codeops:start` | Onboarding the first time (goals, experience, preferred themes, written to `notes.md`), then on every later run: recall checks due, then "resume where you left off" |
| `/codeops:practice` | Opens the next exercise (or a named one) and coaches through it with the ladder |
| `/codeops:review` | Runs the code-reviewer subagent on the learner's current changes |
| `/codeops:progress` | Shows status from `progress.json` and `mistakes.md`, honestly, including `assisted` |
| `/codeops:teach` | Teach-back mode |

No `/codeops:tracks` or `/codeops:learn <topic>` until there's more than one track.

## 10. Tests and validation

- **Exercise tests:** every exercise's test fails on the shipped broken code and passes on the reference solution. Add a script that checks both, and run it in CI.
- **Static checks in CI** (GitHub Actions, no secrets needed): plugin, agent, and skill frontmatter parse and have the required fields, internal Markdown links resolve, and the `.gitignore` covers `.codeops/`.
- **Behavior smoke test (local, not CI):** a script that runs Claude Code headlessly (`claude -p` or the documented equivalent) against a planted exercise and asserts the first response **does not contain the fix**. It needs the learner's own Claude access, so it stays out of CI. Document how to run it.
- **Manual end-to-end:** at checkpoint 3, run a full session as a beginner: onboard, fail an exercise, climb the ladder, use the escape hatch once, pass, quit, start a new session, get a recall question, resume. Report the transcript highlights.

Don't add CI checks that can't pass in the initial repo.

## 11. Repository layout (suggested)

Keep it about this small. Improve it if the plugin docs require something different.

```text
codeops/
├── .claude-plugin/          # plugin manifest (per verified docs)
├── commands/                # start, practice, review, progress, teach
├── agents/
│   └── code-reviewer.md
├── skills/
│   └── debugging/SKILL.md   # only skills the loop actually uses
├── teaching/
│   └── CONTRACT.md          # hint ladder, escape hatch, method table, tone, search policy
├── tracks/
│   └── foundations/
│       ├── app/             # the broken program
│       ├── exercises/       # per-exercise README + test
│       └── solutions/       # reference fixes (contributor-facing)
├── scripts/                 # check.js, verify-exercises.js, smoke-test
├── docs/
│   └── adding-a-track.md    # the recipe, proven on Foundations
├── .github/workflows/validate.yml
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── .gitignore
```

One source of truth: never duplicate definitions between `.claude/` and the plugin directories.

## 12. Community files (checkpoint 4 only)

- **README:** what CodeOps is, why it exists, a 3-step quick start (install, `/codeops:start`, fix your first bug), a short real example session taken from your checkpoint-3 test (not invented), the commands, the honest limits, and how to contribute. No fake badges or claims.
- **CONTRIBUTING.md:** friendly to first-time contributors. The main contribution path is "add an exercise" or "add a track," following `docs/adding-a-track.md`.
- **CODE_OF_CONDUCT.md** (Contributor Covenant), **SECURITY.md**, **LICENSE** (MIT).
- **One** issue template for bugs and **one** for new exercises or tracks, plus a PR template.
- **No seeded roadmap or issues.** Issues will come from the friction real learners report. Instead, list three to five concrete "next" ideas in the README (e.g. a Python port of Foundations, a learner's-own-repo mode, a pre-commit "explain this AI code" hook).

## 13. GitHub publication (after my explicit confirmation)

Before creating anything:

1. Verify that `git` and `gh` are available, run `gh auth status`, and identify the account.
2. Check that `codeops` is available under that account and that nothing local or remote would be overwritten. If the name is taken, propose alternatives. Don't rename it without telling me.
3. Never publish under an organization without my approval.

Then, **only after I confirm**:

- Create the public repo `codeops`, default branch `main`.
- Description: "An open-source Claude Code plugin that teaches programming by making you think: hint ladders, real failing tests, and honest progress."
- Topics: `ai`, `education`, `learn-to-code`, `claude-code`, `claude-code-plugin`, `ai-agents`, `programming`, `open-source`
- Push, verify the remote, and confirm the README renders and that installing the plugin from the GitHub URL works from a clean directory.

## 14. Quality rules

- No placeholder content presented as complete. If it's not built, it's not in the repo.
- No unnecessary dependencies, no hardcoded personal paths, no secrets.
- No destructive shell commands without asking me.
- Ask me only when a decision can't be made safely. Otherwise decide, and note the decision in the checkpoint report.

## 15. Definition of done (v0.1)

- A stranger can install CodeOps from GitHub, run `/codeops:start`, and fix their first exercise without reading anything internal.
- The AI follows the hint ladder, and the smoke test shows it doesn't hand over the fix on the first response.
- `passed` only ever comes from a test run that passes.
- Progress, recall checks, and resume work across sessions.
- The Foundations capstone can be completed, and it is gated.
- CI passes, and the repo contains nothing unbuilt.
- `docs/adding-a-track.md` is good enough that someone could add a second track by following it.

## 16. Final report

1. Repo URL
2. What was built, and how each format choice maps to the Claude Code docs
3. Commands, agents, and skills, and what each actually does
4. Test results (CI, exercise verification, smoke test, manual end-to-end highlights)
5. Where the teaching still feels wrong
6. Known limitations
7. The three next milestones you'd recommend, and why

**Start with section 2 (verify the platform), then checkpoint 1. Stop and report at the end of checkpoint 1.**
