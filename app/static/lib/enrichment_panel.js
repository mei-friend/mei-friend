/**
 * Provides gui elements and functionality for enrichment bar
 */

import * as annot from './annotation.js';

/**
 * List of all things tab
 */

export let listItems = [];

/**
 * builds list of bubbles
 */

/**
 * Forces the situation of annotations and refreshes
 * the list of annotations
 * @param {boolean} forceRefresh true when list should be refreshed
 */
export function situateAndRefreshAnnotationsList(forceRefresh = false) {
  situateAnnotations();
  if (forceRefresh || !document.getElementsByClassName('annotationListItem').length) refreshAnnotationsList();
}

// export function refreshAnnotationsList()

/**
 * Adds button to load web annotations into the list
 */
function addLoadWebAnnotatationButton() {
  // add web annotation button
  const addWebAnnotation = document.createElement('span');
  const rdfIcon = document.createElement('span');
  addWebAnnotation.textContent = translator.lang.addWebAnnotation.text;
  rdfIcon.id = 'addWebAnnotationIcon';
  rdfIcon.insertAdjacentHTML('beforeend', rdf);
  addWebAnnotation.appendChild(rdfIcon);
  addWebAnnotation.id = 'addWebAnnotation';
  addWebAnnotation.addEventListener('click', () => loadWebAnnotation());
  list.appendChild(addWebAnnotation);
  list.insertAdjacentHTML(
    'beforeend',
    annotations.length ? '' : '<p>' + translator.lang.noAnnotationsToDisplay.text + '.</p>'
  );
}

/**
 * Things that do happen to items
 */

// situateListItems() 
// -> calls situateAnnotations & situateMarkup

// deleteItem()
// -> calls deleteAnnotation() & deleteMarkup
// -> deleteAnnotation() should only check if Annot or WebAnnotatio should be deleted

/**
 * build list items
 */
// generateListItem()
// generateListItemDetails()
// export function generateAnnotationLocationLabel(a)

// generateListItemButtons()
// generateListItemButton()


/**
 * Tools tab
 */

//function enableDisableIdentifyObject()

/**
 * Settings tab
 */
