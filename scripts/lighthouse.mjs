// Serves site/, runs Lighthouse on the home page, writes test-results/lighthouse.json and prints scores.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const url = 'http://localhost:4173/';
const server = spawn('npx', ['serve', 'site', '-l', '4173'], { stdio: 'ignore' });

try {
  for (let i = 0; i < 50; i++) {
    try { await fetch(url); break; } catch { await new Promise((r) => setTimeout(r, 200)); }
  }
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new'],
  });
  try {
    const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error' });
    mkdirSync('test-results', { recursive: true });
    writeFileSync('test-results/lighthouse.json', JSON.stringify(lhr, null, 2));
    for (const [id, cat] of Object.entries(lhr.categories)) {
      console.log(`${id.padEnd(16)} ${Math.round(cat.score * 100)}`);
    }
  } finally {
    await chrome.kill();
  }
} finally {
  server.kill();
}
