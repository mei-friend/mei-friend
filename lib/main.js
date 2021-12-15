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
import * as e from './editor.js'
import Viewer from './viewer.js';


const version = 'develop-0.0.8';
const versionDate = '15 Dec 2021';
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

  setKeyMap(defaultKeyMap);
});


function workerEventsHandler(ev) {
  console.log('main(). Handler received: ' + ev.data.cmd, ev.data);
  switch (ev.data.cmd) {
    case 'vrvLoaded':
      console.info('main(). Handler vrvLoaded: ', this);
      tkVersion = ev.data.msg;
      tkAvailableOptions = ev.data.availableOptions;
      document.querySelector(".rightfoot").innerHTML +=
        `&nbsp;<a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      setBreaksOptions(tkAvailableOptions);
      v.updateAll(cm, defaultOptions);
      break;
    case 'mei': // returned from importData, importBinaryData
      mei = ev.data.msg;
      if (!v.speedMode) v.pageCount = ev.data.pageCount;
      cm.setValue(mei);
      v.updateAll(cm, defaultOptions);
      break;
    case 'updated': // display SVG data on site
      if (ev.data.pageCount) v.pageCount = ev.data.pageCount;
      v.currentPage = ev.data.pageNo;
      document.querySelector(".statusbar").innerHTML =
        meiFileName + ", pg " + v.currentPage + "/" + v.pageCount + " loaded.";
      document.querySelector('title').innerHTML = 'mei-friend: ' + meiFileName;
      document.querySelector('.verovio-panel').innerHTML = ev.data.svg;
      if (ev.data.setCursorToPageBeginning) v.setCursorToPageBeginning(cm);
      v.updatePageNumDisplay();
      v.addNotationEventListeners(cm);
      v.setNotationColors();
      v.updateHighlight(cm);
      if (!"setFocusToVerovioPane" in ev.data || ev.data.setFocusToVerovioPane)
        v.setFocusToVerovioPane();
      break;
    case 'navigatePage': // resolve navigation with page turning
      document.querySelector(".statusbar").innerHTML =
        meiFileName + ", pg " + v.currentPage + "/" + v.pageCount + " loaded.";
      document.querySelector('.verovio-panel').innerHTML = ev.data.svg;
      let ms = document.querySelectorAll('.measure'); // find measures on page
      if (ms.length > 0) {
        let m = ms[0];
        if (ev.data.dir == 'backwards') m = ms[ms.length - 1]; // last measure
        let id = getInMeasure(m, navElsSelector,
          ev.data.stNo, ev.data.lyNo, ev.data.what);
        if (id) v.findClosestNoteInChord(id, ev.data.y);
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
        v.updateAll(cm);
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
  'zoomSlider': () => v.updateLayout(),
  // add control elements
  'addSlur': () => e.addCtrlEl(v, cm, 'slur', ''),
  'addSlurBelow': () => e.addCtrlEl(v, cm, 'slur', 'below'),
  'addTie': () => e.addCtrlEl(v, cm, 'tie', ''),
  'addTieBelow': () => e.addCtrlEl(v, cm, 'tie', 'below'),
  'addCresHairpin': () => e.addCtrlEl(v, cm, 'hairpin', '', 'cres'),
  'addDimHairpin': () => e.addCtrlEl(v, cm, 'hairpin', '', 'dim'),
  'addCresHairpinBelow': () => e.addCtrlEl(v, cm, 'hairpin', 'below', 'cres'),
  'addDimHairpinBelow': () => e.addCtrlEl(v, cm, 'hairpin', 'below', 'dim'),
  'addFermata': () => e.addCtrlEl(v, cm, 'fermata', 'above', 'norm'),
  'addFermataBelow': () => e.addCtrlEl(v, cm, 'fermata', 'below', 'inv'),
  'addDirective': () => e.addCtrlEl(v, cm, 'dir', 'above', 'dolce'),
  'addDirectiveBelow': () => e.addCtrlEl(v, cm, 'dir', 'below', 'dolce'),
  'addDynamics': () => e.addCtrlEl(v, cm, 'dynam', 'above', 'mf'),
  'addDnamicsBelow': () => e.addCtrlEl(v, cm, 'dynam', 'below', 'mf'),
  'addTempo': () => e.addCtrlEl(v, cm, 'tempo', 'above', 'Allegro'),
  'addArpeggio': () => e.addCtrlEl(v, cm, 'arpeg'),
  'addGlissando': () => e.addCtrlEl(v, cm, 'gliss'),
  'addPedalDown': () => e.addCtrlEl(v, cm, 'pedal', 'down'),
  'addPedalUp': () => e.addCtrlEl(v, cm, 'pedal', 'up'),
  'addMordentAbove': () => e.addCtrlEl(v, cm, 'mordent', 'above', 'lower'),
  'addMordentBelow': () => e.addCtrlEl(v, cm, 'mordent', 'below', 'lower'),
  'addMordentAboveUpper': () => e.addCtrlEl(v, cm, 'mordent', 'above', 'upper'),
  'addMordentBelowUpper': () => e.addCtrlEl(v, cm, 'mordent', 'below', 'upper'),
  'addTrillAbove': () => e.addCtrlEl(v, cm, 'trill', 'above'),
  'addTrillBelow': () => e.addCtrlEl(v, cm, 'trill', 'below'),
  'addTurnAbove': () => e.addCtrlEl(v, cm, 'turn', 'above', 'upper'),
  'addTurnBelow': () => e.addCtrlEl(v, cm, 'turn', 'below', 'upper'),
  'addTurnAboveLower': () => e.addCtrlEl(v, cm, 'turn', 'above', 'lower'),
  'addTurnBelowLower': () => e.addCtrlEl(v, cm, 'turn', 'below', 'lower'),
  'delete': () => e.delEl(v, cm)
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
let fc = document.querySelector('.dragContainer');
fc.addEventListener('drop', () => dropHandler(event));
fc.addEventListener('dragover', () => dragOverHandler(event));
fc.addEventListener("dragenter", () => dragEnter(event));
fc.addEventListener("dragleave", () => dragLeave(event));
fc.addEventListener("dragstart", (ev) => console.log('Drag Start', ev));
fc.addEventListener("dragend", (ev) => console.log('Drag End', ev));

// add event listeners when controls menu has been instantiated
function addEventListeners(cm, v) {
  document.getElementById('notation-night-mode-btn')
    .addEventListener('click', cmd.nightMode);
  // Zooming with buttons
  document.getElementById('decrease-scale-btn')
    .addEventListener('click', cmd.zoomOut);
  document.getElementById('increase-scale-btn')
    .addEventListener('click', cmd.zoomIn);
  document.getElementById('verovio-zoom')
    .addEventListener('click', cmd.zoomSlider);
  // Zooming with mouse wheel
  document.querySelector('.verovio-panel').addEventListener('wheel', event => {
    if ((navigator.platform.toLowerCase().startsWith('mac') && event.metaKey) ||
      !navigator.platform.toLowerCase().startsWith('mac') && event.ctrlKey) {
      event.preventDefault();
      v.zoom(Math.sign(event.deltaY) * -5); // scrolling towards user = increase
    }
  });
  // Page turning
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
  cm.on('cursorActivity', () => v.cursorActivity(cm));

  // flip button updates manually notation location to cursor pos in encoding
  document.getElementById('flip-btn').addEventListener('click', () => {
    v.cursorActivity(cm, true);
  });

  // when activated, update notation location once
  let fl = document.getElementById('flip-checkbox');
  fl.addEventListener('change', () => {
    if (fl.checked) v.cursorActivity(cm, true);
  });

  // editor reports changes
  cm.on('changes', () => v.notationUpdated(cm));

  // manually update notation rendering from encoding
  document.getElementById('code-update-btn').addEventListener('click', () => {
    v.notationUpdated(cm, true);
  });

  // when activated, update notation once
  let ch = document.getElementById('live-update-checkbox');
  ch.addEventListener('change', () => {
    if (ch.checked) v.notationUpdated(cm, true);
  });

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
  document.querySelector(".verovio-panel").innerHTML = s;
  console.log(s);
}

// sets keyMap.json to target element and defines listeners
function setKeyMap(keyMapFilePath) {
  let os = navigator.platform;
  let vp = document.querySelector('.notation');
  if (os.startsWith('Mac')) vp.classList.add('platform-darwin');
  if (os.startsWith('Win')) vp.classList.add('platform-win32');
  if (os.startsWith('Linux')) vp.classList.add('platform-linux');
  fetch(keyMapFilePath)
    .then((resp) => {
      console.log('Fetching: ', resp);
      return resp.json();
    })
    .then((keyMap) => {
      console.log('KeyMap loaded ', keyMap);
      // iterate all keys (element) in keymap.json
      for (const [key, value] of Object.entries(keyMap)) {
        let el = document.querySelector(key);
        if (el) {
          console.info('Add listener to ', el);
          el.setAttribute('tabindex', '-1');
          el.addEventListener('keydown', (ev) => {
            ev.preventDefault();
            let keyName = ev.key;
            if (ev.code.toLowerCase() == 'space') keyName = 'space';
            // arrowdown -> down
            keyName = keyName.toLowerCase().replace('arrow', '');
            let keyPress = '';
            if (ev.ctrlKey) keyPress += 'ctrl-';
            if (ev.shiftKey) keyPress += 'shift-';
            if (ev.metaKey) keyPress += 'cmd-';
            if (ev.altKey) keyPress += 'alt-';
            keyPress += keyName;
            // let osKey = ev.getModifierState("OS");
            console.info('keyPressString: "' + keyPress + '"');
            let methodName = value[keyPress];
            if (methodName !== undefined) {
              console.log('keyMap method ' + methodName + '.', cmd[methodName]);
              cmd[methodName]();
            }
          });
        }
      }
    });
}
