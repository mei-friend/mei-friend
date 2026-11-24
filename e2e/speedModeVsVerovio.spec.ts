import { test, expect, Page, TestInfo } from '@playwright/test';
import { writeFileSync } from 'fs';
import { setupPage, openUrl, setSpeedMode, collectPerPage, measureIdsOnPage, measureIdsInEncoding } from './setup';

// Speed mode hands Verovio a reduced encoding per page: a context page in
// front, the requested page, a context page behind. Whatever musical state an
// earlier page established -- clef, key and meter changes from intermediate
// <scoreDef>s, <staffDef>s and in-layer <clef>s -- has to be folded into the
// <scoreDef> of that excerpt by speed mode itself. These tests render real,
// complex encodings twice, once as pure Verovio ("normal mode", the full
// encoding) and once in speed mode, and compare every system the two produce:
//
//  - layout:     the measures of each system and the staves drawn in each
//  - signatures: every clef, key signature and meter signature drawn, per
//                measure and staff (system-start ones included -- that is
//                where a wrong <scoreDef> state shows up), identified by
//                their SMuFL glyphs; groups without glyphs draw nothing and
//                are ignored
//  - labels:     <staffGrp>/<staffDef> labels and labelAbbrs
//  - spanners:   slurs, ties, hairpins etc. drawn per system (counted per class)
//
// Breaks modes compared:
//  - 'encoded': pages are fully determined by the encoding in both modes, so
//               pages and systems can be compared one to one.
//  - 'line':    speed mode shows one system per page, Verovio's normal mode
//               fills pages with several systems; systems are compared one to
//               one across all pages. This multiplies the number of page
//               starts speed mode has to reconstruct a <scoreDef> for.
//
// Only run in Chromium: they compare two Verovio renderings of the same engine
// version, so a second browser adds run time but no coverage.

type Breaks = 'encoded' | 'line' | 'auto';

interface Piece {
  title: string;
  url: string;
  breaks: Breaks[];
  /** Test timeout in ms; the full scores take a while to page through twice */
  timeout: number;
}

const pieces: Piece[] = [
  {
    // MEI 4.0.1, 19 staves, transposing instruments; intermediate <scoreDef>s
    // that restate <keySig> for most, but not all, staves (horns and trumpets
    // keep theirs); <meterSig> as child of <scoreDef> and of <staffDef>;
    // scoreDef@optimize
    title: 'Strauss, Fledermaus overture, Eulenburg full score',
    url:
      'https://raw.githubusercontent.com/Signature-Sound-Vienna/Johann-Strauss-Sohn_Fledermaus-Ouverture_Eulenburg/' +
      'refs/heads/main/Fledermaus-Ouverture-Eulenburg.mei',
    breaks: ['encoded', 'line'],
    timeout: 30 * 60000,
  },
  {
    // MEI 5.1, piano; intermediate <scoreDef>s with <keySig>/<meterSig> as
    // direct children (no <staffDef>s), meterSig@sym; clef changes in layers
    title: 'Strauss, Fledermaus overture, Cranz piano reduction',
    url:
      'https://raw.githubusercontent.com/Signature-Sound-Vienna/Johann-Strauss-Sohn_Fledermaus-Ouverture_Cranz/' +
      'main/Fledermaus-Ouverture_Cranz-piano.mei',
    breaks: ['encoded', 'line'],
    timeout: 15 * 60000,
  },
  {
    // MEI 5.1, 10 mdivs (theme + 9 variations), each with its own <scoreDef>
    // and <staffGrp><label>; clefs as <clef> children of <staffDef>, plus clef
    // changes inside layers
    title: 'Beethoven, WoO 63',
    url:
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO63_BreitkopfHaertel/main/' +
      'Beethoven_WoO63-Breitkopf.mei',
    breaks: ['encoded', 'line'],
    timeout: 10 * 60000,
  },
  {
    // MEI 4.0.1, 7 mdivs and a single <pb>: mdivs share pages; one
    // intermediate <scoreDef> with <keySig>/<meterSig> children
    title: 'Beethoven, WoO 64 (mdivs)',
    url:
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO64_BreitkopfHaertel/refs/heads/master/' +
      'Beethoven_WoO64-Breitkopf-mdivs.mei',
    breaks: ['encoded', 'line'],
    timeout: 10 * 60000,
  },
  {
    // MEI 5.1, one mdiv with 33 variations as <section>s, each opened by a
    // full <scoreDef> (staffGrp, label, <keySig> without @sig = no
    // accidentals, <clef> and <meterSig> children of <staffDef>); 270 clefs,
    // endings containing breaks, <expansion>s
    title: 'Beethoven, Diabelli variations op. 120',
    url:
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_Op120_BreitkopfHaertel/master/' +
      'Beethoven_Op120-Breitkopf.mei',
    breaks: ['encoded', 'line'],
    timeout: 30 * 60000,
  },
];

/** What is compared of one rendered system. */
interface SystemPrint {
  /** one line per measure: id and the staff numbers drawn in it */
  layout: string[];
  /** one line per drawn clef/keySig/meterSig: measure id, staff n, glyphs */
  signatures: string[];
  /** label and labelAbbr texts */
  labels: string[];
  /** count of drawn spanner/control-event classes, e.g. 'slur 3' */
  spanners: string[];
}

/**
 * Reads a fingerprint of every system of the currently displayed page.
 * Glyphs are identified by their SMuFL code point taken from the
 * `<use xlink:href="#E050-...">` references Verovio writes, so the
 * fingerprint does not depend on generated ids or positions.
 */
async function systemPrints(page: Page): Promise<SystemPrint[]> {
  return page.locator('#verovio-panel svg').first().evaluate((svg) => {
    const glyphs = (el: Element) =>
      Array.from(el.querySelectorAll('use'))
        .map((u) => {
          const href = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
          return href.match(/#(E[0-9A-F]{3})/i)?.[1] || href;
        })
        .join('');
    const isDummy = (id: string) => id === 'startingMeasure' || id === 'endingMeasure';
    const sigSelector = 'g.clef, g.keySig, g.meterSig';
    const spannerClasses = ['slur', 'tie', 'hairpin', 'octave', 'pedal', 'trill', 'gliss', 'phrase', 'bracketSpan'];
    return Array.from(svg.querySelectorAll('g.system')).map((system) => {
      const print = { layout: [] as string[], signatures: [] as string[], labels: [] as string[], spanners: [] as string[] };
      system.querySelectorAll('g.label, g.labelAbbr').forEach((l) => {
        const text = (l.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) print.labels.push(l.getAttribute('class') + ': ' + text);
      });
      // signatures drawn outside any measure (if Verovio ever does so)
      system.querySelectorAll(sigSelector).forEach((s) => {
        if (!s.closest('g.measure') && glyphs(s)) print.signatures.push('system ' + s.getAttribute('class') + ':' + glyphs(s));
      });
      system.querySelectorAll('g.measure').forEach((m) => {
        if (isDummy(m.id)) return;
        const staves = Array.from(m.querySelectorAll(':scope > g.staff'));
        print.layout.push(m.id + ' staves ' + staves.map((s) => s.getAttribute('data-n') || '?').join(','));
        for (const staff of staves) {
          staff.querySelectorAll(sigSelector).forEach((s) => {
            // a group without glyphs draws nothing (Verovio writes an empty
            // keySig group at every system start of a staff whose *initial*
            // key has no accidentals, but none after a *change* to no
            // accidentals), so it is not compared
            if (!glyphs(s)) return;
            print.signatures.push(
              m.id + ' staff ' + staff.getAttribute('data-n') + ' ' + s.getAttribute('class') + ':' + glyphs(s)
            );
          });
        }
      });
      for (const cls of spannerClasses) {
        // a spanner continuing over a system break is drawn once per system,
        // in both modes, so counting ids per system is comparable
        const ids = new Set(Array.from(system.querySelectorAll('g.' + cls)).map((e) => e.id));
        if (ids.size) print.spanners.push(cls + ' ' + ids.size);
      }
      return print;
    });
  });
}

interface Mismatch {
  system: number; // 0-based index over all systems
  firstMeasure: string;
  normal: string[];
  speed: string[];
}

/** Compares one aspect of the two renderings system by system. */
function compare(normal: SystemPrint[], speed: SystemPrint[], key: keyof SystemPrint): Mismatch[] {
  const mismatches: Mismatch[] = [];
  for (let i = 0; i < Math.max(normal.length, speed.length); i++) {
    const n = normal[i]?.[key] || [];
    const s = speed[i]?.[key] || [];
    if (n.join('\n') === s.join('\n')) continue;
    // keep only the lines that differ, so the report stays readable
    mismatches.push({
      system: i,
      firstMeasure: (normal[i] || speed[i]).layout[0]?.split(' ')[0] || '',
      normal: n.filter((l) => !s.includes(l)),
      speed: s.filter((l) => !n.includes(l)),
    });
  }
  return mismatches;
}

function report(mismatches: Mismatch[], max = 15): string {
  const lines = mismatches.slice(0, max).map(
    (m) =>
      `  system ${m.system + 1} (from measure ${m.firstMeasure}):\n` +
      m.normal.map((l) => `    - normal: ${l}`).join('\n') +
      (m.normal.length ? '\n' : '') +
      m.speed.map((l) => `    + speed:  ${l}`).join('\n')
  );
  if (mismatches.length > max) lines.push(`  ... and ${mismatches.length - max} more systems`);
  return `${mismatches.length} system(s) differ:\n` + lines.join('\n');
}

async function openPiece(page: Page, url: string, encoding: string) {
  const firstMeasure = measureIdsInEncoding(encoding)[0];
  await openUrl(page, url);
  // the previous encoding stays on screen while this one loads
  await expect.poll(async () => (await measureIdsOnPage(page))[0], { timeout: 120000 }).toBe(firstMeasure);
}

async function render(page: Page, speed: boolean, breaks: Breaks) {
  await setSpeedMode(page, speed, breaks);
  const pages = await collectPerPage(page, systemPrints, { timeout: 120000, stable: speed ? 400 : 1000 });
  // Verovio may leave a system without any measure where an mdiv ends with a
  // <pb>: at the end of that page in normal mode, at the start of the next one
  // in speed mode. Nothing is drawn in it, so it is left out of the comparison.
  const drawn = (s: SystemPrint) => s.layout.length + s.labels.length + s.signatures.length + s.spanners.length > 0;
  return { pages: pages.map((p) => p.filter(drawn)), systems: pages.flat().filter(drawn) };
}

test.beforeEach(async ({ page }) => {
  console.log('Comparing speed mode with pure Verovio rendering.');
  await setupPage(page);
});

test.describe('4 Speed mode renders complex encodings as Verovio does.', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Compares two renderings of the same engine');

  let n = 0;
  for (const piece of pieces) {
    for (const breaks of piece.breaks) {
      n++;
      test(`4.${n} ${piece.title}, breaks '${breaks}'`, async ({ page }, testInfo: TestInfo) => {
        test.setTimeout(piece.timeout);
        const encoding = await (await fetch(piece.url)).text();

        await test.step('Open the encoding', () => openPiece(page, piece.url, encoding));

        const normal = await test.step('Page through it in normal mode (pure Verovio)', () =>
          render(page, false, breaks)
        );
        const speed = await test.step('Page through it in speed mode', () => render(page, true, breaks));

        // full fingerprints of both renderings, for inspecting a failure
        const json = testInfo.outputPath('systems.json');
        writeFileSync(json, JSON.stringify({ normal: normal.pages, speed: speed.pages }, null, 1));
        await testInfo.attach('systems.json', { path: json, contentType: 'application/json' });

        await test.step('Both modes show every measure once, in order', () => {
          const measures = (systems: SystemPrint[]) => systems.flatMap((s) => s.layout.map((l) => l.split(' ')[0]));
          expect.soft(measures(speed.systems)).toEqual(measures(normal.systems));
        });

        if (breaks === 'encoded') {
          await test.step('Same pages, with the same number of systems each', () => {
            expect.soft(speed.pages.map((p) => p.length)).toEqual(normal.pages.map((p) => p.length));
          });
        }

        await test.step('Compare every system', () => {
          const layout = compare(normal.systems, speed.systems, 'layout');
          expect.soft(layout, 'Layout (measures and staves per system)\n' + report(layout)).toEqual([]);
          const signatures = compare(normal.systems, speed.systems, 'signatures');
          expect.soft(signatures, 'Clefs, key and meter signatures\n' + report(signatures)).toEqual([]);
          const labels = compare(normal.systems, speed.systems, 'labels');
          expect.soft(labels, 'Labels\n' + report(labels)).toEqual([]);
          const spanners = compare(normal.systems, speed.systems, 'spanners');
          expect.soft(spanners, 'Spanners\n' + report(spanners)).toEqual([]);
        });
      });
    }
  }
});
