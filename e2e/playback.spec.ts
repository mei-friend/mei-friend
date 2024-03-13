import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('Test that the MIDI playback panel works correctly', () => {
  test('Test that the MIDI playback panel opens and closes correctly', async ({ page }) => {
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
    // now open the panel again using the bubble this time
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
    // close it using the close button
    await page.locator('#closeMidiPlaybackControlBarButton').click();
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).toBeVisible();
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
    // finally, open it using the keyboard:
    // first, move focus to the notation
    await page.keyboard.press('Shift+Space');
    // then, open the panel
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
  });
});

test.skip('Test that MIDI playback works correctly', () => {});
