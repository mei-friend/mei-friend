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
 */
export function getPageFromDom(xmlDoc, pageNo = 1, breaks, pageSpanners, includeDummyMeasures = true) {
  const meiHeader = xmlDoc.querySelector('meiHead');
  if (!meiHeader) {
    console.info('getPageFromDom(): no meiHeader');
    return;
  }
  // console.info('getPageFromDom(' + pageNo + ') meiHead: ', meiHeader);
  let xmlScore = xmlDoc.querySelector('mdiv > score');
  if (!xmlScore) {
    console.info('getPageFromDom(): no xmlScore element');
    return;
  }

  // determine one of three counting modes
  /** @type CountingMode */
  let countingMode = 'firstPage'; // quick first page for xx measures
  if (Array.isArray(breaks)) countingMode = 'encodedBreaks'; // encoded sb and pb as provided
  else if (typeof breaks === 'object' && Object.keys(breaks).length > 0) countingMode = 'computedBreaks'; // breaks object
  // else if (breaks === 'measure') // breaks for each encoded measure
  //   countingMode = 'measure';
  if (countingMode === 'firstPage') pageNo = 1; // for quick first page, always 1

  // construct new MEI node for Verovio engraving
  let spdNode = minimalMEIFile(xmlDoc);

  // check for mei version or use default
  let meiVersion = xmlDoc.querySelector('mei')?.getAttribute('meiversion');
  if (!meiVersion) meiVersion = defaultMeiVersion;
  spdNode.setAttribute('meiversion', meiVersion);

  spdNode.appendChild(meiHeader.cloneNode(true));
  spdNode.appendChild(minimalMEIMusicTree(xmlDoc));
  const scoreDef = /** @type {Element | undefined} */ (xmlScore.querySelector('music scoreDef')?.cloneNode(true));
  if (!scoreDef) {
    console.info('getPageFromDom(): no scoreDef element');
    return;
  }
  // console.info('scoreDef: ', scoreDef);
  let baseSection = xmlDoc.createElementNS(meiNameSpace, 'section');
  baseSection.setAttributeNS(xmlNameSpace, 'xml:id', 'baseSection');
  // console.info('section: ', baseSection);

  if (pageNo > 1 && includeDummyMeasures) {
    let measure = dummyMeasure(xmlDoc, countStaves(scoreDef));
    measure.setAttributeNS(xmlNameSpace, 'xml:id', 'startingMeasure');
    baseSection.appendChild(measure);
    let startingPb = xmlDoc.createElementNS(meiNameSpace, 'pb');
    startingPb.setAttributeNS(xmlNameSpace, 'xml:id', 'startingPb');
    baseSection.appendChild(startingPb);
  }
  let spdScore = /** @type {Element} */ (spdNode.querySelector('mdiv > score'));
  // console.info('spdScore: ', spdScore);

  spdScore.appendChild(scoreDef); // is updated within readSection()
  spdScore.appendChild(baseSection);

  let digger = readSection(pageNo, spdScore, breaks, countingMode);
  let sections = xmlScore.childNodes;
  sections.forEach((item) => {
    if (item.nodeName === 'section') {
      // diggs into section hierachy
      let returnSection = digger(/** @type {Element}*/ (item));
      baseSection.appendChild(returnSection);
    }
  });

  // add third measure (even if last page)
  if (includeDummyMeasures) {
    let m = dummyMeasure(xmlDoc, countStaves(scoreDef));
    m.setAttributeNS(xmlNameSpace, 'xml:id', 'endingMeasure');
    baseSection.appendChild(xmlDoc.createElementNS(meiNameSpace, 'pb'));
    baseSection.appendChild(m);
  }

  // matchTimespanningElements(xmlScore, spdScore, pageNo);

  if (includeDummyMeasures && Object.keys(pageSpanners.start).length > 0) {
    addPageSpanningElements(xmlScore, spdScore, pageSpanners, pageNo, breaks);
  }

  // insert sb elements for each element except last
  if (countingMode === 'computedBreaks' && Object.keys(breaks).length > 0 && !Array.isArray(breaks)) {
    breaks[pageNo].forEach((id, i) => {
      if (i < breaks[pageNo].length - 1) {
        // last element is a <pb>
        let m = spdScore.querySelector('[*|id="' + id + '"]');
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
      newSection.setAttribute(attrName, section.getAttribute(attrName) || '');
    });

    let children = section.childNodes;
    let lgt = children.length;
    for (let i = 0; i < lgt; i++) {
      if (countingMode === 'firstPage' && mNo >= mxMeasures)
        // exit with first page
        return newSection;
      if (p > pageNo) break; // only until requested pageNo is processed
      if (children[i].nodeType !== Node.ELEMENT_NODE) continue;
      let currentNode = /** @type {Element} */ (children[i]);
      // console.info('digDeeper(' + pageNo + '): p: ' + p +
      //   ', i: ' + i + ', ', currentNode);
      let currentNodeName = currentNode.nodeName;
      // copy expansion elements to new section
      if (currentNodeName === 'expansion') {
        newSection.appendChild(currentNode.cloneNode(true));
        continue;
      }
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
        // For 'encodedBreaks', `breaks` is an Array
        if (
          countNow &&
          currentNodeName !== 'ending' &&
          /** @type {string[]} */ (
            // @ts-ignore
            breaks.includes(currentNodeName) ||
              (sb = /** @type {Element} */ (currentNode).querySelector(breaksSelector))
          )
        ) {
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
        const { count, unit } = getMeter(scoreDef);
        if (count && unit) {
          addMeterSigElement(staffDefs, count, unit);
        }
        copyTempoInfo(scoreDef, spdScore);
      }

      // remember tempo@midi.bpm, mm, mm.unit, mm.dots and save it in global scoreDef
      if (p < pageNo) {
        currentNode.querySelectorAll('tempo').forEach((t) => {
          copyTempoInfo(t, spdScore);
        });
      }

      // scoreDef with staffDef@key.sig or keySig@sig and meter@count/@unit
      let staffDefList = currentNode.querySelectorAll(breaksSelector ? breaksSelector + ', staffDef' : 'staffDef');
      if (staffDefList && staffDefList.length > 0 && p < pageNo) {
        // console.info('staffDef: ', staffDefList);
        for (let st of staffDefList) {
          if (countingMode === 'encodedBreaks' && /** @type {string[]} */ (breaks).includes(st.nodeName)) break;
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
            // console.info('No key.sig information in ', st);
          }
          const { count, unit } = getMeter(st);
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
            // console.info('No meter.count/unit information in ', st);
          }
        }
      }
      // update scoreDef with clef elements inside layers (and breaks to stop updating)
      let clefList = currentNode.querySelectorAll(breaksSelector ? breaksSelector + ', clef' : 'clef');
      if (clefList && clefList.length > 0 && p < pageNo) {
        // console.info('clefList: ', clefList);
        for (let clef of clefList) {
          // check clefs of measure, ignore @sameas
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
          if (clef.hasAttribute('line')) staffDef.setAttribute('clef.line', clef.getAttribute('line') || '');
          if (clef.hasAttribute('shape')) staffDef.setAttribute('clef.shape', clef.getAttribute('shape') || '');
          if (clef.hasAttribute('dis')) staffDef.setAttribute('clef.dis', clef.getAttribute('dis') || '');
          if (clef.hasAttribute('dis.place'))
            staffDef.setAttribute('clef.dis.place', clef.getAttribute('dis.place') || '');
          // console.info('scoreDef: ', spdScore.querySelector('scoreDef'));
        }
      }

      // special treatment for endings that contain breaks
      if (currentNodeName === 'ending' && breaksSelector && currentNode.querySelector(breaksSelector)) {
        // copy elements containing breaks
        let endingNode = /** @type {Element} */ (currentNode.cloneNode(true));
        let breakNode = endingNode.querySelector(breaksSelector);
        if (p === pageNo && breakNode) {
          breakNode.parentNode?.replaceChild(document.createElementNS(meiNameSpace, 'pb'), breakNode);
          newSection.appendChild(endingNode);
        } else if (p === pageNo - 1 && breakNode) {
          // remove elements until first break
          // remove starting pb (in case of a pb inside endingNode)
          // or replace existing sb inside endingNode with startingPb
          let startingPd = spdScore.querySelector('[*|id="startingPb"]');
          if (startingPd && breakNode.nodeName === 'sb') {
            endingNode.replaceChild(startingPd, breakNode);
          } else {
            startingPd?.remove();
          }
          // ...and add endingNode
          newSection.appendChild(endingNode);
        }
        // console.info('Ending with break inside: ', endingNode);
        p++;
        continue;
      }

      // append children
      if (p === pageNo) {
        let nodeCopy = /** @type {Element} */ (currentNode.cloneNode(true));
        if (countingMode === 'computedBreaks') {
          // remove breaks from DOM
          nodeCopy.querySelectorAll('pb, sb').forEach((b) => nodeCopy.removeChild(b));
        }
        newSection.appendChild(nodeCopy);
        // console.info('digDeeper adds child to spdScore: ', spdScore);
      }

      // increment in countingMode computedBreaks
      if (countingMode === 'computedBreaks') {
        if (currentNodeName === 'measure' && currentNode.getAttribute('xml:id') === breaks[p][breaks[p].length - 1])
          p++;
        else {
          currentNode.querySelectorAll('measure').forEach((m) => {
            if (m.getAttribute('xml:id') === breaks[p][breaks[p].length - 1]) p++;
          });
        }
      }
    } // for loop across child nodes
    return newSection;
  }; // digDeeper()
} // readSection()

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
 * Add time-spanning elements spanning across pages to `spdScore`
 * @param {Element} xmlScore
 * @param {Element} spdScore
 * @param {PageSpanners} pageSpanners
 * @param {number} pageNo
 * @param {*} breaks
 */
function addPageSpanningElements(xmlScore, spdScore, pageSpanners, pageNo, breaks) {
  // 1) go through endingElements and add to starting measure (p. 1)
  const startingMeasure = /** @type {Element} */ (spdScore.querySelector('[*|id="startingMeasure"]'));
  let endingElementIds = pageSpanners.end[pageNo];
  if (endingElementIds && pageNo > 1) {
    for (let endingElementId of endingElementIds) {
      let endingElement = xmlScore.querySelector('[*|id="' + endingElementId + '"]');
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
  const endingMeasure = /** @type {Element} */ (spdScore.querySelector('[*|id="endingMeasure"]'));
  let startingElementIds = pageSpanners.start[pageNo];
  if (startingElementIds) {
    for (let startingElementId of startingElementIds) {
      // find element in spdScore, not in xmlScore, because it gets modified without clone
      let startingElement = spdScore.querySelector('[*|id="' + startingElementId + '"]');
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
          let el = xmlScore.querySelector('[*|id="' + elId + '"]');
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
    let startNote = xmlScore.querySelector('[*|id="' + startid + '"]');
    if (!startNote) return false;
    const staffNo = startNote.closest('staff')?.getAttribute('n') || '-1';
    if (!spdScore.querySelector('[*|id="' + startid + '"]')) {
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
        nodeList = xmlScore.querySelectorAll('measure,[*|id="' + elId + '"],' + breaks);
      } else {
        nodeList = xmlScore.querySelectorAll('measure,[*|id="' + elId + '"]');
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
 * Helper function to `readSection()`; adds `<keySig>` element to `spdScore`.
 * @param {NodeListOf<Element>} staffDefs
 * @param {string} keysigValue  The value for the `keySig/@sig` attribute.
 */
function addKeySigElement(staffDefs, keysigValue) {
  for (let staffDef of staffDefs) {
    let k = staffDef.querySelector('keySig');
    if (k) {
      k.remove();
    }
    staffDef.setAttribute('key.sig', keysigValue);
  }
} // addKeySigElement()

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
} // addMeterSigElement()

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
  } // getPageWithElement()

  page = els.findIndex((el) => el.getAttribute('xml:id') === id) + 1;
  // if element is within last measure, ...
  if (page > 1 && els[page - 1].closest('measure') === els[page - 2]) page--; // ...undo increment

  // remove leading pb in MEI file
  if (breaksOption === 'line' || breaksOption === 'encoded') {
    let j = 0;
    for (const el of music.querySelectorAll('pb,measure')) {
      if (el.nodeName !== 'pb') break;
      if (dutils.countAsBreak(el)) j++;
    }
    page -= j;
  }
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
} // minimalMEIMusicTree()

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
