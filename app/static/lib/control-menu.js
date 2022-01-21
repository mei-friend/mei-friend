import * as utils from './utils.js';

export function createControlsMenu(parentElement, scale) {

  // Create control form
  let controlsForm = document.createElement('div');
  controlsForm.classList.add('control-menu');
  controlsForm.id = 'verovio-controls-form';
  parentElement.appendChild(controlsForm);

  // Zoom controls
  let zoomCtrls = document.createElement('div');
  zoomCtrls.id = 'zoom-ctrls';
  zoomCtrls.classList.add('controls');
  controlsForm.appendChild(zoomCtrls);

  let decreaseBtn = document.createElement('button');
  decreaseBtn.id = "decrease-scale-btn";
  decreaseBtn.classList.add('btn');
  decreaseBtn.classList.add('icon');
  decreaseBtn.classList.add('icon-diff-removed');
  decreaseBtn.classList.add('inline-block-tight');
  addToolTip(decreaseBtn, {
    title: 'Decrease notation'
  });
  zoomCtrls.appendChild(decreaseBtn);

  let zoomCtrl = document.createElement("input");
  zoomCtrl.id = 'verovio-zoom';
  zoomCtrl.classList.add('input-range');
  zoomCtrl.setAttribute('type', 'range');
  zoomCtrl.setAttribute('min', 10);
  zoomCtrl.setAttribute('max', 200);
  zoomCtrl.setAttribute('step', 1);
  zoomCtrl.setAttribute('value', `${scale}`);
  zoomCtrls.appendChild(zoomCtrl);
  addToolTip(zoomCtrl, {
    title: 'Scale notation'
  });

  let increaseBtn = document.createElement('button');
  increaseBtn.id = "increase-scale-btn";
  increaseBtn.classList.add('btn');
  increaseBtn.classList.add('icon');
  increaseBtn.classList.add('icon-diff-added');
  increaseBtn.classList.add('inline-block-tight');
  addToolTip(increaseBtn, {
    title: 'Increase notation'
  });
  zoomCtrls.appendChild(increaseBtn);

  let notationNightModeBtn = document.createElement('button');
  notationNightModeBtn.id = "notation-night-mode-btn";
  notationNightModeBtn.classList.add('btn');
  notationNightModeBtn.classList.add('icon');
  notationNightModeBtn.classList.add('icon-ruby');
  notationNightModeBtn.classList.add('inline-block-tight');
  addToolTip(notationNightModeBtn, {
    title: 'Invert colors of notation'
  });
  zoomCtrls.appendChild(notationNightModeBtn);


  // Pagination, page navigation
  let paginationCtrls = document.createElement('div');
  paginationCtrls.id = 'pagination-ctrls';
  paginationCtrls.classList.add('controls');
  controlsForm.appendChild(paginationCtrls);

  let sectionSelector = document.createElement('select');
  sectionSelector.id = "section-selector";
  sectionSelector.classList.add('icon');
  sectionSelector.classList.add('btn');
  // sectionSelector.classList.add('icon-multi-select');
  sectionSelector.classList.add('inline-block-tight');
  addToolTip(sectionSelector, {
    title: 'Navigate encoded section/ending structure'
  });
  // sectionSelector.options.add(new Option('Var-I'));
  // sectionSelector.options.add(new Option('| Var-I-A'));
  // sectionSelector.options.add(new Option('| Var-I-B'));
  // sectionSelector.options.add(new Option('| Var-I-B1'));
  // sectionSelector.options.add(new Option('| Var-I-B2'));
  // sectionSelector.options.add(new Option('Var-II'));
  // sectionSelector.options.add(new Option('| Var-II-A'));
  // sectionSelector.options.add(new Option('| Var-II-A1'));
  // sectionSelector.options.add(new Option('| Var-II-A2'));
  // sectionSelector.options.add(new Option('| Var-II-B'));
  sectionSelector.style.display = 'none';
  paginationCtrls.appendChild(sectionSelector);

  let firstBtn = document.createElement('button');
  firstBtn.id = "first-page-btn";
  firstBtn.classList.add('icon');
  firstBtn.classList.add('btn');
  firstBtn.classList.add('icon-chevron-first');
  firstBtn.classList.add('inline-block-tight');
  addToolTip(firstBtn, {
    title: 'Jump to first page'
  });
  firstBtn.setAttribute('type', 'button');
  firstBtn.setAttribute('value', 'first');
  paginationCtrls.appendChild(firstBtn);

  let prevBtn = document.createElement('button');
  prevBtn.id = "prev-page-btn";
  prevBtn.classList.add('icon');
  prevBtn.classList.add('btn');
  prevBtn.classList.add('icon-chevron-left');
  prevBtn.classList.add('inline-block-tight');
  addToolTip(prevBtn, {
    title: 'Go to previous page'
  });
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('value', 'backwards');
  paginationCtrls.appendChild(prevBtn);

  let paginationLabel = document.createElement('label');
  paginationLabel.id = 'pagination-label';
  paginationLabel.classList.add('label');
  // paginationLabel.innerHTML = `Loading`;

  let pagination1 = document.createElement('div');
  pagination1.innerHTML = 'Loading';
  pagination1.id = 'pagination1';
  let pagination2 = document.createElement('div');
  pagination2.id = 'pagination2';
  pagination2.contentEditable = true;
  addToolTip(pagination2, {
    title: 'Click to enter page number'
  });
  let pagination3 = document.createElement('div');
  pagination3.id = 'pagination3';
  paginationLabel.appendChild(pagination1);
  paginationLabel.appendChild(pagination2);
  paginationLabel.appendChild(pagination3);
  paginationCtrls.appendChild(paginationLabel);

  let nextBtn = document.createElement('button');
  nextBtn.id = "next-page-btn";
  nextBtn.classList.add('btn');
  nextBtn.classList.add('icon');
  nextBtn.classList.add('icon-chevron-right');
  nextBtn.classList.add('inline-block-tight');
  addToolTip(nextBtn, {
    title: 'Go to next page'
  });
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('value', 'forwards');
  paginationCtrls.appendChild(nextBtn);

  let lastBtn = document.createElement('button');
  lastBtn.id = "last-page-btn";
  lastBtn.classList.add('btn');
  lastBtn.classList.add('icon');
  lastBtn.classList.add('icon-chevron-last');
  lastBtn.classList.add('inline-block-tight');
  addToolTip(lastBtn, {
    title: 'Jump to last page'
  });
  lastBtn.setAttribute('type', 'button');
  lastBtn.setAttribute('value', 'last');
  paginationCtrls.appendChild(lastBtn);

  // Flips notation automatically to cursor position in encoding
  let flipCheckbox = document.createElement('input');
  flipCheckbox.id = "flip-checkbox";
  flipCheckbox.setAttribute('type', 'checkbox');
  flipCheckbox.setAttribute('value', 'autoFlip');
  flipCheckbox.setAttribute('checked', 'true');
  paginationCtrls.appendChild(flipCheckbox);
  // manually flip to cursor position
  let flipBtn = document.createElement('button');
  flipBtn.id = "flip-btn";
  flipBtn.classList.add('btn');
  flipBtn.classList.add('icon');
  flipBtn.classList.add('icon-flip-to-encoding'); // icon-alignment-aligned-to
  flipBtn.classList.add('inline-block-tight');
  addToolTip(flipBtn, {
    title: 'Flip page to encoding cursor position'
  });
  flipBtn.setAttribute('type', 'button');
  flipBtn.setAttribute('value', 'update');
  flipBtn.disabled = true;
  paginationCtrls.appendChild(flipBtn);

  flipCheckbox.addEventListener('change', () => {
    flipBtn.disabled = flipCheckbox.checked;
  });


  // breaks selector
  let breaksCtrls = document.createElement('div');
  breaksCtrls.id = 'breaks-ctrls';
  // breaksCtrls.classList.add('block');
  breaksCtrls.classList.add('controls');
  controlsForm.appendChild(breaksCtrls);

  let breaksSelector = document.createElement('select');
  breaksSelector.id = 'breaks-select';
  breaksSelector.classList.add('btn');
  breaksSelector.classList.add('input-select');
  addToolTip(breaksCtrls, {
    title: 'Define system/page breaks behavior of notation'
  });
  breaksCtrls.appendChild(breaksSelector);


  // MEI encoding update behavior
  let updateCtrls = document.createElement('div');
  updateCtrls.id = 'update-ctrls';
  // updateCtrls.classList.add('block');
  updateCtrls.classList.add('controls');
  controlsForm.appendChild(updateCtrls);

  let updateLabel = document.createElement('label');
  updateLabel.innerText = 'Update: ';
  updateLabel.classList.add('label');
  updateCtrls.appendChild(updateLabel);
  addToolTip(updateLabel, {
    title: 'Update notation automatically after changes in encoding'
  });

  let codeUpdateCheckbox = document.createElement("input");
  codeUpdateCheckbox.id = 'live-update-checkbox';
  codeUpdateCheckbox.setAttribute('type', 'checkbox');
  codeUpdateCheckbox.setAttribute('checked', 'true');
  updateLabel.setAttribute('for', codeUpdateCheckbox.id);
  updateCtrls.appendChild(codeUpdateCheckbox);

  let codeUpdateBtn = document.createElement('button');
  codeUpdateBtn.id = "code-update-btn";
  codeUpdateBtn.classList.add('btn');
  codeUpdateBtn.classList.add('icon');
  codeUpdateBtn.classList.add('icon-file-symlink-file'); // icon-alignment-aligned-to
  codeUpdateBtn.classList.add('inline-block-tight');
  addToolTip(codeUpdateBtn, {
    title: 'Re-render encoding manually'
  });
  // codeUpdateBtn.innerHTML = 'Redo';
  codeUpdateBtn.setAttribute('type', 'button');
  codeUpdateBtn.setAttribute('value', 'codeUpdate');
  codeUpdateBtn.disabled = true;
  updateCtrls.appendChild(codeUpdateBtn);

  codeUpdateCheckbox.addEventListener('change', () => {
    codeUpdateBtn.disabled = codeUpdateCheckbox.checked;
  });


  // font selector
  let fontList = ['Leipzig', 'Bravura', 'Gootville', 'Leland', 'Petaluma'];
  let fontCtrls = document.createElement('div');
  fontCtrls.id = 'font-ctrls';
  // fontCtrls.classList.add('block');
  fontCtrls.classList.add('controls');
  controlsForm.appendChild(fontCtrls);

  let fontSelector = document.createElement('select');
  fontSelector.id = 'font-select';
  fontSelector.classList.add('btn');
  addToolTip(fontCtrls, {
    title: 'Select engraving font'
  });
  fontSelector.classList.add('input-select');
  fontCtrls.appendChild(fontSelector);
  for (let f of fontList)
    fontSelector.add(new Option(f));

  // navigation controls
  let navigateCtrls = document.createElement('div');
  navigateCtrls.id = 'navigate-ctrls';
  // navigateCtrls.classList.add('block');
  navigateCtrls.classList.add('controls');
  controlsForm.appendChild(navigateCtrls);

  let backwardsBtn = document.createElement('button');
  backwardsBtn.id = "backwards-btn";
  backwardsBtn.classList.add('btn');
  backwardsBtn.classList.add('icon');
  backwardsBtn.classList.add('icon-arrow-left');
  backwardsBtn.classList.add('inline-block-tight');
  addToolTip(backwardsBtn, {
    title: 'Navigate to left'
  });
  navigateCtrls.appendChild(backwardsBtn);

  let forwardsBtn = document.createElement('button');
  forwardsBtn.id = "forwards-btn";
  forwardsBtn.classList.add('btn');
  forwardsBtn.classList.add('icon');
  forwardsBtn.classList.add('icon-arrow-right');
  forwardsBtn.classList.add('inline-block-tight');
  addToolTip(forwardsBtn, {
    title: 'Navigate to right'
  });
  navigateCtrls.appendChild(forwardsBtn);

  let upwardsBtn = document.createElement('button');
  upwardsBtn.id = "upwards-btn";
  upwardsBtn.classList.add('btn');
  upwardsBtn.classList.add('icon');
  upwardsBtn.classList.add('icon-arrow-up');
  upwardsBtn.classList.add('inline-block-tight');
  addToolTip(upwardsBtn, {
    title: 'Navigate to staffN higher layer'
  });
  navigateCtrls.appendChild(upwardsBtn);

  let downwardsBtn = document.createElement('button');
  downwardsBtn.id = "downwards-btn";
  downwardsBtn.classList.add('btn');
  downwardsBtn.classList.add('icon');
  downwardsBtn.classList.add('icon-arrow-down');
  downwardsBtn.classList.add('inline-block-tight');
  addToolTip(downwardsBtn, {
    title: 'Navigate to next lower layer'
  });
  navigateCtrls.appendChild(downwardsBtn);

  let speedDiv = document.createElement('div');
  speedDiv.id = 'speed-div';
  // versionDiv.classList.add('block');
  speedDiv.classList.add('controls');
  controlsForm.appendChild(speedDiv);

  let verovioIcon = document.createElement('img');
  verovioIcon.src = `${root}svg/v.svg`;
  verovioIcon.classList.add('icon');
  verovioIcon.id = 'verovio-icon';
  speedDiv.appendChild(verovioIcon);

  let speedLabel = document.createElement('label');
  speedLabel.innerText = 'Speedmode:';
  speedLabel.id = 'speed-label';
  speedLabel.classList.add('label');
  speedDiv.appendChild(speedLabel);
  addToolTip(speedLabel, {
    title: `In Speedmode,
            only current page is sent to Verovio
            to reduce rendering time with large files`
  });

  let speedCheckbox = document.createElement('input');
  speedCheckbox.id = "speed-checkbox";
  speedCheckbox.setAttribute('type', 'checkbox');
  speedCheckbox.setAttribute('checked', 'false');
  speedCheckbox.classList.add('checkbox');
  speedCheckbox.checked = true;
  speedCheckbox.disabled = false;
  // addToolTip(speedCheckbox, {
  //   title: 'Speed mode (optimized notation rendering)'
  // });
  speedDiv.appendChild(speedCheckbox);


  // container for on-the-fly changes to CSS styles (to change highlight color)
  let customStyle = document.createElement('style');
  customStyle.type = 'text/css';
  customStyle.id = 'customStyle';
  document.querySelector('head').appendChild(customStyle);

  // Create container element for Verovio SVG
  let verovioPanel = document.createElement('div');
  verovioPanel.classList.add('verovio-panel');
  // verovioPanel.classList.add('hidden');
  parentElement.appendChild(verovioPanel);

} // createControlsMenu()

export function manualCurrentPage(v, cm, ev) {
  console.debug('manualCurrentPage: ', ev);
  ev.stopPropagation();
  if (ev.key == 'Enter' || ev.type == 'blur') {
    ev.preventDefault();
    let pageInput = parseInt(ev.target.innerText);
    if (pageInput) v.updatePage(cm, pageInput);
    v.updatePageNumDisplay();
  }
}

// add a tooltip to element
export function addToolTip(element, object) {
  let t = document.createElement('span');
  t.classList.add('tooltiptext');
  t.innerHTML = object.title;
  element.appendChild(t);
  element.classList.add('tooltip');
}

export function setBreaksOptions(tkAvailableOptions, defaultValue = 'auto') {
  let breaksEl = document.getElementById('breaks-select');
  var breaksOpts = {
    auto: 'Automatic',
    smart: 'Smart',
    line: 'System',
    encoded: 'System and page',
    none: 'None'
  };
  var breaks = utils.findKey('breaks', tkAvailableOptions);
  for (let index of breaks.values) {
    if (breaksOpts[index]) {
      breaksEl[breaksEl.options.length] = new Option(breaksOpts[index], index);
      if (index == defaultValue) {
        breaksEl[breaksEl.options.length - 1].selected = 'selected';
      }
    } else {
      breaksEl[breaksEl.options.length] = new Option(index, index);
    }
  }
}

// checks xmlDoc for section, ending, lem, rdg elements for quick navigation
export function generateSectionSelect(xmlDoc) {
  let selector = 'section,ending,lem,rdg';
  let sections = [ //first option with empty string for Firefox (TODO: beautify)
    ['', '']
  ];
  let baseSection = xmlDoc.querySelector('music section');
  let els = Array.from(baseSection.querySelectorAll(selector));
  els.forEach(el => {
    let str = '';
    let parent = el.parentElement.closest(selector);
    while (parent = parent.parentElement.closest(selector))
      str += '│ '; // &#9474;&nbsp; for indentation
    sections.push([str + el.getAttribute('xml:id'), el.getAttribute('xml:id')]);
  });
  return sections;
}

export function addModifyerKeys(element) {
  let shiftKey = "&#8679;"; // SHIFT
  let altKey = "&#8997;"; // ALT
  let cmdKey = "&#8963;"; // CTRL
  let cmd2Key = "&#8997;"; // ALT
  if (navigator.platform.startsWith('Mac')) {
    cmdKey = "&#8984;"; // CMD
    cmd2Key = "&#8963;"; // CTRL
  }
  let ctrlKey = "&#8963;"; // CTRL
  element.querySelectorAll(".altKey")
    .forEach(e => e.innerHTML = altKey + e.innerHTML);
  element.querySelectorAll(".shiftKey")
    .forEach(e => e.innerHTML = shiftKey + e.innerHTML);
  element.querySelectorAll(".cmd2Key")
    .forEach(e => e.innerHTML = cmd2Key + e.innerHTML);
  element.querySelectorAll(".cmdKey")
    .forEach(e => e.innerHTML = cmdKey + e.innerHTML);
  element.querySelectorAll(".ctrlKey")
    .forEach(e => e.innerHTML = ctrlKey + e.innerHTML);
}
