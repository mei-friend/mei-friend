/**
 * MEI toolbox panel beside the encoding, with seven tabs:
 *   Check:     accid.ges, metcon and linked-element checks (mei-checker.js)
 *   Convert:   attributes to elements (attribute-conversion.js)
 *   Renumber:  renumbering measures (utils.renumberMeasures())
 *   Ids:       adding, changing and removing xml:ids (editor.manipulateXmlIds())
 *   Facsimile: ingesting a facsimile, or adding an empty facsimile skeleton
 *   Reformat:  writing the encoding anew through Verovio or the XML parser, with
 *              the attribute order used when writing elements back
 *   Transpose: transposing the notation through the Verovio transpose option
 * Each tab has an options section with the buttons running its action, and a
 * result list with a text filter. Each tab keeps its results; results are marked
 * as outdated when the encoding changes afterwards. In a narrow panel, the
 * options fold away after a run; in a wide panel (CSS container query in
 * default.css), they are shown beside the results.
 *
 * Checks (and other actions) report through startRun(), addEntry() and finishRun().
 * An entry is {xmlId, html, correct, className}: clicking it moves the editor cursor
 * to xmlId; the optional function correct() fixes the issue (Fix/Ignore buttons).
 */

import { conversionGroups } from './attribute-conversion.js';
import * as dutils from './dom-utils.js';
import * as e from './editor.js';
import { ingestFacsimile } from './facsimile.js';
import { addModifyerKeys } from './control-menu.js';
import { cm, cmd, handleEditorChanges, shortcutForCommand, translator, v } from './main.js';
import * as checker from './mei-checker.js';
import { meiToolboxVisible, setOrientation } from './resizer.js';
import * as utils from './utils.js';
import * as icon from '../css/icons.js';

const tabs = ['check', 'convert', 'renumber', 'ids', 'facsimile', 'reformat', 'transpose'];

// check types and the language keys of their labels
const checkTypes = {
  accidGes: 'meiToolboxCheckAccidGes',
  metcon: 'meiToolboxCheckMetcon',
  linked: 'meiToolboxCheckLinked',
};

// language keys of the labels of attribute groups (attribute-conversion.js)
const groupLabels = {
  accid: 'convertGroupAccid',
  accidGes: 'convertGroupAccidGes',
  artic: 'convertGroupArtic',
  syl: 'convertGroupSyl',
  fermata: 'convertGroupFermata',
  tie: 'convertGroupTie',
  slur: 'convertGroupSlur',
  gliss: 'convertGroupGliss',
  definitions: 'convertGroupDefinitions',
  labels: 'convertGroupLabels',
};

// values of the renumber suffix selects
const suffixAtMeasuresValues = ['none', '-cont'];
const suffixAtEndingsValues = ['none', 'ending@n', 'a/b/c', 'A/B/C', '-a/-b/-c', '-A/-B/-C'];

// values of the Transpose tab selects, in the order of the labels of the language
// packs; they are the Verovio transpose option (keys as pitch names, intervals in
// the base-40 system, direction prefixed)
const transposeKeyValues = ['cs', 'fs', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bf', 'ef', 'af', 'df', 'gf', 'cf'];
// prettier-ignore
const transposeIntervalValues = [
  'P1', 'A1', 'd2', 'm2', 'M2', 'A2', 'd3', 'm3', 'M3', 'A3', 'd4', 'P4', 'A4',
  'd5', 'P5', 'A5', 'd6', 'm6', 'M6', 'A6', 'd7', 'm7', 'M7', 'A7', 'd8', 'P8',
];
const transposeDirectionValues = ['+', '-', ''];

// where the keys of the Transpose tab sit on the line of fifths: the values run from
// seven sharps (cs) to seven flats (cf), so the index gives the key signature
const transposeKeyFifths = (value) => 7 - transposeKeyValues.indexOf(value);
// fifths of the degrees of a major scale, counted from its tonic (C D E F G A B)
const fifthsOfDegree = [0, 2, 4, -1, 1, 3, 5];
// what a quality adds to that; 'd' on an imperfectable degree lowers by two fifths more
const fifthsOfQuality = { P: 0, M: 0, m: -7, A: 7, d: -7 };

// the two modes of the Transpose tab: the name in `storageKey` under which the
// select of a mode is stored, its values, and the value used when nothing is stored
const transposeModes = {
  key: { store: 'transposeKey', values: transposeKeyValues, fallback: 'c' },
  interval: { store: 'transposeInterval', values: transposeIntervalValues, fallback: 'P1' },
};

// modes of the Ids tab and the language keys of their labels
const idModes = {
  add: 'meiToolboxIdsAdd',
  change: 'meiToolboxIdsChange',
  remove: 'meiToolboxIdsRemove',
};

/**
 * Attribute order presets of the Reformat tab. The pattern is read by
 * dutils.parseAttributeOrder(): names separated by whitespace and/or commas, a
 * trailing '*' as prefix wildcard ('clef.*'), a lone '*' for all attributes not
 * named elsewhere (alphabetically), an empty pattern for 'leave as encoded'.
 * 'custom' takes its pattern from the text field next to the select.
 */
const attributeOrderPresets = {
  keep: '',
  alphabetical: '*',
  xmlIdFirst: 'xml:id *',
  custom: null,
};
const defaultAttributeOrderPreset = 'xmlIdFirst';
const defaultAttributeOrderPattern = 'xml:id n label dur dots *';

// localStorage keys (renumber keys as formerly used by the settings panel)
const storageKey = {
  checkType: 'mf-meiToolboxCheckType',
  groups: 'mf-meiToolboxConvertGroups',
  groupsBeforeAccidGes: 'mf-convertAttributeGroups', // until accid and accid.ges were separate groups
  startNumber: 'mf-renumberMeasuresStartNumber',
  continueAcrossIncompleteMeasures: 'mf-renumberMeasureContinueAcrossIncompleteMeasures',
  suffixAtMeasures: 'mf-renumberMeasuresUseSuffixAtMeasures',
  continueAcrossEndings: 'mf-renumberMeasuresContinueAcrossEndings',
  suffixAtEndings: 'mf-renumberMeasuresUseSuffixAtEndings',
  restartAtMdiv: 'mf-renumberMeasuresRestartAtMdiv',
  idMode: 'mf-meiToolboxIdMode',
  attributeOrderPreset: 'mf-meiToolboxAttributeOrderPreset',
  attributeOrderPattern: 'mf-meiToolboxAttributeOrderPattern',
  transposeMode: 'mf-meiToolboxTransposeMode',
  // transpose keys as formerly used by the settings panel
  transposeKey: 'mf-transposeKey',
  transposeInterval: 'mf-transposeInterval',
  transposeDirection: 'mf-transposeDirection',
  transposeDirective: 'mf-meiToolboxTransposeDirective',
};

const BUDGET_MS = 30; // work per time slice before yielding to the GUI

let panel = null; // #meiToolbox element, once built
let activeTab = 'check';
let runTab = null; // tab of the current (or last) run
let running = false;
let ownChangeTab = null; // tab whose fix is currently changing the encoding
const panes = {}; // tab -> pane object, see buildPane()

// ############################################################################
// public functions
// ############################################################################

/**
 * Shows the MEI toolbox (building it on first use) with the given tab
 * @param {string} tab one of `tabs`
 */
export function openToolbox(tab = activeTab) {
  if (!panel) build();
  showPanel(true);
  selectTab(tab);
} // openToolbox()

/**
 * Hides the MEI toolbox (results are kept)
 */
export function closeToolbox() {
  showPanel(false);
} // closeToolbox()

/**
 * Shows the MEI toolbox when it is hidden and vice versa
 */
export function toggleToolbox() {
  if (meiToolboxVisible()) closeToolbox();
  else openToolbox();
} // toggleToolbox()

/**
 * Shows or hides the panel. Like the facsimile panel, the settings checkbox is the
 * single source of truth for the visibility; setOrientation() reads it and lays the
 * encoding panel out accordingly.
 * @param {boolean} show
 */
function showPanel(show) {
  if (show && !panel) build();
  const checkbox = document.getElementById('showMeiToolbox');
  if (checkbox) checkbox.checked = show;
  setOrientation(cm, '', '', v);
} // showPanel()

/**
 * Clears all results, e.g. when a new encoding is loaded: they belong to the one
 * before. The panel itself stays as it is, open or closed, as the settings and the
 * annotation panel do.
 */
export function resetToolbox() {
  if (!panel) return;
  if (v) v.toolboxAbort = true; // stop a check in progress
  tabs.forEach((tab) => {
    const p = panes[tab];
    clearResults(p);
    p.hasResults = false;
    p.title.innerHTML = '';
    p.summary.innerHTML = '';
    p.pane.classList.remove('stale', 'running');
    p.options.classList.remove('collapsed');
    showPlaceholder(p);
  });
} // resetToolbox()

/**
 * Starts a new run in a tab: shows the panel at that tab, clears the result
 * list, shows the title and the Stop button, and folds the options away.
 * @param {string} tab
 * @param {string} title (html)
 */
export function startRun(tab, title) {
  openToolbox(tab);
  const p = panes[tab];
  runTab = tab;
  running = true;
  v.toolboxAbort = false;
  clearResults(p);
  p.hasResults = true;
  p.title.innerHTML = title;
  p.summary.innerHTML = '';
  p.pane.classList.remove('stale');
  p.pane.classList.add('running');
  p.stop.disabled = false;
  p.options.classList.add('collapsed');
  updateOptionsSummary(tab);
  updateCounts(p);
} // startRun()

/**
 * Adds an entry to the result list of a tab (by default, of the current run)
 * @param {Object} data {xmlId, html, correct, className}
 * @param {string} tab
 */
export function addEntry(data, tab = runTab) {
  const p = panes[tab];
  if (!p) return;
  const div = document.createElement('div');
  div.classList.add('validation-item', 'mtEntry');
  if (data.className) div.classList.add(data.className);

  const span = document.createElement('span');
  span.classList.add('codeCheckerMessage');
  span.innerHTML = data.html;
  span.title = span.textContent;
  span.addEventListener('click', () => {
    if (data.xmlId) {
      utils.setCursorToId(cm, data.xmlId);
      cm.focus();
    }
  });
  div.appendChild(span);

  if (data.correct) {
    p.fixable++;
    const fixButton = document.createElement('button');
    fixButton.textContent = t('codeCheckerFix', 'Fix');
    fixButton.classList.add('btn', 'fix');
    const ignoreButton = document.createElement('button');
    ignoreButton.textContent = t('codeCheckerIgnore', 'Ignore');
    ignoreButton.classList.add('btn', 'ignore');
    // applyFix() is also called directly by "Fix all"
    fixButton.applyFix = () => {
      ownChangeTab = tab;
      try {
        data.correct();
      } finally {
        ownChangeTab = null;
      }
      const checked = document.createElement('span');
      checked.innerHTML = icon.check;
      div.appendChild(checked);
      for (const b of [fixButton, ignoreButton]) {
        b.disabled = true;
        b.classList.add('disabled');
      }
      p.fixed++;
      if (!p.fixingAll) updateCounts(p);
    };
    fixButton.addEventListener('click', fixButton.applyFix);
    ignoreButton.addEventListener('click', () => {
      const ignored = span.classList.toggle('strikethrough');
      fixButton.disabled = ignored;
      fixButton.classList.toggle('disabled', ignored);
      updateCounts(p);
    });
    div.append(fixButton, ignoreButton);
  }

  // apply current filter
  if (p.filterText && !div.textContent.toLowerCase().includes(p.filterText)) {
    div.style.display = 'none';
  } else {
    if (p.shown % 2 === 1) div.classList.add('odd');
    p.shown++;
  }
  p.total++;
  p.list.appendChild(div);
  if (!running) updateCounts(p);
} // addEntry()

/**
 * Finishes the current run
 * @param {string} emptyText shown when the run produced no entries
 * @param {string} summary (html) shown next to the title
 */
export function finishRun(emptyText = '', summary = '') {
  const p = panes[runTab];
  if (!p) return;
  running = false;
  p.pane.classList.remove('running');
  const stopped = v.toolboxAbort;
  if (stopped) summary = (summary ? summary + ' ' : '') + t('codeCheckerStopped', 'Stopped.');
  p.summary.innerHTML = summary;
  p.title.parentElement.title = p.title.textContent + ' ' + p.summary.textContent; // full text, if truncated
  if (p.total === 0 && emptyText && !stopped) {
    const div = document.createElement('div');
    div.classList.add('validation-item', 'mtInfo');
    div.innerHTML = emptyText;
    p.list.appendChild(div);
  }
  updateCounts(p);
} // finishRun()

/**
 * Runs a check in the Check tab
 * @param {string} type 'accidGes', 'metcon' or 'linked'; currently selected type, if omitted
 */
export function runCheck(type = '') {
  openToolbox('check');
  const radios = panes.check.content.querySelectorAll('input[name="mtCheckType"]');
  if (type && type in checkTypes) {
    radios.forEach((r) => (r.checked = r.value === type));
    save(storageKey.checkType, type);
  } else {
    type = Array.from(radios).find((r) => r.checked)?.value || 'accidGes';
  }
  panes.check.lastAction = () => runCheck(type);
  switch (type) {
    case 'accidGes':
      checker.checkAccidGes(v, cm);
      break;
    case 'metcon':
      setTimeout(() => checker.checkMeterConformance(v, cm), 10);
      break;
    case 'linked':
      setTimeout(() => checker.checkLinkedElements(v, cm), 10);
      break;
  }
} // runCheck()

/**
 * Converts attributes to elements, or elements to attributes (reverse), for the
 * groups selected in the Convert tab, restricted to the editor selection if text is
 * selected; in test mode, only lists what would be converted. Before converting
 * elements to attributes, the user confirms the removal of xml:ids (see confirmElementRemoval()).
 * @param {boolean} test
 * @param {boolean} reverse elements to attributes
 * @param {boolean} confirmed removal of xml:ids already confirmed by the user
 */
export function runConvert(test = false, reverse = false, confirmed = false) {
  openToolbox('convert');
  const p = panes.convert;
  const groups = selectedGroups();
  if (reverse && !test && !confirmed) {
    confirmElementRemoval(groups, () => runConvert(test, reverse, true));
    return;
  }
  p.lastAction = () => runConvert(test, reverse);
  const key = reverse ? 'convertElementsToAttributes' : 'convertAttributesToElements';
  const title = reverse
    ? t('meiToolboxElToAttrButton', 'Elements → attributes')
    : t('meiToolboxAttrToElButton', 'Attributes → elements');
  const suffix = [];
  if (test) suffix.push(t('meiToolboxTestButton', 'Test'));
  if (cm.somethingSelected()) suffix.push(t('convertSelectionSuffix', 'selection'));
  startRun('convert', title + (suffix.length > 0 ? ' (' + suffix.join(', ') + ')' : ''));
  setTimeout(() => {
    const result = e.convertAttributesToElements(v, cm, { groups, test, reverse, selection: true });
    const total = Object.values(result.counts).reduce((sum, n) => sum + n, 0);
    let summary = '';
    if (total > 0) {
      const list = Object.entries(result.counts)
        .map(([name, n]) => n + '&times;&nbsp;&lt;' + name + '&gt;')
        .join(', ');
      summary = t(key + (test ? 'TestSummary' : 'Summary')).replace('{list}', list);
    }
    if (result.warnings.length > 0) {
      summary += ' ' + t(key + 'Problems').replace('{count}', result.warnings.length);
    }
    const entries = reverse ? reverseConversionEntries(result, test) : conversionEntries(result, test);
    addEntriesSliced('convert', entries, () => finishRun(t(key + 'None'), summary));
  }, 10);
} // runConvert()

/**
 * Renumbers measures (or, in test mode, lists the new numbers) with the
 * options of the Renumber tab
 * @param {boolean} change
 */
export function runRenumber(change = false) {
  openToolbox('renumber');
  const options = renumberOptions();
  panes.renumber.lastAction = () => runRenumber(change);
  startRun('renumber', t('renumberMeasuresModalText', 'Renumber measures') + (change ? '' : testSuffix()));
  setTimeout(() => {
    const result = e.renumberMeasures(v, cm, change, options);
    let changed = 0;
    const entries = result.map((r) => {
      const isChanged = r.oldN !== r.newN;
      if (isChanged) changed++;
      return {
        xmlId: r.measure.getAttribute('xml:id') || '',
        className: isChanged ? '' : 'mtMuted',
        html:
          '<b>measure</b>' +
          idHtml(r.measure) +
          ' n="' +
          esc(r.oldN) +
          '" ' +
          (isChanged ? '&rarr; n="' + esc(r.newN) + '"' : '(' + t('renumberMeasuresUnchanged', 'unchanged') + ')') +
          (r.notes.length > 0 ? ' &middot; ' + esc(r.notes.join(', ')) : ''),
      };
    });
    const summary = t(change ? 'renumberMeasuresSummary' : 'renumberMeasuresSummaryTest')
      .replace('{total}', result.length)
      .replace('{changed}', changed);
    addEntriesSliced('renumber', entries, () => finishRun(t('renumberMeasuresNoMeasures'), summary));
  }, 10);
} // runRenumber()

/**
 * Adds, changes or removes xml:ids, restricted to the editor selection if text is
 * selected. Lists the xml:ids that could not be removed because they are pointed to.
 * @param {string} mode 'add', 'change' or 'remove'; empty: the mode selected in the tab
 */
export function runIds(mode = '') {
  openToolbox('ids');
  const radios = panes.ids.content.querySelectorAll('input[name="mtIdMode"]');
  if (mode && mode in idModes) {
    radios.forEach((r) => (r.checked = r.value === mode));
    save(storageKey.idMode, mode);
  } else {
    mode = Array.from(radios).find((r) => r.checked)?.value || 'add';
  }
  panes.ids.lastAction = () => runIds(mode);
  const suffix = cm.somethingSelected() ? ' (' + t('convertSelectionSuffix', 'selection') + ')' : '';
  startRun('ids', t(idModes[mode]) + suffix);
  setTimeout(() => {
    // showReport false: the result is reported in the panel, not as an alert
    e.manipulateXmlIds(v, cm, mode, [], false, (report) => {
      if (report.cancelled) {
        finishRun(t('meiToolboxIdsCancelled', 'Cancelled, the encoding is unchanged.'), '');
        return;
      }
      const parts = [];
      if (report.added > 0) parts.push(t('meiToolboxIdsAdded', '{n} added').replace('{n}', report.added));
      if (report.changed > 0) parts.push(t('meiToolboxIdsChanged', '{n} changed').replace('{n}', report.changed));
      if (report.removed > 0) parts.push(t('meiToolboxIdsRemoved', '{n} removed').replace('{n}', report.removed));
      if (report.kept > 0) parts.push(t('meiToolboxIdsKept', '{n} kept').replace('{n}', report.kept));
      if (report.references > 0)
        parts.push(t('meiToolboxIdsReferences', '{n} references updated').replace('{n}', report.references));
      // only the xml:ids kept despite a removal are worth listing: they are the ones
      // the user may want to look at (they are pointed to from within the encoding)
      const entries = report.keptIds.map((id) => ({
        xmlId: id,
        className: 'mtMuted',
        html: '<code>#' + esc(id) + '</code> ' + t('meiToolboxIdsKeptReason', 'pointed to within the encoding'),
      }));
      // the placeholder is for runs that did nothing at all; a run that added or
      // changed xml:ids has no entries to list, but is not 'nothing to do'
      const nothing = parts.length === 0 ? t('meiToolboxIdsNothing', 'Nothing to do.') : '';
      addEntriesSliced('ids', entries, () => finishRun(nothing, parts.join(', ')));
    });
  }, 10);
} // runIds()

/**
 * Ingests a facsimile from another file, or adds an empty facsimile skeleton with
 * one surface per page break, and lists the resulting facsimile structure.
 * @param {string} action 'ingest' or 'empty'
 */
export function runFacsimile(action = 'empty') {
  openToolbox('facsimile');
  panes.facsimile.lastAction = () => runFacsimile(action);
  const title = action === 'ingest' ? t('meiToolboxFacsimileIngest') : t('meiToolboxFacsimileAddMissing');
  if (action === 'ingest') {
    // The ingestion reports here instead of into modal prompts: progress in the
    // summary line, each problem as an entry, the result through finishRun(). It
    // only starts once a file has been chosen, so cancelling the file dialog
    // leaves the tab as it was.
    ingestFacsimile({
      started: (runTitle, fileName) =>
        startRun('facsimile', esc(runTitle) + ' &middot; <code>' + esc(fileName) + '</code>'),
      progress: (text) => (panes.facsimile.summary.textContent = text),
      warn: (entry) => addEntry({ ...entry, className: 'mtWarning' }, 'facsimile'),
      aborted: () => v.toolboxAbort,
      failed: (message) => {
        startRun('facsimile', title);
        finishRun(esc(message), '');
      },
      finished: (runTitle, summary, warningCount) => {
        panes.facsimile.title.textContent = runTitle;
        // without problems to look at, show what the encoding now has instead
        if (warningCount === 0) listFacsimile(summary);
        else finishRun('', summary);
      },
    });
  } else {
    startRun('facsimile', title);
    setTimeout(() => {
      const report = e.addFacsimile(v, cm);
      const parts = [];
      if (report.surfacesAdded > 0)
        parts.push(t('meiToolboxFacsimileAdded', '{n} surfaces added').replace('{n}', report.surfacesAdded));
      if (report.pagesLinked > 0)
        parts.push(t('meiToolboxFacsimileLinked', '{n} pages linked').replace('{n}', report.pagesLinked));
      // an encoding without page breaks only gets the empty facsimile element itself
      if (parts.length === 0 && report.facsimileAdded) parts.push(t('meiToolboxFacsimileCreated', 'Facsimile added.'));
      if (parts.length === 0) parts.push(t('meiToolboxFacsimileUpToDate', 'Every page already has its surface.'));
      listFacsimile(parts.join(', '));
    }, 10);
  }
} // runFacsimile()

/**
 * Re-renders the encoding through Verovio (which rewrites it from its own
 * representation) or through the XML parser (editor.reformatEncoding(), which keeps
 * the content and only normalizes formatting and attribute order).
 * @param {string} mode 'verovio' or 'xml'
 */
export function runReformat(mode = 'xml') {
  openToolbox('reformat');
  panes.reformat.lastAction = () => runReformat(mode);
  applyAttributeOrder();
  startRun('reformat', t(mode === 'verovio' ? 'meiToolboxReformatVerovio' : 'meiToolboxReformatXml'));
  if (mode === 'verovio') {
    // Verovio re-renders in its worker and writes the result back asynchronously
    onceEncodingChanged(
      () => finishRun('', linesSummary()),
      () => finishRun(t('meiToolboxReformatUnchanged', 'The encoding is unchanged.'), '')
    );
    v.reRenderMei(cm, false);
  } else {
    setTimeout(() => {
      const result = e.reformatEncoding(v, cm);
      if (result === null) {
        finishRun(t('reformatEncodingParseError', 'The encoding could not be parsed.'), '');
      } else {
        finishRun('', linesSummary());
      }
    }, 10);
  }
} // runReformat()

/**
 * Transposes the notation with the options of the Transpose tab, or removes a
 * transposition again. Only the notation is transposed: Verovio renders the encoding
 * with its transpose option, the encoding itself stays as it is until it is written
 * anew with "Via Verovio" in the Reformat tab.
 * @param {boolean} reset remove the transposition instead of applying one
 */
export function runTranspose(reset = false) {
  openToolbox('transpose');
  panes.transpose.lastAction = () => runTranspose(reset);
  startRun('transpose', t(reset ? 'meiToolboxTransposeReset' : 'transposeButton'));
  v.loadXml(cm.getValue(), true); // the directive is read from and written into the encoding
  const option = reset ? '' : transposeOption();
  const wasTransposed = !!v.vrvOptions.transpose;
  v.vrvOptions.transpose = option;
  // the directive states the transposition, so it is written before the notation is drawn;
  // when it is not wanted, one of an earlier run is taken out rather than left contradicting
  const wanted = !reset && document.getElementById('mtTransposeDirective')?.checked;
  const directive = e.setTranspositionDirective(v, cm, wanted ? directiveText() : '');
  if (reset && !wasTransposed && !directive) {
    finishRun(t('meiToolboxTransposeNone', 'No transposition is applied.'), '');
    return;
  }
  v.updateAll(cm);
  // the rendered MIDI is no longer the notation shown, so the playback bar is closed
  if (document.getElementById('showMidiPlaybackControlBar')?.checked) cmd.toggleMidiPlaybackControlBar();
  const message = reset
    ? t('meiToolboxTransposeRemoved', 'The transposition has been removed.')
    : t('meiToolboxTransposeDone', 'The notation is transposed ({what}).').replace('{what}', transposeSummary());
  // what became of the encoding: it only ever changes through the directive
  const aboutEncoding =
    directive === 'added'
      ? t('meiToolboxTransposeDirectiveAdded', 'The transposition directive was written into the pgHead.')
      : directive === 'removed'
        ? t('meiToolboxTransposeDirectiveRemoved', 'The transposition directive was removed from the pgHead.')
        : t('meiToolboxReformatUnchanged', 'The encoding is unchanged.');
  finishRun(message + ' ' + aboutEncoding, option ? '<code>' + esc(option) + '</code>' : '');
} // runTranspose()

/**
 * Lists the facsimile of the encoding (surfaces with their graphic and zones, and
 * the page break pointing to each surface) as the result of the Facsimile tab.
 * @param {string} summaryPrefix put before the summary, e.g. what an ingestion did
 */
function listFacsimile(summaryPrefix = '') {
  v.loadXml(cm.getValue(), true);
  const surfaces = Array.from(v.xmlDoc.querySelectorAll('facsimile surface'));
  const entries = surfaces.map((surface) => {
    const id = surface.getAttribute('xml:id') || '';
    const graphic = surface.querySelector('graphic');
    const zones = surface.querySelectorAll('zone').length;
    const pb = id ? v.xmlDoc.querySelector('pb[facs="#' + id + '"], pb[facs="' + id + '"]') : null;
    const details = [];
    if (graphic?.getAttribute('target')) details.push(esc(graphic.getAttribute('target')));
    details.push(t('meiToolboxFacsimileZones', '{n} zones').replace('{n}', zones));
    if (pb) details.push('<b>pb</b>' + idHtml(pb));
    return { xmlId: id, html: '<b>surface</b>' + idHtml(surface) + ' &middot; ' + details.join(' &middot; ') };
  });
  const summary = [
    summaryPrefix,
    t('meiToolboxFacsimileSummary', '{surfaces} surfaces, {zones} zones')
      .replace('{surfaces}', surfaces.length)
      .replace('{zones}', v.xmlDoc.querySelectorAll('facsimile zone').length),
  ]
    .filter(Boolean)
    .join(' &middot; ');
  addEntriesSliced('facsimile', entries, () =>
    finishRun(t('meiToolboxFacsimileNone', 'This encoding has no facsimile.'), summary)
  );
} // listFacsimile()

// summary line of a reformat: the resulting number of lines
function linesSummary() {
  return t('meiToolboxReformatDone', '{lines} lines').replace('{lines}', cm.lineCount());
} // linesSummary()

/**
 * Calls `changed` the next time the encoding changes, or `timedOut` when it has not
 * changed within `ms` (the user cancelled a dialog, or nothing had to be done).
 * @param {Function} changed
 * @param {Function} timedOut
 * @param {number} ms
 */
function onceEncodingChanged(changed, timedOut, ms = 120000) {
  let timer = null;
  const handler = () => {
    clearTimeout(timer);
    cm.off('changes', handler);
    setTimeout(changed, 10); // let the editor settle before reading it
  };
  timer = setTimeout(() => {
    cm.off('changes', handler);
    timedOut();
  }, ms);
  cm.on('changes', handler);
} // onceEncodingChanged()

/**
 * Hands the attribute order chosen in the Reformat tab to dom-utils, where
 * sortNodeAttributes() uses it whenever elements are written back to the editor.
 */
export function applyAttributeOrder() {
  dutils.setAttributeOrder(attributeOrderPattern());
} // applyAttributeOrder()

// the attribute order pattern currently configured (preset, or the custom field)
function attributeOrderPattern() {
  const preset = load(storageKey.attributeOrderPreset, defaultAttributeOrderPreset);
  if (preset === 'custom') return load(storageKey.attributeOrderPattern, defaultAttributeOrderPattern);
  return attributeOrderPresets[preset] ?? attributeOrderPresets[defaultAttributeOrderPreset];
} // attributeOrderPattern()

/**
 * Elements converted to attributes lose their xml:ids. References within the file
 * are respected by the conversion, but links from elsewhere (other files, annotations
 * stored outside the file, facsimile tools, URLs) would break: the user confirms
 * the conversion in a prompt stating the number of affected xml:ids.
 * @param {Array<string>} groups
 * @param {Function} proceed called when confirmed
 */
function confirmElementRemoval(groups, proceed) {
  const test = e.convertAttributesToElements(v, cm, { groups, test: true, reverse: true, selection: true });
  // elements that remain (only some attributes converted) keep their xml:id
  const count = test.changes
    .flatMap((c) => c.removed)
    .filter((r) => !r.partial && r.element.hasAttribute('xml:id')).length;
  if (count === 0) {
    proceed();
    return;
  }
  const message = t('elementsToAttributesConfirmation')
    .replace('{count}', count)
    .split('\n\n')
    .map((paragraph) => '<p>' + paragraph + '</p>')
    .join('');
  v.showUserPrompt(
    message,
    [
      { label: t('elementsToAttributesCancel', 'Cancel'), cancel: true, event: () => v.hideUserPrompt() },
      {
        label: t('elementsToAttributesProceed', 'Convert'),
        event: () => {
          v.hideUserPrompt();
          proceed();
        },
      },
    ],
    'warning'
  );
} // confirmElementRemoval()

// ############################################################################
// building the panel
// ############################################################################

function build() {
  panel = document.getElementById('meiToolbox');
  panel.innerHTML = '';

  const header = el('div', 'mtHeader');
  for (const tab of tabs) {
    const button = el('button', 'mtTab');
    button.dataset.tab = tab;
    button.dataset.lang = 'meiToolboxTab' + tab[0].toUpperCase() + tab.slice(1);
    button.addEventListener('click', () => selectTab(tab));
    header.appendChild(button);
  }
  header.appendChild(el('span', 'mtSpacer'));
  const close = el('span', 'mtClose rightButton');
  close.innerHTML = '&times;';
  close.dataset.langTitle = 'meiToolboxClose';
  close.addEventListener('click', closeToolbox);
  header.appendChild(close);
  panel.appendChild(header);

  buildPane('check', buildCheckOptions);
  buildPane('convert', buildConvertOptions);
  buildPane('renumber', buildRenumberOptions);
  buildPane('ids', buildIdsOptions);
  buildPane('facsimile', buildFacsimileOptions);
  buildPane('reformat', buildReformatOptions);
  buildPane('transpose', buildTransposeOptions);
  applyAttributeOrder();

  applyTexts();
  addModifyerKeys(panel); // renders the keyboard shortcuts as in the menu bar
  document.addEventListener('mf-language-changed', applyTexts);
  cm.on('changes', onEditorChanges);
} // build()

/**
 * Builds the pane of a tab: options (with a one-line summary shown when folded)
 * and the result list with its header (title, filter, counter, buttons)
 */
function buildPane(tab, buildOptions) {
  const pane = el('div', 'mtPane');
  pane.dataset.tab = tab;

  // options
  const options = el('div', 'mtOptions');
  const optionsSummary = el('div', 'mtOptionsSummary');
  const summaryText = el('span', 'mtOptionsSummaryText');
  const rerun = el('button', 'btn mtRerun');
  rerun.dataset.lang = 'meiToolboxRunAgain';
  optionsSummary.append(el('span', 'mtFoldIcon', '▸'), summaryText, rerun);
  optionsSummary.addEventListener('click', (ev) => {
    if (!ev.target.closest('.mtRerun')) options.classList.remove('collapsed');
  });
  rerun.addEventListener('click', () => p.lastAction?.());
  const content = el('div', 'mtOptionsContent');
  const fold = el('span', 'mtFold', '▴');
  fold.dataset.langTitle = 'meiToolboxHideOptions';
  fold.addEventListener('click', () => options.classList.add('collapsed'));
  content.appendChild(fold);
  options.append(optionsSummary, content);

  // results
  const results = el('div', 'mtResults');
  const resultsHeader = el('div', 'mtResultsHeader');
  const titleWrapper = el('span', 'mtRunTitleWrapper');
  const title = el('span', 'mtRunTitle');
  const summary = el('span', 'mtRunSummary');
  const stale = el('span', 'mtStale');
  stale.dataset.lang = 'meiToolboxOutdated';
  titleWrapper.append(title, summary, stale);
  const filter = el('input', 'mtFilter');
  filter.type = 'search';
  filter.dataset.langPlaceholder = 'meiToolboxFilter';
  const count = el('span', 'mtCount');
  const fixAll = el('button', 'btn mtFixAll');
  const ignoreAll = el('button', 'btn mtIgnoreAll');
  const stop = el('button', 'btn mtStop');
  stop.dataset.lang = 'codeCheckerStop';
  resultsHeader.append(titleWrapper, filter, count, fixAll, ignoreAll, stop);
  const list = el('div', 'mtList');
  results.append(resultsHeader, list);

  pane.append(options, results);
  panel.appendChild(pane);

  const p = {
    tab,
    pane,
    options,
    content,
    summaryText,
    title,
    summary,
    filter,
    count,
    fixAll,
    ignoreAll,
    stop,
    list,
    filterText: '',
    total: 0,
    shown: 0,
    fixable: 0,
    fixed: 0,
    fixingAll: false,
    hasResults: false,
    lastAction: null,
  };
  panes[tab] = p;

  let filterTimeout = null;
  filter.addEventListener('input', () => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => applyFilter(p), p.total > 2000 ? 200 : 0);
  });
  fixAll.addEventListener('click', () => fixAllShown(p));
  ignoreAll.addEventListener('click', () => {
    shownEntries(p).forEach((div) => {
      const button = div.querySelector('button.ignore');
      const span = div.querySelector('.codeCheckerMessage');
      if (button && !button.disabled && !span.classList.contains('strikethrough')) button.click();
    });
  });
  stop.addEventListener('click', () => {
    v.toolboxAbort = true;
    stop.disabled = true;
  });

  buildOptions(content, p);

  // Touching the options invalidates what is shown beside them: the results belong
  // to the options they were run with, so they are dropped as soon as those change
  // (a run that is still going is left alone; it clears the list itself anyway).
  const dropResults = (ev) => {
    // not for the action buttons: they start a run, which clears the list itself
    // (and a run that finishes synchronously would otherwise be wiped right away)
    if (ev?.target?.closest('.mtActions')) return;
    if (!p.hasResults || (running && runTab === tab)) return;
    clearResults(p);
    p.hasResults = false;
    p.title.innerHTML = '';
    p.summary.innerHTML = '';
    p.title.parentElement.title = '';
    p.pane.classList.remove('stale');
    showPlaceholder(p);
    updateCounts(p);
  };
  content.addEventListener('click', dropResults);
  content.addEventListener('input', dropResults);

  showPlaceholder(p);
} // buildPane()

function buildCheckOptions(content, p) {
  const stored = load(storageKey.checkType, 'accidGes');
  const group = el('div', 'mtOptionGroup');
  for (const [type, langKey] of Object.entries(checkTypes)) {
    const label = el('label', 'mtOption mtChoice');
    const radio = el('input');
    radio.type = 'radio';
    radio.name = 'mtCheckType';
    radio.value = type;
    radio.checked = type === stored;
    radio.addEventListener('change', () => {
      save(storageKey.checkType, type);
      updateOptionsSummary('check');
    });
    const text = el('span');
    text.dataset.lang = langKey;
    text.dataset.split = 'block'; // attribute names in parentheses as detail line
    label.append(radio, text);
    group.appendChild(label);
  }
  content.appendChild(group);
  content.appendChild(actions([{ lang: 'meiToolboxCheckButton', action: () => runCheck() }]));
} // buildCheckOptions()

function buildConvertOptions(content, p) {
  const stored = load(storageKey.groups, null);
  let selected = stored === null ? conversionGroups : stored.split(',');
  if (stored === null) {
    // groups saved before @accid and @accid.ges became separate groups: 'accid' meant both
    const before = load(storageKey.groupsBeforeAccidGes, null);
    if (before !== null) {
      selected = before.split(',');
      if (selected.includes('accid')) selected.push('accidGes');
    }
  }
  const allNone = el('div', 'mtAllNone');
  const all = el('button', 'mtLink');
  all.dataset.lang = 'meiToolboxAll';
  const none = el('button', 'mtLink');
  none.dataset.lang = 'meiToolboxNone';
  allNone.append(all, el('span', '', ' | '), none);
  content.appendChild(allNone);

  const group = el('div', 'mtOptionGroup mtGrid');
  for (const g of conversionGroups) {
    const label = el('label', 'mtOption mtChoice');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'mtConvertGroup';
    checkbox.value = g;
    checkbox.checked = selected.includes(g);
    checkbox.addEventListener('change', saveGroups);
    const text = el('span');
    text.dataset.lang = groupLabels[g];
    text.dataset.split = 'inline';
    label.append(checkbox, text);
    group.appendChild(label);
  }
  content.appendChild(group);
  const setAll = (checked) => {
    group.querySelectorAll('input').forEach((c) => (c.checked = checked));
    saveGroups();
  };
  all.addEventListener('click', () => setAll(true));
  none.addEventListener('click', () => setAll(false));

  // one row per direction, each with its Test button
  const buttons = el('div', 'mtActions mtActionRows');
  buttons.append(
    actions(
      [
        { lang: 'meiToolboxTestButton', action: () => runConvert(true) },
        { lang: 'meiToolboxAttrToElButton', action: () => runConvert(false) },
      ],
      'mtActionRow'
    ),
    actions(
      [
        { lang: 'meiToolboxTestButton', action: () => runConvert(true, true) },
        { lang: 'meiToolboxElToAttrButton', action: () => runConvert(false, true) },
      ],
      'mtActionRow'
    )
  );
  content.appendChild(buttons);
  // scope (entire encoding or editor selection), shown in the sticky row of buttons
  // so that it remains visible
  buttons.prepend(scopeInfo(p));
  // disable action buttons when no group is selected
  const updateButtons = () => {
    const anySelected = selectedGroups().length > 0;
    buttons.querySelectorAll('button[data-enabled]').forEach((b) => (b.disabled = !anySelected));
  };
  group.addEventListener('change', updateButtons);
  allNone.addEventListener('click', updateButtons);
  updateButtons();

  function saveGroups() {
    save(storageKey.groups, selectedGroups().join(','));
    updateOptionsSummary('convert');
  }
} // buildConvertOptions()

function buildRenumberOptions(content, p) {
  // one row per option (label left, control right), striped as in the settings panel
  const group = el('div', 'mtOptionGroup mtStriped');

  // start number
  const startLabel = el('label', 'mtOption mtRow');
  const startText = el('span');
  startText.dataset.lang = 'renumberMeasuresStartNumber';
  const start = el('input', 'mtNumber');
  start.type = 'number';
  start.id = 'mtRenumberStartNumber';
  start.value = load(storageKey.startNumber, '1');
  start.addEventListener('change', () => {
    save(storageKey.startNumber, start.value);
    updateOptionsSummary('renumber');
  });
  startLabel.append(startText, start);
  group.appendChild(startLabel);

  // restart at each mdiv
  const restartLabel = el('label', 'mtOption mtRow');
  const restartText = el('span');
  restartText.dataset.lang = langKeyOf(storageKey.restartAtMdiv);
  const restart = el('input');
  restart.type = 'checkbox';
  restart.id = 'mtRenumber-restartAtMdiv';
  restart.checked = load(storageKey.restartAtMdiv, 'false') === 'true';
  restart.addEventListener('change', () => save(storageKey.restartAtMdiv, restart.checked));
  restartLabel.append(restartText, restart);
  group.appendChild(restartLabel);

  // incomplete measures and endings: checkbox "continue across" and suffix select (when not continuing)
  for (const [checkboxKey, selectKey, values] of [
    ['continueAcrossIncompleteMeasures', 'suffixAtMeasures', suffixAtMeasuresValues],
    ['continueAcrossEndings', 'suffixAtEndings', suffixAtEndingsValues],
  ]) {
    const checkboxLabel = el('label', 'mtOption mtRow');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'mtRenumber-' + checkboxKey;
    checkbox.checked = load(storageKey[checkboxKey], 'false') === 'true';
    const checkboxText = el('span');
    checkboxText.dataset.lang = langKeyOf(storageKey[checkboxKey]);
    checkboxLabel.append(checkboxText, checkbox);

    const selectLabel = el('label', 'mtOption mtRow');
    const selectText = el('span');
    selectText.dataset.lang = langKeyOf(storageKey[selectKey]);
    const select = el('select');
    select.id = 'mtRenumber-' + selectKey;
    select.dataset.langLabels = langKeyOf(storageKey[selectKey]);
    values.forEach((value) => {
      const option = el('option', '', value);
      option.value = value;
      select.appendChild(option);
    });
    const storedValue = load(storageKey[selectKey], selectKey === 'suffixAtEndings' ? 'a/b/c' : 'none');
    select.value = values.includes(storedValue) ? storedValue : values[0];
    selectLabel.append(selectText, select);

    const updateDisabled = () => {
      select.disabled = checkbox.checked;
      selectLabel.classList.toggle('disabled', checkbox.checked);
    };
    checkbox.addEventListener('change', () => {
      save(storageKey[checkboxKey], checkbox.checked);
      updateDisabled();
      updateOptionsSummary('renumber');
    });
    select.addEventListener('change', () => save(storageKey[selectKey], select.value));
    updateDisabled();
    group.append(checkboxLabel, selectLabel);
  }
  content.appendChild(group);
  content.appendChild(
    actions([
      { lang: 'meiToolboxTestButton', action: () => runRenumber(false) },
      { lang: 'meiToolboxRenumberButton', action: () => runRenumber(true) },
    ])
  );
} // buildRenumberOptions()

function buildIdsOptions(content, p) {
  const stored = load(storageKey.idMode, 'add');
  const group = el('div', 'mtOptionGroup');
  for (const [mode, langKey] of Object.entries(idModes)) {
    const label = el('label', 'mtOption mtChoice');
    const radio = el('input');
    radio.type = 'radio';
    radio.name = 'mtIdMode';
    radio.value = mode;
    radio.checked = mode === stored;
    radio.addEventListener('change', () => {
      save(storageKey.idMode, mode);
      updateOptionsSummary('ids');
    });
    const text = el('span');
    text.dataset.lang = langKey;
    text.dataset.split = 'block';
    label.append(radio, text);
    // 'add' and 'remove' have a keyboard shortcut; state it where it acts
    const shortcut = shortcutHtml(mode === 'add' ? 'addIds' : mode === 'remove' ? 'removeIds' : '');
    if (shortcut) label.appendChild(shortcut);
    group.appendChild(label);
  }
  content.appendChild(group);

  // the xml:id style is a setting of the settings panel; mirror it here, where new
  // xml:ids are made, and keep both controls in sync
  const styleSelect = document.getElementById('selectIdStyle');
  if (styleSelect) {
    const styleRow = el('label', 'mtOption mtRow');
    const styleText = el('span');
    styleText.dataset.lang = 'selectIdStyle';
    const mirror = el('select');
    mirror.id = 'mtIdStyle';
    Array.from(styleSelect.options).forEach((o) => {
      const option = el('option', '', o.textContent);
      option.value = o.value;
      option.title = o.title;
      mirror.appendChild(option);
    });
    mirror.value = styleSelect.value;
    // the settings panel listens for 'input', so that is what keeps it in sync
    mirror.addEventListener('change', () => {
      styleSelect.value = mirror.value;
      styleSelect.dispatchEvent(new Event('input', { bubbles: true }));
      updateOptionsSummary('ids');
    });
    styleSelect.addEventListener('input', () => {
      mirror.value = styleSelect.value;
      updateOptionsSummary('ids');
    });
    styleRow.append(styleText, mirror);
    content.appendChild(el('div', 'mtOptionGroup mtStriped')).appendChild(styleRow);
  }

  const buttons = actions([{ lang: 'meiToolboxIdsButton', action: () => runIds() }]);
  buttons.prepend(scopeInfo(p));
  content.appendChild(buttons);
} // buildIdsOptions()

function buildFacsimileOptions(content, p) {
  const info = el('div', 'mtMethodNote');
  info.dataset.lang = 'meiToolboxFacsimileInfo';
  content.appendChild(info);
  content.appendChild(
    actions([
      { lang: 'meiToolboxFacsimileIngest', action: () => runFacsimile('ingest') },
      { lang: 'meiToolboxFacsimileAddMissing', action: () => runFacsimile('empty') },
    ])
  );
} // buildFacsimileOptions()

function buildReformatOptions(content, p) {
  // One block per method, each with its own button: the attribute order below only
  // applies to the XML parser, which writes the encoding itself. Verovio writes it
  // from its own representation and is not influenced by anything set here.
  const verovio = methodBlock(content, 'meiToolboxReformatVerovio');
  verovio.body.appendChild(el('div', 'mtMethodNote')).dataset.lang = 'meiToolboxReformatVerovioNote';
  verovio.body.appendChild(
    actions([{ lang: 'meiToolboxReformatVerovio', action: () => runReformat('verovio') }])
  );

  const xml = methodBlock(content, 'meiToolboxReformatXml');
  const group = el('div', 'mtOptionGroup mtStriped');

  // attribute order: preset select, plus a pattern field when 'custom' is chosen
  const presetRow = el('label', 'mtOption mtRow');
  const presetText = el('span');
  presetText.dataset.lang = 'meiToolboxAttributeOrder';
  const preset = el('select');
  preset.id = 'mtAttributeOrderPreset';
  preset.dataset.langLabels = 'meiToolboxAttributeOrder';
  Object.keys(attributeOrderPresets).forEach((value) => {
    const option = el('option', '', value);
    option.value = value;
    preset.appendChild(option);
  });
  const storedPreset = load(storageKey.attributeOrderPreset, defaultAttributeOrderPreset);
  preset.value = storedPreset in attributeOrderPresets ? storedPreset : defaultAttributeOrderPreset;
  presetRow.append(presetText, preset);

  const patternRow = el('label', 'mtOption mtRow');
  const patternText = el('span');
  patternText.dataset.lang = 'meiToolboxAttributeOrderPattern';
  const pattern = el('input', 'mtPattern');
  pattern.type = 'text';
  pattern.id = 'mtAttributeOrderPattern';
  pattern.spellcheck = false;
  pattern.value = load(storageKey.attributeOrderPattern, defaultAttributeOrderPattern);
  patternRow.append(patternText, pattern);

  // live preview of the resulting attribute order on an example element
  const preview = el('div', 'mtPreview');
  const updatePreview = () => {
    patternRow.style.display = preset.value === 'custom' ? '' : 'none';
    preview.innerHTML = attributeOrderPreview();
  };
  preset.addEventListener('change', () => {
    save(storageKey.attributeOrderPreset, preset.value);
    applyAttributeOrder();
    updatePreview();
    updateOptionsSummary('reformat');
  });
  pattern.addEventListener('input', () => {
    save(storageKey.attributeOrderPattern, pattern.value);
    applyAttributeOrder();
    updatePreview();
    updateOptionsSummary('reformat');
  });
  group.append(presetRow, patternRow);
  xml.body.append(group, preview);
  p.updatePreview = updatePreview;
  updatePreview();

  xml.body.appendChild(
    actions([{ lang: 'meiToolboxReformatXml', action: () => runReformat('xml'), command: 'reformatEncoding' }])
  );
} // buildReformatOptions()

function buildTransposeOptions(content, p) {
  const info = el('div', 'mtMethodNote');
  info.dataset.lang = 'meiToolboxTransposeInfo';
  content.appendChild(info);

  // one row per mode, the radio choosing it and its select at the right edge; the
  // select of the mode not chosen is disabled, so that it is visible what applies
  const storedMode = load(storageKey.transposeMode, 'key');
  const group = el('div', 'mtOptionGroup');
  const selects = {};
  const radios = {};
  const updateMode = () => {
    for (const mode of Object.keys(transposeModes)) selects[mode].disabled = !radios[mode].checked;
  };
  for (const [mode, { store, values, fallback }] of Object.entries(transposeModes)) {
    const langKey = langKeyOf(storageKey[store]);
    const label = el('label', 'mtOption mtChoice');
    const radio = el('input');
    radio.type = 'radio';
    radio.name = 'mtTransposeMode';
    radio.value = mode;
    radio.checked = mode === storedMode;
    const text = el('span');
    text.dataset.lang = langKey;
    const select = el('select');
    select.id = 'mtTranspose-' + mode;
    select.dataset.langLabels = langKey;
    values.forEach((value) => {
      const option = el('option', '', value);
      option.value = value;
      select.appendChild(option);
    });
    const storedValue = load(storageKey[store], fallback);
    select.value = values.includes(storedValue) ? storedValue : fallback;
    select.addEventListener('change', () => {
      save(storageKey[store], select.value);
      updateOptionsSummary('transpose');
    });
    radio.addEventListener('change', () => {
      save(storageKey.transposeMode, mode);
      updateMode();
      updateOptionsSummary('transpose');
    });
    label.append(radio, text, select);
    group.appendChild(label);
    selects[mode] = select;
    radios[mode] = radio;
  }
  updateMode();
  content.appendChild(group);

  // pitch direction, applying to both modes
  const directionGroup = el('div', 'mtOptionGroup mtStriped');
  const directionRow = el('label', 'mtOption mtRow');
  const directionText = el('span');
  directionText.dataset.lang = langKeyOf(storageKey.transposeDirection);
  const direction = el('select');
  direction.id = 'mtTransposeDirection';
  direction.dataset.langLabels = langKeyOf(storageKey.transposeDirection);
  transposeDirectionValues.forEach((value) => {
    const option = el('option', '', value);
    option.value = value;
    direction.appendChild(option);
  });
  const storedDirection = load(storageKey.transposeDirection, '+');
  direction.value = transposeDirectionValues.includes(storedDirection) ? storedDirection : '+';
  direction.addEventListener('change', () => {
    save(storageKey.transposeDirection, direction.value);
    updateOptionsSummary('transpose');
  });
  directionRow.append(directionText, direction);
  directionGroup.appendChild(directionRow);

  // directive in the pgHead, naming the key transposed to and the original one
  const directiveRow = el('label', 'mtOption mtRow');
  const directiveText = el('span');
  directiveText.dataset.lang = 'meiToolboxTransposeAddDirective';
  const directive = el('input');
  directive.type = 'checkbox';
  directive.id = 'mtTransposeDirective';
  directive.checked = load(storageKey.transposeDirective, 'false') === 'true';
  directive.addEventListener('change', () => save(storageKey.transposeDirective, directive.checked));
  directiveRow.append(directiveText, directive);
  directionGroup.appendChild(directiveRow);
  content.appendChild(directionGroup);

  content.appendChild(
    actions([
      { lang: 'meiToolboxTransposeReset', action: () => runTranspose(true) },
      { lang: 'transposeButton', action: () => runTranspose(false) },
    ])
  );
} // buildTransposeOptions()

/**
 * Adds a titled block to the options of a tab, for options that apply to one
 * method only. Returns the block and its body, to be filled by the caller.
 * @param {Element} content options content of the tab
 * @param {string} langKey language key of the block title
 * @returns {{block: Element, body: Element}}
 */
function methodBlock(content, langKey) {
  const block = el('div', 'mtMethod');
  const title = el('div', 'mtMethodTitle');
  title.dataset.lang = langKey;
  const body = el('div', 'mtMethodBody');
  block.append(title, body);
  content.appendChild(block);
  return { block, body };
} // methodBlock()

/**
 * Shows the configured attribute order on an example element, so that the effect of
 * a pattern can be seen before reformatting.
 * @returns {string} html
 */
function attributeOrderPreview() {
  const example = {
    'xml:id': 'note-1',
    dots: '1',
    dur: '4',
    label: 'motto',
    n: '3',
    oct: '4',
    pname: 'c',
    'stem.dir': 'up',
    type: 'ed',
  };
  const order = dutils.parseAttributeOrder(attributeOrderPattern());
  const names = Object.keys(example);
  const doc = document.implementation.createDocument(null, 'note', null);
  names.forEach((name) => doc.documentElement.setAttribute(name, example[name]));
  dutils.sortNodeAttributes(doc.documentElement, order);
  const sorted = Array.from(doc.documentElement.attributes).map((a) => a.name + '="' + esc(example[a.name]) + '"');
  return '<code>&lt;note ' + sorted.join(' ') + '/&gt;</code>';
} // attributeOrderPreview()

/**
 * Scope line (entire encoding or editor selection) for tabs acting on a selection;
 * keeps itself up to date and is shown with the action buttons.
 * @param {Object} p pane
 * @returns {Element}
 */
function scopeInfo(p) {
  const scope = el('div', 'mtScope');
  p.updateScope = () => {
    if (cm.somethingSelected()) {
      scope.textContent = t('convertScopeSelection', 'Scope: selection, lines {from}-{to}')
        .replace('{from}', cm.getCursor('from').line + 1)
        .replace('{to}', cm.getCursor('to').line + 1);
      scope.classList.add('mtScopeSelection');
    } else {
      scope.textContent = t('convertScopeAll', 'Scope: entire encoding');
      scope.classList.remove('mtScopeSelection');
    }
  };
  p.updateScope();
  cm.on('cursorActivity', p.updateScope);
  return scope;
} // scopeInfo()

/**
 * Row of action buttons; buttons without action are disabled (not yet implemented).
 * A button with `command` also shows the keyboard shortcut that command is bound to
 * in the keymap, so the shortcut is stated where the action is offered.
 * @param {Array<{lang: string, action?: Function, command?: string}>} buttons
 * @param {string} className
 * @returns {Element}
 */
function actions(buttons, className = 'mtActions') {
  const div = el('div', className);
  for (const b of buttons) {
    const button = el('button', 'btn');
    button.dataset.lang = b.lang;
    if (b.action) {
      button.dataset.enabled = 'true';
      button.addEventListener('click', b.action);
    } else {
      button.disabled = true;
    }
    const shortcut = b.command && shortcutHtml(b.command);
    if (shortcut) button.appendChild(shortcut);
    div.appendChild(button);
  }
  return div;
} // actions()

/**
 * The keyboard shortcut of a command as the menu bar writes it, so that
 * addModifyerKeys() renders it with the same symbols. Returns null when the command
 * has no shortcut, so that nothing has to be kept in sync with the keymap by hand.
 * @param {string} commandName name of a method of `cmd`, e.g. 'addIds'
 * @returns {Element|null}
 */
function shortcutHtml(commandName) {
  const shortcut = shortcutForCommand(commandName);
  if (!shortcut) return null;
  const span = el('span', ['keyShortCut', ...shortcut.classes].join(' '), shortcut.key);
  return span;
} // shortcutHtml()

// ############################################################################
// internal helpers
// ############################################################################

function selectTab(tab) {
  if (!panes[tab]) return;
  activeTab = tab;
  panel.querySelectorAll('.mtTab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  tabs.forEach((tb) => panes[tb].pane.classList.toggle('active', tb === tab));
} // selectTab()

function clearResults(p) {
  p.list.innerHTML = '';
  p.total = 0;
  p.shown = 0;
  p.fixable = 0;
  p.fixed = 0;
} // clearResults()

function showPlaceholder(p) {
  const div = el('div', 'validation-item mtInfo');
  div.dataset.lang = 'meiToolboxNoResults';
  div.textContent = t('meiToolboxNoResults');
  p.list.appendChild(div);
  updateCounts(p);
} // showPlaceholder()

// adds entries in time slices to keep the GUI responsive for long lists
function addEntriesSliced(tab, entries, onDone) {
  let i = 0;
  const addSlice = () => {
    const t0 = performance.now();
    while (i < entries.length && performance.now() - t0 < BUDGET_MS) addEntry(entries[i++], tab);
    if (i < entries.length && !v.toolboxAbort) setTimeout(addSlice, 0);
    else onDone();
  };
  addSlice();
} // addEntriesSliced()

// result entries of the attribute conversion: unconverted attributes first, then conversions
function conversionEntries(result, test) {
  const idOf = (el) => el.getAttribute('xml:id') || '';
  const inDocumentOrder = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  const entries = [];
  result.warnings
    .sort((a, b) => inDocumentOrder(a.element, b.element))
    .forEach((w) =>
      entries.push({
        xmlId: idOf(w.element),
        className: 'mtWarning',
        html: '&#9888; <b>' + w.element.localName + '</b>' + idHtml(w.element) + ': ' + esc(w.message),
      })
    );
  result.changes
    .sort((a, b) => inDocumentOrder(a.sources[0].element, b.sources[0].element))
    .forEach((c) => {
      // in test mode, new elements are not in the editor: jump to the element carrying the attribute
      const target =
        (!test && c.targets.find((tg) => idOf(tg))) || c.sources.find((s) => idOf(s.element))?.element;
      entries.push({
        xmlId: target ? idOf(target) : '',
        html:
          c.sources
            .map((s) => '<b>' + s.element.localName + '</b>' + idHtml(s.element) + ' ' + esc(s.attributes))
            .join(', ') +
          ' &rarr; ' +
          c.targets.map((tg) => '<b>&lt;' + tg.localName + '&gt;</b>' + (test ? '' : idHtml(tg))).join(', '),
      });
    });
  return entries;
} // conversionEntries()

// result entries of the reverse conversion: unconverted elements first, then conversions
function reverseConversionEntries(result, test) {
  const idOf = (el) => el.getAttribute('xml:id') || '';
  const inDocumentOrder = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  const entries = [];
  result.warnings
    .sort((a, b) => inDocumentOrder(a.element, b.element))
    .forEach((w) =>
      entries.push({
        xmlId: idOf(w.element) || idOf(w.element.closest('[*|id]') || w.element),
        className: 'mtWarning',
        html: '&#9888; <b>&lt;' + w.element.localName + '&gt;</b>' + idHtml(w.element) + ': ' + esc(w.message),
      })
    );
  result.changes
    .sort((a, b) => inDocumentOrder(a.targets[0].element, b.targets[0].element))
    .forEach((c) => {
      // in test mode, the elements are still in the editor; otherwise jump to the element receiving the attribute
      const target =
        (test && c.removed.map((r) => r.element).find((el) => idOf(el))) || c.targets.find((tg) => idOf(tg.element))?.element;
      entries.push({
        xmlId: target ? idOf(target) : '',
        html:
          c.removed.map((r) => '<b>&lt;' + r.element.localName + '&gt;</b>' + idHtml(r.element)).join(', ') +
          ' &rarr; ' +
          c.targets.map((tg) => '<b>' + tg.element.localName + '</b>' + idHtml(tg.element) + ' ' + esc(tg.attributes)).join(', '),
      });
    });
  return entries;
} // reverseConversionEntries()

function shownEntries(p) {
  return Array.from(p.list.querySelectorAll('.mtEntry')).filter((div) => div.style.display !== 'none');
}

function applyFilter(p) {
  p.filterText = p.filter.value.trim().toLowerCase();
  p.shown = 0;
  p.list.querySelectorAll('.mtEntry').forEach((div) => {
    const match = !p.filterText || div.textContent.toLowerCase().includes(p.filterText);
    div.style.display = match ? '' : 'none';
    div.classList.toggle('odd', match && p.shown % 2 === 1);
    if (match) p.shown++;
  });
  updateCounts(p);
} // applyFilter()

// updates the counter and the Fix/Ignore buttons of the result header
function updateCounts(p) {
  const filtered = !!p.filterText;
  let text = filtered ? p.shown + ' / ' + p.total : p.total > 0 ? String(p.total) : '';
  if (p.fixed > 0) text += ' · ' + p.fixed + ' ✓';
  p.count.textContent = text;
  const openFixes = p.fixable > 0 ? shownEntries(p).filter((d) => d.querySelector('button.fix:not(:disabled)')) : [];
  p.fixAll.style.display = p.fixable > 0 ? '' : 'none';
  p.ignoreAll.style.display = p.fixable > 0 ? '' : 'none';
  p.fixAll.disabled = openFixes.length === 0 || running;
  p.ignoreAll.disabled = openFixes.length === 0 || running;
  p.fixAll.textContent = filtered
    ? t('codeCheckerFixShown', 'Fix {n} shown').replace('{n}', openFixes.length)
    : t('codeCheckerFixAll', 'Fix all');
  p.ignoreAll.textContent = filtered
    ? t('codeCheckerIgnoreShown', 'Ignore {n} shown').replace('{n}', openFixes.length)
    : t('codeCheckerIgnoreAll', 'Ignore all');
} // updateCounts()

/**
 * Applies the fixes of all shown (not filtered, not ignored) entries in time
 * slices, each as one CodeMirror operation. Editor change handling is blocked
 * while fixing and run once at the end.
 */
function fixAllShown(p) {
  const buttons = shownEntries(p)
    .map((d) => d.querySelector('button.fix'))
    .filter((b) => b && !b.disabled);
  if (buttons.length === 0) return;
  let i = 0;
  running = true;
  runTab = p.tab;
  p.fixingAll = true;
  v.toolboxAbort = false;
  p.stop.disabled = false;
  p.pane.classList.add('running');
  updateCounts(p);
  cm.blockChanges = true;
  const applyFixes = () => {
    try {
      cm.operation(() => {
        const t0 = performance.now();
        while (i < buttons.length) {
          buttons[i++].applyFix();
          if (performance.now() - t0 > BUDGET_MS) break;
        }
        v.allowCursorActivity = false; // fix callbacks re-enable it; keep it off until done
      });
    } catch (err) {
      console.error('Fix all: error applying fix ' + i + ':', err);
      i = buttons.length;
    }
    if (i < buttons.length && !v.toolboxAbort) {
      setTimeout(applyFixes, 0);
    } else {
      cm.blockChanges = false;
      v.allowCursorActivity = true;
      running = false;
      p.fixingAll = false;
      p.pane.classList.remove('running');
      updateCounts(p);
      handleEditorChanges();
    }
  };
  setTimeout(applyFixes, 0);
} // fixAllShown()

// marks results of other tabs (and of finished runs) as outdated when the encoding changes
function onEditorChanges() {
  for (const tab of tabs) {
    const p = panes[tab];
    if (!p.hasResults || tab === ownChangeTab || (running && tab === runTab)) continue;
    p.pane.classList.add('stale');
  }
} // onEditorChanges()

// one-line description of the options, shown when the options are folded away
function updateOptionsSummary(tab) {
  const p = panes[tab];
  let text = '';
  switch (tab) {
    case 'check': {
      const type = p.content.querySelector('input[name="mtCheckType"]:checked')?.value;
      text = type ? t(checkTypes[type]) : '';
      break;
    }
    case 'convert':
      text = t('meiToolboxGroupsSelected', '{n} of {total} attribute groups')
        .replace('{n}', selectedGroups().length)
        .replace('{total}', conversionGroups.length);
      break;
    case 'renumber':
      text = t('renumberMeasuresStartNumber', 'Start number') + ': ' + renumberOptions().startNumber;
      break;
    case 'ids': {
      const mode = p.content.querySelector('input[name="mtIdMode"]:checked')?.value;
      text = mode ? t(idModes[mode]) : '';
      const style = document.getElementById('mtIdStyle');
      if (mode !== 'remove' && style) text += ' \u00b7 ' + style.value;
      break;
    }
    case 'facsimile':
      text = t('meiToolboxFacsimileInfo', '');
      break;
    case 'transpose':
      text = transposeSummary();
      break;
    case 'reformat': {
      const preset = document.getElementById('mtAttributeOrderPreset');
      const labels = translator?.lang?.meiToolboxAttributeOrder?.labels;
      const index = preset ? Object.keys(attributeOrderPresets).indexOf(preset.value) : -1;
      text =
        t('meiToolboxAttributeOrder', 'Attribute order') +
        ': ' +
        (labels && index >= 0 ? labels[index] : attributeOrderPattern() || '\u2014');
      break;
    }
  }
  p.summaryText.textContent = text;
} // updateOptionsSummary()

function selectedGroups() {
  return Array.from(panes.convert.content.querySelectorAll('input[name="mtConvertGroup"]:checked')).map(
    (c) => c.value
  );
}

/**
 * The Verovio transpose option built from the Transpose tab: the pitch direction
 * followed by the key or the interval of the mode chosen, e.g. '+c' or '-P5'.
 * @returns {string}
 */
function transposeOption() {
  const mode = transposeMode();
  return (document.getElementById('mtTransposeDirection')?.value ?? '') + (transposeSelect(mode)?.value || '');
}

// what the Transpose tab is set to, in words: the key or interval, and the direction
function transposeSummary() {
  const label = (select) => select?.selectedOptions[0]?.textContent || '';
  return [label(transposeSelect(transposeMode())), label(document.getElementById('mtTransposeDirection'))]
    .filter(Boolean)
    .join(' \u00b7 ');
}

/**
 * The text of the transposition directive: the key the notation is transposed to and
 * the key of the encoding, both named as the Transpose tab names them. Where the mode
 * of the encoding is known, only that half of a label such as 'C major / A minor' is
 * used. When the key cannot be told (an unreadable key signature, or an interval
 * leading beyond the fifteen keys), it states what was transposed by instead.
 * @returns {string}
 */
function directiveText() {
  const labels = translator?.lang?.transposeKey?.labels;
  const original = encodingKeyFifths();
  const target = targetKeyFifths(original);
  // every label names the major key and its relative minor, separated by a slash;
  // transposing keeps the mode, so the same half of the label applies to both keys
  const mode = encodingKeyMode();
  const half = mode === 'major' ? 0 : mode === 'minor' ? 1 : -1;
  const keyName = (fifths) => {
    if (!labels || fifths === null || Math.abs(fifths) > 7) return '';
    const label = labels[7 - fifths];
    const parts = label.split(' / ');
    return half >= 0 && parts.length === 2 ? parts[half] : label;
  };
  if (!keyName(original) || !keyName(target)) {
    return t('meiToolboxTransposeDirectiveUnknown', 'Transposed: {what}').replace('{what}', transposeSummary());
  }
  return t('meiToolboxTransposeDirectiveText', 'Transposed to {new}\noriginal: {original}')
    .replace('{new}', keyName(target))
    .replace('{original}', keyName(original));
} // directiveText()

/**
 * Whether the encoding is in a major or a minor key: what it says itself (@key.mode up
 * to MEI 4.0.1, keySig@mode from MEI 5.0), or else what the music shows. The two keys a
 * key signature stands for have different tonics, so the note the music ends on tells
 * them apart: the lowest note of the last measure, which is the bass of the final
 * chord. Anything else leaves the mode open, and both keys are named.
 * @returns {string} 'major', 'minor' or '' when it cannot be told
 */
function encodingKeyMode() {
  const stated = v.xmlDoc?.querySelector('[key\\.mode], keySig[mode]');
  const mode = stated?.getAttribute('key.mode') || stated?.getAttribute('mode');
  if (mode === 'major' || mode === 'minor') return mode;

  const fifths = encodingKeyFifths();
  if (fifths === null) return '';
  const finalNote = lowestNoteOfLastMeasure();
  if (!finalNote) return '';
  // the tonics on the line of fifths: the major one where the key signature stands,
  // the minor one three fifths further (C major 0 and A minor 3, G major 1 and E minor 4)
  const letterAt = (f) => 'fcgdaeb'[(((f + 1) % 7) + 7) % 7];
  const pname = finalNote.getAttribute('pname');
  if (pname === letterAt(fifths)) return 'major';
  if (pname === letterAt(fifths + 3)) return 'minor';
  return '';
} // encodingKeyMode()

/**
 * The lowest note of the last measure of the score, by written pitch: deep enough to
 * be the bass of the final chord, and read without accidentals, which the two tonics
 * of a key signature do not need to be told apart (their note names already differ).
 * @returns {Element|null}
 */
function lowestNoteOfLastMeasure() {
  const measures = v.xmlDoc?.querySelectorAll('measure');
  const notes = measures?.length ? Array.from(measures[measures.length - 1].querySelectorAll('note')) : [];
  const height = (note) =>
    parseInt(note.getAttribute('oct'), 10) * 7 + 'cdefgab'.indexOf(note.getAttribute('pname'));
  return notes
    .filter((note) => note.getAttribute('pname') && Number.isFinite(height(note)))
    .reduce((lowest, note) => (!lowest || height(note) < height(lowest) ? note : lowest), null);
} // lowestNoteOfLastMeasure()

/**
 * The key the notation is transposed to, on the line of fifths: the key chosen, or the
 * key of the encoding moved by the interval chosen (downwards for a falling interval).
 * @param {number|null} original fifths of the key of the encoding
 * @returns {number|null} null when it cannot be told
 */
function targetKeyFifths(original) {
  if (transposeMode() === 'key') return transposeKeyFifths(transposeSelect('key')?.value);
  const fifths = intervalFifths(transposeSelect('interval')?.value);
  if (fifths === null || original === null) return null;
  // 'closest' (an empty direction) transposes upwards, as a Verovio interval without a sign does
  return original + (document.getElementById('mtTransposeDirection')?.value === '-' ? -fifths : fifths);
} // targetKeyFifths()

/**
 * Where an interval moves the key signature on the line of fifths when the music is
 * transposed up by it: 'P5' → 1 (a sharp more), 'm3' → -3. Unison, fourth, fifth and
 * octave are perfectable (P), the other degrees major or minor.
 * @param {string} name interval as the Verovio transpose option writes it, e.g. 'M2'
 * @returns {number|null} null when the name cannot be read
 */
function intervalFifths(name) {
  const match = /^([PMmAd])(\d+)$/.exec(name || '');
  if (!match) return null;
  const [, quality, number] = match;
  const degree = (parseInt(number, 10) - 1) % 7;
  const perfectable = [0, 3, 4].includes(degree);
  if (perfectable === 'Mm'.includes(quality)) return null; // M/m only on the others, P only here
  return fifthsOfDegree[degree] + fifthsOfQuality[quality] - (!perfectable && quality === 'd' ? 7 : 0);
} // intervalFifths()

/**
 * The key signature the encoding starts with, on the line of fifths (2 for '2s', -3
 * for '3f'). An encoding that states none is read as C major, as Verovio renders it.
 * @returns {number|null} null when the key signature cannot be read ('mixed')
 */
function encodingKeyFifths() {
  // '[keysig]' is MEI >= 5.0, '[key.sig]' up to MEI 4.0.1, '[sig]' the <keySig> element; the
  // first of them in document order is the one the score starts with
  const element = v.xmlDoc?.querySelector(
    'scoreDef[key\\.sig], scoreDef[keysig], staffDef[key\\.sig], staffDef[keysig], keySig[sig]'
  );
  if (!element) return 0;
  const sig = element.getAttribute('key.sig') || element.getAttribute('keysig') || element.getAttribute('sig');
  if (sig === '0') return 0;
  const match = /^(\d+)([fs])$/.exec(sig || '');
  return match ? parseInt(match[1], 10) * (match[2] === 's' ? 1 : -1) : null;
} // encodingKeyFifths()

function transposeMode() {
  return panes.transpose?.content.querySelector('input[name="mtTransposeMode"]:checked')?.value || 'key';
}

function transposeSelect(mode) {
  return document.getElementById('mtTranspose-' + mode);
}

function renumberOptions() {
  const value = (id) => document.getElementById('mtRenumber-' + id);
  return {
    startNumber: parseInt(document.getElementById('mtRenumberStartNumber').value, 10) || 0,
    continueAcrossIncompleteMeasures: value('continueAcrossIncompleteMeasures').checked,
    suffixAtMeasures: value('suffixAtMeasures').value,
    continueAcrossEndings: value('continueAcrossEndings').checked,
    suffixAtEndings: value('suffixAtEndings').value,
    restartAtMdiv: value('restartAtMdiv').checked,
  };
} // renumberOptions()

// sets texts, titles, placeholders and select labels of elements with data-lang* attributes
function applyTexts() {
  if (!panel) return;
  const lang = translator?.lang || {};
  panel.querySelectorAll('[data-lang]').forEach((elm) => {
    const item = lang[elm.dataset.lang];
    if (!item) return;
    if ('text' in item) {
      // optionally show a trailing '(...)' as detail, e.g. 'Ties (@tie)'
      // a keyboard shortcut shown inside a translated element survives the new text
      const shortcut = elm.querySelector(':scope > .keyShortCut');
      const m = elm.dataset.split && item.text.match(/^(.*?)\s*[(（](.*)[)）]\s*$/);
      if (m) {
        elm.textContent = m[1];
        const detail = el('span', 'mtDetail mtDetail-' + elm.dataset.split, m[2]);
        elm.appendChild(detail);
      } else {
        elm.textContent = item.text;
      }
      if (shortcut) elm.appendChild(shortcut);
    }
    if ('description' in item) elm.title = item.description;
  });
  panel.querySelectorAll('[data-lang-placeholder]').forEach((elm) => {
    elm.placeholder = lang[elm.dataset.langPlaceholder]?.text || '';
  });
  panel.querySelectorAll('[data-lang-title]').forEach((elm) => {
    elm.title = lang[elm.dataset.langTitle]?.text || '';
  });
  panel.querySelectorAll('select[data-lang-labels]').forEach((select) => {
    const labels = lang[select.dataset.langLabels]?.labels;
    if (labels) select.querySelectorAll('option').forEach((o, i) => i < labels.length && (o.textContent = labels[i]));
  });
  tabs.forEach((tab) => {
    updateOptionsSummary(tab);
    updateCounts(panes[tab]);
  });
  panes.convert?.updateScope?.();
  panes.ids?.updateScope?.();
  panes.reformat?.updatePreview?.();
} // applyTexts()

function t(key, fallback = '') {
  return translator?.lang?.[key]?.text ?? fallback;
}

function testSuffix() {
  return ' (' + t('meiToolboxTestButton', 'Test') + ')';
}

// language key of a renumber option = its storage key without 'mf-'
function langKeyOf(key) {
  return key.replace(/^mf-/, '');
}

function el(tag, className = '', text = '') {
  const elm = document.createElement(tag);
  if (className) elm.className = className;
  if (text) elm.textContent = text;
  return elm;
}

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function idHtml(elm) {
  const id = elm.getAttribute('xml:id');
  return id ? ' <code>#' + esc(id) + '</code>' : '';
}

function load(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (err) {
    return fallback;
  }
}

function save(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (err) {
    // storage not available
  }
}
