import { Page, expect } from '@playwright/test';

export const baseUrl = process.env.TEST_URL || 'https://mei-friend.mdw.ac.at';
export const defaultUrl = baseUrl + '/';

/**
 * Navigates to the app, dismisses the splash screen, and waits for Verovio
 * to finish rendering notation. This ensures tests start with a fully loaded page.
 */
export async function setupPage(page: Page, url = defaultUrl) {
  await page.goto(url);
  // wait for the splash confirm button to appear before clicking
  await page.locator('#splashConfirmButton').waitFor({ state: 'visible' });
  await page.locator('#splashConfirmButton').click();
  // wait for Verovio to fully load the toolkit, parse MEI, and render notation
  // this can take 10-15s in older browser versions (Playwright bundled browsers)
  await expect(page.locator('g.note').first()).toBeVisible({ timeout: 45000 });
  // if the #facsimile-panel is visible, wait until the source image is fully loaded
  if (await page.isVisible('#facsimile-panel')) {
    await page.waitForSelector('#source-image', { state: 'visible' });
  }
}

/**
 * Opens a MEI file from URL via the File menu dialog.
 * Waits for the dialog to appear and for the file to start loading.
 */
export async function openUrl(page: Page, url: string) {
  await page.locator('#fileMenuTitle').click();
  await page.locator('#openUrl').waitFor({ state: 'visible' });
  await page.locator('#openUrl').click();
  // wait for the URL input dialog to appear
  await page.locator('#openUrlInput').waitFor({ state: 'visible' });
  // clear and fill the URL input (more reliable than keyboard.type across browsers)
  await page.locator('#openUrlInput').fill(url);
  await page.locator('#openUrlButton').click();
}

/**
 * Force-select an option on a <select> element that may be hidden in an overflow menu.
 * Uses evaluate() to bypass Playwright's visibility requirement for selectOption().
 */
export async function forceSelectOption(page: Page, selector: string, value: string) {
  await page.locator(selector).evaluate((el: HTMLSelectElement, val: string) => {
    el.value = val;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

/**
 * Force-set a checkbox state, even if the checkbox is hidden in an overflow menu.
 * Directly sets the checked property and dispatches a change event.
 */
export async function forceSetCheckbox(page: Page, selector: string, checked: boolean) {
  await page.locator(selector).evaluate((el: HTMLInputElement, val: boolean) => {
    if (el.checked !== val) {
      el.checked = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, checked);
}
