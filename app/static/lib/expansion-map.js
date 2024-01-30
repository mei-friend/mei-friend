// @ts-check

import { xmlNameSpace } from './dom-utils.js';
import { rmHash } from './utils.js';

/**
 * Handles expansion elements
 */

let map = {}; // expansion map object

/**
 *
 * @param {Element} expansionElement
 * @param {string[]} existingList
 * @param {Element} xmlDoc will be expanded/reduced
 */
export function expand(expansionElement, existingList, xmlDoc) {
  reset();
  // find all siblings of expansion element to know what in MEI file
  /** @type {string[]} */ let reductionList = [];
  let expansionSiblings = expansionElement?.parentElement?.childNodes;
  expansionSiblings?.forEach((o) => {
    if (['section', 'ending', 'lem', 'rdg'].includes(o.nodeName)) {
      console.log('expansionsSibling o: ', o);
      // @ts-ignore
      reductionList.push(o.getAttribute('xml:id'));
    }
  });

  let prevSect;
  let expansionList = expansionElement?.getAttribute('plist')?.split(' ') || [];
  for (let s of expansionList) {
    s = rmHash(s);
    console.log('expansionList s: ' + s);
    let currSect = xmlDoc.querySelector('[*|id="' + s + '"]');
    if (!currSect) {
      return;
    }
    if (currSect.nodeName === 'expansion') {
      // remove parent from reductionList, if expansion
      let parentId = currSect.parentElement?.getAttribute('xml:id') || '';
      let idx = reductionList.indexOf(parentId);
      if (idx >= 0) reductionList.splice(idx, 1);

      // recursive call of expand
      expand(currSect, existingList, xmlDoc);
    } else {
      // section exists in list
      if (existingList.includes(s)) {
        // clone current section/ending/rdg/lem and rename it, adding -"rend2" for the first repetition etc.
        let clonedNode = /** @type {Element} */ currSect.cloneNode(true);
        // @ts-ignore
        generatePredictableIds(currSect, clonedNode);

        let oldIds = [];
        oldIds.push(s);
        getIdList(currSect, oldIds);
        let clonedIds = [];
        // @ts-ignore
        clonedIds.push(clonedNode.getAttribute('xml:id'));
        getIdList(clonedNode, clonedIds);
        for (let j = 0; j < oldIds.length; j++) {
          addExpandedIdToExpansionMap(oldIds[j], clonedIds[j]);
        }

        // go through cloned objects, find TimePointing/SpanningInterface, PListInterface, LinkingInterface
        // TODO this->UpdateIDs(clonedObject);
        // Add this method as in Verovio::ExpansionMap::UpdateIds(). This is only required when used for notation; 
        // almost fine for MIDI except for missing ties (TODO!!!)

        // insert cloned node after previous section
        // @ts-ignore
        prevSect?.after(clonedNode);
        prevSect = clonedNode;
      } else {
        // add to existingList, remember previous element, but do nothing else
        existingList.push(s);
        prevSect = currSect;
      }

      // remove s from reductionList
      let idx = reductionList.indexOf(s);
      if (idx >= 0) reductionList.splice(idx, 1);
    } 
  } // for expansionList

  // remove unused sections from reductionList
  reductionList.forEach((r) => {
    let el = xmlDoc.querySelector('[*|id="' + r + '"]');
    if (el) el.remove();
  });

  return xmlDoc;
} // expand()

/**
 * Recursively create a list of xml:ids (idList) of all elements contained in obj
 * @param {Node} obj
 * @param {Array} idList
 */
function getIdList(obj, idList) {
  obj.childNodes.forEach((o) => {
    if (o.nodeType === Node.ELEMENT_NODE) {
      // @ts-ignore
      let id = o.getAttribute('xml:id');
      if (id) idList.push(id);
      getIdList(o, idList);
    }
  });
} // getIdList()

/**
 * Generate ids of a cloned object in the form of <id-rendx>,
 * assuming that both source and target are identical
 * @param {Element} source
 * @param {Element} target
 */
function generatePredictableIds(source, target) {
  let sourceId = source.getAttribute('xml:id') || '';
  target.setAttributeNS(xmlNameSpace, 'xml:id', sourceId + '-rend' + (getExpansionIdsForElement(sourceId).length + 1));

  let sourceNodes = source.childNodes;
  let targetNodes = target.childNodes;
  if (sourceNodes.length <= 0) return;

  let i = 0;
  for (let s of sourceNodes) {
    if (s.nodeType === Node.ELEMENT_NODE) {
      // @ts-ignore
      generatePredictableIds(s, targetNodes[i++]);
    } else {
      i++;
    }
  }
} // generatePredictableIDs()

/**
 * Add pair of xml:id strings (old, new) to expansion map
 * @param {string} origXmlId
 * @param {string} newXmlId
 */
function addExpandedIdToExpansionMap(origXmlId, newXmlId) {
  if (origXmlId in map) {
    // if entry exists, add to array
    map[origXmlId].push(newXmlId);
    // add to middle ones
    for (let i of map[origXmlId]) {
      if (i !== origXmlId && i !== newXmlId) {
        map[i].push(newXmlId);
      }
    }
    // add to newXmlId
    map[newXmlId] = map[origXmlId];
  } else {
    // add new ids under both keys
    let s = [origXmlId, newXmlId];
    map[origXmlId] = s;
    map[newXmlId] = s;
  }
} // addExpandedIdToExpansionMap()

/**
 * Returns array of id strings for a given element
 * @param {string} id
 * @returns {array}
 */
export function getExpansionIdsForElement(id) {
  return id in map ? map[id] : [id];
} // getExpansionIdsForElement()

/**
 * Returns id string of notated (=first) element, based on expansion map
 * @param {string} id
 * @returns {string}
 */
export function getNotatedIdForElement(id) {
  return id in map ? map[id][0] : id;
} // getNotatedIdForElement()

function reset() {
  map = {};
} // reset()
