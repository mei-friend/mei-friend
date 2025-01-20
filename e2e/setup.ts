import { Page } from '@playwright/test';

export const baseUrl = process.env.TEST_URL || 'https://mei-friend.mdw.ac.at';
export const defaultUrl = baseUrl + '/';

export async function setupPage(page: Page, url = defaultUrl) {
  await page.goto(url);
  await page.click('#splashConfirmButton');
  // if the #facsimile-panel is visible, wait until the <image> element with id "source-image" is fully loaded
  if (await page.isVisible('#facsimile-panel')) {
    await page.waitForSelector('#source-image', { state: 'visible' });
  }
}

export async function openUrl(page: Page, url: string) {
  await page.click('#fileMenuTitle');
  // click on the element with ID "openUrl"
  await page.click('#openUrl');
  // focus on the element with ID "openUrlInput"
  await page.focus('#openUrlInput');
  // input known URL into the focused element
  await page.keyboard.type(url);
  await page.click('#openUrlButton');
}
