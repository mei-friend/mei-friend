import { test, expect, Page } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test editing functionality.', () => {

  // TODO: Split into test.step 
  test('Add, modify, and delete slur to selected elements', async ({ page }) => {
    // open file from URL
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
    );
    // click on #nextPageButton
    await page.locator('#nextPageButton').click();

    // click on decreaseScaleButton
    await page.locator('#decreaseScaleButton').click({
      clickCount: 3,
    });

    // check first note on second page
    await expect(page.locator('#note-0000001568544877')).toBeVisible();

    // select two elements and add slur to selected elements
    let elements = ['note-0000001751146466', 'note-0000001042243679'];
    let uuid = await insertElement(page, elements, 'slur', 'addSlur');
    console.log('New slur inserted: ', uuid);

    // delete this slur now
    if (uuid) {
      console.log('Deleting slur: ', uuid);
      await deleteElement(page, [uuid]);
    }
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
    let note = page.locator('g#' + id);
    await expect(note).toBeVisible();
    await note.locator('*').first().click(mod); // need to click on any child element to select the parent
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
  await selectElements(page, ids);

  await page.locator('#insertMenuTitle').click();
  await page.locator('#insertMenuTitle').hover();
  // await expect(page.locator('#' + menuItem)).toBeVisible();
  await page.locator('#' + menuItem).click();

  // check that element is visible
  const measure = page.locator('g.measure', { has: page.locator('g#' + ids[0]) });
  const element = measure.locator('g.' + elementName + '.highlighted');
  const newId = await element.getAttribute('id');
  console.log('new element ' + elementName + ': ' + newId + ' inserted.');

  await expect(page.locator(`#${newId}`)).toBeVisible();
  return newId;
} // insertElements()

async function deleteElement(page: Page, ids: string[]) {
  await selectElements(page, ids);

  await page.locator('#manipulateMenuTitle').click();
  await page.locator('#delete').click();
  ids.forEach(async (id) => {
    // check that the element has been deleted
    const element = page.locator('g#' + id);
    console.log('Element: ' + element);
    await expect(element).not.toBeVisible();
  });
  return true;
} // deleteElement()
