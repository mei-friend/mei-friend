import * as att from './attribute-classes.js';
import { getX, getY, svgNameSpace } from './dom-utils.js';
import { platform } from './defaults.js';
import { cm } from './main.js';
import { startMidiTimeout } from './midi-player.js';
import { setCursorToId } from './utils.js';
import Viewer from './viewer.js';

/**
 * Add drag-selector to vp element (i.e., verovio-panel)
 * @param {Viewer} v
 * @param {Element} vp
 */
export function addDragSelector(v, vp) {
  let dragging = false;
  var svgEls;
  var obobj = {}; // object storing x, y coordinates of svg elements
  let oldEls = [];
  let newEls = [];
  var start = {};
  var end = {};
  var rect;

  const noteSelector = '.note';
  const restSelector = '.rest,.mRest,.beatRpt,.halfmRpt,.mRpt';
  const controlSelector = '.' + att.attPlacement.join(',.');
  const slurSelector = '.' + att.attCurvature.join(',.');
  const measureSelector = '.measure';

  vp.addEventListener('mousedown', (ev) => {
    if (!v.allowNotationInteraction) return;
    dragging = true;
    // clear selected elements, if no CMD/CTRL key is pressed
    if (!(platform.startsWith('mac') && ev.metaKey) && !ev.ctrlKey) {
      v.selectedElements = [];
      v.updateHighlight();
    }
    oldEls = [];
    obobj = {};
    v.selectedElements.forEach((el) => oldEls.push(el)); // remember selected els
    // create selection rectangle
    rect = document.createElementNS(svgNameSpace, 'rect');
    let pm = document.querySelector('g.page-margin');
    if (pm) pm.appendChild(rect);

    // remember click/mousedown point
    start.x = ev.clientX + vp.scrollLeft;
    start.y = ev.clientY + vp.scrollTop;

    let sel = 'g';
    let first = true;
    if (document.getElementById('dragSelectNotes').checked) {
      sel += (first ? ' ' : ',') + noteSelector;
      first = false;
    }
    if (document.getElementById('dragSelectRests').checked) {
      sel += (first ? ' ' : ',') + restSelector;
      first = false;
    }
    if (document.getElementById('dragSelectControlElements').checked) {
      sel += (first ? ' ' : ',') + controlSelector;
      first = false;
    }
    if (document.getElementById('dragSelectSlurs').checked) {
      sel += (first ? ' ' : ',') + slurSelector;
      first = false;
    }
    if (document.getElementById('dragSelectMeasures').checked) {
      sel += (first ? ' ' : ',') + measureSelector;
      first = false;
    }
    svgEls = document.querySelectorAll(sel);
    svgEls.forEach((el) => {
      let bb = el.getBBox();
      if (Array.from(el.classList).includes('note')) {
        let noteHead = el.querySelector('.notehead');
        if (noteHead) bb = noteHead.getBBox();
      }
      if (Array.from(el.classList).includes('measure')) {
        // take boundingbox
        const staves = el.querySelectorAll('.staff'); //for  measures from staves
        if (staves.length > 0) {
          bb.width = staves.item(0).getBBox().width;
          let sbb = staves.item(staves.length - 1).getBBox();
          bb.height = sbb.y + sbb.height - bb.y;
        }
      }
      const x = Math.round((bb.x + bb.width / 2) * 1000); // center of element
      const y = Math.round((bb.y + bb.height / 2) * 1000);
      if (!Object.keys(obobj).includes(x.toString())) obobj[x] = {};
      if (Object.keys(obobj).includes(x.toString()) && Object.keys(obobj[x]).includes(y.toString())) {
        obobj[x][y].push(el);
      } else {
        obobj[x][y] = [el];
      }
    });
  }); // mouse down event listener

  vp.addEventListener('mousemove', (ev) => {
    if (!v.allowNotationInteraction) return;
    if (dragging) {
      newEls = [];

      let thisStart = {}; // adjust starting point to scroll of verovio-panel
      thisStart.x = start.x - vp.scrollLeft;
      thisStart.y = start.y - vp.scrollTop;
      end.x = ev.clientX;
      end.y = ev.clientY;

      let pm = document.querySelector('g.page-margin');
      if (!pm) return;

      // transform mouse/screen coordinates to SVG coordinates
      const mx = pm.getScreenCTM().inverse();
      const s = transformCTM(thisStart, mx);
      const e = transformCTM(end, mx);
      let x = s.x;
      const width = Math.abs(e.x - s.x);
      let y = s.y;
      const height = Math.abs(e.y - s.y);
      if (e.x < s.x) x = e.x;
      if (e.y < s.y) y = e.y;

      // take stroke width from note line width
      let strokeWidth = 10;
      let p = document.querySelector('g.staff > path');
      if (p) strokeWidth = parseFloat(p.getAttribute('stroke-width'));

      // draw drag-select rectangle
      updateRect(rect, x, y, width, height, window.getComputedStyle(pm).color, strokeWidth, strokeWidth * 5);

      // without Firefox support:
      // svgEls.forEach(el => {
      //   if (svgPm.checkIntersection(el, rect))
      //     newEls.push(el.id);
      // });

      // filter selected elements that are inside rectangle
      const xx = Math.round(x * 1000);
      const xx2 = Math.round((x + width) * 1000);
      const yy = Math.round(y * 1000);
      const yy2 = Math.round((y + height) * 1000);
      let latest = {};
      const selX = Object.keys(obobj).filter((kx) => parseInt(kx) >= xx && parseInt(kx) <= xx2);
      if (selX.length > 0) {
        selX.forEach((xKey) => {
          let yKeys = Object.keys(obobj[xKey]).filter((ky) => parseInt(ky) >= yy && parseInt(ky) <= yy2);
          if (yKeys)
            yKeys.forEach((yKey) => {
              let els = obobj[xKey][yKey];
              if (els)
                els.forEach((el) => {
                  let id = el.id;
                  // select chord instead of note with ALT modifyer key
                  if (ev.altKey && el.classList.contains('note') && el.closest('.chord')) {
                    id = el.closest('.chord').id;
                  }
                  if (!newEls.includes(id)) {
                    newEls.push(id);
                  }
                  const x = getX(el);
                  const y = getY(el);
                  // keep the element closest to the cursor position (whilst disburdening Pythagoras from exponential load)
                  if (
                    Object.keys(latest).length === 0 ||
                    (Object.keys(latest).length > 0 &&
                      Math.abs(x - e.x) + Math.abs(y - e.y) < Math.abs(latest.x - e.x) + Math.abs(latest.y - e.y))
                  ) {
                    latest.el = el;
                    latest.x = x;
                    latest.y = y;
                  }
                });
            });
        });
      }

      let found = true;
      // select latest element in editor
      v.allowCursorActivity = false;
      if (latest && Object.keys(latest).length > 0) {
        found = setCursorToId(cm, latest.el.id);
        v.lastNoteId = latest.el.id;
      }

      // add new element to selected elements when new, remove otherwise
      v.selectedElements = [...oldEls];
      newEls.forEach((newEl) => {
        if (oldEls.includes(newEl)) {
          v.selectedElements.splice(v.selectedElements.indexOf(newEl), 1);
        } else {
          v.selectedElements.push(newEl);
        }
      });
      // console.debug('Drag-Selector selected elements: ', v.selectedElements)

      if (!found) {
        // console.debug('Drag-Selector latest element: ', latest.el.classList.item(0));
        v.showMissingIdsWarning(latest.el.classList.item(0));
      }
      v.updateHighlight();
      v.allowCursorActivity = true;
    }
  }); // mouse move event listener

  vp.addEventListener('mouseup', () => {
    if (!v.allowNotationInteraction) return;
    if (document.getElementById('showMidiPlaybackControlBar')?.checked) {
      console.log('drag-selector: HANDLE CLICK MIDI TIMEOUT');
      startMidiTimeout();
    }
    dragging = false;

    // remove dragging rectangle
    let svgPm = document.querySelector('g.page-margin');
    if (svgPm && Array.from(svgPm.childNodes).includes(rect)) {
      svgPm.removeChild(rect);
    }
    oldEls = [];
  }); // mouse up event listener
} // addDragSelector()

/** @typedef {{
 *   x: number,
 *   y: number
 * }} Point;
 */

/** @typedef {{
 *   a: number,
 *   b: number
 *   c: number,
 *   d: number
 *   e: number,
 *   f: number
 * }} Matrix;
 */

/**
 * Transforms point (x/y) through matrix from element coordinate system to screen coordinates
 * @param {Point} point
 * @param {Matrix} matrix
 * @returns
 */
export function transformCTM(point, matrix) {
  let r = {};
  r.x = matrix.a * point.x + matrix.c * point.y + matrix.e;
  r.y = matrix.b * point.x + matrix.d * point.y + matrix.f;
  return r;
} // transformCTM()

/**
 * Updates existing SVG rectangle with coordinates and design parameters
 * @param {SVGElement} rect
 * @param {string} x
 * @param {string} y
 * @param {string} width
 * @param {string} height
 * @param {string} color
 * @param {string} strokeWidth
 * @param {string} strokeDashArray
 */
export function updateRect(rect, x, y, width, height, color = 'black', strokeWidth = '13', strokeDashArray = '50') {
  if (x) rect.setAttribute('x', x);
  if (y) rect.setAttribute('y', y);
  if (width) rect.setAttribute('width', width);
  if (height) rect.setAttribute('height', height);
  if (strokeWidth) rect.setAttribute('stroke-width', strokeWidth);
  if (strokeDashArray) rect.setAttribute('stroke-dasharray', strokeDashArray);
  if (color) rect.setAttribute('stroke', color);
  rect.setAttribute('fill', 'none');
} // updateRect()
