import { test, expect, Page } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test editing functionality.', () => {
  test('Add, modify, and delete slur to selected elements', async ({ page }) => {
    let uuid: string | null; // id of the new slur

    await test.step('Open MEI file, turn page, and descrease scaling', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether note note-0000001568544877 is visible
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
      expect(currentLine).toBeVisible();
      let re = new RegExp('startid="#' + elements[0]);
      expect(currentLine).toHaveText(re);
      re = new RegExp('endid="#' + elements.at(-1));
      expect(currentLine).toHaveText(re);
    });

    await test.step('Delete slur', async () => {
      // delete this slur now
      console.log('Deleting slur: ', uuid);
      await deleteElement(page, [uuid]);
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
  // await expect(page.locator('#' + menuItem)).toBeVisible();
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
 *
 * @param page
 * @param ids
 * @returns
 */
async function deleteElement(page: Page, ids: string[]) {
  console.log('Deleting elements: ', ids);

  await page.locator('#manipulateMenuTitle').click();
  await page.locator('#delete').click();

  // check that the element has been deleted
  for (let id of ids) {
    // ids.forEach(async (id) => {
    const element = page.locator('g#' + id);
    console.log('Element: ' + element);
    //use page.poll to evaluate the condition that the element no longer exists in the DOM
    await expect(element).not.toBeVisible();
    //await expect(element).not.toBeVisible();
  }
  return true;
} // deleteElement()
