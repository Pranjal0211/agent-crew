// Opens a web page in a real (headless) browser and reports what a person would see.
// Used by the Tester agent; works on any project.
//
//   node tools/check-page.mjs --dir ../agent-office --out /tmp/shots --name planner-working
//   node tools/check-page.mjs --url http://localhost:3000 --out /tmp/shots --find "Up next"
//
// Options
//   --dir <folder>     serve this folder as a static site (no-cache) and open its index.html
//   --url <url>        or open an already-running site
//   --path <path>      page path to open (default /)
//   --out <folder>     where to save screenshots (required)
//   --name <label>     prefix for screenshot files (default "page")
//   --widths <list>    viewport widths, comma-separated (default 1280,375)
//   --find <text>      report how many visible elements contain this text (repeatable)
//   --wait <ms>        extra wait after load, e.g. for animations (default 800)
//   --reduced-motion   emulate prefers-reduced-motion: reduce
//   --dark             emulate dark color scheme
//
// Prints a JSON report: for each width, the title, screenshot path, console/page errors,
// sideways overflow in px, and the --find results.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const all = (name) => args.flatMap((a, i) => (a === `--${name}` ? [args[i + 1]] : []));
const flag = (name) => args.includes(`--${name}`);

const out = opt('out');
if (!out || (!opt('dir') && !opt('url'))) {
  console.error('Usage: node tools/check-page.mjs (--dir <folder> | --url <url>) --out <folder> [options]');
  process.exit(2);
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

async function serveDir(dir) {
  const root = resolve(dir);
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    const file = join(root, path.endsWith('/') ? `${path}index.html` : path);
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  await new Promise((r) => server.listen(0, r));
  return { server, base: `http://localhost:${server.address().port}` };
}

const served = opt('dir') ? await serveDir(opt('dir')) : null;
const url = new URL(opt('path', '/'), served ? served.base : opt('url')).href;
const widths = opt('widths', '1280,375').split(',').map(Number);
const finds = all('find');
const name = opt('name', 'page');
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const report = { url, results: [] };
try {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width < 600 ? 812 : 800 },
      reducedMotion: flag('reduced-motion') ? 'reduce' : 'no-preference',
      colorScheme: flag('dark') ? 'dark' : 'light',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`page: ${e.message}`));
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(Number(opt('wait', 800)));

    const shot = join(out, `${name}-${width}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const found = {};
    for (const text of finds) {
      found[text] = await page.getByText(text, { exact: false }).filter({ visible: true }).count();
    }
    report.results.push({ width, title: await page.title(), screenshot: shot, errors, overflowPx, found });
    await context.close();
  }
} finally {
  await browser.close();
  served?.server.close();
}
console.log(JSON.stringify(report, null, 2));
