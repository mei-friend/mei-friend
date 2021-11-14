let orientation = 'bottom';
let notationProportion = .5; // proportion notation div takes from container

export function setOrientation(cm, o) {
  if (o) orientation = o;
  let friendSz = document.querySelector(".friendContainer");
  var stylesheet = document.getElementById("orientationCSS");
  stylesheet.setAttribute('href', orientation + '.css');
  let sz = calcSizeOfContainer();
  friendSz.style.width = sz.width;
  friendSz.style.height = sz.height;
  let notation = document.querySelector(".notation");
  console.log('setOrientation(' + o + ') container size:', sz);
  if (orientation == "top" || orientation == "bottom") {
    cm.setSize(sz.width, sz.height * (1 - notationProportion));
    notation.style.height = sz.height * notationProportion;
  }
  if (orientation == "left" || orientation == "right") {
    cm.setSize(sz.width * (1 - notationProportion), sz.height);
    notation.style.width = sz.width * notationProportion;
  }
}

function calcSizeOfContainer() {
  let bodySz = document.querySelector('body').getBoundingClientRect();
  let friendSz = document.querySelector(".friendContainer")
    .getBoundingClientRect();
  let headerSz = document.querySelector('.header').getBoundingClientRect();
  let sizerSz = document.querySelector('.resizer').getBoundingClientRect();
  let footerSz = document.querySelector('.footer').getBoundingClientRect();
  friendSz.height = bodySz.height - headerSz.height - footerSz.height;
  friendSz.width = bodySz.width;
  if (orientation == "top" || orientation == "bottom") {
    friendSz.height -= sizerSz.height;
  }
  if (orientation == "left" || orientation == "right") {
    friendSz.width -= sizerSz.width;
  }
  console.log('calcSizeOfContainer bodySz, header, sizer, footer: ' +
    bodySz.width + '/' + bodySz.height + ', ' +
    headerSz.width + '/' + headerSz.height + ', ' +
    sizerSz.width + '/' + sizerSz.height + ', ' +
    footerSz.width + '/' + footerSz.height + ', ' +
    friendSz.width + '/' + friendSz.height + '.')
  return friendSz
}

export function addResizerHandlers(cm) {
  const resizer = document.getElementById('dragMe');
  const notation = resizer.previousElementSibling;
  const encoding = resizer.nextElementSibling;
  let x = 0;
  let y = 0;
  let notationSize = 0;

  const mouseDownHandler = function(e) {
    x = e.clientX;
    y = e.clientY;
    if (orientation == "top" || orientation == "bottom")
      notationSize = notation.getBoundingClientRect().height;
    if (orientation == "left" || orientation == "right")
      notationSize = notation.getBoundingClientRect().width;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    // console.log("Mouse down x/y: " + x + "/" + y + ', ' + notationSize);
  };

  const mouseMoveHandler = function(e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    let sz = resizer.parentNode.getBoundingClientRect();
    let szSz = resizer.getBoundingClientRect();
    console.log("Mouse move dx/dy: " + dx + "/" + dy +
      ', Container: ' + sz.width + '/' + sz.height);
    switch (orientation) {
      case 'top':
        notation.style.height = (notationSize + dy);
        notationProportion = (notationSize + dy) / sz.height;
        cm.setSize(sz.width, sz.height - (notationSize + dy) - szSz.height);
        break;
      case 'bottom':
        notation.style.height = (notationSize - dy);
        console.log('notation height: ' + notation.style.height);
        notationProportion = (notationSize - dy) / sz.height;
        cm.setSize(sz.width, sz.height - (notationSize - dy) - szSz.height);
        break;
      case 'right':
        notation.style.width = (notationSize - dx);
        notationProportion = (notationSize - dx) / sz.width;
        cm.setSize(sz.width - (notationSize - dx), sz.height - szSz.width);
        break;
      case 'left':
      default:
        notation.style.width = (notationSize + dx);
        notationProportion = (notationSize + dx) / sz.width;
        cm.setSize(sz.width - (notationSize + dx), sz.height - szSz.width);
        break;
    }
    const cursor =
      (orientation === 'horizontal') ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;
    notation.style.userSelect = 'none';
    notation.style.pointerEvents = 'none';
    encoding.style.userSelect = 'none';
    encoding.style.pointerEvents = 'none';
  };

  const mouseUpHandler = function() {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');
    notation.style.removeProperty('user-select');
    notation.style.removeProperty('pointer-events');
    encoding.style.removeProperty('user-select');
    encoding.style.removeProperty('pointer-events');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  resizer.addEventListener('mousedown', mouseDownHandler);
}
