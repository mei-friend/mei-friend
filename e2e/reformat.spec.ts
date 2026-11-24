import { test, expect, Page } from '@playwright/test';
import { setupPage, defaultUrl } from './setup';

/**
 * Tests for "Reformat via XML parser" (Code menu, Shift-Cmd/Ctrl-X) and for the
 * modifier order of the keyboard shortcuts in the default keymap.
 */

// deliberately untidy: mixed indentation, single quotes, unsorted attributes, an empty
// element with end tag, a namespaced attribute, a redundant namespace declaration,
// processing instruction and comment before <mei> (all sections have xml:ids, so that
// mei-friend does not add any on loading)
const untidy = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-model href="https://music-encoding.org/schema/5.1/mei-all.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>
<!-- reformat test -->
<mei xmlns="http://www.music-encoding.org/ns/mei" xmlns:xlink="http://www.w3.org/1999/xlink" meiversion="5.1">
<meiHead>
      <fileDesc>
  <titleStmt><title>Reformat test</title></titleStmt>
  <pubStmt><availability xmlns:xlink="http://www.w3.org/1999/xlink"><ptr xlink:href="https://example.org/x" target='https://example.org'></ptr></availability></pubStmt>
  </fileDesc>
</meiHead>
<music><body><mdiv><score>
<scoreDef meter.unit="4" meter.count="4"><staffGrp><staffDef n="1" lines="5" xml:id="s1" clef.shape="G" clef.line="2"></staffDef></staffGrp></scoreDef>
<section xml:id="sec1"><measure n="1" xml:id="m1"><staff n="1"><layer n="1">
<note pname="c" oct="5" dur="1" xml:id="n1"/>
</layer></staff></measure></section>
</score></mdiv></body></music>
</mei>
`;

const getEditorValue = (page: Page): Promise<string> =>
  page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.getValue());

const setEditorValue = (page: Page, value: string) =>
  page.evaluate((v) => (document.querySelector('.CodeMirror') as any).CodeMirror.setValue(v), value);

async function clickCodeMenu(page: Page, item: string) {
  await page.locator('#editMenuTitle').click(); // Code menu
  await expect(page.locator('#' + item)).toBeVisible();
  await page.locator('#' + item).click();
}

// indentation of the first line containing text
const indentOf = (value: string, text: string) => value.split('\n').find((l) => l.includes(text))!.search(/\S/);

test.describe('1 Reformat via XML parser', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
    await setEditorValue(page, untidy);
    await expect(page.locator('#n1')).toBeVisible({ timeout: 30000 });
  });

  test('1.1 Sorts attributes, normalizes XML, keeps prolog, indents, undoes in one step', async ({ page }) => {
    await clickCodeMenu(page, 'reformatEncoding');
    await expect(async () => {
      expect(await getEditorValue(page)).toContain('<note xml:id="n1" dur="1" oct="5" pname="c"/>');
    }).toPass({ timeout: 5000 });
    const value = await getEditorValue(page);

    // XML declaration, processing instruction and comment on lines of their own
    expect(value.split('\n').slice(0, 4).map((l) => l.trim().slice(0, 14))).toEqual([
      '<?xml version=',
      '<?xml-model hr',
      '<!-- reformat ',
      '<mei xmlns="ht',
    ]);
    // namespace declarations first, then xml:id, then alphabetically; empty elements self-closing
    expect(value).toContain(
      '<mei xmlns="http://www.music-encoding.org/ns/mei" xmlns:xlink="http://www.w3.org/1999/xlink" meiversion="5.1">'
    );
    expect(value).toContain('<staffDef xml:id="s1" clef.line="2" clef.shape="G" lines="5" n="1"/>');
    expect(value).toContain('<scoreDef meter.count="4" meter.unit="4">');
    // namespaced attribute keeps its prefix; single quotes become double quotes;
    // redundant namespace declaration removed
    expect(value).toContain('<ptr target="https://example.org" xlink:href="https://example.org/x"/>');
    expect(value).toContain('<availability>');
    // all lines indented according to nesting
    const unit = await page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.getOption('indentUnit'));
    expect(indentOf(value, '<meiHead>')).toBe(indentOf(value, '<mei ') + unit);
    expect(indentOf(value, '<fileDesc>')).toBe(indentOf(value, '<meiHead>') + unit);
    // line breaks are kept (no re-wrapping): <note> follows the line opening section to layer
    expect(indentOf(value, '<note ')).toBe(indentOf(value, '<section ') + unit);

    // a single undo restores the untidy original
    await page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.undo());
    expect(await getEditorValue(page)).toEqual(untidy);

    // reformatting is idempotent
    await clickCodeMenu(page, 'reformatEncoding');
    await expect(async () => expect(await getEditorValue(page)).toEqual(value)).toPass({ timeout: 5000 });
    await clickCodeMenu(page, 'reformatEncoding');
    await page.waitForTimeout(500);
    expect(await getEditorValue(page)).toEqual(value);
  });

  test('1.2 Keyboard shortcut Shift-Cmd-X (Mac) / Shift-Ctrl-X', async ({ page }) => {
    // the platform keymap is chosen by the app from the user agent (which may differ from the OS running the test)
    const mac = await page.evaluate(() => document.body.classList.contains('platform-darwin-all'));
    await page.locator('.CodeMirror').click();
    await page.keyboard.press((mac ? 'Meta' : 'Control') + '+Shift+KeyX');
    await expect(async () => {
      expect(await getEditorValue(page)).toContain('<note xml:id="n1" dur="1" oct="5" pname="c"/>');
    }).toPass({ timeout: 5000 });
  });

  test('1.3 Not well-formed XML is left unchanged, with an error message', async ({ page }) => {
    const broken = untidy.replace('</layer>', '');
    await setEditorValue(page, broken);
    await clickCodeMenu(page, 'reformatEncoding');
    await expect(page.locator('#alertOverlay')).toBeVisible();
    expect(await getEditorValue(page)).toEqual(broken);
  });
});

test.describe('2 Keymap', () => {
  test('2.1 All shortcuts use the modifier order ctrl-cmd-shift-alt of the key handler', async ({ page }) => {
    await page.goto(defaultUrl);
    const keys: string[] = await page.evaluate(async () => {
      const main = document.querySelector('script[type="module"][src*="lib/main.js"]') as HTMLScriptElement;
      const { keymap } = await import(main.src.replace(/lib\/main\.js.*$/, 'keymaps/default-keymap.js'));
      return Object.values(keymap).flatMap((section: any) => Object.keys(section));
    });
    const order = ['ctrl', 'cmd', 'shift', 'alt'];
    const wrong = keys.filter((key) => {
      // leading modifiers, the rest is the key name (which may be '-' itself, as in 'cmd--')
      const modifiers = (key.match(/^((?:(?:ctrl|cmd|shift|alt)-)*)/)![1].match(/[a-z]+/g) || []) as string[];
      const positions = modifiers.map((m) => order.indexOf(m));
      return positions.some((p, i) => p < 0 || (i > 0 && p <= positions[i - 1]));
    });
    expect(keys.length).toBeGreaterThan(50);
    expect(wrong).toEqual([]);
  });
});
