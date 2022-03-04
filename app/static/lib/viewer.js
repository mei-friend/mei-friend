import {
  getVerovioContainerSize
} from './resizer.js'
import * as speed from './speed.js';
import * as utils from './utils.js';
import * as dutils from './dom-utils.js';
import {
  addToolTip
} from './control-menu.js';
import {
  storage
} from './main.js';
import schema_meiCMN_401 from '../schemaInfo/mei-CMN-4.0.1.schemaInfo.js';
import schema_meiAll_401 from '../schemaInfo/mei-all-4.0.1.schemaInfo.js';


export default class Viewer {

  constructor(vrvWorker, spdWorker) {
    this.vrvWorker = vrvWorker;
    this.spdWorker = spdWorker;
    this.currentPage = 1;
    this.pageCount = 0;
    this.selectedElements = [];
    this.lastNoteId = '';
    this.notationNightMode = false;
    // this.tkOptions = this.vrvToolkit.getAvailableOptions();
    this.updateNotation = true; // whether or not notation gets re-rendered after text changes
    this.speedMode = true; // speed mode (just feeds on page to Verovio to reduce drawing time)
    this.parser = new DOMParser();
    this.xmlDoc;
    this.encodingHasChanged = true; // to recalculate DOM or pageLists
    this.pageBreaks = {}; // object of page number and last measure id '1': 'measure-000423', ...
    this.pageSpanners = {}; // object storing all time-spannind elements spanning across pages
    // this.scoreDefList = []; // list of xmlNodes, one for each change, referenced by 5th element of pageList
    this.meiHeadRange = [];
    this.toolTipTimeOutHandle = null; // handle for zoom tooltip hide timer
    this.vrvOptions; // all verovio options
    this.verovioIcon = document.getElementById('verovio-icon');
  }

  // change options, load new data, render current page, add listeners, highlight
  updateAll(cm, options = {}, xmlId = '') {
    this.setVerovioOptions(options);
    let computePageBreaks = false;
    if (this.speedMode && Object.keys(this.pageBreaks).length === 0 &&
      document.getElementById('breaks-select').value === 'auto') {
      computePageBreaks = true;
      this.currentPage = 1;
    }
    if (this.speedMode && xmlId) this.currentPage =
      speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId);
    let message = {
      'cmd': 'updateAll',
      'options': this.vrvOptions,
      'mei': this.speedFilter(cm.getValue()),
      'pageNo': this.currentPage,
      'xmlId': xmlId,
      'speedMode': this.speedMode,
      'computePageBreaks': computePageBreaks
    }
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  updateData(cm, setCursorToPageBeg = true, setFocusToVerovioPane = true) {
    // is it needed for speed mode?
    //if(!this.speedMode) this.loadVerovioData(this.speedFilter(cm.getValue()));
    let message = {
      'cmd': 'updateData',
      'mei': this.speedFilter(cm.getValue()),
      'pageNo': this.currentPage,
      'xmlId': '',
      'setCursorToPageBeginning': setCursorToPageBeg,
      'setFocusToVerovioPane': setFocusToVerovioPane,
      'speedMode': this.speedMode,
      'breaks': document.getElementById('breaks-select').value
    };
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  updatePage(cm, page, xmlId = '', setFocusToVerovioPane = true) {
    if (this.changeCurrentPage(page) || xmlId) {
      if (!this.speedMode) {
        let message = {
          'cmd': 'updatePage',
          'pageNo': this.currentPage,
          'xmlId': xmlId,
          'setFocusToVerovioPane': setFocusToVerovioPane
        };
        this.busy();
        this.vrvWorker.postMessage(message);
      } else { // speed mode
        if (this.encodingHasChanged) this.loadXml(cm.getValue());
        if (xmlId) {
          this.currentPage =
            speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId);
          console.info('UpdatePage(speedMode=true): page: ' +
            this.currentPage + ', xmlId: ' + xmlId);
        }
        this.updateData(cm, xmlId ? false : true, setFocusToVerovioPane);
      }
    }
  }

  // update: options, redoLayout, page/xml:id, render page
  updateLayout(options = {}) {
    this.updateQuick(options, 'updateLayout');
  }

  // update: options, page/xml:id, render page
  updateOption(options = {}) {
    this.updateQuick(options, 'updateOption');
  }

  // updateLayout and updateOption
  updateQuick(options, what) {
    // if (!this.speedMode) {
    let id = '';
    if (this.selectedElements[0]) id = this.selectedElements[0];
    this.setVerovioOptions(options);
    let message = {
      'cmd': what,
      'options': this.vrvOptions,
      'pageNo': this.currentPage,
      'xmlId': id,
      'speedMode': this.speedMode
    };
    this.busy();
    this.vrvWorker.postMessage(message);
  }


  // with normal mode: load DOM and pass-through the MEI code;
  // with speed mode: load into DOM (if encodingHasChanged) and
  // return MEI excerpt of currentPage page
  speedFilter(mei) {
    // update DOM only if encoding has been edited or
    this.loadXml(mei);
    let breaks = this.breaksValue();
    let breaksSelectVal = document.getElementById('breaks-select').value;
    if (!this.speedMode || breaksSelectVal == 'none') return mei;
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
        if (countBreaks && breaks.includes(e.nodeName))
          this.pageCount++;
      }
      for (let e of Array.from(elements).reverse()) { // skip trailing breaks
        if (e.nodeName === 'measure') break;
        if (countBreaks && breaks.includes(e.nodeName)) this.pageCount--;
      }
    }
    if (this.currentPage < 1 || this.currentPage > this.pageCount)
      this.currentPage = 1;
    console.info('xmlDOM pages counted: currentPage: ' + this.currentPage +
      ', pageCount: ' + this.pageCount);
    // compute time-spanning elements object in speed-worker
    if (this.pageSpanners && Object.keys(this.pageSpanners).length === 0 &&
      (breaksSelectVal !== 'auto' || Object.keys(this.pageBreaks).length > 0)) {
      // use worker solution with swift txml parsing
      let message = {
        'cmd': 'listPageSpanningElements',
        'mei': mei,
        'breaks': breaks,
        'breaksOpt': breaksSelectVal
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
    return speed.getPageFromDom(this.xmlDoc, this.currentPage, breaks,
      this.pageSpanners);
  }

  loadXml(mei, forceReload = false) {
    if (this.encodingHasChanged || forceReload) {
      this.xmlDoc = this.parser.parseFromString(mei, "text/xml");
      this.encodingHasChanged = false;
    }
  }

  // returns true if sb/pb elements are contained (more than the leading pb)
  containsBreaks() {
    let music = this.xmlDoc.querySelector('music');
    let elements;
    if (music) elements = music.querySelectorAll('measure, sb, pb');
    else return false;
    let countBreaks = false;
    for (let e of elements) {
      if (e.nodeName == 'measure') countBreaks = true; // skip leading breaks
      if (countBreaks && ['sb', 'pb'].includes(e.nodeName))
        return true;
    }
    return false;
  }

  clear() {
    this.selectedElements = [];
    this.lastNoteId = '';
    this.currentPage = 1;
    this.pageCount = -1;
    this.pageBreaks = {};
    this.pageSpanners = {};
  }

  reRenderMei(cm, removeIds = false) {
    let message = {
      'cmd': 'reRenderMei',
      'format': 'mei',
      'mei': cm.getValue(),
      'pageNo': this.currentPage,
      'removeIds': removeIds
    }
    if (false && !removeIds) message.xmlId = this.selectedElements[0]; // TODO
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  computePageBreaks(cm) {
    let message = {
      'cmd': 'computePageBreaks',
      'options': this.vrvOptions,
      'format': 'mei',
      'mei': cm.getValue()
    }
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  // update options in viewer from user interface
  setVerovioOptions(newOptions = {}) {
    if (Object.keys(newOptions).length > 0)
      this.vrvOptions = {
        ...newOptions
      };
    let zoom = document.getElementById('verovio-zoom');
    if (zoom) this.vrvOptions.scale = parseInt(zoom.value);
    let fontSel = document.getElementById('font-select');
    if (fontSel) this.vrvOptions.font = fontSel.value;
    let bs = document.getElementById('breaks-select');
    if (bs) this.vrvOptions.breaks = bs.value;
    let dimensions = getVerovioContainerSize();
    let vp = document.querySelector('.verovio-panel');
    dimensions.width = vp.clientWidth;
    dimensions.height = vp.clientHeight;
    // console.info('client size: ' + dimensions.width + '/' + dimensions.height);
    if (this.vrvOptions.breaks !== "none") {
      this.vrvOptions.pageWidth = Math.max(Math.round(
        dimensions.width * (100 / this.vrvOptions.scale)), 600);
      this.vrvOptions.pageHeight = Math.max(Math.round(
        dimensions.height * (100 / this.vrvOptions.scale)), 250);
    }
    // overwrite existing options if new ones are passed in
    // for (let key in newOptions) { this.vrvOptions[key] = newOptions[key]; }
    console.info('Verovio options updated: ', this.vrvOptions);
  }

  changeHighlightColor(color) {
    document.getElementById('customStyle').innerHTML =
      `.mei-friend .verovio-panel g.highlighted,
      .mei-friend .verovio-panel g.highlighted,
      .mei-friend .verovio-panel g.highlighted,
      .mei-friend .verovio-panel g.highlighted * {
        fill: ${color};
        color: ${color};
        stroke: ${color};
    }`;
  }

  // accepts number or string (first, last, forwards, backwards)
  changeCurrentPage(newPage) {
    let targetpage = -1;
    if (Number.isInteger(newPage)) {
      targetpage = newPage;
      console.info('targetPage: ', targetpage);
    } else if (typeof newPage === 'string') {
      newPage = newPage.toLowerCase();
      if (newPage === 'first') {
        targetpage = 1;
      } else if (newPage === 'last') {
        targetpage = this.pageCount
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
    if (targetpage > 0 && targetpage <= this.pageCount &&
      targetpage != this.currentPage) {
      this.currentPage = targetpage;
      this.updatePageNumDisplay();
      return true;
    }
    return false;
  }

  updatePageNumDisplay() {
    let pg = (this.pageCount < 0) ? '?' : this.pageCount;
    document.getElementById("pagination1").innerHTML = 'Page';;
    document.getElementById("pagination2").innerHTML =
      `&nbsp;${this.currentPage}&nbsp;`;
    document.getElementById("pagination3").innerHTML = `of ${pg}`;
  }

  // set cursor to first note id in page, taking st/ly of id, if possible
  setCursorToPageBeginning(cm) {
    let id = this.lastNoteId;
    let stNo, lyNo;
    let sc;
    if (id == '') {
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
        console.info('setCursorToPgBg st/ly;m: ' + stNo + '/' + lyNo + '; ', m);
        if (m) {
          id = dutils.getFirstInMeasure(m, dutils.navElsSelector, stNo, lyNo);
        }
      }
    }
    utils.setCursorToId(cm, id);
    console.info('setCrsrToPgBeg(): lastNoteId: ' + this.lastNoteId +
      ', new id: ' + id);
    this.selectedElements = [];
    this.selectedElements.push(id);
    this.lastNoteId = id;
    return id;
  }

  addNotationEventListeners(cm) {
    let elements = Array.from(document.querySelectorAll('g[id]'));
    elements.forEach(item => {
      item.addEventListener('click',
        (event) => this.handleClickOnNotation(event, cm));
    });
  }

  handleClickOnNotation(e, cm) {
    e.stopImmediatePropagation();
    this.updateNotation = false;
    // console.info('click: ', e);
    let itemId = String(e.currentTarget.id);
    if (itemId === "undefined") return;
    // take chord rather than note xml:id, when ALT is pressed
    let chordId = utils.insideParent(itemId);
    if (e.altKey && chordId) itemId = chordId;
    // select tuplet when clicking on tupletNum
    if (e.currentTarget.getAttribute('class') == 'tupletNum')
      itemId = utils.insideParent(itemId, 'tuplet');

    if (((navigator.appVersion.indexOf("Mac") !== -1) && e.metaKey) || e.ctrlKey) {
      this.selectedElements.push(itemId);
      console.info('handleClickOnNotation() added: ' +
        this.selectedElements[this.selectedElements.length - 1] +
        ', size now: ' + this.selectedElements.length);
    } else {
      // set cursor position in buffer
      utils.setCursorToId(cm, itemId);
      this.selectedElements = [];
      this.selectedElements.push(itemId);
      console.info('handleClickOnNotation() newly created: ' +
        this.selectedElements[this.selectedElements.length - 1] +
        ', size now: ' + this.selectedElements.length);
    }
    this.updateHighlight(cm);
    this.setFocusToVerovioPane();
    // set lastNoteId to @startid or @staff of control element
    let startid = utils.getAttributeById(cm, itemId, "startid");
    if (startid && startid.startsWith('#')) startid = startid.split('#')[1];

    // if (!startid) { // work around for tstamp/staff
    // TODO: find note corresponding to @staff/@tstamp
    // startid = utils.getAttributeById(txtEdr.getBuffer(), itemId, attribute = 'tstamp');
    // console.info('staff: ', startid);
    // }
    if (startid) this.lastNoteId = startid;
    else this.lastNoteId = itemId;
    this.updateNotation = true;
  } // handleClickOnNotation()

  // when cursor pos in editor changed, update notation location / highlight
  cursorActivity(cm, forceFlip = false) {
    // console.log('cursorActivity forceFlip: ' + forceFlip);
    let id = utils.getElementIdAtCursor(cm);
    this.selectedElements = [];
    this.selectedElements.push(id);
    let fl = document.getElementById('flip-checkbox');
    if (!document.querySelector('g#' + id) && // when not on current page
      ((this.updateNotation && fl && fl.checked) || forceFlip)) {
      this.updatePage(cm, '', id, false);
    } else if (this.updateNotation) { // on current page
      this.scrollSvg(cm);
      this.updateHighlight(cm);
    }
  }

  scrollSvg(cm) {
    let vp = document.querySelector('.verovio-panel');
    let el = document.querySelector('g#' + utils.getElementIdAtCursor(cm));
    if (el) {
      let vpRect = vp.getBoundingClientRect();
      let elRect = el.getBBox();
      var mx = el.getScreenCTM();
      // adjust scrolling only when element (close to or completely) outside
      const closeToPerc = .1;
      let sx = mx.a * elRect.x + mx.c * elRect.y + mx.e;
      // kind-of page-wise flipping for x
      if (sx < (vpRect.x + vpRect.width * closeToPerc))
        vp.scrollLeft -= vpRect.x + vpRect.width * (1 - closeToPerc) - sx;
      else if (sx > (vpRect.x + vpRect.width * (1 - closeToPerc)))
        vp.scrollLeft -= vpRect.x + vpRect.width * closeToPerc - sx;
      // y flipping
      let sy = mx.b * elRect.x + mx.d * elRect.y + mx.f;
      if (sy < (vpRect.y + vpRect.height * closeToPerc) ||
        sy > (vpRect.y + vpRect.height * (1 - closeToPerc)))
        vp.scrollTop -= vpRect.y + vpRect.height / 2 - sy;
    }
  }

  // when editor emits changes, update notation rendering
  notationUpdated(cm, forceUpdate = false) {
    // console.log('NotationUpdated forceUpdate:' + forceUpdate);
    this.encodingHasChanged = true;
    let ch = document.getElementById('live-update-checkbox');
    if (this.updateNotation && ch && ch.checked || forceUpdate)
      this.updateData(cm, false, false);
  }

  // highlight currently selected elements
  updateHighlight(cm) {
    // clear existing highlighted classes
    let highlighted = Array.from(document.querySelectorAll('g.highlighted'));
    // console.info('updateHlt: highlighted: ', highlighted);
    highlighted.forEach(e => e.classList.remove('highlighted'));
    let ids = [];
    if (this.selectedElements.length > 0)
      this.selectedElements.forEach(item => ids.push(item));
    else ids.push(utils.getElementIdAtCursor(cm));
    // console.info('updateHlt ids: ', ids);
    for (let id of ids) {
      if (id) {
        let el = document.querySelector('g#' + id)
        // console.info('updateHlt el: ', el);
        if (el) {
          el.classList.add('highlighted');
          let children = Array.from(el.querySelectorAll('g'));
          children.forEach(item => item.classList.add('highlighted'));
        }
      }
    }
  }

  setNotationColors(matchTheme = false, alwaysBW = false) {
    // work-around that booleans retrieved from storage are strings
    if (typeof matchTheme === 'string') matchTheme = (matchTheme === 'true');
    if (typeof alwaysBW === 'string') alwaysBW = (alwaysBW === 'true');
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
  }

  // sets the color scheme of the active theme
  setMenuColors() {
    let rt = document.querySelector(':root');
    let cm = window.getComputedStyle(document.querySelector('.CodeMirror'));
    rt.style.setProperty('--backgroundColor', cm.backgroundColor);
    // rt.style.setProperty('color', cm.color);
    rt.style.setProperty('--textColor', cm.color);
    let cmAtt = document.querySelector('.cm-attribute');
    if (cmAtt) rt.style.setProperty('--highlightColor',
      window.getComputedStyle(cmAtt).color);
    let j = 0;
    cm.backgroundColor.slice(4, -1).split(',').forEach(i => j += parseInt(i));
    j /= 3;
    console.log('setMenuColors lightness: ' + j + ', ' + ((j < 128) ? 'dark' : 'bright') + '.');
    let els = document.querySelectorAll(
      '.btn,.settingsButton,.CodeMirror-scrollbar-filler,#verovio-icon,#GithubLogo,#hideSettingsButtonImg');
    let owl = document.getElementById('mei-friend-logo');
    let owlSrc = owl.getAttribute('src');
    owlSrc = owlSrc.substr(0, owlSrc.lastIndexOf('/') + 1);
    if (j < 128) { // dark
      // wake up owl
      owl.setAttribute("src", owlSrc + 'menu-logo.svg');
      Array.from(els).forEach(el => el.style.setProperty('filter', 'invert(.8)'));
      let btn = document.querySelectorAll('.btn');
      if (btn) Array.from(btn).forEach(el => {
        el.style.setProperty('background-color', complementary(cm.backgroundColor));
        el.style.setProperty('color', complementary(cm.color));
      });
      rt.style.setProperty('--settingsLinkBackgroundColor', brighter(cm.backgroundColor, 21));
      rt.style.setProperty('--settingsLinkHoverColor', brighter(cm.backgroundColor, 36));
      rt.style.setProperty('--settingsBackgroundColor', brighter(cm.backgroundColor, 36));
      rt.style.setProperty('--settingsBackgroundAlternativeColor', brighter(cm.backgroundColor, 24));
      rt.style.setProperty('--navbarBackgroundColor', brighter(cm.backgroundColor, 50));
      rt.style.setProperty('--dropdownHeadingColor', brighter(cm.backgroundColor, 70));
      rt.style.setProperty('--dropdownBackgroundColor', brighter(cm.backgroundColor, 50));
      rt.style.setProperty('--dropdownBorderColor', brighter(cm.backgroundColor, 100));
      let att = document.querySelector('.cm-attribute');
      if (att) rt.style.setProperty('--keyboardShortCutColor', brighter(window.getComputedStyle(att).color, 40));
      let tag = document.querySelector('.cm-tag');
      if (tag) rt.style.setProperty('--fileStatusColor', brighter(window.getComputedStyle(tag).color, 40));
      let str = document.querySelector('.cm-string');
      if (str) {
        rt.style.setProperty('--fileStatusChangedColor', brighter(window.getComputedStyle(str).color, 40));
        rt.style.setProperty('--fileStatusWarnColor', brighter(window.getComputedStyle(str).color, 10));
      }
    } else { // bright mode
      // sleepy owl
      owl.setAttribute("src", owlSrc + 'menu-logo-asleep.svg');
      Array.from(els).forEach(el => el.style.removeProperty('filter'));
      let btn = document.querySelectorAll('.btn');
      if (btn) Array.from(btn).forEach(el => {
        el.style.setProperty('background-color', cm.backgroundColor);
        el.style.setProperty('color', cm.color);
      });
      rt.style.setProperty('--settingsLinkBackgroundColor', brighter(cm.backgroundColor, -16));
      rt.style.setProperty('--settingsLinkHoverColor', brighter(cm.backgroundColor, -24));
      rt.style.setProperty('--settingsBackgroundColor', brighter(cm.backgroundColor, -36));
      rt.style.setProperty('--settingsBackgroundAlternativeColor', brighter(cm.backgroundColor, -24));
      rt.style.setProperty('--navbarBackgroundColor', brighter(cm.backgroundColor, -50));
      rt.style.setProperty('--dropdownHeadingColor', brighter(cm.backgroundColor, -70));
      rt.style.setProperty('--dropdownBackgroundColor', brighter(cm.backgroundColor, -50));
      rt.style.setProperty('--dropdownBorderColor', brighter(cm.backgroundColor, -100));
      let att = document.querySelector('.cm-attribute');
      if (att) rt.style.setProperty('--keyboardShortCutColor', brighter(window.getComputedStyle(att).color, -40));
      let tag = document.querySelector('.cm-tag');
      if (tag) rt.style.setProperty('--fileStatusColor', brighter(window.getComputedStyle(tag).color, -40));
      let str = document.querySelector('.cm-string');
      if (str) {
        rt.style.setProperty('--fileStatusChangedColor', brighter(window.getComputedStyle(str).color, -40));
        rt.style.setProperty('--fileStatusWarnColor', brighter(window.getComputedStyle(str).color, -10));
      }
    }


    function brighter(rgbString, deltaPercent) {
      let rgb = [];
      rgbString.slice(4, -1).split(',').forEach(i => {
        rgb.push(Math.max(0, Math.min(parseInt(i) + deltaPercent, 255)));
      });
      return 'rgb(' + rgb.join(', ') + ')';
    }

    function complementary(rgbString) {
      let rgb = [];
      rgbString.slice(4, -1).split(',').forEach(i => {
        rgb.push(255 - i);
      });
      return 'rgb(' + rgb.join(', ') + ')';
    }
  }

  zoom(delta) {
    let zoomCtrl = document.getElementById('verovio-zoom');
    if (delta <= 30) // delta only up to 30% difference
      zoomCtrl.value = parseInt(zoomCtrl.value) + delta;
    else // otherwise take it as the scaling value
      zoomCtrl.value = delta;
    this.updateLayout();
    // this.updateZoomSliderTooltip(zoomCtrl);
  }

  // change font size of editor panel (sign is direction
  // or percent when larger than 30)
  changeEditorFontSize(delta) {
    let zf = document.getElementById('zoomFont');
    let value = delta;
    if (delta < 30) value = parseInt(zf.value) + delta;
    value = Math.min(300, Math.max(45, value)); // 45---300, see #zoomFont
    document.querySelector('.encoding').style.fontSize = value + '%';
    zf.value = value;
  }

  // TODO: why is it not showing?
  updateZoomSliderTooltip(zoomCtrl) {
    let toolTipText = 'Notation scale: ' + zoomCtrl.value + "%";
    let tt = zoomCtrl.querySelector('.tooltiptext');
    // console.info('Zoomctr.TT: ', tt);
    if (tt) tt.innerHTML = toolTipText;
    else addToolTip(zoomCtrl, {
      title: toolTipText
    });
    tt.classList.add('visible');
    if (this.toolTipTimeOutHandle) clearTimeout(this.toolTipTimeOutHandle);
    this.toolTipTimeOutHandle = setTimeout(() =>
      tt.classList.remove('visible'), 1500);
  }

  // set focus to verovioPane in order to ensure working key bindings
  setFocusToVerovioPane() {
    let el = document.querySelector('.verovio-panel');
    el.setAttribute('tabindex', '-1');
    el.focus();
    // $(".mei-friend").attr('tabindex', '-1').focus();
  }

  showSettingsPanel() {
    let sp = document.getElementById('settingsPanel');
    if (sp.style.display !== 'block') sp.style.display = 'block';
    sp.classList.remove('out');
    sp.classList.add('in');
  }

  hideSettingsPanel() {
    let sp = document.getElementById('settingsPanel');
    sp.classList.add('out');
    sp.classList.remove('in');
  }

  toggleSettingsPanel(ev = null) {
    if (ev) {
      console.log('stop propagation')
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
    let sp = document.getElementById('settingsPanel');
    if (sp.classList && sp.classList.contains('in')) {
      this.hideSettingsPanel();
    } else {
      this.showSettingsPanel();
    }
  }

  // initializes the settings panel by filling it with content
  addVrvOptionsToSettingsPanel(tkAvailableOptions, defaultVrvOptions,
    restoreFromLocalStorage = true) {
    // skip these options (iin part because they are handled in control menu)
    let skipList = ['font', 'breaks', 'engravingDefaults', 'expand',
      'svgAdditionalAttribute', 'handwrittenFont'
    ];
    let vsp = document.getElementById('verovioSettings');
    let addListeners = false; // add event listeners only the first time
    if (!/\w/g.test(vsp.innerHTML)) addListeners = true;
    vsp.innerHTML = "";
    let settingsVrvGrpSelectHtml = '<a id="settingsVrvGrpSelect"></a>'; // vrv settings navigation links
    Object.keys(tkAvailableOptions.groups).forEach((grp) => {
      let group = tkAvailableOptions.groups[grp];
      let groupId = group.name.replaceAll(" ", "_");
      // skip these two groups: base handled by mei-friend; sel to be thought
      if (!group.name.startsWith('Base short') &&
        !group.name.startsWith('Element selectors')) {
        vsp.innerHTML += `<div><h2 id="${groupId}">${group.name}<a href="#settingsVrvGrpSelect">&uarr;</a></h2></div>`;
        settingsVrvGrpSelectHtml += `<div><a href="#${groupId}">${group.name}</a></div>`;
        Object.keys(group.options).forEach(opt => {
          if (!skipList.includes(opt)) {
            let o = group.options[opt]; // vrv available options
            let optDefault = o.default; // available options defaults
            if (defaultVrvOptions.hasOwnProperty(opt)) // mei-friend vrv defaults
              optDefault = defaultVrvOptions[opt];
            if (storage.hasOwnProperty('vrv-' + opt)) {
              if (restoreFromLocalStorage) optDefault = storage['vrv-' + opt];
              else delete storage['vrv-' + opt];
            }
            let div = this.createOptionsItem(opt, o, optDefault);
            if (div) vsp.appendChild(div);
            // set all options so that toolkit is always completely cleared
            if (['bool', 'int', 'double', 'std::string-list'].includes(o.type))
              this.vrvOptions[opt] = optDefault;
          }
        });
      }
    });
    // inject navigation links at the top of verovio settings
    vsp.innerHTML = settingsVrvGrpSelectHtml + vsp.innerHTML;
    vsp.innerHTML += '<input type="button" title="Reset to mei-friend defaults" id="reset" value="Default" />';
    if (addListeners) { // add change listeners
      vsp.addEventListener('input', ev => {
        let opt = ev.srcElement.id;
        let value = ev.srcElement.value;
        if (ev.srcElement.type === 'checkbox') value = ev.srcElement.checked;
        if (ev.srcElement.type === 'number') value = parseFloat(value);
        this.vrvOptions[opt] = value;
        if (defaultVrvOptions.hasOwnProperty(opt) && // TODO check vrv default values
          defaultVrvOptions[opt].toString() === value.toString())
          delete storage['vrv-' + opt]; // remove from storage object when default value
        else
          storage['vrv-' + opt] = value; // save changes in localStorage object
        this.updateLayout(this.vrvOptions);
      });
      vsp.addEventListener('click', ev => { // RESET button
        if (ev.srcElement.id === 'reset') {
          this.addVrvOptionsToSettingsPanel(tkAvailableOptions, defaultVrvOptions, false);
          this.updateLayout(this.vrvOptions);
        }
      });
    }
  }

  addCmOptionsToSettingsPanel(cm, mfDefaults, restoreFromLocalStorage = true) {
    let optionsToShow = { // key as in CodeMirror
      zoomFont: {
        title: 'Font size (%)',
        decription: 'Change font size of editor (in percent)',
        type: 'int',
        default: 100,
        min: 45,
        max: 300,
        step: 5
      },
      theme: {
        title: 'Theme',
        description: 'Select the theme of the editor',
        type: 'select',
        default: 'default',
        values: ['default', 'abbott', 'base16-dark', 'base16-light', 'cobalt',
          'darcula', 'dracula', 'eclipse', 'elegant', 'monokai', 'idea',
          'juejin', 'mdn-like', 'neo', 'paraiso-dark', 'paraiso-light',
          'pastel-on-dark', 'xq-dark', 'xq-light', 'yeti', 'yonce', 'zenburn'
        ]
      },
      matchTheme: {
        title: 'Notation matches theme',
        description: 'Match notation to editor color theme',
        type: 'bool',
        default: false
      },
      // notationBlackWhite: {
      //   title: 'Notation always black on white',
      //   description: 'Notation is always black on white (also in dark mode)',
      //   type: 'bool',
      //   default: true
      // },
      tabSize: {
        title: 'Tab size',
        description: 'Number of space characters for each indentation level',
        type: 'int',
        min: 1,
        max: 12,
        step: 1,
        default: 3
      },
      lineWrapping: {
        title: 'Line wrapping',
        description: 'Whether or not lines are wrapped at end of panel',
        type: 'bool',
        default: false
      },
      lineNumbers: {
        title: 'Line numbers',
        description: 'Show line numbers',
        type: 'bool',
        default: true
      },
      firstLineNumber: {
        title: 'First line number',
        description: 'Set first line number',
        type: 'int',
        min: 0,
        max: 1,
        step: 1,
        default: 1
      },
      foldGutter: {
        title: 'Code folding',
        description: 'Enable code folding through fold gutters',
        type: 'bool',
        default: true
      },
      autoCloseBrackets: {
        title: 'Auto close brackets',
        description: 'Automatically close brackets at input',
        type: 'bool',
        default: true
      },
      autoCloseTags: {
        title: 'Auto close tags',
        description: 'Automatically close tags at input',
        type: 'bool',
        default: true
      },
      matchTags: {
        title: 'Match tags',
        description: 'Highlights matched tags around editor cursor',
        type: 'bool',
        default: true
      },
      showTrailingSpace: {
        title: 'Highlight trailing spaces',
        description: 'Highlights unnecessary trailing spaces at end of lines',
        type: 'bool',
        default: true
      },
      keyMap: {
        title: 'Key map',
        description: 'Select key map',
        type: 'select',
        default: 'default',
        values: ['default', 'vim', 'emacs']
      },
      hintOptions: {
        title: 'Show hints for schema',
        description: 'Show hints for selected XML schema and autocomplete',
        type: 'select',
        default: 'schema_meiCMN_401',
        values: ['schema_meiCMN_401', 'schema_meiAll_401', 'none']
      },
    };
    let storage = window.localStorage;
    let cmsp = document.getElementById('editorSettings');
    let addListeners = false; // add event listeners only the first time
    if (!/\w/g.test(cmsp.innerHTML)) addListeners = true;
    cmsp.innerHTML = '<div><h2>Editor Settings</h2></div>';
    Object.keys(optionsToShow).forEach(opt => {
      let o = optionsToShow[opt];
      let optDefault = o.default;
      if (mfDefaults.hasOwnProperty(opt)) {
        optDefault = mfDefaults[opt]
        if (opt === 'matchTags' && typeof optDefault === 'object') optDefault = true;
      };
      if (storage.hasOwnProperty('cm-' + opt)) {
        if (restoreFromLocalStorage) optDefault = storage['cm-' + opt];
        else delete storage['cm-' + opt];
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches && opt === 'theme') {
        optDefault = mfDefaults['defaultDarkTheme']; // take a dark scheme for dark mode
      }
      let div = this.createOptionsItem(opt, o, optDefault)
      if (div) cmsp.appendChild(div);
      this.applyEditorOption(cm, opt, optDefault);
    });
    cmsp.innerHTML += '<input type="button" title="Reset to mei-friend defaults" id="reset" value="Default" />';

    if (addListeners) { // add change listeners
      cmsp.addEventListener('input', ev => {
        let option = ev.srcElement.id;
        let value = ev.srcElement.value;
        if (ev.srcElement.type === 'checkbox') value = ev.srcElement.checked;
        if (ev.srcElement.type === 'number') value = parseFloat(value);
        this.applyEditorOption(cm, option, value,
          storage.hasOwnProperty('cm-matchTheme') ?
          storage['cm-matchTheme'] : mfDefaults['matchTheme']);
        if (option === 'theme' && storage.hasOwnProperty('cm-matchTheme')) {
          this.setNotationColors(
            storage.hasOwnProperty('cm-matchTheme') ?
            storage['cm-matchTheme'] : mfDefaults['matchTheme']);
        }
        if (mfDefaults.hasOwnProperty(option) && mfDefaults[option].toString() === value.toString()) {
          delete storage['cm-' + option]; // remove from storage object when default value
        } else {
          storage['cm-' + option] = value; // save changes in localStorage object
        }
      });
      cmsp.addEventListener('click', ev => {
        if (ev.srcElement.id === 'reset') {
          this.addCmOptionsToSettingsPanel(cm, mfDefaults, false);
        }
      });
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ev => { // system changes from dark to bright or otherway round
          if (!storage.hasOwnProperty('cm-theme')) { // only if not changed by user
            let matchTheme = storage.hasOwnProperty('cm-matchTheme') ? storage['cm-matchTheme'] : mfDefaults['matchTheme'];
            if (ev.matches) { // event listener for dark/bright mode changes
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

  // Apply options to CodeMirror object and handle other specialized options
  applyEditorOption(cm, option, value, matchTheme = false) {
    switch (option) {
      case 'hintOptions':
        if (value === 'schema_meiAll_401')
          cm.setOption(option, {
            'schemaInfo': {
              ...schema_meiAll_401
            }
          });
        else if (value === 'schema_meiCMN_401')
          cm.setOption(option, {
            'schemaInfo': {
              ...schema_meiCMN_401
            }
          });
        else cm.setOption(option, {}); // hints: none
        break;
      case 'zoomFont':
        this.changeEditorFontSize(value);
        break;
      case 'matchTheme':
        this.setNotationColors(value);
        break;
      case 'matchTags':
        cm.setOption(option, value ? {
          bothTags: true
        } : {});
        break;
      default:
        if (value == 'true' || value == 'false') value = (value === 'true');
        cm.setOption(option, value);
        if (option === 'theme') {
          this.setMenuColors();
          this.setNotationColors(matchTheme);
        }
    }
  }

  // creates an option div with a label and input/select depending of o.keys
  createOptionsItem(opt, o, optDefault) {
    let div = document.createElement('div');
    div.classList.add('optionsItem');
    let label = document.createElement('label')
    label.setAttribute('title', o.description + ' (default: ' +
      optDefault + ')');
    label.setAttribute('for', opt);
    label.innerText = o.title;
    div.appendChild(label);
    let input;
    let step = .05;
    switch (o.type) {
      case 'bool':
        input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        if ((typeof optDefault === 'string' && optDefault === 'true') ||
          (typeof optDefault === 'boolean' && optDefault))
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
        input.setAttribute('step', (optKeys.includes('step')) ? o.step : step);
        input.setAttribute('value', optDefault);
        break;
      case 'select':
      case 'std::string-list':
        input = document.createElement('select');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        o.values.forEach((str, i) => input.add(new Option(str, str,
          (o.values.indexOf(optDefault) == i) ? true : false)));
        break;
      default:
        console.log('Vervio Options: Unhandled data type: ' + o.type);
        console.log('title: ' + o.title + ' [' + o.type + '], default: [' + optDefault + ']');
    }
    if (input) div.appendChild(input);
    return (input) ? div : null;
  }

  // navigate forwards/backwards/upwards/downwards in the DOM, as defined
  // by 'dir' an by 'incrementElementName'
  navigate(cm, incElName = 'note', dir = 'forwards') {
    console.info('navigate(): lastNoteId: ', this.lastNoteId);
    this.updateNotation = false;
    let id = this.lastNoteId;
    if (id == '') { // empty note id
      this.setCursorToPageBeginning(cm); // re-defines lastNotId
      id = this.lastNoteId;
    };
    let element = document.querySelector('g#' + id);
    if (!element) { // element off-screen
      this.setCursorToPageBeginning(cm); // re-defines lastNotId
      id = this.lastNoteId;
      element = document.querySelector('g#' + id);
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
      if (incElName == 'note' || incElName == 'measure') {
        id = dutils.getIdOfNextSvgElement(element, dir, undefined, incElName);
        if (!id) { // when no id on screen, turn page
          let what = 'first'; // first/last note within measure
          if (dir == 'backwards' && incElName !== 'measure') what = 'last';
          let lyNo = 1;
          let layer = element.closest('.layer');
          if (layer) lyNo = layer.getAttribute('data-n');
          let staff = element.closest('.staff');
          let stNo = staff.getAttribute('data-n');
          this.navigateBeyondPage(cm, dir, what, stNo, lyNo, y);
          return;
        }
      }

      // up/down in layers
      if (incElName == 'layer') {
        // console.info('navigate(u/d): x/y: ' + x + '/' + y + ', el: ', element);
        let els = Array.from(measure.querySelectorAll(dutils.navElsSelector));
        els.sort(function(a, b) {
          if (Math.abs(dutils.getX(a) - x) > Math.abs(dutils.getX(b) - x))
            return 1;
          if (Math.abs(dutils.getX(a) - x) < Math.abs(dutils.getX(b) - x))
            return -1;
          if (dutils.getY(a) < dutils.getY(b))
            return (dir == 'upwards') ? 1 : -1;
          if (dutils.getY(a) > dutils.getY(b))
            return (dir == 'upwards') ? -1 : 1;
          return 0;
        });
        // console.info('els: ', els);
        let found = false;
        let yy = 0;
        for (let e of els) { // go thru all elements to find closest in x/y space
          if (found) {
            yy = dutils.getY(e);
            if (dir == 'upwards' && yy >= y) continue;
            if (dir == 'downwards' && yy <= y) continue;
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
    // this.updateNotationToTextposition(txtEdr); TODO
    if (id) {
      this.selectedElements = [];
      this.selectedElements.push(id);
      this.lastNoteId = id;
    }
    this.updateNotation = true;
    this.scrollSvg(cm);
    this.updateHighlight(cm);
  }

  // turn page for navigation and return svg directly
  navigateBeyondPage(cm, dir = 'forwards', what = 'first',
    stNo = 1, lyNo = 1, y = 0) {
    if (!this.changeCurrentPage(dir)) return; // turn page
    let message = {
      'cmd': 'navigatePage',
      'pageNo': this.currentPage,
      'dir': dir,
      'what': what,
      'stNo': stNo,
      'lyNo': lyNo,
      'y': y
    };
    if (this.speedMode) {
      message.mei = this.speedFilter(cm.getValue());
      message.speedMode = this.speedMode;
    }
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  getTimeForElement(id) {
    let promise = new Promise(function(resolve) {
      let message = {
        'cmd': 'getTimeForElement',
        'msg': id
      };
      v.vrvWorker.addEventListener('message', function handle(ev) {
        if (ev.data.cmd = message.cmd) {
          ev.target.removeEventListener('message', handle);
          resolve(ev.data.cmd);
        }
      });
      v.vrvWorker.postMessage(message);
    }); // .bind(this) ??
    promise.then(
      function(time) {
        return time;
      }
    );
  }

  findClosestNoteInChord(id, y) {
    if (id) { // if id within chord, find y-closest note to previous
      let ch = document.querySelector('g#' + id).closest('.chord');
      if (ch) {
        // console.info('back/forwards within a chord (y: ' + y + '), ', ch);
        let diff = Number.MAX_VALUE;
        ch.querySelectorAll('.note').forEach(item => {
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

  busy(active = true, speedWorker = false) {
    let direction = speedWorker ? 'anticlockwise' : 'clockwise';
    if (active) this.verovioIcon.classList.add(direction);
    else this.verovioIcon.classList.remove(direction);
  }

  breaksValue() {
    let breaksSelectVal = document.getElementById('breaks-select').value;
    switch (breaksSelectVal) {
      case 'auto':
        return {
          ...this.pageBreaks
        };
      case 'line':
        return ['sb', 'pb'];
      case 'encoded':
        return ['pb'];
      default:
        return '';
    }
  }

}
