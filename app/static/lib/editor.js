// contains all the editor functions
import * as speed from './speed.js';
import * as utils from './utils.js';
import * as dutils from './dom-utils.js';
import * as att from './attribute-classes.js';

// delete selected elements
export function delEl(v, cm) {
  v.loadXml(cm.getValue(), true);
  let id = v.selectedElements[0]; // TODO: iterate over selectedElements
  let cursor = cm.getCursor();
  let nextId = utils.getIdOfNextElement(cm, cursor.line)[0]; // TODO necessary?
  let element = v.xmlDoc.querySelector("[*|id='" + id + "']");
  console.info('Deleting: ', element);
  if (!element) {
    console.info(id + ' not found for deletion.');
    return;
  }
  let selectedElements = [];
  v.updateNotation = false;
  // let checkPoint = buffer.createCheckpoint(); TODO
  if (att.modelControlEvents.concat(['accid', 'artic', 'clef', 'octave'])
    .includes(element.nodeName)) {
    if (element.nodeName == 'octave') { // reset notes inside octave range
      let disPlace = element.getAttribute('dis.place');
      let dis = element.getAttribute('dis');
      let id1 = speed.rmHash(element.getAttribute('startid'));
      let id2 = speed.rmHash(element.getAttribute('endid'));
      findAndModifyOctaveElements(cm, v.xmlDoc, id1, id2, disPlace, dis, false);
      removeInBuffer(cm, element);
      selectedElements.push(id2);
    } else {
      removeInBuffer(cm, element);
      // place cursor at a sensible place...
      let m = utils.getElementIdAtCursor(cm);
      let el = document.getElementById(m).querySelector(dutils.navElsSelector);
      if (el) selectedElements.push(el.getAttribute('id'));
      else selectedElements.push(nextId);
    }
  } else if (['beam'].includes(element.nodeName)) { // delte beam
    let p;
    let first = true;
    let childList = element.childNodes;
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].nodeType === Node.TEXT_NODE) continue;
      if (first) {
        p = replaceInTextEditor(cm, element, false, childList[i]);
        p.end.line += 1;
        p.end.ch = 0;
        cm.setCursor(p.end);
        first = false;
      } else {
        // txtEdr.insertNewline();
        let newMEI = speed.xmlToString(childList[i]);
        cm.replaceRange(newMEI + '\n', p.end);
        let cursor = cm.getCursor();
        for (let l = p.end.line; l < cursor.line; l++) cm.indentLine(l);
        p.end = cursor;
      }
      selectedElements.push(childList[i].getAttribute('xml:id'))
      element.parentNode.insertBefore(childList[i--], element);
    }
  } else {
    console.info('Element ' + id + ' not supported for deletion.');
    return;
  }
  element.remove();
  // buffer.groupChangesSinceCheckpoint(checkPoint); TODO
  v.selectedElements = selectedElements;
  v.lastNoteId = v.selectedElements[v.selectedElements.length - 1];
  v.encodingHasChanged = true;
  v.updateData(cm, false, true);
  v.updateNotation = true;
} // delEl()

export function addCtrlEl(v, cm, elName, placement, form) {
  if (v.selectedElements.length == undefined || v.selectedElements.length < 1)
    return;
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  console.info('addCtrlEl() ', elName, placement, form);

  // find and validate startEl with @startId
  let startId = v.selectedElements[0];
  var startEl = v.xmlDoc.querySelector("[*|id='" + startId + "']");
  if (!startEl) return;
  if (!['note', 'chord', 'rest', 'mRest', 'multiRest']
    .includes(startEl.nodeName)) {
    console.info(
      'addControlElement: Cannot add new element to start element' +
      startEl.nodeName + '.');
    return;
  }
  // find and validate end element
  let endId = '';
  let sc = cm.getSearchCursor('xml:id="' + startId + '"');
  if (!sc.findNext()) return;
  const p = sc.from();
  var endEl;
  if (v.selectedElements.length == 1 &&
    (['slur', 'tie', 'phrase', 'hairpin', 'gliss'].includes(elName))) {
    // if one selected element, find a second automatically
    endId = utils.getIdOfNextElement(cm, p.line, ['note'])[0];
  } else if (v.selectedElements.length >= 2) {
    endId = v.selectedElements[v.selectedElements.length - 1];
  }
  if (endId) {
    endEl = v.xmlDoc.querySelector("[*|id='" + endId + "']");
    if (!['note', 'chord', 'mRest', 'multiRest'].includes(endEl.nodeName)) {
      console.info(
        'addCtrlEl: Cannot add new element to end element ' +
        endEl.nodeName);
      return;
    }
  }
  // create element to be inserted
  let newElement = v.xmlDoc.createElementNS(speed.meiNameSpace, elName);
  let uuid = elName + '-' + utils.generateUUID();
  newElement.setAttributeNS(speed.xmlNameSpace, 'xml:id', uuid);
  // elements with both startid and endid
  if (['slur', 'tie', 'phrase', 'hairpin', 'gliss'].includes(elName)) {
    newElement.setAttribute('startid', '#' + startId);
    newElement.setAttribute('endid', '#' + endId);
  } else if ( // only a @startid
    ['fermata', 'dir', 'dynam', 'tempo', 'pedal', 'mordent', 'trill', 'turn'].includes(elName)) {
    newElement.setAttribute('startid', '#' + startId);
  }
  // add an optional endid
  if (endId && ['dir', 'dynam', 'mordent', 'trill', 'turn'].includes(elName)) {
    newElement.setAttribute('endid', '#' + endId);
    if (['trill'].includes(elName)) { // @extender for endid
      newElement.setAttribute('extender', 'true');
    }
  }
  if (form && ['hairpin', 'fermata', 'mordent', 'trill', 'turn'].includes(elName)) {
    newElement.setAttribute('form', form);
  }
  if (placement && ['pedal'].includes(elName)) {
    newElement.setAttribute('dir', placement);
    newElement.setAttribute('vgrp', '100');
  }
  if (placement) {
    if (['slur', 'tie', 'phrase'].includes(elName)) {
      newElement.setAttribute('curvedir', placement);
    } else {
      newElement.setAttribute('place', placement);
    }
  }
  if (['arpeg'].includes(elName)) {
    let plistString = '';
    for (let e of v.selectedElements) {
      plistString += '#' + e + ' ';
    }
    newElement.setAttribute('plist', plistString);
  }
  if (form && ['dir', 'dynam', 'tempo'].includes(elName)) {
    newElement.appendChild(v.xmlDoc.createTextNode(form));
  }
  // add new element to txtEdr at end of measure
  v.updateNotation = false; // to prevent reloading after each edit
  if (p) {
    let p1 = utils.moveCursorToEndOfMeasure(cm, p); // resets selectedElements!!
    console.log('p1: ', p);
    cm.replaceRange(speed.xmlToString(newElement) + '\n', cm.getCursor());
    cm.indentLine(p1.line, 'smart');
    cm.indentLine(p1.line + 1, 'smart');
    cm.setSelection(p1);
    console.log('Cursor pos: ', cm.getCursor());
  }
  // add new element to DOM
  var measureId = startEl.closest('measure').getAttribute('xml:id');
  v.xmlDoc.querySelector(
    "[*|id='" + measureId + "']").appendChild(newElement); //.cloneNode(true));
  v.lastNoteId = startId;
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.updateData(cm, false, true);
  v.updateNotation = true;
} // addCtrlEl()

export function addClefChange(v, cm, shape = 'G', line = '2', before = true) {
  if (v.selectedElements.length == 0) return;
  v.updateNotation = false; // stop update notation
  let id = v.selectedElements[0];
  var el = v.xmlDoc.querySelector("[*|id='" + id + "']");
  let chord = el.closest('chord');
  if (chord) id = chord.getAttribute('xml:id');
  utils.setCursorToId(cm, id);
  let newElement = v.xmlDoc.createElementNS(speed.meiNameSpace, 'clef');
  let uuid = 'clef-' + utils.generateUUID();
  newElement.setAttributeNS(speed.xmlNameSpace, 'xml:id', uuid);
  newElement.setAttribute('shape', shape);
  newElement.setAttribute('line', line);
  v.encodingHasChanged = true;
  if (before) {
    cm.replaceRange(speed.xmlToString(newElement) + '\n', cm.getCursor());
    // cm.execCommand('newLineAndIndent');
  } else {
    cm.execCommand('toMatchingTag');
    cm.execCommand('goLineEnd');
    cm.replaceRange('\n' + speed.xmlToString(newElement), cm.getCursor());
  }
  cm.execCommand('indentAuto');
  v.updateNotation = true; // update notation again
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.lastNoteId = uuid;
  v.updatePage(cm, '', uuid);
}


// Reverse or insert att:placement (artic, ...), att.curvature (slur, tie,
// phrase) and att.stems (note, chord) of current element
// (or its children, such as all notes/chords within a beam).
export function invertPlacement(v, cm, modifier = false) {
  v.loadXml(cm.getValue());
  let ids = utils.sortElementsByScorePosition(v.selectedElements);
  ids = speed.filterElements(ids, v.xmlDoc);
  console.info('invertPlacement ids: ', ids);
  v.updateNotation = false; // no need to redraw notation
  let noteList, range;
  for (let id of ids) {
    var el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    let chordId = utils.insideParent(id);
    if (el && el.nodeName == 'note') {
      if (chordId) id = chordId;
      el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    }
    if (!el) {
      console.info('invertPlacement(): element not found', id);
      continue;
    }
    let attr = '';
    let val = 'above';
    // placement above/below as in dir, dynam...
    if (att.attPlacement.includes(el.nodeName)) {
      attr = 'place';
      if (el.hasAttribute(attr) &&
        (att.dataPlacement.includes(val) && el.getAttribute(attr) != 'below')) {
        val = 'below';
      }
      if (el.nodeName == 'fermata')
        val == 'below' ?
        el.setAttribute('form', 'inv') : el.removeAttribute('form');
      el.setAttribute(attr, val);
      range = replaceInTextEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
    } else if (att.attCurvature.includes(el.nodeName)) {
      attr = 'curvedir';
      if (el.hasAttribute(attr) && el.getAttribute(attr) == 'above') {
        val = 'below';
      }
      el.setAttribute(attr, val);
      range = replaceInTextEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
    } else if (att.attStems.includes(el.nodeName)) {
      attr = 'stem.dir', val = 'up';
      if (el.hasAttribute(attr) && el.getAttribute(attr) == val) {
        val = 'down';
      }
      el.setAttribute(attr, val);
      range = replaceInTextEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
      // invert @num.place within tuplet
    } else if (el.nodeName == 'tuplet') {
      attr = 'num.place';
      val = 'above';
      if (el.hasAttribute(attr) && el.getAttribute(attr) == val) {
        val = 'below';
      }
      el.setAttribute(attr, val);
      range = replaceInTextEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
      // find all note/chord elements children and execute InvertingAction
    } else if (noteList = el.querySelectorAll("note, chord")) {
      // console.info('noteList: ', noteList);
      attr = 'stem.dir', val = 'up';
      for (let note of noteList) {
        // skip notes within chords
        if (note.parentNode.nodeName == 'chord') continue;
        if (note.hasAttribute(attr) && note.getAttribute(attr) == val) {
          val = 'down';
        }
        note.setAttribute(attr, val);
        v.updateNotation = false; // no need to redraw notation
        range = replaceInTextEditor(cm, note, true);
        // txtEdr.autoIndentSelectedRows();
      }
    } else {
      console.info('invertPlacement(): ' + el.nodeName +
        ' contains no elements to invert.');
    }
  }
  // console.info('TextCursor: ', txtEdr.getCursorBufferPosition());
  if (range) cm.setCursor(range.end);
  v.selectedElements = ids;
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // invertPlacement()

// toggle (switch on/off) artic to selected elements
export function toggleArtic(v, cm, artic = "stacc") {
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.updateNotation = false;
  let i, range;
  for (i = 0; i < ids.length; i++) {
    let id = ids[i];
    // if an artic inside a note, look at note
    let parentId = utils.insideParent(id, 'note');
    if (parentId) id = parentId;
    // if note inside a chord, look at chord
    parentId = utils.insideParent(id, 'chord');
    if (parentId) id = parentId;
    let note = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!note) continue;
    let uuid;
    let noteList;
    if (['note', 'chord'].includes(note.nodeName)) {
      uuid = toggleArticForNote(note, artic);
      uuid ? ids[i] = uuid : ids[i] = id;
      range = replaceInTextEditor(cm, note, true);
      cm.execCommand('indentAuto');
    } else if (noteList = utils.findNotes(id)) {
      let noteId;
      for (noteId of noteList) {
        note = v.xmlDoc.querySelector("[*|id='" + noteId + "']");
        uuid = toggleArticForNote(note, artic);
        range = replaceInTextEditor(cm, note, true);
        cm.execCommand('indentAuto');
      }
    }
  }
  if (range) cm.setCursor(range.end);
  v.selectedElements = ids;
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // toggleArtic()

// shift element (rests, note) up/down by pitch name (1 or 7 steps)
export function shiftPitch(v, cm, deltaPitch) {
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.updateNotation = false;
  let i;
  for (i = 0; i < ids.length; i++) {
    let id = ids[i];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) continue;
    let chs = Array.from(el.querySelectorAll('note,rest,mRest,multiRest'));
    if (chs.length > 0) // shift many elements
      chs.forEach(ele => replaceInTextEditor(cm, pitchMover(ele, deltaPitch)));
    else // shift one element
      replaceInTextEditor(cm, pitchMover(el, deltaPitch));
  }
  v.selectedElements = ids;
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // shiftPitch()

export function moveElementToNextStaff(v, cm, upwards = true) {
  console.info('moveElementToNextStaff(' + (upwards ? 'up' : 'down') + ')');
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.updateNotation = false;
  let i;
  let noteList;
  for (i = 0; i < ids.length; i++) {
    let id = ids[i];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) continue;
    if (['note', 'chord', 'rest', 'mRest', 'multiRest'].includes(el.nodeName)) {
      staffMover(cm, el, upwards);
    } else if (noteList = utils.findNotes(id)) {
      let noteId;
      for (noteId of noteList) {
        console.info('moving: ' + noteId);
        let sel = v.xmlDoc.querySelector("[*|id='" + noteId + "']");
        staffMover(cm, sel, upwards);
      }
    }
  }
  v.selectedElements = ids;
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // moveElementToNextStaff()

// add beam, only speed mode
export function addBeamElement(v, cm, elementName = 'beam') {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  if (v.selectedElements.length <= 1) return;
  // console.info('addBeamElement(' + elementName +
  //   '): selectedElements:', v.selectedElements);
  let id1 = v.selectedElements[0]; // xml:id string
  let parentId;
  if (parentId = utils.insideParent(id1, 'chord')) id1 = parentId;
  let id2 = v.selectedElements[v.selectedElements.length - 1];
  if (parentId = utils.insideParent(id2, 'chord')) id2 = parentId;
  let n1 = v.xmlDoc.querySelector("[*|id='" + id1 + "']");
  let n2 = v.xmlDoc.querySelector("[*|id='" + id2 + "']");
  let par1 = n1.parentNode;
  v.updateNotation = false;
  // let checkPoint = buffer.createCheckpoint(); TODO
  // add beam element, if selected elements have same parent
  // TODO check whether inside tuplets and accept that as well
  if (par1.getAttribute('xml:id') == n2.parentNode.getAttribute('xml:id')) {
    let beam = document.createElementNS(speed.meiNameSpace, elementName);
    let uuid = elementName + '-' + utils.generateUUID();
    beam.setAttributeNS(speed.xmlNameSpace, 'xml:id', uuid);
    par1.insertBefore(beam, n1);
    let nodeList = par1.childNodes;
    let insert = false;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].nodeType === Node.TEXT_NODE) continue;
      if (nodeList[i].getAttribute('xml:id') == id1) insert = true;
      if (nodeList[i].getAttribute('xml:id') == id2) {
        let n = nodeList[i].cloneNode(); // make a copy for replacement later
        beam.appendChild(nodeList[i--]);
        replaceInTextEditor(cm, n, true, beam);
        cm.execCommand('indentAuto');
        break;
      }
      if (insert) {
        removeInBuffer(cm, nodeList[i]);
        beam.appendChild(nodeList[i--]);
      }
    }
    // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
    v.selectedElements = [];
    v.selectedElements.push(uuid);
    v.updateData(cm, false, true);
  } else {
    console.log('Cannot add ' + elementName +
      ' element, selected elements have different parents.');
  }
  v.updateNotation = true; // update notation again
} // addBeamElement()

// add octave element and modify notes inside selected elements
export function addOctaveElement(v, cm, disPlace = 'above', dis = '8') {
  v.loadXml(cm.getValue());
  if (v.selectedElements.length < 1) return;
  console.info('addOctaveElement selectedElements:', v.selectedElements);
  let id1 = v.selectedElements[0]; // xml:id string
  let id2 = v.selectedElements[v.selectedElements.length - 1];
  let n1 = v.xmlDoc.querySelector("[*|id='" + id1 + "']");
  // add control like element <octave @startid @endid @dis @dis.place>
  let octave = v.xmlDoc.createElementNS(speed.meiNameSpace, "octave");
  let uuid = 'octave-' + utils.generateUUID();
  octave.setAttributeNS(speed.xmlNameSpace, 'xml:id', uuid);
  octave.setAttribute('startid', '#' + id1);
  octave.setAttribute('endid', '#' + id2);
  octave.setAttribute('dis', dis);
  octave.setAttribute('dis.place', disPlace);
  n1.closest('measure').appendChild(octave);
  // add it to the txtEdr
  v.updateNotation = false;
  // let checkPoint = buffer.createCheckpoint(); TODO
  let sc = cm.getSearchCursor('xml:id="' + id1 + '"');
  if (sc.findNext()) {
    let p1 = utils.moveCursorToEndOfMeasure(cm, sc.from());
    cm.replaceRange(speed.xmlToString(octave) + '\n', cm.getCursor());
    cm.indentLine(p1.line, 'smart'); // TODO
    cm.indentLine(p1.line + 1, 'smart');
    cm.setSelection(p1);
    // txtEdr.insertText(speed.xmlToString(octave));
    // txtEdr.insertNewline();
    // txtEdr.setSelectedBufferRange([begin, [begin[0] + 2, begin[1]]]);
    // txtEdr.autoIndentSelectedRows();
    // txtEdr.setCursorBufferPosition(begin);
  }
  // find plist and modify elements
  findAndModifyOctaveElements(cm, v.xmlDoc, id1, id2, disPlace, dis);
  // buffer.groupChangesSinceCheckpoint(checkPoint);
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.lastNoteId = id2;
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // addOctaveElement()

// surround selected elements with a supplied element (and a responsibility
// statement from v.respId
export function addSuppliedElement(v, cm) {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  if (v.selectedElements.length < 1) return;
  console.info('addSuppliedElement(): selectedElements:', v.selectedElements);
  v.updateNotation = false;
  let uuids = [];
  v.selectedElements.forEach(id => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) {
      console.warn('No such element in xml document: ' + id);
    } else {
      let parent = el.parentNode;
      let sup = document.createElementNS(speed.meiNameSpace, 'supplied');
      let uuid = 'supplied-' + utils.generateUUID();
      sup.setAttributeNS(speed.xmlNameSpace, 'xml:id', uuid);
      if (v.respId) sup.setAttributeNS(speed.xmlNameSpace, 'resp', '#' + v.respId);
      parent.replaceChild(sup, el);
      sup.appendChild(el);
      replaceInTextEditor(cm, el, true, sup);
      cm.execCommand('indentAuto');
      uuids.push(uuid);
    }
  });
  // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
  v.selectedElements = [];
  uuids.forEach(u => v.selectedElements.push(u));
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // addSuppliedElement()

export function addVerticalGroup(v, cm) {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  if (v.selectedElements.length < 1) return;
  console.info('addVerticalGroup(): selectedElements:', v.selectedElements);
  v.updateNotation = false;
  v.selectedElements.forEach(id => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) {
      console.warn('No such element in xml document: ' + id);
    } else if (att.attVerticalGroup.includes(el.nodeName)) {
      let oldEl = el.cloneNode(true);
      // TODO: look to current page SVG dynam@vgrp, dir@vgrp, hairpin@vgrp, tempo@vgrp, ped@vgrp
      // and increment value if already taken
      el.setAttribute('vgrp', 1);
      replaceInTextEditor(cm, oldEl, true, el);
      cm.execCommand('indentAuto');
    } else {
      console.warn('Vertical group not supported for ', el);
    }
  });
  v.updateData(cm, false, true);
  v.updateNotation = true; // update notation again
} // addVerticalGroup()

// wrapper for cleaning superfluous @accid.ges attributes
export function cleanAccid(v, cm) {
  v.updateNotation = false;
  v.loadXml(cm.getValue(), true);
  utils.cleanAccid(v.xmlDoc, cm);
  v.updateNotation = true;
}

// wrapper for renumbering measure numberlike string
export function renumberMeasures(v, cm, change) {
  v.updateNotation = false;
  v.loadXml(cm.getValue(), true);
  utils.renumberMeasures(v.xmlDoc, cm, 1, change);
  v.updateNotation = true;
}



// ############################################################################
// # (mostly) private functions                                               #
// ############################################################################

// find xmlNode in textBuffer and remove it (including empty line)
function removeInBuffer(cm, xmlNode) {
  let itemId = xmlNode.getAttribute('xml:id');
  let searchSelfClosing = '(?:<' + xmlNode.nodeName +
    `)(\\s+?)([^>]*?)(?:xml:id=["']` + itemId + `['"])([^>]*?)(?:/>)`;
  let sc = cm.getSearchCursor(new RegExp(searchSelfClosing));
  if (sc.findNext()) {
    console.info('removeInBuffer() self closing from: ', sc.from());
    console.info('removeInBuffer() self closing to: ', sc.to());
  } else {
    let searchFullElement = '(?:<' + xmlNode.nodeName +
      `)(\\s+?)([^>]*?)(?:xml:id=["']` + itemId + `["'])([\\s\\S]*?)(?:</` +
      xmlNode.nodeName + '[ ]*?>)';
    sc = cm.getSearchCursor(new RegExp(searchFullElement));
    if (sc.findNext()) {
      console.info('removeInBuffer() full element from: ', sc.from());
      console.info('removeInBuffer() full element to: ', sc.to());
    }
  }
  if (sc.atOccurrence) {
    sc.replace('');
    let c = cm.getCursor();
    for (let l = sc.from().line; l <= sc.to().line; l++) {
      if (isEmpty(cm.getLine(l))) {
        cm.setCursor(l, c.ch);
        cm.execCommand('deleteLine');
      }
    }
  } else
    console.info('removeInBuffer(): nothing replaced for ' + itemId + '.');
}

function isEmpty(str) {
  return !/\S/g.test(str);
}

// find xmlNode in textBuffer and replace it with new serialized content
export function replaceInTextEditor(cm, xmlNode, select = false, newNode = null) {
  let newMEI = (newNode) ?
    speed.xmlToString(newNode) : speed.xmlToString(xmlNode);
  // search in buffer
  let itemId = xmlNode.getAttribute('xml:id');
  let searchSelfClosing = '(?:<' + xmlNode.nodeName +
    `)(\\s+?)([^>]*?)(?:xml:id=["']` + itemId + `['"])([^>]*?)(?:/>)`;
  // console.info('searchSelfClosing: ' + searchSelfClosing);
  let sc = cm.getSearchCursor(new RegExp(searchSelfClosing));
  if (sc.findNext()) {
    sc.replace(newMEI);
  } else {
    let searchFullElement = '(?:<' + xmlNode.nodeName +
      `)(\\s+?)([^>]*?)(?:xml:id=["']` + itemId +
      `["'])([\\s\\S]*?)(?:</` + xmlNode.nodeName + '[ ]*?>)';
    sc = cm.getSearchCursor(new RegExp(searchFullElement));
    if (sc.findNext()) sc.replace(newMEI)
    // console.info('searchFullElement: ' + searchFullElement);
  }
  if (!sc.atOccurrence) {
    console.info('replaceInTextEditor(): nothing replaced for ' + itemId + '.');
  } else if (select) {
    sc = cm.getSearchCursor(newMEI);
    if (sc.findNext()) {
      let c = cm.getCursor();
      for (let l = sc.from().line; l <= sc.to().line; l++) {
        if (isEmpty(cm.getLine(l))) {
          cm.setCursor(l, c.ch);
          cm.execCommand('deleteLine');
        }
      }
      // for (r = range.start.row; r <= range.end.row; r++)
      //   if (textBuffer.isRowBlank(r)) textBuffer.deleteRow(r);
      cm.setSelection(sc.from(), sc.to());
    }
  }
  return {
    start: sc.from(),
    end: sc.to()
  };
}

function toggleArticForNote(note, artic) {
  note = utils.attrAsElements(note);
  let articChildren;
  let add = false;
  let uuid;
  // check if articulations exist, as elements or attributes
  if (note.hasChildNodes() &&
    ((articChildren = note.querySelectorAll('artic')).length > 0)) {
    // console.info('toggleArtic check children: ', articChildren);
    for (let articChild of articChildren) {
      let existingArtic = articChild.getAttribute('artic');
      if (existingArtic == artic) {
        articChild.remove();
        add = false;
      } else {
        add = true;
      }
    }
  } else {
    add = true;
  }
  if (add) { // add artic as element
    let articElement = document.createElementNS(speed.meiNameSpace, 'artic');
    uuid = 'artic-' + utils.generateUUID();
    articElement.setAttributeNS(speed.xmlNameSpace, 'xml:id', uuid);
    articElement.setAttribute('artic', artic);
    // let textNode = document.createTextNode('/n');
    // note.appendChild(textNode);
    note.appendChild(articElement);
  }
  // console.info('modified element: ', note);
  return uuid;
}

function pitchMover(el, deltaPitch) {
  let oct = 4;
  let pname = 'c';
  let o;
  let p;
  if (['note'].includes(el.nodeName)) {
    o = 'oct';
    p = 'pname';
  } else if (['rest', 'mRest', 'multiRest'].includes(el.nodeName)) {
    o = 'oloc';
    p = 'ploc';
  }
  if (el.hasAttribute(o)) oct = parseInt(el.getAttribute(o));
  if (el.hasAttribute(p)) pname = el.getAttribute(p);
  let pi = att.pnames.indexOf(pname) + deltaPitch;
  if (pi > att.pnames.length - 1) {
    pi -= att.pnames.length;
    oct++;
  } else if (pi < 0) {
    pi += att.pnames.length;
    oct--;
  }
  el.setAttribute(o, oct);
  el.setAttribute(p, att.pnames[pi]);
  return el;
}

function staffMover(cm, el, upwards) {
  let staff = el.closest('staff');
  let staffNo = -1;
  if (staff) staffNo = parseInt(staff.getAttribute('n'));
  // check existing staff attribute
  let staffNoAttr = -1;
  if (el.hasAttribute('staff')) {
    staffNoAttr = parseInt(el.getAttribute('staff'));
  }
  let newStaffNo = -1;
  if (upwards) {
    if (staffNoAttr > 0) newStaffNo = staffNoAttr - 1;
    else newStaffNo = staffNo - 1;
  } else { // downwards
    if (staffNoAttr > 0) newStaffNo = staffNoAttr + 1;
    else newStaffNo = staffNo + 1;
  }
  if (staffNo == newStaffNo) el.removeAttribute('staff');
  else el.setAttribute('staff', newStaffNo);
  replaceInTextEditor(cm, el);
}

// find all notes between two ids in the same staff and set @oct.ges and
// modify @oct with deltaOct (1,-1, 2,...);
// or, if set=false: remove @oct.ges and reset @oct
function findAndModifyOctaveElements(cm, xmlDoc, id1, id2,
  disPlace, dis, add = true) {
  let deltaOct = (parseInt(dis) - 1) / 7;
  if (disPlace == 'below') deltaOct *= -1; // normal logic: minus 1 when below
  if (add) deltaOct *= -1; // inverse logic: minus when adding above 8
  let n1 = xmlDoc.querySelector("[*|id='" + id1 + "']");
  let st1 = n1.closest("staff");
  if (st1) {
    let staffNumber = st1.getAttribute('n');
    // find all staves with the same @n attribute
    let allStaves = xmlDoc.querySelectorAll("staff[n='" + staffNumber + "']");
    let staffFound = false;
    let noteFound = false;
    // find staff with id1 in it
    for (let st of allStaves) {
      let child1 = st.querySelector("[*|id='" + id1 + "']");
      if (child1) staffFound = true;
      if (!child1 && !staffFound) {
        continue;
      }
      if (staffFound) { // select notes after
        let notes = st.getElementsByTagName('note');
        for (let n of notes) {
          if (n.getAttribute('xml:id') == id1) {
            noteFound = true;
          }
          if (noteFound) {
            let oct = parseInt(n.getAttribute('oct'));
            if (add) {
              n.setAttribute('oct.ges', oct)
            } else { // remove
              n.removeAttribute('oct.ges');
            }
            n.setAttribute('oct', oct + deltaOct)
            replaceInTextEditor(cm, n);
          }
          if (n.getAttribute('xml:id') == id2) {
            return;
          }
        }
      }
    }
  }
  return;
}
