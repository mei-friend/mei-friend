import { v, cm, log, translator, meiFileLocation, setStandoffAnnotationEnabledStatus } from './main.js';
import { convertCoords, generateXmlId, rmHash, setCursorToId } from './utils.js';
import { meiNameSpace, xmlNameSpace, xmlToString } from './dom-utils.js';
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
import { removeInEditor } from './editor.js';
import {
  loginAndFetch,
  solid,
  solidLogout,
  provider,
  getSolidStorage,
  friendContainer,
  annotationContainer,
  establishContainerResource,
  establishResource,
  createMAOMusicalObject,
} from './solid.js';
import { nsp, traverseAndFetch } from './linked-data.js';

export let annotations = [];

export function situateAndRefreshAnnotationsList(forceRefresh = false) {
  situateAnnotations();
  if (forceRefresh || !document.getElementsByClassName('annotationListItem').length) refreshAnnotationsList();
}

export function refreshAnnotationsList() {
  const list = document.getElementById('listAnnotations');
  // clear list
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  // console.log("Annotations: ",annotations);

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
  annotations.forEach((a, aix) => {
    const annoDiv = document.createElement('div');
    annoDiv.classList.add('annotationListItem');
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
      isStandoff.addEventListener('click', (e) => window.open(a.id, '_blank'));
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

// call whenever layout reflows to re-situate annotations appropriately
export function situateAnnotations() {
  annotations.forEach(async (a) => {
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
          `.annotationLocationLabel[data-id=${CSS.escape(a.id)}`
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

export function deleteAnnotation(uuid) {
  const ix = annotations.findIndex((a) => a.id === uuid);
  if (ix >= 0) {
    annotations.splice(ix, 1);
    deleteAnnot(uuid);
    situateAndRefreshAnnotationsList(true);
    refreshAnnotations();
  }
}

// functions to draw annotations

async function drawIdentify(a) {
  if ('selection' in a) {
    const els = a.selection.map((s) => document.getElementById(s));
    els
      .filter((e) => e !== null) // (null if not on current page)
      .forEach((e) => e.classList.add('annotationIdentify'));
  } else {
    console.warn('failing to draw identify annotation without selection: ', a);
  }
}

function drawHighlight(a) {
  if ('selection' in a) {
    const els = a.selection.map((s) => document.getElementById(s));
    els
      .filter((e) => e !== null) // (null if not on current page)
      .forEach((e) => e.classList.add('annotationHighlight'));
  } else {
    console.warn('failing to draw highlight annotation without selection: ', a);
  }
}

function drawCircle(a) {
  if ('selection' in a) {
    // mission: draw an ellipse into the raSvg that encompasses a collection of selection objects
    let raSvg = document.querySelector('#renderedAnnotationsSvg');
    // find bounding boxes of all selected elements on page:
    const bboxes = a.selection.map((s) => convertCoords(document.getElementById(s)));
    // determine enveloping bbox
    const minX = Math.min(...bboxes.map((b) => b.x));
    const minY = Math.min(...bboxes.map((b) => b.y));
    const maxX2 = Math.max(...bboxes.map((b) => b.x2));
    const maxY2 = Math.max(...bboxes.map((b) => b.y2));
    // now create our ellipse
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    ellipse.setAttribute('cx', (minX + maxX2) / 2);
    ellipse.setAttribute('cy', (minY + maxY2) / 2);
    // Add padding so we don't circle too tightly -- but not too much!
    const paddedRx = Math.min((maxX2 - minX) / 1.6, maxX2 - minX + 20);
    const paddedRy = Math.min((maxY2 - minY) / 1.3, maxY2 - minY + 20);
    ellipse.setAttribute('rx', paddedRx);
    ellipse.setAttribute('ry', paddedRy);
    ellipse.classList.add('highlightEllipse');
    raSvg.appendChild(ellipse);
  } else {
    console.warn('Failing to draw circle annotation without selection: ', a);
  }
}

function drawDescribe(a) {
  if ('selection' in a && 'description' in a) {
    const els = a.selection.map((s) => document.getElementById(s));
    els
      .filter((e) => e !== null) // (null if not on current page)
      .forEach((e) => {
        e.classList.add('annotationDescribe');
        // create a title element within the described element to house the description (which will be available on hover)
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.innerHTML = a.description;
        // slot it in as the first child of the selected element
        e.insertBefore(title, e.firstChild);
      });
  } else {
    console.warn('Failing to draw describe annotation missing selection and/or description: ', a);
  }
}

function drawLink(a) {
  if ('selection' in a && 'url' in a) {
    const els = a.selection.map((s) => document.getElementById(s));
    els
      .filter((e) => e !== null) // (null if not on current page)
      .forEach((e) => {
        e.classList.add('annotationLink');
        // create a title element within the linked element to house the url (which will be available on hover)
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.innerHTML = translator.lang.drawLinkUrl.text + ': ' + a.url;
        // slot it in as the first child of the selected element
        e.insertBefore(title, e.firstChild);
        // make the element clickable
        e.addEventListener('click', () => window.open(a.url, '_blank'), true);
      });
  } else {
    console.warn('Failing to draw link annotation missing selection and/or url: ', a);
  }
}

// Draws annotations in Verovio notation panel
export function refreshAnnotations(forceListRefresh = false) {
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
  if (document.getElementById('showAnnotations').checked) {
    // drawing handlers can draw into renderedAnnotationsSvg if they need to
    annotations.forEach((a) => {
      if ('type' in a) {
        switch (a.type) {
          case 'annotateIdentify':
            drawIdentify(a);
            break;
          case 'annotateHighlight':
            drawHighlight(a);
            break;
          case 'annotateCircle':
            drawCircle(a);
            break;
          case 'annotateLink':
            drawLink(a);
            break;
          case 'annotateDescribe':
            drawDescribe(a);
            break;
          default:
            console.warn("Don't have a drawing function for this type of annotation", a);
        }
      } else {
        console.warn('Skipping annotation without type: ', a);
      }
    });
  }
  situateAndRefreshAnnotationsList(forceListRefresh);
}

export function addAnnotationHandlers() {
  // TODO extend this to allow app to consume (TROMPA-style) Annotation Toolkit descriptions

  const annotationHandler = (e) => {
    console.log('annotation Handler: Clicked to make new annotation!', e);
    console.log('annotation Handler: Selected elements: ', v.selectedElements);
    switch (e.target.closest('.annotationToolsIcon')?.getAttribute('id')) {
      case 'annotateIdentify':
        createIdentify(e);
        break;
      case 'annotateHighlight':
        createHighlight(e);
        break;
      case 'annotateCircle':
        createCircle(e);
        break;
      case 'annotateLink':
        createLink(e);
        break;
      case 'annotateDescribe':
        createDescribe(e);
        break;
      default:
        console.warn("Don't have a handler for this type of annotation", e);
    }
    refreshAnnotations(true);
  };

  // functions to create annotations
  const createIdentify = (e) => {
    if (solid.getDefaultSession().info.isLoggedIn) {
      const label = window.prompt('Add label for identified object (optional)');
      const selection = v.selectedElements;
      document.getElementById('solid_logo').classList.add('clockwise');
      createMAOMusicalObject(selection, label)
        .then((maoMusicalMaterial) => {
          getSolidStorage().then((solidStorage) => {
            console.log(
              'CREATED MUSICAL MATERIAL: ',
              solidStorage + maoMusicalMaterial.headers.get('location').substr(1),
              maoMusicalMaterial
            );
            const a = {
              id: solidStorage + maoMusicalMaterial.headers.get('location').substr(1),
              type: 'annotateIdentify',
              selection: selection,
              isStandoff: true,
            };
            annotations.push(a);
            refreshAnnotations(true);
          });
        })
        .finally(() => {
          document.getElementById('solid_logo').classList.remove('clockwise');
        });
      // writing inline not supported
    } else {
      document.getElementById('solidButton').click();
    }
  };
  const createHighlight = (e) => {
    const a = {
      id: generateXmlId('annot', v.xmlIdStyle),
      type: 'annotateHighlight',
      selection: v.selectedElements,
    };
    annotations.push(a);
    writeInlineIfRequested(a);
    writeStandoffIfRequested(a);
  };
  const createCircle = (e) => {
    const a = {
      id: generateXmlId('annot', v.xmlIdStyle),
      type: 'annotateCircle',
      selection: v.selectedElements,
    };
    annotations.push(a);
    writeInlineIfRequested(a);
    writeStandoffIfRequested(a);
  };
  const createDescribe = (e) => {
    // TODO improve UX!
    const desc = window.prompt(translator.lang.askForDescription.text);
    const a = {
      id: generateXmlId('annot', v.xmlIdStyle),
      type: 'annotateDescribe',
      selection: v.selectedElements,
      description: desc,
    };
    annotations.push(a);
    writeInlineIfRequested(a);
    writeStandoffIfRequested(a);
  };
  const createLink = (e) => {
    // TODO improve UX!
    let url = window.prompt(translator.lang.askForLinkUrl.text);
    if (!url.startsWith('http')) url = 'https://' + url;
    const a = {
      id: generateXmlId('annot', v.xmlIdStyle),
      type: 'annotateLink',
      selection: v.selectedElements,
      url: url,
    };
    annotations.push(a);
    writeInlineIfRequested(a);
    writeStandoffIfRequested(a);
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

function enableDisableIdentifyObject() {
  let identifyTool = document.getElementById('annotateIdentify');
  if (document.getElementById('writeAnnotationInline').checked) {
    identifyTool.classList.add('disabled');
  } else {
    identifyTool.classList.remove('disabled');
  }
}

// reads <annot> elements from XML DOM and adds them into annotations array
export function readAnnots(flagLimit = false) {
  if (!v.xmlDoc) return;
  let annots = Array.from(v.xmlDoc.querySelectorAll('annot'));
  annots = annots.filter((annot) => annotations.findIndex((a) => a.id !== annot.getAttribute('xml:id')));
  let limit = document.getElementById('annotationDisplayLimit');
  if (limit && annots.length > limit.value) {
    if (flagLimit) {
      v.showAlert(
        translator.lang.maxNumberOfAnnotationAlert.text1 +
          ' (' +
          limit.value +
          '). ' +
          translator.lang.maxNumberOfAnnotationAlert.text2,
        'warning',
        -1
      );
    }
    return;
  }
  annots.forEach((annot) => {
    let annotation = {};
    if (annot.textContent) {
      const ptrs = annot.getElementsByTagNameNS(meiNameSpace, 'ptr');
      if (ptrs.length) {
        annotation.type = 'annotateLink';
        annotation.url = ptrs[0].getAttribute('target');
      } else {
        annotation.type = 'annotateDescribe';
        annotation.description = annot.textContent;
      }
    } else annotation.type = 'annotateHighlight';
    if (annot.hasAttribute('plist')) {
      annotation.selection = annot
        .getAttribute('plist')
        .split(' ')
        .map((id) => rmHash(id));
    } else if (annot.parentNode.hasAttribute('xml:id')) {
      annotation.selection = [annot.parentNode.getAttribute('xml:id')];
    } else {
      console.warn('readAnnots(): found annot without id ', annot);
    }
    if (annot.hasAttributeNS(xmlNameSpace, 'id')) {
      annotation.id = annot.getAttributeNS(xmlNameSpace, 'id');
    } else {
      annotation.id = 'None';
    }
    annotation.isInline = true;
    if (annotations.findIndex((a) => a.id === annotation.id) === -1) {
      // only if not already included
      // FIXME: will ignore all but the first annotation without xml:id
      annotations.push(annotation);
    } else {
    }
  });
  refreshAnnotations();
}

// inserts new annot element based on anchor element into CodeMirror editor,
// with @xml:id, @plist and optional payload (string or ptr)
export function writeAnnot(anchor, xmlId, plist, payload) {
  // TODO: Place the annotation in the most sensible place according to the MEI schema
  // i.e., probably the closest permissible level to the anchor element.
  // For now, we only support a limited range of music body elements
  let insertHere;
  if (anchor.closest('supplied')) insertHere = anchor.closest('supplied');
  else if (anchor.closest('layer')) insertHere = anchor.closest('layer');
  else if (anchor.closest('measure')) insertHere = anchor.closest('measure');
  else if (anchor.closest('section')) insertHere = anchor.closest('section');
  else if (anchor.closest('score')) insertHere = anchor.closest('score');
  else {
    console.error('Sorry, cannot currently write annotations placed outside <score>');
    v.showAlert(translator.lang.annotationsOutsideScoreWarning.text, 'warning', 5000);
    // remove from list
    deleteAnnotation(xmlId);
    return;
  }
  if (insertHere) {
    // trz to add our annotation at beginning of insertHere element's list of children:
    // find first non-text child with an identifier
    const firstChildNode = Array.from(insertHere.childNodes)
      .filter((c) => c.nodeType !== Node.TEXT_NODE)
      .filter((c) => c.hasAttribute('xml:id'))[0];
    if (firstChildNode) {
      // set cursor based on it
      setCursorToId(cm, firstChildNode.getAttribute('xml:id'));
      let annot = document.createElementNS(meiNameSpace, 'annot');
      annot.setAttributeNS(xmlNameSpace, 'xml:id', xmlId);
      annot.setAttribute('plist', plist.map((p) => '#' + p).join(' '));
      if (payload) {
        if (typeof payload === 'string') {
          annot.textContent = payload;
        } else if (typeof payload === 'object') {
          annot.appendChild(payload);
        }
      }
      // insert <annot> into the DOM
      insertHere.insertAdjacentElement('afterbegin', annot);
      // now write it into CM
      let p1 = cm.getCursor();
      cm.replaceRange(xmlToString(annot) + '\n', p1);
      let p2 = cm.getCursor();
      // indent nicely
      while (p1.line <= p2.line) cm.indentLine(p1.line++, 'smart');
      // jump to the written <annot> in CM
      setCursorToId(cm, xmlId);
    } else {
      let errMsg =
        '<p>' +
        translator.lang.annotationWithoutIdWarning.text1 +
        '</p>' +
        '<p>' +
        translator.lang.annotationWithoutIdWarning.text2 +
        '</p>';
      console.warn(errMsg);
      log(errMsg);
    }
  }
}

export function deleteAnnot(xmlId) {
  const annot = v.xmlDoc.querySelector('[*|id=' + xmlId + ']');
  if (annot) {
    removeInEditor(cm, annot);
    annot.remove();
  } else {
    console.warn('Failed to delete non-existing annot with xml:id ', xmlId);
  }
}

// GUI function to set up 'Load linked data' UI
export function loadWebAnnotation(prev = '') {
  let msg = translator.lang.loadWebAnnotationMessage.text;
  let prevurl = '';
  if (prev) {
    if (prev.status) {
      // response object received
      msg = `${translator.lang.loadWebAnnotationMessage1.text} 
            (${prev.status}: ${prev.statusText}), 
             ${translator.lang.loadWebAnnotationMessage2.text}. 
             ${msg}`;
      prevurl = prev.url;
    } else {
      // no response object received, e.g. due to CORS network error
      // we have been handed the url string instead
      msg = `${translator.lang.loadWebAnnotationMessage1} (network error), 
             ${translator.lang.loadWebAnnotationMessage2}. 
             ${msg}`;
      prevurl = prev;
    }
  }
  let urlstr = window.prompt(msg, prevurl);
  if (urlstr) {
    if (!(urlstr.startsWith('http://') || urlstr.startsWith('https://'))) urlstr = 'https://' + urlstr;
    try {
      // ensure working URLs provided
      attemptFetchExternalResource(
        new URL(urlstr), // traversal start
        [new URL(nsp.OA + 'Annotation')], // target types
        {
          typeToHandlerMap: {
            [nsp.OA + 'Annotation']: {
              func: ingestWebAnnotation,
            },
          },
          followList: [new URL(nsp.LDP + 'contains')], // predicates to traverse
          fetchMethod: solid.getDefaultSession().info.isLoggedIn ? solid.fetch : fetch,
        }
      );
    } catch (e) {
      // invalid URL
      loadWebAnnotation();
    }
  }
}

// Wrapper around traverseAndFetch that reports back errors / progress to 'Load linked data' UI
export function attemptFetchExternalResource(url, targetTypes, configObj) {
  console.log('fetch external resource: ', url, targetTypes, typeToHandlerMap, followList, blockList, jumps);
  // spin the icon to indicate loading activity
  const icon = document.getElementById('addWebAnnotationIcon');
  const svgs = Array.from(icon.getElementsByTagName('svg'));
  svgs.forEach((t) => t.classList.add('clockwise'));
  traverseAndFetch(url, targetTypes, configObj)
    .catch((resp) => {
      if (userProvided) {
        console.error("Couldn't load external resource, error response: ", resp);
        // user-provided url didn't work, so hand control back to user
        if (resp.url) loadWebAnnotation(resp);
        else loadWebAnnotation(url.href);
      }
    })
    .finally(() => {
      // notify that we've stopped loading
      svgs.forEach((t) => t.classList.remove('clockwise'));
    });
}

export function fetchWebAnnotations(url, userProvided = true, jumps = 10) {
  // spin the icon to indicate loading activity
  const icon = document.getElementById('addWebAnnotationIcon');
  const svgs = Array.from(icon.getElementsByTagName('svg'));
  svgs.forEach((t) => t.classList.add('clockwise'));
  let fetchAppropriately = solid.getDefaultSession().info.isLoggedIn ? solid.fetch : fetch;
  fetchAppropriately(url, {
    headers: {
      Accept: 'application/ld+json',
    },
  })
    .then((resp) => {
      if (resp.status >= 400) {
        throw Error(resp);
      } else {
        return resp.json();
      }
    })
    .then((json) => jsonld.expand(json))
    .then((json) => {
      let resourceDescription;
      if (Array.isArray(json)) {
        resourceDescription = json.find((o) => o['@id'] === url);
        if (!resourceDescription && !url.endsWith('/')) {
          // try again with trailing slash
          resourceDescription = json.find((o) => o['@id'] === url + '/');
        }
      } else {
        resourceDescription = json;
      }
      if (resourceDescription && '@type' in resourceDescription) {
        if (resourceDescription['@type'].includes('http://www.w3.org/ns/ldp#Container')) {
          // found a container, recurse on members
          if ('http://www.w3.org/ns/ldp#contains' in resourceDescription) {
            if (jumps >= 0) {
              return resourceDescription['http://www.w3.org/ns/ldp#contains'].map((resource) => {
                jumps -= 1;
                fetchWebAnnotations(resource['@id'], false, jumps);
              });
            } else {
              console.warn('Prematurely ending traversal as out of jumps', url);
            }
          } else {
            console.warn('Container without content: ', url, resourceDescription);
          }
        } else if (resourceDescription['@type'].includes('http://www.w3.org/ns/oa#Annotation')) {
          // found an annotation!
          ingestWebAnnotation(resourceDescription);
          return resourceDescription;
        } else {
          console.warn("fetchWebAnnotations: Don't know how to handle resource: ", url, resourceDescription);
        }
      } else {
        console.warn('Problem working with the specified resource identifier in requested resource: ', url, json);
      }
    })
    .catch((resp) => {
      if (userProvided) {
        console.error("Couldn't load web annotation, error response: ", resp);
        // user-provided url didn't work, so hand control back to user
        if (resp.url) loadWebAnnotation(resp);
        else loadWebAnnotation(url);
      }
    })
    .finally(() => {
      // notify that we've stopped loading
      svgs.forEach((t) => t.classList.remove('clockwise'));
    });
}

export function ingestWebAnnotation(webAnno) {
  // terminological note: 'webAnno' => the web annotation, 'anno' => internal mei-friend annotation we are generating
  if (!('http://www.w3.org/ns/oa#hasTarget' in webAnno)) {
    console.warn('Skipping Web Annotation without a target: ', webAnno);
    return;
  } else {
    let anno = {
      id: webAnno['@id'],
    };
    let targets = webAnno['http://www.w3.org/ns/oa#hasTarget'];
    if (!Array.isArray(targets)) targets = [targets];
    anno.type = 'annotateHighlight'; // default type
    let bodies = webAnno['http://www.w3.org/ns/oa#hasBody'];
    if (bodies && !Array.isArray(bodies)) bodies = [bodies];
    if (bodies && bodies.length) {
      // TODO decide what to do for multiple bodies
      let firstBody = bodies[0];
      if (typeof firstBody === 'object') {
        if ('@id' in firstBody) {
          console.log('Declaring a linking annotation!');
          // decare a linking annotation
          anno.url = firstBody['@id'];
          anno.type = 'annotateLink';
        } else if (
          '@type' in firstBody &&
          nsp.RDF + value in firstBody &&
          nsp.OA + 'TextualBody' in firstBody['@type']
        ) {
          // declare a describing annotation
          console.log('Declaring a describing annotation!');
          anno.description = firstBody[nsp.RDF + value];
          anno.type = 'annotateDescribe';
        } else {
          console.log("Don't know how to handle body of this annotation: ", anno);
        }
      }
    } else if (nsp.OA + 'bodyValue' in webAnno) {
      // declare describing annotation
      console.log('Declaring a describing annotation!');
      // TODO decide what to do for multiple bodies
      anno.description = webAnno[nsp.OA + 'bodyValue'][0]['@value'];
      anno.type = 'annotateDescribe';
    }

    anno.selection = targets.map((t) => t['@id'].split('#')[1]);
    if (annotations.findIndex((a) => a.id === anno.id) < 0) {
      // add to list if we don't already have it
      anno.isStandoff = true;
      annotations.push(anno);
    }
    refreshAnnotations();
  }
}

function writeInlineIfRequested(a) {
  // write annotation to inline <annot> if the user has requested this
  if (document.getElementById('writeAnnotationInline').checked) {
    let el = v.xmlDoc.querySelector('[*|id="' + v.selectedElements[0] + '"]');
    if (el) {
      let payload;
      if (a.type === 'annotateDescribe') payload = a.description;
      else if (a.type === 'annotateLink') {
        payload = document.createElementNS(meiNameSpace, 'ptr');
        payload.setAttributeNS(xmlNameSpace, 'xml:id', 'ptr-' + generateXmlId());
        payload.setAttribute('target', a.url);
      }
      writeAnnot(el, a.id, a.selection, payload);
      a.isInline = true;
    } else console.warn('writeInlineIfRequested: Cannot find beforeThis element for ' + a.id);
  }
}

// fetch all components hanging off a musical material
async function fetchMAOComponentsForIdentifiedObject(musMatUrl) {
  traverseAndFetch(
    new URL(musMatUrl),
    [new URL(nsp.MAO + 'MusicalMaterial'), new URL(nsp.MAO + 'Extract'), new URL(nsp.MAO + 'Selection')],
    {
      typeToHandlerMap: {
        [nsp.MAO + 'MusicalMaterial']: {
          func: drawMusicalMaterialForIdentifiedObject,
        },
        [nsp.MAO + 'Extract']: {
          func: drawExtractsForIdentifiedObject,
        },
        [nsp.MAO + 'Selection']: {
          func: drawSelectionsForIdentifiedObject,
        },
      },
      followList: [new URL(nsp.FRBR + 'embodiment'), new URL(nsp.MAO + 'setting')],
      fetchMethod: solid.getDefaultSession().info.isLoggedIn ? solid.fetch : fetch,
    }
  ).catch((e) => {
    log("Couldn't load extracts associated with identified musical object:", e);
    const loadingIndicator = document.querySelector('#musMat_' + CSS.escape(musMatUrl) + ' span');
    if (loadingIndicator) {
      loadingIndicator.classList.remove('clockwise');
    }
  });
}

/*
async function fetchExtractsForIdentifiedObject(url) { 
  traverseAndFetch(
    new URL(url), 
    [new URL(nsp.MAO + "MusicalMaterial")],
    { 
      typeToHandlerMap: { 
        [nsp.MAO + "MusicalMaterial"]: { 
          func: drawExtractsForIdentifiedObject,
          args: [url]
        }
      },
      fetchMethod: solid.getDefaultSession().info.isLoggedIn ? solid.fetch : fetch
    }
  ).catch(e => { 
    log("Couldn't load extracts associated with identified musical object:", e);
    const loadingIndicator = document.querySelector('#musMat_'+CSS.escape(url)+' span');
    if(loadingIndicator) { 
      loadingIndicator.classList.remove("clockwise");
    }
  })
}
*/

/*
 * Draw placeholder for MAO setting into the musMat element corresponding to this url
 * Check first whether this setting is already included. Do not overwrite other settings.
 */
async function drawMusicalMaterialForIdentifiedObject(obj, url) {
  console.log('drawMusMatForIdentifiedObject: ', obj, url);
  const musMat = document.getElementById('musMat_' + url.href);
  if (musMat) {
    // if we have a label and haven't drawn one already...
    const myListItem = musMat.closest('.annotationListItem');
    const myLabel = myListItem.querySelector('.annotationLocationLabel');
    console.log('LABEL: ', obj, myLabel);
    if (nsp.RDFS + 'label' in obj && !myLabel.innerText.length) {
      const label = Array.isArray(obj[nsp.RDFS + 'label']) ? obj[nsp.RDFS + 'label'] : [obj[RDFS + 'label']];
      myLabel.innerText = label[0]['@value']; // TODO support multiple labels?
    }
    if (nsp.MAO + 'setting' in obj) {
      const alreadyIncluded = musMat.querySelectorAll('.mao-extract');
      const alreadyIncludedUrls = alreadyIncluded.forEach((n) => n.id.replace('extract', ''));
      let extractsToAdd;
      if (alreadyIncludedUrls) {
        extractsToAdd = obj[nsp.MAO + 'setting'].filter((s) => !alreadyIncludedUrls.includes(s['@id']));
      } else {
        extractsToAdd = obj[nsp.MAO + 'setting'];
      }
      console.debug('Trying to add extracts... ', extractsToAdd);
      extractsToAdd.forEach((s) => {
        musMat.insertAdjacentHTML('beforeend', `<div class="mao-extract" id="extract_${s['@id']}"></div>`);
      });
      console.debug('Done with musMat: ', musMat);
    } else {
      console.warn("Can't draw a MusicalMaterial without a setting:", obj);
    }
  } else {
    console.warn(
      'Trying to draw musical material for identified object but have no musMat div to hook it into',
      obj,
      url
    );
  }
}

async function drawExtractsForIdentifiedObject(obj, url) {
  console.log('drawExtractsForIdentifiedObject: ', obj, url);
  const extract = document.getElementById('extract_' + url.href);
  if (extract) {
    if (nsp.FRBR + 'embodiment' in obj) {
      const alreadyIncluded = extract.querySelectorAll('.mao-selection');
      const alreadyIncludedUrls = alreadyIncluded.forEach((n) => n.id.replace('selection_', ''));
      let selectionsToAdd;
      if (alreadyIncludedUrls) {
        selectionsToAdd = obj[nsp.FRBR + 'embodiment'].filter((s) => !alreadyIncludedUrls.includes(s['@id']));
      } else {
        selectionsToAdd = obj[nsp.FRBR + 'embodiment'];
      }
      selectionsToAdd.forEach((s) => {
        extract.insertAdjacentHTML('beforeend', `<div class="mao-selection" id="selection_${s['@id']}"></div>`);
      });
    } else {
      console.warn("Can't draw an Extract without an embodiment:", obj);
    }
  } else {
    console.warn('Trying to draw extract for identified object but have no extract div to hook it into', obj, url);
  }
}

async function drawSelectionsForIdentifiedObject(obj, url) {
  console.log('drawSelectionForIdentifiedObject: ', obj, url);
  const selection = document.getElementById('selection_' + url.href);
  if (selection) {
    if (nsp.FRBR + 'part' in obj) {
      try {
        const a = {};
        a.selection = obj[nsp.FRBR + 'part'].map((s) => s['@id'].substr(s['@id'].lastIndexOf('#') + 1));
        a.firstPage = await v.getPageWithElement(a.selection[0]);
        a.lastPage = await v.getPageWithElement(a.selection[a.selection.length - 1]);
        selection.innerText = generateAnnotationLocationLabel(a).innerText;
      } catch (e) {
        console.warn("Couldn't situate FRBR:parts of selection: ", e);
      }
    } else {
      console.warn("Can't draw a selection without parts: ", obj, url);
    }
    const myMusMat = selection.closest('.annotationListItem');
    if (myMusMat) {
      const myLoadingIndicator = myMusMat.querySelector('.makeStandoffAnnotation svg');
      if (myLoadingIndicator) myLoadingIndicator.classList.remove('clockwise');
    }
  } else {
    console.warn('Trying to draw selection for identified object but have no selection div to hook it into', obj, url);
  }
}

async function writeStandoffIfRequested(a) {
  // write to a stand-off Web Annotation in the user's Solid Pod if requested
  if (document.getElementById('writeAnnotationStandoff').checked) {
    a.isStandoff = true;
    if (solid.getDefaultSession().info.isLoggedIn) {
      document.getElementById('solid_logo').classList.add('clockwise');
      // ensure mei-friend container exists
      establishContainerResource(friendContainer)
        .then((friendContainerResource) => {
          establishContainerResource(annotationContainer)
            .then((annotationContainerResource) => {
              // generate a web annotation JSON-LD object
              let webAnno = new Object();
              let body = new Object();
              webAnno['@type'] = [nsp.OA + 'Annotation'];
              webAnno[nsp.OA + 'hasTarget'] = a.selection.map((s) => {
                // TODO: do something clever if fileLocationType = "file" (local)
                return { '@id': meiFileLocation + '#' + s };
              });
              switch (a.type) {
                case 'annotateHighlight':
                  webAnno[nsp.OA + 'motivatedBy'] = [{ '@id': nsp.OA + 'highlighting' }];
                  break;
                case 'annotateDescribe':
                  body['@type'] = [nsp.OA + 'TextualBody'];
                  if ('description' in a) {
                    body[nsp.RDF + 'value'] = a.description;
                  } else {
                    console.warn('Describing annotation without a description: ', a);
                  }
                  webAnno[nsp.OA + 'motivatedBy'] = [{ '@id': nsp.OA + 'describing' }];
                  webAnno[nsp.OA + 'hasBody'] = [body];
                  break;
                case 'annotateLink':
                  webAnno[nsp.OA + 'motivatedBy'] = [{ '@id': nsp.OA + 'linking' }];
                  webAnno[nsp.OA + 'hasBody'] = [{ '@id': a.url }];
                  break;
                default:
                  console.warn('Trying to write standoff annotation with unknown annotation type:', a);
                  break;
              }
              webAnno['@id'] = annotationContainerResource + a.id;
              establishResource(webAnno['@id'], webAnno).then((webAnnoResp) => {
                if (webAnnoResp.ok) {
                  console.log('Success! Posted Web Annotation:', webAnno);
                } else {
                  console.warn("Couldn't post WebAnno: ", webAnno, webAnnoResp);
                  throw webAnnoResp;
                }
              });
            })
            .catch((e) => {
              console.error("Couldn't post WebAnno:", e);
            });
        })
        .catch(() => {
          console.error("Couldn't establish container:", friendContainer);
        })
        .finally(() => {
          document.getElementById('solid_logo').classList.remove('clockwise');
        });
    } else {
      log('Cannot write standoff annotation: Please ensure you are logged in to a Solid Pod');
    }
  }
}

export function copyIdToClipboard(e) {
  console.log('Attempting to copy ID to clipboard: ', e);
  navigator.clipboard.writeText(e.target.closest('.icon').dataset.id).catch((err) => {
    console.warn("Couldn't copy id to clipboard: ", err);
  });
}

export function clearAnnotations() {
  annotations = [];
}

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
    document.getElementById('solidLogin').addEventListener('click', () => {
      loginAndFetch(populateSolidTab);
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
  `;
  providerContainer.insertAdjacentElement('afterbegin', provider);
  let msg = document.createElement('div');
  msg.innerHTML = 'Please choose a provider and <a id="solidLogin">click here to log in!</a>';
  msg.insertAdjacentElement('afterbegin', providerContainer);
  return msg.outerHTML;
}
