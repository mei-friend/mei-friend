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
    test('Ensure settings panel has expected tabs', async ({ page }) => {
        await page.click('#showSettingsButton');
        await expect(page.locator('#settingsPanel > .tab')).toBeVisible();
        await expect(page.locator('#settingsPanel > .tab :nth-child(1)').first()).toHaveId('hideSettingsButton');
        await expect(page.locator('#settingsPanel > .tab :nth-child(2)').first()).toHaveId('meifriendOptionsTab');
        await expect(page.locator('#settingsPanel > .tab :nth-child(3)').first()).toHaveId('editorOptionsTab');
        await expect(page.locator('#settingsPanel > .tab :nth-child(4)').first()).toHaveId('verovioOptionsTab');
        await expect(page.locator('#settingsPanel > .tab :nth-child(5)').first()).toHaveId('closeSettingsButton');
    })
});

test.describe.skip('Test mei-friend settings panel tab', () => {
    // no-op for now, TODO write tests!
});

test.describe('Test editor settings panel tab', () => {
    test('Test theme change', async ({ page }) => {
        // open settings panel
        await page.click('#showSettingsButton');
        // select editor options tab
        await page.click('#editorOptionsTab');
        // choose a light theme from selector
        await page.locator('#theme').selectOption('elegant');
        // check that Eulise is sleeping: src attribute of #mei-friend-logo image ends contains 'asleep'
        await expect(page.locator('#mei-friend-logo')).toHaveAttribute('src', /asleep/);
        // choose a dark theme from selector
        await page.locator('#theme').selectOption('darcula');
        // check that Eulise is awake: 
        await expect(page.locator('#mei-friend-logo')).not.toHaveAttribute('src', /asleep/);
    })
});

test.describe.skip('Test Verovio settings panel tab', () => {
    // no-op for now, TODO write tests!
});