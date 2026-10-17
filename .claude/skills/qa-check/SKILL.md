---
name: qa-check
description: Test the live local site - Playwright on desktop and mobile with screenshots, plus Lighthouse scores. Use whenever the site changed and needs verifying.
---

# QA check

1. `npm test`
   - Starts the site on http://localhost:4173 automatically.
   - Runs `tests/*.spec.js` on desktop Chrome and a mobile viewport.
   - Fails on any console error.
   - Saves full-page screenshots to `test-results/screenshots/<project>-<page>.png`.
2. `npm run lighthouse`
   - Prints the four category scores and writes the full report to `test-results/lighthouse.json`.
3. Read every screenshot image and describe what is wrong, if anything.
4. Thresholds: accessibility ≥ 90, best practices ≥ 90, performance ≥ 70. Below = blocker.
