import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('1 Test that the MIDI playback panel works correctly', () => {
  test('1.1 Test that the MIDI playback panel opens and closes using panel icon', async ({ page }) => {
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
  test('1.2 Test that the MIDI playback panel opens and closes using contextual indicators', async ({ page }) => {
    // open the panel using the contexutal bubble
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
    // close it using the close button
    await page.locator('#closeMidiPlaybackControlBarButton').click();
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).toBeVisible();
  });
  test('1.3 Test that the MIDI playback panel opens and closes using the menu item', async ({ page }) => {
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
  test('1.4 Test that the MIDI playback panel opens using the keyboard', async ({ page }) => {
    // first, move focus to the notation
    await page.keyboard.press('Shift+Space');
    await expect(page.locator('#notation')).toHaveClass(/focus-visible/);

    // then, open the panel
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await expect(page.locator('#midiPlayerContextual')).not.toBeVisible();
  });
});

test.describe('2 Test that MIDI playback works correctly', () => {
  test('2.1 Test that playback causes notes to highlight', async ({ page }) => {
    // open the panel using the menu: View -> Playback controls
    await page.locator('#viewMenuTitle').click();
    await page.locator('#showPlaybackControls').click();
    // switch focus to encoding
    await page.keyboard.press('Shift+Space');
    await expect(page.locator('#midiPlaybackControlBar')).not.toBeVisible();
    // commence playback
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    // check that the first note is highlighted
    await expect(page.locator('.currently-playing').first()).toBeVisible();
  });

  test('2.2 Test automatic scrolling during playback', async ({ page }) => {
    // open known MEI file
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei'
    );
    // render page breaks
    await page.locator('#breaksSelect').selectOption('encoded');
    // click on a note near end of first system
    // HACK - use force: true to prevent right footer from intercepting pointer event
    // TODO - figure out why this happens
    await page.locator('#note-0000001030232648 use').first().click({ force: true });
    // test whether #verovio-panel eventually changes its scroll position
    const initialScroll = await page.locator('#verovio-panel').evaluate((el) => el.scrollTop);
    // commence playback
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    // eventually, the scroll position should change as viewport follows playback
    await page.waitForFunction((initialScroll) => {
      return document.querySelector('#verovio-panel')!.scrollTop !== initialScroll;
    }, initialScroll);
  });

  test('2.3 Test that playback stops when the end of the page is reached (when in speed mode)', async ({ page }) => {
    // open known MEI file
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei'
    );
    // render page breaks
    await page.locator('#breaksSelect').selectOption('encoded');
    // enable speedmode, preventing automatic page turning
    await page.locator('#speedCheckbox').check();
    // click on a note near end of first page
    // HACK - use force: true to prevent Verovio SVG from intercepting pointer event
    // TODO - figure out why this happens
    await page.locator('#note-0000000547593172 use').first().click();
    // commence playback
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    // ... something should be highlighted ...
    await expect(page.locator('.currently-playing').first()).toBeVisible();
    // ... then, after 2 seconds of playback (i.e., past end of page) ...
    await page.waitForTimeout(4000);
    // ... nothing should be highlighted ...
    await expect(page.locator('.currently-playing')).not.toBeVisible();
    // ... and the page indicator should not have changed
    await expect(page.locator('#pagination2')).toHaveText(' 1 ');
  });

  test('2.4 Test automatic page turning during playback (when not in speed mode)', async ({ page }) => {
    // open known MEI file
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei'
    );
    // render page breaks
    await page.locator('#breaksSelect').selectOption('encoded');
    // disable speedmode to allow playback beyond first page
    await page.locator('#speedCheckbox').uncheck();
    // click on a note near end of first page
    // HACK - use force: true to prevent Verovio SVG from intercepting pointer event
    // TODO - figure out why this happens
    await page.locator('#note-0000000547593172 use').first().click();
    // expect that the page number is 1
    await expect(page.locator('#pagination2')).toHaveText(' 1 ');
    // commence playback
    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    // eventually, the page number should change as viewport follows playback
    await expect(page.locator('#pagination2')).toHaveText(' 2 ');

    await page.keyboard.press('Space');
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
  });
});
