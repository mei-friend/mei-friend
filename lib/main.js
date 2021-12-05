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
import Viewer from './viewer.js';

let version = '0.0.3';
let versionDate = '5 Dec 2021';
let defaultMeiFileName = "./Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei";
let defaultOptions = {
  scale: 55,
  breaks: "auto",
  header: "none",
  footer: "none",
  inputFrom: "mei",
  adjustPageHeight: "true",
  // pageWidth: 100, // has no effect if noLayout is enabled
  // pageHeight: 100, // has no effect if noLayout is enabled
  pageMarginLeft: 25,
  pageMarginRight: 25,
  pageMarginBottom: 0,
  pageMarginTop: 25,
  spacingLinear: .2,
  spacingNonLinear: .5,
  minLastJustification: 0,
  clefChangeFactor: .83,
  svgAdditionalAttribute: ["layer@n", "staff@n"]
};


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

  setOrientation(cm, 'bottom');
  // editor.foldCode(CodeMirror.Pos(3, 0));
  addResizerHandlers(cm);
  window.onresize = () => setOrientation(cm);

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

  // ask worker to load Verovio
  vrvWorker.postMessage({
    'cmd': 'loadVerovio'
  });

});


function workerEventsHandler(e) {
  console.log('main(). Worker said: ' + e.data.cmd, e.data);
  switch (e.data.cmd) {
    case 'vrvLoaded':
      console.info('EventListener vrvLoaded: ', this);
      tkVersion = e.data.msg;
      tkAvailableOptions = e.data.availableOptions;
      document.querySelector(".rightfoot").innerHTML +=
        `&nbsp;<a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      setBreaksOptions(tkAvailableOptions);
      v.setVerovioOptions(defaultOptions, true);
      break;
    case 'optionsSet':
      document.querySelector(".statusbar").innerHTML =
        "Options set; loading data (" + mei.length + " characters)";
      console.log("Options set; loading data (" + mei.length + " chars)",
        mei.slice(0, 128));
      if (e.data.loadData && tkVersion)
        v.loadVerovioData(v.speedFilter(mei));
      else if (e.data.redoLayout && tkVersion)
        v.redoLayout();
      break;
    case 'pageCount':
      if (!v.speedMode) {
        v.pageCount = e.data.msg;
        // if (!v.isValidCurrentPage()) this.currentPage = 1; // TODO do we need this?
        v.showCurrentPage();
      } else { // speed mode
        v.showCurrentPage((this.currentPage <= 1) ? 1 : 2);
      }
      document.querySelector(".statusbar").innerHTML =
        "Data loaded, " + v.pageCount + " pages.";
      console.info(v.pageCount + ' pages.');
      break;
    case 'mei': // returned from loadXmlData
      mei = e.data.msg;
      if (!v.speedMode)
        v.pageCount = e.data.pageCount;
      cm.setValue(mei);
      v.showCurrentPage();
      break;
    case 'svg': // display SVG data on site
      document.querySelector(".statusbar").innerHTML =
        meiFileName + " SVG loaded.";
      document.getElementById('verovio-panel').innerHTML = e.data.msg;
      if (v.doCursorUpdate && false) { // DEBUG
        v.setCursorToPageBeginning(cm);
        v.doCursorUpdate = false;
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
        if (meiFileName.endsWith('.mxl')) { // compressed MusicXML file
          console.log('Load compressed XML file.', mei.slice(0, 128));
          vrvWorker.postMessage({
            'cmd': 'importBinaryData',
            'format': 'xml',
            'msg': v.speedFilter(mei)
          });
          found = true;
        } else if (meiFileName.endsWith('.abc')) { // abc notation file
          console.log('Load ABC file.', mei.slice(0, 128));
          vrvWorker.postMessage({
            'cmd': 'importData',
            'format': 'abc',
            'msg': v.speedFilter(mei)
          });
          found = true;
        } else { // all other formats are found by search term in text file
          for (const [key, value] of Object.entries(inputFormats)) {
            if (mei.includes(value)) { // a hint that it is a MEI file
              found = true;
              console.log(key + ' file loading: ' + meiFileName);
              if (key == "mei") {
                cm.setValue(mei);
                v.setVerovioOptions(defaultOptions, true);
                break;
              } else { // all other formats that Verovio imports
                vrvWorker.postMessage({
                  'cmd': 'importData',
                  'format': key,
                  'msg': v.speedFilter(mei)
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
  'notationTop': () => setOrientation(cm, "top"),
  'notationBottom': () => setOrientation(cm, "bottom"),
  'notationLeft': () => setOrientation(cm, "left"),
  'notationRight': () => setOrientation(cm, "right"),
  'moveProgBar': () => moveProgressBar(),
  'open': () => openFileDialog(),
  'openMusicXml': () => openFileDialog('.xml,.musicxml,.mxl,text/*'),
  'openHumdrum': () => openFileDialog('.krn,.hum,text/*'),
  'openPae': () => openFileDialog('.pae,.abc,text/*'),
  'zoomIn': () => v.zoom(cm, +1),
  'zoomOut': () => v.zoom(cm, -1),
  'zoom50': () => v.zoom(cm, 50),
  'zoom100': () => v.zoom(cm, 100),
  'zoomSlider': () => v.updateLayout(cm)
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
    .addEventListener('change', () => v.updateLayout(cm));
  document.getElementById('breaks-select')
    .addEventListener('change', () => v.updateAll(cm));
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
