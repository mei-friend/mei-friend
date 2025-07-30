export const meiNameSpace = 'http://www.music-encoding.org/ns/mei';
export const xmlNameSpace = 'http://www.w3.org/XML/1998/namespace';
export const svgNameSpace = 'http://www.w3.org/2000/svg';

export const navElsArray = ['note', 'rest', 'mRest', 'beatRpt', 'halfmRpt', 'mRpt', 'clef'];
export const navElsSelector = '.' + navElsArray.join(',.');

import * as att from './attribute-classes.js';
import * as utils from './utils.js';
import Viewer from './viewer.js';

/**
 * Returns median of coordinate value for a specified axis ('x' or 'y').
 * Checks for notes within coords, navigation elements (navEls),
 * and the position of navigation elements within markup elements.
 * navElsArray = ['note', 'rest', 'mRest', 'beatRpt', 'halfmRpt', 'mRpt', 'clef'];
 * @param {SVGGElement} element svg element
 * @param {string} axis [axis="x|y"]
 * @returns {number}
 */
function getCoordinateValue(element, axis = 'x') {
  if (!element) {
    return false;
  }
  if (axis !== 'x' && axis !== 'y') {
    console.error('getCoordinateValue(): axis must be "x" or "y".');
    return false;
  }
  let values = []; // coordinate values
  let elementClasses = element.getAttribute('class');
  if (elementClasses.includes('chord')) {
    let els = element.querySelectorAll('g.note');
    els.forEach((item) => {
      values.push(getCoordinateValue(item, axis));
    });
  } else if (navElsArray.some((el) => elementClasses.includes(el))) {
    let els = Array.from(element.querySelectorAll('.notehead'));
    if (els.length === 0) {
      els.push(element); // for non-notes
    }
    els.forEach((item) => {
      let bbox = item.getBBox();
      values.push(axis === 'x' ? bbox.x : bbox.y);
    });
  } else if (
    att.alternativeEncodingElements.some((el) => elementClasses.includes(el)) ||
    att.modelTranscriptionLike.some((el) => elementClasses.includes(el))
  ) {
    let els = element.querySelectorAll(navElsSelector);
    els.forEach((item) => {
      values.push(getCoordinateValue(item, axis));
    });
  }
  return utils.median(values);
} // getCoordinateValue()

/**
 * Returns id of first element in measure element.
 * @param {Element} measure
 * @param {string} selector
 * @param {number} stN
 * @param {number} lyN
 * @returns {string} id
 */
export function getFirstInMeasure(measure, selector, stN, lyN) {
  let foundElementId = '';
  let staff = measure.querySelector('.staff[data-n="' + stN + '"]');
  // console.info('getFirstInMeasure: staff ', staff);
  if (staff) {
    let el;
    let layer = staff.querySelector('.layer[data-n="' + lyN + '"]');
    // console.info('getFirstInMeasure: layer ', layer);
    if (layer) {
      el = layer.querySelector(selector);
    } else {
      el = staff.querySelector(selector);
    }
    // console.info('getFirstInMeasure: el ', el);
    if (el) foundElementId = el.getAttribute('id');
  }
  return foundElementId;
} // getFirstInMeasure()

/**
 * Returns id in next (dir = backwards/forwards) measure, at same staff and/or
 * layer if existent (otherwise in same staff)
 * @param {Element} currEl
 * @param {string} [dir="backwards|forwards"]
 * @param {number} [stN=0]
 * @param {number} [lyN=0]
 * @returns {string} id
 */
export function getIdInNextMeasure(currEl, dir = 'forwards', stN = 0, lyN = 0) {
  let measureList = Array.from(document.querySelectorAll('.measure'));
  if (dir.startsWith('back')) measureList.reverse();
  let measure = currEl.closest('.measure');
  if (lyN === 0) lyN = currEl.closest('.layer').getAttribute('data-n');
  if (stN === 0) stN = currEl.closest('.staff').getAttribute('data-n');
  let found = false;
  for (let m of measureList) {
    // console.info('getIdInNextMeasure ' + dir + ', m: ', m);
    if (found) {
      if (dir === 'backwards') return getLastInMeasure(m, navElsSelector, stN, lyN);
      // forwards, back
      else return getFirstInMeasure(m, navElsSelector, stN, lyN);
    }
    if (m.getAttribute('id') === measure.getAttribute('id')) found = true;
  }
} // getIdInNextMeasure()

/**
 * Scans through SVG starting from element to find next element elementName
 * (e.g. 'note'), within same staff and layer
 * @param {Element} currEl
 * @param {string} [dir='forwards|backwards']
 * @param {string} sel
 * @param {string} incr
 * @returns
 */
export function getIdOfNextSvgElement(currEl, dir = 'forwards', sel = navElsSelector, incr = 'all') {
  let measure = currEl.closest('.measure');
  let st = currEl.closest('.staff');
  let stN = 1;
  let lyN = 1;
  if (!st) {
    return dir === 'forwards'
      ? getLastInMeasure(measure, navElsSelector, stN, lyN)
      : getFirstInMeasure(measure, navElsSelector, stN, lyN);
  }
  stN = st.getAttribute('data-n');
  let layer = currEl.closest('.layer');
  if (layer) lyN = layer.getAttribute('data-n');
  let currChord = currEl.closest('.chord');
  let currChordId = '';
  if (currChord) currChordId = currChord.getAttribute('id');
  if (incr === 'measure' && dir === 'forwards') return getIdInNextMeasure(currEl, dir, stN, lyN);
  if (incr === 'measure' && dir === 'backwards') {
    let firstId = getFirstInMeasure(measure, navElsSelector, stN, lyN);
    let currId = currEl.getAttribute('id');
    if (currChord) currId = currChordId;
    let firstChord = document.querySelector('g#' + utils.escapeXmlId(firstId)).closest('.chord');
    if (firstChord) firstId = firstChord.getAttribute('id');
    if (currId === firstId) {
      let id = getIdInNextMeasure(currEl, dir.substring(0, 4), stN, lyN);
      console.info('getIdOfNextElement ' + dir.substring(0, 4) + ', ' + stN + '/' + lyN + ', id: ' + id);
      return id;
    } else return firstId;
  }
  let id = '';
  let elementList = Array.from(measure.querySelectorAll(sel));
  if (dir === 'backwards') elementList.reverse();
  // console.info("getIdOfNextSvgElement: elementList ", elementList);
  let found = false;
  for (let i of elementList) {
    // go thru all elements on page
    if (
      found &&
      i.closest('.staff').getAttribute('data-n') === stN &&
      i.closest('.layer') &&
      i.closest('.layer').getAttribute('data-n') === lyN
    ) {
      let ch = i.closest('.chord'); // ignore tones of same chord
      if (ch && ch.getAttribute('id') === currChordId) continue;
      id = i.getAttribute('id'); // if layer-matched -- wonderful!
      break;
    }
    if (i.getAttribute('id') === currEl.getAttribute('id')) found = true;
  }
  if (id) {
    console.info('getIdOfNextSvgElement: staff/layer-matched id: ' + id);
    return id;
  } else {
    id = getIdInNextMeasure(currEl, dir, stN, lyN);
    console.info('getIdOfNextSvgElement: empty string for ' + currEl.getAttribute('id') + ', ' + dir + '; new: ' + id);
    return id;
  }
} // getIdOfNextSvgElement()

/**
 * Returns id string of requested element having the properties
 * specified in the parameters.
 * Wrapper for getFirstInMeasure and getLastInMeasure.
 * @param {Element} measure
 * @param {string} selector
 * @param {number} stN
 * @param {number} lyN
 * @param {string} [what="first|last"]
 * @returns {string} id
 */
export function getInMeasure(measure, selector, stN, lyN, what = '') {
  if (what === 'first') return getFirstInMeasure(measure, selector, stN, lyN);
  if (what === 'last') return getLastInMeasure(measure, selector, stN, lyN);
} // getInMeasure()

/**
 * Returns id of last element in measure element.
 * @param {Element} measure
 * @param {string}} selector
 * @param {number} stN
 * @param {number} lyN
 * @returns
 */
export function getLastInMeasure(measure, selector, stN, lyN) {
  let foundElementId = '';
  let staff = measure.querySelector('.staff[data-n="' + stN + '"]');
  // console.info('getLastInMeasure staff: ', staff);
  if (staff) {
    let els;
    let layer = staff.querySelector('.layer[data-n="' + lyN + '"]');
    // console.info('layer: ', layer);
    if (layer) {
      els = layer.querySelectorAll(selector);
    } else {
      els = staff.querySelectorAll(selector);
    }
    if (els && els.length > 0) foundElementId = els[els.length - 1].getAttribute('id');
    // console.info('els: ', els);
  }
  return foundElementId;
} // getLastInMeasure()

/*
AP 27.12.2023
To change getX to retrieve X positions for markup, I refactored getX() and getY():
1. Both functions are nearly identical. Logic is moved to getCoordinateValue().
  getX() and getY() both call getCoordinateValue().
  Keeps changes in logic consistent for both axes.
3. getX() had a parameter "what" [what="median|range|array"] to specify the return value:
    if (what === 'median') return median(x);
    if (what === 'range') return Math.max(x) - Math.min(x);
    if (what === 'array') return x;
  This parameter hasn't been used anywhere in the code. I removed it for now.
*/

/**
 * Returns x coordinates of note and noteheads.
 * @param {Element} element
 * @returns {number|array}
 */
export function getX(element) {
  return getCoordinateValue(element, 'x');
} // getX()

/**
 * Returns median of y coordinate of note and noteheads.
 * @param {Element} element
 * @returns {number}
 */
export function getY(element) {
  return getCoordinateValue(element, 'y');
} // getY()

/**
 * Returns the DOM element at encoding cursor position
 * @param {CodeMirror} cm
 * @returns {Element}
 *
 * TODO: to be moved to a CodeMirrorController.js
 */
export function getElementAtCursor(cm) {
  let cursor = cm.getCursor();
  let coords = cm.cursorCoords(
    {
      ch: cursor.ch,
      line: cursor.line,
    },
    'window'
  );
  const elems = document.elementsFromPoint(coords.left, coords.top);
  const inEncoding = elems.filter((el) => el.closest('#encoding'));
  const elem = inEncoding[0];
  return elem;
} // getElementAtCursor()

/**
 * Checks whether a page beginning or system beginning has to be counted as a
 * new page (normally true, and if within an <app>, count only
 * if inside a <lem> or inside first <rdg> or <rdg|source=id)
 * @param {Element} el
 * @param {string} sourceId
 * @returns {boolean}
 */
export function countAsBreak(el, sourceId = '') {
  let app;
  if ((app = el.closest('app'))) {
    let rdgs = app.querySelectorAll('rdg');
    if (
      (rdgs && rdgs.length > 0 && el.closest('lem')) ||
      el.closest('rdg') === rdgs[0] ||
      (el.closest('rdg') && el.closest('rdg').getAttribute('source') === sourceId)
    ) {
      return true;
    }
  } else {
    return true;
  }
  return false;
} // countAsBreak()

/**
 * This function takes an element and a list of ids.
 * It tries to detect adjacent siblings of the initial element
 * which ids are listed in the idArray.
 * It returns an array of adjacent ids.
 *
 * @param {Element} xmlNode initial xml element to check
 * @param {Array} idArray array of possible target elements
 */
export function getAdjacentSiblingElements(xmlNode, idArray) {
  let adjacentElIds = [];
  let directions = ['previous', 'next'];

  let id = xmlNode.getAttribute('xml:id');
  adjacentElIds.push(id);
  idArray.splice(id, 1);

  directions.forEach((dir) => {
    let node = eval('xmlNode.' + dir + 'ElementSibling');
    if (node == null) {
      return;
    }

    while (node) {
      let currentNodeId = node.getAttribute('xml:id');
      if (idArray.includes(currentNodeId)) {
        adjacentElIds.push(currentNodeId);
        idArray.splice(idArray.indexOf(currentNodeId), 1);
        node = eval('node.' + dir + 'ElementSibling');
      } else {
        break;
      }
    }
  });

  return adjacentElIds;
} // getAdjacentSiblingElements()

/**
 * Convert xmlNode to string and remove meiNameSpace declaration from return string
 * @param {Node} xmlNode
 * @returns {string}
 */
export function xmlToString(xmlNode) {
  sortNodeAttributes(xmlNode);
  let str = new XMLSerializer().serializeToString(xmlNode);
  str = str.replace(/(?:><)/g, '>\n<');
  str = str.replace(' xmlns="' + meiNameSpace + '"', '');
  return str;
} // xmlToString()

/**
 * Sort element attributes alphabetically, keeping xml:id first attribute
 * @param {Element} xmlNode
 */
export function sortNodeAttributes(xmlNode) {
  let attributeNames = xmlNode.getAttributeNames();
  attributeNames.splice(attributeNames.indexOf('xml:id'), 1); // remove xmlId from attribute names list
  let attributePairs = attributeNames.map((attName) => [attName, xmlNode.getAttribute(attName)]);
  attributeNames.forEach((attName) => xmlNode.removeAttribute(attName)); // remove all, but xml:id
  attributePairs.sort().forEach((attPair) => xmlNode.setAttribute(attPair.at(0), attPair.at(1)));
} // sortNodeAttributes()

/**
 * Checks xmlDoc for expanding elements and returns an array of arrays
 * @param {Node} xmlDoc
 * @param {string} baseSelector
 * @returns {string[][]}
 */
export function generateExpansionList(xmlDoc, baseSelector = 'music score') {
  let selector = 'section,ending,lem,rdg';
  let expansions = [['No expansion', '']];
  let baseSection = xmlDoc.querySelector(baseSelector);
  if (baseSection) {
    baseSection.querySelectorAll('expansion').forEach((el) => {
      let str = '';
      let parent = el.parentElement.closest(selector);
      if (parent) {
        // str += '│ ';
        while ((parent = parent.parentElement.closest(selector))) str += '│ '; // &#9474;&nbsp; for indentation
      }
      expansions.push([str + el.getAttribute('xml:id'), el.getAttribute('xml:id')]);
    });
  }
  return expansions;
} // generateExpansionList()

/**
 * Returns key signature string for a given note, after DOM traversal in xmlDoc.
 * @param {Node} xmlDoc
 * @param {Element} noteElement
 * @returns {string} data.KEYFIFTHS, such as '3f', '0', or '7s'
 */
export function getKeySigForNote(xmlDoc, noteElement) {
  if (!xmlDoc || !noteElement || !noteElement.hasAttribute('xml:id')) return '';
  let keySigString = '0';
  const sigList = xmlDoc.querySelectorAll('[key\\.sig],[sig],[*|id="' + noteElement.getAttribute('xml:id') + '"]');
  for (const s of sigList) {
    if (s === noteElement) break;
    keySigString = s.getAttribute('key.sig') || s.getAttribute('sig') || '0';
  }
  return keySigString;
} // getKeySigForNote()

/**
 * Returns notes names affected by key signature and
 * the accidental string ('s', 'f', 'n')
 * @param {string} keySigString
 * @returns {Object} affectedNotes, keySigAccid
 * Usage:
 * const { affectedNotes, keySigAccid } = getAffectedNotesFromKeySig('5f')
 */
export function getAffectedNotesFromKeySig(keySigString = '') {
  let affectedNotes = [];
  let keySigAccid = 'n';
  let splitF = keySigString.split('f');
  let splitS = keySigString.split('s');
  if (splitF.length > 1) {
    keySigAccid = 'f';
    affectedNotes = att.flats.slice(0, splitF[0]);
  } else if (splitS.length > 1) {
    keySigAccid = 's';
    affectedNotes = att.sharps.slice(0, splitS[0]);
  }
  return {
    affectedNotes: affectedNotes,
    keySigAccid: keySigAccid,
  };
} // getAffectedNotesFromKeySig()

/**
 * For all nodes with xml:id, replace with new xml:id and repeat for all decendents
 * @param {Node} xmlNode
 * @param {Object} dicIdChanges a dictionary where old to new IDs will be inserted
 */
export function addNewXmlIdsToDescendants(xmlNode, dicIdChanges) {
  if (xmlNode.getAttribute('xml:id')) {
    let newID = utils.generateXmlId(xmlNode.localName, Viewer.xmlIdStyle);
    dicIdChanges[xmlNode.getAttribute('xml:id')] = newID;
    xmlNode.setAttributeNS(xmlNameSpace, 'xml:id', newID);

    if (xmlNode.children.length > 0) {
      for (let child of xmlNode.children) {
        addNewXmlIdsToDescendants(child, dicIdChanges);
      }
    }
  }
} // addNewXmlIdsToDescendants()

/**
 * Checks if the xmlNode has dependen IDs and replaces them with the one found in dicOld2NewIDs
 * @param {*} xmlNode
 * @param {*} dicOld2NewIDs
 */
export function modifyDependenIDs(xmlNode, dicOld2NewIDs) {
  let currentID = utils.rmHash(xmlNode.getAttribute('endid'));
  if (currentID && dicOld2NewIDs[currentID]) {
    xmlNode.setAttribute('endid', '#' + dicOld2NewIDs[currentID]);
  }

  currentID = utils.rmHash(xmlNode.getAttribute('startid'));
  if (currentID && dicOld2NewIDs[currentID]) {
    xmlNode.setAttribute('startid', '#' + dicOld2NewIDs[currentID]);
  }

  if (xmlNode.children.length > 0) {
    for (let child of xmlNode.children) {
      modifyDependenIDs(child, dicOld2NewIDs);
    }
  }
}

/**
 * Scroll DOM element into view inside container element.
 * (Called to scroll SVG and facsimile image into view.)
 * @param {Element} container
 * @param {Element} element
 * @returns {boolean} if scrolled or not
 *
 * TODO: to be moved to a ViewerController.js or Viewer.js
 */
export function scrollTo(container, element) {
  let changed = false;
  let scrollLeft, scrollTop;
  let ctRect = container.getBoundingClientRect();
  let elRect = element.getBBox();
  const mx = element.getScreenCTM(); // element matrix
  const closeToPerc = 0.1; // adjust scrolling only when element (close to or completely) outside

  // kind-of page-wise flipping for x
  let sx = mx.a * (elRect.x + elRect.width / 2) + mx.c * (elRect.y + elRect.height / 2) + mx.e;
  if (sx < ctRect.x + ctRect.width * closeToPerc) {
    scrollLeft = container.scrollLeft - (ctRect.x + ctRect.width * (1 - closeToPerc) - sx);
    changed = true;
  } else if (sx > ctRect.x + ctRect.width * (1 - closeToPerc)) {
    scrollLeft = container.scrollLeft - (ctRect.x + ctRect.width * closeToPerc - sx);
    changed = true;
  }

  // y flipping
  let sy = mx.b * (elRect.x + elRect.width / 2) + mx.d * (elRect.y + elRect.height / 2) + mx.f;
  if (sy < ctRect.y + ctRect.height * closeToPerc || sy > ctRect.y + ctRect.height * (1 - closeToPerc)) {
    scrollTop = container.scrollTop - (ctRect.y + ctRect.height / 2 - sy);
    changed = true;
  }

  if (changed) {
    container.scrollTo({ top: scrollTop, left: scrollLeft, behavior: 'smooth' });
    return true;
  }
  return false;
} // scrollTo()

/**
 * Processes entire xmlDoc element for markup elemenets
 * and adds a color attribute to first level of children
 * @param {Node} xmlNode
 */
export function addColorToMarkupElements(xmlNode) {
  let colorChooserIds = att.modelTranscriptionLike.map((type) => type + 'Color');
  att.modelTranscriptionLike.forEach((type, index) => {
    xmlNode.querySelectorAll(type).forEach((element) => {
      let children = element.children;
      if (children.length > 0) {
        let hexColor = document.getElementById(colorChooserIds[index]).value;
        let rgbString = 'rgb(' + utils.hexToRgb(hexColor).join(', ') + ')';
        Array.from(children).forEach((child) => child.setAttribute('color', rgbString));
      }
    });
  });
  return xmlNode;
} // addColorToMarkupElements()

/**
 * Filter children of array of elements that have a common parent
 * @param {Element[]} elements (gets modified in function)
 * @param {string[]} elementTypes
 * @returns {Element[]} elements
 */
export function filterChildren(elements, elementTypes = ['']) {
  for (let i = 0; i < elements.length; i++) {
    let children = elements[i].querySelectorAll(elementTypes.join(','));
    children.forEach((element) => {
      let i = elements.findIndex((e) => e === element);
      elements.splice(i, 1);
    });
  }
  return elements;
} // filterChidren()

/**
 * Removes all comments and empty text nodes from the given node
 * and its descendants.
 * @param {Node} node
 */
export function cleanNode(node) {
  for (var n = 0; n < node.childNodes.length; n++) {
    var child = node.childNodes[n];
    if (child.nodeType === Node.COMMENT_NODE || (child.nodeType === Node.TEXT_NODE && !/\S/.test(child.nodeValue))) {
      node.removeChild(child);
      n--;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      cleanNode(child);
    }
  }
} // cleanNode()
