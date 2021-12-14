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
import root from './flaskStatic.js';
import Github from './github.js';

let version = '0.0.4';
let versionDate = '7 Dec 2021';
let defaultMeiFileName = `${root}/Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei`;
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

  setOrientation(cm, 'bottom', v);
  // editor.foldCode(CodeMirror.Pos(3, 0));

  createControlsMenu(document.querySelector('.notation'), defaultOptions.scale);

  console.log('DOMContentLoaded. Trying now to load Verovio...');
  document.querySelector(".statusbar").innerHTML = "Loading Verovio.";

  document.querySelector(".rightfoot").innerHTML =
    "<a href='https://github.com/wergo/mei-friend-online'>mei-friend " +
    version + "</a> (" + versionDate + ").&nbsp;";

  vrvWorker = new Worker(`${root}/lib/worker.js`);
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

});

function assignGithubMenuClickHandlers() {
  const repoHeader = document.getElementById('repositoriesHeader');
  if(repoHeader) { 
    // on click, reload list of all repositories
    repoHeader.addEventListener('click', refreshGithubMenu);
  }
  const branchesHeader = document.getElementById('branchesHeader');
  if(branchesHeader) { 
    // on click, reload list of branches for current repo
    branchesHeader.addEventListener('click', (ev) => {
      github.filepath="";
      fillInRepoBranches(ev);
    });
  }
  const contentsHeader = document.getElementById('contentsHeader');
  if(contentsHeader) {
    // on click, move up one directory level in the branch contents
    contentsHeader.addEventListener('click', (ev) => {
      github.filepath = github.filepath.substr(0, github.filepath.lastIndexOf('/'));
      github.filepath = github.filepath.length === 0 ? "/" : github.filepath;
      fillInBranchContents(ev);
    });
  }
  Array.from(document.getElementsByClassName('userRepo')).forEach((e) => 
    e.addEventListener('click', (ev) => {
      github.githubRepo = e.innerText;
      fillInRepoBranches(ev);
    })
  );
  Array.from(document.getElementsByClassName('repoBranch')).forEach((e) => 
    e.addEventListener('click', (ev) => { 
      github.branch = e.innerText;
      github.filepath = "/";
      github.readGithubRepo().then(() => {
        fillInBranchContents(ev)
      });
    })
  );
  Array.from(document.getElementsByClassName('branchContents')).forEach((e) => {
    if(e.classList.contains("dir")){ 
      e.addEventListener('click', (ev) => {
        if(github.filepath.endsWith("/")) { 
          github.filepath += e.querySelector("span.filepath").innerText;
        } else { 
          github.filepath += "/"+e.querySelector("span.filepath").innerText;
        }
        fillInBranchContents(ev);
      })
    } else { 
      e.addEventListener('click', (ev) => {
        github.filepath += e.querySelector("span.filepath").innerText;
        console.debug(`Loading file: https://github.com/${github.githubRepo}${github.filepath}`);
        fillInBranchContents(ev);
        github.readGithubRepo().then(() => {
          document.querySelector(".statusbar").innerText = "Loading from Github...";
          meiFileName = `Github: ${github.githubRepo}${github.filepath}`
          cm.setValue(github.content);
          v.updateAll(cm);
        });
      });
    }
  })
}

function refreshGithubMenu(e) { 
  // populate Github menu
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.innerHTML = `<a id="repositoriesHeader" href="#">Select repository</a>`
  fillInUserRepos();
}

async function fillInUserRepos(per_page=30, page=1) {
  const repos = await github.getUserRepos(per_page, page);
  let githubMenu = document.getElementById("GithubMenu");
  repos.forEach((repo) => { 
    githubMenu.innerHTML += `<a class="userRepo" href="#">${repo.full_name}</a>`;
  })
  if(repos.length && repos.length === per_page) { 
    // there may be more repos on the next page
    fillInUserRepos(per_page, page+1);
  } 
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInRepoBranches(e, per_page=100, page=1) {
  // TODO handle > per_page branches (similar to userRepos)
  const repoBranches = await github.getRepoBranches(per_page, page);
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.innerHTML = `<a id="repositoriesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Repository:${github.githubRepo}</a>
    <hr class="dropdown-line">
    <a id="branchesHeader" href="#">Select branch:</a>
    `;
  Array.from(repoBranches).forEach((branch) => {
    githubMenu.innerHTML += `<a class="repoBranch" href="#">${branch.name}</a>`;
  });
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInBranchContents(e) {
  // TODO handle > per_page files (similar to userRepos)
  const branchContents = await github.getBranchContents(github.filepath);
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.innerHTML = `<a id="repositoriesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Repository:${github.githubRepo}</a>
    <hr class="dropdown-line">
    <a id="branchesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Branch: ${github.branch}</a>
    <hr class="dropdown-line">
    <a id="contentsHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Path: <span class="filepath">${github.filepath}</span></a>
    `;
  let target = e.target;
  if(target.classList.contains("filepath")) { 
    // clicked on file name -- operate on parent (list entry) instead
    target = e.target.parentNode;
  }
  if(target.classList.contains("repoBranch") || target.classList.contains("dir") || target.getAttribute("id") === "contentsHeader") {
    Array.from(branchContents).forEach((content) => {
      const isDir = content.type === "dir";
      githubMenu.innerHTML += `<a class="branchContents ${content.type}${isDir ? '': ' closeOnClick'}" href="#">`+
      //  content.type === "dir" ? '<span class="btn icon icon-file-symlink-file inline-block-tight"></span>' : "" +
        `<span class="filepath${isDir ? '':' closeOnClick'}">${content.name}</span>${isDir ? "..." : ""}</a>`;
    });
  } else { 
    // User has selected a file to edit. Display commit interface
    const commitUI = document.createElement("div");
    commitUI.setAttribute("id", "commitUI");
    const commitMessageInput = document.createElement("input");
    commitMessageInput.setAttribute("type", "text");
    commitMessageInput.setAttribute("id", "commitMessageInput");
    commitMessageInput.setAttribute("placeholder", "Updated using mei-friend online");
    commitMessageInput.disabled = true;
    const commitButton = document.createElement("input");
    commitButton.setAttribute("id", "commitButton");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Commit");
    commitButton.classList.add("closeOnClick");
    commitButton.disabled = true;
    commitButton.addEventListener("click", handleCommitButtonClicked);
    commitUI.appendChild(commitMessageInput);
    commitUI.appendChild(commitButton);
    githubMenu.appendChild(commitUI);
  }
  fillInCommitLog();
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInCommitLog(e) {
  let logTable = document.getElementById("logTable");
  if(logTable) { 
    // clear up previous logTable if it exists
    logTable.remove();
  }
  logTable = document.createElement("table");
  logTable.setAttribute("id", "logTable");
  let githubMenu = document.getElementById("GithubMenu");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>Date</th><th>Author</th><th>Message</th><th>Commit</th>";
  logTable.appendChild(headerRow);
  github.commitLog.forEach((c) => { 
    const commitRow = document.createElement("tr");
    commitRow.innerHTML = `
      <td>${c.commit.author.date}</td>
      <td><a href="${c.author.html_url}">${c.commit.author.name}</a></td>
      <td>${c.commit.message}</td>
      <td><a href="${c.commit.url}">${c.sha.slice(0,8)}...</a></td>`;
    logTable.appendChild(commitRow);
  })
  const commitLogHeader = document.createElement("a");
  commitLogHeader.setAttribute("id", "commitLogHeader");
  commitLogHeader.innerText = "Commit Log";
  githubMenu.appendChild(document.createElement("hr", {className:'dropdown-line'}));
  githubMenu.appendChild(logTable);
}

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
      // if (v.doCursorUpdate && false) { // DEBUG
      v.setCursorToPageBeginning(cm);
      // v.doCursorUpdate = false;
      // }
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

// github API wrapper object
let github;
if(isLoggedIn) {
  github = new Github("", githubToken, "", userLogin, userName, userEmail);
}

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
  cm.on('change', (e) => {
    const commitUI = document.querySelector("#commitUI");
    if(isLoggedIn && github.filepath && commitUI) {
      const changesExist = cm.getValue() === github.content;
      document.getElementById("commitMessageInput").disabled = changesExist;
      document.getElementById("commitButton").disabled = changesExist;
    }
  });
}

// handle Github commit UI
function handleCommitButtonClicked(e) { 
  // TODO Let user know of success / failure, allow user to do something about it
  const messageInput = document.getElementById("commitMessageInput");
  const message = messageInput.value;
  // lock editor while we are busy commiting
  cm.readOnly = "nocursor"; // don't allow editor focus
  // try commiting to Github
  github.writeGithubRepo(cm.getValue(), message)
    .then(() => { 
      console.log(`Successfully written to github: ${github.githubRepo}${github.filepath}`);
      messageInput.value = "";
      github.readGithubRepo()
        .then(() => {
          cm.readOnly = false;
          fillInCommitLog();
          console.log("Finished updating commit log after writing commit.");
        })
        .catch((e) => {
          cm.readOnly = false;
          console.log("Couldn't read Github repo after writing commit: ", e, github);
        })
    })
    .catch((e) => { console.log("Couldn't commit Github repo: ", e, github) });
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

window.onload = () => {
  // Initialise Github object if user is logged in
  if(isLoggedIn) { 
    refreshGithubMenu();
  }
}

