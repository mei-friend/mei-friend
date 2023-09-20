/**
 * Provides functionality to handle editorial markup in MEI.
 * TODO: currently (Dec 2022) only default behavior.
 * Future development would have to think about how to
 * retrieve different options.
 */

import * as dutils from './dom-utils.js';
import * as utils from './utils.js';
import { replaceInEditor } from './editor.js';

/**
 * [Wrapper for selectApparatus() and selectChoice().]
 * Returns xmlDoc in which the app and choice elements are
 * resolved (i.e. selected elements kept and others removed).
 * Currently they default to lem or first rdg in app
 * and first child in choice.
 * @param {Document} xmlDoc
 * @param {string} selectString
 * @returns {Document} xmlDoc
 */
export function selectMarkup(xmlDoc, selectString = '') {
  xmlDoc = selectApparatus(xmlDoc, selectString);
  xmlDoc = selectChoice(xmlDoc, selectString);
  return xmlDoc;
} // selectMarkup()

/**
 * Selects the requested lemma or reading inside apparatus
 * elements, based on the sourceId idendtifyer (TODO).
 * By default, the lemma or the first reading of each apparatus
 * is kept in returned xmlDoc.
 * @param {Document} xmlDoc
 * @param {string} sourceId (TODO)
 * @returns {Document} xmlDoc
 */
export function selectApparatus(xmlDoc, sourceId = '') {
  if (!xmlDoc) return null;
  let app;
  // Go through all app elements replace it by lemma or first reading
  while ((app = xmlDoc.querySelector('app'))) {
    let parent = app.parentElement;
    // search lemma, or if absent, first reading
    let el = app.querySelector('lem') || app.querySelector('rdg');
    if (parent && el) {
      // add clones of child nodes before app...
      el.childNodes.forEach((child) => {
        parent.insertBefore(child.cloneNode(true), app);
      });
      app.remove(); // ... and remove app afterwards
    } else {
      console.log('This app has neither lemma nor reading elements. ', app);
    }
  }
  return xmlDoc;
} // selectApparatus()

/**
 * Selects the requested choice child element (TODO) and
 * keeps it in xmlDoc; other choices are removed.
 * @param {Document} xmlDoc
 * @param {string} sourceId
 * @returns {Document} xmlDoc
 */
export function selectChoice(xmlDoc, sourceId) {
  if (!xmlDoc) return null;
  let choice;
  // Go through all choice elements replace it by first child
  while ((choice = xmlDoc.querySelector('choice'))) {
    let parent = choice.parentElement;
    // this selects the first child inside <choice> by default, to be changed later (TODO)
    let firstChild; // get first child element that is an ELEMENT_NODE
    for (let node of choice.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        firstChild = node;
        break;
      }
    }
    if (parent && firstChild) {
      // add clones of child nodes before choice...
      firstChild.childNodes.forEach((child) => {
        parent.insertBefore(child.cloneNode(true), choice);
      });
      choice.remove(); // ... and remove choice afterwards
    } else {
      console.log('This choice has no child elements. ', choice);
    }
  }
  return xmlDoc;
} // selectChoice()

/**
 * Returns first child element, ignoring text and other nodes
 * @param {Element} parent
 * @returns
 */
function firstChildElement(parent) {
  for (let node of parent.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return node;
    }
  }
  return null;
} // firstChildElement()

export function wrapGroupWithMarkup(v, cm, groupIds, mElName, parentEl) {
  let markupEl = document.createElementNS(dutils.meiNameSpace, mElName);
  let uuid;

  let respId = document.getElementById('respSelect').value;
  if (respId) markupEl.setAttribute('resp', '#' + respId);

  for (let i = 0; i < groupIds.length; i++) {
    let id = groupIds[i];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    let currentParent = el.parentNode;

    // special treatment of the first element for id generation and to place sup within the tree (and a sanity check)
    if (i === 0) {
      uuid = mintSuppliedId(id, mElName, v);
      markupEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', uuid);

      currentParent.replaceChild(markupEl, el);
      markupEl.appendChild(el);
    } else {
      if (currentParent === parentEl) {
        markupEl.appendChild(el);
        // remove following text node to prevent trailing newlines
        markupEl.nextSibling.remove();
      } else {
        //error
      }
    }
    parentEl = currentParent;
  }
  replaceInEditor(cm, parentEl, true);
  cm.execCommand('indentAuto');

  return uuid;
}

function mintSuppliedId(id, nodeName, v) {
  // follow the Mozarteum schema, keep numbers (for @o-sapov)
  let underscoreId = id.match(/_\d+$/);
  if (underscoreId) {
    return nodeName + underscoreId[0];
  }
  return utils.generateXmlId(nodeName, v.xmlIdStyle);
}
