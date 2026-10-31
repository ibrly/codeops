**Task:** write `stats.py` from scratch: argv, read a file, parse lines, compute, print; a clean error for a missing file. Any hint makes it assisted.
**Lesson:** puts the module together into a program someone can run.
**Common mistakes:** reading `argv[0]`; not stripping newlines (so `int("240\n")` works but titles may carry spaces); not skipping blank lines; letting the exception escape (the exit code is 1, but stderr shows a traceback, which the test rejects).
**Not tested:** an empty file. If the learner asks, it's a good conversation about what the program should print.
**Uses:** subprocess (the test runs stats.py as a program).
