import { v, cm, log, translator } from './main.js';
import { convertCoords, generateXmlId, rmHash, setCursorToId } from './utils.js';
import { meiNameSpace, xmlNameSpace, xmlToString } from './dom-utils.js';
import { removeInEditor } from './editor.js';
import {
  solid,
  getSolidStorage,
  friendContainer,
  annotationContainer,
  establishContainerResource,
  establishResource,
  createMAOMusicalObject,
  establishDiscoveryResource,
  getCurrentFileUri,
  safelyPatchResource,
} from './solid.js';
import { nsp, traverseAndFetch } from './linked-data.js';
import { deleteListItem, isItemInList, addListItem } from './enrichment_panel.js';

//#region functions to draw annotations

/**
 * Takes an annotation object and highlights
 * the selected elements in the notation panel
 * @param {Object} a annotation object
 */
export async function drawIdentify(a) {
  if ('selection' in a) {
    const els = a.selection.map((s) => document.getElementById(s));
    els
      .filter((e) => e !== null) // (null if not on current page)
      .forEach((e) => e.classList.add('annotationIdentify'));
  } else {
    console.warn('failing to draw identify annotation without selection: ', a);
  }
}

/**
 * Takes an annotation object and highlights
 * the selected elements in the notation panel
 * @param {Object} a annotation object
 */
export function drawHighlight(a) {
  if ('selection' in a) {
    const els = a.selection.map((s) => document.getElementById(s));
    els
      .filter((e) => e !== null) // (null if not on current page)
      .forEach((e) => e.classList.add('annotationHighlight'));
  } else {
    console.warn('failing to draw highlight annotation without selection: ', a);
  }
}

export function drawCircle(a) {
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

/**
 * Takes an annotation object and highlights
 * the selected elements in the notation panel.
 * Adds the description text as tool tip.
 * @param {Object} a annotation object
 */
export function drawDescribe(a) {
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

/**
 * Takes an annotation object and highlights
 * the selected elements in the notation panel.
 * Adds a hyperlink (opening in a new tab).
 * @param {Object} a annotation object
 */
export function drawLink(a) {
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

//#endregion

//#region functions to create annotations
// called by addAnnotationHandlers() in the Tools tab of the Enrichment panel

// functions to create annotations
export const createIdentify = (e) => {
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
            standoffUri: solidStorage + maoMusicalMaterial.headers.get('location').substr(1),
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

/**
 * Creates a new highlight annotation either inline or standoff.
 * @param {Event} e event
 */
export const createHighlight = (e) => {
  const a = {
    id: generateXmlId('annot', v.xmlIdStyle),
    type: 'annotateHighlight',
    selection: v.selectedElements,
  };
  addListItem(a);
  writeInlineIfRequested(a);
  writeStandoffIfRequested(a);
};

/**
 * Creates a new circle annotation either inline or standoff.
 * @param {Event} e event
 */
export const createCircle = (e) => {
  const a = {
    id: generateXmlId('annot', v.xmlIdStyle),
    type: 'annotateCircle',
    selection: v.selectedElements,
  };
  addListItem(a);
  writeInlineIfRequested(a);
  writeStandoffIfRequested(a);
};

/**
 * Creates a new describe annotation either inline or standoff.
 * @param {Event} e event
 */
export const createDescribe = (e) => {
  // TODO improve UX!
  const desc = window.prompt(translator.lang.askForDescription.text);
  const a = {
    id: generateXmlId('annot', v.xmlIdStyle),
    type: 'annotateDescribe',
    selection: v.selectedElements,
    description: desc,
  };
  addListItem(a);
  writeInlineIfRequested(a);
  writeStandoffIfRequested(a);
};

/**
 * Creates a new link annotation either inline or standoff.
 * @param {Event} e event
 */
export const createLink = (e) => {
  // TODO improve UX!
  let url = window.prompt(translator.lang.askForLinkUrl.text);
  if (!url.startsWith('http')) url = 'https://' + url;
  const a = {
    id: generateXmlId('annot', v.xmlIdStyle),
    type: 'annotateLink',
    selection: v.selectedElements,
    url: url,
  };
  addListItem(a);
  writeInlineIfRequested(a);
  writeStandoffIfRequested(a);
};

//#endregion

//#region inline annotation functions

/**
 * reads <annot> elements from XML DOM and adds them into annotations array
 * @param {boolean} flagLimit alert if max. number of annotations are reached
 */
export function readAnnots(flagLimit = false) {
  if (!v.xmlDoc) return;
  let annots = Array.from(v.xmlDoc.querySelectorAll('annot'));
  //annots = annots.filter((annot) => annotations.findIndex((a) => a.id !== annot.getAttribute('xml:id'))); // original
  //annots = annots.filter((annot) => annotations.findIndex((a) => a.id !== annot.getAttribute('xml:id')) !== -1); // corrected
  annots = annots.filter((annot) => !isItemInList(annot.getAttribute('xml:id')));
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

    addListItem(annotation);
  });
}

/**
 * Adds page locations in rendering to annotation object in annotation list.
 * Call whenever layout reflows to re-situate annotations appropriately.
 */
export async function situateAnnotations(a) {
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
  }

  if (a.firstPage < 0 && v.speedMode) {
    if (v.xmlDoc.querySelector('[*|id=' + item.selection[0] + ']')?.closest('meiHead')) a.firstPage = 'meiHead';
    else console.warn('Cannot locate annotation ', a);
  }

  // for any identifying annotations, see if there are new extracts associated with the musical material
  if (a.type == 'annotateIdentify') {
    // find it in the list
    const musMatDiv = document.querySelector('#musMat_' + CSS.escape(a.id));
    console.log('extracts DIV: ', musMatDiv);
    if (musMatDiv && !musMatDiv.innerHTML.length) {
      musMatDiv.closest('.annotationListItem').querySelector('.makeStandoffAnnotation svg').classList.add('clockwise');
      fetchMAOComponentsForIdentifiedObject(a.id);
    }
  }

  return a;
} // situateAnnotations()

/**
 * inserts new annot element based on anchor element into CodeMirror editor,
 * with @xml:id, @plist and optional payload (string or ptr)
 * @param {Element} anchor anchor element
 * @param {string} xmlId xml:id for new annot element
 * @param {Array} plist selected elements
 * @param {object|string} payload possible content of annot element
 * @returns
 */
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
    deleteListItem(xmlId);
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

/**
 * Delete an inline annotation
 * @param {string} xmlId
 */
export function deleteAnnot(xmlId) {
  const annot = v.xmlDoc.querySelector('[*|id=' + xmlId + ']');
  if (annot) {
    removeInEditor(cm, annot);
    annot.remove();
  } else {
    console.warn('Failed to delete non-existing annot with xml:id ', xmlId);
  }
}

/**
 * Copies id of current inline annotation to clipboard
 * @param {Event} e event
 */
export function copyIdToClipboard(e) {
  console.log('Attempting to copy ID to clipboard: ', e);
  navigator.clipboard.writeText(e.target.closest('.icon').dataset.id).catch((err) => {
    console.warn("Couldn't copy id to clipboard: ", err);
  });
}

//#endregion

//#region Functions to write annotations to standoff or inline

/**
 * Writes an annotation as inline <annot> element into the MEI file if requested.
 * @param {Object} a annotation object
 */
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

/**
 * Writes an annotation as standoff web annotation in the user's Solid Pod if requested.
 * @param {Object} a annotation object
 */
async function writeStandoffIfRequested(a) {
  // write to a stand-off Web Annotation in the user's Solid Pod if requested
  if (document.getElementById('writeAnnotationStandoff').checked) {
    a.isStandoff = true;
    if (solid.getDefaultSession().info.isLoggedIn) {
      document.getElementById('solid_logo').classList.add('clockwise');
      let currentFileUri = getCurrentFileUri();
      let currentFileUriHash = encodeURIComponent(currentFileUri);
      // ensure mei-friend container exists
      establishContainerResource(friendContainer)
        .then((friendContainerResource) => {
          establishContainerResource(annotationContainer).then((annotationContainerResource) => {
            establishDiscoveryResource(currentFileUri)
              .then((dataCatalogResource) => {
                let discoveryUri = dataCatalogResource.url;
                // generate a web annotation JSON-LD object
                let webAnno = new Object();
                let body = new Object();
                webAnno['@type'] = [nsp.OA + 'Annotation', nsp.SCHEMA + 'Dataset'];
                webAnno[nsp.SCHEMA + 'includedInDataCatalog'] = { '@id': discoveryUri };
                webAnno[nsp.OA + 'hasTarget'] = a.selection.map((s) => {
                  // TODO: do something clever if fileLocationType = "file" (local)
                  return { '@id': currentFileUri + '#' + s };
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
                    // remember new resource URI within internal annotation, for use when refreshing annotation list
                    a.standoffUri = webAnno['@id'];
                    // update current annotation list item in DOM as well (so we can already click before anno list refresh required)
                    let standoffIcon = document.querySelector(`#${a.id} .makeStandOffAnnotation`);
                    standoffIcon.href = a.standoffUri;
                    standoffIcon.target = '_blank';
                    // patch the discovery resource to include the newly created annotation
                    safelyPatchResource(discoveryUri, [
                      {
                        op: 'add',
                        // escape ~ and / characters according to JSON POINTER spec
                        // use '-' at end of path specification to indicate new array item to be created
                        path: `/${nsp.SCHEMA.replaceAll('~', '~0').replaceAll('/', '~1')}dataset/-`,
                        value: {
                          '@type': `${nsp.SCHEMA}Dataset`,
                          [`${nsp.SCHEMA}additionalType`]: { '@id': `${nsp.OA}Annotation` },
                          [`${nsp.SCHEMA}url`]: {
                            '@id': webAnno['@id'],
                          },
                        },
                      },
                    ]);
                  } else {
                    console.warn("Couldn't post WebAnno: ", webAnno, webAnnoResp);
                    throw webAnnoResp;
                  }
                });
              })
              .catch((e) => {
                console.error("Couldn't post WebAnno:", e);
              });
          });
        })
        .catch((e) => {
          console.error("Couldn't establish container:", friendContainer, e);
        })
        .finally(() => {
          document.getElementById('solid_logo').classList.remove('clockwise');
        });
    } else {
      log('Cannot write standoff annotation: Please ensure you are logged in to a Solid Pod');
    }
  }
}

//#endregion

//#region Web Annotation stuff

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
      standoffUri: webAnno['@id'],
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
          nsp.RDF + 'value' in firstBody &&
          firstBody['@type'].includes(nsp.OA + 'TextualBody')
        ) {
          // declare a describing annotation
          console.log('Declaring a describing annotation!');
          anno.description = firstBody[nsp.RDF + 'value'][0]['@value'];
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
    anno.isStandoff = true;
    addListItem(anno, true);
    refreshAnnotations(true);
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

//#endregion
