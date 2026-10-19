// Screenshot storage for test evidence. Settings live in tools/shots.config.json.
//
// Layout, inside each project (git-ignored):
//   <project>/.agent-shots/<task>/          screenshots for one task, e.g. 001/
//   <project>/.agent-shots/<task>/result.json  { "verdict": "passed" | "failed", "at": ISO date }
//
// Folders are deleted automatically once older than keepDays for their verdict
// (no result.json yet = treated as "failed", aged by folder time). check-page.mjs runs the
// cleanup on every test run. A future CI job can upload the same folder as an artifact,
// using ciArtifactRetentionDays.
//
//   node tools/shots.mjs verdict <project> <task> passed|failed   record the Tester's verdict
//   node tools/shots.mjs clean <project>                           run cleanup now
import { readFileSync, existsSync } from 'node:fs';
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const config = JSON.parse(readFileSync(new URL('./shots.config.json', import.meta.url), 'utf8'));
const DAY = 24 * 60 * 60 * 1000;

export const shotsRoot = (project) => join(project, config.folder);

export async function recordVerdict(project, task, verdict) {
  if (!['passed', 'failed'].includes(verdict)) throw new Error(`verdict must be passed or failed, got "${verdict}"`);
  const dir = join(shotsRoot(project), task);
  if (!existsSync(dir)) throw new Error(`no screenshots folder at ${dir}`);
  await writeFile(join(dir, 'result.json'), JSON.stringify({ verdict, at: new Date().toISOString() }, null, 2) + '\n');
}

// Deletes expired task folders. Returns the names removed.
export async function cleanShots(project, now = Date.now()) {
  const root = shotsRoot(project);
  if (!existsSync(root)) return [];
  const removed = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = join(root, entry.name);
    let verdict = 'failed';
    let at = (await stat(dir)).mtimeMs;
    try {
      const result = JSON.parse(await readFile(join(dir, 'result.json'), 'utf8'));
      verdict = result.verdict === 'passed' ? 'passed' : 'failed';
      at = Date.parse(result.at) || at;
    } catch {}
    if (now - at > config.keepDays[verdict] * DAY) {
      await rm(dir, { recursive: true, force: true });
      removed.push(entry.name);
    }
  }
  return removed;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [command, project, task, verdict] = process.argv.slice(2);
  if (command === 'verdict' && project && task && verdict) {
    await recordVerdict(project, task, verdict);
    console.log(`Recorded ${verdict} for ${task}.`);
  } else if (command === 'clean' && project) {
    const removed = await cleanShots(project);
    console.log(removed.length ? `Removed: ${removed.join(', ')}` : 'Nothing to clean.');
  } else {
    console.error('Usage: node tools/shots.mjs verdict <project> <task> passed|failed\n       node tools/shots.mjs clean <project>');
    process.exit(2);
  }
}
