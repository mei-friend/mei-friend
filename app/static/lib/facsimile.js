/**
 * Facsimile support:
 * Handles display of source score images as referenced
 * through zone and surface elements.
 */

import { rmHash, setCursorToId } from './utils.js';
import { svgNameSpace, xmlToString } from './dom-utils.js';
import { transformCTM, updateRect } from './drag-selector.js';
import { cm, fileLocationType, github, isCtrlOrCmd, meiFileLocation, translator, v } from './main.js';
import { addZone, replaceInEditor } from './editor.js';
import { attFacsimile } from './attribute-classes.js';
import { defaultFacsimileRectangleColor, defaultFacsimileRectangleLineWidth } from './defaults.js';

var facs = {}; // facsimile structure in MEI file
var sourceImages = {}; // object of source images
const rectangleLineWidth = defaultFacsimileRectangleLineWidth; // width of bounding box rectangles in px
const rectangleColor = defaultFacsimileRectangleColor; // color of zone rectangles
var listenerHandles = {};
var resize = ''; // west, east, north, south, northwest, southeast etc
var ulx, uly;

/**
 * Show warning text to facsimile panel (as svg text element) and
 * resets svg and svgContainer
 * @param {String} txt
 * @returns void
 */
function showWarningText(txt = translator.lang.facsimileDefaultWarning.text) {
  let svgContainer = document.getElementById('sourceImageContainer');
  let svg = document.getElementById('sourceImageSvg');
  if (!svg || !svgContainer) return;

  // clear existing structures
  svgContainer.removeAttribute('transform-origin');
  svgContainer.removeAttribute('transform');
  svg.removeAttribute('viewBox');
  svg.innerHTML = '';

  let facsimileMessagePanel = document.getElementById('facsimileMessagePanel');
  facsimileMessagePanel.style.display = 'block';
  if (facsimileMessagePanel) {
    txt.split('\n').forEach((t, i) => {
      if (i === 0) {
        facsimileMessagePanel.innerHTML = '<h2>' + t + '</h2>';
      } else {
        facsimileMessagePanel.innerHTML += '<p>' + t + '</p>';
      }
    });
  }
} // showWarningText()

/**
 * Clear main variables
 */
export function clearFacsimile() {
  facs = {};
  sourceImages = {};
  // let svgContainer = document.getElementById('sourceImageContainer');
  // svgContainer.removeAttribute('width');
  // svgContainer.removeAttribute('height');
} // clearFacsimile()

/**
 * Loads facsimile content of xmlDoc into an object
 * with zone and surface ids as property names,
 * each containing own coordinates (ulx, uly, lrx, lry)
 * and containing surface info (target, width, height)
 * @param {Document} xmlDoc
 * Modifies global variable facs
 */
export function loadFacsimile(xmlDoc) {
  let facsimile = xmlDoc.querySelector('facsimile');
  if (facsimile) {
    clearFacsimile();
    // look for surface elements
    let surfaces = facsimile.querySelectorAll('surface');
    surfaces.forEach((s) => {
      let id;
      let { target, width, height } = fillGraphic(s.querySelector('graphic'));
      if (s.hasAttribute('xml:id')) id = s.getAttribute('xml:id');
      if (id) {
        facs[id] = {};
        if (target) facs[id]['target'] = target;
        if (width) facs[id]['width'] = width;
        if (height) facs[id]['height'] = height;
        facs[id]['type'] = 'surface';
      }
    });
    // look for zone elements
    let zones = facsimile.querySelectorAll('zone');
    console.debug('facsimile.loadFacsimile(): loading ' + zones.length + ' zones.');
    zones.forEach((z) => {
      let id, ulx, uly, lrx, lry;
      if (z.hasAttribute('xml:id')) id = z.getAttribute('xml:id');
      if (z.hasAttribute('ulx')) ulx = z.getAttribute('ulx');
      if (z.hasAttribute('uly')) uly = z.getAttribute('uly');
      if (z.hasAttribute('lrx')) lrx = z.getAttribute('lrx');
      if (z.hasAttribute('lry')) lry = z.getAttribute('lry');
      let { target, width, height } = fillGraphic(z.parentElement.querySelector('graphic'));
      if (id) {
        facs[id] = {};
        facs[id]['type'] = 'zone';
        if (target) facs[id]['target'] = target;
        if (width) facs[id]['width'] = width;
        if (height) facs[id]['height'] = height;
        if (ulx) facs[id]['ulx'] = ulx;
        if (uly) facs[id]['uly'] = uly;
        if (lrx) facs[id]['lrx'] = lrx;
        if (lry) facs[id]['lry'] = lry;
        let measure = xmlDoc.querySelector('[facs="#' + id + '"]');
        if (measure) {
          if (measure.hasAttribute('xml:id')) facs[id]['pointerId'] = measure.getAttribute('xml:id');
          if (measure.hasAttribute('n')) facs[id]['pointerN'] = measure.getAttribute('n');
        }
      }
    });
    // oldFacsimile = facsimile;
  } else {
    console.debug('facsimile.loadFacsimile(): skip loading because facsimile the same.');
  }

  /**
   * Local function to handle main attributes of graphic element.
   * @param {Node} graphic
   * @returns {object}
   */
  function fillGraphic(graphic) {
    let t, w, h;
    if (graphic) {
      if (graphic.hasAttribute('target')) t = graphic.getAttribute('target');
      if (graphic.hasAttribute('width')) w = graphic.getAttribute('width');
      if (graphic.hasAttribute('height')) h = graphic.getAttribute('height');
    }
    return {
      target: t,
      width: w,
      height: h,
    };
  } // fillGraphic()
} // loadFacsimile()

/**
 * Draw the source image with bounding boxes for each zone
 */
export async function drawFacsimile() {
  busy();
  let fullPage = document.getElementById('showFacsimileFullPage').checked;
  let facsimileMessagePanel = document.getElementById('facsimileMessagePanel');
  facsimileMessagePanel.style.display = 'none';
  let svgContainer = document.getElementById('sourceImageContainer');
  let svg = document.getElementById('sourceImageSvg');
  if (!svg || !svgContainer) return;
  ulx = Number.MAX_VALUE; // boundary values for image envelope (left-upper corner is global)
  uly = Number.MAX_VALUE;
  let lrx = 0;
  let lry = 0;
  let zoneId = '';
  // list displayed zones (filter doubled note elements in tab notation, see Verovio issue #3600)
  let svgFacs = Array.from(document.querySelectorAll('[data-facs]')).filter(
    (x) => !x.parentElement.classList.contains('note')
  );

  if (svgFacs && fullPage) {
    let firstZone = svgFacs.at(0);
    if (firstZone && firstZone.hasAttribute('data-facs')) zoneId = rmHash(firstZone.getAttribute('data-facs'));
  } else {
    svgFacs.forEach((f) => {
      // go through displayed zones and find envelope
      if (f.hasAttribute('data-facs')) zoneId = rmHash(f.getAttribute('data-facs'));
      if (facs[zoneId]) {
        if (parseFloat(facs[zoneId].ulx) < ulx) ulx = parseFloat(facs[zoneId].ulx) - rectangleLineWidth / 2;
        if (parseFloat(facs[zoneId].uly) < uly) uly = parseFloat(facs[zoneId].uly) - rectangleLineWidth / 2;
        if (parseFloat(facs[zoneId].lrx) > lrx) lrx = parseFloat(facs[zoneId].lrx) + rectangleLineWidth / 2;
        if (parseFloat(facs[zoneId].lry) > lry) lry = parseFloat(facs[zoneId].lry) + rectangleLineWidth / 2;
      }
    });
  }
  // display surface graphic if no data-facs are found in SVG
  if (!zoneId || !facs[zoneId]) {
    let pb = getCurrentPbElement(v.xmlDoc); // id of current page beginning
    if (!pb) {
      showWarningText(translator.lang.facsimileNoSurfaceWarning.text);
      busy(false);
      return;
    }
    if (pb && pb.hasAttribute('facs')) {
      zoneId = rmHash(pb.getAttribute('facs'));
    }
    if (zoneId && !fullPage) {
      showWarningText(translator.lang.facsimileNoZonesFullPageWarning.text);
      busy(false);
      return;
    }
  }
  if (zoneId && facs[zoneId]) {
    // find the correct path of the image file
    let img;
    let imgName = facs[zoneId].target;
    if (!imgName.startsWith('http')) {
      // relative file paths in surface@target
      if (fileLocationType === 'github') {
        let url = new URL(
          'https://raw.githubusercontent.com/' +
            github.githubRepo +
            '/' +
            github.branch +
            github.filepath.substring(0, github.filepath.lastIndexOf('/')) +
            '/' +
            facs[zoneId].target
        );
        imgName = url.href;
      } else if (fileLocationType === 'url') {
        let url = new URL(meiFileLocation);
        imgName = url.origin + url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1) + imgName;
      } else {
        imgName = `${root}local/` + facs[zoneId].target;
        imgName = imgName.replace('.tif', '.jpg'); // hack for some DIME files...
      }
    } else if (imgName.startsWith('https://raw.githubusercontent.com/') && github.githubToken) {
      // absolute file paths
      let url = new URL(
        'https://raw.githubusercontent.com/' + github.githubRepo + '/' + github.branch + github.filepath
      );
      imgName = url.href;
    }

    // retrieve image from object, if already there...
    if (sourceImages.hasOwnProperty(imgName)) {
      console.log('Using existing image from ' + imgName);
      img = sourceImages[imgName];
      // or load it freshly from source, if not
    } else {
      console.log('Loading image from ' + imgName);
      img = await loadImage(imgName);
      sourceImages[imgName] = img;
    }

    //
    Array.from(svg.children).forEach((c) => svg.removeChild(c));
    if (img) {
      console.log('Appending child image:', img);
      svg.appendChild(img);
    } else {
      showWarningText(translator.lang.facsimileImgeNotLoadedWarning.text + ' \n(' + imgName + ').');
      busy(false);
      return;
    }

    if (fullPage) {
      console.debug('Facsimile img getBBox(): ', img.getBBox());
      console.debug('Facsimile img getBoundingClientRect(): ', img.getBoundingClientRect());
      let bb = img.getBBox();
      ulx = 0;
      uly = 0;
      lrx = bb.width;
      lry = bb.height;
    } else if (facs[zoneId]['type'] === 'surface') {
      showWarningText(translator.lang.facsimileNoZonesFullPageWarning.text);
      busy(false);
      return;
    }
    let width = lrx - ulx;
    let height = lry - uly;
    let zoomFactor = document.getElementById('facsimileZoomInput').value / 100;
    svgContainer.setAttribute('transform-origin', 'left top');
    svgContainer.setAttribute('transform', 'scale(' + zoomFactor + ')');
    if (width !== 0) svgContainer.setAttribute('width', width);
    if (height !== 0) svgContainer.setAttribute('height', height);
    if (width !== 0 && height !== 0) {
      svg.setAttribute('viewBox', ulx + ' ' + uly + ' ' + width + ' ' + height);
    }

    if (false) {
      // show page name on svg
      let lbl = document.getElementById('sourceImageSvgLabel');
      if (!lbl) {
        lbl = document.createElementNS(svgNameSpace, 'text');
        lbl.setAttribute('id', 'sourceImageSvgLabel');
      }
      lbl.textContent = imgName.split('\\').pop().split('/').pop();
      lbl.setAttribute('font-size', '28px');
      lbl.setAttribute('font-weight', 'bold');
      lbl.setAttribute('x', ulx + 7);
      lbl.setAttribute('y', uly + 29);
      svg.appendChild(lbl);
    }

    // go through displayed zones and draw bounding boxes with number-like label
    if (document.getElementById('facsimileShowZonesCheckbox')?.checked) {
      if (fullPage) {
        for (let z in facs) {
          if (facs[z]['target'] === facs[zoneId]['target']) drawBoundingBox(z);
        }
      } else {
        svgFacs.forEach((m) => {
          if (m.hasAttribute('data-facs')) zoneId = rmHash(m.getAttribute('data-facs'));
          drawBoundingBox(zoneId);
        });
      }
    }
    // console.log('ulx/uly//lrx/lry;w/h: ' + ulx + '/' + uly + '; ' + lrx + '/' + lry + '; ' + width + '/' + height);
  } else {
    showWarningText(); // no facsimile content to show
  }
  busy(false);
} // drawFacsimile()

/**
 * Draws the bounding box for the zone with zoneId, using global object facs
 * @param {string} zoneId
 * @param {string} pointerId
 * @param {string} pointerN
 */
function drawBoundingBox(zoneId) {
  if (facs[zoneId]) {
    let svg = document.getElementById('sourceImageSvg');
    let rect = document.createElementNS(svgNameSpace, 'rect');
    svg.appendChild(rect);
    rect.setAttribute('rx', rectangleLineWidth / 2);
    rect.setAttribute('ry', rectangleLineWidth / 2);
    rect.addEventListener('click', (e) => v.handleClickOnNotation(e, cm));
    let editFacsimileZones = document.getElementById('editFacsimileZones').checked;
    let x = parseFloat(facs[zoneId].ulx);
    let y = parseFloat(facs[zoneId].uly);
    let width = parseFloat(facs[zoneId].lrx) - x;
    let height = parseFloat(facs[zoneId].lry) - y;
    updateRect(rect, x, y, width, height, rectangleColor, rectangleLineWidth, 'none');
    let pointerId = facs[zoneId]['pointerId']; // id of pointing element (e.g., measure)
    if (pointerId) rect.id = editFacsimileZones ? zoneId : pointerId;
    let pointerN = facs[zoneId]['pointerN']; // number-like
    if (pointerN) {
      // draw number-like info from element (e.g., measure)
      let txt = document.createElementNS(svgNameSpace, 'text');
      svg.appendChild(txt);
      txt.setAttribute('font-size', '28px');
      txt.setAttribute('font-weight', 'bold');
      txt.setAttribute('fill', rectangleColor);
      txt.setAttribute('x', x + 7);
      txt.setAttribute('y', y + 29);
      txt.addEventListener('click', (e) => v.handleClickOnNotation(e, cm));
      txt.textContent = pointerN;
      if (pointerId) txt.id = editFacsimileZones ? zoneId : pointerId;
    }
  }
} // drawBoundingBox()

/**
 * Load asynchronously the image from url and returns a promise
 * with an svg image object upon resolving
 * @param {string} url
 * @returns {Promise}
 */
async function loadImage(url) {
  if (isLoggedIn && url.startsWith('https://raw.githubusercontent.com')) {
    return embedImage(url);
  } else {
    return new Promise((resolve) => {
      const img = document.createElementNS(svgNameSpace, 'image');
      img.setAttribute('id', 'source-image');
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      img.onload = () => resolve(img);
      img.onerror = (err) => {
        console.log('Cannot load image file ' + url + ', error: ', err);
        resolve(null);
      };
    });
  }
} // loadImage()

/**
 * Asynchronously load and embed the image from url through GitHub API
 * returns a promise with an svg image object upon resolving
 * @param {string} url
 * @returns {Promise}
 */
async function embedImage(url) {
  return new Promise((resolve) => {
    const img = document.createElementNS(svgNameSpace, 'image');
    img.setAttribute('id', 'source-image');
    github.directlyReadFileContents(url).then((dataUrl) => {
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl);
      resolve(img);
    });
    img.onerror = (err) => {
      console.log('Cannot embed image file ' + url + ', error: ', err);
      resolve(null);
    };
  });
} // embedImage()

/**
 * Zooms the facsimile surface image in the sourceImageContainer svg.
 * @param {float} deltaPercent
 */
export function zoomFacsimile(deltaPercent) {
  let facsimileZoomInput = document.getElementById('facsimileZoomInput'); // mf settings menu
  if (!facsimileZoomInput) return;
  if (deltaPercent) {
    facsimileZoomInput.value = Math.min(
      parseInt(facsimileZoomInput.max),
      Math.max(parseInt(facsimileZoomInput.min), parseInt(facsimileZoomInput.value) + deltaPercent)
    );
    // click on settings UI element to update local storage
    facsimileZoomInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  let facsZoom = document.getElementById('facsimileZoom'); // facsimile panel
  if (!facsZoom) return;
  if (deltaPercent) facsZoom.value = facsimileZoomInput.value;
  let svgContainer = document.getElementById('sourceImageContainer');
  if (svgContainer) svgContainer.setAttribute('transform', 'scale(' + facsimileZoomInput.value / 100 + ')');
} // zoomFacsimile()

/**
 * Remove all eventlisteners from zones, highlight the one rect,
 * and add the resizer event listeners, if edit is enabled
 * @param {rect} rect
 */
export function highlightZone(rect) {
  let svg = document.getElementById('sourceImageSvg');
  // remove event listerners
  for (let key in listenerHandles) {
    if (key === 'mousedown') {
      // remove mousedown listener from all rectangles
      svg.querySelectorAll('rect').forEach((r) => r.removeEventListener(key, listenerHandles[key]));
    } else {
      // and the other two from the facsimile-panel
      let ip = document.getElementById('facsimile-panel');
      if (ip) ip.removeEventListener(key, listenerHandles[key]);
    }
  }
  // add zone resizer for selected zone box (only when linked to zone
  // rather than to pointing element, ie. measure)
  if (document.getElementById('editFacsimileZones').checked) listenerHandles = addZoneResizer(v, rect);

  // highlight rectangle
  rect.classList.add('highlighted');
  rect.querySelectorAll('g').forEach((g) => g.classList.add('highlighted'));
} // highlightZone()

/**
 * Adds event listeners for resizing a zone bounding box
 * to each
 * @param {object} v
 * @param {rect} rect
 * @returns {object} of event listener handles
 */
export function addZoneResizer(v, rect) {
  let txt, txtX, txtY; // text element for zone number and its x/y coordinates
  var ip = document.getElementById('facsimile-panel');
  var svg = document.getElementById('sourceImageSvg');
  var start = {}; // starting point start.x, start.y
  var end = {}; // ending point
  var bb;

  rect.addEventListener('mousedown', mouseDown);
  ip.addEventListener('mousemove', mouseMove);
  ip.addEventListener('mouseup', mouseUp);

  return {
    mousedown: mouseDown,
    mousemove: mouseMove,
    mouseup: mouseUp,
  };

  function mouseDown(ev) {
    txt = document.querySelector('text[id="' + rect.id + '"]');
    if (txt) {
      txtX = parseFloat(txt.getAttribute('x'));
      txtY = parseFloat(txt.getAttribute('y'));
    }

    let bcr = rect.getBoundingClientRect();
    bb = rect.getBBox();
    start.x = ev.clientX + ip.scrollLeft;
    start.y = ev.clientY + ip.scrollTop;
    let thres = rectangleLineWidth * 2;
    let xl = Math.abs(ev.clientX - bcr.x);
    let xr = Math.abs(ev.clientX - bcr.x - bcr.width);
    let yu = Math.abs(ev.clientY - bcr.y);
    let yl = Math.abs(ev.clientY - bcr.y - bcr.height);
    if (ev.clientX > bcr.x && ev.clientX < bcr.x + bcr.width && ev.clientY > bcr.y && ev.clientY < bcr.y + bcr.height)
      resize = 'pan';
    if (xl < thres) resize = 'west';
    if (yu < thres) resize = 'north';
    if (xr < thres) resize = 'east';
    if (yl < thres) resize = 'south';
    if (xl < thres && yu < thres) resize = 'northwest';
    if (xr < thres && yu < thres) resize = 'northeast';
    if (xl < thres && yl < thres) resize = 'southwest';
    if (xr < thres && yl < thres) resize = 'southeast';
    console.log(
      'ZoneResizer: Mouse down ' + resize + ' ev.clientX/Y:' + ev.clientX + '/' + ev.clientX + ', rect:',
      rect
    );
  } // mouseDown()

  function mouseMove(ev) {
    let bcr = rect.getBoundingClientRect();
    let thres = rectangleLineWidth * 2;
    let xl = Math.abs(ev.clientX - bcr.x);
    let xr = Math.abs(ev.clientX - bcr.x - bcr.width);
    let yu = Math.abs(ev.clientY - bcr.y);
    let yl = Math.abs(ev.clientY - bcr.y - bcr.height);
    rect.style.cursor = 'default';
    if (
      ev.clientX > bcr.x &&
      ev.clientX < bcr.x + bcr.width &&
      ev.clientY > bcr.y &&
      ev.clientY < bcr.y + bcr.height &&
      ev.target === rect
    )
      rect.style.cursor = 'move';
    if (xl < thres) rect.style.cursor = 'ew-resize';
    if (yu < thres) rect.style.cursor = 'ns-resize';
    if (xr < thres) rect.style.cursor = 'ew-resize';
    if (yl < thres) rect.style.cursor = 'ns-resize';
    if (xl < thres && yu < thres) rect.style.cursor = 'nwse-resize';
    if (xr < thres && yu < thres) rect.style.cursor = 'nesw-resize';
    if (xl < thres && yl < thres) rect.style.cursor = 'nesw-resize';
    if (xr < thres && yl < thres) rect.style.cursor = 'nwse-resize';
    // console.log('ZoneResizer: Mouse Move ' + resize + ' ev.clientX/Y:' + ev.clientX + '/' + ev.clientY + ', rect:', bcr);

    if (bb && resize) {
      let thisStart = {}; // adjust starting point to scroll of verovio-panel
      thisStart.x = start.x - ip.scrollLeft;
      thisStart.y = start.y - ip.scrollTop;
      end.x = ev.clientX;
      end.y = ev.clientY;

      var mx = svg.getScreenCTM().inverse();
      let s = transformCTM(thisStart, mx);
      let e = transformCTM(end, mx);
      let dx = e.x - s.x;
      let dy = e.y - s.y;

      let x, y, width, height;
      switch (resize) {
        case 'west':
          (x = bb.x + dx), (y = bb.y), (width = bb.width - dx), (height = bb.height);
          break;
        case 'east':
          (x = bb.x), (y = bb.y), (width = bb.width + dx), (height = bb.height);
          break;
        case 'north':
          (x = bb.x), (y = bb.y + dy), (width = bb.width), (height = bb.height - dy);
          break;
        case 'south':
          (x = bb.x), (y = bb.y), (width = bb.width), (height = bb.height + dy);
          break;
        case 'northwest':
          (x = bb.x + dx), (y = bb.y + dy), (width = bb.width - dx), (height = bb.height - dy);
          break;
        case 'northeast':
          (x = bb.x), (y = bb.y + dy), (width = bb.width + dx), (height = bb.height - dy);
          break;
        case 'southwest':
          (x = bb.x + dx), (y = bb.y), (width = bb.width - dx), (height = bb.height + dy);
          break;
        case 'southeast':
          (x = bb.x), (y = bb.y), (width = bb.width + dx), (height = bb.height + dy);
          break;
        case 'pan':
          (x = bb.x + dx), (y = bb.y + dy), (width = bb.width), (height = bb.height);
          break;
      }
      (x = Math.round(x)), (y = Math.round(y)), (width = Math.round(width)), (height = Math.round(height));
      let c = adjustCoordinates(x, y, width, height);
      updateRect(rect, c.x, c.y, c.width, c.height, rectangleColor, rectangleLineWidth, 'none');
      if (txt && (resize === 'northwest' || resize === 'west' || resize === 'pan')) {
        txt.setAttribute('x', txtX + dx);
      }
      if (txt && (resize === 'north' || resize === 'northwest' || resize === 'pan')) {
        txt.setAttribute('y', txtY + dy);
      }

      // update in xmlDoc
      let zone = v.xmlDoc.querySelector('[*|id="' + rect.id + '"]');
      zone.setAttribute('ulx', c.x);
      zone.setAttribute('uly', c.y);
      zone.setAttribute('lrx', c.x + c.width);
      zone.setAttribute('lry', c.y + c.height);

      // Update in CodeMirror
      v.allowCursorActivity = false;
      replaceInEditor(cm, zone, true);
      v.allowCursorActivity = true;
      console.log('Dragging: ' + resize + ' ' + dx + '/' + dy + ', txt: ', txt);
    }
  } // mouseMove()

  function mouseUp(ev) {
    resize = '';
  } // mouseUp()
} // addZoneResizer()

/**
 * Adds eventlisteners to sourceImageSvg to enable
 * drawing of new zones with mouse click-and-drag
 */
export function addZoneDrawer() {
  let ip = document.getElementById('facsimile-panel');
  let svg = document.getElementById('sourceImageSvg');
  let start = {}; // starting point start.x, start.y
  let end = {}; // ending point
  let drawing = '';
  let minSize = 20; // px, minimum width and height for a zone

  svg.addEventListener('mousedown', mouseDown);
  svg.addEventListener('mousemove', mouseMove);
  svg.addEventListener('mouseup', mouseUp);

  function mouseDown(ev) {
    ev.preventDefault();
    if (document.getElementById('editFacsimileZones').checked && !resize) {
      start.x = ev.clientX; // + ip.scrollLeft;
      start.y = ev.clientY; // + ip.scrollTop;

      var mx = svg.getScreenCTM().inverse();
      let s = transformCTM(start, mx);

      let rect = document.createElementNS(svgNameSpace, 'rect');
      rect.id = 'new-rect';
      rect.setAttribute('rx', rectangleLineWidth / 2);
      rect.setAttribute('ry', rectangleLineWidth / 2);
      rect.setAttribute('x', s.x + ulx); // global variable ulx (upper-left corner)
      rect.setAttribute('y', s.y + uly); // global variable uly (upper-left corner)
      rect.setAttribute('stroke', rectangleColor);
      rect.setAttribute('stroke-width', rectangleLineWidth);
      rect.setAttribute('fill', 'none');
      svg.appendChild(rect);
      drawing = 'new';
      console.log(
        'ZoneDrawer mouse down: ' +
          drawing +
          '; ' +
          ev.clientX +
          '/' +
          ev.clientY +
          ', scroll: ' +
          ip.scrollLeft +
          '/' +
          ip.scrollTop +
          ', start: ',
        start
      );
    }
  } // mouseDown()

  function mouseMove(ev) {
    ev.preventDefault();
    if (document.getElementById('editFacsimileZones').checked && drawing === 'new') {
      let rect = document.getElementById('new-rect');
      if (rect && !resize) {
        end.x = ev.clientX;
        end.y = ev.clientY;
        var mx = svg.getScreenCTM().inverse();
        let s = transformCTM(start, mx);
        let e = transformCTM(end, mx);
        let c = adjustCoordinates(s.x, s.y, e.x - s.x, e.y - s.y);
        rect.setAttribute('x', c.x + ulx); // global variable ulx (upper-left corner)
        rect.setAttribute('y', c.y + uly); // global variable uly (upper-left corner)
        rect.setAttribute('width', c.width);
        rect.setAttribute('height', c.height);
      }
    }
  } // mouseMove()

  function mouseUp(ev) {
    if (document.getElementById('editFacsimileZones').checked && !resize) {
      let rect = document.getElementById('new-rect');
      if (
        rect &&
        Math.round(rect.getAttribute('width')) > minSize &&
        Math.round(rect.getAttribute('height')) > minSize
      ) {
        let metaPressed = isCtrlOrCmd(ev);
        // * Without modifier key: select an existing element (e.g. measure, dynam)
        //   a zone will be added to pertinent surface and @facs add to the selected element
        // * With CMD/CTRL: select a zone, add a zone afterwards and a measure;
        let uuid = addZone(v, cm, rect, metaPressed);
        if (uuid) {
          rect.addEventListener('click', (e) => v.handleClickOnNotation(e, cm));
          // drawBoundingBox(uuid); // TODO: add number-like label here
          highlightZone(rect);
        } else {
          if (rect) rect.remove();
          let warning = 'Cannot add zone element. ';
          if (!metaPressed) {
            warning += 'Please select an allowed element first (' + attFacsimile + ').';
          } else {
            warning += 'Please select an existing zone element first.';
          }
          v.showAlert(warning, 'warning', 15000);
          console.warn(warning);
        }
      } else if (rect) {
        rect.remove();
      }
      drawing = '';
    }
  } // mouseUp()
} // addZoneDrawer()

/**
 * Converts negative width/height to always positive
 * left-upper corner & width/height values in an object
 * @param {int} x
 * @param {int} y
 * @param {int} width
 * @param {int} height
 * @returns {object}
 */
function adjustCoordinates(x, y, width, height) {
  let c = {};
  c.x = Math.min(x, x + width);
  c.y = Math.min(y, y + height);
  c.width = Math.abs(width);
  c.height = Math.abs(height);
  return c;
} // adjustCoordinates()

/**
 * Creates input dialog to load facsimile skeleton file
 * to be ingested into the existing MEI file, and
 * adds ingestionInputHander to input element.
 */
export function ingestFacsimile() {
  let reply = {};
  let input = document.createElement('input');
  input.type = 'file';
  let accept = '.mei,.xml,.musicxml,.txt';
  input.accept = accept;
  input.addEventListener('change', (ev) => ingestionInputHandler(ev));
  input.click();
} // ingestFacsimile()

/**
 * Handles loading of ingestion file and calls
 * handleFacsimileIngestion() to finalize ingestion
 * @param {event} ev
 */
function ingestionInputHandler(ev) {
  let files = Array.from(ev.target.files);
  let reply = {};

  let readingPromise = new Promise(function (loaded, notLoaded) {
    reply.fileName = files[0].name;
    let reader = new FileReader();
    reader.onload = (event) => {
      reply.mei = event.target.result;
      if (reply.mei) loaded(reply);
      else notLoaded();
    };
    reader.readAsText(files[0]);
  });
  readingPromise.then(
    function (reply) {
      handleFacsimileIngestion(reply);
    },
    function () {
      log('Loading of ingestion file ' + reply.fileName + ' failed.');
    }
  );
} // ingestionInputHandler()

/**
 * Handles ingestion of facsimile information into current MEI file
 * and adds a @facs attribute into each measure based on the @n attribute
 * @param {object} reply
 * @returns
 */
function handleFacsimileIngestion(reply) {
  busy();
  console.log('Skeleton MEI file ' + reply.fileName + ' loaded.');
  let skelXml = new DOMParser().parseFromString(reply.mei, 'text/xml');
  let facsimile = skelXml.querySelector('facsimile');
  let zones = facsimile.querySelectorAll('zone');
  let music = v.xmlDoc.querySelector('music');
  if (!music) return;
  v.allowCursorActivity = false;

  // ingest facsimile into target MEI (in music before body)
  let body = music.querySelector('body');
  if (body) {
    music.insertBefore(facsimile, body);
    let id = body.getAttribute('xml:id');
    let cr; // cursor
    if (id) {
      setCursorToId(cm, id);
    } else {
      // search for (first) body element in encoding
      let sc = cm.getSearchCursor('<body');
      if (sc.findNext()) {
        cm.setCursor(sc.from());
      } else {
        let msg = 'Ingesting facsimile failed, because no body element was found. ';
        v.showAlert(msg);
      }
    }
    cr = cm.getCursor();
    cm.replaceRange(xmlToString(facsimile) + '\n', cr);
    let cr2 = cm.getCursor();
    for (let l = cr.line; l <= cr2.line; l++) cm.indentLine(l);
    // loadFacsimile(v.xmlDoc);
    console.log('Adding facsimile before body', facsimile);
  }

  let warnings = '';
  zones.forEach((z) => {
    let zoneId = '';
    if (z.hasAttribute('xml:id')) zoneId = z.getAttribute('xml:id');
    let type = '';
    if (z.hasAttribute('type')) type = z.getAttribute('type');
    let ms = skelXml.querySelectorAll('[facs="#' + zoneId + '"]');
    ms.forEach((m) => {
      let n = m.getAttribute('n');
      let pointerElement = music.querySelectorAll(type + '[n="' + n + '"]');
      if (pointerElement.length < 1) {
        warnings += type + '@n not found: n=' + n + '.<br>';
      }
      if (pointerElement.length > 1) {
        warnings += type + '@n not unique: n=' + n + '.<br>';
      }
      if (pointerElement.length === 1) {
        // console.info('Adding @facs=' + zoneId + ' to ', pointerElement)
        pointerElement.item(0).setAttribute('facs', '#' + zoneId);
        replaceInEditor(cm, pointerElement.item(0));
      }
    });
  });
  if (warnings) {
    warnings = '<h2>Facsimile ingested.</h2>These problems were encountered during facsimile ingestion:<br>' + warnings;
    v.showAlert(warnings, 'warning');
    // console.log(warnings);
  }

  // uncheck edit zones after ingest
  document.getElementById('editFacsimileZones').checked = false;
  v.updateData(cm, false, true);
  v.allowCursorActivity = true;
  busy(false);
} // handleFacsimileIngestion()

/**
 * Set facsimile icon to busy (true) or idle (false)
 * @param {boolean} active
 */
function busy(active = true) {
  let facsimileIcon = document.getElementById('facsimileIcon');
  if (facsimileIcon && active) {
    facsimileIcon.classList.add('clockwise');
  } else if (facsimileIcon && !active) facsimileIcon.classList.remove('clockwise');
} // busy()

/**
 * Retrieve current pb element with a @facs attribute for the currently
 * displayed page, based on first g.measure/g.barLine element in SVG
 * @param {Document} xmlDoc
 * @returns {Element} page beginning element (or null, if none found)
 */
function getCurrentPbElement(xmlDoc) {
  let referenceElement = document.querySelector('g.measure,g.barLine');
  let pb = null;
  if (referenceElement) {
    let elementList = xmlDoc.querySelectorAll('pb[facs],[*|id="' + referenceElement.id + '"');
    for (let p of elementList) {
      if (p.nodeName === referenceElement.classList[0]) {
        break;
      } else {
        pb = p;
      }
    }
  }
  return pb;
} // getCurrentPbElement()
