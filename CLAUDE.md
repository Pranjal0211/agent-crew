# My portfolio: rules for every Claude session

## Project
- Static site in `site/`: plain HTML, CSS and JavaScript. No build step.
- 3D uses three.js loaded via an import map from `https://cdn.jsdelivr.net/npm/three@0.170.0/`.
- Run locally: `npm run serve` (http://localhost:4173).
- Intent lives in `VISION.md`. Never edit it; only the human does.

## The AI team
Agents live in `.claude/agents/`. The orchestrator runs one iteration via the `iterate` skill.
Shared memory between iterations:
- `ai/BACKLOG.md`: ideas and tasks, prioritized by the product-manager
- `ai/LOG.md`: one entry per iteration (what changed, test results, next step)

## Rules
- One focused change per iteration. Small diffs.
- Every commit must pass `npm test`. If tests fail and can't be fixed, revert the change.
- Commit messages: `<area>: <what changed>` with a short body explaining why.
- Only commit on the current `ai/*` branch. Never commit to `main`, never push, never force anything.
- Never touch files outside this repo. Never add secrets, tracking or third-party analytics.
- Keep JS files under ~400 lines; split into modules when they grow.
