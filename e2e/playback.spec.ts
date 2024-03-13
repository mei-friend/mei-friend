import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('Test that the MIDI playback panel works correctly', () => {
  test('Test that the MIDI playback panel opens and closes using panel icon', async ({ page }) => {
    // expect that the MIDI playback panel is not visible, and the contextual playback button (bubble) to be visible
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).toBeVisible();
    // click on the MIDI playback button in the panel icons to open the panel
    await page.locator('#showMidiPlaybackControlBarButton').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
    // click again to close the panel
    await page.locator('#showMidiPlaybackControlBarButton').click();
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).toBeVisible();
  });
  test('Test that the MIDI playback panel opens and closes using contextual indicators', async ({ page }) => {
    // open the panel using the contexutal bubble
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
    // close it using the close button
    await page.locator('#closeMidiPlaybackControlBarButton').click();
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).toBeVisible();
  });
  test('Test that the MIDI playback panel opens and closes using the menu item', async ({ page }) => {
    // open it using the menu: View -> Playback controls
    await page.locator('#viewMenuTitle').click();
    await page.locator('#showPlaybackControls').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
    // close it via the menu
    await page.locator('#viewMenuTitle').click();
    await page.locator('#showPlaybackControls').click();
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).toBeVisible();
  });
  test('Test that the MIDI playback panel opens using the keyboard', async ({ page }) => {
    // first, move focus to the notation
    await page.keyboard.press('Shift+Space');
    // then, open the panel
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
  });
});

test.describe('Test that MIDI playback works correctly', () => {
  test('Test that playback causes notes to highlight', async ({ page }) => {
    // open the panel using the menu: View -> Playback controls
    await page.locator('#viewMenuTitle').click();
    await page.locator('#showPlaybackControls').click();
    // switch focus to encoding
    await page.keyboard.press('Shift+Space');
    // hackily wait for half a second to enable playback on 'space' key
    // TODO: figure out why this is necessary
    await page.waitForTimeout(500);
    // commence playback
    await page.keyboard.press('Space');
    // check that the first note is highlighted
    await expect(page.locator('.currently-playing').first()).toBeVisible();
  });
});
