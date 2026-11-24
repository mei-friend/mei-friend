import { test, expect, Page } from '@playwright/test';
import { setupPage, forceSelectOption } from './setup';

// Music fonts. Verovio toolkits with registerMusicFont() bundle only Leipzig
// and Bravura; the worker registers Gootville, Leland and Petaluma from
// app/static/fonts when one is selected. An unregistered font silently falls
// back to Leipzig, so each test checks that the glyph outlines change.
// With older toolkits all five are bundled and the same tests hold.

const registeredFonts = ['Gootville', 'Leland', 'Petaluma'];

// outline of the black notehead (SMuFL E0A4) in the rendered SVG's defs: a
// <g> holding a <path> up to Verovio 6.4, a bare <path> with runtime fonts
async function noteheadOutline(page: Page) {
  return page
    .locator('#verovio-panel defs [id^="E0A4-"]')
    .first()
    .evaluate((el) => el.getAttribute('d') ?? el.querySelector('path')?.getAttribute('d'));
}

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('Music fonts', () => {
  for (const font of ['Bravura', ...registeredFonts]) {
    test(`selecting ${font} renders its glyphs, not Leipzig's`, async ({ page }) => {
      const leipzig = await noteheadOutline(page);
      expect(leipzig).toBeTruthy();
      await forceSelectOption(page, '#engravingFontSelect', font);
      await expect.poll(() => noteheadOutline(page)).not.toBe(leipzig);
      await expect(page.locator('#notation-warning-badge')).toBeHidden();
    });
  }

  test('fonts registered at runtime are served with their SMuFL metadata', async ({ page }) => {
    for (const font of registeredFonts) {
      const dir = new URL(`/static/fonts/${font}/`, page.url()).href;
      const otf = await page.request.get(dir + `${font}.otf`);
      expect(otf.ok(), `${font}.otf`).toBeTruthy();
      expect((await otf.body()).subarray(0, 4).toString('latin1')).toBe('OTTO');
      const metadata = await page.request.get(dir + `${font.toLowerCase()}_metadata.json`);
      expect(metadata.ok(), `${font} metadata`).toBeTruthy();
      expect((await metadata.json()).fontName).toBe(font);
    }
  });
});
