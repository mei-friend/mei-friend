/**
 * Provides all the editor functions
 */

import * as att from './attribute-classes.js';
import * as b40 from './base40.js';
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
  v.allowCursorActivity = false;

  // iterate all selected elements
  v.selectedElements.forEach((id) => {
    let cursor = cm.getCursor();
    let nextId = utils.getIdOfNextElement(cm, cursor.line)[0]; // TODO necessary?
    let element = v.xmlDoc.querySelector("[*|id='" + id + "']");
    console.debug('Deleting: ', element);
    if (!element) {
      console.log(id + ' not found for deletion.');
      return;
    }
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
        element.remove();
      } else if (['accid', 'artic'].includes(element.nodeName)) {
        let parent = removeWithTextnodes(element);
        let parentId = parent.getAttribute('xml:id');
        if (parentId) selectedElements.push(parentId);
        replaceInEditor(cm, parent, true);
      } else {
        removeInEditor(cm, element);
        // place cursor at a sensible place...
        let m = utils.getElementIdAtCursor(cm);
        let el = document.getElementById(m).querySelector(dutils.navElsSelector);
        if (el) selectedElements.push(el.getAttribute('id'));
        else selectedElements.push(nextId);
        element.remove();
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
      element.remove();
    } else if (element.nodeName === 'zone' && document.getElementById('editFacsimileZones').checked) {
      // delete Zone in source image display
      // remove zone; with CMD remove pointing element; without just remove @facs from pointing element
      removeZone(v, cm, element, modifyerKey);
      element.remove();
    } else if (['note', 'chord', 'rest', 'mRest', 'multiRest'].includes(element.nodeName)) {
      console.log('Removing <' + element.nodeName + '>: "' + id + '"');
      // Check if element is last inside a chord, a tuplet, or a beam, and
      // remember that element for later deletion
      let closest;
      while ((closest = element.parentElement.closest('chord,beam,tuplet,bTrem,fTrem'))) {
        let children = Array.from(closest.childNodes).filter((el) => el.nodeType === Node.ELEMENT_NODE);
        if (
          children.length <= 1 ||
          (closest.nodeName === 'chord' && children.filter((e) => e.nodeName === 'note').length <= 1)
        ) {
          // if just one child or just one note inside a chord (ignoring artic elements)
          element = closest;
        } else {
          break;
        }
      }

      // Check if element has been pointed to in a slur, tie (@startid, @endid); TODO: @plist?
      let pointingElements = v.xmlDoc.querySelectorAll("[startid='#" + id + "'],[endid='#" + id + "']");
      // v.xmlDoc.querySelector("[startid='#" + id + "']") || v.xmlDoc.querySelector("[endid='#" + id + "']") || '';
      pointingElements.forEach((pointingElement) => {
        console.log(
          'Removing pointing element <' +
            pointingElement.nodeName +
            '>: "' +
            pointingElement.getAttribute('xml:id') +
            '"'
        );
        removeInEditor(cm, pointingElement);
        pointingElement.remove();
      });
      let next = utils.getIdOfNextElement(cm, cursor.line)[0];
      if (next) selectedElements.push(next);
      // remove element and update parent in editor
      removeInEditor(cm, element);
      element.remove();
    } else {
      console.info('Element ' + id + ' not supported for deletion.');
      v.allowCursorActivity = true;
      return;
    }
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
 * Removes element with text nodes around it and returns parent node.
 * @param {Element} element
 * @returns {Element} parent element with removed element
 */
function removeWithTextnodes(element) {
  let parent = element.parentNode;
  if (parent) {
    // remove child element together with surrounding text nodes
    let i = Array.from(parent.childNodes).indexOf(element);
    if (i > 0 && i < parent.childNodes.length) {
      parent.childNodes[i + 1].remove();
      parent.childNodes[i].remove();
      parent.childNodes[i - 1].remove();
    }
  }
  return parent;
} // removeWithTextnodes()

/**
 * (Quasi duplicate selected note):
 * Inserts new note immediately after the currently (last-)selected one,
 * (or as the new last note on the currently visible notation fragment (e.g., page)).
 * It copies @pname @oct @dur from the nearest predecessor note
 * (or otherwise default to 'c', '4', '4').
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function addNote(v, cm) {
  let pname = 'c';
  let oct = '4';
  let dur = '4';

  // get last selected element that is a layer, chord, note, or rest
  let selEl;
  let i = v.selectedElements.length - 1;
  while (i >= 0) {
    selEl = v.xmlDoc.querySelector("[*|id='" + v.selectedElements.at(i) + "']");
    if (['layer', 'chord', 'note', 'rest'].includes(selEl.nodeName)) break;
    selEl = null;
    i--;
  }

  // stop if nothing found
  if (!selEl) {
    return false;
    // TODO: get last note of visible fragment (i.e. page/system) // REALLY??
    let noteList = document.querySelectorAll('g.note');
    let lastNote = noteList[noteList.length - 1];
  }
  v.allowCursorActivity = false;

  // clone element (chord, rest) or create new element
  let newEl;
  const uuid = utils.generateXmlId(selEl.nodeName, v.xmlIdStyle);
  if (['chord', 'rest'].includes(selEl.nodeName)) {
    newEl = selEl.cloneNode(true);
    newEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
  } else if (selEl.nodeName === 'layer') {
    newEl = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'note');
    newEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
    newEl.setAttribute('dur', dur);
    newEl.setAttribute('oct', oct);
    newEl.setAttribute('pname', pname);
  } else {
    newEl = v.xmlDoc.createElementNS(dutils.meiNameSpace, selEl.nodeName);
    newEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
    const chord = selEl.parentElement?.closest('chord');
    let addEl = chord ? chord : newEl; // place in chord, if a parent
    copyAttribute(addEl, selEl, 'cue');
    copyAttribute(addEl, selEl, 'dots');
    copyAttribute(addEl, selEl, 'dur', dur);
    copyAttribute(addEl, selEl, 'grace');
    copyAttribute(newEl, selEl, 'oct', oct); // place in new element
    copyAttribute(newEl, selEl, 'pname', pname); // place in new element
    copyAttribute(addEl, selEl, 'stem.dir');
  }
  /**
   * Copies attribute attName to new element, if present,
   * or assigns defaultValue, if given
   * @param {Element} newEl
   * @param {Element} oldEl
   * @param {string} attName
   * @param {string} defaultValue
   */
  function copyAttribute(newEl, oldEl, attName, defaultValue = '') {
    if (oldEl.hasAttribute(attName)) newEl.setAttribute(attName, oldEl.getAttribute(attName));
    else if (defaultValue) newEl.setAttribute(attName, defaultValue);
  }

  if (selEl.nodeName === 'chord') {
    for (let e of newEl.children) {
      e.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId(e.nodeName, v.xmlIdStyle));
    }
  }

  if (selEl.nodeName !== 'layer') {
    // add it to DOM
    const nextElement = selEl.nextSibling;
    if (nextElement) {
      selEl.parentNode.insertBefore(newEl, nextElement);
    } else {
      selEl.parentNode.appendChild(newEl);
    }

    // add to editor
    utils.setCursorToId(cm, selEl.id);
    cm.execCommand('toMatchingTag');
    cm.execCommand('goLineEnd');
    const p1 = cm.getCursor();
    cm.replaceRange('\n' + dutils.xmlToString(newEl), p1);
    const p2 = cm.getCursor();
    for (let p = p1.line; p <= p2.line; p++) cm.indentLine(p, 'smart');
  } else {
    // when adding to a layer
    selEl.appendChild(newEl);
    replaceInEditor(cm, selEl, true);
  }

  // do final homework
  v.selectedElements = [];
  v.selectedElements.push(uuid);
  utils.setCursorToId(cm, uuid); // to select new element
  v.lastNoteId = uuid;
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // addNote()

/**
 * Place selected notes into a (new) chord, containing these notes,
 * and vice versa (remove chord and have contained notes there)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function convertToChord(v, cm) {
  v.allowCursorActivity = false;
  let chord;
  let uuids = [];
  speed.filterElements(v.selectedElements, v.xmlDoc, ['chord', 'note']).forEach((id) => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (el && el.nodeName === 'chord') {
      utils.setCursorToId(cm, id);
      while (el.children.length > 0) {
        let ch = el.children[0];
        if (el.hasAttribute('dur')) ch.setAttribute('dur', el.getAttribute('dur'));
        if (el.hasAttribute('dots')) ch.setAttribute('dots', el.getAttribute('dots'));
        if (el.hasAttribute('stem.dir')) ch.setAttribute('stem.dir', el.getAttribute('stem.dir'));
        // editor
        cm.execCommand('goLineStart');
        const p1 = cm.getCursor();
        cm.replaceRange(dutils.xmlToString(ch) + '\n', p1);
        const p2 = cm.getCursor();
        for (let p = p1.line; p <= p2.line; p++) cm.indentLine(p, 'smart');
        // DOM
        el.parentElement.insertBefore(ch, el);
        utils.setCursorToId(cm, ch.getAttribute('xml:id')); // to select new element
        uuids.push(ch.getAttribute('xml:id'));
      }
      el.remove();
      removeInEditor(cm, el);
    } else if (el && el.nodeName === 'note') {
      if (el.closest('chord')) {
        v.showAlert('Cannot create chord within chord.');
        return;
      }
      // create new chord and add to DOM
      if (!chord) {
        chord = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'chord');
        uuids.push(utils.generateXmlId('chord', v.xmlIdStyle));
        chord.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuids.at(-1));
        el.parentElement.insertBefore(chord, el);
      }
      if (el.hasAttribute('dur')) {
        chord.setAttribute('dur', el.getAttribute('dur'));
        el.removeAttribute('dur');
      }
      if (el.hasAttribute('dots')) {
        chord.setAttribute('dots', el.getAttribute('dots'));
        el.removeAttribute('dots');
      }
      if (el.hasAttribute('stem.dir')) {
        chord.setAttribute('stem.dir', el.getAttribute('stem.dir'));
        el.removeAttribute('stem.dir');
      }
      chord.appendChild(el);
      removeInEditor(cm, el);
    }
  });
  // add to editor
  if (chord) {
    const p1 = cm.getCursor();
    cm.replaceRange(dutils.xmlToString(chord) + '\n', p1);
    const p2 = cm.getCursor();
    for (let p = p1.line; p <= p2.line; p++) cm.indentLine(p, 'smart');
  }
  utils.setCursorToId(cm, uuids.at(-1));
  v.selectedElements = [];
  uuids.forEach((uuid) => v.selectedElements.push(uuid));
  v.lastNoteId = uuids.at(-1);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // convertToChord()

/**
 * Converts selected notes to rests and vice versa.
 * TODO: not secured against stupid things (like rests inside chords)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function convertNoteToRest(v, cm) {
  v.allowCursorActivity = false;
  let uuids = [];
  speed.filterElements(v.selectedElements, v.xmlDoc, ['rest', 'note']).forEach((id) => {
    let oldEl = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (oldEl) {
      let newName = oldEl.nodeName === 'note' ? 'rest' : 'note';
      let newEl = v.xmlDoc.createElementNS(dutils.meiNameSpace, newName);
      let uuid = utils.generateXmlId(newName, v.xmlIdStyle);
      newEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
      uuids.push(uuid);
      if (oldEl.hasAttribute('dur')) newEl.setAttribute('dur', oldEl.getAttribute('dur'));
      if (oldEl.hasAttribute('dots')) newEl.setAttribute('dots', oldEl.getAttribute('dots'));
      if (oldEl.nodeName === 'rest') {
        if (oldEl.hasAttribute('oloc')) newEl.setAttribute('oct', oldEl.getAttribute('oloc'));
        if (oldEl.hasAttribute('ploc')) newEl.setAttribute('pname', oldEl.getAttribute('ploc'));
      } else {
        if (oldEl.hasAttribute('oct')) newEl.setAttribute('oloc', oldEl.getAttribute('oct'));
        if (oldEl.hasAttribute('pname')) newEl.setAttribute('ploc', oldEl.getAttribute('pname'));
      }
      oldEl.parentElement.replaceChild(newEl, oldEl);
      replaceInEditor(cm, oldEl, true, newEl);
    }
  });
  v.selectedElements = [];
  uuids.forEach((id) => v.selectedElements.push(id));
  utils.setCursorToId(cm, v.selectedElements.at(-1)); // to select new element
  v.lastNoteId = v.selectedElements.at(-1);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // convertNoteToRest()

/**
 * Adds accid element to note element.
 * (Other allowed elements are ignored for the moment.)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} accidAttribute
 * @returns
 */
export function addAccidental(v, cm, accidAttribute = 's') {
  if (v.selectedElements.length === undefined || v.selectedElements.length < 1) return;
  v.allowCursorActivity = false;
  let uuid;

  v.selectedElements.forEach((xmlId, i) => {
    let el = v.xmlDoc.querySelector("[*|id='" + xmlId + "']");
    if (el && el.nodeName === 'note') {
      let accid = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'accid');
      uuid = utils.generateXmlId('accid', v.xmlIdStyle);
      accid.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
      accid.setAttribute('accid', accidAttribute);
      el.appendChild(accid);

      replaceInEditor(cm, el, true);

      // select last element inserted
      if (i === v.selectedElements.length - 1) {
        utils.setCursorToId(cm, uuid);
        v.lastNoteId = xmlId;
      }
    }
  });

  v.selectedElements = [];
  v.selectedElements.push(uuid);
  v.updateHighlight(cm);
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // addAccidental()

/**
 * Inserts a new control element (control event) to DOM and editor
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} elName ('slur', 'dynam', ...)
 * @param {string} placement ('below', 'up', ...)
 * @param {string} form ('cres', 'inv', depending on element type)
 * @returns
 */
export function addControlElement(v, cm, elName, placement = '', form = '') {
  // elements to which control elements (control events) can be added
  let allowedElements = ['note', 'chord', 'rest', 'mRest', 'multiRest'];

  if (v.selectedElements.length === undefined || v.selectedElements.length < 1) return;
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc, allowedElements);
  console.debug('addControlElement() ', elName, placement, form);

  // modifier key for inserting tstamps rather than start/endids
  let useTstamps = v.cmd2KeyPressed;

  // find and validate startEl with @startId
  let startId = v.selectedElements[0];
  var startEl = v.xmlDoc.querySelector("[*|id='" + startId + "']");
  if (!startEl) return;
  if (!allowedElements.includes(startEl.nodeName)) {
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
    if (
      m === 0 &&
      tstamp >= 0 &&
      tstamp === tstamp2 &&
      !startEl.hasAttribute('grace') &&
      !endEl.hasAttribute('grace')
    ) {
      // let msg = useTstamps ? 'Cannot insert ' : 'Attention with ' + elName + ' (' + uuid + '): ';
      let msg = 'Cannot insert ' + elName + ' (' + uuid + '): ';
      msg += startId + ' and ' + endId + ' are on the same beat position ' + tstamp + '.';
      console.log(msg);
      v.showAlert(msg, 'warning');
      return; // if (useTstamps) 26 Sept 2023: stop in all cases
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
    console.debug('p1: ', p);
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
  console.debug('invertPlacement ids: ', ids);
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
      console.log('invertPlacement(): element not found', id);
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
      console.log('invertPlacement(): ' + el.nodeName + ' contains no elements to invert.');
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
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc, ['note', 'chord', 'beam', 'beamSpan', 'tuplet']);
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
 * Shifts element (rests, note) up/down diatonically by pitch name (1 or 7 diatonic steps)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {int} deltaPitch (-1, -7, +2)
 * @param {boolean} shiftChromatically
 */
export function shiftPitch(v, cm, deltaPitch = 0, shiftChromatically = false) {
  v.loadXml(cm.getValue());
  let ids = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.allowCursorActivity = false;
  let i;
  for (i = 0; i < ids.length; i++) {
    let id = ids[i];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) continue;
    let chs = Array.from(el.querySelectorAll('note,rest,mRest,multiRest'));
    if (chs.length > 0) {
      // shift many elements
      chs.forEach((ele) => replaceInEditor(cm, pitchMover(v, ele, deltaPitch, shiftChromatically)), true);
    } else if (['note', 'rest', 'mRest', 'multiRest'].includes(el.nodeName)) {
      // shift one element
      replaceInEditor(cm, pitchMover(v, el, deltaPitch, shiftChromatically), true);
    }
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
  v.allowCursorActivity = false;
  speed.filterElements(v.selectedElements, v.xmlDoc).forEach((id) => {
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
    utils.setCursorToId(cm, id); // to select new element
  });
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // modifyDuration()

/**
 * Toggles a @dots="1" into a note (or all allowed elements in attAugmentDots)
 * or removes it if already present.
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function toggleDots(v, cm) {
  v.allowCursorActivity = false;
  speed.filterElements(v.selectedElements, v.xmlDoc).forEach((id) => {
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (el && att.attAugmentDots.includes(el.nodeName)) {
      if (el.hasAttribute('dots') && el.getAttribute('dots') === '1') {
        el.removeAttribute('dots');
      } else {
        el.setAttribute('dots', '1');
      }
      replaceInEditor(cm, el);
    }
    utils.setCursorToId(cm, id); // to select new element
  });
  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
} // toggleDots()

/**
 * Moves selected elements to next staff (without checking boundaries)
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {boolean} upwards
 */
export function moveElementToNextStaff(v, cm, upwards = true) {
  console.debug('moveElementToNextStaff(' + (upwards ? 'up' : 'down') + ')');
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
        console.debug('moving: ' + noteId);
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
  // allow only note and chord elements
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc, ['note', 'chord']);
  console.info('addOctaveElement selectedElements:', v.selectedElements);

  let id1 = v.selectedElements[0]; // xml:id string
  let id2 = v.selectedElements[v.selectedElements.length - 1];

  // add control like element <octave @startid @endid @dis @dis.place>
  let octave = v.xmlDoc.createElementNS(dutils.meiNameSpace, 'octave');
  let uuid = utils.generateXmlId('octave', v.xmlIdStyle);
  octave.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);
  octave.setAttribute('startid', '#' + id1);
  octave.setAttribute('endid', '#' + id2);
  octave.setAttribute('dis', dis);
  octave.setAttribute('dis.place', disPlace);
  let n1 = v.xmlDoc.querySelector("[*|id='" + id1 + "']");
  n1?.closest('measure').appendChild(octave);

  // add it to CodeMirror
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
 * Aug 2023: Replaced by checkAccidGes()
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function cleanAccid(v, cm) {
  v.allowCursorActivity = false;
  v.loadXml(cm.getValue(), true);
  utils.cleanAccid(v.xmlDoc, cm);
  v.allowCursorActivity = true;
} // cleanAccid()

/**
 * Checks accid/accid.ges attributes of all notes against
 * keySig/key.sig information and measure-wise accidentals,
 * finds instances of double accid & accid.ges.
 *
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function checkAccidGes(v, cm) {
  v.allowCursorActivity = false;
  v.initCodeCheckerPanel(translator.lang.codeCheckerTitle.text);

  let d = true; // send debug info to console
  setTimeout(() => {
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
        const value = e.getAttribute('key.sig');
        for (let k in keySignatures) keySignatures[k] = value;
        if (d) console.debug('New key.sig in scoreDef: ' + value);
      } else if (e.nodeName === 'staffDef' && e.hasAttribute('key.sig')) {
        // key.sig inside staffDef: write @sig to that staff
        const n = parseInt(e.getAttribute('n'));
        const value = e.getAttribute('key.sig');
        if (n && n > 0 && n <= keySignatures.length) keySignatures[n - 1] = value;
        if (d) console.debug('New key.sig in staffDef(' + e.getAttribute('xml:id') + ', n=' + n + '): ' + value);
      } else if (e.nodeName === 'keySig' && e.hasAttribute('sig')) {
        // keySig element in a staffDef
        const n = parseInt(e.closest('staffDef')?.getAttribute('n'));
        const value = e.getAttribute('sig');
        if (n && n > 0 && n <= keySignatures.length) keySignatures[n - 1] = value;
        if (d) console.debug('New keySig("' + e.getAttribute('xml:id') + '")@sig in staffDef(' + n + '): ' + value);
      } else if (e.nodeName === 'measure') {
        // clear measureAccids object
        measureAccids = getAccidsInMeasure(e);
      } else if (e.nodeName === 'note') {
        // found a note to check!
        let data = {};
        data.xmlId = e.getAttribute('xml:id') || '';
        data.measure = e.closest('measure')?.getAttribute('n') || '';
        // find staff number for note
        const staffNumber = parseInt(e.closest('staff')?.getAttribute('n'));
        const tstamp = speed.getTstampForElement(v.xmlDoc, e);
        const pName = e.getAttribute('pname') || '';
        const oct = e.getAttribute('oct') || '';

        // array of note names affected by keySig@sig or @key.sig and keySigAccid 's', 'n', 'f'
        const { affectedNotes, keySigAccid } = dutils.getAffectedNotesFromKeySig(keySignatures[staffNumber - 1]);

        let accid = e.getAttribute('accid') || e.querySelector('[accid]')?.getAttribute('accid');
        let accidGesEncoded =
          e.getAttribute('accid.ges') || e.querySelector('[accid\\.ges]')?.getAttribute('accid.ges');
        let accidGesMeaning =
          e.getAttribute('accid.ges') || e.querySelector('[accid\\.ges]')?.getAttribute('accid.ges') || 'n';
        let mAccid = ''; // measure accid for current note
        if (
          staffNumber in measureAccids &&
          oct in measureAccids[staffNumber] &&
          pName in measureAccids[staffNumber][oct]
        ) {
          // get accids for all tstamps, sort them, and remember last before current
          let mTstamps = measureAccids[staffNumber][oct][pName];
          Object.keys(mTstamps)
            .map((v) => parseFloat(v))
            .sort()
            .forEach((t) => {
              if (t <= tstamp) mAccid = mTstamps[t];
            });
        }

        // find doubled accid/accid.ges information
        if (accidGesEncoded && accid) {
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerNote.text +
            ' "' +
            data.xmlId +
            '" ' +
            translator.lang.codeCheckerHasBoth.text +
            ' accid="' +
            accid +
            '" ' +
            translator.lang.codeCheckerAnd.text +
            ' accid.ges="' +
            accidGesEncoded +
            '"';
          if (accidGesEncoded !== accid) {
            data.html += ' ' + translator.lang.codeCheckerWithContradictingContent.text;
          }
          data.html += '. ' + translator.lang.codeCheckerRemove.text + ' accid.ges';
          // remove @accid.ges in all cases
          data.correct = () => {
            v.allowCursorActivity = false;
            e.removeAttribute('accid.ges');
            replaceInEditor(cm, e, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
        }

        if (data.xmlId && data.xmlId in ties) {
          // Check whether note tied by starting note
          let startingNote = v.xmlDoc.querySelector('[*|id=' + ties[data.xmlId] + ']');
          if (startingNote) {
            if (pName !== startingNote.getAttribute('pname')) {
              data.html =
                ++count +
                ' ' +
                translator.lang.codeCheckerMeasure.text +
                ' ' +
                data.measure +
                ', ' +
                translator.lang.codeCheckerTiedNote.text +
                ' "' +
                data.xmlId +
                '": ' +
                pName +
                ' ' +
                translator.lang.codeCheckerNotSamePitchAs.text +
                ' ' +
                ties[data.xmlId] +
                ': ' +
                startingNote.getAttribute('pname');
              v.addCodeCheckerEntry(data);
              if (d) console.debug(data.html);
            }
            if (oct !== startingNote.getAttribute('oct')) {
              data.html =
                ++count +
                ' ' +
                translator.lang.codeCheckerMeasure.text +
                ' ' +
                data.measure +
                ', ' +
                translator.lang.codeCheckerTiedNote.text +
                ' "' +
                data.xmlId +
                '": ' +
                pName +
                ' ' +
                translator.lang.codeCheckerNotSameOctaveAs.text +
                ' ' +
                ties[data.xmlId];
              v.addCodeCheckerEntry(data);
              if (d) console.debug(data.html);
            }
            let startingAccidMeaning =
              startingNote.getAttribute('accid') ||
              startingNote.querySelector('[accid]')?.getAttribute('accid') ||
              startingNote.getAttribute('accid.ges') ||
              startingNote.querySelector('[accid\\.ges]')?.getAttribute('accid.ges') ||
              'n';
            if ((accid || accidGesMeaning) !== startingAccidMeaning) {
              data.html =
                ++count +
                ' ' +
                translator.lang.codeCheckerMeasure.text +
                ' ' +
                data.measure +
                ', ' +
                translator.lang.codeCheckerTiedNote.text +
                ' "' +
                data.xmlId +
                '": ';
              if (startingAccidMeaning !== 'n') {
                data.html +=
                  (accid ? 'accid="' + accid + '"' : accidGesEncoded ? 'accid.ges="' + accidGesEncoded + '"' : '') +
                  (' ' + translator.lang.codeCheckerNotSameAsStartingNote.text + ' ' + ties[data.xmlId] + ': ') +
                  ('"' + startingAccidMeaning + '".') +
                  (' ' + translator.lang.codeCheckerFixTo.text + ' accid.ges="' + startingAccidMeaning + '". ');
                data.correct = () => {
                  v.allowCursorActivity = false;
                  e.setAttribute('accid.ges', startingAccidMeaning);
                  replaceInEditor(cm, e, false);
                  v.allowCursorActivity = true;
                };
              } else {
                data.html +=
                  translator.lang.codeCheckerExtra.text +
                  ' ' +
                  (accid ? 'accid="' + accid + '"' : accidGesEncoded ? 'accid.ges="' + accidGesEncoded + '"' : '') +
                  (' ' + translator.lang.codeCheckerNotSameAsStartingNote.text + ' ' + ties[data.xmlId] + ': ') +
                  ('"' + startingAccidMeaning + '". ') +
                  (translator.lang.codeCheckerRemove.text + ' accid.ges. ');
                data.correct = () => {
                  v.allowCursorActivity = false;
                  e.removeAttribute('accid.ges');
                  replaceInEditor(cm, e, false);
                  v.allowCursorActivity = true;
                };
              }
              v.addCodeCheckerEntry(data);
              if (d) console.debug(data.html);
            }
          } else {
            console.log('No starting note found for tie ' + ties[data.xmlId]);
          }
        } else if (!accid && mAccid && mAccid !== accidGesMeaning) {
          // check all accids having appeared in the current measure
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerNote.text +
            ' "' +
            data.xmlId +
            '" ' +
            translator.lang.codeCheckerLacksAn.text +
            ' accid.ges="' +
            mAccid +
            '", ' +
            translator.lang.codeCheckerBecauseAlreadyDefined.text +
            '.';
          data.correct = () => {
            v.allowCursorActivity = false;
            e.setAttribute('accid.ges', mAccid);
            replaceInEditor(cm, e, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        } else if (
          !accid &&
          affectedNotes.includes(pName) &&
          mAccid !== accidGesMeaning &&
          keySigAccid !== accidGesMeaning
        ) {
          // a note, affected by key signature, either has @accid inside or as a child or has @accid.ges inside or as a child
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerNote.text +
            ' "' +
            data.xmlId +
            '" ' +
            translator.lang.codeCheckerLacksAn.text +
            ' accid.ges="' +
            keySigAccid +
            '". ' +
            translator.lang.codeCheckerAdd.text +
            ' accid.ges="' +
            keySigAccid +
            '"';
          data.correct = () => {
            v.allowCursorActivity = false;
            e.setAttribute('accid.ges', keySigAccid);
            replaceInEditor(cm, e, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        } else if (
          !accid &&
          !affectedNotes.includes(pName) &&
          mAccid !== accidGesMeaning &&
          (accidGesMeaning !== 'n' || accidGesEncoded === 'n')
        ) {
          // Check if there is an accid.ges that has not been defined in keySig or earlier in the measure
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerNote.text +
            ' "' +
            data.xmlId +
            '" ' +
            translator.lang.codeCheckerHasExtra.text +
            ' accid.ges="' +
            accidGesEncoded +
            '" ' +
            translator.lang.codeCheckerRemove.text +
            ' accid.ges="' +
            accidGesEncoded +
            '".';
          data.correct = () => {
            v.allowCursorActivity = false;
            e.removeAttribute('accid.ges');
            replaceInEditor(cm, e, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        }
      }
    });
    v.finalizeCodeCheckerPanel('All accid.ges attributes seem correct.');
  }, 0);

  v.allowCursorActivity = true;

  /**
   * Search for @accid attributes in measure and store them in
   * an object measureAccids[staffNumber][oct][pName][tstamp] = accid
   * @param {Element} measure
   * @returns {Object} measureAccids
   */
  function getAccidsInMeasure(measure) {
    let measureAccids = {};
    // list all @accid attributes in measure
    measure.querySelectorAll('[accid]').forEach((el) => {
      let note = el.closest('note');
      if (note) {
        const staffNumber = parseInt(el.closest('staff')?.getAttribute('n'));
        const oct = note.getAttribute('oct') || '';
        const pName = note.getAttribute('pname') || '';
        const accid = el.getAttribute('accid');
        const tstamp = speed.getTstampForElement(v.xmlDoc, note);

        if (staffNumber && oct && pName && accid && tstamp >= 0) {
          if (!Object.hasOwn(measureAccids, staffNumber)) {
            measureAccids[staffNumber] = {};
          }
          if (!Object.hasOwn(measureAccids[staffNumber], oct)) {
            measureAccids[staffNumber][oct] = {};
          }
          if (!Object.hasOwn(measureAccids[staffNumber][oct], pName)) {
            measureAccids[staffNumber][oct][pName] = {};
          }
          measureAccids[staffNumber][oct][pName][tstamp] = accid;
        }
      }
    });
    return measureAccids;
  } // getAccidsInMeasure()
} // checkAccidGes()

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
  let id = xmlNode.getAttribute('xml:id');
  let searchSelfClosing = '(?:<' + xmlNode.nodeName + `)(\\s+?)([^>]*?)(?:xml:id=["']` + id + `['"])([^>]*?)(?:/>)`;
  let sc = cm.getSearchCursor(new RegExp(searchSelfClosing));
  if (sc.findNext()) {
    console.debug(
      'removeInEditor() self closing element "' +
        id +
        '" from ln:' +
        sc.from().line +
        '/ch:' +
        sc.from().ch +
        ' to ln:' +
        sc.to().line +
        '/ch:' +
        sc.to().ch +
        '.'
    );
  } else {
    let searchFullElement =
      '(?:<' +
      xmlNode.nodeName +
      `)(\\s+?)([^>]*?)(?:xml:id=["']` +
      id +
      `["'])([\\s\\S]*?)(?:</` +
      xmlNode.nodeName +
      '[ ]*?>)';
    sc = cm.getSearchCursor(new RegExp(searchFullElement));
    if (sc.findNext()) {
      console.debug(
        'removeInEditor() full element "' +
          id +
          '" from ln:' +
          sc.from().line +
          '/ch:' +
          sc.from().ch +
          ' to ln:' +
          sc.to().line +
          '/ch:' +
          sc.to().ch +
          '.'
      );
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
  } else {
    console.info('removeInEditor(): nothing removed for ' + id + '.');
  }
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
      cm.execCommand('indentAuto');
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
 * @returns {string} uuid of new artic
 */
function toggleArticForNote(note, artic, xmlIdStyle) {
  note = utils.attrAsElements(note);
  let articChildren;
  let add = false;
  let uuid = '';
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
  } else if (note.querySelectorAll('artic').length === 0) {
    // remove text nodes when last artic in note/chord
    for (let i = note.childNodes.length - 1; i >= 0; i--) {
      if (note.childNodes[i].nodeType === Node.TEXT_NODE) {
        note.removeChild(note.childNodes[i]);
      }
    }
  }
  return uuid;
} // toggleArticForNote()

/**
 * Modifies an element's pitch up and down (i.e. manipulating @oct, @pname)
 * @param {Element} el
 * @param {number} deltaPitch (diatonic steps or chromatic steps, if flag below is set)
 * @param {boolean} shiftChromatically
 * @returns {Element} element with modified attributes
 * NOTE: when shifting chromatically, only semitones (+/-1) make sense!
 */
function pitchMover(v, el, deltaPitch, shiftChromatically = false) {
  let octValue = 4;
  let pnameValue = 'c';
  let accidValue = 'n';
  let octAttr;
  let pnameAttr;
  if (['note'].includes(el.nodeName)) {
    octAttr = 'oct';
    pnameAttr = 'pname';
  } else if (['rest', 'mRest', 'multiRest'].includes(el.nodeName)) {
    octAttr = 'oloc';
    pnameAttr = 'ploc';
  } else {
    return el;
  }

  // read attributes from element
  if (el.hasAttribute(octAttr)) octValue = parseInt(el.getAttribute(octAttr));
  if (el.hasAttribute(pnameAttr)) pnameValue = el.getAttribute(pnameAttr);

  // handle rests quickly and return
  if (octAttr === 'oloc') {
    let pi = att.pnames.indexOf(pnameValue) + deltaPitch;
    // secure octave transistion
    if (pi > att.pnames.length - 1) {
      pi -= att.pnames.length;
      octValue++;
    } else if (pi < 0) {
      pi += att.pnames.length;
      octValue--;
    }
    el.setAttribute(octAttr, octValue);
    el.setAttribute(pnameAttr, att.pnames[pi]);
    return el;
  } // treat rests

  // get key signature and create scale steps in base-40 system
  let keySig = dutils.getKeySigForNote(v.xmlDoc, el);
  // console.debug('Current keySig: ', keySig);
  let affectedNotes = dutils.getAffectedNotesFromKeySig(keySig);
  affectedNotes.b40numbers = affectedNotes.affectedNotes.map((n) => {
    let accid = affectedNotes.keySigAccid;
    if (n.length > 1) accid += n[1] === att.sharpSign ? 's' : 'f';
    return b40.pitchToBase40(n[0], accid);
  });
  let scaleShift = affectedNotes.affectedNotes.length * b40.intervals.P5;
  let scaleSteps =
    affectedNotes.keySigAccid === 'f'
      ? b40.diatonicSteps.map((v) => v - scaleShift)
      : b40.diatonicSteps.map((v) => v + scaleShift);
  scaleSteps = scaleSteps.map((v) => ((v % b40.base) + b40.base) % b40.base).sort((a, b) => a - b);
  // console.debug('Current scaleSteps: ', scaleSteps);

  accidValue =
    el.getAttribute('accid') ||
    el.querySelector('[accid]')?.getAttribute('accid') ||
    el.getAttribute('accid.ges') ||
    'n';

  // remove all possible accid information from element
  el.removeAttribute('accid');
  el.removeAttribute('accid.ges');
  let accidChild = el.querySelector('accid');
  if (accidChild) removeWithTextnodes(accidChild);

  // compute b40 number of current pitch
  let b40step = b40.pitchToBase40(pnameValue, accidValue, octValue) % b40.base;
  // console.debug('b40step: ' + b40step);

  let i = scaleSteps.indexOf(b40step);
  // console.debug('i: ' + i);

  if (Math.abs(deltaPitch) === 7) {
    // add/subtract 1 to octValue
    octValue = octValue + Math.sign(deltaPitch);
  } else {
    // moving downwards / upwards
    if (i >= 0) {
      let changeOctave = false;
      // find interval to next lower scale tone.
      let nextI = i + Math.sign(deltaPitch);
      let interval = 0;
      if (i === 0 && deltaPitch < 0) {
        nextI = scaleSteps.length - 1;
        interval = b40.base + scaleSteps[i] - scaleSteps[nextI];
        changeOctave = true;
      } else if (i === scaleSteps.length - 1 && deltaPitch > 0) {
        nextI = 0;
        interval = b40.base + scaleSteps[nextI] - scaleSteps[i];
        changeOctave = true;
      } else {
        interval = Math.abs(scaleSteps[i] - scaleSteps[nextI]);
      }
      if (shiftChromatically && interval === b40.intervals.M2) {
        // if chromatically and Major Second, take small step
        b40step = b40step + Math.sign(deltaPitch);
      } else {
        // or next step otherwise
        b40step = scaleSteps[nextI];
        if (changeOctave) octValue = octValue + Math.sign(deltaPitch);
      }
    } else {
      // find next higher/lower element and go to it
      let nextI;
      if (deltaPitch > 0) {
        nextI = scaleSteps.findIndex((s) => s > b40step);
        if (nextI < 0) {
          nextI = 0;
          octValue = octValue + 1;
        }
      } else {
        nextI = scaleSteps.findLastIndex((s) => s < b40step);
        if (nextI < 0) {
          nextI = scaleSteps.length - 1;
          octValue = octValue - 1;
        }
      }
      b40step = scaleSteps[nextI];
    }
  }

  const newPitch = b40.base40ToPitch(b40step);

  if (affectedNotes.b40numbers.includes(b40step)) {
    // add as accid.ges, when b40 pitch identical with a scaleStep
    el.setAttribute('accid.ges', newPitch.accidGes);
  } else if (
    (newPitch.accidGes && newPitch.accidGes !== 'n') ||
    affectedNotes.affectedNotes.map((n) => n[0]).includes(newPitch.pname)
    // Create new element for accid, when different accid than accected note or some other accid
  ) {
    let a = document.createElementNS(dutils.meiNameSpace, 'accid');
    a.setAttributeNS(dutils.xmlNameSpace, 'xml:id', utils.generateXmlId('accid', v.xmlIdStyle));
    a.setAttribute('accid', newPitch.accidGes);
    el.appendChild(a);
  }

  el.setAttribute(octAttr, octValue);
  el.setAttribute(pnameAttr, newPitch.pname);
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
