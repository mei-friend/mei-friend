import {
  v,
  cm
} from './main.js';
import {
  convertCoords,
  generateUUID,
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
  flipToEncoding,
  link,
  pencil,
  rdf,
  symLinkFile,
} from '../css/icons.js';

let annotations = [];

export function refreshAnnotationsList() {
  situateAnnotations();
  const list = document.getElementById("listAnnotations");
  // clear list
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  // add web annotation button
  const addWebAnnotation = document.createElement("div");
  const rdfIcon = document.createElement("span");
  addWebAnnotation.textContent = "Load Web Annotation(s)";
  rdfIcon.id = "addWebAnnotationIcon";
  rdfIcon.insertAdjacentHTML("beforeend", rdf);
  addWebAnnotation.appendChild(rdfIcon);
  addWebAnnotation.id = "addWebAnnotation";
  addWebAnnotation.addEventListener("click", () => loadWebAnnotation());
  list.appendChild(addWebAnnotation);
  list.insertAdjacentHTML("beforeend", annotations.length ? "" : "<p>No annotations present.</p>");
  annotations.forEach((a, aix) => {
    const annoDiv = document.createElement("div");
    annoDiv.classList.add("annotationListItem");
    const details = document.createElement("details");
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
    let annotationLocationLabel = '';
    if (a.firstPage === 'meiHead') {
      annotationLocationLabel = `MEI head (${a.selection.length} elements)`;
    } else if (a.firstPage === 'unsituated') {
      annotationLocationLabel = 'Unsituated';
    } else {
      annotationLocationLabel = 'p. ' + (a.firstPage === a.lastPage ?
          a.firstPage : a.firstPage + "&ndash;" + a.lastPage) +
        `(${a.selection.length} elements)`;
    }
    summary.insertAdjacentHTML("beforeend", annotationLocationLabel);
    flipToAnno.addEventListener("click", (e) => {
      console.debug("Flipping to annotation: ", a);
      v.updatePage(cm, a.firstPage);
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

// call whenever layout reflows to re-situate annotations appropriately
export function situateAnnotations() {
  annotations.forEach(a => {
    // for each element in a.selection, ask Verovio for the page number
    // set a.firstPage and a.lastPage to min/max page numbers returned
    a.firstPage = 'unsituated';
    a.lastPage = -1;
    if ('selection' in a) {
      a.firstPage = v.getPageWithElement(a.selection[0]);
      a.lastPage = v.getPageWithElement(a.selection[a.selection.length - 1]);
      if (a.firstPage < 0) {
        if (v.xmlDoc.querySelector('[*|id=' + a.selection[0] + ']').closest('meiHead')) a.firstPage = 'meiHead';
        else console.warn('Cannot locate annotation ', a);
      }
    }
  })
}

export function deleteAnnotation(uuid) {
  const ix = annotations.findIndex(a => a.id === uuid);
  if (ix >= 0) {
    annotations.splice(ix, 1);
    refreshAnnotationsList();
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
export function refreshAnnotations() {
  // clear rendered annotations container
  const rac = document.getElementById("renderedAnnotationsContainer");
  rac.innerHTML = "";
  // reset annotations-containing svg
  const scoreSvg = document.querySelector(".verovio-panel svg");
  if (!scoreSvg) return;
  const annoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  annoSvg.setAttribute("width", scoreSvg.getAttribute("width"))
  annoSvg.setAttribute("height", scoreSvg.getAttribute("height"))
  annoSvg.setAttribute("id", "renderedAnnotationsSvg");
  annoSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  annoSvg.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink");
  rac.appendChild(annoSvg);
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
  refreshAnnotationsList();
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
    refreshAnnotations();
  }

  // functions to create annotations
  const createHighlight = (e) => {
    const a = {
      "id": "annot-" + generateUUID(),
      "type": "annotateHighlight",
      "selection": v.selectedElements
    }
    annotations.push(a);
    writeInlineIfRequested(a);
  }
  const createCircle = (e) => {
    const a = {
      "id": "annot-" + generateUUID(),
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
      "id": "annot-" + generateUUID(),
      "type": "annotateDescribe",
      "selection": v.selectedElements,
      "description": desc
    };
    annotations.push(a);
    writeInlineIfRequested(a);
  })
  const createLink = (e => {
    // TODO improve UX!
    const url = window.prompt("Please enter a url to link to");
    const a = {
      "id": "annot-" + generateUUID(),
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
export function readAnnots() {
  if (!v.xmlDoc) return;
  let annots = Array.from(v.xmlDoc.querySelectorAll('annot'));
  annots = annots.filter(annot => annotations.findIndex(a => a.id !== annot.getAttribute('xml:id')));
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
    annotations.push(annotation);
  });
  refreshAnnotations();
}

// inserts new annot element before beforeThis element into CodeMirror editor,
// with @xml:id, @plist and optional payload (string or ptr)
export function writeAnnot(beforeThis, xmlId, plist, payload) {
  let parent = beforeThis.parentNode;
  if (parent) {
    let annot = document.createElementNS(meiNameSpace, 'annot');
    annot.setAttributeNS(xmlNameSpace, 'id', xmlId);
    annot.setAttribute('plist', plist.map(p => '#' + p).join(' '));
    if (payload) {
      if (typeof payload === 'string') {
        annot.textContent = payload;
      } else if (typeof payload === 'object') {
        annot.appendChild(payload);
      }
    }
    parent.insertBefore(annot, beforeThis);

    setCursorToId(cm, beforeThis.getAttribute('id'));
    let p1 = cm.getCursor();
    cm.replaceRange(xmlToString(annot) + '\n', p1);
    let p2 = cm.getCursor();
    while (p1.line <= p2.line)
      cm.indentLine(p1.line++, 'smart');
  }
}

export function loadWebAnnotation() {
  // spin the icon to indicate loading activity
  const url = window.prompt("Enter URL of Web Annotation or Web Annotation Container");
  fetchWebAnnotations(url);
}

export function fetchWebAnnotations(url, jumps = 10) {
  const icon = document.getElementById("addWebAnnotationIcon");
  const svgs = Array.from(icon.getElementsByTagName("svg"));
  svgs.forEach(t => t.classList.add("clockwise"));
  fetch(url, {
      headers: {
        'Accept': 'application/ld+json'
      }
    }).then((resp) => resp.json())
    .then((json) => {
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
                fetchWebAnnotations(resource["@id"], jumps);
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
    })
    .catch((err) => console.warn("Couldn't load Web Annotation: ", err))
    .finally(() => {
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
    let el = document.querySelector('[*|id="' + v.selectedElements[0] + '"]');
    if (el) {
      let payload;
      if (a.type === "annotateDescribe") payload = a.description
      else if (a.type === "annotateLink") {
        payload = document.createElementNS(meiNameSpace, "ptr");
        payload.id = "ptr-" + generateUUID();
        payload.setAttribute("target", a.url);
      }
      writeAnnot(el, a.id, a.selection, payload)
      a.inline = true;
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
