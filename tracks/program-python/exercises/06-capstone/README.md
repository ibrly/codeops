# 06 · Capstone: a real command-line program

**This is the Building a Program capstone,** and your first complete program. There's no planted bug: `stats.py` is empty, and you write it from scratch using this module's skills: reading arguments, reading a file, and printing results. Your tutor will ask you questions to help you think it through, but won't point at problems, give hints, or show code. If you do take a hint, the capstone is recorded as *assisted*, and you can reset it and redo it on your own another day.

**Goal.** Running

```bash
python3 stats.py songs.txt
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

Blank lines in the file are ignored. If the file can't be read, print `Can't read <file>` (with the name they typed) to the error output, with `print(..., file=sys.stderr)`, and exit with code 1 (`sys.exit(1)`).

**Run the test** (it runs your program for you):

```bash
python3 -m unittest
```

**Done when** all the tests pass without any hints. Then you've built a real program and completed Building a Program.
