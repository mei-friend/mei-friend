import { adjustCtrlMenuOverflow, hideAllOverflowContents } from './control-menu.js';
import {
  annotationPanelExtent,
  defaultNotationResizerWidth,
  defaultFacsimileOrientation,
  defaultNotationOrientation,
  defaultNotationProportion,
  defaultFacsimileProportion,
  defaultFacsimileResizerWidth,
  defaultMeiToolboxHeight,
  defaultMeiToolboxWidth,
  defaultMeiToolboxResizerWidth,
  defaultMeiToolboxOrientation,
} from './defaults.js';

// notation variables (verovioContainer)
let notationOrientation = defaultNotationOrientation; // position of notation
let notationProportion = defaultNotationProportion; // proportion notation div takes from container
const notationResizerWidth = defaultNotationResizerWidth; // 3 px, Attention: hard-coded also in left.css, right.css, top.css, bottom.css
// facsimile variables (facsimileContainer)
let facsimileOrientation = defaultFacsimileOrientation; // notationOrientation of facsimile relative to notation
let facsimileProportion = defaultFacsimileProportion;
const facsimileResizerWidth = defaultFacsimileResizerWidth; // px, compare to css facsimile-[left/right/top/bottom].css
const notationBorderWidth = 3; // px, border width of notation panel, cf. default.css #notation
const encodingBorderWidth = 3; // px, border width of encoding panel, cf. default.css #encoding
// MEI toolbox variables (#meiToolbox inside #encoding)
let meiToolboxOrientation = defaultMeiToolboxOrientation; // position of the toolbox relative to the editor
const meiToolboxResizerWidth = defaultMeiToolboxResizerWidth; // px, cf. css toolbox-[left/right/top/bottom].css
export let meiToolboxHeight = defaultMeiToolboxHeight; // px, extent of the toolbox at top/bottom
export let meiToolboxWidth = defaultMeiToolboxWidth; // px, extent of the toolbox at left/right

/**
 * Whether the MEI toolbox is currently shown. Like the facsimile panel, the
 * settings checkbox is the single source of truth for its visibility.
 * @returns {boolean}
 */
export function meiToolboxVisible() {
  return !!document.getElementById('showMeiToolbox')?.checked;
} // meiToolboxVisible()

/**
 * Whether the MEI toolbox currently sits beside the editor (rather than above or below).
 * @returns {boolean}
 */
export function meiToolboxBeside() {
  return meiToolboxOrientation === 'left' || meiToolboxOrientation === 'right';
} // meiToolboxBeside()

const minToolboxWidth = 220; // px, narrower than this the toolbox is not usable
const minToolboxHeight = 120;
const minEditorWidth = 200; // px, the editor keeps at least this much beside the toolbox
const minEditorHeight = 80;

/**
 * Keeps the extent of the toolbox between its own minimum and the extent that
 * leaves the editor its minimum; an extent larger than the panel wins over the
 * minimum of the editor, so that the toolbox stays usable in a small window.
 * @param {number} extent
 * @param {number} available extent of the encoding panel on the same axis
 * @param {number} minExtent
 * @param {number} minEditor
 * @returns {number}
 */
function clampExtent(extent, available, minExtent, minEditor) {
  const max = Math.max(minExtent, available - meiToolboxResizerWidth - minEditor);
  return Math.round(Math.min(Math.max(extent, minExtent), max));
} // clampExtent()

/**
 * Restores the stored extents of the MEI toolbox (px). Values that are not a
 * number (nothing stored yet) leave the current extent untouched.
 * @param {number} width
 * @param {number} height
 */
export function setMeiToolboxExtent(width, height) {
  if (Number.isFinite(width) && width > 0) meiToolboxWidth = width;
  if (Number.isFinite(height) && height > 0) meiToolboxHeight = height;
} // setMeiToolboxExtent()

/**
 * Sizes the MEI toolbox within the encoding panel: it spans the encoding panel on
 * the axis it does not take its extent from, so that it fills the side it sits on.
 * @param {Element} toolbox #meiToolbox
 * @param {boolean} visible
 * @param {number} encodingWidth px available to the encoding panel
 * @param {number} encodingHeight px available to the encoding panel
 */
function sizeToolbox(toolbox, visible, encodingWidth, encodingHeight) {
  if (!toolbox) return;
  if (!visible) {
    toolbox.style.width = '';
    toolbox.style.height = '';
    return;
  }
  if (meiToolboxBeside()) {
    meiToolboxWidth = clampExtent(meiToolboxWidth, encodingWidth, minToolboxWidth, minEditorWidth);
    toolbox.style.width = meiToolboxWidth + 'px';
    toolbox.style.height = encodingHeight + 'px';
  } else {
    meiToolboxHeight = clampExtent(meiToolboxHeight, encodingHeight, minToolboxHeight, minEditorHeight);
    toolbox.style.width = encodingWidth + 'px';
    toolbox.style.height = meiToolboxHeight + 'px';
  }
} // sizeToolbox()

// general settings
const minProportion = 0.05; // mimimum proportion of both notationProportion, facsimileProportion
const maxProportion = 0.95;
let storage; // storage object for local storage

/**
 * Sets orientation of notation and facsimile panel, updates CSS,
 * and refreshes rendering of GUI.
 * @param {CodeMirror} cm
 * @param {String} _notationOrientation
 * @param {String} _facsimileOrientation
 * @param {Viewer} v
 * @param {Object} _storage
 * @param {String} _meiToolboxOrientation
 */
export function setOrientation(
  cm,
  _notationOrientation = '',
  _facsimileOrientation = '',
  v = null,
  _storage = null,
  _meiToolboxOrientation = ''
) {
  // store arguments
  if (_notationOrientation) notationOrientation = _notationOrientation;
  if (_facsimileOrientation) {
    facsimileOrientation = _facsimileOrientation;
    document.getElementById('selectFacsimilePanelOrientation').value = facsimileOrientation;
  }
  if (_meiToolboxOrientation) {
    meiToolboxOrientation = _meiToolboxOrientation;
    const select = document.getElementById('selectMeiToolboxOrientation');
    if (select) select.value = meiToolboxOrientation;
  }
  if (_storage !== null) storage = _storage;

  // save in local storage
  if (storage && storage.supported) {
    storage.notationOrientation = notationOrientation;
    storage.facsimileOrientation = facsimileOrientation;
    storage.meiToolboxOrientation = meiToolboxOrientation;
  }

  // change CSS for notation orientation
  let stylesheet = document.getElementById('orientationCSS');
  stylesheet.setAttribute('href', root + 'css/' + notationOrientation + '.css');
  // change CSS for facsimile orientation
  facsimileOrientation = document.getElementById('selectFacsimilePanelOrientation').value;
  let facsCss = document.getElementById('facsimileOrientationCSS');
  facsCss.setAttribute('href', root + 'css/facsimile-' + facsimileOrientation + '.css');
  // change CSS for MEI toolbox orientation
  const toolboxSelect = document.getElementById('selectMeiToolboxOrientation');
  if (toolboxSelect) meiToolboxOrientation = toolboxSelect.value;
  const toolboxCss = document.getElementById('meiToolboxOrientationCSS');
  if (toolboxCss) toolboxCss.setAttribute('href', root + 'css/toolbox-' + meiToolboxOrientation + '.css');

  const friendSz = document.getElementById('friendContainer');
  const notationDiv = document.getElementById('notation');
  const verovioContainer = document.getElementById('verovioContainer');
  const facsimileDragger = document.getElementById('facsimile-dragger');
  const facsimileContainer = document.getElementById('facsimileContainer');
  const annotationPanel = document.getElementById('annotationPanel');
  const showAnnotationPanelCheckbox = document.getElementById('showAnnotationPanel');
  const showFacsimile = document.getElementById('showFacsimilePanel').checked;
  // the toolbox takes its extent from the side it sits on: height at top/bottom,
  // width at left/right; mtHeight/mtWidth are what the editor loses to it
  const meiToolbox = document.getElementById('meiToolbox');
  const showToolbox = meiToolboxVisible();
  let mtHeight = 0;
  let mtWidth = 0;
  if (meiToolbox) {
    meiToolbox.style.display = showToolbox ? 'flex' : 'none';
    document.getElementById('meiToolboxResizer').style.display = showToolbox ? 'flex' : 'none';
    if (showToolbox) {
      if (meiToolboxBeside()) mtWidth = meiToolboxWidth + meiToolboxResizerWidth;
      else mtHeight = meiToolboxHeight + meiToolboxResizerWidth;
    }
  }
  let sz = calcSizeOfContainer(); // friendContainer
  // console.log('setOrientation(' + _notationOrientation + ') container size:', sz);

  // make container smaller, if settings panel should take space from friend container
  const settingsPanel = document.getElementById('settingsPanel');
  if (v && v.settingsReplaceFriendContainer && settingsPanel && settingsPanel.classList.contains('in')) {
    sz.width -= document.getElementById('settingsPanel').getBoundingClientRect().width;
  }

  // check for notation orientation
  if (notationOrientation === 'top' || notationOrientation === 'bottom') {
    if (showAnnotationPanelCheckbox && showAnnotationPanelCheckbox.checked) {
      sz.width -= annotationPanelExtent; // subtract width of annotation panel
      annotationPanel.style.display = 'unset';
      annotationPanel.style.width = annotationPanelExtent;
      annotationPanel.style.height = sz.height; // + 5; WG: Hack removed here. // DW: HACK for 5 pix difference!
    } else {
      annotationPanel.style.display = 'none';
    }
    notationDiv.style.width = sz.width; // - 2 * notationBorderWidth;
    notationDiv.style.height = sz.height * notationProportion;
    const encodingWidth = sz.width;
    const encodingHeight = sz.height * (1 - notationProportion) - notationResizerWidth - 2 * notationBorderWidth;
    cm.setSize(encodingWidth - mtWidth, encodingHeight - mtHeight);
    sizeToolbox(meiToolbox, showToolbox, encodingWidth, encodingHeight);
  }
  if (notationOrientation === 'left' || notationOrientation === 'right') {
    if (showAnnotationPanelCheckbox && showAnnotationPanelCheckbox.checked) {
      sz.height -= annotationPanelExtent; // subtract width of annotation panel
      annotationPanel.style.display = 'unset';
      annotationPanel.style.width = sz.width; // + 5; WG: hack removed here. // HACK for 5 pix difference!
      annotationPanel.style.height = annotationPanelExtent;
    } else {
      annotationPanel.style.display = 'none';
    }
    notationDiv.style.width = Math.floor(sz.width * notationProportion);
    notationDiv.style.height = sz.height;
    const encodingWidth = sz.width * (1 - notationProportion) - notationResizerWidth - 2 * encodingBorderWidth;
    const encodingHeight = sz.height;
    cm.setSize(encodingWidth - mtWidth, encodingHeight - mtHeight);
    sizeToolbox(meiToolbox, showToolbox, encodingWidth, encodingHeight);
  }
  friendSz.style.width = sz.width;
  friendSz.style.maxWidth = sz.width;
  friendSz.style.height = sz.height;
  friendSz.style.maxHeight = sz.height;

  switch (facsimileOrientation) {
    case 'bottom':
    case 'top':
      if (showFacsimile) {
        facsimileContainer.style.display = 'flex';
        facsimileContainer.style.height =
          parseFloat(notationDiv.style.height) * facsimileProportion - facsimileResizerWidth - 2 * notationBorderWidth;
        verovioContainer.style.height = parseFloat(notationDiv.style.height) * (1 - facsimileProportion);
      } else {
        facsimileContainer.style.display = 'none';
        facsimileContainer.style.height = '';
        verovioContainer.style.height = '';
      }
      facsimileContainer.style.width = '';
      verovioContainer.style.width = '';
      break;
    case 'left':
    case 'right':
      if (showFacsimile) {
        facsimileContainer.style.display = 'flex';
        facsimileContainer.style.width =
          parseFloat(notationDiv.style.width) * facsimileProportion - facsimileResizerWidth - 2 * notationBorderWidth;
        verovioContainer.style.width = parseFloat(notationDiv.style.width) * (1 - facsimileProportion);
      } else {
        facsimileContainer.style.display = 'none';
        facsimileContainer.style.width = '';
        verovioContainer.style.width = '';
      }
      facsimileContainer.style.height = '';
      // parseFloat(notationDiv.style.height) - facsimileControlMenu.getBoundingClientRect().height;
      verovioContainer.style.height = '';
      break;
  }
  facsimileDragger.style.display = showFacsimile ? 'flex' : 'none';

  // redoLayout when done with loading, only when viewer object (v) present
  if (v) {
    if (v.speedMode && document.getElementById('breaksSelect').value === 'auto') {
      v.pageBreaks = {};
      v.pageSpanners = { start: {}, end: {} };
      setTimeout(() => v.updateAll(cm), 33);
    } else {
      setTimeout(() => v.updateLayout(), 33);
    }
  }
  // handle any overflowing buttons in currently available control menus
  adjustOverflows();
} // setOrientation()

export function getOrientation() {
  return notationOrientation;
}

export function setNotationProportion(prop) {
  notationProportion = prop;
}

export function getNotationProportion() {
  return notationProportion;
}

export function setFacsimileProportion(prop) {
  facsimileProportion = prop;
}

export function getFacsimileProportion() {
  return facsimileProportion;
}

export function getFacsimileOrientation() {
  return facsimileOrientation;
}

/**
 * Returns size of #friendContainer minus header, footer, and MIDI panel
 * @returns {Object} friendSz - width and height of friendContainer
 */
export function calcSizeOfContainer() {
  let bodySz = document.querySelector('body').getBoundingClientRect();
  let friendSz = document.getElementById('friendContainer').getBoundingClientRect();
  let headerSz = document.querySelector('.header').getBoundingClientRect();
  //let sizerSz = document.querySelector('.resizer').getBoundingClientRect();
  const midiPanelSz = document.getElementById('midiPlaybackControlBar').getBoundingClientRect();
  let footerSz = document.querySelector('.footer').getBoundingClientRect();
  friendSz.height = bodySz.height - headerSz.height - footerSz.height - notationResizerWidth - midiPanelSz.height;
  friendSz.width = bodySz.width - notationResizerWidth + 2; // TODO: hack for missing 2-px-width (21 April 2022)
  // console.log('calcSizeOfContainer(' + notationOrientation + ') bodySz, header, sizer, footer: ' +
  // Math.round(bodySz.width) + '/' + Math.round(bodySz.height) + ', ' +
  // Math.round(headerSz.width) + '/' + Math.round(headerSz.height) + ', ' +
  // Math.round(footerSz.width) + '/' + Math.round(footerSz.height) + ', ' +
  // Math.round(friendSz.width) + '/' + Math.round(friendSz.height) + '.');
  return friendSz;
}

/**
 * Adds resizer handlers for resizing the notation/editor relative size
 * @param {Viewer*} v
 * @param {CodeMirror} cm
 */
export function addNotationResizerHandlers(v, cm) {
  const notationResizer = document.getElementById('dragMe');
  const notationPanel = notationResizer.previousElementSibling;
  const encodingPanel = notationResizer.nextElementSibling;
  const verovioContainer = document.getElementById('verovioContainer');
  const facsimileContainer = document.getElementById('facsimileContainer');
  let x = 0; // x coordinate at mouse down
  let y = 0; // y coordinate at mouse down
  let notationSize = 0;

  const mouseDownHandler = function (e) {
    hideAllOverflowContents(); // close any open overflow dropdown without hiding the burger icon
    x = e.clientX;
    y = e.clientY;
    if (notationOrientation === 'top' || notationOrientation === 'bottom') {
      notationSize = notationPanel.getBoundingClientRect().height;
    } else if (notationOrientation === 'left' || notationOrientation === 'right') {
      notationSize = notationPanel.getBoundingClientRect().width;
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    console.log('Mouse down x/y: ' + x + '/' + y + ', ' + notationSize);
  }; // mouseDownHandler

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    let sz = notationResizer.parentNode.getBoundingClientRect();
    const meiToolbox = document.getElementById('meiToolbox');
    let mtHeight = 0;
    if (meiToolbox && meiToolbox.style.display !== 'none') {
      mtHeight = meiToolboxHeight + meiToolboxResizerHeight;
      document.getElementById('meiToolboxResizer').style.display = 'flex';
    } else {
      document.getElementById('meiToolboxResizer').style.display = 'none';
    }
    switch (notationOrientation) {
      case 'top':
        notationProportion = (notationSize + dy) / sz.height;
        break;
      case 'bottom':
        notationProportion = (notationSize - dy) / sz.height;
        break;
      case 'right':
        notationProportion = (notationSize - dx) / sz.width;
        break;
      case 'left':
        notationProportion = (notationSize + dx) / sz.width;
        break;
    }
    // console.log(
    //   'Mouse move x/y: ' +
    //     x +
    //     '/' +
    //     y +
    //     ', dx/dy: ' +
    //     dx +
    //     '/' +
    //     dy +
    //     ', Container: ' +
    //     sz.width +
    //     '/' +
    //     sz.height +
    //     ', Notationproporion: ' +
    //     notationProportion +
    //     ', meiToolboxHeight: ' +
    //     mtHeight
    // );
    // restrict to min/max
    notationProportion = Math.min(maxProportion, Math.max(minProportion, notationProportion));
    // update relative size of facsimile images, if active

    switch (notationOrientation) {
      case 'top':
      case 'bottom':
        notationPanel.style.height = notationProportion * sz.height;
        cm.setSize(
          sz.width,
          sz.height * (1 - notationProportion) - notationResizerWidth - 2 * encodingBorderWidth - mtHeight
        );
        if (
          document.getElementById('showFacsimilePanel').checked &&
          (facsimileOrientation === 'top' || facsimileOrientation === 'bottom')
        ) {
          verovioContainer.style.height = parseFloat(notationPanel.style.height) * (1 - facsimileProportion);
          facsimileContainer.style.height =
            parseFloat(notationPanel.style.height) * facsimileProportion -
            facsimileResizerWidth -
            2 * notationBorderWidth;
        }
        break;
      case 'left':
      case 'right':
        notationPanel.style.width = sz.width * notationProportion;
        let cmWidth = sz.width * (1 - notationProportion) - notationResizerWidth - 2 * encodingBorderWidth;
        let cmHeight = sz.height - mtHeight;
        // console.log('L/R: cmWidth/cmHeight: ' + cmWidth + '/' + cmHeight);
        cm.setSize(cmWidth, cmHeight);
        if (meiToolbox) {
          meiToolbox.style.width = cmWidth;
        }
        // set facsimile size
        if (
          document.getElementById('showFacsimilePanel').checked &&
          (facsimileOrientation === 'left' || facsimileOrientation === 'right')
        ) {
          verovioContainer.style.width = parseFloat(notationPanel.style.width) * (1 - facsimileProportion);
          facsimileContainer.style.width =
            parseFloat(notationPanel.style.width) * facsimileProportion -
            facsimileResizerWidth -
            2 * notationBorderWidth;
        }
        break;
    }
    // console.log('notation w/h: ' + notation.style.width + '/' + notation.style.height)
    const cursor = notationOrientation === 'left' || notationOrientation === 'right' ? 'col-resize' : 'row-resize';
    notationResizer.style.cursor = cursor;
    document.body.style.cursor = cursor;
    notationPanel.style.userSelect = 'none';
    notationPanel.style.pointerEvents = 'none';
    encodingPanel.style.userSelect = 'none';
    encodingPanel.style.pointerEvents = 'none';
    scheduleAdjustOverflows();
  }; // mouseMoveHandler

  const mouseUpHandler = function () {
    notationResizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');
    notationPanel.style.removeProperty('user-select');
    notationPanel.style.removeProperty('pointer-events');
    encodingPanel.style.removeProperty('user-select');
    encodingPanel.style.removeProperty('pointer-events');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    if (v) {
      setOrientation(cm, '', '', v);
    }
    // save notationPorportion in local storage
    if (storage && storage.supported) {
      storage.notationProportion = notationProportion;
    }
  }; // mouseUpHandler

  // handle any overflowing buttons in currently available control menus
  adjustOverflows();

  notationResizer.addEventListener('mousedown', mouseDownHandler);
} // addNotationResizerHandlers()

function adjustOverflows() {
  // adjust control menus, moving occluded buttons into overflow menu if necessary
  const notationControlMenu = document.getElementById('notationControlMenu');
  if (notationControlMenu && notationControlMenu.style.display !== 'none') {
    adjustCtrlMenuOverflow(notationControlMenu);
  }
  const facsimileControlMenu = document.getElementById('facsimileControlMenu');
  if (facsimileControlMenu && facsimileContainer.style.display !== 'none') {
    adjustCtrlMenuOverflow(facsimileControlMenu);
  }
}

// Coalesces adjustOverflows() calls into one per animation frame so high-rate mousemove
// events (e.g. 1000 Hz pointers) don't trigger redundant layout work mid-drag.
let adjustOverflowsRafId = null;
function scheduleAdjustOverflows() {
  if (adjustOverflowsRafId !== null) return;
  adjustOverflowsRafId = requestAnimationFrame(() => {
    adjustOverflowsRafId = null;
    adjustOverflows();
  });
}

/**
 * Adds resizer handlers for resizing the facsimile panel
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function addFacsimilerResizerHandlers(v, cm) {
  const resizer = document.getElementById('facsimile-dragger');
  const verovioContainer = document.getElementById('verovioContainer');
  const facsimileContainer = document.getElementById('facsimileContainer');
  let x = 0;
  let y = 0;
  let facsimileContainerSize = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;
    y = e.clientY;
    if (facsimileOrientation === 'top' || facsimileOrientation === 'bottom')
      facsimileContainerSize = facsimileContainer.getBoundingClientRect().height;
    if (facsimileOrientation === 'left' || facsimileOrientation === 'right')
      facsimileContainerSize = facsimileContainer.getBoundingClientRect().width;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    // console.log("Mouse down x/y: " + x + "/" + y + ', ' + facsimileContainerSize);
  }; // mouseDownHandler

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    let sz = resizer.parentNode.getBoundingClientRect();
    // console.log("Mouse move dx/dy: " + dx + "/" + dy + ', Container: ' + sz.width + '/' + sz.height);
    switch (facsimileOrientation) {
      case 'bottom':
        facsimileProportion =
          (facsimileContainerSize - dy + facsimileResizerWidth + 2 * encodingBorderWidth) / sz.height;
        break;
      case 'left':
        facsimileProportion =
          (facsimileContainerSize + dx + facsimileResizerWidth + 2 * encodingBorderWidth) / sz.width;
        break;
      case 'right':
        facsimileProportion =
          (facsimileContainerSize - dx + facsimileResizerWidth + 2 * encodingBorderWidth) / sz.width;
        break;
      case 'top':
        facsimileProportion =
          (facsimileContainerSize + dy + facsimileResizerWidth + 2 * encodingBorderWidth) / sz.height;
        break;
    }
    // restrict to min/max
    facsimileProportion = Math.min(maxProportion, Math.max(minProportion, facsimileProportion));
    switch (facsimileOrientation) {
      case 'bottom':
      case 'top':
        verovioContainer.style.height = sz.height * (1 - facsimileProportion);
        facsimileContainer.style.height =
          sz.height * facsimileProportion - facsimileResizerWidth - 2 * notationBorderWidth;
        break;
      case 'left':
      case 'right':
        verovioContainer.style.width = sz.width * (1 - facsimileProportion);
        facsimileContainer.style.width =
          sz.width * facsimileProportion - facsimileResizerWidth - 2 * notationBorderWidth;
        break;
    }

    const cursor = facsimileOrientation === 'left' || facsimileOrientation === 'right' ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;
    verovioContainer.style.userSelect = 'none';
    verovioContainer.style.pointerEvents = 'none';
    facsimileContainer.style.userSelect = 'none';
    facsimileContainer.style.pointerEvents = 'none';
    scheduleAdjustOverflows();
  }; // mouseMoveHandler

  const mouseUpHandler = function () {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');
    verovioContainer.style.removeProperty('user-select');
    verovioContainer.style.removeProperty('pointer-events');
    facsimileContainer.style.removeProperty('user-select');
    facsimileContainer.style.removeProperty('pointer-events');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    if (v) {
      setOrientation(cm, '', '', v);
    }
    // save facsimileProportion in local storage
    if (storage && storage.supported) {
      storage.facsimileProportion = facsimileProportion;
    }
  }; // mouseUpHandler

  resizer.addEventListener('mousedown', mouseDownHandler);
} // addFacsimilerResizerHandlers()

/**
 * Adds resizer handlers for resizing the MEI toolbox
 */
export function addMeiToolboxResizerHandlers(v, cm) {
  const meiToolboxResizer = document.getElementById('meiToolboxResizer');
  const encodingPanel = document.getElementById('encoding');
  const meiToolbox = document.getElementById('meiToolbox');
  let start = 0; // mouse position at mouse down, on the axis being dragged
  let delta = 0;
  let sz;
  let beside = false;
  let startExtent = 0; // toolbox extent at mouse down

  const mouseDownHandler = function (e) {
    hideAllOverflowContents();
    beside = meiToolboxBeside();
    sz = encodingPanel.getBoundingClientRect();
    const toolboxSz = meiToolbox.getBoundingClientRect();
    startExtent = beside ? toolboxSz.width : toolboxSz.height;
    start = beside ? e.clientX : e.clientY;
    delta = 0;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }; // mouseDownHandler

  const mouseMoveHandler = function (e) {
    // dragging towards the editor grows the toolbox, whichever side it sits on
    const raw = beside ? e.clientX - start : e.clientY - start;
    delta = meiToolboxOrientation === 'left' || meiToolboxOrientation === 'top' ? raw : -raw;
    const extent = clampExtent(
      startExtent + delta,
      beside ? sz.width : sz.height,
      beside ? minToolboxWidth : minToolboxHeight,
      beside ? minEditorWidth : minEditorHeight
    );
    if (beside) {
      meiToolboxWidth = extent;
      meiToolbox.style.width = extent + 'px';
      cm.setSize(sz.width - extent - meiToolboxResizerWidth, null);
    } else {
      meiToolboxHeight = extent;
      meiToolbox.style.height = extent + 'px';
      cm.setSize(null, sz.height - extent - meiToolboxResizerWidth);
    }
    document.body.style.cursor = beside ? 'col-resize' : 'row-resize';
    encodingPanel.style.userSelect = 'none';
  }; // mouseMoveHandler

  const mouseUpHandler = function () {
    document.body.style.removeProperty('cursor');
    encodingPanel.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    if (v) setOrientation(cm, '', '', v);
    if (storage && storage.supported) {
      storage.meiToolboxWidth = meiToolboxWidth;
      storage.meiToolboxHeight = meiToolboxHeight;
    }
  }; // mouseUpHandler

  meiToolboxResizer.addEventListener('mousedown', mouseDownHandler);
} // addMeiToolboxResizerHandlers()
