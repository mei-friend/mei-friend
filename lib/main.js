var vrvWorker;
var tkVersion = '';
var tkAvailableOptions;
let meiFileName;
var mei;
var cm;
var v; // viewer instance

import {
  setOrientation,
  addResizerHandlers,
  getVerovioContainerSize
} from './resizer.js'
import {
  dropHandler,
  dragEnter,
  dragOverHandler,
  dragLeave
} from './dragger.js';
import {
  createControlsMenu,
  setBreaksOptions
} from './control-menu.js';
import {
  setCursorToId
} from './utils.js';
import {
  getInMeasure,
  navElsSelector
} from './dom-utils.js';
import Viewer from './viewer.js';


const version = '0.0.4';
const versionDate = '7 Dec 2021';
const defaultMeiFileName = "Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei";
const defaultOptions = {
  scale: 55,
  breaks: "auto",
  header: "none",
  footer: "none",
  inputFrom: "mei",
  adjustPageHeight: "true",
  pageMarginLeft: 50,
  pageMarginRight: 25,
  pageMarginBottom: 10,
  pageMarginTop: 25,
  spacingLinear: .2,
  spacingNonLinear: .5,
  minLastJustification: 0,
  clefChangeFactor: .83,
  svgAdditionalAttribute: ["layer@n", "staff@n"]
};
const defaultKeyMap = './keymaps/default-keymap.json';


document.addEventListener('DOMContentLoaded', function() {
  let myTextarea = document.getElementById("editor");

  cm = CodeMirror.fromTextArea(myTextarea, {
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    mode: "xml",
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchTags: {
      bothTags: true
    },
    showTrailingSpace: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    // theme: 'dracula' // monokai (dark), dracula (bright)
  });

  openMei(); // default MEI

  setOrientation(cm, 'bottom', v);
  // editor.foldCode(CodeMirror.Pos(3, 0));

  createControlsMenu(document.querySelector('.notation'), defaultOptions.scale);

  console.log('DOMContentLoaded. Trying now to load Verovio...');
  document.querySelector(".statusbar").innerHTML = "Loading Verovio.";

  document.querySelector(".rightfoot").innerHTML =
    "<a href='https://github.com/wergo/mei-friend-online'>mei-friend " +
    version + "</a> (" + versionDate + ").&nbsp;";

  vrvWorker = new Worker('./lib/worker.js');
  vrvWorker.onmessage = workerEventsHandler;

  v = new Viewer(vrvWorker);
  v.vrvOptions = defaultOptions;

  addEventListeners(cm, v);
  addResizerHandlers(cm, v);
  window.onresize = () => setOrientation(cm, '', v);

  // ask worker to load Verovio
  vrvWorker.postMessage({
    'cmd': 'loadVerovio'
  });

  setKeyMap(document.getElementById('verovio-panel'), defaultKeyMap);
});


function workerEventsHandler(e) {
  console.log('main(). Handler received: ' + e.data.cmd, e.data);
  switch (e.data.cmd) {
    case 'vrvLoaded':
      console.info('main(). Handler vrvLoaded: ', this);
      tkVersion = e.data.msg;
      tkAvailableOptions = e.data.availableOptions;
      document.querySelector(".rightfoot").innerHTML +=
        `&nbsp;<a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      setBreaksOptions(tkAvailableOptions);
      v.updateAll(cm, defaultOptions);
      break;
    case 'mei': // returned from importData, importBinaryData
      mei = e.data.msg;
      if (!v.speedMode)
        v.pageCount = e.data.pageCount;
      cm.setValue(mei);
      v.updateAll(cm, defaultOptions);
      break;
    case 'updated': // display SVG data on site
      if (e.data.pageCount) v.pageCount = e.data.pageCount;
      v.currentPage = e.data.pageNo;
      document.querySelector(".statusbar").innerHTML =
        meiFileName + ", pg " + v.currentPage + "/" + v.pageCount + " loaded.";
      document.querySelector('title').innerHTML = 'mei-friend: ' + meiFileName;
      document.getElementById('verovio-panel').innerHTML = e.data.svg;
      if (e.data.setCursorToPageBeginning)
        v.setCursorToPageBeginning(cm);
      v.updatePageNumDisplay();
      v.addNotationEventListeners(cm);
      v.setNotationColors();
      v.updateHighlight(cm);
      v.setFocusToVerovioPane();
      break;
    case 'navigatePage': // resolve navigation with page turning
      document.querySelector(".statusbar").innerHTML =
        meiFileName + ", pg " + v.currentPage + "/" + v.pageCount + " loaded.";
      document.getElementById('verovio-panel').innerHTML = e.data.svg;
      let ms = document.querySelectorAll('.measure'); // find measures on page
      if (ms.length > 0) {
        let m = ms[0];
        if (e.data.dir == 'backwards') m = ms[ms.length - 1]; // last measure
        let id = getInMeasure(m, navElsSelector,
          e.data.stNo, e.data.lyNo, e.data.what);
        if (id) v.findClosestNoteInChord(id, e.data.y);
        setCursorToId(cm, id);
        v.selectedElements = [];
        v.selectedElements.push(id);
        v.lastNoteId = id;
      }
      v.addNotationEventListeners(cm);
      v.setNotationColors();
      v.updateHighlight(cm);
      v.setFocusToVerovioPane();
  }
}

// key is the input-from option in Verovio, value the distinctive string
let inputFormats = {
  mei: "<mei",
  xml: "<score-partwise", // the only musicXML flavor supported by Verovio
  // xml: "<score-timewise", // does Verovio import timewise musicXML?
  humdrum: "**kern",
  pae: "@clef",
};

export function openMei(file = defaultMeiFileName) {
  if (typeof file === "string") { // with fileName string
    meiFileName = file;
    console.info('openMei ' + meiFileName + ', ', cm);
    moveProgressBar();
    fetch(meiFileName)
      .then((response) => response.text())
      .then((meiXML) => {
        console.log('MEI file ' + meiFileName + ' loaded.');
        mei = meiXML;
        cm.setValue(mei);
        if (tkVersion) v.loadVerovioData(mei);
      });
  } else { // if a file
    let readingPromise = new Promise(function(loaded, notLoaded) {
      meiFileName = file.name;
      console.info('openMei ' + meiFileName + ', ', cm);
      let reader = new FileReader();
      mei = '';
      reader.onload = (event) => {
        mei = event.target.result;
        console.info('Reader read ' + meiFileName); // + ', mei: ', mei);
        if (mei) loaded(mei);
        else notLoaded();
      }
      if (meiFileName.endsWith('.mxl')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
      moveProgressBar();
    });
    readingPromise.then(
      function(mei) {
        let found = false;
        v.currentPage = 1;
        if (meiFileName.endsWith('.mxl')) { // compressed MusicXML file
          console.log('Load compressed XML file.', mei.slice(0, 128));
          vrvWorker.postMessage({
            'cmd': 'importBinaryData',
            'format': 'xml',
            'msg': mei
          });
          found = true;
        } else if (meiFileName.endsWith('.abc')) { // abc notation file
          console.log('Load ABC file.', mei.slice(0, 128));
          vrvWorker.postMessage({
            'cmd': 'importData',
            'format': 'abc',
            'msg': mei
          });
          found = true;
        } else { // all other formats are found by search term in text file
          for (const [key, value] of Object.entries(inputFormats)) {
            if (mei.includes(value)) { // a hint that it is a MEI file
              found = true;
              console.log(key + ' file loading: ' + meiFileName);
              if (key == "mei") { // if already a mei file
                cm.setValue(mei);
                v.updateAll(cm, defaultOptions);
                break;
              } else { // all other formats that Verovio imports
                vrvWorker.postMessage({
                  'cmd': 'importData',
                  'format': key,
                  'msg': mei
                });
                break;
              }
            }
          }
        }
        if (!found) {
          if (mei.includes('<score-timewise'))
            log('Loading ' + meiFileName + 'did not succeed. ' +
              'No support for timewise MusicXML files.');
          else {
            log('Format not recognized: ' + meiFileName + '.');
          }
        }
      },
      function() {
        log('Loading dragged file ' + meiFileName + ' failed.');
      }
    );
  }
}

function openFileDialog(accept = '*') {
  let input = document.createElement('input');
  input.type = 'file';
  if (accept !== '*') input.accept = accept;
  input.onchange = _ => {
    let files = Array.from(input.files);
    console.log('OpenFile Dialog: ', files);
    if (files.length == 1) {
      meiFileName = files[0].name;
      openMei(files[0]);
    } else {
      log('OpenFile Dialog: Multiple files not supported.');
    }
  };
  input.click();
}

// object of interface command functions for buttons and key bindings
let cmd = {
  'firstPage': () => v.updatePage(cm, 'first'),
  'previousPage': () => v.updatePage(cm, 'backwards'),
  'nextPage': () => v.updatePage(cm, 'forwards'),
  'lastPage': () => v.updatePage(cm, 'last'),
  'nightMode': () => v.swapNotationColors(),
  'nextNote': () => v.navigate(cm, 'note', 'forwards'),
  'previousNote': () => v.navigate(cm, 'note', 'backwards'),
  'nextMeasure': () => v.navigate(cm, 'measure', 'forwards'),
  'previousMeasure': () => v.navigate(cm, 'measure', 'backwards'),
  'layerUp': () => v.navigate(cm, 'layer', 'upwards'),
  'layerDown': () => v.navigate(cm, 'layer', 'downwards'),
  'notationTop': () => setOrientation(cm, "top", v),
  'notationBottom': () => setOrientation(cm, "bottom", v),
  'notationLeft': () => setOrientation(cm, "left", v),
  'notationRight': () => setOrientation(cm, "right", v),
  'moveProgBar': () => moveProgressBar(),
  'open': () => openFileDialog(),
  'openMusicXml': () => openFileDialog('.xml,.musicxml,.mxl,text/*'),
  'openHumdrum': () => openFileDialog('.krn,.hum,text/*'),
  'openPae': () => openFileDialog('.pae,.abc,text/*'),
  'zoomIn': () => v.zoom(+1),
  'zoomOut': () => v.zoom(-1),
  'zoom50': () => v.zoom(50),
  'zoom100': () => v.zoom(100),
  'zoomSlider': () => v.updateOption()
};

// layout notation position
document.getElementById('top').addEventListener('click', cmd.notationTop);
document.getElementById('bottom').addEventListener('click', cmd.notationBottom);
document.getElementById('left').addEventListener('click', cmd.notationLeft);
document.getElementById('right').addEventListener('click', cmd.notationRight);
document.getElementById("rockbar").addEventListener('click', cmd.moveProgBar);

// open dialogs
document.getElementById('OpenMei')
  .addEventListener('click', cmd.open);
document.getElementById('ImportMusicXml')
  .addEventListener('click', cmd.openMusicXml);
document.getElementById('ImportHumdrum')
  .addEventListener('click', cmd.openHumdrum);
document.getElementById('ImportPae')
  .addEventListener('click', cmd.openPae);

// drag'n'drop handlers
// let fc = document.querySelector('body');
let fc = document.querySelector('.dragContainer');
fc.addEventListener('drop', () => dropHandler(event));
fc.addEventListener('dragover', () => dragOverHandler(event));
fc.addEventListener("dragenter", () => dragEnter(event));
fc.addEventListener("dragleave", () => dragLeave(event));
fc.addEventListener("dragstart", (ev) => console.log('Drag Start', ev));
fc.addEventListener("dragend", (ev) => console.log('Drag End', ev));

// add event listeners when controls menu has been instanciated
function addEventListeners(cm, v) {
  document.getElementById('notation-night-mode-btn')
    .addEventListener('click', cmd.nightMode);
  // zooming
  document.getElementById('decrease-scale-btn')
    .addEventListener('click', cmd.zoomOut);
  document.getElementById('increase-scale-btn')
    .addEventListener('click', cmd.zoomIn);
  document.getElementById('verovio-zoom')
    .addEventListener('click', cmd.zoomSlider);
  // page turning
  document.getElementById('first-page-btn')
    .addEventListener('click', cmd.firstPage);
  document.getElementById('prev-page-btn')
    .addEventListener('click', cmd.previousPage);
  document.getElementById('next-page-btn')
    .addEventListener('click', cmd.nextPage);
  document.getElementById('last-page-btn')
    .addEventListener('click', cmd.lastPage);
  document.getElementById('font-select')
    .addEventListener('change', () => v.updateOption());
  document.getElementById('breaks-select')
    .addEventListener('change', () => v.updateLayout()); // DEBUG should be
  // DEBUG                      v.updateLayout() BUG in Verovio tk? (5 Dec 2021)
  // navigation
  document.getElementById('backwards-btn')
    .addEventListener('click', cmd.previousNote);
  document.getElementById('forwards-btn')
    .addEventListener('click', cmd.nextNote);
  document.getElementById('upwards-btn')
    .addEventListener('click', cmd.layerUp);
  document.getElementById('downwards-btn')
    .addEventListener('click', cmd.layerDown);

  // editor activity
  cm.on('cursorActivity', (e) => v.cursorActivity(e, cm));
}

// progress bar demo
function moveProgressBar() {
  var elem = document.querySelector(".progressbar");
  var width = 0; // % progress
  var id = setInterval(frame, 10);

  function frame() {
    (width < 100) ? elem.style.width = (++width) + '%': clearInterval(id);
  }
}

// control progress bar width (in percent)
function setProgressBarWidth(relWidth) {
  document.querySelector(".progressbar").style.width = relWidth + '%';
}

export function log(s) {
  document.querySelector(".statusbar").innerHTML = s;
  document.getElementById("verovio-panel").innerHTML = s;
  console.log(s);
}


// sets keyMap.json to target element and defines listeners
function setKeyMap(targetElement, keyMapFilePath) {
  fetch(keyMapFilePath)
    .then((resp) => {
      console.log('Fetching: ', resp);
      return resp.json();
    })
    .then((keyMap) => {
      console.log('KeyMap loaded ', keyMap);
      console.log('targetElement', targetElement);
      targetElement.setAttribute('tabindex', '-1');
      targetElement.addEventListener('keydown', (ev) => {
        const keyName = event.key;

        // ev.shiftKey
        // ev.metaKey
        // Windows, Mac, Linux
        let altKey = ev.getModifierState("Alt");

        // Windows, Mac, Linux
        let ctrlKey = ev.getModifierState("Control");

        // MAC, (Linux Meta, what is that?)
        let metaKey = ev.getModifierState("Meta");

        // Windows, Linux
        let osKey = ev.getModifierState("OS");

        let shiftKey = ev.getModifierState('Shift');

        console.log('KeyPress: ' + keyName + ', CTRL: ', ctrlKey);

        // Object.keys(keyMap).for
      });

    });
}
