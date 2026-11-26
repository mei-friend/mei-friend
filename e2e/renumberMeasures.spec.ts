import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupPage, openLocalMei } from './setup';

// Renumber tab of the MEI toolbox (mei-toolbox.js → utils.renumberMeasures()).
// The fixture has three mdivs with 2, 2 and 1 measures, each numbered from 1.

const name = 'multi-mdiv-speed.mei';
const mei = readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

const pane = (page: Page) => page.locator('.mtPane[data-tab="renumber"]');

/** @n of every measure in the editor, in document order. */
async function measureNs(page: Page): Promise<string[]> {
  const text: string = await page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.getValue());
  return Array.from(text.matchAll(/<measure\b[^>]*\bn="([^"]*)"/g)).map((m) => m[1]);
}

/** Opens the Renumber tab, sets the options and renumbers the encoding. */
async function renumber(page: Page, startNumber: number, restartAtMdiv: boolean) {
  if (!(await page.locator('#meiToolbox').isVisible())) await page.locator('#showMeiToolboxButton').click();
  await page.locator('.mtTab[data-tab="renumber"]').click();
  await expect(pane(page)).toBeVisible();
  // a previous run folds the options away
  await page.evaluate(() =>
    document.querySelector('.mtPane[data-tab="renumber"] .mtOptions')!.classList.remove('collapsed')
  );
  await page.locator('#mtRenumberStartNumber').fill(String(startNumber));
  await page.locator('#mtRenumberStartNumber').dispatchEvent('change');
  await page.locator('#mtRenumber-restartAtMdiv').setChecked(restartAtMdiv);
  await page.locator('#mtRenumber-continueAcrossEndings').setChecked(false);
  await page.locator('#mtRenumber-continueAcrossIncompleteMeasures').setChecked(false);
  await pane(page).locator('.mtActions button').last().click(); // 'Renumber' (not 'Test')
}

test.describe('Renumber measures', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await openLocalMei(page, name, mei);
    await expect(page.locator('#statusBar')).toContainText(name, { timeout: 60000 });
    await expect(page.locator('#m1a')).toBeVisible({ timeout: 30000 });
  });

  test('restart at each mdiv numbers every mdiv from the start number', async ({ page }) => {
    expect(await measureNs(page)).toEqual(['1', '2', '1', '2', '1']);
    await renumber(page, 5, true);
    await expect.poll(() => measureNs(page)).toEqual(['5', '6', '5', '6', '5']);
    await expect(pane(page)).toContainText('mdiv');
  });

  test('without restart, numbers continue across mdivs', async ({ page }) => {
    await renumber(page, 1, false);
    await expect.poll(() => measureNs(page)).toEqual(['1', '2', '3', '4', '5']);
  });

  test('the option is remembered', async ({ page }) => {
    const stored = () => page.evaluate(() => localStorage.getItem('mf-renumberMeasuresRestartAtMdiv'));
    await renumber(page, 1, true);
    expect(await stored()).toBe('true');
    await renumber(page, 1, false);
    expect(await stored()).toBe('false');
  });
});
