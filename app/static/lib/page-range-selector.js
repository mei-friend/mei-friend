import { translator } from './main.js';

// array of selected page numbers
let pages = [1];
let firstPage = 1;
let lastPage = 1;
let pageCount = 1;
let currentPage = 1;

/**
 * Creates the page range selector
 * @returns {Element} pageRangeDiv
 */
export function createPageRangeSelector(display = 'none') {
  let pageRangeDiv = document.createElement('div');
  pageRangeDiv.setAttribute('id', 'pageRangeSelectorDiv');
  pageRangeDiv.classList.add('dropdown');
  pageRangeDiv.innerHTML = `
    <div class="controls">
        <div id="pagesLegendLabel" class="label">Page range</div>
    </div>
    <div id="pageRangeItems" class="dropdownContent show">
        <div>
            <input type="radio" id="selectAllPages" name="pagesSelect" value="all" checked/>
            <label for="selectAllPages" id="selectAllPagesLabel">All</label>
        </div>
        <div>
            <input type="radio" id="selectCurrentPage" name="pagesSelect" value="current" />
            <label for="selectCurrentPage" id="selectCurrentPageLabel">Current page</label>
        </div>

        <div>
            <input type="radio" id="selectFromTo" name="pagesSelect" value="fromto" />
            <label for="selectFromTo" id="selectFromLabel">from:</label>
            <input type="number" id="selectFrom" class="preventKeyBindings" name="firstPage" value="1" min="1"/>
        </div>
        <div>
            <div class="fillSpace"></div>
            <label for="selectFromTo" id="selectToLabel">to:</label>
            <input type="number" id="selectTo" class="preventKeyBindings" name="endPage" value="1" min="1" />
        </div>

        <div>
            <input type="radio" id="selectPageRange" name="pagesSelect" value="range" />
            <label for="selectPageRange" id="selectPageRangeLabel">Page range:</label>
        </div>

        <div>
            <input type="text" id="selectRange" class="preventKeyBindings" value="2, 5-8" name="selectRange" placeholder="2, 5-8" />
        </div>
    </div>`;
  if (display) pageRangeDiv.style.display = display;
  pageRangeDiv.addEventListener('input', (ev) => clicked(ev));
  return pageRangeDiv;
} // createPageRangeSelector()

/**
 * @returns pages array
 */
export function getPages() {
  return pages;
} // getPages()

/**
 * Gets called at each page change
 * @param {Viewer} v
 */
export function updatePageRangeSelector(v) {
  pageCount = v.pageCount;
  currentPage = v.currentPage;

  // in speed mode, only current page is possible
  if (v.speedMode) {
    pages = [currentPage];
    disablePageRangeMenu(true);
    document.getElementById('pagesLegendLabel').title = translator.lang.pdfPreviewSpeedModeWarning.text;
    document.getElementById('pageRangeItems').classList.remove('show');
  } else {
    disablePageRangeMenu(false);
    document.getElementById('selectTo').max = pageCount;
    lastPage = Math.min(lastPage, pageCount);
    if (document.getElementById('selectTo').value > pageCount) {
      document.getElementById('selectTo').value = pageCount;
    }
    document.getElementById('selectFrom').max = Math.min(document.getElementById('selectTo').value, pageCount);
    firstPage = Math.min(firstPage, lastPage);
    if (document.getElementById('selectFrom').value > lastPage) {
      document.getElementById('selectFrom').value = lastPage;
    }
    readValues();
    document.getElementById('pagesLegendLabel').title = translator.lang.pdfPreviewNormalModeTitle.text;
    document.getElementById('pageRangeItems').classList.add('show');
  }
  redrawTitle();
} // updatePageRangeSelector()

//#region Private helper functions

/**
 * Called from the menu items
 * @param {Event} ev
 */
function clicked(ev) {
  if (ev.target.name === 'firstPage') {
    firstPage = parseInt(ev.target.value);
    document.getElementById('selectFromTo').checked = true;
  } else if (ev.target.name === 'endPage') {
    lastPage = parseInt(ev.target.value);
    document.getElementById('selectFrom').max = lastPage;
    document.getElementById('selectFromTo').checked = true;
  } else if (ev.target.name === 'selectRange') {
    document.getElementById('selectPageRange').checked = true;
  }
  readValues();
  redrawTitle();
} // clicked()

function disablePageRangeMenu(disable = true) {
  document
    .getElementById('pageRangeItems')
    .querySelectorAll('input')
    .forEach((e) => (e.disabled = disable));
} // disablePageRangeMenu()

function generatePageRangeString(arr) {
  let struct = [];
  let oldPage = -1;
  for (let i = 0; i < arr.length; i++) {
    let currPage = arr.at(i);
    if (currPage - oldPage > 1) {
      struct.push([currPage]);
    } else {
      struct.at(-1)[1] = currPage;
    }
    oldPage = currPage;
  }
  let str = '';
  struct.forEach((s, i) => {
    str += s.join('&ndash;');
    if (i < struct.length - 1) {
      str += ', ';
    }
  });
  return str;
} // generatePageRangeString()

function parsePageRangeString(str) {
  let pageRange = [];
  str.split(',').forEach((s) => {
    let a = s.trim().split('-');
    for (let i = parseInt(a.at(0)); i <= parseInt(a.at(-1)); i++) {
      if (i >= 1 && i <= pageCount) {
        pageRange.push(i);
      }
    }
  });
  // sort and remove duplicates
  return pageRange.sort((a, b) => a - b).filter((item, idx) => pageRange.indexOf(item) === idx);
} // parsePageRangeString()

function readValues() {
  if (document.getElementById('selectAllPages').checked) {
    pages = seq(1, pageCount);
  }
  if (document.getElementById('selectCurrentPage').checked) {
    pages = [currentPage];
  }
  if (document.getElementById('selectFromTo').checked) {
    pages = seq(firstPage, lastPage);
  }
  if (document.getElementById('selectPageRange').checked) {
    let str = document.getElementById('selectRange').value;
    pages = parsePageRangeString(str);
  }
} // readValues()

function redrawTitle() {
  let pl = document.getElementById('pagesLegendLabel');
  if (pl && pages.length <= 1) {
    pl.innerHTML = translator.lang.pagesLegendLabel.singlePage + ': '
  } else {
    pl.innerHTML = translator.lang.pagesLegendLabel.multiplePages + ': ';
  }
  pl.innerHTML += generatePageRangeString(pages);
} // redrawTitle()

/**
 * Creates array of integers from i1 to i2
 * @param {Number} i1 
 * @param {Number} i2 
 * @returns 
 */
function seq(i1, i2) {
  let arr = [];
  for (let i = i1; i <= i2; i++) {
    arr.push(i);
  }
  return arr;
} // seq()
