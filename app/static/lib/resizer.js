// notation variables (verovio-container)
let notationOrientation = 'bottom'; // position of notation
let notationProportion = .5; // proportion notation div takes from container
let notationResizerWidth = 8; // 8 px, Attention: hard-coded also in left.css, right.css, top.css, bottom.css
// facsimile variables (facsimile-container)
let facsimileResizerWidth = 8; // px, compare to css facsimile-[left/right/top/bottom].css
let facsimileOrientation = 'bottom'; // notationOrientation of facsimile relative to notation
let facsimileProportion = .65;
// annotation panel size
let annotationPanelExtent = 250; // px, taken away from width of friendContainer
// general settings
let minProportion = .05; // mimimum proportion of both notationProportion, facsimileProportion
let maxProportion = .95;
let storage;

export function setOrientation(cm,
  _notationOrientation = '', _facsimileOrientation = '',
  _notationProportion = -1, _facsimileProportion = -1,
  v = null, _storage = null) {

  // store arguments
  if (_notationOrientation) notationOrientation = _notationOrientation;
  if (_facsimileOrientation) {
    facsimileOrientation = _facsimileOrientation;
    document.getElementById('selectFacsimilePanelOrientation').value = facsimileOrientation;
  }
  if (_notationProportion > 0) notationProportion = _notationProportion;
  if (_facsimileProportion > 0) facsimileProportion = _facsimileProportion;
  if (_storage !== null) storage = _storage;

  // save in local storage
  if (storage && storage.supported) {
    storage.notationOrientation = notationOrientation;
    storage.facsimileOrientation = facsimileOrientation;
  }

  // change CSS for notation orientation
  let stylesheet = document.getElementById("orientationCSS");
  stylesheet.setAttribute('href', root + 'css/' + notationOrientation + '.css');
  // change CSS for facsimile orientation
  facsimileOrientation = document.getElementById('selectFacsimilePanelOrientation').value;
  let facsCss = document.getElementById("facsimileOrientationCSS");
  facsCss.setAttribute('href', root + 'css/facsimile-' + facsimileOrientation + '.css');

  const friendSz = document.getElementById("friendContainer");
  const notationDiv = document.getElementById('notation');
  const verovioContainer = document.getElementById('verovio-container');
  const verovioPanel = document.getElementById('verovio-panel');
  const facsimileDragger = document.getElementById('facsimile-dragger');
  const facsimileContainer = document.getElementById('facsimile-container');
  const facsimilePanel = document.getElementById('facsimile-panel');
  const verovioControlMenu = document.getElementById('notation-control-bar');
  const facsimileControlMenu = document.getElementById('facsimile-control-bar');
  const annotationPanel = document.getElementById('annotationPanel');
  const showAnnotationPanelCheckbox = document.getElementById('showAnnotationPanel');
  const showFacsimile = document.getElementById('showFacsimilePanel').checked;
  let sz = calcSizeOfContainer();
  // console.log('setOrientation(' + _notationOrientation + ') container size:', sz);
  if (notationOrientation === "top" || notationOrientation === "bottom") {
    if (showAnnotationPanelCheckbox && showAnnotationPanelCheckbox.checked) {
      sz.width -= annotationPanelExtent; // subtract width of annotation panel
      annotationPanel.style.display = 'unset';
      annotationPanel.style.width = annotationPanelExtent;
      annotationPanel.style.height = sz.height + 5; // HACK for 5 pix difference!
    } else {
      annotationPanel.style.display = 'none';
    }
    notationDiv.style.width = sz.width; //- 6; // TODO: remove when border removed
    notationDiv.style.height = sz.height * notationProportion;
    cm.setSize(sz.width, sz.height * (1 - notationProportion) - notationResizerWidth);
  }
  if (notationOrientation === "left" || notationOrientation === "right") {
    if (showAnnotationPanelCheckbox && showAnnotationPanelCheckbox.checked) {
      sz.height -= annotationPanelExtent; // subtract width of annotation panel
      annotationPanel.style.display = 'unset';
      annotationPanel.style.width = sz.width + 5; // HACK for 5 pix difference!
      annotationPanel.style.height = annotationPanelExtent;
    } else {
      annotationPanel.style.display = 'none';
    }
    notationDiv.style.width = Math.ceil(sz.width * notationProportion);
    notationDiv.style.height = sz.height; //- 6; TODO: remove when border removed
    cm.setSize(Math.floor(sz.width * (1 - notationProportion) - notationResizerWidth), sz.height);
  }
  friendSz.style.width = sz.width;
  friendSz.style.height = sz.height;

  switch (facsimileOrientation) {
    case 'top':
    case 'bottom':
      if (showFacsimile) {
        facsimileContainer.style.display = 'block';
        facsimileContainer.style.height = parseFloat(notationDiv.style.height) * facsimileProportion - facsimileResizerWidth;
        facsimilePanel.style.height = parseFloat(facsimileContainer.style.height) - facsimileControlMenu.getBoundingClientRect().height;
        verovioContainer.style.height = parseFloat(notationDiv.style.height) * (1 - facsimileProportion);
        verovioPanel.style.height = parseFloat(verovioContainer.style.height) - verovioControlMenu.getBoundingClientRect().height;
      } else {
        facsimileContainer.style.display = 'none';
        facsimileContainer.style.height = 0;
        facsimilePanel.style.height = '';
        verovioContainer.style.height = '';
        verovioPanel.style.height = '';
      }
      facsimileContainer.style.width = notationDiv.style.width;
      facsimilePanel.style.width = parseFloat(facsimileContainer.style.width);
      verovioContainer.style.width = notationDiv.style.width;
      verovioPanel.style.width = parseFloat(verovioContainer.style.width);
      break;
    case 'left':
    case 'right':
      if (showFacsimile) {
        facsimileContainer.style.display = 'block';
        facsimileContainer.style.width = parseFloat(notationDiv.style.width) * facsimileProportion - facsimileResizerWidth;
        facsimilePanel.style.width = parseFloat(facsimileContainer.style.width);
        verovioContainer.style.width = parseFloat(notationDiv.style.width) * (1 - facsimileProportion);
        verovioPanel.style.width = parseFloat(verovioContainer.style.width);
      } else {
        facsimileContainer.style.display = 'none';
        facsimileContainer.style.width = 0;
        facsimilePanel.style.width = '';
        verovioContainer.style.width = '';
        verovioPanel.style.width = '';
      }
      facsimileContainer.style.height = parseFloat(notationDiv.style.height);
      verovioContainer.style.height = parseFloat(notationDiv.style.height);
      verovioPanel.style.height = parseFloat(verovioContainer.style.height) - verovioControlMenu.getBoundingClientRect().height;
      facsimilePanel.style.height = parseFloat(facsimileContainer.style.height) - facsimileControlMenu.getBoundingClientRect().height;
      break;
  }
  facsimileDragger.style.display = showFacsimile ? 'flex' : 'none';

  // redoLayout when done with loading, only when viewer object (v) present
  if (v) {
    if (v.speedMode &&
      document.getElementById('breaks-select').value === 'auto') {
      v.pageBreaks = {};
      v.pageSpanners = {start: {}, end: {}};
      setTimeout(() => v.updateAll(cm), 33);
    } else {
      setTimeout(() => v.updateLayout(), 33);
    }
  }
}

export function getOrientation() {
  return notationOrientation;
}

export function calcSizeOfContainer() {
  let bodySz = document.querySelector('body').getBoundingClientRect();
  let friendSz = document.getElementById("friendContainer").getBoundingClientRect();
  let headerSz = document.querySelector('.header').getBoundingClientRect();
  //let sizerSz = document.querySelector('.resizer').getBoundingClientRect();
  let footerSz = document.querySelector('.footer').getBoundingClientRect();
  friendSz.height = bodySz.height - headerSz.height - footerSz.height - notationResizerWidth;
  friendSz.width = bodySz.width - notationResizerWidth + 2; // TODO: hack for missing 2-px-width (21 April 2022)
  // console.log('calcSizeOfContainer(' + notationOrientation + ') bodySz, header, sizer, footer: ' +
  // Math.round(bodySz.width) + '/' + Math.round(bodySz.height) + ', ' +
  // Math.round(headerSz.width) + '/' + Math.round(headerSz.height) + ', ' +
  // Math.round(footerSz.width) + '/' + Math.round(footerSz.height) + ', ' +
  // Math.round(friendSz.width) + '/' + Math.round(friendSz.height) + '.');
  return friendSz;
}

export function getVerovioContainerSize() {
  let v = document.getElementById('notation');
  let c = document.getElementById('notation-control-bar');
  if (!c || !v) return false;
  let vbox = v.getBoundingClientRect();
  let cbox = c.getBoundingClientRect();
  vbox.height -= cbox.height;
  return vbox;
}


// resizer handlers for resizing the notation/editor relative size
export function addNotationResizerHandlers(v, cm) {
  const resizer = document.getElementById('dragMe');
  const notation = resizer.previousElementSibling;
  const encoding = resizer.nextElementSibling;
  const verovioContainer = document.getElementById('verovio-container');
  const facsimileContainer = document.getElementById('facsimile-container');
  let x = 0;
  let y = 0;
  let notationSize = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;
    y = e.clientY;
    if (notationOrientation === "top" || notationOrientation === "bottom")
      notationSize = notation.getBoundingClientRect().height;
    if (notationOrientation === "left" || notationOrientation === "right")
      notationSize = notation.getBoundingClientRect().width;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    // console.log("Mouse down x/y: " + x + "/" + y + ', ' + notationSize);
  };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    let sz = resizer.parentNode.getBoundingClientRect();
    let szSz = resizer.getBoundingClientRect();
    // console.log("Mouse move dx/dy: " + dx + "/" + dy + ', Container: ' + sz.width + '/' + sz.height);
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
    // restrict to min/max
    notationProportion = Math.min(maxProportion, Math.max(minProportion, notationProportion));
    // update relative size of facsimile images, if active
    switch (notationOrientation) {
      case 'top':
      case 'bottom':
        notation.style.height = notationProportion * sz.height;
        cm.setSize(sz.width, sz.height * (1 - notationProportion) - notationResizerWidth);
        if (document.getElementById('showFacsimilePanel').checked && (facsimileOrientation === 'top' || facsimileOrientation === 'bottom')) {
          verovioContainer.style.height = parseFloat(notation.style.height) * (1 - facsimileProportion);
          facsimileContainer.style.height = parseFloat(notation.style.height) * (facsimileProportion) - facsimileResizerWidth;
        }
        break;
      case 'left':
      case 'right':
        notation.style.width = notationProportion * sz.width;
        cm.setSize(sz.width * (1 - notationProportion) - notationResizerWidth, sz.height);
        if (document.getElementById('showFacsimilePanel').checked && (facsimileOrientation === 'left' || facsimileOrientation === 'right')) {
          verovioContainer.style.width = parseFloat(notation.style.width) * (1 - facsimileProportion);
          facsimileContainer.style.width = parseFloat(notation.style.width) * (facsimileProportion) - facsimileResizerWidth;
        }
        break;
    }
    // console.log('notation w/h: ' + notation.style.width + '/' + notation.style.height)
    const cursor = (notationOrientation === "left" || notationOrientation === "right") ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;
    notation.style.userSelect = 'none';
    notation.style.pointerEvents = 'none';
    encoding.style.userSelect = 'none';
    encoding.style.pointerEvents = 'none';
  };

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
      setOrientation(cm, '', '', -1, -1, v);
    }
    // save notationPorportion in local storage
    if (storage && storage.supported) {
      storage.notationProportion = notationProportion;
    }
  }

  resizer.addEventListener('mousedown', mouseDownHandler);

} // addNotationResizerHandlers() 

// resizer handlers for resizing the facsimile panel
export function addFacsimilerResizerHandlers(v, cm) {
  const resizer = document.getElementById('facsimile-dragger');
  const verovioContainer = document.getElementById('verovio-container');
  const facsimileContainer = document.getElementById('facsimile-container');
  let x = 0;
  let y = 0;
  let facsimileContainerSize = 0;

  const mouseDownHandler = function (e) {
    x = e.clientX;
    y = e.clientY;
    if (facsimileOrientation === "top" || facsimileOrientation === "bottom")
      facsimileContainerSize = facsimileContainer.getBoundingClientRect().height;
    if (facsimileOrientation === "left" || facsimileOrientation === "right")
      facsimileContainerSize = facsimileContainer.getBoundingClientRect().width;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    // console.log("Mouse down x/y: " + x + "/" + y + ', ' + facsimileContainerSize);
  };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    let sz = resizer.parentNode.getBoundingClientRect();
    // console.log("Mouse move dx/dy: " + dx + "/" + dy + ', Container: ' + sz.width + '/' + sz.height);
    switch (facsimileOrientation) {
      case 'top':
        facsimileProportion = (facsimileContainerSize + dy) / sz.height;
        break;
      case 'bottom':
        facsimileProportion = (facsimileContainerSize - dy) / sz.height;
        break;
      case 'right':
        facsimileProportion = (facsimileContainerSize - dx) / sz.width;
        break;
      case 'left':
        facsimileProportion = (facsimileContainerSize + dx) / sz.width;
        break;
    }
    facsimileProportion = Math.min(maxProportion, Math.max(minProportion, facsimileProportion));
    switch (facsimileOrientation) {
      case 'top':
      case 'bottom':
        verovioContainer.style.width = sz.width;
        verovioContainer.style.height = sz.height * (1 - facsimileProportion);
        facsimileContainer.style.width = sz.width;
        facsimileContainer.style.height = sz.height * facsimileProportion - facsimileResizerWidth;
        break;
      case 'left':
      case 'right':
        verovioContainer.style.width = sz.width * (1 - facsimileProportion);
        verovioContainer.style.height = sz.height;
        facsimileContainer.style.width = sz.width * facsimileProportion - facsimileResizerWidth;
        facsimileContainer.style.height = sz.height;
        break;
    }

    const cursor = (facsimileOrientation === "left" || facsimileOrientation === "right") ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;
    verovioContainer.style.userSelect = 'none';
    verovioContainer.style.pointerEvents = 'none';
    facsimileContainer.style.userSelect = 'none';
    facsimileContainer.style.pointerEvents = 'none';
  };

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
      setOrientation(cm, '', '', -1, -1, v);
    }
    // save facsimileProportion in local storage
    if (storage && storage.supported) {
      storage.facsimileProportion = facsimileProportion;
    }
  }

  resizer.addEventListener('mousedown', mouseDownHandler);

} // addFacsimilerResizerHandlers()