var vrvWorker;
var tkVersion = '';
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
  createControlsMenu
} from './control-menu.js';
import Viewer from './viewer.js';

let version = '0.0.3';
let versionDate = '30 Nov 2021';
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
  addEventListeners(v);

  // ask worker to load Verovio
  vrvWorker.postMessage({
    'cmd': 'loadVerovio'
  });

});


function workerEventsHandler(e) {
  console.log('main(). Worker said: ' + e.data.cmd);
  switch (e.data.cmd) {
    case 'vrvLoaded':
      console.info('EventListener vrvLoaded: ', this);
      tkVersion = e.data.msg;
      document.querySelector(".rightfoot").innerHTML +=
        `&nbsp;<a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      v.setVerovioOptions(defaultOptions, true);
      break;
    case 'optionsSet':
      document.querySelector(".statusbar").innerHTML =
        "Options set; loading data (" + mei.length + " characters)";
      console.log("Options set; loading data (" + mei.length + " chars)",
        mei.slice(0, 128));
      if (e.data.loadData && tkVersion)
        v.loadVerovioData(v.speedFilter(mei));
      else if (e.data.getPage && tkVersion)
        v.showCurrentPage();
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
      cm.setValue(mei);
      v.showCurrentPage();
      break;
    case 'svg': // display SVG data on site
      document.querySelector(".statusbar").innerHTML =
        meiFileName + " SVG loaded.";
      document.getElementById('verovio-panel').innerHTML = e.data.msg;
      v.addNotationEventListeners(cm);
      v.setNotationColors();
      v.updateHighlight(cm);
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

// layout notation position
document.getElementById('top')
  .addEventListener('click', () => setOrientation(cm, "top"));
document.getElementById('bottom')
  .addEventListener('click', () => setOrientation(cm, "bottom"));
document.getElementById('left')
  .addEventListener('click', () => setOrientation(cm, "left"));
document.getElementById('right')
  .addEventListener('click', () => setOrientation(cm, "right"));
document.getElementById("rockbar")
  .addEventListener('click', () => moveProgressBar());

// open dialogs
document.getElementById('OpenMei')
  .addEventListener('click', () => openFileDialog());
document.getElementById('ImportMusicXml')
  .addEventListener('click',
    () => openFileDialog('.xml,.musicxml,.mxl,text/*'));
document.getElementById('ImportHumdrum')
  .addEventListener('click', () => openFileDialog('.krn,.hum,text/*'));
document.getElementById('ImportPae')
  .addEventListener('click', () => openFileDialog('.pae,.abc,text/*'));

// drag'n'drop handlers
// let fc = document.querySelector('body');
let fc = document.querySelector('.dragContainer');
fc.addEventListener('drop', () => dropHandler(event));
fc.addEventListener('dragover', () => dragOverHandler(event));
fc.addEventListener("dragenter", () => dragEnter(event));
fc.addEventListener("dragleave", () => dragLeave(event));
fc.addEventListener("dragstart", (ev) => console.log('Drag Start', ev));
fc.addEventListener("dragend", (ev) => console.log('Drag End', ev));

function addEventListeners(v) {
  document.getElementById('notation-night-mode-btn')
    .addEventListener('click', () => v.swapNotationColors());
}

// progress bar demo
function moveProgressBar() {
  var elem = document.querySelector(".progressbar");
  console.log("progressbar: ", elem);
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
