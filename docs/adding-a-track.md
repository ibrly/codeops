# Adding exercises and tracks

This is the recipe for contributing learning content to CodeOps. It's based on how the [Foundations track](../tracks/foundations/exercises) is built, so that's the best example to copy from.

## How an exercise works

Every exercise is a tiny program with **one planted problem** and **tests that fail until the learner fixes it**. The learner never reads a lesson page first. They run the test, read the failure, and get coached through the fix with the hint ladder in [teaching/CONTRACT.md](../teaching/CONTRACT.md).

That's why tests are the heart of every exercise. A test passing is the only thing that can mark an exercise as passed (see `bin/codeops-check`).

## Add an exercise to Foundations

1. **Pick one concept** a beginner gets wrong in a recognizable way. One exercise, one idea. If you need two bugs to explain it, it's two exercises.
2. **Create the exercise folder** `tracks/foundations/exercises/NN-short-name/` with:
   - `README.md`: the concept in 3 to 6 plain sentences, the goal, `node --test` to run it, and what "done" means. Look at [03-loops](../tracks/foundations/exercises/03-loops/README.md) for the shape. **Don't describe the bug.**
   - The code file: a few lines, realistic, with the planted problem. Use the playlist theme (songs with `title`, `artist`, `seconds`) so exercises feel connected.
   - A `*.test.js` file using only `node:test` and `node:assert`. Test the behavior, including an edge case where it matters.
3. **Create the solution folder** `tracks/foundations/solutions/NN-short-name/` with:
   - The fixed code file(s), with the same names as in the exercise.
   - `NOTES.md` for contributors and maintainers: the planted bug, the lesson, the fixes you'd accept, one good rung-3 hint, and a **`New in this exercise:`** line naming every construct a correct fix needs that no earlier exercise in the track taught. The exercise README must explain each of those, briefly, in its concept paragraph. Learners never see this folder.
   - Optionally, `wrong/<name>/` folders, each holding a plausible fix that breaks the spec (same file names as the exercise). `verify-exercises` requires every one of them to **fail**, which proves your tests are tight. When you find a wrong fix that passes, add it here and tighten the test.
4. **Verify it:**

   ```bash
   node scripts/verify-exercises.mjs
   ```

   This checks that your tests **fail** on the shipped code and **pass** with your solution. CI runs it on every pull request.
5. **Try it as a learner** if you have Claude Code. In an empty folder, run `claude --plugin-dir <path-to-your-codeops-clone>`, then `/codeops:practice NN`. Does the tutor coach you to the fix without giving it away? If it doesn't, the exercise README or the planted bug probably needs to be clearer.

Exercise numbers set the order learners see. If you insert one in the middle, renumber the folders after it in the same pull request.

## Add a new track

A track is a folder under `tracks/` with a `track.json`, an `exercises/` folder, and a `solutions/` folder. The helper scripts and `scripts/verify-exercises.mjs` discover tracks automatically, so **you don't need to change anything in `bin/`**.

`track.json` has four required keys and one optional one:

```json
{
  "title": "Programming Foundations (Python)",
  "language": "Python",
  "test": ["python3", "-m", "unittest"],
  "capstone": "10-capstone"
}
```

- `test` is the command that runs an exercise's tests, written as a list of arguments (never a shell string). It runs from inside the exercise folder and must exit 0 only when every test passes.
- `capstone` is the id of the exercise that, passed without hints, completes the track.
- `next` (optional) names the track a learner should move to after completing this one. It must exist.

`node scripts/verify-exercises.mjs` checks the structure as well as the tests: only these keys in `track.json`, a capstone that's one of the exercises, exercises numbered `01`, `02`, … with no gaps, a `README.md` that shows the test command and a test file in every exercise, a `NOTES.md` in every solution, and no solution folders without an exercise.

Before you build a track, **open an issue** with the "New exercise or track" template so we can agree on the audience and the end goal. Then:

1. Build **the whole first module** (5 or more exercises) before opening the pull request. Don't add placeholder exercises or empty folders. CodeOps only ships what works.
2. Keep the same rules: one concept per exercise, tests as the source of truth, no dependencies beyond the language's standard tooling, and solutions kept separate.
3. If the track's language isn't already installed in CI, add a setup step for it to `.github/workflows/validate.yml` so `verify-exercises` can run its tests.
4. Mention the track in the onboarding language question in `skills/start/SKILL.md`.

## Add a second module

A module is just another track that follows an earlier one. Build it once per language, with the language as a suffix except for JavaScript: for example `data` and `data-python`, following `foundations` and `foundations-python`. Then set `next` in the earlier track's `track.json` so learners who finish it are pointed to yours. `verify-exercises` checks that the two language versions line up: the same number of exercises, the same numbering and capstone, and `next` set in both or neither. Exercise names may differ where the languages genuinely do, like `05-arrays` and `05-lists`. Exercise ids start again at `01` in every track, and progress is kept per track, so nothing else needs to change.

## Search and fast-moving topics

Foundations doesn't use web search: the fundamentals don't change, and the tutor never searches for an exercise's solution. Tracks on fast-moving tools (frameworks, cloud services, AI APIs) can point learners to **official documentation** only, such as MDN, nodejs.org, or a framework's own docs, and should date anything that's version-specific.
