/**
 * Checker panel below the encoding, with three tabs:
 *   Check:    accid.ges, metcon and linked-element checks (mei-checker.js)
 *   Convert:  attributes to elements (attribute-conversion.js)
 *   Renumber: renumbering measures (utils.renumberMeasures())
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
import * as e from './editor.js';
import { cm, handleEditorChanges, translator, v } from './main.js';
import * as checker from './mei-checker.js';
import { codeCheckerHeight, setOrientation } from './resizer.js';
import * as utils from './utils.js';
import * as icon from '../css/icons.js';

const tabs = ['check', 'convert', 'renumber'];

// check types and the language keys of their labels
const checkTypes = {
  accidGes: 'checkerPanelCheckAccidGes',
  metcon: 'checkerPanelCheckMetcon',
  linked: 'checkerPanelCheckLinked',
};

// language keys of the labels of attribute groups (attribute-conversion.js)
const groupLabels = {
  accid: 'convertGroupAccid',
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

// localStorage keys (renumber keys as formerly used by the settings panel)
const storageKey = {
  checkType: 'mf-checkerPanelCheckType',
  groups: 'mf-convertAttributeGroups',
  startNumber: 'mf-renumberMeasuresStartNumber',
  continueAcrossIncompleteMeasures: 'mf-renumberMeasureContinueAcrossIncompleteMeasures',
  suffixAtMeasures: 'mf-renumberMeasuresUseSuffixAtMeasures',
  continueAcrossEndings: 'mf-renumberMeasuresContinueAcrossEndings',
  suffixAtEndings: 'mf-renumberMeasuresUseSuffixAtEndings',
};

const BUDGET_MS = 30; // work per time slice before yielding to the GUI

let panel = null; // #codeChecker element, once built
let activeTab = 'check';
let runTab = null; // tab of the current (or last) run
let running = false;
let ownChangeTab = null; // tab whose fix is currently changing the encoding
const panes = {}; // tab -> pane object, see buildPane()

// ############################################################################
// public functions
// ############################################################################

/**
 * Shows the checker panel (building it on first use) with the given tab
 * @param {string} tab 'check', 'convert' or 'renumber'
 */
export function openCheckerPanel(tab = activeTab) {
  if (!panel) build();
  if (panel.style.display !== 'flex') {
    panel.style.display = 'flex';
    panel.style.height = codeCheckerHeight + 'px';
    setOrientation(cm, '', '', v);
  }
  selectTab(tab);
} // openCheckerPanel()

/**
 * Hides the checker panel (results are kept)
 */
export function closeCheckerPanel() {
  if (!panel) return;
  panel.style.display = 'none';
  setOrientation(cm, '', '', v);
} // closeCheckerPanel()

/**
 * Hides the checker panel and clears all results (e.g., when a new encoding is loaded)
 */
export function resetCheckerPanel() {
  document.getElementById('codeCheckerResizer').style.display = 'none';
  document.getElementById('codeChecker').style.display = 'none';
  if (!panel) return;
  if (v) v.codeCheckerAbort = true; // stop a check in progress
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
} // resetCheckerPanel()

/**
 * Starts a new run in a tab: shows the panel at that tab, clears the result
 * list, shows the title and the Stop button, and folds the options away.
 * @param {string} tab
 * @param {string} title (html)
 */
export function startRun(tab, title) {
  openCheckerPanel(tab);
  const p = panes[tab];
  runTab = tab;
  running = true;
  v.codeCheckerAbort = false;
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
  div.classList.add('validation-item', 'ccEntry');
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
  const stopped = v.codeCheckerAbort;
  if (stopped) summary = (summary ? summary + ' ' : '') + t('codeCheckerStopped', 'Stopped.');
  p.summary.innerHTML = summary;
  p.title.parentElement.title = p.title.textContent + ' ' + p.summary.textContent; // full text, if truncated
  if (p.total === 0 && emptyText && !stopped) {
    const div = document.createElement('div');
    div.classList.add('validation-item', 'ccInfo');
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
  openCheckerPanel('check');
  const radios = panes.check.content.querySelectorAll('input[name="ccCheckType"]');
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
  openCheckerPanel('convert');
  const p = panes.convert;
  const groups = selectedGroups();
  if (reverse && !test && !confirmed) {
    confirmElementRemoval(groups, () => runConvert(test, reverse, true));
    return;
  }
  p.lastAction = () => runConvert(test, reverse);
  const key = reverse ? 'convertElementsToAttributes' : 'convertAttributesToElements';
  const title = reverse
    ? t('checkerPanelElToAttrButton', 'Elements → attributes')
    : t('checkerPanelAttrToElButton', 'Attributes → elements');
  const suffix = [];
  if (test) suffix.push(t('checkerPanelTestButton', 'Test'));
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
  openCheckerPanel('renumber');
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
        className: isChanged ? '' : 'ccMuted',
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
 * Elements converted to attributes lose their xml:ids. References within the file
 * are respected by the conversion, but links from elsewhere (other files, annotations
 * stored outside the file, facsimile tools, URLs) would break: the user confirms
 * the conversion in a prompt stating the number of affected xml:ids.
 * @param {Array<string>} groups
 * @param {Function} proceed called when confirmed
 */
function confirmElementRemoval(groups, proceed) {
  const test = e.convertAttributesToElements(v, cm, { groups, test: true, reverse: true, selection: true });
  const count = test.changes.flatMap((c) => c.removed).filter((r) => r.element.hasAttribute('xml:id')).length;
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
  panel = document.getElementById('codeChecker');
  panel.innerHTML = '';

  const header = el('div', 'ccHeader');
  for (const tab of tabs) {
    const button = el('button', 'ccTab');
    button.dataset.tab = tab;
    button.dataset.lang = 'checkerPanelTab' + tab[0].toUpperCase() + tab.slice(1);
    button.addEventListener('click', () => selectTab(tab));
    header.appendChild(button);
  }
  header.appendChild(el('span', 'ccSpacer'));
  const close = el('span', 'ccClose rightButton');
  close.innerHTML = '&times;';
  close.addEventListener('click', closeCheckerPanel);
  header.appendChild(close);
  panel.appendChild(header);

  buildPane('check', buildCheckOptions);
  buildPane('convert', buildConvertOptions);
  buildPane('renumber', buildRenumberOptions);

  applyTexts();
  document.addEventListener('mf-language-changed', applyTexts);
  cm.on('changes', onEditorChanges);
} // build()

/**
 * Builds the pane of a tab: options (with a one-line summary shown when folded)
 * and the result list with its header (title, filter, counter, buttons)
 */
function buildPane(tab, buildOptions) {
  const pane = el('div', 'ccPane');
  pane.dataset.tab = tab;

  // options
  const options = el('div', 'ccOptions');
  const optionsSummary = el('div', 'ccOptionsSummary');
  const summaryText = el('span', 'ccOptionsSummaryText');
  const rerun = el('button', 'btn ccRerun');
  rerun.dataset.lang = 'checkerPanelRunAgain';
  optionsSummary.append(el('span', 'ccFoldIcon', '▸'), summaryText, rerun);
  optionsSummary.addEventListener('click', (ev) => {
    if (!ev.target.closest('.ccRerun')) options.classList.remove('collapsed');
  });
  rerun.addEventListener('click', () => p.lastAction?.());
  const content = el('div', 'ccOptionsContent');
  const fold = el('span', 'ccFold', '▴');
  fold.dataset.langTitle = 'checkerPanelHideOptions';
  fold.addEventListener('click', () => options.classList.add('collapsed'));
  content.appendChild(fold);
  options.append(optionsSummary, content);

  // results
  const results = el('div', 'ccResults');
  const resultsHeader = el('div', 'ccResultsHeader');
  const titleWrapper = el('span', 'ccRunTitleWrapper');
  const title = el('span', 'ccRunTitle');
  const summary = el('span', 'ccRunSummary');
  const stale = el('span', 'ccStale');
  stale.dataset.lang = 'checkerPanelOutdated';
  titleWrapper.append(title, summary, stale);
  const filter = el('input', 'ccFilter');
  filter.type = 'search';
  filter.dataset.langPlaceholder = 'checkerPanelFilter';
  const count = el('span', 'ccCount');
  const fixAll = el('button', 'btn ccFixAll');
  const ignoreAll = el('button', 'btn ccIgnoreAll');
  const stop = el('button', 'btn ccStop');
  stop.dataset.lang = 'codeCheckerStop';
  resultsHeader.append(titleWrapper, filter, count, fixAll, ignoreAll, stop);
  const list = el('div', 'ccList');
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
    v.codeCheckerAbort = true;
    stop.disabled = true;
  });

  buildOptions(content, p);
  showPlaceholder(p);
} // buildPane()

function buildCheckOptions(content, p) {
  const stored = load(storageKey.checkType, 'accidGes');
  const group = el('div', 'ccOptionGroup');
  for (const [type, langKey] of Object.entries(checkTypes)) {
    const label = el('label', 'ccOption ccChoice');
    const radio = el('input');
    radio.type = 'radio';
    radio.name = 'ccCheckType';
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
  content.appendChild(actions([{ lang: 'checkerPanelCheckButton', action: () => runCheck() }]));
} // buildCheckOptions()

function buildConvertOptions(content, p) {
  const stored = load(storageKey.groups, null);
  const selected = stored === null ? conversionGroups : stored.split(',');
  const allNone = el('div', 'ccAllNone');
  const all = el('button', 'ccLink');
  all.dataset.lang = 'checkerPanelAll';
  const none = el('button', 'ccLink');
  none.dataset.lang = 'checkerPanelNone';
  allNone.append(all, el('span', '', ' | '), none);
  content.appendChild(allNone);

  const group = el('div', 'ccOptionGroup ccGrid');
  for (const g of conversionGroups) {
    const label = el('label', 'ccOption ccChoice');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'ccConvertGroup';
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
  const buttons = el('div', 'ccActions ccActionRows');
  buttons.append(
    actions(
      [
        { lang: 'checkerPanelTestButton', action: () => runConvert(true) },
        { lang: 'checkerPanelAttrToElButton', action: () => runConvert(false) },
      ],
      'ccActionRow'
    ),
    actions(
      [
        { lang: 'checkerPanelTestButton', action: () => runConvert(true, true) },
        { lang: 'checkerPanelElToAttrButton', action: () => runConvert(false, true) },
      ],
      'ccActionRow'
    )
  );
  content.appendChild(buttons);
  // scope (entire encoding or editor selection), shown in the sticky row of buttons
  // so that it remains visible
  const scope = el('div', 'ccScope');
  buttons.prepend(scope);
  p.updateScope = () => {
    if (cm.somethingSelected()) {
      scope.textContent = t('convertScopeSelection', 'Scope: selection, lines {from}–{to}')
        .replace('{from}', cm.getCursor('from').line + 1)
        .replace('{to}', cm.getCursor('to').line + 1);
      scope.classList.add('ccScopeSelection');
    } else {
      scope.textContent = t('convertScopeAll', 'Scope: entire encoding');
      scope.classList.remove('ccScopeSelection');
    }
  };
  p.updateScope();
  cm.on('cursorActivity', p.updateScope);
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
  const group = el('div', 'ccOptionGroup ccStriped');

  // start number
  const startLabel = el('label', 'ccOption ccRow');
  const startText = el('span');
  startText.dataset.lang = 'renumberMeasuresStartNumber';
  const start = el('input', 'ccNumber');
  start.type = 'number';
  start.id = 'ccRenumberStartNumber';
  start.value = load(storageKey.startNumber, '1');
  start.addEventListener('change', () => {
    save(storageKey.startNumber, start.value);
    updateOptionsSummary('renumber');
  });
  startLabel.append(startText, start);
  group.appendChild(startLabel);

  // incomplete measures and endings: checkbox "continue across" and suffix select (when not continuing)
  for (const [checkboxKey, selectKey, values] of [
    ['continueAcrossIncompleteMeasures', 'suffixAtMeasures', suffixAtMeasuresValues],
    ['continueAcrossEndings', 'suffixAtEndings', suffixAtEndingsValues],
  ]) {
    const checkboxLabel = el('label', 'ccOption ccRow');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'ccRenumber-' + checkboxKey;
    checkbox.checked = load(storageKey[checkboxKey], 'false') === 'true';
    const checkboxText = el('span');
    checkboxText.dataset.lang = langKeyOf(storageKey[checkboxKey]);
    checkboxLabel.append(checkboxText, checkbox);

    const selectLabel = el('label', 'ccOption ccRow');
    const selectText = el('span');
    selectText.dataset.lang = langKeyOf(storageKey[selectKey]);
    const select = el('select');
    select.id = 'ccRenumber-' + selectKey;
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
      { lang: 'checkerPanelTestButton', action: () => runRenumber(false) },
      { lang: 'checkerPanelRenumberButton', action: () => runRenumber(true) },
    ])
  );
} // buildRenumberOptions()

// row of action buttons; buttons without action are disabled (not yet implemented)
function actions(buttons, className = 'ccActions') {
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
    div.appendChild(button);
  }
  return div;
} // actions()

// ############################################################################
// internal helpers
// ############################################################################

function selectTab(tab) {
  if (!panes[tab]) return;
  activeTab = tab;
  panel.querySelectorAll('.ccTab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
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
  const div = el('div', 'validation-item ccInfo');
  div.dataset.lang = 'checkerPanelNoResults';
  div.textContent = t('checkerPanelNoResults');
  p.list.appendChild(div);
  updateCounts(p);
} // showPlaceholder()

// adds entries in time slices to keep the GUI responsive for long lists
function addEntriesSliced(tab, entries, onDone) {
  let i = 0;
  const addSlice = () => {
    const t0 = performance.now();
    while (i < entries.length && performance.now() - t0 < BUDGET_MS) addEntry(entries[i++], tab);
    if (i < entries.length && !v.codeCheckerAbort) setTimeout(addSlice, 0);
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
        className: 'ccWarning',
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
        className: 'ccWarning',
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
  return Array.from(p.list.querySelectorAll('.ccEntry')).filter((div) => div.style.display !== 'none');
}

function applyFilter(p) {
  p.filterText = p.filter.value.trim().toLowerCase();
  p.shown = 0;
  p.list.querySelectorAll('.ccEntry').forEach((div) => {
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
  v.codeCheckerAbort = false;
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
    if (i < buttons.length && !v.codeCheckerAbort) {
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
      const type = p.content.querySelector('input[name="ccCheckType"]:checked')?.value;
      text = type ? t(checkTypes[type]) : '';
      break;
    }
    case 'convert':
      text = t('checkerPanelGroupsSelected', '{n} of {total} attribute groups')
        .replace('{n}', selectedGroups().length)
        .replace('{total}', conversionGroups.length);
      break;
    case 'renumber':
      text = t('renumberMeasuresStartNumber', 'Start number') + ': ' + renumberOptions().startNumber;
      break;
  }
  p.summaryText.textContent = text;
} // updateOptionsSummary()

function selectedGroups() {
  return Array.from(panes.convert.content.querySelectorAll('input[name="ccConvertGroup"]:checked')).map(
    (c) => c.value
  );
}

function renumberOptions() {
  const value = (id) => document.getElementById('ccRenumber-' + id);
  return {
    startNumber: parseInt(document.getElementById('ccRenumberStartNumber').value, 10) || 0,
    continueAcrossIncompleteMeasures: value('continueAcrossIncompleteMeasures').checked,
    suffixAtMeasures: value('suffixAtMeasures').value,
    continueAcrossEndings: value('continueAcrossEndings').checked,
    suffixAtEndings: value('suffixAtEndings').value,
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
      const m = elm.dataset.split && item.text.match(/^(.*?)\s*[(（](.*)[)）]\s*$/);
      if (m) {
        elm.textContent = m[1];
        const detail = el('span', 'ccDetail ccDetail-' + elm.dataset.split, m[2]);
        elm.appendChild(detail);
      } else {
        elm.textContent = item.text;
      }
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
} // applyTexts()

function t(key, fallback = '') {
  return translator?.lang?.[key]?.text ?? fallback;
}

function testSuffix() {
  return ' (' + t('checkerPanelTestButton', 'Test') + ')';
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
