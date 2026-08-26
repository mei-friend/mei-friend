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

/**
 * Loads a local MEI file by intercepting the hidden file-chooser dialog that
 * `File → Open` opens. Use this when a test fixture needs to be self-contained
 * (not reachable over the network).
 */
export async function openLocalMei(page: Page, name: string, contents: string) {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('#fileMenuTitle').click();
  await page.locator('#openMei').waitFor({ state: 'visible' });
  await page.locator('#openMei').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name,
    mimeType: 'application/xml',
    buffer: Buffer.from(contents, 'utf-8'),
  });
}

/**
 * Reads the number out of one of the pagination readouts, which the app writes
 * as `&nbsp;<n>&nbsp;` (`#pagination2` = current page, `#pagination4` = total).
 */
async function paginationNumber(page: Page, selector: string): Promise<number> {
  const text = (await page.locator(selector).textContent()) || '';
  return parseInt(text.replace(/\D/g, ''), 10);
}

/** Currently displayed page number. */
export async function currentPage(page: Page): Promise<number> {
  return paginationNumber(page, '#pagination2');
}

/** Total number of pages the app currently reports. */
export async function pageCount(page: Page): Promise<number> {
  return paginationNumber(page, '#pagination4');
}

/**
 * Switches speed mode on or off and selects a breaks mode, then waits until
 * the resulting re-render has settled.
 */
export async function setSpeedMode(page: Page, speed: boolean, breaks?: 'none' | 'auto' | 'line' | 'encoded') {
  await forceSetCheckbox(page, '#speedCheckbox', speed);
  if (breaks) await forceSelectOption(page, '#breaksSelect', breaks);
  await waitForNotation(page);
}

/**
 * Waits until Verovio is idle again (the toolkit icon stops spinning) and at
 * least one measure is rendered.
 */
export async function waitForNotation(page: Page) {
  await expect(page.locator('#verovio-panel g.measure').first()).toBeVisible({ timeout: 30000 });
  // the icon carries 'clockwise' while Verovio works and 'anticlockwise' while
  // the speed worker does; /clockwise/ matches both, so this waits for both
  await expect(page.locator('#verovioIcon')).not.toHaveClass(/clockwise/, { timeout: 30000 });
  // 'auto' breaks need a full-score pass before the page count is known
  await expect(page.locator('#pagination4')).toHaveText(/\d/, { timeout: 30000 });
}

/**
 * `@xml:id`s of the measures rendered on the page currently displayed, in
 * document order. The dummy measures speed mode wraps its excerpts in are
 * never part of the displayed page, but are filtered out defensively.
 */
export async function measureIdsOnPage(page: Page): Promise<string[]> {
  return page
    .locator('#verovio-panel g.measure')
    .evaluateAll((els) =>
      els.map((el) => el.id).filter((id) => id && id !== 'startingMeasure' && id !== 'endingMeasure')
    );
}

/**
 * Pages through the whole encoding from page 1 and returns the measure
 * `@xml:id`s rendered on each page. Waits for the notation to actually change
 * before reading a page, so no page is read twice or read half-rendered.
 */
export async function measureIdsPerPage(page: Page): Promise<string[][]> {
  await page.locator('#firstPageButton').click();
  await expect.poll(() => currentPage(page), { timeout: 30000 }).toBe(1);
  await waitForNotation(page);
  const total = await pageCount(page);
  const pages: string[][] = [];
  for (let p = 1; p <= total; p++) {
    if (p > 1) {
      const previous = pages[pages.length - 1].join(',');
      await page.locator('#nextPageButton').click();
      await expect.poll(() => currentPage(page), { timeout: 30000 }).toBe(p);
      await waitForNotation(page);
      // the re-render is asynchronous: wait until the notation really changed
      await expect
        .poll(async () => (await measureIdsOnPage(page)).join(','), { timeout: 30000 })
        .not.toBe(previous);
    }
    pages.push(await measureIdsOnPage(page));
  }
  return pages;
}

/** `@xml:id`s of all `<measure>` elements of an MEI string, in document order. */
export function measureIdsInEncoding(mei: string): string[] {
  return Array.from(mei.matchAll(/<measure\b[^>]*\bxml:id="([^"]+)"/g)).map((m) => m[1]);
}
