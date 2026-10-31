---
name: progress
description: Show your CodeOps learning progress honestly, including what was assisted and what's due for review.
disable-model-invocation: true
allowed-tools: Bash(codeops-exercise *) Bash(codeops-recall)
---

# CodeOps: progress

## Exercises

!`codeops-exercise --list`

## Every track

!`codeops-exercise --tracks`

## Recall checks

!`codeops-recall`

## Concepts the learner needed help with

!`codeops-exercise --log`

## Learner notes

!`codeops-exercise --notes`

## What to do now

Summarize the learner's progress in a short, honest, encouraging message. Don't run any other commands.

- **Across tracks:** if they've started more than one track (the "Every track" list shows counts for started tracks only), say where they stand in each, in one line per track. A track is complete only if it says `complete`.
- **Done:** how many exercises are `passed`, and how many `assisted`. Explain `assisted` in one neutral line: they got there with the direct answer, so it's worth revisiting, and that's normal.
- **Track complete?** Use the last line of the exercise list exactly: `Track complete.`, `Capstone assisted`, or the next exercise. Never decide this yourself. If a next track is named, mention it. If the track is complete and there's no next track, connect it to their `## Goal`: suggest starting that project in its own folder with `/codeops:coach`. Not if it's `assisted` or anything else.
- **Strengths:** name one or two concepts they handled without help.
- **To revisit:** concepts from the help log, and any recall checks due now.
- **Next step:** one concrete suggestion: the next exercise (`/codeops:practice`), a due recall check (`/codeops:start` runs it), or `/codeops:teach` on something they've passed.

If the notes say `NO_NOTES`, they haven't started yet. Suggest `/codeops:start`.

Never round up. If nothing has passed, say so kindly. Keep it under 150 words.
