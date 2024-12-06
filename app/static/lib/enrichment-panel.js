/**
 * Provides gui elements and functionality for enrichment bar
 */

import * as att from './attribute-classes.js';
import * as annot from './annotation.js';
import { nsp } from './linked-data.js';
import { v, cm, translator, setStandoffAnnotationEnabledStatus } from './main.js';
import * as markup from './markup.js';
import { loginAndFetch, solid, solidLogout, provider } from './solid.js';
import { setCursorToId, sortElementsByScorePosition } from './utils.js';
import {
  circle,
  codeScan,
  diffRemoved,
  fileCode,
  highlight,
  identify,
  link,
  pencil,
  rdf,
  speechBubble,
  symLinkFile,
} from '../css/icons.js';

//#region List Items Array and access functions

/**
 * List of all annotations and markups
 */
var listItems = [];

/**
 * Clear list of annotations
 */
export function clearListItems() {
  listItems = [];
} // clearListItems()

/**
 * Reads markup and annotations from XML encoding (MEI) into listItems array.
 * @param {boolean} [flagLimit=false] limit reading to a certain number of items
 */
export function readListItemsFromXML(flagLimit = false) {
  clearListItems();
  annot.readAnnots(flagLimit);
  markup.readMarkup();
  situateAndRefreshAnnotationsList();
  refreshAnnotationsInNotation(true);
} // readListItemsFromXML()

/**
 * Looks if an item with itemId exists in listItems
 * @param {string} itemId
 * @returns {boolean} item is in listItems
 */
export function isItemInList(itemId) {
  let index = listItems.findIndex((item) => item.id === itemId);
  return index >= 0;
} // isItemInList()

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
    if (forceRefreshAnnotations === true) refreshAnnotationsInNotation(true);
  }
  return addedSuccessfully;
} // addListItem()

/**
 * Deletes an annotation or markup from listItems and the xml document.
 * If markup should be deleted, items with identical selection are deleted.
 * @param {string} uuid id of list item to delete
 */
export function deleteListItem(uuid) {
  const ix = listItems.findIndex((a) => a.id === uuid);
  if (ix >= 0) {
    let a = retrieveListItem(uuid);
    if (a.isMarkup === true) {
      let sel = a.selection;
      markup.deleteMarkup(sel);
      // remove markup from list and
      // delete annotations if selection is identical with selection of current markup
      // for now, we delete items by selection
      // (change if this causes trouble, theoretically it shoudln't because selection
      // is only identical if an annotation created via a markup item)
      let filteredItems = listItems.filter((item) => item.selection !== sel);
      listItems = filteredItems;
    } else {
      annot.deleteAnnot(uuid);
      // remove only the annotation from the list that should be deleted
      listItems.splice(ix, 1);
    }
    situateAndRefreshAnnotationsList(true);
    refreshAnnotationsInNotation();
  }
} // deleteListItem()

/**
 * Retrieve a list item by id
 * @param {string} itemId
 */
export function retrieveListItem(itemId) {
  const ix = listItems.find((a) => a.id === itemId);
  return ix;
} // retrieveListItem()

/**
 * Retrieves items containing a given property from itemList
 * @param {string} property
 * @returns {Array} filtered list items
 */
export function retrieveItemsByProperty(property) {
  let filteredList = listItems.filter((item) => property in item === true);

  return filteredList;
} // retrieveItemsByProperty()

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
} // retrieveItemValuesByProperty()

/**
 *  Finds page numbers in rendering for every list item and sorts the list items.
 *  Sorts
 *    1. by page,
 *    2. by horizontal position on page,
 *    3. markup and then annotations (if selection is identical).
 *  @returns {Array} Sorted list items.
 */
async function situateListItems() {
  const asyncResults = await Promise.all(listItems.length > 0 ? listItems.map((item) => situateOneListItem(item)) : []);
  // when deleting the last item from the list, sometimes, asyncResults finds the item again after it should have been deleted
  // to make sure to abort, when itemList is empty, because nothings needs to be sorted
  if (listItems.length === 0) {
    return [];
  } else {
    const sortedResults = asyncResults.sort((a, b) => {
      let byPage = a.firstPage - b.firstPage;
      if (byPage === 0 && a.selection && b.selection) {
        let byPosition = 0;
        let aQuery = a.selection[0];
        let bQuery = b.selection[0];

        let sortedCompare = sortElementsByScorePosition([aQuery, bQuery]);
        let aPos = sortedCompare.findIndex((el) => el === aQuery);

        if (aQuery === bQuery) {
          if (a.isMarkup && b.isMarkup) {
            // shouldn't happen in theory
            byPosition = 0;
          } else if (a.isMarkup) {
            byPosition = -1;
          } else {
            //b.isMarkup
            byPosition = 1;
          }
        } else if (aPos === 0) {
          byPosition = -1;
        } else {
          byPosition = 1;
        }

        return byPosition;
      } else {
        return byPage;
      }
    });
    return sortedResults;
  }
} // situateListItems()

async function situateOneListItem(item) {
  return new Promise((resolve) => {
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
      resolve(item);
    });
  });
} // situateOneListItem()

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
export function refreshAnnotationsInNotation(forceListRefresh = false) {
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
  // if (document.getElementById('showAnnotationPanel')?.checked) {
  //   situateAndRefreshAnnotationsList(forceListRefresh);
  // }
} // refreshAnnotationsInNotation()

//#endregion

//#region List of all things
/**
 * builds list of bubbles
 */

/**
 * Forces the situation of annotations (i.e. finding a page number
 * for each annotation) and refreshes the list of all things.
 * @param {boolean} forceRefresh true when list should be refreshed
 */
export function situateAndRefreshAnnotationsList(forceRefresh = false) {
  situateListItems()
    .then((sortedList) => {
      listItems = sortedList;
      // if (forceRefresh || document.getElementsByClassName('annotationListItem').length) {
      refreshAnnotationsList();
      // }
    })
    .catch((error) => {
      console.error('Situating of list items failed:', error);
    });
} // situateAndRefreshAnnotationsList()

/**
 * Creates the list of all markup/annotation elements in the enrichment panel
 */
export function refreshAnnotationsList() {
  console.debug('RRRRRRRRRRRRefreshing annotations list: ' + listItems.length + ' items');
  const listDiv = document.getElementById('listAnnotations');

  // clear list div
  while (listDiv.firstChild) {
    listDiv.removeChild(listDiv.lastChild);
  }

  // add web annotation button
  addLoadWebAnnotatationButton(listDiv);

  // add list items
  listItems.forEach((a) => {
    let annoDiv = generateListItem(a);
    listDiv.appendChild(annoDiv);
  });
} // refreshAnnotationsList()

/**
 * Scroll to selected element in markup/annotation list panel
 */
function scrollToSelectedElement() {
  const selectedElement = document.querySelector('.selectedAnnotationListItem');
  if (selectedElement) {
    selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
} // scrollToSelectedElement()

//#endregion

//#region List Items
/**
 * builds the list item bubble
 * @param {Object} a annotation / list item object
 * @returns bubble div
 */
function generateListItem(a) {
  const annoFieldset = document.createElement('fieldset');
  annoFieldset.classList.add('annotationListItem');
  if ('selected' in a && a.selected === true) {
    annoFieldset.classList.add('selectedAnnotationListItem');
  }
  annoFieldset.id = a.id;
  const legend = document.createElement('legend');
  const content = document.createElement('div');
  content.classList.add('annotationContent');
  if (a.isMarkup === true) {
    legend.insertAdjacentHTML('afterbegin', codeScan);
    legend.insertAdjacentHTML('beforeend', ' &lt;' + a.type + '&gt;');
    if (a.content) {
      content.insertAdjacentHTML('beforeend', ' (' + a.content + ')');
      annoFieldset.classList.add(a.content.at(0) + 'Label');
    }
    if (a.resp) content.insertAdjacentHTML('beforeend', '<br />[resp: ' + a.resp + ']');
    // add class for markup type
    att.modelTranscriptionLike.forEach((t) => {
      if (a.type === t) {
        annoFieldset.classList.add(t + 'Label');
      }
    });
  } else {
    annoFieldset.classList.add('annotationLabel');
    switch (a.type) {
      case 'annotateHighlight':
        legend.insertAdjacentHTML('afterbegin', highlight);
        legend.insertAdjacentHTML('beforeend', ' &lt;annot&gt; ');
        legend.insertAdjacentHTML(
          'beforeend',
          '<span id="annotationToolsHighlightSpan">' + translator.lang.annotationToolsHighlightSpan.text + '</span>'
        );

        annoFieldset.classList.add('annotationHighlight');
        break;
      case 'annotateCircle':
        legend.insertAdjacentHTML('afterbegin', circle);
        legend.insertAdjacentHTML('beforeend', ' &lt;annot&gt; Circle');
        break;
      case 'annotateLink':
        legend.insertAdjacentHTML('afterbegin', link);
        legend.insertAdjacentHTML('beforeend', ' &lt;annot&gt; ');
        legend.insertAdjacentHTML(
          'beforeend',
          '<span id="annotationToolsLinkSpan">' + translator.lang.annotationToolsLinkSpan.text + '</span>'
        );
        content.insertAdjacentHTML('afterbegin', '<span>' + a.url + '</span>');
        annoFieldset.classList.add('annotationLink');
        break;
      case 'annotateDescribe':
        legend.insertAdjacentHTML('afterbegin', pencil);
        legend.insertAdjacentHTML('beforeend', ' &lt;annot&gt; ');
        legend.insertAdjacentHTML(
          'beforeend',
          '<span id="annotationToolsDescribeSpan">' + translator.lang.annotationToolsDescribeSpan.text + '</span>'
        );
        annoFieldset.classList.add('annotationDescribe');
        content.insertAdjacentHTML('beforeend', '<span>' + a.description + '</span>');
        break;
      case 'annotateIdentify':
        legend.insertAdjacentHTML('afterbegin', identify);
        legend.insertAdjacentHTML(
          'beforeend',
          ' <span id="annotationToolsIdentifySpan">' + translator.lang.annotationToolsLinkSpan.text + '</span>'
        );
        annoFieldset.classList.add('annotationIdentify');
        content.insertAdjacentHTML('afterbegin', `<div class="mao-musMat" id="musMat_${a.id}"></div>`);
        break;
      default:
        console.warn('Unknown type when drawing annotation in list: ', a);
    }
  }
  const annotationLocationLabel = generateAnnotationLocationLabel(a);
  content.prepend(annotationLocationLabel);

  if (!legend.innerHTML.length) {
    // some annotation types don't have any annotation body to display
    content.classList.add('noDetails');
  }
  annoFieldset.prepend(content);
  annoFieldset.appendChild(legend);
  let annoListItemButtons = generateAnnotationButtons(a);
  annoFieldset.appendChild(annoListItemButtons);

  // click handler for list item
  annoFieldset.addEventListener('click', () => {
    selectItemInAnnotationList(a.id);
    setCursorToId(cm, a.id);
  });

  // hover handler for list item
  // annoFieldset.addEventListener('mousein', () => {

  return annoFieldset;
} // generateListItem()

/**
 * Finds for a given element id in xmlDoc
 * 1) an enclosing markup element or
 * 2) an in-line annotation
 * and selects it in the annotation list and refreshes the list.
 * @param {string} uuid element id
 */
export function selectItemInAnnotationList(uuid) {
  let markupId = markup.getParentMarkupElementId(v.xmlDoc, uuid);
  listItems.forEach((item) => {
    if (
      item.id === markupId ||
      ('selection' in item && (item.selection.includes(markupId) || item.selection.includes(uuid)))
    ) {
      item.selected = true;
    } else if ('selected' in item) {
      item.selected = false;
    }
  });
  refreshAnnotationsList();
  scrollToSelectedElement();
} // selectItemInAnnotationList()

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
  flipToAnno.addEventListener('click', () => {
    console.debug('Flipping to annotation: ', a);
    setCursorToId(cm, a.id);
  });

  // add Observation button
  const addObservation = generateListItemButton('addObservaion', speechBubble, 'Add observation to extract');
  if (a.type !== !'annotateIdentify') {
    addObservation.classList.add('disabled');
  }

  // add Describe button (for Markup)
  const addDescribe = generateListItemButton('describeMarkup', pencil, translator.lang.describeMarkup.description);
  if (a.isMarkup) {
    addDescribe.addEventListener('click', (e) => {
      annot.createDescribe(e, a.selection);
    });
  }

  // delete annotation button
  const deleteAnno = generateListItemButton(
    'deleteAnnotation',
    diffRemoved,
    a.isMarkup ? translator.lang.deleteMarkup.description : translator.lang.deleteAnnotation.description
  );
  deleteAnno.addEventListener('click', (e) => {
    const reallyDelete = confirm(
      a.isMarkup ? translator.lang.deleteMarkupConfirmation.text : translator.lang.deleteAnnotationConfirmation.text
    );
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
  if (!a.isMarkup) {
    annoListItemButtons.appendChild(isInline);
    annoListItemButtons.appendChild(isStandoff);
  } else {
    annoListItemButtons.appendChild(addDescribe);
  }
  annoListItemButtons.appendChild(deleteAnno);

  return annoListItemButtons;
} // generateAnnotationButtons()

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
} // generateListItemButton()

/**
 * Generates the label containing the page locations
 * @param {Object} a annotation / list item object
 * @returns {HTMLElement} span element
 */
export function generateAnnotationLocationLabel(a) {
  // console.log('generating anno label for ', a);
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
} // generateAnnotationLocationLabel()

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
        annot.createIdentify(e, v.selectedElements);
        break;
      case 'annotateHighlight':
        annot.createHighlight(e, v.selectedElements);
        break;
      case 'annotateCircle':
        annot.createCircle(e, v.selectedElements);
        break;
      case 'annotateLink':
        annot.createLink(e, v.selectedElements);
        break;
      case 'annotateDescribe':
        annot.createDescribe(e, v.selectedElements);
        break;
      default:
        console.warn("Don't have a handler for this type of annotation", e);
    }
    refreshAnnotationsInNotation(true);
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
} // addAnnotationHandlers()

/**
 * Adds click events and UI functionality for markup tool panel.
 * Logic regarding markup is in markup.js
 */
export function addMarkupHandlers() {
  const toggleContentSelector = (event) => {
    event.stopPropagation();
    let currentElement = event.currentTarget;
    let targetID = currentElement.dataset.target;
    let elName = currentElement.dataset.elName;
    let targetDisplay = document.getElementById(targetID);

    // remove first child (i.e. <choice> span)
    targetDisplay.innerHTML = currentElement.innerHTML;
    targetDisplay.removeChild(targetDisplay.firstElementChild);
    targetDisplay.setAttribute('data-content', currentElement.dataset.contentChoice);
    let dropdown = document.getElementById(`${elName}-content-options`);
    console.log('Toggling content selector: ', currentElement, targetID, targetDisplay, elName, dropdown);
    if (dropdown) dropdown.style.display = 'none';
  };

  addSelectionSelect();
  addRespSelect();

  // add click handlers to annotationMultiToolsSelectors, i.e. arrows on choice / subst buttons
  // use data-el-name to determine which button we're working with
  let multiToolsSelectors = document.getElementsByClassName('annotationMultiToolsSelector');
  Array.from(multiToolsSelectors).forEach((selector) => {
    selector.addEventListener('click', (event) => {
      event.stopPropagation();
      let currentElement = event.currentTarget;
      console.log('Clicked on ', currentElement, event);
      let targetType = currentElement.dataset.elName;
      let targetElement = document.getElementById(`${targetType}-content-options`);

      // if other dropdowns are open, close them
      if (targetElement.style.display !== 'none') {
        targetElement.style.display = 'none';
      } else {
        v.hideAnnotationMarkupDropDownContent();
        targetElement.style.display = 'block';
      }
    });
  });

  let contentOptions = document.getElementsByClassName('content-option');
  for (let i = 0; i < contentOptions.length; i++) {
    contentOptions[i].addEventListener('click', (event) => {
      toggleContentSelector(event);
    });
  }

  let addMarkupButtons = document.getElementsByClassName('addMarkup');
  for (let i = 0; i < addMarkupButtons.length; i++) {
    addMarkupButtons[i].addEventListener('click', (event) => {
      markup.addMarkup(event);
    });
  }
} // addMarkupHandlers()

/**
 * Adds the respSelect control to te markup tools tab.
 */
function addRespSelect() {
  let respSelectBase = {
    title: 'Select markup responsibility',
    description: 'filled in by language packs',
    type: 'select',
    default: 'none',
    values: [],
  };

  let respSelDiv = document.createElement('div');
  respSelDiv.classList.add('markupSetting');
  respSelDiv.classList.add('optionsItem');
  let respSelect = document.createElement(respSelectBase.type);
  respSelect.id = 'respSelect';
  let respSelLabel = document.createElement('label');
  respSelLabel.title = respSelectBase.title;
  respSelLabel.textContent = respSelectBase.title;
  respSelLabel.htmlFor = respSelect.id;
  respSelDiv.appendChild(respSelLabel);
  respSelDiv.appendChild(respSelect);

  let markupMenu = document.getElementById('markupSettingsFieldset');
  markupMenu.prepend(respSelDiv);
} // addRespSelect()

/**
 * add selection select control to markup tools tab
 */
function addSelectionSelect() {
  let selectSelectBase = {
    title: 'Select markup selection',
    description: 'filled in by language packs',
    type: 'select',
    default: '',
    values: ['', 'artic', 'accid'],
  };

  let selSelDiv = document.createElement('div');
  selSelDiv.classList.add('markupSetting');
  selSelDiv.classList.add('optionsItem');
  let selSelect = document.createElement(selectSelectBase.type);
  selSelect.id = 'selectionSelect';

  selectSelectBase.values.forEach((value, i) => {
    let label = 'labels' in translator.lang.selectionSelect ? translator.lang.selectionSelect.labels.at(i) : value;
    let option = new Option(
      label,
      value,
      selectSelectBase.values.indexOf(selectSelectBase.default) === i ? true : false
    );
    // Does not update on language change, find better solution
    //if ('valuesDescriptions' in translator.lang.selectionSelect) option.title = translator.lang.selectionSelect.valuesDescriptions[i];
    selSelect.add(option);
  });

  let selSelLabel = document.createElement('label');
  selSelLabel.title = selectSelectBase.title;
  selSelLabel.textContent = selectSelectBase.title;
  selSelLabel.htmlFor = selSelect.id;

  selSelDiv.appendChild(selSelLabel);
  selSelDiv.appendChild(selSelect);

  let markupMenu = document.getElementById('markupSettingsFieldset');
  if (markupMenu) {
    markupMenu.prepend(selSelDiv);
  }
} // addSelectionSelect()

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
} // enableDisableIdentifyObject()

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
} // populateSolidTab()

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
} // populateLoggedInSolidTab()

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
  customSolidIdP.classList.add('preventKeyBindings'); // avoid CMD + A to close annotation panel
  let solidLoginBtn = document.createElement('button');
  solidLoginBtn.innerHTML = translator.lang.solidLoginBtn.text;
  solidLoginBtn.id = 'solidLogin';
  solidLoginBtn.title = translator.lang.solidExplanation.description;
  // inject into DOM
  providerContainer.insertAdjacentElement('afterbegin', provider);
  providerContainer.insertAdjacentElement('afterbegin', solidLoginBtn);
  providerContainer.insertAdjacentElement('afterbegin', customSolidIdP);
  return providerContainer.outerHTML;
} // populateLoggedOutSolidTab()

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
} // addLoadWebAnnotatationButton()

// generateListItemButton()

//#endregion
