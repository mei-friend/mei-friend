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
    // WG TODO: input element seems to be blocked by playwright, so we can't test this

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

  test('Test OpenURL function to load text-based non-MEI file', async ({ page }) => {
    await openUrl(page, 'https://raw.githubusercontent.com/wergo/test-encodings/main/BeetAnGeSample.musicxml');

    // check first syl element to have text "Auf"
    await expect(page.locator('g.syl tspan tspan').first()).toHaveText('Auf');
    // click on last page button
    await page.click('#lastPageButton');
    // check last syl element to have text "schen"
    await expect(page.locator('g.syl tspan tspan').last()).toHaveText('schen');
  });

  test.skip('Test OpenURL function to load binary non-MEI file', async ({ page }) => {
    // load mxl file https://github.com/wergo/test-encodings/blob/main/BrahWiMeSample.mxl
    await openUrl(
      page,
      'https://raw.githubusercontent.com/wergo/test-encodings/dfd708a293cef72815c773db1425936099cb6b8f/BrahWiMeSample.mxl'
    );
    // currently throws error, because loading compressed files from GitHub without being logged in is not taken care of by mei-friend yet.

    // check first syl element to have text "Auf"
    // await expect(page.locator('#syl-0000002024515355')).toHaveText('Auf');
  });

  test('Test OpenURL function to load invalid text file', async ({ page }) => {
    await openUrl(page, 'https://raw.githubusercontent.com/wergo/test-encodings/main/test-tk-expansion.html');
    // inner text of verovio-panel should start with "Format not recognized"
    await expect(page.locator('#verovio-panel')).toContainText('Format not recognized');
    await expect(page.locator('#verovio-panel')).toContainText('Error Code: 1649499359728');
  });

  test('Test OpenURL function to load MEI file from server without CORS support', async ({ page }) => {
    await openUrl(page, 'https://iwk.mdw.ac.at/goebl/Beethoven_Op126Nr1.mei');
    // check for CORS error message in openUrlStatus
    await expect(page.locator('#openUrlStatus')).toHaveText('CORS error');
  });

  test('Test OpenURL function to load from invalid URL', async ({ page }) => {
    await openUrl(page, 'https://raw.githubusercontent.com/wergo/test-encodings/main/invalid.mei');
    // check for CORS error message in openUrlStatus
    await expect(page.locator('#openUrlStatus')).toContainText('404');
    // TODO: do not give CORS error, but "Network error" instead
  });
});

test.describe('Drag and drop functionality', () => {
  test.fixme('Test drag and drop of a local MEI file onto the mei-friend window', async ({ page }) => {
    // TODO: drag and drop MEI file from e2e/test-encodings/BeetAnGeSample.mei onto the browser window
    //  await page.locator('#item-to-be-dragged').dragTo(page.locator('#item-to-drop-at'));
  });
});
