import { test, expect, Page } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test insertion functionality.', () => {
  test('Add, modify, and delete slur to one selected element', async ({ page }) => {
    let uuid: string | null; // id of the new slur

    await test.step('Open MEI file, flip to last page', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      // click on #nextPageButton
      await page.locator('#lastPageButton').click();

      // check whether first note on last page 'note-0000000604712286' is visible
      await expect(page.locator('#note-0000000604712286')).toBeVisible();

      // retrieve width from svg inside verovio-panel
      const height = await page.locator('#verovio-panel svg').first().getAttribute('height');
      console.log('Height before: ', height);
    });

    await test.step('Select one element and add slur to that element', async () => {
      // select one element and add slur to that element (expecting next note to be selected)
      let elements = ['note-0000002071553041'];
      await selectElements(page, elements);
      uuid = await insertElement(page, elements, 'slur', 'addSlur');
      console.log('New slur inserted: ', uuid);

      // test whether the new slur has attributes startid and endid to the first and last elements respectively
      const slur = page.locator('g#' + uuid);
      await expect(slur).toBeVisible();
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('startid="#' + elements[0]));
      await expect(currentLine).toHaveText(new RegExp('endid="#note-0000001587074923"')); // expected next note
    });

    await test.step('Modify slur', async () => {
      // modify this slur now
      console.log('Modifying slur: ', uuid);

      // get notation panel into focus
      await page.keyboard.press('Shift+Space');
      // check whether notation has class focus-visible
      const notation = page.locator('#notation');
      await expect(notation).toHaveClass(/focus-visible/);

      // press X to flip slur direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      let currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="above"'));

      // press X to flip slur direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="below"'));
    });

    await test.step('Delete slur', async () => {
      // delete this slur now
      console.log('Deleting slur: ', uuid);
      await deleteElement(page, [uuid!]);
    });
  });

  test('Add, modify, and delete slur to two selected elements', async ({ page }) => {
    let uuid: string | null; // id of the new slur

    await test.step('Open MEI file, turn page, and descrease scaling', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether first note on second page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000001568544877')).toBeVisible();

      // retrieve width from svg inside verovio-panel
      const height = await page.locator('#verovio-panel svg').first().getAttribute('height');
      console.log('Height before: ', height);

      // click on decreaseScaleButton
      await page.locator('#decreaseScaleButton').click({
        clickCount: 1,
      });

      // poll until width attribute in svg is smaller than width before
      await expect(async () => {
        const newHeight = await page.locator('#verovio-panel svg').first().getAttribute('height');
        expect(newHeight).not.toEqual(height);
        console.log('Height after: ', newHeight);
      }).toPass({ timeout: 5000 });
    });

    await test.step('Select two elements and add slur to selected elements', async () => {
      // select two elements and add slur to selected elements
      let elements = ['note-0000001751146466', 'note-0000001042243679'];
      await selectElements(page, elements);
      uuid = await insertElement(page, elements, 'slur', 'addSlur');
      console.log('New slur inserted: ', uuid);

      // test whether the new slur has attributes startid and endid to the first and last elements respectively
      const slur = page.locator('g#' + uuid);
      await expect(slur).toBeVisible();
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('startid="#' + elements[0]));
      await expect(currentLine).toHaveText(new RegExp('endid="#' + elements[elements.length - 1]));
    });

    await test.step('Modify slur', async () => {
      // modify this slur now
      console.log('Modifying slur: ', uuid);

      // get notation panel into focus
      await page.keyboard.press('Shift+Space');
      // check whether notation has class focus-visible
      const notation = page.locator('#notation');
      await expect(notation).toHaveClass(/focus-visible/);

      // press X to flip slur direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      let currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="above"'));

      // press X to flip slur direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="below"'));
    });

    await test.step('Delete slur', async () => {
      // delete this slur now
      console.log('Deleting slur: ', uuid);
      await deleteElement(page, [uuid!]);
    });
  });

  test('Add a tie to one selected element', async ({ page }) => {
    let uuid: string | null; // id of the new tie

    await test.step('Open MEI file, turn page, and descrease scaling', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether first note on second page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether first note on second page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000001568544877')).toBeVisible();

      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether first note on second page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000000973543454')).toBeVisible();
    });

    await test.step('Select one element and add a tie', async () => {
      // select two elements and add slur to selected elements
      let elements = ['note-0000001209141443'];
      await selectElements(page, elements);
      uuid = await insertElement(page, elements, 'tie', 'addTie');
      console.log('New tie inserted: ', uuid);

      // test whether the new slur has attributes startid and endid to the first and last elements respectively
      const tie = page.locator('g#' + uuid);
      await expect(tie).toBeVisible();
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('startid="#' + elements[0]));
      await expect(currentLine).toHaveText(new RegExp('endid="#note-0000002071154177')); // expected note in the next measure
    });

    await test.step('Modify tie', async () => {
      // modify this slur now
      console.log('Modifying tie: ', uuid);

      // get notation panel into focus
      await page.keyboard.press('Shift+Space');
      // check whether notation has class focus-visible
      const notation = page.locator('#notation');
      await expect(notation).toHaveClass(/focus-visible/);

      // press X to flip slur direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      let currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="above"'));

      // press X to flip slur direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="below"'));
    });

    await test.step('Delete tie', async () => {
      // delete this slur now
      console.log('Deleting tie: ', uuid);
      await deleteElement(page, [uuid!]);
    });
  });
});

/**
 * Selects the elements with the given string array of   ids
 * @param {Page} page
 * @param {string[]} ids
 */
async function selectElements(page: Page, ids: string[]) {
  let i = 0;
  for (let id of ids) {
    // ids.forEach(async (id, i) => {
    console.log(i + ': Selecting element with id: ', id);
    let mod = { force: true };
    if (i > 0) {
      mod['modifiers'] = ['Meta'];
    }
    let element = page.locator('g#' + id);
    await expect(element).toBeVisible();
    await element.locator('*').first().click(mod); // need to click on any child element to select the parent
    i++;
  }
  return true;
} // selectElements()

/**
 * Inserts the given element to the selected elements, using the INSERT menu item
 * @param {Page} page
 * @param {string[]} ids
 * @param {string} elementName
 * @param {string} menuItem
 */
async function insertElement(page: Page, ids: string[], elementName: string = 'slur', menuItem: string = 'addSlur') {
  await page.locator('#insertMenuTitle').click();
  await page.locator('#insertMenuTitle').hover();
  await expect(page.locator('#' + menuItem)).toBeVisible();
  await page.locator('#' + menuItem).click();

  // check that element is visible
  const measure = page.locator('g.measure', { has: page.locator('g#' + ids[0]) });
  const element = measure.locator('g.' + elementName + '.highlighted');

  await expect(async () => {
    await expect(element).toHaveAttribute('id');
  }).toPass({ timeout: 5000 });
  const newId = await element.getAttribute('id');
  console.log('new element ' + elementName + ': ' + newId + ' inserted.');

  await expect(page.locator(`#${newId}`)).toBeVisible();
  return newId;
} // insertElements()

/**
 * Deletes the elements with the given string array of ids
 * @param {Page} page
 * @param {string[]} ids
 * @returns
 */
async function deleteElement(page: Page, ids: string[]) {
  console.log('Deleting elements: ', ids);

  // select the elements through the menu bar
  await page.locator('#manipulateMenuTitle').click();
  await page.locator('#delete').click();

  // check that the element(s) have been deleted
  for (let id of ids) {
    // ids.forEach(async (id) => {
    const element = page.locator('g#' + id);
    console.log('Deleting element ' + id + ': ' + element);
    // check whether the element is not visible
    await expect(element).not.toBeVisible();
  }
  return true;
} // deleteElement()
