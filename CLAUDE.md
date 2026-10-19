# agent-crew: rules for every Claude session

## What this repo is
The home of an AI build crew: Claude Code agents and skills that improve a project living in
*another* folder. This repo holds the agents, never a product's code.

- Agents: `.claude/agents/*.md`
- Skills (step-by-step procedures): `.claude/skills/*/SKILL.md`
- Dashboard: `dashboard/index.html` (open in a browser); plain-English descriptions in `dashboard/team.js`

## Working on the agents
- Improve one agent at a time, then test it on a sample project before moving on.
- When an agent's instructions change, update its entry in `dashboard/team.js` (depth, missing) and run `npm run dashboard`.
- Keep agent instructions concrete: inputs, steps, outputs, and what "done" means.
- Never put secrets in this repo.
