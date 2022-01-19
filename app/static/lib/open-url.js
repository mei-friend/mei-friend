import {
  calcSizeOfContainer
} from './resizer.js';
import {
  openMei
} from './main.js';

export function openUrl() {
  let sz = calcSizeOfContainer();
  let fc = document.querySelector('.openUrlOverlay');
  fc.width = sz.width * .25;
  fc.height = sz.height * .25;
  fc.style.display = "block";
}

export function openUrlCancel() { 
  // user has cancelled the "Open URL" action
  // => hide Open URL interface, show file status display 
  let fileStatusElement = document.querySelector(".fileStatus");
  let openUrlElement = document.querySelector(".openUrlOverlay");
  // show file status, hide openUrl
  openUrlElement.style.display = "none";
}
