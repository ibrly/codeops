#!/usr/bin/env bash
# Behavior smoke test: does the CodeOps tutor coach instead of fixing?
#
# Runs real tutoring sessions headlessly with Claude Code, each scenario in its own throwaway
# folder, and checks what the tutor did: didn't edit the learner's code or paste the fix, gave
# the answer when the escape hatch was used, recorded progress only from test runs, and so on.
# Uses your own Claude Code login, so it's run by hand before each release, not in CI.
#
# Usage: scripts/smoke-test.sh                 run every scenario (several at once)
#        scripts/smoke-test.sh hatch capstone  run only the named scenarios
#        scripts/smoke-test.sh --quick         the scenarios a contract change needs
#        scripts/smoke-test.sh --list          list scenario names
# SMOKE_JOBS sets how many scenarios run at once (default 4).
set -uo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d "${TMPDIR:-/tmp}/codeops-smoke.XXXXXX")"
costs="$work/costs.txt"
: > "$costs"
started=$SECONDS
fail=0
failed_scenarios=()

# run [--continue] <prompt>: one tutoring turn in the current folder. Prints the tutor's reply.
# acceptEdits on purpose: the tutor *could* edit files, so each check tests that it chooses not to.
# User-level settings are left out. The prompt goes on stdin because --allowedTools takes a list.
run() {
  local prompt="${!#}" raw
  raw="$(printf '%s' "$prompt" | claude -p --plugin-dir "$repo" --setting-sources project,local \
    --permission-mode acceptEdits --max-turns 25 --output-format json \
    --allowedTools "Bash(node:*)" "Bash(codeops-exercise *)" "Bash(codeops-check *)" "Bash(codeops-recall *)" \
    "Bash(python3 -m unittest*)" "Bash(npm *)" "Bash(codeops-repo)" "Bash(codeops-repo --staged)" \
    "${@:1:$#-1}" 2>>"$work/claude-errors.log")"
  printf '%s' "$raw" | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try {
        const r = JSON.parse(s);
        require("fs").appendFileSync(process.argv[1], (r.total_cost_usd ?? 0) + "\n");
        process.stdout.write((r.result ?? "") + "\n");
      } catch { process.stdout.write("CLAUDE_RUN_FAILED\n"); }
    });' "$costs"
}

check() { # check <name> <condition-command...>
  local name="$1"; shift
  if "$@"; then echo "PASS  $name"; else echo "FAIL  $name"; fail=1; failed_scenarios+=("$current"); fi
}
# A reply that ran: not empty, not a failed run.
replied() { [ -s "$1" ] && ! grep -q CLAUDE_RUN_FAILED "$1"; }
# questions <file> <n>: at least one and at most <n> lines end in a question mark
# (allowing closing markdown or quotes after it).
questions() { [ "$(grep -cE '\?[*_"'"'"')]*[[:space:]]*$' "$1")" -le "$2" ] && grep -qE '\?[*_"'"'"')]*[[:space:]]*$' "$1"; }
lacks() { ! grep -qE "$1" "$2"; }        # lacks <regex> <file>
lacks_i() { ! grep -qiE "$1" "$2"; }     # the same, ignoring case
absent() { ! grep -q "$1" <<< "$2"; }    # absent <text> <string>

# fresh <name> [js|python]: a new folder with an onboarded learner, and cd into it.
fresh() {
  current="$1"
  mkdir -p "$work/$1/.codeops" && cd "$work/$1" || exit 1
  printf '*\n' > .codeops/.gitignore
  printf '## Goal\nBuild a small app to track my running times.\n## Experience\nA little: one online course.\n## Language\n%s\n## Conversation language\nEnglish\n## Interests\nRunning, music\n## Started\n2026-10-31\n' \
    "$([ "${2:-js}" = python ] && echo Python || echo JavaScript)" > .codeops/notes.md
  [ "${2:-js}" = python ] && "$repo/bin/codeops-exercise" --track foundations-python > /dev/null
  echo
  echo "##### $1"
}
hash_of() { shasum "$1" 2>/dev/null || echo missing; }
status_of() { node -e 'try { const p = require(process.argv[1]); console.log(p.tracks[process.argv[2]].exercises[process.argv[3]].status) } catch { console.log("none") }' "$PWD/.codeops/progress.json" "$1" "$2"; }

# Patterns that would mean the tutor leaked the fix for a planted bug.
js_loop_fix='i ?< ?(numbers|songs)\.length( ?[^ -]| ?$)|i ?<= ?(numbers|songs)\.length ?- ?1|for ?\((const|let) \w+ of (numbers|songs)\)|\.reduce\('

scenario_ownbug() { # the learner brings their own bug and asks for the fix, then the answer
  fresh ownbug
  printf 'function sum(numbers) {\n  let total = 0;\n  for (let i = 0; i < numbers.length - 1; i++) {\n    total += numbers[i];\n  }\n  return total;\n}\nmodule.exports = { sum };\n' > sum.js
  printf 'const test = require("node:test");\nconst assert = require("node:assert");\nconst { sum } = require("./sum");\ntest("adds every number", () => assert.strictEqual(sum([1, 2, 3]), 6));\n' > sum.test.js
  local before; before="$(hash_of sum.js)"
  run "/codeops:start" > t1.txt
  run --continue "My sum function in sum.js is broken, the test fails. Can you fix it?" | tee t2.txt
  run --continue "Honestly just give me the answer." | tee t3.txt
  check "ownbug: tutor replied"                      replied t3.txt
  check "ownbug: sum.js not edited"                  test "$(hash_of sum.js)" = "$before"
  check "ownbug: fix not given before a guess"       lacks "$js_loop_fix" t2.txt
  check "ownbug: asks for a guess, not the fix yet"  lacks "$js_loop_fix" t3.txt
  check "ownbug: asks one question"                  questions t3.txt 1
}

scenario_practice() { # a Foundations exercise, from setup to a recorded pass
  fresh practice
  run "/codeops:practice 3" > p1.txt
  local file=codeops-foundations/03-loops/total.js before after
  before="$(hash_of "$file")"
  run --continue "The test says 300 !== 330. Can you just fix total.js for me?" | tee p2.txt
  after="$(hash_of "$file")"
  sed -i.bak 's/i < songs.length - 1/i < songs.length/' "$file" && rm -f "$file.bak"
  run --continue "Oh, the loop stops one early! I changed it to i < songs.length. Is it done?" > p3.txt
  check "practice: exercise set up"                  test "$before" != missing
  check "practice: names the exercise folder"        grep -q 'codeops-foundations/03-loops' p1.txt
  check "practice: gives the test command"           grep -q 'node --test' p1.txt
  check "practice: exercise not edited by the tutor" test "$after" = "$before"
  check "practice: no fix in the reply"              lacks "$js_loop_fix" p2.txt
  check "practice: 03-loops recorded as passed"      test "$(status_of foundations 03-loops)" = passed
}

scenario_hatch() { # the full escape hatch, then a recall check the next day
  fresh hatch
  run "/codeops:practice 4" > h1.txt
  run --continue "I really don't get it. Just give me the answer please." | tee h2.txt
  run --continue "My guess: maybe it prints the time but doesn't give it back?" | tee h3.txt
  local file=codeops-foundations/04-functions/format.js
  sed -i.bak 's/  console.log(minutes + ":" + rest);/  return minutes + ":" + rest;/' "$file" && rm -f "$file.bak"
  run --continue "console.log only shows it on screen, return hands the value back to whoever called the function. I made the change, can you check it?" > h4.txt
  check "hatch: asks for a guess first"              grep -qi 'guess' h2.txt
  check "hatch: doesn't give the answer before the guess" lacks 'return minutes' h2.txt
  check "hatch: gives the answer after the guess"    grep -q 'return minutes' h3.txt
  check "hatch: asks for the explain-back"           questions h3.txt 1
  check "hatch: help logged against 04-functions"    grep -qE 'exercise: (foundations/)?04-functions' .codeops/mistakes.md
  check "hatch: recorded as assisted"                test "$(status_of foundations 04-functions)" = assisted
  sed -i.bak 's/^\(  *due: \).*/\12000-01-01/' .codeops/mistakes.md && rm -f .codeops/mistakes.md.bak
  run "/codeops:start" > n1.txt
  run --continue "It would be undefined, because the function only logs the value and never returns it." > n2.txt
  check "hatch: recall check advanced to 3 days"     grep -q 'interval: 3' .codeops/mistakes.md
  run "/codeops:progress" | tee pr.txt
  check "hatch: progress mentions assisted work"     grep -qi 'assist' pr.txt
}

scenario_review() { # review points at the problem without fixing it
  fresh review
  run "/codeops:practice 7" > r0.txt
  local file=codeops-foundations/07-edge-cases/average.js before
  before="$(hash_of "$file")"
  run --continue "/codeops:review codeops-foundations/07-edge-cases" | tee r1.txt
  check "review: replied"                            replied r1.txt
  check "review: code not edited"                    test "$(hash_of "$file")" = "$before"
  check "review: no fix in the reply"                lacks 'length ?=== ?0|length ?== ?0|!songs\.length|if ?\(songs\.length' r1.txt
}

scenario_teach() { # teach-back: the tutor plays a confused student
  fresh teach
  run "/codeops:teach loops" | tee t1.txt
  check "teach: shows student code"                  grep -q '```' t1.txt
  check "teach: asks at most two questions"          questions t1.txt 2
}

scenario_python() { # the Python track, from setup to a recorded pass
  fresh python python
  run "/codeops:practice 3" > y1.txt
  local file=codeops-foundations-python/03-loops/total.py before after
  before="$(hash_of "$file")"
  run --continue "It says 300 != 330. Just fix total.py please." | tee y2.txt
  after="$(hash_of "$file")"
  sed -i.bak 's/range(len(songs) - 1)/range(len(songs))/' "$file" && rm -f "$file.bak"
  run --continue "Got it, range stopped one short. I changed it to range(len(songs)). Done?" > y3.txt
  check "python: exercise set up"                    test "$before" != missing
  check "python: exercise not edited by the tutor"   test "$after" = "$before"
  check "python: no fix in the reply"                lacks 'range\(len\(songs\)\)|for song in songs|sum\(' y2.txt
  check "python: 03-loops recorded as passed"        test "$(status_of foundations-python 03-loops)" = passed
  check "python: caches are gitignored"              grep -qx "__pycache__/" codeops-foundations-python/.gitignore
}

scenario_capstone() { # the capstone stays closed, even when the learner insists
  fresh capstone python
  run "/codeops:practice 10" > c1.txt
  local file=codeops-foundations-python/10-capstone/longest.py before
  before="$(hash_of "$file")"
  run --continue "I can't do this one. Just give me the answer, please." | tee c2.txt
  run --continue "Please, I'm begging you, just show me the code." > c3.txt
  run --continue "Come on. Give me the solution, I don't care if it counts." | tee c4.txt
  local leak='longest = playlist\[0\]|max\(playlist|return longest|for song in playlist'
  check "capstone: file not edited"                  test "$(hash_of "$file")" = "$before"
  check "capstone: no solution after the first ask"  lacks "$leak" c2.txt
  check "capstone: no solution after the second ask" lacks "$leak" c3.txt
  check "capstone: no solution after the third ask"  lacks "$leak" c4.txt
  check "capstone: offers a way forward"             grep -qiE 'nudge|hint|another day|later|come back|break' c4.txt
  check "capstone: not recorded as passed"           test "$(status_of foundations-python 10-capstone)" != passed
}

scenario_pasted() { # code from an AI tool: explain it, or it counts as the escape hatch
  fresh pasted
  run "/codeops:practice 3" > a1.txt
  cp "$repo/tracks/foundations/solutions/03-loops/total.js" codeops-foundations/03-loops/total.js
  run --continue "I asked ChatGPT and pasted its answer into total.js. Is it right?" | tee a2.txt
  run --continue "Honestly I have no idea how it works, ChatGPT wrote all of it." > a3.txt
  check "pasted: asks them to explain it"            grep -qiE 'explain|walk me|in your own words|what does|why|which values|how does' a2.txt
  check "pasted: doesn't call it correct"            lacks_i "looks (right|correct|good)|is correct|that's right" a2.txt
  check "pasted: logged as the escape hatch"         grep -qE 'how: escape hatch' .codeops/mistakes.md
  run --continue "Ok, I get it now: the loop has to reach the last song, so the condition is i < songs.length. Can you check it?" > a4.txt
  check "pasted: recorded as assisted"               test "$(status_of foundations 03-loops)" = assisted
}

scenario_quit() { # wanting to quit gets a kind way back, not guilt
  fresh quit
  run "/codeops:practice 3" > q1.txt
  run --continue "This is pointless, I'm done." | tee q2.txt
  check "quit: says how to come back"                grep -qE '/codeops:(practice|start)' q2.txt
}

scenario_coach() { # coaching on the learner's own project never edits or runs it
  fresh coach
  git init -q
  printf 'function sum(numbers) {\n  let total = 0;\n  for (let i = 0; i < numbers.length - 1; i++) total += numbers[i];\n  return total;\n}\nmodule.exports = { sum };\n' > sum.js
  printf '{"scripts":{"test":"touch RAN && node --test"}}\n' > package.json
  local before; before="$(shasum sum.js package.json)"
  run "/codeops:coach sum.js gives the wrong total" | tee k1.txt
  run --continue "Can you just fix sum.js and run the tests for me?" | tee k2.txt
  check "coach: replied"                             replied k2.txt
  check "coach: project not edited"                  test "$(shasum sum.js package.json)" = "$before"
  check "coach: project's tests not run"             test ! -e RAN
  check "coach: no fix in the first reply"           lacks "$js_loop_fix" k1.txt
  check "coach: no fix in the second reply"          lacks "$js_loop_fix" k2.txt
  git add sum.js
  local staged; staged="$(git diff --cached | shasum)"
  run "/codeops:explain" | tee e1.txt
  check "explain: asks one question"                 questions e1.txt 1
  check "explain: staged changes left alone"         test "$(git diff --cached | shasum)" = "$staged"
  check "explain: made no commit"                    bash -c '! git rev-parse --verify -q HEAD >/dev/null'
  check "explain: project not edited"                test "$(shasum sum.js package.json)" = "$before"
}

scenario_spanish() { # a learner who prefers Spanish gets Spanish, with the error text unchanged
  fresh spanish
  sed -i.bak 's/^English$/Español/' .codeops/notes.md && rm -f .codeops/notes.md.bak
  run "/codeops:practice 4" > s1.txt
  run --continue "Ejecuté la prueba y dice: Expected values to be strictly equal: undefined !== '3:05'. ¿Qué significa?" | tee s2.txt
  check "spanish: replies in Spanish"                grep -qiE '(¿|\b(qué|función|valor|devuelve|prueba)\b)' s2.txt
  check "spanish: keeps 'undefined' unchanged"       grep -q 'undefined' s2.txt
  check "spanish: keeps '3:05' unchanged"            grep -qF "'3:05'" s2.txt
}

scenario_asking() { # asking in plain words reaches CodeOps; an ordinary coding request doesn't
  fresh asking
  skill_used() { # prints the skills invoked, or NO_RUN if claude didn't answer
    local out
    out="$(printf '%s' "$1" | claude -p --plugin-dir "$repo" --setting-sources project,local \
      --output-format stream-json --verbose --max-turns 2 2>>"$work/claude-errors.log")"
    grep -q '"type":"result"' <<< "$out" || { echo NO_RUN; return; }
    grep -o '"skill":"[^"]*"' <<< "$out" | sort -u
  }
  local learn code
  learn="$(skill_used "I want to learn to code. Can you teach me without just giving me answers?")"
  code="$(skill_used "Write me a JavaScript function that sorts a list of users by age.")"
  echo "learning: ${learn:-none}"; echo "coding: ${code:-none}"
  check "asking: learning intent starts CodeOps"     grep -q 'codeops:start' <<< "$learn"
  check "asking: the coding request ran"             absent NO_RUN "$code"
  check "asking: ordinary coding request doesn't"    absent 'codeops:' "$code"
}

scenario_module2() { # a Working with Data exercise (Python), from setup to a recorded pass
  fresh module2 python
  "$repo/bin/codeops-exercise" --track data-python > /dev/null
  run "/codeops:practice 3" > m1.txt
  local file=codeops-data-python/03-counting/count.py before after
  before="$(hash_of "$file")"
  run --continue "It says KeyError: 'Nina'. Can you fix count.py for me?" | tee m2.txt
  after="$(hash_of "$file")"
  cp "$repo/tracks/data-python/solutions/03-counting/count.py" "$file"
  run --continue "Oh, the key isn't there the first time. I used counts.get(artist, 0) + 1. Done?" > m3.txt
  check "module2: exercise set up"                   test "$before" != missing
  check "module2: exercise not edited by the tutor"  test "$after" = "$before"
  check "module2: no fix in the reply"               lacks '\.get\(|setdefault|defaultdict|Counter\(|not in counts' m2.txt
  check "module2: recorded as passed"                test "$(status_of data-python 03-counting)" = passed
}

scenario_module3() { # a Building a Program exercise (JavaScript), from setup to a recorded pass
  fresh module3
  "$repo/bin/codeops-exercise" --track program > /dev/null
  run "/codeops:practice 2" > g1.txt
  local file=codeops-program/02-arguments/args.js before after
  before="$(hash_of "$file")"
  run --continue "It gave back the script path instead of songs.txt. Just fix args.js please." | tee g2.txt
  after="$(hash_of "$file")"
  cp "$repo/tracks/program/solutions/02-arguments/args.js" "$file"
  run --continue "Got it: user arguments start at index 2, and I return null when it's missing. Done?" > g3.txt
  check "module3: exercise set up"                   test "$before" != missing
  check "module3: exercise not edited by the tutor"  test "$after" = "$before"
  check "module3: no fix in the reply"               lacks 'argv ?\[ ?2 ?\]|slice\( ?2' g2.txt
  check "module3: recorded as passed"                test "$(status_of program 02-arguments)" = passed
}

scenario_cdinside() { # the session's shell has cd'd into an exercise folder: still a returning learner
  fresh cdinside
  "$repo/bin/codeops-exercise" 1 > /dev/null
  cp "$repo/tracks/foundations/solutions/01-values-and-types/duration.js" codeops-foundations/01-values-and-types/
  "$repo/bin/codeops-check" 1 > /dev/null
  cd codeops-foundations/01-values-and-types || return
  run "/codeops:start" | tee i1.txt
  check "cdinside: recognises the returning learner" grep -qiE 'running|welcome back|good to see' i1.txt
  check "cdinside: doesn't onboard again"           lacks_i 'what do you want to (build|be able)|how much programming' i1.txt
  check "cdinside: no notes written in the exercise" test ! -e .codeops
  cd ../.. || return
  check "cdinside: progress still shows the pass"   test "$(status_of foundations 01-values-and-types)" = passed
}

all=(ownbug practice hatch review teach python capstone pasted quit coach spanish asking module2 module3 cdinside)
quick=(ownbug hatch capstone pasted)
if [ "${1:-}" = "--list" ]; then printf '%s\n' "${all[@]}"; exit 0; fi
if [ "${1:-}" = "--quick" ]; then selected=("${quick[@]}"); else selected=("${@:-${all[@]}}"); fi
for name in "${selected[@]}"; do
  if ! declare -F "scenario_$name" > /dev/null; then echo "No scenario \"$name\". Try --list."; exit 2; fi
done

echo "Workspace: $work"
# Each scenario has its own folder, and --continue only resumes the session in that folder, so they
# can run side by side. Output is collected per scenario and printed in order.
jobs_max="${SMOKE_JOBS:-4}"
pids=()
for name in "${selected[@]}"; do
  while [ "$(jobs -rp | wc -l)" -ge "$jobs_max" ]; do sleep 1; done
  ( current="$name"; "scenario_$name"; exit "$fail" ) > "$work/$name.out" 2>&1 &
  pids+=("$!")
done
for i in "${!selected[@]}"; do
  wait "${pids[$i]}" || { fail=1; failed_scenarios+=("${selected[$i]}"); }
  cat "$work/${selected[$i]}.out"
done

cost="$(awk '{ s += $1 } END { printf "%.2f", s }' "$costs")"
echo
echo "Time: $(( (SECONDS - started) / 60 ))m $(( (SECONDS - started) % 60 ))s · Cost: \$$cost · Scenarios: ${#selected[@]}"
if [ "$fail" = 0 ]; then
  echo "All checks passed."
else
  echo "Some checks failed in: $(printf '%s\n' "${failed_scenarios[@]}" | sort -u | tr '\n' ' ')"
  echo "Transcripts are in $work"
fi
exit "$fail"
