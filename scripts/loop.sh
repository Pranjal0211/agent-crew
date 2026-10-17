#!/usr/bin/env bash
# The loop: runs the `iterate` skill N times, each in a fresh headless Claude session,
# on an ai/* branch. You review the branch and merge it into main yourself.
#
#   npm run loop            # 3 iterations on a new branch ai/<date-time>
#   npm run loop -- 10      # 10 iterations
#   BRANCH=ai/home npm run loop -- 5   # continue an existing branch
set -euo pipefail
cd "$(dirname "$0")/.."

MAX=${1:-3}
BRANCH=${BRANCH:-ai/$(date +%Y%m%d-%H%M)}

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree not clean. Commit or stash first." >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git switch "$BRANCH"
else
  git switch -c "$BRANCH"
fi

mkdir -p test-results/loop
for i in $(seq 1 "$MAX"); do
  echo "=== Iteration $i/$MAX on $BRANCH ==="
  before=$(git rev-parse HEAD)

  claude -p "Run the iterate skill: do exactly one iteration (iteration $i of $MAX in this run)." \
    --permission-mode acceptEdits \
    --output-format text \
    | tee "test-results/loop/iteration-$i.txt"

  # Safety net: whatever happened, leave no half-finished work behind.
  if [ -n "$(git status --porcelain)" ]; then
    echo "Iteration left uncommitted changes; discarding them."
    git checkout -- . && git clean -fd site tests ai
  fi
  if [ "$(git rev-parse HEAD)" = "$before" ]; then
    echo "No commit this iteration."
  fi
done

echo
echo "Done. Review with:  git log --oneline main..$BRANCH"
echo "Merge with:        git switch main && git merge $BRANCH"
