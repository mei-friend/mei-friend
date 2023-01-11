import { getX, getY, svgNameSpace } from './dom-utils.js';
import * as att from './attribute-classes.js';
import { setCursorToId } from './utils.js';
import { cm, platform } from './main.js';
import { startMidiTimeout } from './midi-player.js';

export function addDragSelector(v, vp) {
  let dragging = false;
  var svgEls;
  var obobj = {}; // object storing x, y coordinates of svg elements
  let oldEls = [];
  let newEls = [];
  var start = {};
  var end = {};
  var rect;

  let noteSelector = '.note';
  let restSelector = '.rest,.mRest,.beatRpt,.halfmRpt,.mRpt';
  let controlSelector = '.' + att.attPlacement.join(',.');
  let slurSelector = '.' + att.attCurvature.join(',.');
  let measureSelector = '.measure';

  vp.addEventListener('mousedown', (ev) => {
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
        let staves = el.querySelectorAll('.staff'); //for  measures from staves
        if (staves.length > 0) {
          bb.width = staves.item(0).getBBox().width;
          let sbb = staves.item(staves.length - 1).getBBox();
          bb.height = sbb.y + sbb.height - bb.y;
        }
      }
      let x = Math.round((bb.x + bb.width / 2) * 1000); // center of element
      let y = Math.round((bb.y + bb.height / 2) * 1000);
      if (!Object.keys(obobj).includes(x.toString())) obobj[x] = {};
      if (Object.keys(obobj).includes(x.toString()) && Object.keys(obobj[x]).includes(y.toString())) {
        obobj[x][y].push(el);
      } else {
        obobj[x][y] = [el];
      }
    });
  });

  vp.addEventListener('mousemove', (ev) => {
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
      var mx = pm.getScreenCTM().inverse();
      let s = transformCTM(thisStart, mx);
      let e = transformCTM(end, mx);
      let x = s.x;
      let width = Math.abs(e.x - s.x);
      let y = s.y;
      let height = Math.abs(e.y - s.y);
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
      let xx = Math.round(x * 1000);
      let xx2 = Math.round((x + width) * 1000);
      let yy = Math.round(y * 1000);
      let yy2 = Math.round((y + height) * 1000);
      let latest = {};
      let selX = Object.keys(obobj).filter((kx) => parseInt(kx) >= xx && parseInt(kx) <= xx2);
      if (selX.length > 0) {
        selX.forEach((xKey) => {
          let yKeys = Object.keys(obobj[xKey]).filter((ky) => parseInt(ky) >= yy && parseInt(ky) <= yy2);
          if (yKeys)
            yKeys.forEach((yKey) => {
              let els = obobj[xKey][yKey];
              if (els)
                els.forEach((el) => {
                  if (!newEls.includes(el.id)) {
                    newEls.push(el.id);
                  }
                  let x = getX(el);
                  let y = getY(el);
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
      oldEls.forEach((el) => newEls.push(el));
      v.updateNotation = false;
      if (latest && Object.keys(latest).length > 0) {
        setCursorToId(cm, latest.el.id);
        v.lastNoteId = latest.el.id;
      }
      v.selectedElements = newEls;
      v.updateHighlight();
      v.updateNotation = true;
    }
  });

  vp.addEventListener('mouseup', () => {
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      console.log('drag-selector: HANDLE CLICK MIDI TIMEOUT');
      startMidiTimeout();
    }
    dragging = false;
    let svgPm = document.querySelector('g.page-margin');
    if (svgPm && Array.from(svgPm.childNodes).includes(rect)) svgPm.removeChild(rect);
    oldEls = [];
  });
} // addDragSelector()

export function transformCTM(point, matrix) {
  let r = {};
  r.x = matrix.a * point.x + matrix.c * point.y + matrix.e;
  r.y = matrix.b * point.x + matrix.d * point.y + matrix.f;
  return r;
} // transformCTM()

export function updateRect(rect, x, y, width, height, color = 'black', strokeWidth = 13, strokeDashArray = 50) {
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('stroke-width', strokeWidth);
  rect.setAttribute('stroke-dasharray', strokeDashArray);
  rect.setAttribute('stroke', color);
  rect.setAttribute('fill', 'none');
} // updateRect()
