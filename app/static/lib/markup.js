/**
 * Provides functionality to handle editorial markup in MEI.
 * TODO: currently (Dec 2022) only default behavior.
 * Future development would have to think about how to
 * retrieve different options.
 */

import * as att from './attribute-classes.js';
import { addApplicationInfo, indentSelection, replaceInEditor } from './editor.js';
import { cm, cmd, v } from './main.js';
import * as dutils from './dom-utils.js';
import * as speed from './speed.js';
import * as utils from './utils.js';
import Viewer from './viewer.js';
import { addListItem, isItemInList, refreshAnnotationsList, retrieveItemValuesByProperty } from './enrichment_panel.js';

/**
 * Reads markup elements from the XML document and creates
 * list item objects for each group of corresponding markup elements.
 */
export function readMarkup() {
  // read all markup elements supported from the current document
  // create objects out of them
  // add objects to list
  // use xmlMarkupToListItem(selectedElements, mElName)
  let elementList = att.modelTranscriptionLike.join(',');
  let markup = Array.from(v.xmlDoc.querySelectorAll(elementList));
  markup = markup.filter((markup) => !isItemInList(markup.getAttribute('xml:id')));

  let correspIdsToIgnore = [];

  // get unique selections for all currently available markup items in listItems
  // this is to ensure that for multiple corresponding markup elements only one list item is created
  // containing all corresponding items as selection
  let currentSelections = retrieveItemValuesByProperty('isMarkup', 'selection');
  currentSelections = utils.flattenArrayToUniques(currentSelections);
  correspIdsToIgnore = correspIdsToIgnore.concat(...currentSelections);

  markup.forEach((markupEl) => {
    let elId = markupEl.getAttribute('xml:id');
    if (!correspIdsToIgnore.includes(elId)) {
      let elName = markupEl.localName;
      if (elId == null) {
        elId = utils.generateXmlId(elName, v.xmlIdStyle);
        markupEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', elId);
      }

      let correspStr = markupEl.getAttribute('corresp');
      let correspIds = [];
      if (correspStr) {
        correspIds = correspStr.split(' ');
        correspIds = correspIds.map((id) => {
          if (id.startsWith('#')) {
            return id.slice(1);
          } else {
            return id;
          }
        });
        correspIds.forEach((id) => correspIdsToIgnore.push(id));
      }
      correspIds.unshift(elId);
      xmlMarkupToListItem(elId, elName, correspIds);
    }
  });
}

/**
 * Returns for a markup item the page locations in the Verovio rendering
 * @param {Object} markupItem markupItem to situate
 * @returns {Promise} a promise containing the modified markupItem
 */
export async function situateMarkup(markupItem) {
  if ('selection' in markupItem) {
    let selStart = markupItem.selection[0];
    let selLen = markupItem.selection.length - 1;
    let selEnd = markupItem.selection[selLen];
    markupItem.firstPage = await v.getPageWithElement(selStart);
    markupItem.lastPage = await v.getPageWithElement(selEnd);
  }

  return markupItem;
}

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

/**
 * Calls the function to add markup and refreshes the list of items
 * @param {string} attrName
 * @param {string} mElName
 */
export function addMarkup(attrName = 'none', mElName = 'supplied') {
  addTranscriptionLikeElement(v, cm, attrName, mElName);
  //let successfullyAdded = xmlMarkupToListItem(v.selectedElements, mElName);
  // Manually updating the item list is not necessary because refreshing the code in the editor triggers readMarkup()
  refreshAnnotationsList();
}

/**
 * Creates a list item object for markup elements based on some basic data
 * @param {string} currentElementId xml:id of current element -> item.id
 * @param {string} mElName element name -> item.type
 * @param {Array[string]} correspElements ids of corresponding elements (including self) -> item.selection
 * @returns {boolean} adding item was successful
 */
function xmlMarkupToListItem(currentElementId, mElName, correspElements) {
  // one addMarkupAction might result in multiple markup elements
  // e.g. when selecting notes and control events
  // mostly because symbols in a score aren't necessarily close in the xml tree
  // properties are similar to annotations
  // id is the xml:id of the first markup element
  // selection contains all markup elements created at the same time

  const markupItem = {
    id: currentElementId,
    type: mElName,
    isMarkup: true,
    selection: correspElements,
  };
  let success = addListItem(markupItem);
  return success;
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
    if (v.selectedElements.length > 1) {
      // add corresp attribute to markup elements
      addCorrespAttr(v.selectedElements);
    }
    v.selectedElements.forEach((id) => {
      let el = v.xmlDoc.querySelector("[*|id='" + id + "']");
      let parentEl = el.parentNode;
      replaceInEditor(cm, parentEl, true);
      cm.execCommand('indentAuto');
      // refresh editor here after the markup insertion is finished
    });
  }

  addApplicationInfo(v, cm);
  v.updateData(cm, false, true);
  v.allowCursorActivity = true; // update notation again
} // addSuppliedElement()

/**
 * Wraps a single group of elements with a markup element
 * @param {*} v viewer
 * @param {*} cm code mirror
 * @param {Array} groupIds xml:ids of elements to wrap
 * @param {string} mElName element name for markup
 * @param {HTMLElement} parentEl parent element of group to wrap
 * @returns {string} id of created markup element
 */
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
  // do not refresh editor here to not mess with the markup items
  // markup items will be imported to enrichment_panel.itemList because an event triggers
  // to read list items from the xml file as soon as the editor is refreshed

  return uuid;
}

/**
 * Adds xml:ids related elements to a markup element
 * @param {Array} grpIds xml:ids of related markup elements
 */
function addCorrespAttr(grpIds) {
  grpIds.forEach((currentId) => {
    let otherGrpIds = grpIds.filter((id) => id !== currentId);
    let grpLinks = otherGrpIds.join(' #');
    grpLinks = grpLinks.length <= 0 ? grpLinks : '#' + grpLinks;
    let el = v.xmlDoc.querySelector("[*|id='" + currentId + "']");
    if (!el.getAttribute('corresp')) {
      el.setAttribute('corresp', grpLinks);
      // do not refresh editor here to not mess with the markup items
    }
  });
}

/**
 *
 * @param {*} id xml:id of the first element that will be wrapped with markup
 * @param {*} nodeName node name of the element the id should be created for
 * @param {*} v viewer
 * @returns {string} id to use as xml:id
 */
function mintSuppliedId(id, nodeName, v) {
  // follow the Mozarteum schema, keep numbers (for @o-sapov)
  let underscoreId = id.match(/_\d+$/);
  if (underscoreId) {
    return nodeName + underscoreId[0];
  }
  return utils.generateXmlId(nodeName, v.xmlIdStyle);
}

/**
 * Deletes a markup item from listItems and all related elements from the xml document.
 * @param {Object} markupItem
 */
export function deleteMarkup(markupItem) {
  markupItem.selection.forEach((id) => {
    var toDelete = v.xmlDoc.querySelector("[*|id='" + id + "']");
    var parent = toDelete.parentElement;
    var descendants = new DocumentFragment();

    for (let i = 0; i < toDelete.children.length; i++) {
      let child = toDelete.children[i];
      descendants.appendChild(child.cloneNode(true));
    }

    parent.replaceChild(descendants, toDelete);
    replaceInEditor(cm, parent, true);
    indentSelection(v, cm);
  });
}
