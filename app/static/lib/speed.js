/* Speed mode: just feed the current page excerpt of the MEI encoding
 *  to Verovio, so minimize loading times.
 *  Currently only for --breaks = line, encoded
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
  var xmlScore = xmlDoc.querySelector("mdiv > score");
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
  var spdNode = minimalMEIFile(xmlDoc);
  let meiVersion = xmlDoc.querySelector('mei').getAttribute('meiversion');
  if (meiVersion) spdNode.setAttribute('meiversion', meiVersion);
  spdNode.appendChild(meiHeader.item(0).cloneNode(true));
  spdNode.appendChild(minimalMEIMusicTree(xmlDoc));
  var scoreDef = scoreDefs.item(0).cloneNode(true);
  // console.info('scoreDef: ', scoreDef);
  var baseSection = document.createElementNS(meiNameSpace, 'section');
  baseSection.setAttributeNS(xmlNameSpace, 'xml:id', 'baseSection');
  // console.info('section: ', baseSection);

  if (pageNo > 1) {
    var measure = dummyMeasure(countStaves(scoreDef));
    measure.setAttributeNS(xmlNameSpace, 'xml:id', 'startingMeasure');
    baseSection.appendChild(measure);
    baseSection.appendChild(document.createElementNS(meiNameSpace, 'pb'));
  }
  var spdScore = spdNode.querySelector('mdiv > score');
  // console.info('spdScore: ', spdScore);

  spdScore.appendChild(scoreDef); // is updated within readSection()
  spdScore.appendChild(baseSection);
  var digger = readSection(xmlScore, pageNo, spdScore, breaks);
  var sections = xmlScore.childNodes;
  sections.forEach((item) => {
    if (item.nodeName == 'section') { // diggs into section hierachy
      spdScore = digger(item);
    }
  });

  const serializer = new XMLSerializer();
  let mei = xmlDefs + serializer.serializeToString(spdNode);
  // console.info('Speed() MEI: ' + mei);
  return mei;
}

// recursive closure to dig through hierarchically stacked sections and append
// only those elements within the requested pageNo
function readSection(xmlScore, pageNo, spdScore, breaks) {
  let p = 1; // page count
  let m = 1; // measure count (for a fast first page, with breaks = '')
  let mxMeasures = 50; // for a quick first page
  let countingMode = 'measures';
  if (Array.isArray(breaks)) countingMode = 'encodedBreaks';
  else if (typeof breaks == 'object') countingMode = 'computedBreaks';
  let countNow = false; // to ignore encoded page breaks before first measure
  let startingElements = [];
  let endingElements = [];
  let breaksSelector = breaks.join(', '); // TODO
  return function digDeeper(section) {
    var children = section.childNodes;
    let lgt = children.length;
    for (let i = 0; i < lgt; i++) {
      // console.info('digDeeper(' + pageNo + '): p: ' + p +
      //   ', i: ' + i + ', ', children[i]);
      if (p > pageNo) break; // only until requested pageNo is processed
      if (children[i].nodeType === Node.TEXT_NODE) continue;
      var currentNodeName = children[i].nodeName;
      // ignore expansion lists
      if (['expansion'].includes(currentNodeName)) continue;
      // console.info('digDeeper currentNodeName: ', currentNodeName + ', '
      // + children[i].getAttribute('xml:id'));
      if (currentNodeName == 'section') {
        spdScore = digDeeper(children[i]);
        // console.info('digDeeper returned spdScore: ', spdScore);
        continue;
      }
      if (currentNodeName == 'measure') {
        countNow = true;
        if (countingMode == 'measures' && (m++) >= mxMeasures) return spdScore;
        if (countingMode == 'computedBreaks') {

        }
      }
      if (countingMode == "encodedBreaks" && countNow &&
        breaks.includes(currentNodeName)) {
        p++; // skip breaks before content (that is, a measure)
        continue;
      }

      // update scoreDef @key.sig attribute or keySig@sig and
      // for @meter@count/@unit attr or meterSig@count/unit.
      if (currentNodeName == 'scoreDef' && p < pageNo) {
        let value;
        // console.info('scoreDef: ', children[i]);
        if (children[i].hasAttribute('key.sig')) {
          value = children[i].getAttribute('key.sig');
          addKeySigElement(spdScore, value);
        } else if (value = children[i].querySelector('keySig')) {
          value = value.getAttribute('sig');
          if (value) addKeySigElement(spdScore, value);
        }
        if (children[i].hasAttribute('meter.count') &&
          children[i].hasAttribute('meter.unit')) {
          let meterCountValue = children[i].getAttribute('meter.count');
          let meterUnitValue = children[i].getAttribute('meter.unit');
          addMeterSigElement(spdScore, meterCountValue, meterUnitValue)
        } else if (value = children[i].querySelector('meterSig')) {
          let countValue = value.getAttribute('count');
          let unitValue = value.getAttribute('unit');
          if (countValue && unitValue)
            addMeterSigElement(spdScore, countValue, unitValue);
        }
      }
      // scoreDef with staffDef@key.sig or keySig@sig and meter@count/@unit
      var staffDefList = children[i].querySelectorAll(
        breaksSelector + ',staffDef');
      if (staffDefList && staffDefList.length > 0 && p < pageNo) {
        // console.info('staffDef: ', staffDefList);
        var staffDefs = spdScore.querySelectorAll('staffDef');
        for (let st of staffDefList) {
          if (breaks.includes(st.nodeName)) break;
          var keysigValue = '',
            meterCountValue = '',
            meterUnitValue = '';
          if (st.hasAttribute('key.sig')) {
            keysigValue = st.getAttribute('key.sig');
          }
          var keySigElement = st.querySelector('keySig');
          if (keySigElement && keySigElement.hasAttribute('sig')) {
            keysigValue = keySigElement.getAttribute('sig');
          }
          if (keysigValue != '') {
            // console.info('staffDef update: keysig: ' + keysigValue);
            for (var staffDef of staffDefs) {
              if (st.getAttribute('n') == staffDef.getAttribute('n')) {
                var el = document.createElementNS(meiNameSpace, 'keySig');
                el.setAttribute('sig', keysigValue);
                // console.info('Updating scoreDef(' + st.getAttribute('n') + '): ', el);
                var k = staffDef.querySelector('keySig');
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
            for (var staffDef of staffDefs) {
              if (st.getAttribute('n') == staffDef.getAttribute('n')) {
                var el = document.createElementNS(meiNameSpace, 'meterSig');
                el.setAttribute('count', meterCountValue);
                el.setAttribute('unit', meterUnitValue);
                // console.info('Updating scoreDef(' + st.getAttribute('n') + '): ', el);
                var k = staffDef.querySelector('meterSig');
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
      var clefList = children[i].querySelectorAll(breaksSelector + ', clef');
      if (clefList && clefList.length > 0 && p < pageNo) {
        // console.info('clefList: ', clefList);
        for (let clef of clefList) { // check clefs of measure, ignore @sameas
          if (clef.getAttribute('sameas')) continue;
          if (breaks.includes(clef.nodeName)) break;
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
      // List all notes/chords to check whether they are
      // pointed to from outside the requested pageNo
      if (p == pageNo) {
        // console.info('LoopStart startingElements: ', startingElements);
        // console.info('LoopStart endingElements: ', endingElements);
        var listOfTargets = children[i].querySelectorAll('note, chord');
        for (target of listOfTargets) {
          let id = '#' + target.getAttribute('xml:id');
          //
          let ends = section.querySelectorAll("[startid][endid='" + id + "']");
          ends.forEach(e => endingElements.push(e.getAttribute('xml:id')));
          let starts = section.querySelectorAll("[startid='" + id + "'][endid]");
          starts.forEach(e => startingElements.push(e.getAttribute('xml:id')));
          //
          let j; // check whether this id ends in startingElements
          for (j = 0; j < startingElements.length; j++) {
            let el = xmlScore.querySelector('[*|id="' + startingElements[j] + '"]');
            // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
            if (el && el.getAttribute('endid') == id) {
              // console.info('startingElement removed', startingElements[j]);
              endingElements.splice(endingElements.indexOf(startingElements[j]), 1);
              startingElements.splice(j--, 1);
            }
          }
          for (j = 0; j < endingElements.length; j++) {
            let el = xmlScore.querySelector('[*|id="' + endingElements[j] + '"]');
            // console.info('Checking identiy: ' + el.getAttribute('xml:id') + '/' + id);
            if (el && el.getAttribute('startid') == id) {
              // console.info('endingElement removed', endingElements[j]);
              startingElements.splice(startingElements.indexOf(endingElements[j]), 1);
              endingElements.splice(j--, 1);
            }
          }
        }
        // console.info('LoopEnd startingElements: ', startingElements);
        // console.info('LoopEnd endingElements: ', endingElements);
      }
      // special treatment for endings that contain breaks
      if (['ending'].includes(currentNodeName) &&
        (children[i].querySelector(breaksSelector))) {
        var endingNode = children[i].cloneNode(true); // copy elements containing breaks
        var breakNode = endingNode.querySelector(breaksSelector);
        if (p == pageNo) { // breakNode.nextSibling && breakNode.nextSibling.nodeType != Node.TEXT_NODE ||
          breakNode.parentNode.replaceChild(document.createElementNS(meiNameSpace, 'pb'), breakNode);
          spdScore.getElementsByTagName('section').item(0).appendChild(endingNode);
        } else if (p == pageNo - 1) { // remove elements until first break
          while (!breaks.includes(endingNode.firstChild.nodeName)) {
            endingNode.removeChild(endingNode.firstChild);
          }
          spdScore.getElementsByTagName('section').item(0).appendChild(endingNode);
        }
        // console.info('Ending with break inside: ', endingNode);
        p++;
        continue;
      }
      // append children
      if (p == pageNo) {
        spdScore.getElementsByTagName('section').item(0).appendChild(children[i].cloneNode(true));
        // console.info('digDeeper adds child to spdScore: ', spdScore);
      }
    }

    // console.info('2 startingElements: ', startingElements);
    // console.info('2 endingElements: ', endingElements);
    // 1) go through endingElements and add to first measure
    if (endingElements.length > 0 && pageNo > 1) {
      let m = spdScore.querySelector('[*|id="startingMeasure"]');
      let uuids = getIdsForDummyMeasure(m);
      for (e of endingElements) {
        let endingElement = xmlScore.querySelector('[*|id="' + e + '"]');
        if (endingElement) {
          let startid = removeHashFromString(endingElement.getAttribute('startid'));
          let staff = xmlScore.querySelector('[*|id="' + startid + '"]');
          let staffNo = -1;
          if (staff) staffNo = staff.closest('staff').getAttribute('n');
          else continue;
          let el = endingElement.cloneNode(true);
          el.setAttribute('startid', '#' + uuids[staffNo - 1]);
          m.appendChild(el);
        }
      }
      endingElements = [];
    }
    if (p > pageNo) {
      // 2) go through startingElements and append to a third-page measure
      var m = spdScore.querySelector('[*|id="endingMeasure"]');
      if (!m) {
        let endingMeasure = dummyMeasure(countStaves(spdScore.querySelector('scoreDef')));
        endingMeasure.setAttributeNS(xmlNameSpace, 'xml:id', 'endingMeasure');
        let sec = spdScore.querySelector('section'); //[*|id="basesec"]');
        sec.appendChild(document.createElementNS(meiNameSpace, 'pb'));
        sec.appendChild(endingMeasure);
      }
      if (startingElements.length > 0) {
        // console.info('work through startingElements.');
        m = spdScore.querySelector('[*|id="endingMeasure"]');
        let uuids = getIdsForDummyMeasure(m);
        for (s of startingElements) {
          // console.info('startingElement s: ', s);
          let startingElement = xmlScore.querySelector('[*|id="' + s + '"]');
          if (startingElement) {
            let endid = removeHashFromString(startingElement.getAttribute('endid'));
            // console.info('searching for endid: ', endid);
            if (endid) {
              let staff = xmlScore.querySelector('[*|id="' + endid + '"]');
              let staffNo = -1;
              if (staff) staffNo = staff.closest('staff').getAttribute('n');
              else continue;
              let tel = spdScore.querySelector('[*|id="' + s + '"]');
              if (tel) tel.setAttribute('endid', '#' + uuids[staffNo - 1]);
            }
          }
        }
        startingElements = [];
      }
    }
    return spdScore;
  }
}

// helper function to readSection(); adds @key.sig attribute to spdScore
function addKeySigElement(spdScore, keysigValue) {
  let keySigElement = document.createElementNS(meiNameSpace, 'keySig');
  keySigElement.setAttribute('sig', keysigValue);
  let staffDefs = spdScore.querySelectorAll('staffDef');
  for (let staffDef of staffDefs) {
    staffDef.removeAttribute('key.sig');
    let k = staffDef.querySelector('keySig');
    if (k) {
      k.setAttribute('sig', keysigValue);
    } else {
      staffDef.appendChild(keySigElement.cloneNode(true));
    }
  }
}

// helper function to readSection(); adds @meter.sig attribute to spdScore
function addMeterSigElement(spdScore, meterCountValue, meterUnitValue) {
  let meterSigElement = document.createElementNS(meiNameSpace, 'meterSig');
  meterSigElement.setAttribute('count', meterCountValue);
  meterSigElement.setAttribute('unit', meterUnitValue);
  let staffDefs = spdScore.querySelectorAll('staffDef');
  for (let staffDef of staffDefs) {
    staffDef.removeAttribute('meter.count');
    staffDef.removeAttribute('meter.unit');
    var k = staffDef.querySelector('meterSig');
    if (k) {
      k.setAttribute('count', meterCountValue);
      k.setAttribute('unit', meterUnitValue);
    } else {
      staffDef.appendChild(meterSigElement.cloneNode(true));
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

// EXPERIMENTAL SKETCH: go through pages from Verovio to remember page breaks
export function getBreaksFromToolkit(tk, text) {
  tk.setOptions(this.vrvOptions);
  tk.loadData(text);
  tk.redoLayout();
  var pageCount = tk.getPageCount();
  // start from page 2 and go through document
  for (let p = 2; p <= pageCount; p++) {
    var svg = tk.renderToSVG(p);
    // console.log('SVG page: ' + p + '.');
    // console.info(svg);
    // find first occurrence of <g id="measure-0000001450096684" class="measure">
    var m = svg.match(/(?:<g\s)(?:id=)(?:['"])(\S+?)(?:['"])\s+?(?:class="measure">)/);
    // console.info('Match: ', m);
    if (m && m.length > 1)
      console.info('Page ' + p + ', breaks before ' + m[1]);
  }
}

// select
export function getRangeOfString(buffer, str) {
  let range;
  buffer.scan(str, (obj) => {
    range = obj.range;
    obj.stop();
  });
  return range;
}

// convert xmlNode to string and remove meiNameSpace declaration from return string
export function xmlToString(xmlNode) {
  let str = new XMLSerializer().serializeToString(xmlNode);
  // console.info('xmlToString: ' + str);
  str = str.replace(/(?:><)/g, '>\n<');
  // console.info('xmlToString: ' + str);
  return str.replace('xmlns="' + meiNameSpace + '" ', '');
}

export function getPageNumberAtCursor(textEditor, breaks = ['pb', 'sb']) {
  let cursorRow = textEditor.getCursorBufferPosition().row;
  let text = textEditor.getBuffer();
  let maxLines = text.getLineCount();
  let pageNo = 1; // page number is one-based
  let row = 0;
  let countPages = false,
    hasBreak = false;
  while (row <= cursorRow && row <= maxLines) {
    let line = text.lineForRow(row++);
    if (line.includes('measure')) countPages = true; // skip trailing breaks
    if (countPages) {
      for (let i = 0; i < breaks.length; i++) { // check breaks list
        if (line.includes('<' + breaks[i])) hasBreak = true;
      }
      if (hasBreak) {
        pageNo++;
        hasBreak = false;
      }
    }
  }
  return pageNo;
}

// EXPERIMENTAL SKETCH
export function getPageNumberForElement(xmlDoc, xmlNode) {
  nodeList = xmlDoc.querySelectorAll('pb, sb, *|id="' + xmlNode.getAttribute('xml:id') + '"');
  console.info('nodeLIST: ', nodeList);
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
    note = document.createElementNS(meiNameSpace, 'note');
    note.setAttribute('pname', 'a');
    note.setAttribute('oct', '3');
    note.setAttribute('dur', '1');
    let uuid = 'note-' + utils.generateUUID();
    note.setAttributeNS(xmlNameSpace, 'xml:id', uuid);
    layer = document.createElementNS(meiNameSpace, 'layer')
    layer.setAttribute('n', '1');
    layer.appendChild(note);
    staff = document.createElementNS(meiNameSpace, 'staff');
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

export function removeHashFromString(hashedString) {
  if (hashedString.startsWith('#'))
    hashedString = hashedString.split('#')[1];
  return hashedString;
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
