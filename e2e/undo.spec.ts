import { test, expect, Page } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Testing undo functions.');
  await setupPage(page);
});

test.describe('1 A single Ctrl-Z reverts a whole mei-friend edit operation.', () => {
  test('1.1 Undo reverts a chromatic pitch shift in one step', async ({ page }) => {
    const noteId = 'note-0000001117852400';
    let before: string;

    await test.step('Open MEI file and select a note', async () => {
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      await expect(page.locator('#note-0000001631474113')).toBeVisible();
      await selectElement(page, noteId);
    });

    await test.step('Shift pitch chromatically up and check editor content changed', async () => {
      before = await getEditorValue(page);
      await clickManipulate(page, 'pitchChromUp');
      await expect(async () => {
        expect(await getEditorValue(page)).not.toEqual(before);
      }).toPass({ timeout: 5000 });
    });

    await test.step('A single undo restores the pre-edit encoding', async () => {
      await page.locator('#notation').focus();
      await page.keyboard.press('Control+z');
      await expect(async () => {
        expect(await getEditorValue(page)).toEqual(before);
      }).toPass({ timeout: 5000 });
    });
  });

  test('1.2 Undo reverts inserting a note in one step', async ({ page }) => {
    const noteId = 'note-0000001117852400';
    let before: string;

    await test.step('Open MEI file and select a note', async () => {
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      await expect(page.locator('#note-0000001631474113')).toBeVisible();
      await selectElement(page, noteId);
    });

    await test.step('Insert a note and check editor content changed', async () => {
      before = await getEditorValue(page);
      await clickInsert(page, 'addNote');
      await expect(async () => {
        expect(await getEditorValue(page)).not.toEqual(before);
      }).toPass({ timeout: 5000 });
    });

    await test.step('A single undo restores the pre-insert encoding', async () => {
      await page.locator('#notation').focus();
      await page.keyboard.press('Control+z');
      await expect(async () => {
        expect(await getEditorValue(page)).toEqual(before);
      }).toPass({ timeout: 5000 });
    });
  });
});

test.describe('2 Undo keeps the annotation list and notation highlights in sync.', () => {
  test('2.1 Undoing an annotation removes its list entry and notation highlight', async ({ page }) => {
    const noteId = 'note-0000001117852400';

    await test.step('Open MEI file, select a note, and reveal the annotation panel', async () => {
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      await expect(page.locator('#note-0000001631474113')).toBeVisible();
      await selectElement(page, noteId);

      await page.locator('#showAnnotationsButton').click();
      await page.locator('#annotationPanel').waitFor({ state: 'visible' });
      await page.locator('#annotationToolsButton').click();
      await expect(page.locator('#annotateHighlight')).toBeVisible();
    });

    const listItemCountBefore = await page.locator('#listAnnotations .annotationListItem').count();

    await test.step('Create a highlight annotation on the selected note', async () => {
      await page.locator('#annotateHighlight').click();
      await expect(page.locator('#' + noteId)).toHaveClass(/annotationHighlight/);
      await expect(async () => {
        expect(await page.locator('#listAnnotations .annotationListItem').count()).toEqual(listItemCountBefore + 1);
      }).toPass({ timeout: 5000 });
    });

    await test.step('A single undo removes the annotation, its list entry, and its highlight', async () => {
      await page.locator('#notation').focus();
      await page.keyboard.press('Control+z');
      await expect(page.locator('#' + noteId)).not.toHaveClass(/annotationHighlight/);
      await expect(async () => {
        expect(await page.locator('#listAnnotations .annotationListItem').count()).toEqual(listItemCountBefore);
      }).toPass({ timeout: 5000 });
    });
  });
});

/**
 * Reads the current CodeMirror editor content.
 * @param {Page} page
 * @returns {Promise<string>}
 */
async function getEditorValue(page: Page): Promise<string> {
  return page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.getValue());
} // getEditorValue()

/**
 * Selects a single element by dispatching a click on it (avoids Playwright's
 * pointer-interception issues with overlapping SVG elements).
 * @param {Page} page
 * @param {string} id
 */
async function selectElement(page: Page, id: string) {
  await expect(page.locator('g#' + id)).toBeVisible();
  await page.locator('g#' + id).dispatchEvent('click', { bubbles: true });
  await expect(page.locator('g#' + id)).toHaveClass(/highlighted/);
} // selectElement()

/**
 * Shorthand for clicking on the INSERT menu item to insert elements
 * @param {Page} page
 * @param {string} menuItem
 */
async function clickInsert(page: Page, menuItem: string = 'addSlur') {
  await page.locator('#insertMenuTitle').click();
  await expect(page.locator('#' + menuItem)).toBeVisible();
  await page.locator('#' + menuItem).click();
  await expect(page.locator('#' + menuItem)).not.toBeVisible();
} // clickInsert()

/**
 * Shorthand for clicking on the MANIPULATE menu item to manipulate elements
 * @param {Page} page
 * @param {string} menuItem
 */
async function clickManipulate(page: Page, menuItem: string = 'pitchUpDiat') {
  await page.locator('#manipulateMenuTitle').click();
  await expect(page.locator('#' + menuItem)).toBeVisible();
  await page.locator('#' + menuItem).click();
  await expect(page.locator('#' + menuItem)).not.toBeVisible();
} // clickManipulate()
