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

// returns complete MEI code of given page (one-based), defined by sb and pb
export function getPageFromDom(xmlDoc, pageNo = 1, breaks = ['sb', 'pb'], pageSpanners) {
  let meiHeader = xmlDoc.getElementsByTagName('meiHead');
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
  let scoreDefs = xmlScore.getElementsByTagName("scoreDef");
  if (!scoreDefs) {
    console.info('getPageFromDom(): no scoreDefs element');
    return;
  }
  // console.info('scoreDef: ', scoreDefs);

  // determine one of three counting modes
  let countingMode = 'measures'; // quick first page for xx measures
  if (Array.isArray(breaks))
    countingMode = 'encodedBreaks'; // encoded sb and pb as provided
  else if (typeof breaks == 'object' && Object.keys(breaks).length > 0)
    countingMode = 'computedBreaks'; // breaks object
  if (countingMode === 'measures') pageNo = 1; // for quick first page, always 1

  // construct new MEI node for Verovio engraving
  let spdNode = minimalMEIFile(xmlDoc);
  let meiVersion = xmlDoc.querySelector('mei').getAttribute('meiversion');
  if (meiVersion) spdNode.setAttribute('meiversion', meiVersion);
  spdNode.appendChild(meiHeader.item(0).cloneNode(true));
  spdNode.appendChild(minimalMEIMusicTree(xmlDoc));
  var scoreDef = scoreDefs.item(0).cloneNode(true);
  // console.info('scoreDef: ', scoreDef);
  let baseSection = document.createElementNS(meiNameSpace, 'section');
  baseSection.setAttributeNS(xmlNameSpace, 'xml:id', 'baseSection');
  // console.info('section: ', baseSection);

  if (pageNo > 1) {
    let measure = dummyMeasure(countStaves(scoreDef));
    measure.setAttributeNS(xmlNameSpace, 'xml:id', 'startingMeasure');
    baseSection.appendChild(measure);
    baseSection.appendChild(document.createElementNS(meiNameSpace, 'pb'));
  }
  let spdScore = spdNode.querySelector('mdiv > score');
  // console.info('spdScore: ', spdScore);

  spdScore.appendChild(scoreDef); // is updated within readSection()
  spdScore.appendChild(baseSection);

  let digger = readSection(pageNo, spdScore, breaks, countingMode);
  let sections = xmlScore.childNodes;
  sections.forEach((item) => {
    if (item.nodeName === 'section') { // diggs into section hierachy
      let returnSection = digger(item);
      baseSection.appendChild(returnSection);
    }
  });

  // add third measure (even if last page)
  let m = dummyMeasure(countStaves(scoreDef));
  m.setAttributeNS(xmlNameSpace, 'xml:id', 'endingMeasure');
  baseSection.appendChild(document.createElementNS(meiNameSpace, 'pb'));
  baseSection.appendChild(m);

  // matchTimespanningElements(xmlScore, spdScore, pageNo);

  if (pageSpanners.start && Object.keys(pageSpanners.start).length > 0)
    addPageSpanningElements(xmlScore, spdScore, pageSpanners, pageNo);

  // insert sb elements for each element except last
  if (countingMode === 'computedBreaks' && Object.keys(breaks).length > 0) {
    breaks[pageNo].forEach((id, i) => {
      if (i < breaks[pageNo].length - 1) { // last element is a <pb>
        let m = spdScore.querySelector('[*|id="' + id + '"]');
        // console.info("spd(p:" + pageNo + " i:" + i + "): id=" + id + ", m:", m);
        if (m) {
          let sb = document.createElementNS(meiNameSpace, 'sb');
          let next = m.nextSibling;
          let parent = m.parentNode;
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

// recursive closure to dig through hierarchically stacked sections and append
// only those elements within the requested pageNo
function readSection(pageNo, spdScore, breaks, countingMode) {
  let p = 1; // page count
  let mNo = 1; // measure count (for a fast first page, with breaks = '')
  let mxMeasures = 50; // for a quick first page
  let breaksSelector = '';
  if (countingMode === 'encodedBreaks') breaksSelector = breaks.join(', ');
  let countNow = false; // to ignore encoded page breaks before first measure
  let staffDefs = spdScore.querySelectorAll('staffDef');
  let baseSection = spdScore.querySelector('section');

  return function digDeeper(section) {
    // create a copy of section and copy attributes
    let newSection = document.createElementNS(meiNameSpace, 'section');
    section.getAttributeNames().forEach(attrName => {
      newSection.setAttribute(attrName, section.getAttribute(attrName))
    });

    let children = section.childNodes;
    let lgt = children.length;
    for (let i = 0; i < lgt; i++) {
      if (countingMode == 'measures' && mNo >= mxMeasures) return newSection;
      if (p > pageNo) break; // only until requested pageNo is processed
      let currentNode = children[i];
      // console.info('digDeeper(' + pageNo + '): p: ' + p +
      //   ', i: ' + i + ', ', currentNode);
      let currentNodeName = currentNode.nodeName;
      if (currentNode.nodeType === Node.TEXT_NODE || currentNode.nodeType === Node.COMMENT_NODE) continue;
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
        countNow = true;
        // increment m when counting measures for a quick first page
      }

      if (countingMode === 'measures') {
        if (currentNodeName === 'measure') mNo++;
        else
          currentNode.querySelectorAll('measure').forEach(() => mNo++);
      } else if (countingMode === 'encodedBreaks') {
        let sb;
        if (countNow && (breaks.includes(currentNodeName) || (sb = currentNode.querySelector(breaksSelector)))) {
          if (dutils.countAsBreak(sb ? sb : currentNode)) p++;
          continue;
        }
        // ignore system/page breaks in other countingModes
      } else if (currentNodeName == 'sb' || currentNodeName == 'pb') continue;

      // update scoreDef @key.sig attribute or keySig@sig and
      // for @meter@count/@unit attr or meterSig@count/unit.
      if (currentNodeName === 'scoreDef' && p < pageNo) {
        let value;
        // console.info('scoreDef: ', currentNode);
        if (currentNode.hasAttribute('key.sig')) {
          value = currentNode.getAttribute('key.sig');
          addKeySigElement(staffDefs, value);
        } else if (value = currentNode.querySelector('keySig')) {
          value = value.getAttribute('sig');
          if (value) addKeySigElement(staffDefs, value);
        }
        if (currentNode.hasAttribute('meter.count') &&
          currentNode.hasAttribute('meter.unit')) {
          let meterCountValue = currentNode.getAttribute('meter.count');
          let meterUnitValue = currentNode.getAttribute('meter.unit');
          addMeterSigElement(staffDefs, meterCountValue, meterUnitValue)
        } else if (value = currentNode.querySelector('meterSig')) {
          let countValue = value.getAttribute('count');
          let unitValue = value.getAttribute('unit');
          if (countValue && unitValue)
            addMeterSigElement(staffDefs, countValue, unitValue);
        }
      }
      // scoreDef with staffDef@key.sig or keySig@sig and meter@count/@unit
      let staffDefList = currentNode.querySelectorAll(
        breaksSelector ? breaksSelector + ', staffDef' : 'staffDef');
      if (staffDefList && staffDefList.length > 0 && p < pageNo) {
        // console.info('staffDef: ', staffDefList);
        for (let st of staffDefList) {
          if (countingMode === 'encodedBreaks' && breaks.includes(st.nodeName))
            break;
          let keysigValue = '';
          let meterCountValue = '';
          let meterUnitValue = '';
          if (st.hasAttribute('key.sig')) {
            keysigValue = st.getAttribute('key.sig');
          }
          let keySigElement = st.querySelector('keySig');
          if (keySigElement && keySigElement.hasAttribute('sig')) {
            keysigValue = keySigElement.getAttribute('sig');
          }
          if (keysigValue != '') {
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
          if (st.hasAttribute('meter.count')) {
            meterCountValue = st.getAttribute('meter.count');
          }
          if (st.hasAttribute('meter.unit')) {
            meterUnitValue = st.getAttribute('meter.unit');
          }
          var meterSigElement = st.querySelector('meterSig');
          if (meterSigElement && meterSigElement.hasAttribute('count')) {
            meterCountValue = meterSigElement.getAttribute('count');
          }
          if (meterSigElement && meterSigElement.hasAttribute('unit')) {
            meterUnitValue = meterSigElement.getAttribute('unit');
          }
          if (meterCountValue != '' && meterUnitValue != '') {
            // console.info('staffDef update: meterSig: ' +
            //   meterCountValue + '/' + meterUnitValue);
            for (let staffDef of staffDefs) {
              if (st.getAttribute('n') === staffDef.getAttribute('n')) {
                let el = document.createElementNS(meiNameSpace, 'meterSig');
                el.setAttribute('count', meterCountValue);
                el.setAttribute('unit', meterUnitValue);
                // console.info('Updating scoreDef(' + st.getAttribute('n') + '): ', el);
                let k = staffDef.querySelector('meterSig');
                if (k) {
                  k.setAttribute('count', meterCountValue);
                  k.setAttribute('unit', meterUnitValue);
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
          if (countingMode == 'encodedBreaks' && breaks.includes(clef.nodeName))
            break;
          let staff = clef.closest('staff, staffDef');
          let staffNo = -1;
          if (staff) staffNo = staff.getAttribute('n');
          else continue;
          // console.info('clefList stffNo: ' + stffNo);
          let staffDef = findByAttributeValue(spdScore, 'n', staffNo, 'staffDef');
          // console.info('staffDef: ', staffDef);
          if (clef.hasAttribute('line'))
            staffDef.setAttribute('clef.line', clef.getAttribute('line'));
          if (clef.hasAttribute('shape'))
            staffDef.setAttribute('clef.shape', clef.getAttribute('shape'));
          if (clef.hasAttribute('dis'))
            staffDef.setAttribute('clef.dis', clef.getAttribute('dis'));
          if (clef.hasAttribute('dis.place'))
            staffDef.setAttribute('clef.dis.place', clef.getAttribute('dis.place'));
          // console.info('scoreDef: ', spdScore.querySelector('scoreDef'));
        }
      }

      // special treatment for endings that contain breaks
      if (currentNodeName === 'ending' && breaksSelector &&
        (currentNode.querySelector(breaksSelector))) {
        // copy elements containing breaks
        let endingNode = currentNode.cloneNode(true);
        let breakNode = endingNode.querySelector(breaksSelector);
        if (p == pageNo) {
          breakNode.parentNode.replaceChild(
            document.createElementNS(meiNameSpace, 'pb'), breakNode);
          newSection.appendChild(endingNode);
        } else if (p == pageNo - 1) { // remove elements until first break
          while (!breaks.includes(endingNode.firstChild.nodeName)) {
            endingNode.removeChild(endingNode.firstChild);
          }
          newSection.appendChild(endingNode);
        }
        // console.info('Ending with break inside: ', endingNode);
        p++;
        continue;
      }

      // append children
      if (p == pageNo) {
        let nodeCopy = currentNode.cloneNode(true);
        if (countingMode === 'computedBreaks') { // remove breaks from DOM
          nodeCopy.querySelectorAll('pb, sb').forEach(b => {
            if (b) nodeCopy.removeChild(b);
          });
        }
        newSection.appendChild(nodeCopy);
        // console.info('digDeeper adds child to spdScore: ', spdScore);
      }

      // increment in countingMode computedBreaks
      if (countingMode === 'computedBreaks') {
        if (currentNodeName === 'measure' &&
          currentNode.getAttribute('xml:id') == breaks[p][breaks[p].length - 1])
          p++;
        else {
          currentNode.querySelectorAll('measure').forEach(m => {
            if (m.getAttribute('xml:id') == breaks[p][breaks[p].length - 1])
              p++;
          })
        }
      }

    } // for loop across child nodes
    return newSection;
  }
}

// List all notes/chords to check whether they are
// pointed to from outside the requested pageNo
// to be run at each edit/page turn (becomes slow with big files)
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
  let j; // check whether this id ends in startingElements
  for (let target of listOfTargets) {
    let id = '#' + target.getAttribute('xml:id');
    for (j = 0; j < startingElements.length; j++) {
      let el = startingElements[j];
      // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
      if (el && el.getAttribute('endid') === id) {
        // console.info('startingElement removed', startingElements[j]);
        endingElements.splice(endingElements.indexOf(el), 1);
        startingElements.splice(j--, 1);
      }
    }
    for (j = 0; j < endingElements.length; j++) {
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
    let m = spdScore.querySelector('[*|id="startingMeasure"]');
    let uuids = getIdsForDummyMeasure(m);
    for (let endingElement of endingElements) {
      if (endingElement) {
        let startid = utils.rmHash(endingElement.getAttribute('startid'));
        let note = xmlScore.querySelector('[*|id="' + startid + '"]');
        let staffNo = -1;
        if (note) staffNo = note.closest('staff').getAttribute('n');
        else continue;
        let el = endingElement.cloneNode(true);
        el.setAttribute('startid', '#' + uuids[staffNo - 1]);
        m.appendChild(el);
      }
    }
  } // 1) if

  // 2) go through startingElements and append to a third-page measure
  var m = spdScore.querySelector('[*|id="endingMeasure"]');
  if (startingElements.length > 0) {
    // console.info('work through startingElements.');
    m = spdScore.querySelector('[*|id="endingMeasure"]');
    let uuids = getIdsForDummyMeasure(m);
    for (let startingElement of startingElements) {
      if (startingElement) {
        let endid = utils.rmHash(startingElement.getAttribute('endid'));
        // console.info('searching for endid: ', endid);
        if (endid) {
          let note = xmlScore.querySelector('[*|id="' + endid + '"]');
          let staffNo = -1;
          if (note) staffNo = note.closest('staff').getAttribute('n');
          else continue;
          let tel = spdScore.querySelector('[*|id="' +
            startingElement.getAttribute('xml:id') + '"]');
          if (tel) tel.setAttribute('endid', '#' + uuids[staffNo - 1]);
        }
      }
    }
  } // 2) if

  // console.log('adding slurs took ' + (performance.now() - t4) + ' ms.');

} // matchTimespanningElements

// list all timespanning elements with @startid/@endid attr on different pages
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
      return {};
    case 'auto':
      if (Object.keys(breaks).length > 0) {
        for (let pg in breaks) {
          let br = breaks[pg]; // array of breaks
          sel += '[*|id="' + br[br.length - 1] + '"],';
        }
      } else return {};
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
  if (breaksOption == 'line' || breaksOption == 'encoded') {
    for (let e of elList) {
      if (e.nodeName === 'measure') count = true;
      if (count && breaks.includes(e.nodeName) && dutils.countAsBreak(e)) p++;
      else
        noteTable[e.getAttribute('xml:id')] = p;
    }
  } else if (breaksOption = 'auto') {
    let m;
    for (let e of elList) {
      if (e.nodeName === 'measure') {
        p++;
        m = e;
      } else {
        noteTable[e.getAttribute('xml:id')] =
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


// add time-spanning elements spanning across page to spdScore
function addPageSpanningElements(xmlScore, spdScore, pageSpanners, pageNo) {
  if (pageSpanners.start === 'invalid') return;

  // 1) go through endingElements and add to first measure
  let endingElementIds = pageSpanners.end[pageNo];
  if (endingElementIds && pageNo > 1) {
    let m = spdScore.querySelector('[*|id="startingMeasure"]');
    for (let endingElementId of endingElementIds) {
      let endingElement =
        xmlScore.querySelector('[*|id="' + endingElementId + '"]');
      if (!endingElement) continue;
      let startid = utils.rmHash(endingElement.getAttribute('startid'));
      let startNote = xmlScore.querySelector('[*|id="' + startid + '"]');
      let staffNo = -1;
      if (startNote)
        staffNo = startNote.closest('staff').getAttribute('n');
      else continue;
      if (!spdScore.querySelector('[*|id="' + startid + '"]')) {
        let staff = m.querySelector('staff[n="' + staffNo + '"]');
        staff.querySelector('layer').appendChild(startNote.cloneNode(true));
      }
      m.appendChild(endingElement.cloneNode(true));
    }
  } // 1) if

  // 2) go through startingElements and append to a third-page measure
  let startingElementIds = pageSpanners.start[pageNo];
  if (startingElementIds) {
    let m = spdScore.querySelector('[*|id="endingMeasure"]');
    for (let startingElementId of startingElementIds) {
      let startingElement =
        xmlScore.querySelector('[*|id="' + startingElementId + '"]');
      if (!startingElement) continue;
      let endid = utils.rmHash(startingElement.getAttribute('endid'));
      // console.info('searching for endid: ', endid);
      if (endid) {
        let endNote = xmlScore.querySelector('[*|id="' + endid + '"]');
        let staffNo = -1;
        if (endNote) staffNo = endNote.closest('staff').getAttribute('n');
        else continue;
        if (!spdScore.querySelector('[*|id="' + endid + '"]')) {
          let staff = m.querySelector('staff[n="' + staffNo + '"]');
          staff.querySelector('layer').appendChild(endNote.cloneNode(true));
        }
      }
    }
  }
}


// helper function to readSection(); adds keySig element to spdScore
function addKeySigElement(staffDefs, keysigValue) {
  for (let staffDef of staffDefs) {
    staffDef.removeAttribute('key.sig');
    let k = staffDef.querySelector('keySig');
    if (k) {
      k.setAttribute('sig', keysigValue);
    } else {
      let keySigElement = document.createElementNS(meiNameSpace, 'keySig');
      keySigElement.setAttribute('sig', keysigValue);
      staffDef.appendChild(keySigElement);
    }
  }
}

// helper function to readSection(); adds @meter.sig attribute to spdScore
function addMeterSigElement(staffDefs, meterCountValue, meterUnitValue) {
  for (let staffDef of staffDefs) {
    staffDef.removeAttribute('meter.count');
    staffDef.removeAttribute('meter.unit');
    var k = staffDef.querySelector('meterSig');
    if (k) {
      k.setAttribute('count', meterCountValue);
      k.setAttribute('unit', meterUnitValue);
    } else {
      let meterSigElement = document.createElementNS(meiNameSpace, 'meterSig');
      meterSigElement.setAttribute('count', meterCountValue);
      meterSigElement.setAttribute('unit', meterUnitValue);
      staffDef.appendChild(meterSigElement);
    }
  }
}

// returns an xml node with a given attribute-value pair,
// optionally combined with an elementName string
export function findByAttributeValue(xmlNode, attribute, value, elementName = "*") {
  var list = xmlNode.getElementsByTagName(elementName);
  for (var i = 0; i < list.length; i++) {
    if (list[i].getAttribute(attribute) == value) {
      return list[i];
    }
  }
}

// Retrieve page number of element with xml:id id
export function getPageWithElement(xmlDoc, breaks, id) {
  let sel = '';
  let page = 1;
  let breaksOption = document.getElementById('breaks-select').value;
  switch (breaksOption) {
    case 'none':
      return page;
      // for speedMode: selector for all last measures and requested id
    case 'auto':
      if (!Array.isArray(breaks) &&
        Object.keys(breaks).length > 0) {
        for (let pg in breaks) {
          let br = breaks[pg]; // array of breaks
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
  let music = xmlDoc.querySelector('music score');
  if (!music) music = xmlDoc;
  let els;
  if (music) {
    els = Array.from(music.querySelectorAll(sel));
    for (let i = els.length - 1; i >= 0; i--) {
      if (!dutils.countAsBreak(els[i])) els.splice(i, 1);
    }
  } else {
    return page;
  }

  if (els) {
    page = els.findIndex(el => el.getAttribute('xml:id') === id) + 1;
    // if element is within last measure, ...
    if (page > 1 && els[page - 1].closest('measure') === els[page - 2])
      page--; // ...undo increment
  }
  // remove leading pb in MEI file
  if (breaksOption === 'line' || breaksOption === 'encoded') {
    els = music.querySelectorAll('pb,measure');
    let j = 0;
    for (let i = 0; i < els.length; i++) {
      if (els[i].nodeName !== 'pb') break;
      if (dutils.countAsBreak(els[i])) j++;
    }
    page -= j;
  }
  return page;
}

// returns an xmlNode with a <mei> element
function minimalMEIFile(xmlNode) {
  var mei = xmlNode.createElementNS(meiNameSpace, 'mei');
  return mei;
}

// returns the music xmlNode with body, mdiv, and score in it
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

// returns a minimal MEI header as xmlNode with MEI meiNameSpace
function minimalMEIHeader(xmlNode) {
  meiHead = xmlNode.createElementNS(meiNameSpace, 'meiHead');
  fileDesc = xmlNode.createElementNS(meiNameSpace, 'fileDesc');
  titleStmt = xmlNode.createElementNS(meiNameSpace, 'titleStmt');
  title = xmlNode.createElementNS(meiNameSpace, 'title');
  titleText = xmlNode.createTextNode('Speed Mode Header');
  pubStmt = xmlNode.createElementNS(meiNameSpace, 'pubStmt');
  respStmt = xmlNode.createElementNS(meiNameSpace, 'respStmt');
  persName = xmlNode.createElementNS(meiNameSpace, 'persName');
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


// creates a dummy measure with n staves
export function dummyMeasure(staves = 2) {
  var m = document.createElementNS(meiNameSpace, 'measure');
  let i;
  for (i = 1; i <= staves; i++) {
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
    staff.setAttribute('n', i);
    staff.appendChild(layer);
    m.appendChild(staff);
  }
  return m;
}

// generate and return array of xml:ids for dummyMeasure notes (one note per staff)
export function getIdsForDummyMeasure(dummyMeasure) {
  let notes = dummyMeasure.querySelectorAll('note');
  let uuids = [];
  let i;
  for (i = 0; i < notes.length; i++) {
    uuids[i] = notes[i].getAttribute('xml:id');
  }
  return uuids;
}

// returns number of staff elements within scoreDef
export function countStaves(scoreDef) {
  return scoreDef.querySelectorAll('staffDef').length;
}

// filter selected elements and keep only highest in DOM
export function filterElements(arr, xmlDoc) {
  let i, j, elj;
  for (i = 0; i < arr.length; i++) {
    for (j = i + 1; j < arr.length; j++) {
      elj = xmlDoc.querySelector('[*|id="' + arr[j] + '"]');
      if (!elj) continue;
      if (elj.closest('[*|id="' + arr[i] + '"]')) {
        arr.splice(j--, 1);
      }
    }
  }
  return arr;
}
