import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test CMN file functions', () => {
  /*
  // TODO - decide whether we want to keep this, given that the default MEI might change

  test('Test default MEI (Beethoven WoO70) loads and renders as notation', async ({ page }) => {
    const svgElement = page.locator('#rend-0000002081006402>tspan>tspan');
    await expect(svgElement).toBeVisible();
    const innerHTML = await svgElement.evaluate(el => el.innerHTML);
    expect(innerHTML).toBe("SECHS VARIATIONEN");
  });
  */

  test('Test that default MEI loads and renders as notation', async ({ page }) => {
    await expect(page.locator('g.note').first()).toBeVisible(); // can we see the first note?
    await expect(page.locator('g.note').first()).toHaveClass("note highlighted"); // first note highlighted?
  })

  test('Test OpenURL function to load known CMN MEI', async ({ page }) => {
    // Check the expected MEI elements are visible (Clara Schumann's Romanze ohne Opuszahl)
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/master/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei'
    );
    await expect(page.locator('#beam-0000001144398282 polygon')).toBeVisible();
    await expect(page.locator('#note-0000000026346875 use')).toBeVisible();
  });

});
