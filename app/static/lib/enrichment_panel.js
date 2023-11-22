/**
 * Provides gui elements and functionality for enrichment bar
 */

//import { v, cm, log, translator, setStandoffAnnotationEnabledStatus } from './main.js';
import { v, cm, translator, setStandoffAnnotationEnabledStatus } from './main.js';
//import { convertCoords, generateXmlId, rmHash, setCursorToId } from './utils.js';
import { setCursorToId } from './utils.js';
//import { meiNameSpace, xmlNameSpace, xmlToString } from './dom-utils.js';
import * as annot from './annotation.js';
import * as markup from './markup.js';
import {
  circle,
  diffRemoved,
  highlight,
  fileCode,
  identify,
  link,
  pencil,
  rdf,
  speechBubble,
  symLinkFile,
  codeScan,
} from '../css/icons.js';
import { loginAndFetch, solid, solidLogout, provider } from './solid.js';
import { nsp } from './linked-data.js';

//#region List Items Array and access functions

var listItems = [];

/**
 * Clear list of annotations
 */
export function clearListItems() {
  listItems = [];
}

/**
 * read List Items from XML
 */
export function readListItemsFromXML(flagLimit = false) {
  annot.readAnnots(flagLimit);
  markup.readMarkup();
  refreshAnnotationsInRendering();
}

/**
 * Looks if an item with itemId exists in listItems
 * @param {string} itemId
 * @returns {boolean} item is in listItems
 */
export function isItemInList(itemId) {
  let index = listItems.findIndex((item) => item.id === itemId);
  return index >= 0;
}

/**
 * Adds a new item to ListItems if there is no item with this id
 * @param {Object} listItemObject Annotation / Markup object to add
 * @param {boolean} [forceRefreshAnnotations=false] should annotations be refreshed after adding?
 * @returns {boolean} added successfully
 */
export function addListItem(listItemObject, forceRefreshAnnotations = false) {
  let addedSuccessfully = false;
  if (!isItemInList(listItemObject.id)) {
    listItems.push(listItemObject);
    addedSuccessfully = true;
    if (forceRefreshAnnotations === true) refreshAnnotationsInRendering(true);
  }
  return addedSuccessfully;
}

/**
 * Deletes an annotation or markup from listItems and the xml document
 * @param {string} uuid id of list item to delete
 */
export function deleteListItem(uuid) {
  const ix = listItems.findIndex((a) => a.id === uuid);
  if (ix >= 0) {
    let a = retrieveListItem(uuid);
    if (a.isMarkup === true) {
      markup.deleteMarkup(a);
    } else {
      annot.deleteAnnot(uuid);
    }
    listItems.splice(ix, 1);
    situateAndRefreshAnnotationsList(true);
    refreshAnnotationsInRendering();
  }
}

/**
 * Retrieve a list item by id
 * @param {string} itemId
 */
export function retrieveListItem(itemId) {
  const ix = listItems.find((a) => a.id === itemId);
  return ix;
}

/**
 * Retrieves items containing a given property from itemList
 * @param {string} property
 * @returns {Array} filtered list items
 */
export function retrieveItemsByProperty(property) {
  let filteredList = listItems.filter((item) => property in item === true);

  return filteredList;
}

/**
 * Retrieves the values of a given property from a filtered set on
 * @param {string} filterProperty property to filter
 * @param {string} selectedProperty property to retrieve values
 * @returns {Array} array of values
 */
export function retrieveItemValuesByProperty(filterProperty = null, selectedProperty) {
  let filteredList = [];
  if (filterProperty !== null) {
    filteredList = retrieveItemsByProperty(filterProperty);
  } else {
    filteredList = listItems;
  }

  let arrayOfValues = [];

  filteredList.forEach((item) => {
    if (selectedProperty in item === true) {
      arrayOfValues.push(item[selectedProperty]);
    }
  });

  return arrayOfValues;
}

/**
 *  Finds page numbers in rendering for every list item
 */
function situateListItems() {
  listItems.forEach(async (item) => {
    let itemPromise;
    if (item.isMarkup === true) {
      itemPromise = markup.situateMarkup(item);
    } else {
      itemPromise = annot.situateAnnotations(item);
    }

    itemPromise.then((item) => {
      console.log('Situated ', item);
      const itemLocationLabel = document.querySelector(`.annotationLocationLabel[data-id=loc-${CSS.escape(item.id)}`);
      if (itemLocationLabel) {
        itemLocationLabel.innerHTML = generateAnnotationLocationLabel(item).innerHTML;
      }
    });
  });
}
// TODO: Fix MAO-related stuff!!!

//#endregion

/**
 * User Interface functions
 */

//#region Verovio Notation Panel

/**
 * Draws annotations in Verovio notation panel.
 * For annotations, the selected elements needs to by highlighted manually by adding a css class.
 * In the case of markup, this is not necessary because Verovio already adds classes for markup elements to the wrapped elements.
 * @param {boolean} [forceListRefresh=false]
 */
export function refreshAnnotationsInRendering(forceListRefresh = false) {
  // clear rendered annotations container
  const rac = document.getElementById('renderedAnnotationsContainer');
  rac.innerHTML = '';
  // reset annotations-containing svg
  const scoreSvg = document.querySelector('#verovio-panel svg');
  if (!scoreSvg) return;
  const annoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  annoSvg.setAttribute('width', scoreSvg.getAttribute('width'));
  annoSvg.setAttribute('height', scoreSvg.getAttribute('height'));
  annoSvg.setAttribute('id', 'renderedAnnotationsSvg');
  annoSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  annoSvg.setAttribute('xmlnsXlink', 'http://www.w3.org/1999/xlink');
  rac.appendChild(annoSvg);
  if (document.getElementById('showAnnotations')?.checked) {
    // drawing handlers can draw into renderedAnnotationsSvg if they need to
    // markup does not need to be drawn explicitly because this is already handled by Verovio
    listItems.forEach((a) => {
      if ('type' in a && !('isMarkup' in a)) {
        switch (a.type) {
          case 'annotateIdentify':
            annot.drawIdentify(a);
            break;
          case 'annotateHighlight':
            annot.drawHighlight(a);
            break;
          case 'annotateCircle':
            annot.drawCircle(a);
            break;
          case 'annotateLink':
            annot.drawLink(a);
            break;
          case 'annotateDescribe':
            annot.drawDescribe(a);
            break;
          default:
            console.warn("Don't have a drawing function for this type of annotation", a);
        }
      } else {
        if (!('isMarkup' in a)) console.warn('Skipping annotation without type: ', a);
      }
    });
  }
  if (document.getElementById('showAnnotationPanel')?.checked) situateAndRefreshAnnotationsList(forceListRefresh);
}

//#endregion

//#region List of all things
/**
 * builds list of bubbles
 */

/**
 * Forces the situation of annotations and refreshes
 * the list of annotations
 * @param {boolean} forceRefresh true when list should be refreshed
 */
export function situateAndRefreshAnnotationsList(forceRefresh = false) {
  situateListItems();
  if (forceRefresh || !document.getElementsByClassName('annotationListItem').length) refreshAnnotationsList();
}

/**
 * Creates the list of all things in the enrichment panel
 */
export function refreshAnnotationsList() {
  const list = document.getElementById('listAnnotations');
  // clear list
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  // console.log("Annotations: ",annotations);

  // add web annotation button
  addLoadWebAnnotatationButton(list);
  listItems.forEach((a) => {
    let annoDiv = generateListItem(a);
    list.appendChild(annoDiv);
  });
}

//#endregion

//#region List Items
/**
 * builds the list item bubble
 * @param {Object} a annotation / list item object
 * @returns bubble div
 */
function generateListItem(a) {
  const annoDiv = document.createElement('div');
  annoDiv.classList.add('annotationListItem');
  annoDiv.id = a.id;
  const details = document.createElement('details');
  details.setAttribute('open', '');
  const summary = document.createElement('summary');
  if (a.isMarkup === true) {
    summary.insertAdjacentHTML('afterbegin', codeScan);
    details.insertAdjacentHTML('afterbegin', '&lt;' + a.type + '&gt;');
  } else {
    switch (a.type) {
      case 'annotateHighlight':
        summary.insertAdjacentHTML('afterbegin', highlight);
        break;
      case 'annotateCircle':
        summary.insertAdjacentHTML('afterbegin', circle);
        break;
      case 'annotateLink':
        summary.insertAdjacentHTML('afterbegin', link);
        details.insertAdjacentHTML('afterbegin', a.url);
        break;
      case 'annotateDescribe':
        summary.insertAdjacentHTML('afterbegin', pencil);
        details.insertAdjacentHTML('afterbegin', a.description);
        break;
      case 'annotateIdentify':
        summary.insertAdjacentHTML('afterbegin', identify);
        details.insertAdjacentHTML('afterbegin', `<div class="mao-musMat" id="musMat_${a.id}"></div>`);
        break;
      default:
        console.warn('Unknown type when drawing annotation in list: ', a);
    }
  }
  const annotationLocationLabel = generateAnnotationLocationLabel(a);
  summary.appendChild(annotationLocationLabel);

  if (!details.innerHTML.length) {
    // some annotation types don't have any annotation body to display
    summary.classList.add('noDetails');
  }
  details.prepend(summary);
  annoDiv.appendChild(details);
  let annoListItemButtons = generateAnnotationButtons(a);
  annoDiv.appendChild(annoListItemButtons);
  return annoDiv;
}

/**
 * Creates the buttons for a list item bubble
 * @param {Object} a list item object
 * @returns {HTMLElement} div with buttons
 */
function generateAnnotationButtons(a) {
  const annoListItemButtons = document.createElement('div');
  annoListItemButtons.classList.add('annotationListItemButtons');

  // flip to annotation button
  const flipToAnno = generateListItemButton(
    'flipPageToAnnotationText',
    symLinkFile,
    translator.lang.flipPageToAnnotationText.description
  );
  if (!'selection' in a) flipToAnno.classList.add('disabled');
  flipToAnno.addEventListener('click', (e) => {
    console.debug('Flipping to annotation: ', a);
    v.updatePage(cm, a.firstPage, a.id);
    setCursorToId(cm, a.id);
  });

  // add Observation button
  const addObservation = generateListItemButton('addObservaion', speechBubble, 'Add observation to extract');
  if (a.type !== !'annotateIdentify') {
    addObservation.classList.add('disabled');
  }

  // delete annotation button
  const deleteAnno = generateListItemButton(
    'deleteAnnotation',
    diffRemoved,
    translator.lang.deleteAnnotation.description
  );
  deleteAnno.addEventListener('click', (e) => {
    const reallyDelete = confirm(translator.lang.deleteAnnotationConfirmation.text);
    if (reallyDelete) {
      deleteListItem(a.id);
    }
  });

  // make inline annotation to standoff annotation
  const isStandoff = generateListItemButton(
    'makeStandOffAnnotation',
    rdf,
    translator.lang.makeStandOffAnnotation.description
  );
  isStandoff.style.filter = 'grayscale(100%)';
  if (!a.isStandoff) {
    isStandoff.title = translator.lang.makeStandOffAnnotation.descriptionSolid;
    isStandoff.style.opacity = 0.3;
  } else {
    (isStandoff.title = translator.lang.makeStandOffAnnotation.descriptionToLocal + ': '), a.id;
    isStandoff.dataset.id = a.id;
    if ('standoffUri' in a) {
      isStandoff.href = a.standoffUri;
      isStandoff.target = '_blank';
    } else {
      console.warn('Standoff annotation without standoffUri: ', a);
    }
  }

  // make standoff annotation to inline annotation
  const isInline = generateListItemButton('makeInlineAnnotation', fileCode);
  //isInline.style.fontFamily = 'monospace';
  if (!a.isInline) {
    isInline.title = translator.lang.makeInlineAnnotation.description;
    isInline.style.opacity = 0.3;
  } else {
    isInline.title = translator.lang.makeInlineAnnotation.descriptionCopy + ': [' + a.id + ']';
    isInline.dataset.id = a.id;
    isInline.addEventListener('click', annot.copyIdToClipboard);
  }

  // add buttons to bubble
  annoListItemButtons.appendChild(flipToAnno);
  annoListItemButtons.appendChild(isInline);
  annoListItemButtons.appendChild(isStandoff);
  annoListItemButtons.appendChild(deleteAnno);

  return annoListItemButtons;
}

/**
 * Generates a basic button for the list item bubbles button list
 * @param {string} buttonClass CSS class name
 * @param {string} buttonIcon svg icon
 * @param {string} buttonTitle translator title text
 * @returns
 */
function generateListItemButton(buttonClass, buttonIcon, buttonTitle = '') {
  const button = document.createElement('a');
  button.classList.add(buttonClass);
  button.insertAdjacentHTML('afterbegin', buttonIcon);
  button.title = buttonTitle;
  button.classList.add('icon');

  return button;
}

/**
 * Generates the label containing the page locations
 * @param {Object} a annotation / list item object
 * @returns {HTMLElement} span element
 */
export function generateAnnotationLocationLabel(a) {
  console.log('generating anno label for ', a);
  const annotationLocationLabel = document.createElement('span');
  if (a.type === 'annotateIdentify') {
    // special case: identified MAO objects
    // just add a placeholder for a label and exit
    // (since multiple selections may be situated at different locations, we deal with them elsewhere)
    annotationLocationLabel.innerHTML = '<span class="label"></span>';
  } else {
    if (a.firstPage === 'meiHead') {
      annotationLocationLabel.innerHTML = `MEI&nbsp;head&nbsp;(${a.selection.length}&nbsp;${translator.lang.elementsPlural.text})`;
    } else if (a.firstPage === 'unsituated' || a.firstPage < 0) {
      annotationLocationLabel.innerHTML = 'Unsituated';
    } else {
      annotationLocationLabel.innerHTML =
        translator.lang.pageAbbreviation.text +
        '&nbsp;' +
        (a.firstPage === a.lastPage ? a.firstPage : a.firstPage + '&ndash;' + a.lastPage) +
        ` (${a.selection.length}&nbsp;${translator.lang.elementsPlural.text})`;
    }
  }
  annotationLocationLabel.classList.add('annotationLocationLabel');
  annotationLocationLabel.dataset.id = 'loc-' + a.id;
  return annotationLocationLabel;
}

//#endregion

//#region Tools tab
/**
 * Tools tab
 */

/**
 * Adds annotation handlers to buttons at the tools tab of the enrichment panel.
 * Functions to call for annotations can be found in annotation.js.
 */
export function addAnnotationHandlers() {
  // TODO extend this to allow app to consume (TROMPA-style) Annotation Toolkit descriptions

  const annotationHandler = (e) => {
    console.log('annotation Handler: Clicked to make new annotation!', e);
    console.log('annotation Handler: Selected elements: ', v.selectedElements);
    switch (e.target.closest('.annotationToolsIcon')?.getAttribute('id')) {
      case 'annotateIdentify':
        annot.createIdentify(e);
        break;
      case 'annotateHighlight':
        annot.createHighlight(e);
        break;
      case 'annotateCircle':
        annot.createCircle(e);
        break;
      case 'annotateLink':
        annot.createLink(e);
        break;
      case 'annotateDescribe':
        annot.createDescribe(e);
        break;
      default:
        console.warn("Don't have a handler for this type of annotation", e);
    }
    refreshAnnotationsInRendering(true);
  };

  document.querySelectorAll('.annotationToolsIcon').forEach((a) => a.removeEventListener('click', annotationHandler));
  document.querySelectorAll('.annotationToolsIcon').forEach((a) => a.addEventListener('click', annotationHandler));

  // disable 'identify music object' unless 'linked data' domain selected
  document
    .querySelectorAll('.annotationToolsDomainSelectionItem input')
    .forEach((i) => i.removeEventListener('click', enableDisableIdentifyObject));
  document
    .querySelectorAll('.annotationToolsDomainSelectionItem input')
    .forEach((i) => i.addEventListener('click', enableDisableIdentifyObject));
  enableDisableIdentifyObject(); // set initial status
  document.getElementById('annotationToolsButton').removeEventListener('click', enableDisableIdentifyObject);
  document.getElementById('annotationToolsButton').addEventListener('click', enableDisableIdentifyObject);
}

export function addMarkupHandlers() {
  const markupHandler = {
    addSupplied: () => markup.addMarkup(null, 'supplied'),
    addSuppliedAccid: () => markup.addMarkup('accid', 'supplied'),
    addSuppliedArtic: () => markup.addMarkup('artic', 'supplied'),
    addUnclear: () => markup.addMarkup(null, 'unclear'),
    addUnclearAccid: () => markup.addMarkup('accid', 'unclear'),
    addUnclearArtic: () => markup.addMarkup('artic', 'unclear'),
    addSic: () => markup.addMarkup(null, 'sic'),
    addSicAccid: () => markup.addMarkup('accid', 'sic'),
    addSicArtic: () => markup.addMarkup('artic', 'sic'),
    addCorr: () => markup.addMarkup(null, 'corr'),
    addCorrAccid: () => markup.addMarkup('accid', 'corr'),
    addCorrArtic: () => markup.addMarkup('artic', 'corr'),
    addOrig: () => markup.addMarkup(null, 'orig'),
    addOrigAccid: () => markup.addMarkup('accid', 'orig'),
    addOrigArtic: () => markup.addMarkup('artic', 'orig'),
    addReg: () => markup.addMarkup(null, 'reg'),
    addRegAccid: () => markup.addMarkup('accid', 'reg'),
    addRegArtic: () => markup.addMarkup('artic', 'reg'),
    addAdd: () => markup.addMarkup(null, 'add'),
    addAddAccid: () => markup.addMarkup('accid', 'add'),
    addAddArtic: () => markup.addMarkup('artic', 'add'),
    addDel: () => markup.addMarkup(null, 'del'),
    addDelAccid: () => markup.addMarkup('accid', 'del'),
    addDelArtic: () => markup.addMarkup('artic', 'del'),
  };

  const toggleContentSelector = (event) => {
    let currentElement = event.currentTarget;
    let targetID = currentElement.dataset.target;
    let targetDisplay = document.getElementById(targetID);
    
    targetDisplay.innerHTML = currentElement.innerHTML;
    targetDisplay.setAttribute('data-content',currentElement.dataset.contentChoice);
  };

  document.getElementById('addSupplied').addEventListener('click', markupHandler.addSupplied);
  document.getElementById('addSuppliedArtic').addEventListener('click', markupHandler.addSuppliedArtic);
  document.getElementById('addSuppliedAccid').addEventListener('click', markupHandler.addSuppliedAccid);
  document.getElementById('addUnclear').addEventListener('click', markupHandler.addUnclear);
  document.getElementById('addUnclearArtic').addEventListener('click', markupHandler.addUnclearArtic);
  document.getElementById('addUnclearAccid').addEventListener('click', markupHandler.addUnclearAccid);
  document.getElementById('addSic').addEventListener('click', markupHandler.addSic);
  document.getElementById('addSicArtic').addEventListener('click', markupHandler.addSicArtic);
  document.getElementById('addSicAccid').addEventListener('click', markupHandler.addSicAccid);
  document.getElementById('addCorr').addEventListener('click', markupHandler.addCorr);
  document.getElementById('addCorrArtic').addEventListener('click', markupHandler.addCorrArtic);
  document.getElementById('addCorrAccid').addEventListener('click', markupHandler.addCorrAccid);
  document.getElementById('addOrig').addEventListener('click', markupHandler.addOrig);
  document.getElementById('addOrigArtic').addEventListener('click', markupHandler.addOrigArtic);
  document.getElementById('addOrigAccid').addEventListener('click', markupHandler.addOrigAccid);
  document.getElementById('addReg').addEventListener('click', markupHandler.addReg);
  document.getElementById('addRegArtic').addEventListener('click', markupHandler.addRegArtic);
  document.getElementById('addRegAccid').addEventListener('click', markupHandler.addRegAccid);
  document.getElementById('addAdd').addEventListener('click', markupHandler.addAdd);
  document.getElementById('addAddArtic').addEventListener('click', markupHandler.addAddArtic);
  document.getElementById('addAddAccid').addEventListener('click', markupHandler.addAddAccid);
  document.getElementById('addDel').addEventListener('click', markupHandler.addDel);
  document.getElementById('addDelArtic').addEventListener('click', markupHandler.addDelArtic);
  document.getElementById('addDelAccid').addEventListener('click', markupHandler.addDelAccid);

  let contentOptions = document.getElementsByClassName('content-option');
  for (let i = 0; i < contentOptions.length; i++) {
    contentOptions[i].addEventListener('click', (event) => {toggleContentSelector(event)});
  }
}

/**
 * enables/disables the 'Identify' button based on selected mode of annotation.
 * Reads writeAnnotationInline checkbox.
 */
function enableDisableIdentifyObject() {
  let identifyTool = document.getElementById('annotateIdentify');
  if (document.getElementById('writeAnnotationInline').checked) {
    identifyTool.classList.add('disabled');
  } else {
    identifyTool.classList.remove('disabled');
  }
}

//#endregion

//#region Settings Tab
/**
 * Settings tab
 */
//#endregion

//#region Solid Stuff

/**
 * Solid Stuff:
 * Functions for David to put elsewhere :-)
 */

/**
 * getSolidIdP(): Determine user's prefered Solid identity provider (IdP),
 * either a provided custom value if "Other" is chosen or otherwise the
 * IdP currently selected from the dropdown menu.
 */
export function getSolidIdP() {
  const providerSelect = document.getElementById('providerSelect');
  if (providerSelect) {
    if (providerSelect.value === 'other') {
      return document.getElementById('customSolidIdP').value;
    } else {
      return providerSelect.value;
    }
  }
} // getSolidIdP()

export async function populateSolidTab() {
  const solidTab = document.getElementById('solidTab');
  if (solid.getDefaultSession().info.isLoggedIn) {
    solidTab.innerHTML = await populateLoggedInSolidTab();
    document.getElementById('solidLogout').addEventListener('click', () => {
      solidLogout(populateSolidTab);
      v.showAlert(translator.lang.solidLoggedOutWarning.html, 'warning', 30000);
      document.getElementById('solidIdPLogoutLink').href = provider + '/logout';
    });
  } else {
    solidTab.innerHTML = populateLoggedOutSolidTab();
    // add event listeners
    const provider = document.getElementById('providerSelect');
    provider.addEventListener('input', (e) => {
      let customSolidIdP = document.getElementById('customSolidIdP');
      switch (e.target.value) {
        case 'other':
          customSolidIdP.value = '';
          break;
        default:
          customSolidIdP.value = e.target.value;
      }
    });
    const customSolidIdP = document.getElementById('customSolidIdP');
    customSolidIdP.addEventListener('input', (e) => {
      let providerSelect = document.getElementById('providerSelect');
      providerSelect.value = 'other';
    });
    customSolidIdP.addEventListener('click', (e) => {
      if (e.target.value === '') {
        e.target.value = 'https://';
      }
    });
    document.getElementById('solidLogin').addEventListener('click', () => {
      loginAndFetch(getSolidIdP(), populateSolidTab);
    });
  }
  setStandoffAnnotationEnabledStatus();
}

async function populateLoggedInSolidTab() {
  const webId = solid.getDefaultSession().info.webId;
  const solidButton = document.getElementById('solidButton');
  solidButton.classList.add('clockwise');
  const profile = await solid
    .fetch(webId, {
      headers: {
        Accept: 'application/ld+json',
      },
    })
    .then((resp) => resp.json())
    .then((json) => jsonld.expand(json))
    .finally(() => solidButton.classList.remove('clockwise'));
  let name = webId;
  // try to find entry for 'me' (i.e. the user's webId) in profile:
  let me = Array.from(profile).filter((e) => '@id' in e && e['@id'] === webId);
  if (me.length) {
    if (me.length > 1) {
      console.warn("User's solid profile has multiple entries for their webId!");
    }
    if (`${nsp.FOAF}name` in me[0]) {
      let foafName = me[0][`${nsp.FOAF}name`][0]; // TODO decide what to do in case of multiple foaf:names
      if (typeof foafName === 'string') {
        name = foafName;
      } else if (typeof foafName === 'object' && '@value' in foafName) {
        name = foafName['@value'];
      }
    }
  }

  return `
  <div><span id='solidWelcomeMsg'>${translator.lang.solidWelcomeMsg.text}<span><span id='solidWelcomeName' title='${webId}'>${name}</span>!</div>
  <div><button type="button" id="solidLogout">${translator.lang.solidLogout.text}</button></div>`;
}

function populateLoggedOutSolidTab() {
  let providerContainer = document.createElement('div');
  let provider = document.createElement('select');
  provider.setAttribute('name', 'provider');
  provider.setAttribute('id', 'providerSelect');
  provider.innerHTML = `
    <option value="https://solidcommunity.net">SolidCommunity.net</option>
    <option value="https://login.inrupt.net">Inrupt</option>
    <option value="https://trompa-solid.upf.edu">TROMPA @ UPF</option>
    <option value="other" selected>Other...</option>
  `;
  provider.title = translator.lang.solidProvider.description;
  let customSolidIdP = document.createElement('input');
  customSolidIdP.type = 'text';
  customSolidIdP.placeholder = 'https://...';
  customSolidIdP.id = 'customSolidIdP';
  customSolidIdP.setAttribute('size', '17');
  let solidLoginBtn = document.createElement('button');
  solidLoginBtn.innerHTML = translator.lang.solidLoginBtn.text;
  solidLoginBtn.id = 'solidLogin';
  solidLoginBtn.title = translator.lang.solidExplanation.description;
  // inject into DOM
  providerContainer.insertAdjacentElement('afterbegin', provider);
  providerContainer.insertAdjacentElement('afterbegin', solidLoginBtn);
  providerContainer.insertAdjacentElement('afterbegin', customSolidIdP);
  return providerContainer.outerHTML;
}

//#endregion

//#region UI elements

/**
 * Adds button to load web annotations into the list
 * @param {HTMLElement} list list div element
 */
function addLoadWebAnnotatationButton(list) {
  // add web annotation button
  const addWebAnnotation = document.createElement('span');
  const rdfIcon = document.createElement('span');
  addWebAnnotation.textContent = translator.lang.addWebAnnotation.text;
  rdfIcon.id = 'addWebAnnotationIcon';
  rdfIcon.insertAdjacentHTML('beforeend', rdf);
  addWebAnnotation.appendChild(rdfIcon);
  addWebAnnotation.id = 'addWebAnnotation';
  addWebAnnotation.addEventListener('click', () => annot.loadWebAnnotation());
  list.appendChild(addWebAnnotation);
  list.insertAdjacentHTML(
    'beforeend',
    listItems.length ? '' : '<p>' + translator.lang.noAnnotationsToDisplay.text + '.</p>'
  );
}

// generateListItemButton()

//#endregion
