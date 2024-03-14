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

test.describe('Test mei-friend settings panel tab', () => {
  test('Test Verovio version change', async ({ page }) => {
    // open settings panel
    await page.click('#showSettingsButton');
    // select mei-friend options tab
    await page.click('#meifriendOptionsTab');
    // choose a different Verovio version from selector
    await page.locator('#selectToolkitVersion').selectOption('3.11.0');
    // check Vrv version string in right footer is 3.11.0
    await expect(page.locator('.rightfoot a:nth-child(2)')).toHaveText(/3\.11\.0.*/);
    // check that a note is visible in the notation
    await expect(page.locator('g.note').first()).toBeVisible();
  });
  test('Test Speed mode checkbox updates control-bar and vice-versa', async ({ page }) => {
    // open settings panel
    await page.click('#showSettingsButton');
    // select mei-friend options tab
    await page.click('#meifriendOptionsTab');
    // ensure that speed mode checkbox in settings is checked (default behaviour)
    await expect(page.locator('#toggleSpeedMode')).toBeChecked();
    // ensure that speed mode checkbox in control-bar is checked
    await expect(page.locator('#speedCheckbox')).toBeChecked();
    // click settings checkbox
    await page.click('#toggleSpeedMode');
    // ensure both boxes are now no longer checked
    await expect(page.locator('#toggleSpeedMode')).not.toBeChecked();
    await expect(page.locator('#speedCheckbox')).not.toBeChecked();
    // click control-bar checkbox
    await page.click('#speedCheckbox');
    // ensure both boxes are now checked again
    await expect(page.locator('#toggleSpeedMode')).toBeChecked();
    await expect(page.locator('#speedCheckbox')).toBeChecked();
  });
  test('Test "Style of generated xml:ids" selector and functionality', async ({ page }) => {
    // open settings panel
    await page.click('#showSettingsButton');
    // select mei-friend options tab
    await page.click('#meifriendOptionsTab');
    // ensure that the default xml:id style is 'Base36'
    await expect(page.locator('#selectIdStyle')).toHaveValue('Base36');
    // choose a different xml:id style from selector
    await page.locator('#selectIdStyle').selectOption('Original');
    // remove xml:id's from the MEI by clicking #manipulateMenuTitle => #removeIdsText
    await page.click('#manipulateMenuTitle');
    await page.click('#removeIdsText');
    /// add xml:id's back to the MEI by clicking #manipulateMenuTitle => #addIdsText
    await page.click('#manipulateMenuTitle');
    await page.click('#addIdsText');
    // ensure that the xml:id style of the first g.staff element fits the selected style
    await expect(page.locator('g.staff').first()).toHaveAttribute('id', /^staff-\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d$/);
  });
  test('Test "Insert application statement" checkbox and functionality', async ({ page }) => {
    // open settings panel
    await page.click('#showSettingsButton');
    // select mei-friend options tab
    await page.click('#meifriendOptionsTab');
    // ensure that the default application statement checkbox is checked (default)
    await expect(page.locator('#addApplicationNote')).toBeChecked();
    // uncheck the application statement checkbox
    await page.click('#addApplicationNote');
    // open a known CMN MEI without application statement
    await openUrl(
      page,
      'https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei'
    );
    // scroll the editor to the end of the <appInfo> element to ensure that the application statements are in viewport
    await page.click('#editMenuTitle');
    await page.click('#startSearch');
    await page.keyboard.type('</appInfo');
    // send a return key to ensure that the search is performed
    await page.keyboard.press('Enter');
    // ensure that the application statement is not present in the MEI:
    await expect(await page.locator('#encoding').innerText()).not.toMatch(/.*<name .*mei-friend<\/.*/);
    // make a change to the MEI (shift pitch of first note) and check app statement still not present
    // click on the first g.note element
    // HACK - use force: true to prevent Verovio SVG from intercepting pointer event
    // TODO - figure out why this happens
    await page.locator('g.note').first().click({ force: true });
    await page.click('#manipulateMenuTitle');
    await page.click('#pitchChromUp');
    // reset viewport to end of <appInfo> element]
    await page.click('#editMenuTitle');
    await page.click('#startSearch');
    await page.keyboard.type('</appInfo');
    // send a return key to ensure that the search is performed
    await page.keyboard.press('Enter');
    await expect(await page.locator('#encoding').innerText()).not.toMatch(/.*<name .*mei-friend<\/.*/);
    // re-check the application statement checkbox
    // click on the first g.note element
    await page.click('#addApplicationNote');
    // make another change to the MEI (shift pitch of first note) and check app statement is present
    // HACK - use force: true to prevent Verovio SVG from intercepting pointer event
    // TODO - figure out why this happens
    await page.locator('g.note').first().click({ force: true });
    await page.click('#manipulateMenuTitle');
    await page.click('#pitchChromUp');
    // scroll the editor to the end of the <appInfo> element to ensure that the application statements are in viewport
    await page.click('#editMenuTitle');
    await page.click('#startSearch');
    await page.keyboard.type('</appInfo');
    // send a return key to ensure that the search is performed
    await page.keyboard.press('Enter');
    await expect(await page.locator('#encoding').innerText()).toMatch(/.*<name .*mei-friend<\/.*/);
    // check the inner text of the #encoding element matches the regex /<name .*mei-friend<\//
  });
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
