// Records the owner's design decisions and tells the Builder whether it may start.
// Only the Team lead runs "record", right after the owner replies in chat, quoting their exact words.
//
//   node tools/decision.mjs record <project> <NNN> --version v2 --outcome approved --option B --words "approve B"
//   node tools/decision.mjs record <project> <NNN> --version v1 --outcome changes --words "B but warmer"
//   node tools/decision.mjs record <project> <NNN> --version v1 --outcome rejected --words "none of these"
//   node tools/decision.mjs check  <project> <NNN>
//
// record: appends to design/NNN-*/decision.md (never rewrites past entries) and updates the task card's
//         status: "design approved" or "changes requested".
// check:  prints JSON { needsDesign, approved, version, option, file, system } and exits 0 if the Builder
//         may start (no design needed, or a design is approved), 1 if it must wait.
//         system: the approved design system every task follows (newest design/NNN-design-system/ with an
//         Approved line), as { task, version, option, file }, or null if there is none yet.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUTCOMES = { approved: 'approved', changes: 'changes requested', rejected: 'rejected' };

function find(dir, prefix) {
  if (!existsSync(dir)) return null;
  const hit = readdirSync(dir).find((f) => f === prefix || f.startsWith(`${prefix}-`));
  return hit ? join(dir, hit) : null;
}

function locate(project, task) {
  const card = find(join(project, 'ai/tasks'), task);
  if (!card) throw new Error(`No task card ai/tasks/${task}-*.md in ${project}`);
  return { card, design: find(join(project, 'design'), task) };
}

const today = () => new Date().toISOString().slice(0, 10);
const approvedLine = (text) => text.match(/^Approved: (v\d+), option ([A-Z]) \(`([^`]+)`\)$/m);

function record(project, task, { version, outcome, option, words }) {
  if (!OUTCOMES[outcome]) throw new Error('--outcome must be approved, changes or rejected');
  if (!version || !/^v\d+$/.test(version)) throw new Error('--version must look like v1, v2, …');
  if (!words || !words.trim()) throw new Error("--words must be the owner's exact reply");
  const { card, design } = locate(project, task);
  if (!design) throw new Error(`No design folder design/${task}-*/ in ${project}`);
  if (!existsSync(join(design, version))) throw new Error(`No ${version}/ in ${design}`);

  let file = null;
  if (outcome === 'approved') {
    if (!option || !/^[A-Z]$/.test(option)) throw new Error('--option must be a letter like B when approving');
    const rel = join(relative(project, design), version, `option-${option.toLowerCase()}.html`);
    if (!existsSync(join(project, rel))) throw new Error(`No prototype at ${rel}`);
    file = rel;
  }

  const path = join(design, 'decision.md');
  const title = readFileSync(card, 'utf8').match(/^# (.+)$/m)?.[1] ?? task;
  let text = existsSync(path) ? readFileSync(path, 'utf8')
    : `# Design decisions: ${title}\n\nWritten only from the owner's own words in chat. Entries are added, never changed.\n\nApproved: not yet\n\n## Log\n`;
  if (file) text = text.replace(/^Approved: .*$/m, `Approved: ${version}, option ${option} (\`${file}\`)`);
  const label = outcome === 'approved' ? `approved option ${option}` : OUTCOMES[outcome];
  const quote = words.trim().split('\n').map((l) => `> ${l}`).join('\n');
  text = `${text.trimEnd()}\n\n### ${today()} · ${version} · ${label}\n${quote}\n`;
  writeFileSync(path, text);

  let cardText = readFileSync(card, 'utf8').replace(/^Status: .*$/m, `Status: ${outcome === 'approved' ? 'design approved' : 'changes requested'}`);
  const said = { approved: `approved option ${option}`, changes: 'asked for changes', rejected: 'rejected all options' }[outcome];
  const line = `- ${today()}: owner ${said} on ${version}${file ? ` → \`${file}\` is the source of truth` : ''}`;
  cardText = /^## Design$/m.test(cardText) ? `${cardText.trimEnd()}\n${line}\n` : `${cardText.trimEnd()}\n\n## Design\n${line}\n`;
  writeFileSync(card, cardText);
  console.log(`Recorded: ${label} on ${version}.`);
}

function designSystem(project) {
  const dir = join(project, 'design');
  if (!existsSync(dir)) return null;
  const folders = readdirSync(dir).filter((f) => /^\d{3}-design-system$/.test(f)).sort().reverse();
  for (const f of folders) {
    const path = join(dir, f, 'decision.md');
    const m = existsSync(path) && approvedLine(readFileSync(path, 'utf8'));
    if (m) return { task: f.slice(0, 3), version: m[1], option: m[2], file: m[3] };
  }
  return null;
}

function check(project, task) {
  const { card, design } = locate(project, task);
  const cardText = readFileSync(card, 'utf8');
  const needsDesign = /^Needs design: yes/im.test(cardText) || /^## Design$/m.test(cardText) || Boolean(design);
  const decision = design && existsSync(join(design, 'decision.md')) ? readFileSync(join(design, 'decision.md'), 'utf8') : '';
  const m = approvedLine(decision);
  const result = { needsDesign, approved: Boolean(m), version: m?.[1] ?? null, option: m?.[2] ?? null, file: m?.[3] ?? null, system: designSystem(project) };
  console.log(JSON.stringify(result, null, 2));
  process.exit(!needsDesign || result.approved ? 0 : 1);
}

const [command, project, task, ...rest] = process.argv.slice(2);
const opt = (name) => { const i = rest.indexOf(`--${name}`); return i === -1 ? undefined : rest[i + 1]; };
try {
  if (command === 'record' && project && task) record(project, task, { version: opt('version'), outcome: opt('outcome'), option: opt('option'), words: opt('words') });
  else if (command === 'check' && project && task) check(project, task);
  else { console.error('Usage: node tools/decision.mjs record|check <project> <NNN> [options] (see top of file)'); process.exit(2); }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(2);
}
