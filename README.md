# agent-crew

An AI build crew made of Claude Code agents. You give it a vision, and it improves a project that lives in another folder.
This repo holds only the agents; it never holds a product's code.

## The crew right now

| Agent | Status | Job |
|---|---|---|
| Planner (`planner.md`) | active, tested on Agent Office | Picks the most useful next task and writes a task card |
| Builder (`builder.md`) | active, built task 001 | Writes the code for a task card and leaves handover notes |
| Tester (`tester.md`) | active, about to be tested | Checks the result in a real browser, saves it if it passes |
| Team lead, Scout, Designer, Checker | parked in `.claude/agents-parked/` | Brought back once the first three work well |

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
