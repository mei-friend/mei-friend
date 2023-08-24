/**
 * Provides all the editor functions
 */

import * as att from './attribute-classes.js';
import * as dutils from './dom-utils.js';
import * as speed from './speed.js';
import * as utils from './utils.js';
import { loadFacsimile } from './facsimile.js';
import { handleEditorChanges, translator, version, versionDate } from './main.js';
import Viewer from './viewer.js';

/**
 * Smart indents selected region in editor, if none, do all
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function indentSelection(v, cm) {
  v.allowCursorActivity = false;
  cm.blockChanges = true;
  cm.listSelections().forEach((s) => {
    let l1 = s.anchor.line;
    let l2 = s.head.line;
    if (l1 > l2) {
      let tmp = l1;
      l1 = l2;
      l2 = tmp;
    }
    if (l1 === l2) {
      // do all if nothing selected
      l1 = 0;
      l2 = cm.lastLine();
    }
    for (let l = l1; l <= l2; l++) {
      cm.indentLine(l, 'smart');
    }
  });
  cm.blockChanges = false;
  handleEditorChanges();
  v.allowCursorActivity = true;
} // indentSelection()

/**
 * Go from cursor position to matchin tag, and set new cursor position there.
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function toMatchingTag(v, cm) {
  v.allowCursorActivity = false;
  cm.blockChanges = true;
  cm.execCommand('toMatchingTag');
  cm.listSelections().forEach((s) => {
    cm.setCursor({ line: s.anchor.line, ch: s.anchor.ch + 1 }); // set cursor one right after tag opening bracket
  });
  cm.focus();
  cm.blockChanges = false;
  v.allowCursorActivity = true;
} // toMatchingTag()

/**
 * Deletes selected elements
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} modifyerKey
 * @returns
 */
export function deleteElement(v, cm, modifyerKey = false) {
  v.loadXml(cm.getValue(), true);
  let selectedElements = []; // store selected elements for later
  // iterate all selected elements
  v.selectedElements.forEach((id) => {
    let cursor = cm.getCursor();
    let nextId = utils.getIdOfNextElement(cm, cursor.line)[0]; // TODO necessary?
    let element = v.xmlDoc.querySelector("[*|id='" + id + "']");
    console.info('Deleting: ', element);
    if (!element) {
      console.info(id + ' not found for deletion.');
      return;
    }
    v.allowCursorActivity = false;
    // let checkPoint = buffer.createCheckpoint(); TODO

    if (att.modelControlEvents.concat(['accid', 'artic', 'clef', 'octave', 'beamSpan']).includes(element.nodeName)) {
      if (element.nodeName === 'octave') {
        // reset notes inside octave range
        let disPlace = element.getAttribute('dis.place');
        let dis = element.getAttribute('dis');
        let id1 = utils.rmHash(element.getAttribute('startid'));
        let id2 = utils.rmHash(element.getAttribute('endid'));
        findAndModifyOctaveElements(cm, v.xmlDoc, id1, id2, disPlace, dis, false);
        removeInEditor(cm, element);
        selectedElements.push(id2);
      } else {
        removeInEditor(cm, element);
        // place cursor at a sensible place...
        let m = utils.getElementIdAtCursor(cm);
        let el = document.getElementById(m).querySelector(dutils.navElsSelector);
        if (el) selectedElements.push(el.getAttribute('id'));
        else selectedElements.push(nextId);
      }
    } else if (['beam'].includes(element.nodeName)) {
      // delete beam
      let p;
      let first = true;
      let childList = element.childNodes;
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].nodeType === Node.TEXT_NODE) continue;
        if (first) {
          p = replaceInEditor(cm, element, false, childList[i]);
          p.end.line += 1;
          p.end.ch = 0;
          cm.setCursor(p.end);
          first = false;
        } else {
          // txtEdr.insertNewline();
          let newMEI = dutils.xmlToString(childList[i]);
          cm.replaceRange(newMEI + '\n', p.end);
          let cursor = cm.getCursor();
          for (let l = p.end.line; l < cursor.line; l++) cm.indentLine(l);
          p.end = cursor;
        }
        selectedElements.push(childList[i].getAttribute('xml:id'));
        element.parentNode.insertBefore(childList[i--], element);
      }
    } else if (element.nodeName === 'zone' && document.getElementById('editFacsimileZones').checked) {
      // delete Zone in source image display
      // remove zone; with CMD remove pointing element; without just remove @facs from pointing element
      removeZone(v, cm, element, modifyerKey);
    } else {
      console.info('Element ' + id + ' not supported for deletion.');
      return;
    }
    element.remove();
  });
  loadFacsimile(v.xmlDoc);
  // buffer.groupChangesSinceCheckpoint(checkPoint); TODO
  v.selectedElements = selectedElements;
  v.lastNoteId = v.selectedElements.at(-1);
  v.xmlDocOutdated = true;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // deleteElement()

/**
 * Inserts a new control element to DOM and editor
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} elName ('slur', 'dynam', ...)
 * @param {string} placement ('below', 'up', ...)
 * @param {string} form ('cres', 'inv', depending on element type)
 * @returns
 */
export function addControlElement(v, cm, elName, placement, form) {
  if (v.selectedElements.length === undefined || v.selectedElements.length < 1) return;
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  console.info('addControlElement() ', elName, placement, form);

  // modifier key for inserting tstamps rather than start/endids
  let useTstamps = v.cmd2KeyPressed;

  // find and validate startEl with @startId
  let startId = v.selectedElements[0];
  var startEl = v.xmlDoc.querySelector("[*|id='" + startId + "']");
  if (!startEl) return;
  if (!['note', 'chord', 'rest', 'mRest', 'multiRest'].includes(startEl.nodeName)) {
    console.info('addControlElement: Cannot add new element to ' + startEl.nodeName + '.');
    return;
  }
  // staveArray lists staff numbers of all selected elements
  let staveArray = [];
  let startStaffNumber = startEl.closest('staff')?.getAttribute('n'); // get staff number for start element
  if (startStaffNumber) staveArray.push(startStaffNumber);
  // find and validate end element
  let endId = '';
  let sc = cm.getSearchCursor('xml:id="' + startId + '"');
  if (!sc.findNext()) return;
  const p = sc.from();
  var endEl;
  if (v.selectedElements.length === 1 && ['slur', 'tie', 'phrase', 'hairpin', 'gliss'].includes(elName)) {
    // if one selected element, find a second automatically
    endId = utils.getIdOfNextElement(cm, p.line, ['note'])[0];
  } else if (v.selectedElements.length >= 2) {
    endId = v.selectedElements[v.selectedElements.length - 1];
  }
  if (endId) {
    endEl = v.xmlDoc.querySelector("[*|id='" + endId + "']");
    if (!['note', 'chord', 'mRest', 'multiRest'].includes(endEl.nodeName)) {
      console.info('addControlElement: Cannot add new element to end element ' + endEl.nodeName);
      return;
    }
    const endStaffNumber = endEl.closest('staff')?.getAttribute('n');
    if (endStaffNumber && !staveArray.includes(endStaffNumber)) {
      staveArray.push(endStaffNumber);
    }
  }
  // check inner elements (without start/end) for staff numbers and add them, if missing in staveArray
  for (let i = 1; i < v.selectedElements.length - 1; i++) {
    let el = v.xmlDoc.querySelector("[*|id='" + v.selectedElements[i] + "']");
    let n = el?.closest('staff')?.getAttribute('n');
    if (!staveArray.includes(n)) staveArray.push(n);
  }
  // create element to be inserted
  let newElement = v.xmlDoc.createElementNS(dutils.meiNameSpace, elName);
  let uuid = utils.generateXmlId(elName, v.xmlIdStyle);
  newElement.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);

  // potential second new element for pedal
  let uuid2, newElement2;

  // add @staff attribute of start element
  if (staveArray.length > 0) newElement.setAttribute('staff', staveArray.sort().join(' '));

  // always compute time stamps for checking
  let tstamp = speed.getTstampForElement(v.xmlDoc, startEl);
  let m = 0;
  let tstamp2 = '';
  if (endEl) {
    m = speed.getMeasureDistanceBetweenElements(v.xmlDoc, startEl, endEl);
    tstamp2 = speed.getTstampForElement(v.xmlDoc, endEl);
  }

  // elements with both startid and endid
  if (['slur', 'tie', 'phrase', 'hairpin', 'gliss'].includes(elName)) {
    // stop, if selected elements are on the same beat position and through warning.
    if (m === 0 && tstamp2 === tstamp && !startEl.hasAttribute('grace') && !endEl.hasAttribute('grace')) {
      let msg = useTstamps ? 'Cannot insert ' : 'Attention with ' + elName + ' (' + uuid + '): ';
      msg += startId + ' and ' + endId + ' are on the same beat position ' + tstamp + '.';
      console.log(msg);
      v.showAlert(msg, 'warning');
      if (useTstamps) return;
    }
    if (useTstamps) {
      newElement.setAttribute('tstamp', tstamp);
      newElement.setAttribute('tstamp2', utils.writeMeasureBeat(m, tstamp2));
    } else {
      newElement.setAttribute('startid', '#' + startId);
      newElement.setAttribute('endid', '#' + endId);
    }
  } else if (
    // only a @startid
    ['fermata', 'dir', 'dynam', 'tempo', 'pedal', 'mordent', 'trill', 'turn'].includes(elName)
  ) {
    if (useTstamps) {
      newElement.setAttribute('tstamp', tstamp);
    } else {
      newElement.setAttribute('startid', '#' + startId);
    }
  }
  // add an optional endid (but only if tstamps are different)
  if (endId && ['dir', 'dynam', 'mordent', 'trill'].includes(elName) && (m !== 0 || tstamp !== tstamp2)) {
    if (useTstamps) {
      newElement.setAttribute('tstamp2', utils.writeMeasureBeat(m, tstamp2));
    } else {
      newElement.setAttribute('endid', '#' + endId);
    }
    if (['trill'].includes(elName)) {
      // @extender for endid
      newElement.setAttribute('extender', 'true');
    }
  }

  // handle @form attribute
  if (form && ['hairpin', 'fermata', 'mordent', 'trill', 'turn'].includes(elName)) {
    newElement.setAttribute('form', form);
  }

  // placement for pedal is @dir=up|down
  if (placement && ['pedal'].includes(elName)) {
    newElement.setAttribute('dir', placement);

    // add dir=up element to endEl (only if tstamps are different)
    if (endEl && endId && placement === 'down' && (m !== 0 || tstamp !== tstamp2)) {
      newElement2 = v.xmlDoc.createElementNS(dutils.meiNameSpace, elName);
      uuid2 = utils.generateXmlId(elName, v.xmlIdStyle);
      newElement2.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid2);
      if (useTstamps) {
        newElement2.setAttribute('tstamp', tstamp2);
      } else {
        newElement2.setAttribute('startid', '#' + endId);
      }
      if (staveArray.length > 0) newElement2.setAttribute('staff', staveArray.sort().join(' '));
      newElement2.setAttribute('dir', 'up');
    }
    placement = '';
  }
  if (placement) {
    if (['slur', 'tie', 'phrase'].includes(elName)) {
      newElement.setAttribute('curvedir', placement);
    } else if (elName === 'arpeg') {
      newElement.setAttribute('order', placement);
    } else {
      newElement.setAttribute('place', placement);
    }
  }
  if (['arpeg'].includes(elName)) {
    newElement.setAttribute('plist', '#' + v.selectedElements.join(' #'));
  }
  if (form && ['dir', 'dynam', 'tempo'].includes(elName)) {
    newElement.appendChild(v.xmlDoc.createTextNode(form));
  }

  // add new element(s) to DOM
  startEl.closest('measure').appendChild(newElement); //.cloneNode(true));

  // add new element to editor at end of measure
  v.allowCursorActivity = false; // to prevent reloading after each edit
  if (p) {
    let p1 = utils.moveCursorToEndOfMeasure(cm, p); // resets selectedElements!!
    console.log('p1: ', p);
    cm.replaceRange(dutils.xmlToString(newElement) + '\n', p1);
    cm.indentLine(p1.line, 'smart');
    cm.indentLine(p1.line + 1, 'smart');
  }
  if (newElement2) {
    // only for pedal up case
    endEl.closest('measure').appendChild(newElement2);
    utils.setCursorToId(cm, endId);
    let p1 = utils.moveCursorToEndOfMeasure(cm); // resets selectedElements!!
    cm.replaceRange(dutils.xmlToString(newElement2) + '\n', p1);
    cm.indentLine(p1.line, 'smart');
    cm.indentLine(p1.line + 1, 'smart');
  }
  utils.setCursorToId(cm, uuid); // to select new element

  // prepare final state
  v.lastNoteId = startId;
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  if (uuid2) v.selectedElements.push(uuid2);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // addControlElement()

/**
 * Inserts a clef change element before/after the current selection
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} shape ('G', 'F', 'C')
 * @param {string} line ('2', ...)
 * @param {boolean} before element, or after (false)
 * @returns
 */
export function addClefChange(v, cm, shape = 'G', line = '2', before = true) {
  if (v.selectedElements.length === 0) return;
  v.allowCursorActivity = false; // stop update notation
  let id = v.selectedElements[0];
  var el = v.xmlDoc.querySelector("[*|id='" + id + "']");
  let chord = el.closest('chord');
  if (chord) id = chord.getAttribute('xml:id');
  let staffNumber = el.closest('staff')?.getAttribute('n');

  // create new DOM element
  let newElement = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'clef');
  let uuid = utils.generateXmlId('clef', v.xmlIdStyle);
  newElement.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
  newElement.setAttribute('line', line);
  newElement.setAttribute('shape', shape);
  if (staffNumber) newElement.setAttribute('staff', staffNumber);
  v.xmlDocOutdated = true;

  utils.setCursorToId(cm, id);
  if (before) {
    cm.replaceRange(dutils.xmlToString(newElement) + '\n', cm.getCursor());
  } else {
    cm.execCommand('toMatchingTag');
    cm.execCommand('goLineEnd');
    cm.replaceRange('\n' + dutils.xmlToString(newElement), cm.getCursor());
  }
  cm.execCommand('indentAuto'); // auto indent current line or selection
  utils.setCursorToId(cm, uuid); // to select new element
  v.allowCursorActivity = true; // update notation again
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.lastNoteId = uuid;
  v.updatePage(cm, '', uuid);
} // addClefChange()

/**
 * Reverses or inserts att:placement (artic, ...), att.curvature (slur, tie,
 * phrase) and att.stems (note, chord) of current element
 * (or its children, such as all notes/chords within a beam).
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} modifier
 */
export function invertPlacement(v, cm, modifier = false) {
  v.loadXml(cm.getValue());
  let ids = utils.sortElementsByScorePosition(v.selectedElements);
  ids = speed.filterElements(ids, v.xmlDoc);
  console.info('invertPlacement ids: ', ids);
  v.allowCursorActivity = false; // no need to redraw notation
  let noteList, range;
  for (let id of ids) {
    var el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    let chordId = utils.insideParent(id);
    if (el && el.nodeName === 'note') {
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
      if (el.getAttribute(attr) === 'between' && el.hasAttribute('staff')) {
        let staves = el.getAttribute('staff');
        el.setAttribute('staff', staves.split(' ')[0]);
      }
      if (
        el.hasAttribute(attr) &&
        att.dataPlacement.includes(el.getAttribute(attr)) &&
        el.getAttribute(attr) !== 'below'
      ) {
        val = 'below';
      }
      if (modifier) {
        let response = getStaffNumbersForClosestStaffGroup(v, el);
        if (response) {
          let staffNumbers = []; // relevant two staves for @place='between'
          if (response.staffNumbers.length === 2) {
            staffNumbers = response.staffNumbers.sort();
          } else {
            // try to guess the relevant two staves
            staffNumbers = [response.staffNumber];
            const i = response.staffNumbers.indexOf(response.staffNumber);
            if (i === response.staffNumbers.length - 1) {
              staffNumbers.push(response.staffNumbers[i - 1]);
            } else {
              staffNumbers.push(response.staffNumbers[i + 1]);
            }
            let msg =
              'Editor between placement: Please check staff numbers of ' +
              el.nodeName +
              ' (' +
              id +
              ') ' +
              ' as it does not sit in a staff group with two staves' +
              ' and relevant staves cannot be clearly determined.';
            console.log(msg);
            v.showAlert(msg, 'info');
          }
          // set @place and @staff attribute
          if (!el.hasAttribute(attr) || (el.hasAttribute(attr) && el.getAttribute(attr) !== 'between')) {
            val = 'between'; // set to between, if no or other @place attribute
            el.setAttribute('staff', staffNumbers.sort().join(' '));
          } else {
            val = 'above'; // default value
            el.setAttribute('staff', staffNumbers[0]);
          }
        }
      }
      // for fermata, change form from inv to nothing or back
      if (el.nodeName === 'fermata') {
        val === 'below' ? el.setAttribute('form', 'inv') : el.removeAttribute('form');
      }
      el.setAttribute(attr, val);
      range = replaceInEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
    } else if (att.attCurvature.includes(el.nodeName)) {
      attr = 'curvedir';
      if (el.hasAttribute(attr) && el.getAttribute(attr) === 'above') {
        val = 'below';
      }
      el.setAttribute(attr, val);
      range = replaceInEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
    } else if (att.attStems.includes(el.nodeName)) {
      (attr = 'stem.dir'), (val = 'up');
      if (el.hasAttribute(attr) && el.getAttribute(attr) === val) {
        val = 'down';
      }
      el.setAttribute(attr, val);
      range = replaceInEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
      // invert @num.place within tuplet
    } else if (el.nodeName === 'tuplet') {
      attr = 'num.place';
      val = 'above';
      if (el.hasAttribute(attr) && el.getAttribute(attr) === val) {
        val = 'below';
      }
      el.setAttribute(attr, val);
      range = replaceInEditor(cm, el, true);
      // txtEdr.autoIndentSelectedRows();
    } else if (el.nodeName === 'beamSpan') {
      // replace individual notes in beamSpan
      (attr = 'stem.dir'), (val = 'up');
      let plist = el.getAttribute('plist');
      if (plist) {
        plist.split(' ').forEach((p) => {
          let note = v.xmlDoc.querySelector("[*|id='" + utils.rmHash(p) + "']");
          if (note) {
            if (note.parentNode.nodeName === 'chord') note = note.parentNode;
            if (note.hasAttribute(attr) && note.getAttribute(attr) === val) {
              val = 'down';
            }
            note.setAttribute(attr, val);
          }
          v.allowCursorActivity = false; // no need to redraw notation
          range = replaceInEditor(cm, note, true);
        });
      }
      // find all note/chord elements children and execute InvertingAction
    } else if ((noteList = el.querySelectorAll('note, chord'))) {
      // console.info('noteList: ', noteList);
      (attr = 'stem.dir'), (val = 'up');
      for (let note of noteList) {
        // skip notes within chords
        if (note.parentNode.nodeName === 'chord') continue;
        if (note.hasAttribute(attr) && note.getAttribute(attr) === val) {
          val = 'down';
        }
        note.setAttribute(attr, val);
        v.allowCursorActivity = false; // no need to redraw notation
        range = replaceInEditor(cm, note, true);
        // txtEdr.autoIndentSelectedRows();
      }
    } else {
      console.info('invertPlacement(): ' + el.nodeName + ' contains no elements to invert.');
    }
  }
  // console.info('TextCursor: ', txtEdr.getCursorBufferPosition());
  v.selectedElements = ids;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // invertPlacement()

/**
 * Toggles (switches on/off) artic at selected elements
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} artic ('stacc', ...)
 */
export function toggleArtic(v, cm, artic = 'stacc') {
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.allowCursorActivity = false;
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
      uuid = toggleArticForNote(note, artic, v.xmlIdStyle);
      uuid ? (ids[i] = uuid) : (ids[i] = id);
      range = replaceInEditor(cm, note, true);
      cm.execCommand('indentAuto');
    } else if ((noteList = utils.findNotes(id))) {
      let noteId;
      for (noteId of noteList) {
        note = v.xmlDoc.querySelector("[*|id='" + noteId + "']");
        uuid = toggleArticForNote(note, artic, v.xmlIdStyle);
        range = replaceInEditor(cm, note, true);
        cm.execCommand('indentAuto');
      }
    }
  }
  v.selectedElements = ids;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // toggleArtic()

/**
 * Shifts element (rests, note) up/down by pitch name (1 or 7 steps)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {int} deltaPitch (-1, -12, +2)
 */
export function shiftPitch(v, cm, deltaPitch = 0) {
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.allowCursorActivity = false;
  let i;
  for (i = 0; i < ids.length; i++) {
    let id = ids[i];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) continue;
    let chs = Array.from(el.querySelectorAll('note,rest,mRest,multiRest'));
    if (chs.length > 0)
      // shift many elements
      chs.forEach((ele) => replaceInEditor(cm, pitchMover(ele, deltaPitch)), true);
    // shift one element
    else replaceInEditor(cm, pitchMover(el, deltaPitch), true);
  }
  v.selectedElements = ids;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // shiftPitch()

/**
 * In/decrease duration of selected element (ignore, when no duration)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} what ('increase', 'decrease')
 */
export function modifyDuration(v, cm, what = 'increase') {
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.allowCursorActivity = false;
  ids.forEach((id) => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (el) {
      let dur = el.getAttribute('dur');
      if (dur) {
        let i = att.dataDurationCMN.indexOf(dur);
        i = what === 'increase' ? i - 1 : i + 1; // increase: go up the array to the longer values
        i = Math.min(Math.max(0, i), att.dataDurationCMN.length - 1);
        el.setAttribute('dur', att.dataDurationCMN.at(i));
        replaceInEditor(cm, el);
      }
    }
  });
  v.selectedElements = ids;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // modifyDuration()

/**
 * Moves selected elements to next staff (without checking boundaries)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} upwards
 */
export function moveElementToNextStaff(v, cm, upwards = true) {
  console.info('moveElementToNextStaff(' + (upwards ? 'up' : 'down') + ')');
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.allowCursorActivity = false;
  let i;
  let noteList;
  for (i = 0; i < ids.length; i++) {
    let id = ids[i];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) continue;
    if (['note', 'chord', 'rest', 'mRest', 'multiRest'].includes(el.nodeName)) {
      staffMover(cm, el, upwards);
    } else if ((noteList = utils.findNotes(id))) {
      let noteId;
      for (noteId of noteList) {
        console.info('moving: ' + noteId);
        let sel = v.xmlDoc.querySelector("[*|id='" + noteId + "']");
        staffMover(cm, sel, upwards);
      }
    }
  }
  v.selectedElements = ids;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // moveElementToNextStaff()

/**
 * Adds beam element
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} elementName
 * @returns
 */
export function addBeamElement(v, cm, elementName = 'beam') {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  if (v.selectedElements.length <= 1) return;
  // console.info('addBeamElement(' + elementName +
  //   '): selectedElements:', v.selectedElements);
  let id1 = v.selectedElements[0]; // xml:id string
  let parentId;
  if ((parentId = utils.insideParent(id1, 'chord'))) id1 = parentId;
  let id2 = v.selectedElements[v.selectedElements.length - 1];
  if ((parentId = utils.insideParent(id2, 'chord'))) id2 = parentId;
  let n1 = v.xmlDoc.querySelector("[*|id='" + id1 + "']");
  let n2 = v.xmlDoc.querySelector("[*|id='" + id2 + "']");
  let par1 = n1.parentNode;
  v.allowCursorActivity = false;
  // let checkPoint = buffer.createCheckpoint(); TODO
  // add beam element, if selected elements have same parent
  // TODO check whether inside tuplets and accept that as well
  if (par1.getAttribute('xml:id') === n2.parentNode.getAttribute('xml:id')) {
    let beam = document.createElementNS(dutils.meiNameSpace, elementName);
    let uuid = utils.generateXmlId(elementName, v.xmlIdStyle);
    beam.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
    par1.insertBefore(beam, n1);
    let nodeList = par1.childNodes;
    let insert = false;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].nodeType === Node.TEXT_NODE) continue;
      if (nodeList[i].getAttribute('xml:id') === id1) insert = true;
      if (nodeList[i].getAttribute('xml:id') === id2) {
        let n = nodeList[i].cloneNode(); // make a copy for replacement later
        beam.appendChild(nodeList[i--]);
        replaceInEditor(cm, n, true, beam);
        cm.execCommand('indentAuto');
        break;
      }
      if (insert) {
        removeInEditor(cm, nodeList[i]);
        beam.appendChild(nodeList[i--]);
      }
    }
    // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
    v.selectedElements = [];
    v.selectedElements.push(uuid);
    addApplicationInfo(v, cm);
    v.updateData(cm, false, true);
  } else {
    console.log('Cannot add ' + elementName + ' element, selected elements have different parents.');
  }
  v.allowCursorActivity = true; // update notation again
} // addBeamElement()

/**
 * Adds beamSpan element to selected elements
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @returns
 */
export function addBeamSpan(v, cm) {
  v.loadXml(cm.getValue());
  if (v.selectedElements.length < 1) return;
  // select chords instead of individual notes
  for (let i = 0; i < v.selectedElements.length; i++) {
    let chord = utils.insideParent(v.selectedElements[i], 'chord');
    if (chord && !v.selectedElements.includes(chord)) {
      v.selectedElements.unshift(chord);
      i++;
    }
  }
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  let id1 = v.selectedElements[0]; // xml:id string
  let id2 = v.selectedElements[v.selectedElements.length - 1];
  // add control like element <octave @startid @endid @dis @dis.place>
  let beamSpan = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'beamSpan');
  let uuid = utils.generateXmlId('beamSpan', v.xmlIdStyle);
  beamSpan.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
  beamSpan.setAttribute('startid', '#' + id1);
  beamSpan.setAttribute('endid', '#' + id2);
  beamSpan.setAttribute('plist', v.selectedElements.map((e) => '#' + e).join(' '));
  let n1 = v.xmlDoc.querySelector("[*|id='" + id1 + "']");
  n1.closest('measure').appendChild(beamSpan);
  v.allowCursorActivity = false;
  let sc = cm.getSearchCursor('xml:id="' + id1 + '"');
  if (sc.findNext()) {
    let p1 = utils.moveCursorToEndOfMeasure(cm, sc.from());
    cm.replaceRange(dutils.xmlToString(beamSpan) + '\n', cm.getCursor());
    cm.indentLine(p1.line, 'smart'); // TODO
    cm.indentLine(p1.line + 1, 'smart');
    utils.setCursorToId(cm, uuid);
  }
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.lastNoteId = id2;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // addBeamSpan()

/**
 * Adds an octave element and modifies notes inside selected elements
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} disPlace ('above', 'below')
 * @param {string} dis (8, 15, 22)
 * @returns
 */
export function addOctaveElement(v, cm, disPlace = 'above', dis = '8') {
  v.loadXml(cm.getValue());
  if (v.selectedElements.length < 1) return;
  console.info('addOctaveElement selectedElements:', v.selectedElements);
  let id1 = v.selectedElements[0]; // xml:id string
  let id2 = v.selectedElements[v.selectedElements.length - 1];
  let n1 = v.xmlDoc.querySelector("[*|id='" + id1 + "']");
  // add control like element <octave @startid @endid @dis @dis.place>
  let octave = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'octave');
  let uuid = utils.generateXmlId('octave', v.xmlIdStyle);
  octave.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
  octave.setAttribute('startid', '#' + id1);
  octave.setAttribute('endid', '#' + id2);
  octave.setAttribute('dis', dis);
  octave.setAttribute('dis.place', disPlace);
  n1.closest('measure').appendChild(octave);
  // add it to the txtEdr
  v.allowCursorActivity = false;
  // let checkPoint = buffer.createCheckpoint(); TODO
  let sc = cm.getSearchCursor('xml:id="' + id1 + '"');
  if (sc.findNext()) {
    let p1 = utils.moveCursorToEndOfMeasure(cm, sc.from());
    cm.replaceRange(dutils.xmlToString(octave) + '\n', cm.getCursor());
    cm.indentLine(p1.line, 'smart'); // TODO
    cm.indentLine(p1.line + 1, 'smart');
    utils.setCursorToId(cm, uuid);
  }
  // find plist and modify elements
  findAndModifyOctaveElements(cm, v.xmlDoc, id1, id2, disPlace, dis);
  // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.lastNoteId = id2;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // addOctaveElement()

/**
 * Surrounds selected elements with a supplied element
 * (and a responsibility statement from v.respId derived
 * from mei-friend settings.
 *
 * If attrName is specified, it searches for those attributes,
 * inserts them as new elements, and surrounds them with supplied
 * elements. If there is already such a artic/accid child element,
 * take it and surround it.
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} attrName ('artic', 'accid')
 * @returns
 */
export function addSuppliedElement(v, cm, attrName = 'none') {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  if (v.selectedElements.length < 1) return;
  v.allowCursorActivity = false;

  let uuids = [];
  v.selectedElements.forEach((id) => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) {
      console.warn('No such element in xml document: ' + id);
    } else {
      let parent = el.parentNode;

      // convert attrName artic|accid to note|chord element and surround that
      if (
        (['note', 'chord'].includes(el.nodeName) && attrName === 'artic') ||
        (el.nodeName === 'note' && attrName === 'accid')
      ) {
        if (!el.hasAttribute(attrName)) {
          let childElement;
          el.childNodes.forEach((ch) => {
            if (ch.nodeName === attrName) childElement = ch;
          });
          if (childElement) {
            parent = el;
            el = childElement;
          } else {
            const msg =
              'No ' + attrName + ' attribute or child node found in element ' + el.nodeName + ' (' + id + ').';
            console.log(msg);
            v.showAlert(msg, 'warning');
            return;
          }
        } else {
          // make new element out of attribute and handle it as element to be surrounded
          let attrValue = el.getAttribute(attrName);
          let attrEl = document.createElementNS(dutils.meiNameSpace, attrName);
          let uuid = mintSuppliedId(id, attrName);
          attrEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
          attrEl.setAttribute(attrName, attrValue);
          el.removeAttribute(attrName);
          el.appendChild(attrEl);
          replaceInEditor(cm, el, true);
          cm.execCommand('indentAuto');
          parent = el;
          el = attrEl;
        }
      } else if (['accid', 'artic'].includes(attrName)) {
        const msg = 'Only chord and note elements are allowed for this command (you selected ' + el.nodeName + ').';
        console.log(msg);
        v.showAlert(msg, 'warning');
      }

      let sup = document.createElementNS(dutils.meiNameSpace, 'supplied');
      let uuid = mintSuppliedId(id, 'supplied');
      sup.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
      let respId = document.getElementById('respSelect').value;
      if (respId) sup.setAttribute('resp', '#' + respId);
      parent.replaceChild(sup, el);
      sup.appendChild(el);
      replaceInEditor(cm, el, true, sup);
      cm.execCommand('indentAuto');
      uuids.push(uuid);
    }
  });
  // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
  v.selectedElements = [];
  uuids.forEach((u) => v.selectedElements.push(u));
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again

  function mintSuppliedId(id, nodeName) {
    // follow the Mozarteum schema, keep numbers (for @o-sapov)
    let underscoreId = id.match(/_\d+$/);
    if (underscoreId) {
      return nodeName + underscoreId[0];
    }
    return utils.generateXmlId(nodeName, v.xmlIdStyle);
  }
} // addSuppliedElement()

/**
 * Adds a vertical group attribute (vgrp) to all selected elements
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @returns
 */
export function addVerticalGroup(v, cm) {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  if (v.selectedElements.length < 1) return;
  v.allowCursorActivity = false;
  let value = 1;
  let existingValues = []; // search for existing vgrp values on SVG page
  // look to current page SVG dynam@vgrp, dir@vgrp, hairpin@vgrp, pedal@vgrp
  // and increment value if already taken
  document.querySelectorAll('g[data-vgrp]').forEach((e) => {
    let value = parseInt(e.getAttribute('data-vgrp'));
    if (existingValues.indexOf(value) < 0) existingValues.push(value);
  });
  while (existingValues.indexOf(value) >= 0) value++; // increment until unique
  v.selectedElements.forEach((id) => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) {
      console.warn('No such element in xml document: ' + id);
    } else if (att.attVerticalGroup.includes(el.nodeName)) {
      el.setAttribute('vgrp', value);
      replaceInEditor(cm, el, true);
      cm.execCommand('indentAuto');
    } else {
      console.warn('Vertical group not supported for ', el);
    }
  });
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // addVerticalGroup()

/**
 * Adds an application element to appInfo or updates its date, if already there
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function addApplicationInfo(v, cm) {
  if (document.getElementById('addApplicationNote').checked) {
    let meiHead = v.xmlDoc.querySelector('meiHead');
    if (!meiHead) return false;
    let appList = v.xmlDoc.querySelectorAll('application');
    let encodingDesc, appInfo, application;
    let update = false;
    for (let a of appList) {
      appInfo = a.parentElement;
      encodingDesc = appInfo.parentElement;
      if (a.querySelector('name').textContent === 'mei-friend') {
        application = a; // update existing application element
        application.setAttribute('enddate', utils.toISOStringLocal(new Date()));
        application.setAttribute('version', version);
        const range = replaceInEditor(cm, application);
        for (let l = range.start.line; l <= range.end.line; l++) {
          cm.indentLine(l, 'smart');
        }
        update = true;
        break;
      }
    }
    if (update) return true;

    // application tree for mei-friend is created first time
    if (!encodingDesc) {
      encodingDesc = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'encodingDesc');
      encodingDesc.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('encodingDesc', v.xmlIdStyle));
      meiHead.appendChild(encodingDesc);
    }
    if (!appInfo) {
      appInfo = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'appInfo');
      appInfo.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('appInfo', v.xmlIdStyle));
      encodingDesc.appendChild(appInfo);
    }
    if (!application) {
      application = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'application');
      application.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('application', v.xmlIdStyle));
      application.setAttribute('startdate', utils.toISOStringLocal(new Date()));
      application.setAttribute('version', version);
      let name = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'name');
      name.textContent = 'mei-friend';
      name.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('name', v.xmlIdStyle));
      let p = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'p');
      p.textContent = 'First edit by mei-friend ' + version + ', ' + versionDate + '.';
      p.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('p', v.xmlIdStyle));
      application.appendChild(name);
      application.appendChild(p);
      appInfo.appendChild(application);
    }
    // insert new element to editor
    const range = replaceInEditor(cm, meiHead);
    for (let l = range.start.line; l <= range.end.line; l++) {
      cm.indentLine(l, 'smart');
    }
    return true;
  }
} // addApplicationInfo()

/**
 * Wrapper function to utils.cleanAccid() for cleaning
 * superfluous @accid.ges attributes
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function cleanAccid(v, cm) {
  v.allowCursorActivity = false;
  v.loadXml(cm.getValue(), true);
  utils.cleanAccid(v.xmlDoc, cm);
  v.allowCursorActivity = true;
}

/**
 * Checks accid/accid.ges attributes of all notes against
 * keySig/key.sig information and measure-wise accidentals,
 * finds instances of double accid & accid.ges.
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} change
 */
export function correctAccidGes(v, cm, change = false) {
  v.initCodeCheckerPanel('Check @accid.ges attributes (against key signature, measure-wise accids, and ties).');

  let d = true;
  v.allowCursorActivity = false;
  v.loadXml(cm.getValue(), true); // force reload DOM

  // define default key signatures per staff
  let noStaves = v.xmlDoc.querySelector('scoreDef').querySelectorAll('staffDef').length;
  let keySignatures = Array(noStaves).fill('0');
  if (d) console.debug('correctAccidGes. ' + noStaves + ' staves defined.');

  // list all ties to handle those separately
  let ties = {};
  v.xmlDoc.querySelectorAll('tie').forEach((t) => {
    let startId = utils.rmHash(t.getAttribute('startid')) || '';
    let endId = utils.rmHash(t.getAttribute('endid')) || '';
    if (endId) {
      if (!startId) console.log('Tie ' + t.getAttribute('xml:id') + ' without startId. ');
      else ties[endId] = startId;
    }
  });

  let count = 0;
  let measureAccids = {}; // accidentals within a measure[staff][oct][pname]
  let list = v.xmlDoc.querySelectorAll('[key\\.sig],keySig,measure,note');
  list.forEach((e) => {
    if (e.nodeName === 'scoreDef' && e.hasAttribute('key.sig')) {
      // key.sig inside scoreDef: write @sig to all staves
      let value = e.getAttribute('key.sig');
      for (let k in keySignatures) keySignatures[k] = value;
      if (d) console.debug('New key.sig in scoreDef: ' + value);
    } else if (e.nodeName === 'staffDef' && e.hasAttribute('key.sig')) {
      // key.sig inside staffDef: write @sig to that staff
      let n = parseInt(e.getAttribute('n'));
      let value = e.getAttribute('key.sig');
      if (n && n > 0 && n <= keySignatures.length) keySignatures[n - 1] = value;
      if (d) console.debug('New key.sig in staffDef(' + e.getAttribute('xml:id') + ', n=' + n + '): ' + value);
    } else if (e.nodeName === 'keySig' && e.hasAttribute('sig')) {
      // keySig element in a staffDef
      let n = parseInt(e.closest('staffDef')?.getAttribute('n'));
      let value = e.getAttribute('sig');
      if (n && n > 0 && n <= keySignatures.length) keySignatures[n - 1] = value;
      if (d) console.debug('New keySig("' + e.getAttribute('xml:id') + '")@sig in staffDef(' + n + '): ' + value);
    } else if (e.nodeName === 'measure') {
      // clear measureAccids object
      measureAccids = {};
    } else if (e.nodeName === 'note') {
      // found a note to check!
      let data = {};
      data.xmlId = e.getAttribute('xml:id') || '';
      data.measure = e.closest('measure')?.getAttribute('n') || '';
      // find staff number for note
      let staffNumber = parseInt(e.closest('staff')?.getAttribute('n'));
      let pName = e.getAttribute('pname') || '';
      let oct = e.getAttribute('oct') || '';
      let value = keySignatures[staffNumber - 1];
      let affectedNotes = []; // array of note names affected by keySig@sig or @key.sig
      data.keySigAccid = 'n'; // n, f, s
      let splitS = value.split('s');
      let splitF = value.split('f');
      if (splitF.length > 1) {
        data.keySigAccid = 'f';
        affectedNotes = att.flats.slice(0, splitF[0]);
      } else if (splitS.length > 1) {
        data.keySigAccid = 's';
        affectedNotes = att.sharps.slice(0, splitS[0]);
      }
      let accid = e.getAttribute('accid') || e.querySelector('[accid]')?.getAttribute('accid');
      let accidGes = e.getAttribute('accid.ges') || e.querySelector('[accid\\.ges]')?.getAttribute('accid.ges');

      // find doubled accid/accid.ges information
      if (accid && accidGes) {
        if (accid === accidGes) {
          // remove @accid.ges
          data.html =
            ++count +
            ' Measure ' +
            data.measure +
            ', Note ' +
            data.xmlId +
            ' has both accid and accid.ges="' +
            accid +
            '". Remove accid.ges. ';
          data.correct = () => {
            v.allowCursorActivity = false;
            e.removeAttribute('accid.ges');
            replaceInEditor(cm, e, false);
            v.allowCursorActivity = true;
          };
        } else {
          data.html =
            ++count +
            ' Measure ' +
            data.measure +
            ', Note ' +
            data.xmlId +
            ' has both accid="' +
            accid +
            '" and accid.ges="' +
            accidGes +
            '" with different content. To be handled manually.';
        }
        v.addCodeCheckerEntry(data);
      }

      accidGes = e.getAttribute('accid.ges') || e.querySelector('[accid\\.ges]')?.getAttribute('accid.ges') || 'n';

      // TODO: make logic simpler

      if (data.xmlId && data.xmlId in ties) {
        // Check whether note tied by starting note
        let startingNote = v.xmlDoc.querySelector('[*|id=' + ties[data.xmlId] + ']');
        if (pName !== startingNote.getAttribute('pname')) {
          data.html =
            ++count +
            ' Measure ' +
            data.measure +
            ' Tied note ' +
            data.xmlId +
            ': ' +
            pName +
            ' not same pitch name as ' +
            ties[data.xmlId] +
            ': ' +
            startingNote.getAttribute('pname');
          v.addCodeCheckerEntry(data);
          console.log(data.html);
        }
        if (oct !== startingNote.getAttribute('oct')) {
          data.html =
            ++count +
            ' Measure ' +
            data.measure +
            ' Tied note ' +
            data.xmlId +
            ' not same octave number as ' +
            ties[data.xmlId];
          v.addCodeCheckerEntry(data);
          console.log(data.html);
        }
        let startingAccid =
          startingNote.getAttribute('accid') ||
          startingNote.querySelector('[accid]')?.getAttribute('accid') ||
          startingNote.getAttribute('accid.ges') ||
          startingNote.querySelector('[accid\\.ges]')?.getAttribute('accid.ges') ||
          'n';
        if ((accid || accidGes) !== startingAccid) {
          data.html =
            ++count +
            ' Measure ' +
            data.measure +
            ' Tied note ' +
            data.xmlId +
            ' accid"' +
            (accid || accidGes) +
            '" not same as in starting note ' +
            ties[data.xmlId] +
            ': ' +
            startingAccid;
          if (startingAccid && startingAccid !== 'n') {
            data.correct = () => {
              v.allowCursorActivity = false;
              e.setAttribute('accid.ges', startingAccid);
              replaceInEditor(cm, e, false);
              v.allowCursorActivity = true;
            };
          } else {
            data.correct = () => {
              v.allowCursorActivity = false;
              e.removeAttribute('accid.ges');
              replaceInEditor(cm, e, false);
              v.allowCursorActivity = true;
            };
          }
          v.addCodeCheckerEntry(data);
          console.log(data.html);
        }
        let a = 1234;
      } else if (
        // check all accids having appeared in the current measure
        !accid &&
        staffNumber in measureAccids &&
        oct in measureAccids[staffNumber] &&
        pName in measureAccids[staffNumber][oct] &&
        measureAccids[staffNumber][oct][pName] !== accidGes
      ) {
        data.measureAccid = measureAccids[staffNumber][oct][pName];
        data.html =
          ++count +
          ' Measure ' +
          data.measure +
          ', Note ' +
          data.xmlId +
          ' lacks an accid.ges="' +
          data.measureAccid +
          '", because it has been defined earlier in the measure.';
        data.correct = () => {
          v.allowCursorActivity = false;
          e.setAttribute('accid.ges', data.measureAccid);
          replaceInEditor(cm, e, false);
          v.allowCursorActivity = true;
        };
        v.addCodeCheckerEntry(data);
        console.debug(data.html);
        let a = 123;
      } else if (affectedNotes.includes(pName)) {
        // a note, affected by key signature, either has @accid inside or as a child or has @accid.ges inside or as a child
        if (
          !accid &&
          accidGes !== data.keySigAccid &&
          !(
            staffNumber in measureAccids &&
            oct in measureAccids[staffNumber] &&
            pName in measureAccids[staffNumber][oct] &&
            measureAccids[staffNumber][oct][pName] === accidGes
          )
        ) {
          data.html =
            ++count +
            ' Measure ' +
            data.measure +
            ', Note ' +
            data.xmlId +
            ' lacks an accid.ges="' +
            data.keySigAccid +
            '"';
          data.correct = () => {
            v.allowCursorActivity = false;
            e.setAttribute('accid.ges', data.keySigAccid);
            replaceInEditor(cm, e, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
          console.debug(data.html);
          let a = 123;
        }
      } else if (
        // Check if there is an accid.ges
        // that has not been defined in keySig
        // or earlier in the measure
        !affectedNotes.includes(pName) &&
        !accid &&
        !(
          staffNumber in measureAccids &&
          oct in measureAccids[staffNumber] &&
          pName in measureAccids[staffNumber][oct] &&
          measureAccids[staffNumber][oct][pName] === accidGes
        ) &&
        accidGes !== 'n'
      ) {
        data.html =
          ++count +
          ' Measure ' +
          data.measure +
          ', Note ' +
          data.xmlId +
          ' has superfluous accid.ges="' +
          accidGes +
          '"';
        data.correct = () => {
          v.allowCursorActivity = false;
          e.removeAttribute('accid.ges');
          replaceInEditor(cm, e, false);
          v.allowCursorActivity = true;
        };
        v.addCodeCheckerEntry(data);
        console.debug(data.html);
      }
      if (accid) {
        if (!Object.hasOwn(measureAccids, staffNumber)) measureAccids[staffNumber] = {};
        if (!Object.hasOwn(measureAccids[staffNumber], oct)) measureAccids[staffNumber][oct] = {};
        if (!Object.hasOwn(measureAccids[staffNumber][oct], pName)) measureAccids[staffNumber][oct][pName] = {};
        measureAccids[staffNumber][oct][pName] = accid;
      }
    }
  });

  v.allowCursorActivity = true;
} // correctAccidGes()

/**
 * Wrapper function for renumbering measure numberlike attribute (@n)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} change
 */
export function renumberMeasures(v, cm, change = false) {
  v.allowCursorActivity = false;
  v.loadXml(cm.getValue(), true);
  utils.renumberMeasures(v, cm, 1, change);
  if (document.getElementById('showFacsimilePanel').checked) loadFacsimile(v.xmlDoc);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // renumberMeasures()

/**
 * Function for adding/removing xml:ids in xmlDoc & reloading MEI into cm
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} removeIds
 */
export function manipulateXmlIds(v, cm, removeIds = false) {
  let startTime = Date.now();
  let report = { added: 0, removed: 0 };
  let skipList = []; // list of xml:ids that will not be removed

  v.allowCursorActivity = false;
  v.loadXml(cm.getValue(), true);

  // start from these elements
  let selector = 'body > mdiv';
  let rootList = v.xmlDoc.querySelectorAll(selector);

  // determine skipList to securely remove ids
  if (removeIds) {
    rootList.forEach((e) => dig(e, true));
  }

  // manipulate xml tree starting from selector
  rootList.forEach((e) => dig(e));

  addApplicationInfo(v, cm);
  cm.setValue(new XMLSerializer().serializeToString(v.xmlDoc));
  v.updateData(cm, false, true);
  let msg;
  if (removeIds) {
    msg = report.removed + ' xml:ids removed from encoding, ';
    msg += skipList.length + ' xml:ids kept, because they are pointed to.';
  } else {
    msg = report.added + ' new xml:ids added to encoding';
    if (report.added > 0) {
      let el = document.getElementById('selectIdStyle');
      msg += ' (xml:id style: ' + el.value + '; e.g., "' + el.options[el.options.selectedIndex].title + '")';
    }
    msg += '.';
  }
  msg += ' (Processing time: ' + (Date.now() - startTime) / 1000 + ' s)';
  console.log(msg);
  v.showAlert(msg, 'success');
  v.allowCursorActivity = true;

  // digs through xml tree recursively, when explore=true, just adding ids that are pointed to
  function dig(el, explore = false) {
    if (el.nodeType === Node.ELEMENT_NODE) {
      if (explore) {
        // just go through xml structure and search for pointing ids
        for (let attrName of att.dataURI) {
          let value = el.getAttribute(attrName);
          if (value) {
            // split value string by whitespace
            value.split(/[\s]+/).forEach((v) => skipList.push(utils.rmHash(v)));
          }
        }
      } else {
        if (!removeIds && !el.hasAttribute('xml:id')) {
          // add xml:id when missing
          el.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId(el.nodeName, v.xmlIdStyle));
          report.added++;
        } else if (removeIds && el.hasAttribute('xml:id')) {
          // remove xml:id, unless pointed to
          if (!skipList.includes(el.getAttribute('xml:id'))) {
            el.removeAttribute('xml:id');
            report.removed++;
          }
        }
      }
      // recursively through the xml tree
      el.childNodes.forEach((e) => dig(e, explore));
    }
  }
} // manipulateXmlIds()

/**
 * Adds a zone element in editor (called from source-imager.js),
 * places it
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {object} rect
 * @param {boolean} addMeasure
 * @returns
 */
export function addZone(v, cm, rect, addMeasure = true) {
  v.allowCursorActivity = false;
  // get current element id and nodeName from editor
  let selectedId = utils.getElementIdAtCursor(cm);
  let selectedElement = v.xmlDoc.querySelector('[*|id=' + selectedId + ']');
  if (!selectedElement) {
    v.allowCursorActivity = true;
    return false;
  }

  // create zone with all attributes
  let zone = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'zone');
  let uuid = utils.generateXmlId('zone', v.xmlIdStyle);
  zone.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
  let x = Math.round(rect.getAttribute('x'));
  let y = Math.round(rect.getAttribute('y'));
  let width = Math.round(rect.getAttribute('width'));
  let height = Math.round(rect.getAttribute('height'));
  rect.setAttribute('id', uuid);
  zone.setAttribute('type', addMeasure ? 'measure' : selectedElement.nodeName);
  zone.setAttribute('ulx', x);
  zone.setAttribute('uly', y);
  zone.setAttribute('lrx', x + width);
  zone.setAttribute('lry', y + height);

  // check if current element a zone
  if (addMeasure && selectedElement.nodeName === 'zone' && selectedElement.parentElement.nodeName === 'surface') {
    // add zone to surface
    cm.execCommand('goLineEnd');
    cm.replaceRange('\n' + dutils.xmlToString(zone), cm.getCursor());
    cm.execCommand('indentAuto');
    let prevMeas = v.xmlDoc.querySelector('[facs="#' + selectedElement.getAttribute('xml:id') + '"]');
    if (prevMeas.nodeName !== 'measure') {
      // try to find closest measure element
      let m = prevMeas.closest('measure');
      if (!m) return false; // and stop, if unsuccessful
      prevMeas = m;
    }

    // Create new measure element
    let newMeas = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'measure');
    newMeas.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('measure', v.xmlIdStyle));
    newMeas.setAttribute('n', prevMeas.getAttribute('n') + '-new');
    newMeas.setAttribute('facs', '#' + uuid);

    // add to DOM
    prevMeas.after(newMeas);

    // navigate to prev measure element
    utils.setCursorToId(cm, prevMeas.getAttribute('xml:id'));
    cm.execCommand('toMatchingTag');
    cm.execCommand('goLineEnd');
    cm.replaceRange('\n' + dutils.xmlToString(newMeas), cm.getCursor());
    cm.execCommand('indentAuto');
    utils.setCursorToId(cm, uuid);

    // updating
    loadFacsimile(v.xmlDoc);
    addApplicationInfo(v, cm);
    v.updateData(cm, false, false);
    console.log('Editor: new zone ' + uuid + 'added.', rect);
    v.allowCursorActivity = true;
    return true;

    // only add zone and a @facs for the selected element
  } else if (!addMeasure && att.attFacsimile.includes(selectedElement.nodeName)) {
    // find pertinent zone in surface for inserting new zone
    let facs = v.xmlDoc.querySelectorAll('[facs],[*|id="' + selectedId + '"');
    let i = Array.from(facs).findIndex((n) => n.isEqualNode(selectedElement));
    let referenceNodeId = utils.rmHash(facs[i === 0 ? i + 1 : i - 1].getAttribute('facs'));
    let referenceNode = v.xmlDoc.querySelector('[*|id="' + referenceNodeId + '"');
    console.log('addZone() referenceNode: ', referenceNode);
    if (!referenceNode) {
      console.log('addZone(): no reference element found with xml:id="' + referenceNodeId + '"');
      v.allowCursorActivity = true;
      return false;
    }
    if (referenceNode.nodeName === 'surface') {
      referenceNode.appendChild(zone);
    } else {
      referenceNode.after(zone);
    }

    // add zone to editor
    utils.setCursorToId(cm, referenceNodeId);
    cm.execCommand('toMatchingTag');
    if (referenceNode.nodeName !== 'surface') {
      cm.execCommand('goLineEnd');
      cm.replaceRange('\n' + dutils.xmlToString(zone), cm.getCursor());
      cm.execCommand('indentAuto');
    } else {
      cm.execCommand('goLineStart');
      cm.replaceRange(dutils.xmlToString(zone), cm.getCursor());
      cm.execCommand('indentAuto');
      cm.execCommand('newlineAndIndent');
    }

    // add @facs to selected element
    selectedElement.setAttribute('facs', '#' + uuid);
    replaceInEditor(cm, selectedElement);
    utils.setCursorToId(cm, uuid);

    // updating
    loadFacsimile(v.xmlDoc);
    addApplicationInfo(v, cm);
    v.updateData(cm, false, false);
    console.log('Editor: new zone ' + uuid + 'added.', rect);
    v.allowCursorActivity = true;
    return true;
  } else {
    v.allowCursorActivity = true;
    return false;
  }
} // addZone()

/**
 * Removes a zone in editor, called from editor.js
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {Element} zone
 * @param {boolean} removeMeasure
 * @returns
 */
export function removeZone(v, cm, zone, removeMeasure = false) {
  if (!zone) return;
  removeInEditor(cm, zone);
  let rect = document.querySelector('rect[id="' + zone.getAttribute('xml:id') + '"]');
  if (rect) rect.parentElement.removeChild(rect);
  let txt = document.querySelector('text[id="' + zone.getAttribute('xml:id') + '"]');
  if (txt) txt.parentElement.removeChild(txt);
  // find elements referring to this zone id via @facs and delete them
  let ms = v.xmlDoc.querySelectorAll('[facs="#' + zone.getAttribute('xml:id') + '"]');
  ms.forEach((e) => {
    if (removeMeasure) {
      removeInEditor(cm, e);
      e.remove();
    } else {
      e.removeAttribute('facs');
      replaceInEditor(cm, e);
    }
  });
  loadFacsimile(v.xmlDoc);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, false);
} // removeZone()

/**
 * Adds a facsimile element to DOM and editor,
 * with a surface element for each page beginning <pb> to which
 * a @facs attribute is added referencing the surface element.
 * Additionally, each surface elements will be added a <graphic>
 * element.
 * If the facsimile element exists, it will check all
 * surface elements and the pb@facs references and add them if
 * necessary.
 * @param {object} v
 * @param {object} cm
 */
export function addFacsimile(v, cm) {
  v.allowCursorActivity = false;
  let facsimile = v.xmlDoc.querySelector('facsimile');
  let facsimileId;
  if (facsimile) {
    facsimileId = facsimile.getAttribute('xml:id');
    this.removeInEditor(cm, facsimile);
  }
  if (!facsimile) {
    facsimile = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'facsimile');
    facsimileId = utils.generateXmlId('facsimile', v.xmlIdStyle);
    facsimile.setAttributeNS(dutils.xmlNameSpace, 'xml:id', facsimileId);
    v.xmlDoc.querySelector('body').before(facsimile);
  }
  v.xmlDoc.querySelectorAll('pb').forEach((pb, p) => {
    let pbFacs = utils.rmHash(pb.getAttribute('facs'));
    let surface = v.xmlDoc.querySelector('surface[*|id="' + pbFacs + '"]');
    let surfaceId;
    if (surface) {
      surfaceId = surface.getAttribute('xml:id');
    } else {
      surface = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'surface');
      surfaceId = utils.generateXmlId('surface', v.xmlIdStyle);
      surface.setAttributeNS(dutils.xmlNameSpace, 'xml:id', surfaceId);
      facsimile.appendChild(surface);
      // update pb elements in DOM and in editor
      pb.setAttribute('facs', '#' + surfaceId);
      this.replaceInEditor(cm, pb);
    }
    let graphic = surface.querySelector('graphic');
    if (!graphic) {
      graphic = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'graphic');
      let graphicId = utils.generateXmlId('graphic', v.xmlIdStyle);
      graphic.setAttributeNS(dutils.xmlNameSpace, 'xml:id', graphicId);
      graphic.setAttribute('target', 'Page-' + (p + 1)); // dummy values
      graphic.setAttribute('width', '0');
      graphic.setAttribute('height', '0');
      surface.appendChild(graphic);
    }
  });

  // add to editor
  let c = cm.getSearchCursor('<body');
  let p1;
  if (c.findNext()) {
    p1 = c.from();
    cm.setCursor(p1);
  }
  cm.replaceRange(dutils.xmlToString(facsimile) + '\n', cm.getCursor());
  for (let l = p1.line; l <= cm.getCursor().line; l++) cm.indentLine(l, 'smart');
  utils.setCursorToId(cm, facsimileId);

  loadFacsimile(v.xmlDoc);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, false);
  console.log('Editor: new facsimile added', facsimile);
  v.allowCursorActivity = true;
} // addFacsimile()

/**
 * Encloses/surrounds selected text in CodeMirror with the given XML tag name.
 * If tag name is not surrounded with left/right angle brackets, they will be added.
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} tagString
 */
export function encloseSelectionWithTag(v, cm, tagString = '') {
  // remove brackets from beginning and end
  tagString = tagString.trim();
  if (tagString.startsWith('<')) tagString = tagString.substring(1);
  if (tagString.endsWith('>')) tagString = tagString.slice(0, -1);
  cm.listSelections().forEach((selection) => {
    let selectionText;
    if (selection.anchor.line > selection.head.line || selection.anchor.ch > selection.head.ch) {
      selectionText = cm.getRange(selection.head, selection.anchor);
    } else {
      selectionText = cm.getRange(selection.anchor, selection.head);
    }
    if (selection.anchor.line === selection.head.line && selection.anchor.ch === selection.head.ch) {
      // get complete tag, if only a cursor is selected
      let match = CodeMirror.findMatchingTag(cm, cm.getCursor());
      if (match) {
        let end = match.close ? match.close.to : match.open.to;
        cm.extendSelection(match.open.from, end);
        selectionText = cm.getRange(match.open.from, end);
      }
    }
    let newEncoding = '<' + tagString + '>';
    if (selectionText.includes(cm.lineSeparator())) newEncoding += cm.lineSeparator();
    newEncoding += selectionText;
    if (selectionText.includes(cm.lineSeparator())) newEncoding += cm.lineSeparator();
    newEncoding += '</' + tagString + '>';
    cm.replaceSelection(newEncoding, 'around');
    indentSelection(v, cm);
  });
} // encloseSelectionWithTag()

/**
 * Creates and adds context menu to enclose selection with a tag,
 * the name of which is determined through that menu
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {Element} node
 * @returns
 */
export function showTagEncloserMenu(v, cm, node = null) {
  let input;
  if (!node) {
    // create menu, if not yet there
    node = document.createElement('div');
    node.id = 'tagEncloserMenu';
    let span = document.createElement('span');
    span.id = 'selectTagNameForEnclosure';
    span.textContent = translator.lang.selectTagNameForEnclosure.text;
    input = document.createElement('input');
    input.setAttribute('autofocus', true);
    input.setAttribute('isContentEditable', true);
    let div = document.createElement('div');
    let cancelButton = document.createElement('input');
    cancelButton.setAttribute('type', 'button');
    cancelButton.classList.add('btn');
    cancelButton.classList.add('narrowButton');
    cancelButton.value = translator.lang.selectTagNameForEnclosureCancelButton.value;
    cancelButton.id = 'selectTagNameForEnclosureCancelButton';
    cancelButton.addEventListener('click', (ev) => {
      node?.parentElement?.removeChild(node);
      cm.focus();
    });
    let okButton = document.createElement('input');
    okButton.setAttribute('type', 'button');
    okButton.classList.add('btn');
    okButton.classList.add('narrowButton');
    okButton.value = translator.lang.selectTagNameForEnclosureOkButton.value;
    okButton.id = 'selectTagNameForEnclosureOkButton';
    okButton.addEventListener('click', (ev) => {
      this.encloseSelectionWithTag(v, cm, input.value);
      node?.parentElement?.removeChild(node);
      cm.focus();
    });
    node.appendChild(span);
    node.appendChild(input);
    div.appendChild(cancelButton);
    div.appendChild(okButton);
    node.appendChild(div);
  }
  cm.addWidget(cm.getCursor(), node, true);
  node.querySelector('input')?.focus();
  node.querySelector('input')?.select();

  if (input) {
    // add listener only first time
    input.addEventListener('keyup', (event) => {
      let tagString = event.target.value;
      let validName = utils.isValidElementName(tagString);
      let okButton = document.getElementById('selectTagNameForEnclosureOkButton');
      if (validName) {
        input.classList.remove('error');
        okButton.disabled = false;
        okButton.classList.remove('disabled');
      } else {
        input.classList.add('error');
        okButton.disabled = true;
        okButton.classList.add('disabled');
      }
      if (event.key === 'Enter' && validName) {
        event.preventDefault();
        this.encloseSelectionWithTag(v, cm, tagString);
        document.getElementById('surroundWithLastTagName').innerHTML = tagString;
        node?.parentElement?.removeChild(node);
        cm.focus();
      } else if (event.key === 'Escape') {
        node?.parentElement?.removeChild(node);
        cm.focus();
      }
    });
  }
  return node;
} // showTagEncloserMenu()

let previousMatch; // match object retrieved from CodeMirror.findMatchingTag (with open/close keys, if present)

/**
 * Updates variable previousMatch to remember any xml tag matching at cursor position
 * (called by beforeChange event emitted by CodeMirror)
 * @param {CodeMirror} cm
 */
export function updateMatch(cm) {
  previousMatch = CodeMirror.findMatchingTag(cm, cm.getCursor());
} // updateMatch()

/**
 * Updates matching tag name, if edit is within a tag name
 * @param {CodeMirror} cm
 */
export function updateMatchingTagName(cm, changeObj) {
  let cursor = cm.getCursor();
  let match = CodeMirror.findMatchingTag(cm, cursor);
  // console.debug('XXXXXX updateMatchingTagName(): changeObj: ', changeObj);
  // console.debug('XXXXXX updateMatchingTagName(): cursor: ', cursor);
  // console.debug('XXXXXX previousMatch: ', previousMatch);
  if (!match || !previousMatch) return;
  if (
    match.close &&
    match.close.from.ch < cursor.ch &&
    match.close.to.ch > cursor.ch &&
    match.close.from.line === cursor.line
  ) {
    // if within the ending tag
    // console.debug('XXXXXX within ending tag: ', match);
    if (utils.isValidElementName(match.close.tag) && previousMatch.open) {
      cm.blockChanges = true;
      cm.replaceRange('<' + match.close.tag, previousMatch.open.from, {
        ch: previousMatch.open.from.ch + previousMatch.open.tag.length + 1,
        line: previousMatch.open.from.line,
      });
      cm.blockChanges = false;
    }
  } else if (
    match.open &&
    match.open.from.ch < cursor.ch &&
    match.open.from.ch + match.open.tag.length + 1 >= cursor.ch &&
    match.open.from.line === cursor.line &&
    previousMatch &&
    previousMatch.open.from.line === cursor.line
  ) {
    // if within opening tag
    // console.debug('XXXXXX within opening tag: ', match);
    if (utils.isValidElementName(match.open.tag) && previousMatch.close) {
      let from = previousMatch.close.from;
      let to = previousMatch.close.to;
      // if in same line, correct x shift
      if (previousMatch.close.from.line === match.open.from.line) {
        let xShift = changeObj[0]?.text[0]?.length - changeObj[0]?.removed[0]?.length;
        from.ch += xShift;
        to.ch += xShift;
      }
      cm.blockChanges = true;
      cm.replaceRange('</' + match.open.tag + '>', from, to);
      cm.blockChanges = false;
    }
  }
} // updateMatchingTagName()

/**
 * Finds xmlNode in textBuffer and removes it (including empty line)
 * @param {CodeMirror} cm
 * @param {Element} xmlNode
 */
export function removeInEditor(cm, xmlNode) {
  let itemId = xmlNode.getAttribute('xml:id');
  let searchSelfClosing = '(?:<' + xmlNode.nodeName + `)(\\s+?)([^>]*?)(?:xml:id=["']` + itemId + `['"])([^>]*?)(?:/>)`;
  let sc = cm.getSearchCursor(new RegExp(searchSelfClosing));
  if (sc.findNext()) {
    console.info('removeInEditor() self closing from: ', sc.from());
    console.info('removeInEditor() self closing to: ', sc.to());
  } else {
    let searchFullElement =
      '(?:<' +
      xmlNode.nodeName +
      `)(\\s+?)([^>]*?)(?:xml:id=["']` +
      itemId +
      `["'])([\\s\\S]*?)(?:</` +
      xmlNode.nodeName +
      '[ ]*?>)';
    sc = cm.getSearchCursor(new RegExp(searchFullElement));
    if (sc.findNext()) {
      console.info('removeInEditor() full element from: ', sc.from());
      console.info('removeInEditor() full element to: ', sc.to());
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
  } else console.info('removeInEditor(): nothing removed for ' + itemId + '.');
} // removeInEditor()

function isEmpty(str) {
  return !/\S/g.test(str);
} // isEmpty()

/**
 * Finds xmlNode in textBuffer and replaces it with new serialized content
 * @param {CodeMirror} cm
 * @param {Element} xmlNode
 * @param {boolean} select
 * @param {Element} newNode
 * @returns
 */
export function replaceInEditor(cm, xmlNode, select = false, newNode = null) {
  let newMEI = newNode ? dutils.xmlToString(newNode) : dutils.xmlToString(xmlNode);
  // search in buffer
  let itemId = xmlNode.getAttribute('xml:id');
  let xmlIdCheck = '';
  if (itemId) xmlIdCheck = `(\\s+?)([^>]*?)(?:xml:id=["']` + itemId + `['"])`;
  let searchSelfClosing = '(?:<' + xmlNode.nodeName + `)` + xmlIdCheck + `([^>]*?)(?:/>)`;
  // console.info('searchSelfClosing: ' + searchSelfClosing);
  let sc = cm.getSearchCursor(new RegExp(searchSelfClosing));
  if (sc.findNext()) {
    sc.replace(newMEI);
  } else {
    let searchFullElement =
      '(?:<' + xmlNode.nodeName + `)` + xmlIdCheck + `([\\s\\S]*?)(?:</` + xmlNode.nodeName + '[ ]*?>)';
    sc = cm.getSearchCursor(new RegExp(searchFullElement));
    if (sc.findNext()) sc.replace(newMEI);
    // console.info('searchFullElement: ' + searchFullElement);
  }
  if (!sc.atOccurrence) {
    console.info('replaceInEditor(): nothing replaced for ' + itemId + '.');
    return {
      start: -1,
      end: -1,
    };
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
      cm.setSelection(sc.from(), sc.to());
    }
  }
  return {
    start: sc.from(),
    end: sc.to(),
  };
} // replaceInEditor()

// ############################################################################
// # (mostly) private functions                                               #
// ############################################################################

/**
 * Toggles and articulation for a given element (note)
 * @param {Element} note
 * @param {string} artic
 * @param {string} xmlIdStyle (Original, Base36, mei-friend, see viewer.js)
 * @returns
 */
function toggleArticForNote(note, artic, xmlIdStyle) {
  note = utils.attrAsElements(note);
  let articChildren;
  let add = false;
  let uuid;
  // check if articulations exist, as elements or attributes
  if (note.hasChildNodes() && (articChildren = note.querySelectorAll('artic')).length > 0) {
    // console.info('toggleArtic check children: ', articChildren);
    for (let articChild of articChildren) {
      let existingArtic = articChild.getAttribute('artic');
      if (existingArtic === artic) {
        articChild.remove();
        add = false;
      } else {
        add = true;
      }
    }
  } else {
    add = true;
  }
  if (add) {
    // add artic as element
    let articElement = document.createElementNS(dutils.meiNameSpace, 'artic');
    uuid = utils.generateXmlId('artic', xmlIdStyle);
    articElement.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
    articElement.setAttribute('artic', artic);
    note.appendChild(articElement);
  }
  return uuid;
} // toggleArticForNote()

/**
 * Modifies an element's pitch up and down (i.e. manipulating @oct, @pname)
 * @param {Element} el
 * @param {number} deltaPitch
 * @returns
 */
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
} // pitchMover()

/**
 * Moves an element across staves.
 * @param {CodeMirror} cm
 * @param {Element} el
 * @param {boolean} upwards
 */
function staffMover(cm, el, upwards = true) {
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
  } else {
    // downwards
    if (staffNoAttr > 0) newStaffNo = staffNoAttr + 1;
    else newStaffNo = staffNo + 1;
  }
  if (staffNo === newStaffNo) el.removeAttribute('staff');
  else el.setAttribute('staff', newStaffNo);
  replaceInEditor(cm, el, true);
} // staffMover()

/**
 * Finds all notes between two ids in the same staff and
 * sets @oct.ges and modifies @oct with deltaOct (1,-1, 2,...);
 * or, if set=false: remove @oct.ges and reset @oct
 * @param {CodeMirror} cm
 * @param {Document} xmlDoc
 * @param {string} id1
 * @param {string} id2
 * @param {string} disPlace ('below|above')
 * @param {string} dis (e.g. 8, 15, 22)
 * @param {boolean} add
 * @returns
 */
function findAndModifyOctaveElements(cm, xmlDoc, id1, id2, disPlace, dis, add = true) {
  let deltaOct = (parseInt(dis) - 1) / 7;
  if (disPlace === 'below') deltaOct *= -1; // normal logic: minus 1 when below
  if (add) deltaOct *= -1; // inverse logic: minus when adding above 8
  let n1 = xmlDoc.querySelector("[*|id='" + id1 + "']");
  let st1 = n1.closest('staff');
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
      if (staffFound) {
        // select notes after
        let notes = st.getElementsByTagName('note');
        for (let n of notes) {
          if (n.getAttribute('xml:id') === id1) {
            noteFound = true;
          }
          if (noteFound) {
            let oct = parseInt(n.getAttribute('oct'));
            if (add) {
              n.setAttribute('oct.ges', oct);
            } else {
              // remove
              n.removeAttribute('oct.ges');
            }
            n.setAttribute('oct', oct + deltaOct);
            replaceInEditor(cm, n);
          }
          if (n.getAttribute('xml:id') === id2) {
            return;
          }
        }
      }
    }
  }
  return;
} // findAndModifyOctaveElements()

/**
 * Determines staff numbers for a given element that spans
 * the relevant staff group that the element is inside.
 * @param {Viewer} v
 * @param {Element} element
 * @returns {Object} with staffNumbers and staffNumber as keys
 */
function getStaffNumbersForClosestStaffGroup(v, element) {
  if (!element) return null;
  let staffNumber;
  if (element.hasAttribute('startid')) {
    const startElement = v.xmlDoc.querySelector('[*|id=' + utils.rmHash(element.getAttribute('startid')) + ']');
    if (startElement) {
      staffNumber = startElement.closest('staff')?.getAttribute('n');
    }
  } else if (element.hasAttribute('staff')) {
    staffNumber = element.getAttribute('staff');
  }
  if (staffNumber) {
    const staffList = v.xmlDoc.querySelector('scoreDef')?.querySelectorAll('staffDef');
    let staff;
    staffList.forEach((st) => {
      if (st.getAttribute('n') === staffNumber) {
        staff = st;
      }
    });
    if (staff) {
      const staffGroup = staff.closest('staffGrp');
      if (staffGroup) {
        let staffNumbers = [];
        staffGroup.querySelectorAll('staffDef').forEach((st) => {
          const n = st.getAttribute('n');
          if (n) staffNumbers.push(n);
        });
        return { staffNumber: staffNumber, staffNumbers: staffNumbers };
      }
    }
    return { staffNumber: staffNumber, staffNumbers: [] };
  }
} // findClosestStaffGroup()
