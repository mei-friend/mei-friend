// @ts-check

/* Speed mode: just feed the current page excerpt of the MEI encoding
 *  to Verovio, to minimize loading times.
 */

import * as utils from './utils.js';
import * as dutils from './dom-utils.js';
import * as att from './attribute-classes.js';
import {
  meiNameSpace,
  xmlNameSpace
} from './dom-utils.js';

/** @typedef {('sb' | 'pb')[] | {[pageNum: string]: string[]}} Breaks */
/** @typedef {{
 *   start: {[pageNum: string]: string[]},
 *   end: {[pageNum: string]: string[]}
 * }} PageSpanners;
 */
/** @typedef {'computedBreaks' | 'encodedBreaks' | 'firstPage'} CountingMode */
/** @typedef {'sb' | 'pb'} Break */
/** @typedef {'none' | 'auto' | 'line' | 'encoded' | 'smart'} BreaksOption */


/**
 * @param {Document} xmlDoc
 * @param {number} pageNo  Page number, starting at 1
 * @param {Breaks} breaks
 * @param {PageSpanners} pageSpanners
 * @returns {string|undefined} The page specified by `pageNo`, with preceding
 * and following dummy pages added with one meashre on each for anchoring
 * cross-page spanners. For page 1, no preceding dummy page is added, only a
 * following one.
 */
export function getPageFromDom(xmlDoc, pageNo = 1, breaks, pageSpanners) {
  const meiHeader = xmlDoc.querySelector('meiHead');
  if (!meiHeader) {
    console.info('getPageFromDom(): no meiHeader');
    return;
  }
  // console.info('getPageFromDom(' + pageNo + ') meiHead: ', meiHeader);
  let xmlScore = xmlDoc.querySelector("mdiv > score");
  if (!xmlScore) {
    console.info('getPageFromDom(): no xmlScore element');
    return;
  }
  // console.info('xmlScore: ', xmlScore);
  // determine one of three counting modes
  /** @type CountingMode */
  let countingMode = 'firstPage'; // quick first page for xx measures
  if (Array.isArray(breaks))
    countingMode = 'encodedBreaks'; // encoded sb and pb as provided
  else if (typeof breaks === 'object' && Object.keys(breaks).length > 0)
    countingMode = 'computedBreaks'; // breaks object
  // else if (breaks === 'measure') // breaks for each encoded measure
  //   countingMode = 'measure';
  if (countingMode === 'firstPage') pageNo = 1; // for quick first page, always 1

  // construct new MEI node for Verovio engraving
  let spdNode = minimalMEIFile(xmlDoc);
  const meiVersion = xmlDoc.querySelector('mei')?.getAttribute('meiversion');
  if (meiVersion) spdNode.setAttribute('meiversion', meiVersion);
  spdNode.appendChild(meiHeader.cloneNode(true));
  spdNode.appendChild(minimalMEIMusicTree(xmlDoc));
  const scoreDef = /** @type {Element | undefined} */ (xmlScore.querySelector("music scoreDef")?.cloneNode(true));
  if (!scoreDef) {
    console.info('getPageFromDom(): no scoreDef element');
    return;
  }
  // console.info('scoreDef: ', scoreDef);
  let baseSection = xmlDoc.createElementNS(meiNameSpace, 'section');
  baseSection.setAttributeNS(xmlNameSpace, 'xml:id', 'baseSection');
  // console.info('section: ', baseSection);

  if (pageNo > 1) {
    let measure = dummyMeasure(xmlDoc, countStaves(scoreDef));
    measure.setAttributeNS(xmlNameSpace, 'xml:id', 'startingMeasure');
    baseSection.appendChild(measure);
    baseSection.appendChild(xmlDoc.createElementNS(meiNameSpace, 'pb'));
  }
  let spdScore = /** @type {Element} */ (spdNode.querySelector('mdiv > score'));
  // console.info('spdScore: ', spdScore);

  spdScore.appendChild(scoreDef); // is updated within readSection()
  spdScore.appendChild(baseSection);

  let digger = readSection(pageNo, spdScore, breaks, countingMode);
  let sections = xmlScore.childNodes;
  sections.forEach((item) => {
    if (item.nodeName === 'section') { // diggs into section hierachy
      let returnSection = digger(/** @type {Element}*/ (item));
      baseSection.appendChild(returnSection);
    }
  });

  // add third measure (even if last page)
  let m = dummyMeasure(xmlDoc, countStaves(scoreDef));
  m.setAttributeNS(xmlNameSpace, 'xml:id', 'endingMeasure');
  baseSection.appendChild(xmlDoc.createElementNS(meiNameSpace, 'pb'));
  baseSection.appendChild(m);

  // matchTimespanningElements(xmlScore, spdScore, pageNo);

  if (Object.keys(pageSpanners.start).length > 0)
    addPageSpanningElements(xmlScore, spdScore, pageSpanners, pageNo);

  // insert sb elements for each element except last
  if (countingMode === 'computedBreaks' && Object.keys(breaks).length > 0 && !Array.isArray(breaks)) {
    breaks[pageNo].forEach((id, i) => {
      if (i < breaks[pageNo].length - 1) { // last element is a <pb>
        let m = spdScore.querySelector('[*|id="' + id + '"]');
        // console.info("spd(p:" + pageNo + " i:" + i + "): id=" + id + ", m:", m);
        if (m) {
          let sb = xmlDoc.createElementNS(meiNameSpace, 'sb');
          let next = m.nextSibling;
          let parent = /** @type {Element} */ (m.parentNode);
          // console.info('...found. next:', next);
          // console.info('...found. parent:', parent);
          if (next && next.nodeType != Node.TEXT_NODE)
            parent.insertBefore(sb, next);
          else
            parent.appendChild(sb);
        }
      }
    });
  }

  const serializer = new XMLSerializer();
  let mei = xmlDefs + serializer.serializeToString(spdNode);
  // console.info('Speed() MEI: ', mei);
  return mei;
}

/**
 * @param {number} pageNo  Page number, starting at 1
 * @param {Element} spdScore  The returned closure updates the `<staffDef>`s
 * in this speed score according to what's found in the section element the
 * closure takes as argument.
 * @param {Breaks} breaks
 * @param {string} countingMode
 * @returns {function(Element): Element}  Recursive closure that takes an
 * original `<section>` as argument and creates a new `<section>` with the
 * content of the original `<section>` reduced to the page with page number
 * `pageNo`.
 */
function readSection(pageNo, spdScore, breaks, countingMode) {
  let p = 1; // page count
  let mNo = 1; // measure count (for a fast first page, with breaks = '')
  let mxMeasures = 50; // for a quick first page
  let breaksSelector = '';
  // For 'encodedBreaks', `breaks` will always be an Array of 'sb' and 'pb'
  if (countingMode === 'encodedBreaks') breaksSelector = /** @type {string[]} */ (breaks).join(', ');
  let countNow = false; // to ignore encoded page breaks before first measure
  let staffDefs = spdScore.querySelectorAll('staffDef');

  // recursive closure to dig through hierarchically stacked sections and append
  // only those elements within the requested pageNo
  return function digDeeper(section) {
    const document = section.ownerDocument;
    // create a copy of section and copy attributes
    let newSection = document.createElementNS(meiNameSpace, 'section');
    section.getAttributeNames().forEach((attrName) => {
      newSection.setAttribute(attrName, section.getAttribute(attrName) || "")
    });

    let children = section.childNodes;
    let lgt = children.length;
    for (let i = 0; i < lgt; i++) {
      if (countingMode === 'firstPage' && mNo >= mxMeasures) // exit with first page
        return newSection;
      if (p > pageNo) break; // only until requested pageNo is processed
      if (children[i].nodeType !== Node.ELEMENT_NODE) continue;
      let currentNode = /** @type {Element} */ (children[i]);
      // console.info('digDeeper(' + pageNo + '): p: ' + p +
      //   ', i: ' + i + ', ', currentNode);
      let currentNodeName = currentNode.nodeName;
      // ignore expansion lists
      if (['expansion'].includes(currentNodeName)) continue;
      // console.info('digDeeper currentNodeName: ', currentNodeName + ', '
      // + currentNode.getAttribute('xml:id'));
      if (currentNodeName === 'section') {
        let returnSection = digDeeper(currentNode);
        newSection.appendChild(returnSection);
        // console.info('digDeeper returned spdScore: ', spdScore);
        continue;
      }
      if (currentNodeName === 'measure') {
        countNow = true; // increment m when counting measures for a quick first page
      }

      if (countingMode === 'firstPage') {
        if (currentNodeName === 'measure') mNo++;
        else currentNode.querySelectorAll('measure').forEach(() => mNo++);
      // } else if (countingMode === 'measure') {
      //   if (currentNodeName === 'measure') p++;
      //   else currentNode.querySelectorAll('measure').forEach(() => p++);
      } else if (countingMode === 'encodedBreaks') {
        let sb = null;
        // For 'encdedBreaks', `breaks` is an Array
        if (countNow && (
            /** @type {string[]} */ (breaks).includes(currentNodeName)
            || (sb = /** @type {Element} */ (currentNode).querySelector(breaksSelector))
        )) {
          if (dutils.countAsBreak(sb ? sb : currentNode)) p++;
          continue;
        }
        // ignore system/page breaks in other countingModes
      } else if (currentNodeName === 'sb' || currentNodeName === 'pb') continue;

      // update scoreDef @key.sig attribute or keySig@sig and
      // for @meter@count/@unit attr or meterSig@count/unit.
      if (currentNodeName === 'scoreDef' && p < pageNo) {
        const scoreDef = /** @type {Element} */ (currentNode);
        const keySig = scoreDef.getAttribute('key.sig') || scoreDef.querySelector('keySig')?.getAttribute('sig');
        if (keySig) {
          addKeySigElement(staffDefs, keySig);
        }
        const {count, unit} = getMeter(scoreDef);
        if (count && unit) {
          addMeterSigElement(staffDefs, count, unit);
        }
      }
      // scoreDef with staffDef@key.sig or keySig@sig and meter@count/@unit
      let staffDefList = currentNode.querySelectorAll(
        breaksSelector ? breaksSelector + ', staffDef' : 'staffDef');
      if (staffDefList && staffDefList.length > 0 && p < pageNo) {
        // console.info('staffDef: ', staffDefList);
        for (let st of staffDefList) {
          if (countingMode === 'encodedBreaks' && /** @type {string[]} */ (breaks).includes(st.nodeName))
            break;
          const keysigValue = st.getAttribute('key.sig') || st.querySelector('keySig')?.getAttribute('sig');
          if (keysigValue) {
            // console.info('staffDef update: keysig: ' + keysigValue);
            for (let staffDef of staffDefs) {
              if (st.getAttribute('n') === staffDef.getAttribute('n')) {
                let el = document.createElementNS(meiNameSpace, 'keySig');
                el.setAttribute('sig', keysigValue);
                //console.info('Updating scoreDef('+st.getAttribute('n')+'): ',el);
                let k = staffDef.querySelector('keySig');
                if (k) {
                  k.setAttribute('sig', keysigValue);
                } else {
                  staffDef.appendChild(el);
                }
              }
            }
          } else {
            console.info('No key.sig information in ', st);
          }
          const {count, unit} = getMeter(st);
          if (count && unit) {
            // console.info('staffDef update: meterSig: ' +
            //   meterCountValue + '/' + meterUnitValue);
            for (let staffDef of staffDefs) {
              if (st.getAttribute('n') === staffDef.getAttribute('n')) {
                let el = document.createElementNS(meiNameSpace, 'meterSig');
                el.setAttribute('count', count);
                el.setAttribute('unit', unit);
                // console.info('Updating scoreDef(' + st.getAttribute('n') + '): ', el);
                let k = staffDef.querySelector('meterSig');
                if (k) {
                  k.setAttribute('count', count);
                  k.setAttribute('unit', unit);
                } else {
                  staffDef.appendChild(el);
                }
              }
            }
          } else {
            console.info('No meter.count/unit information in ', st);
          }
        }
      }
      // update scoreDef with clef elements inside layers (and breaks to stop updating)
      let clefList = currentNode.querySelectorAll(
        breaksSelector ? breaksSelector + ', clef' : 'clef');
      if (clefList && clefList.length > 0 && p < pageNo) {
        // console.info('clefList: ', clefList);
        for (let clef of clefList) { // check clefs of measure, ignore @sameas
          if (clef.getAttribute('sameas')) continue;
          const staffNo = getStaffNumber(clef);
          if (!staffNo) continue;
          // console.info('clefList stffNo: ' + stffNo);
          let staffDef = spdScore.querySelector(`staffDef[n="${staffNo}"]`);
          if (!staffDef) {
            console.info('digDeeper(): no staffDef for staff ' + staffNo);
            continue;
          }
          // console.info('staffDef: ', staffDef);
          if (clef.hasAttribute('line'))
            staffDef.setAttribute('clef.line', clef.getAttribute('line') || "");
          if (clef.hasAttribute('shape'))
            staffDef.setAttribute('clef.shape', clef.getAttribute('shape') || "");
          if (clef.hasAttribute('dis'))
            staffDef.setAttribute('clef.dis', clef.getAttribute('dis') || "");
          if (clef.hasAttribute('dis.place'))
            staffDef.setAttribute('clef.dis.place', clef.getAttribute('dis.place') || "");
          // console.info('scoreDef: ', spdScore.querySelector('scoreDef'));
        }
      }

      // special treatment for endings that contain breaks
      if (currentNodeName === 'ending' && breaksSelector &&
        (currentNode.querySelector(breaksSelector))) {
        // copy elements containing breaks
        let endingNode = /** @type {Element} */ (currentNode.cloneNode(true));
        let breakNode = endingNode.querySelector(breaksSelector);
        if (p === pageNo && breakNode) {
          breakNode.parentNode?.replaceChild(
            document.createElementNS(meiNameSpace, 'pb'), breakNode);
          newSection.appendChild(endingNode);
        } else if (p === pageNo - 1) { // remove elements until first break
          // QUESTION: Can we be sure that breaks is an array here?
          while (endingNode.firstChild && !/** @type {string[]} */ (breaks).includes(endingNode.firstChild.nodeName)) {
            endingNode.removeChild(endingNode.firstChild);
          }
          newSection.appendChild(endingNode);
        }
        // console.info('Ending with break inside: ', endingNode);
        p++;
        continue;
      }

      // append children
      if (p === pageNo) {
        let nodeCopy = /** @type {Element} */ (currentNode.cloneNode(true));
        if (countingMode === 'computedBreaks') { // remove breaks from DOM
          nodeCopy.querySelectorAll('pb, sb').forEach(b => nodeCopy.removeChild(b));
        }
        newSection.appendChild(nodeCopy);
        // console.info('digDeeper adds child to spdScore: ', spdScore);
      }

      // increment in countingMode computedBreaks
      if (countingMode === 'computedBreaks') {
        if (currentNodeName === 'measure' &&
          currentNode.getAttribute('xml:id') === breaks[p][breaks[p].length - 1])
          p++;
        else {
          currentNode.querySelectorAll('measure').forEach(m => {
            if (m.getAttribute('xml:id') === breaks[p][breaks[p].length - 1])
              p++;
          })
        }
      }

    } // for loop across child nodes
    return newSection;
  }
}

/**
 * List all notes/chords to check whether they are pointed to from outside the
 * requested pageNo to be run at each edit/page turn (becomes slow with big
 * files).
 *
 * TODO: This is currently not used and probably O(n²). If it should be used
 * again, create objects mapping all `@startid` and `@endid` values once and
 * pass it as argument to this function. This should probably give us something
 * like O(n log n) complexity.
 *
 * @param {Element} xmlScore
 * @param {Document} spdScore
 * @param {number} pageNo
 */
function matchTimespanningElements(xmlScore, spdScore, pageNo) {
  // let t1 = performance.now();
  let startingSelector = '';
  let endingSelector = '';

  var listOfTargets = spdScore.querySelectorAll('note, chord');
  for (let target of listOfTargets) {
    let id = '#' + target.getAttribute('xml:id');
    //
    endingSelector += "[startid][endid='" + id + "'],";
    startingSelector += "[startid='" + id + "'][endid],";
  }
  // let t2 = performance.now();
  // console.log(listOfTargets.length + ' notes: selector constructed ' + (t2 - t1) + ' ms.');

  let endingElements = Array.from(xmlScore
    .querySelectorAll(endingSelector.slice(0, -1)));
  let startingElements = Array.from(xmlScore
    .querySelectorAll(startingSelector.slice(0, -1)));

  // let t3 = performance.now();
  // console.log('querySelectorAll ' + (t3 - t2) + ' ms.');
  //
  // check whether this id ends in startingElements
  for (let target of listOfTargets) {
    let id = '#' + target.getAttribute('xml:id');
    for (let j = 0; j < startingElements.length; j++) {
      let el = startingElements[j];
      // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
      if (el && el.getAttribute('endid') === id) {
        // console.info('startingElement removed', startingElements[j]);
        endingElements.splice(endingElements.indexOf(el), 1);
        startingElements.splice(j--, 1);
      }
    }
    for (let j = 0; j < endingElements.length; j++) {
      let el = endingElements[j];
      // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
      if (el && el.getAttribute('startid') === id) {
        // console.info('endingElement removed', endingElements[j]);
        startingElements.splice(startingElements.indexOf(el), 1);
        endingElements.splice(j--, 1);
      }
    }
  }

  // let t4 = performance.now();
  // console.log('timespan matching took ' + (t4 - t3) + ' ms.');

  // 1) go through endingElements and add to first measure
  if (endingElements.length > 0 && pageNo > 1) {
    const m = /** @type {Element} */ (spdScore.querySelector('[*|id="startingMeasure"]'));
    let uuids = getIdsForDummyMeasure(m);
    for (let endingElement of endingElements) {
      if (endingElement) {
        let startid = utils.rmHash(endingElement.getAttribute('startid'));
        let note = xmlScore.querySelector('[*|id="' + startid + '"]');
        if (!note) continue;
        const staffNo = parseInt(getStaffNumber(note));
        if (isNaN(staffNo)) continue;
        let el = /** @type {Element} */ (endingElement.cloneNode(true));
        el.setAttribute('startid', '#' + uuids[staffNo - 1]);
        m?.appendChild(el);
      }
    }
  } // 1) if

  // 2) go through startingElements and append to a third-page measure
  if (startingElements.length > 0) {
    // console.info('work through startingElements.');
    const m = /** @type {Element} */ (spdScore.querySelector('[*|id="endingMeasure"]'));
    let uuids = getIdsForDummyMeasure(m);
    for (let startingElement of startingElements) {
      if (startingElement) {
        let endid = utils.rmHash(startingElement.getAttribute('endid'));
        // console.info('searching for endid: ', endid);
        if (endid) {
          let note = xmlScore.querySelector('[*|id="' + endid + '"]');
          if (!note) continue;
          const staffNo = parseInt(getStaffNumber(note));
          if (isNaN(staffNo)) continue;
          let tel = spdScore.querySelector('[*|id="' +
            startingElement.getAttribute('xml:id') + '"]');
          if (tel) tel.setAttribute('endid', '#' + uuids[staffNo - 1]);
        }
      }
    }
  } // 2) if

  // console.log('adding slurs took ' + (performance.now() - t4) + ' ms.');

} // matchTimespanningElements

/**
 * List all timespanning elements with `@startid`/`@endid` attributes on
 * different pages
 * @param {Document} xmlScore
 * @param {Break[]} breaks
 * @param {BreaksOption} breaksOption
 * @returns {PageSpanners}
 */
export function listPageSpanningElements(xmlScore, breaks, breaksOption) {
  let t1 = performance.now();
  let els = xmlScore.querySelectorAll(att.timeSpanningElements.join(','));
  let pageSpanners = {
    start: {},
    end: {}
  };
  // for breaks encoded / array; TODO auto/Object
  let sel = '';
  switch (breaksOption) {
    case 'none':
      return {start: {}, end: {}};
    case 'auto':
      if (Object.keys(breaks).length > 0) {
        for (let pg in breaks) {
          let br = breaks[pg]; // array of breaks
          sel += '[*|id="' + br[br.length - 1] + '"],';
        }
      } else return {start: {}, end: {}};
      break;
    case 'line':
      sel = 'pb,sb,'
      break;
    case 'encoded':
      sel = 'pb,';
  }
  // object with time-spanning-element-ids key: [@startid,@endid] array
  let tsTable = {};
  for (let el of els) {
    let id = el.getAttribute('xml:id');
    let startid = utils.rmHash(el.getAttribute('startid'));
    if (startid) sel += '[*|id="' + startid + '"],';
    let endid = utils.rmHash(el.getAttribute('endid'));
    if (endid) sel += '[*|id="' + endid + '"],';
    if (id && startid && endid) tsTable[id] = [startid, endid];
  }
  let t2 = performance.now();
  console.log('listPageSpanningElements selector preps: ' + (t2 - t1) + ' ms.');

  let elList = xmlScore.querySelectorAll(sel.slice(0, -1));

  t1 = t2;
  t2 = performance.now();
  console.log('listPageSpanningElements querySelectorAll: ' + (t2 - t1) + ' ms.');

  let noteTable = {};
  let count = false;
  let p = 1;
  if (breaksOption === 'line' || breaksOption === 'encoded') {
    for (let e of elList) {
      if (e.nodeName === 'measure') count = true;
      if (count && breaks.includes(/** @type {Break} */ (e.nodeName)) && dutils.countAsBreak(e)) p++;
      else
        noteTable[e.getAttribute('xml:id') || ""] = p;
    }
  } else if (breaksOption = 'auto') {
    /** @type {Element | undefined} */
    let m;
    for (let e of elList) {
      if (e.nodeName === 'measure') {
        p++;
        m = e;
      } else {
        noteTable[e.getAttribute('xml:id') || ""] =
          (m && e.closest('measure') === m) ? p - 1 : p;
      }
    }
  }

  t1 = t2;
  t2 = performance.now();
  console.log('listPageSpanningElements noteTable: ' + (t2 - t1) + ' ms.');

  let p1 = 0;
  let p2 = 0;
  for (let spannerIds of Object.keys(tsTable)) {
    p1 = noteTable[tsTable[spannerIds][0]];
    p2 = noteTable[tsTable[spannerIds][1]];
    if (p1 > 0 && p2 > 0 && p1 != p2) {
      if (pageSpanners.start[p1])
        pageSpanners.start[p1].push(spannerIds);
      else
        pageSpanners.start[p1] = [spannerIds];
      if (pageSpanners.end[p2])
        pageSpanners.end[p2].push(spannerIds);
      else
        pageSpanners.end[p2] = [spannerIds];
    }
  }

  t1 = t2;
  t2 = performance.now();
  console.log('listPageSpanningElements pageSpanners: ' + (t2 - t1) + ' ms.');

  return pageSpanners;
}


/**
 * Finds out which staff number the element belongs to.
 * @param {Element} element
 * @returns {string} The found `@n` value of the closest `<staff>` or
 * `<staffDef>`, or the empty string if no such elemetn or attribute was found.
 */
function getStaffNumber(element) {
  return element.closest('staff,staffDef')?.getAttribute('n') || "";
}


/**
 * @param {Element} scoreDef
 * @returns {{count: string | null, unit: string | null}}
 */
function getMeter(scoreDef) {
  let meter = {
    count: scoreDef.getAttribute('meter.count'),
    unit: scoreDef.getAttribute('meter.unit'),
  };

  if (!meter.count || !meter.unit) {
    const meterSig = scoreDef.querySelector('meterSig');
    if (!meterSig) return meter;
    return {
      count: meterSig.getAttribute('count'),
      unit: meterSig.getAttribute('unit'),
    };
  }

  return meter;
}


/**
 * Add time-spanning elements spanning across pages to `spdScore`
 * @param {Element} xmlScore
 * @param {Element} spdScore
 * @param {PageSpanners} pageSpanners
 * @param {number} pageNo
 */
function addPageSpanningElements(xmlScore, spdScore, pageSpanners, pageNo) {
  // 1) go through endingElements and add to first measure
  let endingElementIds = pageSpanners.end[pageNo];
  if (endingElementIds && pageNo > 1) {
    const m = /** @type {Element} */ (spdScore.querySelector('[*|id="startingMeasure"]'));
    for (let endingElementId of endingElementIds) {
      let endingElement =
        xmlScore.querySelector('[*|id="' + endingElementId + '"]');
      if (!endingElement) continue;
      let startid = utils.rmHash(endingElement.getAttribute('startid'));
      let startNote = xmlScore.querySelector('[*|id="' + startid + '"]');
      if (!startNote) continue;
      const staffNo = startNote.closest('staff')?.getAttribute('n') || '-1';
      if (!spdScore.querySelector('[*|id="' + startid + '"]')) {
        let staff = m.querySelector('staff[n="' + staffNo + '"]');
        staff?.querySelector('layer')?.appendChild(startNote.cloneNode(true));
      }
      m.appendChild(endingElement.cloneNode(true));
    }
  } // 1) if

  // 2) go through startingElements and append to a third-page measure
  let startingElementIds = pageSpanners.start[pageNo];
  if (startingElementIds) {
    const m = /** @type {Element} */ (spdScore.querySelector('[*|id="endingMeasure"]'));
    for (let startingElementId of startingElementIds) {
      let startingElement =
        xmlScore.querySelector('[*|id="' + startingElementId + '"]');
      if (!startingElement) continue;
      let endid = utils.rmHash(startingElement.getAttribute('endid'));
      // console.info('searching for endid: ', endid);
      if (endid) {
        let endNote = xmlScore.querySelector('[*|id="' + endid + '"]');
        if (!endNote) continue;
        const staffNo = endNote.closest('staff')?.getAttribute('n') || "-1";
        if (!spdScore.querySelector('[*|id="' + endid + '"]')) {
          let staff = m.querySelector('staff[n="' + staffNo + '"]');
          staff?.querySelector('layer')?.appendChild(endNote.cloneNode(true));
        }
      }
    }
  }
}


/**
 * Helper function to `readSection()`; adds `<keySig>` element to `spdScore`.
 * @param {NodeListOf<Element>} staffDefs
 * @param {string} keysigValue  The value for the `keySig/@sig` attribute.
 */
function addKeySigElement(staffDefs, keysigValue) {
  for (let staffDef of staffDefs) {
    staffDef.removeAttribute('key.sig');
    let k = staffDef.querySelector('keySig');
    if (k) {
      k.setAttribute('sig', keysigValue);
    } else {
      let keySigElement = staffDef.ownerDocument.createElementNS(meiNameSpace, 'keySig');
      keySigElement.setAttribute('sig', keysigValue);
      staffDef.appendChild(keySigElement);
    }
  }
}

/**
 * Helper function to `readSection()`; adds `@meter.sig` to `spdScore`.
 * @param {NodeListOf<Element>} staffDefs
 * @param {string} meterCountValue
 * @param {string} meterUnitValue
 */
function addMeterSigElement(staffDefs, meterCountValue, meterUnitValue) {
  for (let staffDef of staffDefs) {
    staffDef.removeAttribute('meter.count');
    staffDef.removeAttribute('meter.unit');
    var k = staffDef.querySelector('meterSig');
    if (k) {
      k.setAttribute('count', meterCountValue);
      k.setAttribute('unit', meterUnitValue);
    } else {
      let meterSigElement = staffDef.ownerDocument.createElementNS(meiNameSpace, 'meterSig');
      meterSigElement.setAttribute('count', meterCountValue);
      meterSigElement.setAttribute('unit', meterUnitValue);
      staffDef.appendChild(meterSigElement);
    }
  }
}

/**
 * Retrieve page number of element with `@xml:id` `id`
 * @param {Document} xmlDoc
 * @param {Breaks} breaks
 * @param {string} id
 * @param {BreaksOption} breaksOption
 * @returns {number} pageNumber
 */
export function getPageWithElement(xmlDoc, breaks, id, breaksOption) {
  let sel = '';
  let page = 1;
  switch (breaksOption) {
    case 'none':
      return page;
      // for speedMode: selector for all last measures and requested id
    case 'auto':
      if (!Array.isArray(breaks) &&
        Object.keys(breaks).length > 0) {
        for (const br of Object.values(breaks)) {
          sel += '[*|id="' + br[br.length - 1] + '"],';
        }
        sel += '[*|id="' + id + '"]';
      } else return page;
      break;
    case 'line':
      sel = 'pb,sb,[*|id="' + id + '"]'; // find all breaks in xmlDoc
      break;
    case 'encoded':
      sel = 'pb,[*|id="' + id + '"]'; // find all breaks in xmlDoc
      break;
    default:
      return page;
  }
  if (sel === '') return page;
  const music = xmlDoc.querySelector('music score') || xmlDoc.documentElement;
  if (!music) return page;
  let els = Array.from(music.querySelectorAll(sel));
  for (let i = els.length - 1; i >= 0; i--) {
    if (!dutils.countAsBreak(els[i])) els.splice(i, 1);
  }

  page = els.findIndex(el => el.getAttribute('xml:id') === id) + 1;
  // if element is within last measure, ...
  if (page > 1 && els[page - 1].closest('measure') === els[page - 2])
    page--; // ...undo increment

  // remove leading pb in MEI file
  if (breaksOption === 'line' || breaksOption === 'encoded') {
    let j = 0;
    for (const el of music.querySelectorAll('pb,measure')) {
      if (el.nodeName !== 'pb') break;
      if (dutils.countAsBreak(el)) j++;
    }
    page -= j;
  }
  return page;
}

/**
 * @param {Document} xmlNode
 * @returns {Element} An xmlNode with an `<mei>` element
 */
function minimalMEIFile(xmlNode) {
  var mei = xmlNode.createElementNS(meiNameSpace, 'mei');
  return mei;
}

/**
 * @param {Document} xmlNode
 * @returns {Element} A new `<music>` Element with `<body>`, `<mdiv>`, and
 * `<score>` in it
 */
function minimalMEIMusicTree(xmlNode) {
  let music = xmlNode.createElementNS(meiNameSpace, 'music');
  let body = xmlNode.createElementNS(meiNameSpace, 'body');
  let mdiv = xmlNode.createElementNS(meiNameSpace, 'mdiv');
  let score = xmlNode.createElementNS(meiNameSpace, 'score');
  mdiv.appendChild(score);
  body.appendChild(mdiv);
  music.appendChild(body);
  return music;
}

/**
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
}


export const xmlDefs = `
 <?xml version="1.0" encoding="UTF-8"?>
 <?xml-model href="https://music-encoding.org/schema/4.0.1/mei-all.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>
 <?xml-model href="https://music-encoding.org/schema/4.0.1/mei-all.rng" type="application/xml" schematypens="http://purl.oclc.org/dsdl/schematron"?>
`;


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
    let uuid = 'note-' + utils.generateUUID();
    note.setAttributeNS(xmlNameSpace, 'xml:id', uuid);
    let layer = document.createElementNS(meiNameSpace, 'layer')
    layer.setAttribute('n', '1');
    layer.appendChild(note);
    let staff = document.createElementNS(meiNameSpace, 'staff');
    staff.setAttribute('n', i.toString());
    staff.appendChild(layer);
    m.appendChild(staff);
  }
  return m;
}

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
    uuids[i] = notes[i].getAttribute('xml:id') || "";
  }
  return uuids;
}

/**
 * @param {Element} scoreDef
 * @returns {number} number of staff elements within `<scoreDef>`
 */
export function countStaves(scoreDef) {
  return scoreDef.querySelectorAll('staffDef').length;
}

/**
 * Filter selected elements and keep only highest in DOM
 * @param {string[]} ids  Is modified by this function
 * @param {Document} xmlDoc
 * @returns {string[]} The modified `ids` array, with all elements removed that
 * have an ancestor that is also in the `ids` array.
 */
export function filterElements(ids, xmlDoc) {
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const elj = xmlDoc.querySelector('[*|id="' + ids[j] + '"]');
      if (!elj) continue;
      if (elj.closest('[*|id="' + ids[i] + '"]')) {
        ids.splice(j--, 1);
      }
    }
  }
  return ids;
}
