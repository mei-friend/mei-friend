import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  setupPage,
  openUrl,
  openLocalMei,
  forceSelectOption,
  setSpeedMode,
  waitForNotation,
  currentPage,
  pageCount,
  measureIdsOnPage,
  measureIdsPerPage,
  measureIdsInEncoding,
} from './setup';

// Fixture layout (see e2e/fixtures/multi-mdiv-speed.mei):
//   mdiv1: m1a, <pb>, m1b                          (1 staff)
//   mdiv2: m2a, <pb>, m2b                           (2 staves) -- starts
//          immediately after mdiv1 with NO separating break, so m1b and m2a
//          share one rendered page (a genuine mixed-mdiv page)
//   mdiv3: <pb>, m3a                                (1 staff) -- starts with
//          an explicit break, so it lands cleanly on its own page
// Under 'line' and 'encoded' breaks mode alike this yields 4 pages:
//   page 1: m1a                    (mdiv1 only, 1 staff)
//   page 2: m1b + m2a              (mdiv1 + mdiv2 mixed, 3 staves)
//   page 3: m2b                    (mdiv2 only, 2 staves)
//   page 4: m3a                    (mdiv3 only, 1 staff)
const fixtureDir = join(__dirname, 'fixtures');
const multiMdiv = readFileSync(join(fixtureDir, 'multi-mdiv-speed.mei'), 'utf-8');
// mdivA: mA1, <pb>, mA2 (1 staff) / mdivB: mB1 (3 staves) / mdivC: mC1, <pb>,
// mC2 (2 staves). Neither mdivB nor mdivC starts with a break, so page 2 is
// mA2 + mB1 + mC1: one page out of three different mdivs.
const threeMdiv = readFileSync(join(fixtureDir, 'three-mdiv-page.mei'), 'utf-8');
// mdivFirst: mS1, <pb>, mS2 / mdivSecond: mS3, <pb>, mS4, with a slur from
// mS3 to mS4 -- a page-spanning slur that lives in the *second* mdiv.
const spannerMdiv = readFileSync(join(fixtureDir, 'spanner-across-mdiv.mei'), 'utf-8');

const woo70Url =
  'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/' +
  'Beethoven_WoO70-Breitkopf.mei';
// Beethoven WoO64 (Theme + 6 Variations): 7 mdivs, only a single encoded <pb>
// in the whole document, so most of the 6 mdiv boundaries have no separating
// break at all -- a real-world stress test for mixing mdivs onto shared pages.
const woo64Url =
  'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO64_BreitkopfHaertel/refs/heads/master/' +
  'Beethoven_WoO64-Breitkopf-mdivs.mei';

/** Measure `@xml:id`s of an encoding, grouped by the `@xml:id` of their mdiv. */
function measureIdsPerMdiv(mei: string): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const mdivs = mei.matchAll(/<mdiv\b[^>]*\bxml:id="([^"]+)"([\s\S]*?)(?=<mdiv\b|<\/body>)/g);
  for (const mdiv of mdivs) result[mdiv[1]] = measureIdsInEncoding(mdiv[2]);
  return result;
}

async function loadFixture(page: Page, name: string, mei: string, firstNoteId: string) {
  await openLocalMei(page, name, mei);
  await expect(page.locator('#' + firstNoteId)).toBeVisible({ timeout: 20000 });
}

test.beforeEach(async ({ page }) => {
  console.log('Testing speed-mode multi-mdiv support.');
  await setupPage(page);
});

test.describe('1 Speed mode paginates and renders across multiple mdivs.', () => {
  test('1.1 Each mdiv page-turns correctly, including a page mixing two mdivs', async ({ page }) => {
    await test.step('Load the multi-mdiv fixture and enable speed mode', async () => {
      await loadFixture(page, 'multi-mdiv-speed.mei', multiMdiv, 'note-m1a-1');
      await setSpeedMode(page, true, 'line');
      expect(await pageCount(page)).toBe(4);
    });

    await test.step('Page 1: mdiv1 only, single staff', async () => {
      expect(await currentPage(page)).toBe(1);
      await expect(page.locator('#note-m1a-1')).toBeVisible();
      await expect(page.locator('#note-m1b-1')).not.toBeVisible();
      await expect(page.locator('#note-m2a-s1-1')).not.toBeVisible();
      expect(await page.locator('g.staff').count()).toBe(1);
    });

    await test.step('Page 2: mdiv1 + mdiv2 mixed onto one page (the core fix)', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-m1b-1')).toBeVisible();
      await expect(page.locator('#note-m2a-s1-1')).toBeVisible();
      await expect(page.locator('#note-m2a-s2-1')).toBeVisible();
      await expect(page.locator('#note-m1a-1')).not.toBeVisible();
      await expect(page.locator('#note-m2b-s1-1')).not.toBeVisible();
      // 1 staff from mdiv1 + 2 staves from mdiv2, both mdivs' scoreDefs intact
      expect(await page.locator('g.staff').count()).toBe(3);
    });

    await test.step('Page 3: mdiv2 only, two staves', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-m2b-s1-1')).toBeVisible();
      await expect(page.locator('#note-m2b-s2-1')).toBeVisible();
      await expect(page.locator('#note-m1b-1')).not.toBeVisible();
      await expect(page.locator('#note-m3a-1')).not.toBeVisible();
      expect(await page.locator('g.staff').count()).toBe(2);
    });

    await test.step('Page 4: mdiv3 only, single staff (clean boundary)', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-m3a-1')).toBeVisible();
      await expect(page.locator('#note-m2b-s1-1')).not.toBeVisible();
      expect(await page.locator('g.staff').count()).toBe(1);
    });
  });

  test('1.2 A page can mix three mdivs with different staff counts', async ({ page }) => {
    await test.step('Load the three-mdiv fixture and enable speed mode', async () => {
      await loadFixture(page, 'three-mdiv-page.mei', threeMdiv, 'note-mA1');
      await setSpeedMode(page, true, 'line');
      expect(await pageCount(page)).toBe(3);
    });

    await test.step('Page 2 carries mA2 + mB1 + mC1, i.e. 1 + 3 + 2 staves', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-mC1-s1')).toBeVisible();
      expect(await measureIdsOnPage(page)).toEqual(['mA2', 'mB1', 'mC1']);
      expect(await page.locator('g.staff').count()).toBe(6);
    });

    await test.step('Page 3 falls back to mdivC alone', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-mC2-s1')).toBeVisible();
      expect(await measureIdsOnPage(page)).toEqual(['mC2']);
      expect(await page.locator('g.staff').count()).toBe(2);
    });
  });

  for (const breaks of ['line', 'encoded', 'auto'] as const) {
    test(`1.3 Breaks mode '${breaks}': every measure of every mdiv is shown exactly once`, async ({ page }) => {
      await loadFixture(page, 'multi-mdiv-speed.mei', multiMdiv, 'note-m1a-1');
      await setSpeedMode(page, true, breaks);

      // Layout-independent invariant: paging through the whole encoding has to
      // yield every measure of every mdiv, in document order, with no measure
      // missing (a page speed mode failed to build) and none repeated (a page
      // leaking content from its neighbour).
      const perPage = await measureIdsPerPage(page);
      expect(perPage.flat()).toEqual(measureIdsInEncoding(multiMdiv));
      for (const measures of perPage) expect(measures.length).toBeGreaterThan(0);
    });
  }

  test("1.4 Breaks mode 'none' shows the whole multi-mdiv encoding at once", async ({ page }) => {
    await loadFixture(page, 'multi-mdiv-speed.mei', multiMdiv, 'note-m1a-1');
    await setSpeedMode(page, true, 'none');

    // With 'none', speed mode is bypassed and Verovio gets the full encoding;
    // all three mdivs have to be there, not just the first.
    expect(await measureIdsOnPage(page)).toEqual(measureIdsInEncoding(multiMdiv));
  });

  test('1.5 Speed mode and normal mode split the encoding into the same pages', async ({ page }) => {
    await loadFixture(page, 'multi-mdiv-speed.mei', multiMdiv, 'note-m1a-1');

    // 'encoded' is the one breaks mode in which Verovio's own layout is fully
    // determined by the encoding, so normal mode is a valid reference here.
    await setSpeedMode(page, false, 'encoded');
    const normal = await measureIdsPerPage(page);

    await setSpeedMode(page, true, 'encoded');
    const speed = await measureIdsPerPage(page);

    expect(speed).toEqual(normal);
    expect(speed.flat()).toEqual(measureIdsInEncoding(multiMdiv));
  });

  test('1.6 A page-spanning slur inside a later mdiv is anchored on both pages', async ({ page }) => {
    await loadFixture(page, 'spanner-across-mdiv.mei', spannerMdiv, 'note-mS1');
    await setSpeedMode(page, true, 'encoded');
    expect(await pageCount(page)).toBe(3);

    await test.step('Page 2 starts the slur (and mixes both mdivs)', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-mS3')).toBeVisible();
      expect(await measureIdsOnPage(page)).toEqual(['mS2', 'mS3']);
      await expect(page.locator('#slurAcrossPages')).toBeVisible();
    });

    await test.step('Page 3 receives the tail of the slur from the previous page', async () => {
      await page.locator('#nextPageButton').click();
      await expect(page.locator('#note-mS4')).toBeVisible();
      expect(await measureIdsOnPage(page)).toEqual(['mS4']);
      // the incoming slur is anchored to speed mode's leading dummy measure;
      // it is only found if page spanners were counted across both mdivs
      expect(await page.locator('#verovio-panel g.slur').count()).toBeGreaterThan(0);
    });
  });

  test("1.7 The section-select dropdown jumps to each mdiv's actual first page", async ({ page }) => {
    await loadFixture(page, 'multi-mdiv-speed.mei', multiMdiv, 'note-m1a-1');
    await setSpeedMode(page, true, 'line');

    await test.step('sectionSelect lists all three mdivs', async () => {
      await expect(page.locator('#sectionSelect')).toBeVisible();
      const options = await page.locator('#sectionSelect option').allTextContents();
      expect(options.some((o) => o.includes('mdiv1'))).toBe(true);
      expect(options.some((o) => o.includes('mdiv2'))).toBe(true);
      expect(options.some((o) => o.includes('mdiv3'))).toBe(true);
    });

    await test.step('Jumping to mdiv2 lands on the mixed page (page 2), not one page early', async () => {
      await forceSelectOption(page, '#sectionSelect', 'mdiv2');
      await expect.poll(() => currentPage(page), { timeout: 30000 }).toBe(2);
      await waitForNotation(page);
      await expect(page.locator('#note-m2a-s1-1')).toBeVisible();
    });

    await test.step('Jumping to mdiv3 lands on its own page (page 4)', async () => {
      await forceSelectOption(page, '#sectionSelect', 'mdiv3');
      await expect.poll(() => currentPage(page), { timeout: 30000 }).toBe(4);
      await waitForNotation(page);
      await expect(page.locator('#note-m3a-1')).toBeVisible();
    });
  });

  test('1.8 A single-mdiv document still renders correctly in speed mode (regression)', async ({ page }) => {
    await test.step('Open a single-mdiv MEI file and enable speed mode', async () => {
      await openUrl(page, woo70Url);
      await expect(page.locator('#note-0000001631474113')).toBeVisible({ timeout: 30000 });
      await setSpeedMode(page, true, 'line');
    });

    await test.step('First page renders and paging forward keeps rendering notes', async () => {
      await expect(page.locator('g.note').first()).toBeVisible();
      expect(await pageCount(page)).toBeGreaterThan(1);

      for (let i = 0; i < 3; i++) {
        const expected = (await currentPage(page)) + 1;
        await page.locator('#nextPageButton').click();
        await expect.poll(() => currentPage(page), { timeout: 30000 }).toBe(expected);
        await waitForNotation(page);
        expect(await page.locator('g.note').count()).toBeGreaterThan(0);
      }
    });
  });

  test('1.9 A real 7-movement multi-mdiv work pages through completely with no empty pages', async ({ page }) => {
    test.setTimeout(180000);
    const encoding = await (await fetch(woo64Url)).text();
    const perMdiv = measureIdsPerMdiv(encoding);
    expect(Object.keys(perMdiv).length).toBe(7);

    await test.step('Open the piece and enable speed mode', async () => {
      await openUrl(page, woo64Url);
      // the previous encoding is still on screen while this one loads, so wait
      // for a section-select entry that only this piece has
      await expect(page.locator('#sectionSelect option', { hasText: 'mdiv-Tema' })).toHaveCount(1, { timeout: 45000 });
      await waitForNotation(page);
      await setSpeedMode(page, true, 'line');
    });

    await test.step('Jumping to each of the 7 movements lands on that movement', async () => {
      const options = await page.locator('#sectionSelect option').allTextContents();
      for (const [mdiv, measures] of Object.entries(perMdiv)) {
        expect(options.some((o) => o.includes(mdiv))).toBe(true);
        await forceSelectOption(page, '#sectionSelect', mdiv);
        await expect
          .poll(async () => (await measureIdsOnPage(page)).some((id) => measures.includes(id)), { timeout: 30000 })
          .toBe(true);
      }
    });

    await test.step('Every page of the whole piece shows each measure exactly once', async () => {
      const perPage = await measureIdsPerPage(page);
      for (const measures of perPage) expect(measures.length).toBeGreaterThan(0);
      const shown = perPage.flat();
      expect(new Set(shown).size).toBe(shown.length); // no measure shown twice
      expect(shown).toEqual(measureIdsInEncoding(encoding)); // none missing, in order
    });
  });
});
