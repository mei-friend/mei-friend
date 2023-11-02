/**
 * Provides functionality to handle editorial markup in MEI.
 * TODO: currently (Dec 2022) only default behavior.
 * Future development would have to think about how to
 * retrieve different options.
 */

import * as att from './attribute-classes.js';
import { addApplicationInfo, replaceInEditor } from './editor.js';
import { cm, cmd, v } from './main.js';
import * as dutils from './dom-utils.js';
import * as speed from './speed.js';
import * as utils from './utils.js';
import Viewer from './viewer.js';
import { addListItem, refreshAnnotationsList } from './enrichment_panel.js';

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

export function addMarkup(attrName = 'none', mElName = 'supplied')
{
  addTranscriptionLikeElement(v, cm, attrName, mElName);
  
  // one addMarkupAction might result in multiple markup elements
  // e.g. when selecting notes and control events
  // mostly because symbols in a score aren't necessarily close in the xml tree
  // properties are similar to annotations
  // id is the xml:id of the first markup element
  // selection contains all markup elements created at the same time
  // type uses capitalised element name, e.g. markupSupplied

  const markupItem = {
    id: v.selectedElements[0],
    type: mElName,
    isMarkup: true,
    selection: v.selectedElements,
  };
  let success = addListItem(markupItem);
  if(success === true) refreshAnnotationsList();
}


/**
 * Surrounds selected elements with a markup element
 * (and a responsibility statement from v.respId derived
 * from mei-friend settings.
 *
 * If attrName is specified, it searches for those attributes,
 * inserts them as new elements, and surrounds them with supplied
 * elements. If there is already such a artic/accid child element,
 * take it and surround it.
 *
 * mElName contains the element name for the element supplied.
 * The element must be a member of att.modelTranscriptionLike.
 * By default, the added markup element will be <supplied>.
 * @param {Viewer} v
 * @param {CodeMirror} cm
 * @param {string} attrName ('artic', 'accid')
 * @param {string} mElName name of markup element to apply
 * @returns
 */
export function addTranscriptionLikeElement(v, cm, attrName = 'none', mElName = 'supplied') {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  if (v.selectedElements.length < 1) return;
  if (!att.modelTranscriptionLike.includes(mElName)) return;
  v.allowCursorActivity = false;

  let uuids = [];
  let elementGroups = [];

  // this loop updated the list of selected elements to be wrapped by markup
  // and will separate the list into groups of adjacent elements to be wrapped into a single markup element
  while (v.selectedElements.length > 0) {
    let id = v.selectedElements[0];
    let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
    if (!el) {
      console.warn('No such element in xml document: ' + id);
      // remove element from list of selected elements if it cannot be found
      v.selectedElements.splice(v.selectedElements.indexOf(id), 1);
    } else {
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
            // push childElement to list of groups to wrap
            // and remove element from selectedElements to avoid double processing
            elementGroups.push([childElement.getAttribute('xml:id')]);
            v.selectedElements.splice(v.selectedElements.indexOf(id), 1);
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

          // push childElement to list of groups to wrap
          // and remove element from selectedElements to avoid double processing
          elementGroups.push([attrEl.getAttribute('xml:id')]);
          v.selectedElements.splice(v.selectedElements.indexOf(id), 1);
        }
      } else {
        if (['accid', 'artic'].includes(attrName)) {
          const msg = 'Only chord and note elements are allowed for this command (you selected ' + el.nodeName + ').';
          console.log(msg);
          v.showAlert(msg, 'warning');
        }

        // search for groups
        elementGroups.push(dutils.getAdjacentSiblingElements(el, v.selectedElements, v.xmlDoc));
      }

      // the supplied element per selected element used to be created here
      // this is moved to the next foreach loop
    }
  }

  // this loop iterates over the array of arrays of grouped ids
  // and wraps the markup around a whole group
  // TODO (nice to have): Add @corresp to elements if more than one is created at once
  elementGroups.forEach((group) => {
    let parent = v.xmlDoc.querySelector("[*|id='" + group[0] + "']").parentNode;

    // warn and prevent if currentParrent has no xml:id because replacing in editor will fail
    // added option to add xml:ids to the file before adding markup
    if (parent && parent.getAttribute('xml:id') == null) {
      const handleMissigParentId = new Promise((resolve, reject) => {
        const msg =
          'Action can only be performed if parent element has an xml:id. Please add xml:ids to the document before.';
        console.log(msg);

        v.showUserPrompt(msg, [
          {
            label: 'Abort action',
            event: (abort) => {
              reject('promptOverlay', abort);
            },
          },
          {
            label: 'Add xml:ids to document',
            event: (abort) => {
              resolve('promptOverlay', abort);
            },
          },
        ]);
      });

      handleMissigParentId
        .then((resolveModal) => {
          cmd.addIds();
          v.hideUserPrompt(resolveModal);
          console.log('Added ids and proceed.');
          let markupUuid = wrapGroupWithMarkup(v, cm, group, mElName, parent);
          uuids.push(markupUuid);
        })
        .catch((resolveModal) => {
          v.hideUserPrompt(resolveModal);
          console.log('Aborting action because of missing parent id.');
        });
    } else {
      let markupUuid = wrapGroupWithMarkup(v, cm, group, mElName, parent);
      uuids.push(markupUuid);

      // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
    }
  });

  if (uuids.length > 0) {
    v.selectedElements = [];
    uuids.forEach((u) => v.selectedElements.push(u));
  }

  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // addSuppliedElement()


function wrapGroupWithMarkup(v, cm, groupIds, mElName, parentEl) {
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
        if (markupEl.nextSibling) markupEl.nextSibling.remove();
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
