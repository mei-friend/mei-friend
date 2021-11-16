var cm;
var vrvWorker;
var tkVersion;
var mei;
import {
  setOrientation,
  addResizerHandlers
} from './resizer.js'


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

  let meiFileName = "./Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei";
  fetch(meiFileName)
    .then((response) => response.text())
    .then((meiXML) => {
      console.log('MEI file ' + meiFileName + ' loaded.');
      // document.querySelector(".statusbar").innerHTML = meiFileName + " loaded.";
      mei = meiXML;
      cm.setValue(mei);
    });

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

  // Verovio.module.onRuntimeInitialized = async _ => {
  //   tk = new verovio.toolkit();
  //   tkVersion = tk.getVersion();
  //   console.log("Verovio " + tkVersion + ' loaded.');


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
        'msg': {
          scale: 40,
          breaks: "line",
          header: "none",
          footer: "none"
        }
      });
      break;
    case 'optionsSet':
      document.querySelector(".statusbar").innerHTML =
        "Options set; loading data...";
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
    case 'svg':
      document.querySelector(".statusbar").innerHTML = "SVG loaded.";
      document.querySelector('.notation').innerHTML = e.data.msg;
      // this.activateSubscriptions(this.vrvWorker);
      // worker.postMessage({
      //   'cmd': 'setOptions',
      //   'msg': vrvOptions
      // });
  }
}

document.querySelector('.top')
  .addEventListener('click', () => setOrientation(cm, "top"));
document.querySelector('.bottom')
  .addEventListener('click', () => setOrientation(cm, "bottom"));
document.querySelector('.left')
  .addEventListener('click', () => setOrientation(cm, "left"));
document.querySelector('.right')
  .addEventListener('click', () => setOrientation(cm, "right"));
