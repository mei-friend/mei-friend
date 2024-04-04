import { test, expect, Page } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Insert notes, rests, and accidentals.', () => {
  test('Insert new note', async ({ page }) => {
    let uuid: string | null; // id of the new slur
    const noteId = 'note-0000001117852400'; // selected note

    await test.step('Open MEI file and select a note in first measure', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // select #note-0000001117852400
      await selectElements(page, [noteId]);

      // check whether note is highlighted
      await expect(page.locator('#' + noteId)).toBeVisible();
      await expect(page.locator('#' + noteId)).toHaveClass('note highlighted');
    });

    await test.step('Insert a note and check its content', async () => {
      let uuid = await insertElement(page, [noteId], 'note', 'addNote');
      console.log('New note inserted: ', uuid);

      // check that the new note is visible
      await expect(page.locator(`#${uuid}`)).toBeVisible();

      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      // test attributes of the new note
      await expect(currentLine).toHaveText(new RegExp('pname="a"'));
      await expect(currentLine).toHaveText(new RegExp('oct="4"'));
      await expect(currentLine).toHaveText(new RegExp('dur="8"'));
    });
  });

  test('Convert new notes to chord', async ({ page }) => {
    const ids = ['note-0000001117852400']; // first selected note
    let chordId: string | null; // id of the new chord

    await test.step('Open MEI file and select a note in first measure', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // select #note-0000001117852400
      await selectElements(page, ids);

      // check whether note is highlighted
      await expect(page.locator('#' + ids)).toBeVisible();
      await expect(page.locator('#' + ids)).toHaveClass('note highlighted');
    });

    await test.step('Add a note and change its pitch', async () => {
      let uuid = await insertElement(page, ids, 'note', 'addNote');
      console.log('First new note inserted: ', uuid);

      // check that the new note is visible
      await expect(page.locator(`#${uuid}`)).toBeVisible();

      // click on note to select it
      await selectElements(page, [uuid!]);

      // change pitch up of the new note
      await clickManipulate(page, 'pitchUpDiat');

      ids.push(uuid!);

      uuid = await insertElement(page, ids, 'note', 'addNote');
      console.log('Second new note inserted: ', uuid);

      // check that the new note is visible
      await expect(page.locator(`#${uuid}`)).toBeVisible();

      // click on note to select it
      await selectElements(page, [uuid!]);

      // change pitch up of the new note
      await clickManipulate(page, 'pitchOctaveDown');

      ids.push(uuid!);
    });

    await test.step('Select all three notes and convert to chord', async () => {
      // select elements
      await selectElements(page, ids);

      // check whether notes are highlighted
      await expect(page.locator('#' + ids[0])).toHaveClass('note highlighted');
      await expect(page.locator('#' + ids[1])).toHaveClass('note highlighted');
      await expect(page.locator('#' + ids[2])).toHaveClass('note highlighted');

      // convert the selected notes to a chord
      await clickManipulate(page, 'toggleChord');

      // find parent chord of g#note-0000001117852400
      const chord = page.locator('g.chord', { has: page.locator('g#' + ids[0]) });
      await expect(chord).toBeVisible();

      // retrieve the id of the new chord
      chordId = await chord.getAttribute('id');
      console.log('New chord inserted: ', chordId);

      // check chord in encoding
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(chordId!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('dur="8"'));
    });

    await test.step('Flip stem direction', async () => {
      // flip stem direction of the chord
      await clickManipulate(page, 'invertPlacement');

      // check encoding whether chord has stem direction down
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(chordId!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('stem.dir="down"'));
    });
  });

  test('Convert note to rest', async ({ page }) => {
    let uuid: string | null; // id of the new slur
    const noteId = 'note-0000001117852400'; // selected note

    await test.step('Open MEI file and select a note in second measure', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // select #note-0000001117852400
      await selectElements(page, [noteId]);

      // check whether note is highlighted
      await expect(page.locator('#' + noteId)).toBeVisible();
      await expect(page.locator('#' + noteId)).toHaveClass('note highlighted');
    });

    await test.step('Convert new note to rest', async () => {
      // convert the new note to a rest
      console.log('Converting note to rest: ', uuid);
      await clickManipulate(page, 'convertNoteToRest');

      // find the new rest
      const rest = page.locator('g.rest.highlighted');
      await expect(rest).toBeVisible();
      // retrieve the id of the new rest
      const newId = await rest.getAttribute('id');

      // check that the attributes of the new rests are correct
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(newId!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('dur="8"'));
      await expect(currentLine).toHaveText(new RegExp('oloc="4"'));
      await expect(currentLine).toHaveText(new RegExp('ploc="a"'));
    });
  });

  test('Delete notes', async ({ page }) => {
    let layer: any; // parent layer of the selected notes
    const ids = ['note-0000001318117900', 'note-0000000166242848', 'note-0000000167321589', 'note-0000001117852400']; // selected note

    await test.step('Open MEI file and select notes in first measure', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // select #note-0000001117852400
      await selectElements(page, ids);

      // check whether notes are highlighted
      await expect(page.locator('#' + ids[0])).toBeVisible();
      await expect(page.locator('#' + ids[0])).toHaveClass('note highlighted');
      await expect(page.locator('#' + ids[1])).toHaveClass('note highlighted');
      await expect(page.locator('#' + ids[2])).toHaveClass('note highlighted');
      await expect(page.locator('#' + ids[3])).toHaveClass('note highlighted');

      // get parent layer of the selected notes
      layer = page.locator('g.layer', { has: page.locator('g#' + ids[0]) });
    });

    await test.step('Delete selected elements', async () => {
      let uuid = await deleteElements(page, ids);
      console.log('Deleted elements: ', ids);

      // check that there are no child notes in the layer anymore
      await expect(layer.locator('g.note')).not.toBeVisible();
    });
  });

  test('Insert/delete accidentals', async ({ page }) => {
    const ids = [
      'note-0000001403952294',
      'note-0000002094055458',
      'note-0000001828075570',
      'note-0000000417567361',
      'note-0000000078077931',
    ]; // selected note
    const accids = ['addDoubleSharp', 'addSharp', 'addNatural', 'addFlat', 'addDoubleFlat'];
    let uuids: string[] = []; // id of the new accidental

    await test.step('Open MEI file and select notes in first measure', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('g#note-0000001631474113')).toBeVisible();
    });

    await test.step('Insert accidentals', async () => {
      for (let i = 0; i < ids.length; i++) {
        // select #note-0000000417567361
        await selectElements(page, ids.slice(i, i + 1));

        // find 'g#' + ids[0] and check whether it has an accid as child
        await expect(async () => {
          expect(page.locator('g#' + ids[i])).toBeVisible();
        }).toPass({ timeout: 5000 });

        // check whether notes are highlighted
        await expect(async () => {
          expect(page.locator('g#' + ids[i])).toHaveClass('note highlighted');
        }).toPass({ timeout: 5000 });

        // insert double sharp
        await clickInsert(page, accids[i]);

        // check whether note has an accid as child (not working in Firefox)
        const note = page.locator('g#' + ids[i]);
        await expect(note.locator('g.accid.highlighted')).toBeVisible();

        let uuid = await note.locator('g.accid.highlighted').getAttribute('id');
        if (uuid) uuids.push(uuid);
      }
      console.log('New accidentals inserted: ', uuids);
    });

    await test.step('Delete accidentals', async () => {
      console.log('Now deleting these accidentals: ', uuids);
      // select all uuids, not working as system in background gets selected
      // await selectElements(page, uuids);

      // delete new accidental
      // await deleteElement(page, uuids);

      for (let uuid of uuids) {
        await selectElements(page, [uuid]);
        await expect(page.locator('g#' + uuid)).toBeVisible();
        await deleteElements(page, [uuid]);
      }
    });
  });
});

test.describe('Insert, modify, and delete control elements.', () => {
  test('Slur to one selected element', async ({ page }) => {
    let uuid: string | null; // id of the new slur

    await test.step('Open MEI file, flip to last page', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // click on #lastPageButton
      await page.locator('#lastPageButton').click();

      // check whether first note on last page 'note-0000000604712286' is visible
      await expect(async () => {
        expect(page.locator('#note-0000000604712286')).toBeVisible();
      }).toPass({ intervals: [1000, 1500, 2000, 3500], timeout: 5000 });

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
      await expect(page.locator('#notation')).toHaveClass(/focus-visible/);

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
      await deleteElements(page, [uuid!]);
    });
  });

  test('Slur to two selected elements', async ({ page }) => {
    let uuid: string | null; // id of the new slur

    await test.step('Open MEI file, turn page, and descrease scaling', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

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
      await expect(page.locator('#notation')).toHaveClass(/focus-visible/);

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
      await deleteElements(page, [uuid!]);
    });
  });

  test('Tie to one selected element', async ({ page }) => {
    let uuid: string | null; // id of the new tie

    await test.step('Open MEI file, turn page, and descrease scaling', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether first note on first page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether first note on second page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000001568544877')).toBeVisible();

      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether first note on third page 'note-0000001568544877' is visible
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
      await expect(page.locator('#notation')).toHaveClass(/focus-visible/);

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
      await deleteElements(page, [uuid!]);
    });
  });

  test('Tie to two selected elements', async ({ page }) => {
    let uuid: string | null; // id of the new tie

    await test.step('Open MEI file and turn page', async () => {
      // open file from URL
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );

      // check whether page loaded successfully
      await expect(page.locator('#note-0000001631474113')).toBeVisible();

      // click on #nextPageButton
      await page.locator('#nextPageButton').click();

      // check whether first note on second page 'note-0000001568544877' is visible
      await expect(page.locator('#note-0000001568544877')).toBeVisible();
    });

    await test.step('Select two elements and add slur to selected elements', async () => {
      // select two elements and add slur to selected elements
      let elements = ['note-0000000732269518', 'note-0000001551304518'];
      await selectElements(page, elements);
      uuid = await insertElement(page, elements, 'tie', 'addTie');
      console.log('New tie inserted: ', uuid);

      // test whether the new slur has attributes startid and endid to the first and last elements respectively
      const slur = page.locator('g#' + uuid);
      await expect(slur).toBeVisible();
      const currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('startid="#' + elements[0]));
      await expect(currentLine).toHaveText(new RegExp('endid="#' + elements[elements.length - 1]));
    });

    await test.step('Modify tie', async () => {
      // modify this tie now
      console.log('Modifying tie: ', uuid);

      // get notation panel into focus
      await page.keyboard.press('Shift+Space');
      // check whether notation has class focus-visible
      await expect(page.locator('#notation')).toHaveClass(/focus-visible/);

      // press X to flip curve direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      let currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="above"'));

      // press X to flip curve direction
      await page.keyboard.press('x');
      // check encoding whether slur has curvedir="above"
      currentLine = page.locator('span[role="presentation"]', { has: page.getByText(uuid!) });
      await expect(currentLine).toBeVisible();
      await expect(currentLine).toHaveText(new RegExp('curvedir="below"'));
    });

    await test.step('Delete tie', async () => {
      // delete this tie now
      console.log('Deleting tie: ', uuid);
      await deleteElements(page, [uuid!]);
    });
  });
});

/**
 * Selects the elements with the given string array of   ids
 * @param {Page} page
 * @param {string[]} ids
 */
async function selectElements(page: Page, ids: string[]) {
  console.log('Selecting elements: ', ids);
  let i = 0;
  for (let id of ids) {
    // ids.forEach(async (id, i) => {
    let mod = { delay: 12, force: true };
    if (i > 0) {
      mod['modifiers'] = ['Meta'];
    }
    console.log(i + ': Selecting element with id: ', id + ' with mod: ', mod);

    // await expect(async () => {
    await expect(page.locator('g#' + id)).toBeVisible();
    // }).toPass({ timeout: 5000 });
    await page
      .locator('g#' + id)
      .locator('*')
      .first()
      .click(mod); // need to click on any child element to select the parent
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
  console.log('Inserting element: ', elementName, ' with menu item: ', menuItem + ' to elements: ', ids);

  // click on the INSERT menu item and select the element to insert
  await clickInsert(page, menuItem);

  // find enclosing measure
  const measure = page.locator('g.measure', { has: page.locator('g#' + ids[0]) });
  await expect(measure).toBeVisible();

  // wait for the element to be inserted (necessary for Firefox)
  await page.waitForTimeout(2000);

  // check that element is visible (not working in Firefox)
  await expect(async () => {
    // exipect(measure.locator('g.' + elementName + '.highlighted')).toBeAttached();
    page.waitForSelector('g.' + elementName + '.highlighted', { state: 'attached' });
    // expect(measure.locator('g.' + elementName + '.highlighted')).toBeVisible();
    // expect(measure.locator('g.' + elementName + '.highlighted')).toHaveAttribute('id');
  }).toPass({ timeout: 5000 });

  let newId = await measure.locator('g.' + elementName + '.highlighted').getAttribute('id');
  console.log('new element ' + elementName + ': ' + newId + ' inserted.');

  await expect(page.locator(`#${newId}`)).toBeVisible();
  return newId;
} // insertElements()

/**
 * Deletes the selected elements and check their absence
 * @param {Page} page
 * @param {string[]} ids
 * @returns
 */
async function deleteElements(page: Page, ids: string[]) {
  console.log('Deleting elements: ', ids);

  // delete the selected elements through the menu bar
  await clickManipulate(page, 'delete');

  // check that the element(s) have been deleted
  for (let id of ids) {
    // ids.forEach(async (id) => {
    const element = page.locator('g#' + id);
    console.log('Checking deleted element ' + id + ': ' + element);
    // check whether the element is not visible
    await expect(element).not.toBeVisible();
  }
  return true;
} // deleteElement()

/**
 * Shorthand for clicking on the INSERT menu item to insert elements
 * @param page
 * @param menuItem
 * @returns
 */
async function clickInsert(page: Page, menuItem: string = 'addSlur') {
  await page.locator('#insertMenuTitle').click();
  await expect(page.locator('#' + menuItem)).toBeVisible();
  await page.locator('#' + menuItem).click();

  await expect(page.locator('#' + menuItem)).not.toBeVisible();
  return true;
} // insert()

/**
 * Shorthand for clicking on the MANIPULATE menu item to manipulate elements
 * @param page
 * @param menuItem
 * @returns
 */
async function clickManipulate(page: Page, menuItem: string = 'pitchUpDiat') {
  await page.locator('#manipulateMenuTitle').click();
  await expect(page.locator('#' + menuItem)).toBeVisible();
  await page.locator('#' + menuItem).click();

  await expect(page.locator('#' + menuItem)).not.toBeVisible();
  return true;
} // manipulate()
