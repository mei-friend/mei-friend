import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test settings panel', () => {
    test('Ensure settings panel opens and closes', async ({ page }) => {
        // check settings panel opens via show settings button (cog icon)
        await expect(page.locator('#showSettingsButton')).toBeVisible();
        await page.click('#showSettingsButton');
        await expect(page.locator('#hideSettingsButton')).toBeInViewport();
        // check it closes via hide settings button... (cog icon)
        await page.click('#hideSettingsButton');
        await expect(page.locator('#hideSettingsButton')).not.toBeInViewport();
        // check it opens via menu item (View > Settings panel)
        await expect(page.locator('#viewMenuTitle')).toBeVisible();
        await page.click('#viewMenuTitle');
        await expect(page.locator('#showSettingsMenuText')).toBeVisible();
        await page.click('#showSettingsMenuText');
        await expect(page.locator('#hideSettingsButton')).toBeInViewport();
        // check it closes via close settings button (x icon)'
        await expect(page.locator('#closeSettingsButton')).toBeInViewport();
        await page.click('#closeSettingsButton');
        await expect(page.locator('#closeSettingsButton')).not.toBeInViewport();
        // check it opens via keyboard shortcut (ctrl + ,)
        await page.keyboard.press('Control+Comma');
        await expect(page.locator('#hideSettingsButton')).toBeInViewport();
    });
});