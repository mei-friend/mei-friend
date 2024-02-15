import { test, expect } from '@playwright/test';
import { setupPage, openUrl } from './setup';

test.beforeEach(async ({ page }) => {
  console.log('Calling setupPage!');
  await setupPage(page);
});

test.describe('Test settings panel', () => {
  test('Ensure settings panel opens and closes', async ({ page }) => {
    // check settings panel opens via show settings button (cog icon)
    await expect(page.locator('#showSettingsButton')).toBeVisible();
    await page.click('#showSettingsButton');
    await expect(page.locator('#hideSettingsButton')).toBeInViewport();
    // check it closes via hide settings button... (cog icon)
    await page.click('#hideSettingsButton');
    await expect(page.locator('#hideSettingsButton')).not.toBeInViewport();
    // check it opens via menu item (View > Settings panel)
    await expect(page.locator('#viewMenuTitle')).toBeVisible();
    await page.click('#viewMenuTitle');
    await expect(page.locator('#showSettingsMenuText')).toBeVisible();
    await page.click('#showSettingsMenuText');
    await expect(page.locator('#hideSettingsButton')).toBeInViewport();
    // check it closes via close settings button (x icon)'
    await expect(page.locator('#closeSettingsButton')).toBeInViewport();
    await page.click('#closeSettingsButton');
    await expect(page.locator('#closeSettingsButton')).not.toBeInViewport();
    // check it opens via keyboard shortcut (ctrl + ,)
    await page.keyboard.press('Control+Comma');
    await expect(page.locator('#hideSettingsButton')).toBeInViewport();
  });
  test('Ensure settings panel has expected tabs', async ({ page }) => {
    await page.click('#showSettingsButton');
    await expect(page.locator('#settingsPanel > .tab')).toBeVisible();
    await expect(page.locator('#settingsPanel > .tab :nth-child(1)').first()).toHaveId('hideSettingsButton');
    await expect(page.locator('#settingsPanel > .tab :nth-child(2)').first()).toHaveId('meifriendOptionsTab');
    await expect(page.locator('#settingsPanel > .tab :nth-child(3)').first()).toHaveId('editorOptionsTab');
    await expect(page.locator('#settingsPanel > .tab :nth-child(4)').first()).toHaveId('verovioOptionsTab');
    await expect(page.locator('#settingsPanel > .tab :nth-child(5)').first()).toHaveId('closeSettingsButton');
  });
});

test.describe.skip('Test mei-friend settings panel tab', () => {
  // no-op for now, TODO write tests!
});

test.describe('Test editor settings panel tab', () => {
  test('Test theme change', async ({ page }) => {
    // open settings panel
    await page.click('#showSettingsButton');
    // select editor options tab
    await page.click('#editorOptionsTab');
    // choose a light theme from selector
    await page.locator('#theme').selectOption('elegant');
    // check that Eulise is sleeping: src attribute of #mei-friend-logo image ends contains 'asleep'
    await expect(page.locator('#mei-friend-logo')).toHaveAttribute('src', /asleep/);
    // choose a dark theme from selector
    await page.locator('#theme').selectOption('darcula');
    // check that Eulise is awake:
    await expect(page.locator('#mei-friend-logo')).not.toHaveAttribute('src', /asleep/);
  });
});

test.describe('Test Verovio settings panel tab', () => {
  // no-op for now, TODO write tests!
  test.skip('Test that expected categories exist', async ({ page }) => {
    // no-op for now, TODO write tests!
  });
  test('Test that checkboxes work', async ({ page }) => {
    await page.click('#showSettingsButton');
    await page.click('#verovioOptionsTab');
    const checkbox = await page.locator('#verovioSettings input[type="checkbox"]').first();
    const checkVal = await checkbox.isChecked();
    await checkbox.click();
    await expect((await checkbox.isChecked()) !== checkVal).toBeTruthy();
  });
  test('Test that selects work', async ({ page }) => {
    await page.click('#showSettingsButton');
    await page.click('#verovioOptionsTab');
    const select = await page.locator('#verovioSettings select#vrv-condense');
    await select.selectOption('encoded');
    // determine current value of select
    const selectedOption = await select.evaluate((el: HTMLSelectElement) => el.value);
    await expect(selectedOption === 'encoded').toBeTruthy();
  });
  test('Test that number inputs work', async ({ page }) => {
    // check that number input works
    // test that number incr / decr works
    // test that invalid numbers fail appropriately
    // test that text content fails appropriately
    await test.step('Switch to Verovio settings tab', async () => {
      await page.click('#showSettingsButton');
      await page.click('#verovioOptionsTab');
    });
    await test.step('Test that number input works', async () => {
      const numberInput = await page.locator('#verovioSettings input#vrv-breaksSmartSb');
      await numberInput.fill('.5');
      // use evaluate to check that numberInput value is mathematically equal to 0.5
      await expect(await numberInput.evaluate((el: HTMLInputElement) => Number(el.value))).toBe(0.5);
    });
    await test.step('Test that number incr / decr works', async () => {
      const numberInput = await page.locator('#verovioSettings input#vrv-breaksSmartSb');
      await numberInput.fill('0.5');
      // use eval to call stepUp on the input in the DOM
      await numberInput.evaluate((el: HTMLInputElement) => el.stepUp());
      await expect(numberInput).toHaveValue('0.55');
      await numberInput.evaluate((el: HTMLInputElement) => el.stepDown());
      await expect(numberInput).toHaveValue('0.5');
    });
    await test.step('Test that invalid numbers fail appropriately', async () => {
      const numberInput = await page.locator('#verovioSettings input#vrv-breaksSmartSb');
      await numberInput.fill('5');
      await expect(await numberInput.evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBeTruthy();
      await numberInput.evaluate((el: HTMLInputElement) => el.stepDown());
      await expect(await numberInput.evaluate((el: HTMLInputElement) => el.validity.rangeOverflow)).toBeFalsy();
      await expect(numberInput).toHaveValue('1');
    });
    /*
    TODO figure out how to let this run only on Firefox (because other browsers prevent alphabetic input to number fields)
    await test.step('Test that text content fails appropriately', async () => {
      const numberInput = await page.locator('#verovioSettings input#vrv-breaksSmartSb');
      // click on the input
      await numberInput.click();
      await numberInput.press('a');
      await expect(await numberInput.evaluate((el: HTMLInputElement) => el.validity.badInput)).toBeTruthy();
      await numberInput.evaluate((el: HTMLInputElement) => el.stepDown());
      await expect(await numberInput.evaluate((el: HTMLInputElement) => el.validity.badInput)).toBeTruthy();
    });
    */
  });
});
