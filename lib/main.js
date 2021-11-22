var cm;
var vrvWorker;
var tkVersion;
var mei;
let meiFileName;
import {
  setOrientation,
  addResizerHandlers
} from './resizer.js'
import {
  dropHandler,
  dragEnter,
  dragOverHandler,
  dragLeave
} from './dragger.js';

let defaultMeiFileName = "./Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei";
let defaultOptions = {
  scale: 40,
  breaks: "line",
  header: "none",
  footer: "none",
  inputFrom: "mei"
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
  });

  openMei(); // default MEI

  setOrientation(cm, 'bottom');
  // editor.foldCode(CodeMirror.Pos(3, 0));
  addResizerHandlers(cm);
  window.onresize = () => setOrientation(cm);

  console.log('DOMContentLoaded. Trying now to load Verovio...');
  document.querySelector(".statusbar").innerHTML = "Loading Verovio.";

  vrvWorker = new Worker('./lib/worker.js');
  vrvWorker.onmessage = handleFirstWorkerEvent;
  // ask worker to load Verovio
  vrvWorker.postMessage({
    'cmd': 'loadVerovio'
  });

});


function handleFirstWorkerEvent(e) {
  console.log('main(). Worker said: ', e.data);
  switch (e.data.cmd) {
    case 'vrvLoaded':
      console.info('EventListener vrvLoaded: ', this);
      tkVersion = e.data.msg;
      document.querySelector(".rightfoot").innerHTML =
        `Gratefully using&nbsp;
       <a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      vrvWorker.postMessage({
        'cmd': 'setOptions',
        'msg': defaultOptions
      });
      break;
    case 'optionsSet':
      document.querySelector(".statusbar").innerHTML =
        "Options set; loading data (" + mei.length + " characters)";
      console.log("Options set; loading data (" + mei.length + " chars)", mei);
      vrvWorker.postMessage({
        'cmd': 'loadData',
        'msg': `${mei}`
      });
      break;
    case 'pageCount':
      document.querySelector(".statusbar").innerHTML =
        "Data loaded, " + e.data.msg + " pages.";
      console.info(e.data.msg + ' pages.');
      vrvWorker.postMessage({
        'cmd': 'getPage',
        'msg': '1'
      });
      break;
    case 'mei': // returned from loadXmlData
      mei = e.data.msg;
      cm.setValue(mei);
      vrvWorker.postMessage({
        'cmd': 'getPage',
        'msg': '1'
      });
      break;
    case 'svg':
      document.querySelector(".statusbar").innerHTML =
        meiFileName + " SVG loaded.";
      document.querySelector('.notation').innerHTML = e.data.msg;
      // this.activateSubscriptions(this.vrvWorker);
      // worker.postMessage({
      //   'cmd': 'setOptions',
      //   'msg': vrvOptions
      // });
  }
}

// key is the input-from option in Verovio, value the distinctive string
let inputFormats = {
  mei: "<mei",
  xml: "<score-partwise",
  humdrum: "**kern",
  pae: "@clef",
  abc: "X:"
};

export function openMei(file = defaultMeiFileName) {
  if (typeof file === "string") {
    meiFileName = file;
    console.info('openMei ' + meiFileName + ', ', cm);
    move();
    fetch(meiFileName)
      .then((response) => response.text())
      .then((meiXML) => {
        console.log('MEI file ' + meiFileName + ' loaded.');
        mei = meiXML;
        cm.setValue(mei);
        if (vrvWorker)
          vrvWorker.postMessage({
            'cmd': 'loadData',
            'msg': mei
          });
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
      reader.readAsText(file);
      move();
    })
    readingPromise.then(
      function(mei) {
        let found = false;
        for (const [key, value] of Object.entries(inputFormats)) {
          if (mei.includes(value)) { // a hint that it is a MEI file
            found = true;
            console.log(key + ' file loading: ' + meiFileName);
            if (key == "mei") {
              cm.setValue(mei);
              if (vrvWorker)
                vrvWorker.postMessage({
                  'cmd': 'setOptions',
                  'msg': defaultOptions
                });
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
        if (!found) {
          let s = 'Format not recognized: ' + meiFileName + '.';
          document.querySelector(".statusbar").innerHTML = s;
          console.log(s);
        }
      },
      function() {
        console.log('Loading dragged file ' + meiFileName + ' failed.');
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
      console.error('OpenFile Dialog: Multiple files not supported.')
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
  .addEventListener('click', () => move());

// open dialogs
document.getElementById('OpenMei')
  .addEventListener('click', () => openFileDialog());
document.getElementById('ImportMusicXml')
  .addEventListener('click', () => openFileDialog('.xml,.musicxml,text/*'));
document.getElementById('ImportHumdrum')
  .addEventListener('click', () => openFileDialog('.krn,.hum,text/*'));
document.getElementById('ImportPae')
  .addEventListener('click', () => openFileDialog('.pae,.abc,text/*'));

// drag'n'drop handlers
let fc = document.querySelector('body');
fc.addEventListener('drop', () => dropHandler(event));
fc.addEventListener('dragover', () => dragOverHandler(event));
fc.addEventListener("dragenter", () => dragEnter(event));
fc.addEventListener("dragleave", () => dragLeave(event));
fc.addEventListener("dragstart", (ev) => console.log('Drag Start', ev));
fc.addEventListener("dragend", (ev) => console.log('Drag End', ev));


function move() {
  var elem = document.querySelector(".progressbar");
  console.log("progressbar: ", elem);
  var width = 0; // % progress
  var id = setInterval(frame, 10);

  function frame() {
    if (width < 100) {
      // console.log("width: " + width);
      width++;
      elem.style.width = width + '%';
    } else {
      clearInterval(id);
    }
  }
}
