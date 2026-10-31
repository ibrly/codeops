**Task:** write `stats.js` from scratch: argv, read a file, parse lines, compute, print; a clean error for a missing file. Any hint makes it assisted.
**Lesson:** puts the module together into a program someone can run.
**Common mistakes:** reading `argv[1]`; forgetting `"utf8"`; not skipping blank lines (gives `NaN`); printing the error with `console.log` instead of `console.error`; an uncaught exception instead of `process.exit(1)` (the exit code is still 1, but stderr has a stack trace, and the test checks the message line).
**Not tested:** an empty file. If the learner asks, it's a good conversation about what the program should print.
