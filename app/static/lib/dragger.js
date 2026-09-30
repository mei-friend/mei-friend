import { calcSizeOfContainer } from './resizer.js';
import { openFile, translator } from './main.js';
import { isLetsEncodeMode } from './lets-encode.js';

// Returns true only when the drag originates from the filesystem (i.e. the user is
// dragging a file from outside the browser).  Internal element drags (menu items,
// selections, …) carry text/* types but never 'Files'.
function isFileDrag(ev) {
  return ev.dataTransfer != null && Array.from(ev.dataTransfer.types).includes('Files');
}

export function dropHandler(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  // In Let's Encode mode the editor is bound to the task's file, so nothing
  // dropped may replace it. The drop is still consumed: left to the browser, it
  // would open the file in this tab, and the task with it.
  if (isLetsEncodeMode()) {
    off();
    return;
  }
  // Use DataTransferItemList interface to access the file(s)
  if (ev.dataTransfer.items) {
    let l = ev.dataTransfer.items.length;
    console.log('dropHandler(): ' + l + ' item(s) dropped.');
    for (var i = 0; i < l; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
        openFile(file);
        break; // open only first file dropped
      } else {
        console.log('Unrecognized item ' + i + ':', ev.dataTransfer.items[i]);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    let l = ev.dataTransfer.files.length;
    console.log('dropHandler(): ' + l + ' file(s) dropped.');
    for (var i = 0; i < l; i++) {
      let fileName = ev.dataTransfer.files[i].name;
      console.log('... file[' + i + '].name = ' + fileName);
      openFile(fileName);
      break; // open only first file dropped
    }
  }
  off();
}

export function dragOverHandler(ev) {
  if (!isFileDrag(ev)) return;
  ev.stopPropagation();
  ev.preventDefault();
  refuseInLetsEncodeMode(ev);
  on();
}

export function dragEnter(ev) {
  if (!isFileDrag(ev)) return;
  ev.stopPropagation();
  ev.preventDefault();
  refuseInLetsEncodeMode(ev);
  on();
}

// the no-drop cursor, while the overlay says why
function refuseInLetsEncodeMode(ev) {
  if (isLetsEncodeMode()) ev.dataTransfer.dropEffect = 'none';
}

export function dragLeave(ev) {
  if (!isFileDrag(ev)) return;
  ev.stopPropagation();
  ev.preventDefault();
  off();
}

function on() {
  let sz = calcSizeOfContainer();
  // console.log('on()', sz);
  let fc = document.querySelector('.dragOverlay');
  fc.width = sz.width;
  fc.height = sz.height;
  // set on every drag rather than once, so it follows a change of language
  fc.classList.toggle('refused', isLetsEncodeMode());
  document.getElementById('dragOverlayText').textContent = isLetsEncodeMode()
    ? translator.lang.letsEncodeDragOverlayText.text
    : translator.lang.dragOverlayText.text;
  fc.style.display = 'block';
}

function off() {
  // console.log('off()');
  let fc = document.querySelector('.dragOverlay');
  fc.style.display = 'none';
}
