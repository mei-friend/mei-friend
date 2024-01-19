import { test, expect } from '@playwright/test';

test.describe('Test CMN file functions', () => {
  test('Test OpenURL function to load known CMN MEI', async ({ page }) => {
    await page.goto('http://localhost:5001/');
    await page.getByRole('button', { name: 'Got it!' }).click();
    await page.getByRole('button', { name: 'File' }).click();
    // click on the element with ID "openUrl"
    await page.click('#openUrl');
    // focus on the element with ID "openUrlInput"
    await page.focus('#openUrlInput');
    // input "foo" into the focused element
    await page.keyboard.type('https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/master/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei');
  });
})