# agent-crew: rules for every Claude session

## What this repo is
The home of an AI build crew: Claude Code agents and skills that improve a project living in
*another* folder. This repo holds the agents, never a product's code.

- Active agents: `.claude/agents/*.md`; parked ones in `.claude/agents-parked/`
- Dashboard: the separate `../agent-office` project; plain-English descriptions in `../agent-office/team.js`

## Working on the agents
- Improve one agent at a time, then test it on a sample project before moving on.
- Before building anything, explain the plan in plain words and ask the owner; recommend an answer with a reason.
- When an agent's instructions change, update its entry in `../agent-office/team.js` (depth, missing) and run `npm run dashboard`.
- Commit each step separately so the history shows how the crew evolved.
- Keep agent instructions concrete: inputs, steps, outputs, and what "done" means.
- Never put secrets in this repo.
