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
    --allowedTools "Bash(node:*)" "Bash(codeops-exercise *)" "Bash(codeops-check *)" "${@:1:$#-1}"
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

echo
[ "$fail" = 0 ] && echo "All checks passed." || echo "Some checks failed. Transcripts are in $work"
exit "$fail"
