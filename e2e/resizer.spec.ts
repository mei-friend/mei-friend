import { test, expect, Page } from '@playwright/test';
import { setupPage } from './setup';

/**
 * Tests for the resizer between notation and encoding panel while the MEI toolbox
 * is open, for all four positions of the toolbox relative to the editor.
 */

const box = async (page: Page, selector: string) => (await page.locator(selector).boundingBox())!;

// drags the element by dx/dy with real mouse events
async function drag(page: Page, selector: string, dx: number, dy: number) {
  const b = await box(page, selector);
  const x = b.x + b.width / 2;
  const y = b.y + b.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 5 });
  await page.mouse.move(x + dx, y + dy, { steps: 5 });
  await page.mouse.up();
}

test.describe('1 Notation resizer with the MEI toolbox open', () => {
  for (const position of ['Bottom', 'Top', 'Left', 'Right']) {
    test(`1.${['Bottom', 'Top', 'Left', 'Right'].indexOf(position) + 1} Toolbox ${position.toLowerCase()}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewportSize({ width: 1400, height: 1000 });
      await setupPage(page);
      await page.locator('#showMeiToolboxButton').click();
      await expect(page.locator('#meiToolbox')).toBeVisible();
      await page.locator('#viewMenuTitle').click();
      await page.locator('#meiToolbox' + position).click();

      const notationBefore = (await box(page, '#notation')).width;
      await drag(page, '#dragMe', 80, 0);
      await expect(async () => {
        expect((await box(page, '#notation')).width).toBeGreaterThan(notationBefore + 60);
      }).toPass({ timeout: 3000 });

      // editor, toolbox and toolbox resizer fill the encoding panel on the toolbox axis
      const encoding = await box(page, '#encoding');
      const editor = await box(page, '.CodeMirror');
      const toolbox = await box(page, '#meiToolbox');
      const resizer = await box(page, '#meiToolboxResizer');
      if (position === 'Left' || position === 'Right') {
        expect(Math.abs(editor.width + toolbox.width + resizer.width - encoding.width)).toBeLessThan(10);
        expect(Math.abs(editor.height - encoding.height)).toBeLessThan(10);
      } else {
        expect(Math.abs(editor.height + toolbox.height + resizer.height - encoding.height)).toBeLessThan(10);
        expect(Math.abs(editor.width - encoding.width)).toBeLessThan(10);
      }
      expect(errors).toEqual([]);
    });
  }
});
