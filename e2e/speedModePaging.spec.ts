import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  setupPage,
  openLocalMei,
  setSpeedMode,
  pageCount,
  measureIdsOnPage,
  measureIdsPerPage,
  measureIdsInEncoding,
} from './setup';

// Two aspects of speed mode that are independent of <mdiv>s, but that speed
// mode handles in code paths of its own:
//
// 1) endings containing breaks (e2e/fixtures/ending-with-break.mei), a single
//    mdiv laid out as
//      mE1, <pb>, ending1[mE2, <sb>, mE3], mE4, <sb>, mE5, <pb>,
//      ending2[mE6, <sb>, mE7]
//    so a page boundary falls *inside* a volta bracket -- once with content
//    following the ending in the section, once with the ending as its last
//    element.
// 2) key and meter changes on an earlier page, which speed mode has to fold
//    into the scoreDef of the excerpt it hands to Verovio
//    (e2e/fixtures/keysig-changes-mei5.mei). That file is MEI 5, i.e. it uses
//    @keysig rather than the @key.sig of MEI <= 4.0.1, in both the scoreDef
//    and the staffDef spelling.
const fixtureDir = join(__dirname, 'fixtures');
const endings = readFileSync(join(fixtureDir, 'ending-with-break.mei'), 'utf-8');
const keySigs = readFileSync(join(fixtureDir, 'keysig-changes-mei5.mei'), 'utf-8');

/** Number of key signature accidentals rendered on the current page. */
function keyAccidentals(page: Page) {
  return page.locator('#verovio-panel g.keyAccid').count();
}

/** Number of meter signatures rendered on the current page. */
function meterSigs(page: Page) {
  return page.locator('#verovio-panel g.meterSig').count();
}

async function loadFixture(page: Page, name: string, mei: string, firstNoteId: string) {
  await openLocalMei(page, name, mei);
  await expect(page.locator('#' + firstNoteId)).toBeVisible({ timeout: 20000 });
}

test.beforeEach(async ({ page }) => {
  console.log('Testing speed-mode paging of endings and key/meter changes.');
  await setupPage(page);
});

test.describe('2 Speed mode pages endings that contain breaks.', () => {
  test("2.1 Breaks mode 'line': a page boundary inside a volta bracket", async ({ page }) => {
    await loadFixture(page, 'ending-with-break.mei', endings, 'note-mE1');
    await setSpeedMode(page, true, 'line');

    expect(await pageCount(page)).toBe(6);
    // page 3 starts inside ending1 and continues past it; page 6 is the second
    // half of ending2, which is the last element of the section
    expect(await measureIdsPerPage(page)).toEqual([
      ['mE1'],
      ['mE2'],
      ['mE3', 'mE4'],
      ['mE5'],
      ['mE6'],
      ['mE7'],
    ]);
  });

  test("2.2 Breaks mode 'encoded': only <pb> separates pages, <sb> inside endings does not", async ({ page }) => {
    await loadFixture(page, 'ending-with-break.mei', endings, 'note-mE1');
    await setSpeedMode(page, true, 'encoded');

    expect(await pageCount(page)).toBe(3);
    expect(await measureIdsPerPage(page)).toEqual([['mE1'], ['mE2', 'mE3', 'mE4', 'mE5'], ['mE6', 'mE7']]);
  });

  test("2.3 Breaks mode 'auto': every measure around the endings is shown exactly once", async ({ page }) => {
    await loadFixture(page, 'ending-with-break.mei', endings, 'note-mE1');
    await setSpeedMode(page, true, 'auto');

    const perPage = await measureIdsPerPage(page);
    for (const measures of perPage) expect(measures.length).toBeGreaterThan(0);
    expect(perPage.flat()).toEqual(measureIdsInEncoding(endings));
  });

  test('2.4 Speed mode pages the endings exactly like normal mode does', async ({ page }) => {
    await loadFixture(page, 'ending-with-break.mei', endings, 'note-mE1');

    await setSpeedMode(page, false, 'encoded');
    const normal = await measureIdsPerPage(page);

    await setSpeedMode(page, true, 'encoded');
    const speed = await measureIdsPerPage(page);

    expect(speed).toEqual(normal);
    expect(speed.flat()).toEqual(measureIdsInEncoding(endings));
  });
});

test.describe('3 Speed mode carries MEI 5 key and meter changes into its excerpts.', () => {
  for (const breaks of ['line', 'encoded'] as const) {
    test(`3.1 Breaks mode '${breaks}': @keysig of an earlier page reaches the current one`, async ({ page }) => {
      await loadFixture(page, 'keysig-changes-mei5.mei', keySigs, 'note-mK1-s1');
      await setSpeedMode(page, true, breaks);
      expect(await pageCount(page)).toBe(5);

      // Every break in this fixture is a <pb>, so 'line' and 'encoded' agree:
      // 5 pages, one measure each. Accidental counts are per page over both
      // staves: no key (0), E flat major from scoreDef@keysig (2 x 3 flats),
      // then D major from staffDef@keysig (2 x 2 sharps).
      const expected = [
        { measures: ['mK1'], keyAccidentals: 0, meterSigs: 2 },
        { measures: ['mK2'], keyAccidentals: 6, meterSigs: 2 },
        { measures: ['mK3'], keyAccidentals: 6, meterSigs: 0 },
        { measures: ['mK4'], keyAccidentals: 4, meterSigs: 0 },
        { measures: ['mK5'], keyAccidentals: 4, meterSigs: 0 },
      ];

      for (let p = 1; p <= expected.length; p++) {
        if (p > 1) {
          await page.locator('#nextPageButton').click();
          await expect(page.locator('#note-mK' + p + '-s1')).toBeVisible();
        }
        expect(await measureIdsOnPage(page)).toEqual(expected[p - 1].measures);
        // page 3 keeps E flat major although the change was encoded on page 2,
        // page 5 keeps D major although the change was encoded on page 4
        expect(await keyAccidentals(page)).toBe(expected[p - 1].keyAccidentals);
        expect(await meterSigs(page)).toBe(expected[p - 1].meterSigs);
      }
    });
  }

  test('3.2 Speed mode pages the key-change fixture exactly like normal mode does', async ({ page }) => {
    await loadFixture(page, 'keysig-changes-mei5.mei', keySigs, 'note-mK1-s1');

    await setSpeedMode(page, false, 'encoded');
    const normal = await measureIdsPerPage(page);

    await setSpeedMode(page, true, 'encoded');
    const speed = await measureIdsPerPage(page);

    expect(speed).toEqual(normal);
    expect(speed.flat()).toEqual(measureIdsInEncoding(keySigs));
  });
});
