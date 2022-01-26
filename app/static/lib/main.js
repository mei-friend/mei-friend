var vrvWorker;
var tkVersion = '';
var tkAvailableOptions;
let meiFileName = '';
let meiFileLocation = '';
let meiFileLocationPrintable = '';
var mei;
var cm;
var v; // viewer instance

let github; // github API wrapper object

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
import {
  openUrl,
  openUrlCancel
} from './open-url.js';
import {
  createControlsMenu,
  setBreaksOptions,
  addModifyerKeys,
  manualCurrentPage,
  generateSectionSelect
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
import Storage from './storage.js';
import Github from './github.js';

const version = 'develop-0.2.6';
const versionDate = '26 Jan 2022';
// const defaultMeiFileName = `${root}Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei`;
const defaultMeiFileName = `${root}Beethoven_WoO70-Breitkopf.mei`;
const defaultVerovioOptions = {
  scale: 55,
  breaks: "line",
  header: "encoded",
  footer: "encoded",
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
  bottomMarginArtic: 1.2,
  topMarginArtic: 1.2
};
const defaultKeyMap = `${root}keymaps/default-keymap.json`;

let storage = new Storage();

let fileChanged = false; // flag to track whether unsaved changes to file exist
let freshlyLoaded = false; // flag to ignore a cm.on("changes") event on file load

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
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
      "Alt-F": "findPersistent"
    }
    // theme: 'dracula' // monokai (dark), dracula (bright)
  });

  createControlsMenu(
    document.querySelector('.notation'), defaultVerovioOptions.scale);
  addModifyerKeys(document); //

  setOrientation(cm, 'bottom', v);

  console.log('DOMContentLoaded. Trying now to load Verovio...');
  document.querySelector(".statusbar").innerHTML = "Loading Verovio.";
  document.querySelector(".rightfoot").innerHTML =
    "<a href='https://github.com/wergo/mei-friend-online'>mei-friend " +
    version + "</a> (" + versionDate + ").&nbsp;";

  vrvWorker = new Worker(`${root}lib/worker.js`);
  vrvWorker.onmessage = workerEventsHandler;

  v = new Viewer(vrvWorker);
  v.vrvOptions = {
    ...defaultVerovioOptions
  };

  // restore localStorage if we have it
  if (storage.supported) {
    storage.read();
    setFileChangedState(storage.fileChanged);
    if (storage.content) {
      meiFileName = storage.fileName;
      meiFileLocation = storage.fileLocation;
      meiFileLocationPrintable = storage.fileLocationPrintable;
      updateFileStatusDisplay();
      // on initial page load, CM doesn't fire a "changes" event
      // so we don't need to skip the "freshly loaded" change
      // hence the "false" on the following line:
      loadDataInEditor(storage.content, false);
    } else {
      meiFileLocation = "";
      meiFileLocationPrintable = "";
      openFile(undefined, false); // default MEI, skip freshly loaded (see comment above)
      setFileChangedState(false);
    }
    if (storage.github) {
      // use github object from local storage if available
      isLoggedIn = true;
      github = new Github(
        storage.github.githubRepo,
        storage.github.githubToken,
        storage.github.branch,
        storage.github.filepath,
        storage.github.userLogin,
        storage.github.userName,
        storage.github.userEmail
      )
      //document.querySelector("#fileLocation").innerText = meiFileLocationPrintable;
    } else if (isLoggedIn) {
      // initialise and store new github object
      github = new Github("", githubToken, "", "", userLogin, userName, userEmail);
      storage.github = {
        githubRepo: github.githubRepo,
        githubToken: github.githubToken,
        branch: github.branch,
        filepath: github.filepath,
        userLogin: github.userLogin,
        userName: userName,
        userEmail: userEmail
      };
    }
  } else { // no local storage
    if (isLoggedIn) { // initialise new github object
      github = new Github("", githubToken, "", "", userLogin, userName, userEmail);
    }
    meiFileLocation = "";
    meiFileLocationPrintable = "";
    openFile(); // default MEI
  }
  if (isLoggedIn) {
    // regardless of storage availability:
    // if we are logged in, refresh github menu
    refreshGithubMenu();
    if (github.githubRepo && github.branch && github.filepath) {
      // preset github menu to where the user left off, if we can
      fillInBranchContents();
    }
  }



  addEventListeners(v, cm);
  addResizerHandlers(v, cm);
  let doit;
  window.onresize = () => {
    clearTimeout(doit); // wait half a second before re-calculating orientation
    doit = setTimeout(() => setOrientation(cm, '', v), 500);
  };

  // ask worker to load Verovio
  v.busy();
  vrvWorker.postMessage({
    'cmd': 'loadVerovio'
  });

  setKeyMap(defaultKeyMap);
});

function assignGithubMenuClickHandlers() {
  const githubLoadingIndicator = document.getElementById("GithubLogo");
  const logoutButton = document.getElementById('GithubLogout');
  if (logoutButton) {
    logoutButton.addEventListener('click', (ev) => {
      logoutFromGithub();
    });
  }
  const repoHeader = document.getElementById('repositoriesHeader');
  if (repoHeader) {
    // on click, reload list of all repositories
    repoHeader.addEventListener('click', () => {
      github.filepath = "";
      refreshGithubMenu();
    });
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
    github.filepath = "";
    contentsHeader.addEventListener('click', (ev) => {
      github.filepath = github.filepath.substr(0, github.filepath.lastIndexOf('/'));
      github.filepath = github.filepath.length === 0 ? "/" : github.filepath;
      fillInBranchContents(ev);
    });
  }
  Array.from(document.getElementsByClassName('userRepo')).forEach((e) =>
    e.addEventListener('click', (ev) => {
      // re-init github object with selected repo
      const author = github.author;
      github = new Github(
        e.innerText,
        github.githubToken,
        github.branch,
        github.filepath,
        github.userLogin,
        author.name,
        author.email
      )
      fillInRepoBranches(ev);
    })
  );
  Array.from(document.getElementsByClassName('repoBranch')).forEach((e) =>
    e.addEventListener('click', (ev) => {
      github.branch = e.innerText;
      github.filepath = "/";
      githubLoadingIndicator.classList.add("loading");
      github.readGithubRepo().then(() => {
        fillInBranchContents(ev)
        githubLoadingIndicator.classList.remove("loading");
      }).catch(() => {
        console.error("Couldn't read Github repo to fill in branch contents");
        githubLoadingIndicator.classList.remove("loading");
      });
    })
  );
  Array.from(document.getElementsByClassName('branchContents')).forEach((e) => {
    if (e.classList.contains("dir")) {
      // navigate directory
      e.addEventListener('click', (ev) => {
        if (github.filepath.endsWith("/")) {
          github.filepath += e.querySelector("span.filepath").innerText;
        } else {
          github.filepath += "/" + e.querySelector("span.filepath").innerText;
        }
        fillInBranchContents(ev);
      })
    } else {
      // load file
      e.addEventListener('click', (ev) => {
        github.filepath += e.querySelector("span.filepath").innerText;
        console.debug(`Loading file: https://github.com/${github.githubRepo}/${github.filepath}`);
        fillInBranchContents(ev);
        githubLoadingIndicator.classList.add("loading");
        github.readGithubRepo().then(() => {
          githubLoadingIndicator.classList.remove("loading");
          document.querySelector(".statusbar").innerText = "Loading from Github...";
          v.clear();
          v.updateNotation = false;
          meiFileName = github.filepath;
          meiFileLocation = github.githubRepo;
          meiFileLocationPrintable = github.githubRepo + ":";
          updateFileStatusDisplay();
          loadDataInEditor(github.content)
          setFileChangedState(false);
          updateLocalStorage(github.content);
          v.updateNotation = true;
          v.updateAll(cm);
        }).catch((e) => {
          console.error("Couldn't read Github repo to fill in branch contents:", e);
          githubLoadingIndicator.classList.remove("loading");
        })
      })
    }
  })
}

function updateLocalStorage(meiXml) {
  // if storage is available, save file name, location, content
  // if we're working with github, save github metadata
  if (storage.supported && !storage.override) {
    try {
      storage.fileName = meiFileName;
      storage.fileLocation = meiFileLocation;
      storage.content = meiXml;
      if (isLoggedIn) {
        updateGithubInLocalStorage();
      }
    } catch (err) {
      console.warn("Could not save file content to local storage. Content may be too big? Content length: ", meiXml.length, err);
      setFileChangedState(fileChanged); // flags any storage-exceeded issues
      storage.clear();
    }
  }
}

function updateGithubInLocalStorage() {
  if (storage.supported && !storage.override && isLoggedIn) {
    const author = github.author;
    const name = author.name;
    const email = author.email;
    storage.github = {
      githubRepo: github.githubRepo,
      githubToken: github.githubToken,
      branch: github.branch,
      filepath: github.filepath,
      userLogin: github.userLogin,
      userName: name,
      userEmail: email
    }
    if (github.filepath) {
      storage.fileLocationType = "github";
    }
  }
}

function logoutFromGithub() {
  if (storage.supported) {
    // remove github object from local storage
    storage.removeItem("github");
  }
  // redirect to /logout to remove session cookie
  const url = window.location.href;
  window.location.replace(url.substring(0, url.lastIndexOf("/")) + "/logout");
}

function refreshGithubMenu(e) {
  // display Github name
  document.getElementById("GithubName").innerText =
    github.author.name === "None" ? github.userLogin : github.author.name;
  // populate Github menu
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.classList.remove("loggedOut");
  githubMenu.innerHTML = `<a id="GithubLogout" href="#">Log out</a>`
  if (!github.filepath) {
    githubMenu.innerHTML += `
    <hr class="dropdown-line">
    <a id="repositoriesHeader" class="dropdown-head" href="#"><b>Select repository:</b></a>`;
    fillInUserRepos();
  }
}

function setFileChangedState(fileChangedState) {
  fileChanged = fileChangedState;
  const fileStatusElement = document.querySelector(".fileStatus");
  const fileChangedIndicatorElement = document.querySelector("#fileChanged");
  const fileStorageExceededIndicatorElement = document.querySelector("#fileStorageExceeded");
  const commitUI = document.querySelector("#commitUI");
  if (fileChanged) {
    fileStatusElement.classList.add("changed");
    fileChangedIndicatorElement.innerText = "*";
  } else {
    fileStatusElement.classList.remove("changed");
    fileChangedIndicatorElement.innerText = "";
  }
  if (isLoggedIn && github && github.filepath && commitUI) {
    document.getElementById("commitMessageInput").disabled = !fileChanged;
    document.getElementById("commitButton").disabled = !fileChanged;
  }
  if (storage.supported) {
    storage.fileChanged = fileChanged ? 1 : 0;
    if (storage.override) {
      // unable to write to local storage, probably because quota exceeded
      // warn user...
      fileStatusElement.classList.add("warn");
      fileStorageExceededIndicatorElement.innerText = "LOCAL-STORAGE DISABLED!";
      fileStorageExceededIndicatorElement.classList.add("warn");
      fileStorageExceededIndicatorElement.title = "Your MEI content exceeds " +
        "the browser's local storage space. Please ensure changes are saved " +
        "manually or committed to Github before refreshing or leaving " +
        "the page!";
    } else {
      fileStatusElement.classList.remove("warn");
      fileStorageExceededIndicatorElement.innerText = "";
      fileStorageExceededIndicatorElement.classList.remove("warn");
      fileStorageExceededIndicatorElement.title = "";
    }
  }
}

function updateFileStatusDisplay() {
  document.querySelector("#fileName").innerText =
    meiFileName.substr(meiFileName.lastIndexOf("/") + 1);
  document.querySelector("#fileLocation").innerText = meiFileLocationPrintable || "";
  document.querySelector("#fileLocation").title = meiFileLocation || "";
}

export async function openUrlFetch() {
  let urlInput = document.querySelector("#openUrlInput");
  let urlStatus = document.querySelector("#openUrlStatus");
  try {
    const url = new URL(urlInput.value);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml, application/mei+xml'
      }
    });
    if (response.status >= 400) {
      console.warn("Fetching URL produced error status: ", response.status);
      urlStatus.innerHTML =
        `${response.status}: ${response.statusText.toLowerCase()}`
      urlStatus.classList.add("warn");
      urlInput.classList.add("warn");
    } else {
      urlStatus.innerHTML = "";
      urlStatus.classList.remove("warn");
      urlInput.classList.remove("warn");
      response.text().then((data) => {
        meiFileLocation = url.href;
        meiFileLocationPrintable = url.hostname;
        meiFileName =
          url.pathname.substr(url.pathname.lastIndexOf("/") + 1);
        if (isLoggedIn) {
          // re-initialise github menu since we're now working from a URL
          github.filepath = "";
          github.branch = "";
          if (storage.supported) {
            updateGithubInLocalStorage();
          }
          refreshGithubMenu();
        }
        updateFileStatusDisplay();
        handleEncoding(data);
        if (storage.supported) {
          storage.fileLocationType = "url";
        }
        openUrlCancel(); //hide open URL UI elements
      });
    }
  } catch (err) {
    console.warn("Error opening URL provided by user: ", err);
    if (err instanceof TypeError) {
      urlStatus.innerHTML = "CORS error";
    } else {
      urlStatus.innerHTML = "Invalid URL, please fix..."
    }
    urlInput.classList.add("warn");
    urlStatus.classList.add("warn");
  }
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
  githubMenu.innerHTML = `
  <a id="GithubLogout" href="#">Log out</a>
  <hr class="dropdown-line">
  <a id="repositoriesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Repository:${github.githubRepo}</a>
    <hr class="dropdown-line">
    <a id="branchesHeader" class="dropdown-head" href="#"><b>Select branch:</b></a>
    `;
  Array.from(repoBranches).forEach((branch) => {
    githubMenu.innerHTML += `<a class="repoBranch" href="#">${branch.name}</a>`;
  });
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInBranchContents(e) {
  // TODO handle > per_page files (similar to userRepos)
  let target;
  if (e) { // not present if restoring from local storage
    target = e.target;
  }
  const branchContents = await github.getBranchContents(github.filepath);
  let githubMenu = document.getElementById("GithubMenu");
  githubMenu.innerHTML = `
  <a id="GithubLogout" href="#">Log out</a>
  <hr class="dropdown-line">
  <a id="repositoriesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Repository:${github.githubRepo}</a>
    <hr class="dropdown-line">
    <a id="branchesHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Branch: ${github.branch}</a>
    <hr class="dropdown-line">
    <a id="contentsHeader" href="#"><span class="btn icon icon-arrow-left inline-block-tight"></span>Path: <span class="filepath">${github.filepath}</span></a>
    `;
  if (e && target && target.classList.contains("filepath")) {
    // clicked on file name -- operate on parent (list entry) instead
    target = e.target.parentNode;
  }
  if (e && (target.classList.contains("repoBranch") || target.classList.contains("dir") || target.getAttribute("id") === "contentsHeader")) {
    Array.from(branchContents).forEach((content) => {
      const isDir = content.type === "dir";
      githubMenu.innerHTML += `<a class="branchContents ${content.type}${isDir ? '': ' closeOnClick'}" href="#">` +
        //  content.type === "dir" ? '<span class="btn icon icon-file-symlink-file inline-block-tight"></span>' : "" +
        `<span class="filepath${isDir ? '':' closeOnClick'}">${content.name}</span>${isDir ? "..." : ""}</a>`;
    });
  } else {
    // User clicked file, or restoring from local storage. Display commit interface
    if (storage.supported && github.filepath) {
      storage.fileLocationType = "github";
    }
    const commitUI = document.createElement("div");
    commitUI.setAttribute("id", "commitUI");
    const commitMessageInput = document.createElement("input");
    commitMessageInput.setAttribute("type", "text");
    commitMessageInput.setAttribute("id", "commitMessageInput");
    commitMessageInput.setAttribute("placeholder", "Updated using mei-friend online");
    const commitButton = document.createElement("input");
    commitButton.setAttribute("id", "commitButton");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Commit");
    commitButton.classList.add("closeOnClick");
    commitButton.addEventListener("click", handleCommitButtonClicked);
    commitUI.appendChild(commitMessageInput);
    commitUI.appendChild(commitButton);
    githubMenu.appendChild(commitUI);
    setFileChangedState(fileChanged);
  }
  fillInCommitLog("withRefresh");
  // GitHub menu interactions
  assignGithubMenuClickHandlers();
}

async function fillInCommitLog(refresh = false) {
  if (refresh) {
    const githubLoadingIndicator = document.getElementById("GithubLogo");
    githubLoadingIndicator.classList.add("loading");
    github.readGithubRepo().then(() => {
      githubLoadingIndicator.classList.remove("loading");
      renderCommitLog();
    }).catch((e) => {
      githubLoadingIndicator.classList.remove("loading");
      console.error("Couldn't read github repo, forcing log-out: ", e);
      logoutFromGithub();
    })
  } else {
    renderCommitLog();
  }
}

function renderCommitLog() {
  let logTable = document.getElementById("logTable");
  if (logTable) {
    // clear up previous logTable if it exists
    logTable.remove();
    document.getElementById("commitLogSeperator").remove();
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
  hr.setAttribute("id", "commitLogSeperator");
  githubMenu.appendChild(hr);
  githubMenu.appendChild(logTable);
}

function loadDataInEditor(mei, setFreshlyLoaded = true) {
  if (storage.supported) {
    storage.override = false;
  }
  freshlyLoaded = setFreshlyLoaded;
  cm.setValue(mei);
  v.loadXml(mei);
  let bs = document.getElementById('breaks-select');
  if (bs) bs.value = v.containsBreaks() ? 'line' : 'auto';
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
      document.querySelector(".statusbar").innerHTML =
        `Verovio ${tkVersion} loaded.`;
      setBreaksOptions(tkAvailableOptions, defaultVerovioOptions.breaks);
      if (!storage.supported || !meiFileName) {
        // open default mei file
        openFile();
      } else {
        // open stored data, setting vrv options first
        v.clear();
        v.updateNotation = false;
        loadDataInEditor(storage.content);
        v.updateNotation = true;
        v.updateAll(cm, defaultVerovioOptions);
      }
      v.busy(false);
      break;
    case 'mei': // returned from importData, importBinaryData
      mei = ev.data.mei;
      v.pageCount = ev.data.pageCount;
      v.updateNotation = false;
      loadDataInEditor(mei);
      setFileChangedState(false);
      updateLocalStorage(mei);
      v.updateNotation = true;
      v.updateAll(cm, defaultVerovioOptions);
      //v.busy(false);
      break;
    case 'updated': // display SVG data on site
      if (ev.data.mei) { // from reRenderMEI
        v.updateNotation = false;
        loadDataInEditor(ev.data.mei);
        setFileChangedState(false);
        updateLocalStorage(ev.data.mei);
        v.updateNotation = true;
        v.selectedElements = [];
        if (!ev.data.removeIds) v.selectedElements.push(ev.data.xmlId);
      }
      // add section selector
      let ss = document.getElementById('section-selector');
      while (ss.options.length > 0) ss.remove(0); // clear existing options
      let sections = generateSectionSelect(v.xmlDoc);
      if (sections.length > 1) {
        sections.forEach(opt => ss.options.add(new Option(opt[0], opt[1])));
        ss.style.display = 'block';
      } else {
        ss.style.display = 'none';
      }
      let bs = document.getElementById('breaks-select').value;
      if (ev.data.pageCount && !v.speedMode)
        v.pageCount = ev.data.pageCount;
      else if (bs == 'none') v.pageCount = 1;
      else if (v.speedMode && bs == 'auto' &&
        Object.keys(v.pageBreaks).length > 0)
        v.pageCount = Object.keys(v.pageBreaks).length;
      // update only if still same page
      if (v.currentPage == ev.data.pageNo || ev.data.forceUpdate) {
        v.currentPage = ev.data.pageNo;
        updateStatusBar();
        document.querySelector('title').innerHTML = 'mei-friend: ' +
          meiFileName.substr(meiFileName.lastIndexOf("/") + 1);
        document.querySelector('.verovio-panel').innerHTML = ev.data.svg;
        if (ev.data.setCursorToPageBeginning) v.setCursorToPageBeginning(cm);
        v.updatePageNumDisplay();
        v.addNotationEventListeners(cm);
        v.setNotationColors();
        v.updateHighlight(cm);
        v.scrollSvg(cm);
      }
      if (!"setFocusToVerovioPane" in ev.data || ev.data.setFocusToVerovioPane)
        v.setFocusToVerovioPane();
      if (ev.data.computePageBreaks) v.computePageBreaks(cm);
      else v.busy(false);
      break;
    case 'navigatePage': // resolve navigation with page turning
      updateStatusBar();
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
      v.scrollSvg(cm);
      v.updateHighlight(cm);
      v.setFocusToVerovioPane();
      v.busy(false);
      break;
    case 'midi': // export MIDI file
      const byteCharacters = atob(ev.data.midi);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: 'audio/midi'
      });
      var a = document.createElement('a');
      a.download = meiFileName
        .substr(meiFileName.lastIndexOf("/") + 1)
        .replace(/\.[^/.]+$/, '.mid');
      a.href = window.URL.createObjectURL(blob);
      a.click();
      v.busy(false);
      break;
    case 'computePageBreaks':
      v.pageBreaks = ev.data.pageBreaks;
      v.pageCount = ev.data.pageCount;
      console.log('Page breaks computed for ' +
        meiFileName.substr(meiFileName.lastIndexOf("/") + 1) +
        ', pageBreaks', v.pageBreaks);
      v.updateData(cm, false, true);
      updateStatusBar();
      v.updatePageNumDisplay();
      v.busy(false);
      break;
    case 'updateProgressbar':
      document.querySelector(".statusbar").innerHTML =
        "Compute page breaks: " + Math.round(ev.data.percentage) + "%";
      setProgressBar(ev.data.percentage);
      break;
    case 'error':
      document.querySelector('.verovio-panel').innerHTML =
        "<h3>Invalid MEI in " + meiFileName +
        " (" + ev.data.msg + ")</h3>";
      v.busy(false);
      break;
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

export function openFile(file = defaultMeiFileName, setFreshlyLoaded = true) {
  if (typeof file === "string") { // with fileName string
    meiFileName = file;
    console.info('openMei ' + meiFileName + ', ', cm);
    fetch(meiFileName)
      .then((response) => response.text())
      .then((meiXML) => {
        console.log('MEI file ' + meiFileName + ' loaded.');
        mei = meiXML;
        v.clear();
        v.updateNotation = false;
        loadDataInEditor(mei, setFreshlyLoaded);
        setFileChangedState(false);
        updateLocalStorage(mei)
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
    });
    readingPromise.then(
      function(mei) {
        handleEncoding(mei, setFreshlyLoaded);
      },
      function() {
        log('Loading dragged file ' + meiFileName + ' failed.');
        v.busy(false);
      }
    );
  }
  meiFileLocation = '';
  meiFileLocationPrintable = '';
  updateFileStatusDisplay();
}

// checks format of encoding string and imports or loads data/notation
function handleEncoding(mei, setFreshlyLoaded = true) {
  let found = false;
  v.clear();
  v.busy();
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
          loadDataInEditor(mei, setFreshlyLoaded);
          setFileChangedState(false);
          updateLocalStorage(mei);
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
    v.busy(false);
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
      meiFileLocation = "";
      meiFileLocationPrintable = "";
      openFile(files[0]);
      if (storage.supported) {
        storage.fileLocationType = "file";
      }
      if (isLoggedIn) {
        // re-initialise github menu since we're now working locally
        github.filepath = "";
        github.branch = "";
        if (storage.supported) {
          updateGithubInLocalStorage();
        }
        refreshGithubMenu();
      }
    } else {
      log('OpenFile Dialog: Multiple files not supported.');
    }
  };
  input.click();
}

function downloadMei() {
  let blob = new Blob([cm.getValue()], {
    type: 'text/plain'
  });
  let a = document.createElement('a');
  a.download = meiFileName
    .substr(meiFileName.lastIndexOf("/") + 1)
    .replace(/\.[^/.]+$/, '.mei');
  a.href = window.URL.createObjectURL(blob);
  a.click();
  // Now that the user has "saved" the MEI, clear the file change indicator
  setFileChangedState(false);
}

function downloadMidi() {
  let message = {
    'cmd': 'exportMidi',
    'options': v.vrvOptions,
    'mei': cm.getValue()
  };
  vrvWorker.postMessage(message);
}

function downloadSvg() {
  let svg = document.querySelector('.verovio-panel').innerHTML;
  let blob = new Blob([svg], {
    type: 'image/svg+xml'
  });
  let a = document.createElement('a');
  a.download = meiFileName
    .substr(meiFileName.lastIndexOf("/") + 1)
    .replace(/\.[^/.]+$/, '.svg');
  a.href = window.URL.createObjectURL(blob);
  a.click();
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
  'openUrl': () => openUrl(),
  'openUrlFetch': () => openUrlFetch(),
  'openUrlCancel': () => openUrlCancel(),
  'openMusicXml': () => openFileDialog('.xml,.musicxml,.mxl'),
  'openHumdrum': () => openFileDialog('.krn,.hum'),
  'openPae': () => openFileDialog('.pae,.abc'),
  'downloadMei': () => downloadMei(),
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
  'addTrillAbove': () => e.addCtrlEl(v, cm, 'trill', 'above'),
  'addTrillBelow': () => e.addCtrlEl(v, cm, 'trill', 'below'),
  'addTurnAbove': () => e.addCtrlEl(v, cm, 'turn', 'above', 'upper'),
  'addTurnBelow': () => e.addCtrlEl(v, cm, 'turn', 'below', 'upper'),
  'addTurnAboveLower': () => e.addCtrlEl(v, cm, 'turn', 'above', 'lower'),
  'addTurnBelowLower': () => e.addCtrlEl(v, cm, 'turn', 'below', 'lower'),
  'addMordentAbove': () => e.addCtrlEl(v, cm, 'mordent', 'above', 'lower'),
  'addMordentBelow': () => e.addCtrlEl(v, cm, 'mordent', 'below', 'lower'),
  'addMordentAboveUpper': () => e.addCtrlEl(v, cm, 'mordent', 'above', 'upper'),
  'addMordentBelowUpper': () => e.addCtrlEl(v, cm, 'mordent', 'below', 'upper'),
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
  'addGClefChangeBefore': () => e.addClefChange(v, cm, 'G', '2', true),
  'addCClefChangeBefore': () => e.addClefChange(v, cm, 'C', '3', true),
  'addFClefChangeBefore': () => e.addClefChange(v, cm, 'F', '4', true),
  'addGClefChangeAfter': () => e.addClefChange(v, cm, 'G', '2', false),
  'addCClefChangeAfter': () => e.addClefChange(v, cm, 'C', '3', false),
  'addFClefChangeAfter': () => e.addClefChange(v, cm, 'F', '4', false),
  'addBeam': () => e.addBeamElement(v, cm),
  'cleanAccid': () => e.cleanAccid(v, cm),
  'renumberMeasuresTest': () => e.renumberMeasures(v, cm, false),
  'renumberMeasures': () => e.renumberMeasures(v, cm, true),
  'reRenderMei': () => v.reRenderMei(cm, false),
  'reRenderMeiWithout': () => v.reRenderMei(cm, true),
  'resetDefault': () => {
    // we're in a clickhandler, so our storage object is out of scope
    // but we only need to clear it, so just grab the window's storage
    storage = window.localStorage;
    if (storage) {
      storage.clear();
    }
    logoutFromGithub();
  }

};

// layout notation position
document.getElementById('top').addEventListener('click', cmd.notationTop);
document.getElementById('bottom').addEventListener('click', cmd.notationBottom);
document.getElementById('left').addEventListener('click', cmd.notationLeft);
document.getElementById('right').addEventListener('click', cmd.notationRight);

// open dialogs
document.getElementById('OpenMei')
  .addEventListener('click', cmd.open);
document.getElementById('OpenUrl')
  .addEventListener('click', cmd.openUrl);
document.getElementById('ImportMusicXml')
  .addEventListener('click', cmd.openMusicXml);
document.getElementById('ImportHumdrum')
  .addEventListener('click', cmd.openHumdrum);
document.getElementById('ImportPae')
  .addEventListener('click', cmd.openPae);
document.getElementById('SaveMei')
  .addEventListener('click', downloadMei);
document.getElementById('SaveSvg')
  .addEventListener('click', downloadSvg);
document.getElementById('SaveMidi')
  .addEventListener('click', downloadMidi);

// open URL interface
document.getElementById('openUrlButton')
  .addEventListener('click', cmd.openUrlFetch);
document.getElementById('openUrlCancel')
  .addEventListener('click', cmd.openUrlCancel);
document.getElementById('openUrlInput')
  .addEventListener('input', (e) => {
    e.target.classList.remove("warn");
    document.getElementById("openUrlStatus").classList.remove("warn");
  });

// drag'n'drop handlers
let fc = document.querySelector('.dragContainer');
fc.addEventListener('drop', () => dropHandler(event));
fc.addEventListener('dragover', () => dragOverHandler(event));
fc.addEventListener("dragenter", () => dragEnter(event));
fc.addEventListener("dragleave", () => dragLeave(event));
fc.addEventListener("dragstart", (ev) => console.log('Drag Start', ev));
fc.addEventListener("dragend", (ev) => console.log('Drag End', ev));

// add event listeners when controls menu has been instantiated
function addEventListeners(v, cm) {
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
  let ss = document.getElementById('section-selector');
  ss.addEventListener('change', () => {
    v.updateNotation = false;
    setCursorToId(cm, ss.value);
    v.updatePage(cm, '', ss.value);
    v.updateNotation = true;
  });
  document.getElementById('first-page-btn')
    .addEventListener('click', cmd.firstPage);
  document.getElementById('prev-page-btn')
    .addEventListener('click', cmd.previousPage);
  document.getElementById('next-page-btn')
    .addEventListener('click', cmd.nextPage);
  document.getElementById('last-page-btn')
    .addEventListener('click', cmd.lastPage);
  // manual page entering
  document.getElementById('pagination2')
    .addEventListener('keydown', ev => manualCurrentPage(v, cm, ev));
  document.getElementById('pagination2')
    .addEventListener('blur', ev => manualCurrentPage(v, cm, ev));
  // font selector
  document.getElementById('font-select')
    .addEventListener('change', () => v.updateOption());
  // breaks selector
  document.getElementById('breaks-select').addEventListener('change',
    () => v.updateAll(cm, {}, v.selectedElements[0]));
  // navigation
  document.getElementById('backwards-btn')
    .addEventListener('click', cmd.previousNote);
  document.getElementById('forwards-btn')
    .addEventListener('click', cmd.nextNote);
  document.getElementById('upwards-btn')
    .addEventListener('click', cmd.layerUp);
  document.getElementById('downwards-btn')
    .addEventListener('click', cmd.layerDown);
  // manipulation
  document.getElementById('invertPlacement')
    .addEventListener('click', cmd.invertPlacement);
  document.getElementById('delete')
    .addEventListener('click', cmd.delete);
  document.getElementById('pitchUp')
    .addEventListener('click', cmd.shiftPitchNameUp);
  document.getElementById('pitchDown')
    .addEventListener('click', cmd.shiftPitchNameDown);
  document.getElementById('pitchOctaveUp')
    .addEventListener('click', cmd.shiftOctaveUp);
  document.getElementById('pitchOctaveDown')
    .addEventListener('click', cmd.shiftOctaveDown);
  document.getElementById('staffUp')
    .addEventListener('click', cmd.moveElementStaffUp);
  document.getElementById('staffDown')
    .addEventListener('click', cmd.moveElementStaffDown);
  // Manipulate encoding methods
  document.getElementById('cleanAccid')
    .addEventListener('click', () => e.cleanAccid(v, cm));
  document.getElementById('renumTest')
    .addEventListener('click', () => e.renumberMeasures(v, cm, false));
  document.getElementById('renumExec')
    .addEventListener('click', () => e.renumberMeasures(v, cm, true));
  // re-render through Verovio
  document.getElementById('reRenderMei')
    .addEventListener('click', cmd.reRenderMei);
  document.getElementById('reRenderMeiWithout')
    .addEventListener('click', cmd.reRenderMeiWithout);
  // insert control elements
  document.getElementById('addTempo')
    .addEventListener('click', cmd.addTempo);
  document.getElementById('addDirective')
    .addEventListener('click', cmd.addDirective);
  document.getElementById('addDynamics')
    .addEventListener('click', cmd.addDynamics);
  document.getElementById('addSlur')
    .addEventListener('click', cmd.addSlur);
  document.getElementById('addTie')
    .addEventListener('click', cmd.addTie);
  document.getElementById('addCresHairpin')
    .addEventListener('click', cmd.addCresHairpin);
  document.getElementById('addDimHairpin')
    .addEventListener('click', cmd.addDimHairpin);
  document.getElementById('addBeam')
    .addEventListener('click', cmd.addBeam);
  document.getElementById('addArpeggio')
    // more control elements
    .addEventListener('click', cmd.addArpeggio);
  document.getElementById('addFermata')
    .addEventListener('click', cmd.addFermata);
  document.getElementById('addGlissando')
    .addEventListener('click', cmd.addGlissando);
  document.getElementById('addPedalDown')
    .addEventListener('click', cmd.addPedalDown);
  document.getElementById('addPedalUp')
    .addEventListener('click', cmd.addPedalUp);
  document.getElementById('addTrillAbove')
    .addEventListener('click', cmd.addTrillAbove);
  document.getElementById('addTurnAbove')
    .addEventListener('click', cmd.addTurnAbove);
  document.getElementById('addTurnAboveLower')
    .addEventListener('click', cmd.addTurnAboveLower);
  document.getElementById('addMordentAbove')
    .addEventListener('click', cmd.addMordentAbove);
  document.getElementById('addMordentAboveUpper')
    .addEventListener('click', cmd.addMordentAboveUpper);
  document.getElementById('addOctave8Above')
    .addEventListener('click', cmd.addOctave8Above);
  document.getElementById('addOctave15Above')
    .addEventListener('click', cmd.addOctave15Above);
  document.getElementById('addOctave8Below')
    .addEventListener('click', cmd.addOctave8Below);
  document.getElementById('addOctave15Below')
    .addEventListener('click', cmd.addOctave15Below);
  // add clef change
  document.getElementById('addGClefChangeBefore')
    .addEventListener('click', cmd.addGClefChangeBefore);
  document.getElementById('addCClefChangeBefore')
    .addEventListener('click', cmd.addCClefChangeBefore);
  document.getElementById('addFClefChangeBefore')
    .addEventListener('click', cmd.addFClefChangeBefore);
  document.getElementById('addGClefChangeAfter')
    .addEventListener('click', cmd.addGClefChangeAfter);
  document.getElementById('addCClefChangeAfter')
    .addEventListener('click', cmd.addCClefChangeAfter);
  document.getElementById('addFClefChangeAfter')
    .addEventListener('click', cmd.addFClefChangeAfter);
  // toggle articulation
  document.getElementById('toggleStacc')
    .addEventListener('click', cmd.toggleStacc);
  document.getElementById('toggleAccent')
    .addEventListener('click', cmd.toggleAccent);
  document.getElementById('toggleTenuto')
    .addEventListener('click', cmd.toggleTenuto);
  document.getElementById('toggleMarcato')
    .addEventListener('click', cmd.toggleMarcato);
  document.getElementById('toggleStacciss')
    .addEventListener('click', cmd.toggleStacciss);

  // reset application
  document.getElementById('resetDefault')
    .addEventListener('click', cmd.resetDefault);

  // editor activity
  cm.on('cursorActivity', () => {
    v.cursorActivity(cm);
  });

  // flip button updates manually notation location to cursor pos in encoding
  document.getElementById('flip-btn').addEventListener('click', () => {
    v.cursorActivity(cm, true);
  });

  // when activated, update notation location once
  let fl = document.getElementById('flip-checkbox');
  fl.addEventListener('change', () => {
    if (fl.checked) v.cursorActivity(cm, true)
  });

  // editor reports changes
  cm.on('changes', () => {
    const commitUI = document.querySelector("#commitUI");
    let changeIndicator = false;
    let meiXml = cm.getValue();
    if (isLoggedIn && github.filepath && commitUI) {
      // fileChanged flag may have been set from storage - if so, run with it
      // otherwise set it to true if we've changed the file content this session
      changeIndicator = fileChanged || meiXml !== github.content;
    } else {
      // interpret any CodeMirror change as a file changed state
      changeIndicator = true;
    }
    if (freshlyLoaded) {
      // ignore changes resulting from fresh file load
      freshlyLoaded = false;
    } else {
      setFileChangedState(changeIndicator);
    }
    v.notationUpdated(cm);
    if (storage.supported) {
      // on every set of changes, save editor content
      updateLocalStorage(meiXml);
    }
  })

  // manually update notation rendering from encoding
  document.getElementById('code-update-btn').addEventListener('click', () => {
    v.notationUpdated(cm, true);
  });

  // when activated, update notation once
  let ch = document.getElementById('live-update-checkbox');
  ch.addEventListener('change', () => {
    if (ch.checked) v.notationUpdated(cm, true);
  });

  // speedmode checkbox
  document.getElementById('speed-checkbox').addEventListener('change', (ev) => {
    v.speedMode = ev.target.checked;
    if (v.speedMode && Object.keys(v.pageBreaks).length > 0)
      v.pageCount = Object.keys(v.pageBreaks).length;
    // else
    //   v.pageBreaks = {};
    v.updateAll(cm);
  });
} // addEventListeners()

// handle Github commit UI
function handleCommitButtonClicked(e) {
  // TODO Let user know of success / failure, allow user to do something about it
  const messageInput = document.getElementById("commitMessageInput");
  const message = messageInput.value;
  const githubLoadingIndicator = document.getElementById("GithubLogo");
  // lock editor while we are busy commiting
  cm.readOnly = "nocursor"; // don't allow editor focus
  // try commiting to Github
  githubLoadingIndicator.classList.add("loading");
  github.writeGithubRepo(cm.getValue(), message)
    .then(() => {
      console.debug(`Successfully written to github: ${github.githubRepo}${github.filepath}`);
      messageInput.value = "";
      github.readGithubRepo()
        .then(() => {
          githubLoadingIndicator.classList.remove("loading");
          cm.readOnly = false;
          setFileChangedState(false);
          updateGithubInLocalStorage();
          fillInCommitLog("withRefresh");
          console.debug("Finished updating commit log after writing commit.");
        })
        .catch((e) => {
          cm.readOnly = false;
          githubLoadingIndicator.classList.remove("loading");
          console.error("Couldn't read Github repo after writing commit: ", e, github);
        })
    })
    .catch((e) => {
      githubLoadingIndicator.classList.remove("loading");
      console.error("Couldn't commit Github repo: ", e, github)
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

// control progress bar progress/width (in percent)
function setProgressBar(percentage) {
  document.querySelector(".progressbar").style.width = percentage + '%';
}

function updateStatusBar() {
  document.querySelector(".statusbar").innerHTML =
    meiFileName.substr(meiFileName.lastIndexOf("/") + 1) +
    ", page " + v.currentPage + " of " +
    ((v.pageCount < 0) ? '?' : v.pageCount) + " loaded.";
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
      return resp.json();
    })
    .then((keyMap) => {
      // iterate all keys (element) in keymap.json
      for (const [key, value] of Object.entries(keyMap)) {
        let el = document.querySelector(key);
        if (el) {
          // console.info('Add listener to ', el);
          el.setAttribute('tabindex', '-1');
          el.addEventListener('keydown', (ev) => {
            if (!document.activeElement.id == 'pagination2')
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
