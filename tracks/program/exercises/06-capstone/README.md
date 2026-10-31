# 06 · Capstone: a real command-line program

**This is the Building a Program capstone,** and your first complete program. There's no planted bug: `stats.js` is empty, and you write it from scratch using this module's skills: reading arguments, reading a file, and printing results. Your tutor will mostly ask you questions to help you think it through. If you ask for help, it can point you to where to look or give a small nudge, but it won't show you any code or the answer. Any hint records the capstone as *assisted*. That's fine: you can reset it with a fresh copy and finish it on your own another day, which counts as completing it.

**Goal.** Running

```bash
node stats.js songs.txt
```

on a file with one `Title,seconds` song per line, like

```text
Intro,60
Middle,150
Outro,240
```

should print exactly:

```text
3 songs, 7:30 total, longest: Outro
```

Blank lines in the file are ignored. If the file can't be read, print `Can't read <file>` (with the name they typed) to the error output with `console.error`, and exit with code 1 (`process.exit(1)`).

**Run the test** (it runs your program for you):

```bash
node --test
```

**Done when** all the tests pass without any hints. Then you've built a real program and completed Building a Program.
