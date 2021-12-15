// contains all the editor functions
import * as speed from './speed.js';
import * as utils from './utils.js';
import * as dutils from './dom-utils.js';
import * as att from './attribute-classes.js';

// delete selected elements
export function delEl(v, cm) {
  v.loadXML(cm.getValue(), true);
  let id = v.selectedElements[0]; // TODO: iterate over selectedElements
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
      // TODO Octave
      let dis_place = element.getAttribute('dis.place');
      let dis = element.getAttribute('dis');
      let id1 = speed.removeHashFromString(element.getAttribute('startid'));
      let id2 = speed.removeHashFromString(element.getAttribute('endid'));
      speed.findAndModifyOctaveElements(txtEdr, v.xmlDoc, id1, id2,
        dis_place, dis, false);
      removeInBuffer(cm, element); // TODO ADAPT
      selectedElements.push(id2);
    } else {
      removeInBuffer(cm, element);
      // TODO: place cursor at a sensible place...
      selectedElements.push(utils.getElementIdAtCursor(cm));
    }
  } else if (['beam'].includes(element.nodeName)) { // TODO beam
    let p1 = txtEdr.getCursorBufferPosition();
    let first = true;
    let childList = element.childNodes;
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].nodeType === Node.TEXT_NODE) continue;
      if (first) {
        speed.replaceInTextEditor(txtEdr, element, false, childList[i]);
        first = false;
      } else {
        txtEdr.insertNewline();
        txtEdr.insertText(speed.xmlToString(childList[i]));
      }
      selectedElements.push(childList[i].getAttribute('xml:id'))
      element.parentNode.insertBefore(childList[i--], element);
    }
    let p2 = txtEdr.getCursorBufferPosition();
    txtEdr.setSelectedBufferRange([p1, p2]);
    txtEdr.autoIndentSelectedRows();
    txtEdr.setCursorBufferPosition(p2);
  } else {
    console.info('Element ' + id + ' not supported for deletion.');
    return;
  }
  element.remove();
  // buffer.groupChangesSinceCheckpoint(checkPoint); TODO
  v.selectedElements = selectedElements;
  v.lastNoteId = v.selectedElements[v.selectedElements.length - 1];
  // console.info('selectedElements: ');
  // for (e of v.selectedElements) console.info(', ' + e);
  v.speedMode ? v.updateLayout() : v.updateData(cm, false, true);
  v.updateNotation = true;
}

export function addCtrlEl(v, cm, elName, placement, form) {
  if (v.selectedElements.length < 1) return;
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  console.info('addCtrlEl() ', elName, placement, form);

  // find and validate startEl with @startId
  let startId = v.selectedElements[0];
  var startEl = v.xmlDoc.querySelector("[*|id='" + startId + "']");
  if (!startEl) return;
  if (!['note', 'chord', 'rest', 'mRest', 'multiRest'].includes(startEl.nodeName)) {
    console.info(
      'addControlElementDom: Cannot add new element to start element' +
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
    for (e of v.selectedElements) {
      plistString += '#' + e + ' ';
    }
    newElement.setAttribute('plist', plistString);
  }
  if (form && ['dir', 'dynam', 'tempo'].includes(elName)) {
    newElement.appendChild(v.xmlDoc.createTextNode(form));
  }
  // add new element to txtEdr at end of measure
  if (p) {
    v.updateNotation = false; // to prevent reloading after each edit
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
}



// private functions

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
    let searchFullElement = '(?:<' + xmlNode.nodeName + `)(\\s+?)([^>]*?)(?:xml:id=["']` +
      itemId + `["'])([\\s\\S]*?)(?:</` + xmlNode.nodeName + '[ ]*?>)';
    sc = cm.getSearchCursor(new RegExp(searchFullElement));
    if (sc.findNext()) {
      console.info('removeInBuffer() full element from: ', sc.from());
      console.info('removeInBuffer() full element to: ', sc.to());
    }
  }
  if (sc.atOccurrence) sc.replace('');
  // TODO: remove empty lines
  else
    console.info('removeInBuffer(): nothing replaced for ' + itemId + '.');
}
