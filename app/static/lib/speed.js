/* Speed mode: just feed the current page excerpt of the MEI encoding
 *  to Verovio, to minimize loading times.
 */

import * as utils from './utils.js';

export var meiNameSpace = 'http://www.music-encoding.org/ns/mei';
export var xmlNameSpace = 'http://www.w3.org/XML/1998/namespace';

// returns complete MEI code of given page (one-based), defined by sb and pb
export function getPageFromDom(xmlDoc, pageNo = 1, breaks = ['sb', 'pb']) {
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

  let countingMode = 'measures';
  if (Array.isArray(breaks)) countingMode = 'encodedBreaks';
  else if (typeof breaks == 'object') countingMode = 'computedBreaks';

  let digger = readSection(xmlScore, pageNo, spdScore, breaks, countingMode);
  let sections = xmlScore.childNodes;
  sections.forEach((item) => {
    if (item.nodeName === 'section') { // diggs into section hierachy
      spdScore = digger(item);
    }
  });

  // add third measure (even if last page)
  let m = dummyMeasure(countStaves(scoreDef));
  m.setAttributeNS(xmlNameSpace, 'xml:id', 'endingMeasure');
  baseSection.appendChild(document.createElementNS(meiNameSpace, 'pb'));
  baseSection.appendChild(m);

  matchTimespanningElements(xmlScore, spdScore, pageNo);

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
  if (countingMode == 'encodedBreaks') breaksSelector = breaks.join(', ');
  let countNow = false; // to ignore encoded page breaks before first measure
  let staffDefs = spdScore.querySelectorAll('staffDef');
  let baseSection = spdScore.querySelector('section');

  return function digDeeper(section) {
    let children = section.childNodes;
    let lgt = children.length;
    for (let i = 0; i < lgt; i++) {
      if (countingMode == 'measures' && mNo >= mxMeasures) return spdScore;
      if (p > pageNo) break; // only until requested pageNo is processed
      let currentNode = children[i];
      // console.info('digDeeper(' + pageNo + '): p: ' + p +
      //   ', i: ' + i + ', ', currentNode);
      let currentNodeName = currentNode.nodeName;
      if (currentNode.nodeType === Node.TEXT_NODE) continue;
      // ignore expansion lists
      if (['expansion'].includes(currentNodeName)) continue;
      // console.info('digDeeper currentNodeName: ', currentNodeName + ', '
      // + currentNode.getAttribute('xml:id'));
      if (currentNodeName === 'section') {
        spdScore = digDeeper(currentNode);
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
          Array.from(currentNode.querySelectorAll('measure'))
          .forEach(() => mNo++);
      } else if (countingMode === "encodedBreaks") {
        if (countNow && breaks.includes(currentNodeName)) {
          p++; // skip breaks before content (that is, a measure)
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
          baseSection.appendChild(endingNode);
        } else if (p == pageNo - 1) { // remove elements until first break
          while (!breaks.includes(endingNode.firstChild.nodeName)) {
            endingNode.removeChild(endingNode.firstChild);
          }
          baseSection.appendChild(endingNode);
        }
        // console.info('Ending with break inside: ', endingNode);
        p++;
        continue;
      }

      // append children
      if (p == pageNo) {
        let nodeCopy = currentNode.cloneNode(true);
        if (countingMode === 'computedBreaks') { // remove breaks from DOM
          Array.from(nodeCopy.querySelectorAll('pb, sb')).forEach(b => {
            if (b) nodeCopy.removeChild(b);
          });
        }
        baseSection.appendChild(nodeCopy);
        // console.info('digDeeper adds child to spdScore: ', spdScore);
      }

      // increment in countingMode computedBreaks
      if (countingMode === 'computedBreaks') {
        if (currentNodeName === 'measure' &&
          currentNode.getAttribute('xml:id') == breaks[p][breaks[p].length - 1])
          p++;
        else {
          let ms = Array.from(currentNode.querySelectorAll('measure'));
          ms.forEach(m => {
            if (m.getAttribute('xml:id') == breaks[p][breaks[p].length - 1])
              p++;
          })
        }
      }

    } // for loop across child nodes
    return spdScore;
  }
}

function matchTimespanningElements(xmlScore, spdScore, pageNo) {
  // List all notes/chords to check whether they are
  // pointed to from outside the requested pageNo
  let t1 = performance.now();
  let startingElements = [];
  let endingElements = [];
  // console.info('LoopStart startingElements: ', startingElements);
  // console.info('LoopStart endingElements: ', endingElements);
  var listOfTargets = spdScore.querySelectorAll('note, chord');
  for (let target of listOfTargets) {
    let id = '#' + target.getAttribute('xml:id');
    //
    let ends = xmlScore.querySelectorAll("[startid][endid='" + id + "']");
    ends.forEach(e => endingElements.push(e));
    let starts = xmlScore.querySelectorAll("[startid='" + id + "'][endid]");
    starts.forEach(e => startingElements.push(e));
    //
    let j; // check whether this id ends in startingElements
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
  // console.info('LoopEnd startingElements: ', startingElements);
  // console.info('LoopEnd endingElements: ', endingElements);
  let t2 = performance.now();
  console.log('timespan matching took ' + (t2 - t1) + ' ms.');

  // 1) go through endingElements and add to first measure
  if (endingElements.length > 0 && pageNo > 1) {
    let m = spdScore.querySelector('[*|id="startingMeasure"]');
    let uuids = getIdsForDummyMeasure(m);
    for (let endingElement of endingElements) {
      if (endingElement) {
        let startid = rmHash(endingElement.getAttribute('startid'));
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
        let endid = rmHash(startingElement.getAttribute('endid'));
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

  console.log('adding slurs took ' + (performance.now() - t2) + ' ms.');

} // matchTimespanningElements


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

// convert xmlNode to string and remove meiNameSpace declaration from return string
export function xmlToString(xmlNode) {
  let str = new XMLSerializer().serializeToString(xmlNode);
  // console.info('xmlToString: ' + str);
  str = str.replace(/(?:><)/g, '>\n<');
  // console.info('xmlToString: ' + str);
  return str.replace('xmlns="' + meiNameSpace + '" ', '');
}

// Retrieve page number of element with xml:id id
export function getPageWithElement(v, id) {
  let sel = '';
  let page = 1;
  if (v.speedMode) {
    let bs = document.getElementById('breaks-select').value;
    if (bs == 'none') return page;
    // for speedMode: selector for all last measures and requested id
    if (bs == 'auto' && Object.keys(v.pageBreaks).length > 0) {
      for (let pg in v.pageBreaks) {
        let br = v.pageBreaks[pg]; // array of breaks
        sel += '[*|id="' + br[br.length - 1] + '"],';
      }
      sel += '[*|id="' + id + '"]';
    } else if (bs == 'line') {
      sel = 'pb,sb,[*|id="' + id + '"]'; // find all breaks in xmlDoc
    } else if (bs == 'encoded') {
      sel = 'pb,[*|id="' + id + '"]'; // find all breaks in xmlDoc
    }
    if (sel == '') return page;
    let music = v.xmlDoc.querySelector('music score');
    let els;
    if (music) els = Array.from(music.querySelectorAll(sel));
    else return page;
    if (els) {
      page = els.findIndex(el => el.getAttribute('xml:id') == id) + 1;
      // if element is within last measure, ...
      if (page > 1 && els[page - 1].closest('measure') == els[page - 2])
        page--; // ...undo increment
    }
    if (bs == 'line' || bs == 'encoded') { // remove leading pb in MEI file
      els = music.querySelectorAll('pb,measure');
      let i;
      for (i = 0; i < els.length; i++) {
        if (els[i].nodeName != 'pb') break;
      }
      page -= i;
    }
    return page;
  }
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
 <?xml-model href="https://music-encoding.org/schema/4.0.0/mei-all.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>
 <?xml-model href="https://music-encoding.org/schema/4.0.0/mei-all.rng" type="application/xml" schematypens="http://purl.oclc.org/dsdl/schematron"?>
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

export function rmHash(hashedString) {
  if (hashedString.startsWith('#')) return hashedString.split('#')[1];
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
