import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Testing facsimile functions.');
  await setupPage(page);
});

test.describe('1 Test facsimile functionality.', () => {
  test('1.1 Open MEI with facsimile and check presence of encoding, source image, and zones', async ({ page }) => {
    // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO57_BreitkopfHaertel/9d60074/Beethoven_WoO57-Breitkopf.mei'
    );
    await expect(page.locator('#beam-0000001508587757 polygon').first()).toBeVisible();
    await expect(page.locator('#note-0000001642495417 use')).toBeVisible();
    let facsimilePanel = page.locator('#facsimile-panel');
    await expect(facsimilePanel.locator('div svg')).toBeVisible();
    await expect(facsimilePanel.locator('div rect').first()).toBeVisible();
    await expect(facsimilePanel.locator('div text').first()).toBeVisible();
  });

  test('1.2 Open MEI with facsimile, turn to last page and check display', async ({ page }) => {
    // Check the expected MEI elements are visible (Beethoven's WoO 57)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO57_BreitkopfHaertel/9d60074/Beethoven_WoO57-Breitkopf.mei'
    );
    await expect(page.locator('#beam-0000001508587757').first()).toBeVisible();

    // change breaksSelect to 'encoded' and check that it has changed
    await page.locator('#breaksSelect').selectOption('encoded');
    await expect(page.locator('#breaksSelect')).toHaveValue('encoded');

    // check whether an element from the end of the page is visible
    await expect(page.locator('g#chord-0000000104286025')).toBeVisible();
    // await page.locator('g#chord-0000000104286025').scrollIntoViewIfNeeded({ timeout: 5000 });

    // click on a specific zone, check visibility of note
    await expect(page.locator('rect#measure-0000000595472239')).toBeVisible();
    // await page.locator('rect#measure-0000000595472239').scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.locator('text#measure-0000000595472239').click();
    // check whether measure is highlighted in notation panel
    await expect(page.locator('g#measure-0000000595472239')).toBeVisible();
    await expect(page.locator('g#measure-0000000595472239')).toHaveClass('measure highlighted');

    // click on lastPageButton to go to the last page
    await page.click('#lastPageButton');

    // check that note note-0000002006782049 is visible
    await expect(page.locator('#note-0000002006782049 use')).toBeVisible();
    let facsimilePanel = page.locator('#facsimile-panel');
    await expect(facsimilePanel.locator('div image')).toBeVisible();
    await expect(facsimilePanel.locator('div rect').first()).toBeVisible();
    await expect(facsimilePanel.locator('div text').first()).toBeVisible();

    // click on specific zone, check visibility of note
    await page.locator('text#measure-0000001750764473').click();
    await page.getByText('"measure-0000001750764473"').click();
    // check whether first note in measure is highlighted in notation panel
    await expect(page.locator('g#note-0000001956624735')).toHaveClass('note highlighted');
  });

  test('1.3 Open MEI with minimal facsimile, click-draw zone, and resize and move, and delete it', async ({ page }) => {
    // Check the expected MEI elements are visible (Beethoven's WoO 57)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_Op76_BreitkopfHaertel/f769e83/Beethoven_Op76-Breitkopf-Haertel_pb-facs.mei'
    );
    await expect(page.locator('#n7pyz78 use').first()).toBeVisible();
    // find sourceImageSvg and check that it has no children
    let facsimilePanel = page.locator('#facsimile-panel');
    await expect(facsimilePanel.locator('div')).toHaveCount(1);
    await expect(facsimilePanel.locator('div').first()).toHaveId('facsimileMessagePanel');

    // check that facsimileMessagePanel h2 contains text
    await expect(page.locator('#facsimileMessagePanel h2')).toBeVisible();

    // click facsimileFullPageCheckbox and check whether image is visible inside sourceImageSvg
    await page.click('#facsimileFullPageCheckbox');

    await expect(facsimilePanel.locator('div svg')).toBeVisible();

    await page.getByRole('button', { name: 'Decrease notation image' }).click({
      clickCount: 7,
    });
    await expect(facsimilePanel.locator('div svg')).toBeVisible();

    // set notation and facsimile top
    await page.locator('#viewMenuTitle').click();
    await page.locator('#notationTop').click();
    await page.locator('#viewMenuTitle').click();
    await page.locator('#facsimileLeft').click();

    // enable zone editing
    await page.locator('#facsimileEditZonesCheckbox').click();

    // click on a measure and check that the note is visible
    await page.getByText('"m18xsdz"').click();
    await expect(page.locator('#n7pyz78 use')).toBeVisible();

    // draw new zone for that measure
    await page.mouse.move(120, 120);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(240, 240);
    await page.mouse.up();

    // get id from zone and check that it starts with 'z'
    const zoneId = await facsimilePanel.locator('div svg').locator('rect').last().getAttribute('id');
    console.log('Id of newly created zone:', zoneId);
    if (zoneId) expect(zoneId[0]).toBe('z');

    // resize the zone horizontally
    const zone = facsimilePanel.locator('div svg').locator('rect').last();
    let width = await zone.getAttribute('width');
    let x = await zone.getAttribute('x');
    let y = await zone.getAttribute('y');

    // move mouse to the zone and resize it horizontally
    await page.mouse.move(240, 180);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(180, 180);
    await page.mouse.up();

    let newWidth = await zone.getAttribute('width');
    if (width && newWidth) {
      console.log('Zone: Width before:', width, 'Width after:', newWidth);
      expect(parseFloat(width)).toBeGreaterThan(parseFloat(newWidth));
    }

    // move zone with mouse and check that it has moved
    await page.mouse.move(140, 140);
    await page.mouse.down({ button: 'left' });
    await page.mouse.move(180, 180);
    await page.mouse.up();

    let newX = await zone.getAttribute('x');
    let newY = await zone.getAttribute('y');

    if (x && newX && y && newY) {
      console.log('Zone: X before:', x, 'X after:', newX);
      expect(parseFloat(x)).toBeLessThan(parseFloat(newX));
      console.log('Zone: Y before:', y, 'Y after:', newY);
      expect(parseFloat(y)).toBeLessThan(parseFloat(newY));
    }

    // delete the zone
    await page.locator('#manipulateMenuTitle').click();
    await page.locator('#delete').click();

    // check that the zone has been deleted
    await expect(facsimilePanel.locator('div svg').locator('rect').last()).not.toBeVisible();
  });
});
