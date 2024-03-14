import { test, expect } from '@playwright/test';
import { setupPage } from './setup';

test.describe('Test translation functions', () => {
  test('Test translator works', async ({ page }) => {
    // open the page
    await setupPage(page);
    // click on the globe icon
    await page.locator('#showLanguageSelectionButton').click();
    // select a language (Esperanto, since unlikely to be the default language)
    await page.locator('#row_eo').click();
    // check that the language has been changed: #helpMenuTitle should have text 'Helpo'
    await expect(page.locator('#helpMenuTitle')).toHaveText('Helpo');
  });
  test('Test translations work and persist across page reloads', async ({ page }) => {
    // open the page
    page.goto('/');
    // wait for splash screen to appear
    await page.waitForSelector('#splashConfirmButton');
    // click on the "always show splash screen" button (#splashAlwaysShow)
    await page.locator('#splashAlwaysShow').click();
    // click on the confirm button (#splashConfirmButton)
    await page.locator('#splashConfirmButton').click();
    // click on globe icon
    await page.locator('#showLanguageSelectionButton').click();
    // select a language
    await page.locator('#row_eo').click();
    // reload page to check splash screen has been translated, i.e., translation is persistent across page reloads
    page.reload();
    // wait for the splash screen to appear
    await page.waitForSelector('#splashConfirmButton');
    // Confirmation button should have translated text
    await expect(page.locator('#splashConfirmButton')).toHaveText('Mi komprenas!');
  });
});
