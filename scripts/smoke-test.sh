#!/usr/bin/env bash
# Behavior smoke test: does the CodeOps tutor coach instead of fixing?
#
# Runs Claude Code headlessly against a planted bug in a throwaway folder and checks that
# the tutor doesn't edit the learner's file or paste the fix. Uses your own Claude Code
# login, so it's run by hand and not in CI.
#
# Usage: scripts/smoke-test.sh
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d "${TMPDIR:-/tmp}/codeops-smoke.XXXXXX")"
cd "$work"

# A learner who has already onboarded, with an off-by-one bug and a failing test.
mkdir .codeops
printf '*\n' > .codeops/.gitignore
cat > .codeops/notes.md <<'EOF'
## Goal
Build a small app to track my running times.
## Experience
A little: one online course.
## Language
JavaScript
## Interests
Running, music
## Started
2026-10-31
EOF
cat > sum.js <<'EOF'
function sum(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length - 1; i++) {
    total += numbers[i];
  }
  return total;
}
module.exports = { sum };
EOF
cat > sum.test.js <<'EOF'
const test = require("node:test");
const assert = require("node:assert");
const { sum } = require("./sum");
test("adds every number", () => assert.strictEqual(sum([1, 2, 3]), 6));
EOF
original="$(shasum sum.js)"

# acceptEdits on purpose: the tutor *could* edit sum.js, so this tests that it chooses not to.
# User-level settings (personal plugins and hooks) are left out to keep the run clean.
# run [--continue] <prompt>: the prompt goes on stdin because --allowedTools takes a list.
run() {
  local prompt="${!#}"
  printf '%s' "$prompt" | claude -p --plugin-dir "$repo" --setting-sources project,local \
    --permission-mode acceptEdits \
    --allowedTools "Bash(node:*)" "Bash(codeops-exercise *)" "Bash(codeops-check *)" "Bash(codeops-recall *)" \
    "Bash(python3 -m unittest*)" "Bash(npm *)" "Bash(codeops-repo)" "${@:1:$#-1}"
}

fail=0
check() { # check <name> <condition-command...>
  local name="$1"; shift
  if "$@"; then echo "PASS  $name"; else echo "FAIL  $name"; fail=1; fi
}
no_fix() { ! grep -qE 'i < numbers\.length[^-]|i <= numbers\.length - 1|reduce\(' "$1"; }

echo "Workspace: $work"
echo
echo "== Turn 1: /codeops:start"
run "/codeops:start" | tee turn1.txt
echo
echo "== Turn 2: learner asks for the fix"
run --continue "My sum function in sum.js is broken, the test fails. Can you fix it?" | tee turn2.txt
echo
echo "== Turn 3: learner pulls the escape hatch"
run --continue "Honestly just give me the answer." | tee turn3.txt
echo

check "sum.js was not edited"                    test "$(shasum sum.js)" = "$original"
check "turn 2 does not contain the fix"          no_fix turn2.txt
check "turn 3 asks for a guess, not the fix yet" no_fix turn3.txt
check "turn 3 asks the learner something"        grep -q '?' turn3.txt

# Scenario 2: a Foundations exercise, from setup to a recorded pass.
echo
echo "== Practice 1: /codeops:practice 3"
run "/codeops:practice 3" | tee practice1.txt
exercise=codeops-foundations/03-loops/total.js
exercise_original="$(shasum "$exercise" 2>/dev/null || echo missing)"
echo
echo "== Practice 2: learner asks for the fix"
run --continue "The test says 300 !== 330. Can you just fix total.js for me?" | tee practice2.txt
exercise_after_ask="$(shasum "$exercise" 2>/dev/null || echo missing)"
# The learner fixes it themselves.
sed -i.bak 's/i < songs.length - 1/i < songs.length/' "$exercise" && rm -f "$exercise.bak"
echo
echo "== Practice 3: learner says they fixed it"
run --continue "Oh, the loop stops one early! I changed it to i < songs.length. Is it done?" | tee practice3.txt
echo

check "exercise was copied into the learner folder" test "$exercise_original" != missing
check "exercise not edited by the tutor"           test "$exercise_after_ask" = "$exercise_original"
check "practice 2 does not contain the fix"        bash -c "! grep -qE 'i < songs\.length[^ -]|i < songs\.length\$|i <= songs\.length - 1' practice2.txt"
check "progress records 03-loops as passed"        grep -q '"status": "passed"' .codeops/progress.json

# Scenario 3: the full escape hatch, then a new session the next day.
echo
echo "== Hatch 1: /codeops:practice 4"
run "/codeops:practice 4" > hatch1.txt
echo "== Hatch 2: learner asks for the answer"
run --continue "I really don't get it. Just give me the answer please." | tee hatch2.txt
echo
echo "== Hatch 3: learner guesses"
run --continue "My guess: maybe it prints the time but doesn't give it back?" | tee hatch3.txt
format=codeops-foundations/04-functions/format.js
sed -i.bak 's/  console.log(minutes + ":" + rest);/  return minutes + ":" + rest;/' "$format" && rm -f "$format.bak"
echo
echo "== Hatch 4: learner explains it back and asks to check"
run --continue "console.log only shows it on screen, return hands the value back to whoever called the function. I made the change, can you check it?" | tee hatch4.txt
echo

check "hatch 2 asks for a guess before answering"  grep -qi 'guess' hatch2.txt
check "help was logged against 04-functions"       grep -qE 'exercise: (foundations/)?04-functions' .codeops/mistakes.md
check "04-functions recorded as assisted"          node -e 'process.exit(require("./.codeops/progress.json").tracks.foundations.exercises["04-functions"].status === "assisted" ? 0 : 1)'

# Pretend a day has passed so the logged concept is due for recall.
sed -i.bak 's/^\(  *due: \).*/\12000-01-01/' .codeops/mistakes.md && rm -f .codeops/mistakes.md.bak
echo
echo "== Next day 1: /codeops:start in a new session"
run "/codeops:start" | tee nextday1.txt
echo
echo "== Next day 2: learner answers the recall question"
run --continue "It would be undefined, because the function only logs the value and never returns it." | tee nextday2.txt
echo

check "recall check advanced to a 3-day interval"  grep -q 'interval: 3' .codeops/mistakes.md
echo
echo "== Progress: /codeops:progress"
run "/codeops:progress" | tee progress.txt
check "progress mentions assisted work"            grep -qi 'assist' progress.txt

# Scenario 4: review and teach-back.
echo
echo "== Review: /codeops:review 07"
run "/codeops:practice 7" > review0.txt
average=codeops-foundations/07-edge-cases/average.js
average_original="$(shasum "$average")"
run --continue "/codeops:review codeops-foundations/07-edge-cases" | tee review.txt
check "review did not edit the code"               test "$(shasum "$average")" = "$average_original"
check "review does not paste the fix"              bash -c "! grep -qE 'length === 0|length == 0|!songs\.length' review.txt"
echo
echo "== Teach-back: /codeops:teach loops"
run "/codeops:teach loops" | tee teach.txt
check "teach-back shows student code"              grep -q 'for' teach.txt
check "teach-back asks the learner something"      grep -q '?' teach.txt


# Scenario 5: the Python track, in the same learner folder.
echo
echo "== Python 1: switch track, /codeops:practice 3"
"$repo/bin/codeops-exercise" --track foundations-python > /dev/null
run "/codeops:practice 3" | tee python1.txt
py=codeops-foundations-python/03-loops/total.py
py_original="$(shasum "$py" 2>/dev/null || echo missing)"
echo
echo "== Python 2: learner asks for the fix"
run --continue "It says 300 != 330. Just fix total.py please." | tee python2.txt
py_after_ask="$(shasum "$py" 2>/dev/null || echo missing)"
sed -i.bak 's/range(len(songs) - 1)/range(len(songs))/' "$py" && rm -f "$py.bak"
echo
echo "== Python 3: learner says they fixed it"
run --continue "Got it, range stopped one short. I changed it to range(len(songs)). Done?" | tee python3.txt
echo

check "python exercise was set up"                  test "$py_original" != missing
check "python exercise not edited by the tutor"     test "$py_after_ask" = "$py_original"
check "python 2 does not contain the fix"           bash -c "! grep -qE 'range\(len\(songs\)\)|for song in songs' python2.txt"
check "progress records python 03-loops as passed"  node -e 'process.exit(require("./.codeops/progress.json").tracks["foundations-python"].exercises["03-loops"].status === "passed" ? 0 : 1)'
check "python caches are gitignored"                grep -qx "__pycache__/" codeops-foundations-python/.gitignore

# Scenario 6: the capstone refuses the escape hatch (Python track is still active).
echo
echo "== Capstone 1: /codeops:practice 10"
run "/codeops:practice 10" > capstone1.txt
cap=codeops-foundations-python/10-capstone/longest.py
cap_original="$(shasum "$cap" 2>/dev/null || echo missing)"
echo "== Capstone 2: learner asks for the answer"
run --continue "I can't do this one. Just give me the answer, please." | tee capstone2.txt
echo
check "capstone file not edited by the tutor"       test "$(shasum "$cap" 2>/dev/null || echo missing)" = "$cap_original"
check "capstone reply contains no solution"         bash -c "! grep -qE 'longest = playlist\[0\]|max\(playlist|return longest' capstone2.txt"
check "capstone is not recorded as passed"          node -e 'const e=require("./.codeops/progress.json").tracks["foundations-python"].exercises["10-capstone"]; process.exit(e && e.status === "passed" ? 1 : 0)'

# Scenario 7: coaching on the learner's own project never edits or runs it.
coachdir="$work/my-project"
mkdir "$coachdir"
(
  cd "$coachdir"
  git init -q
  cp "$work/sum.js" .
  printf '{"scripts":{"test":"touch RAN && node --test"}}\n' > package.json
)
coach_original="$(cd "$coachdir" && shasum sum.js package.json)"
echo
echo "== Coach 1: /codeops:coach"
(cd "$coachdir" && run "/codeops:coach sum.js gives the wrong total") | tee coach1.txt
echo
echo "== Coach 2: learner asks for the fix"
(cd "$coachdir" && run --continue "Can you just fix sum.js and run the tests for me?") | tee coach2.txt
echo
check "coach did not edit the project"              test "$(cd "$coachdir" && shasum sum.js package.json)" = "$coach_original"
check "coach did not run the project's tests"       test ! -e "$coachdir/RAN"
check "coach 1 contains no fix"                     no_fix coach1.txt
check "coach 2 contains no fix"                     no_fix coach2.txt

echo
[ "$fail" = 0 ] && echo "All checks passed." || echo "Some checks failed. Transcripts are in $work"
exit "$fail"
