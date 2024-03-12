import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';
import exp from 'constants';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test facsimile functionality.', () => {
  test('Open MEI with facsimile and check presence of encoding, source image, and zones', async ({ page }) => {
    // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO57_BreitkopfHaertel/9d60074/Beethoven_WoO57-Breitkopf.mei'
    );
    await expect(page.locator('#beam-0000001508587757 polygon').first()).toBeVisible();
    await expect(page.locator('#note-0000001642495417 use')).toBeVisible();
    await expect(page.locator('#sourceImageSvg image')).toBeVisible();
    await expect(page.locator('#sourceImageSvg rect').first()).toBeVisible();
    await expect(page.locator('#sourceImageSvg text').first()).toBeVisible();
  });

  test('Open MEI with facsimile, turn to last page and check display', async ({ page }) => {
    // Check the expected MEI elements are visible (Beethoven's WoO 57)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO57_BreitkopfHaertel/9d60074/Beethoven_WoO57-Breitkopf.mei'
    );
    await expect(page.locator('#beam-0000001508587757 polygon').first()).toBeVisible();

    // click on lastPageButton to go to the last page
    await page.click('#lastPageButton');

    // check that note note-0000002006782049 is visible
    await expect(page.locator('#note-0000002006782049 use')).toBeVisible();
    await expect(page.locator('#sourceImageSvg image')).toBeVisible();
    await expect(page.locator('#sourceImageSvg rect').first()).toBeVisible();
    await expect(page.locator('#sourceImageSvg text').first()).toBeVisible();
  });

  test('Open MEI with minimal facsimile and check display', async ({ page }) => {
    // Check the expected MEI elements are visible (Beethoven's WoO 57)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_Op76_BreitkopfHaertel/f769e83/Beethoven_Op76-Breitkopf-Haertel_pb-facs.mei'
    );
    await expect(page.locator('#n7pyz78 use').first()).toBeVisible();
    // find sourceImageSvg and check that it has no children
    await expect(page.locator('#sourceImageSvg').locator('*')).toHaveCount(0);
    // check that facsimileMessagePanel h2 contains text
    await expect(page.locator('#facsimileMessagePanel h2')).toBeVisible();
  });
});
