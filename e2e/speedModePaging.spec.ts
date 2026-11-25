import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  setupPage,
  openLocalMei,
  setSpeedMode,
  currentPage,
  pageCount,
  measureIdsOnPage,
  measureIdsPerPage,
  measureIdsInEncoding,
  collectPerPage,
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
// mT1, <pb>, ending[mT2, <sb>, mT3 (bass clef), <sb>, mT4], mT5: an ending
// spanning three pages under 'line' breaks
const twoBreaks = readFileSync(join(fixtureDir, 'ending-two-breaks.mei'), 'utf-8');
// mB1, <sb>, mB2, <pb>, mB3, then a second section opening with <sb><pb>:
//   mB4, <pb><pb>, mB5, <sb><pb>
// Runs of breaks with no measure between them end one page, not one page each.
const adjacentBreaks = readFileSync(join(fixtureDir, 'adjacent-breaks.mei'), 'utf-8');

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

  test("2.5 Breaks mode 'line': an ending split by two breaks spans three pages", async ({ page }) => {
    await loadFixture(page, 'ending-two-breaks.mei', twoBreaks, 'note-mT1');
    // clef glyphs (SMuFL code points) drawn on a page, in order
    const clefs = (p: Page) =>
      p
        .locator('#verovio-panel g.clef use')
        .evaluateAll((els) => els.map((u) => (u.getAttribute('xlink:href') || u.getAttribute('href') || '').slice(1, 5)));
    const read = async (p: Page) => ({ measures: await measureIdsOnPage(p), clefs: await clefs(p) });

    await setSpeedMode(page, false, 'line');
    const normal = await collectPerPage(page, read, { stable: 800 });
    await setSpeedMode(page, true, 'line');
    expect(await pageCount(page)).toBe(4);
    const speed = await collectPerPage(page, read, { stable: 400 });

    expect(speed.map((p) => p.measures)).toEqual([['mT1'], ['mT2'], ['mT3'], ['mT4', 'mT5']]);
    // mT3's page starts in the treble clef and changes to the bass clef inside
    // mT3 (small F clef); mT4's page starts in the bass clef
    expect(speed.map((p) => p.clefs)).toEqual([['E050'], ['E050'], ['E050', 'E07C'], ['E062']]);
    // normal mode fits several of these short systems on one page, so the
    // two modes are compared system start by system start, not page by page
    expect(speed.flatMap((p) => p.measures)).toEqual(normal.flatMap((p) => p.measures));
    expect(speed.flatMap((p) => p.clefs)).toEqual(normal.flatMap((p) => p.clefs));
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
      // then D major from staffDef@keysig (2 x 2 sharps). As in normal mode,
      // a page followed by a change also shows its courtesy signatures at the
      // end: page 1 those of E flat major and 3/4, page 3 those of D major.
      const expected = [
        { measures: ['mK1'], keyAccidentals: 6, meterSigs: 4 },
        { measures: ['mK2'], keyAccidentals: 6, meterSigs: 2 },
        { measures: ['mK3'], keyAccidentals: 10, meterSigs: 0 },
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

/**
 * Measures per page of the whole encoding, for a rendering that may contain
 * pages with no measure at all (collectPerPage() waits for each page to show
 * measures, which such a page never does).
 */
async function pagesWithoutWaitingForContent(page: Page): Promise<string[][]> {
  const pages: string[][] = [];
  await page.locator('#firstPageButton').click();
  await expect.poll(() => currentPage(page)).toBe(1);
  const total = await pageCount(page);
  for (let p = 1; p <= total; p++) {
    if (p > 1) {
      await page.locator('#nextPageButton').click();
      await expect.poll(() => currentPage(page)).toBe(p);
    }
    await expect(page.locator('#verovioIcon')).not.toHaveClass(/clockwise/);
    await page.waitForTimeout(400); // the re-render follows the page number
    pages.push(await measureIdsOnPage(page));
  }
  return pages;
} // pagesWithoutWaitingForContent()

// 3) runs of breaks with nothing between them (e2e/fixtures/adjacent-breaks.mei).
// A <sb/><pb/> opening a section is correct MEI, and Verovio engraves such a run
// as a single break; counting it as two left speed mode with a page holding no
// measure at all, which it could then not build ("Cannot load MEI data").
test.describe('5 Speed mode collapses runs of breaks.', () => {
  test("5.1 Breaks mode 'line': <sb><pb> and <pb><pb> each end one page", async ({ page }) => {
    await loadFixture(page, 'adjacent-breaks.mei', adjacentBreaks, 'noteB1');
    await setSpeedMode(page, true, 'line');

    expect(await pageCount(page)).toBe(5);
    expect(await measureIdsPerPage(page)).toEqual([['mB1'], ['mB2'], ['mB3'], ['mB4'], ['mB5']]);
  });

  test("5.2 Breaks mode 'encoded': <pb><pb> ends one page, the <sb>s do not count", async ({ page }) => {
    await loadFixture(page, 'adjacent-breaks.mei', adjacentBreaks, 'noteB1');
    await setSpeedMode(page, true, 'encoded');

    expect(await pageCount(page)).toBe(4);
    expect(await measureIdsPerPage(page)).toEqual([['mB1', 'mB2'], ['mB3'], ['mB4'], ['mB5']]);
  });

  test('5.3 Speed mode pages the runs of breaks like normal mode, minus its empty pages', async ({ page }) => {
    await loadFixture(page, 'adjacent-breaks.mei', adjacentBreaks, 'noteB1');

    // 'encoded' only: there, pages follow from the encoding in both modes. Under
    // 'line' breaks, normal mode puts as many systems on a page as the notation
    // panel has room for, while speed mode always shows one -- so the two cannot
    // be compared page by page without pinning panel size and scale.
    await setSpeedMode(page, false, 'encoded');
    const normal = await pagesWithoutWaitingForContent(page);

    await setSpeedMode(page, true, 'encoded');
    const speed = await measureIdsPerPage(page);

    // Normal mode draws a page for every <pb>, so a second <pb> in a row (and the
    // trailing one) gives it a page with no measure on it. Speed mode cannot build
    // a page without measures -- that is the bug this fixture is about -- and
    // collapses such runs; apart from those empty pages, the two agree.
    expect(normal.filter((measures) => measures.length === 0).length).toBe(2);
    expect(speed).toEqual(normal.filter((measures) => measures.length > 0));
    expect(speed.flat()).toEqual(measureIdsInEncoding(adjacentBreaks));
  });

  test('5.4 Page navigation finds every element on the page it is shown on', async ({ page }) => {
    await loadFixture(page, 'adjacent-breaks.mei', adjacentBreaks, 'noteB1');
    await setSpeedMode(page, true, 'line');

    // speed.getPageWithElement() counts pages of its own, and has to arrive at
    // the page the element is really shown on
    const pageOf = (id: string) =>
      page.evaluate(async (id) => {
        const main = await import('/static/lib/main.js');
        const speed = await import('/static/lib/speed.js');
        return speed.getPageWithElement(main.v.xmlDoc, ['sb', 'pb'], id, 'line');
      }, id);

    const perPage = await measureIdsPerPage(page);
    for (const [index, measures] of perPage.entries()) {
      for (const id of measures) expect(await pageOf(id), 'page of ' + id).toBe(index + 1);
    }
    // the <pb> of the collapsed pair opens page 4, the <sb> still ends page 3
    expect(await pageOf('sbOpeningTwo'), 'page of the <sb> opening section two').toBe(3);
    expect(await pageOf('pbOpeningTwo'), 'page of the <pb> opening section two').toBe(4);
  });
});
