export function createControlsMenu(parentElement, scale) {

  // Create control form
  let controlsForm = document.createElement('form');
  controlsForm.classList.add('controlMenu');
  controlsForm.id = 'verovio-controls-form';
  parentElement.appendChild(controlsForm);

  // zoom controls
  // controlsForm.innerHTML += `
  //   <div id="zoom-ctrls" class="block">
  //     <label id="Scale">Scale:</label>
  //     <button id="decrease-scale-btn" class="btn icon icon-diff-removed inline-block-tight" type="range" min="20" max="200" value="50"></button>
  //     <input id="verovio-zoom" class="btn inline-block-tight"></button>
  //     <button id="increase-scale-btn" class="btn icon icon-diff-added inline-block-tight"></button>
  //   </div>
  // `;

  // Zoom controls
  let zoomCtrls = document.createElement('div');
  zoomCtrls.id = 'zoom-ctrls';
  zoomCtrls.classList.add('controls');
  controlsForm.appendChild(zoomCtrls);

  // zoomLabel = document.createElement('label');
  // zoomLabel.innerText = 'Scale: ';
  // zoomCtrls.appendChild(zoomLabel);

  let decreaseBtn = document.createElement('button');
  decreaseBtn.id = "decrease-scale-btn";
  decreaseBtn.classList.add('btn');
  decreaseBtn.classList.add('btn-sm');
  decreaseBtn.classList.add('octicon');
  decreaseBtn.classList.add('octicon-diff-removed');
  decreaseBtn.classList.add('inline-block-tight');
  add(decreaseBtn, {
    title: 'Decrease notation'
  });
  zoomCtrls.appendChild(decreaseBtn);
  // zoomLabel.setAttribute('for', decreaseBtn.id);

  let zoomCtrl = document.createElement("input");
  zoomCtrl.id = 'verovio-zoom';
  zoomCtrl.classList.add('input-range');
  zoomCtrl.setAttribute('type', 'range');
  zoomCtrl.setAttribute('min', 10);
  zoomCtrl.setAttribute('max', 200);
  zoomCtrl.setAttribute('step', 1);
  zoomCtrl.setAttribute('value', `${scale}`);
  zoomCtrls.appendChild(zoomCtrl);
  add(zoomCtrl, {
    title: 'Scale notation'
  });

  let increaseBtn = document.createElement('button');
  increaseBtn.id = "increase-scale-btn";
  increaseBtn.classList.add('btn');
  increaseBtn.classList.add('btn-sm');
  increaseBtn.classList.add('octicon');
  increaseBtn.classList.add('octicon-diff-added');
  increaseBtn.classList.add('inline-block-tight');
  add(increaseBtn, {
    title: 'Increase notation'
  });
  zoomCtrls.appendChild(increaseBtn);

  let notationNightModeBtn = document.createElement('button');
  notationNightModeBtn.id = "notation-night-mode-btn";
  notationNightModeBtn.classList.add('btn');
  notationNightModeBtn.classList.add('btn-sm');
  notationNightModeBtn.classList.add('octicon');
  notationNightModeBtn.classList.add('octicon-ruby');
  notationNightModeBtn.classList.add('inline-block-tight');
  add(notationNightModeBtn, {
    title: 'Invert colors of notation'
  });
  zoomCtrls.appendChild(notationNightModeBtn);

  // Pagination, page navigation
  let paginationCtrls = document.createElement('div');
  paginationCtrls.id = 'pagination-ctrls';
  paginationCtrls.classList.add('controls');
  controlsForm.appendChild(paginationCtrls);

  let firstBtn = document.createElement('button');
  firstBtn.id = "first-page-btn";
  firstBtn.classList.add('octicon');
  firstBtn.classList.add('btn');
  firstBtn.classList.add('btn-sm');
  firstBtn.classList.add('octicon-move-left');
  firstBtn.classList.add('inline-block-tight');
  add(firstBtn, {
    title: 'Jump to first page'
  });
  firstBtn.setAttribute('type', 'button');
  firstBtn.setAttribute('value', 'first');
  paginationCtrls.appendChild(firstBtn);

  let prevBtn = document.createElement('button');
  prevBtn.id = "prev-page-btn";
  prevBtn.classList.add('octicon');
  prevBtn.classList.add('btn');
  prevBtn.classList.add('btn-sm');
  prevBtn.classList.add('octicon-chevron-left');
  prevBtn.classList.add('inline-block-tight');
  add(prevBtn, {
    title: 'Go to previous page'
  });
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('value', 'backwards');
  paginationCtrls.appendChild(prevBtn);

  let paginationLabel = document.createElement('label');
  paginationLabel.id = 'pagination-label';
  paginationLabel.innerHTML = `Loading`;
  paginationCtrls.appendChild(paginationLabel);

  let nextBtn = document.createElement('button');
  nextBtn.id = "next-page-btn";
  nextBtn.classList.add('btn');
  nextBtn.classList.add('btn-sm');
  nextBtn.classList.add('octicon');
  nextBtn.classList.add('octicon-chevron-right');
  nextBtn.classList.add('inline-block-tight');
  add(nextBtn, {
    title: 'Go to next page'
  });
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('value', 'forwards');
  paginationCtrls.appendChild(nextBtn);

  let lastBtn = document.createElement('button');
  lastBtn.id = "last-page-btn";
  lastBtn.classList.add('btn');
  lastBtn.classList.add('btn-sm');
  lastBtn.classList.add('octicon');
  lastBtn.classList.add('octicon-jump-right');
  lastBtn.classList.add('inline-block-tight');
  add(lastBtn, {
    title: 'Jump to last page'
  });
  lastBtn.setAttribute('type', 'button');
  lastBtn.setAttribute('value', 'last');
  paginationCtrls.appendChild(lastBtn);

  // WG: updates notation to cursor position in text
  let updateBtn = document.createElement('button');
  updateBtn.id = "update-btn";
  updateBtn.classList.add('btn');
  updateBtn.classList.add('btn-sm');
  updateBtn.classList.add('octicon');
  updateBtn.classList.add('octicon-alignment-align'); // icon-alignment-aligned-to
  updateBtn.classList.add('inline-block-tight');
  add(updateBtn, {
    title: 'Flip page to encoding cursor position'
  });
  updateBtn.setAttribute('type', 'button');
  updateBtn.setAttribute('value', 'update');
  paginationCtrls.appendChild(updateBtn);


  // breaks selector
  let breaksCtrls = document.createElement('div');
  breaksCtrls.id = 'breaks-ctrls';
  // breaksCtrls.classList.add('block');
  breaksCtrls.classList.add('controls');
  controlsForm.appendChild(breaksCtrls);

  let breaksSelector = document.createElement('select');
  breaksSelector.id = 'breaks-select';
  add(breaksSelector, {
    title: 'Define system/page breaks behavior of notation'
  });
  breaksSelector.classList.add('input-select');
  breaksCtrls.appendChild(breaksSelector);
  // set options found in default options and replace with nicer texts
  var breaksOptions = {
    auto: 'Automatic',
    smart: 'Smart',
    line: 'System',
    encoded: 'System and page',
    none: 'None'
  };
  // var breaks = utils.findKey('breaks', tkOptions);
  // for (index of breaks.values) {
  //   if (breaksOptions[index]) {
  //     breaksSelector[breaksSelector.options.length] =
  //       new Option(breaksOptions[index], index);
  //     if (index == breaks.default) {
  //       breaksSelector[breaksSelector.options.length - 1].selected = 'selected';
  //     }
  //   } else {
  //     breaksSelector[breaksSelector.options.length] =
  //       new Option(index, index);
  //   }
  // }
  let speedCheckbox = document.createElement('input');
  speedCheckbox.id = "speed-checkbox";
  speedCheckbox.setAttribute('type', 'checkbox');
  speedCheckbox.setAttribute('checked', 'false');
  speedCheckbox.checked = false;
  speedCheckbox.disabled = true;
  add(speedCheckbox, {
    title: 'Speed mode (optimized notation rendering)'
  });
  breaksCtrls.appendChild(speedCheckbox);

  // MEI encoding update behavior
  let updateCtrls = document.createElement('div');
  updateCtrls.id = 'update-ctrls';
  // updateCtrls.classList.add('block');
  updateCtrls.classList.add('controls');
  controlsForm.appendChild(updateCtrls);

  let updateLabel = document.createElement('label');
  updateLabel.innerText = 'Update: ';
  updateCtrls.appendChild(updateLabel);
  add(updateLabel, {
    title: 'Update behavior of notation after changes in encoding'
  });

  let liveupdateCtrl = document.createElement("input");
  liveupdateCtrl.id = 'live-update-checkbox';
  liveupdateCtrl.setAttribute('type', 'checkbox');
  liveupdateCtrl.setAttribute('checked', 'true');
  add(liveupdateCtrl, {
    title: 'Re-render notation automatically after each encoding change'
  });
  updateLabel.setAttribute('for', liveupdateCtrl.id);
  updateCtrls.appendChild(liveupdateCtrl);

  let codeUpdateBtn = document.createElement('button');
  codeUpdateBtn.id = "code-update-btn";
  codeUpdateBtn.classList.add('btn');
  codeUpdateBtn.classList.add('btn-sm');
  codeUpdateBtn.classList.add('octicon');
  codeUpdateBtn.classList.add('octicon-file-symlink-file'); // icon-alignment-aligned-to
  codeUpdateBtn.classList.add('inline-block-tight');
  add(codeUpdateBtn, {
    title: 'Re-render encoding manually'
  });
  // codeUpdateBtn.innerHTML = 'Redo';
  codeUpdateBtn.setAttribute('type', 'button');
  codeUpdateBtn.setAttribute('value', 'codeUpdate');
  codeUpdateBtn.disabled = true;
  updateCtrls.appendChild(codeUpdateBtn);

  // font selector
  let fontList = ['Leipzig', 'Bravura', 'Gootville', 'Leland', 'Petaluma'];
  let fontCtrls = document.createElement('div');
  fontCtrls.id = 'font-ctrls';
  // fontCtrls.classList.add('block');
  fontCtrls.classList.add('controls');
  controlsForm.appendChild(fontCtrls);

  let fontSelector = document.createElement('select');
  fontSelector.id = 'font-select';
  add(fontSelector, {
    title: 'Select engraving font'
  });
  fontSelector.classList.add('input-select');
  fontCtrls.appendChild(fontSelector);
  for (let f of fontList)
    fontSelector.add(new Option(f));

  // debug controls (for debugging code and testing new functionality)
  let navigateCtrls = document.createElement('div');
  navigateCtrls.id = 'navigate-ctrls';
  // navigateCtrls.classList.add('block');
  navigateCtrls.classList.add('controls');
  controlsForm.appendChild(navigateCtrls);

  // debugLabel = document.createElement('label');
  // debugLabel.innerText = 'Navigate: ';
  // navigateCtrls.appendChild(debugLabel);

  // debugBtn = document.createElement('button');
  // debugBtn.id = "debug-btn";
  // debugBtn.innerHTML = 'add slur';
  // debugBtn.setAttribute('type', 'button');
  // debugBtn.setAttribute('value', 'debug');
  // navigateCtrls.appendChild(debugBtn);
  //
  // xBtn = document.createElement('button');
  // xBtn.id = "x-btn";
  // xBtn.innerHTML = 'X';
  // xBtn.setAttribute('type', 'button');
  // xBtn.setAttribute('value', 'debug');
  // navigateCtrls.appendChild(xBtn);

  let backwardsBtn = document.createElement('button');
  backwardsBtn.id = "backwards-btn";
  backwardsBtn.classList.add('btn');
  backwardsBtn.classList.add('btn-sm');
  backwardsBtn.classList.add('octicon');
  backwardsBtn.classList.add('octicon-arrow-left');
  backwardsBtn.classList.add('inline-block-tight');
  add(backwardsBtn, {
    title: 'Navigate to left'
  });
  navigateCtrls.appendChild(backwardsBtn);

  let forwardsBtn = document.createElement('button');
  forwardsBtn.id = "forwards-btn";
  forwardsBtn.classList.add('btn');
  forwardsBtn.classList.add('btn-sm');
  forwardsBtn.classList.add('octicon');
  forwardsBtn.classList.add('octicon-arrow-right');
  forwardsBtn.classList.add('inline-block-tight');
  add(forwardsBtn, {
    title: 'Navigate to right'
  });
  navigateCtrls.appendChild(forwardsBtn);

  let upwardsBtn = document.createElement('button');
  upwardsBtn.id = "upwards-btn";
  upwardsBtn.classList.add('btn');
  upwardsBtn.classList.add('btn-sm');
  upwardsBtn.classList.add('octicon');
  upwardsBtn.classList.add('octicon-arrow-up');
  upwardsBtn.classList.add('inline-block-tight');
  add(upwardsBtn, {
    title: 'Navigate to staffN higher layer'
  });
  navigateCtrls.appendChild(upwardsBtn);

  let downwardsBtn = document.createElement('button');
  downwardsBtn.id = "downwards-btn";
  downwardsBtn.classList.add('btn');
  downwardsBtn.classList.add('btn-sm');
  downwardsBtn.classList.add('octicon');
  downwardsBtn.classList.add('octicon-arrow-down');
  downwardsBtn.classList.add('inline-block-tight');
  add(downwardsBtn, {
    title: 'Navigate to next lower layer'
  });
  navigateCtrls.appendChild(downwardsBtn);


  // Label for displaying Verovio version
  let versionDiv = document.createElement('div');
  versionDiv.id = 'version-div';
  // versionDiv.classList.add('block');
  versionDiv.classList.add('controls');
  controlsForm.appendChild(versionDiv);

  let verovioBtn = document.createElement('button');
  verovioBtn.id = "verovio-btn";
  verovioBtn.classList.add('btn');
  verovioBtn.classList.add('btn-sm');
  verovioBtn.classList.add('octicon');
  verovioBtn.classList.add('octicon-sync');
  verovioBtn.classList.add('inline-block-tight');
  add(verovioBtn, {
    title: 'Regenerate encoding through Verovio (Attention: non-standard encoding will be erased) (ALT: without xml:ids)'
  });
  versionDiv.appendChild(verovioBtn);

  let versionLabel = document.createElement('label');
  versionLabel.innerText = 'Verovio: ';
  versionDiv.appendChild(versionLabel);

  let helpBtn = document.createElement('button');
  helpBtn.id = "help-btn";
  helpBtn.classList.add('btn');
  helpBtn.classList.add('btn-sm');
  helpBtn.classList.add('octicon');
  helpBtn.classList.add('octicon-question');
  helpBtn.classList.add('inline-block-tight');
  add(helpBtn, {
    title: 'Show overview of keyboard shortcuts for inserting elements'
  });
  versionDiv.appendChild(helpBtn);

  // let helpPanel = document.createElement('atom-panel');
  // helpPanel.id = 'help-panel';
  // helpPanel.classList.add('hidden');
  // parentElement.appendChild(helpPanel);
  // helpPanel.innerHTML = help.helpText;

  // container for on-the-fly changes to CSS styles (to change highlight color)
  let customStyle = document.createElement('style');
  customStyle.type = 'text/css';
  document.querySelector('head').appendChild(customStyle);

  // Create container element for Verovio SVG
  let verovioPanel = document.createElement('div');
  verovioPanel.id = 'verovio-panel';
  // verovioPanel.classList.add('hidden');
  parentElement.appendChild(verovioPanel);
}

// add a tooltip to element
function add(element, object) {
  let t = document.createElement('span');
  t.classList.add('tooltiptext');
  t.innerHTML = object.title;
  element.appendChild(t);
  element.classList.add('tooltip');
}
