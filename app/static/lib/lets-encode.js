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

import { cm, storage, translator } from './main.js';
import { checkAndClone } from './github-menu.js';
import { parseRawGithubUrl } from './fork-repository.js';

// n.b. the git manager is passed in rather than imported, matching
// forkAndOpen(gm, url) next door: main.js assigns `gm` only once the user is
// logged in, so the caller is better placed to say which instance to use.
// Reporting an arrival failure is likewise left to main.js, which owns the
// viewer and its alert overlay.

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
    // Not a hand-off in this URL: we may still be returning from the GitHub
    // login, which dropped the query string. The remembered task is read from
    // sessionStorage directly, because the storage object has not been switched
    // to that scope yet — that is what we are deciding here.
    const remembered = readRememberedTask();
    if (remembered) {
      storage.useTabScopedStorage();
      letsEncodeTask = remembered;
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
  setLetsEncodeTask({ campaign: campaign, task: task, file: urlFileName });
  console.log("Let's Encode mode:", letsEncodeTask);
  return { active: true, error: null };
} // initLetsEncodeMode()

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
      } else {
        returnToLetsEncode('failed', translator.lang.letsEncodeFileError.text);
      }
    }
  );
} // openLetsEncodeFile()

/**
 * completeLetsEncodeTask
 * @description The "Complete task" button: commit, then return to the campaign.
 * Transient failures are retried automatically; if they persist, the volunteer
 * chooses between another attempt and giving up, so their work is never
 * discarded without them saying so.
 * @param {Function} commit an async commit returning { ok, transient, message }
 */
export async function completeLetsEncodeTask(commit) {
  showLetsEncodeOverlay({ message: translator.lang.letsEncodeCommitting.text, state: 'busy' });
  let result;
  for (let attempt = 1; attempt <= maxCommitAttempts; attempt++) {
    result = await commit();
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
    onRetry: () => completeLetsEncodeTask(commit),
    onAbandon: () => returnToLetsEncode('failed', result.message || translator.lang.letsEncodeCommitFailed.text),
  });
} // completeLetsEncodeTask()

// One Let's Encode hand per interstitial state, by file name under owl/hands/
// (copied from instigation/static/assets/hands/). The wag for the failure
// state is still to be traced; measure-blue stands in for it meanwhile.
const letsEncodeHands = { busy: 'pinch-orange', done: 'wave-pink', failed: 'measure-blue' };
const letsEncodeHandsWithNightVariant = ['wave-pink', 'measure-blue'];

/**
 * showLetsEncodeOverlay
 * @description The interstitial shown while completing a task, and the choice
 * offered when that fails. Modelled on the Solid session overlay.
 * @param {object} options { message, state ('busy' | 'done' | 'failed'), onRetry, onAbandon }
 */
export function showLetsEncodeOverlay({ message, state = 'busy', onRetry = null, onAbandon = null }) {
  const overlay = document.getElementById('letsEncodeOverlay');
  const figure = document.getElementById('letsEncodeFigure');
  const hand = document.getElementById('letsEncodeHandPic');
  const text = document.getElementById('letsEncodeOverlayMessage');
  const retryButton = document.getElementById('letsEncodeRetryButton');
  const abandonButton = document.getElementById('letsEncodeAbandonButton');
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
  figure.classList.remove('le-busy', 'le-done', 'le-failed');
  void figure.offsetWidth;
  figure.classList.add('le-' + state);
  text.innerText = message;
  retryButton.value = translator.lang.letsEncodeRetryButton.value;
  abandonButton.value = translator.lang.letsEncodeAbandonButton.value;
  retryButton.style.display = onRetry ? 'inline-block' : 'none';
  abandonButton.style.display = onAbandon ? 'inline-block' : 'none';
  retryButton.onclick = onRetry;
  abandonButton.onclick = onAbandon;
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
