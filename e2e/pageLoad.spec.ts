import { test, expect } from '@playwright/test';
import { setupPage } from './setup';

test.beforeEach(async ({ page }) => {
  console.log("Calling setupPage!")
  await setupPage(page);
});

test.describe('Test that default page loads correctly', () => {
  test('Check if Verovio has rendered default encoding', async ({ page }) => {
    // check Verovio has rendered our default encoding
    await expect(page.locator('g.page-margin').first()).toBeVisible();
    
  });
  test('Check if CodeMirror panel is displayed', async ({ page }) => {
    // check CodeMirror is working -- ensure the first element of class CodeMirror-line is visible
    await expect(page.locator('.CodeMirror-matchingtag').first()).toBeVisible();
  });
});
