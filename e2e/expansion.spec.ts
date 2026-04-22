import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupPage, openLocalMei, forceSelectOption, forceSetCheckbox } from './setup';

// These tests exercise the v6+ expansion behaviour. `<expansion>` semantics
// changed in Verovio 6.0: by default, MIDI/timemap contain the expanded
// playback ids while the SVG stays unexpanded. mei-friend maps expanded ids
// back to the notated ids at highlight/page-follow time, and exposes a
// three-way radio (default / always / never) on the midi control bar.
// On Verovio <6 the radio group is hidden and we skip.

const fixturePath = join(__dirname, 'fixtures', 'expansion-repeat.mei');

async function loadFixture(page: Page) {
  const mei = readFileSync(fixturePath, 'utf-8');
  await openLocalMei(page, 'expansion-repeat.mei', mei);
  // wait for render of a known note id from the fixture
  await expect(page.locator('#noteA1')).toBeVisible({ timeout: 30000 });
}

async function isV6OrLater(page: Page): Promise<boolean> {
  // The radio group is only shown on v6+. Use that as the version gate so we
  // don't couple these tests to string formatting of the status bar.
  const fs = page.locator('#controlbarExpansionMode');
  // visibility is driven by inline style; read it directly
  return await fs.evaluate((el) => (el as HTMLElement).style.display !== 'none');
}

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('Expansion behaviour under Verovio 6+', () => {
  test('rendition 2 of a repeated section is highlighted during playback', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'firefox', 'Firefox headless: MIDI playback timing unreliable');
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: default-expansion highlighting does not apply');

    await loadFixture(page);
    // Force encoded breaks so the fixture's <pb/> takes effect, giving us a
    // two-page score where the expansion crosses the page boundary.
    await forceSelectOption(page, '#breaksSelect', 'encoded');
    await expect(page.locator('#noteA1')).toBeVisible({ timeout: 30000 });

    // Open the MIDI control bar and start playback from the first note.
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await page.locator('#noteA1 use').first().click({ force: true });
    await page.keyboard.press('Space');

    // First, confirm that any highlight fires at all (sanity).
    await expect(page.locator('.currently-playing').first()).toBeVisible({ timeout: 15000 });

    // The proof that rendition 2 is being tracked: at some point during
    // playback, the data-highlight attribute stashed on a highlighted note
    // must carry a `-rend` suffix — those ids only come from the expansion
    // map, which is populated only when Verovio v6 emits expanded timemap ids.
    await expect(async () => {
      const anyRend = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('g.note.currently-playing[data-highlight]')).some(
          (el) => /-rend\d+/.test(el.getAttribute('data-highlight') || '')
        );
      });
      expect(anyRend).toBe(true);
    }).toPass({ timeout: 45000 });
  });

  test('page-follow flips back to page 1 during the second rendition', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'firefox', 'Firefox headless: MIDI playback page-turning unreliable');
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: default-expansion page-follow does not apply');

    await loadFixture(page);
    await forceSelectOption(page, '#breaksSelect', 'encoded');
    await expect(page.locator('#noteA1')).toBeVisible({ timeout: 30000 });

    // Ensure page-follow is on (it's usually on by default, but be explicit).
    await forceSetCheckbox(page, '#pageFollowMidiPlayback', true);
    await forceSetCheckbox(page, '#speedCheckbox', false);

    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();

    await page.locator('#noteA1 use').first().click({ force: true });
    await page.keyboard.press('Space');

    // Forward flip: rendition 1 crosses the <pb/> → page 2.
    await expect(page.locator('#pagination2')).toHaveText(' 2 ', { timeout: 30000 });
    // Backward flip: rendition 2 begins with sectionA on page 1.
    await expect(page.locator('#pagination2')).toHaveText(' 1 ', { timeout: 30000 });
  });

  test('radio ↔ settings-tab checkboxes stay mutually in sync', async ({ page }) => {
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: expandAlways/expandNever are not exposed');

    // Pick "Always expand" via the midi-bar radio.
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await page.locator('#controlbarExpansionModeAlways').check({ force: true });

    // The settings-tab expandAlways checkbox must follow; expandNever must be
    // disabled (mutual-exclusion hack).
    await expect(page.locator('#vrv-expandAlways')).toBeChecked();
    await expect(page.locator('#vrv-expandNever')).not.toBeChecked();
    await expect(page.locator('#vrv-expandNever')).toBeDisabled();

    // Flip direction: untick expandAlways from the settings tab, then tick
    // expandNever. The radio must follow.
    await forceSetCheckbox(page, '#vrv-expandAlways', false);
    await expect(page.locator('#controlbarExpansionModeDefault')).toBeChecked();
    await expect(page.locator('#vrv-expandNever')).not.toBeDisabled();

    await forceSetCheckbox(page, '#vrv-expandNever', true);
    await expect(page.locator('#controlbarExpansionModeNever')).toBeChecked();
    await expect(page.locator('#vrv-expandAlways')).toBeDisabled();
  });

  test('selecting "Never expand" disables the expansion dropdown', async ({ page }) => {
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: expandNever is not exposed');

    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();

    // Sanity: dropdown is enabled under the default mode.
    await expect(page.locator('#controlbar-midi-expansion-selector')).toBeEnabled();

    // Switch to Never expand; dropdown becomes disabled and reverts to "" ('No expansion').
    await page.locator('#controlbarExpansionModeNever').check({ force: true });
    await expect(page.locator('#controlbar-midi-expansion-selector')).toBeDisabled();
    await expect(page.locator('#controlbar-midi-expansion-selector')).toHaveValue('');

    // Back to default: dropdown re-enables.
    await page.locator('#controlbarExpansionModeDefault').check({ force: true });
    await expect(page.locator('#controlbar-midi-expansion-selector')).toBeEnabled();
  });

  test('speed mode with cross-page expansion does not error out during MIDI export', async ({ page }, testInfo) => {
    // Specifically guards the "Verovio-hostile" scenario I was worried about:
    // in speed mode, the filtered slice may reference sections missing from
    // the encoding, and we need to make sure this does not blow up the
    // worker's exportMidi path. If this fails, we should fall back to forcing
    // expandNever in speed mode.
    test.skip(testInfo.project.name === 'firefox', 'Firefox headless: MIDI playback timing unreliable');
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: default-expansion does not apply');

    await loadFixture(page);
    await forceSelectOption(page, '#breaksSelect', 'encoded');
    await forceSetCheckbox(page, '#speedCheckbox', true);
    await expect(page.locator('#noteA1')).toBeVisible({ timeout: 30000 });

    // Listen for uncaught errors on the page; if the worker throws, we want to
    // know about it.
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();
    await page.locator('#noteA1 use').first().click({ force: true });
    await page.keyboard.press('Space');

    // At minimum, the first rendition on page 1 should highlight something.
    await expect(page.locator('.currently-playing').first()).toBeVisible({ timeout: 30000 });
    expect(errors, `Unexpected page errors under speed mode + expansion: ${errors.join('\n')}`).toHaveLength(0);
  });
});
