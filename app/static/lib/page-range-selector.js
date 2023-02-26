// array of selected page numbers
let pages = [1];
let firstPage = 1;
let lastPage = 1;
let pageCount = 1;
let currentPage = 1;

/**
 * @returns pages array
 */
export function getPages() {
  return pages;
} // getPages()

/**
 *
 * @returns {Element} pageRangeDiv
 */
export function createPageRangeSelector() {
  let pageRangeDiv = document.createElement('div');
  pageRangeDiv.setAttribute('id', 'pageRangeSelectorDiv');
  pageRangeDiv.classList.add('dropdown');
  pageRangeDiv.innerHTML = `
    <div class="controls">
        <div id="pagesLegend" class="label">Page range</div>
    </div>
    <div id="pageRangeItems" class="dropdown-content show">
        <div>
            <input type="radio" id="selectAllPages" name="pagesSelect" value="all" checked/>
            <label for="selectAllPages">All</label>
        </div>
        <div>
            <input type="radio" id="selectCurrentPage" name="pagesSelect" value="current" />
            <label for="selectCurrentPage">Current page</label>
        </div>

        <div>
            <input type="radio" id="selectFromTo" name="pagesSelect" value="fromto" />
            <label for="selectFromTo">from:</label>
            <input type="number" id="selectFrom" name="firstPage" value="1" min="1"/>
        </div>
        <div class="floatRight">
            <div class="fillSpace"></div>
            <label for="selectFromTo">to:</label>
            <input type="number" id="selectTo" name="endPage" value="1" min="1" />
        </div>

        <div>
            <input type="radio" id="selectPageRange" name="pagesSelect" value="range" />
            <label for="selectPageRange">Page range:</label>
        </div>

        <div>
            <input type="text" id="selectRange" value="selectRange" name="selectRange" placeholder="2, 5-8" />
        </div>
    </div>`;
  pageRangeDiv.addEventListener('input', (ev) => clicked(ev));
  return pageRangeDiv;
} // createPageRangeSelector()

/**
 * Gets called at each page change
 * @param {Viewer*} v
 */
export function updatePageRangeSelector(v) {
  pageCount = v.pageCount;
  currentPage = v.currentPage;
  document.getElementById('selectTo').max = pageCount;
  lastPage = Math.min(lastPage, pageCount);
  if (document.getElementById('selectTo').value > pageCount) document.getElementById('selectTo').value = pageCount;
  document.getElementById('selectFrom').max = Math.min(document.getElementById('selectTo').value, pageCount);
  firstPage = Math.min(firstPage, lastPage);
  if (document.getElementById('selectFrom').value > lastPage) document.getElementById('selectFrom').value = lastPage;
  readValues();
  redrawTitle();
} // updatePageRangeSelector()

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
  let pl = document.getElementById('pagesLegend');
  if (pl) pl.innerHTML = (pages.length > 1 ? 'Pages: ' : 'Page: ') + generatePageRangeString(pages);
} // redrawTitle()

function seq(i1, i2) {
  let arr = [];
  for (let i = i1; i <= i2; i++) {
    arr.push(i);
  }
  return arr;
} // seq()

function parsePageRangeString(str) {
  let pageRange = [];
  str.split(',').forEach((s) => {
    let a = s.trim().split('-');
    for (let i = parseInt(a.at(0)); i <= parseInt(a.at(-1)); i++) {
      if (i >= 1 && i <= pageCount) pageRange.push(i);
    }
  });
  // sort and remove duplicates
  return pageRange.sort((a, b) => a - b).filter((item, idx) => pageRange.indexOf(item) === idx);
} // parsePageRangeString()

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
    if (i < struct.length - 1) str += ', ';
  });
  return str;
} // generatePageRangeString()
