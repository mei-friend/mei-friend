import * as att from './attribute-classes.js';
import * as dutils from './dom-utils.js';
import * as prs from './page-range-selector.js';
import * as speed from './speed.js';
import * as utils from './utils.js';
import { getControlMenuState, showPdfButtons, setControlMenuState, setCheckbox } from './control-menu.js';
import { alert, download, info, success, verified, unverified, xCircleFill } from '../css/icons.js';
import * as facs from './facsimile.js';
//  drawFacsimile, highlightZone, zoomFacsimile
import {
  cm,
  cmd,
  meiFileName,
  rngLoader,
  storage,
  tkVersion,
  translator,
  validate,
  validator,
  version,
  versionDate,
} from './main.js';
import { selectMarkup } from './markup.js';
import { startMidiTimeout } from './midi-player.js';
import { getNotationProportion, setNotationProportion, setOrientation } from './resizer.js';
import {
  commonSchemas,
  codeMirrorSettingsOptions,
  defaultNotationProportion,
  defaultSpeedMode,
  defaultViewerTimeoutDelay,
  fontList,
  isSafari,
  meiFriendSettingsOptions,
  platform,
  supportedVerovioVersions,
} from './defaults.js';
import * as icon from './../css/icons.js';

export default class Viewer {
  constructor(vrvWorker, spdWorker) {
    this.vrvWorker = vrvWorker;
    this.spdWorker = spdWorker;
    this.validatorInitialized = false;
    this.validatorWithSchema = false;
    this.currentSchema = '';
    this.xmlIdStyle; // xml:id style (Original, Base36, mei-friend)
    this.updateLinting; // CodeMirror function for linting
    this.currentPage = 1;
    this.pageCount = 0;
    this.selectedElements = [];
    this.lastNoteId = '';
    this.notationNightMode = false;
    this.allowCursorActivity = true; // whether or not notation gets re-rendered after text changes
    this.allowNotationInteraction = true; // allow mouse drag-select and click on notation
    this.speedMode = defaultSpeedMode; // speed mode (just feeds on page to Verovio to reduce drawing time)
    this.parser = new DOMParser();
    this.xmlDoc;
    this.xmlDocOutdated = true; // to limit recalculation of DOM or pageLists
    this.toolkitDataOutdated = true; // to control re-loading of toolkit data in the worker
    this.pageBreaks = {}; // object of page number and last measure id '1': 'measure-000423', ...
    this.pageSpanners = {
      // object storing all time-spannind elements spanning across pages
      start: {},
      end: {},
    };
    // this.scoreDefList = []; // list of xmlNodes, one for each change, referenced by 5th element of pageList
    this.meiHeadRange = [];
    this.vrvOptions; // all verovio options
    this.vrvTimeout; // time out task for updating verovio settings
    this.timeoutDelay = defaultViewerTimeoutDelay; // ms, window in which concurrent clicks are treated as one update
    this.verovioIcon = document.getElementById('verovioIcon');
    this.breaksSelect = /** @type HTMLSelectElement */ (document.getElementById('breaksSelect'));
    this.alertCloser;
    this.pdfMode = false;
    this.cmd2KeyPressed = false;
    this.controlMenuState = {};
    this.settingsReplaceFriendContainer = false; // whether or not the settings panel is over the mei-friend window (false) or replaces it (true)
    this.notationProportion = defaultNotationProportion; // remember proportion during pdf mode
    this.expansionId = ''; // id string of currently selected expansion element
    this.facsimileObserver = new MutationObserver(() => facs.loadFacsimile(this.xmlDoc));
  } // constructor() // constructor()

  // change options, load new data, render current page, add listeners, highlight
  updateAll(cm, options = {}, xmlId = '') {
    this.setVerovioOptions(options);
    let computePageBreaks = false;
    let p = this.currentPage;
    if (this.speedMode && Object.keys(this.pageBreaks).length === 0 && this.breaksSelect.value === 'auto') {
      computePageBreaks = true;
      p = 1; // request page one, but leave currentPage unchanged
    }
    if (this.speedMode && xmlId) {
      const breaksOption = this.breaksSelect.value;
      speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId, breaksOption).then((p) => {
        this.changeCurrentPage(p);
        this.postUpdateAllMessage(xmlId, p, computePageBreaks);
      });
    } else {
      this.postUpdateAllMessage(xmlId, p, computePageBreaks);
    }
  } // updateAll()

  // helper function to send a message to the worker
  postUpdateAllMessage(xmlId, p, computePageBreaks) {
    let message = {
      cmd: 'updateAll',
      options: this.vrvOptions,
      mei: this.speedFilter(cm.getValue()),
      pageNo: p,
      xmlId: xmlId,
      speedMode: this.speedMode,
      computePageBreaks: computePageBreaks,
    };
    this.busy();
    this.vrvWorker.postMessage(message);
  } // postUpdateAllMessage()

  updateData(cm, setCursorToPageBeg = true, setFocusToVerovioPane = true, withMidiSeek = false) {
    let message = {
      breaks: this.breaksSelect.value,
      cmd: 'updateData',
      mei: this.speedFilter(cm.getValue()),
      pageNo: this.currentPage,
      xmlId: '',
      setCursorToPageBeginning: setCursorToPageBeg,
      setFocusToVerovioPane: setFocusToVerovioPane,
      speedMode: this.speedMode,
      withMidiSeek: withMidiSeek,
    };
    this.busy();
    this.vrvWorker.postMessage(message);
  } // updateData()

  updatePage(cm, page, xmlId = '', setFocusToVerovioPane = true, withMidiSeek = true) {
    if (this.changeCurrentPage(page) || xmlId) {
      if (!this.speedMode) {
        let message = {
          cmd: 'updatePage',
          pageNo: this.currentPage,
          xmlId: xmlId,
          setFocusToVerovioPane: setFocusToVerovioPane,
        };
        this.busy();
        this.vrvWorker.postMessage(message);
      } else {
        // speed mode
        this.loadXml(cm.getValue());
        if (xmlId) {
          speed
            .getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId, this.breaksSelect.value)
            .then((pageNumber) => {
              this.changeCurrentPage(pageNumber);
              console.info('UpdatePage(speedMode=true): page: ' + this.currentPage + ', xmlId: ' + xmlId);
              this.updateData(cm, xmlId ? false : true, setFocusToVerovioPane);
            });
        } else {
          withMidiSeek = withMidiSeek && document.getElementById('showMidiPlaybackControlBar').checked;
          this.updateData(cm, xmlId ? false : true, setFocusToVerovioPane, withMidiSeek);
        }
      }
    }
    if (withMidiSeek && document.getElementById('showMidiPlaybackControlBar').checked) {
      // start a new midi playback time-out (re-rendering if we're in speedmode)
      startMidiTimeout(this.speedMode ? true : false);
    }
  } // updatePage()

  // update: options, redoLayout, page/xml:id, render page
  updateLayout(options = {}) {
    this.updateQuick(options, 'updateLayout');
  } // updateLayout()

  // update: options, page/xml:id, render page
  updateOption(options = {}) {
    this.updateQuick(options, 'updateOption');
  } // updateOption()

  // updateLayout and updateOption
  updateQuick(options, what) {
    // if (!this.speedMode) {
    let id = '';
    if (this.selectedElements[0]) id = this.selectedElements[0];
    this.setVerovioOptions(options);
    let message = {
      cmd: what,
      pageNo: this.currentPage,
      options: this.vrvOptions,
      speedMode: this.speedMode,
      toolkitDataOutdated: this.toolkitDataOutdated,
      xmlId: id,
    };
    // pass MEI through to worker, if tk is outDated or in speed mode
    if (this.speedMode || this.toolkitDataOutdated) {
      message.mei = this.speedFilter(cm.getValue());
    }
    this.busy();
    this.vrvWorker.postMessage(message);
  } // updateQuick()

  // central wrapper function for both speed mode and normal mode
  async getPageWithElement(xmlId) {
    let pageNumber = -1;
    if (this.speedMode) {
      pageNumber = speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId, this.breaksSelect.value);
    } else {
      pageNumber = await this.getPageWithElementFromVrvWorker(xmlId);
    }
    return pageNumber;
  } // getPageWithElement()

  // for normal mode
  getPageWithElementFromVrvWorker(xmlId) {
    let that = this;
    return new Promise(
      function (resolve) {
        let taskId = Math.random();
        const msg = {
          cmd: 'getPageWithElement',
          msg: xmlId,
          taskId: taskId,
        };
        that.vrvWorker.addEventListener('message', function handle(ev) {
          if (ev.data.cmd === 'pageWithElement' && ev.data.taskId === taskId) {
            let p = ev.data.msg;
            that.vrvWorker.removeEventListener('message', handle);
            resolve(p);
          }
        });
        that.vrvWorker.postMessage(msg);
      }.bind(that)
    );
  } // getPageWithElementFromVrvWorker()

  // with normal mode: load DOM and pass-through the MEI code;
  // with speed mode: load into DOM (if xmlDocOutdated) and
  // return MEI excerpt of currentPage page
  // (including dummy measures before and after current page by default)
  speedFilter(mei, includeDummyMeasures = true, forceReload = false) {
    let breaks = this.breaksValue();
    let breaksSelectVal = this.breaksSelect.value;
    if (!this.speedMode || breaksSelectVal === 'none') {
      return mei;
    }
    // update DOM only if encoding has been edited or
    this.loadXml(mei, forceReload);
    this.xmlDoc = selectMarkup(this.xmlDoc); // select markup
    // count pages from system/pagebreaks
    if (Array.isArray(breaks)) {
      let music = this.xmlDoc.querySelector('music score');
      let elements;
      if (music) elements = music.querySelectorAll('measure, sb, pb');
      else return '';
      // count pages
      this.pageCount = 1; // pages are one-based
      let countBreaks = false;
      for (let e of elements) {
        if (e.nodeName === 'measure') countBreaks = true; // skip leading breaks
        if (countBreaks && breaks.includes(e.nodeName)) {
          // if within app, increment only if inside lem or 1st rdg
          if (dutils.countAsBreak(e)) this.pageCount++;
        }
      }
      for (let e of Array.from(elements).reverse()) {
        // skip trailing breaks
        if (e.nodeName === 'measure') break;
        if (countBreaks && breaks.includes(e.nodeName)) this.pageCount--;
      }
    }
    if (this.pageCount > 0 && (this.currentPage < 1 || this.currentPage > this.pageCount)) this.currentPage = 1;
    console.info('xmlDOM pages counted: currentPage: ' + this.currentPage + ', pageCount: ' + this.pageCount);
    // compute time-spanning elements object in speed-worker
    if (
      tkVersion &&
      this.pageSpanners.start &&
      Object.keys(this.pageSpanners.start).length === 0 &&
      (breaksSelectVal !== 'auto' || Object.keys(this.pageBreaks).length > 0)
    ) {
      // use worker solution with swift txml parsing
      let message = {
        cmd: 'listPageSpanningElements',
        mei: mei,
        breaks: breaks,
        breaksOpt: breaksSelectVal,
      };
      this.busy(true, true); // busy with anti-clockwise rotation
      this.spdWorker.postMessage(message);
      // this.pageSpanners = speed
      //   .listPageSpanningElements(this.xmlDoc, breaks, breaksSelectVal);
      // if (Object.keys(this.pageSpanners).length > 0)
      //   console.log('pageSpanners object size: ' +
      //     Object.keys(this.pageSpanners.start).length + ', ', this.pageSpanners);
      // else console.log('pageSpanners empty: ', this.pageSpanners);
    }
    // retrieve requested MEI page from DOM
    return speed.getPageFromDom(this.xmlDoc, this.currentPage, breaks, this.pageSpanners, includeDummyMeasures);
  } // speedFilter()

  loadXml(mei, forceReload = false) {
    if (this.xmlDocOutdated || forceReload) {
      this.facsimileObserver.disconnect();
      this.xmlDoc = this.parser.parseFromString(mei, 'text/xml');
      this.xmlDocOutdated = false;
      let facsimile = this.xmlDoc.querySelector('facsimile');
      if (facsimile) {
        facs.loadFacsimile(this.xmlDoc);
        this.facsimileObserver.observe(facsimile, { attributes: true, childList: true, subtree: true });
      }
    }
  } // loadXml()

  // returns true if sb/pb elements are contained (more than the leading pb)
  containsBreaks() {
    let music = this.xmlDoc.querySelector('music');
    let elements;
    if (music) elements = music.querySelectorAll('measure, sb, pb');
    else return false;
    let countBreaks = false;
    for (let e of elements) {
      if (e.nodeName === 'measure') countBreaks = true; // skip leading breaks
      if (countBreaks && ['sb', 'pb'].includes(e.nodeName)) return true;
    }
    return false;
  } // containsBreaks()

  clear() {
    this.selectedElements = [];
    this.lastNoteId = '';
    this.currentPage = 1;
    this.pageCount = -1;
    this.pageBreaks = {};
    this.pageSpanners = {
      start: {},
      end: {},
    };
    this.expansionId = '';
  } // clear()

  // re-render MEI through Verovio, while removing or adding xml:ids
  reRenderMei(cm, removeIds = false) {
    let message = {
      cmd: 'reRenderMei',
      format: 'mei',
      mei: cm.getValue(),
      pageNo: this.currentPage,
      removeIds: removeIds,
    };
    if (false && !removeIds) message.xmlId = this.selectedElements[0]; // TODO
    this.busy();
    this.vrvWorker.postMessage(message);
  } // reRenderMei()

  computePageBreaks(cm) {
    let message = {
      cmd: 'computePageBreaks',
      options: this.vrvOptions,
      format: 'mei',
      mei: cm.getValue(),
    };
    this.busy();
    this.vrvWorker.postMessage(message);
  } // computePageBreaks()

  // update options in viewer from user interface
  setVerovioOptions(newOptions = {}) {
    if (Object.keys(newOptions).length > 0)
      this.vrvOptions = {
        ...newOptions,
      };
    let zoom = document.getElementById('verovioZoom');
    if (zoom) this.vrvOptions.scale = parseInt(zoom.value);
    let fontSel = document.getElementById('engravingFontSelect');
    if (fontSel) this.vrvOptions.font = fontSel.value;
    let bs = this.breaksSelect;
    if (bs) this.vrvOptions.breaks = bs.value;

    // update page dimensions, only if not in pdf mode
    if (this.pdfMode) {
      let vpw = document.getElementById('vrv-pageWidth');
      if (vpw) this.vrvOptions.pageWidth = vpw.value;
      let vph = document.getElementById('vrv-pageHeight');
      if (vph) this.vrvOptions.pageHeight = vph.value;
    } else {
      let dimensions = {}; // = getVerovioContainerSize();
      let vp = document.getElementById('verovio-panel');
      dimensions.width = vp.clientWidth;
      dimensions.height = vp.clientHeight;
      // console.info('client size: ' + dimensions.width + '/' + dimensions.height);
      if (this.vrvOptions.breaks !== 'none') {
        this.vrvOptions.pageWidth = Math.max(Math.round(dimensions.width * (100 / this.vrvOptions.scale)), 100);
        this.vrvOptions.pageHeight = Math.max(Math.round(dimensions.height * (100 / this.vrvOptions.scale)), 100);
      }
      // console.info('Vrv pageWidth/Height: ' + this.vrvOptions.pageWidth + '/' + this.vrvOptions.pageHeight);
    }
    // overwrite existing options if new ones are passed in
    // for (let key in newOptions) { this.vrvOptions[key] = newOptions[key]; }
    console.debug('Verovio options updated: ', this.vrvOptions);
  } // setVerovioOptions()

  // accepts number or string (first, last, forwards, backwards)
  changeCurrentPage(newPage) {
    let targetpage = -1;
    if (Number.isInteger(newPage)) {
      targetpage = newPage;
      // console.info('targetPage: ', targetpage);
    } else if (typeof newPage === 'string') {
      newPage = newPage.toLowerCase();
      if (newPage === 'first') {
        targetpage = 1;
      } else if (newPage === 'last') {
        targetpage = this.pageCount;
      } else if (newPage === 'forwards') {
        if (this.currentPage < this.pageCount) {
          targetpage = this.currentPage + 1;
        }
      } else if (newPage === 'backwards') {
        if (this.currentPage > 1) {
          targetpage = this.currentPage - 1;
        }
      }
    }
    // if within a sensible range, update and return true
    if (targetpage > 0 && targetpage <= this.pageCount && targetpage != this.currentPage) {
      this.currentPage = targetpage;
      if (storage && storage.supported) storage.page = this.currentPage;
      this.updatePageNumDisplay();
      return true;
    }
    // dont update and return false otherwise
    return false;
  } // changeCurrentPage()

  updatePageNumDisplay() {
    let pg = this.pageCount < 0 ? '?' : this.pageCount;
    document.getElementById('pagination1').innerHTML = translator.lang.pagination1.html;
    document.getElementById('pagination2').innerHTML = `&nbsp;${this.currentPage}&nbsp;`;
    document.getElementById('pagination3').innerHTML = translator.lang.pagination3.html;
    document.getElementById('pagination4').innerHTML = `&nbsp;${pg}`;
    prs.updatePageRangeSelector(this);
  } // updatePageNumDisplay()

  // set cursor to first note id in page, taking st/ly of id, if possible
  setCursorToPageBeginning(cm) {
    this.selectedElements = [];
    if (!this.allowNotationInteraction) return;
    let id = this.lastNoteId;
    let stNo, lyNo;
    let sc;
    if (id === '') {
      let note = document.querySelector('.note');
      if (note) id = note.getAttribute('id');
      else return '';
    } else {
      sc = cm.getSearchCursor('xml:id="' + id + '"');
      if (sc.findNext()) {
        const p = sc.from();
        stNo = utils.getElementAttributeAbove(cm, p.line, 'staff')[0];
        lyNo = utils.getElementAttributeAbove(cm, p.line, 'layer')[0];
        let m = document.querySelector('.measure');
        // console.info('setCursorToPgBg st/ly;m: ' + stNo + '/' + lyNo + '; ', m);
        if (m) {
          id = dutils.getFirstInMeasure(m, dutils.navElsSelector, stNo, lyNo);
        }
      }
    }
    utils.setCursorToId(cm, id);
    // console.info('setCrsrToPgBeg(): lastNoteId: ' + this.lastNoteId + ', new id: ' + id);
    if (!this.selectedElements.includes(id)) this.selectedElements.push(id);
    this.lastNoteId = id;
    return id;
  } // setCursorToPageBeginning()

  addNotationEventListeners(cm) {
    let vp = document.getElementById('verovio-panel');
    if (vp) {
      let elements = vp.querySelectorAll('g[id],rect[id],text[id]');
      elements.forEach((item) => {
        item.addEventListener('click', (event) => this.handleClickOnNotation(event, cm));
      });
    }
  } // addNotationEventListeners()

  handleClickOnNotation(e, cm) {
    if (!this.allowNotationInteraction) return;
    e.stopImmediatePropagation();
    this.hideAlerts();
    let point = {};
    point.x = e.clientX;
    point.y = e.clientY;
    var matrix = document.querySelector('g.page-margin').getScreenCTM().inverse();
    let r = {};
    r.x = matrix.a * point.x + matrix.c * point.y + matrix.e;
    r.y = matrix.b * point.x + matrix.d * point.y + matrix.f;
    console.debug('Click on ' + e.srcElement.id + ', x/y: ' + r.x + '/' + r.y);

    this.allowCursorActivity = false;
    // console.info('click: ', e);
    let itemId = String(e.currentTarget.id);
    if (itemId === 'undefined') return;
    // take chord rather than note xml:id, when ALT is pressed
    let chordId = utils.insideParent(itemId);
    if (e.altKey && chordId) itemId = chordId;
    // select tuplet when clicking on tupletNum
    if (e.currentTarget.getAttribute('class') === 'tupletNum') itemId = utils.insideParent(itemId, 'tuplet');

    let msg = 'handleClickOnNotation() ';
    if ((platform.startsWith('mac') && e.metaKey) || e.ctrlKey) {
      if (this.selectedElements.includes(itemId)) {
        this.selectedElements.splice(this.selectedElements.indexOf(itemId), 1);
        msg += 'removed: ' + itemId + ', size: ' + this.selectedElements.length;
      } else {
        this.selectedElements.push(itemId);
        msg += 'added: ' + itemId + ', size: ' + this.selectedElements.length;
      }
    } else {
      // set cursor position in buffer
      let found = utils.setCursorToId(cm, itemId);
      if (!found) {
        this.showMissingIdsWarning(e.currentTarget.classList.item(0));
      }
      this.selectedElements = [];
      this.selectedElements.push(itemId);
      msg += 'Added as first element: ' + itemId;
    }
    //console.log(msg);
    console.log('handleClickOnNotation() selectedElements: ', this.selectedElements);
    this.scrollSvgTo(cm, e);
    this.updateHighlight(cm);
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      console.log('Viewer.handleClickOnNotation(): HANDLE CLICK MIDI TIMEOUT');
      startMidiTimeout();
    }
    this.setFocusToVerovioPane();

    // set lastNoteId to @startid of control element
    let startid = this.xmlDoc.querySelector('[*|id="' + itemId + '"]')?.getAttribute('startid');
    this.lastNoteId = startid ? utils.rmHash(startid) : itemId;
    this.allowCursorActivity = true;
  } // handleClickOnNotation()

  showMissingIdsWarning(nodeName = '') {
    if (
      [
        'note',
        'rest',
        'chord',
        'mRest',
        'multiRest',
        'beam',
        'tuplet',
        //'accid',
        //'artic',
        'bTrem',
        'fTrem',
        'ambNote',
        'mRpt',
        'mRpt2',
        'halfmRpt',
      ]
        .concat(att.modelControlEvents)
        .includes(nodeName)
    ) {
      this.showAlert(
        translator.lang.missingIdsWarningAlert.text +
          ' (' +
          translator.lang.manipulateMenuTitle.text +
          '&mdash;' +
          translator.lang.addIdsText.text +
          ')',
        'warning'
      );
    }
  } // showMissingIdsWarning()

  // when cursor pos in editor changed, update notation location / highlight
  cursorActivity(cm, forceFlip = false) {
    if (this.allowCursorActivity) {
      let id = utils.getElementIdAtCursor(cm);
      // console.log('cursorActivity forceFlip: ' + forceFlip + ' to: ' + id);
      this.selectedElements = [];
      if (id) {
        if (!this.selectedElements.includes(id)) this.selectedElements.push(id);
        let fl = document.getElementById('flipCheckbox');
        if (
          !document.querySelector('g#' + utils.escapeXmlId(id)) && // when not on current page
          ((fl && fl.checked) || forceFlip)
        ) {
          this.updatePage(cm, '', id, false);
        } else {
          // on current page
          this.scrollSvgTo(cm);
          this.updateHighlight(cm);
        }
      }
      console.log('cursorActivity() selectedElements: ', this.selectedElements);
    }
  } // cursorActivity()

  /**
   * Scroll notation SVG (and facsimile zone if there) into view,
   * both vertically and horizontally
   * @param {string|CodeMirror} cmOrId
   * @param {MouseEvent} ev
   * @returns
   */
  scrollSvgTo(cmOrId, ev = null) {
    let vp = document.getElementById('verovio-panel');
    let fp = document.getElementById('facsimile-panel');
    // retrieve current id from CodeMirror or use string
    let id = typeof cmOrId === 'string' ? cmOrId : utils.getElementIdAtCursor(cmOrId);
    if (!id || !vp || !fp) return;

    let scrollNotation = true;
    let scrollFacsimile = true;
    // check event target
    if (ev) {
      let target = ev.target;
      if (target.closest('#verovio-panel')) {
        scrollNotation = false;
      } else if (target.closest('#facsimile-panel')) {
        scrollFacsimile = false;
      }
    }
    if (scrollNotation) {
      // search element in notation SVG and scroll to it
      let el = document.querySelector('g#' + utils.escapeXmlId(id));
      if (el) dutils.scrollTo(vp, el);
    }

    // search element in facsimile SVG and scroll to it
    let sfp = document.getElementById('showFacsimilePanel');
    if (sfp && sfp.checked && scrollFacsimile) {
      let rect = document.querySelector('rect#' + id);
      if (rect) dutils.scrollTo(fp, rect);
    }
  } // scrollSvgTo()

  // when editor emits changes, update notation rendering
  notationUpdated(cm, forceUpdate = false) {
    if (document.getElementById('showMidiPlaybackControlBar').checked) {
      cmd.toggleMidiPlaybackControlBar();
    }
    // console.log('NotationUpdated forceUpdate:' + forceUpdate);
    this.xmlDocOutdated = true;
    this.toolkitDataOutdated = true;
    if (!isSafari) this.checkSchema(cm.getValue());
    let ch = document.getElementById('liveUpdateCheckbox');
    if ((this.allowCursorActivity && ch && ch.checked) || forceUpdate) {
      this.setRespSelectOptions();
      this.updateData(cm, false, false);
    }
  } // notationUpdated()

  /**
   * Highlights currently selected elements or the element at cursor in CodeMirror.
   * If cm is left out, all are cleared
   * @param {CodeMirror} cm
   */
  updateHighlight(cm) {
    // clear existing highlighted classes
    let highlighted = document.querySelectorAll('.highlighted');
    highlighted.forEach((e) => e.classList.remove('highlighted'));

    // create array of id strings from selectedElements or from cursor position
    let ids = [];
    if (this.selectedElements.length > 0) {
      this.selectedElements.forEach((item) => ids.push(item));
    } else if (cm) {
      ids.push(utils.getElementIdAtCursor(cm));
      console.log('updateHighlight() take id from cursor: ' + ids[0]);
    }
    // console.info('updateHighlight() ids: ', ids);

    // highlight those elements
    for (let id of ids) {
      if (id) {
        let el = document.querySelectorAll('#' + utils.escapeXmlId(id)); // was: 'g#'+id
        // console.log('updatehighlight() el list: ', el);
        if (el) {
          el.forEach((e) => {
            // console.log('updatehighlight() e: ', e);
            if (e.nodeName === 'rect' && e.closest('#facsimile-panel')) {
              facs.highlightZone(e);
            } else if (e.hasAttribute('data-facs')) {
              let ref = utils.rmHash(e.getAttribute('data-facs'));
              if (ref) {
                let zone = document.getElementById(ref);
                if (zone) facs.highlightZone(zone);
              }
            }
            e.classList.add('highlighted');
            e.querySelectorAll('g').forEach((g) => g.classList.add('highlighted'));
          });
        }
      }
    }
  } // updateHighlight()

  setNotationColors(matchTheme = false, alwaysBW = false) {
    // work-around that booleans retrieved from storage are strings
    if (typeof matchTheme === 'string') matchTheme = matchTheme === 'true';
    if (typeof alwaysBW === 'string') alwaysBW = alwaysBW === 'true';
    let rt = document.querySelector(':root');
    if (alwaysBW) {
      rt.style.setProperty('--notationBackgroundColor', 'var(--defaultNotationBackgroundColor)');
      rt.style.setProperty('--notationColor', 'var(--defaultNotationColor)');
      rt.style.setProperty('--highlightColor', 'var(--defaultHighlightColor)');
      return;
    }
    if (matchTheme) {
      let cm = window.getComputedStyle(document.querySelector('.CodeMirror'));
      rt.style.setProperty('--notationBackgroundColor', cm.backgroundColor);
      rt.style.setProperty('--notationColor', cm.color);
      let cmAtt = document.querySelector('.cm-attribute');
      if (cmAtt) rt.style.setProperty('--highlightColor', window.getComputedStyle(cmAtt).color);
    } else {
      rt.style.setProperty('--notationBackgroundColor', 'var(--defaultBackgroundColor)');
      rt.style.setProperty('--notationColor', 'var(--defaultTextColor)');
      rt.style.setProperty('--highlightColor', 'var(--defaultHighlightColor)');
    }
  } // setNotationColors()

  // sets the color scheme of the active theme
  setMenuColors() {
    let rt = document.querySelector(':root');
    let cm = window.getComputedStyle(document.querySelector('.CodeMirror'));
    rt.style.setProperty('--backgroundColor', cm.backgroundColor);
    // rt.style.setProperty('color', cm.color);
    rt.style.setProperty('--textColor', cm.color);
    let j = 0;
    cm.backgroundColor
      .slice(4, -1)
      .split(',')
      .forEach((i) => (j += parseInt(i)));
    j /= 3;
    // console.log('setMenuColors lightness: ' + j + ', ' + ((j < 128) ? 'dark' : 'bright') + '.');
    let els = document.querySelectorAll('.CodeMirror-scrollbar-filler');
    let owl = document.getElementById('mei-friend-logo');
    let owlSrc = owl.getAttribute('src');
    owlSrc = owlSrc.substring(0, owlSrc.lastIndexOf('/') + 1);
    if (env === environments.staging) {
      owlSrc += 'staging-';
    } else if (env === environments.testing) {
      owlSrc += 'testing-';
    }
    let splashOwl = document.getElementById('splashLogo');
    let splashOwlSrc = splashOwl.getAttribute('src'); // splash logo does not adjust with environment
    splashOwlSrc = splashOwlSrc.substring(0, splashOwlSrc.lastIndexOf('/') + 1);
    if (j < 128) {
      // dark
      // wake up owl
      owlSrc += 'menu-logo' + (isSafari ? '.png' : '.svg');
      splashOwlSrc += 'menu-logo' + (isSafari ? '.png' : '.svg');
      els.forEach((el) => el.style.setProperty('filter', 'invert(.8)'));
      rt.style.setProperty('--settingsLinkBackgroundColor', utils.brighter(cm.backgroundColor, 21));
      rt.style.setProperty('--settingsLinkHoverColor', utils.brighter(cm.backgroundColor, 36));
      rt.style.setProperty('--settingsBackgroundColor', utils.brighter(cm.backgroundColor, 36));
      rt.style.setProperty('--settingsBackgroundAlternativeColor', utils.brighter(cm.backgroundColor, 24));
      rt.style.setProperty('--controlMenuBackgroundColor', utils.brighter(cm.backgroundColor, 8));
      rt.style.setProperty('--navbarBackgroundColor', utils.brighter(cm.backgroundColor, 50));
      rt.style.setProperty('--dropdownHeadingColor', utils.brighter(cm.backgroundColor, 70));
      rt.style.setProperty('--dropdownBackgroundColor', utils.brighter(cm.backgroundColor, 50));
      rt.style.setProperty('--validationStatusBackgroundColor', utils.brighter(cm.backgroundColor, 50, 0.3));
      rt.style.setProperty('--dropdownBorderColor', utils.brighter(cm.backgroundColor, 100));
      let att = document.querySelector('.cm-attribute');
      if (att) rt.style.setProperty('--keyboardShortCutColor', utils.brighter(window.getComputedStyle(att).color, 40));
      let tag = document.querySelector('.cm-tag');
      if (tag) rt.style.setProperty('--fileStatusColor', utils.brighter(window.getComputedStyle(tag).color, 40));
      let str = document.querySelector('.cm-string');
      if (str) {
        rt.style.setProperty('--fileStatusChangedColor', utils.brighter(window.getComputedStyle(str).color, 40));
        rt.style.setProperty('--fileStatusWarnColor', utils.brighter(window.getComputedStyle(str).color, 10));
      }
      rt.style.setProperty(
        '--annotationPanelBackgroundColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor')
      );
      // utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelBackgroundColor'), -40));
      rt.style.setProperty(
        '--annotationPanelLinkBackgroundColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'), -30)
      );
      rt.style.setProperty(
        '--annotationPanelHoverColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'), -60)
      );
      rt.style.setProperty('--annotationPanelTextColor', 'white');
      rt.style.setProperty(
        '--annotationPanelBorderColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'), 30)
      );
    } else {
      // bright mode
      // sleepy owl
      owlSrc += 'menu-logo-asleep' + (isSafari ? '.png' : '.svg');
      splashOwlSrc += 'menu-logo-asleep' + (isSafari ? '.png' : '.svg');
      els.forEach((el) => el.style.removeProperty('filter'));
      rt.style.setProperty('--settingsLinkBackgroundColor', utils.brighter(cm.backgroundColor, -16));
      rt.style.setProperty('--settingsLinkHoverColor', utils.brighter(cm.backgroundColor, -24));
      rt.style.setProperty('--settingsBackgroundColor', utils.brighter(cm.backgroundColor, -36));
      rt.style.setProperty('--settingsBackgroundAlternativeColor', utils.brighter(cm.backgroundColor, -24));
      rt.style.setProperty('--controlMenuBackgroundColor', utils.brighter(cm.backgroundColor, -8));
      rt.style.setProperty('--navbarBackgroundColor', utils.brighter(cm.backgroundColor, -50));
      rt.style.setProperty('--dropdownHeadingColor', utils.brighter(cm.backgroundColor, -70));
      rt.style.setProperty('--dropdownBackgroundColor', utils.brighter(cm.backgroundColor, -50));
      rt.style.setProperty('--validationStatusBackgroundColor', utils.brighter(cm.backgroundColor, -50, 0.3));
      rt.style.setProperty('--dropdownBorderColor', utils.brighter(cm.backgroundColor, -100));
      let att = document.querySelector('.cm-attribute');
      if (att) rt.style.setProperty('--keyboardShortCutColor', utils.brighter(window.getComputedStyle(att).color, -40));
      let tag = document.querySelector('.cm-tag');
      if (tag) rt.style.setProperty('--fileStatusColor', utils.brighter(window.getComputedStyle(tag).color, -40));
      let str = document.querySelector('.cm-string');
      if (str) {
        rt.style.setProperty('--fileStatusChangedColor', utils.brighter(window.getComputedStyle(str).color, -40));
        rt.style.setProperty('--fileStatusWarnColor', utils.brighter(window.getComputedStyle(str).color, -10));
      }
      rt.style.setProperty(
        '--annotationPanelBackgroundColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelBackgroundColor')
      );
      rt.style.setProperty(
        '--annotationPanelLinkBackgroundColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelLinkBackgroundColor')
      );
      rt.style.setProperty(
        '--annotationPanelHoverColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelHoverColor')
      );
      rt.style.setProperty(
        '--annotationPanelTextColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelTextColor')
      );
      rt.style.setProperty(
        '--annotationPanelBorderColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelBackgroundColor'), -30)
      );
    }
    owl.setAttribute('src', owlSrc);
    splashOwl.setAttribute('src', splashOwlSrc);
  } // setMenuColors()

  // Control zoom of notation display and update Verovio layout
  zoom(delta, storage = null) {
    let zoomCtrl = document.getElementById('verovioZoom');
    if (zoomCtrl) {
      if (delta <= 30)
        // delta only up to 30% difference
        zoomCtrl.value = parseInt(zoomCtrl.value) + delta;
      // otherwise take it as the scaling value
      else zoomCtrl.value = delta;
      if (storage && storage.supported) storage.scale = zoomCtrl.value;
      this.updateLayout();
    }
  } // zoom()

  // change font size of editor panel (sign is direction
  // or percent when larger than 30)
  changeEditorFontSize(delta) {
    let zf = document.getElementById('zoomFont');
    let value = delta;
    if (delta < 30) value = parseInt(zf.value) + delta;
    value = Math.min(300, Math.max(45, value)); // 45---300, see #zoomFont
    document.getElementById('encoding').style.fontSize = value + '%';
    zf.value = value;
    cm.refresh(); // to align selections with new font size (24 Sept 2022)
  } // changeEditorFontSize()

  // set focus to verovioPane in order to ensure working key bindings
  setFocusToVerovioPane() {
    let el = document.getElementById('verovio-panel');
    // el.setAttribute('tabindex', '-1');
    el.focus();
  } // setFocusToVerovioPane()

  /**
   * Switch focus between notation panel and encoding panel
   * @param {CodeMirror} cm
   */
  switchFocusBetweenNotationAndEncoding(cm) {
    let vrvP = document.getElementById('notation');
    if (document.activeElement.closest('#notation')) {
      console.debug('Viewer.switchFocusBetweenNotationAndEncoding(): Switching now to encoding.', cm);
      cm.focus();
    } else {
      console.debug('Viewer.switchFocusBetweenNotationAndEncoding(): Switching to now notation.', vrvP);
      vrvP.focus();
    }
  } // switchFocusBetweenNotationAndEncoding()

  showSettingsPanel() {
    let sp = document.getElementById('settingsPanel');
    if (sp.style.display !== 'block') sp.style.display = 'block';
    sp.classList.remove('out');
    sp.classList.add('in');
    document.getElementById('showSettingsButton').style.visibility = 'hidden';
    if (this.settingsReplaceFriendContainer) setOrientation(cm, '', '', this);
  } // showSettingsPanel()

  hideSettingsPanel() {
    let sp = document.getElementById('settingsPanel');
    sp.classList.add('out');
    sp.classList.remove('in');
    document.getElementById('showSettingsButton').style.visibility = 'visible';
    if (this.settingsReplaceFriendContainer) setOrientation(cm, '', '', this);
  } // hideSettingsPanel()

  toggleSettingsPanel(ev = null) {
    if (ev) {
      console.log('stop propagation');
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
    let sp = document.getElementById('settingsPanel');
    if (sp.classList && sp.classList.contains('in')) {
      this.hideSettingsPanel();
    } else {
      this.showSettingsPanel();
    }
  } // toggleSettingsPanel()

  // same as showSettingsPanel, but with Verovio tab activated
  showVerovioTabInSettingsPanel() {
    let containingElement = document.getElementById('settingsPanel');
    const tabId = 'verovioSettings';
    for (let cont of containingElement.getElementsByClassName('tabcontent')) {
      cont.style.display = cont.id === tabId ? 'block' : 'none';
    }
    // remove class "active" from tablinks except for current target
    for (let tab of containingElement.getElementsByClassName('tablink')) {
      tab.id === 'verovioOptionsTab' ? tab.classList.add('active') : tab.classList.remove('active');
    }
    this.showSettingsPanel();
  } // showVerovioTabInSettingsPanel()

  // Switches Viewer to pdfMode
  pageModeOn(pdfMode = true) {
    this.pdfMode = pdfMode;
    this.controlMenuState = getControlMenuState();
    console.log('pageModeOn: state ', this.controlMenuState);

    // modify vrv options
    this.vrvOptions.mmOutput = true;
    document.getElementById('vrv-mmOutput').checked = true;
    this.vrvOptions.adjustPageHeight = false;
    document.getElementById('vrv-adjustPageHeight').checked = false;

    if (this.pdfMode) {
      setCheckbox('controlMenuFlipToPageControls', false);
      setCheckbox('controlMenuUpdateNotation', false);
      setCheckbox('controlMenuFontSelector', true);
      setCheckbox('controlMenuNavigateArrows', false);
      setCheckbox('toggleSpeedMode', false);

      // hide editor and other panels
      this.notationProportion = getNotationProportion();
      setNotationProportion(1);
      this.hideEditorPanel();

      // behavior of settings panel
      this.settingsReplaceFriendContainer = true;
      cmd.hideFacsimilePanel();
      cmd.hideAnnotationPanel();
      this.showVerovioTabInSettingsPanel(); // make vrv settings visible

      showPdfButtons(true);
      this.allowNotationInteraction = false;
      document.getElementById('friendContainer')?.classList.add('pdfMode');
    }
  } // pageModeOn()

  // Switches back from pdfMode
  pageModeOff() {
    setControlMenuState(this.controlMenuState);
    // set vrv options back
    this.vrvOptions.mmOutput = false;
    document.getElementById('vrv-mmOutput').checked = false;
    this.vrvOptions.adjustPageHeight = true;
    document.getElementById('vrv-adjustPageHeight').checked = true;
    // settings behavior to default
    this.settingsReplaceFriendContainer = false;

    if (this.pdfMode) {
      // show editor panel with previous proportion
      setNotationProportion(this.notationProportion);
      this.showEditorPanel();
      // hide panels
      this.hideSettingsPanel();
      showPdfButtons(false);

      document.getElementById('friendContainer')?.classList.remove('pdfMode');
      setOrientation(cm, '', '', this);
      this.allowNotationInteraction = true;
    }
    this.pdfMode = false;
  } // pageModeOff()

  saveAsPdf() {
    this.vrvWorker.postMessage({
      cmd: 'renderPdf',
      msg: this.speedFilter(cm.getValue()),
      title: meiFileName,
      version: version,
      versionDate: versionDate,
      options: this.vrvOptions,
      speedMode: this.speedMode,
      pages: prs.getPages(),
    });
  } // saveAsPdf()

  showEditorPanel() {
    const encPanel = document.getElementById('encoding');
    if (encPanel) encPanel.style.display = 'flex';
    const rzr = document.getElementById('dragMe');
    if (rzr) rzr.style.display = 'flex';
  } // showEditorPanel()

  hideEditorPanel() {
    const encPanel = document.getElementById('encoding');
    if (encPanel) encPanel.style.display = 'none';
    const rzr = document.getElementById('dragMe');
    if (rzr) rzr.style.display = 'none';
  } // hideEditorPanel()

  toggleMidiPlaybackControlBar() {
    const midiPlaybackControlBar = document.getElementById('midiPlaybackControlBar');
    const showMidiPlaybackControlBar = document.getElementById('showMidiPlaybackControlBar');
    const midiSpeedmodeIndicator = document.getElementById('midiSpeedmodeIndicator');
    midiPlaybackControlBar.style.display = showMidiPlaybackControlBar.checked ? 'flex' : 'none';
    midiSpeedmodeIndicator.style.display = this.speedMode ? 'inline' : 'none';
    // console.log('toggle: ', midiPlaybackControlBar);
    setOrientation(cm);
    midiPlaybackControlBar.focus();
  } // toggleMidiPlaybackControlBar()

  toggleAnnotationPanel() {
    setOrientation(cm);
    if (this.speedMode && this.breaksSelect.value === 'auto') {
      this.pageBreaks = {};
      this.updateAll(cm);
    } else {
      this.updateLayout();
    }
  } // toggleAnnotationPanel()

  // show or hide GitHub actions (at the branch level in the GitHub menu) if they are available
  setGithubActionsDisplay() {
    const els = [...document.querySelectorAll('.workflow'), ...document.querySelectorAll('.actionsDivider')];
    const display = document.getElementById('enableGithubActions').checked ? 'block' : 'none';
    els.forEach((e) => {
      // check for e, as it will be null if no GH Actions currently exist
      // (e.g., none in repo, or we aren't at branch level in GH menu)
      if (e) {
        e.style.display = display;
        const container = e.closest('a');
        if (container) container.style.display = display;
      }
    });
  } // setGithubActionsDisplay()

  // go through current active tab of settings menu and filter option items (make invisible)
  applySettingsFilter() {
    const filterSettingsString = document.getElementById('filterSettings').value;
    const resetButton = document.getElementById('filterReset');
    if (resetButton) resetButton.style.visibility = 'hidden';

    // current active tab
    const activeTabButton = document.querySelector('#settingsPanel .tablink.active');
    if (activeTabButton) {
      const activeTab = document.getElementById(activeTabButton.dataset.tab);
      if (activeTab) {
        // restore any previously filtered out settings
        const optionsList = activeTab.querySelectorAll('div.optionsItem,details');
        let i = 0;
        optionsList.forEach((opt) => {
          opt.classList.remove('odd');
          opt.style.display = 'flex'; // reset to active...
          if (opt.nodeName.toLowerCase() === 'details') {
            i = 0; // reset counter at each details element
          } else {
            opt.dataset.tab = activeTab.id;
            const optInput = opt.querySelector('input,select');
            const optLabel = opt.querySelector('label');
            // if we're filtering and don't have a match
            if (
              filterSettingsString &&
              optInput &&
              optLabel &&
              !(
                optInput.id.toLowerCase().includes(filterSettingsString.toLowerCase()) ||
                optLabel.innerText.toLowerCase().includes(filterSettingsString.toLowerCase())
              )
            ) {
              opt.style.display = 'none'; // filter out
            } else {
              // add class "odd" to every other displayed element
              if (++i % 2 === 1) opt.classList.add('odd');
            }
          }
        });

        // additional filter-specific layout modifications
        if (filterSettingsString) {
          // remove dividing lines
          activeTab.querySelectorAll('hr.options-line').forEach((l) => (l.style.display = 'none'));
          // open all flaps
          activeTab.querySelectorAll('details').forEach((d) => {
            d.setAttribute('open', 'true');
            if (!d.querySelector('div.optionsItem[style="display: flex;"]')) d.style.display = 'none';
          });
          if (resetButton) resetButton.style.visibility = 'visible';
        } else {
          // show dividing lines
          activeTab.querySelectorAll('hr.options-line').forEach((l) => (l.style.display = 'block'));
          activeTab.querySelectorAll('details').forEach((d) => (d.style.display = 'block'));
          // open only the first flap
          // Array.from(activeTab.getElementsByTagName("details")).forEach((d, ix) => {
          //   if (ix === 0)
          //     d.setAttribute("open", "true");
          //   else
          //     d.removeAttribute("open");
          // })
        }
      }
    }
  } // applySettingsFilter()

  addMeiFriendOptionsToSettingsPanel(restoreFromLocalStorage = true) {
    // NOTE: object meiFriendSettingsOptions from defaults.js
    let mfs = document.getElementById('meiFriendSettings');
    let addListeners = false; // add event listeners only the first time
    let rt = document.querySelector(':root');
    if (!/\w/g.test(mfs.innerHTML)) addListeners = true;
    mfs.innerHTML =
      '<div class="settingsHeader" id="meiFriendSettingsHeader">' +
      translator.lang.meiFriendSettingsHeader.text +
      '</div>';
    let storage = window.localStorage;
    let currentHeader;
    Object.keys(meiFriendSettingsOptions).forEach((opt) => {
      let o = meiFriendSettingsOptions[opt];
      let value = o.default;
      if (storage.hasOwnProperty('mf-' + opt)) {
        if (restoreFromLocalStorage && opt !== 'showMidiPlaybackControlBar') {
          // WG: showMidiPlaybackControlBar always default
          value = storage['mf-' + opt];
          if (typeof value === 'string' && (value === 'true' || value === 'false')) value = value === 'true';
        } else {
          delete storage['mf-' + opt];
        }
      }
      // set default values for mei-friend settings
      switch (opt) {
        case 'selectToolkitVersion':
          this.vrvWorker.postMessage({
            cmd: 'loadVerovio',
            msg: value,
            url:
              value in supportedVerovioVersions
                ? supportedVerovioVersions[value].url
                : supportedVerovioVersions[o.default].url,
          });
          break;
        case 'selectIdStyle':
          this.xmlIdStyle = value;
          break;
        //        case 'selectLanguage':
        //          let langCode = value.slice(0, 2).toLowerCase();
        //          translator.changeLanguage(langCode);
        //          translateLanguageSelection();
        //          break;
        case 'toggleSpeedMode':
          document.getElementById('midiSpeedmodeIndicator').style.display = this.speedMode ? 'inline' : 'none';
          break;
        case 'showSupplied':
          rt.style.setProperty('--suppliedColor', value ? 'var(--defaultSuppliedColor)' : 'var(--notationColor)');
          rt.style.setProperty(
            '--suppliedHighlightedColor',
            value ? 'var(--defaultSuppliedHighlightedColor)' : 'var(--highlightColor)'
          );
          break;
        case 'suppliedColor':
          let checked = document.getElementById('showSupplied').checked;
          rt.style.setProperty('--defaultSuppliedColor', checked ? value : 'var(--notationColor)');
          rt.style.setProperty(
            '--defaultSuppliedHighlightedColor',
            checked ? utils.brighter(value, -50) : 'var(--highlightColor)'
          );
          rt.style.setProperty('--suppliedColor', checked ? value : 'var(--notationColor)');
          rt.style.setProperty(
            '--suppliedHighlightedColor',
            checked ? utils.brighter(value, -50) : 'var(--highlightColor)'
          );
          break;
        case 'respSelect':
          if (this.xmlDoc)
            o.values = Array.from(this.xmlDoc.querySelectorAll('corpName[*|id]')).map((e) => e.getAttribute('xml:id'));
          break;
        case 'controlMenuFontSelector':
          document.getElementById('engravingFontControls').style.display = value ? 'inherit' : 'none';
          break;
        case 'controlMenuSpeedmodeCheckbox':
          document.getElementById('speedDiv').style.display = value ? 'inherit' : 'none';
          break;
        case 'controlMenuNavigateArrows':
          document.getElementById('navigationControls').style.display = value ? 'inherit' : 'none';
          break;
        case 'controlMenuFlipToPageControls':
          document.getElementById('flipCheckbox').style.display = value ? 'inherit' : 'none';
          document.getElementById('flipButton').style.display = value ? 'inherit' : 'none';
          break;
        case 'controlMenuUpdateNotation':
          document.getElementById('updateControls').style.display = value ? 'inherit' : 'none';
          break;
        case 'facsimileZoomInput':
          document.getElementById('facsimileZoom').value = value;
          break;
        case 'showFacsimileFullPage':
          document.getElementById('facsimileFullPageCheckbox').checked = value;
          break;
        case 'editFacsimileZones':
          document.getElementById('facsimileEditZonesCheckbox').checked = value;
          break;
        case 'showFacsimileZones':
          document.getElementById('facsimileShowZonesCheckbox').checked = value;
          break;
        case 'showMidiPlaybackControlBar':
          // do nothing, as it is always the default display: none
          break;
        case 'enableTransposition':
          // switch on
          if (value) {
            let onList = ['transposeDirection', 'transposeButton'];
            if (document.getElementById('toKey')?.checked) onList.push('transposeKey');
            if (document.getElementById('byInterval')?.checked) onList.push('transposeInterval');
            this.setDisablednessInOptionsItem(onList, ['']);
          } else {
            this.setDisablednessInOptionsItem(
              [''],
              ['transposeKey', 'transposeInterval', 'transposeDirection', 'transposeButton']
            );
          }
          break;
      }
      let div = this.createOptionsItem(opt, o, value);
      if (div) {
        if (div.classList.contains('optionsSubHeading')) {
          currentHeader = div;
          mfs.appendChild(currentHeader);
        } else if (currentHeader) {
          currentHeader.appendChild(div);
        } else {
          mfs.appendChild(div);
        }
      }
      switch (opt) {
        case 'renumberMeasuresUseSuffixAtEndings':
          this.disableElementThroughCheckbox(
            'renumberMeasuresContinueAcrossEndings',
            'renumberMeasuresUseSuffixAtEndings'
          );
          break;
        case 'renumberMeasuresUseSuffixAtMeasures':
          this.disableElementThroughCheckbox(
            'renumberMeasureContinueAcrossIncompleteMeasures',
            'renumberMeasuresUseSuffixAtMeasures'
          );
          break;
        case 'transposeKey':
          if (o.radioChecked && document.getElementById('enableTransposition').checked) {
            this.setDisablednessInOptionsItem(['transposeKey'], ['']);
          } else {
            this.setDisablednessInOptionsItem([''], ['transposeKey']);
          }
          break;
        case 'transposeInterval':
          if (o.radioChecked && document.getElementById('enableTransposition').checked) {
            this.setDisablednessInOptionsItem(['transposeInterval'], ['']);
          } else {
            this.setDisablednessInOptionsItem([''], ['transposeInterval']);
          }
          break;
        case 'transposeDirection':
          if (document.getElementById('enableTransposition').checked) {
            this.setDisablednessInOptionsItem(['transposeDirection'], ['']);
          } else {
            this.setDisablednessInOptionsItem([''], ['transposeDirection']);
          }
          break;
        case 'transposeButton':
          if (document.getElementById('enableTransposition').checked) {
            this.setDisablednessInOptionsItem(['transposeButton'], ['']);
          } else {
            this.setDisablednessInOptionsItem([''], ['transposeButton']);
          }
          break;
      }
    });
    mfs.innerHTML +=
      '<input type="button" title="Reset to mei-friend defaults" id="mfReset" class="resetButton" value="Default" />';

    // add change listeners to mei-friend settings
    if (addListeners) {
      mfs.addEventListener('input', (ev) => {
        console.log('meiFriend settings event listener: ', ev);
        let option = ev.target.id;
        let value = ev.target.value;
        if (ev.target.type === 'checkbox') value = ev.target.checked;
        if (ev.target.type === 'number') value = parseFloat(value);
        let col = document.getElementById('suppliedColor').value;
        switch (option) {
          case 'selectToolkitVersion':
            this.vrvWorker.postMessage({
              cmd: 'loadVerovio',
              msg: value,
              url: supportedVerovioVersions[value].url,
            });
            break;
          case 'selectIdStyle':
            this.xmlIdStyle = value;
            break;
          case 'selectLanguage':
            let langCode = value.slice(0, 2).toLowerCase();
            translator.changeLanguage(langCode);
            break;
          case 'toggleSpeedMode':
            let sb = document.getElementById('speedCheckbox');
            if (sb) {
              sb.checked = value;
              sb.dispatchEvent(new Event('change'));
            }
            break;
          case 'showAnnotations':
            this.updateLayout();
            break;
          case 'showAnnotationPanel':
            this.toggleAnnotationPanel();
            break;
          case 'showMidiPlaybackControlBar':
            cmd.toggleMidiPlaybackControlBar(false);
            break;
          case 'selectMidiExpansion':
            this.updateSelectMidiExpansion();
            if (document.getElementById('showMidiPlaybackControlBar').checked) {
              startMidiTimeout(true);
            }
            break;
          case 'enableGithubActions':
            this.setGithubActionsDisplay();
            break;
          case 'enableTransposition':
            // switch on
            if (value) {
              let onList = ['transposeDirection', 'transposeButton'];
              if (document.getElementById('toKey')?.checked) onList.push('transposeKey');
              if (document.getElementById('byInterval')?.checked) onList.push('transposeInterval');
              this.setDisablednessInOptionsItem(onList, ['']);
            } else {
              this.setDisablednessInOptionsItem(
                [''],
                ['transposeKey', 'transposeInterval', 'transposeDirection', 'transposeButton']
              );
              this.vrvOptions.transpose = '';
              this.updateAll(cm);
            }
            if (document.getElementById('showMidiPlaybackControlBar').checked) {
              cmd.toggleMidiPlaybackControlBar();
            }
            break;
          case 'toKey':
            if (document.getElementById('enableTransposition').checked) {
              this.setDisablednessInOptionsItem(['transposeKey'], ['transposeInterval']);
            }
            break;
          case 'byInterval':
            if (document.getElementById('enableTransposition').checked) {
              this.setDisablednessInOptionsItem(['transposeInterval'], ['transposeKey']);
            }
            break;
          case 'transposeKey':
          case 'transposeInterval':
          case 'transposeDirection':
            break;
          case 'showFacsimilePanel':
            value ? cmd.showFacsimilePanel() : cmd.hideFacsimilePanel();
            break;
          case 'selectFacsimilePanelOrientation':
            facs.drawFacsimile();
            break;
          case 'facsimileZoomInput':
            facs.zoomFacsimile();
            break;
          case 'showFacsimileFullPage':
            document.getElementById('facsimileFullPageCheckbox').checked = value;
            facs.drawFacsimile();
            break;
          case 'showFacsimileZones':
            document.getElementById('facsimileShowZonesCheckbox').checked = value;
            if (!value && document.getElementById('editFacsimileZones').checked) {
              document.getElementById('editFacsimileZones').click();
            }
            facs.drawFacsimile();
            break;
          case 'editFacsimileZones':
            document.getElementById('facsimileEditZonesCheckbox').checked = value;
            if (value && !document.getElementById('showFacsimileZones').checked) {
              document.getElementById('showFacsimileZones').click();
            }
            facs.drawFacsimile();
            break;
          case 'showFacsimileTitles':
            facs.drawFacsimile();
            break;
          case 'showSupplied':
            rt.style.setProperty('--suppliedColor', value ? col : 'var(--notationColor)');
            rt.style.setProperty(
              '--suppliedHighlightedColor',
              value ? utils.brighter(col, -50) : 'var(--highlightColor)'
            );
            break;
          case 'suppliedColor':
            let checked = document.getElementById('showSupplied').checked;
            rt.style.setProperty('--suppliedColor', checked ? col : 'var(--notationColor)');
            rt.style.setProperty(
              '--suppliedHighlightedColor',
              checked ? utils.brighter(col, -50) : 'var(--highlightColor)'
            );
            break;
          case 'controlMenuFontSelector':
            document.getElementById('engravingFontControls').style.display = document.getElementById(
              'controlMenuFontSelector'
            ).checked
              ? 'inherit'
              : 'none';
            break;
          case 'controlMenuSpeedmodeCheckbox':
            document.getElementById('speedDiv').style.display = document.getElementById('controlMenuSpeedmodeCheckbox')
              .checked
              ? 'inherit'
              : 'none';
            break;
          case 'controlMenuNavigateArrows':
            document.getElementById('navigationControls').style.display = document.getElementById(
              'controlMenuNavigateArrows'
            ).checked
              ? 'inherit'
              : 'none';
            break;
          case 'controlMenuFlipToPageControls':
            const v = document.getElementById('controlMenuFlipToPageControls').checked;
            document.getElementById('flipCheckbox').style.display = v ? 'inherit' : 'none';
            document.getElementById('flipButton').style.display = v ? 'inherit' : 'none';
            break;
          case 'controlMenuUpdateNotation':
            const u = document.getElementById('controlMenuUpdateNotation').checked;
            document.getElementById('updateControls').style.display = u ? 'inherit' : 'none';
            break;
          case 'renumberMeasuresContinueAcrossEndings':
            this.disableElementThroughCheckbox(
              'renumberMeasuresContinueAcrossEndings',
              'renumberMeasuresUseSuffixAtEndings'
            );
            break;
          case 'renumberMeasureContinueAcrossIncompleteMeasures':
            this.disableElementThroughCheckbox(
              'renumberMeasureContinueAcrossIncompleteMeasures',
              'renumberMeasuresUseSuffixAtMeasures'
            );
            break;
        }
        if (meiFriendSettingsOptions[option] && value === meiFriendSettingsOptions[option].default) {
          delete storage['mf-' + option]; // remove from storage object when default value
        } else {
          storage['mf-' + option] = value; // save changes in localStorage object
        }
      });
      // add event listener for details toggling
      // this.addToggleListener(mfs, 'mf-');
      // let storageSuffix = 'mf-';
      // mfs.addEventListener('toggle', (ev) => {
      //   console.log('ToggleListener: ', ev.target);
      //   if (ev.target.hasAttribute('type') && ev.target.getAttribute('type') === 'header') {
      //     let option = ev.target.id;
      //     let value = ev.target.hasAttribute('open') ? true : false;
      //     if (value === optionsToShow[option].default) {
      //       delete storage[storageSuffix + option]; // remove from storage object when default value
      //     } else {
      //       storage[storageSuffix + option] = value; // save changes in localStorage object
      //     }
      //   }
      // });
      // add event listener for reset button
      mfs.addEventListener('click', (ev) => {
        switch (ev.target.id) {
          case 'mfReset':
            this.addMeiFriendOptionsToSettingsPanel(false);
            this.applySettingsFilter();
            break;
          case 'transposeButton':
            let msg = this.getTranspositionOption();
            console.log('Transpose: ' + msg);
            this.vrvOptions.transpose = msg;
            // this.updateOption({ transpose: msg });
            this.updateAll(cm);
            if (document.getElementById('showMidiPlaybackControlBar').checked) {
              cmd.toggleMidiPlaybackControlBar();
            }
            break;
        }
      });
    }
  } // addMeiFriendOptionsToSettingsPanel()

  addCmOptionsToSettingsPanel(mfDefaults, restoreFromLocalStorage = true) {
    // NOTE: codeMirrorSettingsOptions in defaults.js
    let storage = window.localStorage;
    let cmsp = document.getElementById('editorSettings');
    let addListeners = false; // add event listeners only the first time
    let currentHeader;
    if (!/\w/g.test(cmsp.innerHTML)) addListeners = true;
    cmsp.innerHTML =
      '<div class="settingsHeader" id="editorSettingsHeader">' + translator.lang.editorSettingsHeader.text + '</div>';
    Object.keys(codeMirrorSettingsOptions).forEach((opt) => {
      let o = codeMirrorSettingsOptions[opt];
      let value = o.default;
      if (mfDefaults.hasOwnProperty(opt)) {
        value = mfDefaults[opt];
        if (opt === 'matchTags' && typeof value === 'object') value = true;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches && opt === 'theme') {
        value = mfDefaults['defaultDarkTheme']; // take a dark scheme for dark mode
      }
      if (storage.hasOwnProperty('cm-' + opt)) {
        if (restoreFromLocalStorage) value = storage['cm-' + opt];
        else delete storage['cm-' + opt];
      }
      let div = this.createOptionsItem(opt, o, value);
      if (div) {
        if (div.classList.contains('optionsSubHeading')) {
          currentHeader = div;
          cmsp.appendChild(currentHeader);
        } else if (currentHeader) {
          currentHeader.appendChild(div);
        } else {
          cmsp.appendChild(div);
        }
      }
      this.applyEditorOption(cm, opt, value);
    });
    cmsp.innerHTML +=
      '<input type="button" title="Reset to mei-friend defaults" id="cmReset" class="resetButton" value="Default" />';

    if (addListeners) {
      // add change listeners
      cmsp.addEventListener('input', (ev) => {
        let option = ev.target.id;
        let value = ev.target.value;
        if (ev.target.type === 'checkbox') value = ev.target.checked;
        if (ev.target.type === 'number') value = parseFloat(value);
        this.applyEditorOption(
          cm,
          option,
          value,
          storage.hasOwnProperty('cm-matchTheme') ? storage['cm-matchTheme'] : mfDefaults['matchTheme']
        );
        if (option === 'theme' && storage.hasOwnProperty('cm-matchTheme')) {
          this.setNotationColors(
            storage.hasOwnProperty('cm-matchTheme') ? storage['cm-matchTheme'] : mfDefaults['matchTheme']
          );
        }
        if (
          (mfDefaults.hasOwnProperty(option) &&
            option !== 'theme' &&
            mfDefaults[option].toString() === value.toString()) ||
          (option === 'theme' &&
            (window.matchMedia('(prefers-color-scheme: dark)').matches
              ? mfDefaults.defaultDarkTheme
              : mfDefaults.defaultBrightTheme) === value.toString())
        ) {
          delete storage['cm-' + option]; // remove from storage object when default value
        } else {
          storage['cm-' + option] = value; // save changes in localStorage object
        }
        if (option === 'autoValidate') {
          // validate if auto validation is switched on again
          if (value) {
            validate(cm.getValue(), this.updateLinting, {
              forceValidate: true,
            });
          } else {
            this.setValidationStatusToManual();
          }
        }
      });
      // add event listener for details toggling
      // this.addToggleListener(cmsp, optionsToShow, 'cm-');
      // reset CodeMirror options to default
      cmsp.addEventListener('click', (ev) => {
        if (ev.target.id === 'cmReset') {
          this.addCmOptionsToSettingsPanel(mfDefaults, false);
          this.applySettingsFilter();
        }
      });
      // automatically switch color scheme, if on default schemes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (ev) => {
        // system changes from dark to bright or otherway round
        if (!storage.hasOwnProperty('cm-theme')) {
          // only if not changed by user
          let matchTheme = storage.hasOwnProperty('cm-matchTheme')
            ? storage['cm-matchTheme']
            : mfDefaults['cm-matchTheme'];
          if (ev.matches) {
            // event listener for dark/bright mode changes
            document.getElementById('theme').value = mfDefaults['defaultDarkTheme'];
            this.applyEditorOption(cm, 'theme', mfDefaults['defaultDarkTheme'], matchTheme);
          } else {
            document.getElementById('theme').value = mfDefaults['defaultBrightTheme'];
            this.applyEditorOption(cm, 'theme', mfDefaults['defaultBrightTheme'], matchTheme);
          }
        }
      });
    }
  } // addCmOptionsToSettingsPanel()

  clearVrvOptionsSettingsPanel() {
    this.vrvOptions = {};
    document.getElementById('verovioSettings').innerHTML = '';
  } // clearVrvOptionsSettingsPanel()

  // initializes the settings panel by filling it with content
  addVrvOptionsToSettingsPanel(tkAvailableOptions, defaultVrvOptions, restoreFromLocalStorage = true) {
    // skip these options (in part because they are handled in control menu)
    let skipList = ['breaks', 'engravingDefaults', 'expand', 'svgAdditionalAttribute', 'handwrittenFont'];
    let vsp = document.getElementById('verovioSettings');
    let addListeners = false; // add event listeners only the first time
    if (!/\w/g.test(vsp.innerHTML)) addListeners = true;
    vsp.innerHTML = '<div class="settingsHeader" id="verovioSettingsHeader">Verovio Settings</div>';
    let storage = window.localStorage;

    Object.keys(tkAvailableOptions.groups).forEach((grp, i) => {
      let group = tkAvailableOptions.groups[grp];
      let groupId = group.name.replaceAll(' ', '_');
      // skip these two groups: base handled by mei-friend; sel to be thought (TODO)
      if (!group.name.startsWith('Base short') && !group.name.startsWith('Element selectors')) {
        let details = document.createElement('details');
        details.innerHTML += `<summary id="vrv-${groupId}">${group.name}</summary>`;
        Object.keys(group.options).forEach((opt) => {
          let o = group.options[opt]; // vrv available options
          let value = o.default; // available options defaults
          if (defaultVrvOptions.hasOwnProperty(opt)) {
            // mei-friend vrv defaults
            value = defaultVrvOptions[opt];
          }
          if (storage.hasOwnProperty('vrv-' + opt)) {
            if (restoreFromLocalStorage) value = storage['vrv-' + opt];
            else delete storage['vrv-' + opt];
          }
          if (!skipList.includes(opt)) {
            let div = this.createOptionsItem('vrv-' + opt, o, value);
            if (div) details.appendChild(div);
          }
          // set all options so that toolkit is always completely cleared
          if (['bool', 'int', 'double', 'std::string-list', 'array'].includes(o.type)) {
            this.vrvOptions[opt.split('vrv-').pop()] = value;
          }
        });
        if (i === 1) details.setAttribute('open', 'true');
        vsp.appendChild(details);
      }
    });

    vsp.innerHTML +=
      '<input type="button" title="Reset to mei-friend defaults" id="vrvReset" class="resetButton" value="Default" />';
    if (addListeners) {
      // add change listeners
      vsp.addEventListener('input', (ev) => {
        let opt = ev.target.id;
        let value = ev.target.value;
        if (ev.target.type === 'checkbox') value = ev.target.checked;
        if (ev.target.type === 'number') value = parseFloat(value);
        this.vrvOptions[opt.split('vrv-').pop()] = value;
        if (
          defaultVrvOptions.hasOwnProperty(opt) && // TODO check vrv default values
          defaultVrvOptions[opt].toString() === value.toString()
        ) {
          delete storage[opt]; // remove from storage object when default value
        } else {
          storage[opt] = value; // save changes in localStorage object
        }
        if (opt === 'vrv-font') {
          document.getElementById('engravingFontSelect').value = value;
        } else if (opt.startsWith('vrv-midi')) {
          if (document.getElementById('showMidiPlaybackControlBar').checked) {
            startMidiTimeout(true);
          }
          return; // skip updating notation when midi options changed
        }
        window.clearTimeout(this.vrvTimeout);
        this.vrvTimeout = window.setTimeout(() => this.updateLayout(this.vrvOptions), this.timeoutDelay);
      });
      // add event listener for details toggling
      // this.addToggleListener(vsp, 'vrv-');
      // add listener for the reset button
      vsp.addEventListener('click', (ev) => {
        if (ev.target.id === 'vrvReset') {
          this.addVrvOptionsToSettingsPanel(tkAvailableOptions, defaultVrvOptions, false);
          this.updateLayout(this.vrvOptions);
          this.applySettingsFilter();
          if (document.getElementById('showMidiPlaybackControlBar').checked) {
            startMidiTimeout(true);
          }
        }
      });
    }
  } // addVrvOptionsToSettingsPanel()

  // TODO: does not get called (WG., 12 Okt 2022)
  // adds an event listener to the targetNode, to listen to 'header' elements (details/summary)
  // and storing this information in local storage, using the storageSuffix in the variable name
  addToggleListener(targetNode, optionsToShow, storageSuffix = 'mf-') {
    targetNode.addEventListener('toggle', (ev) => {
      console.log('ToggleListener: ', ev.target);
      if (ev.target.hasAttribute('type') && ev.target.getAttribute('type') === 'header') {
        let option = ev.target.id;
        let value = ev.target.hasAttribute('open') ? true : false;
        if (value === optionsToShow[option].default) {
          delete storage[storageSuffix + option]; // remove from storage object when default value
        } else {
          storage[storageSuffix + option] = value; // save changes in localStorage object
        }
      }
    });
  }

  // Apply options to CodeMirror object and handle other specialized options
  applyEditorOption(cm, option, value, matchTheme = false) {
    switch (option) {
      case 'zoomFont':
        this.changeEditorFontSize(value);
        break;
      case 'matchTheme':
        this.setNotationColors(value);
        break;
      case 'matchTags':
        cm.setOption(
          option,
          value
            ? {
                bothTags: true,
              }
            : {}
        );
        break;
      case 'tabSize':
        cm.setOption('indentUnit', value); // sync tabSize and indentUnit
        cm.setOption(option, value);
        break;
      default:
        if (value === 'true' || value === 'false') value = value === 'true';
        cm.setOption(option, value);
        if (option === 'theme') {
          this.setMenuColors();
          this.setNotationColors(matchTheme);
        }
    }
  } // applyEditorOption()

  /**
   * Creates an option div with a label and input/select depending of o.keys
   * @param {string} opt (e.g. 'vrv-pageHeight', 'controlMenuFlipToPageControls')
   * @param {object} o
   * @param {string} optDefault
   * @returns {Element}
   */
  createOptionsItem(opt, o, optDefault) {
    if (o.type === 'header') {
      // create a details>summary structure instead of header
      let details = document.createElement('details');
      details.classList.add('optionsSubHeading');
      details.open = o.hasOwnProperty('default') ? optDefault : true;
      details.setAttribute('id', opt);
      details.setAttribute('type', 'header');
      let summary = document.createElement('summary');
      summary.setAttribute('title', o.description);
      summary.innerText = o.title;
      details.appendChild(summary);
      return details;
    }
    let div = document.createElement('div');
    div.classList.add('optionsItem');

    // add radio button for current options item
    if ('radioId' in o && 'radioName' in o) {
      let radio = document.createElement('input');
      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', o.radioName);
      radio.setAttribute('id', o.radioId);
      radio.classList.add('radio');
      div.appendChild(radio);
      if ('radioChecked' in o && o.radioChecked) {
        radio.setAttribute('checked', 'true');
      }
    }

    // label
    let label = document.createElement('label');
    let title = o.description;
    if (o.default || o.min || o.max) {
      let values = [];
      if (o.min) values.push('min: ' + o.min);
      if (o.max) values.push('max: ' + o.max);
      if (o.default) values.push('default: ' + o.default);
      title += ' (' + values.join(', ') + ')';
    }
    label.setAttribute('title', title);
    label.setAttribute('for', 'radioId' in o ? o.radioId : opt);
    label.innerText = o.title;
    div.appendChild(label);

    // input
    let input;
    let step = 0.05;
    switch (o.type) {
      case 'bool':
        input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        if (
          (typeof optDefault === 'string' && optDefault === 'true') ||
          (typeof optDefault === 'boolean' && optDefault)
        )
          input.setAttribute('checked', true);
        break;
      case 'int':
        step = 1;
      case 'double':
        input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        let optKeys = Object.keys(o);
        if (optKeys.includes('min')) input.setAttribute('min', o.min);
        if (optKeys.includes('max')) input.setAttribute('max', o.max);
        input.setAttribute('step', optKeys.includes('step') ? o.step : step);
        input.setAttribute('value', optDefault);
        break;
      case 'std::string':
        if (opt.endsWith('font')) {
          input = document.createElement('select');
          input.setAttribute('name', opt);
          input.setAttribute('id', opt);
          fontList.forEach((str, i) =>
            input.add(new Option(str, str, fontList.indexOf(optDefault) === i ? true : false))
          );
        }
        break;
      case 'select':
      case 'std::string-list':
        input = document.createElement('select');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        o.values.forEach((value, i) => {
          let label = 'labels' in o ? o.labels.at(i) : value;
          let option = new Option(label, value, o.values.indexOf(optDefault) === i ? true : false);
          if ('valuesDescriptions' in o) option.title = o.valuesDescriptions[i];
          input.add(option);
        });
        break;
      case 'color':
        input = document.createElement('input');
        input.setAttribute('type', 'color');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        input.setAttribute('value', optDefault);
        break;
      case 'line':
        div.removeChild(label);
        div.classList.remove('optionsItem');
        let line = document.createElement('hr');
        line.classList.add(o.title);
        div.appendChild(line);
        break;
      case 'button':
        label.textContent = ''; // '--transpose ' + this.getTranspositionOption();

        label.setAttribute('title', '');
        input = document.createElement('input');
        input.setAttribute('type', 'button');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        input.setAttribute('value', o.title);
        input.setAttribute('title', o.description);
        break;
      default:
        console.log(
          'Creating Verovio Options: Unhandled data type: ' +
            o.type +
            ', title: ' +
            o.title +
            ' [' +
            o.type +
            '], default: [' +
            optDefault +
            ']'
        );
    }
    if (input) div.appendChild(input);
    return input || o.type === 'header' || o.type === 'line' ? div : null;
  } // createOptionsItem()

  // add responsibility statement to resp select dropdown
  setRespSelectOptions() {
    this.loadXml(cm.getValue()); // loads if outdated
    let rs = document.getElementById('respSelect');
    if (rs) {
      let value = rs.value;
      while (rs.length > 0) rs.options.remove(0);
      let optEls = this.xmlDoc.querySelectorAll('corpName[*|id],persName[*|id]');
      optEls.forEach((el) => {
        if (el.closest('respStmt')) {
          // only if inside a respStmt
          let id = el.getAttribute('xml:id');
          rs.add(new Option(id, id, id === value ? true : false, id === value ? true : false));
        }
      });
    }
  } // setRespSelectOptions()

  getTranspositionOption() {
    let dir = document.getElementById('transposeDirection');
    let key = document.getElementById('transposeKey');
    let int = document.getElementById('transposeInterval');
    if (!dir || !key || !int) return;
    let optionString = dir.value;
    if (!key.disabled) optionString += key.value;
    if (!int.disabled) optionString += int.value;
    return optionString;
  } // setRespSelectOptions()

  // add MIDI playback expansion to select input
  setMidiExpansionOptions() {
    let expandSelect = document.getElementById('selectMidiExpansion');
    if (expandSelect) {
      while (expandSelect.options.length > 0) expandSelect.remove(0); // clear existing options
    } // getTranspositionOption()
    // add options to midi controlbar expansion selector
    let vrvOption = document.getElementById('controlbar-midi-expansion-selector');
    if (vrvOption) {
      while (vrvOption.options.length > 0) vrvOption.remove(0); // clear existing options
    }
    dutils.generateExpansionList(this.xmlDoc).forEach((str, i) => {
      if (expandSelect) {
        expandSelect.add(new Option(str[0], str[1]));
      }
      if (vrvOption) {
        vrvOption.add(new Option(str[0], str[1]));
      }
    });
  } // setMidiExpansionOptions()

  // navigate forwards/backwards/upwards/downwards in the DOM, as defined
  // by 'dir' an by 'incrementElementName'
  navigate(cm, incElName = 'note', dir = 'forwards') {
    console.info('navigate(): lastNoteId: ', this.lastNoteId);
    this.allowCursorActivity = false;
    let id = this.lastNoteId;
    if (id === '') {
      // empty note id
      id = this.setCursorToPageBeginning(cm); // re-defines lastNotId
      if (!id) {
        this.allowCursorActivity = true;
        return;
      }
    }
    let element;
    id = utils.escapeXmlId(id);
    if (id) element = document.querySelector('g#' + id);
    if (!element) {
      // element off-screen
      this.setCursorToPageBeginning(cm); // re-defines lastNotId
      id = utils.escapeXmlId(this.lastNoteId);
      if (id) element = document.querySelector('g#' + id);
    }
    if (!element) {
      this.allowCursorActivity = true;
      return;
    }
    console.info('Navigate ' + dir + ' ' + incElName + '-wise for: ', element);
    let x = dutils.getX(element);
    let y = dutils.getY(element);
    let measure = element.closest('.measure');
    // in case no measure element is found
    if (!measure) {
      let firstNote = document.querySelector('.measure').querySelector('.note');
      if (firstNote) id = firstNote.getAttribute('id');
    } else {
      // find elements starting from current note id, element- or measure-wise
      if (incElName === 'note' || incElName === 'measure') {
        id = dutils.getIdOfNextSvgElement(element, dir, undefined, incElName);
        if (!id) {
          // when no id on screen, turn page
          let what = 'first'; // first/last note within measure
          if (dir === 'backwards' && incElName !== 'measure') what = 'last';
          let lyNo = 1;
          let layer = element.closest('.layer');
          if (layer) lyNo = layer.getAttribute('data-n');
          let staff = element.closest('.staff');
          let stNo = staff.getAttribute('data-n');
          this.navigateBeyondPage(cm, dir, what, stNo, lyNo, y);
          this.allowCursorActivity = true;
          return;
        }
      }

      // up/down in layers
      if (incElName === 'layer') {
        // console.info('navigate(u/d): x/y: ' + x + '/' + y + ', el: ', element);
        let els = Array.from(measure.querySelectorAll(dutils.navElsSelector));
        els.sort(function (a, b) {
          if (Math.abs(dutils.getX(a) - x) > Math.abs(dutils.getX(b) - x)) return 1;
          if (Math.abs(dutils.getX(a) - x) < Math.abs(dutils.getX(b) - x)) return -1;
          if (dutils.getY(a) < dutils.getY(b)) return dir === 'upwards' ? 1 : -1;
          if (dutils.getY(a) > dutils.getY(b)) return dir === 'upwards' ? -1 : 1;
          return 0;
        });
        // console.info('els: ', els);
        let found = false;
        let yy = 0;
        for (let e of els) {
          // go thru all elements to find closest in x/y space
          if (found) {
            yy = dutils.getY(e);
            if (dir === 'upwards' && yy >= y) continue;
            if (dir === 'downwards' && yy <= y) continue;
            id = e.getAttribute('id');
            break;
          }
          if (e.getAttribute('id') === element.getAttribute('id')) found = true;
        }
      } // up/down in layers

      console.info('navigate() found this ID: ' + id);
    }
    // update cursor position in MEI file (buffer)
    utils.setCursorToId(cm, id);
    // this.allowCursorActivityToTextposition(txtEdr); TODO
    if (id) {
      this.selectedElements = [];
      if (!this.selectedElements.includes(id)) this.selectedElements.push(id);
      this.lastNoteId = id;
      if (document.getElementById('showMidiPlaybackControlBar').checked) {
        startMidiTimeout();
      }
    }
    this.allowCursorActivity = true;
    this.scrollSvgTo(cm);
    this.updateHighlight(cm);
  } // navigate()

  // turn page for navigation and return svg directly
  navigateBeyondPage(cm, dir = 'forwards', what = 'first', stNo = 1, lyNo = 1, y = 0) {
    if (!this.changeCurrentPage(dir)) return; // turn page
    let message = {
      breaks: this.vrvOptions.breaks,
      cmd: 'navigatePage',
      pageNo: this.currentPage,
      dir: dir,
      what: what,
      stNo: stNo,
      lyNo: lyNo,
      y: y,
    };
    if (this.speedMode) {
      message.mei = this.speedFilter(cm.getValue());
      message.speedMode = this.speedMode;
    }
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  getTimeForElement(id, triggerMidiSeekTo = false) {
    let that = this;
    let promise = new Promise(
      function (resolve) {
        let message = {
          cmd: 'getTimeForElement',
          msg: id,
          triggerMidiSeekTo: triggerMidiSeekTo,
        };
        that.vrvWorker.addEventListener('message', function handle(ev) {
          if ((ev.data.cmd = message.cmd)) {
            ev.target.removeEventListener('message', handle);
            resolve(ev.data.cmd);
          }
        });
        that.vrvWorker.postMessage(message);
      }.bind(that)
    );
    promise.then(function (time) {
      return time;
    });
  }

  findFirstNoteInSelection() {
    let firstNote;
    for (const elId of this.selectedElements) {
      let el = document.getElementById(elId);
      if (el) {
        if (el.classList.contains('note')) {
          firstNote = el;
          break;
        } else {
          const childNotes = el.getElementsByClassName('note');
          if (childNotes.length) {
            firstNote = childNotes[0];
            break;
          }
        }
      } else {
        console.warn("Couldn't find selected element on page: ", elId, this.selectedElements);
      }
    }
    return firstNote;
  }

  findClosestNoteInChord(id, y) {
    if (id) {
      // if id within chord, find y-closest note to previous
      let ch = document.querySelector('g#' + utils.escapeXmlId(id)).closest('.chord');
      if (ch) {
        // console.info('back/forwards within a chord (y: ' + y + '), ', ch);
        let diff = Number.MAX_VALUE;
        ch.querySelectorAll('.note').forEach((item) => {
          let newDiff = Math.abs(dutils.getY(item) - y);
          // console.info('note: diff: ' + newDiff, item);
          if (newDiff <= diff) {
            diff = newDiff;
            id = item.getAttribute('id');
          }
        });
      }
    }
  }

  updateSelectMidiExpansion() {
    this.expansionId = document.getElementById('selectMidiExpansion').value;
    let mes = document.getElementById('controlbar-midi-expansion-selector');
    if (mes) mes.value = this.expansionId;
    console.log('EEEEExpansion selector set to: ' + this.expansionId);
  }

  busy(active = true, speedWorker = false) {
    let direction = speedWorker ? 'anticlockwise' : 'clockwise';
    if (active) this.verovioIcon.classList.add(direction);
    else this.verovioIcon.classList.remove(direction);
  }

  breaksValue() {
    let breaksSelectVal = this.breaksSelect.value;
    switch (breaksSelectVal) {
      case 'auto':
        return {
          ...this.pageBreaks,
        };
      case 'line':
        return ['sb', 'pb'];
      case 'encoded':
        return ['pb'];
      default:
        return '';
    }
  }

  // toggle disabled at one specific checkbox
  disableElementThroughCheckbox(checkbox, affectedElement) {
    let cont = document.getElementById(checkbox).checked;
    let el = document.getElementById(affectedElement);
    el.disabled = cont;
    if (cont) el.parentNode.classList.add('disabled');
    else el.parentNode.classList.remove('disabled');
  } // disableElementThroughCheckbox()

  /**
   * Sets disabled to offItems (and removes it to onItems) of
   * current element and its previous sibling (label)
   * @param {Array[string]} onItems (array of ids)
   * @param {Array[string]} offItems (array of ids)
   */
  setDisablednessInOptionsItem(onItems, offItems) {
    offItems.forEach((offItem) => {
      if (offItem) {
        let off = document.getElementById(offItem);
        if (off) {
          off.disabled = true;
          off.classList.add('disabled');
          off.previousSibling?.classList.add('disabled');
        }
      }
    });
    onItems.forEach((onItem) => {
      if (onItem) {
        let on = document.getElementById(onItem);
        if (on) {
          on.disabled = false;
          on.classList.remove('disabled');
          on.previousSibling?.classList.remove('disabled');
        }
      }
    });
  } // setDisplayInOptionsItem()

  // show alert to user in #alertOverlay
  // type: ['error'] 'warning' 'info' 'success'
  // disappearAfter: in milliseconds, when negative, no time out
  showAlert(message, type = 'error', disappearAfter = 30000) {
    if (this.alertCloser) clearTimeout(this.alertCloser);
    let alertOverlay = document.getElementById('alertOverlay');
    let alertIcon = document.getElementById('alertIcon');
    let alertMessage = document.getElementById('alertMessage');
    alertIcon.innerHTML = xCircleFill; // error as default icon
    alertOverlay.classList.remove('warning');
    alertOverlay.classList.remove('info');
    alertOverlay.classList.remove('success');
    switch (type) {
      case 'warning':
        alertOverlay.classList.add('warning');
        alertIcon.innerHTML = alert;
        break;
      case 'info':
        alertOverlay.classList.add('info');
        alertIcon.innerHTML = info;
        break;
      case 'success':
        alertOverlay.classList.add('success');
        alertIcon.innerHTML = success;
        break;
    }
    alertMessage.innerHTML = message;
    alertOverlay.style.display = 'flex';
    this.setFocusToVerovioPane();
    if (disappearAfter > 0) {
      this.alertCloser = setTimeout(() => (alertOverlay.style.display = 'none'), disappearAfter);
    }
  } // showAlert()

  /**
   * Show a user prompt in #alertOverlay
   * Pretty similar to showAlert() but with buttons and returning user response
   * @param {string} message user message
   * @param {Array} buttons button labels and onclick functions
   * @param {*} type ['error'] 'warning' 'info'
   */
  showUserPrompt(message, buttons, type = 'error') {
    let promptOverlay = document.getElementById('promptOverlay');
    let promptIcon = document.getElementById('promptIcon');
    let promptMessage = document.getElementById('promptMessage');
    let promptButtons = document.getElementById('promptButtons');
    promptButtons.textContent = '';
    promptIcon.innerHTML = xCircleFill; // error as default icon
    promptOverlay.classList.remove('warning');
    promptOverlay.classList.remove('info');
    switch (type) {
      case 'warning':
        promptOverlay.classList.add('warning');
        promptIcon.innerHTML = alert;
        break;
      case 'info':
        promptOverlay.classList.add('info');
        promptIcon.innerHTML = info;
        break;
    }
    promptMessage.innerHTML = message;

    buttons.forEach((button) => {
      let newButton = document.createElement('button');
      newButton.classList.add('promptButton');
      newButton.textContent = button.label;
      newButton.addEventListener('click', button.event);
      promptButtons.appendChild(newButton);
    });
    promptButtons.style.display = 'block';

    promptOverlay.style.display = 'flex';
    this.setFocusToVerovioPane();
  } // showUserPrompt()

  hideUserPrompt(modalid = 'promptOverlay') {
    document.getElementById(modalid).style.display = 'none';
  }

  // Update alert message of #alertOverlay
  updateAlert(newMsg) {
    let alertOverlay = document.getElementById('alertOverlay');
    alertOverlay.querySelector('span#alertMessage').innerHTML += '<br />' + newMsg;
  } // updateAlert()

  // Hide all alert windows, such as alert overlay
  hideAlerts() {
    let btns = document.getElementsByClassName('alertCloseButton');
    for (let b of btns) {
      if (this.alertCloser) clearTimeout(this.alertCloser);
      b.parentElement.style.display = 'none';
    }
  } // hideAlerts()

  /**
   * Method to check from MEI header whether the XML schema filename
   * has changed, as stored in this.currentSchema
   * @param {string} mei
   * @returns
   */
  async checkSchema(mei) {
    // console.log('Validation: checking for schema...')
    const hasNameSpacePattern = /<\?xml-model.*schematypens=\"http?:\/\/relaxng\.org\/ns\/structure\/1\.0\"/;
    const hasSchemaMatch = hasNameSpacePattern.exec(mei);
    const meiVersionPattern = /<mei.*meiversion="([^"]*).*/;
    const meiVersionMatch = meiVersionPattern.exec(mei);
    if (!hasSchemaMatch) {
      // if no schema namespace, but a version in the mei tag, load common schema
      if (meiVersionMatch && meiVersionMatch[1]) {
        let sch = commonSchemas['All'][meiVersionMatch[1]];
        if (sch) {
          if (sch !== this.currentSchema) {
            this.currentSchema = sch;
            console.log(
              'Viewer.checkSchema(): No schema file, but @meiversion ' + meiVersionMatch[1] + '. Taking common schema.'
            );
            await this.replaceSchema(this.currentSchema);
          } else {
            // console.log('Validation: same schema.');
          }
          return;
        }
      }
      console.error('Viewer.checkSchema(): ' + translator.lang.noSchemaFound.text);
      this.currentSchema = '';
      this.throwSchemaError({ schemaFile: translator.lang.noSchemaFound.text });
      return;
    }
    const schemaUrlPattern = /<\?xml-model.*href="([^"]*).*/;
    const schemaUrlMatch = schemaUrlPattern.exec(mei);
    if (schemaUrlMatch && schemaUrlMatch[1] !== this.currentSchema) {
      this.currentSchema = schemaUrlMatch[1];
      console.log('Viewer.checkSchema(): New schema ' + this.currentSchema);
      await this.replaceSchema(this.currentSchema);
    }
  } // checkSchema()

  /**
   * Loads and replaces XML schema; throws errors if not found/CORS error,
   * update validation-status icon
   * @param {string*} schemaFileName
   * @returns
   */
  async replaceSchema(schemaFileName) {
    if (!this.validatorInitialized) return;
    let vs = document.getElementById('validation-status');
    vs.innerHTML = download;
    let msg = translator.lang.loadingSchema.text + ' ' + schemaFileName;
    vs.setAttribute('title', msg);
    Viewer.changeStatus(vs, 'wait', ['error', 'ok', 'manual']);
    Viewer.updateSchemaStatusDisplay('wait', schemaFileName, msg);

    console.log('Viewer.replaceSchema(): ' + schemaFileName);
    let data; // content of schema file
    try {
      const response = await fetch(schemaFileName);
      if (!response.ok) {
        // schema not found
        this.throwSchemaError({
          response: response,
          schemaFile: schemaFileName,
        });
        return;
      }
      data = await response.text();
      const res = await validator.setRelaxNGSchema(data);
    } catch (err) {
      this.throwSchemaError({
        err: translator.lang.errorLoadingSchema.text + ': ' + err,
        schemaFile: schemaFileName,
      });
      return;
    }
    msg = translator.lang.schemaLoaded.text + ' ' + schemaFileName;
    vs.setAttribute('title', msg);
    vs.innerHTML = unverified;
    this.validatorWithSchema = true;
    const autoValidate = document.getElementById('autoValidate');
    if (autoValidate && autoValidate.checked) {
      validate(cm.getValue(), this.updateLinting, true);
    } else {
      this.setValidationStatusToManual();
    }
    console.log('New schema loaded to validator', schemaFileName);
    rngLoader.setRelaxNGSchema(data);
    cm.options.hintOptions.schemaInfo = rngLoader.tags;
    console.log('New schema loaded for auto completion', schemaFileName);
    Viewer.updateSchemaStatusDisplay('ok', schemaFileName, msg);
  } // replaceSchema()

  /**
   * Throws an schema error and updates validation-status icon
   * @param {Object} msgObj
   */
  throwSchemaError(msgObj) {
    this.validatorWithSchema = false;
    if (this.updateLinting && typeof this.updateLinting === 'function') this.updateLinting(cm, []); // clear errors in CodeMirror
    // Remove schema from validator and hinting / code completion
    rngLoader.clearRelaxNGSchema();
    console.log('Schema removed from validator', this.currentSchema);
    cm.options.hintOptions = {};
    console.log('Schema removed from auto completion', this.currentSchema);
    // construct error message
    let msg = '';
    if (msgObj.hasOwnProperty('response'))
      msg =
        translator.lang.schemaNotFound.text + ' (' + msgObj.response.status + ' ' + msgObj.response.statusText + '): ';
    if (msgObj.hasOwnProperty('err')) msg = msgObj.err + ' ';
    if (msgObj.hasOwnProperty('schemaFile')) msg += msgObj.schemaFile;
    // set icon to unverified and error color
    let vs = document.getElementById('validation-status');
    vs.innerHTML = unverified;
    vs.setAttribute('title', msg);
    console.warn(msg);
    Viewer.changeStatus(vs, 'error', ['wait', 'ok', 'manual']);
    Viewer.updateSchemaStatusDisplay('error', '', msg);
  } // throwSchemaError()

  /**
   * Helper function that adds addedClassName (string) after having removed
   * removedClasses (array of strings) from el (DOM element)
   * @param {Element} el
   * @param {string} addedClassName
   * @param {Array<string>} removedClasses
   */
  static changeStatus(el, addedClassName = '', removedClasses = []) {
    removedClasses.forEach((c) => el.classList.remove(c));
    el.classList.add(addedClassName);
  } // changeStatus()

  /**
   * Updates schema status display
   * @param {string} status
   * @param {string} schemaName
   * @param {string} msg
   */
  static updateSchemaStatusDisplay(status = 'ok', schemaName, msg = '') {
    let el = document.getElementById('schemaStatus');
    if (el) {
      el.title = msg;
      switch (status) {
        case 'ok':
          Viewer.changeStatus(el, 'ok', ['error', 'manual', 'wait']);
          // pretty-printing for known schemas from music-encoding.org
          if (schemaName.includes('music-encoding.org')) {
            let pathElements = schemaName.split('/');
            let type = pathElements.pop();
            if (type.toLowerCase().includes('anystart')) type = 'any';
            let noChars = 3;
            if (type.toLowerCase().includes('neumes') || type.toLowerCase().includes('mensural')) noChars = 4;
            let schemaVersion = pathElements.pop();
            el.innerHTML = type.split('mei-').pop().slice(0, noChars).toUpperCase() + ' ' + schemaVersion;
          } else {
            el.innerHTML = schemaName.split('/').pop().split('.').at(0);
          }
          break;
        case 'wait': // downloading schema
          Viewer.changeStatus(el, 'wait', ['ok', 'manual', 'error']);
          el.innerHTML = '&nbsp;&#11015;&nbsp;'; // #8681 #8615
          break;
        case 'error': // no schema in MEI or @meiversion
          Viewer.changeStatus(el, 'error', ['ok', 'manual', 'wait']);
          el.innerHTML = '&nbsp;?&nbsp;';
          break;
      }
    }
  } // updateSchemaStatusDisplay()

  /**
   * Switch validation-status icon to manual mode and add click event handlers.
   * Handle Safari exception: disable menu item, set warning messages to validation status
   * and schema status
   */
  setValidationStatusToManual() {
    let vs = document.getElementById('validation-status');
    vs.innerHTML = unverified;
    vs.style.cursor = 'pointer';
    if (isSafari) {
      translator.handleBrowserExceptions('Safari');
    } else {
      vs.setAttribute('title', translator.lang.notValidated.text);
    }
    vs.removeEventListener('click', this.manualValidate);
    vs.removeEventListener('click', this.toggleValidationReportVisibility);
    vs.addEventListener('click', this.manualValidate);
    Viewer.changeStatus(vs, 'manual', ['wait', 'ok', 'error']);
    let reportDiv = document.getElementById('validation-report');
    if (reportDiv) reportDiv.style.visibility = 'hidden';
    if (this.updateLinting && typeof this.updateLinting === 'function') {
      this.updateLinting(cm, []); // clear errors in CodeMirror
    }
  } // setValidationStatusToManual()

  /**
   * Callback for manual validation
   */
  manualValidate() {
    validate(cm.getValue(), undefined, {
      forceValidate: true,
    });
  } // manualValidate()

  /**
   * Highlight validation results in CodeMirror editor linting system
   * @param {string} mei
   * @param {Object} messages
   * @returns
   */
  highlightValidation(mei, messages, showValidation = false) {
    let lines;
    let found = [];
    let i = 0;

    try {
      lines = mei.split('\n');
    } catch (err) {
      console.log('Could not split MEI json:', err);
      return;
    }

    // sort messages by line number
    messages.sort((a, b) => {
      if (a.line < b.line) return -1;
      if (a.line > b.line) return 1;
      return 0;
    });

    // parse error messages into an array for CodeMirror
    while (i < messages.length) {
      let line = Math.max(messages[i].line - 1, 0);
      found.push({
        from: new CodeMirror.Pos(line, 0),
        to: new CodeMirror.Pos(line, lines[line].length),
        severity: 'error',
        message: messages[i].message,
      });
      i += 1;
    }
    this.updateLinting(cm, found);

    // update overall status of validation
    let vs = document.getElementById('validation-status');
    vs.querySelector('svg').classList.remove('clockwise');
    let reportDiv = document.getElementById('validation-report');
    if (reportDiv) {
      reportDiv.innerHTML = '';
      reportDiv.style.visibility = 'hidden';
    }

    let msg = '';
    if (found.length === 0 && this.validatorWithSchema) {
      Viewer.changeStatus(vs, 'ok', ['error', 'wait', 'manual']);
      vs.innerHTML = verified;
      msg = 'Everything ok, no errors.';
    } else {
      Viewer.changeStatus(vs, 'error', ['wait', 'ok', 'manual']);
      vs.innerHTML = alert;
      vs.innerHTML += '<span>' + Object.keys(messages).length + '</span>';
      msg = 'Validation failed. ' + Object.keys(messages).length + ' validation messages:';
      messages.forEach((m) => (msg += '\nLine ' + m.line + ': ' + m.message));

      // detailed validation report
      if (!reportDiv) {
        reportDiv = document.createElement('div');
        reportDiv.id = 'validation-report';
        reportDiv.classList.add('validation-report');
        let CM = document.querySelector('.CodeMirror');
        CM.parentElement?.appendChild(reportDiv);
      }

      let closeButton = document.createElement('span');
      closeButton.classList.add('rightButton');
      closeButton.innerHTML = '&times';
      closeButton.addEventListener('click', (ev) => (reportDiv.style.visibility = 'hidden'));
      reportDiv.appendChild(closeButton);
      let p = document.createElement('div');
      p.classList.add('validation-title');
      p.innerHTML =
        translator.lang.validationFailed.text +
        '. ' +
        Object.keys(messages).length +
        ' ' +
        translator.lang.validationMessages.text +
        ':';
      reportDiv.appendChild(p);
      messages.forEach((m, i) => {
        let p = document.createElement('div');
        p.classList.add('validation-item');
        p.id = 'validationError' + i;
        p.innerHTML = 'Line ' + m.line + ': ' + m.message;
        p.addEventListener('click', (ev) => {
          cm.scrollIntoView({
            from: {
              line: Math.max(0, m.line - 5),
              ch: 0,
            },
            to: {
              line: Math.min(cm.lineCount() - 1, m.line + 5),
              ch: 0,
            },
          });
        });
        reportDiv.appendChild(p);
      });
    }
    vs.setAttribute(
      'title',
      translator.lang.validatedAgainst.text +
        ' ' +
        this.currentSchema +
        ': ' +
        Object.keys(messages).length +
        ' ' +
        translator.lang.validationMessages.text +
        '.'
    );
    if (reportDiv) {
      vs.removeEventListener('click', this.manualValidate);
      vs.removeEventListener('click', this.toggleValidationReportVisibility);
      vs.addEventListener('click', this.toggleValidationReportVisibility);

      let currentVisibility = reportDiv.style.visibility;
      // show or not validation report, if not already defined
      if (!currentVisibility || !document.getElementById('autoValidate')?.checked || showValidation)
        reportDiv.style.visibility =
          document.getElementById('autoShowValidationReport')?.checked ||
          !document.getElementById('autoValidate')?.checked ||
          showValidation
            ? 'visible'
            : 'hidden';
    }
  } // highlightValidation()

  /**
   * Show/hide #validation-report panel, or force visibility (by string)
   * @param {string} forceVisibility
   */
  toggleValidationReportVisibility(forceVisibility = '') {
    let reportDiv = document.getElementById('validation-report');
    if (reportDiv) {
      if (typeof forceVisibility === 'string') {
        reportDiv.style.visibility = forceVisibility;
      } else {
        if (reportDiv.style.visibility === '' || reportDiv.style.visibility === 'visible')
          reportDiv.style.visibility = 'hidden';
        else reportDiv.style.visibility = 'visible';
      }
    }
  } // toggleValidationReportVisibility()

  /**
   * Initializes and shows code checker panel below the CodeMirror encoding.
   * codeCheckerEntries to be added through addCodeCheckerEntry(data).
   * @param {string} title
   * @returns
   */
  initCodeCheckerPanel(title = 'Code Checker') {
    let codeChecker = document.getElementById('codeChecker');
    if (!codeChecker) return;
    codeChecker.innerHTML = '';
    codeChecker.style.display = 'block';
    setOrientation(cm, '', '', this);

    let closeButton = document.createElement('span');
    closeButton.classList.add('rightButton');
    closeButton.innerHTML = '&times';
    closeButton.addEventListener('click', () => {
      codeChecker.style.display = 'none';
      setOrientation(cm, '', '', this);
    });
    codeChecker.appendChild(closeButton);

    let headerDiv = document.createElement('div');
    headerDiv.classList.add('validation-title');
    headerDiv.id = 'codeCheckerTitle';
    headerDiv.innerHTML = title;
    codeChecker.appendChild(headerDiv);

    // Correct/Fix all
    let correctAllButton = document.createElement('button');
    correctAllButton.innerHTML = translator.lang.codeCheckerFixAll.text;
    correctAllButton.classList.add('btn');
    correctAllButton.addEventListener('click', () => {
      let count = 0;
      let fixButtonList = codeChecker.querySelectorAll('button.fix:not(.disabled)');
      fixButtonList.forEach((button) => {
        count++;
        setTimeout(() => button.click(), 0);
      });
      infoSpanCurrent.innerHTML = '0';
      infoSpanOf.innerHTML = '/';
      infoSpanTotal.innerHTML = fixButtonList.length;
      correctAllButton.classList.add('disabled');
      correctAllButton.disabled = true;
      ignoreAllButton.classList.add('disabled');
      ignoreAllButton.disabled = true;
    });
    headerDiv.appendChild(correctAllButton);

    let ignoreAllButton = document.createElement('button');
    ignoreAllButton.innerHTML = translator.lang.codeCheckerIgnoreAll.text;
    ignoreAllButton.classList.add('btn');
    ignoreAllButton.addEventListener('click', () => {
      codeChecker.querySelectorAll('.validation-item').forEach((ch) => {
        let button = ch.querySelector('button.ignore');
        let span = ch.querySelector('.codeCheckerMessage');
        if (button && !button.disabled && span && !span.classList.contains('strikethrough')) {
          button.click();
        }
      });
    });
    headerDiv.appendChild(ignoreAllButton);

    let infoSpanCurrent = document.createElement('span');
    infoSpanCurrent.id = 'codeCheckerInfoCurrent';
    headerDiv.appendChild(infoSpanCurrent);
    let infoSpanOf = document.createElement('span');
    infoSpanOf.id = 'codeCheckerInfoOf';
    headerDiv.appendChild(infoSpanOf);
    let infoSpanTotal = document.createElement('span');
    infoSpanTotal.id = 'codeCheckerInfoTotal';
    headerDiv.appendChild(infoSpanTotal);

    let noMessages = document.createElement('div');
    noMessages.classList.add('validation-item');
    noMessages.id = 'codeCheckerCheckingCode';
    noMessages.classList.add('noAccidMessagesFound');
    noMessages.innerHTML = translator.lang.codeCheckerCheckingCode.text;
    codeChecker.appendChild(noMessages);
  } // initCodeCheckerPanel()

  /**
   * Adds an entry to the code checker panel with a data structure,
   * containing also the fix callback
   * @param {Object} data
   * @returns
   */
  addCodeCheckerEntry(data) {
    let codeChecker = document.getElementById('codeChecker');
    if (!codeChecker) return;
    let noMessages = codeChecker.querySelector('.noAccidMessagesFound');
    if (noMessages) noMessages.remove();
    let codeCheckerInfoCurrent = document.getElementById('codeCheckerInfoCurrent');
    let codeCheckerInfoTotal = document.getElementById('codeCheckerInfoTotal');
    let div = document.createElement('div');
    div.classList.add('validation-item');

    // span for message
    let span = document.createElement('span');
    span.classList.add('codeCheckerMessage');
    span.innerHTML = data.html;
    span.addEventListener('click', (ev) => {
      utils.setCursorToId(cm, data.xmlId);
      cm.focus();
    });
    div.appendChild(span);

    // function to correct error
    if (data.correct) {
      // Correct/Fix Button
      let correctButton = document.createElement('button');
      correctButton.innerHTML = translator.lang.codeCheckerFix.text;
      correctButton.classList.add('btn');
      correctButton.classList.add('fix');
      correctButton.addEventListener('click', () => {
        data.correct();
        let checked = document.createElement('span');
        checked.innerHTML = icon.check;
        div.appendChild(checked);
        correctButton.disabled = true;
        correctButton.classList.add('disabled');
        ignoreButton.disabled = true;
        ignoreButton.classList.add('disabled');
        let count = parseInt(codeCheckerInfoCurrent.innerHTML) || 0;
        let total = parseInt(codeCheckerInfoTotal.innerHTML) || 0;
        codeCheckerInfoCurrent.innerHTML = ++count;
        if (count === total) {
          let checked = document.createElement('span');
          checked.innerHTML += icon.check;
          codeCheckerInfoCurrent.parentElement.appendChild(checked);
        }
      });
      div.appendChild(correctButton);

      // Ignore Button
      let ignoreButton = document.createElement('button');
      ignoreButton.innerHTML = translator.lang.codeCheckerIgnore.text;
      ignoreButton.classList.add('btn');
      ignoreButton.classList.add('ignore');
      ignoreButton.addEventListener('click', () => {
        let total = parseInt(codeCheckerInfoTotal.innerHTML);
        // correctButton.removeEventListener('click', data.correct);
        if (!span.classList.contains('strikethrough')) {
          // active, not stroke through
          correctButton.disabled = true;
          correctButton.classList.add('disabled');
          span.disabled = true;
          span.classList.add('strikethrough');
          total--;
        } else {
          correctButton.disabled = false;
          correctButton.classList.remove('disabled');
          span.disabled = false;
          span.classList.remove('strikethrough');
          total++;
        }
        codeCheckerInfoTotal.innerHTML = total;
      });
      div.appendChild(ignoreButton);
    }
    codeChecker.appendChild(div);
  } // addCodeCheckerEntry()

  finalizeCodeCheckerPanel() {
    let nothingFound = document.getElementById('codeCheckerCheckingCode');
    if (nothingFound) {
      nothingFound.innerHTML = translator.lang.codeCheckerNoAccidMessagesFound.text;
    } else {
      document.getElementById('codeCheckerInfoCurrent').innerHTML = 0;
      document.getElementById('codeCheckerInfoOf').innerHTML = '/';
      document.getElementById('codeCheckerInfoTotal').innerHTML = document.querySelectorAll('.validation-item')?.length;
    }
  } // finalizeCodeCheckerPanel()
} // class Viewer
