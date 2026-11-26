import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupPage, openLocalMei } from './setup';

// The code checkers (accid.ges conformance, meter conformance, linked elements)
// report into the Check tab of the MEI toolbox (mei-toolbox.js). Each one works
// through the document in time slices: the run writes its title into .mtRunTitle,
// marks its pane .running while it goes, and drops that class when it is done,
// which is what these tests wait for. Message wording follows the browser language,
// so the assertions read the xml:ids and attribute values carried inside a message,
// and check what a Fix button actually does to the encoding, rather than the prose
// around it.

const fixture = (name: string) => readFileSync(join(__dirname, 'fixtures', name), 'utf-8');

/** Opens a fixture from e2e/fixtures and waits until it is rendered. */
async function loadFixture(page: Page, name: string, noteId: string) {
  await openLocalMei(page, name, fixture(name));
  await expect(page.locator('#statusBar')).toContainText(name, { timeout: 60000 });
  await expect(page.locator('#' + noteId)).toBeVisible({ timeout: 30000 });
}

/** The pane of the Check tab, where the checkers report. */
const checkPane = (page: Page) => page.locator('.mtPane[data-tab="check"]');

/** Opens the MEI toolbox at its Check tab, with the options unfolded. */
async function openCheckTab(page: Page) {
  // loading an encoding hides the toolbox (resetToolbox()), so open it per run;
  // the button toggles, hence only when it is not already showing
  if (!(await page.locator('#meiToolbox').isVisible())) {
    await page.locator('#showMeiToolboxButton').click();
  }
  await expect(page.locator('#meiToolbox')).toBeVisible();
  await page.locator('.mtTab[data-tab="check"]').click();
  await expect(checkPane(page)).toBeVisible();
  // a previous run folds the options away, which hides the check type and the button
  await page.evaluate(() =>
    document.querySelector('.mtPane[data-tab="check"] .mtOptions')!.classList.remove('collapsed')
  );
}

/** Runs one code checker and returns its messages, without the leading number. */
async function runChecker(page: Page, type: 'accidGes' | 'metcon' | 'linked'): Promise<string[]> {
  await openCheckTab(page);
  await checkPane(page).locator(`input[name="mtCheckType"][value="${type}"]`).check();
  // clear the title and the entries of a previous run, so that neither it nor the
  // placeholder can be mistaken for the run started below (metcon and linked only
  // begin after a timeout, so a pane that is not .running yet means nothing)
  await page.evaluate(() => {
    const pane = document.querySelector('.mtPane[data-tab="check"]')!;
    pane.querySelector('.mtRunTitle')!.innerHTML = '';
    pane.querySelectorAll('.mtEntry').forEach((e) => e.remove());
  });
  await checkPane(page).locator('.mtActions button').click();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const pane = document.querySelector('.mtPane[data-tab="check"]')!;
          const started = (pane.querySelector('.mtRunTitle')!.innerHTML || '') !== '';
          return started && !pane.classList.contains('running');
        }),
      { timeout: 60000 }
    )
    .toBe(true);
  return page.$$eval('.mtPane[data-tab="check"] .mtEntry .codeCheckerMessage', (els) =>
    els.map((el) => (el.textContent || '').replace(/^\d+\s/, '').trim())
  );
}

/** Clicks "Fix all" and waits until every fix has been applied. */
async function fixAll(page: Page) {
  await checkPane(page).locator('.mtFixAll').click();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const pane = document.querySelector('.mtPane[data-tab="check"]')!;
          const open = pane.querySelectorAll('button.fix:not(.disabled)').length;
          return !pane.classList.contains('running') && open === 0;
        }),
      { timeout: 60000 }
    )
    .toBe(true);
}

const editorValue = (page: Page) =>
  page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.getValue());

/** The encoding of one element, from its start tag to its end. */
function element(mei: string, xmlId: string): string {
  const at = mei.indexOf(`xml:id="${xmlId}"`);
  expect(at, `${xmlId} in the encoding`).toBeGreaterThan(-1);
  const from = mei.lastIndexOf('<', at);
  const name = mei.slice(from + 1).match(/^[\w.:-]+/)![0];
  const rest = mei.slice(from);
  const selfClosing = rest.match(/^<[^>]*\/>/);
  const full = rest.match(new RegExp(`^<[\\s\\S]*?</${name}\\s*>`));
  const whole = selfClosing && (!full || selfClosing[0].length < full[0].length) ? selfClosing[0] : full![0];
  return whole.replace(/\s+/g, ' ');
}

/** Messages naming that xml:id. */
const naming = (messages: string[], xmlId: string) => messages.filter((m) => m.includes(`"${xmlId}"`));

test.beforeEach(async ({ page }) => {
  await setupPage(page);
});

test.describe('accid.ges code checker', () => {
  test('a keySig without @sig cancels the signature set before it', async ({ page }) => {
    await loadFixture(page, 'checker-keysig.mei', 'n1');
    // every note of the fixture agrees with the signature in force, including the
    // notes after a keySig without @sig, which cancels the three sharps
    expect(await runChecker(page, 'accidGes')).toEqual([]);
  });

  test('Verovio renders a keySig without @sig as a cancellation', async ({ page }) => {
    // the premise of the test above: a signature-less keySig is not "unchanged"
    await loadFixture(page, 'checker-keysig.mei', 'n1');
    const keySigs = await page.evaluate(() =>
      [...document.querySelectorAll('#verovio-panel g.keySig')].map((k) =>
        [...k.querySelectorAll('use')].map((u) =>
          (u.getAttribute('xlink:href') || u.getAttribute('href') || '').slice(1, 5)
        )
      )
    );
    // SMuFL: E262 sharp, E261 natural
    expect(keySigs.some((glyphs) => glyphs.length === 3 && glyphs.every((g) => g === 'E262'))).toBe(true);
    expect(keySigs.some((glyphs) => glyphs.length === 3 && glyphs.every((g) => g === 'E261'))).toBe(true);
  });

  test('a tie ending is not asked to drop an accid.ges its starting note sounds with', async ({ page }) => {
    await loadFixture(page, 'checker-ties.mei', 'a1');
    const messages = await runChecker(page, 'accidGes');
    // a3 and c3 are tied from a note sounding sharp through an accidental earlier in
    // its measure, b3 and d3 from one sounding sharp through the key signature
    for (const id of ['a3', 'b3', 'c3', 'd3']) {
      expect(naming(messages, id), `messages naming ${id}`).toEqual([]);
    }
  });

  test('tie endings that disagree with their starting note are reported and fixed', async ({ page }) => {
    await loadFixture(page, 'checker-ties.mei', 'a1');
    const messages = await runChecker(page, 'accidGes');
    for (const id of ['e3', 'f3', 'g3', 'h3']) {
      expect(naming(messages, id).length, `messages naming ${id}`).toBeGreaterThan(0);
    }
    // h3 ends a tie on another pitch and octave, which has no automatic fix
    expect(naming(messages, 'h3').join(' ')).toContain('h2');

    await fixAll(page);
    const mei = await editorValue(page);
    expect(element(mei, 'e3'), 'contradicting accidental corrected').toContain('accid.ges="s"');
    expect(element(mei, 'f3'), 'superfluous accidental removed').not.toContain('accid.ges');
    expect(element(mei, 'g3'), 'missing accidental added').toContain('accid.ges="s"');
  });

  test('a tie between notes without pitch is left alone', async ({ page }) => {
    await loadFixture(page, 'checker-ties.mei', 'a1');
    const messages = await runChecker(page, 'accidGes');
    // i2 and i3 are unpitched (percussion): they carry no pname, oct or accidental
    // that could disagree with one another
    for (const id of ['i2', 'i3']) {
      expect(naming(messages, id), `messages naming ${id}`).toEqual([]);
    }
  });

  test('a gestural accidental may be spelled differently from the notated one it sounds', async ({ page }) => {
    await loadFixture(page, 'checker-accid-spellings.mei', 's1');
    const messages = await runChecker(page, 'accidGes');
    // s2/t2/u2 carry what the nf, ns and x earlier in their measure sound: f, s, ss
    for (const id of ['s2', 't2', 'u2']) {
      expect(naming(messages, id), `messages naming ${id}`).toEqual([]);
    }
    // s3/t3/u3 carry no gestural accidental at all, and are asked for the sounding
    // one rather than for the notated spelling
    expect(naming(messages, 's3').join(' '), 'accid.ges asked of s3').toContain('accid.ges="f"');
    expect(naming(messages, 't3').join(' '), 'accid.ges asked of t3').toContain('accid.ges="s"');
    expect(naming(messages, 'u3').join(' '), 'accid.ges asked of u3').toContain('accid.ges="ss"');

    await fixAll(page);
    const mei = await editorValue(page);
    expect(element(mei, 's3'), 'sounding flat added').toContain('accid.ges="f"');
    expect(element(mei, 't3'), 'sounding sharp added').toContain('accid.ges="s"');
    expect(element(mei, 'u3'), 'sounding double sharp added').toContain('accid.ges="ss"');
    // and the notes that were already right are untouched
    expect(element(mei, 's2')).toContain('accid.ges="f"');
    expect(element(mei, 'u2')).toContain('accid.ges="ss"');
    // a second run finds nothing left to report
    expect(await runChecker(page, 'accidGes')).toEqual([]);
  });

  test('notes carrying both a notated and a gestural accidental are reported', async ({ page }) => {
    await loadFixture(page, 'checker-accid-contradiction.mei', 'c1');
    const messages = await runChecker(page, 'accidGes');
    // c1/c2 keep both at the note, c3 the gestural one at a child accid element,
    // c4 both at the same child
    for (const id of ['c1', 'c2', 'c3', 'c4']) {
      expect(naming(messages, id).length, `messages naming ${id}`).toBeGreaterThan(0);
    }
    // c5 carries a notated accidental alone, which is not a contradiction
    expect(naming(messages, 'c5'), 'messages naming c5').toEqual([]);
  });

  test('fixing a contradiction removes the gestural accidental wherever it is encoded', async ({ page }) => {
    await loadFixture(page, 'checker-accid-contradiction.mei', 'c1');
    await runChecker(page, 'accidGes');
    await fixAll(page);

    const mei = await editorValue(page);
    for (const id of ['c1', 'c2', 'c3', 'c4', 'c5']) {
      expect(element(mei, id), `${id} without a gestural accidental`).not.toContain('accid.ges');
    }
    // the notated accidentals survive, at the note and at a child accid element
    expect(element(mei, 'c1')).toContain('accid="s"');
    expect(element(mei, 'c3')).toContain('accid="s"');
    expect(element(mei, 'a4'), 'child keeping its notated accidental').toContain('accid="s"');
    // a child that carried nothing but the gestural accidental is gone with it
    expect(mei, 'child accid element with no notated accidental').not.toContain('xml:id="a3"');
    // the notated accidental that was never in question is untouched
    expect(element(mei, 'a5')).toContain('accid="f"');

    // a fix that did not reach the encoding would show up again here
    expect(await runChecker(page, 'accidGes')).toEqual([]);
  });
});

test.describe('meter conformance code checker', () => {
  test('measures that do not fill their meter are reported and marked', async ({ page }) => {
    await loadFixture(page, 'checker-metcon.mei', 'p1n1');
    const messages = await runChecker(page, 'metcon');
    // measure 2 is a beat short and measure 4 two beats, measure 3 holds an mRest
    expect(messages.length).toBe(2);

    const before = await editorValue(page);
    await fixAll(page);
    const mei = await editorValue(page);
    expect(element(mei, 'p2')).toContain('metcon="false"');
    expect(element(mei, 'p4')).toContain('metcon="false"');
    expect(element(mei, 'p1'), 'conforming measure untouched').not.toContain('metcon');
    expect(element(mei, 'p3'), 'measure with mRest untouched').not.toContain('metcon');
    // the fix writes the attribute only: the notes of a marked measure stay as they were
    expect(element(mei, 'p2n2')).toBe(element(before, 'p2n2'));
    // the marked measures are accepted on a second run
    expect(await runChecker(page, 'metcon')).toEqual([]);
  });
});

test.describe('MEI toolbox', () => {
  test('the panel stays open when another encoding is loaded, and keeps no stale results', async ({ page }) => {
    await loadFixture(page, 'checker-metcon.mei', 'p1n1');
    expect((await runChecker(page, 'metcon')).length, 'messages about the first encoding').toBeGreaterThan(0);

    await loadFixture(page, 'checker-ties.mei', 'a1');
    await expect(page.locator('#meiToolbox'), 'toolbox after loading another encoding').toBeVisible();
    // the results belong to the encoding before and are gone
    expect(await checkPane(page).locator('.mtEntry').count(), 'entries after the load').toBe(0);
    expect(await checkPane(page).locator('.mtRunTitle').textContent(), 'run title after the load').toBe('');

    // and the toolbox works on the encoding just loaded
    expect((await runChecker(page, 'accidGes')).length, 'messages about the second encoding').toBeGreaterThan(0);
  });

  test('a panel the user closed stays closed when another encoding is loaded', async ({ page }) => {
    await loadFixture(page, 'checker-metcon.mei', 'p1n1');
    await runChecker(page, 'metcon'); // opens the toolbox
    await page.locator('#showMeiToolboxButton').click();
    await expect(page.locator('#meiToolbox')).not.toBeVisible();

    await loadFixture(page, 'checker-ties.mei', 'a1');
    await expect(page.locator('#meiToolbox'), 'toolbox after loading another encoding').not.toBeVisible();
  });
});

test.describe('linked elements code checker', () => {
  test('references without a target in the encoding are reported', async ({ page }) => {
    await loadFixture(page, 'checker-linking.mei', 'ln1');
    const messages = await runChecker(page, 'linked');
    const all = messages.join('\n');
    expect(all, 'tie pointing at an id that does not exist').toContain('nowhere');
    expect(all, 'dir with an empty startid').toContain('ld1');
    expect(all, 'plist with surrounding and doubled blanks').toContain('ld2');
    expect(all, 'plist entry without a target').toContain('alsonowhere');
    // the slur resolves and the external corresp is not a document reference
    expect(all, 'resolving slur').not.toContain('lsl');
    expect(all, 'external reference').not.toContain('example.org');
  });
});
