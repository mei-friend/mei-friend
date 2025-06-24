import * as e from './editor.js';
import * as dutils from './dom-utils.js';
import { translator } from './main.js';

const xmlIdString = /(?:xml:id=)(?:['"])(\S+?)(?:['"])/;
const numberLikeString = /(?:n=)(?:['"])(\d+?)(?:['"])/;
const closingTag = /(?:<[/])(\S+?)(?:[>])/;

/**
 * JSON helper function: returns the object named key of the JSON object obj
 * @param {*} key
 * @param {*} obj
 * @returns
 */
export function findKey(key, obj) {
  // console.info('findKey: ' + key + '. ', obj);
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.includes(key)) {
      return obj[key];
    } else {
      for (let k of keys) {
        let val = findKey(key, obj[k]);
        if (val) return val;
      }
    }
  }
} // findKey()

/**
 * SVG search: checks whether note noteId is inside a chord.
 * Returns false or the chord id.
 * @param {string} noteId
 * @param {string} what
 * @returns {string|boolean}
 */
export function insideParent(noteId, what = 'chord') {
  if (noteId) {
    let note = document.querySelector('g#' + escapeXmlId(noteId));
    let chord;
    if (note) chord = note.closest('.' + what);
    if (chord) return chord.getAttribute('id');
  }
  return false;
} // insideParent()

/**
 * SVG search: finds all chords/notes inside an element
 * and returns array of id strings
 * @param {string} elId
 * @returns {string}
 */
export function findNotes(elId) {
  let idArray = [];
  if (elId) {
    let notes = Array.from(document.querySelector('g#' + escapeXmlId(elId)).querySelectorAll('.note'));
    // if no child notes, but a plist attribute such as in beamSpan, go through those elements
    if (notes.length <= 0) {
      let el = document.querySelector('[*|id="' + elId + '"]');
      if (el && el.hasAttribute('data-plist')) {
        el.getAttribute('data-plist')
          .split(' #')
          .map((e) => notes.push(document.querySelector('[*|id="' + rmHash(e) + '"]')));
      }
    }
    for (let note of notes) {
      let noteId = note.getAttribute('id');
      let chordId = insideParent(noteId);
      if (chordId && !idArray.includes(chordId)) {
        idArray.push(chordId);
      } else if (!chordId) {
        idArray.push(noteId);
      }
    }
  }
  return idArray;
} // findNotes()

/**
 * CodeMirror search: look for elementname (e.g., 'staff') upwards
 * in the xml file and return attribute value (searchString defaults
 * to the "@n" attribute).
 * @param {CodeMirror} cm
 * @param {number} row
 * @param {string} elementName
 * @param {RegExp} searchString
 * @returns
 */
export function getElementAttributeAbove(
  cm,
  row,
  elementName = 'staff',
  searchString = /(?:n=)(?:['"])(\d+?)(?:['"])/
) {
  let line;
  while ((line = cm.getLine(--row))) {
    if (line.includes('<' + elementName)) {
      let match = line.match(searchString);
      return [match && match.length > 0 ? match[1] : 1, row];
    }
  }
  return [null, null];
} // getElementAttributeAbove()

/**
 * CodeMirror search:  look for elementname (e.g., 'staff') downwards
 * in the xml file and return attribute value (searchString defaults
 * to the "@n" attribute).
 * @param {CodeMirror} cm
 * @param {number} row
 * @param {string} elementName
 * @param {RegExp} searchString
 * @returns
 */
export function getElementAttributeBelow(
  cm,
  row,
  elementName = 'staff',
  searchString = /(?:n=)(?:['"])(\d+?)(?:['"])/
) {
  let line;
  while ((line = cm.getLine(++row))) {
    if (line.includes('<' + elementName)) {
      let match = line.match(searchString);
      return [match && match.length > 0 ? match[1] : 1, row];
    }
  }
  return [null, null];
} // getElementAttributeBelow()

/**
 * CodeMirror operation: Move encoding cursor to end of current measure
 * @param {CodeMirror} cm
 * @param {CodeMirror.point} p
 * @returns
 */
export function moveCursorToEndOfMeasure(cm, p = null) {
  const measureEnd = '</measure';
  if (!p) p = cm.getCursor();
  for (; p.line < cm.lineCount(); p.line++) {
    let line = cm.getLine(p.line);
    if (line.includes(measureEnd)) {
      p.ch = line.indexOf(measureEnd);
      cm.setCursor(p);
      return p;
    }
  }
  return {
    line: null,
    ch: null,
  };
} // moveCursorToEndOfMeasure()

/**
 * CodeMirror operation: Searches position of id in encoding,
 * puts cursor to the beginning of the corresponding tag start,
 * and scrolls view there.
 * @param {CodeMirror} cm
 * @param {string} id
 * @returns {boolean} success in finding id
 */
export function setCursorToId(cm, id) {
  if (!id) return;
  let c = cm.getSearchCursor(new RegExp(`(?:['"])` + id + `(?:['"])`));
  if (c.findNext()) {
    cm.setCursor(c.from());
    goTagStart(cm);

    // scroll current cursor into view, vertically centering the view
    let enc = document.querySelector('.CodeMirror'); // retrieve size of CodeMirror panel
    if (enc) {
      cm.scrollIntoView(null, Math.round(enc.clientHeight / 2));
    }
    return true;
  } else {
    return false;
  }
} // setCursorToId()

/**
 * CodeMirror operation: Moves cursor of CodeMirror to start of tag
 * @param {CodeMirror} cm
 */
export function goTagStart(cm) {
  let tagStart = /<[\w]+?/;
  let p = cm.getCursor();
  let line = cm.getLine(p.line);
  let found = line.slice(0, p.ch).match(tagStart);
  while (!found && p.line > 0) {
    line = cm.getLine(--p.line);
    found = line.match(tagStart);
  }
  if (found) {
    p.ch = line.lastIndexOf(found[found.length - 1]);
    cm.setCursor(p);
  } else {
    console.warn('Cannot find tag start.');
  }
} // goTagStart()

/**
 * CodeMirror search: Find attribute (@startid) of element with itemId
 * in textEditor.getBuffer() and return value of attribute ('note-00123')
 * or null, if nothing found
 * @param {CodeMirror} cm
 * @param {string} itemId
 * @param {string} attribute
 * @returns {string|null}
 */
export function getAttributeById(cm, itemId, attribute = 'startid') {
  var searchRegExp = '<[\\w.-]+?\\s+?(?:xml:id="' + itemId + '")[^>]*?>';
  let c = cm.getSearchCursor(new RegExp(searchRegExp));
  var elementString = '';
  if (c.findNext()) elementString = cm.getRange(c.from(), c.to());
  // console.info('elementString: |' + elementString + '|');
  searchRegExp = `(?:` + attribute + `=)(?:['"])(\\S+?)(?:['"])`;
  let attVal = elementString.match(new RegExp(searchRegExp));
  if (attVal && attVal.length > 0) attVal = attVal[1];
  // console.info('startid: |' + startid + '|')
  return attVal;
} // getAttributeById()

// scans through text from cursorPosition to find next element elementName
// (e.g. 'note'), also matching staff and layer
export function getIdOfNextElement(cm, rw, elementNames = dutils.navElsArray, direction = 'forwards') {
  let row = rw;
  let line;
  let layerNo = parseInt(getElementAttributeAbove(cm, row, 'layer', numberLikeString)[0]);
  let staffNo = parseInt(getElementAttributeAbove(cm, row, 'staff', numberLikeString)[0]);
  // console.info('getIdOfNextElement("' + elementNames + '", "' + direction + '").');

  if (direction === 'forwards') {
    while ((line = cm.getLine(++row))) {
      let found = false;
      for (let el of elementNames) {
        if (line.includes('<' + el)) {
          found = true;
          break;
        }
      }
      if (
        found &&
        staffNo === parseInt(getElementAttributeAbove(cm, row, 'staff', numberLikeString)[0]) &&
        layerNo === parseInt(getElementAttributeAbove(cm, row, 'layer', numberLikeString)[0])
      ) {
        // && (layerNo === layerN)
        break;
      }
    }
  } else if (direction === 'backwards') {
    while ((line = cm.getLine(--row))) {
      let found = false;
      for (let el of elementNames) {
        if (line.includes('<' + el)) {
          found = true;
          break;
        }
      }
      if (
        found &&
        staffNo === parseInt(getElementAttributeAbove(cm, row, 'staff', numberLikeString)[0]) &&
        layerNo === parseInt(getElementAttributeAbove(cm, row, 'layer', numberLikeString)[0])
      ) {
        // && (layerNo === layerN)
        break;
      }
    }
  }

  if (typeof line === 'undefined') return ['', row.toString()];
  // console.info('  line: ' + line);
  let uuid = line.match(xmlIdString);
  if (uuid) {
    //versionLabel.innerText =  uuid + ', OrigStaff=' +
    //staffNo + '; OrigLayer=' + layerNo;
    return [uuid[1], row.toString()];
  } else {
    return ['', row.toString()];
  }
} // getIdOfNextElement()

/**
 * CodeMirror search: Returns xml:id of current element (at encoding cursor position).
 * If empty, search for next higher staff or measure xml:id
 * @param {CodeMirror} cm
 * @returns
 */
export function getElementIdAtCursor(cm) {
  let tag;
  let cursor = cm.getCursor();
  if (cursor.line === 0 && cursor.ch === 0) return null;
  let line = cm.getLine(cursor.line);
  // check if cursor is on a closing tag by stepping backwards
  for (let j = cursor.ch; j > 0; j--) {
    if (line[j] === '/' && line[j - 1] === '<') {
      // if closing tag is found, find the name of the tag with regex
      tag = line.slice(j - 1).match(closingTag);
      if (tag && Array.isArray(tag)) {
        tag = tag[1];
        break;
      }
    }
  }
  // if closing tag identified, find opening and closing tag
  let from = {
    line: 0,
    ch: 0,
  };
  let to = {
    line: 0,
    ch: 0,
  };
  let startRegEx = /(<\S+?\s+?)/; // self-closing elements
  let endRegEx = /\/>/;
  if (tag) {
    // element tag with closing tag
    startRegEx = `<${tag}`;
    endRegEx = `</${tag}`;
  }
  for (let k = cursor.line; k >= 0; k--) {
    if (cm.getLine(k).match(startRegEx)) {
      from.line = k;
      break;
    }
  }
  for (let k = cursor.line; k < cm.lineCount(); k++) {
    let m;
    if ((m = cm.getLine(k).match(endRegEx))) {
      to.line = k;
      to.ch = m.index;
      break;
    }
  }
  // search for xml:id in row
  let result = cm.getRange(from, to).match(xmlIdString);
  // if one is found, return it
  if (result !== null) {
    return result[1];
  }
  // if no id is found, look in parent staff and measure to find one
  let outsideParentStaff = false;
  for (let m = cursor.line; m >= 0; m--) {
    line = cm.getLine(m);
    if (line.includes('<music')) {
      break;
    }
    if (line.includes('</staff')) {
      outsideParentStaff = true;
      continue;
    }
    if (line.includes('<measure') || (line.includes('<staff') && !outsideParentStaff)) {
      result = line.match(xmlIdString);
      if (result !== null) return result[1];
      // if this line is parent <measure>, stop looking
      if (line.includes('<measure')) break;
    }
  }
  return null; // if no xml:id is found, return null
} // getElementIdAtCursor()

const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Creates an xml:id in different styles:
 * 'Original' Verovio style: "note-0000001318117900",
 * Verovio 'Base36' (since mid-2021): "nophl5o",
 * 'mei-friend' style (node name with base 36): "note-ophl5o"
 * @param {string} style
 * @param {string} nodeName
 * @returns {string} xml:id
 */
export function generateXmlId(nodeName = '', style = 'mei-friend') {
  let rnd = Math.round(Math.random() * Math.pow(2, 32));
  // let rnd = Math.round((Math.random() * 32768) * (Math.random() * 32768));
  let id = '';
  let base = 36;
  let zeros = '';
  switch (style) {
    case 'Base36':
    case 'mei-friend':
      while (rnd) {
        id += base62Chars[rnd % base];
        rnd = Math.round(rnd / base);
      }
      break;
    case 'Original':
      let lgt = rnd.toString().length;
      for (let i = 0; i < 16 - lgt; i++) {
        zeros += '0';
      }
      id = zeros + rnd;
      break;
  }
  if (style === 'mei-friend' || style === 'Original') {
    id = nodeName + '-' + id; // add full node name
  } else if (style === 'Base36') {
    id = nodeName[0] + id; // add first character
  }
  return id;
} // generateXmlId()

// add n tabs to current cursor position in textEditor
export function insertTabs(textEditor, n = 1) {
  // let tabText = textEditor.getTabText();
  for (let i = 0; i < n; i++) {
    textEditor.insertText(' ');
  }
} // insertTabs()

// find tag in buffer of textEditor to identify file type
export function hasTag(textEditor, tag = '<mei') {
  let range = null;
  let searchTerm = '(?:' + tag + ')';
  // console.info('hasTag: ', searchTerm);
  textEditor.getBuffer().scan(new RegExp(searchTerm), (obj) => {
    range = obj.range;
    obj.stop();
  });
  return range;
} // hasTag()

// sort note elements in array (of xml:ids) by x coordinate of element
export function sortElementsByScorePosition(arr, includeY = false) {
  if (!Array.isArray(arr)) return;
  let j, i;
  let Xs = []; // create array of x values of the ids in arr
  let Ys = []; // create array of y values of the ids in arr
  arr.forEach((item) => {
    let el = document.querySelector('g#' + escapeXmlId(item));
    Xs.push(dutils.getX(el));
    if (includeY) Ys.push(dutils.getY(el));
  });
  for (j = arr.length; j > 1; --j) {
    for (i = 0; i < j - 1; ++i) {
      if (Xs[i] <= 0) {
        console.info('Utils.sortElementsByScoreTime(): zero t: ' + arr[i]);
        continue;
      }
      if (Xs[i + 1] <= 0) {
        console.info('Utils.sortElementsByScoreTime(): zero t: ' + arr[i + 1]);
        continue;
      }
      // swap elements for X
      if (Xs[i] > Xs[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        [Xs[i], Xs[i + 1]] = [Xs[i + 1], Xs[i]];
        if (includeY) [Ys[i], Ys[i + 1]] = [Ys[i + 1], Ys[i]];
      }
      // swap elements for Y, if X equal
      if (includeY && Xs[i] === Xs[i + 1] && Ys[i] > Ys[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        [Xs[i], Xs[i + 1]] = [Xs[i + 1], Xs[i]];
        [Ys[i], Ys[i + 1]] = [Ys[i + 1], Ys[i]];
      }
    }
  }
  return arr;
} // sortElementsByScorePosition()

// remove @accid.ges if @accid is present
export function cleanAccid(xmlDoc, cm) {
  console.log('Clean accid on document:');
  let accidGesList = xmlDoc.querySelectorAll('[accid]');
  // let checkPoint = buffer.createCheckpoint(); TODO
  let i = 0;
  for (let el of accidGesList) {
    if (el.hasAttribute('accid.ges') && el.getAttribute('accid') === el.getAttribute('accid.ges')) {
      i++;
      console.log(i + ' @accid.ges removed from ', el);
      el.removeAttribute('accid.ges');
      e.replaceInEditor(cm, el);
    }
  }
  // let re = buffer.groupChangesSinceCheckpoint(checkPoint); TODO
  // console.info('cleanAccid: ' + i + ' accid.ges removed, grouped ', re);
} // cleanAccid()

// renumber measure@n starting with startNumber
export function renumberMeasures(v, cm, startNum = 1, change = false) {
  let measureList = v.xmlDoc.querySelectorAll('measure');
  //if (!change)
  v.showAlert(
    `<b>${translator.lang.renumberMeasuresModalText.text} ${
      change ? ' ' : ' (' + translator.lang.renumberMeasuresModalTest.text + ')'
    }</b>`,
    change ? 'success' : 'info',
    180000
  );
  console.info('renumber Measures list: ', measureList);
  let i;
  let lgt = measureList.length;
  let metcon = '';
  let metcons = 0; // number of metcon=false measures in a row
  let n = startNum;
  let endingStart = -1; // start number of an ending element
  let endingEnd = -1; // end number of an ending element
  let endingCount = 0;
  let endingN = '';
  let isFirstMeasure = true;
  // let checkPoint = buffer.createCheckpoint(); TODO
  for (i = 0; i < lgt; i++) {
    let suffix = '';
    if (measureList[i].closest('incip')) continue; // ignore incipit
    if (!change) console.info(i + '/' + lgt + ': measure ', measureList[i]);
    if (measureList[i].hasAttribute('metcon')) {
      metcon = measureList[i].getAttribute('metcon');
    }
    let contMeas = document.getElementById('renumberMeasureContinueAcrossIncompleteMeasures');
    // 1) first measure with @metcon="false" is upbeat => @n=0
    if (contMeas && !contMeas.checked && isFirstMeasure && metcon === 'false') {
      // first measure upbeat
      n--;
      isFirstMeasure = false;
    }
    // 2) treat series of @metcon="false" as one measure
    if (contMeas && !contMeas.checked && metcon === 'false') {
      metcons++;
    } else if (metcon === '' || metcon === 'true') {
      metcons = 0;
    }
    if (contMeas && !contMeas.checked && metcons > 1) {
      n--;
      let sufSel = document.getElementById('renumberMeasuresUseSuffixAtMeasures');
      switch (sufSel.value) {
        case 'none':
          break;
        case '-cont':
          suffix = '-cont';
          break;
      }
    }
    // 3) Measures within endings are numbered starting with the same number.
    let cont = document.getElementById('renumberMeasuresContinueAcrossEndings');
    if (cont && !cont.checked) {
      let ending = measureList[i].closest('ending');
      if (ending && endingStart > 0 && ending.hasAttribute('n') && ending.getAttribute('n') != endingN) endingEnd = n; // compare ending ns
      if (ending && ending.hasAttribute('n')) endingN = ending.getAttribute('n');
      if (ending && endingStart < 0) {
        endingStart = n; // remember start number
        endingCount++; // increment ending count
      }
      if (ending && endingStart > 0 && endingEnd > 0) {
        // set @n to start number
        n = endingStart;
        endingEnd = -1;
        endingCount++; // increment ending count
      }
      if (ending) {
        let sufSel = document.getElementById('renumberMeasuresUseSuffixAtEndings');
        switch (sufSel.value) {
          case 'none':
            break;
          case 'ending@n':
            suffix = '-' + (ending.hasAttribute('n') ? ending.getAttribute('n') : '');
            break;
          case 'a/b/c':
            suffix = String.fromCharCode(endingCount + 64).toLowerCase();
            break;
          case 'A/B/C':
            suffix = String.fromCharCode(endingCount + 64);
            break;
          case '-a/-b/-c':
            suffix = '-' + String.fromCharCode(endingCount + 64).toLowerCase();
            break;
          case '-A/-B/-C':
            suffix = '-' + String.fromCharCode(endingCount + 64);
            break;
        }
      }
      if (!ending) {
        // reset both measure numbers
        endingStart = -1;
        endingEnd = -1;
        endingCount = 0;
      }
    }
    // 4) No increment after bars with invisible barline (@right="invis")
    let right = '';
    if (measureList[i].hasAttribute('right')) {
      right = measureList[i].getAttribute('right');
    }

    let msg =
      'measure@n="' +
      measureList[i].getAttribute('n') +
      '" ' +
      (change
        ? translator.lang.renumberMeasuresWillBe.text + ' '
        : translator.lang.renumberMeasuresWouldBe.text + ' ') +
      translator.lang.renumberMeasuresChangedTo.text +
      ' @n="' +
      (n + suffix) +
      '"' +
      (right ? ', @right:' + right : '') +
      (metcons ? ', @metcons:' + metcons : '');
    console.info(msg);
    v.updateAlert(msg);

    // change measure@n
    if (change) {
      measureList[i].setAttribute('n', n + suffix);
      e.replaceInEditor(cm, measureList[i]);
    }
    // 5) handle increment from multiRest@num
    let multiRest = measureList[i].querySelector('multiRest');
    if (multiRest) {
      let num = multiRest.getAttribute('num');
      if (num) {
        n += parseInt(num);
      } else {
        n++; // should not happen...
      }
    } else if (right !== 'invis' || metcon === 'false') {
      n++;
    }
    metcon = '';
  } // loop across measures

  // final alert message
  let str =
    '<b>' +
    translator.lang.renumberMeasuresModalText.text +
    ': ' +
    i +
    ' ' +
    translator.lang.renumberMeasureMeasuresRenumbered.text +
    '</b><br><br>';
  console.info(str);
  //if (!change)
  v.updateAlert(str);
} // renumberMeasures()

// convert all
export function attrAsElements(xmlNote) {
  for (let att of ['artic', 'accid']) {
    if (xmlNote.hasAttribute(att)) {
      let accidElement = document.createElementNS(dutils.meiNameSpace, att);
      accidElement.setAttribute(att, xmlNote.getAttribute(att));
      xmlNote.appendChild(accidElement);
      xmlNote.removeAttribute(att);
    }
  }
  return xmlNote;
} // attrAsElements()

// accepts color as string: "rgb(100,12,255)" and hex string "#ffee10" or
export function brighter(rgbString, deltaPercent, alpha = 1) {
  let rgb = [];
  rgbString = rgbString.trim(); // remove white space on either side
  if (rgbString.startsWith('#')) {
    rgb = hexToRgb(rgbString);
  } else {
    rgb = rgbString.slice(4, -1).split(',');
  }
  rgb = rgb.map((i) => Math.max(0, Math.min(parseInt(i) + deltaPercent, 255)));
  if (alpha < 1) rgb.push(alpha);
  return 'rgb(' + rgb.join(', ') + ')';
} // brighter()

export function hexToRgb(hex) {
  return hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
} // hexToRgb()

// supports "rgb(123,234,0)" format
export function complementary(rgbString) {
  let rgb = [];
  if (rgbString.startsWith('#')) {
    rgb = hexToRgb(rgbString);
  } else {
    rgbString
      .slice(4, -1)
      .split(',')
      .forEach((i) => rgb.push(i));
  }
  rgb = rgb.map((i) => 255 - i);
  return 'rgb(' + rgb.join(', ') + ')';
} // complementary()

// input Verovio-SVG element, return bounding box coords in default screen coordinate space
export function convertCoords(elem) {
  if (
    !!elem &&
    document.getElementById(elem.getAttribute('id')) &&
    elem.style.display !== 'none' &&
    (elem.getBBox().x !== 0 || elem.getBBox().y !== 0)
  ) {
    const x = elem.getBBox().x;
    const width = elem.getBBox().width;
    const y = elem.getBBox().y;
    const height = elem.getBBox().height;
    const offset = elem.closest('svg').parentElement.getBoundingClientRect();
    const matrix = elem.getScreenCTM();
    return {
      x: matrix.a * x + matrix.c * y + matrix.e - offset.left,
      y: matrix.b * x + matrix.d * y + matrix.f - offset.top,
      x2: matrix.a * (x + width) + matrix.c * y + matrix.e - offset.left,
      y2: matrix.b * x + matrix.d * (y + height) + matrix.f - offset.top,
    };
  } else {
    console.warn('Element unavailable on page: ', elem ? elem.getAttribute('id') : 'none');
    return {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
    };
  }
}

/**
 * Returns median of array of numbers
 * @param {number[]} numbers
 * @returns {number}
 */
export function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
} // median()

export function rmHash(hashedString) {
  if (!hashedString) return '';
  return hashedString.startsWith('#') ? hashedString.split('#')[1] : hashedString;
}

// escape special characters '.' and ':' for usagage in queryselectors
export function escapeXmlId(str) {
  if (!str || str === null || typeof str !== 'string') return '';
  if (/^\d/.test(str)) str = 'a' + str;
  return str.replace(/\./g, '\\.').replace(/\:/g, '\\:');
}

/**
 * Checks whether tagName is a valid XML element name
 * @param {string} tagName
 * @returns
 */
export function isValidElementName(tagName = '') {
  if (!tagName) return false;
  try {
    document.createElement(tagName);
    return true;
  } catch (err) {
    return false;
  }
} // isValidElementName()

/**
 * Returns an ISO 8601 string in lokal timezone
 * @param {Date} d - date to create string for
 * @returns {string} formatted string
 */
export function toISOStringLocal(d) {
  function z(n) {
    return (n < 10 ? '0' : '') + n;
  }
  return (
    d.getFullYear() +
    '-' +
    z(d.getMonth() + 1) +
    '-' +
    z(d.getDate()) +
    'T' +
    z(d.getHours()) +
    ':' +
    z(d.getMinutes()) +
    ':' +
    z(d.getSeconds())
  );
} // toISOStringLocal()

/** @typedef { measure: Number, beat: Number } MeasureBeat */

/**
 * Returns object with measure and beat count from @tstamp2
 * (according to data.MEASUREBEAT, e.g., '2m+4')
 * @param {string} tstamp2
 * @returns {MeasureBeat}
 */
export function readMeasureBeat(tstamp2) {
  let measure = 0;
  let beat = 0;
  if (tstamp2.includes('m')) {
    let split = tstamp2.split('m');
    measure = parseInt(split.at(0));
    beat = parseFloat(split.at(1));
  } else {
    beat = parseFloat(tstamp2);
  }
  return { measure: measure, beat: beat };
} // readMeasureBeat()

/**
 * Returns a data.MEASUREBEAT string
 * @param {number} measure
 * @param {number} beat
 * @returns {string}
 */
export function writeMeasureBeat(measure, beat) {
  if (parseInt(measure) === 0) return '' + beat;
  return measure + 'm+' + beat;
} // writeMeasureBeat()

/**
 * Flattens a more dimensional array and keeps only unique values.
 * Does not use concat to be useful for large arrays.
 * @param {Array} inputArray
 * @returns {Array}
 */
export function flattenArrayToUniques(inputArray) {
  let flatArray = [];
  for (let row of inputArray) for (let element of row) flatArray.push(element);
  flatArray = flatArray.filter((value, index, self) => {
    return index == self.indexOf(value);
  });

  return flatArray;
}

/**
 * Returns the URL of the current environment's changelog
 * @returns {string} URL of the current environment's changelog
 */
export function getChangelogUrl() {
  let changeLogUrl;
  switch (env) {
    case 'develop':
      changeLogUrl = 'https://github.com/mei-friend/mei-friend/blob/develop/CHANGELOG.md';
      break;
    case 'staging':
      changeLogUrl = 'https://github.com/mei-friend/mei-friend/blob/staging/CHANGELOG.md';
      break;
    case 'testing':
      changeLogUrl = 'https://github.com/mei-friend/mei-friend/blob/testing/CHANGELOG.md';
      break;
    case 'production':
      changeLogUrl = 'https://github.com/mei-friend/mei-friend/blob/main/CHANGELOG.md';
      break;
    default:
      changeLogUrl = 'https://github.com/mei-friend/mei-friend/blob/main/CHANGELOG.md';
  }
  return changeLogUrl;
}

/**
 *
 * @param {string} urlstring
 * @returns {string} relative URL (pathname)
 */
export function ensureRelativeURL(url) {
  try {
    url = new URL(url);
    return url.pathname;
  } catch {
    return url;
  }
} // ensureRelativeURL()

/**
 * Evaluate meter count or unit from @meter attribute to a number
 * @param {string} number such as '3' or '3+4+5'
 * @returns {number | NaN} the sum of the meter count or unit
 */
export function parseMeterNumber(number) {
  if (number) {
    return number.split('+').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  }
  return NaN;
} // parseMeterNumber()

/**
 * Function to compare two numbers with a tolerance
 * @param {number} num1
 * @param {number} num2
 * @param {number} tolerance
 * @returns {boolean} true if the numbers are equal within the tolerance
 */
export function compareNumbersWithTolerance(num1, num2, tolerance = 0.001) {
  return Math.abs(num1 - num2) <= tolerance;
} // compareNumbersWithTolerance()

/**
 * Parse toolkit version string to an object with major, minor, and patch properties
 * @param {string} versionString - e.g., "1.2.3"
 * @returns {Object} - object with major, minor, and patch properties
 */
export function parseToolkitVersion(versionString) {
  const versionParts = versionString.split('.');
  return {
    major: parseInt(versionParts[0], 10),
    minor: parseInt(versionParts[1], 10),
    patch: parseInt(versionParts[2], 10),
  };
} // parseToolkitVersion()

/**
 * Convert toolkit object to a decimal number
 * @param {string} toolkitVersion - e.g., "1.2.3"
 * @returns {number} - decimal representation of the toolkit version
 * e.g., "1.2.3" -> 1.0203
 */
export function toolkitVersionToDecimal(toolkitVersion) {
  const { major, minor, patch } = parseToolkitVersion(toolkitVersion);
  return major + minor / 100 + patch / 10000;
} // toolkitVersionToDecimal()
