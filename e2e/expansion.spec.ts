import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupPage, openLocalMei, forceSelectOption, forceSetCheckbox } from './setup';

// These tests exercise the v6+ expansion behaviour. `<expansion>` semantics
// changed in Verovio 6.0: by default, MIDI/timemap contain the expanded
// playback ids while the SVG stays unexpanded. mei-friend maps expanded ids
// back to the notated ids at highlight/page-follow time. The MIDI control
// bar's expansion dropdown is the sole UI for choosing which expansion drives
// playback — selecting "No expansion" sets `expandNever`. On Verovio <6
// these semantics do not apply and the affected tests skip.

const fixturePath = join(__dirname, 'fixtures', 'expansion-repeat.mei');

async function loadFixture(page: Page) {
  const mei = readFileSync(fixturePath, 'utf-8');
  await openLocalMei(page, 'expansion-repeat.mei', mei);
  // wait for render of a known note id from the fixture
  await expect(page.locator('#noteA1')).toBeVisible({ timeout: 30000 });
}

async function isV6OrLater(page: Page): Promise<boolean> {
  // Parse the toolkit version out of the status bar, which always begins
  // "Verovio X.Y.Z" regardless of the active language.
  const text = (await page.locator('#statusBar').textContent()) || '';
  const m = text.match(/Verovio (\d+)\./);
  return m ? parseInt(m[1], 10) >= 6 : false;
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

  test('dropdown ↔ settings-tab expandNever stay mutually in sync', async ({ page }) => {
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: expandNever is not exposed');

    await loadFixture(page);
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();

    // On load: dropdown auto-picked the first real expansion; expandNever off.
    await expect(page.locator('#controlbar-midi-expansion-selector')).toHaveValue('expRepeatA');
    await expect(page.locator('#vrv-expandNever')).not.toBeChecked();

    // Picking "No expansion" in the dropdown ticks the settings-tab checkbox.
    // The dropdown stays enabled — the user can pick any expansion to
    // re-engage it (which will clear expandNever automatically).
    await page.locator('#controlbar-midi-expansion-selector').selectOption('');
    await expect(page.locator('#vrv-expandNever')).toBeChecked();
    await expect(page.locator('#controlbar-midi-expansion-selector')).toBeEnabled();

    // Reverse direction: unchecking expandNever in Settings auto-picks the
    // first expansion again.
    await forceSetCheckbox(page, '#vrv-expandNever', false);
    await expect(page.locator('#controlbar-midi-expansion-selector')).toHaveValue('expRepeatA');
  });

  test('picking "No expansion" from the dropdown sets expandNever (without disabling the dropdown)', async ({ page }) => {
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: expandNever is not exposed');

    await loadFixture(page);
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();

    // On load: dropdown auto-populated with the fixture's first real expansion.
    await expect(page.locator('#controlbar-midi-expansion-selector')).toHaveValue('expRepeatA');

    // Pick "No expansion": expandNever sets, dropdown stays enabled so the
    // user can pivot back into an expansion in a single click.
    await page.locator('#controlbar-midi-expansion-selector').selectOption('');
    await expect(page.locator('#vrv-expandNever')).toBeChecked();
    await expect(page.locator('#controlbar-midi-expansion-selector')).toBeEnabled();

    // Picking an expansion from the still-enabled dropdown clears expandNever.
    await page.locator('#controlbar-midi-expansion-selector').selectOption('expRepeatA');
    await expect(page.locator('#vrv-expandNever')).not.toBeChecked();
  });

  test('selecting a non-default expansion actually drives MIDI (regression)', async ({ page }, testInfo) => {
    // Guards the bug where the worker cleared `expand` before tk.renderToMIDI(),
    // making MIDI always play Verovio's default (first) expansion regardless
    // of the user's dropdown selection. The fixture has two expansions:
    // expRepeatA (A,B,A) — the auto-pick default — and expBOnly (B only).
    // If the bug is back, switching to expBOnly will still play sectionA first.
    test.skip(testInfo.project.name === 'firefox', 'Firefox headless: MIDI playback timing unreliable');
    if (!(await isV6OrLater(page))) test.skip(true, 'Verovio <6: this scenario does not apply');

    await loadFixture(page);
    await page.locator('#midiPlayerContextual').click();
    await expect(page.locator('#midiPlaybackControlBar')).toBeVisible();

    // Sanity: auto-pick selected the first expansion (expRepeatA).
    await expect(page.locator('#controlbar-midi-expansion-selector')).toHaveValue('expRepeatA');

    // Switch to the B-only expansion.
    await page.locator('#controlbar-midi-expansion-selector').selectOption('expBOnly');
    await expect(page.locator('#controlbar-midi-expansion-selector')).toHaveValue('expBOnly');

    // Start playback from a sectionB note (sectionA wouldn't be in the
    // playback timeline at all under expBOnly, so a sectionA-anchored start
    // would be moot).
    await page.locator('#noteB1 use').first().click({ force: true });
    await page.keyboard.press('Space');

    // Wait for the first highlight, then assert it resolves to a sectionB note.
    // Under the bug, expRepeatA would have played and the first note would
    // have been a sectionA note (noteA1 etc).
    await expect(page.locator('.currently-playing').first()).toBeVisible({ timeout: 15000 });
    const firstHighlightId = await page.evaluate(() => {
      const el = document.querySelector('g.note.currently-playing');
      // Prefer data-highlight (carries -rend suffixed id under expansion);
      // fall back to the dom id.
      return el?.getAttribute('data-highlight') || el?.id || '';
    });
    // Strip any -rendN suffix to compare against the notated id.
    expect(firstHighlightId.replace(/-rend\d+$/, '')).toMatch(/^noteB/);
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
