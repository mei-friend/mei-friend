import {
  getVerovioContainerSize,
  setOrientation
} from './resizer.js'
import * as speed from './speed.js';
import * as utils from './utils.js';
import * as dutils from './dom-utils.js';
import * as att from './attribute-classes.js';
import {
  annotations,
  generateAnnotationLocationLabel
} from './annotation.js'
import {
  cm,
  defaultVerovioVersion,
  fontList,
  rngLoader,
  storage,
  supportedVerovioVersions,
  tkVersion,
  validate,
  validator
} from './main.js';
import {
  drawSourceImage,
  highlightZone,
  zoomSourceImage
} from './source-imager.js';
import {
  alert,
  download,
  verified,
  unverified
} from '../css/icons.js';

export default class Viewer {

  constructor(vrvWorker, spdWorker) {
    this.vrvWorker = vrvWorker;
    this.spdWorker = spdWorker;
    this.validatorInitialized = false;
    this.validatorWithSchema = false;
    this.currentSchema = '';
    this.updateLinting; // CodeMirror function for linting
    this.currentPage = 1;
    this.pageCount = 0;
    this.selectedElements = [];
    this.lastNoteId = '';
    this.notationNightMode = false;
    this.updateNotation = true; // whether or not notation gets re-rendered after text changes
    this.speedMode = true; // speed mode (just feeds on page to Verovio to reduce drawing time)
    this.parser = new DOMParser();
    this.xmlDoc;
    this.encodingHasChanged = true; // to recalculate DOM or pageLists
    this.pageBreaks = {}; // object of page number and last measure id '1': 'measure-000423', ...
    this.pageSpanners = { // object storing all time-spannind elements spanning across pages
      start: {},
      end: {}
    };
    // this.scoreDefList = []; // list of xmlNodes, one for each change, referenced by 5th element of pageList
    this.meiHeadRange = [];
    this.vrvOptions; // all verovio options
    this.verovioIcon = document.getElementById('verovio-icon');
    this.respId = '';
    this.alertCloser;
    this.filterSettingsString = ''; // used to filter settings options
  }

  // change options, load new data, render current page, add listeners, highlight
  updateAll(cm, options = {}, xmlId = '') {
    this.setVerovioOptions(options);
    let computePageBreaks = false;
    let p = this.currentPage;
    if (this.speedMode && Object.keys(this.pageBreaks).length === 0 &&
      document.getElementById('breaks-select').value === 'auto') {
      computePageBreaks = true;
      p = 1; // request page one, but leave currentPage unchanged
    }
    if (this.speedMode && xmlId) {
      p = speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId);
      this.changeCurrentPage(p);
    }
    let message = {
      'cmd': 'updateAll',
      'options': this.vrvOptions,
      'mei': this.speedFilter(cm.getValue()),
      'pageNo': p,
      'xmlId': xmlId,
      'speedMode': this.speedMode,
      'computePageBreaks': computePageBreaks
    }
    this.busy();
    this.vrvWorker.postMessage(message);
  }

  updateData(cm, setCursorToPageBeg = true, setFocusToVerovioPane = true) {
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
          this.changeCurrentPage(speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId));
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

  getPageWithElement(xmlId, situateAnno = null) {
    /* optional param situateAnno: expects an object like
    { 
      id: annotationXmlId,
      type: ['first'|'last']
    }
    purpose: allow asynchronous supply of page numbers by web worker
    compare: situateAnnotations() in annotation.js
    */
    let pageNumber = -1;
    let that = this;
    console.log('getPageWithElement(' + xmlId + '), speedMode: ' + this.speedMode);
    if (this.speedMode) {
      pageNumber = speed.getPageWithElement(this.xmlDoc, this.breaksValue(), xmlId);
    } else {
      let promise = new Promise(function (resolve) {
        let taskId = Math.random();
        const msg = {
          'cmd': 'getPageWithElement',
          'msg': xmlId,
          'taskId': taskId,
        };
        if (situateAnno && 'type' in situateAnno) {
          msg.type = situateAnno.type;
        }
        that.vrvWorker.addEventListener('message', function handle(ev) {
          if (ev.data.cmd === 'pageWithElement' && ev.data.taskId === taskId) {
            resolve(ev.data.msg);
            that.vrvWorker.removeEventListener('message', handle);
          }
        });
        that.vrvWorker.postMessage(msg);
      }.bind(that));
      promise.then(function (p) {
        if (situateAnno && 'id' in situateAnno) {
          const ix = annotations.findIndex(a => a.id === situateAnno.id);
          if (ix >= 0) { // found it
            switch (situateAnno.type) {
              case 'first':
                annotations[ix].firstPage = p;
                break;
              case 'last':
                annotations[ix].lastPage = p;
                break;
              default:
                console.error("Called getPageWithElement on Verovio worker with invalid situateAnno: ", situateAnno);
            }
            const annotationLocationLabelElement = document.querySelector(`.annotationLocationLabel[data-id=${situateAnno.id}`);
            if (annotationLocationLabelElement) {
              annotationLocationLabelElement.innerHTML = generateAnnotationLocationLabel(annotations[ix]).innerHTML;
            }
          }
        }
      });
    }
    console.log('pageNumber: ', pageNumber);
    return pageNumber;
  }

  gotPageNumber(ev) {
    if (ev.cmd === 'pageWithElement') {
      this.vrvWorker.removeEventListener('message', handle);
      resolve(ev.msg);
    }
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
        if (countBreaks && breaks.includes(e.nodeName)) {
          // if within app, increment only if inside lem or 1st rdg
          if (dutils.countAsBreak(e)) this.pageCount++;
        }
      }
      for (let e of Array.from(elements).reverse()) { // skip trailing breaks
        if (e.nodeName === 'measure') break;
        if (countBreaks && breaks.includes(e.nodeName)) this.pageCount--;
      }
    }
    if (this.pageCount > 0 && (this.currentPage < 1 || this.currentPage > this.pageCount))
      this.currentPage = 1;
    console.info('xmlDOM pages counted: currentPage: ' + this.currentPage +
      ', pageCount: ' + this.pageCount);
    // compute time-spanning elements object in speed-worker
    if (tkVersion && this.pageSpanners.start && Object.keys(this.pageSpanners.start).length === 0 &&
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
    return speed.getPageFromDom(this.xmlDoc, this.currentPage, breaks, this.pageSpanners);
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
    this.pageSpanners = {
      start: {},
      end: {}
    };
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
    let vp = document.getElementById('verovio-panel');
    dimensions.width = vp.clientWidth;
    dimensions.height = vp.clientHeight;
    // console.info('client size: ' + dimensions.width + '/' + dimensions.height);
    if (this.vrvOptions.breaks !== "none") {
      this.vrvOptions.pageWidth = Math.max(Math.round(
        dimensions.width * (100 / this.vrvOptions.scale)), 100);
      this.vrvOptions.pageHeight = Math.max(Math.round(
        dimensions.height * (100 / this.vrvOptions.scale)), 100);
    }
    // overwrite existing options if new ones are passed in
    // for (let key in newOptions) { this.vrvOptions[key] = newOptions[key]; }
    console.info('Verovio options updated: ', this.vrvOptions);
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
      if (storage && storage.supported) storage.page = this.currentPage;
      this.updatePageNumDisplay();
      return true;
    }
    return false;
  }

  updatePageNumDisplay() {
    let pg = (this.pageCount < 0) ? '?' : this.pageCount;
    document.getElementById('pagination1').innerHTML = 'Page';;
    document.getElementById('pagination2').innerHTML = `&nbsp;${this.currentPage}&nbsp;`;
    document.getElementById('pagination3').innerHTML = `of ${pg}`;
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
    let elements = document.querySelectorAll('g[id],rect[id],text[id]');
    elements.forEach(item => {
      item.addEventListener('click',
        (event) => this.handleClickOnNotation(event, cm));
    });
  }

  handleClickOnNotation(e, cm) {
    e.stopImmediatePropagation();
    this.hideAlerts();
    let point = {};
    point.x = e.clientX;
    point.y = e.clientY;
    var matrix = document.querySelector('g.page-margin').getScreenCTM().inverse();
    let r = {}
    r.x = matrix.a * point.x + matrix.c * point.y + matrix.e;
    r.y = matrix.b * point.x + matrix.d * point.y + matrix.f;
    console.log('Click on ' + e.srcElement.id + ', x/y: ' + r.x + '/' + r.y);

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
    let id = utils.getElementIdAtCursor(cm);
    // console.log('cursorActivity forceFlip: ' + forceFlip + ' to: ' + id);
    this.selectedElements = [];
    if (id) {
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
  }

  // Scroll notation SVG into view, both vertically and horizontally
  scrollSvg(cm) {
    let vp = document.getElementById('verovio-panel');
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
    this.checkSchema(cm.getValue());
    let ch = document.getElementById('live-update-checkbox');
    if (this.updateNotation && ch && ch.checked || forceUpdate)
      this.updateData(cm, false, false);
  }

  // highlight currently selected elements, if cm left out, all are cleared
  updateHighlight(cm) {
    // clear existing highlighted classes
    let highlighted = document.querySelectorAll('.highlighted');
    // console.info('updateHlt: highlighted: ', highlighted);
    highlighted.forEach(e => e.classList.remove('highlighted'));
    let ids = [];
    if (this.selectedElements.length > 0)
      this.selectedElements.forEach(item => ids.push(item));
    else if (cm) ids.push(utils.getElementIdAtCursor(cm));
    // console.info('updateHlt ids: ', ids);
    for (let id of ids) {
      if (id) {
        let el = document.querySelectorAll('#' + id); // was: 'g#'+id
        // console.info('updateHlt el: ', el);
        if (el) {
          el.forEach(e => {
            e.classList.add('highlighted');
            if (e.nodeName === 'rect' && e.closest('#source-image-svg'))
              highlightZone(e);
            e.querySelectorAll('g').forEach(g => g.classList.add('highlighted'));
          });
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
    let els = document.querySelectorAll('.CodeMirror-scrollbar-filler');
    let owl = document.getElementById('mei-friend-logo');
    let owlSrc = owl.getAttribute('src');
    owlSrc = owlSrc.substr(0, owlSrc.lastIndexOf('/') + 1);
    if (env === environments.staging)
      owlSrc += 'staging-';
    if (j < 128) { // dark
      // wake up owl
      owl.setAttribute("src", owlSrc + 'menu-logo.svg');
      els.forEach(el => el.style.setProperty('filter', 'invert(.8)'));
      rt.style.setProperty('--settingsLinkBackgroundColor', utils.brighter(cm.backgroundColor, 21));
      rt.style.setProperty('--settingsLinkHoverColor', utils.brighter(cm.backgroundColor, 36));
      rt.style.setProperty('--settingsBackgroundColor', utils.brighter(cm.backgroundColor, 36));
      rt.style.setProperty('--settingsBackgroundAlternativeColor', utils.brighter(cm.backgroundColor, 24));
      rt.style.setProperty('--navbarBackgroundColor', utils.brighter(cm.backgroundColor, 50));
      rt.style.setProperty('--dropdownHeadingColor', utils.brighter(cm.backgroundColor, 70));
      rt.style.setProperty('--dropdownBackgroundColor', utils.brighter(cm.backgroundColor, 50));
      rt.style.setProperty('--validationStatusBackgroundColor', utils.brighter(cm.backgroundColor, 50, .3));
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
      rt.style.setProperty('--annotationPanelBackgroundColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'));
      // utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelBackgroundColor'), -40));
      rt.style.setProperty('--annotationPanelLinkBackgroundColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'), -30));
      rt.style.setProperty('--annotationPanelHoverColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'), -60));
      rt.style.setProperty('--annotationPanelTextColor', 'white');
      rt.style.setProperty('--annotationPanelBorderColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelDarkBackgroundColor'), 30));
    } else { // bright mode
      // sleepy owl
      owl.setAttribute("src", owlSrc + 'menu-logo-asleep.svg');
      els.forEach(el => el.style.removeProperty('filter'));
      rt.style.setProperty('--settingsLinkBackgroundColor', utils.brighter(cm.backgroundColor, -16));
      rt.style.setProperty('--settingsLinkHoverColor', utils.brighter(cm.backgroundColor, -24));
      rt.style.setProperty('--settingsBackgroundColor', utils.brighter(cm.backgroundColor, -36));
      rt.style.setProperty('--settingsBackgroundAlternativeColor', utils.brighter(cm.backgroundColor, -24));
      rt.style.setProperty('--navbarBackgroundColor', utils.brighter(cm.backgroundColor, -50));
      rt.style.setProperty('--dropdownHeadingColor', utils.brighter(cm.backgroundColor, -70));
      rt.style.setProperty('--dropdownBackgroundColor', utils.brighter(cm.backgroundColor, -50));
      rt.style.setProperty('--validationStatusBackgroundColor', utils.brighter(cm.backgroundColor, -50, .3));
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
      rt.style.setProperty('--annotationPanelBackgroundColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelBackgroundColor'));
      rt.style.setProperty('--annotationPanelLinkBackgroundColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelLinkBackgroundColor'));
      rt.style.setProperty('--annotationPanelHoverColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelHoverColor'));
      rt.style.setProperty('--annotationPanelTextColor',
        window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelTextColor'));
      rt.style.setProperty('--annotationPanelBorderColor',
        utils.brighter(window.getComputedStyle(rt).getPropertyValue('--defaultAnnotationPanelBackgroundColor'), -30));
    }

  } // setMenuColors()

  // Control zoom of notation display and update Verovio layout
  zoom(delta, storage = null) {
    let zoomCtrl = document.getElementById('verovio-zoom');
    if (zoomCtrl) {
      if (delta <= 30) // delta only up to 30% difference
        zoomCtrl.value = parseInt(zoomCtrl.value) + delta;
      else // otherwise take it as the scaling value
        zoomCtrl.value = delta;
      if (storage && storage.supported) storage.scale = zoomCtrl.value;
      this.updateLayout();
    }
  }

  // change font size of editor panel (sign is direction
  // or percent when larger than 30)
  changeEditorFontSize(delta) {
    let zf = document.getElementById('zoomFont');
    let value = delta;
    if (delta < 30) value = parseInt(zf.value) + delta;
    value = Math.min(300, Math.max(45, value)); // 45---300, see #zoomFont
    document.getElementById('encoding').style.fontSize = value + '%';
    zf.value = value;
  }

  // set focus to verovioPane in order to ensure working key bindings
  setFocusToVerovioPane() {
    let el = document.getElementById('verovio-panel');
    el.setAttribute('tabindex', '-1');
    el.focus();
  }

  showSettingsPanel() {
    let sp = document.getElementById('settingsPanel');
    if (sp.style.display !== 'block') sp.style.display = 'block';
    sp.classList.remove('out');
    sp.classList.add('in');
    document.getElementById('showSettingsButton').style.visibility = 'hidden';
  }

  hideSettingsPanel() {
    let sp = document.getElementById('settingsPanel');
    sp.classList.add('out');
    sp.classList.remove('in');
    document.getElementById('showSettingsButton').style.visibility = 'visible';
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

  toggleAnnotationPanel() {
    setOrientation(cm);
    if (this.speedMode &&
      document.getElementById('breaks-select').value == 'auto') {
      this.pageBreaks = {};
      this.updateAll(cm);
    } else {
      this.updateLayout();
    }
  }

  filterSettings(e) { 
    this.filterSettingsString = e.target.value;
    this.clearVrvOptionsSettingsPanel(true);
    this.addVrvOptionsToSettingsPanel(this.vrvOptions);
  }

  clearVrvOptionsSettingsPanel(retainOptions = false) {
    if(!retainOptions) 
    this.vrvOptions = {};
    document.getElementById('verovioSettings').innerHTML = '';
  }

  // initializes the settings panel by filling it with content
  addVrvOptionsToSettingsPanel(defaultVrvOptions, restoreFromLocalStorage = true) {
    let userFilter = document.querySelector(".settingsFilter");

    // skip these options (in part because they are handled in control menu)
    let skipList = ['breaks', 'engravingDefaults', 'expand',
      'svgAdditionalAttribute', 'handwrittenFont'
    ];
    let vsp = document.getElementById('verovioSettings');
    let addListeners = false; // add event listeners only the first time
    if (!/\w/g.test(vsp.innerHTML)) addListeners = true;
    vsp.innerHTML = "";
    let storage = window.localStorage;

    Object.keys(this.tkAvailableOptions.groups).forEach((grp, i) => {
      let group = this.tkAvailableOptions.groups[grp];
      let groupId = group.name.replaceAll(" ", "_");
      // skip these two groups: base handled by mei-friend; sel to be thought (TODO)
      if (!group.name.startsWith('Base short') &&
        !group.name.startsWith('Element selectors')) {
        let details = document.createElement('details');
        details.innerHTML += `<summary id="${groupId}">${group.name}</summary>`;
        Object.keys(group.options).forEach(opt => {
          // proceed (i.e., don't skip this opt) if it's not in our skip list... 
          // AND the user has not specified a filter string
          // ... or if they have specified one, skip unless the string matches the opt name or description
          if (!skipList.includes(opt) && 
              !this.filterSettingsString ||
              opt.toLowerCase().includes(this.filterSettingsString.toLowerCase()) ||
              group.options[opt].description.toLowerCase().includes(this.filterSettingsString.toLowerCase())
           ) {
            let o = group.options[opt]; // vrv available options
            let optDefault = o.default; // available options defaults
            if (defaultVrvOptions.hasOwnProperty(opt)) // mei-friend vrv defaults
              optDefault = defaultVrvOptions[opt];
            if (storage.hasOwnProperty('vrv-' + opt)) {
              if (restoreFromLocalStorage) optDefault = storage['vrv-' + opt];
              else delete storage['vrv-' + opt];
            }
            let div = this.createOptionsItem(opt, o, optDefault);
            if (div) details.appendChild(div);
            // set all options so that toolkit is always completely cleared
            if (['bool', 'int', 'double', 'std::string-list'].includes(o.type))
              this.vrvOptions[opt] = optDefault;
          }
        });
        if (i === 1) details.setAttribute('open', 'true');
        vsp.appendChild(details);
      }
    });

    vsp.innerHTML += '<input type="button" title="Reset to mei-friend defaults" id="vrvReset" class="resetButton" value="Default" />';
    if (addListeners) { // add change listeners
      vsp.addEventListener('input', ev => {
        let opt = ev.target.id;
        let value = ev.target.value;
        if (ev.target.type === 'checkbox') value = ev.target.checked;
        if (ev.target.type === 'number') value = parseFloat(value);
        this.vrvOptions[opt] = value;
        if (defaultVrvOptions.hasOwnProperty(opt) && // TODO check vrv default values
          defaultVrvOptions[opt].toString() === value.toString())
          delete storage['vrv-' + opt]; // remove from storage object when default value
        else
          storage['vrv-' + opt] = value; // save changes in localStorage object
        if (opt === 'font') document.getElementById('font-select').value = value;
        this.updateLayout(this.vrvOptions);
      });
      vsp.addEventListener('click', ev => { // RESET button
        if (ev.target.id === 'vrvReset') {
          this.addVrvOptionsToSettingsPanel(this.tkAvailableOptions, defaultVrvOptions, false);
          this.updateLayout(this.vrvOptions);
        }
      });
    }
  }

  addCmOptionsToSettingsPanel(cm, mfDefaults, restoreFromLocalStorage = true) {
    let optionsToShow = { // key as in CodeMirror
      zoomFont: {
        title: 'Font size (%)',
        description: 'Change font size of editor (in percent)',
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
          'pastel-on-dark', 'solarized dark', 'solarized light',
          'xq-dark', 'xq-light', 'yeti', 'yonce', 'zenburn'
        ]
      },
      matchTheme: {
        title: 'Notation matches theme',
        description: 'Match notation to editor color theme',
        type: 'bool',
        default: false
      },
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
      meifriendSeparator: {
        title: 'options-line', // class name of hr element
        type: 'line'
      },
      autoValidate: {
        title: 'Auto validation',
        description: 'Validate encoding against schema automatically after each edit',
        type: 'bool',
        default: true
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
      if (window.matchMedia('(prefers-color-scheme: dark)').matches && opt === 'theme') {
        optDefault = mfDefaults['defaultDarkTheme']; // take a dark scheme for dark mode
      }
      if (storage.hasOwnProperty('cm-' + opt)) {
        if (restoreFromLocalStorage) optDefault = storage['cm-' + opt];
        else delete storage['cm-' + opt];
      }
      let div = this.createOptionsItem(opt, o, optDefault)
      if (div) cmsp.appendChild(div);
      this.applyEditorOption(cm, opt, optDefault);
    });
    cmsp.innerHTML += '<input type="button" title="Reset to mei-friend defaults" id="cmReset" class="resetButton" value="Default" />';

    if (addListeners) { // add change listeners
      cmsp.addEventListener('input', ev => {
        let option = ev.target.id;
        let value = ev.target.value;
        if (ev.target.type === 'checkbox') value = ev.target.checked;
        if (ev.target.type === 'number') value = parseFloat(value);
        this.applyEditorOption(cm, option, value,
          storage.hasOwnProperty('cm-matchTheme') ?
          storage['cm-matchTheme'] : mfDefaults['matchTheme']);
        if (option === 'theme' && storage.hasOwnProperty('cm-matchTheme')) {
          this.setNotationColors(
            storage.hasOwnProperty('cm-matchTheme') ?
            storage['cm-matchTheme'] : mfDefaults['matchTheme']);
        }
        if ((mfDefaults.hasOwnProperty(option) && option !== 'theme' && mfDefaults[option].toString() === value.toString()) ||
          (option === 'theme' && (window.matchMedia('(prefers-color-scheme: dark)').matches ?
            mfDefaults.defaultDarkTheme : mfDefaults.defaultBrightTheme) === value.toString())) {
          delete storage['cm-' + option]; // remove from storage object when default value
        } else {
          storage['cm-' + option] = value; // save changes in localStorage object
        }
        if (option === 'autoValidate') { // validate if auto validation is switched on again
          if (value) {
            validate(cm.getValue(), this.updateLinting, {
              'forceValidate': true
            })
          } else {
            this.setValidationStatusToManual();
          }
        }
      });
      cmsp.addEventListener('click', ev => {
        if (ev.target.id === 'cmReset') {
          this.addCmOptionsToSettingsPanel(cm, mfDefaults, false);
        }
      });
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ev => { // system changes from dark to bright or otherway round
          if (!storage.hasOwnProperty('cm-theme')) { // only if not changed by user
            let matchTheme = storage.hasOwnProperty('cm-matchTheme') ? storage['cm-matchTheme'] : mfDefaults['cm-matchTheme'];
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

  addMeiFriendOptionsToSettingsPanel(restoreFromLocalStorage = true) {
    let optionsToShow = {
      selectToolkitVersion: {
        title: 'Verovio version',
        description: 'Select Verovio toolkit version (* Switching to older versions before 3.11.0 might require a refresh due to memory issues.)',
        type: 'select',
        default: defaultVerovioVersion,
        values: Object.keys(supportedVerovioVersions),
        valuesDescriptions: Object.keys(supportedVerovioVersions).map(key => supportedVerovioVersions[key].description)
      },
      showAnnotationPanel: {
        title: 'Show annotation panel',
        description: 'Show annotation panel',
        type: 'bool',
        default: false
      },
      annotationPanelSeparator: {
        title: 'options-line', // class name of hr element
        type: 'line'
      },
      titleSourceImagePanel: {
        title: 'Source image panel',
        description: 'Show the score images of the source edition, if available',
        type: 'header'
      },
      showSourceImagePanel: {
        title: 'Show source image panel',
        description: 'Show the score images of the source edition, if available',
        type: 'bool',
        default: false
      },
      selectSourceImagePosition: {
        title: 'Source image position',
        description: 'Select source image position relative to notation',
        type: 'select',
        values: ['left', 'right', 'top', 'bottom'],
        default: 'bottom'
      },
      sourceImageProportion: {
        title: 'Source image proportion (%)',
        description: 'Proportion that the source image pane takes from the notation pane (in percent)',
        type: 'int',
        min: 0,
        max: 99,
        step: 1,
        default: 50
      },
      showSourceImageFullPage: {
        title: 'Show full page',
        description: 'Shouw source image on full page',
        type: 'bool',
        default: false
      },
      sourceImageZoom: {
        title: 'Source image zoom (%)',
        description: 'Zoom level of source image (in percent)',
        type: 'int',
        min: 10,
        max: 300,
        step: 5,
        default: 100
      },
      editZones: {
        title: 'Edit source image zones',
        description: 'Edit source image zones (will link bounding boxes to facsimile zones)',
        type: 'bool',
        default: false
      },
      sourceImagePanelSeparator: {
        title: 'options-line', // class name of hr element
        type: 'line'
      },
      titleSupplied: {
        title: 'Handle <supplied> element',
        description: 'Control handling of <supplied> elements',
        type: 'header'
      },
      showSupplied: {
        title: 'Show <supplied> elements',
        description: 'Highlight all elements contained by a <supplied> element',
        type: 'bool',
        default: true
      },
      suppliedColor: {
        title: 'Select highlight color',
        description: 'Select <supplied> highlight color',
        type: 'color',
        default: '#e69500',
      },
      respSelect: {
        title: 'Select responsibility',
        description: 'Select responsibility id',
        type: 'select',
        default: 'none',
        values: []
      },
      dragLineSeparator: {
        title: 'options-line', // class name of hr element
        type: 'line'
      },
      dragSelection: {
        title: 'Drag select',
        description: 'Select elements in notation with mouse drag',
        type: 'header'
      },
      dragSelectNotes: {
        title: 'Select notes',
        description: 'Select notes',
        type: 'bool',
        default: true
      },
      dragSelectRests: {
        title: 'Select rests',
        description: 'Select rests and repeats (rest, mRest, beatRpt, halfmRpt, mRpt)',
        type: 'bool',
        default: true
      },
      dragSelectControlElements: {
        title: 'Select placement elements ',
        description: 'Select placement elements (i.e., with a @placement attribute: ' +
          att.attPlacement.join(', ') + ')',
        type: 'bool',
        default: false
      },
      dragSelectSlurs: {
        title: 'Select slurs ',
        description: 'Select slurs (i.e., elements with @curvature attribute: ' +
          att.attCurvature.join(', ') + ')',
        type: 'bool',
        default: false
      },
      dragSelectMeasures: {
        title: 'Select measures ',
        description: 'Select measures',
        type: 'bool',
        default: false
      },
      controlMenuLineSeparator: {
        title: 'options-line', // class name of hr element
        type: 'line'
      },
      controlMenuSettings: {
        title: 'Control bar',
        description: 'Define items to be shown in control menu',
        type: 'header'
      },
      controlMenuFontSelector: {
        title: 'Show notation font selector',
        description: 'Show notation font (SMuFL) selector in control menu',
        type: 'bool',
        default: false
      },
      controlMenuNavigateArrows: {
        title: 'Show navigation arrows',
        description: 'Show notation navigation arrows in control menu',
        type: 'bool',
        default: false
      },
      controlMenuUpdateNotation: {
        title: 'Show notation update controls',
        description: 'Show notation update behavior controls in control menu',
        type: 'bool',
        default: true
      },
      renumberMeasuresLineSeparator: {
        title: 'options-line', // class name of hr element
        type: 'line'
      },
      renumberMeasuresHeading: {
        title: 'Renumber measures',
        description: 'Settings for renumbering measures',
        type: 'header'
      },
      renumberMeasureContinueAcrossIncompleteMeasures: {
        title: 'Continue across incomplete measures',
        description: 'Continue measure numbers across incomplete measures (@metcon="false")',
        type: 'bool',
        default: false
      },
      renumberMeasuresUseSuffixAtMeasures: {
        title: 'Use suffix at incomplete measures',
        description: 'Use number suffix at incomplete measures (e.g., 23-cont)',
        type: 'select',
        values: ['none', '-cont'],
        default: false
      },
      renumberMeasuresContinueAcrossEndings: {
        title: 'Continue across endings',
        description: 'Continue measure numbers across endings',
        type: 'bool',
        default: false
      },
      renumberMeasuresUseSuffixAtEndings: {
        title: 'Use suffix at endings',
        description: 'Use number suffix at endings (e.g., 23-a)',
        type: 'select',
        values: ['none', 'ending@n', 'a/b/c', 'A/B/C', '-a/-b/-c', '-A/-B/-C'],
        default: false
      },
    };
    let mfs = document.getElementById('meiFriendSettings');
    let addListeners = false; // add event listeners only the first time
    let rt = document.querySelector(':root');
    if (!/\w/g.test(mfs.innerHTML)) addListeners = true;
    mfs.innerHTML = '<div><h2>mei-friend Settings</h2></div>';
    let storage = window.localStorage;
    Object.keys(optionsToShow).forEach(opt => {
      let o = optionsToShow[opt];
      let optDefault = o.default;
      if (storage.hasOwnProperty('mf-' + opt)) {
        if (restoreFromLocalStorage) {
          optDefault = storage['mf-' + opt];
          if (typeof optDefault === 'string' && (optDefault === 'true' || optDefault === 'false'))
            optDefault = optDefault === 'true';
        } else delete storage['mf-' + opt];
      }
      // set default values for mei-friend settings
      switch (opt) {
        case 'selectToolkitVersion':
          this.vrvWorker.postMessage({
            'cmd': 'loadVerovio',
            'msg': optDefault,
            'url': optDefault in supportedVerovioVersions 
              ? supportedVerovioVersions[optDefault].url
              : supportedVerovioVersions[o.default].url
          });
          break;
        case 'showSupplied':
          rt.style.setProperty('--suppliedColor', (optDefault) ? 'var(--defaultSuppliedColor)' : 'var(--notationColor)')
          rt.style.setProperty('--suppliedHighlightedColor', (optDefault) ? 'var(--defaultSuppliedHighlightedColor)' : 'var(--highlightColor)')
          break;
        case 'suppliedColor':
          let checked = document.getElementById('showSupplied').checked;
          rt.style.setProperty('--defaultSuppliedColor', checked ? optDefault : 'var(--notationColor)');
          rt.style.setProperty('--defaultSuppliedHighlightedColor', checked ? utils.brighter(optDefault, -50) : 'var(--highlightColor)');
          rt.style.setProperty('--suppliedColor', checked ? optDefault : 'var(--notationColor)');
          rt.style.setProperty('--suppliedHighlightedColor', checked ? utils.brighter(optDefault, -50) : 'var(--highlightColor)');
          break;
        case 'respSelect':
          if (this.xmlDoc)
            o.values = Array.from(this.xmlDoc.querySelectorAll('corpName[*|id]'))
            .map(e => e.getAttribute('xml:id'));
          break;
        case 'controlMenuFontSelector':
          document.getElementById('font-ctrls').style.display = optDefault ? 'inherit' : 'none';
          break;
        case 'controlMenuNavigateArrows':
          document.getElementById('navigate-ctrls').style.display = optDefault ? 'inherit' : 'none';
          break;
        case 'controlMenuUpdateNotation':
          document.getElementById('update-ctrls').style.display = optDefault ? 'inherit' : 'none';
          break;
      }
      let div = this.createOptionsItem(opt, o, optDefault)
      if (div) mfs.appendChild(div);
      if (opt === 'respSelect') this.respId = document.getElementById('respSelect').value;
      if (opt === 'renumberMeasuresUseSuffixAtEndings') {
        this.disableElementThroughCheckbox(
          'renumberMeasuresContinueAcrossEndings', 'renumberMeasuresUseSuffixAtEndings');
      }
      if (opt === 'renumberMeasuresUseSuffixAtMeasures') {
        this.disableElementThroughCheckbox(
          'renumberMeasureContinueAcrossIncompleteMeasures', 'renumberMeasuresUseSuffixAtMeasures');
      }
    });
    mfs.innerHTML += '<input type="button" title="Reset to mei-friend defaults" id="mfReset" class="resetButton" value="Default" />';

    if (addListeners) { // add change listeners
      mfs.addEventListener('input', ev => {
        let option = ev.target.id;
        let value = ev.target.value;
        if (ev.target.type === 'checkbox') value = ev.target.checked;
        if (ev.target.type === 'number') value = parseFloat(value);
        let col = document.getElementById('suppliedColor').value;
        switch (option) {
          case 'selectToolkitVersion':
            this.vrvWorker.postMessage({
              'cmd': 'loadVerovio',
              'msg': value,
              'url': supportedVerovioVersions[value].url
            });
            break;
          case 'showAnnotationPanel':
            this.toggleAnnotationPanel();
            break;
          case 'editZones':
          case 'showSourceImagePanel':
          case 'selectSourceImagePosition':
          case 'sourceImageProportion':
            setOrientation(cm, '', this);
            break;
          case 'showSourceImageFullPage':
            drawSourceImage();
            break;
          case 'sourceImageZoom':
            zoomSourceImage();
            break;
          case 'showSupplied':
            rt.style.setProperty('--suppliedColor', (value) ? col : 'var(--notationColor)');
            rt.style.setProperty('--suppliedHighlightedColor', (value) ? utils.brighter(col, -50) : 'var(--highlightColor)');
            break;
          case 'suppliedColor':
            let checked = document.getElementById('showSupplied').checked;
            rt.style.setProperty('--suppliedColor', checked ? col : 'var(--notationColor)');
            rt.style.setProperty('--suppliedHighlightedColor', checked ? utils.brighter(col, -50) : 'var(--highlightColor)');
            break;
          case 'respSelect':
            this.respId = document.getElementById('respSelect').value;
            break;
          case 'controlMenuFontSelector':
            document.getElementById('font-ctrls').style.display =
              document.getElementById('controlMenuFontSelector').checked ? 'inherit' : 'none';
            break;
          case 'controlMenuNavigateArrows':
            document.getElementById('navigate-ctrls').style.display =
              document.getElementById('controlMenuNavigateArrows').checked ? 'inherit' : 'none';
            break;
          case 'controlMenuUpdateNotation':
            document.getElementById('update-ctrls').style.display =
              document.getElementById('controlMenuUpdateNotation').checked ? 'inherit' : 'none';
            break;
          case 'renumberMeasuresContinueAcrossEndings':
            this.disableElementThroughCheckbox(
              'renumberMeasuresContinueAcrossEndings', 'renumberMeasuresUseSuffixAtEndings');
            break;
          case 'renumberMeasureContinueAcrossIncompleteMeasures':
            this.disableElementThroughCheckbox(
              'renumberMeasureContinueAcrossIncompleteMeasures', 'renumberMeasuresUseSuffixAtMeasures');
            break;
        }
        if (value === optionsToShow[option].default) {
          delete storage['mf-' + option]; // remove from storage object when default value
        } else {
          storage['mf-' + option] = value; // save changes in localStorage object
        }
      });
      mfs.addEventListener('click', ev => {
        if (ev.target.id === 'mfReset') {
          this.addMeiFriendOptionsToSettingsPanel(false);
        }
      });
      // window.matchMedia('(prefers-color-scheme: dark)')
      //   .addEventListener('change', ev => { // system changes from dark to bright or otherway round
      //     rt.style.setProperty('--suppliedHighlightedColor',
      //       utils.brighter(document.getElementById('suppliedColor').value, ev.matches ? 50 : -50));
      //   });
    }
  } // addMeiFriendOptionsToSettingsPanel()

  // add responsibility statement to resp select dropdown
  setRespSelectOptions() {
    let rs = document.getElementById('respSelect');
    if (rs) {
      while (rs.length > 0) rs.options.remove(0);
      let optEls = this.xmlDoc.querySelectorAll('corpName[*|id],persName[*|id]');
      optEls.forEach(el => {
        if (el.closest('respStmt')) { // only if inside a respStmt
          let id = el.getAttribute('xml:id')
          rs.add(new Option(id, id));
        }
      });
    }
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
        cm.setOption(option, value ? {
          bothTags: true
        } : {});
        break;
      default:
        if (value === 'true' || value === 'false') value = (value === 'true');
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
    let label = document.createElement('label');
    let title = o.description;
    if (o.default) title += ' (default: ' + o.default+')';
    label.setAttribute('title', title);
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
      case 'std::string':
        if (opt === 'font') {
          input = document.createElement('select');
          input.setAttribute('name', opt);
          input.setAttribute('id', opt);
          fontList.forEach((str, i) => input.add(new Option(str, str,
            (fontList.indexOf(optDefault) == i) ? true : false)));
        }
        break;
      case 'select':
      case 'std::string-list':
        input = document.createElement('select');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        o.values.forEach((str, i) => {
          let option = new Option(str, str,
            (o.values.indexOf(optDefault) == i) ? true : false);
          if ('valuesDescriptions' in o) option.title = o.valuesDescriptions[i];
          input.add(option)
        });
        break;
      case 'color':
        input = document.createElement('input');
        input.setAttribute('type', 'color');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        input.setAttribute('value', optDefault);
        break;
      case 'header':
        div.classList.remove('optionsItem');
        div.classList.add('optionsSubHeading');
        break;
      case 'line':
        div.removeChild(label);
        div.classList.remove('optionsItem');
        let line = document.createElement('hr');
        line.classList.add(o.title);
        div.appendChild(line);
      default:
        console.log('Creating Verovio Options: Unhandled data type: ' + o.type +
          ', title: ' + o.title + ' [' + o.type + '], default: [' + optDefault + ']');
    }
    if (input) div.appendChild(input);
    return (input || o.type === 'header' || o.type === 'line') ? div : null;
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
        els.sort(function (a, b) {
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
    let that = this;
    let promise = new Promise(function (resolve) {
      let message = {
        'cmd': 'getTimeForElement',
        'msg': id
      };
      that.vrvWorker.addEventListener('message', function handle(ev) {
        if (ev.data.cmd = message.cmd) {
          ev.target.removeEventListener('message', handle);
          resolve(ev.data.cmd);
        }
      });
      that.vrvWorker.postMessage(message);
    }.bind(that));
    promise.then(
      function (time) {
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


  // toggle disabled at one specific checkbox
  disableElementThroughCheckbox(checkbox, affectedElement) {
    let cont = document.getElementById(checkbox).checked;
    let el = document.getElementById(affectedElement);
    el.disabled = cont;
    if (cont) el.parentNode.classList.add('disabled');
    else el.parentNode.classList.remove('disabled');
  }

  // show alert to user in #alertOverlay
  // type: ['error'] 'warning' 'info' 'success'
  // disappearAfter: in milliseconds
  showAlert(message, type = 'error', disappearAfter = 30000) {
    if (this.alertCloser) clearTimeout(this.alertCloser);
    let alert = document.getElementById('alertOverlay');
    alert.classList.remove('warning');
    alert.classList.remove('info');
    alert.classList.remove('success');
    switch (type) {
      case 'warning':
        alert.classList.add('warning');
        break;
      case 'info':
        alert.classList.add('info');
        break;
      case 'success':
        alert.classList.add('success');
        break;
    }
    alert.querySelector('span').innerHTML = message;
    alert.style.display = 'flex';
    this.setFocusToVerovioPane();
    this.alertCloser = setTimeout(() => {
      alert.style.display = "none";
    }, disappearAfter);
  }

  // Update alert message of #alertOverlay
  updateAlert(newMsg) {
    let alert = document.getElementById('alertOverlay');
    alert.querySelector('span').innerHTML += '<br />' + newMsg;
  }

  // Hide all alert windows, such as alert overlay
  hideAlerts() {
    let btns = document.getElementsByClassName('alertCloseButton');
    for (let b of btns) {
      if (this.alertCloser) clearTimeout(this.alertCloser);
      b.parentElement.style.display = 'none';
    }
  }

  // Method to check from MEI whether the XML schema filename has changed
  async checkSchema(mei) {
    console.log('Validation: checking for schema...')
    let vr = document.getElementById('validation-report');
    if (vr) vr.style.visibility = 'hidden';
    const hasSchema = /<\?xml-model.*schematypens=\"http?:\/\/relaxng\.org\/ns\/structure\/1\.0\"/
    const hasSchemaMatch = hasSchema.exec(mei);
    if (!hasSchemaMatch) return;
    const schema = /<\?xml-model.*href="([^"]*).*/;
    const schemaMatch = schema.exec(mei);
    if (schemaMatch && schemaMatch[1] !== this.currentSchema) {
      this.currentSchema = schemaMatch[1];
      console.log('Validation: ...new schema ' + this.currentSchema);
      await this.replaceSchema(this.currentSchema);
    } else {
      console.log('Validation: same schema.');
    }
  }

  // Loads and replaces XML schema; throws errors if not found/CORS error, 
  // update validation-status icon
  async replaceSchema(schemaFile) {
    if (!this.validatorInitialized) return;
    let vs = document.getElementById('validation-status');
    vs.innerHTML = download;
    vs.setAttribute('title', 'Loading schema ' + schemaFile);
    this.changeStatus(vs, 'wait', ['error', 'ok', 'manual']);

    console.log('Replace schema: ' + schemaFile);
    let data; // content of schema file
    try {
      const response = await fetch(schemaFile);
      if (!response.ok) { // schema not found
        this.throwSchemaError({
          "response": response,
          "schemaFile": schemaFile
        });
        return;
      }
      data = await response.text();
      const res = await validator.setRelaxNGSchema(data);
    } catch (err) {
      this.throwSchemaError({
        "err": err
      });
      return
    }
    vs.setAttribute('title', 'Schema loaded ' + schemaFile);
    vs.innerHTML = unverified;
    this.validatorWithSchema = true;
    if (document.getElementById('autoValidate').checked)
      validate(cm.getValue(), this.updateLinting, true)
    else
      this.setValidationStatusToManual();
    console.log("New schema loaded to validator", schemaFile);
    rngLoader.setRelaxNGSchema(data);
    cm.options.hintOptions.schemaInfo = rngLoader.tags
    console.log("New schema loaded to hinting system", schemaFile);
  }

  // Throw an schema error and update validation-status icon
  throwSchemaError(msgObj) {
    this.validatorWithSchema = false;
    let msg;
    if (msgObj.hasOwnProperty('response'))
      msg = 'Schema not found (' + msgObj.response.status + ' ' +
      msgObj.response.statusText + ': ' + msgObj.schemaFile + ')';
    if (msgObj.hasOwnProperty('err'))
      msg = msgObj.err;
    let vs = document.getElementById('validation-status');
    vs.innerHTML = unverified;
    vs.setAttribute('title', msg);
    console.warn(msg);
    this.changeStatus(vs, 'error', ['wait', 'ok', 'manual']);
    return;
  }


  // helper function that adds addedClass (string) 
  // after removing removedClasses (array of strings)
  // from el (DOM element) 
  changeStatus(el, addedClass = '', removedClasses = []) {
    removedClasses.forEach(c => el.classList.remove(c));
    el.classList.add(addedClass);
  }

  // Switch validation-status icon to manual mode and add click event handlers
  setValidationStatusToManual() {
    let vs = document.getElementById('validation-status');
    vs.innerHTML = unverified;
    vs.style.cursor = 'pointer';
    vs.setAttribute('title', 'Not validated. Press here to validate.');
    vs.removeEventListener('click', this.manualValidate);
    vs.removeEventListener('click', this.toggleValidationReportVisibility);
    vs.addEventListener('click', this.manualValidate);
    this.changeStatus(vs, 'manual', ['wait', 'ok', 'error']);
    let reportDiv = document.getElementById('validation-report');
    if (reportDiv) reportDiv.style.visibility = 'hidden';
    if (this.updateLinting) this.updateLinting(cm, []); // clear errors in CodeMirror
  }

  // Callback for manual validation 
  manualValidate() {
    validate(cm.getValue(), undefined, {
      "forceValidate": true
    })
  }

  // Highlight validation results in CodeMirror editor linting system
  highlightValidation(text, validation) {
    let lines;
    let found = [];
    let i = 0;
    let messages;

    try {
      lines = text.split("\n");
      messages = JSON.parse(validation);
    } catch (err) {
      console.log("Could not parse json:", err);
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
        severity: "error",
        message: messages[i].message
      });
      i += 1;
    }
    this.updateLinting(cm, found);

    // update overall status of validation 
    let vs = document.getElementById('validation-status');
    vs.querySelector('svg').classList.remove('clockwise');
    let reportDiv = document.getElementById('validation-report');
    if (reportDiv) reportDiv.innerHTML = '';

    let msg = '';
    if (found.length == 0 && this.validatorWithSchema) {
      this.changeStatus(vs, 'ok', ['error', 'wait', 'manual']);
      vs.innerHTML = verified;
      msg = 'Everything ok, no errors.';
    } else {
      this.changeStatus(vs, 'error', ['wait', 'ok', 'manual']);
      vs.innerHTML = alert;
      vs.innerHTML += '<span>' + Object.keys(messages).length + '</span>';
      msg = 'Validation failed. ' + Object.keys(messages).length + ' validation messages:';
      messages.forEach(m => msg += '\nLine ' + m.line + ': ' + m.message);

      // detailed validation report
      if (!reportDiv) {
        reportDiv = document.createElement('div');
        reportDiv.id = 'validation-report';
        reportDiv.classList.add('validation-report');
        let CM = document.querySelector('.CodeMirror');
        CM.parentElement.insertBefore(reportDiv, CM);
      } else {
        reportDiv.style.visibility = 'visible';
      }
      let closeButton = document.createElement('span');
      closeButton.classList.add('rightButton');
      closeButton.innerHTML = '&times';
      closeButton.addEventListener('click', (ev) => reportDiv.style.visibility = 'hidden');
      reportDiv.appendChild(closeButton);
      let p = document.createElement('div');
      p.classList.add('validation-title');
      p.innerHTML = 'Validation failed. ' + Object.keys(messages).length + ' validation messages:';
      reportDiv.appendChild(p);
      messages.forEach((m, i) => {
        let p = document.createElement('div');
        p.classList.add('validation-item');
        p.id = 'error' + i;
        p.innerHTML = 'Line ' + m.line + ': ' + m.message;
        p.addEventListener('click', (ev) => {
          cm.scrollIntoView({
            from: {
              line: Math.max(0, m.line - 5),
              ch: 0
            },
            to: {
              line: Math.min(cm.lineCount() - 1, m.line + 5),
              ch: 0
            }
          });
        });
        reportDiv.appendChild(p);
      });
    }
    vs.setAttribute('title', 'Validated against ' + this.currentSchema + ': ' + Object.keys(messages).length + ' validation messages.');
    if (reportDiv) {
      vs.removeEventListener('click', this.manualValidate);
      vs.removeEventListener('click', this.toggleValidationReportVisibility);
      vs.addEventListener('click', this.toggleValidationReportVisibility);
    }
  }

  // Show/hide #validation-report panel, or force visibility (by string)
  toggleValidationReportVisibility(forceVisibility = '') {
    let reportDiv = document.getElementById('validation-report');
    if (reportDiv) {
      if (typeof forceVisibility === 'string') {
        reportDiv.style.visibility = forceVisibility;
      } else {
        if (reportDiv.style.visibility === '' || reportDiv.style.visibility === 'visible')
          reportDiv.style.visibility = 'hidden'
        else
          reportDiv.style.visibility = 'visible';
      }
    }
  }

}
