import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test I/O functionality', () => {
  test.describe('Input', () => {
    test('Open file locally from computer', async ({ page }) => {
      // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
      await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
      await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
    });
    test("Open file locally via drag'n'drop", async ({ page }) => {
      // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
      await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
      await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
    });
  });
  test.describe('Output', () => {
    test('Export MEI', async ({ page }) => {
      // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
      await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
      await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
    });
    test('Export MEI basic', async ({ page }) => {
      // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
      await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
      await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
    });
  });
});
