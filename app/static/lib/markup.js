/**
 * Provides functionality to handle editorial markup in MEI.
 */

import * as att from './attribute-classes.js';
import { addApplicationInfo, replaceInEditor } from './editor.js';
import { cm, cmd, handleEditorChanges, translator, v } from './main.js';
import * as dutils from './dom-utils.js';
import * as speed from './speed.js';
import * as utils from './utils.js';
import Viewer from './viewer.js';
import { addListItem, isItemInList, refreshAnnotationsList, retrieveItemValuesByProperty } from './enrichment-panel.js';
import { setChoiceOptions } from './control-menu.js';

/**
 * Contains choice options currently available for the document
 */
export var choiceOptions = [];

/**
 * Reads markup elements from the XML document and creates
 * list item objects for each group of corresponding markup elements.
 */
export function readMarkup() {
  // read all markup elements supported from the current document
  // create objects out of them
  // add objects to list
  // use xmlMarkupToListItem(selectedElements, mElName)
  if (!v.xmlDoc) {
    return;
  }
  let elementList = att.modelTranscriptionLike.concat(...att.alternativeEncodingElements).join(',');
  let markup = Array.from(v.xmlDoc.querySelectorAll(elementList));
  markup = markup.filter((markup) => !isItemInList(markup.getAttribute('xml:id')));

  let idsToIgnore = [];

  // get unique selections for all currently available markup items in listItems
  // this is to ensure that for multiple corresponding markup elements only one list item is created
  // containing all corresponding items as selection
  let currentSelections = retrieveItemValuesByProperty('isMarkup', 'selection');
  currentSelections = utils.flattenArrayToUniques(currentSelections);
  idsToIgnore = idsToIgnore.concat(...currentSelections);

  // get ids of all children of choice/subst/app and add them to idsToIgnore
  // adding them for each element when it's processed didn't work
  let alternativeVersions = Array.from(v.xmlDoc.querySelectorAll(att.alternativeEncodingElements.join(',')));
  alternativeVersions?.forEach((element) => {
    let children = element.children;
    for (let i = 0; i < children.length; i++) {
      idsToIgnore.push(children[i].getAttribute('xml:id'));
    }
  });

  markup.forEach((markupEl) => {
    let content = [];
    let elId = markupEl.getAttribute('xml:id');
    if (!idsToIgnore.includes(elId)) {
      let elName = markupEl.localName;
      if (elId == null) {
        // (AP, 9.9.2024)
        // Automatically add missing xml:ids
        // I replace the parent element to prevent hickups and endless recursions
        // because replaceInEditor() needs xml:ids to work.
        // This can definitely be solved in a better way,
        // but I'm not familar enough with the other editor functions
        elId = utils.generateXmlId(elName, v.xmlIdStyle);
        markupEl.setAttributeNS(dutils.xmlNameSpace, 'xml:id', elId);
        // (DW and WG, 24.6.2025
        // This solution runs into a problem when the parent
        // element doesn't have an xml:id either.
        // We therefore should recognize this case and
        // prompt the user to add IDs. (TODO!)
        // This is already done further below (around line 500, 'handleMissingParentId') but there it isn't nicely modularized
        // and cannot easily be made so due to asynchronicity.
        replaceInEditor(cm, markupEl.parentElement, false);
        cm.execCommand('indentAuto');
        console.log(`Added xml:id ${elId} to ${elName}`);
      }

      if (att.alternativeEncodingElements.includes(elName)) {
        for (let i = 0; i < markupEl.children.length; i++) {
          content.push(markupEl.children[i].localName);
        }
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
        correspIds.forEach((id) => idsToIgnore.push(id));
      }
      correspIds.unshift(elId);

      let resp = markupEl.getAttribute('resp');

      xmlMarkupToListItem(elId, elName, correspIds, content, resp);
    }
  });
  updateChoiceOptions();
} // readMarkup()

/**
 * Creates a list item object for markup elements based on some basic data
 * @param {string} currentElementId xml:id of current element -> item.id
 * @param {string} mElName element name -> item.type
 * @param {Array[string]} correspElements ids of corresponding elements (including self) -> item.selection
 * @param {Array[string]} [content=[]] children of multi-layer elements like choice/subst/app
 * @param {string} resp value of resp attribute
 * @returns {boolean} adding item was successful
 */
function xmlMarkupToListItem(currentElementId, mElName, correspElements, content = [], resp) {
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

  if (content.length > 0) {
    markupItem.content = content;
  }

  if (resp) {
    if (resp[0] === '#') resp = resp.slice(1);
    let respEl = v.xmlDoc.querySelector("[*|id='" + resp + "']");
    if (respEl) {
      let respName = respEl.textContent;
      markupItem.resp = respName;
    }
  }

  let success = addListItem(markupItem);
  return success;
} // xmlMarkupToListItem()

/**
 * Retrieves the content of all choice elements from the document to store them in choiceOptions.
 * Will be read by control-menu.js/setChoiceOptions() to build the menu.
 */
function updateChoiceOptions() {
  // the loading logic causes this function to run twice.
  // so make sure this always represents the state of the mei document
  // therefore reset choiceOptions first
  choiceOptions = [];

  let defaultOption = {
    label: translator.lang.choiceDefault.text,
    value: '',
    count: 100,
    id: 'Default',
    prop: 'XPathQuery',
  };

  //let elNames = choiceOptions.map((obj) => obj.value);
  let choices = Array.from(v.xmlDoc.querySelectorAll('choice,subst'));
  //TODO: change to att.alternativeEncodingElements.join(',') when ready

  let topLevelEls = choices.map((obj) => obj.localName).filter((value, index, array) => array.indexOf(value) === index);
  topLevelEls.forEach((topLevelEl) => {
    let optGroup = { elName: topLevelEl, options: [] };
    let newDefault = Object.assign({}, defaultOption);
    newDefault.id = topLevelEl + newDefault.id;
    newDefault.prop = topLevelEl + newDefault.prop;
    optGroup.options.push(newDefault);

    let elNames = optGroup.options.map((obj) => obj.value);

    let currentChoices = choices.filter((el) => el.localName === topLevelEl);
    currentChoices.forEach((choice) => {
      for (let i = 0; i < choice.children.length; i++) {
        let child = choice.children[i];
        if (!elNames.includes(child.localName)) {
          let capitalisedOption = child.localName[0].toUpperCase() + child.localName.slice(1);
          optGroup.options.push({
            label: capitalisedOption,
            value: child.localName,
            count: 1,
            id: topLevelEl + capitalisedOption,
            prop: topLevelEl + 'XPathQuery',
          });
          elNames.push(child.localName);
        } else {
          let obj = optGroup.options.find((obj) => obj.value === child.localName);
          obj.count = obj.count + 1;
        }
      }
    });

    choiceOptions.push(optGroup);
  });
} // updateChoiceOptions()

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
} // situateMarkup()

/**
 * [Wrapper for selectApparatus() and selectChoice().]
 * Returns xmlDoc in which the app and choice elements are
 * resolved (i.e. selected elements kept and others removed).
 * Currently they default to lem or first rdg in app
 * and first child in choice.
 * @param {Document} xmlDoc
 * @param {string} selectString
 * @returns {Object} result = { changed: changeFlag, doc: xmlDoc }
 */
export function selectMarkup(xmlDoc, selectString = '') {
  let result;
  let appResult = selectApparatus(xmlDoc, selectString);
  if (appResult.changed === true) {
    result = appResult;
  }
  let choiceResult = selectChoiceSubst(xmlDoc, 'choice', selectString);
  if (result == undefined && choiceResult.changed === true) {
    result = choiceResult;
  }
  let substResult = selectChoiceSubst(xmlDoc, 'subst', selectString);
  if (result == undefined && substResult.changed === true) {
    result = substResult;
  }
  return result;
} // selectMarkup()

/**
 * Selects the requested lemma or reading inside apparatus
 * elements, based on the sourceId idendtifyer (TODO).
 * By default, the lemma or the first reading of each apparatus
 * is kept in returned xmlDoc.
 * @param {Document} xmlDoc
 * @param {string} sourceId (TODO)
 * @returns {Object} result = { changed: changeFlag, doc: xmlDoc }
 */
export function selectApparatus(xmlDoc, sourceId = '') {
  if (!xmlDoc) return null;
  let changeFlag = false;
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
      changeFlag = true;
    } else {
      console.log('This app has neither lemma nor reading elements. ', app);
      app.remove();
    }
  }

  let result = { changed: changeFlag, doc: xmlDoc };

  return result;
} // selectApparatus()

/**
 * Selects the requested child element for either choice or subst
 * keeps it in xmlDoc; other choices are removed.
 * Keeps choice and content of the first child to allow navigation and highlighting.
 * @param {Document} xmlDoc
 * @param {string} elName name of element to filter: choice|subst
 * @param {string} childElName name of child element to keep
 * @returns {Object} result = { changed: changeFlag, doc: xmlDoc }
 */
export function selectChoiceSubst(xmlDoc, elName, childElName) {
  if (!xmlDoc) return null;
  let changeFlag = false;
  let choices = Array.from(xmlDoc.querySelectorAll(elName));
  choices.forEach((choice) => {
    // this selects the first child inside <choice> by default, to be changed later (TODO)
    let children = choice.children;
    if (children) {
      let childNames = [];
      for (let i = 0; i < children.length; i++) {
        childNames.push(children[i].localName);
      }
      if (childElName === '' || !childNames.includes(childElName)) {
        // delete currently everything but the first child
        for (let i = 1; i < children.length; i++) {
          children[i].remove();
          changeFlag = true;
        }
      } else {
        for (let i = 0; i < children.length; i++) {
          let currentChild = children[i];
          if (currentChild.localName !== childElName) {
            currentChild.remove();
            changeFlag = true;
          }
        }
      }
    } else {
      console.log('This choice has no child elements. ', choice);
    }
  });

  let result = { changed: changeFlag, doc: xmlDoc };

  return result;
} // selectChoice()

/**
 * Returns first child element, ignoring text and other nodes
 * @param {Element} parent
 * @returns
 * TODO: never used, probably remove
 */
// function firstChildElement(parent) {
//   for (let node of parent.childNodes) {
//     if (node.nodeType === Node.ELEMENT_NODE) {
//       return node;
//     }
//   }
//   return null;
// } // firstChildElement()

/**
 * Calls the function to add markup and refreshes the list of items
 * @param {Event} event click event
 */
export function addMarkup(event) {
  let eventTarget = event.currentTarget;
  let mElName = eventTarget.dataset.elName;
  let attrName = document.getElementById('selectionSelect').value;
  let multiLayerContent = eventTarget.dataset.content?.split(',');
  if (!multiLayerContent) {
    // annotationMultiToolsIcon was clicked
    multiLayerContent = document.getElementById(`${mElName}ContentTarget`)?.dataset.content?.split(',');
  }
  if (!att.modelTranscriptionLike.includes(mElName) && !att.alternativeEncodingElements.includes(mElName)) {
    return;
  }

  if (att.alternativeEncodingElements.includes(mElName) && multiLayerContent == undefined) {
    v.showAlert('Please first select a content option for this markup element!');
  } else {
    addMarkupToXML(v, cm, attrName, mElName, multiLayerContent);
    handleEditorChanges(); // update editor content
    //let successfullyAdded = xmlMarkupToListItem(v.selectedElements, mElName);
    // Manually updating the item list is not necessary because refreshing the code in the editor triggers readMarkup()
    refreshAnnotationsList();
    //select elements of last reading for alternative encodings if copied
    if (multiLayerContent != undefined && document.getElementById('alternativeVersionContent').value == 'copy') {
      let newSelection = [];
      v.selectedElements.forEach((id) => {
        let selEl = v.xmlDoc.querySelector("[*|id='" + id + "']");
        let lastChild = selEl.lastElementChild;
        for (let child of lastChild.children) {
          newSelection.push(child.getAttribute('xml:id'));
        }
      });
      setChoiceOptions(multiLayerContent[multiLayerContent.length - 1]);
      handleEditorChanges();
      v.selectedElements = newSelection;
      v.setFocusToVerovioPane();
    }
  }
} // addMarkup()

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
 */
function addMarkupToXML(v, cm, attrName = 'none', mElName, multiLayerContent = []) {
  v.loadXml(cm.getValue());
  v.selectedElements = speed.filterElements(v.selectedElements, v.xmlDoc);
  v.selectedElements = utils.sortElementsByScorePosition(v.selectedElements);
  if (v.selectedElements.length < 1) return;
  v.allowCursorActivity = false;
  cm.blockChanges = true;

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
          let uuid = mintSuppliedId(id, attrName, v);
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
  } // while

  // Arrays for the copied Elements and a sort-of dictionary for new 2 old IDs in case we have
  // dependent IDs we need to change after the copy
  let dicOld2NewIDs = {};
  let copiedChilds = [];

  // this loop iterates over the array of arrays of grouped ids
  // and wraps the markup around a whole group
  elementGroups.forEach((group) => {
    let parent = v.xmlDoc.querySelector("[*|id='" + group[0] + "']").parentNode;

    // warn and prevent if currentParrent has no xml:id because replacing in editor will fail
    // added option to add xml:ids to the file before adding markup
    if (parent && parent.getAttribute('xml:id') == null) {
      const handleMissingParentId = new Promise((resolve, reject) => {
        const msg = translator.lang.missingParentIdWarning.text;
        console.log(msg);

        v.showUserPrompt(msg, [
          {
            label: translator.lang.handleMissingParentIdProceed.text, //'Add xml:ids to document',
            event: (abort) => {
              resolve('promptOverlay', abort);
            },
          },
          {
            label: translator.lang.handleMissingParentIdAbort.text, //'Abort action',
            event: (abort) => {
              reject('promptOverlay', abort);
            },
          },
        ]);
      });

      handleMissingParentId
        .then((resolveModal) => {
          cmd.addIds();
          v.hideUserPrompt(resolveModal);
          console.log('Added ids and proceed.');
          let markupUuid = createMarkup(v, group, mElName, parent, multiLayerContent, copiedChilds, dicOld2NewIDs);
          uuids.push(markupUuid);
        })
        .catch((resolveModal) => {
          v.hideUserPrompt(resolveModal);
          console.log('Aborting action because of missing parent id.');
        });
    } else {
      let markupUuid = createMarkup(v, group, mElName, parent, multiLayerContent, copiedChilds, dicOld2NewIDs);
      uuids.push(markupUuid);

      // buffer.groupChangesSinceCheckpoint(checkPoint); // TODO
    }
  });

  // Go over the existing copied childs to modify dependent IDs to other modified elements
  copiedChilds.forEach((item) => {
    dutils.modifyDependenIDs(item, dicOld2NewIDs);
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
      replaceInEditor(cm, el, true); // to select new markup element
    });
  }

  addApplicationInfo(v, cm);
  v.allowCursorActivity = true; // update notation again
  cm.blockChanges = false;
} // addMarkupToXML()

/**
 * Creates either simple or multilayered markup for a selection of elements.
 * Wraps the selection with a markup element and builds multilayered markup
 * (choice, subst, app) around.
 * @param {Viewer} v
 * @param {Array} groupIds
 * @param {string} mElName
 * @param {HTMLElement} parentEl parent element
 * @param {Array[string]} content element names
 * @param {Array} copiedChilds an array where copied elements will be inserted
 * @param {Object} dicOld2NewIDs a dictionary where old to new IDs of copied elements will be inserted
 * @returns the uuid of the outer element
 */
function createMarkup(v, groupIds, mElName, parentEl, content, copiedChilds, dicOld2NewIDs) {
  let upmostMarkupUuid;
  let upmostMarkup;
  if (att.modelTranscriptionLike.includes(mElName)) {
    upmostMarkup = wrapGroupWithMarkup(v, groupIds, mElName, parentEl);
  } else {
    let firstChild = wrapGroupWithMarkup(v, groupIds, content[0], parentEl);
    upmostMarkup = addMultiLayeredMarkup(v, mElName, parentEl, firstChild, content, copiedChilds, dicOld2NewIDs);
  }
  upmostMarkupUuid = upmostMarkup.getAttribute('xml:id');
  return upmostMarkupUuid;
} // createMarkup()

/**
 * Wraps multi layered markup for alternative encodings around a markup element
 * that then becomes the first child.
 * @param {Viewer} v
 * @param {string} mElName name of to level element to create, choice/subst/app
 * @param {HTMLElement} parentEl parent for choice/subst/app
 * @param {HTMLElement} firstChild first child of choice/subst/app with content
 * @param {Array[string]} content element names for content of choice/subst/app
 * @param {Array} copiedChilds an array where copied elements will be inserted
 * @param {Object} dicOld2NewIDs a dictionary where old to new IDs of copied elements will be inserted
 * @returns {HTMLElement} newly created multi layered markup element
 */
function addMultiLayeredMarkup(v, mElName, parentEl, firstChild, content, copiedChilds, dicOld2NewIDs) {
  let upmostElement = document.createElementNS(dutils.meiNameSpace, mElName);
  let upmostElementID = mintSuppliedId(firstChild.getAttribute('xml:id'), mElName, v);
  upmostElement.setAttributeNS(dutils.xmlNameSpace, 'xml:id', upmostElementID);

  // add respID to choice/subst instead of children
  // and delete it from firstChild if necessary
  // because it's too complex to decide on resps for children and (currently) to set them individually
  let respID = getCurrentRespID();
  if (respID) {
    upmostElement.setAttribute('resp', '#' + respID);
  }
  if (firstChild.getAttribute('resp')) {
    firstChild.removeAttribute('resp');
  }

  let alternativeEncodingSettingsValue = document.getElementById('alternativeVersionContent').value;

  parentEl.replaceChild(upmostElement, firstChild);
  upmostElement.appendChild(firstChild);
  let dummyEmpty = document.createComment('replace this with alternative reading');
  let dummyCopy = document.createComment('change content of alternative reading');

  for (let i = 1; i < content.length; i++) {
    let nextChild = document.createElementNS(dutils.meiNameSpace, content[i]);
    let nextChildID = mintSuppliedId(upmostElementID, content[i], v);
    nextChild.setAttributeNS(dutils.xmlNameSpace, 'xml:id', nextChildID);
    upmostElement.appendChild(nextChild);

    switch (alternativeEncodingSettingsValue) {
      case 'copy':
        nextChild.appendChild(dummyCopy);
        let firstChildCopies = new DocumentFragment();

        for (let child of firstChild.children) {
          let newChildCopy = child.cloneNode(true);
          dutils.addNewXmlIdsToDescendants(newChildCopy, dicOld2NewIDs);
          firstChildCopies.appendChild(newChildCopy);
          // Add the copy and all descendend elements to the array of copies
          addElementAndChildsToArray(newChildCopy, copiedChilds);
        }

        nextChild.appendChild(firstChildCopies);
        break;
      case 'empty':
        nextChild.appendChild(dummyEmpty);
        break;
      default:
        nextChild.appendChild(dummyEmpty);
        console.log('No default option for alternative encodings set!');
    }
  }

  return upmostElement;
} // addMultiLayeredMarkup()

/**
 * Copies the given element and all its childs into the array
 * @param {Node} element the element to add
 * @param {Array} copiedChilds the array to which to add
 */
function addElementAndChildsToArray(element, copiedChilds) {
  copiedChilds.push(element);
  if (element.children.length > 0) {
    for (let child of element.children) {
      addElementAndChildsToArray(child, copiedChilds);
    }
  }
}

/**
 * Wraps a single group of elements with a markup element
 * @param {Viewer} v viewer
 * @param {Array} groupIds xml:ids of elements to wrap
 * @param {string} mElName element name for markup
 * @param {HTMLElement} parentEl parent element of group to wrap
 * @returns {HTMLElement} created markup element
 */
function wrapGroupWithMarkup(v, groupIds, mElName, parentEl) {
  let markupEl = document.createElementNS(dutils.meiNameSpace, mElName);
  let uuid;

  let respId = getCurrentRespID();
  if (respId) {
    markupEl.setAttribute('resp', '#' + respId);
  }

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

  return markupEl;
} // wrapGroupWithMarkup()

/**
 * Get currently selected resp id from settings.
 * Returns null if string is empty
 * @returns {string|null}
 */
function getCurrentRespID() {
  let respId = document.getElementById('respSelect').value;

  if (respId === '') {
    respId = null;
  }

  return respId;
} // getCurrentRespID()

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
} // addCorrespAttr()

/**
 *
 * @param {string} id xml:id of the first element that will be wrapped with markup
 * @param {string} nodeName node name of the element the id should be created for
 * @param {Viewer} v viewer
 * @returns {string} id to use as xml:id
 */
function mintSuppliedId(id, nodeName, v) {
  // follow the Mozarteum schema, keep numbers (for @o-sapov)
  let underscoreId = id.match(/_\d+$/);
  if (underscoreId) {
    return nodeName + underscoreId[0];
  }
  return utils.generateXmlId(nodeName, v.xmlIdStyle);
} // mintSuppliedId()

/**
 * Deletes a markup item from listItems and all related elements from the xml document.
 * Keeps content or content of the first child.
 * @param {Array} selection
 */
export function deleteMarkup(selection) {
  //updateChoiceOptions(markupItem.content, true);
  selection.forEach((id) => {
    // make sure to load the whole unfiltered file if in speed mode has been filtered for variant readings
    // otherwise there are not all children of alternative encoding elements available
    if (v.xmlDocOutdated === true) {
      v.loadXml(cm.getValue(), true);
    }
    var toDelete = v.xmlDoc.querySelector("[*|id='" + id + "']");
    // only run this when something to delete is found, otherwise we don't need to delete anything
    // prevents crashes when we have trouble updating the itemList
    if (toDelete != null) {
      var parent = toDelete.parentElement;
      var descendants = new DocumentFragment();

      if (att.alternativeEncodingElements.includes(toDelete.localName)) {
        let firstChild = toDelete.children[0];
        for (let i = 0; i < firstChild.children.length; i++) {
          let child = firstChild.children[i];
          descendants.appendChild(child.cloneNode(true));
        }
      } else {
        for (let i = 0; i < toDelete.children.length; i++) {
          let child = toDelete.children[i];
          descendants.appendChild(child.cloneNode(true));
        }
      }

      // replace toDelete element with its children...
      replaceInEditor(cm, toDelete, true, Array.from(descendants.children));
      // ... and remove toDelete afterwards
      parent.replaceChild(descendants, toDelete);
    } else {
      console.warn('Failed to delete non-existing markup with xml:id ', id);
    }
  });
  updateChoiceOptions();
} // deleteMarkup()

/**
 * Retrieve parent markup element id of a given id string from xmlDoc,
 * return empty string if not found.
 * @param {Node} xmlDoc
 * @param {string} id string of element
 * @returns {string} id of parent markup element or empty string
 */
export function getParentMarkupElementId(xmlDoc, id) {
  const markupElementList =
    att.modelTranscriptionLike.join(',') + ',' + att.alternativeEncodingElements.join(',') + ',' + 'annot';
  let element = xmlDoc.querySelector('[*|id="' + id + '"]');
  if (element) {
    // find parent element that is a markup element
    let parent = element.closest(markupElementList);
    if (parent) {
      let markupItemId = parent.getAttribute('xml:id');
      // check if there is an alternative encoding element above
      if (parent.closest(att.alternativeEncodingElements.join(','))) {
        markupItemId = parent.closest(att.alternativeEncodingElements.join(',')).getAttribute('xml:id');
      }
      return markupItemId;
    }
  }
  return '';
} // getParentMarkupElementId()

/**
 * Add markup legend of markup elements used in the MEI encoding to the notation SVG.
 * Do nothing if no markup elements are used.
 * The legend is added as a group element with id 'markupLegend'.
 * Each markup element is represented by a rectangle and a text label.
 * The rectangle is colored according to the color of the markup element.
 * The text label is the name of the markup element in angle brackets.
 * The legend is added to the notation SVG at the end.
 *
 * @param {SVGElement} target the SVG element to which the legend should be added
 * @returns {boolean} true if markup legend was added, false if no markup elements were used
 */
export function addMarkupLegendToNotationSVG(target) {
  // remove existing markup legend if it exists
  let markupLegend = target.querySelector('g#markupLegend');
  if (markupLegend) {
    markupLegend.remove();
  }

  // find all markup elements rendered in the notation SVG
  let usedMarkupElements = [];
  att.modelTranscriptionLike.forEach((el) => {
    let element = target.querySelector('.' + el);
    console.log('Checking for markup element: "' + '.' + el + '": ' + element + ' found.');
    if (element !== null && !usedMarkupElements.includes(el)) {
      usedMarkupElements.push(el);
    }
  });

  if (usedMarkupElements.length <= 0) {
    console.log('No markup elements used in notation SVG, no legend needed.');
    return false; // no markup elements used, no legend needed
  }

  // create markup legend only if there are any markup elements used
  markupLegend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  markupLegend.id = 'markupLegend';
  markupLegend.classList.add('markup-legend');
  markupLegend.setAttribute('transform', 'scale(30)');

  // set orientation of legend elements
  let orientation = 'row';
  let offsetX = 0;
  let offsetY = 0;

  let oldWidth = 0; // width of last markup legend element
  let oldHeight = 0; // height of last markup legend element

  usedMarkupElements.forEach((el) => {
    let markupColor = document.getElementById(el + 'Color')?.value || 'black';

    let markupItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    markupItem.classList.add('markup-item');
    markupItem.classList.add(el.toLowerCase());
    if (orientation === 'row' && oldHeight > 0) {
      offsetX += oldWidth + 3; // vertical offset for each item
    } else if (orientation === 'column' && oldWidth > 0) {
      offsetY += oldHeight + 3; // horizontal offset for each item
    }
    markupItem.setAttribute('font-size', '12px');
    markupItem.setAttribute('transform', 'translate(' + offsetX + ',' + offsetY + ')');

    // add rectangle for the legend item
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '36');
    rect.setAttribute('height', '15');
    rect.setAttribute('fill', 'none');
    rect.setAttribute('fill', markupColor);
    rect.setAttribute('stroke', markupColor);
    rect.setAttribute('stroke-width', '1');
    markupItem.appendChild(rect);

    // create text element for the legend item
    let textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.classList.add('markup-label');
    textElement.setAttribute('x', '41');
    textElement.setAttribute('y', '13');
    textElement.textContent = '<' + el + '>';
    markupItem.appendChild(textElement);

    // keep width of the markup item for next item placement
    // TODO: Problem: getBBox() returns 0 for width and height before it is rendered
    oldWidth = 100; // markupItem.getBBox().width;
    oldHeight = 22; // markupItem.getBBox().height;

    markupLegend.appendChild(markupItem);
  });

  target.appendChild(markupLegend);
} // addMarkupLegendToNotationSVG()
