import * as icon from './../css/icons.js';
import { fontList, platform } from './defaults.js';
import { svgNameSpace } from './dom-utils.js';
import { translator } from './main.js';
import { createPageRangeSelector } from './page-range-selector.js';
import { choiceOptions } from './markup.js';

// constructs the div structure of #notation parent
export function createNotationDiv(parentElement, scale) {
  // container for Verovio
  let verovioContainer = document.createElement('div');
  verovioContainer.id = 'verovioContainer';

  createNotationControlBar(verovioContainer, scale);

  // Create container element for Verovio SVG
  let verovioPanel = document.createElement('div');
  verovioPanel.id = 'verovio-panel';
  verovioContainer.appendChild(verovioPanel);

  // container for Verovio
  let facsimileDragger = document.createElement('div');
  facsimileDragger.id = 'facsimile-dragger';
  facsimileDragger.classList.add('resizer');
  facsimileDragger.innerHTML = icon.kebab;

  // Create container element for pixel content (svg and jpg)
  let facsimileContainer = document.createElement('div');
  facsimileContainer.id = 'facsimileContainer';

  createFacsimileControlBar(facsimileContainer);

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

export function createNotationControlBar(parentElement, scale) {
  // Create control form
  let vrvCtrlMenu = document.createElement('div');
  vrvCtrlMenu.classList.add('control-menu');
  vrvCtrlMenu.id = 'notationControlBar';

  // Verovio spinning icon
  let verovioIcon = document.createElement('div');
  verovioIcon.innerHTML = icon.verovioV;
  verovioIcon.id = 'verovioIcon';
  verovioIcon.title = `mei-friend worker activity:
     clockwise rotation denotes Verovio activity,
     anticlockwise rotation speed worker activity`;
  vrvCtrlMenu.appendChild(verovioIcon);

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

  let choiceSelector = document.createElement('select');
  choiceSelector.id = 'choiceSelect';
  choiceSelector.classList.add('btn', 'input-select');
  choiceSelector.title = 'Choose displayed content for choice elements';
  choiceCtrls.appendChild(choiceSelector);

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

  let filler = document.createElement('div');
  filler.classList.add('fillSpace');
  vrvCtrlMenu.appendChild(filler);

  // page range selector for PDF export
  vrvCtrlMenu.appendChild(createPageRangeSelector('none'));

  // pdf functionality, display none
  let pdfCtrlDiv = document.createElement('div');
  pdfCtrlDiv.id = 'pdfControlsDiv';
  pdfCtrlDiv.classList.add('controls');
  pdfCtrlDiv.style.display = 'none';
  vrvCtrlMenu.appendChild(pdfCtrlDiv);

  let savePdfButton = document.createElement('button');
  savePdfButton.id = 'pdfSaveButton';
  savePdfButton.classList.add('btn');
  // savePdfButton.classList.add('icon');
  savePdfButton.textContent = 'Save PDF'; // icon.pdfIcon;
  savePdfButton.classList.add('inline-block-tight');
  savePdfButton.title = 'Save as PDF';
  pdfCtrlDiv.appendChild(savePdfButton);

  let pdfCloseButton = document.createElement('div');
  pdfCloseButton.id = 'pdfCloseButton';
  pdfCloseButton.title = 'Close print view';
  pdfCloseButton.style.display = 'none';
  pdfCloseButton.classList.add('topright');
  pdfCloseButton.innerHTML = '&times;'; // icon.xCircle;
  vrvCtrlMenu.appendChild(pdfCloseButton);

  parentElement.appendChild(vrvCtrlMenu);
} // createNotationControlBar()

export function createFacsimileControlBar(parentElement) {
  // Create control form
  let facsCtrlBar = document.createElement('div');
  facsCtrlBar.classList.add('control-menu');
  facsCtrlBar.id = 'facsimileControlBar';
  parentElement.appendChild(facsCtrlBar);

  // facsimile icon (octicon log)
  let facsimileIcon = document.createElement('div');
  facsimileIcon.innerHTML = icon.log;
  facsimileIcon.id = 'facsimileIcon';
  facsimileIcon.title = 'Facsimile panel';
  facsCtrlBar.appendChild(facsimileIcon);

  // Zoom controls
  let zoomCtrls = document.createElement('div');
  zoomCtrls.id = 'facsimileZoomControls';
  zoomCtrls.classList.add('controls');
  facsCtrlBar.appendChild(zoomCtrls);

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

  facsCtrlBar.appendChild(fullPageDiv);

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

  facsCtrlBar.appendChild(showZonesDiv);

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

  facsCtrlBar.appendChild(editZonesDiv);

  let filler = document.createElement('div');
  filler.classList.add('fillSpace');
  facsCtrlBar.appendChild(filler);

  let facsimileCloseButton = document.createElement('div');
  facsimileCloseButton.id = 'facsimileCloseButton';
  facsimileCloseButton.title = 'Close facsimile panel';
  facsimileCloseButton.classList.add('topright');
  facsimileCloseButton.innerHTML = '&times;'; // icon.xCircle;
  facsCtrlBar.appendChild(facsimileCloseButton);
} // createFacsimileControlBar()

export function showPdfButtons(show = true) {
  document.getElementById('pageRangeSelectorDiv').style.display = show ? '' : 'none';
  document.getElementById('pdfControlsDiv').style.display = show ? '' : 'none';
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
 * @returns {object}
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
 * @param {object} state
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
  while (breaksEl.hasChildNodes()) breaksEl.remove(0);
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
    breaksEl[breaksEl.options.length] = o;
    if (key === 'smart') breaksEl[breaksEl.length - 1].disabled = true;
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
 * notation control bar.
 * @param {string} active value of currently active selection 
 */
export function setChoiceOptions(active) {
  let choiceSelect = document.getElementById('choiceSelect');
  while (choiceSelect.hasChildNodes()) {
    choiceSelect.removeChild(choiceSelect.firstChild);
  }
  if (choiceOptions.length > 0) {
    choiceOptions.forEach((groupEl) => {
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
    });
  } else {
    let option = new Option(translator.lang.noChoice.text, '', false, false);
    option.id = 'noChoice';
    choiceSelect.appendChild(option);
  }
  
}

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
    cmd3Key: { // ALT / CMD on Mac
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
