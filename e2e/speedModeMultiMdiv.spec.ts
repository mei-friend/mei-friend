import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupPage, openUrl, openLocalMei, forceSetCheckbox, forceSelectOption } from './setup';

// Fixture layout (see e2e/fixtures/multi-mdiv-speed.mei):
//   mdiv1: m1a, <pb>, m1b                          (1 staff)
//   mdiv2: m2a, <pb>, m2b                           (2 staves) -- starts
//          immediately after mdiv1 with NO separating break, so m1b and m2a
//          share one rendered page (a genuine mixed-mdiv page)
//   mdiv3: <pb>, m3a                                (1 staff) -- starts with
//          an explicit break, so it lands cleanly on its own page
// Under 'line' breaks mode this yields 4 pages:
//   page 1: m1a                    (mdiv1 only, 1 staff)
//   page 2: m1b + m2a              (mdiv1 + mdiv2 mixed, 3 staves)
//   page 3: m2b                    (mdiv2 only, 2 staves)
//   page 4: m3a                    (mdiv3 only, 1 staff)
const fixturePath = join(__dirname, 'fixtures', 'multi-mdiv-speed.mei');

async function loadFixture(page: Page) {
  const mei = readFileSync(fixturePath, 'utf-8');
  await openLocalMei(page, 'multi-mdiv-speed.mei', mei);
  await expect(page.locator('#note-m1a-1')).toBeVisible({ timeout: 20000 });
}

async function enableSpeedMode(page: Page, breaks: 'line' | 'auto' | 'encoded' = 'line') {
  await forceSetCheckbox(page, '#speedCheckbox', true);
  await forceSelectOption(page, '#breaksSelect', breaks);
  // let the resulting re-render settle
  await page.waitForTimeout(500);
}

function pageIndicator(page: Page) {
  return page.locator('#pagination2, #pagination4').allTextContents();
}

test.beforeEach(async ({ page }) => {
  console.log('Testing speed-mode multi-mdiv support.');
  await setupPage(page);
});

test.describe('1 Speed mode paginates and renders across multiple mdivs.', () => {
  test('1.1 Each mdiv page-turns correctly, including a page mixing two mdivs', async ({ page }) => {
    await test.step('Load the multi-mdiv fixture and enable speed mode', async () => {
      await loadFixture(page);
      await enableSpeedMode(page, 'line');
    });

    await test.step('Page 1: mdiv1 only, single staff', async () => {
      await expect(page.locator('#pagination2')).toHaveText(/1/);
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

  test('1.2 The section-select dropdown jumps to each mdiv\'s actual first page', async ({ page }) => {
    await test.step('Load the fixture and enable speed mode', async () => {
      await loadFixture(page);
      await enableSpeedMode(page, 'line');
    });

    await test.step('sectionSelect lists all three mdivs', async () => {
      await expect(page.locator('#sectionSelect')).toBeVisible();
      const options = await page.locator('#sectionSelect option').allTextContents();
      expect(options.some((o) => o.includes('mdiv1'))).toBe(true);
      expect(options.some((o) => o.includes('mdiv2'))).toBe(true);
      expect(options.some((o) => o.includes('mdiv3'))).toBe(true);
    });

    await test.step('Jumping to mdiv2 lands on the mixed page (page 2), not one page early', async () => {
      await forceSelectOption(page, '#sectionSelect', 'mdiv2');
      await page.waitForTimeout(700);
      await expect(page.locator('#note-m2a-s1-1')).toBeVisible();
      await expect(page.locator('#pagination2')).toHaveText(/2/);
    });

    await test.step('Jumping to mdiv3 lands on its own page (page 4)', async () => {
      await forceSelectOption(page, '#sectionSelect', 'mdiv3');
      await page.waitForTimeout(700);
      await expect(page.locator('#note-m3a-1')).toBeVisible();
      await expect(page.locator('#pagination2')).toHaveText(/4/);
    });
  });

  test('1.3 A single-mdiv document still renders correctly in speed mode (regression)', async ({ page }) => {
    await test.step('Open a single-mdiv MEI file and enable speed mode', async () => {
      await openUrl(
        page,
        'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO70_BreitkopfHaertel/master/Beethoven_WoO70-Breitkopf.mei'
      );
      await expect(page.locator('#note-0000001631474113')).toBeVisible();
      await enableSpeedMode(page, 'line');
    });

    await test.step('First page renders and paging forward keeps rendering notes', async () => {
      await expect(page.locator('g.note').first()).toBeVisible();
      const [, total] = await pageIndicator(page);
      expect(parseInt(total, 10)).toBeGreaterThan(1);

      for (let i = 0; i < 3; i++) {
        await page.locator('#nextPageButton').click();
        await page.waitForTimeout(500);
        expect(await page.locator('g.note').count()).toBeGreaterThan(0);
      }
    });
  });

  test('1.4 A real 7-movement multi-mdiv work pages through completely with no empty pages', async ({ page }) => {
    // Beethoven WoO64 (Theme + 6 Variations): 7 mdivs, only a single encoded
    // <pb> in the whole document, so most of the 6 mdiv boundaries have no
    // separating break at all -- a real-world stress test for mixing mdivs
    // onto shared pages, well beyond the synthetic fixture above.
    test.setTimeout(60000);
    const woo64Url =
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO64_BreitkopfHaertel/refs/heads/master/Beethoven_WoO64-Breitkopf-mdivs.mei';

    await test.step('Open the piece and enable speed mode', async () => {
      await openUrl(page, woo64Url);
      await expect(page.locator('g.note').first()).toBeVisible({ timeout: 30000 });
      await enableSpeedMode(page, 'line');
    });

    await test.step('All 7 movements are listed and each jump lands on real content', async () => {
      const options = await page.locator('#sectionSelect option').allTextContents();
      for (const mdiv of ['mdiv-Tema', 'mdiv-Var-I', 'mdiv-Var-II', 'mdiv-Var-III', 'mdiv-Var-IV', 'mdiv-Var-V', 'mdiv-Var-VI']) {
        expect(options.some((o) => o.includes(mdiv))).toBe(true);
        await forceSelectOption(page, '#sectionSelect', mdiv);
        await page.waitForTimeout(900);
        expect(await page.locator('g.note').count()).toBeGreaterThan(0);
      }
    });

    await test.step('Paging through every page of the whole piece renders notes throughout', async () => {
      await page.locator('#firstPageButton').click();
      await page.waitForTimeout(700);
      const [, total] = await pageIndicator(page);
      const pageCount = parseInt(total, 10);
      expect(pageCount).toBeGreaterThan(1);

      for (let p = 1; p <= pageCount; p++) {
        expect(await page.locator('g.note').count()).toBeGreaterThan(0);
        await page.locator('#nextPageButton').click();
        await page.waitForTimeout(400);
      }
    });
  });
});
