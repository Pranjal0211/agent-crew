import { test, expect } from '@playwright/test';

// Pages to check. Add a path here when a new page is created.
const pages = [{ name: 'home', path: '/' }];

for (const { name, path } of pages) {
  test(`${name}: loads without errors and fits the screen`, async ({ page }, info) => {
    const errors = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(path);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/\S/);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(0);

    await page.screenshot({
      path: `test-results/screenshots/${info.project.name}-${name}.png`,
      fullPage: true,
    });
    expect(errors, 'console errors').toEqual([]);
  });
}
