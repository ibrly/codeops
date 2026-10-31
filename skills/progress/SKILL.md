---
name: progress
description: Show your CodeOps learning progress honestly, including what was assisted and what's due for review.
disable-model-invocation: true
allowed-tools: Bash(codeops-exercise *) Bash(codeops-recall)
---

# CodeOps: progress

## Exercises

!`codeops-exercise --list`

## Recall checks

!`codeops-recall`

## Concepts the learner needed help with

!`cat .codeops/mistakes.md 2>/dev/null || echo "None logged."`

## Learner notes

!`cat .codeops/notes.md 2>/dev/null || echo "NO_NOTES"`

## What to do now

Summarize the learner's progress in a short, honest, encouraging message. Don't run any other commands.

- **Done:** how many exercises are `passed`, and how many `assisted`. Explain `assisted` in one neutral line: they got there with the direct answer, so it's worth revisiting, and that's normal.
- **Track complete?** Only if the capstone named on the `Track:` line is `passed`. Not if it's `assisted` or anything else.
- **Strengths:** name one or two concepts they handled without help.
- **To revisit:** concepts from the help log, and any recall checks due now.
- **Next step:** one concrete suggestion: the next exercise (`/codeops:practice`), a due recall check (`/codeops:start` runs it), or `/codeops:teach` on something they've passed.

If the notes say `NO_NOTES`, they haven't started yet. Suggest `/codeops:start`.

Never round up. If nothing has passed, say so kindly. Keep it under 150 words.
