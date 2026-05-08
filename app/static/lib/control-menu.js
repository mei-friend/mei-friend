import * as icon from './../css/icons.js';
import { fontList, platform } from './defaults.js';
import { svgNameSpace } from './dom-utils.js';
import { translator } from './main.js';
import { createPageRangeSelector } from './page-range-selector.js';
import { choiceOrigRegOptions, choiceSicCorrOptions, substOptions } from './markup.js';

const overflowMenus = [];
let overflowGlobalHandlersAttached = false;

function hideOverflowContent(overflowContent) {
  overflowContent.style.visibility = 'hidden';
  overflowContent.style.opacity = '0';
  overflowContent.style.pointerEvents = 'none';
  overflowContent.dataset.open = 'false';
  overflowContent.setAttribute('aria-hidden', 'true');
}

function showOverflowContent(overflowContent) {
  overflowContent.style.visibility = 'visible';
  overflowContent.style.opacity = '1';
  overflowContent.style.pointerEvents = 'auto';
  overflowContent.dataset.open = 'true';
  overflowContent.setAttribute('aria-hidden', 'false');
}

export function hideAllOverflowContents(exceptContent = null) {
  overflowMenus.forEach(({ content }) => {
    if (content !== exceptContent) hideOverflowContent(content);
  });
}

function attachOverflowGlobalHandlers() {
  if (overflowGlobalHandlersAttached) return;

  document.addEventListener('click', (event) => {
    overflowMenus.forEach(({ icon, content }) => {
      if (content.dataset.open !== 'true') return;
      if (!content.contains(event.target) && !icon.contains(event.target)) {
        hideOverflowContent(content);
      }
    });
  });

  overflowGlobalHandlersAttached = true;
}

function registerOverflowMenu(overflowMenu) {
  const overflowIcon = overflowMenu.querySelector('.control-menu-overflow-icon');
  const overflowContent = overflowMenu.querySelector('.control-menu-overflow-content');
  if (!overflowIcon || !overflowContent) return;

  hideOverflowContent(overflowContent);
  overflowMenus.push({ icon: overflowIcon, content: overflowContent });

  overflowIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = overflowContent.dataset.open === 'true';
    if (isOpen) {
      hideOverflowContent(overflowContent);
    } else {
      hideAllOverflowContents(overflowContent);
      showOverflowContent(overflowContent);
    }
  });

  overflowContent.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  attachOverflowGlobalHandlers();
}

// constructs the div structure of #notation parent
export function createNotationDiv(parentElement, scale) {
  // container for Verovio
  let verovioContainer = document.createElement('div');
  verovioContainer.id = 'verovioContainer';

  createNotationControlMenu(verovioContainer, scale);

  // Create container element for Verovio SVG
  let verovioPanel = document.createElement('div');
  verovioPanel.id = 'verovio-panel';
  verovioContainer.appendChild(verovioPanel);

  // Both notation badges share the same DOM shape: a round icon + a
  // translucent label containing a one-line summary (count, prefix, first
  // message, chevron) and an expandable list of all messages. Click the
  // icon (or ×) to hide the label; click the label to expand when there
  // are multiple messages. The error badge dims the SVG via the
  // .notation-stale class on #verovio-panel; the warning badge does not.
  const buildBadgeHtml = () =>
    `<div class="badge-icon" role="button" tabindex="0">${icon.alert}</div>` +
    `<div class="badge-label">` +
    `<button type="button" class="badge-close" aria-label="Hide">×</button>` +
    `<div class="badge-summary">` +
    `<span class="badge-count" aria-hidden="true"></span>` +
    `<span class="badge-prefix"></span>` +
    `<span class="badge-message-first"></span>` +
    `<span class="badge-chevron" aria-hidden="true">${icon.arrowDown}</span>` +
    `</div>` +
    `<ul class="badge-details"></ul>` +
    `</div>`;

  // Compute the hover tooltip for a badge's summary line. The badge
  // itself keeps its full-message tooltip; the summary gets a
  // state-aware action hint that overrides it.
  //   - Singular: "Verovio warning" (no colon, no hint — there's nothing
  //     to expand).
  //   - Plural collapsed: "30 Verovio warnings: click to expand".
  //   - Plural expanded:  "30 Verovio warnings: click to contract".
  const refreshBadgeExpansionTooltip = (badge) => {
    const summaryEl = badge.querySelector('.badge-summary');
    const messageFirstEl = badge.querySelector('.badge-message-first');
    const countEl = badge.querySelector('.badge-count');
    const prefixEl = badge.querySelector('.badge-prefix');
    if (!summaryEl || !prefixEl) return;
    const hasMultiple = badge.classList.contains('has-multiple');
    let tooltip;
    if (!hasMultiple) {
      tooltip = (prefixEl.textContent || '').replace(/[:\s]+$/, '');
    } else {
      const hintKey = badge.classList.contains('expanded')
        ? 'notationBadgeClickToContract'
        : 'notationBadgeClickToExpand';
      const hint = (translator.lang[hintKey] && translator.lang[hintKey].text) || '';
      const count = countEl ? countEl.textContent : '';
      const prefix = prefixEl.textContent || '';
      tooltip = `${count}${prefix} ${hint}`.trim();
    }
    summaryEl.title = tooltip;
    // Suppress the inherited tooltip on the message text so users can
    // read/select the warning content without an overlay popping up.
    if (messageFirstEl) messageFirstEl.title = '';
  };

  // When a badge is expanded its details panel needs an explicit max-height
  // so the inner scrollbar engages instead of the badge overflowing the
  // notation pane. Recomputed whenever the badge moves or the container
  // resizes.
  const recomputeBadgeDetailsHeight = (badge) => {
    if (!badge.classList.contains('expanded')) return;
    const details = badge.querySelector('.badge-details');
    const summary = badge.querySelector('.badge-summary');
    if (!details) return;
    const containerHeight = verovioContainer.clientHeight;
    const top = badge.offsetTop;
    const summaryHeight = summary ? summary.offsetHeight : 0;
    const available = Math.max(60, containerHeight - top - summaryHeight - 24);
    details.style.maxHeight = available + 'px';
  };

  const wireBadge = (badge) => {
    badge.querySelector('.badge-icon').addEventListener('click', () => {
      badge.classList.toggle('label-hidden');
    });
    badge.querySelector('.badge-close').addEventListener('click', (ev) => {
      ev.stopPropagation();
      badge.classList.add('label-hidden');
    });
    badge.querySelector('.badge-label').addEventListener('click', (ev) => {
      if (ev.target.closest('.badge-close')) return;
      if (!badge.classList.contains('has-multiple')) return;
      // Restrict expand/collapse to the prefix ("X Verovio warnings:"),
      // the count, and the chevron, so the message text remains
      // selectable for copy/paste (e.g., to grab xml:IDs).
      if (!ev.target.closest('.badge-prefix, .badge-count, .badge-chevron')) return;
      badge.classList.toggle('expanded');
      recomputeBadgeDetailsHeight(badge);
      refreshBadgeExpansionTooltip(badge);
    });
  };

  // Expose the tooltip refresher on the badge itself so callers that
  // change the message set (e.g. viewer.setNotationStale) can keep the
  // click-zone hint in sync without importing this module.
  const attachTooltipApi = (badge) => {
    badge.refreshExpansionTooltip = () => refreshBadgeExpansionTooltip(badge);
  };

  let notationBadge = document.createElement('div');
  notationBadge.id = 'notation-error-badge';
  notationBadge.style.display = 'none';
  notationBadge.setAttribute('role', 'status');
  notationBadge.setAttribute('aria-live', 'polite');
  notationBadge.innerHTML = buildBadgeHtml();
  wireBadge(notationBadge);
  attachTooltipApi(notationBadge);
  verovioContainer.appendChild(notationBadge);

  let notationWarningBadge = document.createElement('div');
  notationWarningBadge.id = 'notation-warning-badge';
  notationWarningBadge.style.display = 'none';
  notationWarningBadge.setAttribute('role', 'status');
  notationWarningBadge.setAttribute('aria-live', 'polite');
  notationWarningBadge.innerHTML = buildBadgeHtml();
  wireBadge(notationWarningBadge);
  attachTooltipApi(notationWarningBadge);
  verovioContainer.appendChild(notationWarningBadge);

  // When the error badge is expanded with multiple errors it grows
  // downward and would occlude the warning badge below it. Watch its
  // size and slide the warning badge down to sit just under the expanded
  // error block, sizing its max-height so it still fits in the pane.
  const repositionWarningBadge = () => {
    const errorVisible = notationBadge.style.display !== 'none';
    const errorExpanded = notationBadge.classList.contains('expanded');
    if (errorVisible && errorExpanded) {
      const errorBottom = notationBadge.offsetTop + notationBadge.offsetHeight;
      const containerH = verovioContainer.clientHeight;
      notationWarningBadge.style.top = errorBottom + 6 + 'px';
      notationWarningBadge.style.maxHeight = Math.max(40, containerH - errorBottom - 12) + 'px';
    } else {
      // Clear inline overrides so the CSS-driven default/float-up positions apply.
      notationWarningBadge.style.top = '';
      notationWarningBadge.style.maxHeight = '';
    }
    // The warning may have moved; if its details panel is open, resize it
    // so the scrollable region stays inside the notation pane.
    recomputeBadgeDetailsHeight(notationWarningBadge);
  };

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      repositionWarningBadge();
      // The container may have changed size too — keep the error's open
      // details panel sized correctly.
      recomputeBadgeDetailsHeight(notationBadge);
    });
    ro.observe(notationBadge);
    ro.observe(notationWarningBadge);
    ro.observe(verovioContainer);
  }

  // container for Verovio
  let facsimileDragger = document.createElement('div');
  facsimileDragger.id = 'facsimile-dragger';
  facsimileDragger.classList.add('resizer');
  facsimileDragger.innerHTML = icon.kebab;

  // Create container element for pixel content (svg and jpg)
  let facsimileContainer = document.createElement('div');
  facsimileContainer.id = 'facsimileContainer';

  createFacsimileControlMenu(facsimileContainer);

  // Create container element for Facsimile Image
  let facsimilePanel = document.createElement('div');
  facsimilePanel.id = 'facsimile-panel';

  let facsimileMessagePanel = document.createElement('div');
  facsimileMessagePanel.id = 'facsimileMessagePanel';
  facsimilePanel.append(facsimileMessagePanel);
  facsimileContainer.appendChild(facsimilePanel);

  // SVG: facsimile image container
  // var svgContainer = document.createElementNS(svgNameSpace, 'svg');
  // svgContainer.id = 'sourceImageContainer';
  // svgContainer.setAttribute('width', '500px');

  // // SVG: facsimile image svg
  // var svg = document.createElementNS(svgNameSpace, 'svg');
  // svg.id = 'sourceImageSvg';

  // // append everything
  // svgContainer.appendChild(svg);
  // facsimilePanel.append(svgContainer);

  // add both containers to parent (#notation)
  parentElement.appendChild(verovioContainer);
  parentElement.appendChild(facsimileDragger);
  parentElement.appendChild(facsimileContainer);

  // add three dots icon to resizer
  const resizer = document.getElementById('dragMe');
  if (resizer) resizer.innerHTML = icon.kebab;
} // createNotationDiv()

/**
 * Wraps a control menu in a wrapper div that contains an overflow menu
 * @param {HTMLElement} controlMenu - The control menu to wrap
 * @param {HTMLElement[]} fixedElementsLeft - Array of button(s) to add to the left corner of the control menu (e.g., Verovio logo, Facsimile icon, ...). These will not be part of the overflow menu.
 * @param {HTMLElement[]} fixedElementsRight - Array of button(s) to add to the right corner of the control menu (e.g., closing button, PDF saving button, ...). These will not be part of the overflow menu.
 * @return {HTMLElement} The wrapper div containing the control menu, overflow menu, and any fixed elements
 */
function wrapControlMenu(controlMenu, fixedElementsLeft, fixedElementsRight) {
  // create wrapper div for control menu and overflow menu
  let wrapper = document.createElement('div');
  wrapper.classList.add('control-menu-wrapper');
  wrapper.id = controlMenu.id + '-wrapper';
  if (fixedElementsLeft && Array.isArray(fixedElementsLeft)) {
    let fixedElementsDiv = document.createElement('div');
    fixedElementsLeft.forEach((el) => {
      fixedElementsDiv.appendChild(el);
    });
    fixedElementsDiv.classList.add('control-menu-fixed-left');
    wrapper.appendChild(fixedElementsDiv);
  }
  controlMenu.parentElement.insertBefore(wrapper, controlMenu);
  wrapper.appendChild(controlMenu);
  let overflowMenu = document.createElement('div');
  let overflowIcon = document.createElement('div');
  overflowIcon.innerHTML = '&#9776;';
  overflowIcon.id = controlMenu.id + 'OverflowIcon';
  overflowIcon.classList.add('control-menu-overflow-icon');
  let overflowContent = document.createElement('div');
  overflowContent.classList.add('control-menu-overflow-content');
  overflowContent.id = controlMenu.id + 'OverflowContent';
  overflowMenu.appendChild(overflowIcon);
  overflowMenu.appendChild(overflowContent);
  overflowMenu.classList.add('control-menu-overflow');
  overflowMenu.id = controlMenu.id + 'Overflow';
  wrapper.appendChild(overflowMenu);
  if (fixedElementsRight && Array.isArray(fixedElementsRight)) {
    let fixedElementsDiv = document.createElement('div');
    fixedElementsRight.forEach((el) => {
      fixedElementsDiv.appendChild(el);
    });
    fixedElementsDiv.classList.add('control-menu-fixed-right');
    wrapper.appendChild(fixedElementsDiv);
  }
  assignOrderKeys(controlMenu);
  registerOverflowMenu(overflowMenu);
  return wrapper;
}

function assignOrderKeys(controlMenu) {
  Array.from(controlMenu.children).forEach((child, index) => {
    if (!child.dataset.order) child.dataset.order = String(index);
  });
}

function insertByOrder(container, child) {
  const order = Number(child.dataset.order ?? Number.MAX_SAFE_INTEGER);
  const siblings = Array.from(container.children);
  const before = siblings.find((el) => Number(el.dataset.order ?? Number.MAX_SAFE_INTEGER) > order);
  if (before) {
    container.insertBefore(child, before);
  } else {
    container.appendChild(child);
  }
}

export function createNotationControlMenu(parentElement, scale) {
  // Create control form
  let vrvCtrlMenu = document.createElement('div');
  vrvCtrlMenu.classList.add('control-menu');
  vrvCtrlMenu.id = 'notationControlMenu';
  // Verovio spinning icon
  let verovioIcon = document.createElement('div');
  verovioIcon.innerHTML = icon.verovioV;
  verovioIcon.id = 'verovioIcon';
  verovioIcon.title = `mei-friend worker activity:
     clockwise rotation denotes Verovio activity,
     anticlockwise rotation speed worker activity`;

  // Zoom controls
  let zoomCtrls = document.createElement('div');
  zoomCtrls.id = 'zoomCtrls';
  zoomCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(zoomCtrls);

  let decreaseBtn = document.createElement('button');
  decreaseBtn.id = 'decreaseScaleButton';
  decreaseBtn.classList.add('btn');
  decreaseBtn.classList.add('icon');
  decreaseBtn.innerHTML = icon.diffRemoved;
  decreaseBtn.classList.add('inline-block-tight');
  decreaseBtn.title = 'Decrease notation';
  zoomCtrls.appendChild(decreaseBtn);

  let zoomCtrl = document.createElement('input');
  zoomCtrl.id = 'verovioZoom';
  zoomCtrl.classList.add('input-range');
  zoomCtrl.setAttribute('type', 'range');
  zoomCtrl.setAttribute('min', 10);
  zoomCtrl.setAttribute('max', 200);
  zoomCtrl.setAttribute('step', 1);
  zoomCtrl.setAttribute('value', scale);
  zoomCtrls.appendChild(zoomCtrl);
  zoomCtrl.title = 'Scale size of notation';

  let increaseBtn = document.createElement('button');
  increaseBtn.id = 'increaseScaleButton';
  increaseBtn.classList.add('btn');
  increaseBtn.classList.add('icon');
  increaseBtn.innerHTML = icon.diffAdded;
  increaseBtn.classList.add('inline-block-tight');
  increaseBtn.title = 'Increase notation';
  zoomCtrls.appendChild(increaseBtn);

  // Pagination, page navigation
  let paginationCtrls = document.createElement('div');
  paginationCtrls.id = 'paginationControls';
  paginationCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(paginationCtrls);

  let sectionSelector = document.createElement('select');
  sectionSelector.id = 'sectionSelect';
  sectionSelector.classList.add('icon');
  sectionSelector.classList.add('btn');
  // sectionSelector.classList.add('icon-multi-select');
  sectionSelector.classList.add('inline-block-tight');
  sectionSelector.title = 'Navigate encoded section/ending structure';
  sectionSelector.style.display = 'none';
  paginationCtrls.appendChild(sectionSelector);

  let firstBtn = document.createElement('button');
  firstBtn.id = 'firstPageButton';
  firstBtn.classList.add('icon');
  firstBtn.classList.add('btn');
  firstBtn.innerHTML = icon.chevronFirst;
  firstBtn.classList.add('inline-block-tight');
  firstBtn.title = 'Flip to first page';
  firstBtn.setAttribute('type', 'button');
  firstBtn.setAttribute('value', 'first');
  paginationCtrls.appendChild(firstBtn);

  let prevBtn = document.createElement('button');
  prevBtn.id = 'previousPageButton';
  prevBtn.classList.add('icon');
  prevBtn.classList.add('btn');
  prevBtn.innerHTML = icon.chevronLeft;
  prevBtn.classList.add('inline-block-tight');
  prevBtn.title = 'Flip to previous page';
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('value', 'backwards');
  paginationCtrls.appendChild(prevBtn);

  let paginationLabel = document.createElement('label');
  paginationLabel.id = 'paginationLabel';
  paginationLabel.classList.add('label');
  paginationLabel.title = 'Page navigation: click to manually enter page number to be displayed';

  let pagination1 = document.createElement('div');
  pagination1.innerHTML = 'Loading';
  pagination1.id = 'pagination1';
  let pagination2 = document.createElement('div');
  pagination2.id = 'pagination2';
  pagination2.classList.add('preventKeyBindings');
  pagination2.contentEditable = true;
  pagination2.title = 'Click to enter page number';
  let pagination3 = document.createElement('div');
  pagination3.id = 'pagination3';
  let pagination4 = document.createElement('div');
  pagination4.id = 'pagination4';
  paginationLabel.appendChild(pagination1);
  paginationLabel.appendChild(pagination2);
  paginationLabel.appendChild(pagination3);
  paginationLabel.appendChild(pagination4);
  paginationCtrls.appendChild(paginationLabel);

  let nextBtn = document.createElement('button');
  nextBtn.id = 'nextPageButton';
  nextBtn.classList.add('btn');
  nextBtn.classList.add('icon');
  nextBtn.innerHTML = icon.chevronRight;
  nextBtn.classList.add('inline-block-tight');
  nextBtn.title = 'Flip to next page';
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('value', 'forwards');
  paginationCtrls.appendChild(nextBtn);

  let lastBtn = document.createElement('button');
  lastBtn.id = 'lastPageButton';
  lastBtn.classList.add('btn');
  lastBtn.classList.add('icon');
  lastBtn.innerHTML = icon.chevronLast;
  lastBtn.classList.add('inline-block-tight');
  lastBtn.title = 'Flip to last page';
  lastBtn.setAttribute('type', 'button');
  lastBtn.setAttribute('value', 'last');
  paginationCtrls.appendChild(lastBtn);

  // Flips notation automatically to cursor position in encoding
  let flipCheckbox = document.createElement('input');
  flipCheckbox.id = 'flipCheckbox';
  flipCheckbox.setAttribute('type', 'checkbox');
  flipCheckbox.setAttribute('value', 'autoFlip');
  flipCheckbox.setAttribute('checked', 'true');
  flipCheckbox.title = 'Automatically flip page to encoding cursor position';
  paginationCtrls.appendChild(flipCheckbox);
  // manually flip to cursor position
  let flipBtn = document.createElement('button');
  flipBtn.id = 'flipButton';
  flipBtn.classList.add('btn');
  flipBtn.classList.add('icon');
  flipBtn.innerHTML = icon.flipToEncoding; // icon-alignment-aligned-to
  flipBtn.classList.add('inline-block-tight');
  flipBtn.title = 'Flip page manually to encoding cursor position';
  flipBtn.setAttribute('type', 'button');
  flipBtn.setAttribute('value', 'update');
  flipBtn.disabled = true;
  paginationCtrls.appendChild(flipBtn);

  flipCheckbox.addEventListener('change', () => {
    flipBtn.disabled = flipCheckbox.checked;
  });

  // breaks selector
  let breaksCtrls = document.createElement('div');
  breaksCtrls.id = 'breaksControls';
  // breaksCtrls.classList.add('block');
  breaksCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(breaksCtrls);

  let breaksSelector = document.createElement('select');
  breaksSelector.id = 'breaksSelect';
  breaksSelector.classList.add('btn');
  breaksSelector.classList.add('input-select');
  breaksCtrls.title = 'Define system/page breaks behavior of notation';
  breaksCtrls.appendChild(breaksSelector);

  // choice selector
  let choiceCtrls = document.createElement('div');
  choiceCtrls.id = 'choiceControls';
  choiceCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(choiceCtrls);

  let choiceOrigRegSelector = document.createElement('select');
  choiceOrigRegSelector.id = 'choiceOrigRegSelect';
  choiceOrigRegSelector.classList.add('btn', 'input-select');
  choiceOrigRegSelector.title = 'Choose displayed content for choice elements: orig or reg';
  choiceCtrls.appendChild(choiceOrigRegSelector);

  let choiceSicCorrSelector = document.createElement('select');
  choiceSicCorrSelector.id = 'choiceSicCorrSelect';
  choiceSicCorrSelector.classList.add('btn', 'input-select');
  choiceSicCorrSelector.title = 'Choose displayed content for choice elements: sic or corr';
  choiceCtrls.appendChild(choiceSicCorrSelector);

  let substSelector = document.createElement('select');
  substSelector.id = 'substSelect';
  substSelector.classList.add('btn', 'input-select');
  substSelector.title = 'Choose displayed content for subst elements: add or del';
  choiceCtrls.appendChild(substSelector);

  // MEI encoding update behavior
  let updateCtrls = document.createElement('div');
  updateCtrls.id = 'updateControls';
  // updateCtrls.classList.add('block');
  updateCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(updateCtrls);

  let updateLabel = document.createElement('label');
  updateLabel.id = 'updateControlsLabel';
  updateLabel.innerText = 'Update: ';
  updateLabel.classList.add('label');
  updateCtrls.appendChild(updateLabel);
  updateLabel.title = 'Control update behavior of notation after changes in encoding';

  let codeUpdateCheckbox = document.createElement('input');
  codeUpdateCheckbox.id = 'liveUpdateCheckbox';
  codeUpdateCheckbox.setAttribute('type', 'checkbox');
  codeUpdateCheckbox.setAttribute('checked', 'true');
  codeUpdateCheckbox.title = 'Automatically update notation after changes in encoding';
  updateLabel.setAttribute('for', codeUpdateCheckbox.id);
  updateCtrls.appendChild(codeUpdateCheckbox);

  let codeUpdateBtn = document.createElement('button');
  codeUpdateBtn.id = 'codeManualUpdateButton';
  codeUpdateBtn.classList.add('btn');
  codeUpdateBtn.classList.add('icon');
  codeUpdateBtn.innerHTML = icon.symLinkFile; // icon-alignment-aligned-to
  codeUpdateBtn.classList.add('inline-block-tight');
  codeUpdateBtn.title = 'Update notation manually';
  codeUpdateBtn.setAttribute('type', 'button');
  codeUpdateBtn.setAttribute('value', 'codeUpdate');
  codeUpdateBtn.disabled = true;
  updateCtrls.appendChild(codeUpdateBtn);

  codeUpdateCheckbox.addEventListener('change', () => {
    codeUpdateBtn.disabled = codeUpdateCheckbox.checked;
  });

  // font selector
  let fontCtrls = document.createElement('div');
  fontCtrls.id = 'engravingFontControls';
  fontCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(fontCtrls);

  let fontSelector = document.createElement('select');
  fontSelector.id = 'engravingFontSelect';
  fontSelector.classList.add('btn');
  fontCtrls.title = 'Select engraving font';
  fontSelector.classList.add('input-select');
  fontList.forEach((font) => fontSelector.add(new Option(font)));
  fontCtrls.appendChild(fontSelector);

  // navigation controls
  let navigateCtrls = document.createElement('div');
  navigateCtrls.id = 'navigationControls';
  // navigateCtrls.classList.add('block');
  navigateCtrls.classList.add('controls');
  vrvCtrlMenu.appendChild(navigateCtrls);

  let backwardsBtn = document.createElement('button');
  backwardsBtn.id = 'backwardsButton';
  backwardsBtn.classList.add('btn');
  backwardsBtn.classList.add('icon');
  backwardsBtn.innerHTML = icon.arrowLeft;
  backwardsBtn.classList.add('inline-block-tight');
  backwardsBtn.title = 'Navigate to left in notation';
  navigateCtrls.appendChild(backwardsBtn);

  let forwardsBtn = document.createElement('button');
  forwardsBtn.id = 'forwardsButton';
  forwardsBtn.classList.add('btn');
  forwardsBtn.classList.add('icon');
  forwardsBtn.innerHTML = icon.arrowRight;
  forwardsBtn.classList.add('inline-block-tight');
  forwardsBtn.title = 'Navigate to right in notation';
  navigateCtrls.appendChild(forwardsBtn);

  let upwardsBtn = document.createElement('button');
  upwardsBtn.id = 'upwardsButton';
  upwardsBtn.classList.add('btn');
  upwardsBtn.classList.add('icon');
  upwardsBtn.innerHTML = icon.arrowUp;
  upwardsBtn.classList.add('inline-block-tight');
  upwardsBtn.title = 'Navigate upwards in notation';
  navigateCtrls.appendChild(upwardsBtn);

  let downwardsBtn = document.createElement('button');
  downwardsBtn.id = 'downwardsButton';
  downwardsBtn.classList.add('btn');
  downwardsBtn.classList.add('icon');
  downwardsBtn.innerHTML = icon.arrowDown;
  downwardsBtn.classList.add('inline-block-tight');
  downwardsBtn.title = 'Navigate downwards in notation';
  navigateCtrls.appendChild(downwardsBtn);

  let speedDiv = document.createElement('div');
  speedDiv.id = 'speedDiv';
  speedDiv.classList.add('controls');

  let speedLabel = document.createElement('label');
  speedLabel.innerText = 'Speed mode:';
  speedLabel.id = 'speedLabel';
  speedLabel.classList.add('label');
  speedDiv.appendChild(speedLabel);
  speedLabel.title = `In speed mode, only the current page
     is sent to Verovio to reduce rendering
     time with large files`;

  let speedCheckbox = document.createElement('input');
  speedCheckbox.id = 'speedCheckbox';
  speedCheckbox.setAttribute('type', 'checkbox');
  speedCheckbox.setAttribute('checked', 'false');
  speedCheckbox.classList.add('checkbox');
  speedCheckbox.title = 'Activate speed mode';
  speedLabel.setAttribute('for', speedCheckbox.id);
  speedCheckbox.checked = true;
  speedCheckbox.disabled = false;
  speedDiv.appendChild(speedCheckbox);

  vrvCtrlMenu.appendChild(speedDiv);

  // page range selector for PDF export
  let pdfPageRange = createPageRangeSelector('none');

  // pdf functionality, display none
  let pdfCtrlDiv = document.createElement('div');
  pdfCtrlDiv.id = 'pdfControlsDiv';
  pdfCtrlDiv.classList.add('controls');
  pdfCtrlDiv.style.display = 'none';

  let savePdfButton = document.createElement('button');
  savePdfButton.id = 'pdfSaveButton';
  savePdfButton.classList.add('btn');
  // savePdfButton.classList.add('icon');
  savePdfButton.textContent = 'Save PDF'; // icon.pdfIcon;
  savePdfButton.classList.add('inline-block-tight');
  savePdfButton.style.display = 'none';
  savePdfButton.title = 'Save as PDF';
  pdfCtrlDiv.appendChild(savePdfButton);

  let pdfCloseButton = document.createElement('div');
  pdfCloseButton.id = 'pdfCloseButton';
  pdfCloseButton.title = 'Close print view';
  pdfCloseButton.style.display = 'none';
  pdfCloseButton.classList.add('topright');
  pdfCloseButton.innerHTML = '&times;'; // icon.xCircle;

  parentElement.appendChild(vrvCtrlMenu);
  wrapControlMenu(vrvCtrlMenu, [verovioIcon], [pdfPageRange, pdfCtrlDiv, pdfCloseButton]);
} // createNotationControlMenu()

export function createFacsimileControlMenu(parentElement) {
  // Create control form
  let facsCtrlMenu = document.createElement('div');
  facsCtrlMenu.classList.add('control-menu');
  facsCtrlMenu.id = 'facsimileControlMenu';
  parentElement.appendChild(facsCtrlMenu);

  // facsimile icon (octicon log)
  let facsimileIcon = document.createElement('div');
  facsimileIcon.innerHTML = icon.log;
  facsimileIcon.id = 'facsimileIcon';
  facsimileIcon.title = 'Facsimile panel';

  // Zoom controls
  let zoomCtrls = document.createElement('div');
  zoomCtrls.id = 'facsimileZoomControls';
  zoomCtrls.classList.add('controls');
  facsCtrlMenu.appendChild(zoomCtrls);

  let decreaseBtn = document.createElement('button');
  decreaseBtn.id = 'facsimileDecreaseZoomButton';
  decreaseBtn.classList.add('btn');
  decreaseBtn.classList.add('icon');
  decreaseBtn.innerHTML = icon.diffRemoved;
  decreaseBtn.classList.add('inline-block-tight');
  decreaseBtn.title = 'Decrease notation';
  zoomCtrls.appendChild(decreaseBtn);

  let zoomCtrl = document.createElement('input');
  zoomCtrl.id = 'facsimileZoom';
  zoomCtrl.classList.add('input-range');
  zoomCtrl.setAttribute('type', 'range');
  zoomCtrl.setAttribute('min', 10);
  zoomCtrl.setAttribute('max', 300);
  zoomCtrl.setAttribute('step', 5);
  zoomCtrl.setAttribute('value', 100);
  zoomCtrls.appendChild(zoomCtrl);
  zoomCtrl.title = 'Adjust size of notation';

  let increaseBtn = document.createElement('button');
  increaseBtn.id = 'facsimileIncreaseZoomButton';
  increaseBtn.classList.add('btn');
  increaseBtn.classList.add('icon');
  increaseBtn.innerHTML = icon.diffAdded;
  increaseBtn.classList.add('inline-block-tight');
  increaseBtn.title = 'Increase notation';
  zoomCtrls.appendChild(increaseBtn);

  // full page
  let fullPageDiv = document.createElement('div');
  fullPageDiv.id = 'facsimileFullPageDiv';
  fullPageDiv.classList.add('controls');

  let fullPageLabel = document.createElement('label');
  fullPageLabel.innerText = 'Full page:';
  fullPageLabel.id = 'facsimileFullPageLabel';
  fullPageLabel.classList.add('label');
  fullPageDiv.appendChild(fullPageLabel);
  fullPageLabel.title = 'Show full page of facsimile image';

  let fullPageCheckbox = document.createElement('input');
  fullPageCheckbox.id = 'facsimileFullPageCheckbox';
  fullPageCheckbox.setAttribute('type', 'checkbox');
  fullPageCheckbox.classList.add('checkbox');
  fullPageCheckbox.title = 'Display full page of facsimile image';
  fullPageLabel.setAttribute('for', fullPageCheckbox.id);
  fullPageCheckbox.checked = false;
  fullPageCheckbox.disabled = false;
  fullPageDiv.appendChild(fullPageCheckbox);

  facsCtrlMenu.appendChild(fullPageDiv);

  // show zone rectangles
  let showZonesDiv = document.createElement('div');
  showZonesDiv.id = 'facsimileShowZones';
  showZonesDiv.classList.add('controls');

  let showZonesLabel = document.createElement('label');
  showZonesLabel.innerText = 'Show zone boxes:';
  showZonesLabel.id = 'facsimileShowZonesLabel';
  showZonesLabel.classList.add('label');
  showZonesDiv.appendChild(showZonesLabel);
  showZonesLabel.title = 'Show zone boxes of facsimile';

  let showZonesCheckbox = document.createElement('input');
  showZonesCheckbox.id = 'facsimileShowZonesCheckbox';
  showZonesCheckbox.setAttribute('type', 'checkbox');
  showZonesCheckbox.classList.add('checkbox');
  showZonesCheckbox.title = 'Show zone boxes of facsimile';
  showZonesLabel.setAttribute('for', showZonesCheckbox.id);
  showZonesCheckbox.checked = false;
  showZonesCheckbox.disabled = false;
  showZonesDiv.appendChild(showZonesCheckbox);

  facsCtrlMenu.appendChild(showZonesDiv);

  // edit zones
  let editZonesDiv = document.createElement('div');
  editZonesDiv.id = 'facsimileEditZones';
  editZonesDiv.classList.add('controls');

  let editZonesLabel = document.createElement('label');
  editZonesLabel.innerText = 'Edit zones:';
  editZonesLabel.id = 'facsimileEditZonesLabel';
  editZonesLabel.classList.add('label');
  editZonesDiv.appendChild(editZonesLabel);
  editZonesLabel.title = 'Edit zones of facsimile';

  let editZonesCheckbox = document.createElement('input');
  editZonesCheckbox.id = 'facsimileEditZonesCheckbox';
  editZonesCheckbox.setAttribute('type', 'checkbox');
  editZonesCheckbox.classList.add('checkbox');
  editZonesCheckbox.title = 'Edit zones of facsimile';
  editZonesLabel.setAttribute('for', editZonesCheckbox.id);
  editZonesCheckbox.checked = false;
  editZonesCheckbox.disabled = false;
  editZonesDiv.appendChild(editZonesCheckbox);

  facsCtrlMenu.appendChild(editZonesDiv);

  let facsimileCloseButton = document.createElement('div');
  facsimileCloseButton.id = 'facsimileCloseButton';
  facsimileCloseButton.title = 'Close facsimile panel';
  facsimileCloseButton.classList.add('topright');
  facsimileCloseButton.innerHTML = '&times;'; // icon.xCircle;
  wrapControlMenu(facsCtrlMenu, [facsimileIcon], [facsimileCloseButton]);
} // createFacsimileControlMenu()

export function adjustCtrlMenuOverflow(ctrlMenu) {
  if (!ctrlMenu) return;

  const overflowContent = document.getElementById(ctrlMenu.id + 'OverflowContent');
  const overflowMenu = document.getElementById(ctrlMenu.id + 'Overflow');
  if (!overflowContent || !overflowMenu) return;

  // Both directions of the algorithm use the same rule: a child "fits" only when there is
  // at least 1 px of gap between its right edge and ctrlMenu's right edge.  Any overlap
  // (gap ≤ 0) means the child must move into overflow.  Using a single criterion for both
  // move-to and move-back prevents oscillation that arose from disagreement between the
  // two paths (e.g. cached width sums that ignored inter-element margins).
  const FIT_GAP = 1; // px — required gap between child's right edge and ctrlMenu's right
  const overflows = (child, ctrlMenuRight) =>
    child.getBoundingClientRect().right > ctrlMenuRight - FIT_GAP;

  // Move any overflowing children (and all later siblings, to preserve order) into the
  // overflow menu.  Returns true if any items were moved, so the caller can run a second
  // pass — showing the icon narrows ctrlMenu and may expose additional overflows.
  const moveOverflowingItems = () => {
    const children = Array.from(ctrlMenu.children);
    const ctrlMenuRight = ctrlMenu.getBoundingClientRect().right;
    const firstOverflowingIndex = children.findIndex((child) => overflows(child, ctrlMenuRight));
    if (firstOverflowingIndex === -1) return false;
    children.slice(firstOverflowingIndex).forEach((child) => {
      if (!child.dataset.order) assignOrderKeys(ctrlMenu);
      insertByOrder(overflowContent, child);
    });
    overflowMenu.style.display = 'inline-block';
    return true;
  };

  // Try to restore overflow items back into the main menu.  Trial-and-rollback: each
  // candidate is optimistically inserted, ctrlMenu is re-measured, and the candidate is
  // moved back to overflow if it doesn't actually fit.  This avoids the margin/border
  // accounting errors that a precomputed-width approach is prone to, and guarantees the
  // result is consistent with moveOverflowingItems'.  Iteration stops at the first item
  // that doesn't fit: subsequent items have larger order keys and would be placed
  // further right, where they cannot fit either.
  const tryRestoreFromOverflow = () => {
    const candidates = Array.from(overflowContent.children).sort(
      (a, b) => Number(a.dataset.order ?? 0) - Number(b.dataset.order ?? 0)
    );
    for (const item of candidates) {
      insertByOrder(ctrlMenu, item);
      // If overflow just emptied, hide the burger so ctrlMenu's measured right edge
      // reflects the icon being gone.
      if (overflowContent.children.length === 0) overflowMenu.style.display = 'none';
      const ctrlMenuRight = ctrlMenu.getBoundingClientRect().right;
      if (overflows(item, ctrlMenuRight)) {
        insertByOrder(overflowContent, item);
        overflowMenu.style.display = 'inline-block';
        break;
      }
    }
  };

  if (moveOverflowingItems()) {
    moveOverflowingItems();
  } else {
    tryRestoreFromOverflow();
  }

  overflowMenu.style.display = overflowContent.children.length > 0 ? 'inline-block' : 'none';
}

export function createEncodingPanel() {
  let codeCheckerResizer = document.getElementById('codeCheckerResizer');
  codeCheckerResizer.classList.add('resizer');
  codeCheckerResizer.innerHTML = icon.kebab;
  let codeCheckerPanel = document.getElementById('codeChecker');
  codeCheckerPanel.style.display = 'none';
} // createEncodingPanel()

export function showPdfButtons(show = true) {
  document.getElementById('pageRangeSelectorDiv').style.display = show ? '' : 'none';
  document.getElementById('pdfControlsDiv').style.display = show ? '' : 'none';
  document.getElementById('pdfSaveButton').style.display = show ? '' : 'none';
  document.getElementById('pdfCloseButton').style.display = show ? '' : 'none';
} // showPdfButtons()

// list of DOM object id string that will be saved and restored
// with getControlMenuState() and setControlMenuState()
const listOfObjects = [
  'controlMenuFlipToPageControls',
  'controlMenuUpdateNotation',
  'controlMenuFontSelector',
  'controlMenuNavigateArrows',
  'controlMenuSpeedmodeCheckbox',
  'toggleSpeedMode',
  // 'speedLabel',
];

/**
 * Returns a state object of the notation control menu
 * @returns {Object}
 */
export function getControlMenuState() {
  let state = {};
  listOfObjects.forEach((obj) => {
    let el = document.getElementById(obj);
    if (el) {
      if (obj === 'speedLabel') {
        state[obj] = {};
        state[obj]['textContent'] = el.textContent;
        state[obj]['title'] = el.title;
      } else {
        state[obj] = el.checked;
      }
    }
  });
  return state;
} // getControlMenuState()

/**
 * Sets the state of the notation control menu
 * @param {Object} state
 */
export function setControlMenuState(state) {
  listOfObjects.forEach((obj) => {
    if (obj === 'speedLabel') {
      let el = document.getElementById(obj);
      el.textContent = state[obj].textContent;
      el.title = state[obj].title;
    } else {
      setCheckbox(obj, state[obj]);
    }
  });
} // setControlMenuState()

export function setCheckbox(id, state) {
  let el = document.getElementById(id);
  if (el) {
    el.checked = state;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
} // setCheckbox()

export function manualCurrentPage(v, cm, ev) {
  console.debug('manualCurrentPage: ', ev);
  ev.stopPropagation();
  if (ev.key === 'Enter' || ev.type === 'blur') {
    ev.preventDefault();
    let pageInput = parseInt(ev.target.innerText);
    if (pageInput) v.updatePage(cm, pageInput);
    v.updatePageNumDisplay();
  }
} // manualCurrentPage()

export function setBreaksOptions(tkAvailableOptions, defaultValue = 'auto') {
  if (defaultValue === '') defaultValue = 'auto';
  let breaksEl = document.getElementById('breaksSelect');
  while (breaksEl.hasChildNodes()) {
    breaksEl.remove(0);
  }
  var breaksOpts = {
    none: translator.lang.breaksSelectNone.text,
    auto: translator.lang.breaksSelectAuto.text,
    // measure: 'Measure',
    line: translator.lang.breaksSelectLine.text,
    encoded: translator.lang.breaksSelectEncoded.text,
    smart: translator.lang.breaksSelectSmart.text,
  };
  for (let key of Object.keys(breaksOpts)) {
    let o = new Option(breaksOpts[key], key);
    // generate ids in the form of breaksSelectNone, breaksSelectAuto etc.
    o.id = 'breaksSelect' + key.charAt(0).toUpperCase() + key.slice(1);
    o.title = 'breaks: ' + key; // tooltip with the Verovio option name
    breaksEl[breaksEl.options.length] = o;
    if (key === 'smart') {
      breaksEl[breaksEl.length - 1].disabled = true;
    }
  }
} // setBreaksOptions()

export function handleSmartBreaksOption(speedMode) {
  let options = Array.from(document.getElementById('breaksSelect').options);
  options.forEach((o) => {
    if (o.value === 'smart') {
      if (speedMode && o.selected) {
        options.forEach((o) => {
          if (o.value === 'auto') o.selected = true;
        });
      }
      o.disabled = speedMode;
    }
  });
} // handleSmartBreaksOption()

/**
 * Adds the options for choice to the choiceSelect in the
 * notation control menu.
 * @param {string} active value of currently active selection
 * @param {string} selector id of the select element
 */
export function setChoiceOptions(active, selector) {
  let choiceOptions;
  switch (selector) {
    case 'choiceOrigRegSelect':
      choiceOptions = choiceOrigRegOptions;
      break;
    case 'choiceSicCorrSelect':
      choiceOptions = choiceSicCorrOptions;
      break;
    case 'substSelect':
      choiceOptions = substOptions;
      break;
    default:
      console.error('setChoiceOptions: Unknown selector ', selector);
      return;
  }
  let choiceSelect = document.getElementById(selector);
  while (choiceSelect.hasChildNodes()) {
    choiceSelect.removeChild(choiceSelect.firstChild);
  }
  if (choiceOptions.length > 0) {
    let groupEl = choiceOptions[0]; // take first, because always same structure in this array
    let group = document.createElement('optgroup');
    group.label = groupEl.label ? groupEl.label : groupEl.elName;
    if (groupEl.id) group.id = groupEl.id;

    groupEl.options.forEach((el) => {
      let option;
      if (active && el.value === active) {
        option = new Option(el.label, el.value, false, true);
      } else {
        option = new Option(el.label, el.value, false, false);
      }
      option.id = el.id;
      option.dataset.prop = el.prop;
      group.appendChild(option);
    });
    choiceSelect.appendChild(group);
  } else {
    let option = new Option(translator.lang.noChoice.text, '', false, false);
    option.id = 'noChoice';
    choiceSelect.appendChild(option);
  }
} // setChoiceOptions()

// checks xmlDoc for section, ending, lem, rdg elements for quick navigation
export function generateSectionSelect(xmlDoc) {
  let selector = 'section,ending,lem,rdg';
  let sections = [
    //first option with empty string for Firefox (TODO: beautify)
    ['', ''],
  ];
  let baseSection = xmlDoc.querySelector('music score');
  if (baseSection) {
    let els = baseSection.querySelectorAll(selector);
    els.forEach((el) => {
      let str = '';
      let parent = el.parentElement.closest(selector);
      if (parent) {
        str += '│ ';
        while ((parent = parent.parentElement.closest(selector))) str += '│ '; // &#9474;&nbsp; for indentation
      }
      sections.push([str + el.getAttribute('xml:id'), el.getAttribute('xml:id')]);
    });
    if (sections.length === 2) sections.pop(); // remove if only the one section
  }
  return sections;
} // generateSectionSelect()

export function addModifyerKeys(root) {
  let modifierKeys = {
    altKey: {
      symbol: '&#8997;',
      text: 'Alt',
      description: 'Alt key',
    }, // ALT
    shiftKey: {
      symbol: '&#8679;',
      text: 'Shift',
      description: 'Shift key',
    }, // SHIFT
    cmd2Key: {
      symbol: '&#8997;',
      text: 'Alt',
      description: 'Alt key',
    }, // ALT
    cmd3Key: {
      // ALT / CMD on Mac
      symbol: '&#8997;',
      text: 'Alt',
      description: 'Alt key',
    }, // ALT
    cmdKey: {
      symbol: '&#8963;',
      text: 'Ctrl',
      description: 'Ctrl key',
    }, // CTRL
    ctrlKey: {
      symbol: '&#8963;',
      text: 'Ctrl',
      description: 'Ctrl key',
    }, // CTRL
  };
  // MAC key mapping
  if (platform.startsWith('mac')) {
    modifierKeys.cmdKey = {
      symbol: '&#8984;',
      text: 'Cmd',
      description: 'Cmd key',
    }; // CMD
    modifierKeys.cmd2Key = {
      symbol: '&#8963;',
      text: 'Ctrl',
      description: 'Ctrl key',
    }; // Ctrl
    modifierKeys.cmd3Key = {
      symbol: '&#8984;',
      text: 'Cmd',
      description: 'Cmd key',
    }; // CMD
  }
  // all keyShortCut innerHTML as spearate keyIcon spans
  document.querySelectorAll('.keyShortCut').forEach((e) => {
    if (!e.querySelector('span')) e.innerHTML = '<span class="keyIcon">' + e.innerHTML + '</span>';
  });
  // attach these symbols to all occurrences in root
  Object.keys(modifierKeys).forEach((k) => {
    root.querySelectorAll('.' + k).forEach((e) => {
      const icon = platform.startsWith('mac') ? modifierKeys[k].symbol : modifierKeys[k].text;
      const span = '<span class="keyIcon" title="' + modifierKeys[k].description + '">' + icon + '</span>';
      if (!e.querySelector('span')) e.innerHTML = span + '<span class="keyIcon">' + e.innerHTML + '</span>';
      else e.innerHTML = span + e.innerHTML;
    });
  });
} // addModifyerKeys()
