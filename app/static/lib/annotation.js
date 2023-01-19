import {
  v,
  cm,
  log
} from './main.js';
import {
  convertCoords,
  generateXmlId,
  rmHash,
  setCursorToId
} from './utils.js';
import {
  meiNameSpace,
  xmlNameSpace,
  xmlToString
} from './dom-utils.js';
import {
  circle,
  diffRemoved,
  highlight,
  fileCode,
  link,
  pencil,
  rdf,
  symLinkFile,
} from '../css/icons.js';
import {
  removeInEditor
} from './editor.js';

export let annotations = [];

export function situateAndRefreshAnnotationsList(forceRefresh = false) {
  situateAnnotations();
  if (forceRefresh || !document.getElementsByClassName('annotationListItem').length)
    refreshAnnotationsList();
}

export function refreshAnnotationsList() {
  const list = document.getElementById("listAnnotations");
  // clear list
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  // console.log("Annotations: ",annotations);

  // add web annotation button
  const addWebAnnotation = document.createElement("span");
  const rdfIcon = document.createElement("span");
  addWebAnnotation.textContent = "Load Web Annotation(s)";
  rdfIcon.id = "addWebAnnotationIcon";
  rdfIcon.insertAdjacentHTML("beforeend", rdf);
  addWebAnnotation.appendChild(rdfIcon);
  addWebAnnotation.id = "addWebAnnotation";
  addWebAnnotation.addEventListener("click", () => loadWebAnnotation());
  list.appendChild(addWebAnnotation);
  list.insertAdjacentHTML("beforeend", annotations.length ? "" : "<p>No annotations to display.</p>");
  annotations.forEach((a, aix) => {
    const annoDiv = document.createElement("div");
    annoDiv.classList.add("annotationListItem");
    const details = document.createElement("details");
    details.setAttribute("open", "");
    const summary = document.createElement("summary");
    const annoListItemButtons = document.createElement("div");
    annoListItemButtons.classList.add("annotationListItemButtons");
    const flipToAnno = document.createElement("a");
    flipToAnno.insertAdjacentHTML("afterbegin", symLinkFile); //flipToEncoding;
    flipToAnno.title = "Flip page to this annotation";
    flipToAnno.classList.add('icon');
    if (!'selection' in a) flipToAnno.classList.add('disabled');
    const deleteAnno = document.createElement("a");
    deleteAnno.insertAdjacentHTML("afterbegin", diffRemoved);
    deleteAnno.title = "Delete this annotation";
    const isStandoff = document.createElement("a");
    isStandoff.insertAdjacentHTML("afterbegin", rdf);
    isStandoff.title = "Stand-off status (Web Annotation)";
    isStandoff.classList.add('icon');
    isStandoff.style.filter = "grayscale(100%)";
    if (!a.isStandoff) {
      isStandoff.title = "Write to Solid as Web Annotation";
      isStandoff.style.opacity = 0.3;
    } else {
      isStandoff.title = "Copy Web Annotation URI to clipboard: ", a.id;
      isStandoff.dataset.id = a.id;
      isStandoff.addEventListener("click", copyIdToClipboard);
    }
    const isInline = document.createElement("a");
    isInline.insertAdjacentHTML("afterbegin", fileCode);
    isInline.classList.add('icon');
    isInline.style.fontFamily = "monospace";
    if (!a.isInline) {
      isInline.title = "Click to in-line annotation";
      isInline.style.opacity = 0.3;
    } else {
      isInline.title = "Copy <annot> xml:id to clipboard: [" + a.id + "]";
      isInline.dataset.id = a.id;
      isInline.addEventListener("click", copyIdToClipboard);
    }
    switch (a.type) {
      case 'annotateHighlight':
        summary.insertAdjacentHTML("afterbegin", highlight);
        break;
      case 'annotateCircle':
        summary.insertAdjacentHTML("afterbegin", circle);
        break;
      case 'annotateLink':
        summary.insertAdjacentHTML("afterbegin", link);
        details.insertAdjacentHTML("afterbegin", a.url);
        break;
      case 'annotateDescribe':
        summary.insertAdjacentHTML("afterbegin", pencil);
        details.insertAdjacentHTML("afterbegin", a.description);
        break;
      default:
        console.warn("Unknown type when drawing annotation in list: ", a);
    }
    const annotationLocationLabel = generateAnnotationLocationLabel(a);
    summary.appendChild(annotationLocationLabel);
    flipToAnno.addEventListener("click", (e) => {
      console.debug("Flipping to annotation: ", a);
      v.updatePage(cm, a.firstPage, a.id);
      setCursorToId(cm, a.id);
    });
    deleteAnno.addEventListener("click", (e) => {
      const reallyDelete = confirm("Are you sure you wish to delete this annotation?");
      if (reallyDelete) {
        deleteAnnotation(a.id);
      }
    });
    if (!details.innerHTML.length) {
      // some annotation types don't have any annotation body to display
      summary.classList.add("noDetails");
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
  const annotationLocationLabel = document.createElement("span");
  if (a.firstPage === 'meiHead') {
    annotationLocationLabel.innerHTML = `MEI&nbsp;head&nbsp;(${a.selection.length}&nbsp;elements)`;
  } else if (a.firstPage === 'unsituated' || a.firstPage < 0) {
    annotationLocationLabel.innerHTML = 'Unsituated';
  } else {
    annotationLocationLabel.innerHTML = 'p.&nbsp;' + (a.firstPage === a.lastPage ?
      a.firstPage : a.firstPage + "&ndash;" + a.lastPage) +
      ` (${a.selection.length}&nbsp;elements)`;
  }
  annotationLocationLabel.classList.add("annotationLocationLabel");
  annotationLocationLabel.dataset.id = a.id;
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
      a.firstPage = await v.getPageWithElement(a.selection[0]);
      a.lastPage = await v.getPageWithElement(a.selection[a.selection.length - 1]);
      if (a.firstPage < 0 && v.speedMode) {
        if (v.xmlDoc.querySelector('[*|id=' + a.selection[0] + ']')?.closest('meiHead')) a.firstPage = 'meiHead';
        else console.warn('Cannot locate annotation ', a);
      } else { // if not speedmode, asynchronous return of page numbers after we are finished here
        const annotationLocationLabelElement = document.querySelector(`.annotationLocationLabel[data-id=${a.id}`);
        if (annotationLocationLabelElement) {
          annotationLocationLabelElement.innerHTML = generateAnnotationLocationLabel(a).innerHTML;
        }
      }
    }
  })
} // situateAnnotations()

export function deleteAnnotation(uuid) {
  const ix = annotations.findIndex(a => a.id === uuid);
  if (ix >= 0) {
    annotations.splice(ix, 1);
    deleteAnnot(uuid);
    situateAndRefreshAnnotationsList(true);
    refreshAnnotations();
  }
}

// functions to draw annotations
function drawHighlight(a) {
  if ("selection" in a) {
    const els = a.selection.map(s => document.getElementById(s));
    els.filter(e => e !== null) // (null if not on current page)
      .forEach(e => e.classList.add("annotationHighlight"));
  } else {
    console.warn("failing to draw highlight annotation without selection: ", a);
  }
}

function drawCircle(a) {
  if ("selection" in a) {
    // mission: draw an ellipse into the raSvg that encompasses a collection of selection objects
    let raSvg = document.querySelector('#renderedAnnotationsSvg');
    // find bounding boxes of all selected elements on page:
    const bboxes = a.selection.map(s => convertCoords(document.getElementById(s)));
    // determine enveloping bbox
    const minX = Math.min(...bboxes.map((b) => b.x));
    const minY = Math.min(...bboxes.map((b) => b.y));
    const maxX2 = Math.max(...bboxes.map((b) => b.x2));
    const maxY2 = Math.max(...bboxes.map((b) => b.y2));
    // now create our ellipse
    const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse")
    ellipse.setAttribute("cx", (minX + maxX2) / 2)
    ellipse.setAttribute("cy", (minY + maxY2) / 2)
    // Add padding so we don't circle too tightly -- but not too much!
    const paddedRx = Math.min((maxX2 - minX) / 1.6, maxX2 - minX + 20)
    const paddedRy = Math.min((maxY2 - minY) / 1.3, maxY2 - minY + 20)
    ellipse.setAttribute("rx", paddedRx)
    ellipse.setAttribute("ry", paddedRy)
    ellipse.classList.add("highlightEllipse");
    raSvg.appendChild(ellipse);
  } else {
    console.warn("Failing to draw circle annotation without selection: ", a);
  }

}

function drawDescribe(a) {
  if ("selection" in a && "description" in a) {
    const els = a.selection.map(s => document.getElementById(s));
    els.filter(e => e !== null) // (null if not on current page)
      .forEach(e => {
        e.classList.add("annotationDescribe");
        // create a title element within the described element to house the description (which will be available on hover)
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.innerHTML = a.description;
        // slot it in as the first child of the selected element
        e.insertBefore(title, e.firstChild);
      });
  } else {
    console.warn("Failing to draw describe annotation missing selection and/or description: ", a);
  }
}

function drawLink(a) {
  if ("selection" in a && "url" in a) {
    const els = a.selection.map(s => document.getElementById(s));
    els.filter(e => e !== null) // (null if not on current page)
      .forEach(e => {
        e.classList.add("annotationLink");
        // create a title element within the linked element to house the url (which will be available on hover)
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.innerHTML = "Open in new tab: " + a.url;
        // slot it in as the first child of the selected element
        e.insertBefore(title, e.firstChild);
        // make the element clickable
        e.addEventListener("click", () => window.open(a.url, "_blank"), true);
      });
  } else {
    console.warn("Failing to draw link annotation missing selection and/or url: ", a);
  }
}

// Draws annotations in Verovio notation panel
export function refreshAnnotations(forceListRefresh = false) {
  // clear rendered annotations container
  const rac = document.getElementById("renderedAnnotationsContainer");
  rac.innerHTML = "";
  // reset annotations-containing svg
  const scoreSvg = document.querySelector("#verovio-panel svg");
  if (!scoreSvg) return;
  const annoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  annoSvg.setAttribute("width", scoreSvg.getAttribute("width"))
  annoSvg.setAttribute("height", scoreSvg.getAttribute("height"))
  annoSvg.setAttribute("id", "renderedAnnotationsSvg");
  annoSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  annoSvg.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink");
  rac.appendChild(annoSvg);
  if (document.getElementById('showAnnotations').checked) {
    // drawing handlers can draw into renderedAnnotationsSvg if they need to
    annotations.forEach(a => {
      if ("type" in a) {
        switch (a.type) {
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
        console.warn("Skipping annotation without type: ", a);
      }
    });
  }
  situateAndRefreshAnnotationsList(forceListRefresh);
}

export function addAnnotationHandlers() {
  // TODO extend this to allow app to consume (TROMPA-style) Annotation Toolkit descriptions

  const annotationHandler = (e) => {
    console.log("Clicked to make new annotation!", e);
    console.log("Selected elements: ", v.selectedElements);
    switch (e.target.getAttribute("id")) {
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
  }

  // functions to create annotations
  const createHighlight = (e) => {
    const a = {
      "id": generateXmlId('annot', v.xmlIdStyle),
      "type": "annotateHighlight",
      "selection": v.selectedElements
    }
    annotations.push(a);
    writeInlineIfRequested(a);
  }
  const createCircle = (e) => {
    const a = {
      "id": generateXmlId('annot', v.xmlIdStyle),
      "type": "annotateCircle",
      "selection": v.selectedElements
    }
    annotations.push(a);
    writeInlineIfRequested(a);
  }
  const createDescribe = (e => {
    // TODO improve UX!
    const desc = window.prompt("Please enter a textual description to apply");
    const a = {
      "id": generateXmlId('annot', v.xmlIdStyle),
      "type": "annotateDescribe",
      "selection": v.selectedElements,
      "description": desc
    };
    annotations.push(a);
    writeInlineIfRequested(a);
  })
  const createLink = (e => {
    // TODO improve UX!
    let url = window.prompt("Please enter a url to link to");
    if (!url.startsWith("http"))
      url = "https://" + url;
    const a = {
      "id": generateXmlId('annot', v.xmlIdStyle),
      "type": "annotateLink",
      "selection": v.selectedElements,
      "url": url
    }
    annotations.push(a);
    writeInlineIfRequested(a);
  })

  document.querySelectorAll(".annotationToolsIcon").forEach(a => a.removeEventListener("click", annotationHandler));
  document.querySelectorAll(".annotationToolsIcon").forEach(a => a.addEventListener("click", annotationHandler));
}

// reads <annot> elements from XML DOM and adds them into annotations array
export function readAnnots(flagLimit = false) {
  if (!v.xmlDoc) return;
  let annots = Array.from(v.xmlDoc.querySelectorAll('annot'));
  annots = annots.filter(annot => annotations.findIndex(a => a.id !== annot.getAttribute('xml:id')));
  let limit = document.getElementById('annotationDisplayLimit');
  if (limit && annots.length > limit.value) {
    if (flagLimit) {
      v.showAlert('Number of annot elements exceeds configurable "Maximum number of annotations" (' +
        limit.value +
        '). New annotations can still be generated and will be displayed if "Show annotations" is set.',
        'warning', -1);
    }
    return;
  }
  annots.forEach(annot => {
    let annotation = {};
    if (annot.textContent) {
      const ptrs = annot.getElementsByTagNameNS(meiNameSpace, "ptr");
      if (ptrs.length) {
        console.log(ptrs)
        annotation.type = "annotateLink";
        console.log("ptrs: ", ptrs)
        annotation.url = ptrs[0].getAttribute("target");
      } else {
        annotation.type = "annotateDescribe"
        annotation.description = annot.textContent;
      }
    } else
      annotation.type = "annotateHighlight";
    if (annot.hasAttribute('plist')) {
      annotation.selection = annot.getAttribute('plist').split(' ').map(id => rmHash(id));
    } else if (annot.parentNode.hasAttribute('xml:id')) {
      annotation.selection = [annot.parentNode.getAttribute('xml:id')];
    } else {
      console.warn('readAnnots(): found annot without id ', annot);
    }
    if (annot.hasAttributeNS(xmlNameSpace, "id")) {
      annotation.id = annot.getAttributeNS(xmlNameSpace, "id")
    } else {
      annotation.id = "None";
    }
    annotation.isInline = true;
    if (annotations.findIndex(a => a.id === annotation.id) === -1) {
      // only if not already included
      // FIXME: will ignore all but the first annotation without xml:id
      annotations.push(annotation);
    } else { }
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
  if (anchor.closest("supplied"))
    insertHere = anchor.closest("supplied")
  else if (anchor.closest("layer"))
    insertHere = anchor.closest("layer")
  else if (anchor.closest("measure"))
    insertHere = anchor.closest("measure")
  else if (anchor.closest("section"))
    insertHere = anchor.closest("section")
  else if (anchor.closest("score"))
    insertHere = anchor.closest("score")
  else {
    console.error("Sorry, cannot currently write annotations placed outside <score>");
    v.showAlert("Sorry, cannot currently write annotations placed outside &lt;score&gt;", "warning", 5000);
    // remove from list
    deleteAnnotation(xmlId)
    return;
  }
  if (insertHere) {
    // trz to add our annotation at beginning of insertHere element's list of children:
    // find first non-text child with an identifier
    const firstChildNode = Array.from(insertHere.childNodes)
      .filter(c => c.nodeType !== Node.TEXT_NODE)
      .filter(c => c.hasAttribute("xml:id"))[0]
    if (firstChildNode) {
      // set cursor based on it
      setCursorToId(cm, firstChildNode.getAttribute("xml:id"))
      let annot = document.createElementNS(meiNameSpace, 'annot');
      annot.setAttributeNS(xmlNameSpace, 'xml:id', xmlId);
      annot.setAttribute('plist', plist.map(p => '#' + p).join(' '));
      if (payload) {
        if (typeof payload === 'string') {
          annot.textContent = payload;
        } else if (typeof payload === 'object') {
          annot.appendChild(payload);
        }
      }
      // insert <annot> into the DOM
      insertHere.insertAdjacentElement("afterbegin", annot);
      // now write it into CM
      let p1 = cm.getCursor();
      cm.replaceRange(xmlToString(annot) + '\n', p1);
      let p2 = cm.getCursor();
      // indent nicely
      while (p1.line <= p2.line)
        cm.indentLine(p1.line++, 'smart');
      // jump to the written <annot> in CM
      setCursorToId(cm, xmlId)
    } else {
      let errMsg = '<p>Cannot write annotation as MEI anchor-point lacks xml:id.</p><p>Please assign identifiers by selecting "Manipulate" -> "Re-render MEI (with ids)" and try again.</p>'
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
    console.warn("Failed to delete non-existing annot with xml:id ", xmlId);
  }
}

export function loadWebAnnotation(prev = "") {
  let msg = "Enter URL of Web Annotation or Web Annotation Container";
  let prevurl = "";
  if (prev) {
    if (prev.status) {
      // response object received
      msg = `Couldn't load URL provided (${prev.status}: ${prev.statusText}), please try again. ${msg}`
      prevurl = prev.url;
    } else {
      // no response object received, e.g. due to CORS network error
      // we have been handed the url string instead
      msg = `Couldn't load URL provided (network error), please try again. ${msg}`
      prevurl = prev;
    }
  }
  let urlstr = window.prompt(msg, prevurl);
  if (urlstr) {
    if (!(urlstr.startsWith("http://") || urlstr.startsWith("https://")))
      urlstr = "https://" + urlstr;
    fetchWebAnnotations(urlstr);
  }
}

export function fetchWebAnnotations(url, userProvided = true, jumps = 10) {
  // spin the icon to indicate loading activity
  const icon = document.getElementById("addWebAnnotationIcon");
  const svgs = Array.from(icon.getElementsByTagName("svg"));
  svgs.forEach(t => t.classList.add("clockwise"));
  fetch(url, {
    headers: {
      'Accept': 'application/ld+json'
    }
  }).then((resp) => {
    if (resp.status >= 400) {
      throw Error(resp);
    } else {
      return resp.json()
    }
  }).then((json) => {
    console.log("json response: ", json)
    let resourceDescription;
    if (Array.isArray(json)) {
      resourceDescription = json.find(o => o["@id"] === url);
      if (!resourceDescription && !url.endsWith("/")) {
        // try again with trailing slash
        resourceDescription = json.find(o => o["@id"] === url + "/");
      }
    } else {
      resourceDescription = json;
    }
    if (resourceDescription && "@type" in resourceDescription) {
      console.log("found resource desc: ", resourceDescription)
      if (resourceDescription["@type"].includes("http://www.w3.org/ns/ldp#Container")) {
        // found a container, recurse on members
        if ("http://www.w3.org/ns/ldp#contains" in resourceDescription) {
          if (jumps >= 0) {
            return resourceDescription["http://www.w3.org/ns/ldp#contains"].map(resource => {
              jumps -= 1;
              fetchWebAnnotations(resource["@id"], false, jumps);
            });
          } else {
            console.warn("Prematurely ending traversal as out of jumps", url);
          }
        } else {
          console.warn("Container without content: ", url, resourceDescription);
        }
      } else if (resourceDescription["@type"].includes("http://www.w3.org/ns/oa#Annotation")) {
        // found an annotation!
        console.log("Found annotation!!", resourceDescription);
        ingestWebAnnotation(resourceDescription);
        return resourceDescription;
      } else {
        console.warn("fetchWebAnnotations: Don't know how to handle resource: ", url, resourceDescription);
      }
    } else {
      console.warn("Problem working with the specified resource identifier in requested resource: ", url, json);
    }
  }).catch((resp) => {
    if (userProvided) {
      console.error("Couldn't load web annotation, error response: ", resp);
      // user-provided url didn't work, so hand control back to user
      if (resp.url)
        loadWebAnnotation(resp)
      else
        loadWebAnnotation(url)
    }
  }).finally(() => {
    // notify that we've stopped loading
    svgs.forEach(t => t.classList.remove("clockwise"));
  });
}

export function ingestWebAnnotation(webAnno) {
  // terminological note: 'webAnno' => the web annotation, 'anno' => internal mei-friend annotation we are generating
  if (!("http://www.w3.org/ns/oa#hasTarget" in webAnno)) {
    console.warn("Skipping Web Annotation without a target: ", webAnno);
    return;
  } else {
    let anno = {
      id: webAnno["@id"]
    }
    let targets = webAnno["http://www.w3.org/ns/oa#hasTarget"];
    if (!Array.isArray(targets))
      targets = [targets];
    anno.type = "annotateHighlight"; // default type
    let bodies = webAnno["http://www.w3.org/ns/oa#hasBody"];
    if (bodies && !Array.isArray(bodies))
      bodies = [bodies];
    if (bodies && bodies.length) {
      // TODO decide what to do for multiple bodies
      let firstBody = bodies[0];
      if (typeof firstBody === "object") {
        if ("@id" in firstBody) {
          console.log("Declaring a linking annotation!");
          // decare a linking annotation
          anno.url = firstBody["@id"];
          anno.type = "annotateLink";
        } else if ("@type" in firstBody &&
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#value" in firstBody &&
          "http://www.w3.org/ns/oa#TextualBody" in firstBody["@type"]) {
          // declare a describing annotation
          console.log("Declaring a describing annotation!");
          anno.description = firstBody["http://www.w3.org/1999/02/22-rdf-syntax-ns#"];
          anno.type = "annotateDescribe";
        } else {
          console.log("Don't know how to handle body of this annotation: ", anno);
        }
      }
    } else if ("http://www.w3.org/ns/oa#bodyValue" in webAnno) {
      // declare describing annotation
      console.log("Declaring a describing annotation!");
      // TODO decide what to do for multiple bodies
      anno.description = webAnno["http://www.w3.org/ns/oa#bodyValue"][0]["@value"];
      anno.type = "annotateDescribe";
    }

    console.log("Annotations: ", annotations);
    console.log("Anno: ", anno);
    anno.selection = targets.map(t => t["@id"].split("#")[1]);
    if (annotations.findIndex(a => a.id === anno.id) < 0) {
      // add to list if we don't already have it
      anno.isStandoff = true;
      annotations.push(anno);
    }
    refreshAnnotations();
  }
}

function writeInlineIfRequested(a) {
  // write annotation to inline <annot> if the user has requested this
  if (document.getElementById('writeAnnotInline').checked) {
    let el = v.xmlDoc.querySelector('[*|id="' + v.selectedElements[0] + '"]');
    if (el) {
      let payload;
      if (a.type === "annotateDescribe") payload = a.description
      else if (a.type === "annotateLink") {
        payload = document.createElementNS(meiNameSpace, "ptr");
        payload.setAttributeNS(xmlNameSpace, 'xml:id', 'ptr-' + generateXmlId());
        payload.setAttribute("target", a.url);
      }
      writeAnnot(el, a.id, a.selection, payload)
      a.isInline = true;
    } else
      console.warn('writeInlineIfRequested: Cannot find beforeThis element for ' + a.id);
  }
}

export function copyIdToClipboard(e) {
  console.log("Attempting to copy ID to clipboard: ", e);
  navigator.clipboard.writeText(e.target.closest(".icon").dataset.id)
    .catch(err => {
      console.warn("Couldn't copy id to clipboard: ", err)
    });
}

export function clearAnnotations() {
  annotations = [];
}