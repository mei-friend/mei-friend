import { test, expect } from '@playwright/test';
import { setupPage } from './setup';

test.beforeEach(async ({ page }) => {
  console.log("Testing page load functions.")
  await setupPage(page);
});

test.describe('1 Test that default page loads correctly', () => {
  test('1.1 Check if Verovio has rendered default encoding', async ({ page }) => {
    // check Verovio has rendered our default encoding
    await expect(page.locator('g.page-margin').first()).toBeVisible();
    
  });
  test('1.2 Check if CodeMirror panel is displayed', async ({ page }) => {
    // check CodeMirror is working -- ensure the first element of class CodeMirror-line is visible
    await expect(page.locator('.CodeMirror-matchingtag').first()).toBeVisible();
  });
});
