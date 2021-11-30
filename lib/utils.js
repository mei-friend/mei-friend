import * as speed from './speed';
import * as dutils from './dom-utils';

const xmlIdString = /(?:xml:id=)(?:['"])(\S+?)(?:['"])/;
const numberLikeString = /(?:n=)(?:['"])(\d+?)(?:['"])/;
const closingTag = /(?:<[/])(\S+?)(?:[>])/;

// returns the object named key of the JSON object obj
export function findKey(key, obj) {
  // console.info('findKey: ' + key + '. ', obj);
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.includes(key)) {
      return obj[key];
    } else {
      for (k of keys) {
        val = findKey(key, obj[k]);
        if (val) return val;
      }
    }
  }
}

// checks whether note noteId is inside a chord. Returns false or the chord id.
export function insideParent(noteId, what = 'chord') {
  chord = document.querySelector('g#' + noteId).closest('.' + what);
  if (chord) return chord.getAttribute('id');
  else return false;
}

// finds all chords/notes inside an element and return array of id strings
export function findNotes(elementId) {
  noteList = document.querySelector('g#' + elementId).querySelectorAll('.note');
  let idArray = [];
  for (note of noteList) {
    noteId = note.getAttribute('id');
    chordId = insideParent(noteId);
    if (chordId && !idArray.includes(chordId)) {
      idArray.push(chordId);
    } else if (!chordId) {
      idArray.push(noteId);
    }
  }
  return idArray;
}

// look for elementname (e.g., 'staff') upwards in the xml file and return
// attribute value (searchString defaults to the "@n" attribute).
export function getElementAttributeAbove(textBuffer, row, elementName = 'staff',
  searchString = /(?:n=)(?:['"])(\d+?)(?:['"])/) {
  while (line = textBuffer.lineForRow(--row)) {
    if (line.includes('<' + elementName)) {
      col = line.indexOf()
      return [line.match(searchString)[1], row];
    }
  }
  return [null, null];
}

// look for elementname (e.g., 'staff') downwards in the xml file and return
// attribute value (searchString defaults to the "@n" attribute).
export function getElementAttributeBelow(textBuffer, row, elementName = 'staff',
  searchString = /(?:n=)(?:['"])(\d+?)(?:['"])/) {
  while (line = textBuffer.lineForRow(++row)) {
    if (line.includes('<' + elementName)) {
      return [line.match(searchString)[1], row];
    }
  }
  return [null, null];
}

// move encoding cursor to end of current measure
export function moveCursorToEndOfMeasure(textEditor, cursorPosition) {
  if (!cursorPosition)
    cursorPosition = textEditor.getCursorBufferPosition();
  let textBuffer = textEditor.getBuffer();
  const measureEnd = '</measure';
  for (let row = cursorPosition.row; row < textEditor.getLastBufferRow(); row++) {
    line = textBuffer.lineForRow(row);
    if (line.includes(measureEnd)) {
      let column = line.indexOf(measureEnd);
      textEditor.setCursorBufferPosition([row, column]);
      return [row, column];
    }
  }
  return [null, null];
}

// find item by id in buffer
export function locateIdInBuffer(buffer, itemId, searchRegExp = '') {
  // const searchString = new RegExp(`(?:xml:id="${itemId}")`);
  // var searchSelfClosing = '<[\\w.-]+?\\s+?(?:xml:id="' + itemId + '")(.*?)(\/[\\w.-]*?>)';
  // var searchElement = '(?:<' + elementName + ')\\s+?(?:xml:id="' + itemId + '")(.*?)(?:</' + elementName + ')*?>';
  if (searchRegExp == '') searchRegExp = '(?:xml:id="' + itemId + '")';
  // searchRegExp = '<[\w.-]+?\s+?(?:xml:id="' + itemId + '")(.+?)(\/[\w.-]*?>)';
  const searchString = new RegExp(searchRegExp);
  let range;
  buffer.scan(searchString, (obj) => {
    range = obj.range;
    obj.stop();
  });
  return range;
}

// find attribute (@startid) of element with itemId in textEditor.getBuffer()
// returns value of attribute ('note-00123') or null, if nothing found
export function getAttributeById(buffer, itemId, attribute = 'startid') {
  var searchRegExp = '<[\\w.-]+?\\s+?(?:xml:id="' + itemId + '")[^>]*?>';
  let range = locateIdInBuffer(buffer, itemId, searchRegExp);
  var elementString = '';
  if (range) elementString = buffer.getTextInRange(range);
  // console.info('elementString: |' + elementString + '|');
  searchRegExp = `(?:` + attribute + `=)(?:['"])(\\S+?)(?:['"])`;
  let startid = elementString.match(new RegExp(searchRegExp));
  if (startid && startid.length > 0) startid = startid[1];
  // console.info('startid: |' + startid + '|')
  return startid;
}

// scans through text from cursorPosition to find next element elementName
// (e.g. 'note'), also matching staff and layer
export function getIdOfNextElement(textBuffer, rw,
  elementNames = ['note', 'rest', 'mRest', 'beatRpt', 'halfmRpt', 'mRpt'],
  direction = 'forwards') {
  let row = rw;
  let line;
  let layerNo = parseInt(getElementAttributeAbove(textBuffer, row, 'layer',
    numberLikeString)[0]);
  let staffNo = parseInt(getElementAttributeAbove(textBuffer, row, 'staff',
    numberLikeString)[0]);
  // console.info('getIdOfNextElement("' + elementNames + '", "' + direction + '").');

  if (direction == 'forwards') {
    while (line = textBuffer.lineForRow(++row)) {
      let found = false;
      for (el of elementNames) {
        if (line.includes('<' + el)) {
          found = true;
          break;
        }
      }
      if (found &&
        (staffNo == parseInt(getElementAttributeAbove(textBuffer, row,
          'staff', numberLikeString)[0])) &&
        (layerNo == parseInt(getElementAttributeAbove(textBuffer, row,
          'layer', numberLikeString)[0]))) { // && (layerNo == layerN)
        break;
      }
    }
  } else if (direction == 'backwards') {
    while (line = textBuffer.lineForRow(--row)) {
      let found = false;
      for (el of elementNames) {
        if (line.includes('<' + el)) {
          found = true;
          break;
        }
      }
      if (found &&
        (staffNo == parseInt(getElementAttributeAbove(textBuffer, row,
          'staff', numberLikeString)[0])) &&
        (layerNo == parseInt(getElementAttributeAbove(textBuffer, row,
          'layer', numberLikeString)[0]))) { // && (layerNo == layerN)
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
}

// returns xml:id of current element (at encoding cursor position). If empty,
// search for next higher staff or measure xml:id
export function getElementIdAtCursor(doc) {
  let result;
  let tag;
  let p = doc.getCursor();
  let row = p.line;
  let column = p.ch;
  // get line from current cursor position
  let line = doc.getLine(row);
  // check if cursor is on a closing tag by stepping backwards through the characters
  for (let j = column; j > 0; j--) {
    if (line[j] === "/" && line[j - 1] === "<") {
      // if closing tag is found, find the name of the tag with regex
      tag = line.slice(j - 1).match(closingTag);
      if (tag && Array.isArray(tag)) {
        tag = tag[1];
        break;
      }
    }
  }
  // if closing tag identified, find opening tag and set row number accordingly
  if (tag) {
    for (let k = row; k >= 0; k--) {
      if (doc.getLine(k).includes(`<${tag}`)) {
        row = k;
        break;
      }
    }
  }
  // search for xml:id in row
  result = doc.getLine(row).match(xmlIdString);
  // if one is found, return it
  if (result !== null) {
    return result[1];
  }
  // if no id is found, look in parent staff and measure to find one
  let outsideParentStaff = false;
  for (let m = row; m >= 0; m--) {
    line = doc.getLine(m); 
    if (line.includes('<music')) {
      break;
    }
    if (line.includes('</staff')) {
      outsideParentStaff = true;
      continue;
    }
    if (line.includes('<measure') || (line.includes('<staff') &&
        !outsideParentStaff)) {
      result = line.match(xmlIdString);
      if (result !== null) return result[1];
      // if this line is parent <measure>, stop looking
      if (line.includes('<measure')) break;
    }
  }
  return null; // if no xml:id is found, return null
}

// returns range of element, starting at cursorPosition
// this function assumes full xml tags (<measure>....</measure>)
export function findElementBelow(textEditor, elementName = 'measure', point = [1, 1]) {
  var textBuffer = textEditor.getBuffer();
  let row1 = point.row;
  let col1 = point.col;
  let mxRows = textEditor.getLastBufferRow();
  let found1 = false;
  while ((line = textBuffer.lineForRow(row1++)) != '' && row1 < mxRows) {
    console.info('findElement: line: ', line);
    if ((col1 += line.slice(col1).indexOf('<' + elementName)) > 0) {
      found1 = true;
      break;
    }
    col1 = 0;
  }
  if (found1) console.info('findElement: found1: ' + row1 + ', ' + col1);
  let found2 = false;
  let row2 = row1;
  let col2 = 0;
  while ((line = textBuffer.lineForRow(row2++)) != '' && row2 < mxRows) {
    console.info('findElement: line: ', line);
    if ((col2 = line.indexOf('</' + elementName)) > 0) {
      col2 += line.slice(col2).indexOf('>') + 1;
      found2 = true;
      break;
    }
  }
  if (found2) console.info('findElement: found2: ' + row2 + ', ' + col2);
  // if (found2) textEditor.setCursorBufferPosition([row2, col2]);

  if (found1 && found2) return [row1, col1, row2, col2];
  else return null;
}

// creates a random ID value in Verovio style
export function generateUUID() {
  let tmp = Math.round((Math.random() * 32768) * (Math.random() * 32768)).toString();
  let uuid = '',
    lgt = tmp.length;
  for (let i = 0; i < 16 - lgt; i++) {
    uuid += '0';
  }
  return uuid + tmp;
}

// add n tabs to current cursor position in textEditor
export function insertTabs(textEditor, n = 1) {
  // let tabText = textEditor.getTabText();
  for (let i = 0; i < n; i++) {
    textEditor.insertText(" ");
  }
}

// find tag in buffer of textEditor to identify file type
export function hasTag(textEditor, tag = '<mei') {
  let range = null;
  let searchTerm = "(?:" + tag + ")";
  // console.info('hasTag: ', searchTerm);
  textEditor.getBuffer().scan(new RegExp(searchTerm), (obj) => {
    range = obj.range;
    obj.stop();
  });
  return range;
}

// sort note elements in array (of xml:ids) by x coordinate of element
export function sortElementsByScoreTime(arr, tk) {
  let j, i;
  let Xs = []; // create array of x values of the ids in arr
  arr.forEach(item => {
    let el = document.querySelector('g#' + item);
    // console.info('sortElementsByScoreTime el: ', el);
    Xs.push(dutils.getX(el));
  });
  for (j = arr.length; j > 1; --j) {
    for (i = 0; i < (j - 1); ++i) {
      if (Xs[i] <= 0) {
        console.info('Utils.sortElementsByScoreTime(): zero t: ' + arr[i]);
        continue;
      }
      if (Xs[i + 1] <= 0) {
        console.info('Utils.sortElementsByScoreTime(): zero t: ' + arr[i + 1]);
        continue;
      }
      if (Xs[i] > Xs[i + 1]) { // swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        [Xs[i], Xs[i + 1]] = [Xs[i + 1], Xs[i]];
      }
    }
  }
  return arr;
}

// remove @accid.ges if @accid is present
export function cleanAccid(xmlDoc, textEditor) {
  let buffer = textEditor.getBuffer();
  let checkPoint = buffer.createCheckpoint();
  let accidGesList = xmlDoc.querySelectorAll('[accid]');
  let i = 0;
  for (el of accidGesList) {
    if (el.hasAttribute('accid.ges') &&
      el.getAttribute('accid') == el.getAttribute('accid.ges')) {
      i++;
      el.removeAttribute('accid.ges');
      speed.replaceInTextEditor(textEditor, el);
    }
  }
  let re = buffer.groupChangesSinceCheckpoint(checkPoint);
  console.info('cleanAccid: ' + i + ' accid.ges removed, grouped ', re);
}

// renumber measure@n starting with startNumber
export function renumberMeasures(xmlDoc, textEditor, startNumber = 1, change = false) {
  let buffer = textEditor.getBuffer();
  let measureList = xmlDoc.querySelectorAll('measure');
  console.info('measureList: ', measureList);
  let i;
  let lgt = measureList.length;
  let metcon = '';
  let metcons = 0; // number of metcon=false measures in a row
  let n = startNumber;
  let endingStart = -1; // start number of an ending element
  let endingEnd = -1; // end number of an ending element
  let endingN = '';
  let checkPoint = buffer.createCheckpoint();
  for (i = 0; i < lgt; i++) {
    if (measureList[i].closest('incip')) continue;
    if (!change)
      console.info(i + '/' + lgt + ': measure ', measureList[i]);
    if (measureList[i].hasAttribute('metcon')) {
      metcon = measureList[i].getAttribute('metcon');
    }
    // 1) first measure with @metcon="false" is upbeat => @n=0
    if (i == 0 && metcon == 'false') n--; // first measure upbeat
    // 2) treat series of @metcon="false" as one measure
    if (metcon == 'false') {
      metcons++;
    } else if (metcon == '' || metcon == 'true') {
      metcons = 0;
    }
    if (metcons > 1) n--;
    // 3) Measures within endings are numbered starting with the same number.
    let ending = measureList[i].closest('ending');
    if (ending && endingStart > 0 && ending.hasAttribute('n') &&
      ending.getAttribute('n') != endingN) endingEnd = n; // compare ending ns
    if (ending && ending.hasAttribute('n')) endingN = ending.getAttribute('n');
    if (ending && endingStart < 0) endingStart = n; // rember start number
    if (ending && endingStart > 0 && endingEnd > 0) { // set @n to start number
      n = endingStart;
      endingEnd = -1;
    }
    if (!ending) { // reset both measure numbers
      endingStart = -1;
      endingEnd = -1;
    }
    // 4) No increment after bars with invisible barline (@right="invis")
    let right = '';
    if (measureList[i].hasAttribute('right'))
      right = measureList[i].getAttribute('right');

    // change measure@n
    if (change) {
      measureList[i].setAttribute('n', n);
      speed.replaceInTextEditor(textEditor, measureList[i]);
      console.info(measureList[i].getAttribute('n') + ' changed to ' + n +
        ', right:' + right + ', metcons:' + metcons);
    } else { // just list the changes
      console.info(measureList[i].getAttribute('n') + ' to be changed to ' + n +
        ', right:' + right + ', metcons:' + metcons);
    }
    // 5) handle increment from multiRest@num
    let multiRest;
    if (multiRest = measureList[i].querySelector('multiRest')) {
      let num = multiRest.getAttribute('num');
      if (num) n += parseInt(num);
      else n++; // should not happen...
    } else if (right != 'invis' || metcon == "false") {
      n++;
    }
    metcon = '';
  }
  let re = buffer.groupChangesSinceCheckpoint(checkPoint);
  console.info('renumberMeasures: ' + i + ' measures renumbered, grouped ', re);
}

// convert all
export function attrAsElements(xmlNote) {
  for (att of ['artic', 'accid']) {
    if (xmlNote.hasAttribute(att)) {
      let accidElement = document.createElementNS(speed.meiNameSpace, att);
      accidElement.setAttribute(att, xmlNote.getAttribute(att));
      xmlNote.appendChild(accidElement);
      xmlNote.removeAttribute(att);
    }
  }
  return xmlNote;
}
