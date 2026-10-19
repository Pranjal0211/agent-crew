---
name: iterate
description: Run one full AI-team iteration on the portfolio - plan, design, build, test, review, fix, commit. Use when asked to "iterate", "run the loop", or improve the site autonomously.
---

# One iteration

You are the orchestrator. Do the steps in order, delegating to the named subagents with the Agent tool.
Keep each subagent prompt self-contained: pass it the spec, brief and findings it needs.

## 0. Preflight
- `git branch --show-current` must start with `ai/`. If not, STOP and report. Never commit to `main`.
- `git status --porcelain` must be clean. If not, STOP and report.
- Read `CLAUDE.md`, `VISION.md`, the top of `ai/LOG.md`.

## 1. Ideas (every 3rd iteration, or when "Now"+"Next" has < 2 items)
- `innovation` agent: add 3 ideas to the backlog.

## 2. Plan
- `product-manager` agent: pick and scope one item. Keep its spec.

## 3. Design (skip for non-visual items)
- `designer` agent: design brief for the spec.

## 4. Build
- `developer` agent: implement spec + brief, add/extend tests, run `npm test`.

## 5. Verify (up to 3 rounds)
- `qa` agent with the spec's acceptance criteria.
- If QA passes, `code-reviewer` agent on the diff.
- If either fails, send the findings back to `developer` and repeat step 5.
- After 3 failed rounds: `git checkout -- . && git clean -fd site tests`, log the failure and the findings in the backlog, and end the iteration without committing.

## 6. Log
Prepend to `ai/LOG.md`:
```
## <date> · <item name>
- Changed: …
- QA: PASS (Lighthouse perf/a11y/bp/seo: x/x/x/x)
- Review: APPROVE after N rounds
- Next: <top backlog item>
```

## 7. Commit
- `npm test` once more yourself.
- `git add -A && git commit` (code, tests, backlog and log together) with message `<area>: <what changed>`, a body explaining why, and the attribution line(s) required by the environment.
- Never push, never amend.

End by printing a one-paragraph summary.
