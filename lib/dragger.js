import {
  calcSizeOfContainer
} from './resizer.js'
import {
  openMei
} from './main.js'

export function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  console.log('dropHandler(): File(s) dropped');

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
        openMei(file);
      }
    }
  } else {    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      let fileName = ev.dataTransfer.files[i].name;
      console.log('... file[' + i + '].name = ' + fileName);
      // if (i == 0) // && fileName.includes("mei"))
      openMei(fileName);
    }
  }
  off();
}

export function dragOverHandler(ev) {
  ev.preventDefault();
  console.log('dragOverHandler(): File(s) in drop zone', ev);
  on();
}

export function dragEnter(ev) {
  ev.preventDefault();
  if (ev.target.closest('.dragOverlay')) {
    console.log('dragEnter()');
    on();
  }
}

export function dragLeave(ev) {
  ev.preventDefault();
  if (ev.target.className == 'dragOverlay') {
    console.log('dragLeave()', ev);
    off();
  }
}

function on() {
  let sz = calcSizeOfContainer();
  console.log('on()', sz);
  let fc = document.querySelector('.dragOverlay');
  fc.width = sz.width;
  fc.height = sz.height;
  fc.style.display = "block";
}

function off() {
  console.log('off()');
  let fc = document.querySelector('.dragOverlay');
  fc.style.display = "none";
}
