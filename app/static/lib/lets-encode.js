/**
 * lets-encode.js
 *
 * "Let's Encode!" campaign mode (https://lets-encode.mdw.ac.at).
 *
 * Volunteers are sent here from a Let's Encode campaign to encode one task and
 * are returned to the campaign with the outcome. Let's Encode owns the
 * repository, the fork, and the per-task branch: by the time the volunteer
 * arrives the branch exists and they are able to push to it. mei-friend's job
 * is only to log them in to the right repository, branch, and file, let them
 * work as usual, and report back.
 *
 * The hand-off carries ?le_campaignname, ?le_taskid, and the usual ?file (a raw
 * githubusercontent URL). The return trip is a navigation to
 * <base>/<campaign>?task=<task>&mf_status=complete|failed[&mf_msg=...].
 */

import { cm, storage, translator, version } from './main.js';
import { checkAndClone } from './github-menu.js';
import { parseRawGithubUrl } from './fork-repository.js';

// n.b. the git manager is passed in rather than imported, matching
// forkAndOpen(gm, url) next door: main.js assigns `gm` only once the user is
// logged in, so the caller is better placed to say which instance to use.
// Reporting an ARRIVAL failure is likewise left to main.js: `v` is assigned
// late, in completeInitialLoad(), so it is not available that early. Everything
// this module asks the volunteer is asked through its own overlay, so the
// viewer is not needed here at all.

const defaultLetsEncodeBaseUrl = 'https://lets-encode.mdw.ac.at';

// Commit attempts before we hand the decision back to the volunteer. Only
// transient failures are retried; a conflict or a rejected push is final.
const maxCommitAttempts = 3;
const commitRetryBackoffMs = [1000, 3000];

// How long the success message stays up before we navigate back to the
// campaign. Without a pause the redirect is queued before the browser paints,
// so the volunteer sees an indeterminate flash rather than a confirmation.
const successDwellMs = 2500;

// The task this session was handed, or null when not in Let's Encode mode.
let letsEncodeTask = null;

/**
 * letsEncodeBaseUrl
 * @description Where volunteers are returned to. Deployments that talk to a
 * staging campaign server override it in env.js (per-installation, untracked),
 * the same file that already carries the environment name.
 * @returns {string}
 */
function letsEncodeBaseUrl() {
  if (typeof window.letsEncodeBaseUrl === 'string' && window.letsEncodeBaseUrl) {
    return window.letsEncodeBaseUrl.replace(/\/+$/, '');
  }
  return defaultLetsEncodeBaseUrl;
} // letsEncodeBaseUrl()

/**
 * isLetsEncodeMode
 * @description Is this session a Let's Encode task hand-off?
 * @returns {boolean}
 */
export function isLetsEncodeMode() {
  return letsEncodeTask !== null;
} // isLetsEncodeMode()

/**
 * setLetsEncodeTask
 * @description Remember the task, in memory and across the GitHub OAuth
 * round-trip. The login redirect discards the query string, so the hand-off
 * only survives if we persist it first.
 * @param {object} task { campaign, task, file }
 */
function setLetsEncodeTask(task) {
  letsEncodeTask = task;
  if (storage.supported) {
    storage.letsEncode = task;
  }
} // setLetsEncodeTask()

// Everything describing the task itself, as opposed to the person's
// preferences. Cleared when we hand the volunteer back to the campaign, so that
// being given a second task in the same tab does not drop them into the
// finished one's encoding. Closing the tab discards the whole scope anyway;
// this covers the volunteer who carries straight on.
const taskScopedKeys = [
  'letsEncode',
  'meiXml',
  'meiFileName',
  'meiFileLocation',
  'fileLocationType',
  'isMEI',
  'fileChanged',
  'github',
  'select',
];

/**
 * clearLetsEncodeTask
 * @description Forget the task and everything that belonged to it, so a later
 * visit is neither mistaken for a campaign hand-off nor left holding the
 * finished work.
 */
export function clearLetsEncodeTask() {
  letsEncodeTask = null;
  if (storage.supported) {
    taskScopedKeys.forEach((key) => storage.removeItem(key));
  }
} // clearLetsEncodeTask()

/**
 * initLetsEncodeMode
 * @description Read the Let's Encode parameters, or restore them if we have
 * just come back from the GitHub login. Reports failure and returns false if
 * the hand-off is incomplete.
 * @param {URLSearchParams} searchParams
 * @param {string|null} urlFileName the ?file parameter, if any
 * @returns {{active: boolean, error: string|null}} active when a complete
 * hand-off is in progress; error is 'noCampaign' when the caller must report
 * the failure itself, there being no campaign to return it to
 */
export function initLetsEncodeMode(searchParams, urlFileName) {
  const campaign = searchParams.get('le_campaignname');
  const task = searchParams.get('le_taskid');

  if (!campaign && !task) {
    // No hand-off in this URL. The ONLY reason to resurrect one from storage is
    // that we sent the volunteer to GitHub ourselves and the login redirect
    // dropped the query string; `pendingLogin` marks exactly that, and is spent
    // on use. Without it, a deliberate visit to a bare mei-friend URL is a
    // deliberate visit to mei-friend — it must not drag the volunteer back into
    // a task, nor keep their ordinary local storage hidden behind a tab scope.
    // The remembered task is read from sessionStorage directly, since the
    // storage object has not been switched to that scope yet.
    const remembered = readRememberedTask();
    if (remembered && remembered.pendingLogin) {
      storage.useTabScopedStorage();
      delete remembered.pendingLogin;
      letsEncodeTask = remembered;
      if (storage.supported) storage.letsEncode = letsEncodeTask;
      restoreLetsEncodeUrl();
      return { active: true, error: null };
    }
    return { active: false, error: null };
  }

  // Either parameter puts us in Let's Encode mode; all three are then required.
  if (!campaign) {
    // Without the campaign name there is no address to report back to, so the
    // failure has to be shown here rather than returned.
    console.warn("Let's Encode mode requested without le_campaignname; cannot report back");
    return { active: false, error: 'noCampaign' };
  }
  if (!task || !urlFileName) {
    const missing = !task ? 'le_taskid' : 'file';
    console.warn("Let's Encode hand-off incomplete, missing: " + missing);
    letsEncodeTask = { campaign: campaign, task: task || '', file: urlFileName || '' };
    returnToLetsEncode('failed', translator.lang.letsEncodeMissingParameterError.text + ' ' + missing);
    return { active: false, error: null };
  }

  // Scope the session to this tab BEFORE anything is written, so the task never
  // touches the encoding, file location, or GitHub binding the person may have
  // open in ordinary mei-friend use.
  storage.useTabScopedStorage();
  // startedAt gives autosave a baseline before the first save of the session
  setLetsEncodeTask({ campaign: campaign, task: task, file: urlFileName, startedAt: Date.now() });
  console.log("Let's Encode mode:", letsEncodeTask);
  return { active: true, error: null };
} // initLetsEncodeMode()

/**
 * restoreLetsEncodeUrl
 * @description Put the hand-off parameters back in the address bar after the
 * GitHub login has stripped them. This makes the URL the source of truth again:
 * reloading the page keeps the volunteer in their task, while visiting a bare
 * mei-friend URL leaves it — which is what someone typing one expects.
 */
function restoreLetsEncodeUrl() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('file', letsEncodeTask.file);
    url.searchParams.set('le_campaignname', letsEncodeTask.campaign);
    url.searchParams.set('le_taskid', letsEncodeTask.task);
    window.history.replaceState(null, '', url.toString());
  } catch (e) {
    console.warn("Let's Encode: could not restore the task parameters to the URL ", e);
  }
} // restoreLetsEncodeUrl()

/**
 * readRememberedTask
 * @description The task stashed before the GitHub login, read straight out of
 * sessionStorage so it can be found before the storage scope is switched.
 * @returns {object|null} the task, or null if there is no usable one
 */
function readRememberedTask() {
  try {
    const raw = window.sessionStorage.getItem('letsEncode');
    const remembered = raw ? JSON.parse(raw) : null;
    if (remembered && remembered.campaign && remembered.task && remembered.file) {
      return remembered;
    }
  } catch (e) {
    console.warn("Could not read the remembered Let's Encode task: ", e);
  }
  return null;
} // readRememberedTask()

/**
 * letsEncodeCampaignUrl
 * @description The task's page on the campaign, carrying no outcome. Used for
 * links that are a visit rather than a hand-back.
 * @returns {URL}
 */
function letsEncodeCampaignUrl() {
  const url = new URL(letsEncodeBaseUrl() + '/' + encodeURIComponent(letsEncodeTask.campaign));
  url.searchParams.set('task', letsEncodeTask.task);
  return url;
} // letsEncodeCampaignUrl()

/**
 * letsEncodeCallbackUrl
 * @description Build the Let's Encode return URL for an outcome.
 * @param {string} status 'complete' or 'failed'
 * @param {string} [msg] optional explanation, shown by the campaign
 * @returns {string}
 */
export function letsEncodeCallbackUrl(status, msg = '') {
  const url = letsEncodeCampaignUrl();
  url.searchParams.set('mf_status', status);
  if (msg) {
    url.searchParams.set('mf_msg', msg);
  }
  return url.toString();
} // letsEncodeCallbackUrl()

/**
 * noteLetsEncodeInitiatedLogin
 * @description Record that mei-friend, not the volunteer, started the GitHub
 * login. Abandoning a task logs them out again only in that case — if they were
 * already signed in for their own work, ending that session would be rude, and
 * mei-friend's logout revokes the token for every tab, not just this one.
 * Persisted with the task, so it survives the OAuth round trip that sets it.
 */
export function noteLetsEncodeInitiatedLogin() {
  if (!letsEncodeTask) return;
  letsEncodeTask.initiatedLogin = true;
  // spent when we come back, so only this one round trip can revive the task
  letsEncodeTask.pendingLogin = true;
  if (storage.supported) {
    storage.letsEncode = letsEncodeTask;
  }
} // noteLetsEncodeInitiatedLogin()

/**
 * letsEncodeCommitMessage
 * @description The commit a completed task leaves behind. Fixed rather than
 * authored by the volunteer: it stays parsable for the campaign, and the
 * version is stamped so a commit from a development or staging instance is
 * recognisable as such.
 * @returns {string}
 */
function letsEncodeCommitMessage(kind = 'completed') {
  let versionString = version;
  if (typeof environments !== 'undefined' && env !== environments.production) {
    versionString = `${env}-${version}`;
  }
  // deliberately untranslated: the campaign reads these
  return `Let's Encode: ${letsEncodeTask.campaign} task ${letsEncodeTask.task} ${kind} using mei-friend ${versionString}`;
} // letsEncodeCommitMessage()

// One commit at a time: an autosave must never overlap a save the volunteer
// asked for, nor a completion.
let letsEncodeCommitInFlight = false;
let letsEncodeAutosaveTimer = null;
let letsEncodeClockTimer = null;

/**
 * letsEncodeAutosaveMinutes
 * @description The configured autosave interval, 0 meaning off. Settings live
 * in raw localStorage under the 'mf-' prefix, written by the settings panel.
 * @returns {number} minutes
 */
function letsEncodeAutosaveMinutes() {
  const stored = window.localStorage['mf-letsEncodeAutosaveMinutes'];
  const minutes = stored === undefined ? 3 : parseInt(stored, 10);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
} // letsEncodeAutosaveMinutes()

/**
 * saveLetsEncodeTask
 * @description Commit the work so far and stay where we are. The campaign sees
 * a 'saved' commit rather than a 'completed' one, so progress is banked without
 * the task being handed back.
 * @param {Function} commit an async commit taking a message
 * @param {boolean} [quiet] true for autosaves, which must not interrupt editing
 */
export async function saveLetsEncodeTask(commit, quiet = false) {
  if (letsEncodeCommitInFlight) return;
  letsEncodeCommitInFlight = true;
  if (!quiet) {
    showLetsEncodeOverlay({ message: translator.lang.letsEncodeSaving.text, state: 'busy' });
  }
  let result;
  try {
    result = await commit(letsEncodeCommitMessage(quiet ? 'autosaved' : 'saved'));
  } finally {
    letsEncodeCommitInFlight = false;
  }
  if (result && result.ok) {
    noteLetsEncodeSaved(quiet);
    if (!quiet) hideLetsEncodeOverlay();
    return;
  }
  console.warn("Let's Encode: save failed", result);
  if (quiet) return; // an autosave that fails tries again at the next tick
  showLetsEncodeOverlay({
    message: translator.lang.letsEncodeSaveFailed.text + (result && result.message ? ' ' + result.message : ''),
    state: 'confirm',
    layout: 'inline',
    buttons: [
      { label: translator.lang.letsEncodeDismiss.value, action: () => hideLetsEncodeOverlay() },
      { label: translator.lang.letsEncodeRetryButton.value, action: () => saveLetsEncodeTask(commit) },
    ],
  });
} // saveLetsEncodeTask()

/**
 * noteLetsEncodeSaved
 * @description Remember when the work was last banked, and say so.
 */
function noteLetsEncodeSaved(automatic = false) {
  if (!letsEncodeTask) return;
  letsEncodeTask.lastSaved = Date.now();
  letsEncodeTask.lastSaveWasAutomatic = automatic;
  if (storage.supported) {
    storage.letsEncode = letsEncodeTask;
  }
  renderLastSaveIndicator();
} // noteLetsEncodeSaved()

/**
 * letsEncodeRelativeTime
 * @description "5 minutes ago" in the reader's language, falling back to
 * minutes if the browser has no Intl.RelativeTimeFormat.
 * @param {number} timestamp epoch milliseconds
 * @returns {string}
 */
function letsEncodeRelativeTime(timestamp) {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  try {
    // mei-friend's own language, not the browser's: someone running the English
    // interface on a German browser should not be told "in dieser Minute"
    const rtf = new Intl.RelativeTimeFormat(translator.langCode || undefined, { numeric: 'auto' });
    if (minutes < 60) return rtf.format(-minutes, 'minute');
    const hours = Math.round(minutes / 60);
    if (hours < 24) return rtf.format(-hours, 'hour');
    return rtf.format(-Math.round(hours / 24), 'day');
  } catch (e) {
    return minutes + ' min';
  }
} // letsEncodeRelativeTime()

/**
 * renderLastSaveIndicator
 * @description The "Last save: …" line under the Save entry, with the exact
 * moment on hover.
 */
export function renderLastSaveIndicator() {
  const el = document.getElementById('letsEncodeLastSave');
  if (!el) return;
  const savedAt = letsEncodeTask && letsEncodeTask.lastSaved;
  if (!savedAt) {
    // say nothing rather than claim "not saved yet": on arrival there is nothing
    // unsaved anyway, and earlier saves may exist that we have not established
    el.innerText = '';
    el.removeAttribute('title');
    return;
  }
  // says which kind of save it was, so an autosave is not mistaken for the
  // volunteer's own last deliberate save
  const label = letsEncodeTask.lastSaveWasAutomatic
    ? translator.lang.letsEncodeLastAutosave.text
    : translator.lang.letsEncodeLastSave.text;
  el.innerText = label + ' ' + letsEncodeRelativeTime(savedAt);
  el.title = translator.lang.letsEncodeSavedAt.text + ' ' + new Date(savedAt).toLocaleString();
} // renderLastSaveIndicator()

/**
 * startLetsEncodeTimers
 * @description Keep the "last save" line honest as time passes, and run the
 * autosave. Autosave commits only when there is something to commit and when
 * the configured interval has elapsed since the last save, so an idle volunteer
 * produces no commits at all.
 * @param {object} gm GitManager instance
 * @param {Function} commit an async commit taking a message
 */
export function startLetsEncodeTimers(gm, commit) {
  if (letsEncodeClockTimer) clearInterval(letsEncodeClockTimer);
  letsEncodeClockTimer = setInterval(() => {
    renderLastSaveIndicator();
    renderLetsEncodeExpiry();
  }, 60000);
  if (letsEncodeAutosaveTimer) clearInterval(letsEncodeAutosaveTimer);
  letsEncodeAutosaveTimer = setInterval(async () => {
    const minutes = letsEncodeAutosaveMinutes();
    if (!minutes || letsEncodeCommitInFlight || !letsEncodeTask) return;
    const since = Date.now() - (letsEncodeTask.lastSaved || letsEncodeTask.startedAt || 0);
    if (since < minutes * 60000) return;
    let changed = false;
    try {
      changed = await gm.fileChanged();
    } catch (e) {
      console.warn("Let's Encode: autosave could not check for changes ", e);
      return;
    }
    if (!changed) return; // nothing edited since the last commit
    console.log("Let's Encode: autosaving");
    await saveLetsEncodeTask(commit, true);
  }, 30000);
} // startLetsEncodeTimers()

/**
 * renderLetsEncodeMenu
 * @description Replace the GitHub menu's contents with the task menu. In Let's
 * Encode mode the volunteer is bound to one file on one branch, so the GitHub
 * menu's repository, branch and file navigation is not merely surplus: using it
 * would leave "Complete task" armed over a different encoding. They need two
 * actions, and the account name stays visible on the button so they can see who
 * is about to commit.
 * @param {object} gm GitManager instance
 * @param {Function} commit the commit routine, taking a message
 */
export function renderLetsEncodeMenu(gm, commit) {
  const menu = document.getElementById('GithubMenu');
  if (!menu || !letsEncodeTask) return;
  menu.classList.remove('loggedOut');
  // two items, not a repository browser: drops the 90% min-height that keeps the
  // GitHub menu tall enough for its lists
  menu.classList.add('letsEncodeTaskMenu');
  menu.textContent = '';

  const save = document.createElement('a');
  save.id = 'letsEncodeSaveTask';
  save.classList.add('closeOnClick');
  save.href = '#';
  save.textContent = translator.lang.letsEncodeSaveButton.value;
  save.addEventListener('click', () => saveLetsEncodeTask(commit));
  menu.appendChild(save);

  const lastSave = document.createElement('span');
  lastSave.id = 'letsEncodeLastSave';
  menu.appendChild(lastSave);

  menu.appendChild(document.createElement('hr')).classList.add('dropdownLine');

  const complete = document.createElement('a');
  complete.id = 'letsEncodeCompleteTask';
  complete.classList.add('closeOnClick');
  complete.href = '#';
  complete.textContent = translator.lang.letsEncodeCompleteTaskButton.value;
  complete.addEventListener('click', () => completeLetsEncodeTask(commit, gm));
  menu.appendChild(complete);

  menu.appendChild(document.createElement('hr')).classList.add('dropdownLine');

  const abandon = document.createElement('a');
  abandon.id = 'letsEncodeAbandonTask';
  abandon.classList.add('closeOnClick');
  abandon.href = '#';
  abandon.textContent = translator.lang.letsEncodeAbandonTaskButton.value;
  abandon.addEventListener('click', () => confirmAbandonLetsEncodeTask());
  menu.appendChild(abandon);

  renderLastSaveIndicator();
  startLetsEncodeTimers(gm, commit);
} // renderLetsEncodeMenu()

// The GitHub account the volunteer is committing as, once we have asked for it.
let letsEncodeUser = '';

/**
 * setLetsEncodeUser
 * @description Remember who is committing, and show it. Called when the GitHub
 * author is resolved, which happens after the status line is first drawn.
 * @param {string} name
 */
export function setLetsEncodeUser(name) {
  letsEncodeUser = name || '';
  renderLetsEncodeStatus();
} // setLetsEncodeUser()

/**
 * renderLetsEncodeStatus
 * @description Put the campaign, the task and the account into the status line
 * where the file name normally sits. In Let's Encode mode the file's name,
 * location and changed state are all beside the point — there is one file, it
 * came from the campaign, and it is committed by completing the task — whereas
 * which task and which account are exactly what the volunteer needs to confirm.
 * The existing spans are reused rather than removed, so everything else that
 * writes to the status line still finds them.
 */
export function renderLetsEncodeStatus() {
  if (!letsEncodeTask) return;
  const container = document.getElementById('fileNameContainer');
  const location = document.getElementById('fileLocation');
  const name = document.getElementById('fileName');
  if (!container || !location || !name) return;
  location.innerText = letsEncodeTask.campaign;
  name.innerText = letsEncodeTask.task;
  name.removeAttribute('contenteditable'); // the task id is not ours to rename
  // the changed markers say nothing useful here: one file, committed by completing
  const changed = document.getElementById('fileChanged');
  const remoteChanged = document.getElementById('remoteFileChanged');
  if (changed) changed.innerText = '';
  if (remoteChanged) remoteChanged.innerHTML = '';
  let user = document.getElementById('letsEncodeStatusUser');
  if (!user) {
    user = document.createElement('span');
    user.id = 'letsEncodeStatusUser';
    container.appendChild(user);
  }
  // The GitHub mark moves here from the menu button, which is now about the task
  // rather than about GitHub. Take the reference before emptying the span, or
  // clearing it would destroy the element (it is also the activity spinner).
  const githubMark = document.getElementById('GithubLogo');
  user.textContent = '';
  if (letsEncodeUser) {
    const prefix = document.createElement('span');
    prefix.innerText = translator.lang.letsEncodeLoggedInAs.text + ' ';
    user.appendChild(prefix);
    if (githubMark) user.appendChild(githubMark);
    const name = document.createElement('span');
    name.id = 'letsEncodeStatusUserName';
    name.innerText = letsEncodeUser;
    user.appendChild(name);
  }
  container.title = [letsEncodeTask.campaign, letsEncodeTask.task, letsEncodeUser].filter(Boolean).join(' · ');
} // renderLetsEncodeStatus()

// When this volunteer's claim on the task runs out, or null if we cannot tell.
let letsEncodeExpiresAt = null;
// When they claimed it, used to bound the search for their earlier saves.
let letsEncodeClaimedAt = '';

/**
 * loadLetsEncodeExpiry
 * @description Read how long the volunteer has left from the campaign's lock
 * table. Read from their own clone rather than upstream: a volunteer's own row
 * is not changed by anyone else's activity, so the fork's copy is good for this
 * purpose, and it costs no API call. The remaining time is taken ONLY from an
 * `expires` column — it is not derived from `timestamp` plus the campaign's
 * `stale_after_minutes`, which is becoming per-campaign configurable. Until
 * that column exists, this shows nothing rather than guessing.
 * @param {object} gm GitManager instance, holding the clone
 */
export async function loadLetsEncodeExpiry(gm) {
  // cleared up front and rendered on every exit, so a reading that is no longer
  // available takes the indicator down with it rather than leaving a stale one
  letsEncodeExpiresAt = null;
  try {
    if (!letsEncodeTask) return;
    let csv;
    try {
      csv = await gm.readFile('tracking/lock.csv');
    } catch (e) {
      console.log("Let's Encode: no lock table in this repository, so no time remaining is shown");
      return;
    }
    if (typeof csv !== 'string') return;
    const lines = csv.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) return;
    const header = lines[0].split(',').map((cell) => cell.trim());
    const expiresIndex = header.indexOf('expires'); // may not exist yet
    const timestampIndex = header.indexOf('timestamp');
    const taskIndex = header.indexOf('task_id');
    if (taskIndex < 0) return;
    for (const line of lines.slice(1)) {
      const cells = line.split(',').map((cell) => cell.trim());
      if (cells[taskIndex] !== letsEncodeTask.task) continue;
      // when the task was claimed: bounds the search for earlier saves, since
      // the task branch inherits main's history and could otherwise turn an
      // older commit of theirs on the same file into a "save" of this task
      if (timestampIndex >= 0 && cells[timestampIndex]) {
        letsEncodeClaimedAt = cells[timestampIndex];
      }
      if (expiresIndex >= 0) {
        const parsed = Date.parse(cells[expiresIndex]);
        if (Number.isFinite(parsed)) letsEncodeExpiresAt = parsed;
      }
      break;
    }
  } finally {
    renderLetsEncodeExpiry();
  }
} // loadLetsEncodeExpiry()

/**
 * loadLetsEncodeLastSave
 * @description Recover when this volunteer last banked work on this task, so a
 * fresh tab does not look as though they had never saved. Read from the branch's
 * history rather than from commit messages: the message is a presentation string
 * that the campaign also reads, and matching on it would break the next time
 * anyone rewords it. What is structural instead: instigation's createBranch only
 * points a ref at an existing commit, so every commit added to `encode-<task>`
 * afterwards is the volunteer's own. Narrowed three ways — to commits touching
 * THIS task's file (which also excludes empty commits, whose tree is unchanged),
 * to commits authored by this account, and to commits after the claim was made
 * (the branch inherits main's history, which may contain their earlier work).
 * @param {object} gm GitManager instance
 */
export async function loadLetsEncodeLastSave(gm) {
  if (!letsEncodeTask || letsEncodeTask.lastSaved) return; // this session already knows
  try {
    const author = await gm.getAuthor();
    const login = author && (author.username || author.login);
    if (!login) return;
    const path = (gm.filepath || '').replace(/^\//, '');
    if (!path) return;
    const log = await gm.readLog(path, letsEncodeClaimedAt);
    if (!Array.isArray(log)) return;
    const mine = log.filter((c) => c && c.author && c.author.login === login);
    if (!mine.length) return;
    const dates = mine
      .map((c) => Date.parse(c.commit && c.commit.author && c.commit.author.date))
      .filter((d) => Number.isFinite(d));
    if (!dates.length) return;
    letsEncodeTask.lastSaved = Math.max(...dates);
    // which kind of save it was lives only in the message, which we do not read
    letsEncodeTask.lastSaveWasAutomatic = false;
    if (storage.supported) storage.letsEncode = letsEncodeTask;
    renderLastSaveIndicator();
  } catch (e) {
    console.warn("Let's Encode: could not read earlier saves from the branch ", e);
  }
} // loadLetsEncodeLastSave()

/**
 * renderLetsEncodeExpiry
 * @description Show the time left on the claim, after the account name. Absent
 * entirely when there is no expiry to show.
 */
export function renderLetsEncodeExpiry() {
  const container = document.getElementById('fileNameContainer');
  let el = document.getElementById('letsEncodeStatusExpiry');
  if (!letsEncodeExpiresAt || !container) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('span');
    el.id = 'letsEncodeStatusExpiry';
    container.appendChild(el);
  }
  const remaining = letsEncodeExpiresAt - Date.now();
  if (remaining <= 0) {
    el.innerText = translator.lang.letsEncodeTimeExpired.text;
    el.classList.add('letsEncodeExpired');
  } else {
    const totalMinutes = Math.floor(remaining / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const clock = (hours ? hours + ' hrs ' : '') + minutes + ' mins';
    el.innerText = clock + ' ' + translator.lang.letsEncodeTimeRemaining.text;
    el.classList.remove('letsEncodeExpired');
  }
  el.title = translator.lang.letsEncodeExpiresAt.text + ' ' + new Date(letsEncodeExpiresAt).toLocaleString();
} // renderLetsEncodeExpiry()

/**
 * confirmAbandonLetsEncodeTask
 * @description Abandoning throws work away and cannot be undone, so it asks
 * first — the two actions sit next to each other in one small menu.
 */
export function confirmAbandonLetsEncodeTask() {
  showLetsEncodeOverlay({
    message: translator.lang.letsEncodeAbandonPrompt.text,
    state: 'farewell',
    layout: 'inline',
    buttons: [
      { label: translator.lang.letsEncodeKeepWorking.value, action: () => hideLetsEncodeOverlay() },
      { label: translator.lang.letsEncodeAbandonConfirm.value, action: () => abandonLetsEncodeTask() },
    ],
  });
} // confirmAbandonLetsEncodeTask()

/**
 * abandonLetsEncodeTask
 * @description Give the task back unfinished: drop the session, sign out of
 * GitHub if we were the reason they signed in, and report `abandoned` — which
 * is deliberately neither `complete` nor `failed`, since the volunteer chose to
 * stop and nothing went wrong.
 */
export async function abandonLetsEncodeTask() {
  // built before the task is cleared, since the URL is made from it
  const url = letsEncodeCallbackUrl('abandoned');
  const initiatedLogin = Boolean(letsEncodeTask && letsEncodeTask.initiatedLogin);
  clearLetsEncodeTask();
  if (initiatedLogin) {
    try {
      // mei-friend's own logoutFromGithub() owns the navigation (it redirects
      // to /logout and back to the app), which would strand the volunteer here
      // instead of returning them; request the same endpoint for its effect —
      // it revokes the GitHub token and clears the session — and navigate below.
      await fetch('/logout', { credentials: 'same-origin' });
    } catch (e) {
      console.warn("Let's Encode: could not sign out of GitHub while abandoning ", e);
    }
  }
  console.log("Abandoning Let's Encode task, returning to: ", url);
  window.location.assign(url);
} // abandonLetsEncodeTask()

/**
 * retargetLogoLink
 * @description In Let's Encode mode the mei-friend logo must not be a way out
 * of the task. It points at mei-friend's home page, which on the campaign's own
 * deployment re-enters the task from sessionStorage and re-clones — silently
 * discarding uncommitted edits — and from any other deployment leaves for
 * production mei-friend entirely. Point it at the campaign instead, opened in a
 * new tab, so a volunteer who wants to look something up keeps their work and
 * their task. It carries no mf_status: a visit must not read as a finished task.
 */
export function retargetLogoLink() {
  const link = document.getElementById('meiFriendLogoLink');
  if (!link || !letsEncodeTask) return;
  link.href = letsEncodeCampaignUrl().toString();
  link.target = '_blank';
  link.rel = 'noopener';
  link.title = translator.lang.letsEncodeLogoLinkTitle.text;
} // retargetLogoLink()

/**
 * returnToLetsEncode
 * @description Leave mei-friend and report the outcome to the campaign. The
 * task is cleared first: this tab may be reused, and a stale task would
 * otherwise turn an ordinary later visit into a hand-off.
 * @param {string} status 'complete' or 'failed'
 * @param {string} [msg]
 */
export function returnToLetsEncode(status, msg = '') {
  const url = letsEncodeCallbackUrl(status, msg);
  clearLetsEncodeTask();
  console.log("Returning to Let's Encode: ", url);
  window.location.assign(url);
} // returnToLetsEncode()

/**
 * openLetsEncodeFile
 * @description Bind the GitHub integration to the handed-off file, so the
 * volunteer can commit to the task branch. Unlike the ?fork path this neither
 * forks nor creates a branch — Let's Encode has already done both.
 * @param {object} gm GitManager instance (passed in; see the note on imports)
 * @param {string} [url] raw githubusercontent URL; defaults to the handed-off
 * file, which is what we have after the login redirect drops the query string
 */
export async function openLetsEncodeFile(gm, url = letsEncodeTask.file) {
  const githubLoadingIndicator = document.getElementById('GithubLogo');
  githubLoadingIndicator.classList.add('clockwise');
  // Hold the volunteer off the editor until the task is in it. They have landed
  // here rather than walked through the GitHub menu, so an editable pane with
  // something else in it reads as their document — and editing it while the
  // clone is in flight breaks the load.
  showLetsEncodeOverlay({ message: translator.lang.letsEncodeLoading.text, state: 'busy' });
  if (cm) cm.readOnly = 'nocursor';
  let parsed;
  try {
    parsed = await parseRawGithubUrl(gm, url);
  } catch (e) {
    githubLoadingIndicator.classList.remove('clockwise');
    console.error("Let's Encode: could not resolve handed-off file ", url, e);
    returnToLetsEncode('failed', translator.lang.letsEncodeFileError.text);
    return;
  }
  gm.repo = `${parsed.userOrg}/${parsed.repo}`;
  gm.branch = parsed.branch;
  // gm.filepath is the directory, leading and trailing slash included; the file
  // name is passed separately to the clone. (Same split as the ?fork path; no
  // setMeiFileInfo() here, loadFile() sets it once the clone is done.)
  const withSlash = '/' + parsed.filepath;
  gm.filepath = withSlash.substring(0, withSlash.lastIndexOf('/') + 1);
  const file = withSlash.substring(withSlash.lastIndexOf('/') + 1);
  console.log("Let's Encode: opening", gm.repo, gm.branch, gm.filepath, file);
  await checkAndClone(
    file,
    gm.cloud.getCloneURL(),
    gm.branch,
    (e) => {
      githubLoadingIndicator.classList.remove('clockwise');
      console.error("Let's Encode: could not clone task repository ", e);
      returnToLetsEncode('failed', translator.lang.letsEncodeCloneError.text);
    },
    (loaded) => {
      if (loaded) {
        // the task is in the editor: hand it over (loadFile has already cleared
        // the editor's read-only state)
        hideLetsEncodeOverlay();
        // the clone is present now, so the lock table is readable; the claim
        // timestamp it yields then bounds the search for earlier saves
        loadLetsEncodeExpiry(gm).then(() => loadLetsEncodeLastSave(gm));
      } else {
        returnToLetsEncode('failed', translator.lang.letsEncodeFileError.text);
      }
    }
  );
} // openLetsEncodeFile()

/**
 * completeLetsEncodeTask
 * @description "Complete task": commit, then return to the campaign. An
 * unchanged encoding still commits — the volunteer judging it already correct is
 * itself a contribution, and only a commit puts that judgement in the campaign's
 * log — but it asks first, so a misclick is not mistaken for a decision.
 * @param {Function} commit an async commit taking a message and returning
 * { ok, transient, message }
 * @param {object} gm GitManager instance, consulted for whether anything changed
 */
export async function completeLetsEncodeTask(commit, gm) {
  let changed = true;
  try {
    changed = await gm.fileChanged();
  } catch (e) {
    // if we cannot tell, do not stand between the volunteer and their commit
    console.warn("Let's Encode: could not determine whether the encoding changed ", e);
  }
  // Nothing to show for the task at all — no uncommitted edits AND nothing ever
  // banked. Work saved in an earlier session is already committed, so
  // gm.fileChanged() is legitimately false then; warning about "no changes"
  // in that case would be telling a volunteer who has done the work that they
  // have not.
  const nothingDone = !changed && !(letsEncodeTask && letsEncodeTask.lastSaved);
  // Completing always asks first: it hands the task back and cannot be undone
  // from here, so a misclick on a two-item menu should not end someone's work.
  // Two flavours of the same question — the wagging finger when there is nothing
  // to show for the task at all, the handshake when there is.
  showLetsEncodeOverlay({
    message: nothingDone
      ? translator.lang.letsEncodeNoChangesPrompt.text
      : translator.lang.letsEncodeConfirmCompletePrompt.text,
    state: nothingDone ? 'confirm' : 'completing',
    layout: 'inline',
    buttons: [
      { label: translator.lang.letsEncodeKeepWorking.value, action: () => hideLetsEncodeOverlay() },
      {
        label: nothingDone
          ? translator.lang.letsEncodeCompleteAnyway.value
          : translator.lang.letsEncodeCompleteTaskButton.value,
        action: () => runLetsEncodeCommit(commit),
      },
    ],
  });
} // completeLetsEncodeTask()

/**
 * runLetsEncodeCommit
 * @description Commit and hand back. Transient failures are retried
 * automatically; if they persist, the volunteer chooses between another attempt
 * and giving up, so their work is never discarded without them saying so.
 * @param {Function} commit an async commit taking a message
 */
async function runLetsEncodeCommit(commit) {
  showLetsEncodeOverlay({ message: translator.lang.letsEncodeCommitting.text, state: 'busy' });
  let result;
  for (let attempt = 1; attempt <= maxCommitAttempts; attempt++) {
    result = await commit(letsEncodeCommitMessage());
    if (result.ok) {
      showLetsEncodeOverlay({ message: translator.lang.letsEncodeCompleted.text, state: 'done' });
      // let the confirmation be read before the redirect takes the page away
      await new Promise((resolve) => setTimeout(resolve, successDwellMs));
      returnToLetsEncode('complete');
      return;
    }
    if (!result.transient) break;
    if (attempt < maxCommitAttempts) {
      console.warn(`Let's Encode: commit attempt ${attempt} failed, retrying`, result.message);
      await new Promise((resolve) => setTimeout(resolve, commitRetryBackoffMs[attempt - 1] || 3000));
    }
  }
  console.warn("Let's Encode: commit failed", result);
  showLetsEncodeOverlay({
    message: translator.lang.letsEncodeCommitFailed.text + (result.message ? ' ' + result.message : ''),
    state: 'failed',
    buttons: [
      { label: translator.lang.letsEncodeRetryButton.value, action: () => runLetsEncodeCommit(commit) },
      {
        label: translator.lang.letsEncodeAbandonButton.value,
        action: () => returnToLetsEncode('failed', result.message || translator.lang.letsEncodeCommitFailed.text),
      },
    ],
  });
} // runLetsEncodeCommit()

// One Let's Encode hand per interstitial state, by file name under owl/hands/
// (copied from instigation/static/assets/hands/). The wag for the failure
// state is still to be traced; measure-blue stands in for it meanwhile.
// 'confirm' shares the wag with 'failed' — the same "hold on a moment" gesture,
// so both pick up the real wag artwork when it replaces the measure-blue
// stand-in. 'farewell' shares the wave with 'done': the same goodbye, whether
// the task was finished or given back.
const letsEncodeHands = {
  busy: 'pinch-orange',
  done: 'wave-pink',
  failed: 'measure-blue',
  confirm: 'measure-blue',
  farewell: 'wave-pink',
  // the handshake from the campaign's own landing page: completing a task is
  // concluding an agreement, not a warning
  completing: 'handshake',
};
const letsEncodeHandsWithNightVariant = ['wave-pink', 'measure-blue'];

/**
 * showLetsEncodeOverlay
 * @description The interstitial shown while completing a task, and the choice
 * offered when that fails. Modelled on the Solid session overlay.
 * @param {object} options { message, state ('busy' | 'done' | 'failed' | 'confirm'),
 * buttons: up to two [{ label, action }], safer choice first }
 */
export function showLetsEncodeOverlay({ message, state = 'busy', layout = 'stacked', buttons = [] }) {
  const overlay = document.getElementById('letsEncodeOverlay');
  const panel = document.getElementById('letsEncodeUI');
  const figure = document.getElementById('letsEncodeFigure');
  const hand = document.getElementById('letsEncodeHandPic');
  const text = document.getElementById('letsEncodeOverlayMessage');
  const buttonSlots = [
    document.getElementById('letsEncodeOverlayButton1'),
    document.getElementById('letsEncodeOverlayButton2'),
  ];
  if (!overlay) return;
  // Follow the navbar logo, which setMenuColors() has already matched to the
  // current theme: the hands live beside it under owl/, and take their night
  // variant wherever the logo took its dark one. One source of truth.
  const logoSrc = document.getElementById('mei-friend-logo').getAttribute('src');
  const handName = letsEncodeHands[state] || letsEncodeHands.busy;
  const night = logoSrc.includes('-dark') && letsEncodeHandsWithNightVariant.includes(handName);
  hand.setAttribute('src', logoSrc.substring(0, logoSrc.lastIndexOf('/') + 1) + 'hands/' + handName + (night ? '-dark' : '') + '.svg');
  // Drop every state first, with a reflow between, so a gesture restarts
  // from its rest pose when the state changes.
  figure.classList.remove('le-busy', 'le-done', 'le-failed', 'le-confirm', 'le-farewell', 'le-completing');
  void figure.offsetWidth;
  figure.classList.add('le-' + state);
  // the questions put the hand beside the text; the progress states stack it above
  panel.classList.toggle('le-inline', layout === 'inline');
  text.innerText = message;
  // two slots, filled in order; the safer choice goes first at every call site
  buttonSlots.forEach((slot, i) => {
    const spec = buttons[i];
    if (spec) {
      slot.value = spec.label;
      slot.style.display = 'inline-block';
      slot.onclick = spec.action;
    } else {
      slot.style.display = 'none';
      slot.onclick = null;
    }
  });
  overlay.classList.add('active');
} // showLetsEncodeOverlay()

/**
 * hideLetsEncodeOverlay
 * @description Take the interstitial down again.
 */
export function hideLetsEncodeOverlay() {
  const overlay = document.getElementById('letsEncodeOverlay');
  if (overlay) overlay.classList.remove('active');
} // hideLetsEncodeOverlay()
