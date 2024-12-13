// mei-friend version and date
export const version = '1.2.0';
export const versionDate = '13 December 2024'; // use full or 3-character english months, will be translated
export const splashDate = '11 December 2024'; // date of the splash screen content, same translation rules apply

var vrvWorker;
var spdWorker;
var tkAvailableOptions;
var breaksParam; // (string) the breaks parameter given through URL
var pageParam; // (int) page parameter given through URL
var selectParam; // (array) select ids given through multiple instances in URL
let safariWarningShown = false; // show Safari warning only once
let restoreSolidTimeout; // JS timeout that allows users to 'esc' before restoring solid session
let splashInitialLoad = true; // flag to know whether splash screen button needs to call completeInitialLoad()
const restoreSolidTimeoutDelay = 1500; // how long to wait for above timeout, in ms

// exports
export var cm;
export var v; // viewer instance
export var validator; // validator object
export var rngLoader; // object for loading a relaxNG schema for hinting
export let gm; // git manager object - TODO, handle multiple git providers
export let storage = new Storage();
export var tkVersion = ''; // string of the currently loaded toolkit version
export var tkUrl = ''; // string of the currently loaded toolkit origin
export let meiFileName = '';
export let meiFileLocation = '';
export let meiFileLocationPrintable = '';
export let fileLocationType = ''; // file, github, url
export let isMEI; // is the currently edited file native MEI?
export let fileChanged = false; // flag to track whether unsaved changes to file exist
export let translator; // translator object for language support

export const sampleEncodings = [];
export const samp = {
  URL: 0,
  ORG: 1,
  REPO: 2,
  FILE: 3,
  TITLE: 4,
  COMPOSER: 5,
};

import {
  addFacsimilerResizerHandlers,
  addNotationResizerHandlers,
  getFacsimileOrientation,
  getFacsimileProportion,
  getNotationProportion,
  getOrientation,
  setFacsimileProportion,
  setNotationProportion,
  setOrientation,
} from './resizer.js';
import {
  addAnnotationHandlers,
  addMarkupHandlers,
  clearListItems,
  getSolidIdP,
  readListItemsFromXML,
  refreshAnnotationsInNotation,
  populateSolidTab,
} from './enrichment-panel.js';
import { dropHandler, dragEnter, dragOverHandler, dragLeave } from './dragger.js';
import { openUrl, openUrlCancel } from './open-url.js';
import {
  createNotationDiv,
  setBreaksOptions,
  handleSmartBreaksOption,
  addModifyerKeys,
  manualCurrentPage,
  generateSectionSelect,
  setChoiceOptions,
} from './control-menu.js';
import { clock, file, unverified, xCircleFill } from '../css/icons.js';
import { keymap } from '../keymaps/default-keymap.js';
import { setCursorToId, getChangelogUrl } from './utils.js';
import { getInMeasure, navElsSelector, getElementAtCursor } from './dom-utils.js';
import { addDragSelector } from './drag-selector.js';
import {
  highlightNotesAtMidiPlaybackTime,
  mp,
  requestPlaybackOnLoad,
  seekMidiPlaybackToSelectionOrPage,
  seekMidiPlaybackToTime,
  setExpansionMap,
  setTimemap,
  startMidiTimeout,
} from './midi-player.js';
import * as att from './attribute-classes.js';
import * as e from './editor.js';
import Viewer from './viewer.js';
import * as speed from './speed.js';
import { loginAndFetch, solid } from './solid.js';
import Storage from './storage.js';
import { fillInBranchContents, logoutFromGithub, refreshGithubMenu, setCommitUIEnabledStatus } from './github-menu.js';
import { forkAndOpen, forkRepositoryCancel } from './fork-repository.js';
import {
  addZoneDrawer,
  clearFacsimile,
  drawFacsimile,
  ingestFacsimile,
  loadFacsimile,
  zoomFacsimile,
} from './facsimile.js';
import { WorkerProxy } from './worker-proxy.js';
import { RNGLoader } from './rng-loader.js';
import {
  defaultFacsimileOrientation,
  defaultFacsimileProportion,
  defaultMeiFileName,
  defaultNotationOrientation,
  defaultNotationProportion,
  defaultVerovioOptions,
  guidelinesBase,
  platform,
  isSafari,
  supportedLanguages,
} from './defaults.js';
import Translator from './translator.js';
import { luteconv } from './luteconv.js';
import { buildLanguageSelection, translateLanguageSelection } from './language-selector.js';
import { runLanguageChecks } from '../tests/checkLangs.js';
import GitManager from './git-manager.js';

const defaultCodeMirrorOptions = {
  lineNumbers: true,
  lineWrapping: false,
  styleActiveLine: true,
  mode: 'xml',
  indentUnit: 3,
  smartIndent: true,
  tabSize: 3,
  indentWithTabs: false,
  autoCloseBrackets: true,
  autoCloseTags: true,
  matchTags: {
    bothTags: true,
  },
  showTrailingSpace: true,
  foldGutter: true,
  gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  extraKeys: {
    "'<'": completeAfter,
    "'/'": completeIfAfterLt,
    "' '": completeIfInTag,
    "'='": completeIfInTag,
    'Shift-Alt-f': indentSelection,
    'Shift-Ctrl-G': toMatchingTag,
    "'Ï'": indentSelection, // TODO: overcome strange bindings on MAC
  },
  lint: {
    caller: cm,
    getAnnotations: validate,
    async: true,
  },
  hintOptions: {
    schemaInfo: null,
  },
  theme: 'default', // m-f option
  zoomFont: 100, // m-f own option
  matchTheme: false, // notation matches editor theme (m-f option)
  defaultBrightTheme: 'default', // default theme for OS bright mode, m-f option
  defaultDarkTheme: 'paraiso-dark', // 'base16-dark', // default theme for OS dark mode, m-f option
}; // defaultCodeMirrorOptions

// add all possible facsimile elements
att.attFacsimile.forEach((e) => defaultVerovioOptions.svgAdditionalAttribute.push(e + '@facs'));
const sampleEncodingsCSV = `${root}sampleEncodings/sampleEncodings.csv`;
let freshlyLoaded = false; // flag to ignore a cm.on("changes") event on file load

export function setIsMEI(bool) {
  isMEI = !!bool;
}

export async function setFileChangedState(fileChangedState) {
  fileChanged = fileChangedState;
  const fileStatusElement = document.querySelector('.fileStatus');
  const fileChangedIndicatorElement = document.querySelector('#fileChanged');
  const fileStorageExceededIndicatorElement = document.querySelector('#fileStorageExceeded');
  const commitUI = document.querySelector('#commitUI');
  if (fileChanged) {
    fileStatusElement.classList.add('changed');
    fileChangedIndicatorElement.innerText = '*';
  } else {
    fileStatusElement.classList.remove('changed');
    fileChangedIndicatorElement.innerText = '';
  }
  if (isLoggedIn && gm && gm.filepath) {
    let actionsWorkflows = document.querySelectorAll('.workflow');
    if (commitUI) setCommitUIEnabledStatus();
    if (actionsWorkflows) {
      if (await gm.fileChanged()) {
        actionsWorkflows.forEach((el) => el.parentElement.classList.add('disabled'));
        actionsWorkflows.forEach((el) => el.parentElement.parentElement.classList.add('notAllowed'));
      } else {
        actionsWorkflows.forEach((el) => el.parentElement.classList.remove('disabled'));
        actionsWorkflows.forEach((el) => el.parentElement.parentElement.classList.remove('notAllowed'));
      }
    }
  }
  if (storage.supported) {
    storage.fileChanged = fileChanged ? 1 : 0;
    if (storage.override) {
      // unable to write to local storage, probably because quota exceeded
      // warn user...
      fileStatusElement.classList.add('warn');
      fileStorageExceededIndicatorElement.innerText = 'LOCAL-STORAGE DISABLED!';
      fileStorageExceededIndicatorElement.classList.add('warn');
      fileStorageExceededIndicatorElement.title =
        'Your MEI content exceeds ' +
        "the browser's local storage space. Please ensure changes are saved " +
        'manually or committed to Github before refreshing or leaving ' +
        'the page!';
    } else {
      fileStatusElement.classList.remove('warn');
      fileStorageExceededIndicatorElement.innerText = '';
      fileStorageExceededIndicatorElement.classList.remove('warn');
      fileStorageExceededIndicatorElement.title = '';
    }
  }
}

export function setMeiFileInfo(fName, fLocation, fLocationPrintable) {
  meiFileName = fName;
  meiFileLocation = fLocation;
  meiFileLocationPrintable = fLocationPrintable;
}

export function setFileLocationType(t) {
  fileLocationType = t; // wrap in function to facilitate external setting
}

export function updateFileStatusDisplay() {
  document.querySelector('#fileName').innerText = meiFileName.substring(meiFileName.lastIndexOf('/') + 1);
  document.querySelector('#fileLocation').innerText = meiFileLocationPrintable || '';
  document.querySelector('#fileLocation').title = meiFileLocation || '';
  if (fileLocationType === 'file') document.querySelector('#fileName').setAttribute('contenteditable', '');
  else document.querySelector('#fileName').removeAttribute('contenteditable', '');
}

export function loadDataInEditor(meiXML, setFreshlyLoaded = true) {
  if (storage && storage.supported) {
    storage.override = false;
  }
  freshlyLoaded = setFreshlyLoaded;
  v.loadXml(meiXML, true);
  cm.blockChanges = true;
  cm.setValue(meiXML);
  cm.clearHistory();
  cm.blockChanges = false;
  cmd.checkFacsimile();
  loadFacsimile(v.xmlDoc); // load all facsimila data of MEI
  let bs = document.getElementById('breaksSelect');
  if (bs) {
    if (breaksParam) bs.value = breaksParam;
    else if (storage && storage.supported && storage.hasItem('breaks')) bs.value = storage.breaks;
    else bs.value = v.containsBreaks() ? 'line' : 'auto';
  }
  v.setRespSelectOptions();
  v.setMidiExpansionOptions();
  v.setMenuColors();
  if (!isSafari) {
    // disable validation on Safari because of this strange error: "RangeError: Maximum call stack size exceeded" (WG, 1 Oct 2022)
    v.checkSchema(meiXML);
  }
  clearListItems();
  readListItemsFromXML(true); // readAnnots(true); from annotation.js
  setCursorToId(cm, handleURLParamSelect());
} // loadDataInEditor()

export function updateLocalStorage(meiXml) {
  // if storage is available, save file name, location, content
  // if we're working with github, save github metadata
  if (storage.supported) {
    try {
      storage.fileName = meiFileName;
      storage.fileLocation = meiFileLocation;
      storage.isMEI = isMEI;
      if (!storage.override) {
        storage.content = meiXml;
      }
      if (isLoggedIn) {
        updateGithubInLocalStorage();
      }
    } catch (err) {
      console.warn(
        'Could not save file content to local storage. Content may be too big? Content length: ',
        meiXml.length,
        err
      );
      setFileChangedState(fileChanged); // flags any storage-exceeded issues
      // storage.clear();
    }
  }
}

export async function updateGithubInLocalStorage() {
  if (storage.supported && !storage.override && isLoggedIn) {
    const author = await gm.getAuthor();
    storage.github = {
      githubRepo: gm.repo,
      githubToken: gm.token,
      branch: gm.branch,
      filepath: gm.filepath,
      userLogin: author.username,
      userName: author.name,
      userEmail: author.email,
    };
  }
}

function completeAfter(cm, pred) {
  if (!pred || pred())
    setTimeout(function () {
      if (!cm.state.completionActive)
        cm.showHint({
          completeSingle: false,
        });
    }, 100);
  return CodeMirror.Pass;
}

function completeIfAfterLt(cm) {
  return completeAfter(cm, function () {
    var cur = cm.getCursor();
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  });
}

function completeIfInTag(cm) {
  return completeAfter(cm, function () {
    var tok = cm.getTokenAt(cm.getCursor());
    if (tok.type === 'string' && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length === 1))
      return false;
    var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
}

/**
 * Carries out code validation using validator.validateNG() and calls
 * v.highlightValidation()
 * @param {string} meiXML
 * @param {Function} updateLinting
 * @param {Object} options
 * @returns
 */
export async function validate(meiXML, updateLinting, options) {
  if (options && meiXML) {
    // keep the callback (important for first call)
    if (updateLinting && typeof updateLinting === 'function') {
      v.updateLinting = updateLinting;
    }

    if (v.validatorWithSchema && (document.getElementById('autoValidate').checked || options.forceValidate)) {
      let vs = document.getElementById('validation-status');
      vs.innerHTML = clock;
      Viewer.changeStatus(vs, 'wait', ['error', 'ok', 'manual']); // darkorange
      vs.querySelector('svg').classList.add('clockwise');
      vs.setAttribute('title', translator.lang.validatingAgainst.text + ' ' + v.currentSchema);
      const validationString = await validator.validateNG(meiXML);
      let validation;
      try {
        validation = JSON.parse(validationString);
      } catch (err) {
        console.error('Could not parse validation json:', err);
        return;
      }
      console.log(
        translator.lang.validationComplete.text + ': ',
        validation.length === 0
          ? translator.lang.noErrors.text + '.'
          : validation.length + ' ' + translator.lang.errorsFound.text + '.'
      );
      v.highlightValidation(meiXML, validation, options.forceValidate);
    } else if (v.validatorWithSchema && !document.getElementById('autoValidate').checked) {
      v.setValidationStatusToManual();
    }
  }
} // validate()

async function suspendedValidate(text, updateLinting, options) {
  // Do nothing...
}

// when initial page content has been loaded
document.addEventListener('DOMContentLoaded', function () {
  // disable GitHub menu if server-side configuration not available
  if (!gitEnabled) {
    document.getElementById('GithubButton').disabled = true;
  }

  translator = new Translator();
  // we need to look directly to local storage, because it will
  let language = window.localStorage['mf-selectLanguage'];
  let browseLang = navigator.language.substring(0, 2) || '';
  if (!(browseLang in supportedLanguages)) browseLang = '';
  let langCode = language || browseLang || translator.defaultLangCode;
  if (langCode !== translator.langCode) {
    // load other language...
    translator.requestLanguagePack(langCode).then((p) => {
      translator.setLang(p.lang);
      translator.setLangCode(langCode);
      translator.translateGui();
      onLanguageLoaded();
    });
  } else {
    translator.translateGui();
    onLanguageLoaded();
  }
});

/**
 * Do all the heavy GUI lifting after DOMCOntentLoaded event was fired
 */
function onLanguageLoaded() {
  // expose default language pack for debug
  if (env && env === environments.develop) {
    console.debug('Running language checks in develop environment:');
    runLanguageChecks();
    // console.debug('Default language pack: ', JSON.stringify(translator.defaultLang, null, 2));
  }
  // build language selection menu
  buildLanguageSelection();

  createSplashScreen();

  // show splash screen if required, i.e.: if never previously acknowledged; or,
  // if acknowledged before latest splash screen content update (splashDate), or,
  // if splash screen is set to show on every load
  if (storage.supported) {
    storage.read();
    let splashTextUpdatedSinceLastAck;
    try {
      splashTextUpdatedSinceLastAck = storage.splashAcknowledged < new Date(splashDate).getTime();
    } catch {
      splashTextUpdatedSinceLastAck = false;
    }
    console.log('Splash screen acknowledged: ', storage.splashAcknowledged);
    console.log('Splash text updated since last acknowledgement: ', splashTextUpdatedSinceLastAck);
    console.log('Last acknowledgement date: ', new Date(storage.splashAcknowledged));

    if (!storage.splashAcknowledged || splashTextUpdatedSinceLastAck || storage.showSplashScreen) {
      showSplashScreen(splashTextUpdatedSinceLastAck);
    } else {
      completeInitialLoad();
    }
  } else {
    // no storage; always show splash screen
    showSplashScreen(false);
  }
} // onLanguageLoaded()

async function completeInitialLoad() {
  splashInitialLoad = false; // avoid re-initialising app from splash screen button

  // link to changelog page according to env settings (develop/staging/production)
  const changeLogUrl = getChangelogUrl();
  const showChangeLogLink = document.getElementById('showChangelog');
  if (showChangeLogLink) showChangeLogLink.setAttribute('href', changeLogUrl);

  cm = CodeMirror.fromTextArea(document.getElementById('editor'), defaultCodeMirrorOptions);
  CodeMirror.normalizeKeyMap();

  // make sure that the drag enter event is passed through CodeMirror
  cm.on('dragenter', (cm, ev) => dragEnter(ev));
  cm.on('dragleave', (cm, ev) => dragLeave(ev));

  // set validation status icon to unverified
  let vs = document.getElementById('validation-status');
  vs.innerHTML = unverified;

  // check for parameters passed through URL
  let searchParams = new URLSearchParams(window.location.search);
  let orientationParam = searchParams.get('notationOrientation') || searchParams.get('orientation');
  let notationProportionParam = searchParams.get('notationProportion');
  let facsimileOrientationParam = searchParams.get('facsimileOrientation');
  let facsimileProportionParam = searchParams.get('facsimileProportion');
  pageParam = searchParams.get('page');
  let scaleParam = searchParams.get('scale');
  let solidCodeParam = searchParams.get('code');
  let solidStateParam = searchParams.get('state');
  // select parameter: both syntax versions allowed (also mixed):
  // ?select=note1,chord2,note3 and/or ?select=note1&select=chord2&select=note3
  selectParam = searchParams.getAll('select');
  if (selectParam && selectParam.length > 0)
    selectParam = selectParam.map((e) => e.split(',')).reduce((a1, a2) => a1.concat(a2));
  let speedParam = searchParams.get('speed');
  breaksParam = searchParams.get('breaks');

  createNotationDiv(document.getElementById('notation'), defaultVerovioOptions.scale);
  addModifyerKeys(document); //

  console.log('DOMContentLoaded. Trying now to load Verovio...');
  document.getElementById('statusBar').innerHTML = translator.lang.loadingVerovio.text + '.';
  drawLeftFooter();
  drawRightFooter();

  vrvWorker = new Worker(`${root}lib/verovio-worker.js`);
  vrvWorker.onmessage = vrvWorkerEventsHandler;

  spdWorker = new Worker(`${root}lib/speed-worker.js`);
  spdWorker.postMessage({
    cmd: 'variables',
    var: att.timeSpanningElements,
  });
  spdWorker.onmessage = speedWorkerEventsHandler;

  v = new Viewer(vrvWorker, spdWorker);
  v.vrvOptions = {
    ...defaultVerovioOptions,
  };

  const validatorWorker = new Worker(`${root}lib/validator-worker.js`);
  validator = new WorkerProxy(validatorWorker);
  rngLoader = new RNGLoader();

  validator.onRuntimeInitialized().then(async () => {
    console.log('Validator: onRuntimeInitialized()');
    v.validatorInitialized = true;
    if (!v.validatorWithSchema && v.currentSchema) {
      await v.replaceSchema(v.currentSchema);
    }
  });

  v.busy();
  const resetButton = document.getElementById('filterReset');
  if (resetButton) {
    resetButton.innerHTML = xCircleFill;
    resetButton.style.visibility = 'hidden';
  }
  v.addCmOptionsToSettingsPanel(defaultCodeMirrorOptions);
  v.addMeiFriendOptionsToSettingsPanel();
  v.applySettingsFilter();

  // check autoValidate as URL param
  let autoValidateParam = searchParams.get('autoValidate');
  let av = document.getElementById('autoValidate');
  if (autoValidateParam !== null && av) {
    av.checked = autoValidateParam === 'true';
  }
  if (isSafari) {
    av.checked = false;
  }
  // add event listener to validation status icon, if no autoValidation
  if (av && !av.checked) {
    v.setValidationStatusToManual();
  }

  // set up midi-player event listeners
  mp.addEventListener('note', (e) => highlightNotesAtMidiPlaybackTime(e));
  mp.addEventListener('load', seekMidiPlaybackToSelectionOrPage);
  // decide whether to show MIDI playback shortcut (bubble), based on setting
  document.getElementById('midiPlayerContextual').style.display = document.getElementById(
    'showMidiPlaybackContextualBubble'
  ).checked
    ? 'block'
    : 'none';

  if (storage.supported) {
    if (storage.github && isLoggedIn) {
      // use github object from local storage if available
      gm = new GitManager('github', 'github', storage.github.githubToken, {
        repo: storage.github.githubRepo,
        branch: storage.github.branch,
        filepath: storage.github.filepath,
      });

      //document.querySelector("#fileLocation").innerText = meiFileLocationPrintable;
    } else if (storage.github && !isLoggedIn) {
      // we have github data but are not logged in
      // suggests inconsistency, so formally log user out
      logoutFromGithub();
    } else if (isLoggedIn) {
      // initialise and store new github object
      // const gitWorker = new Worker(`${root}lib/git-worker.js`);
      // const gitProxy = new WorkerProxy(gitWorker);
      // let msg = await gitProxy.registerGitManager('github', 'github', githubToken);
      // console.log('Registered git manager: ', msg);

      gm = new GitManager('github', 'github', githubToken);
      gm.getAuthor()
        .then((author) => {
          //github = new Github('', githubToken, '', '', '', userLogin, userName, userEmail);
          storage.github = {
            githubRepo: gm.repo,
            githubToken: gm.token,
            branch: gm.branch,
            filepath: gm.filepath,
            userLogin: author.username,
            userName: author.name,
            userEmail: author.email,
          };
        })
        .catch((err) => {
          console.warn('Error getting author: ', err);
        });
    }
  }

  let urlFileName = searchParams.get('file');

  if (storage.supported && urlFileName) {
    // write url filename to storage so we can act upon it later, e.g. on return from solid login
    let url = new URL(urlFileName);
    storage.safelySetStorageItem('fileLocation', url.href);
    storage.safelySetStorageItem('fileName', url.pathname.substring(url.pathname.lastIndexOf('/') + 1));
    storage.safelySetStorageItem('fileLocationType', 'url');
    console.log('Have set local storage: ', storage);
  }

  if (storage.supported && storage.restoreSolidSession) {
    // inform user they are about to restore their solid session
    // and that they can press 'esc' to stop (see generalized esc handler)
    let solidOverlay = document.getElementById('solidOverlay');
    solidOverlay.classList.add('active');
    solidOverlay.tabIndex = -1;
    solidOverlay.focus();
  }

  // fork parameter: if true AND ?fileParam is set to a URL,
  // then put mei-friend into "remote fork request" mode:
  // If user is logged in, open a pre-populated fork-repository menu
  // Else, remember we are in remote fork request mode, log user in, and then proceed as above.
  let forkParam = searchParams.get('fork');

  let urlFetchInProgress = false;

  // if we have received a ?file= param (without ?fork which is a special case further down, OR
  // ... if we have a fileLocationType 'url' with a fileLocation specified in storage, but NO meiXml
  // ... (=> because storage was disabled, e.g., due to encoding size)...
  // then, fetch and load the URL.
  if (urlFileName && !(forkParam === 'true')) {
    // normally open the file from URL
    openUrlFetch(new URL(urlFileName));
    urlFetchInProgress = true;
  } else if (
    storage.supported &&
    storage.fileLocationType &&
    storage.fileLocation &&
    storage.fileLocationType === 'url' &&
    !storage.content
  ) {
    openUrlFetch(new URL(storage.fileLocation));
    urlFetchInProgress = true;
  }

  // fill sample encodings
  fillInSampleEncodings();

  // populate the Solid tab in the annotations panel
  populateSolidTab();

  // restore localStorage if we have it
  if (storage.supported) {
    // save (most) URL parameters in storage
    if (orientationParam !== null) storage.notationOrientation = orientationParam;
    if (notationProportionParam !== null) storage.notationProportion = notationProportionParam;
    if (facsimileOrientationParam !== null) storage.facsimileOrientation = facsimileOrientationParam;
    if (facsimileProportionParam !== null) storage.facsimileProportion = facsimileProportionParam;
    if (pageParam !== null) storage.page = pageParam;
    if (scaleParam !== null) storage.scale = scaleParam;
    // if (selectParam && selectParam.length > 0) storage.select = selectParam;
    if (speedParam !== null) storage.speed = speedParam;
    if (breaksParam !== null) storage.breaks = breaksParam;
    if (storage.githubLogoutRequested) {
      v.showAlert(translator.lang.githubLoggedOutWarning.text, 'warning', 30000);
      storage.removeItem('githubLogoutRequested');
    }
    setFileChangedState(storage.fileChanged);
    updateFileStatusDisplay();
    if (!urlFileName && !urlFetchInProgress) {
      // no URI param specified - try to restore from storage
      if (storage.content && storage.fileName) {
        // restore file name and content from storage
        // unless a URI param was specified
        setIsMEI(storage.isMEI);
        meiFileName = storage.fileName;
        meiFileLocation = storage.fileLocation;
        meiFileLocationPrintable = storage.fileLocationPrintable;
        setFileLocationType(storage.fileLocationType);
        updateFileStatusDisplay();
        // on initial page load, CM doesn't fire a "changes" event
        // so we don't need to skip the "freshly loaded" change
        // hence the "false" on the following line:
        loadDataInEditor(storage.content, false);
      } else {
        meiFileLocation = '';
        meiFileLocationPrintable = '';
        setIsMEI(true); // default MEI
        openFile(undefined, false, false); // default MEI, skip freshly loaded (see comment above)
        setFileChangedState(false);
      }
    }
    if (storage.forkAndOpen && gm) {
      // we've arrived back after an automated log-in request
      // now fork and open the supplied URL, and remove it from storage
      forkAndOpen(gm, storage.forkAndOpen);
      storage.removeItem('forkAndOpen');
    }
  } else {
    // no local storage
    if (isLoggedIn) {
      // initialise new github object
      gm = new GitManager('github', 'github', githubToken);
      //github = new Github('', githubToken, '', '', '', userLogin, userName, userEmail);
    }
    meiFileLocation = '';
    meiFileLocationPrintable = '';
    openFile(undefined, false, false); // default MEI
  }
  if (isLoggedIn) {
    // regardless of storage availability:
    // if we are logged in, refresh github menu
    refreshGithubMenu();
    if (gm.repo && gm.branch && gm.filepath) {
      // preset github menu to where the user left off, if we can
      fillInBranchContents();
    }
  }
  if (forkParam === 'true' && urlFileName) {
    if (isLoggedIn && gm) {
      console.log('Forking and opening URL file...');
      forkAndOpen(gm, urlFileName);
    } else {
      if (storage.supported) {
        storage.safelySetStorageItem('forkAndOpen', urlFileName);
        document.getElementById('githubLoginLink').click();
      }
    }
  }

  // Retrieve parameters from URL params, from storage, or default values
  if (scaleParam !== null) {
    document.getElementById('verovioZoom').value = scaleParam;
  } else if (storage && storage.supported && storage.hasItem('scale')) {
    document.getElementById('verovioZoom').value = storage.scale;
  }
  if (speedParam !== null) {
    v.speedMode = speedParam === 'true';
    document.getElementById('speedCheckbox').checked = v.speedMode;
  } else if (storage && storage.supported && storage.hasItem('speed')) {
    v.speedMode = storage.speed;
    document.getElementById('speedCheckbox').checked = v.speedMode;
  }
  let o = ''; // orientation from URLparam, storage or default (in this order)
  if (orientationParam !== null) {
    o = orientationParam;
  } else if (storage && storage.supported && storage.hasItem('notationOrientation')) {
    o = storage.notationOrientation;
  } else {
    o = defaultNotationOrientation;
  }
  let fo = ''; // facsimile orientation from URLparam, storage or default (in this order)
  if (facsimileOrientationParam !== null) {
    fo = facsimileOrientationParam;
  } else if (storage && storage.supported && storage.hasItem('facsimileOrientation')) {
    fo = storage.facsimileOrientation;
  } else {
    fo = defaultFacsimileOrientation;
  }
  let np = -1;
  if (notationProportionParam !== null) {
    np = notationProportionParam;
  } else if (storage && storage.supported && storage.hasItem('notationProportion')) {
    np = storage.notationProportion;
  } else {
    np = defaultNotationProportion;
  }
  let fp = -1;
  if (facsimileProportionParam !== null) {
    fp = facsimileProportionParam;
  } else if (storage && storage.supported && storage.hasItem('facsimileProportion')) {
    fp = storage.facsimileProportion;
  } else {
    fp = defaultFacsimileProportion;
  }

  setNotationProportion(np);
  setFacsimileProportion(fp);
  setOrientation(cm, o, fo, v, storage);

  addEventListeners(v, cm);
  addAnnotationHandlers();
  addMarkupHandlers();
  addNotationResizerHandlers(v, cm);
  addFacsimilerResizerHandlers(v, cm);
  let doit;
  window.onresize = () => {
    clearTimeout(doit); // wait half a second before re-calculating orientation
    doit = setTimeout(() => setOrientation(cm, '', '', v, storage), 500);
  };

  setKeyMap();

  // remove URL parameters from URL
  // TODO: check handleURLParamSelect() occurrences, whether removing search parameters has an effect there.
  const currentUrl = new URL(window.location);
  const shortUrl = new URL(currentUrl.origin + currentUrl.pathname);
  if (solidCodeParam && solidStateParam) {
    // restore Solid authentication parameters if required
    shortUrl.searchParams.append('code', solidCodeParam);
    shortUrl.searchParams.append('state', solidStateParam);
  }
  window.history.pushState({}, '', shortUrl.href);
  if (storage.supported && storage.restoreSolidSession) {
    restoreSolidTimeout = setTimeout(function () {
      solidOverlay.classList.remove('active');
      loginAndFetch(getSolidIdP(), populateSolidTab);
    }, restoreSolidTimeoutDelay);
  }
} // completeInitialLoad()

export async function openUrlFetch(url = '', updateAfterLoading = true) {
  let urlInput = document.querySelector('#openUrlInput');
  let urlStatus = document.querySelector('#openUrlStatus');
  try {
    if (!url) url = new URL(urlInput.value);
    const headers = { Accept: 'application/xml, text/xml, application/mei+xml' };
    if (isLoggedIn && url.href.trim().startsWith('https://raw.githubusercontent.com')) {
      // determine user/org, repo, branch, and file path from URL
      const urlParts = url.pathname.split('/');
      const userOrg = urlParts[1];
      const repo = urlParts[2];
      const branch = urlParts[3];
      const filepath = urlParts.slice(4).join('/');

      if (userOrg && repo && branch && filepath) {
        // clone repo
        gm = new GitManager('github', 'github', githubToken);
        // TODO modify for multiple git providers
        gm.clone(`https://github.com/${userOrg}/${repo}.git`, branch)
          .then(() => {
            gm.readFile(filepath)
              .then((data) => {
                openUrlProcess(data, url, updateAfterLoading);
              })
              .catch((err) => {
                console.warn('Error reading file from cloned repo: ', err);
                urlStatus.innerHTML = 'Error reading file from cloned repo';
                urlStatus.classList.add('warn');
                urlInput.classList.add('warn');
              });
          })
          .catch((err) => {
            console.warn('Error cloning repo: ', err);
            urlStatus.innerHTML = 'Error cloning repo';
            urlStatus.classList.add('warn');
            urlInput.classList.add('warn');
          });
      } else {
        console.warn('Invalid raw GitHub URL provided by user: ', url);
        urlStatus.innerHTML = 'Invalid raw GitHub URL, please fix...';
        urlStatus.classList.add('warn');
        urlInput.classList.add('warn');
      }
    } else {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'omit',
      });
      if (response.status >= 400) {
        console.warn('Fetching URL produced error status: ', response.status);
        urlStatus.innerHTML = `${response.status}: ${response.statusText.toLowerCase()}`;
        urlStatus.classList.add('warn');
        urlInput.classList.add('warn');
      } else {
        response.text().then((data) => {
          openUrlProcess(data, url, updateAfterLoading);
        });
      }
    }
  } catch (err) {
    console.warn('Error opening URL provided by user: ', err);
    if (err instanceof TypeError) {
      urlStatus.innerHTML = 'CORS error';
    } else {
      urlStatus.innerHTML = 'Invalid URL, please fix...';
    }
    urlInput.classList.add('warn');
    urlStatus.classList.add('warn');
  }
}

function openUrlProcess(content, url, updateAfterLoading) {
  console.log('openUrlProcess called with: ', content);
  let urlInput = document.querySelector('#openUrlInput');
  let urlStatus = document.querySelector('#openUrlStatus');
  urlStatus.innerHTML = '';
  urlStatus.classList.remove('warn');
  urlInput.classList.remove('warn');
  meiFileLocation = url.href;
  meiFileLocationPrintable = url.hostname;
  meiFileName = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
  if (storage.github && isLoggedIn) {
    // re-initialise github menu since we're now working from a URL
    gm.filepath = '';
    gm.branch = '';
    if (storage.supported) {
      updateGithubInLocalStorage();
    }
    refreshGithubMenu();
  }
  updateFileStatusDisplay();
  handleEncoding(content, true, updateAfterLoading);
  if (storage.supported) {
    storage.fileLocationType = 'url';
  }
  setFileLocationType('url');
  setStandoffAnnotationEnabledStatus();
  openUrlCancel(); //hide open URL UI elements
  const fnStatus = document.getElementById('fileName');
  if (fnStatus) fnStatus.removeAttribute('contenteditable');
}

function speedWorkerEventsHandler(ev) {
  console.log('main.speedWorkerEventsHandler received: ' + ev.data.cmd);
  if (ev.data.cmd === 'listPageSpanningElements') {
    console.log('main() speedWorkerHandler pageSpanners: ', ev.data.pageSpanners);
    if (!ev.data.pageSpanners) {
      // MEI file is malformed and pageSpanners could not be extracted
      return;
    }
    v.pageSpanners = {
      ...ev.data.pageSpanners,
    };
    if (Object.keys(v.pageSpanners.start).length > 0) {
      v.updateAll(cm, {}, v.selectedElements[0]);
    }
    v.busy(false, true);
  }
}

async function vrvWorkerEventsHandler(ev) {
  let blob; // houses blob for MIDI download or playback
  console.log('main.vrvWorkerEventsHandler() received: ' + ev.data.cmd); // , ev.data
  if ('toolkitDataOutdated' in ev.data) {
    v.toolkitDataOutdated = ev.data.toolkitDataOutdated;
  }
  switch (ev.data.cmd) {
    case 'vrvLoaded':
      console.info('main(). Handler vrvLoaded: ', this);
      tkVersion = ev.data.version;
      tkUrl = ev.data.url;
      tkAvailableOptions = ev.data.availableOptions;
      v.clearVrvOptionsSettingsPanel();
      v.addVrvOptionsToSettingsPanel(tkAvailableOptions, defaultVerovioOptions);

      translator.translateGui();
      translateLanguageSelection(translator.langCode);

      // v.addMeiFriendOptionsToSettingsPanel();
      drawRightFooter();
      document.getElementById('statusBar').innerHTML = `Verovio ${tkVersion} ${translator.lang.verovioLoaded.text}.`;
      setBreaksOptions(tkAvailableOptions, defaultVerovioOptions.breaks);
      setChoiceOptions('');
      if (!storage.supported || !meiFileName) {
        // open default mei file
        openFile();
      } else {
        // open stored data, setting vrv options first
        v.clear();
        v.allowCursorActivity = false;
        loadDataInEditor(storage.content);
        v.allowCursorActivity = true;
        v.updateAll(cm, {}, handleURLParamSelect());
      }
      v.busy(false);
      break;
    case 'mei': // returned from importData, importBinaryData
      v.pageCount = ev.data.pageCount;
      v.allowCursorActivity = false;
      loadDataInEditor(ev.data.mei);
      setFileChangedState(false);
      updateLocalStorage(ev.data.mei);
      v.allowCursorActivity = true;
      v.updateAll(cm, defaultVerovioOptions, handleURLParamSelect());
      //v.busy(false);
      break;
    case 'updated': // display SVG data on site
      if (ev.data.mei) {
        // from reRenderMEI
        v.allowCursorActivity = false;
        loadDataInEditor(ev.data.mei);
        setFileChangedState(false);
        updateLocalStorage(ev.data.mei);
        v.allowCursorActivity = true;
        v.selectedElements = [];
        if (!ev.data.removeIds) v.selectedElements.push(ev.data.xmlId);
      }

      if (isSafari && Object.keys(translator.lang).length > 0 && !safariWarningShown) {
        safariWarningShown = true;
        v.showAlert(translator.lang.isSafariWarning.text, 'error', -1);
      }

      // add section selector
      let ss = document.getElementById('sectionSelect');
      while (ss.options.length > 0) ss.remove(0); // clear existing options
      let sections = generateSectionSelect(v.xmlDoc);
      if (sections.length > 1) {
        sections.forEach((opt) => ss.options.add(new Option(opt[0], opt[1])));
        ss.style.display = 'block';
      } else {
        ss.style.display = 'none';
      }
      let bs = document.getElementById('breaksSelect').value;
      if (ev.data.pageCount && !v.speedMode) {
        v.pageCount = ev.data.pageCount;
      } else if (bs === 'none') {
        v.pageCount = 1;
      } else if (v.speedMode && bs === 'auto' && v.pageBreaks && Object.keys(v.pageBreaks).length > 0) {
        v.pageCount = Object.keys(v.pageBreaks).length;
      }
      //update choiceSelect
      let cs = document.getElementById('choiceSelect').selectedOptions[0]?.value;
      setChoiceOptions(cs);
      // update only if still same page
      if (v.currentPage === ev.data.pageNo || ev.data.forceUpdate || ev.data.computePageBreaks || v.pdfMode) {
        if (ev.data.forceUpdate) {
          v.currentPage = ev.data.pageNo;
        }
        updateStatusBar();
        updateHtmlTitle();
        document.getElementById('verovio-panel').innerHTML = ev.data.svg;
        if (document.getElementById('showFacsimilePanel') && document.getElementById('showFacsimilePanel').checked) {
          // loadFacsimile(v.xmlDoc);
          await drawFacsimile();
        }
        if (ev.data.setCursorToPageBeginning) v.setCursorToPageBeginning(cm);
        v.updatePageNumDisplay();
        v.addNotationEventListeners(cm);
        v.updateHighlight(cm);
        refreshAnnotationsInNotation(false);
        v.scrollSvgTo(cm);
        if (v.pdfMode) {
          // switch on frame, when in pdf mode
          const svg = document.querySelector('#verovio-panel svg');
          if (svg) svg.classList.add('showFrame');
        }
      }
      if (mp.playing) {
        highlightNotesAtMidiPlaybackTime();
      }
      if (!'setFocusToVerovioPane' in ev.data || ev.data.setFocusToVerovioPane) {
        v.setFocusToVerovioPane();
      }
      if (ev.data.computePageBreaks) {
        v.computePageBreaks(cm);
      } else {
        v.busy(false);
      }
      break;
    case 'navigatePage': // resolve navigation with page turning
      updateStatusBar();
      document.getElementById('verovio-panel').innerHTML = ev.data.svg;
      let ms = document.querySelectorAll('.measure'); // find measures on page
      if (ms.length > 0) {
        let m = ms[0];
        if (ev.data.dir === 'backwards') m = ms[ms.length - 1]; // last measure
        let id = getInMeasure(m, navElsSelector, ev.data.stNo, ev.data.lyNo, ev.data.what);
        if (id) v.findClosestNoteInChord(id, ev.data.y);
        setCursorToId(cm, id);
        v.selectedElements = [];
        v.selectedElements.push(id);
        v.lastNoteId = id;
      }
      v.addNotationEventListeners(cm);
      refreshAnnotationsInNotation(false);
      v.scrollSvgTo(cm);
      v.updateHighlight(cm);
      v.setFocusToVerovioPane();
      v.busy(false);
      break;
    case 'meiBasicExported':
      let meiBasicBlob = new Blob([ev.data.meiBasic], {
        type: 'text/plain',
      });
      let url = URL.createObjectURL(meiBasicBlob);
      let fileName = meiFileName.substring(meiFileName.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '-basic.mei');
      // buxfix for Safari (#33, 31. Aug 2023)
      setTimeout(() => {
        let a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', fileName);
        a.click();
      }, 0);
      break;
    case 'downloadMidiFile': // export MIDI file
      blob = midiDataToBlob(ev.data.midi);
      let a = document.createElement('a');
      a.download = meiFileName.substring(meiFileName.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '.mid');
      a.href = window.URL.createObjectURL(blob);
      a.click();
      v.busy(false);
      break;
    case 'midiPlayback': // play MIDI file
      console.log('Received MIDI and Timemap:', ev.data.midi, ev.data.timemap);
      setTimemap(ev.data.timemap);
      if (ev.data.expansionMap) {
        setExpansionMap(ev.data.expansionMap);
      }
      if (mp) {
        blob = midiDataToBlob(ev.data.midi);
        midiCore.blobToNoteSequence(blob).then((noteSequence) => {
          mp.noteSequence = noteSequence;
        });
        if ('expand' in ev.data && ev.data.expand && !v.speedMode) {
          v.updateAll(cm); // update vrv worker, if expand, no speed mode
        }
      }
      break;
    case 'pdfBlob':
      document.getElementById('statusBar').innerHTML =
        meiFileName.split('/').pop() + ' ' + translator.lang.convertedToPdf + '.';
      let aa = document.createElement('a');
      aa.download = meiFileName.substring(meiFileName.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '.pdf');
      aa.href = window.URL.createObjectURL(ev.data.blob);
      aa.click();
      break;
    case 'timeForElement': // receive time for element to start midi playback
      // console.log('Received time for element: ', ev.data);
      if (ev.data.triggerMidiSeekTo) {
        seekMidiPlaybackToTime(ev.data.msg); // time in ms
      }
      break;
    case 'computePageBreaks':
      v.pageBreaks = ev.data.pageBreaks;
      v.pageCount = ev.data.pageCount;
      // console.log('Page breaks computed for ' +
      //   meiFileName.substring(meiFileName.lastIndexOf("/") + 1) +
      //   ', pageBreaks', v.pageBreaks);
      v.updateData(cm, false, true);
      updateStatusBar();
      v.updatePageNumDisplay();
      v.busy(false);
      break;
    case 'updateProgressbar':
      document.getElementById('statusBar').innerHTML =
        translator.lang.statusBarCompute + ' ' + ev.data.fileFormat + ': ' + Math.round(ev.data.percentage) + '%';
      setProgressBar(ev.data.percentage);
      break;
    case 'error':
      document.getElementById('verovio-panel').innerHTML =
        '<h3>Invalid MEI in ' + meiFileName + ' (' + ev.data.msg + ')</h3>';
      v.busy(false);
      break;
  }
  // cm.blockChanges = false;
} // vrvWorkerEventsHandler()

// handles select (& page) input parameter from URL arguments ".../?select=..."
function handleURLParamSelect() {
  if (pageParam !== null) {
    v.currentPage = parseInt(pageParam);
  } else if (storage && storage.supported && storage.hasItem('page')) {
    v.currentPage = storage.page;
  }
  if (selectParam && selectParam.length > 0) {
    v.selectedElements = selectParam;
    // } else if (storage && storage.supported && storage.hasItem('select')) {
    //   v.selectedElements = storage.select;
  }
  return v.selectedElements.length > 0 ? v.selectedElements[0] : '';
}

// key is the input-from option in Verovio, value the distinctive string
let inputFormats = {
  mei: '<mei',
  xml: '<score-partwise', // the only musicXML flavor supported by Verovio
  // xml: "<score-timewise", // does Verovio import timewise musicXML?
  humdrum: '**kern',
  pae: '@clef',
};

export function openFile(file = defaultMeiFileName, setFreshlyLoaded = true, updateAfterLoading = true) {
  // cm.blockChanges = true;
  if (storage.github && isLoggedIn) {
    // re-initialise github menu since we're now working from a file
    gm.filepath = '';
    gm.branch = '';
    if (storage.supported) {
      updateGithubInLocalStorage();
    }
    refreshGithubMenu();
  }
  if (pageParam === null) storage.removeItem('page');
  // remove any URL parameters, because we open a file locally or through github
  window.history.replaceState(null, null, window.location.pathname);
  if (storage.supported) {
    storage.fileLocationType = 'file';
  }
  fileLocationType = 'file';
  if (gm) gm.filepath = '';
  if (typeof file === 'string') {
    // with fileName string
    meiFileName = file;
    console.info('openMei ' + meiFileName + ', ', cm);
    fetch(meiFileName)
      .then((response) => response.text())
      .then((meiXML) => {
        console.log('MEI file ' + meiFileName + ' loaded.');
        v.clear();
        v.allowCursorActivity = false;
        loadDataInEditor(meiXML, setFreshlyLoaded);
        setFileChangedState(false);
        updateLocalStorage(meiXML);
        v.allowCursorActivity = true;
        if (updateAfterLoading) {
          v.updateAll(cm, {}, handleURLParamSelect());
        }
      });
  } else {
    // if a file
    let readingPromise = new Promise(function (loaded, notLoaded) {
      meiFileName = file.name;
      console.info('openMei ' + meiFileName + ', ', cm);
      let reader = new FileReader();
      reader.onload = (event) => {
        let meiString = event.target.result;
        console.info('Reader read ' + meiFileName);
        if (meiString) loaded(meiString);
        else notLoaded();
      };
      if (meiFileName.endsWith('.mxl') || meiFileName.endsWith('.ft2') || meiFileName.endsWith('.ft3')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
    readingPromise.then(
      function (mei) {
        handleEncoding(mei, setFreshlyLoaded, updateAfterLoading);
      },
      function () {
        log('Loading dragged file ' + meiFileName + ' failed.');
        v.busy(false);
      }
    );
  }
  meiFileLocation = '';
  meiFileLocationPrintable = '';
  updateFileStatusDisplay();
} // openFile()

// checks format of encoding string and imports or loads data/notation
// mei argument may be MEI or any other supported format (text/binary)
export function handleEncoding(meiXML, setFreshlyLoaded = true, updateAfterLoading = true, clearBeforeLoading = true) {
  let found = false;
  if (clearBeforeLoading) {
    clearFacsimile();
    clearListItems();
    if (pageParam === null) storage.removeItem('page');
    v.clear();
  }
  v.busy();
  if (meiFileName.endsWith('.mxl')) {
    // compressed MusicXML file
    console.log('Load compressed XML file.', meiXML.slice(0, 128));
    vrvWorker.postMessage({
      cmd: 'importBinaryData',
      format: 'xml',
      mei: meiXML,
    });
    found = true;
    setIsMEI(false);
  } else if (meiFileName.endsWith('.abc')) {
    // abc notation file
    console.log('Load ABC file.', meiXML.slice(0, 128));
    vrvWorker.postMessage({
      cmd: 'importData',
      format: 'abc',
      mei: meiXML,
    });
    found = true;
    setIsMEI(false);
  } else if (meiFileName.endsWith('.ft2') || meiFileName.endsWith('.ft3')) {
    // lute tablature file (Fronimo format)
    console.log('Load Fronimo file.', meiXML.slice(0, 128));
    // set found to true, since we don't know if luteconv will succeed
    // (we don't want to show the "format not recognized" message)
    found = true;
    setIsMEI(false);
    // attempt to convert to MEI using luteconv web service:
    luteconv(meiXML, meiFileName).then((meiString) => {
      if (meiString) {
        // rename file to .mei
        setMeiFileInfo(meiFileName + '.mei', meiFileLocation, meiFileLocationPrintable);
        updateFileStatusDisplay();
        vrvWorker.postMessage({
          cmd: 'importData',
          format: 'mei',
          mei: meiString,
        });
      } else {
        log('Loading ' + meiFileName + 'did not succeed. ' + 'Could not convert Fronimo file using luteconv.');
        v.busy(false);
      }
    });
  } else {
    // all other formats are found by search term in text file
    for (const [key, value] of Object.entries(inputFormats)) {
      if (meiXML.includes(value)) {
        // a hint that it is a MEI file
        found = true;
        console.log(key + ' file loading: ' + meiFileName);
        if (key === 'mei') {
          // if already a mei file
          setIsMEI(true);
          v.allowCursorActivity = false;
          loadDataInEditor(meiXML, setFreshlyLoaded);
          setFileChangedState(false);
          updateLocalStorage(meiXML);
          v.allowCursorActivity = true;
          if (updateAfterLoading) {
            v.updateAll(cm, defaultVerovioOptions, handleURLParamSelect());
          }
          break;
        } else {
          // all other formats that Verovio imports
          setIsMEI(false);
          vrvWorker.postMessage({
            cmd: 'importData',
            format: key,
            mei: meiXML,
          });
          break;
        }
      }
    }
  }
  if (!found) {
    if (meiXML.includes('<score-timewise'))
      log('Loading ' + meiFileName + 'did not succeed. ' + 'No support for timewise MusicXML files.');
    else {
      log('Format not recognized: ' + meiFileName + '.', 1649499359728);
    }
    setIsMEI(false);
    v.busy(false);
  }
  setStandoffAnnotationEnabledStatus();
}

function openFileDialog(accept = '*') {
  let input = document.createElement('input');
  input.type = 'file';
  if (accept !== '*') input.accept = accept;
  input.onchange = (_) => {
    let files = Array.from(input.files);
    console.log('OpenFile Dialog: ', files);
    if (files.length === 1) {
      meiFileName = files[0].name;
      meiFileLocation = '';
      meiFileLocationPrintable = '';
      openFile(files[0]);
      if (isLoggedIn) {
        // re-initialise github menu since we're now working locally
        gm.filepath = '';
        gm.branch = '';
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
} // openFileDialog()

function downloadMei() {
  let blob = new Blob([cm.getValue()], {
    type: 'text/plain',
  });
  let url = URL.createObjectURL(blob);
  let fileName = meiFileName.substring(meiFileName.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '.mei');
  // buxfix for Safari (#33, 31. Aug 2023)
  setTimeout(() => {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    a.click();
  }, 0);
  // Now that the user has "saved" the MEI, clear the file change indicator
  setFileChangedState(false);
} // downloadMei()

function downloadMeiBasic() {
  let message = {
    cmd: 'exportMeiBasic',
    options: v.vrvOptions,
    mei: cm.getValue(), // exclude dummy measures in speed mode
  };
  vrvWorker.postMessage(message);
} // downloadMeiBasic()

function downloadSpeedMei() {
  let blob = new Blob([speed.getPageFromDom(v.xmlDoc, v.currentPage, v.breaksValue(), v.pageSpanners)], {
    type: 'text/plain',
  });
  let url = URL.createObjectURL(blob);
  let fileName = meiFileName
    .substring(meiFileName.lastIndexOf('/') + 1)
    .replace(/\.[^/.]+$/, '_page-' + v.currentPage + '-speedMode.mei');
  // buxfix for Safari (#33, 31. Aug 2023)
  setTimeout(() => {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    a.click();
  }, 0);
} // downloadSpeedMei()

function createSplashScreen() {
  const alwaysShow = document.getElementById('splashAlwaysShow'); // checkbox in splash screen
  alwaysShow.addEventListener('change', (e) => {
    const showSplash = document.getElementById('showSplashScreen'); // checkbox in settings
    if (showSplash) {
      showSplash.click();
    } else {
      if (e.target.checked) {
        storage.showSplashScreen = 'true';
      } else {
        storage.removeItem('mf-showSplashScreen');
      }
    }
  });
  document
    .getElementById('splashConfirmButton')
    .addEventListener('click', () => handleSplashConfirmed(splashInitialLoad, storage));
} // createSplashScreen()

function handleSplashConfirmed(splashInitialLoad, storage) {
  document.getElementById('splashOverlay').style.display = 'none';
  if (storage && storage.supported) {
    storage.splashAcknowledged = splashDate;
  }
  if (splashInitialLoad) completeInitialLoad();
}

function showSplashScreen(showUpdateIndicator = false) {
  const updateIndicator = document.getElementById('splashUpdateIndicator');
  const splashLastUpdated = document.getElementById('splashLastUpdated');
  updateIndicator.innerHTML = translator.lang.splashUpdateIndicator.html;
  const translatedSplashDate = translator.translateDate(splashDate);
  splashLastUpdated.innerHTML = translator.lang.splashLastUpdated.text + translatedSplashDate;
  showUpdateIndicator ? (updateIndicator.style.display = 'block') : (updateIndicator.style.display = 'none'); // shown if text has changed since last acknowledgement
  const alwaysShow = document.getElementById('splashAlwaysShow'); // checkbox in splash screen
  document.getElementById('splashOverlay').style.display = 'flex';
  alwaysShow.checked = storage.showSplashScreen;
  document.getElementById('splashConfirmButton').focus({ focusVisible: false });
} // showSplashScreen()

function togglePdfMode() {
  console.log('Toggle PDF mode');
  v.pdfMode ? v.saveAsPdf() : v.pageModeOn();
} // togglePdfMode()

export function requestMidiFromVrvWorker(requestTimemap = false) {
  let meiString;
  // if (v.expansionId) {
  //   let expansionEl = v.xmlDoc.querySelector('[*|id="' + v.expansionId + '"]');
  //   let existingList = [];
  //   let expandedDoc = expansionMap.expand(expansionEl, existingList, v.xmlDoc.cloneNode(true));
  //   meiString = v.speedFilter(new XMLSerializer().serializeToString(expandedDoc), false, true);
  //   if (v.speedMode) {
  //     v.loadXml(cm.getValue(), true); // reload xmlDoc when in speed mode
  //   } else {
  //     v.toolkitDataOutdated = true; // force load data for MIDI playback
  //   }
  // } else {
  // }
  meiString = v.speedFilter(cm.getValue(), false);
  let message = {
    cmd: 'exportMidi',
    expand: v.expansionId,
    options: v.vrvOptions,
    mei: meiString, // exclude dummy measures in speed mode
    requestTimemap: requestTimemap,
    speedMode: v.speedMode,
    toolkitDataOutdated: v.toolkitDataOutdated,
  };
  vrvWorker.postMessage(message);
} // requestMidiFromVrvWorker()

function downloadSvg() {
  let svg = document.getElementById('verovio-panel').innerHTML;
  let blob = new Blob([svg], {
    type: 'image/svg+xml',
  });
  let url = URL.createObjectURL(blob);
  let fileName = meiFileName.substring(meiFileName.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '.svg');
  // buxfix for Safari (#33, 31. Aug 2023)
  setTimeout(() => {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    a.click();
  }, 0);
} // downloadSvg()

function consultGuidelines() {
  let elementAtCursor = getElementAtCursor(cm);
  //console.log('Consult guidelines: Looking at first element', elementAtCursor);
  if (elementAtCursor) {
    // cursor is currently positioned on an element
    // find closest preceding element that opens a tag
    let found = false;
    do {
      //   console.log('Consult guidelines: Looking at element', elementAtCursor);
      if (
        elementAtCursor.nodeType !== Node.TEXT_NODE &&
        elementAtCursor.classList.contains('cm-tag') &&
        !elementAtCursor.classList.contains('cm-bracket')
      ) {
        found = true;
        break;
      }
      if (elementAtCursor.previousSibling) {
        elementAtCursor = elementAtCursor.previousSibling;
      }
    } while (elementAtCursor.previousSibling);

    if (found) {
      // choose the first XML element (a "tag" that isn't a "bracket")
      if (elementAtCursor.innerText && !elementAtCursor.innerText.includes(':')) {
        // it's an element in the default (hopefully MEI...) namespace
        // FIXME: For MEI 3.x and 4.x, guidelines have element name in all lower case
        // for MEI 5.0, camelCase is required.
        //window.open(guidelinesBase + 'elements/' + xmlElName.toLowerCase(), '_blank');
        window.open(guidelinesBase + 'elements/' + elementAtCursor.innerText, '_blank');
      }
    }
  }
} // consultGuidelines()

// wrapper for indentSelection to be called inside CodeMirror
function indentSelection() {
  e.indentSelection(v, cm);
} // indentSelection()

// wrapper for toMatchingTag
function toMatchingTag() {
  e.toMatchingTag(v, cm);
} // toMatchingTag()

let tagEncloserNode; // context menu to choose node name to enclose selected text

// wrapper for editor.encloseSelectionWithTag()
function encloseSelectionWithTag() {
  tagEncloserNode = e.showTagEncloserMenu(v, cm, tagEncloserNode);
} // encloseSelectionWithTag()

function encloseSelectionWithLastTag() {
  if (tagEncloserNode && tagEncloserNode.querySelector('input')?.value) {
    e.encloseSelectionWithTag(v, cm, tagEncloserNode.querySelector('input')?.value);
  }
}

// object of interface command functions for buttons and key bindings
export let cmd = {
  fileNameChange: () => {
    if (fileLocationType === 'file') {
      meiFileName = document.getElementById('fileName').innerText;
      updateStatusBar();
      updateHtmlTitle();
      if (storage.supported) storage.safelySetStorageItem('meiFileName', meiFileName);
    } else {
      console.warn('Attempted to change file name on non-local file');
    }
  },
  firstPage: () => v.updatePage(cm, 'first'),
  previousPage: () => v.updatePage(cm, 'backwards'),
  nextPage: () => v.updatePage(cm, 'forwards'),
  lastPage: () => v.updatePage(cm, 'last'),
  nextNote: () => v.navigate(cm, 'note', 'forwards'),
  previousNote: () => v.navigate(cm, 'note', 'backwards'),
  nextMeasure: () => v.navigate(cm, 'measure', 'forwards'),
  previousMeasure: () => v.navigate(cm, 'measure', 'backwards'),
  layerUp: () => v.navigate(cm, 'layer', 'upwards'),
  layerDown: () => v.navigate(cm, 'layer', 'downwards'),
  notationTop: () => setOrientation(cm, 'top', '', v, storage),
  notationBottom: () => setOrientation(cm, 'bottom', '', v, storage),
  notationLeft: () => setOrientation(cm, 'left', '', v, storage),
  notationRight: () => setOrientation(cm, 'right', '', v, storage),
  facsimileTop: () => setOrientation(cm, '', 'top', v, storage),
  facsimileBottom: () => setOrientation(cm, '', 'bottom', v, storage),
  facsimileLeft: () => setOrientation(cm, '', 'left', v, storage),
  facsimileRight: () => setOrientation(cm, '', 'right', v, storage),
  showFacsimilePanel: () => {
    document.getElementById('showFacsimilePanel').checked = true;
    setOrientation(cm, '', '', v);
  },
  hideFacsimilePanel: () => {
    document.getElementById('showFacsimilePanel').checked = false;
    setOrientation(cm, '', '', v);
  },
  toggleFacsimilePanel: () => {
    document.getElementById('showFacsimilePanel').checked = !document.getElementById('showFacsimilePanel').checked;
    setOrientation(cm, '', '', v);
  },
  checkFacsimile: () => {
    let tf = document.getElementById('titleFacsimilePanel');
    let f = v.xmlDoc.querySelector('facsimile');
    console.log('checkFacsimile() called, facsimile present: ', f);
    if (v.xmlDoc.querySelector('facsimile')) {
      if (tf) tf.setAttribute('open', 'true');
      cmd.showFacsimilePanel();
    } else {
      if (tf) tf.removeAttribute('open');
      cmd.hideFacsimilePanel();
    }
  },
  showSettingsPanel: () => v.showSettingsPanel(),
  hideSettingsPanel: () => v.hideSettingsPanel(),
  toggleSettingsPanel: (ev) => v.toggleSettingsPanel(ev),
  togglePdfMode: () => togglePdfMode(),
  pageModeOn: () => v.pageModeOn(),
  pageModeOff: () => v.pageModeOff(),
  saveAsPdf: () => v.saveAsPdf(),
  generateUrl: () => generateUrlUI(),
  switchFocus: () => v.switchFocusBetweenNotationAndEncoding(cm),
  filterSettings: () => v.applySettingsFilter(),
  filterReset: () => {
    document.getElementById('filterSettings').value = '';
    document.getElementById('filterSettings').dispatchEvent(new Event('input'));
  },
  toggleMidiPlaybackControlBar: (toggleCheckbox = true) => {
    if (toggleCheckbox) {
      let status = document.getElementById('showMidiPlaybackControlBar').checked;
      document.getElementById('showMidiPlaybackControlBar').checked = !status;
    }
    v.toggleMidiPlaybackControlBar();
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      // request MIDI rendering from Verovio worker
      requestMidiFromVrvWorker(true);
      document.getElementById('midiPlayerContextual').style.display = 'none';
    } else {
      if (document.getElementById('showMidiPlaybackContextualBubble').checked) {
        document.getElementById('midiPlayerContextual').style.display = 'block';
      }
      if (mp.playing) {
        // stop player when control bar is closed
        mp.stop();
      }
      if (document.getElementById('highlightCurrentlySoundingNotes').checked) {
        // tidy up any highlighted notes when control bar is closed
        document.querySelectorAll('.currently-playing').forEach((e) => e.classList.remove('currently-playing'));
      }
    }
  },
  showLanguageSelection: () => {
    const langSel = document.getElementById('languageSelectionList');
    langSel.style.display = 'block';
  },
  hideLanguageSelection: () => {
    const langSel = document.getElementById('languageSelectionList');
    langSel.style.display = 'none';
  },
  showAnnotationPanel: () => {
    document.getElementById('showAnnotationPanel').checked = true; // TODO: remove?
    v.toggleAnnotationPanel();
  },
  hideAnnotationPanel: () => {
    document.getElementById('showAnnotationPanel').checked = false; // TODO: remove?
    v.toggleAnnotationPanel();
  },
  toggleAnnotationPanel: () => {
    let status = document.getElementById('showAnnotationPanel').checked;
    document.getElementById('showAnnotationPanel').checked = !status;
    v.toggleAnnotationPanel();
  },
  moveProgBar: () => moveProgressBar(),
  open: () => openFileDialog(),
  openUrl: () => openUrl(),
  openUrlFetch: () => openUrlFetch(),
  openUrlCancel: () => openUrlCancel(),
  openExample: () => openUrl(true),
  openMusicXml: () => openFileDialog('.xml,.musicxml,.mxl'),
  openHumdrum: () => openFileDialog('.krn,.hum'),
  openPae: () => openFileDialog('.pae,.abc'),
  downloadMei: () => downloadMei(),
  downloadMeiBasic: () => downloadMeiBasic(),
  downloadSpeedMei: () => downloadSpeedMei(),
  doFind: () => {
    if (document.getElementById('persistentSearch').checked) {
      CodeMirror.commands.findPersistent(cm);
    } else {
      CodeMirror.commands.find(cm);
    }
    document.getElementById('CodeMirror-search-field')?.focus();
  },
  doFindNext: () => {
    if (document.getElementById('persistentSearch').checked) {
      CodeMirror.commands.findPersistentNext(cm);
    } else {
      CodeMirror.commands.findNext(cm);
    }
  },
  doFindPrev: () => {
    if (document.getElementById('persistentSearch').checked) {
      CodeMirror.commands.findPersistentPrev(cm);
    } else {
      CodeMirror.commands.findPrev(cm);
    }
  },
  indentSelection: () => e.indentSelection(v, cm),
  validate: () => v.manualValidate(),
  notesZoomIn: () => v.zoom(+1, storage),
  notesZoomOut: () => v.zoom(-1, storage),
  notesZoom50: () => v.zoom(50, storage),
  notesZoom100: () => v.zoom(100, storage),
  notesZoomSlider: () => {
    let zoomCtrl = document.getElementById('verovioZoom');
    if (zoomCtrl && storage && storage.supported) storage.scale = zoomCtrl.value;
    v.updateLayout();
  },
  facsZoomIn: () => zoomFacsimile(+5),
  facsZoomOut: () => zoomFacsimile(-5),
  undo: () => cm.undo(),
  redo: () => cm.redo(),
  // add note
  addNote: () => e.addNote(v, cm),
  convertNoteToRest: () => e.convertNoteToRest(v, cm),
  convertToChord: () => e.convertToChord(v, cm),
  // add accidentals
  addDoubleSharp: () => e.addAccidental(v, cm, 'x'),
  addSharp: () => e.addAccidental(v, cm, 's'),
  addNatural: () => e.addAccidental(v, cm, 'n'),
  addFlat: () => e.addAccidental(v, cm, 'f'),
  addDoubleFlat: () => e.addAccidental(v, cm, 'ff'),
  // add control elements
  addSlur: () => e.addControlElement(v, cm, 'slur', ''),
  addSlurBelow: () => e.addControlElement(v, cm, 'slur', 'below'),
  addTie: () => e.addControlElement(v, cm, 'tie', ''),
  addTieBelow: () => e.addControlElement(v, cm, 'tie', 'below'),
  addCresHairpin: () => e.addControlElement(v, cm, 'hairpin', '', 'cres'),
  addDimHairpin: () => e.addControlElement(v, cm, 'hairpin', '', 'dim'),
  addCresHairpinBelow: () => e.addControlElement(v, cm, 'hairpin', 'below', 'cres'),
  addDimHairpinBelow: () => e.addControlElement(v, cm, 'hairpin', 'below', 'dim'),
  addFermata: () => e.addControlElement(v, cm, 'fermata', '', ''),
  addFermataBelow: () => e.addControlElement(v, cm, 'fermata', 'below', 'inv'),
  addDirective: () => e.addControlElement(v, cm, 'dir', '', 'dolce'),
  addDirectiveBelow: () => e.addControlElement(v, cm, 'dir', 'below', 'dolce'),
  addDynamics: () => e.addControlElement(v, cm, 'dynam', '', 'mf'),
  addDynamicsBelow: () => e.addControlElement(v, cm, 'dynam', 'below', 'mf'),
  addTempo: () => e.addControlElement(v, cm, 'tempo', '', 'Allegro'),
  addArpeggio: () => e.addControlElement(v, cm, 'arpeg', 'up'),
  addArpeggioDown: () => e.addControlElement(v, cm, 'arpeg', 'down'),
  addGlissando: () => e.addControlElement(v, cm, 'gliss'),
  addPedalDown: () => e.addControlElement(v, cm, 'pedal', 'down'),
  addPedalUp: () => e.addControlElement(v, cm, 'pedal', 'up'),
  addTrill: () => e.addControlElement(v, cm, 'trill', ''),
  addTrillBelow: () => e.addControlElement(v, cm, 'trill', 'below'),
  addTurn: () => e.addControlElement(v, cm, 'turn', '', ''), // 'upper'
  addTurnBelow: () => e.addControlElement(v, cm, 'turn', 'below', ''),
  addTurnLower: () => e.addControlElement(v, cm, 'turn', '', 'lower'),
  addTurnBelowLower: () => e.addControlElement(v, cm, 'turn', 'below', 'lower'),
  addMordent: () => e.addControlElement(v, cm, 'mordent', '', ''),
  addMordentBelow: () => e.addControlElement(v, cm, 'mordent', 'below', ''),
  addMordentUpper: () => e.addControlElement(v, cm, 'mordent', '', 'upper'),
  addMordentBelowUpper: () => e.addControlElement(v, cm, 'mordent', 'below', 'upper'),
  //
  delete: () => e.deleteElement(v, cm),
  cmdDelete: () => e.deleteElement(v, cm, true),
  invertPlacement: () => e.invertPlacement(v, cm),
  betweenPlacement: () => e.invertPlacement(v, cm, true),
  addVerticalGroup: () => e.addVerticalGroup(v, cm),
  toggleStacc: () => e.toggleArtic(v, cm, 'stacc'),
  toggleAccent: () => e.toggleArtic(v, cm, 'acc'),
  toggleTenuto: () => e.toggleArtic(v, cm, 'ten'),
  toggleMarcato: () => e.toggleArtic(v, cm, 'marc'),
  toggleStacciss: () => e.toggleArtic(v, cm, 'stacciss'),
  toggleSpicc: () => e.toggleArtic(v, cm, 'spicc'),
  shiftPitchNameUp: () => e.shiftPitch(v, cm, 1),
  shiftPitchNameDown: () => e.shiftPitch(v, cm, -1),
  shiftPitchChromaticallyUp: () => e.shiftPitch(v, cm, 1, true),
  shiftPitchChromaticallyDown: () => e.shiftPitch(v, cm, -1, true),
  shiftOctaveUp: () => e.shiftPitch(v, cm, 7),
  shiftOctaveDown: () => e.shiftPitch(v, cm, -7),
  increaseDuration: () => e.modifyDuration(v, cm, 'increase'),
  decreaseDuration: () => e.modifyDuration(v, cm, 'decrease'),
  toggleDots: () => e.toggleDots(v, cm),
  moveElementStaffUp: () => e.moveElementToNextStaff(v, cm, true),
  moveElementStaffDown: () => e.moveElementToNextStaff(v, cm, false),
  addOctave8Above: () => e.addOctaveElement(v, cm, 'above', 8),
  addOctave8Below: () => e.addOctaveElement(v, cm, 'below', 8),
  addOctave15Above: () => e.addOctaveElement(v, cm, 'above', 15),
  addOctave15Below: () => e.addOctaveElement(v, cm, 'below', 15),
  addGClefChangeBefore: () => e.addClefChange(v, cm, 'G', '2', true),
  addCClefChangeBefore: () => e.addClefChange(v, cm, 'C', '3', true),
  addFClefChangeBefore: () => e.addClefChange(v, cm, 'F', '4', true),
  addGClefChangeAfter: () => e.addClefChange(v, cm, 'G', '2', false),
  addCClefChangeAfter: () => e.addClefChange(v, cm, 'C', '3', false),
  addFClefChangeAfter: () => e.addClefChange(v, cm, 'F', '4', false),
  addBeam: () => e.addBeamElement(v, cm),
  addBeamSpan: () => e.addBeamSpan(v, cm),
  correctAccid: () => e.checkAccidGes(v, cm),
  renumberMeasuresTest: () => e.renumberMeasures(v, cm, false),
  renumberMeasures: () => e.renumberMeasures(v, cm, true),
  reRenderMei: () => v.reRenderMei(cm, false),
  reRenderMeiWithout: () => v.reRenderMei(cm, true),
  addIds: () => e.manipulateXmlIds(v, cm, false),
  removeIds: () => e.manipulateXmlIds(v, cm, true),
  ingestFacsimile: () => ingestFacsimile(),
  addFacsimile: () => e.addFacsimile(v, cm),
  encloseSelectionWithTag: encloseSelectionWithTag,
  encloseSelectionWithLastTag: encloseSelectionWithLastTag,
  resetDefault: () => {
    // clear all storage
    storage = window.localStorage;
    if (storage) {
      storage.clear();
    }
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    window.fs = new LightningFS('fs', { wipe: true });
    window.pfs = window.fs.promises;
    let url = window.location.href;
    // remove any url parameters (since these might include URLs with slashes in)
    const paramsStartIx = url.indexOf('?');
    if (paramsStartIx > -1) url = url.substring(0, paramsStartIx);
    // now modify last slash to navigate to /logout
    window.location.replace(url.substring(0, url.lastIndexOf('/')) + '/logout');
  },
  openHelp: () => window.open(`https://mei-friend.github.io/`, '_blank'),
  consultGuidelines: () => consultGuidelines(),
  escapeKeyPressed: () => {
    // hide overlays
    // TODO refactor logic for all overlays below. For now only splash overlay...
    document.getElementById('splashOverlay').style.display = 'none';

    // reset settings filter, if settings have focus
    if (
      document.getElementById('settingsPanel') &&
      document.getElementById('settingsPanel') === document.activeElement.closest('#settingsPanel')
    ) {
      cmd.filterReset();
    } else if (
      document.getElementById('solidOverlay') &&
      document.getElementById('solidOverlay') === document.activeElement.closest('#solidOverlay')
    ) {
      document.getElementById('solidOverlay').classList.remove('active');
      storage.removeItem('restoreSolidSession');
      if (restoreSolidTimeout) {
        clearTimeout(restoreSolidTimeout);
      }
    } else if (v.pdfMode) {
      cmd.pageModeOff();
    } else {
      v.hideAlerts();
      v.toggleValidationReportVisibility('hidden');
      // hide midi playback control bar if it was open
      if (document.getElementById('showMidiPlaybackControlBar').checked) {
        cmd.toggleMidiPlaybackControlBar();
      }
      // TODO: close all other overlays too...
    }

    // close all annotationMultiTools/MarkupDropDownContent
    v.hideAnnotationMarkupDropDownContent();
  },
  playPauseMidiPlayback: () => {
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      if (mp.playing) {
        mp.stop();
      } else {
        mp.start();
      }
    } else {
      requestPlaybackOnLoad();
      cmd.toggleMidiPlaybackControlBar();
    }
  },
}; // cmd{}

// add event listeners when controls menu has been instantiated
function addEventListeners(v, cm) {
  let vp = document.getElementById('verovio-panel');

  // register global event listeners
  let body = document.querySelector('body');
  body.addEventListener('mousedown', (ev) => {
    if (ev.target.matches('#alertMessage a')) {
      // user clicked on link in message. Open link (before the DOM element disappears in the next conditional...)
      window.open(ev.target.href, '_blank');
    }
    if (
      ev.target.id !== 'alertOverlay' &&
      ev.target.id !== 'alertMessage' &&
      document.getElementById('splashOverlay').style.display === 'none'
    ) {
      console.log('Body Mousedown: Hide alerts');
      v.hideAlerts();
    }
  });
  body.addEventListener('click', v.hideAnnotationMarkupDropDownContent);
  body.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') cmd.escapeKeyPressed();
  });

  // file status file name display
  document.getElementById('fileName').addEventListener('input', cmd.fileNameChange);
  document.getElementById('fileName').addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' || ev.key === 'Enter') ev.target.blur(); //remove focus
  });

  // VIEW layout notation position
  document.getElementById('notationTop').addEventListener('click', cmd.notationTop);
  document.getElementById('notationBottom').addEventListener('click', cmd.notationBottom);
  document.getElementById('notationLeft').addEventListener('click', cmd.notationLeft);
  document.getElementById('notationRight').addEventListener('click', cmd.notationRight);
  // VIEW show settings panel
  document.getElementById('showSettingsMenu').addEventListener('click', cmd.showSettingsPanel);
  document.getElementById('showSettingsButton').addEventListener('click', cmd.showSettingsPanel);
  document.getElementById('hideSettingsButton').addEventListener('click', cmd.hideSettingsPanel);
  document.getElementById('closeSettingsButton').addEventListener('click', cmd.hideSettingsPanel);
  // VIEW facsimile position
  document.getElementById('facsimileTop').addEventListener('click', cmd.facsimileTop);
  document.getElementById('facsimileBottom').addEventListener('click', cmd.facsimileBottom);
  document.getElementById('facsimileLeft').addEventListener('click', cmd.facsimileLeft);
  document.getElementById('facsimileRight').addEventListener('click', cmd.facsimileRight);

  document.getElementById('filterSettings').addEventListener('input', cmd.filterSettings);
  document.getElementById('filterSettings').value = '';
  document.getElementById('filterReset').addEventListener('click', cmd.filterReset);
  // MIDI playback button and top-left bubble
  document
    .getElementById('showMidiPlaybackControlBarButton')
    .addEventListener('click', cmd.toggleMidiPlaybackControlBar);
  document.getElementById('showMidiPlaybackContextualBubble').addEventListener('click', (e) => {
    // if MIDI control bar not showing, update (show or hide) bubble
    if (!document.getElementById('showMidiPlaybackControlBarButton').checked) {
      if (e.target.checked) {
        document.getElementById('midiPlayerContextual').style.display = 'block';
      } else {
        document.getElementById('midiPlayerContextual').style.display = 'none';
      }
    }
  });
  document.getElementById('midiPlayerContextual').addEventListener('click', () => {
    requestPlaybackOnLoad();
    cmd.toggleMidiPlaybackControlBar();
  });
  document.getElementById('closeMidiPlaybackControlBarButton').addEventListener('click', () => {
    cmd.toggleMidiPlaybackControlBar();
  });
  document.getElementById('highlightCurrentlySoundingNotes').addEventListener('change', (e) => {
    // clean up any currently highlighted notes when highlighting is turned off
    if (!e.target.checked) {
      document.querySelectorAll('.currently-playing').forEach((el) => el.classList.remove('currently-playing'));
    }
  });
  document.getElementById('showAnnotationMenu').addEventListener('click', cmd.showAnnotationPanel);
  document.getElementById('showLanguageSelectionButton').addEventListener('mouseenter', () => {
    cmd.showLanguageSelection();
  });
  document.getElementById('showLanguageSelectionButton').addEventListener('mouseleave', () => {
    cmd.hideLanguageSelection();
  });
  document.getElementById('showAnnotationsButton').addEventListener('click', cmd.toggleAnnotationPanel);
  document.getElementById('showFacsimileButton').addEventListener('click', cmd.toggleFacsimilePanel);
  document.getElementById('closeAnnotationPanelButton').addEventListener('click', cmd.hideAnnotationPanel);
  //  document.getElementById('hideAnnotationPanelButton').addEventListener('click', cmd.hideAnnotationPanel);
  document.getElementById('showFacsimileMenu').addEventListener('click', cmd.showFacsimilePanel);
  document.getElementById('showPlaybackControls').addEventListener('click', cmd.toggleMidiPlaybackControlBar);
  // re-apply settings filtering when switching settings tabs
  document.querySelectorAll('#settingsPanel .tablink').forEach((t) => t.addEventListener('click', cmd.filterSettings));

  // open dialogs
  document.getElementById('openMei').addEventListener('click', cmd.open);
  document.getElementById('openUrl').addEventListener('click', cmd.openUrl);
  document.getElementById('openExample').addEventListener('click', cmd.openExample);
  document.getElementById('importMusicXml').addEventListener('click', cmd.openMusicXml);
  document.getElementById('importHumdrum').addEventListener('click', cmd.openHumdrum);
  document.getElementById('importPae').addEventListener('click', cmd.openPae);
  document.getElementById('saveMei').addEventListener('click', cmd.downloadMei);
  document.getElementById('saveMeiBasic').addEventListener('click', cmd.downloadMeiBasic);
  document.getElementById('saveSvg').addEventListener('click', downloadSvg);
  document.getElementById('saveMidi').addEventListener('click', () => requestMidiFromVrvWorker());
  document.getElementById('printPreview').addEventListener('click', cmd.pageModeOn);
  document.getElementById('generateUrlMenu').addEventListener('click', cmd.generateUrl);

  // edit dialogs
  document.getElementById('undoMenu').addEventListener('click', cmd.undo);
  document.getElementById('redoMenu').addEventListener('click', cmd.redo);
  document.getElementById('startSearch').addEventListener('click', () => CodeMirror.commands.findPersistent(cm));
  document.getElementById('findNext').addEventListener('click', () => CodeMirror.commands.findPersistentNext(cm));
  document.getElementById('findPrevious').addEventListener('click', () => CodeMirror.commands.findPersistentPrev(cm));
  document.getElementById('replaceMenu').addEventListener('click', () => CodeMirror.commands.replace(cm));
  document.getElementById('replaceAllMenu').addEventListener('click', () => CodeMirror.commands.replaceAll(cm));
  document.getElementById('indentSelection').addEventListener('click', indentSelection);
  document.getElementById('surroundWithTags').addEventListener('click', cmd.encloseSelectionWithTag);
  document.getElementById('surroundWithLastTag').addEventListener('click', cmd.encloseSelectionWithLastTag);
  document.getElementById('jumpToLine').addEventListener('click', () => CodeMirror.commands.jumpToLine(cm));
  document.getElementById('toMatchingTag').addEventListener('click', toMatchingTag);
  document.getElementById('manualValidate').addEventListener('click', cmd.validate);
  document
    .querySelectorAll('.keyShortCut')
    .forEach((e) => e.classList.add(platform.startsWith('mac') ? 'platform-mac' : 'platform-nonmac'));

  // open URL interface
  document.getElementById('openUrlButton').addEventListener('click', cmd.openUrlFetch);
  document.getElementById('openUrlCancel').addEventListener('click', cmd.openUrlCancel);
  document.getElementById('openUrlInput').addEventListener('input', (e) => {
    e.target.classList.remove('warn');
    document.getElementById('openUrlStatus').classList.remove('warn');
  });

  // drag'n'drop handlers
  let fc = document.body; // querySelector('.dragContainer');
  fc.addEventListener('drop', (ev) => dropHandler(ev));
  fc.addEventListener('dragover', (ev) => dragOverHandler(ev));
  fc.addEventListener('dragenter', (ev) => dragEnter(ev));
  fc.addEventListener('dragleave', (ev) => dragLeave(ev));
  fc.addEventListener('dragstart', (ev) => console.log('Drag Start', ev));
  fc.addEventListener('dragend', (ev) => console.log('Drag End', ev));

  // Zooming notation with buttons
  document.getElementById('decreaseScaleButton').addEventListener('click', cmd.notesZoomOut);
  document.getElementById('increaseScaleButton').addEventListener('click', cmd.notesZoomIn);
  document.getElementById('verovioZoom').addEventListener('change', cmd.notesZoomSlider);

  // Zooming notation with mouse wheel
  vp.addEventListener('wheel', (ev) => {
    if (isCtrlOrCmd(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      v.zoom(Math.sign(ev.deltaY) * -5); // scrolling towards user = increase
    }
  });

  // Zooming facsimile with buttons
  document.getElementById('facsimileDecreaseZoomButton').addEventListener('click', cmd.facsZoomOut);
  document.getElementById('facsimileIncreaseZoomButton').addEventListener('click', cmd.facsZoomIn);
  document.getElementById('facsimileZoom').addEventListener('change', () => {
    // deltaZoom = facsimile panel value minus settings panel value
    zoomFacsimile(document.getElementById('facsimileZoom').value - document.getElementById('facsimileZoomInput').value);
  });

  // Zooming facsimile with mouse wheel
  let ip = document.getElementById('facsimile-panel');
  ip.addEventListener('wheel', (ev) => {
    if (isCtrlOrCmd(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      zoomFacsimile(Math.sign(ev.deltaY) * -5); // scrolling towards user = increase
    }
  });

  // facsimile full-page
  document.getElementById('facsimileFullPageCheckbox').addEventListener('click', (e) => {
    document.getElementById('showFacsimileFullPage').click(); // checked = e.target.checked;
    drawFacsimile();
  });

  // show facsimile zone bounding boxes
  document.getElementById('facsimileShowZonesCheckbox').addEventListener('click', (e) => {
    document.getElementById('showFacsimileZones').click(); // checked = e.target.checked;
  });

  // facsimile edit zones
  document.getElementById('facsimileEditZonesCheckbox').addEventListener('click', (e) => {
    document.getElementById('editFacsimileZones').click(); // checked = e.target.checked;
  });

  // facsimile close button
  document.getElementById('facsimileCloseButton').addEventListener('click', cmd.hideFacsimilePanel);

  // Page turning
  let ss = document.getElementById('sectionSelect');
  ss.addEventListener('change', () => {
    v.allowCursorActivity = false;
    setCursorToId(cm, ss.value);
    v.updatePage(cm, '', ss.value);
    v.allowCursorActivity = true;
  });
  document.getElementById('firstPageButton').addEventListener('click', cmd.firstPage);
  document.getElementById('previousPageButton').addEventListener('click', cmd.previousPage);
  document.getElementById('nextPageButton').addEventListener('click', cmd.nextPage);
  document.getElementById('lastPageButton').addEventListener('click', cmd.lastPage);
  // manual page entering
  document.getElementById('pagination2').addEventListener('keydown', (ev) => manualCurrentPage(v, cm, ev));
  document.getElementById('pagination2').addEventListener('blur', (ev) => manualCurrentPage(v, cm, ev));
  // font selector
  document.getElementById('engravingFontSelect').addEventListener('change', () => {
    document.getElementById('vrv-font').value = document.getElementById('engravingFontSelect').value;
    v.updateLayout();
  });
  // breaks selector
  document.getElementById('breaksSelect').addEventListener('change', (ev) => {
    if (storage && storage.supported) storage.breaks = ev.srcElement.value;
    v.pageSpanners = {
      start: {},
      end: {},
    };
    v.updateAll(cm, {}, v.selectedElements[0]);
  });
  // choice selector
  document.getElementById('choiceSelect').addEventListener('change', (ev) => {
    // selection has changed
    // then updateAll()
    v.updateAll(cm, {}, v.selectedElements[0]);
    requestMidiFromVrvWorker(true);
  });
  // navigation
  document.getElementById('backwardsButton').addEventListener('click', cmd.previousNote);
  document.getElementById('forwardsButton').addEventListener('click', cmd.nextNote);
  document.getElementById('upwardsButton').addEventListener('click', cmd.layerUp);
  document.getElementById('downwardsButton').addEventListener('click', cmd.layerDown);
  // pdf functionality
  document.getElementById('pdfSaveButton').addEventListener('click', cmd.saveAsPdf);
  document.getElementById('pdfCloseButton').addEventListener('click', cmd.pageModeOff);
  // manipulation
  document.getElementById('invertPlacement').addEventListener('click', cmd.invertPlacement);
  document.getElementById('betweenPlacement').addEventListener('click', cmd.betweenPlacement);
  document.getElementById('addVerticalGroup').addEventListener('click', cmd.addVerticalGroup);
  document.getElementById('delete').addEventListener('click', cmd.delete);
  document.getElementById('pitchChromUp').addEventListener('click', cmd.shiftPitchChromaticallyUp);
  document.getElementById('pitchChromDown').addEventListener('click', cmd.shiftPitchChromaticallyDown);
  document.getElementById('pitchUpDiat').addEventListener('click', cmd.shiftPitchNameUp);
  document.getElementById('pitchDownDiat').addEventListener('click', cmd.shiftPitchNameDown);
  document.getElementById('pitchOctaveUp').addEventListener('click', cmd.shiftOctaveUp);
  document.getElementById('pitchOctaveDown').addEventListener('click', cmd.shiftOctaveDown);
  document.getElementById('staffUp').addEventListener('click', cmd.moveElementStaffUp);
  document.getElementById('staffDown').addEventListener('click', cmd.moveElementStaffDown);
  document.getElementById('increaseDur').addEventListener('click', cmd.increaseDuration);
  document.getElementById('decreaseDur').addEventListener('click', cmd.decreaseDuration);
  document.getElementById('toggleDots').addEventListener('click', cmd.toggleDots);
  // Manipulate encoding methods
  document.getElementById('cleanAccid').addEventListener('click', cmd.correctAccid);
  document.getElementById('renumberMeasuresTest').addEventListener('click', () => e.renumberMeasures(v, cm, false));
  document.getElementById('renumberMeasuresExec').addEventListener('click', () => e.renumberMeasures(v, cm, true));
  // rerender through Verovio
  document.getElementById('reRenderMeiVerovio').addEventListener('click', cmd.reRenderMei);
  // document.getElementById('reRenderMeiWithout').addEventListener('click', cmd.reRenderMeiWithout);
  // add/remove ids
  document.getElementById('addIds').addEventListener('click', cmd.addIds);
  document.getElementById('removeIds').addEventListener('click', cmd.removeIds);
  // ingest facsimile skeleton into currently loaded MEI file
  document.getElementById('ingestFacsimile').addEventListener('click', cmd.ingestFacsimile);
  document.getElementById('addFacsimile').addEventListener('click', cmd.addFacsimile);
  // add note
  document.getElementById('addNote').addEventListener('click', cmd.addNote);
  document.getElementById('convertNoteToRest').addEventListener('click', cmd.convertNoteToRest);
  document.getElementById('toggleChord').addEventListener('click', cmd.convertToChord);
  // insert accidentals
  document.getElementById('addDoubleSharp').addEventListener('click', cmd.addDoubleSharp);
  document.getElementById('addSharp').addEventListener('click', cmd.addSharp);
  document.getElementById('addNatural').addEventListener('click', cmd.addNatural);
  document.getElementById('addFlat').addEventListener('click', cmd.addFlat);
  document.getElementById('addDoubleFlat').addEventListener('click', cmd.addDoubleFlat);
  // insert control elements
  document.getElementById('addTempo').addEventListener('click', cmd.addTempo);
  document.getElementById('addDirective').addEventListener('click', cmd.addDirective);
  document.getElementById('addDynamics').addEventListener('click', cmd.addDynamics);
  document.getElementById('addSlur').addEventListener('click', cmd.addSlur);
  document.getElementById('addTie').addEventListener('click', cmd.addTie);
  document.getElementById('addCresHairpin').addEventListener('click', cmd.addCresHairpin);
  document.getElementById('addDimHairpin').addEventListener('click', cmd.addDimHairpin);
  document.getElementById('addBeam').addEventListener('click', cmd.addBeam);
  document.getElementById('addBeamSpan').addEventListener('click', cmd.addBeamSpan);
  document.getElementById('addArpeggio').addEventListener('click', cmd.addArpeggio);
  // more control elements
  document.getElementById('addFermata').addEventListener('click', cmd.addFermata);
  document.getElementById('addGlissando').addEventListener('click', cmd.addGlissando);
  document.getElementById('addPedalDown').addEventListener('click', cmd.addPedalDown);
  document.getElementById('addPedalUp').addEventListener('click', cmd.addPedalUp);
  document.getElementById('addTrill').addEventListener('click', cmd.addTrill);
  document.getElementById('addTurn').addEventListener('click', cmd.addTurn);
  document.getElementById('addTurnLower').addEventListener('click', cmd.addTurnLower);
  document.getElementById('addMordent').addEventListener('click', cmd.addMordent);
  document.getElementById('addMordentUpper').addEventListener('click', cmd.addMordentUpper);
  document.getElementById('addOctave8Above').addEventListener('click', cmd.addOctave8Above);
  document.getElementById('addOctave15Above').addEventListener('click', cmd.addOctave15Above);
  document.getElementById('addOctave8Below').addEventListener('click', cmd.addOctave8Below);
  document.getElementById('addOctave15Below').addEventListener('click', cmd.addOctave15Below);
  // add clef change
  document.getElementById('addGClefChangeBefore').addEventListener('click', cmd.addGClefChangeBefore);
  document.getElementById('addCClefChangeBefore').addEventListener('click', cmd.addCClefChangeBefore);
  document.getElementById('addFClefChangeBefore').addEventListener('click', cmd.addFClefChangeBefore);
  document.getElementById('addGClefChangeAfter').addEventListener('click', cmd.addGClefChangeAfter);
  document.getElementById('addCClefChangeAfter').addEventListener('click', cmd.addCClefChangeAfter);
  document.getElementById('addFClefChangeAfter').addEventListener('click', cmd.addFClefChangeAfter);
  // toggle articulation
  document.getElementById('toggleStacc').addEventListener('click', cmd.toggleStacc);
  document.getElementById('toggleAccent').addEventListener('click', cmd.toggleAccent);
  document.getElementById('toggleTenuto').addEventListener('click', cmd.toggleTenuto);
  document.getElementById('toggleMarcato').addEventListener('click', cmd.toggleMarcato);
  document.getElementById('toggleStacciss').addEventListener('click', cmd.toggleStacciss);
  document.getElementById('toggleSpicc').addEventListener('click', cmd.toggleSpicc);

  // show splash screen
  document.getElementById('aboutMeiFriend').addEventListener('click', () => showSplashScreen());
  document.getElementById('splashOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'splashOverlay') {
      document.getElementById('splashOverlay').style.display = 'none'; // dismiss splash when user clicks on black background
    }
  });

  // consult guidelines
  document.getElementById('consultGuidelinesForElement').addEventListener('click', cmd.consultGuidelines);

  // reset application
  document.getElementById('resetDefault').addEventListener('click', cmd.resetDefault);

  cm.on('beforeChange', () => e.updateMatch(cm));

  // editor activity
  cm.on('cursorActivity', () => {
    tagEncloserNode?.parentElement?.removeChild(tagEncloserNode);
    v.cursorActivity(cm);
  });

  // editor reports changes
  cm.on('changes', (cm, changeObj) => {
    if (!cm.blockChanges) {
      e.updateMatchingTagName(cm, changeObj);
      handleEditorChanges();
      //checkEditorChanges();
    }
  }); // cm.on() change listener

  // flip button updates manually notation location to cursor pos in encoding
  document.getElementById('flipButton').addEventListener('click', () => {
    v.cursorActivity(cm, true);
  });

  // when activated, update notation location once
  let fl = document.getElementById('flipCheckbox');
  fl.addEventListener('change', () => {
    if (fl.checked) v.cursorActivity(cm, true);
  });

  // forkAndOpen cancel button
  const forkAndOpenCancelButton = document.getElementById('forkAndOpenCancel');
  if (forkAndOpenCancelButton) {
    forkAndOpenCancelButton.addEventListener('click', forkRepositoryCancel);
  }

  // Editor font size zooming
  document.getElementById('encoding').addEventListener('wheel', (ev) => {
    if (isCtrlOrCmd(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      v.changeEditorFontSize(Math.sign(ev.deltaY) * -5);
    }
  });
  document.getElementById('encoding').addEventListener('keydown', (ev) => {
    if (isCtrlOrCmd(ev)) {
      if (ev.key === '-') {
        ev.preventDefault();
        ev.stopPropagation();
        v.changeEditorFontSize(-5);
      }
      if (ev.key === '+') {
        ev.preventDefault();
        ev.stopPropagation();
        v.changeEditorFontSize(+5);
      }
      if (ev.key === '0') {
        ev.preventDefault();
        ev.stopPropagation();
        v.changeEditorFontSize(100);
      }
    }
  });

  // manually update notation rendering from encoding
  document.getElementById('codeManualUpdateButton').addEventListener('click', () => {
    v.notationUpdated(cm, true);
  });

  // when activated, update notation once
  let ch = document.getElementById('liveUpdateCheckbox');
  ch.addEventListener('change', () => {
    if (ch.checked) v.notationUpdated(cm, true);
  });

  // speed mode checkbox
  document.getElementById('speedCheckbox').addEventListener('change', (ev) => {
    v.speedMode = ev.target.checked;
    if (storage && storage.supported) storage.speed = v.speedMode;
    handleSmartBreaksOption(v.speedMode);
    if (v.speedMode && Object.keys(v.pageBreaks).length > 0) v.pageCount = Object.keys(v.pageBreaks).length;
    // else
    //   v.pageBreaks = {};
    let sm = document.getElementById('toggleSpeedMode');
    if (sm) sm.checked = v.speedMode;
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      startMidiTimeout(true);
      document.getElementById('midiSpeedmodeIndicator').style.display = v.speedMode ? 'inline' : 'none';
    }
    v.updateAll(cm, {}, v.selectedElements[0]);
  });

  document.getElementById('solidLoadingIndicator').addEventListener('click', () => {
    // cancel Solid login procedure
    document.getElementById('solidOverlay').classList.remove('active');
    storage.removeItem('restoreSolidSession');
    if (restoreSolidTimeout) {
      clearTimeout(restoreSolidTimeout);
    }
  });

  addDragSelector(v, vp);

  addZoneDrawer();

  // MIDI control bar expansion selector change listener
  document.getElementById('controlbar-midi-expansion-selector').addEventListener('change', (ev) => {
    v.expansionId = ev.target.value;
    document.getElementById('selectMidiExpansion').value = v.expansionId;
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      startMidiTimeout(true);
    }
    console.log('Main EEEEExpansion selector set to: ' + v.expansionId);
  });
} // addEventListeners()

// progress bar demo
function moveProgressBar() {
  var elem = document.getElementById('progressBar');
  var width = 0; // % progress
  var id = setInterval(frame, 10);

  function frame() {
    width < 100 ? (elem.style.width = ++width + '%') : clearInterval(id);
  }
}

// control progress bar progress/width (in percent)
function setProgressBar(percentage) {
  document.getElementById('progressBar').style.width = percentage + '%';
}

export function updateStatusBar() {
  if (!v) return;
  document.getElementById('statusBar').innerHTML =
    meiFileName.substring(meiFileName.lastIndexOf('/') + 1) +
    ', ' +
    translator.lang.middleFooterPage.text +
    ' ' +
    v.currentPage +
    ' ' +
    translator.lang.middleFooterOf.text +
    ' ' +
    (v.pageCount < 0 ? '?' : v.pageCount) +
    ' ' +
    translator.lang.middleFooterLoaded.text +
    '.';
}

function updateHtmlTitle() {
  document.querySelector('head > title').innerHTML =
    'mei-friend: ' + meiFileName.substring(meiFileName.lastIndexOf('/') + 1);
}

function drawLeftFooter() {
  let lf = document.getElementById('leftFooter');
  lf.innerHTML = translator.lang.leftFooter.html;
}

export function drawRightFooter() {
  // translate month in version date
  let translatedVersionDate = translator.translateDate(versionDate);
  let rf = document.querySelector('.rightfoot');
  const versionHtml =
    "<a href='https://github.com/mei-friend/mei-friend' target='_blank'>mei-friend " +
    (env === environments.production ? version : `${env}-${version}`) +
    '</a> (' +
    translatedVersionDate +
    ').&nbsp;';
  rf.innerHTML = versionHtml;
  // also update version string in splash screen
  document.getElementById('splashVersionNumber').innerHTML = versionHtml;
  if (tkVersion) {
    let githubUrl = 'https://github.com/rism-digital/verovio/releases/tag/version-' + tkVersion.split('-')[0];
    if (tkVersion.includes('dev')) {
      // current develop version, no release yet...
      githubUrl = 'https://github.com/rism-digital/verovio/tree/develop';
    }
    rf.innerHTML += `&nbsp;<a href="${githubUrl}" target="_blank" title="${tkUrl}">Verovio ${tkVersion}</a>.`;
  }
}

export function setStandoffAnnotationEnabledStatus() {
  // Annotations: can only write standoff if a) not working locally (need URI) and b) isMEI (need stable identifiers)
  if (fileLocationType === 'file' || !isMEI || !solid.getDefaultSession().info.isLoggedIn) {
    document.getElementById('writeAnnotationStandoff').setAttribute('disabled', '');
    document.getElementById('writeAnnotationStandoffLabel').classList.add('disabled');
    document.getElementById('writeAnnotationInline').checked = true;
  } else {
    document.getElementById('writeAnnotationStandoff').removeAttribute('disabled');
    document.getElementById('writeAnnotationStandoffLabel').classList.remove('disabled');
  }
}

// handles any changes in CodeMirror
export async function handleEditorChanges() {
  v.notationUpdated(cm);
  // fileChanged flag may have been set from storage
  let changeIndicator = true;
  let meiXml = cm.getValue();
  if (isLoggedIn && gm.filepath) {
    // if it's a git file, write to git
    console.log('Writing to git...');
    let status = await gm.writeAndReturnStatus(meiXml);
    console.log('Written to git, status ', status);
    changeIndicator = status !== 'unmodified';
    console.log('File changed state based on git modification status: ' + status);
    setCommitUIEnabledStatus();
    setFileChangedState(await gm.fileChanged(gm.filepath, status));
  }
  if (freshlyLoaded) {
    // ignore changes resulting from fresh file load
    freshlyLoaded = false;
  } else {
    setFileChangedState(changeIndicator);
  }
  if (storage.supported) {
    // on every set of changes, save editor content
    updateLocalStorage(meiXml);
  }
  if (document.getElementById('showAnnotations').checked || document.getElementById('showAnnotationPanel').checked) {
    readListItemsFromXML(true); // readAnnots(); from annotation.js
  }
  if (document.getElementById('showMidiPlaybackControlBar').checked) {
    // start a new time-out to midi-rerender
    startMidiTimeout(true);
  }
} // handleEditorChanges()

export function log(s, code = null) {
  s += '<div>';
  if (code) {
    s += ' ' + translator.lang.errorCode.text + ': ' + code + '<br/>';
    s += `<a id="bugReport" target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?assignees=&labels=&template=bug_report.md&title=Error ${code}">${translator.lang.submitBugReport.text}</a>`;
    v.showAlert(s, 'error', 30000);
  } else {
    s += `<a id="bugReport" target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?assignees=&labels=&template=bug_report.md">${translator.lang.submitBugReport.text}</a>`;
    v.showAlert(s, 'warning', 30000);
  }
  s += '</div>';
  document.getElementById('statusBar').innerHTML = s;
  document.getElementById('verovio-panel').innerHTML = s;
  console.log(s);
}

function fillInSampleEncodings() {
  fetch(sampleEncodingsCSV, {
    headers: {
      'content-type': 'text/csv',
    },
  })
    .then((response) => response.text())
    .then((csv) => {
      const lines = csv.split('\n');
      lines.forEach((l) => {
        if (l) {
          const tuple = l.trim().split('|');
          sampleEncodings.push([
            tuple[samp.URL],
            tuple[samp.ORG],
            tuple[samp.REPO],
            tuple[samp.FILE],
            tuple[samp.TITLE],
            tuple[samp.COMPOSER],
          ]);
        }
      });
    });
}

/**
 * Sets keymap JSON information to target element and defines listeners.
 * It loads all bindings in `#notation` to document.body, and the platform-specific
 * to both notation and editor panels (i.e. friendContainer).
 */
function setKeyMap() {
  if (platform.startsWith('mac')) {
    document.body.classList.add('platform-darwin-all');
    document.getElementById('notation').classList.add('platform-darwin-notation');
  }
  if (platform.startsWith('win')) {
    document.body.classList.add('platform-win32-all');
    document.getElementById('notation').classList.add('platform-win32-notation');
  }
  if (platform.startsWith('linux')) {
    document.body.classList.add('platform-linux-all');
    document.getElementById('notation').classList.add('platform-linux-notation');
  }

  // iterate all keys (element) in keymap.json
  for (const [key, value] of Object.entries(keymap)) {
    document.querySelectorAll(key).forEach((el) => {
      el.setAttribute('tabindex', '-1');
      el.addEventListener('keydown', (ev) => {
        // filter out keypresses at certain elements, i.e. that contain preventKeyBindings class
        if (
          document.activeElement.classList.contains('preventKeyBindings') ||
          document.activeElement.closest('#encoding')
        ) {
          console.log('Ignoring keypress in ' + document.activeElement.id);
          return;
        }

        // at each keystroke: update cmd2key (CTRL on Mac, ALT on WIN/Linux)
        v.cmd2KeyPressed = platform.startsWith('mac') ? ev.ctrlKey : ev.altKey;

        // construct keyPress and keyName from event
        let keyName = ev.key;
        if (ev.code.toLowerCase() === 'space') keyName = 'space';
        // arrowdown -> down
        keyName = keyName.toLowerCase().replace('arrow', '');
        let keyPress = '';
        if (ev.ctrlKey) keyPress += 'ctrl-';
        if (ev.metaKey) keyPress += 'cmd-';
        if (ev.shiftKey) keyPress += 'shift-';
        if (ev.altKey) keyPress += 'alt-';
        keyPress += keyName;
        console.info('keyPressString: "' + keyPress + '"');

        // find method for keyPress and execute it, if existing
        let methodName = value[keyPress];
        if (methodName !== undefined) {
          ev.stopPropagation();
          ev.preventDefault();
          console.log('keyMap method ' + methodName + '.', cmd[methodName]);
          cmd[methodName](); // execute the function
        }
      });
    });
  }
} // setKeyMap()

// returns true, if event is a CMD (Mac) or a CTRL (Windows, Linux) event
export function isCtrlOrCmd(ev) {
  return ev ? (platform.startsWith('mac') && ev.metaKey) || (!platform.startsWith('mac') && ev.ctrlKey) : false;
} // isCtrlOrCmd()

/**
 * Convert binary data to blob containing MIDI data an array of int8 byte numbers
 * @param {BinaryData} data
 * @returns {Blob}
 */
function midiDataToBlob(data) {
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], {
    type: 'audio/midi',
  });
} // midiDataToBlob()

/**
 * Returns a long URL with all parameters
 * file, scale, breaks, select (multiples), page, speed, autoValidate,
 * notationOrientation, notationProportion, facsimileOrientation, facsimileProportion
 */
export function generateUrl() {
  const amp = '&';
  let url = document.URL;
  // remove some characters from end of href
  while (['/', '#'].includes(url[url.length - 1])) url = url.slice(0, -1);
  url += '/?';

  // generate file parameter
  if (fileLocationType === 'url') {
    url += 'file=' + meiFileLocation;
  } else if (fileLocationType === 'github') {
    url += 'file=' + 'https://raw.githubusercontent.com/' + gm.repo + '/' + gm.branch + gm.filepath;
  }
  // generate other parameters
  url += amp + 'scale=' + v.vrvOptions.scale;
  url += amp + 'breaks=' + document.getElementById('breaksSelect').value;
  if (v.selectedElements.length > 0) {
    url += amp + 'select=' + v.selectedElements.join(',');
  }
  url += amp + 'page=' + v.currentPage;
  url += amp + 'speed=' + v.speedMode;

  // TODO: document.getElementById('autoValidate').checked

  url += amp + 'notationOrientation=' + getOrientation();
  url += amp + 'notationProportion=' + parseFloat(getNotationProportion()).toFixed(2);

  if (document.getElementById('showFacsimilePanel').checked) {
    url += amp + 'facsimileOrientation=' + getFacsimileOrientation();
    url += amp + 'facsimileProportion=' + parseFloat(getFacsimileProportion()).toFixed(2);
  }

  return url;
} // generateUrl()

/**
 * URI actions around a call to generateUrl(): Show alert modal displaying generated URL,
 * (attempt to) copy it to clipboard
 */
function generateUrlUI() {
  let msg = '';
  const url = generateUrl();
  if (fileLocationType === 'file') {
    msg = translator.lang.generateUrlError.text + meiFileName;
    v.showAlert(msg, 'warning');
    console.log(msg);
    return '';
  }

  // show as alert
  let html = '<a href="' + url + '" target="_blank">' + url + '</a>';
  html = html.replace(/&/g, '&amp;');
  v.showAlert(msg + html, 'info', -1);

  // and copy url text to clipboard
  navigator.clipboard.writeText(url).then(
    function () {
      let m = translator.lang.generateUrlSuccess.text; // success message
      v.updateAlert('<b>' + m + '!</b>');
      console.log(m + ': ' + url);
    },
    function (err) {
      let m = translator.lang.generateUrlNotCopied;
      console.error(m, err);
      v.updateAlert('<b>' + m + '</b>');
    }
  );
} // generateUrlUI()
