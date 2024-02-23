import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test local file input functionality', () => {
  test('Test that default MEI loads and renders as notation', async ({ page }) => {
    await expect(page.locator('g.note').first()).toBeVisible(); // can we see the first note?
    await expect(page.locator('g.note').first()).toHaveClass('note highlighted'); // first note highlighted?
  });

  test.fixme('Test local MusicXML file input', async ({ page }) => {
    // click on menu item to open file input
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('#fileMenuTitle');
    await page.click('#openMei');
    // WG: input element seems to be blocked by playwright, so we can't test this

    // const fileChooser = await fileChooserPromise;
    // await fileChooser.setFiles('e2e/test-encodings/BeetAnGeSample.musicxml');
    // // await page.goto('file://Users/werner/Sites/mei-friend-online/e2e/test-encodings/BeetAnGeSample.musicxml');

    // // check first syl element to have text "Auf"
    // await expect(page.locator('#syl-0000002024515355')).toHaveText('Auf');
  });
});

test.describe('Test input via URL', () => {
  test('Test OpenURL function to load known CMN MEI', async ({ page }) => {
    // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei'
    );
    await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
    await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
  });

  test.skip('Test OpenURL function to load text-based non-MEI file', async ({ page }) => {
    // load mxl file https://github.com/wergo/test-encodings/blob/main/BrahWiMeSample.mxl
    await openUrl(
      page,
      'https://raw.githubusercontent.com/wergo/test-encodings/dfd708a293cef72815c773db1425936099cb6b8f/BrahWiMeSample.mxl'
    );
    // currently throws error, because loading compressed files from GitHub without being logged in is not taken care of by mei-friend yet.

    // check first syl element to have text "Auf"
    // await expect(page.locator('#syl-0000002024515355')).toHaveText('Auf');
  });
});
