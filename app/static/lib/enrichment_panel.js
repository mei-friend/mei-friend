/**
 * Provides gui elements and functionality for enrichment bar
 */

//import { v, cm, log, translator, setStandoffAnnotationEnabledStatus } from './main.js';
import { v, cm, translator, setStandoffAnnotationEnabledStatus } from './main.js';
//import { convertCoords, generateXmlId, rmHash, setCursorToId } from './utils.js';
import { setCursorToId } from './utils.js';
//import { meiNameSpace, xmlNameSpace, xmlToString } from './dom-utils.js';
import * as annot from './annotation.js';
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
} from '../css/icons.js';
import { loginAndFetch, solid, solidLogout, provider } from './solid.js';

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
  refreshAnnotationsInRendering();
}
// TODO:
// * Add method to read markup elements

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
  if(!isItemInList(listItemObject.id)) {
    listItems.push(listItemObject);
    addedSuccessfully = true;
    if (forceRefreshAnnotations === true) refreshAnnotationsInRendering(true);
  }
  return addedSuccessfully;
}

// deleteItem()
// -> calls deleteAnnotation() & deleteMarkup
// -> deleteAnnotation() should only check if Annot or WebAnnotation should be deleted

export function deleteAnnotation(uuid) {
  const ix = listItems.findIndex((a) => a.id === uuid);
  if (ix >= 0) {
    listItems.splice(ix, 1);
    annot.deleteAnnot(uuid);
    situateAndRefreshAnnotationsList(true);
    refreshAnnotationsInRendering();
  }
}

/**
 * Retrieve a list item by id
 * @param {string} itemId 
 */
export function retrieveListItem(itemId) {}

/**
 *  Finds page numbers in rendering for every list item
 */
function situateListItems() {
  situateAnnotations();
}
// TODO: should call situateAnnotations & situateMarkup when finished
// TODO: after all, situateAnnotations() could be moved to annotation.js if it turns out to be different to situateMarkup()
// TODO: then situateAnnotations should receive an array of annotations as parameter and not access the list itself

/**
 * Adds page locations in rendering to annotation object in annotation list.
 * Call whenever layout reflows to re-situate annotations appropriately.
 */
function situateAnnotations() {
  listItems.forEach(async (a) => {
    // for each element in a.selection, ask Verovio for the page number
    // set a.firstPage and a.lastPage to min/max page numbers returned
    a.firstPage = 'unsituated';
    a.lastPage = -1;
    if ('selection' in a) {
      let selectionStart =
        a.selection[0].indexOf('#') < 0 ? a.selection[0] : a.selection[0].substr(a.selection[0].indexOf('#') + 1);
      let selLen = a.selection.length - 1;
      let selectionEnd =
        a.selection[selLen].indexOf('#') < 0
          ? a.selection[selLen]
          : a.selection[selLen].substr(a.selection[selLen].indexOf('#') + 1);
      a.firstPage = await v.getPageWithElement(selectionStart);
      a.lastPage = await v.getPageWithElement(selectionEnd);
      if (a.firstPage < 0 && v.speedMode) {
        if (v.xmlDoc.querySelector('[*|id=' + a.selection[0] + ']')?.closest('meiHead')) a.firstPage = 'meiHead';
        else console.warn('Cannot locate annotation ', a);
      } else {
        // if not speed mode, asynchronous return of page numbers after we are finished here
        const annotationLocationLabelElement = document.querySelector(
          `.annotationLocationLabel[data-id=loc-${CSS.escape(a.id)}`
        );
        if (annotationLocationLabelElement) {
          annotationLocationLabelElement.innerHTML = generateAnnotationLocationLabel(a).innerHTML;
        }
      }
    }
    // for any identifying annotations, see if there are new extracts associated with the musical material
    if (a.type == 'annotateIdentify') {
      // find it in the list
      const musMatDiv = document.querySelector('#musMat_' + CSS.escape(a.id));
      console.log('extracts DIV: ', musMatDiv);
      if (musMatDiv && !musMatDiv.innerHTML.length) {
        musMatDiv
          .closest('.annotationListItem')
          .querySelector('.makeStandoffAnnotation svg')
          .classList.add('clockwise');
        fetchMAOComponentsForIdentifiedObject(a.id);
      }
    }
  });
} // situateAnnotations()

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
    listItems.forEach((a) => {
      if ('type' in a) {
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
        console.warn('Skipping annotation without type: ', a);
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

// export function refreshAnnotationsList()
// to enrichment_panel.js
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
    const annoDiv = document.createElement('div');
    annoDiv.classList.add('annotationListItem');
    annoDiv.id = a.id;
    const details = document.createElement('details');
    details.setAttribute('open', '');
    const summary = document.createElement('summary');
    const annoListItemButtons = document.createElement('div');
    annoListItemButtons.classList.add('annotationListItemButtons');
    const flipToAnno = document.createElement('a');
    flipToAnno.insertAdjacentHTML('afterbegin', symLinkFile); //flipToEncoding;
    flipToAnno.classList.add('flipPageToAnnotationText');
    flipToAnno.title = translator.lang.flipPageToAnnotationText.description;
    flipToAnno.classList.add('icon');
    if (!'selection' in a) flipToAnno.classList.add('disabled');
    const addObservation = document.createElement('a');
    addObservation.insertAdjacentHTML('afterbegin', speechBubble);
    addObservation.classList.add('addObservation');
    addObservation.title = 'Add observation to extract';
    addObservation.classList.add('icon');
    if (a.type !== !'annotateIdentify') {
      addObservation.classList.add('disabled');
    }
    const deleteAnno = document.createElement('a');
    deleteAnno.classList.add('deleteAnnotation');
    deleteAnno.insertAdjacentHTML('afterbegin', diffRemoved);
    deleteAnno.title = translator.lang.deleteAnnotation.description;
    const isStandoff = document.createElement('a');
    isStandoff.classList.add('makeStandOffAnnotation');
    isStandoff.insertAdjacentHTML('afterbegin', rdf);
    isStandoff.title = translator.lang.makeStandOffAnnotation.description;
    isStandoff.classList.add('icon');
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
    const isInline = document.createElement('a');
    isInline.id = 'makeInlineAnnotation';
    isInline.insertAdjacentHTML('afterbegin', fileCode);
    isInline.classList.add('icon');
    isInline.style.fontFamily = 'monospace';
    if (!a.isInline) {
      isInline.title = translator.lang.makeInlineAnnotation.description;
      isInline.style.opacity = 0.3;
    } else {
      isInline.title = translator.lang.makeInlineAnnotation.descriptionCopy + ': [' + a.id + ']';
      isInline.dataset.id = a.id;
      isInline.addEventListener('click', copyIdToClipboard);
    }
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
    const annotationLocationLabel = generateAnnotationLocationLabel(a);
    summary.appendChild(annotationLocationLabel);
    flipToAnno.addEventListener('click', (e) => {
      console.debug('Flipping to annotation: ', a);
      v.updatePage(cm, a.firstPage, a.id);
      setCursorToId(cm, a.id);
    });
    deleteAnno.addEventListener('click', (e) => {
      const reallyDelete = confirm(translator.lang.deleteAnnotationConfirmation.text);
      if (reallyDelete) {
        deleteAnnotation(a.id);
      }
    });
    if (!details.innerHTML.length) {
      // some annotation types don't have any annotation body to display
      summary.classList.add('noDetails');
    }
    details.prepend(summary);
    annoDiv.appendChild(details);
    annoListItemButtons.appendChild(flipToAnno);
    annoListItemButtons.appendChild(isInline);
    annoListItemButtons.appendChild(isStandoff);
    annoListItemButtons.appendChild(deleteAnno);
    annoDiv.appendChild(annoListItemButtons);
    list.appendChild(annoDiv);
  });
}

//#endregion

//#region List Items
/**
 * build list items
 */
// generateListItem()
// generateListItemDetails()
// export function generateAnnotationLocationLabel(a)
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

// generateListItemButtons()

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
