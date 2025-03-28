import {
  annotationPanelExtent,
  defaultNotationResizerWidth,
  defaultFacsimileOrientation,
  defaultNotationOrientation,
  defaultNotationProportion,
  defaultFacsimileProportion,
  defaultFacsimileResizerWidth,
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
 */
export function setOrientation(cm, _notationOrientation = '', _facsimileOrientation = '', v = null, _storage = null) {
  // store arguments
  if (_notationOrientation) notationOrientation = _notationOrientation;
  if (_facsimileOrientation) {
    facsimileOrientation = _facsimileOrientation;
    document.getElementById('selectFacsimilePanelOrientation').value = facsimileOrientation;
  }
  if (_storage !== null) storage = _storage;

  // save in local storage
  if (storage && storage.supported) {
    storage.notationOrientation = notationOrientation;
    storage.facsimileOrientation = facsimileOrientation;
  }

  // change CSS for notation orientation
  let stylesheet = document.getElementById('orientationCSS');
  stylesheet.setAttribute('href', root + 'css/' + notationOrientation + '.css');
  // change CSS for facsimile orientation
  facsimileOrientation = document.getElementById('selectFacsimilePanelOrientation').value;
  let facsCss = document.getElementById('facsimileOrientationCSS');
  facsCss.setAttribute('href', root + 'css/facsimile-' + facsimileOrientation + '.css');

  const friendSz = document.getElementById('friendContainer');
  const notationDiv = document.getElementById('notation');
  const verovioContainer = document.getElementById('verovioContainer');
  const facsimileDragger = document.getElementById('facsimile-dragger');
  const facsimileContainer = document.getElementById('facsimileContainer');
  const annotationPanel = document.getElementById('annotationPanel');
  const showAnnotationPanelCheckbox = document.getElementById('showAnnotationPanel');
  const showFacsimile = document.getElementById('showFacsimilePanel').checked;
  const codeChecker = document.getElementById('codeChecker');
  const codeCheckerHeight = codeChecker.getBoundingClientRect().height;
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
    cm.setSize(
      sz.width,
      sz.height * (1 - notationProportion) - notationResizerWidth - 2 * notationBorderWidth - codeCheckerHeight
    );
    if (codeChecker) {
      codeChecker.style.width = 'unset';
    }
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
    let cmWidth = sz.width * (1 - notationProportion) - notationResizerWidth - 2 * encodingBorderWidth;
    cm.setSize(cmWidth, sz.height - codeCheckerHeight);
    if (codeChecker) {
      codeChecker.style.width = cmWidth;
    }
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
  const resizer = document.getElementById('dragMe');
  const notation = resizer.previousElementSibling;
  const encoding = resizer.nextElementSibling;
  const verovioContainer = document.getElementById('verovioContainer');
  const facsimileContainer = document.getElementById('facsimileContainer');
  const codeChecker = document.getElementById('codeChecker');
  let x = 0; // x coordinate at mouse down
  let y = 0; // y coordinate at mouse down
  let notationSize = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;
    y = e.clientY;
    if (notationOrientation === 'top' || notationOrientation === 'bottom') {
      notationSize = notation.getBoundingClientRect().height;
    } else if (notationOrientation === 'left' || notationOrientation === 'right') {
      notationSize = notation.getBoundingClientRect().width;
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    console.log('Mouse down x/y: ' + x + '/' + y + ', ' + notationSize);
  }; // mouseDownHandler

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    let sz = resizer.parentNode.getBoundingClientRect();
    const codeChecker = document.getElementById('codeChecker');
    const codeCheckerHeight = codeChecker.getBoundingClientRect().height;
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
    console.log(
      'Mouse move x/y: ' +
        x +
        '/' +
        y +
        ', dx/dy: ' +
        dx +
        '/' +
        dy +
        ', Container: ' +
        sz.width +
        '/' +
        sz.height +
        ', Notationproporion: ' +
        notationProportion +
        ', codeCheckerHeight: ' +
        codeCheckerHeight
    );
    // restrict to min/max
    notationProportion = Math.min(maxProportion, Math.max(minProportion, notationProportion));
    // update relative size of facsimile images, if active

    switch (notationOrientation) {
      case 'top':
      case 'bottom':
        notation.style.height = notationProportion * sz.height;
        cm.setSize(
          sz.width,
          sz.height * (1 - notationProportion) - notationResizerWidth - 2 * encodingBorderWidth - codeCheckerHeight
        );
        if (
          document.getElementById('showFacsimilePanel').checked &&
          (facsimileOrientation === 'top' || facsimileOrientation === 'bottom')
        ) {
          verovioContainer.style.height = parseFloat(notation.style.height) * (1 - facsimileProportion);
          facsimileContainer.style.height =
            parseFloat(notation.style.height) * facsimileProportion - facsimileResizerWidth - 2 * notationBorderWidth;
        }
        break;
      case 'left':
      case 'right':
        notation.style.width = sz.width * notationProportion;
        let cmWidth = sz.width * (1 - notationProportion) - notationResizerWidth - 2 * encodingBorderWidth;
        let cmHeight = sz.height - codeCheckerHeight;
        console.log('L/R: cmWidth/cmHeight: ' + cmWidth + '/' + cmHeight);
        cm.setSize(cmWidth, cmHeight);
        if (codeChecker) {
          codeChecker.style.width = cmWidth;
        }
        // set facsimile size
        if (
          document.getElementById('showFacsimilePanel').checked &&
          (facsimileOrientation === 'left' || facsimileOrientation === 'right')
        ) {
          verovioContainer.style.width = parseFloat(notation.style.width) * (1 - facsimileProportion);
          facsimileContainer.style.width =
            parseFloat(notation.style.width) * facsimileProportion - facsimileResizerWidth - 2 * notationBorderWidth;
        }
        break;
    }
    // console.log('notation w/h: ' + notation.style.width + '/' + notation.style.height)
    const cursor = notationOrientation === 'left' || notationOrientation === 'right' ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;
    notation.style.userSelect = 'none';
    notation.style.pointerEvents = 'none';
    encoding.style.userSelect = 'none';
    encoding.style.pointerEvents = 'none';
  }; // mouseMoveHandler

  const mouseUpHandler = function () {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');
    notation.style.removeProperty('user-select');
    notation.style.removeProperty('pointer-events');
    encoding.style.removeProperty('user-select');
    encoding.style.removeProperty('pointer-events');
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

  resizer.addEventListener('mousedown', mouseDownHandler);
} // addNotationResizerHandlers()

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
