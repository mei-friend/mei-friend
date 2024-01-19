import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test CMN file functions', () => {
  test('Open settings panel and change some settings', async ({ page }) => {
    // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
    await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
    await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
  });
});
