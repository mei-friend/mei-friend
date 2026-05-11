import { test, expect, Page } from '@playwright/test';
import { setupPage } from './setup';

// Tests for the notation error/warning badges that surface Verovio
// rendering issues without blanking the SVG. Most tests drive the
// production setNotationStale/setNotationWarning entry points directly
// via the already-loaded ES module — that lets us deterministically
// exercise singular/plural, expand-collapse, hide/show and tooltip
// behaviour without crafting MEI fixtures that reliably emit specific
// Verovio log lines (which would be brittle across toolkit versions).
// The resizer-regression test, by contrast, intentionally rides through
// the real worker round-trip via v.updateLayout() so the fix in main.js
// (don't eagerly clear the warning on every 'updated') is actually
// covered end-to-end.

const errorBadge = '#notation-error-badge';
const warningBadge = '#notation-warning-badge';

async function setBadge(page: Page, kind: 'error' | 'warning', message: string) {
  await page.evaluate(
    async ({ kind, message }) => {
      const main = (await import('/static/lib/main.js')) as any;
      if (kind === 'error') main.v.setNotationStale(message);
      else main.v.setNotationWarning(message);
    },
    { kind, message }
  );
}

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('Notation badges', () => {
  test('both badges are hidden after a normal page load', async ({ page }) => {
    await expect(page.locator(errorBadge)).toBeHidden();
    await expect(page.locator(warningBadge)).toBeHidden();
  });

  test('a single warning shows the singular prefix and no count', async ({ page }) => {
    await setBadge(page, 'warning', 'Just one warning');
    await expect(page.locator(warningBadge)).toBeVisible();
    await expect(page.locator(`${warningBadge} .badge-prefix`)).toHaveText('Verovio warning:');
    await expect(page.locator(`${warningBadge} .badge-message-first`)).toHaveText('Just one warning');
    // Empty .badge-count is hidden by CSS via :empty, has-multiple is off.
    await expect(page.locator(warningBadge)).not.toHaveClass(/has-multiple/);
    const countText = await page
      .locator(`${warningBadge} .badge-count`)
      .evaluate((el) => el.textContent || '');
    expect(countText).toBe('');
  });

  test('multiple warnings show plural prefix, count, and chevron', async ({ page }) => {
    await setBadge(page, 'warning', 'first\nsecond\nthird');
    await expect(page.locator(warningBadge)).toBeVisible();
    await expect(page.locator(`${warningBadge} .badge-prefix`)).toHaveText('Verovio warnings:');
    await expect(page.locator(`${warningBadge} .badge-message-first`)).toHaveText('first');
    await expect(page.locator(warningBadge)).toHaveClass(/has-multiple/);
    const countText = await page
      .locator(`${warningBadge} .badge-count`)
      .evaluate((el) => el.textContent || '');
    expect(countText.trim()).toBe('3');
    // Details collapsed by default.
    await expect(page.locator(warningBadge)).not.toHaveClass(/expanded/);
    await expect(page.locator(`${warningBadge} .badge-details`)).toBeHidden();
  });

  test('clicking the prefix expands the details list and toggles it back', async ({ page }) => {
    await setBadge(page, 'warning', 'first warn\nsecond warn\nthird warn');
    const prefix = page.locator(`${warningBadge} .badge-prefix`);
    const details = page.locator(`${warningBadge} .badge-details`);

    await expect(details).toBeHidden();
    await prefix.click();
    await expect(page.locator(warningBadge)).toHaveClass(/expanded/);
    await expect(details).toBeVisible();
    await expect(details.locator('li')).toHaveCount(3);
    // Per-item content matches the input lines in order.
    await expect(details.locator('li').nth(0)).toHaveText('first warn');
    await expect(details.locator('li').nth(2)).toHaveText('third warn');
    // First-message in summary hides while expanded to avoid duplication.
    await expect(page.locator(`${warningBadge} .badge-message-first`)).toBeHidden();

    await prefix.click();
    await expect(page.locator(warningBadge)).not.toHaveClass(/expanded/);
    await expect(details).toBeHidden();
    await expect(page.locator(`${warningBadge} .badge-message-first`)).toBeVisible();
  });

  test('clicking the message text does not toggle expansion (so it can be selected/copied)', async ({ page }) => {
    await setBadge(page, 'warning', 'a long warning with copyable text\nsecond');
    await page.locator(`${warningBadge} .badge-message-first`).click();
    await expect(page.locator(warningBadge)).not.toHaveClass(/expanded/);
  });

  test('× close button hides the label; clicking the icon reveals it again', async ({ page }) => {
    await setBadge(page, 'warning', 'one warning');
    await page.locator(`${warningBadge} .badge-close`).click();
    await expect(page.locator(warningBadge)).toHaveClass(/label-hidden/);
    await page.locator(`${warningBadge} .badge-icon`).click();
    await expect(page.locator(warningBadge)).not.toHaveClass(/label-hidden/);
  });

  test('label re-appears automatically when the message changes', async ({ page }) => {
    await setBadge(page, 'warning', 'first message');
    await page.locator(`${warningBadge} .badge-close`).click();
    await expect(page.locator(warningBadge)).toHaveClass(/label-hidden/);

    // Same content again — preserve the user's hide preference.
    await setBadge(page, 'warning', 'first message');
    await expect(page.locator(warningBadge)).toHaveClass(/label-hidden/);

    // Content changed — reveal automatically.
    await setBadge(page, 'warning', 'a different message');
    await expect(page.locator(warningBadge)).not.toHaveClass(/label-hidden/);
  });

  test('error badge supports the same plural / expand / contract behaviour', async ({ page }) => {
    await setBadge(page, 'error', 'first error\nsecond error');
    await expect(page.locator(errorBadge)).toBeVisible();
    await expect(page.locator(`${errorBadge} .badge-prefix`)).toHaveText('Verovio errors:');
    await expect(page.locator(errorBadge)).toHaveClass(/has-multiple/);

    await page.locator(`${errorBadge} .badge-prefix`).click();
    await expect(page.locator(errorBadge)).toHaveClass(/expanded/);
    await expect(page.locator(`${errorBadge} .badge-details li`)).toHaveCount(2);
  });

  test('warning floats up under the logo when there is no error, drops below when there is', async ({ page }) => {
    await setBadge(page, 'warning', 'a warning');
    await expect(page.locator(warningBadge)).toHaveClass(/float-up/);

    await setBadge(page, 'error', 'an error');
    await expect(page.locator(warningBadge)).not.toHaveClass(/float-up/);

    // Note: clearNotationStale is editor-aware (only clears if XML is well-
    // formed); here it is, so the float-up class returns when the error
    // disappears.
    await page.evaluate(async () => {
      const main = (await import('/static/lib/main.js')) as any;
      main.v.clearNotationStale();
    });
    await expect(page.locator(warningBadge)).toHaveClass(/float-up/);
  });

  test('expanding a multi-error badge slides the warning badge further down', async ({ page }) => {
    await setBadge(page, 'error', 'err 1\nerr 2\nerr 3');
    await setBadge(page, 'warning', 'a warning');

    const measureTop = () =>
      page.locator(warningBadge).evaluate((el) => (el as HTMLElement).getBoundingClientRect().top);
    const topBefore = await measureTop();

    await page.locator(`${errorBadge} .badge-prefix`).click();
    await expect(page.locator(errorBadge)).toHaveClass(/expanded/);
    // ResizeObserver fires asynchronously after layout; expect.poll retries.
    await expect.poll(measureTop, { timeout: 3000 }).toBeGreaterThan(topBefore);
  });

  test('layout-only updateLayout does not clear the warning badge (resizer-drag regression)', async ({ page }) => {
    await setBadge(page, 'warning', 'persist me\nthrough a relayout');
    await expect(page.locator(warningBadge)).toBeVisible();

    // Round-trip a real updateLayout through the worker. Before the fix in
    // main.js, the 'updated' message that comes back from this would have
    // eagerly called clearNotationWarning(), wiping the badge.
    await page.evaluate(async () => {
      const main = (await import('/static/lib/main.js')) as any;
      main.v.updateLayout();
    });

    // Allow the worker round-trip to complete, then verify the warning
    // survived. 1.5s is well above the typical updateLayout turnaround.
    await page.waitForTimeout(1500);
    await expect(page.locator(warningBadge)).toBeVisible();
    await expect(page.locator(`${warningBadge} .badge-message-first`)).toHaveText('persist me');
  });

  test('tooltips: icon shows full message; summary shows action hint; message text has empty title', async ({ page }) => {
    await setBadge(page, 'warning', 'first warning\nsecond\nthird');

    // Icon: full message listing.
    await expect(page.locator(`${warningBadge} .badge-icon`)).toHaveAttribute(
      'title',
      'first warning\nsecond\nthird'
    );

    // Summary: state-aware action hint, plural form.
    await expect(page.locator(`${warningBadge} .badge-summary`)).toHaveAttribute(
      'title',
      /3 Verovio warnings: click to expand/
    );

    // Message text: explicitly empty so the summary's hint doesn't bleed
    // through ancestor lookup.
    await expect(page.locator(`${warningBadge} .badge-message-first`)).toHaveAttribute('title', '');

    // After expanding, the summary tooltip flips to "click to contract".
    await page.locator(`${warningBadge} .badge-prefix`).click();
    await expect(page.locator(`${warningBadge} .badge-summary`)).toHaveAttribute(
      'title',
      /3 Verovio warnings: click to contract/
    );
  });

  test('singular tooltip drops the trailing colon', async ({ page }) => {
    await setBadge(page, 'warning', 'lonely warning');
    await expect(page.locator(`${warningBadge} .badge-summary`)).toHaveAttribute(
      'title',
      'Verovio warning'
    );
  });

  test('error messages are routed to the error badge, not the warning badge', async ({ page }) => {
    await setBadge(page, 'error', 'an error message');
    await expect(page.locator(errorBadge)).toBeVisible();
    await expect(page.locator(warningBadge)).toBeHidden();
  });
});
