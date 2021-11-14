var cm;
var tk;
import {
  setOrientation,
  addResizerHandlers
} from './resizer.js'
import * as verovio from "./verovio-toolkit-wasm.js";


document.addEventListener('DOMContentLoaded', function() {
  let myTextarea = document.getElementById("editor");

  let meiFileName = "./Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei";
  fetch(meiFileName)
    .then((response) => response.text())
    .then((meiXML) => {
      // tk.setOptions({
      //   scale: 30,
      //   breaks: "none",
      //   header: "none",
      //   footer: "none"
      // });
      myTextarea.value = meiXML;
    });

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
  setOrientation(cm, 'bottom');
  // editor.foldCode(CodeMirror.Pos(3, 0));
  addResizerHandlers(cm);
  window.onresize = () => setOrientation(cm);
});

document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelector(".notation").innerHTML = "<b>Loading Verovio.</b>";
  Verovio.module.onRuntimeInitialized = async _ => {
    tk = new verovio.toolkit();
    tkVersion = tk.getVersion();
    console.log("Verovio " + tkVersion + ' loaded.');
    document.querySelector(".notation").innerHTML =
      `Gratefully using&nbsp;
         <a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
  }
});
