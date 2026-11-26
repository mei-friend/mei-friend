// @ts-check

/* Speed mode: just feed the current page excerpt of the MEI encoding
 * to Verovio, to minimize loading times. Enclose the requested page
 * with dummy pages to ensure context (time-spanning elements, key
 * signatures, tempo indications, etc.)
 */

import * as utils from './utils.js';
import * as dutils from './dom-utils.js';
import * as att from './attribute-classes.js';
import { meiNameSpace, xmlNameSpace } from './dom-utils.js';
import { commonSchemas, defaultMeiProfile, defaultMeiVersion } from './defaults.js';

/** @typedef {('sb' | 'pb')[] | {[pageNum: string]: string[]}} Breaks */
/** @typedef {{
 *   start: {[pageNum: string]: string[]},
 *   end: {[pageNum: string]: string[]}
 * }} PageSpanners;
 */
/** @typedef {'computedBreaks' | 'encodedBreaks' | 'firstPage'} CountingMode */
/** @typedef {'sb' | 'pb'} Break */
/** @typedef {{p: number, mNo: number, done: boolean, matched: boolean, countNow: boolean,
 *   measureSinceBreak: boolean, earlierContent: boolean, courtesy: Element[],
 *   lookaheadDone: boolean}} SectionState */
/** @typedef {'none' | 'auto' | 'line' | 'encoded' | 'smart'} BreaksOption */

/**
 * @param {Document} xmlDoc
 * @param {number} pageNo  Page number, starting at 1
 * @param {Breaks} breaks
 * @param {PageSpanners} pageSpanners
 * @param {Boolean} includeDummyMeasures
 * @returns {string|undefined} The page specified by `pageNo`, with preceding
 * and following dummy pages added with one meashre on each for anchoring
 * cross-page spanners. For page 1, no preceding dummy page is added, only a
 * following one.
 *
 * Walks every `<mdiv><score>` in the document, in document order (not just
 * the first), threading a shared page/measure counter across mdiv
 * boundaries, so a page belonging to any mdiv can be located and rendered.
 * If a page's content straddles two (or more) mdivs, every contributing
 * mdiv is rendered onto that one page, each keeping its own `<scoreDef>` --
 * matching how normal/full mode's Verovio-driven layout can likewise mix
 * mdivs onto a single page when no explicit break falls at the boundary.
 */
export function getPageFromDom(xmlDoc, pageNo = 1, breaks, pageSpanners, includeDummyMeasures = true) {
  const meiHeader = xmlDoc.querySelector('meiHead');
  if (!meiHeader) {
    console.info('getPageFromDom(): no meiHeader');
    return;
  }
  // console.info('getPageFromDom(' + pageNo + ') meiHead: ', meiHeader);
  // all scores in document order, spanning every <mdiv> (not just the first)
  const musicBody = xmlDoc.querySelector('music body');
  const xmlScores = musicBody ? Array.from(musicBody.querySelectorAll('score')) : [];
  if (xmlScores.length === 0) {
    console.info('getPageFromDom(): no score element');
    return;
  }

  // determine one of three counting modes
  /** @type CountingMode */
  let countingMode = 'firstPage'; // quick first page for xx measures
  if (Array.isArray(breaks))
    countingMode = 'encodedBreaks'; // encoded sb and pb as provided
  else if (typeof breaks === 'object' && Object.keys(breaks).length > 0) countingMode = 'computedBreaks'; // breaks object
  // else if (breaks === 'measure') // breaks for each encoded measure
  //   countingMode = 'measure';
  if (countingMode === 'firstPage') pageNo = 1; // for quick first page, always 1

  // construct new MEI node for Verovio engraving
  let spdNode = minimalMEIFile(xmlDoc);

  // check for mei version or use default (never inherit it from a previously
  // processed document, so a file without @meiversion is treated as default)
  const meiVersion = xmlDoc.querySelector('mei')?.getAttribute('meiversion') || defaultMeiVersion;
  spdNode.setAttribute('meiversion', meiVersion);

  spdNode.appendChild(meiHeader.cloneNode(true));
  const musicEl = minimalMEIMusicBody(xmlDoc);
  spdNode.appendChild(musicEl);
  const bodyEl = /** @type {Element} */ (musicEl.querySelector('body'));

  // page/measure counters, threaded across all scores below so counting
  // continues correctly across an mdiv boundary instead of restarting at
  // page 1 for every mdiv
  /** @type {SectionState} */
  let state = {
    p: 1,
    mNo: 1,
    done: false,
    matched: false,
    countNow: false,
    measureSinceBreak: false,
    earlierContent: false,
    courtesy: [],
    lookaheadDone: false,
  };
  /** @type {Element[]} */
  let courtesy = []; // `<section>`s with the `<scoreDef>`s following the end of pageNo, see readSection()
  let anyDest = false; // has any mdiv contributed pageNo's content yet?
  /** @type {Element | null} */
  let lastScoreDef = null; // `<scoreDef>` of the last mdiv contributing to pageNo
  /** @type {Element | null} */
  let lastBaseSection = null; // `<section>` of the last mdiv contributing to pageNo

  for (let s = 0; s < xmlScores.length && state.p <= pageNo && !state.done; s++) {
    const xmlScore = xmlScores[s];
    const scoreDefSrc = xmlScore.querySelector('music scoreDef');
    // A `<score>` without `<scoreDef>` is invalid MEI, but skipping it would
    // drop its measures from the page count and shift every later page, so
    // fall back to an empty `<scoreDef>` and keep counting.
    const scoreDef = /** @type {Element} */ (
      scoreDefSrc ? scoreDefSrc.cloneNode(true) : xmlDoc.createElementNS(meiNameSpace, 'scoreDef')
    );

    let baseSection = xmlDoc.createElementNS(meiNameSpace, 'section');
    baseSection.setAttributeNS(xmlNameSpace, 'xml:id', anyDest ? 'baseSection-' + s : 'baseSection');
    let mdiv = xmlDoc.createElementNS(meiNameSpace, 'mdiv');
    let spdScore = xmlDoc.createElementNS(meiNameSpace, 'score');
    mdiv.appendChild(spdScore);

    spdScore.appendChild(scoreDef); // is updated within readSection()
    spdScore.appendChild(baseSection);

    if (!anyDest && pageNo > 1 && includeDummyMeasures) {
      // Add the "before" context anchor, sourced from this mdiv's own
      // scoreDef/staff count. It has to be in place BEFORE readSection() digs,
      // because the ending-with-break branch in there relocates `#startingPb`
      // into the `<ending>`. If this mdiv turns out not to contain pageNo, the
      // anchor is discarded together with the mdiv.
      let measure = dummyMeasure(xmlDoc, countStaves(scoreDef));
      measure.setAttributeNS(xmlNameSpace, 'xml:id', 'startingMeasure');
      baseSection.appendChild(measure);
      let startingPb = xmlDoc.createElementNS(meiNameSpace, 'pb');
      startingPb.setAttributeNS(xmlNameSpace, 'xml:id', 'startingPb');
      baseSection.appendChild(startingPb);
    }

    state.matched = false; // reset: does THIS mdiv actually contain pageNo?
    state.earlierContent = false; // reset: does THIS mdiv have content before pageNo?
    state.courtesy = []; // courtesy scoreDefs come from the mdiv pageNo ends in only
    state.lookaheadDone = false;
    let digger = readSection(pageNo, spdScore, breaks, countingMode, state, meiVersion);
    xmlScore.childNodes.forEach((item) => {
      if (item.nodeName === 'section') {
        // diggs into section hierachy
        let returnSection = digger(/** @type {Element}*/ (item));
        baseSection.appendChild(returnSection);
      }
    });

    if (!state.matched) continue; // pageNo isn't in this mdiv; try the next one

    if (!anyDest && !state.earlierContent) {
      // No measure of this mdiv sits on an earlier page, so the requested page
      // opens the mdiv, and is therefore this mdiv's first system. Verovio
      // draws `<staffGrp><label>` (and anything else it only puts on a score's
      // first system) on the first system it engraves -- which would be the
      // leading dummy measure, i.e. the context page nobody ever sees. Move
      // that dummy into an `<mdiv>` of its own so the requested page really is
      // this mdiv's first system.
      // The context page has to stay a page of its own: it also keeps whatever
      // Verovio only puts on the first page of a document -- `<pgHead>`, or the
      // title block it generates from `<meiHead>` -- off the requested page.
      // The dummy stands in for the *previous* page, which belongs to the
      // previous mdiv, so it takes that mdiv's staff count.
      const prevScoreDef = s > 0 ? xmlScores[s - 1].querySelector('music scoreDef') : null;
      const dummyMdiv = moveDummyMeasureToOwnMdiv(xmlDoc, baseSection, prevScoreDef || scoreDef);
      if (dummyMdiv) bodyEl.appendChild(dummyMdiv);
    }

    bodyEl.appendChild(mdiv);
    anyDest = true;
    lastScoreDef = scoreDef;
    lastBaseSection = baseSection;
    courtesy = state.courtesy;
    // no `break` here: pageNo may continue into a further mdiv (rendered as
    // one page containing content from more than one mdiv, matching how
    // normal/full mode's Verovio-driven layout can mix mdivs onto one page).
    // A later mdiv that doesn't match (the common case) is a harmless no-op
    // and the loop then stops on its own via the `for` condition below.
  }

  if (!anyDest || !lastScoreDef || !lastBaseSection) {
    console.info('getPageFromDom(): page ' + pageNo + ' not found in any mdiv');
    return;
  }

  // add third measure (even if last page), sourced from the LAST contributing
  // mdiv's own scoreDef/staff count
  if (includeDummyMeasures) {
    let m = dummyMeasure(xmlDoc, countStaves(lastScoreDef));
    m.setAttributeNS(xmlNameSpace, 'xml:id', 'endingMeasure');
    lastBaseSection.appendChild(xmlDoc.createElementNS(meiNameSpace, 'pb'));
    // scoreDefs encoded right after the end of pageNo (each in a copy of its
    // section): placed after its <pb>, as in the encoding, so that Verovio
    // draws their courtesy signatures at the end of pageNo
    courtesy.forEach((section) => lastBaseSection?.appendChild(section));
    lastBaseSection.appendChild(m);
  }

  // matchTimespanningElements(xmlScore, spdNode, pageNo);

  if (includeDummyMeasures && Object.keys(pageSpanners.start).length > 0) {
    addPageSpanningElements(xmlDoc, spdNode, pageSpanners, pageNo, breaks);
  }

  // insert sb elements for each element except last -- searched across the
  // whole destination document, since breaks[pageNo]'s ids may belong to
  // either mdiv when the page spans an mdiv boundary
  if (countingMode === 'computedBreaks' && Object.keys(breaks).length > 0 && !Array.isArray(breaks)) {
    breaks[pageNo].forEach((id, i) => {
      if (i < breaks[pageNo].length - 1) {
        // last element is a <pb>
        let m = spdNode.querySelector('[*|id="' + id + '"]');
        // console.info("spd(p:" + pageNo + " i:" + i + "): id=" + id + ", m:", m);
        if (m) {
          let sb = xmlDoc.createElementNS(meiNameSpace, 'sb');
          let next = m.nextSibling;
          let parent = /** @type {Element} */ (m.parentNode);
          // console.info('...found. next:', next);
          // console.info('...found. parent:', parent);
          if (next && next.nodeType != Node.TEXT_NODE) parent.insertBefore(sb, next);
          else parent.appendChild(sb);
        }
      }
    });
  }

  const serializer = new XMLSerializer();
  let mei = xmlDefs(meiVersion) + serializer.serializeToString(spdNode);
  // console.info('Speed() MEI: ', mei);
  return mei;
} // getPageFromDom()

/**
 * @param {number} pageNo  Page number, starting at 1
 * @param {Element} spdScore  The returned closure updates the `<staffDef>`s
 * in this speed score according to what's found in the section element the
 * closure takes as argument.
 * @param {Breaks} breaks
 * @param {string} countingMode
 * @param {SectionState} state
 * Page/measure counters shared across every `readSection()` call made for
 * one `getPageFromDom()` invocation (one call per candidate `<mdiv>`), so
 * counting continues correctly across an mdiv boundary instead of
 * restarting at page 1 for every mdiv. `state.done` signals the quick
 * "first page" heuristic has collected enough measures and no further
 * mdiv needs to be visited. `state.matched` is set whenever real content
 * for `pageNo` is actually appended -- the caller resets it to `false`
 * before each call to detect whether THIS mdiv is the one that contains
 * `pageNo` (a `<score>` with no matching content simply has no `<section>`
 * children reduced to `pageNo`, so `matched` stays `false`). `state.countNow`
 * (once the first measure of the whole document is seen) must stay shared
 * too, so a later mdiv's own leading break is recognised as a real break
 * rather than re-triggering the "ignore breaks before the first measure"
 * rule for every mdiv. `state.earlierContent` records whether the mdiv
 * currently being walked has measures on a page before `pageNo`; the caller
 * resets it per mdiv and uses it to tell a page that *opens* an mdiv from one
 * that continues it. `state.courtesy` collects copies of the `<scoreDef>`s
 * that follow the end of `pageNo` before the next measure (Verovio draws
 * courtesy signatures for them at the end of the page), each inside a copy of
 * the `<section>` it is encoded in (without `@xml:id`);
 * `state.lookaheadDone` is set once that next measure has been reached. The
 * caller resets both per mdiv.
 * @param {string} meiVersion  MEI version of the source document, deciding
 * whether key signatures are written as `@keysig` (MEI >= 5) or `@key.sig`.
 * @returns {function(Element): Element}  Recursive closure that takes an
 * original `<section>` as argument and creates a new `<section>` with the
 * content of the original `<section>` reduced to the page with page number
 * `pageNo`.
 */
function readSection(pageNo, spdScore, breaks, countingMode, state, meiVersion = defaultMeiVersion) {
  let mxMeasures = 50; // for a quick first page
  let breaksSelector = '';
  // For 'encodedBreaks', `breaks` will always be an Array of 'sb' and 'pb'
  if (countingMode === 'encodedBreaks') breaksSelector = /** @type {string[]} */ (breaks).join(', ');
  const staffDefs = spdScore.querySelectorAll('staffDef');

  // `<scoreDef>`s met on page `pageNo - 1` after its last measure. They are
  // not folded into the excerpt's starting `<scoreDef>` (where Verovio would
  // treat them as the initial state and draw no change at all), but placed at
  // the start of `pageNo`, where Verovio draws the change as normal mode does.
  // Folded after all if another measure follows on `pageNo - 1`.
  /** @type {Element[]} */
  let tail = [];
  /** @type {WeakMap<Element, Element>} courtesy wrapper section -> section it copies */
  const courtesySource = new WeakMap();
  const fold = (/** @type {Element} */ node) =>
    foldIntoScoreDef(node, spdScore, staffDefs, breaksSelector, pageNo - state.p, meiVersion);

  // recursive closure to dig through hierarchically stacked sections and append
  // only those elements within the requested pageNo
  return function digDeeper(section) {
    const document = section.ownerDocument;
    // create a copy of section and copy attributes
    let newSection = document.createElementNS(meiNameSpace, 'section');
    section.getAttributeNames().forEach((attrName) => {
      newSection.setAttribute(attrName, section.getAttribute(attrName) || '');
    });

    let children = section.childNodes;
    let lgt = children.length;
    for (let i = 0; i < lgt; i++) {
      if (countingMode === 'firstPage' && state.mNo >= mxMeasures) {
        // exit with first page
        state.done = true;
        return newSection;
      }
      if (state.p > pageNo && (countingMode === 'firstPage' || state.lookaheadDone)) break;
      if (children[i].nodeType !== Node.ELEMENT_NODE) continue;
      let currentNode = /** @type {Element} */ (children[i]);
      let currentNodeName = currentNode.nodeName;

      if (state.p > pageNo) {
        // pageNo is complete: look ahead to the next measure for <scoreDef>s,
        // whose courtesy signatures Verovio draws at the end of pageNo
        if (currentNodeName === 'section') {
          digDeeper(currentNode);
          if (state.lookaheadDone) break;
        } else if (currentNodeName === 'scoreDef') {
          // keep it inside a copy of its section: Verovio draws no courtesy
          // signatures before a section@restart, for instance
          let wrapper = state.courtesy[state.courtesy.length - 1];
          if (!wrapper || courtesySource.get(wrapper) !== section) {
            wrapper = document.createElementNS(meiNameSpace, 'section');
            section.getAttributeNames().forEach((a) => {
              if (a !== 'xml:id') wrapper.setAttribute(a, section.getAttribute(a) || '');
            });
            state.courtesy.push(wrapper);
            courtesySource.set(wrapper, section);
          }
          wrapper.appendChild(currentNode.cloneNode(true));
        } else if (currentNodeName === 'measure' || currentNode.querySelector('measure')) {
          state.lookaheadDone = true;
          break;
        }
        continue;
      }

      // remember whether this mdiv already had measures on an earlier page
      // (checked only until the first one is found, so at most a handful of
      // lookups per mdiv)
      if (state.p < pageNo && !state.earlierContent) {
        if (currentNodeName === 'measure' || currentNode.querySelector('measure')) state.earlierContent = true;
      }
      // copy expansion elements to new section
      if (currentNodeName === 'expansion') {
        newSection.appendChild(currentNode.cloneNode(true));
        continue;
      }
      if (currentNodeName === 'section') {
        let returnSection = digDeeper(currentNode);
        newSection.appendChild(returnSection);
        continue;
      }
      if (currentNodeName === 'measure') {
        // shared across mdivs: once the first measure of the whole document
        // has been seen, a later mdiv's own leading break is a real break,
        // not a "before the first measure" break to be ignored
        state.countNow = true;
        state.measureSinceBreak = true;
      } else if (
        !state.measureSinceBreak &&
        currentNodeName !== 'sb' &&
        currentNodeName !== 'pb' &&
        currentNode.querySelector('measure')
      ) {
        // measures inside an <ending>, <app>, ... are content as well (looked up
        // only between a counted break and the next measure, a handful of nodes)
        state.measureSinceBreak = true;
      }

      if (countingMode === 'firstPage') {
        if (currentNodeName === 'measure') state.mNo++;
        else currentNode.querySelectorAll('measure').forEach(() => state.mNo++);
      } else if (countingMode === 'encodedBreaks') {
        let sb = null;
        // For 'encodedBreaks', `breaks` is an Array
        if (
          state.countNow &&
          currentNodeName !== 'ending' &&
          /** @type {string[]} */ (
            // @ts-ignore
            breaks.includes(currentNodeName) ||
              (sb = /** @type {Element} */ (currentNode).querySelector(breaksSelector))
          )
        ) {
          // A run of breaks with no measure between them (<sb/><pb/> opening a
          // section, say) ends one page, not one page each -- as Verovio also
          // engraves it. Same rule in viewer.speedFilter(), getPageWithElement()
          // and speed-worker.getPageNumberForElements(); the counts have to agree.
          if (state.measureSinceBreak && dutils.countAsBreak(sb ? sb : currentNode)) {
            state.p++;
            state.measureSinceBreak = false;
            if (state.p === pageNo) {
              // scoreDefs between the last measure of the previous page and
              // this break open pageNo
              tail.forEach((sd) => newSection.appendChild(sd.cloneNode(true)));
              tail = [];
            }
          }
          continue;
        }
        // ignore system/page breaks in other countingModes
      } else if (currentNodeName === 'sb' || currentNodeName === 'pb') continue;

      // fold clef, key, meter and tempo changes of earlier pages into the
      // excerpt's starting <scoreDef>
      if (state.p < pageNo) {
        if (state.p === pageNo - 1 && currentNodeName === 'scoreDef') {
          tail.push(currentNode);
        } else {
          if (tail.length > 0 && (currentNodeName === 'measure' || currentNode.querySelector('measure'))) {
            tail.forEach((sd) => fold(sd));
            tail = [];
          }
          fold(currentNode);
        }
      }

      // special treatment for endings that contain breaks
      if (currentNodeName === 'ending' && breaksSelector) {
        // breaks inside the ending that count (as in viewer.js)
        const isCounted = Array.from(currentNode.querySelectorAll(breaksSelector)).map((b) =>
          dutils.countAsBreak(b)
        );
        const nBreaks = isCounted.filter(Boolean).length;
        if (nBreaks > 0) {
          // the ending spans pages state.p ... state.p + nBreaks
          const idx = pageNo - state.p; // part of the ending that is on pageNo
          if (idx >= 0 && idx <= nBreaks) {
            const endingNode = /** @type {Element} */ (currentNode.cloneNode(true));
            const copies = Array.from(endingNode.querySelectorAll(breaksSelector)).filter((b, j) => isCounted[j]);
            if (idx > 0) {
              // drop breaks before the one opening pageNo, so that everything
              // before it ends up on the context page in front
              copies.slice(0, idx - 1).forEach((b) => b.remove());
              // the break opening pageNo replaces the context page's <pb>
              // (an encoded <pb> does that job itself)
              const opening = copies[idx - 1];
              const startingPb = spdScore.querySelector('[*|id="startingPb"]');
              if (startingPb && opening.nodeName !== 'pb') {
                opening.replaceWith(startingPb);
              } else {
                startingPb?.remove();
              }
            }
            if (idx < nBreaks) {
              // the break closing pageNo has to be a page break
              copies[idx].replaceWith(document.createElementNS(meiNameSpace, 'pb'));
            }
            newSection.appendChild(endingNode);
            state.matched = true;
          }
          state.p += nBreaks;
          // an ending ends with a measure of its own, so the next break counts
          state.measureSinceBreak = true;
          continue;
        }
      }

      // append children
      if (state.p === pageNo) {
        let nodeCopy = /** @type {Element} */ (currentNode.cloneNode(true));
        if (countingMode === 'computedBreaks') {
          // remove breaks from DOM
          nodeCopy.querySelectorAll('pb, sb').forEach((b) => nodeCopy.removeChild(b));
        }
        newSection.appendChild(nodeCopy);
        state.matched = true;
      }

      // increment in countingMode computedBreaks
      if (countingMode === 'computedBreaks') {
        if (
          currentNodeName === 'measure' &&
          currentNode.getAttribute('xml:id') === breaks[state.p][breaks[state.p].length - 1]
        )
          state.p++;
        else {
          currentNode.querySelectorAll('measure').forEach((m) => {
            if (m.getAttribute('xml:id') === breaks[state.p][breaks[state.p].length - 1]) state.p++;
          });
        }
      }
    } // for loop across child nodes
    return newSection;
  }; // digDeeper()
} // readSection()

/**
 * Helper to `readSection()`: folds the clef, key signature, meter signature
 * and tempo changes that `node` (from a page before the requested one)
 * makes into the `<staffDef>`s (and tempo into the `<scoreDef>`) of the
 * excerpt Verovio renders, in document order.
 *
 * Changes are copied as the elements they are encoded as (`<keySig>`,
 * `<meterSig>`, `<clef>`), or as the attributes they are encoded as, so that
 * nothing about them is lost (a `<keySig>` without `@sig`, `@sym`, `@visible`
 * and so on). A `<scoreDef>`'s own key or meter goes to every staff, a
 * `<staffDef>`'s and an in-layer element's only to its own.
 *
 * @param {Element} node
 * @param {Element} spdScore
 * @param {NodeListOf<Element>} staffDefs  The excerpt's `<staffDef>`s
 * @param {string} breaksSelector  Breaks counted ('' if none are encoded)
 * @param {number} breaksToPass  Stop at the `breaksToPass`th break inside
 * `node` (only an `<ending>` can contain one here): it opens the requested page
 * @param {string} meiVersion
 */
function foldIntoScoreDef(node, spdScore, staffDefs, breaksSelector, breaksToPass, meiVersion) {
  const selector =
    'scoreDef, staffDef, clef, keySig, meterSig, meterSigGrp, tempo' + (breaksSelector ? ', ' + breaksSelector : '');
  const breakNames = breaksSelector ? breaksSelector.split(/\s*,\s*/) : [];
  const elements = Array.from(node.querySelectorAll(selector));
  if (node.matches(selector)) elements.unshift(node);
  const staffDefsFor = (/** @type {string} */ n) => Array.from(staffDefs).filter((sd) => sd.getAttribute('n') === n);
  let passed = 0;
  for (const el of elements) {
    const name = el.nodeName;
    if (breakNames.includes(name)) {
      if (dutils.countAsBreak(el) && ++passed >= breaksToPass) break;
      continue;
    }
    switch (name) {
      case 'scoreDef': {
        const keySig = ownKeySig(el);
        if (keySig !== null) staffDefs.forEach((sd) => setKeySig(sd, keySig, meiVersion));
        if (hasOwnMeter(el)) staffDefs.forEach((sd) => setMeterSig(sd, el));
        copyTempoInfo(el, spdScore);
        break;
      }
      case 'staffDef': {
        const targets = staffDefsFor(el.getAttribute('n') || '');
        const keySig = ownKeySig(el);
        if (keySig !== null) targets.forEach((sd) => setKeySig(sd, keySig, meiVersion));
        if (hasOwnMeter(el)) targets.forEach((sd) => setMeterSig(sd, el));
        if (el.getAttributeNames().some((a) => a.startsWith('clef.'))) targets.forEach((sd) => setClef(sd, el));
        break; // its <clef> child, if any, comes next in document order
      }
      case 'clef': {
        if (el.hasAttribute('sameas')) break;
        staffDefsFor(getStaffNumber(el)).forEach((sd) => setClef(sd, el));
        break;
      }
      case 'keySig':
      case 'meterSig':
      case 'meterSigGrp': {
        // those inside a scoreDef/staffDef are dealt with by their parent,
        // a meterSig inside a meterSigGrp with its group
        if (el.parentElement?.closest('scoreDef, staffDef, meterSigGrp')) break;
        const targets = staffDefsFor(getStaffNumber(el));
        if (name === 'keySig') targets.forEach((sd) => setKeySig(sd, el, meiVersion));
        else targets.forEach((sd) => setMeterSig(sd, el));
        break;
      }
      case 'tempo':
        copyTempoInfo(el, spdScore);
        break;
    }
  }
} // foldIntoScoreDef()

// /**
//  * List all notes/chords to check whether they are pointed to from outside the
//  * requested pageNo to be run at each edit/page turn (becomes slow with big
//  * files). NOT USED; KEPT FOR DOCUMENTATION.
//  *
//  * TODO: @th-we: This is currently not used and probably O(n²). If it should be used
//  * again, create objects mapping all `@startid` and `@endid` values once and
//  * pass it as argument to this function. This should probably give us something
//  * like O(n log n) complexity.
//  *
//  * @param {Element} xmlScore
//  * @param {Document} spdScore
//  * @param {number} pageNo
//  */
// function matchTimespanningElements(xmlScore, spdScore, pageNo) {
//   // let t1 = performance.now();
//   let startingSelector = '';
//   let endingSelector = '';

//   var listOfTargets = spdScore.querySelectorAll('note, chord');
//   for (let target of listOfTargets) {
//     let id = '#' + target.getAttribute('xml:id');
//     //
//     endingSelector += "[startid][endid='" + id + "'],";
//     startingSelector += "[startid='" + id + "'][endid],";
//   }
//   // let t2 = performance.now();
//   // console.log(listOfTargets.length + ' notes: selector constructed ' + (t2 - t1) + ' ms.');

//   let endingElements = Array.from(xmlScore.querySelectorAll(endingSelector.slice(0, -1)));
//   let startingElements = Array.from(xmlScore.querySelectorAll(startingSelector.slice(0, -1)));

//   // let t3 = performance.now();
//   // console.log('querySelectorAll ' + (t3 - t2) + ' ms.');
//   //
//   // check whether this id ends in startingElements
//   for (let target of listOfTargets) {
//     let id = '#' + target.getAttribute('xml:id');
//     for (let j = 0; j < startingElements.length; j++) {
//       let el = startingElements[j];
//       // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
//       if (el && el.getAttribute('endid') === id) {
//         // console.info('startingElement removed', startingElements[j]);
//         endingElements.splice(endingElements.indexOf(el), 1);
//         startingElements.splice(j--, 1);
//       }
//     }
//     for (let j = 0; j < endingElements.length; j++) {
//       let el = endingElements[j];
//       // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
//       if (el && el.getAttribute('startid') === id) {
//         // console.info('endingElement removed', endingElements[j]);
//         startingElements.splice(startingElements.indexOf(el), 1);
//         endingElements.splice(j--, 1);
//       }
//     }
//   }

//   // let t4 = performance.now();
//   // console.log('timespan matching took ' + (t4 - t3) + ' ms.');

//   // 1) go through endingElements and add to first measure
//   if (endingElements.length > 0 && pageNo > 1) {
//     const m = /** @type {Element} */ (spdScore.querySelector('[*|id="startingMeasure"]'));
//     let uuids = getIdsForDummyMeasure(m);
//     for (let endingElement of endingElements) {
//       if (endingElement) {
//         let startid = utils.rmHash(endingElement.getAttribute('startid'));
//         let note = xmlScore.querySelector('[*|id="' + startid + '"]');
//         if (!note) continue;
//         const staffNo = parseInt(getStaffNumber(note));
//         if (isNaN(staffNo)) continue;
//         let el = /** @type {Element} */ (endingElement.cloneNode(true));
//         el.setAttribute('startid', '#' + uuids[staffNo - 1]);
//         m?.appendChild(el);
//       }
//     }
//   } // 1) if

//   // 2) go through startingElements and append to a third-page measure
//   if (startingElements.length > 0) {
//     // console.info('work through startingElements.');
//     const m = /** @type {Element} */ (spdScore.querySelector('[*|id="endingMeasure"]'));
//     let uuids = getIdsForDummyMeasure(m);
//     for (let startingElement of startingElements) {
//       if (startingElement) {
//         let endid = utils.rmHash(startingElement.getAttribute('endid'));
//         // console.info('searching for endid: ', endid);
//         if (endid) {
//           let note = xmlScore.querySelector('[*|id="' + endid + '"]');
//           if (!note) continue;
//           const staffNo = parseInt(getStaffNumber(note));
//           if (isNaN(staffNo)) continue;
//           let tel = spdScore.querySelector('[*|id="' + startingElement.getAttribute('xml:id') + '"]');
//           if (tel) tel.setAttribute('endid', '#' + uuids[staffNo - 1]);
//         }
//       }
//     }
//   } // 2) if

//   // console.log('adding slurs took ' + (performance.now() - t4) + ' ms.');
// } // matchTimespanningElements()

// /**
//  * List all timespanning elements with `@startid`/`@endid` attributes on
//  * different pages (similar to speed-worker::listPageSpanningElements(),
//  * but for a common DOM object). NOT USED; KEPT FOR DOCUMENTATION.
//  * @param {Document} xmlScore
//  * @param {Break[]} breaks
//  * @param {BreaksOption} breaksOption
//  * @returns {PageSpanners}
//  */
// export function listPageSpanningElements(xmlScore, breaks, breaksOption) {
//   let t1 = performance.now();
//   let els = xmlScore.querySelectorAll(att.timeSpanningElements.join(','));
//   let pageSpanners = {
//     start: {},
//     end: {},
//   };
//   // for breaks encoded / array; TODO auto/Object
//   let sel = '';
//   switch (breaksOption) {
//     case 'none':
//       return {
//         start: {},
//         end: {},
//       };
//     case 'auto':
//       if (Object.keys(breaks).length > 0) {
//         for (let pg in breaks) {
//           let br = breaks[pg]; // array of breaks
//           sel += '[*|id="' + br[br.length - 1] + '"],';
//         }
//       } else
//         return {
//           start: {},
//           end: {},
//         };
//       break;
//     case 'line':
//       sel = 'pb,sb,';
//       break;
//     case 'encoded':
//       sel = 'pb,';
//   }
//   // object with time-spanning-element-ids key: [@startid,@endid] array
//   let tsTable = {};
//   for (let el of els) {
//     let id = el.getAttribute('xml:id');
//     let startid = utils.rmHash(el.getAttribute('startid'));
//     if (startid) sel += '[*|id="' + startid + '"],';
//     let endid = utils.rmHash(el.getAttribute('endid'));
//     if (endid) sel += '[*|id="' + endid + '"],';
//     if (id && startid && endid) tsTable[id] = [startid, endid];
//   }
//   let t2 = performance.now();
//   console.log('listPageSpanningElements selector preps: ' + (t2 - t1) + ' ms.');

//   let elList = xmlScore.querySelectorAll(sel.slice(0, -1));

//   t1 = t2;
//   t2 = performance.now();
//   console.log('listPageSpanningElements querySelectorAll: ' + (t2 - t1) + ' ms.');

//   let noteTable = {};
//   let count = false;
//   let p = 1;
//   if (breaksOption === 'line' || breaksOption === 'encoded') {
//     for (let e of elList) {
//       if (e.nodeName === 'measure') count = true;
//       if (count && breaks.includes(/** @type {Break} */ (e.nodeName)) && dutils.countAsBreak(e)) p++;
//       else noteTable[e.getAttribute('xml:id') || ''] = p;
//     }
//   } else if ((breaksOption = 'auto')) {
//     /** @type {Element | undefined} */
//     let m;
//     for (let e of elList) {
//       if (e.nodeName === 'measure') {
//         p++;
//         m = e;
//       } else {
//         noteTable[e.getAttribute('xml:id') || ''] = m && e.closest('measure') === m ? p - 1 : p;
//       }
//     }
//   }

//   t1 = t2;
//   t2 = performance.now();
//   console.log('listPageSpanningElements noteTable: ' + (t2 - t1) + ' ms.');

//   let p1 = 0;
//   let p2 = 0;
//   for (let spannerIds of Object.keys(tsTable)) {
//     p1 = noteTable[tsTable[spannerIds][0]];
//     p2 = noteTable[tsTable[spannerIds][1]];
//     if (p1 > 0 && p2 > 0 && p1 != p2) {
//       if (pageSpanners.start[p1]) pageSpanners.start[p1].push(spannerIds);
//       else pageSpanners.start[p1] = [spannerIds];
//       if (pageSpanners.end[p2]) pageSpanners.end[p2].push(spannerIds);
//       else pageSpanners.end[p2] = [spannerIds];
//     }
//   }

//   t1 = t2;
//   t2 = performance.now();
//   console.log('listPageSpanningElements pageSpanners: ' + (t2 - t1) + ' ms.');

//   return pageSpanners;
// } // listPageSpanningElements()

/**
 * Finds out which staff number the element belongs to.
 * @param {Element} element
 * @returns {string} The found `@n` value of the closest `<staff>` or
 * `<staffDef>`, or the empty string if no such element or attribute was found.
 */
export function getStaffNumber(element) {
  return element.closest('staff,staffDef')?.getAttribute('n') || '';
} // getStaffNumber()

/**
 * Searches for meter information in scoreDef/staffDef@meter.count, unit, sym
 * or in separate meterSig child elements,
 * @param {Element} def
 * @param {string} staffNumber
 * @returns {{count: string | null, unit: string | null}}
 */
export function getMeter(def, staffNumber = '') {
  if (!def) {
    return { count: null, unit: null };
  }
  let meter = {
    count: def.getAttribute('meter.count'),
    unit: def.getAttribute('meter.unit'),
  };
  let sym = def.getAttribute('meter.sym');
  if (sym) {
    if (sym === 'common') {
      meter.count = '4';
      meter.unit = '4';
    } else if (sym === 'cut') {
      meter.count = '2';
      meter.unit = '2';
    }
  }
  // try to find staffDef by staffNumber
  if (staffNumber) {
    const staffDef = def.querySelector('staffDef[n="' + staffNumber + '"]');
    if (staffDef) {
      let m = getMeter(staffDef);
      if (m.count && m.unit) return m;
    }
  }
  // try to find a meterSig somewhere inside scoreDef
  if (!meter.count || !meter.unit) {
    const meterSig = def.querySelector('meterSig');
    if (!meterSig) return meter;
    meter = {
      count: meterSig.getAttribute('count'),
      unit: meterSig.getAttribute('unit'),
    };
    let sym = meterSig.getAttribute('sym');
    if (sym) {
      if (sym === 'common') {
        meter.count = '4';
        meter.unit = '4';
      } else if (sym === 'cut') {
        meter.count = '2';
        meter.unit = '2';
      }
    }
  }
  return meter;
} // getMeter()

/**
 * Finds and returns the scoreDef element before the element
 * that contains meter information, null otherwise
 * @param {Document} xmlDoc
 * @param {Element} element
 * @returns {Element | null}
 *
 * Deprecated; use getMeterForElement() instead (WG., March 2025)
 */
// export function getMeterScoreDefForElement(xmlDoc, element) {
//   // find meter.count/unit
//   let elId = element.getAttribute('xml:id');
//   let scoreDef = null;
//   if (elId) {
//     let scoreDefList = xmlDoc.querySelectorAll('scoreDef,[*|id="' + elId + '"]');
//     let search = false;
//     // go backward in scoreDefList
//     for (let i = scoreDefList.length - 1; i >= 0; i--) {
//       if (search) {
//         let found =
//           scoreDefList.item(i).querySelector('[meter\\.unit],[meter\\.count],meterSig') ||
//           scoreDefList.item(i).hasAttribute('meter.unit') ||
//           scoreDefList.item(i).hasAttribute('meter.count') ||
//           scoreDefList.item(i).hasAttribute('meter.sym');
//         if (found) {
//           scoreDef = scoreDefList.item(i);
//           break;
//         }
//       }
//       if (scoreDefList.item(i).nodeName === element.nodeName) {
//         search = true;
//       }
//     }
//   }
//   return scoreDef;
// } // getScoreDefForElement()

/**
 * getMeterForElement() returns the meter information for the element
 * @param {Document} xmlDoc
 * @param {Element} element
 * @returns {{count: string | null, unit: string | null}}
 */
export function getMeterForElement(xmlDoc, element) {
  let elId = element.getAttribute('xml:id');
  let staffNumber = getStaffNumber(element);
  if (elId && staffNumber) {
    let meterDefList = xmlDoc.querySelectorAll('[meter\\.unit],[meter\\.count],meterSig,[*|id="' + elId + '"]');
    let search = false;
    // search backwards in meterDefList, starting true search from element
    for (let i = meterDefList.length - 1; i >= 0; i--) {
      if (search) {
        if (
          meterDefList.item(i).nodeName === 'scoreDef' ||
          (meterDefList.item(i).nodeName === 'staffDef' && staffNumber === meterDefList.item(i).getAttribute('n'))
        ) {
          return getMeter(meterDefList.item(i), getStaffNumber(element));
        }
        if (meterDefList.item(i).nodeName === 'meterSig') {
          let parent = meterDefList.item(i).closest('scoreDef,staffDef,layer');
          if (parent) {
            return getMeter(parent, getStaffNumber(element));
          }
          let meterSigGroup = meterDefList.item(i).closest('meterSigGrp');
          if (meterSigGroup) {
            // TODO: support meterSigGrp func="interchanging,mixed,additive"
            console.log('getMeterForElement() meterSigGrp currently not supported: ', meterSigGroup);
          }
        }
      }
      if (meterDefList.item(i).nodeName === element.nodeName) {
        search = true;
      }
    }
    console.log('getMeterForElement(): no meter information found in entire document');
  } else {
    console.log('getMeterForElement(): no xml:id or staff number found');
  }
  return { count: null, unit: null };
} // getMeterForElement()

/**
 * Returns a @tstamp (beat position) of the element within the current measure
 * @param {Document} xmlDoc
 * @param {Element} element -- if not a duration logical element, -1 will be returned
 * @returns {number} tstamp (-1 if nothing found)
 *
 * TODO: only used from editor.js; move to new DocumentController.js
 */
export function getTstampForElement(xmlDoc, element) {
  let tstamp = -1;
  if (element && att.attDurationLogical.includes(element.nodeName)) {
    let chord = element.closest('chord'); // take chord as element, if exists
    if (chord) element = chord;
    let meter = getMeterForElement(xmlDoc, element);
    if (meter && meter.unit) {
      // iterate over notes before element in current layer
      let layer = element.closest('layer');
      if (layer) {
        tstamp = 1;
        let chordList = []; // list of chords that have been counted
        let durList = Array.from(layer.querySelectorAll(att.attDurationLogical.join(',')));
        for (let e of durList) {
          // exclude notes within a chord
          let parentChord = e.closest('chord');
          if (e.nodeName === 'note' && parentChord && chordList.includes(parentChord)) {
            continue;
          }
          if (parentChord) chordList.push(parentChord);
          // stop adding beats when requested element is reached
          if (e === element) {
            break;
          }
          let duration = getDurationOfElement(e, parseFloat(meter.unit));
          if (duration) {
            tstamp += duration;
          }
        }
      }
    }
  }
  return tstamp;
} // getTstampForElement()

/**
 * Returns the duration of a note/chord (in beats relative to the meter unit),
 * computed from @dur and @dots and @meterUnit
 *
 * For example:
 * dur="4" dots="1" in a x/4 meter returns 1.5
 * dur="8" dots="2" in a x/8 meter returns 1.75
 * dur="4" dots="2" in a x/2 meter returns 0.825
 *
 * @param {Element} element
 * @returns {number} duration in beats, or NaN if problems
 */
export function getDurationOfElement(element, meterUnit = 4.0) {
  let beatDuration = NaN;
  if (element && meterUnit) {
    if (element.hasAttribute('grace') || element.closest('graceGrp')) {
      let graceValue = element.getAttribute('grace') || element.closest('graceGrp')?.getAttribute('grace');
      if (graceValue && ['acc', 'unacc', 'unknown'].includes(graceValue)) {
        return 0;
      }
    }
    const dur = element.getAttribute('dur');
    if (dur) beatDuration = meterUnit / parseFloat(dur);
    const dots = element.getAttribute('dots');
    if (dots) {
      let dotsDuration = 0;
      for (let d = 1; d <= parseInt(dots); d++) {
        dotsDuration += beatDuration / Math.pow(2, d);
      }
      beatDuration += dotsDuration;
    }
    // look for (nested) tuplets
    let tuplet = element.closest('tuplet');
    while (tuplet) {
      const num = parseFloat(tuplet.getAttribute('num') || '-1');
      const numBase = parseFloat(tuplet.getAttribute('numbase') || '-1');
      if (num > 0 && numBase > 0) {
        beatDuration = (beatDuration * numBase) / num;
      }
      if (tuplet.parentElement) {
        tuplet = tuplet.parentElement.closest('tuplet');
      } else {
        break;
      }
    }
  }
  return beatDuration;
} // getDurationOfElement()

/**
 * Returns the number of measures between two elements.
 * It is zero, when in the same measure, one when in the next, etc.
 * @param {Document} xmlDoc
 * @param {Element} el1
 * @param {Element} el2
 * @returns {number}
 */
export function getMeasureDistanceBetweenElements(xmlDoc, el1, el2) {
  let measureDistance = 0;
  if (el1 && el2) {
    const m1 = el1.closest('measure');
    const m2 = el2.closest('measure');
    if (m1 !== m2) {
      let measureList = xmlDoc.querySelectorAll('measure');
      let count = false;
      measureList.forEach((m) => {
        if (count) measureDistance++;
        if (m === m1) count = true;
        if (m === m2) count = false;
      });
    }
  }
  return measureDistance;
} // getMeasureDistanceBetweenElements()

/**
 * Copies all tempo-related attributes (midi.bpm, mm, mm.unit, mm.dots)
 * from sourceNode into the scoreDef element of targetElement
 * @param {Element} sourceNode
 * @param {Element} targetNode
 */
function copyTempoInfo(sourceNode, targetNode) {
  ['midi.bpm', 'mm', 'mm.unit', 'mm.dots'].forEach((attrStr) => {
    const attrValue = sourceNode.getAttribute(attrStr);
    if (attrValue) {
      targetNode.querySelector('scoreDef')?.setAttribute(attrStr, attrValue);
    }
  });
} // copyTempoInfo()

/**
 * Add time-spanning elements spanning across pages to `spdNode`
 * @param {Document} xmlDoc
 * @param {Element} spdNode
 * @param {PageSpanners} pageSpanners
 * @param {number} pageNo
 * @param {*} breaks
 */
function addPageSpanningElements(xmlDoc, spdNode, pageSpanners, pageNo, breaks) {
  // 1) go through endingElements and add to starting measure (p. 1)
  const startingMeasure = /** @type {Element} */ (spdNode.querySelector('[*|id="startingMeasure"]'));
  let endingElementIds = pageSpanners.end[pageNo];
  if (endingElementIds && pageNo > 1) {
    for (let endingElementId of endingElementIds) {
      let endingElement = xmlDoc.querySelector('[*|id="' + endingElementId + '"]');
      if (endingElement) {
        let tstamp2 = computeTimeStamp2Attribute(endingElement, 'ending');
        let clonedElement = endingElement.cloneNode(true);
        // @ts-ignore
        if (tstamp2) clonedElement.setAttribute('tstamp2', tstamp2);
        startingMeasure.appendChild(clonedElement);
        if (endingElement.hasAttribute('startid')) {
          addPointingNote(endingElement, 'startid', startingMeasure);
        }
      }
    }
  } // 1) if

  // 2) go through startingElements and append to ending measure (p. 3)
  const endingMeasure = /** @type {Element} */ (spdNode.querySelector('[*|id="endingMeasure"]'));
  let startingElementIds = pageSpanners.start[pageNo];
  if (startingElementIds) {
    for (let startingElementId of startingElementIds) {
      // find element in spdNode, not in xmlDoc, because it gets modified without clone
      let startingElement = spdNode.querySelector('[*|id="' + startingElementId + '"]');
      if (startingElement) {
        let tstamp2 = computeTimeStamp2Attribute(startingElement, 'starting');
        if (tstamp2) startingElement.setAttribute('tstamp2', tstamp2);
        if (startingElement.hasAttribute('endid')) {
          addPointingNote(startingElement, 'endid', endingMeasure);
        }
      }
    }
  } // 2) if

  // 3) find those element that start before pageNo and end after it
  // Iterate through starting elements while < pageNo and
  // look for each element whether it ends after pageNo
  for (let p of Object.keys(pageSpanners.start)) {
    if (parseInt(p) < pageNo) {
      let elementIds = pageSpanners.start[p];
      for (let elId of elementIds) {
        let page = getPageNumberForIdInPageSpannersEndObject(elId);
        if (page > 0) {
          console.log('AAAAAcross-page PageSpanner ' + elId + ' from ' + p + ' to ' + page);
          let el = xmlDoc.querySelector('[*|id="' + elId + '"]');
          if (el) {
            let tstamp2 = computeTimeStamp2Attribute(el, 'ending');
            let clonedElement = el.cloneNode(true);
            // @ts-ignore
            if (tstamp2) clonedElement.setAttribute('tstamp2', tstamp2);
            if (el.hasAttribute('startid')) {
              addPointingNote(el, 'startid', startingMeasure);
            }
            if (el.hasAttribute('endid')) {
              addPointingNote(el, 'endid', endingMeasure);
            }
            startingMeasure.appendChild(clonedElement);
          }
        }
      }
    } else {
      break;
    }
  } // 3)

  /**
   * Add pointing note (@startid or @endid) to starting/endingMeasure
   * @param {Element} el
   * @param {string} searchAttr
   * @param {Element} refMeas
   * @returns
   */
  function addPointingNote(el, searchAttr = 'startid', refMeas) {
    let startid = utils.rmHash(el.getAttribute(searchAttr));
    let startNote = xmlDoc.querySelector('[*|id="' + startid + '"]');
    if (!startNote) return false;
    const staffNo = startNote.closest('staff')?.getAttribute('n') || '-1';
    if (!spdNode.querySelector('[*|id="' + startid + '"]')) {
      let staff = refMeas.querySelector('staff[n="' + staffNo + '"]');
      staff?.querySelector('layer')?.appendChild(startNote.cloneNode(true));
    }
  } // addPointingNote()

  /** @typedef {'starting' | 'ending' | 'spanning'} SpanMode */

  /**
   * Handles timeStamp2 element under different breaks and span modes:
   *
   * @param {Element} el
   * @param {SpanMode} spanMode
   */
  function computeTimeStamp2Attribute(el, spanMode = 'ending') {
    let tstamp2 = el.getAttribute('tstamp2');
    if (tstamp2) {
      let elId = el.getAttribute('xml:id');
      let mb = utils.readMeasureBeat(tstamp2);
      console.log('computeTimeStamp2Attribute(): el: ', el);

      // find number of measures until next page/system break
      let nodeList;
      if (Array.isArray(breaks)) {
        nodeList = xmlDoc.querySelectorAll('measure,[*|id="' + elId + '"],' + breaks);
      } else {
        nodeList = xmlDoc.querySelectorAll('measure,[*|id="' + elId + '"]');
      }
      let dm = 0;
      let count = false;
      let dmOfLastBreak = 0;
      let dmOfLastLastBreak = 0;
      let pageNumber = 1;
      let i = -1;
      for (let n of nodeList) {
        i++; // keep index
        if (n.getAttribute('xml:id') === elId) {
          count = true; // start counting after first occurrence of el
        }
        if (count && n.nodeName === 'measure') {
          dm++; // count measures
        }
        // break, if delta measures dm exceeds tstamp2 or pageNumber pageNo
        if (count && (dm >= mb.measure || pageNumber > pageNo)) {
          if (spanMode === 'spanning') {
            dm = dmOfLastBreak - dmOfLastLastBreak;
          } else if (spanMode === 'ending') {
            dm = dm - dmOfLastBreak;
          }
          break;
        }
        // count pages and keep track of last and lastlast break for spanMode==='spanning'
        if (
          i > 0 && // ignore first page beginning; // an array is also an object!
          ((Array.isArray(breaks) && breaks.includes(n.nodeName)) ||
            (!Array.isArray(breaks) &&
              typeof breaks === 'object' &&
              breaks[pageNumber].at(-1) === n.getAttribute('xml:id')))
        ) {
          pageNumber++; // count pages
          if (count && spanMode === 'starting') {
            break;
          } else {
            dmOfLastLastBreak = dmOfLastBreak;
            dmOfLastBreak = dm;
          }
        }
      } // nodeList loop

      if (spanMode === 'starting' || spanMode === 'spanning') {
        // element starting on current page (pageNo) or spanning across
        return utils.writeMeasureBeat(dm + 1, 1);
      } else if (spanMode === 'ending') {
        // element ending on current page (pageNo)
        return utils.writeMeasureBeat(dm, mb.beat);
      }
      return '';
    }
  } // computeTimeStamp2Attribute()

  /**
   * Adds a deep clone of spanning element el to startingMeasure
   * @param {Element} el
   * @param {SpanMode} spanMode
   * @param {string} tstamp2
   */
  function addSpanningElement(el, spanMode = 'starting', tstamp2 = '') {
    if (spanMode === 'starting' && tstamp2) {
      // element starting on current page (pageNo)
      el.setAttribute('tstamp2', tstamp2);
      // console.log('Element modified: ', el);
    } else {
      // element ending on current page (pageNo)
      let spanningElement = el.cloneNode(true);
      if (spanMode === 'spanning' && tstamp2) {
        // @ts-ignore
        spanningElement.setAttribute('tstamp2', tstamp2);
      } else if (spanMode === 'ending' && tstamp2) {
        // @ts-ignore
        spanningElement.setAttribute('tstamp2', tstamp2);
      }
      // console.log('Element added: ', spanningElement);
      startingMeasure.appendChild(spanningElement);
    }
  } // addSpanningElement()

  // find the matching id in list of ending elements after pageNo, or return -1
  function getPageNumberForIdInPageSpannersEndObject(/** @type {string} */ id) {
    let pageNumber = -1;
    for (let p of Object.keys(pageSpanners.end)) {
      if (parseInt(p) > pageNo) {
        let elementIds = pageSpanners.end[p];
        for (let elId of elementIds) {
          if (elId === id) {
            return parseInt(p);
          }
        }
      }
    }
    return pageNumber;
  } // getPageNumberForIdInPageSpannersObject()
} // addPageSpanningElements()

/**
 * Key signature a `<scoreDef>` or `<staffDef>` states itself: the value of
 * `@keysig` (MEI >= 5) or `@key.sig` (MEI <= 4.0.1), or its own `<keySig>`
 * child (which means no accidentals if it has no `@sig`), or `null`.
 * A `<keySig>` further down (in a `<staffDef>` of a `<scoreDef>`) belongs to
 * that staff only and is not returned.
 * @param {Element} def
 * @returns {string | Element | null}
 */
function ownKeySig(def) {
  const value = def.getAttribute('keysig') || def.getAttribute('key.sig');
  if (value) return value;
  return def.querySelector(':scope > keySig');
} // ownKeySig()

/**
 * @param {Element} def  `<scoreDef>` or `<staffDef>`
 * @returns {boolean} whether `def` itself states a meter (`@meter.*` or its
 * own `<meterSig>`/`<meterSigGrp>`)
 */
function hasOwnMeter(def) {
  return (
    def.getAttributeNames().some((a) => a.startsWith('meter.')) ||
    def.querySelector(':scope > meterSig, :scope > meterSigGrp') !== null
  );
} // hasOwnMeter()

/**
 * Deep copy of `el` without `@xml:id`s (the original may be rendered, too)
 * and without attributes that only make sense at the original's position.
 * @param {Element} el
 * @returns {Element}
 */
function stateCopy(el) {
  const copy = /** @type {Element} */ (el.cloneNode(true));
  for (const e of [copy, ...copy.querySelectorAll('*')]) {
    e.removeAttributeNS(xmlNameSpace, 'id');
    ['facs', 'sameas', 'tstamp', 'staff', 'layer', 'cautionary'].forEach((a) => e.removeAttribute(a));
  }
  return copy;
} // stateCopy()

/**
 * Removes every statement of a key signature from `staffDef`, then states
 * `keySig` there: a value as `@keysig` (MEI >= 5) or `@key.sig` (before), or
 * a copy of a `<keySig>` element.
 * @param {Element} staffDef
 * @param {string | Element} keySig  A data.KEYFIFTHS value, such as '3f', or
 * a `<keySig>` element
 * @param {string} meiVersion  MEI version of the source document.
 */
function setKeySig(staffDef, keySig, meiVersion = defaultMeiVersion) {
  staffDef.querySelectorAll(':scope > keySig').forEach((k) => k.remove());
  staffDef
    .getAttributeNames()
    .filter((a) => a === 'keysig' || a.startsWith('keysig.') || a.startsWith('key.sig'))
    .forEach((a) => staffDef.removeAttribute(a));
  if (typeof keySig === 'string') {
    staffDef.setAttribute(parseFloat(meiVersion) >= 5.0 ? 'keysig' : 'key.sig', keySig);
  } else {
    staffDef.appendChild(stateCopy(keySig));
  }
} // setKeySig()

/**
 * Removes every statement of a meter from `staffDef`, then copies the one of
 * `source` there: a `<meterSig>`/`<meterSigGrp>` itself, or the `@meter.*`
 * attributes and `<meterSig>`/`<meterSigGrp>` child of a `<scoreDef>` or
 * `<staffDef>`.
 * @param {Element} staffDef
 * @param {Element} source
 */
function setMeterSig(staffDef, source) {
  staffDef.querySelectorAll(':scope > meterSig, :scope > meterSigGrp').forEach((m) => m.remove());
  staffDef
    .getAttributeNames()
    .filter((a) => a.startsWith('meter.'))
    .forEach((a) => staffDef.removeAttribute(a));
  if (source.nodeName === 'meterSig' || source.nodeName === 'meterSigGrp') {
    staffDef.appendChild(stateCopy(source));
    return;
  }
  source
    .getAttributeNames()
    .filter((a) => a.startsWith('meter.'))
    .forEach((a) => staffDef.setAttribute(a, source.getAttribute(a) || ''));
  const meterSig = source.querySelector(':scope > meterSigGrp, :scope > meterSig');
  if (meterSig) staffDef.appendChild(stateCopy(meterSig));
} // setMeterSig()

/**
 * Removes every statement of a clef from `staffDef`, then copies the one of
 * `source` there: a `<clef>` itself, or the `@clef.*` attributes of a
 * `<staffDef>`.
 * @param {Element} staffDef
 * @param {Element} source
 */
function setClef(staffDef, source) {
  staffDef.querySelectorAll(':scope > clef').forEach((c) => c.remove());
  staffDef
    .getAttributeNames()
    .filter((a) => a.startsWith('clef.'))
    .forEach((a) => staffDef.removeAttribute(a));
  if (source.nodeName === 'clef') {
    staffDef.appendChild(stateCopy(source));
  } else {
    source
      .getAttributeNames()
      .filter((a) => a.startsWith('clef.'))
      .forEach((a) => staffDef.setAttribute(a, source.getAttribute(a) || ''));
  }
} // setClef()

/**
 * Retrieve page number of element with `@xml:id` `id`
 * @param {Document} xmlDoc
 * @param {Breaks} breaks
 * @param {string} id
 * @param {BreaksOption} breaksOption
 * @returns {Promise} pageNumber
 */
export async function getPageWithElement(xmlDoc, breaks, id, breaksOption) {
  let sel = '';
  let page = 1;

  // If `id` refers to a container (mdiv, section, ending, ...) rather than a
  // leaf, resolve it to its first descendant <measure> before locating a
  // page. Otherwise the container's own opening tag -- which in document
  // order precedes anything nested inside it, including a leading page/system
  // break right at the start of its content -- would resolve to the page
  // *before* the container's actual content starts.
  const targetEl = xmlDoc.querySelector('[*|id="' + id + '"]');
  const firstMeasureId = targetEl?.querySelector('measure')?.getAttribute('xml:id');
  if (firstMeasureId) id = firstMeasureId;

  // 'music body' (not 'music score') so ids in any mdiv can be found, not just the first
  const music = xmlDoc.querySelector('music body') || xmlDoc.documentElement;
  if (!music) return page;

  if (breaksOption === 'line' || breaksOption === 'encoded') {
    // Walk measures and breaks in document order and count pages exactly as
    // viewer.speedFilter() does: breaks before the first measure open no page,
    // and a break only ends a page when a measure has come since the last one
    // that did (so <sb/><pb/> opening a section ends one page, not two).
    const breakNames = breaksOption === 'line' ? 'sb,pb' : 'pb';
    let measureSinceBreak = false;
    for (const el of music.querySelectorAll('measure,' + breakNames + ',[*|id="' + id + '"]')) {
      if (el.getAttribute('xml:id') === id) return page; // the page it sits on
      if (el.nodeName === 'measure') measureSinceBreak = true;
      else if (measureSinceBreak && dutils.countAsBreak(el)) {
        // within an app, count only breaks inside lem or 1st rdg
        page++;
        measureSinceBreak = false;
      }
    }
    return 1; // id is not in the music body
  }

  switch (breaksOption) {
    case 'none':
      return page;
    // for speed mode: selector for all last measures and requested id
    case 'auto':
      if (!Array.isArray(breaks) && Object.keys(breaks).length > 0) {
        for (const br of Object.values(breaks)) {
          sel += '[*|id="' + br[br.length - 1] + '"],';
        }
        sel += '[*|id="' + id + '"]';
      } else return page;
      break;
    default:
      return page;
  }
  if (sel === '') return page;
  let els = Array.from(music.querySelectorAll(sel));
  for (let i = els.length - 1; i >= 0; i--) {
    if (!dutils.countAsBreak(els[i])) els.splice(i, 1);
  }

  page = els.findIndex((el) => el.getAttribute('xml:id') === id) + 1;
  // if element is within last measure, ...
  if (page > 1 && els[page - 1].closest('measure') === els[page - 2]) page--; // ...undo increment

  return Math.max(page, 1);
} // getPageWithElement()

/**
 * @param {Document} xmlNode
 * @returns {Element} An xmlNode with an `<mei>` element
 */
function minimalMEIFile(xmlNode) {
  var mei = xmlNode.createElementNS(meiNameSpace, 'mei');
  return mei;
} // minimalMEIFile()

/**
 * @param {Document} xmlNode
 * @returns {Element} A new `<music>` Element with an empty `<body>`.
 * `<mdiv>`/`<score>` children are added on demand, one per contributing
 * mdiv, by `getPageFromDom()` -- a page may need to source content from any
 * mdiv in the original document, not just the first.
 */
function minimalMEIMusicBody(xmlNode) {
  let music = xmlNode.createElementNS(meiNameSpace, 'music');
  let body = xmlNode.createElementNS(meiNameSpace, 'body');
  music.appendChild(body);
  return music;
} // minimalMEIMusicBody()

/**
 * Currently unused. Let's keep it for later.
 * @param {Document} xmlNode
 * @returns {Element} A minimal `<meiHead>`
 */
function minimalMEIHeader(xmlNode) {
  const meiHead = xmlNode.createElementNS(meiNameSpace, 'meiHead');
  const fileDesc = xmlNode.createElementNS(meiNameSpace, 'fileDesc');
  const titleStmt = xmlNode.createElementNS(meiNameSpace, 'titleStmt');
  const title = xmlNode.createElementNS(meiNameSpace, 'title');
  const titleText = xmlNode.createTextNode('Speed Mode Header');
  const pubStmt = xmlNode.createElementNS(meiNameSpace, 'pubStmt');
  const respStmt = xmlNode.createElementNS(meiNameSpace, 'respStmt');
  const persName = xmlNode.createElementNS(meiNameSpace, 'persName');
  // persName.setAttribute ...
  persName.appendChild(xmlNode.createTextNode('WG'));
  title.appendChild(titleText);
  titleStmt.appendChild(title);
  pubStmt.appendChild(respStmt);
  fileDesc.appendChild(titleStmt);
  fileDesc.appendChild(pubStmt);
  meiHead.appendChild(fileDesc);
  return meiHead;
} // minimalMEIHeader()

// Standard XML prolog
export const xmlProlog = '<?xml version="1.0" encoding="UTF-8"?>';

/**
 * Returns standard XML definitions with prolog and schema and schematron models
 * @param {string} meiVersion (such as '4.0.1')
 * @param {string} meiProfile (such as 'CMN' or 'Mensural)
 * @returns
 */
export function xmlDefs(meiVersion = defaultMeiVersion, meiProfile = defaultMeiProfile) {
  let xml = xmlProlog;
  xml +=
    '<?xml-model href="' +
    commonSchemas[meiProfile][meiVersion] +
    '" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>';
  xml +=
    '<?xml-model href="' +
    commonSchemas[meiProfile][meiVersion] +
    '" type="application/xml" schematypens="http://purl.oclc.org/dsdl/schematron"?>';
  return xml;
} // xmlDefs()

/**
 * Takes the leading dummy measure and its `<pb>` out of `baseSection` and
 * returns them wrapped in an `<mdiv>` of their own, so that the mdiv they were
 * taken from starts on the page the user actually sees (see the call site).
 * The returned `<mdiv>` gets its own copy of `scoreDefSrc`, stripped of
 * `@xml:id`s (they would be duplicates of the real mdiv's) and of labels (they
 * belong on the visible page, not on the dummy one).
 * @param {Document} xmlDoc
 * @param {Element} baseSection  `<section>` currently holding the dummy measure
 * @param {Element} scoreDefSrc  `<scoreDef>` to model the dummy page on
 * @returns {Element | null} The new `<mdiv>`, or `null` if `baseSection` does
 * not start with a dummy measure followed by its `<pb>` (which is the case when
 * `readSection()` moved the `<pb>` into an `<ending>`).
 */
function moveDummyMeasureToOwnMdiv(xmlDoc, baseSection, scoreDefSrc) {
  const measure = baseSection.firstElementChild;
  const pb = measure?.nextElementSibling;
  if (measure?.getAttributeNS(xmlNameSpace, 'id') !== 'startingMeasure') return null;
  if (pb?.getAttributeNS(xmlNameSpace, 'id') !== 'startingPb') return null;

  const scoreDef = /** @type {Element} */ (scoreDefSrc.cloneNode(true));
  scoreDef.querySelectorAll('label, labelAbbr').forEach((el) => el.remove());
  for (const el of [scoreDef, ...scoreDef.querySelectorAll('*')]) el.removeAttributeNS(xmlNameSpace, 'id');

  const mdiv = xmlDoc.createElementNS(meiNameSpace, 'mdiv');
  const score = xmlDoc.createElementNS(meiNameSpace, 'score');
  const section = xmlDoc.createElementNS(meiNameSpace, 'section');
  mdiv.appendChild(score);
  score.appendChild(scoreDef);
  score.appendChild(section);
  // rebuild the measure, as the dummy page now follows a different scoreDef
  const dummy = dummyMeasure(xmlDoc, countStaves(scoreDef));
  dummy.setAttributeNS(xmlNameSpace, 'xml:id', 'startingMeasure');
  measure.remove();
  section.appendChild(dummy);
  section.appendChild(pb);
  return mdiv;
} // moveDummyMeasureToOwnMdiv()

/**
 * @param {Document} document  Any Document. Is only needed for
 * `document.createElementNS()`. The global `document` form the browser is not
 * used so that this function can also be used in Node.
 * @param {number} [staves]
 * @returns {Element} A dummy `<measure>` with `number` `<staff>` elements
 */
export function dummyMeasure(document, staves = 2) {
  var m = document.createElementNS(meiNameSpace, 'measure');
  for (let i = 1; i <= staves; i++) {
    let note = document.createElementNS(meiNameSpace, 'note');
    note.setAttribute('pname', 'a');
    note.setAttribute('oct', '3');
    note.setAttribute('dur', '1');
    let uuid = utils.generateXmlId('note');
    note.setAttributeNS(xmlNameSpace, 'xml:id', uuid);
    let layer = document.createElementNS(meiNameSpace, 'layer');
    layer.setAttribute('n', '1');
    layer.appendChild(note);
    let staff = document.createElementNS(meiNameSpace, 'staff');
    staff.setAttribute('n', i.toString());
    staff.appendChild(layer);
    m.appendChild(staff);
  }
  return m;
} // dummyMeasure()

/**
 * @param {Element} dummyMeasure
 * @returns {string[]} Array of `@xml:id`s of the `dummyMeasure`s dummy notes.
 * There is one note per staff.
 *
 * This is currently not used.
 */
export function getIdsForDummyMeasure(dummyMeasure) {
  let notes = dummyMeasure.querySelectorAll('note');
  let uuids = [];
  for (let i = 0; i < notes.length; i++) {
    uuids[i] = notes[i].getAttribute('xml:id') || '';
  }
  return uuids;
} // getIdsForDummyMeasure()

/**
 * @param {Element} scoreDef
 * @returns {number} number of staff elements within `<scoreDef>`
 */
export function countStaves(scoreDef) {
  return scoreDef.querySelectorAll('staffDef').length;
} // countStaves()

/**
 * Filter selected elements and keep only highest in DOM.
 * If keepOnly array of strings is provided (such as ['note','chord','rest']),
 * keep only those elements and ignore others.
 *
 * @param {string[]} ids is modified by this function
 * @param {Document} xmlDoc
 * @param {string[]} keepOnly
 * @returns {string[]} The modified `ids` array, with all elements removed that
 * have an ancestor that is also in the `ids` array.
 */
export function filterElements(ids, xmlDoc, keepOnly = []) {
  for (let i = 0; i < ids.length; i++) {
    let eli = xmlDoc.querySelector('[*|id="' + ids[i] + '"]');
    if ((eli && keepOnly.length > 0 && !keepOnly.includes(eli.nodeName)) || !eli) {
      // Remove elements in the list, or when not in encoding (such as @accid)
      console.debug('Speed.filterElements: removed: ', eli ? eli : ids[i]);
      ids.splice(i--, 1);
      continue;
    }
    for (let j = 0; j < ids.length; j++) {
      const elj = xmlDoc.querySelector('[*|id="' + ids[j] + '"]');
      if (!elj) continue;
      if (elj.parentElement && elj.parentElement.closest('[*|id="' + ids[i] + '"]')) {
        ids.splice(j--, 1);
      }
    }
  }
  return ids;
} // filterElements()
