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
import Github from './github.js';


const version = 'develop-speedmode-0.1.1';
const versionDate = '20 Dec 2021';
const defaultMeiFileName = `${root}/Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei`;
const defaultVerovioOptions = {
  scale: 55,
  breaks: "auto",
  header: "none",
  footer: "none",
  inputFrom: "mei",
  adjustPageHeight: "true",
  outputIndent: 3,
  pageMarginLeft: 50,
  pageMarginRight: 25,
  pageMarginBottom: 10,
  pageMarginTop: 25,
  spacingLinear: .2,
  spacingNonLinear: .5,
  minLastJustification: 0,
  clefChangeFactor: .83,
  svgAdditionalAttribute: ["layer@n", "staff@n"],
  bottomMarginArtic: 1,
  topMarginArtic: 1
};
const defaultKeyMap = `${root}/keymaps/default-keymap.json`;


document.addEventListener('DOMContentLoaded', function() {
  let myTextarea = document.getElementById("editor");

  cm = CodeMirror.fromTextArea(myTextarea, {
    lineNumbers: true,
    lineWrapping: false,
    styleActiveLine: true,
    mode: "xml",
    indentUnit: 3,
    smartIndent: true,
    tabSize: 3,
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

  createControlsMenu(
    document.querySelector('.notation'), defaultVerovioOptions.scale);

  console.log('DOMContentLoaded. Trying now to load Verovio...');
  document.querySelector(".statusbar").innerHTML = "Loading Verovio.";
  document.querySelector(".rightfoot").innerHTML =
    "<a href='https://github.com/wergo/mei-friend-online'>mei-friend " +
    version + "</a> (" + versionDate + ").&nbsp;";

  vrvWorker = new Worker(`${root}/lib/worker.js`);
  vrvWorker.onmessage = workerEventsHandler;

  v = new Viewer(vrvWorker);
  v.vrvOptions = defaultVerovioOptions;

  addEventListeners(cm, v);
  addResizerHandlers(cm, v);
  window.onresize = () => setOrientation(cm, '', v);

  // ask worker to load Verovio
  vrvWorker.postMessage({
    'cmd': 'loadVerovio'
  });

  setKeyMap(defaultKeyMap);
});

function assignGithubMenuClickHandlers() {
  const repoHeader = document.getElementById('repositoriesHeader');
  if (repoHeader) {
    // on click, reload list of all repositories
    repoHeader.addEventListener('click', refreshGithubMenu);
  }
  const branchesHeader = document.getElementById('branchesHeader');
  if (branchesHeader) {
    // on click, reload list of branches for current repo
    branchesHeader.addEventListener('click', (ev) => {
      github.filepath = "";
      fillInRepoBranches(ev);
    });
  }
  const contentsHeader = document.getElementById('contentsHeader');
  if (contentsHeader) {
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
    if (e.classList.contains("dir")) {
      e.addEventListener('click', (ev) => {
        if (github.filepath.endsWith("/")) {
          github.filepath += e.querySelector("span.filepath").innerText;
        } else {
          github.filepath += "/" + e.querySelector("span.filepath").innerText;
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
          v.clear();
          v.updateNotation = false;
          meiFileName = `Github: ${github.githubRepo}${github.filepath}`
          cm.setValue(github.content);
          v.updateNotation = true;
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

async function fillInUserRepos(per_page = 30, page = 1) {
  const repos = await github.getUserRepos(per_page, page);
  let githubMenu = document.getElementById("GithubMenu");
  repos.forEach((repo) => {
    githubMenu.innerHTML += `<a class="userRepo" href="#">${repo.full_name}</a>`;
  })
  if (repos.length && repos.length === per_page) {
    // there may be more repos on the next page
    fillInUserRepos(per_page, page + 1);
  }
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInRepoBranches(e, per_page = 100, page = 1) {
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
  if (target.classList.contains("filepath")) {
    // clicked on file name -- operate on parent (list entry) instead
    target = e.target.parentNode;
  }
  if (target.classList.contains("repoBranch") || target.classList.contains("dir") || target.getAttribute("id") === "contentsHeader") {
    Array.from(branchContents).forEach((content) => {
      const isDir = content.type === "dir";
      githubMenu.innerHTML += `<a class="branchContents ${content.type}${isDir ? '': ' closeOnClick'}" href="#">` +
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
  if (logTable) {
    // clear up previous logTable if it exists
    logTable.remove();
  }
  logTable = document.createElement("table");
  logTable.setAttribute("id", "logTable");
  let githubMenu = document.getElementById("GithubMenu");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML =
    "<th>Date</th><th>Author</th><th>Message</th><th>Commit</th>";
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
  const hr = document.createElement("hr");
  hr.classList.add("dropdown-line");
  githubMenu.appendChild(hr);
  githubMenu.appendChild(logTable);
}

function workerEventsHandler(ev) {
  console.log('main(). Handler received: ' + ev.data.cmd, ev.data);
  switch (ev.data.cmd) {
    case 'vrvLoaded':
      console.info('main(). Handler vrvLoaded: ', this);
      tkVersion = ev.data.version;
      tkAvailableOptions = ev.data.availableOptions;
      document.querySelector(".rightfoot").innerHTML +=
        `&nbsp;<a href="https://www.verovio.org/">Verovio ${tkVersion}</a>.`;
      document.getElementById('version-label').innerHTML =
        'Verovio ' + tkVersion;
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      setBreaksOptions(tkAvailableOptions);
      v.updateAll(cm, defaultVerovioOptions);
      break;
    case 'mei': // returned from importData, importBinaryData
      mei = ev.data.mei;
      if (!v.speedMode) v.pageCount = ev.data.pageCount;
      v.updateNotation = false;
      cm.setValue(mei);
      v.updateNotation = true;
      v.updateAll(cm, defaultVerovioOptions);
      break;
    case 'updated': // display SVG data on site
      if (ev.data.mei) {
        v.updateNotation = false;
        cm.setValue(ev.data.mei); // from reRenderMEI
        v.updateNotation = true;
        v.selectedElements = [];
        v.selectedElements.push(ev.data.xmlId);
      }
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
        v.clear();
        v.updateNotation = false;
        cm.setValue(mei);
        v.updateNotation = true;
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
        v.clear();
        if (meiFileName.endsWith('.mxl')) { // compressed MusicXML file
          console.log('Load compressed XML file.', mei.slice(0, 128));
          vrvWorker.postMessage({
            'cmd': 'importBinaryData',
            'format': 'xml',
            'mei': mei
          });
          found = true;
        } else if (meiFileName.endsWith('.abc')) { // abc notation file
          console.log('Load ABC file.', mei.slice(0, 128));
          vrvWorker.postMessage({
            'cmd': 'importData',
            'format': 'abc',
            'mei': mei
          });
          found = true;
        } else { // all other formats are found by search term in text file
          for (const [key, value] of Object.entries(inputFormats)) {
            if (mei.includes(value)) { // a hint that it is a MEI file
              found = true;
              console.log(key + ' file loading: ' + meiFileName);
              if (key == "mei") { // if already a mei file
                v.updateNotation = false;
                cm.setValue(mei);
                v.updateNotation = true;
                v.updateAll(cm, defaultVerovioOptions);
                break;
              } else { // all other formats that Verovio imports
                vrvWorker.postMessage({
                  'cmd': 'importData',
                  'format': key,
                  'mei': mei
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
  //
  'delete': () => e.delEl(v, cm),
  'invertPlacement': () => e.invertPlacement(v, cm),
  'toggleStacc': () => e.toggleArtic(v, cm, 'stacc'),
  'toggleAccent': () => e.toggleArtic(v, cm, 'acc'),
  'toggleTenuto': () => e.toggleArtic(v, cm, 'ten'),
  'toggleMarcato': () => e.toggleArtic(v, cm, 'marc'),
  'toggleStacciss': () => e.toggleArtic(v, cm, 'stacciss'),
  'shiftPitchNameUp': () => e.shiftPitch(v, cm, 1),
  'shiftPitchNameDown': () => e.shiftPitch(v, cm, -1),
  'shiftOctaveUp': () => e.shiftPitch(v, cm, 7),
  'shiftOctaveDown': () => e.shiftPitch(v, cm, -7),
  'moveElementStaffUp': () => e.moveElementToNextStaff(v, cm, true),
  'moveElementStaffDown': () => e.moveElementToNextStaff(v, cm, false),
  'addOctave8Above': () => e.addOctaveElement(v, cm, 'above', 8),
  'addOctave8Below': () => e.addOctaveElement(v, cm, 'below', 8),
  'addOctave15Above': () => e.addOctaveElement(v, cm, 'above', 15),
  'addOctave15Below': () => e.addOctaveElement(v, cm, 'below', 15),
  'addBeam': () => e.addBeamElement(v, cm),
  'cleanAccid': () => e.cleanAccid(v, cm),
  'renumberMeasuresTest': () => e.renumberMeasures(v, cm, false),
  'renumberMeasures': () => e.renumberMeasures(v, cm, true)
};

// github API wrapper object
let github;
if (isLoggedIn) {
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

  // update encoding through Verovio
  document.getElementById('verovio-btn')
    .addEventListener('click', () => vrvWorker.postMessage({
      'cmd': 'reRenderMEI',
      'format': 'mei',
      'mei': cm.getValue(),
      'xmlId': v.selectedElements[0],
      'pageNo': v.currentPage
    }));
  document.getElementById('help-btn')
    .addEventListener('click', () => window.open('/help', '_blank'));

  // Manipulate encoding methods
  document.getElementById('cleanAccid')
    .addEventListener('click', () => e.cleanAccid(v, cm));
  document.getElementById('renumTest')
    .addEventListener('click', () => e.renumberMeasures(v, cm, false));
  document.getElementById('renumExec')
    .addEventListener('click', () => e.renumberMeasures(v, cm, true));

  // editor activity
  cm.on('cursorActivity', () => { 
    v.cursorActivity(cm);
    const commitUI = document.querySelector("#commitUI");
    if(isLoggedIn && github.filepath && commitUI) {
      const changesExist = cm.getValue() === github.content;
      document.getElementById("commitMessageInput").disabled = changesExist;
      document.getElementById("commitButton").disabled = changesExist;
    }
  });

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
    .catch((e) => {
      console.log("Couldn't commit Github repo: ", e, github)
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
            if (ev.metaKey) keyPress += 'cmd-';
            if (ev.shiftKey) keyPress += 'shift-';
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

window.onload = () => {
  // Initialise Github object if user is logged in
  if (isLoggedIn) {
    refreshGithubMenu();
  }
}
