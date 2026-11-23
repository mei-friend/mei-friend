import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupPage, defaultUrl, openLocalMei } from './setup';

/**
 * Tests for converting attributes to elements and elements to attributes
 * (app/static/lib/attribute-conversion.js) and for the Convert tab of the
 * MEI toolbox. Fixtures (all schema-valid, MEI 5.1 or MEI 4.0.1):
 *   attribute-conversion-attributes.mei  attributes, one topic per measure
 *   attribute-conversion-elements.mei    elements, incl. cases that must be kept
 *                                        (modelled on trompamusic-encodings and
 *                                        Signature-Sound-Vienna encodings)
 *   attribute-conversion-mei4.mei        MEI 4 attribute names
 */

const fixture = (name: string) => readFileSync(join(__dirname, 'fixtures', name), 'utf-8');
const attributesMei = fixture('attribute-conversion-attributes.mei');
const elementsMei = fixture('attribute-conversion-elements.mei');
const mei4 = fixture('attribute-conversion-mei4.mei');

type Attrs = Record<string, string>;
type Child = { name: string; id: string | null; attrs: Attrs; text: string };
type Snapshot = {
  counts: Record<string, number>;
  warnings: string[]; // 'name#id: message'
  xml: string;
  elements: Record<string, { name: string; attrs: Attrs; children: Child[] }>; // by xml:id
  controlEvents: { name: string; id: string; measure: string; attrs: Attrs }[]; // tie, slur, gliss, fermata in measures
};

/**
 * Runs a conversion of the module served by the app in the browser and
 * returns a snapshot of the resulting encoding.
 */
async function convert(
  page: Page,
  xml: string,
  direction: 'toElements' | 'toAttributes',
  options: Record<string, unknown> = {}
): Promise<Snapshot> {
  return page.evaluate(
    async ({ xml, direction, options }) => {
      // module URL relative to the app's main.js (the static path may differ between deployments)
      const main = document.querySelector('script[type="module"][src*="lib/main.js"]') as HTMLScriptElement;
      const m = await import(main.src.replace(/main\.js.*$/, 'attribute-conversion.js'));
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      let k = 0;
      const fn = direction === 'toElements' ? m.convertAttributesToElements : m.convertElementsToAttributes;
      // options.scopeMeasures: restrict the conversion to elements within these measures
      const { scopeMeasures, ...opts } = options as any;
      const scope = scopeMeasures
        ? (el: Element) => scopeMeasures.includes(el.closest('measure')?.getAttribute('xml:id'))
        : undefined;
      const r = fn(doc, { generateId: (n: string) => n + '-test' + ++k, indent: '  ', scope, ...opts });
      const attrsOf = (el: Element) => {
        const attrs: Record<string, string> = {};
        for (const a of Array.from(el.attributes)) if (a.name !== 'xml:id') attrs[a.name] = a.value;
        return attrs;
      };
      const ref = (el: Element) => el.localName + (el.getAttribute('xml:id') ? '#' + el.getAttribute('xml:id') : '');
      const elements: Record<string, any> = {};
      doc.querySelectorAll('[*|id]').forEach((el) => {
        elements[el.getAttribute('xml:id')!] = {
          name: el.localName,
          attrs: attrsOf(el),
          children: Array.from(el.children).map((c) => ({
            name: c.localName,
            id: c.getAttribute('xml:id'),
            attrs: attrsOf(c),
            text: (c.textContent || '').trim(),
          })),
        };
      });
      const controlEvents = Array.from(
        doc.querySelectorAll('measure > tie, measure > slur, measure > gliss, measure > fermata')
      ).map((el) => ({
        name: el.localName,
        id: el.getAttribute('xml:id') || '',
        measure: el.parentElement!.getAttribute('xml:id') || '',
        attrs: attrsOf(el),
      }));
      return {
        counts: r.counts,
        warnings: r.warnings.map((w: any) => ref(w.element) + ': ' + w.message),
        xml: new XMLSerializer().serializeToString(doc),
        elements,
        controlEvents,
      };
    },
    { xml, direction, options }
  );
} // convert()

// 'startid>endid' pairs of control events of a kind, sorted
const pairs = (s: Snapshot, name: string) =>
  s.controlEvents
    .filter((c) => c.name === name)
    .map((c) => c.attrs.startid + '>' + c.attrs.endid)
    .sort();
const childNames = (s: Snapshot, id: string) => s.elements[id].children.map((c) => c.name);
const childrenOf = (s: Snapshot, id: string, name: string) => s.elements[id].children.filter((c) => c.name === name);
const warningFor = (s: Snapshot, ref: string) => s.warnings.filter((w) => w.startsWith(ref + ':'));

// ############################################################################
// conversion module
// ############################################################################

test.describe('1 Attributes to elements', () => {
  let s: Snapshot;
  test.beforeEach(async ({ page }) => {
    await page.goto(defaultUrl);
    s = await convert(page, attributesMei, 'toElements');
  });

  test('1.1 Counts of created elements', async () => {
    expect(s.counts).toEqual({
      clef: 2,
      keySig: 2,
      meterSig: 1,
      mensur: 1,
      grpSym: 1,
      accid: 4,
      artic: 5,
      syl: 2,
      fermata: 5,
      tie: 7,
      gliss: 1,
      slur: 4,
    });
  });

  test('1.2 Score and staff definitions, in schema order', async () => {
    expect(s.elements['sd'].attrs).toEqual({});
    expect(childNames(s, 'sd')).toEqual(['keySig', 'meterSig', 'staffGrp']);
    expect(childrenOf(s, 'sd', 'keySig')[0].attrs).toEqual({ sig: '1f' });
    expect(childrenOf(s, 'sd', 'meterSig')[0].attrs).toEqual({ count: '4', unit: '4', sym: 'common' });
    // grpSym precedes staffDef; @label is no display label in MEI 5 and stays
    expect(childNames(s, 'sg')).toEqual(['grpSym', 'staffDef', 'staffDef']);
    expect(s.elements['sg'].attrs).toEqual({ label: 'Piano' });
    expect(s.elements['s1'].attrs).toEqual({ n: '1', lines: '5', label: 'RH' });
    expect(childrenOf(s, 's1', 'clef')[0].attrs).toEqual({ shape: 'G', line: '2' });
    expect(childNames(s, 's2')).toEqual(['clef', 'keySig', 'mensur']);
    expect(childrenOf(s, 's2', 'clef')[0].attrs).toEqual({ shape: 'F', line: '4', dis: '8', 'dis.place': 'below' });
    expect(childrenOf(s, 's2', 'keySig')[0].attrs).toEqual({ sig: '2f', visible: 'true' });
    expect(childrenOf(s, 's2', 'mensur')[0].attrs).toEqual({ sign: 'C', slash: '1' });
    // @meter.form without @meter.count/@meter.sym cannot become a meterSig
    expect(s.elements['s2'].attrs['meter.form']).toBe('norm');
    expect(warningFor(s, 'staffDef#s2')).toHaveLength(1);
  });

  test('1.3 Accidentals, including merge into existing accid', async () => {
    expect(childrenOf(s, 'n1', 'accid')[0].attrs).toEqual({ accid: 's' });
    expect(childrenOf(s, 'n2', 'accid')[0].attrs).toEqual({ 'accid.ges': 'f' });
    expect(childrenOf(s, 'n3', 'accid')[0].attrs).toEqual({ accid: 'n', 'accid.ges': 'n' });
    for (const id of ['n1', 'n2', 'n3', 'n4']) {
      expect(s.elements[id].attrs.accid).toBeUndefined();
      expect(s.elements[id].attrs['accid.ges']).toBeUndefined();
    }
    // merged into the existing accid element (keeps its xml:id)
    expect(s.elements['n4'].children).toHaveLength(1);
    expect(s.elements['n4a'].attrs).toEqual({ accid: 's', 'accid.ges': 's' });
    // contradicting values: unchanged, with warning
    expect(s.elements['n5'].attrs['accid.ges']).toBe('f');
    expect(s.elements['n5a'].attrs).toEqual({ 'accid.ges': 's' });
    expect(warningFor(s, 'note#n5')[0]).toContain('contradicts');
    // accid within editorial markup (supplied): no second accid element next to it
    expect(s.elements['n6'].attrs['accid.ges']).toBe('s');
    expect(childNames(s, 'n6')).toEqual(['supplied']);
    expect(warningFor(s, 'note#n6')[0]).toContain('editorial markup');
  });

  test('1.4 Articulations: one element per value, paired gestural values, no duplicates', async () => {
    expect(childrenOf(s, 'n7', 'artic').map((c) => c.attrs)).toEqual([{ artic: 'stacc' }]);
    expect(childrenOf(s, 'n8', 'artic').map((c) => c.attrs)).toEqual([{ artic: 'stacc' }, { artic: 'acc' }]);
    expect(childrenOf(s, 'n9', 'artic').map((c) => c.attrs)).toEqual([
      { artic: 'stacc', 'artic.ges': 'ten' },
      { artic: 'acc', 'artic.ges': 'marc' },
    ]);
    // different numbers of values are not paired; artic elements follow the chord notes
    expect(childNames(s, 'c1')).toEqual(['note', 'note', 'artic', 'artic', 'artic']);
    expect(childrenOf(s, 'c1', 'artic').map((c) => c.attrs)).toEqual([
      { artic: 'ten' },
      { 'artic.ges': 'stacc' },
      { 'artic.ges': 'ten' },
    ]);
    expect(childrenOf(s, 'n10', 'artic').map((c) => c.id)).toEqual(['n10a']);
    // artic within editorial markup (supplied): unchanged
    expect(s.elements['n11'].attrs.artic).toBe('stacc');
    expect(childNames(s, 'n11')).toEqual(['supplied']);
    expect(warningFor(s, 'note#n11')[0]).toContain('editorial markup');
    for (const id of ['n7', 'n8', 'n9', 'c1', 'n10']) {
      expect(s.elements[id].attrs.artic).toBeUndefined();
      expect(s.elements[id].attrs['artic.ges']).toBeUndefined();
    }
  });

  test('1.5 Lyrics as verse/syl', async () => {
    const verse = childrenOf(s, 'n12', 'verse')[0];
    expect(verse.attrs).toEqual({ n: '1' });
    expect(s.elements[verse.id!].children).toEqual([expect.objectContaining({ name: 'syl', text: 'Ky' })]);
    expect(childrenOf(s, 'c2', 'verse')[0].text).toBe('e');
    // existing verse: unchanged, with warning
    expect(s.elements['n13'].attrs.syl).toBe('ri');
    expect(warningFor(s, 'note#n13')).toHaveLength(1);
  });

  test('1.6 Fermatas as control events, no duplicate of existing fermata', async () => {
    const fermatas = s.controlEvents.filter((c) => c.name === 'fermata');
    expect(fermatas.map((f) => [f.attrs.startid, f.attrs.place, f.attrs.staff]).sort()).toEqual([
      ['#c3', 'below', '1'],
      ['#mr2', 'above', '2'],
      ['#n14', 'above', '1'],
      ['#n15', 'above', '1'],
      ['#r1', 'above', '1'],
    ]);
    expect(fermatas.every((f) => f.measure === 'm4')).toBe(true);
    for (const id of ['n14', 'c3', 'r1', 'n15', 'mr2']) expect(s.elements[id].attrs.fermata).toBeUndefined();
  });

  test('1.7 Ties: layers, chords, medial values, existing tie elements, unmatched values', async () => {
    expect(pairs(s, 'tie')).toEqual(
      ['#n16>#n20', '#n18>#n21', '#n17>#n22', '#n22>#n24', '#c4a>#c5a', '#c4b>#c5b', '#n26>#n29'].sort()
    );
    // tie elements in the measure of their start note, with staff
    const tie = (startid: string) => s.controlEvents.find((c) => c.name === 'tie' && c.attrs.startid === startid)!;
    expect(tie('#n16')).toMatchObject({ measure: 'm5', attrs: { staff: '1' } });
    expect(tie('#n22')).toMatchObject({ measure: 'm6' });
    expect(tie('#c4a')).toMatchObject({ measure: 'm5', attrs: { staff: '2' } });
    expect(tie('#n26').id).toBe('t0'); // existing element, no duplicate
    for (const id of ['n16', 'n17', 'n18', 'n20', 'n21', 'n22', 'n24', 'n26', 'n29', 'c4', 'c5', 'c4a', 'c5b']) {
      expect(s.elements[id].attrs.tie).toBeUndefined();
    }
    // unmatched values remain, with warnings
    expect(s.elements['n25'].attrs.tie).toBe('i');
    expect(s.elements['n27'].attrs.tie).toBe('t');
    expect(warningFor(s, 'note#n25')).toHaveLength(1);
    expect(warningFor(s, 'note#n27')).toHaveLength(1);
  });

  test('1.8 Slurs: nested, medial, across staves, unterminated', async () => {
    expect(pairs(s, 'slur')).toEqual(['#n29>#n32', '#n30>#n31', '#n33>#n38', '#n39>#n40'].sort());
    const slur = (startid: string) => s.controlEvents.find((c) => c.name === 'slur' && c.attrs.startid === startid)!;
    expect(slur('#n39').attrs.staff).toBe('1 2');
    expect(slur('#n33')).toMatchObject({ measure: 'm8', attrs: { staff: '2' } });
    // medial value within a converted slur is removed
    expect(s.elements['n34'].attrs.slur).toBeUndefined();
    expect(s.elements['n35'].attrs.slur).toBe('i3');
    expect(warningFor(s, 'note#n35')).toHaveLength(1);
  });

  test('1.9 Glissando', async () => {
    expect(pairs(s, 'gliss')).toEqual(['#n36>#n37']);
    expect(s.elements['n36'].attrs.gliss).toBeUndefined();
    expect(s.elements['n37'].attrs.gliss).toBeUndefined();
  });

  test('1.10 Exactly the expected warnings', async () => {
    expect(s.warnings.map((w) => w.split(':')[0]).sort()).toEqual(
      ['staffDef#s2', 'note#n5', 'note#n6', 'note#n11', 'note#n13', 'note#n25', 'note#n27', 'note#n35'].sort()
    );
  });

  test('1.11 A second run converts nothing more', async ({ page }) => {
    const second = await convert(page, s.xml, 'toElements');
    expect(second.counts).toEqual({});
  });

  test('1.12 Only selected attribute groups are converted', async ({ page }) => {
    const ties = await convert(page, attributesMei, 'toElements', { groups: ['tie'] });
    expect(ties.counts).toEqual({ tie: 7 });
    expect(ties.elements['n1'].attrs.accid).toBe('s');
    expect(ties.elements['n29'].attrs.slur).toBe('i1');
    const none = await convert(page, attributesMei, 'toElements', { groups: [] });
    expect(none.counts).toEqual({});
  });

  test('1.13 Scope: only attributes within the scope (ties starting there) are converted', async ({ page }) => {
    const m5 = await convert(page, attributesMei, 'toElements', { scopeMeasures: ['m5'] });
    expect(m5.counts).toEqual({ tie: 5 });
    expect(m5.warnings).toEqual([]); // unresolved values outside the scope are not reported
    // the existing tie element t0 (n26>#n29) is part of the encoding already
    expect(pairs(m5, 'tie')).toEqual(
      ['#n16>#n20', '#n17>#n22', '#n18>#n21', '#c4a>#c5a', '#c4b>#c5b', '#n26>#n29'].sort()
    );
    // n22 (outside) keeps its start value for the tie to n24, also outside the scope
    expect(m5.elements['n22'].attrs.tie).toBe('i');
    expect(m5.elements['n24'].attrs.tie).toBe('t');
    expect(m5.elements['n1'].attrs.accid).toBe('s');
    expect(m5.elements['c4'].attrs.tie).toBeUndefined();
    expect(m5.elements['c5'].attrs.tie).toBeUndefined();
  });

  test('1.14 @accid and @accid.ges are separate groups', async ({ page }) => {
    // written accidentals only: @accid.ges stays an attribute of the note
    const written = await convert(page, attributesMei, 'toElements', { groups: ['accid'] });
    expect(written.counts).toEqual({ accid: 2 });
    expect(childrenOf(written, 'n1', 'accid')[0].attrs).toEqual({ accid: 's' });
    expect(written.elements['n2'].attrs['accid.ges']).toBe('f');
    expect(childrenOf(written, 'n2', 'accid')).toEqual([]);
    expect(childrenOf(written, 'n3', 'accid')[0].attrs).toEqual({ accid: 'n' });
    expect(written.elements['n3'].attrs['accid.ges']).toBe('n');
    expect(written.elements['n4'].attrs['accid.ges']).toBe('s'); // no @accid: unchanged
    expect(written.elements['n4a'].attrs).toEqual({ accid: 's' });
    expect(written.warnings).toEqual([]); // n5, n6 have no @accid
    // gestural accidentals only: @accid stays an attribute of the note
    const gestural = await convert(page, attributesMei, 'toElements', { groups: ['accidGes'] });
    expect(gestural.counts).toEqual({ accid: 3 });
    expect(gestural.elements['n1'].attrs.accid).toBe('s');
    expect(childrenOf(gestural, 'n2', 'accid')[0].attrs).toEqual({ 'accid.ges': 'f' });
    expect(childrenOf(gestural, 'n3', 'accid')[0].attrs).toEqual({ 'accid.ges': 'n' });
    expect(gestural.elements['n3'].attrs.accid).toBe('n');
    expect(gestural.elements['n4a'].attrs).toEqual({ accid: 's', 'accid.ges': 's' }); // merged
    expect(gestural.warnings.map((w) => w.split(':')[0]).sort()).toEqual(['note#n5', 'note#n6']);
  });
});

test.describe('2 Elements to attributes', () => {
  let s: Snapshot;
  test.beforeEach(async ({ page }) => {
    await page.goto(defaultUrl);
    s = await convert(page, elementsMei, 'toAttributes');
  });

  test('2.1 Counts of removed elements', async () => {
    expect(s.counts).toEqual({
      clef: 1,
      keySig: 2,
      meterSig: 1,
      grpSym: 1,
      accid: 2,
      artic: 2,
      syl: 2,
      fermata: 2,
      tie: 1,
      gliss: 1,
      slur: 2,
    });
  });

  test('2.2 Score and staff definitions (MEI 5 names)', async () => {
    expect(s.elements['sd'].attrs).toEqual({ keysig: '1f', 'meter.count': '3', 'meter.unit': '4' });
    expect(s.elements['sg'].attrs).toEqual({ symbol: 'bracket' });
    expect(s.elements['s1'].attrs).toMatchObject({ keysig: '1f', 'key.mode': 'major', 'key.pname': 'f' });
    expect(s.elements['s2'].attrs).toMatchObject({ 'clef.shape': 'F', 'clef.line': '4', 'clef.color': 'blue' });
    // kept: clef@cautionary, keySig with keyAccid, label elements (MEI 5)
    expect(s.elements['cl1']).toBeDefined();
    expect(s.elements['ks2']).toBeDefined();
    expect(s.elements['lb0']).toBeDefined();
    expect(s.elements['lb1']).toBeDefined();
    expect(s.elements['s2'].attrs.keysig).toBeUndefined();
  });

  test('2.3 Accidentals and articulations', async () => {
    expect(s.elements['n1'].attrs.accid).toBe('s');
    expect(s.elements['n1'].children).toEqual([]);
    expect(s.elements['n2'].attrs).toMatchObject({ accid: 'f', 'accid.ges': 'f' });
    expect(s.elements['a3']).toBeDefined(); // @func
    expect(s.elements['a3b']).toBeDefined(); // within supplied: untouched, no warning
    expect(s.elements['n3b'].attrs.accid).toBeUndefined();
    expect(s.elements['a4']).toBeDefined(); // referenced by annot
    expect(s.elements['n5'].attrs.artic).toBe('stacc');
    expect(childrenOf(s, 'n5', 'artic').map((c) => c.id)).toEqual(['ar2']); // @place
    expect(s.elements['ch1'].attrs.artic).toBe('ten');
    expect(childrenOf(s, 'ch1', 'artic').map((c) => c.id)).toEqual(['ar4']); // empty artic
  });

  test('2.4 Lyrics', async () => {
    expect(s.elements['n6'].attrs.syl).toBe('Ky');
    expect(s.elements['n9'].attrs.syl).toBe('son');
    for (const id of ['v2', 'v3', 'v5', 'v6']) expect(s.elements[id]).toBeDefined();
    for (const id of ['n7', 'n8', 'n10']) expect(s.elements[id].attrs.syl).toBeUndefined();
  });

  test('2.5 Fermatas: default form and place, kept cases', async () => {
    expect(s.elements['n11'].attrs.fermata).toBe('above'); // form="norm" dropped
    expect(s.elements['r1'].attrs.fermata).toBe('above'); // no @place
    expect(s.controlEvents.filter((c) => c.name === 'fermata').map((c) => c.id).sort()).toEqual(['f2', 'f4', 'f5']);
    expect(s.elements['f6']).toBeDefined(); // within supplied
    expect(s.elements['n12'].attrs.fermata).toBeUndefined();
    expect(s.elements['n13'].attrs.fermata).toBeUndefined();
  });

  test('2.6 Ties: only those that can be matched again', async () => {
    expect(s.elements['n14'].attrs.tie).toBe('i');
    expect(s.elements['n19'].attrs.tie).toBe('t');
    // kept: different pitch, @curvedir, note to chord, across staves, two barlines, already tied
    expect(s.controlEvents.filter((c) => c.name === 'tie').map((c) => c.id).sort()).toEqual(
      ['t2', 't3', 't4', 't5', 't6', 't7'].sort()
    );
    expect(warningFor(s, 'tie#t2')[0]).toContain('differ in pitch');
    expect(warningFor(s, 'tie#t4')[0]).toContain('differ in pitch');
    expect(warningFor(s, 'tie#t5')[0]).toContain('different staves');
    expect(warningFor(s, 'tie#t6')[0]).toContain('next measure');
    expect(warningFor(s, 'tie#t7')[0]).toContain('already');
    for (const id of ['n15', 'n20', 'n17', 'n18', 'n16', 'n23', 'n21']) expect(s.elements[id].attrs.tie).toBeUndefined();
  });

  test('2.7 Slurs receive different numbers when overlapping; glissando', async () => {
    expect(s.elements['n14'].attrs.slur).toBe('i1 i2');
    expect(s.elements['n16'].attrs.slur).toBe('t1');
    expect(s.elements['n19'].attrs.slur).toBe('t2');
    expect(s.controlEvents.filter((c) => c.name === 'slur').map((c) => c.id).sort()).toEqual([
      'sl3',
      'sl4',
      'sl5',
      'sl6',
      'sl7',
    ]);
    expect(warningFor(s, 'slur#sl6')[0]).toContain('no @endid');
    expect(warningFor(s, 'slur#sl7')[0]).toContain('does not follow');
    expect(s.elements['n20'].attrs.gliss).toBe('i');
    expect(s.elements['n21'].attrs.gliss).toBe('t');
    expect(s.elements['g2']).toBeDefined(); // text content
  });

  test('2.8 Exactly the expected warnings', async () => {
    expect(s.warnings.map((w) => w.split(':')[0]).sort()).toEqual(
      [
        'clef#cl1',
        'keySig#ks2',
        'accid#a3',
        'accid#a4',
        'artic#ar2',
        'artic#ar4',
        'syl#sy2',
        'verse#v3',
        'note#n10',
        'fermata#f2',
        'fermata#f4',
        'fermata#f5',
        'fermata#f6',
        'tie#t2',
        'tie#t3',
        'tie#t4',
        'tie#t5',
        'tie#t6',
        'tie#t7',
        'slur#sl3',
        'slur#sl4',
        'slur#sl5',
        'slur#sl6',
        'slur#sl7',
        'gliss#g2',
      ].sort()
    );
  });

  test('2.9 Removed elements leave no empty lines; emptied elements become self-closing', async () => {
    expect(s.xml).toContain('<note xml:id="n1" pname="c" oct="5" dur="4" accid="s"/>');
    expect(s.xml).not.toMatch(/\n[ \t]*\n/);
  });

  test('2.10 A second run converts nothing more', async ({ page }) => {
    const second = await convert(page, s.xml, 'toAttributes');
    expect(second.counts).toEqual({});
  });

  test('2.11 Scope: only elements within the scope are converted', async ({ page }) => {
    const m4 = await convert(page, elementsMei, 'toAttributes', { scopeMeasures: ['m4'] });
    expect(m4.counts).toEqual({ tie: 1, slur: 2 });
    expect(m4.warnings.map((w) => w.split(':')[0]).sort()).toEqual(
      ['tie#t2', 'tie#t3', 'tie#t4', 'tie#t5', 'slur#sl3', 'slur#sl4', 'slur#sl6', 'slur#sl7'].sort()
    );
    expect(m4.elements['a1']).toBeDefined(); // m1: outside the scope
    expect(m4.elements['g1']).toBeDefined(); // m5: outside the scope
    // a control event outside the scope is converted when its start or end element is within
    const notes = await convert(page, elementsMei, 'toAttributes', { scopeMeasures: ['m5'], groups: ['tie'] });
    expect(notes.counts).toEqual({ tie: 1 }); // t1 in m4, ending on n19 in m5
    expect(notes.elements['n19'].attrs.tie).toBe('t');
  });

  test('2.12 @accid and @accid.ges are separate groups; accid elements keeping an attribute remain', async ({ page }) => {
    const elements = await convert(page, attributesMei, 'toElements');
    const n3accid = childrenOf(elements, 'n3', 'accid')[0]; // accid="n" accid.ges="n"
    const gestural = await convert(page, elements.xml, 'toAttributes', { groups: ['accidGes'] });
    expect(gestural.counts).toEqual({ accid: 3 }); // n2 (removed), n3 and n4 (accid elements remain)
    // n5a contradicts n5@accid.ges (kept as in 1.3)
    expect(gestural.warnings.map((w) => w.split(':')[0])).toEqual(['accid#n5a']);
    expect(gestural.elements['n3'].attrs['accid.ges']).toBe('n');
    expect(gestural.elements[n3accid.id!].attrs).toEqual({ accid: 'n' }); // same element, same xml:id
    expect(gestural.elements['n2'].attrs['accid.ges']).toBe('f');
    expect(childrenOf(gestural, 'n2', 'accid')).toEqual([]); // nothing left: removed
    expect(childrenOf(gestural, 'n1', 'accid')[0].attrs).toEqual({ accid: 's' }); // @accid: not selected
    expect(gestural.elements['n4a'].attrs).toEqual({ accid: 's' });
    expect(gestural.elements['n4'].attrs['accid.ges']).toBe('s');
    // a referenced accid element may give up an attribute, as it remains (elements fixture: a4)
    const referenced = elementsMei.replace('<accid xml:id="a4" accid="f"/>', '<accid xml:id="a4" accid="f" accid.ges="f"/>');
    const partial = await convert(page, referenced, 'toAttributes', { groups: ['accidGes'] });
    expect(partial.elements['a4'].attrs).toEqual({ accid: 'f' });
    expect(partial.elements['n4'].attrs['accid.ges']).toBe('f');
  });
});

test.describe('3 Round trips', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(defaultUrl);
  });

  test('3.1 Attributes to elements to attributes restores the attributes', async ({ page }) => {
    const original = await convert(page, attributesMei, 'toElements', { groups: [] }); // snapshot only
    const elements = await convert(page, attributesMei, 'toElements');
    const back = await convert(page, elements.xml, 'toAttributes');
    // documented differences: chord ties move to the chord notes, medial slur values are
    // not written, slur numbers are reassigned, merged accid becomes attributes
    const expectedDifferences: Record<string, Attrs> = {
      c4: { ...original.elements['c4'].attrs },
      c5: { ...original.elements['c5'].attrs },
      c4a: { ...original.elements['c4a'].attrs, tie: 'i' },
      c4b: { ...original.elements['c4b'].attrs, tie: 'i' },
      c5a: { ...original.elements['c5a'].attrs, tie: 't' },
      c5b: { ...original.elements['c5b'].attrs, tie: 't' },
      n4: { ...original.elements['n4'].attrs, accid: 's' },
      n34: { ...original.elements['n34'].attrs },
      n39: { ...original.elements['n39'].attrs, slur: 'i1' },
      n40: { ...original.elements['n40'].attrs, slur: 't1' },
    };
    delete expectedDifferences.c4.tie;
    delete expectedDifferences.c5.tie;
    delete expectedDifferences.n34.slur;
    // elements of the original encoding that become attributes as well: accid merged
    // with n4@accid.ges, artic n10a, fermata f0 and tie t0
    const convertedOriginals = ['n4a', 'n10a', 'f0', 't0'];
    for (const [id, el] of Object.entries(original.elements)) {
      if (convertedOriginals.includes(id)) {
        expect(back.elements[id], 'element ' + id).toBeUndefined();
        continue;
      }
      expect(back.elements[id], 'element ' + id).toBeDefined();
      expect(back.elements[id].attrs, 'attributes of ' + id).toEqual(expectedDifferences[id] || el.attrs);
    }
  });

  test('3.2 Elements to attributes to elements recreates the converted elements', async ({ page }) => {
    const attributes = await convert(page, elementsMei, 'toAttributes');
    const back = await convert(page, attributes.xml, 'toElements');
    // the same elements are recreated; in addition, the kept tie t7 now accounts for n25@tie="i"
    expect(back.counts).toEqual({ ...attributes.counts, tie: attributes.counts.tie + 1 });
    expect(back.warnings).toEqual([]);
    expect(back.elements['n25'].attrs.tie).toBeUndefined();
    // an existing gliss (g2, kept) ending on n21 does not consume n21@gliss="t" of n20
    expect(pairs(back, 'gliss')).toEqual(['#n19>#n21', '#n20>#n21']);
    expect(pairs(back, 'tie')).toContain('#n14>#n19');
    expect(pairs(back, 'slur')).toEqual(expect.arrayContaining(['#n14>#n16', '#n14>#n19']));
  });

  test('3.3 MEI 4 attribute names in both directions', async ({ page }) => {
    const elements = await convert(page, mei4, 'toElements');
    expect(elements.counts).toEqual({ clef: 2, keySig: 1, meterSig: 1, grpSym: 1, label: 2, accid: 1, artic: 1 });
    expect(childrenOf(elements, 'sd', 'keySig')[0].attrs).toEqual({
      sig: '2s',
      mode: 'major',
      pname: 'd',
      'sig.showchange': 'true',
    });
    // @label is a display label up to MEI 4
    expect(childNames(elements, 'sg')).toEqual(['grpSym', 'label', 'staffDef', 'staffDef']);
    expect(childrenOf(elements, 'sg', 'label')[0].text).toBe('Strings');
    expect(childrenOf(elements, 's1', 'label')[0].text).toBe('Violin');
    const back = await convert(page, elements.xml, 'toAttributes');
    expect(back.elements['sd'].attrs).toEqual({
      'key.sig': '2s',
      'key.mode': 'major',
      'key.pname': 'd',
      'keysig.showchange': 'true',
      'meter.count': '3',
      'meter.unit': '4',
    });
    expect(back.elements['sg'].attrs).toEqual({ symbol: 'bracket', label: 'Strings' });
    expect(back.elements['s1'].attrs).toMatchObject({ label: 'Violin', 'clef.shape': 'G', 'clef.line': '2' });
    // label with line break stays an element
    expect(back.elements['lb2']).toBeDefined();
    expect(back.elements['s2'].attrs.label).toBeUndefined();
    expect(back.warnings).toEqual(['label#lb2: element content cannot be expressed as attribute']);
  });
});

// ############################################################################
// Convert tab of the MEI toolbox
// ############################################################################

async function getEditorValue(page: Page): Promise<string> {
  return page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.getValue());
}

async function openConvertTab(page: Page) {
  await page.locator('#showMeiToolboxButton').click();
  await expect(page.locator('#meiToolbox')).toBeVisible();
  await page.locator('.mtTab[data-tab="convert"]').click();
  await expect(page.locator('.mtPane[data-tab="convert"]')).toBeVisible();
}

// button of the Convert tab: row 0 attributes -> elements, row 1 elements -> attributes; index 0 is Test
function convertButton(page: Page, row: number, index: number) {
  return page.locator('.mtPane[data-tab="convert"] .mtActionRow').nth(row).locator('button').nth(index);
}

async function unfoldOptions(page: Page) {
  // in a narrow panel, the options fold away after a run
  await page.evaluate(() =>
    document.querySelector('.mtPane[data-tab="convert"] .mtOptions')!.classList.remove('collapsed')
  );
}

test.describe('4 Convert tab of the MEI toolbox', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('4.1 Test, convert, filter and undo attributes to elements', async ({ page }) => {
    const pane = page.locator('.mtPane[data-tab="convert"]');
    await openLocalMei(page, 'attribute-conversion-attributes.mei', attributesMei);
    await expect(page.locator('#n1')).toBeVisible({ timeout: 30000 });
    const before = await getEditorValue(page);
    await openConvertTab(page);

    await test.step('Test lists conversions without changing the encoding', async () => {
      await convertButton(page, 0, 0).click();
      await expect(pane.locator('.mtEntry').first()).toBeVisible();
      // 8 warnings + 35 conversions (one entry per element carrying attributes, see 1.1)
      await expect(pane.locator('.mtEntry')).toHaveCount(43);
      expect(await getEditorValue(page)).toEqual(before);
    });

    await test.step('Convert changes the encoding', async () => {
      await unfoldOptions(page);
      await convertButton(page, 0, 1).click();
      await expect(async () => {
        expect(await getEditorValue(page)).toContain('<tie ');
      }).toPass({ timeout: 5000 });
      await expect(pane.locator('.mtEntry')).toHaveCount(43);
    });

    await test.step('Filter narrows the result list; clicking an entry moves the cursor', async () => {
      await pane.locator('.mtFilter').fill('#n16');
      await expect(pane.locator('.mtEntry:visible')).toHaveCount(1);
      await expect(pane.locator('.mtCount')).toHaveText('1 / 43');
      await pane.locator('.mtEntry:visible .codeCheckerMessage').click();
      const line = await page.evaluate(() => {
        const cm = (document.querySelector('.CodeMirror') as any).CodeMirror;
        return cm.getLine(cm.getCursor().line);
      });
      expect(line).toContain('startid="#n16"');
    });

    await test.step('A single undo restores the encoding', async () => {
      await page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.undo());
      expect(await getEditorValue(page)).toEqual(before);
    });
  });

  test('4.2 Elements to attributes and outdated results', async ({ page }) => {
    const pane = page.locator('.mtPane[data-tab="convert"]');
    await openLocalMei(page, 'attribute-conversion-elements.mei', elementsMei);
    await expect(page.locator('#n1')).toBeVisible({ timeout: 30000 });
    await openConvertTab(page);

    await test.step('Convert elements to attributes after confirming the removal of xml:ids', async () => {
      await convertButton(page, 1, 1).click();
      await expect(page.locator('#promptOverlay')).toBeVisible();
      await expect(page.locator('#promptOverlay')).toContainText('xml:id');
      await page.locator('#promptOverlay button').last().click(); // proceed
      await expect(async () => {
        expect(await getEditorValue(page)).toContain('accid="s"/>');
      }).toPass({ timeout: 5000 });
      await expect(pane.locator('.mtEntry.mtWarning')).toHaveCount(25);
      await expect(pane.locator('.mtRunTitle')).not.toContainText('(');
      await expect(pane).not.toHaveClass(/stale/);
    });

    await test.step('Editing the encoding marks the results as outdated', async () => {
      await page.evaluate(() => {
        const cm = (document.querySelector('.CodeMirror') as any).CodeMirror;
        cm.replaceRange('\n', { line: 1, ch: 0 });
      });
      await expect(pane).toHaveClass(/stale/);
    });
  });

  test('4.3 Conversion restricted to the editor selection; cancelling the confirmation', async ({ page }) => {
    const pane = page.locator('.mtPane[data-tab="convert"]');
    await openLocalMei(page, 'attribute-conversion-attributes.mei', attributesMei);
    await expect(page.locator('#n1')).toBeVisible({ timeout: 30000 });
    await openConvertTab(page);
    await expect(pane.locator('.mtScope')).not.toHaveClass(/mtScopeSelection/);

    await test.step('Select measure 1 in the editor', async () => {
      await page.evaluate(() => {
        const cm = (document.querySelector('.CodeMirror') as any).CodeMirror;
        const lines = cm.getValue().split('\n');
        const from = lines.findIndex((l: string) => l.includes('<measure xml:id="m1"'));
        const to = lines.findIndex((l: string, i: number) => i > from && l.includes('</measure>'));
        cm.setSelection({ line: from, ch: 0 }, { line: to + 1, ch: 0 });
      });
      await expect(pane.locator('.mtScope')).toHaveClass(/mtScopeSelection/);
    });

    await test.step('Test lists only the attributes of measure 1', async () => {
      const before = await getEditorValue(page);
      await convertButton(page, 0, 0).click();
      // n1-n4 converted, n5 and n6 with warnings
      await expect(pane.locator('.mtEntry')).toHaveCount(6);
      await expect(pane.locator('.mtRunTitle')).toContainText(',');
      expect(await getEditorValue(page)).toEqual(before);
    });

    await test.step('Convert changes only measure 1', async () => {
      await unfoldOptions(page);
      await convertButton(page, 0, 1).click();
      await expect(async () => {
        // n1 (measure 1) received an accid child element
        expect(await getEditorValue(page)).toContain('<note xml:id="n1" pname="c" oct="5" dur="4">');
      }).toPass({ timeout: 5000 });
      const value = await getEditorValue(page);
      expect(value).toContain('<note xml:id="n16" pname="c" oct="5" dur="2" tie="i"/>'); // outside: unchanged
      expect(value).toContain('<note xml:id="n7" pname="c" oct="5" dur="4" artic="stacc"/>');
    });

    await test.step('Cancelling the confirmation of elements to attributes leaves the encoding unchanged', async () => {
      await page.evaluate(() => (document.querySelector('.CodeMirror') as any).CodeMirror.setCursor({ line: 0, ch: 0 }));
      const before = await getEditorValue(page);
      await unfoldOptions(page);
      await convertButton(page, 1, 1).click();
      await expect(page.locator('#promptOverlay')).toBeVisible();
      await page.locator('#promptOverlay button').first().click(); // cancel
      await expect(page.locator('#promptOverlay')).not.toBeVisible();
      expect(await getEditorValue(page)).toEqual(before);
    });
  });
});
