# agent-crew

An AI build crew made of Claude Code agents. You give it a vision, and it improves a project that lives in another folder.
This repo holds only the agents; it never holds a product's code.

## The crew right now

| Agent | Status | Job |
|---|---|---|
| Planner (`planner.md`) | active, tested on Agent Office | Picks the most useful next task and writes a task card |
| Builder (`builder.md`) | active, built task 001 | Writes the code for a task card and leaves handover notes |
| Tester (`tester.md`) | active, passed task 001 | Checks the result in a real browser, saves it if it passes |
| Designer (`designer.md`) | active, not yet tested | Makes clickable prototypes (2-3 directions for big changes) for the owner to approve |
| Team lead (`/round` skill) | active, not yet run | Runs the crew task after task, pauses for your design approval, pushes passed work |
| Scout, Checker | parked in `.claude/agents-parked/` | Brought back later |

## Run the crew
Open Claude Code in this folder and type:

```
/round agent-office
```

It keeps going until nothing is left, something needs you, or 10 tasks are done (`/round agent-office 20` to change that).

## How we work on it
Improve one agent at a time, test it on a practice project, look at the result together, tweak, repeat.
The practice project is **Agent Office** (`../agent-office`), a dashboard of these agents.

## See the crew

```bash
npm run dashboard
node ../agent-office/serve.mjs
```

The first command copies each agent's real settings into Agent Office. The second serves it at http://localhost:4321.

## Where things live

| Piece | Where |
|---|---|
| Active agents | `.claude/agents/*.md` |
| Parked agents and old skills | `.claude/agents-parked/`, `.claude/skills-parked/` |
| Dashboard data generator | `scripts/build-dashboard.mjs` |
| Browser check tool (used by the Tester) | `tools/check-page.mjs` |
| Screenshot storage and cleanup | `tools/shots.mjs`, settings in `tools/shots.config.json` |

## Test screenshots
- Saved per task in `<project>/.agent-shots/<task>/`, which is git-ignored. Task cards keep a short written record of what was checked.
- Deleted automatically every time a test runs: passed after 7 days, failed after 30 (no verdict counts as failed).
- Later, with GitHub Actions: upload the same `.agent-shots/` folder as a workflow artifact with `retention-days` set to `ciArtifactRetentionDays` (14) from the settings file. No change to the tools needed.
