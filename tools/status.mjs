// Writes the crew's live status for the Agent Office dashboard (../agent-office/status.js).
// Used by the Team lead at every handover, whichever project the crew is working on.
//
//   node tools/status.mjs start <project name>               a run begins (clears everyone)
//   node tools/status.mjs set <agent> <state> "<doing>"       agent: planner, designer, builder, tester, team-lead
//                                                            state: working, done, failed, waiting
//   node tools/status.mjs finish                             the run is over (keeps the last states)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../../agent-office/status.js', import.meta.url));
const STATES = ['working', 'done', 'failed', 'waiting'];

function load() {
  if (!existsSync(file)) return { run: null, agents: {} };
  const m = readFileSync(file, 'utf8').match(/window\.STATUS\s*=\s*(\{[\s\S]*\});?\s*$/);
  try { return m ? JSON.parse(m[1]) : { run: null, agents: {} }; } catch { return { run: null, agents: {} }; }
}

function save(status) {
  writeFileSync(file, `window.STATUS = ${JSON.stringify(status, null, 2)};\n`);
}

const [command, ...args] = process.argv.slice(2);
const status = load();
const now = new Date().toISOString();

if (command === 'start' && args[0]) {
  save({ run: { project: args[0], startedAt: now }, agents: {} });
} else if (command === 'set' && args[0] && STATES.includes(args[1])) {
  // Only one agent works at a time: anyone else marked working is now done.
  if (args[1] === 'working') {
    for (const a of Object.values(status.agents)) if (a.state === 'working') a.state = 'done';
  }
  status.agents[args[0]] = { state: args[1], doing: args[2] ?? '', at: now };
  save(status);
} else if (command === 'finish') {
  for (const a of Object.values(status.agents)) if (a.state === 'working') a.state = 'done';
  status.run = { ...(status.run ?? {}), finishedAt: now };
  save(status);
} else {
  console.error('Usage: node tools/status.mjs start <project> | set <agent> <working|done|failed|waiting> "<doing>" | finish');
  process.exit(2);
}
