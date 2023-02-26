// array of selected page numbers
let pages = [];

/**
 *
 * @returns {Element} fieldset
 */
export function createPageRangeSelector() {
  let pageRangeDiv = document.createElement('div');
  pageRangeDiv.setAttribute('id', 'pageRangeSelectorDiv');
  pageRangeDiv.classList.add('dropdown');
  pageRangeDiv.innerHTML = `<div id="pagesLegend" class="controls">Pages: </div>
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
            <input type="number" id="selectFrom" value="1" min="1"/>
        </div>
        <div class="floatRight">
            <div class="fillSpace"></div>
            <label for="selectFromTo">to:</label>
            <input type="number" id="selectTo" value="1" min="1" />
        </div>

        <div>
            <input type="radio" id="selectPageRange" name="pagesSelect" value="range" />
            <label for="selectPageRange">Page range:</label>
        </div>

        <div>
            <input type="text" id="selectTo" value="2, 5-8" placeholder="2, 5-8" />
        </div>
    </div>`;
  return pageRangeDiv;
} // createPageRangeSelector()
