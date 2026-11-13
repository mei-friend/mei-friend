import * as att from './attribute-classes.js';
import * as defaults from './defaults.js';
import * as dutils from './dom-utils.js';
import * as editor from './editor.js';
import { setProgressBar, translator } from './main.js';
import * as speed from './speed.js';
import * as utils from './utils.js';

const DUR_SELECTOR = att.attDurationLogical.join(',');
const METER_SELECTOR = '[meter\\.count],[meter\\.unit],[meter\\.sym],meterSig';
const BUDGET_MS = 16; // work per setTimeout slice before yielding to the GUI, roughly one frame

/**
 * Tracks the meter in force for each staff while the document is walked in
 * document order. feed() every element matching METER_SELECTOR as it is met;
 * get(n) returns the current meter of staff n. Gives the same result as
 * speed.getMeterForElement() without searching the whole document per call.
 */
class MeterTracker {
  constructor() {
    this.scoreDef = null; // last scoreDef carrying meter information
    this.staffMeters = new Map(); // staff n → meter overriding the scoreDef
    this.cache = new Map(); // staff n → getMeter(scoreDef, n)
  }

  /**
   * @param {Element} el scoreDef/staffDef with meter attributes, or a meterSig
   */
  feed(el) {
    if (el.nodeName === 'meterSig') {
      el = el.closest('scoreDef,staffDef,layer');
      if (!el) return;
    }
    if (el.nodeName === 'scoreDef') {
      if (el === this.scoreDef) return; // scoreDef with both meter attributes and a meterSig child
      this.scoreDef = el;
      this.staffMeters.clear();
      this.cache.clear();
    } else if (el.nodeName === 'staffDef' || el.nodeName === 'layer') {
      const m = speed.getMeter(el);
      if (m.count && m.unit) this.staffMeters.set(speed.getStaffNumber(el), m);
    }
  } // feed()

  /**
   * @param {string} n staff number
   * @returns {{count: string | null, unit: string | null}}
   */
  get(n) {
    if (this.staffMeters.has(n)) return this.staffMeters.get(n);
    if (!this.cache.has(n)) this.cache.set(n, speed.getMeter(this.scoreDef, n));
    return this.cache.get(n);
  } // get()
} // class MeterTracker

/**
 * Returns true if element carries meter information for MeterTracker.feed()
 * @param {Element} element
 * @returns {boolean}
 */
function hasMeterInfo(element) {
  return (
    element.nodeName === 'meterSig' ||
    element.hasAttribute('meter.count') ||
    element.hasAttribute('meter.unit') ||
    element.hasAttribute('meter.sym')
  );
} // hasMeterInfo()

/**
 * Elements under root matching selector that are not nested inside another
 * match (e.g. notes inside a chord). Linear replacement for dutils.filterChildren().
 * @param {Element} root
 * @param {string} selector
 * @returns {Element[]}
 */
function topLevelElements(root, selector) {
  const out = [];
  root.querySelectorAll(selector).forEach((e) => {
    const outer = e.parentElement.closest(selector);
    if (!outer || outer === root || !root.contains(outer)) out.push(e);
  });
  return out;
} // topLevelElements()

/**
 * Computes the tstamp (beat position) of every duration element of a measure
 * by walking each layer once. Notes inside a chord get the chord's tstamp.
 * @param {Element} measure
 * @param {MeterTracker} meters
 * @returns {Map<Element, number>} element → tstamp
 */
function computeTstamps(measure, meters) {
  const tstamps = new Map();
  measure.querySelectorAll('layer').forEach((layer) => {
    const unit = parseFloat(meters.get(speed.getStaffNumber(layer)).unit) || 4;
    let tstamp = 1;
    layer.querySelectorAll(DUR_SELECTOR).forEach((e) => {
      const chord = e.parentElement.closest('chord');
      if (e.nodeName === 'note' && chord) {
        tstamps.set(e, tstamps.get(chord)); // chord was visited before its notes
        return;
      }
      tstamps.set(e, tstamp);
      const dur = speed.getDurationOfElement(e, unit);
      if (dur) tstamp += dur;
    });
  });
  return tstamps;
} // computeTstamps()

/**
 * Key identifying the pitch slot of a note within a measure: 'staff/oct/pname'
 * @param {Element} note
 * @returns {string} empty string if staff, oct or pname are missing
 */
function accidKey(note) {
  const staff = speed.getStaffNumber(note);
  const oct = note.getAttribute('oct');
  const pname = note.getAttribute('pname');
  return staff && oct && pname ? staff + '/' + oct + '/' + pname : '';
} // accidKey()

/**
 * Collects all @accid attributes in a measure.
 * @param {Element} measure
 * @param {Map<Element, number>} tstamps from computeTstamps()
 * @returns {Map<string, {tstamp: number, accid: string}[]>}
 * accidKey → list of accidentals, sorted numerically by tstamp
 */
function getAccidsInMeasure(measure, tstamps) {
  const accids = new Map();
  measure.querySelectorAll('[accid]').forEach((el) => {
    const note = el.closest('note');
    const accid = el.getAttribute('accid');
    if (!note || !accid) return;
    const tstamp = tstamps.get(note);
    const key = accidKey(note);
    if (key && tstamp >= 0) {
      if (!accids.has(key)) accids.set(key, []);
      accids.get(key).push({ tstamp, accid });
    }
  });
  accids.forEach((list) => list.sort((a, b) => a.tstamp - b.tstamp));
  return accids;
} // getAccidsInMeasure()

/**
 * Checks accid/accid.ges attributes of all notes against
 * keySig/key.sig information and measure-wise accidentals,
 * finds instances of double accid & accid.ges.
 *
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function checkAccidGes(v, cm) {
  v.allowCursorActivity = false;
  v.initCodeCheckerPanel(translator.lang.accidGesCodeCheckerTitle.text);

  let d = false; // send debug info to console (slow with devtools open)

  v.loadXml(cm.getValue(), true); // force reload DOM

  // define default key signatures per staff
  let noStaves = v.xmlDoc.querySelector('scoreDef').querySelectorAll('staffDef').length;
  let keySignatures = Array(noStaves).fill('0');
  if (d) console.debug('correctAccidGes. ' + noStaves + ' staves defined.');

  // list all ties to handle those separately
  let ties = {};
  v.xmlDoc.querySelectorAll('tie').forEach((t) => {
    let startId = utils.rmHash(t.getAttribute('startid')) || '';
    let endId = utils.rmHash(t.getAttribute('endid')) || '';
    if (endId) {
      if (!startId) {
        console.log('Tie ' + t.getAttribute('xml:id') + ' without startId. ');
      } else {
        ties[endId] = startId;
      }
    }
  });

  let count = 0;
  // key signatures, meter definitions, measures and notes in document order
  const list = v.xmlDoc.querySelectorAll('[key\\.sig],[keysig],keySig,' + METER_SELECTOR + ',measure,note');
  const meters = new MeterTracker();
  const keySigCache = new Map(); // key.sig string → { affectedNotes, keySigAccid }
  const notesById = new Map(); // xml:id → note seen so far, resolves tie starting notes
  const statusBar = document.getElementById('statusBar');
  let tstamps = new Map(); // element → tstamp within the current measure
  let measureAccids = new Map(); // accidentals within the current measure, see getAccidsInMeasure()
  let currentMeasureN = '';
  let lastFixPos = null; // editor position of the last fix, search hint for the next one
  let i = 0;

  setProgressBar(0);
  statusBar.innerHTML = 'Checking accid.ges... 0 of ' + list.length + ' elements checked.';

  /**
   * Writes the (modified) element back to the editor. Fixes are usually
   * applied in document order, so the search starts at the previous fix.
   * @param {Element} element
   */
  function writeToEditor(element) {
    v.allowCursorActivity = false;
    const range = editor.replaceInEditor(cm, element, false, [], false, lastFixPos);
    if (range.start?.line >= 0) lastFixPos = range.start;
    v.allowCursorActivity = true;
  } // writeToEditor()

  /**
   * Iterate through all elements in the list and check for
   * accid.ges and accid attributes. Works in time slices of BUDGET_MS and
   * reschedules itself with setTimeout() for GUI updates.
   */
  function processAccidGes() {
    const t0 = performance.now();
    while (i < list.length) {
      checkElement(list[i++]);
      if (performance.now() - t0 > BUDGET_MS) break;
    }
    if (i < list.length) {
      setProgressBar((100 * i) / list.length);
      statusBar.innerHTML = 'Checking accid.ges... ' + i + ' of ' + list.length + ' elements checked.';
      setTimeout(processAccidGes, 0);
    } else {
      console.debug('Found ' + count + ' accid.ges observations.');

      setProgressBar(0);
      statusBar.innerHTML = 'Accidental conformance: ' + count + ' accid.ges observations found.';

      v.finalizeCodeCheckerPanel(translator.lang.codeCheckerNoAccidMessagesFound.text);
      v.allowCursorActivity = true;
    }
  } // processAccidGes()

  /**
   * Handles one element of the list: key signature and meter changes,
   * measure boundaries, and notes.
   * @param {Element} element
   */
  function checkElement(element) {
    if (hasMeterInfo(element)) meters.feed(element);

    const hasKeySig = element.hasAttribute('key.sig') || element.hasAttribute('keysig');
    if (element.nodeName === 'scoreDef' && hasKeySig) {
      // key.sig inside scoreDef: write @sig to all staves
      const value = element.getAttribute('key.sig') || element.getAttribute('keysig');
      keySignatures.fill(value);
      if (d) console.debug('New key.sig in scoreDef: ' + value);
    } else if (element.nodeName === 'staffDef' && hasKeySig) {
      // key.sig inside staffDef: write @sig to that staff
      const n = parseInt(element.getAttribute('n'));
      const value = element.getAttribute('key.sig') || element.getAttribute('keysig');
      if (n && n > 0 && n <= keySignatures.length) {
        keySignatures[n - 1] = value;
      }
      if (d) console.debug('New key.sig in staffDef(' + element.getAttribute('xml:id') + ', n=' + n + '): ' + value);
    } else if (element.nodeName === 'keySig' && element.hasAttribute('sig')) {
      const value = element.getAttribute('sig');
      // keySig element in a staffDef
      const n = parseInt(element.closest('staffDef')?.getAttribute('n'));
      if (n && n > 0 && n <= keySignatures.length) {
        keySignatures[n - 1] = value;
        if (d)
          console.debug('New keySig("' + element.getAttribute('xml:id') + '")@sig in staffDef(' + n + '): ' + value);
      } else {
        // if no staff number, write to all staves
        keySignatures.fill(value);
        if (d) console.debug('New keySig("' + element.getAttribute('xml:id') + '")@sig in all staves: ' + value);
      }
    } else if (element.nodeName === 'measure') {
      currentMeasureN = element.getAttribute('n') || '';
      tstamps = computeTstamps(element, meters);
      measureAccids = getAccidsInMeasure(element, tstamps);
    } else if (element.nodeName === 'note') {
      checkNote(element);
    }
  } // checkElement()

  /**
   * Checks one note against key signature, measure accidentals and ties.
   * @param {Element} element
   */
  function checkNote(element) {
    let data = {};
    data.xmlId = element.getAttribute('xml:id') || '';
    data.measure = currentMeasureN;
    if (data.xmlId) notesById.set(data.xmlId, element);
    // find staff number for note
    const staffNumber = parseInt(speed.getStaffNumber(element));
    const tstamp = tstamps.get(element) ?? -1;
    const pName = element.getAttribute('pname') || '';
    const oct = element.getAttribute('oct') || '';

    // array of note names affected by keySig@sig or @key.sig and keySigAccid 's', 'n', 'f'
    const keySig = keySignatures[staffNumber - 1];
    if (!keySigCache.has(keySig)) keySigCache.set(keySig, dutils.getAffectedNotesFromKeySig(keySig));
    const { affectedNotes, keySigAccid } = keySigCache.get(keySig);

    const accid = element.getAttribute('accid') || element.querySelector('[accid]')?.getAttribute('accid');
    const accidGesEncoded =
      element.getAttribute('accid.ges') || element.querySelector('[accid\\.ges]')?.getAttribute('accid.ges');
    const accidGesMeaning = accidGesEncoded || 'n';

    // last accidental for this pitch slot in the current measure at or before tstamp
    let mAccid = '';
    const earlier = measureAccids.get(accidKey(element));
    if (earlier) {
      for (const a of earlier) {
        if (a.tstamp <= tstamp) mAccid = a.accid;
        else break;
      }
    }

    // find doubled accid/accid.ges information
    if (accidGesEncoded && accid) {
      data.html =
        ++count +
        ' ' +
        translator.lang.codeCheckerMeasure.text +
        ' ' +
        data.measure +
        ', ' +
        translator.lang.codeCheckerNote.text +
        ' "' +
        data.xmlId +
        '" ' +
        translator.lang.codeCheckerHasBoth.text +
        ' accid="' +
        accid +
        '" ' +
        translator.lang.codeCheckerAnd.text +
        ' accid.ges="' +
        accidGesEncoded +
        '"';
      if (accidGesEncoded !== accid) {
        data.html += ' ' + translator.lang.codeCheckerWithContradictingContent.text;
      }
      data.html += '. ' + translator.lang.codeCheckerRemove.text + ' accid.ges';
      // remove @accid.ges in all cases
      data.correct = () => {
        element.removeAttribute('accid.ges');
        writeToEditor(element);
      };
      v.addCodeCheckerEntry(data);
    }

    if (data.xmlId && data.xmlId in ties) {
      // Check whether note tied by starting note
      const startId = ties[data.xmlId];
      let startingNote = notesById.get(startId) || v.xmlDoc.querySelector('[*|id="' + startId + '"]');
      if (startingNote) {
        if (pName !== startingNote.getAttribute('pname')) {
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerTiedNote.text +
            ' "' +
            data.xmlId +
            '": ' +
            pName +
            ' ' +
            translator.lang.codeCheckerNotSamePitchAs.text +
            ' ' +
            startId +
            ': ' +
            startingNote.getAttribute('pname');
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        }
        if (oct !== startingNote.getAttribute('oct')) {
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerTiedNote.text +
            ' "' +
            data.xmlId +
            '": ' +
            pName +
            ' ' +
            translator.lang.codeCheckerNotSameOctaveAs.text +
            ' ' +
            startId;
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        }
        let startingAccidMeaning =
          startingNote.getAttribute('accid') ||
          startingNote.querySelector('[accid]')?.getAttribute('accid') ||
          startingNote.getAttribute('accid.ges') ||
          startingNote.querySelector('[accid\\.ges]')?.getAttribute('accid.ges') ||
          'n';
        if ((accid || accidGesMeaning) !== startingAccidMeaning) {
          data.html =
            ++count +
            ' ' +
            translator.lang.codeCheckerMeasure.text +
            ' ' +
            data.measure +
            ', ' +
            translator.lang.codeCheckerTiedNote.text +
            ' "' +
            data.xmlId +
            '": ';
          if (startingAccidMeaning !== 'n') {
            data.html +=
              (accid ? 'accid="' + accid + '"' : accidGesEncoded ? 'accid.ges="' + accidGesEncoded + '"' : '') +
              (' ' + translator.lang.codeCheckerNotSameAsStartingNote.text + ' ' + startId + ': ') +
              ('"' + startingAccidMeaning + '".') +
              (' ' + translator.lang.codeCheckerFixTo.text + ' accid.ges="' + startingAccidMeaning + '". ');
            data.correct = () => {
              element.setAttribute('accid.ges', startingAccidMeaning);
              writeToEditor(element);
            };
          } else {
            data.html +=
              translator.lang.codeCheckerExtra.text +
              ' ' +
              (accid ? 'accid="' + accid + '"' : accidGesEncoded ? 'accid.ges="' + accidGesEncoded + '"' : '') +
              (' ' + translator.lang.codeCheckerNotSameAsStartingNote.text + ' ' + startId + ': ') +
              ('"' + startingAccidMeaning + '". ') +
              (translator.lang.codeCheckerRemove.text + ' accid.ges. ');
            data.correct = () => {
              element.removeAttribute('accid.ges');
              writeToEditor(element);
            };
          }
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        }
      } else {
        console.log('No starting note found for tie ' + startId);
      }
    } else if (!accid && mAccid && mAccid !== accidGesMeaning) {
      // check all accids having appeared in the current measure
      data.html =
        ++count +
        ' ' +
        translator.lang.codeCheckerMeasure.text +
        ' ' +
        data.measure +
        ', ' +
        translator.lang.codeCheckerNote.text +
        ' "' +
        data.xmlId +
        '" ' +
        translator.lang.codeCheckerLacksAn.text +
        ' accid.ges="' +
        mAccid +
        '", ' +
        translator.lang.codeCheckerBecauseAlreadyDefined.text +
        '.';
      data.correct = () => {
        element.setAttribute('accid.ges', mAccid);
        writeToEditor(element);
      };
      v.addCodeCheckerEntry(data);
      if (d) console.debug(data.html);
    } else if (
      !accid &&
      affectedNotes.includes(pName) &&
      mAccid !== accidGesMeaning &&
      keySigAccid !== accidGesMeaning
    ) {
      // a note, affected by key signature, either has @accid inside or as a child or has @accid.ges inside or as a child
      data.html =
        ++count +
        ' ' +
        translator.lang.codeCheckerMeasure.text +
        ' ' +
        data.measure +
        ', ' +
        translator.lang.codeCheckerNote.text +
        ' "' +
        data.xmlId +
        '" ' +
        translator.lang.codeCheckerLacksAn.text +
        ' accid.ges="' +
        keySigAccid +
        '". ' +
        translator.lang.codeCheckerAdd.text +
        ' accid.ges="' +
        keySigAccid +
        '"';
      data.correct = () => {
        element.setAttribute('accid.ges', keySigAccid);
        writeToEditor(element);
      };
      v.addCodeCheckerEntry(data);
      if (d) console.debug(data.html);
    } else if (
      !accid &&
      !affectedNotes.includes(pName) &&
      mAccid !== accidGesMeaning &&
      (accidGesMeaning !== 'n' || accidGesEncoded === 'n')
    ) {
      // Check if there is an accid.ges that has not been defined in keySig or earlier in the measure
      data.html =
        ++count +
        ' ' +
        translator.lang.codeCheckerMeasure.text +
        ' ' +
        data.measure +
        ', ' +
        translator.lang.codeCheckerNote.text +
        ' "' +
        data.xmlId +
        '" ' +
        translator.lang.codeCheckerHasExtra.text +
        ' accid.ges="' +
        accidGesEncoded +
        '" ' +
        translator.lang.codeCheckerRemove.text +
        ' accid.ges="' +
        accidGesEncoded +
        '".';
      data.correct = () => {
        let accidChild = element.querySelector('accid[accid\\.ges]');
        if (accidChild) {
          element.removeChild(accidChild);
        } else {
          element.removeAttribute('accid.ges');
        }
        writeToEditor(element);
      };
      v.addCodeCheckerEntry(data);
      if (d) console.debug(data.html);
    }
  } // checkNote()

  processAccidGes();
} // checkAccidGes()

/**
 * checkMeterConformance goes through all measure elements in xmlDoc and checks
 * whether the duration of the elements of each layer in the measure conforms to
 * the time signature of the measure.
 * It counts these elements for duration chord, note, space, rest; and treats
 * fTrem elements as having half the duration of the note.
 *
 * TODO: choice, subst not counted twice
 * TODO: treat meterSigGrp additive
 * TODO: treat meterSigGrp func = 'mixed', 'alternating'
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function checkMeterConformance(v, cm) {
  // checkMeterSignature(v); // test for meter signatures in xmlDoc

  const DURATION_SELECTOR = 'chord,note,space,rest,fTrem,tabGrp';
  const IGNORE_SELECTOR = 'mRest,multiRest,mSpace';

  v.allowCursorActivity = false;
  v.initCodeCheckerPanel(translator.lang.metConCodeCheckerTitle.text);

  // meter definitions and measures in document order
  const list = v.xmlDoc.querySelectorAll(METER_SELECTOR + ',measure');
  const meters = new MeterTracker();
  const statusBar = document.getElementById('statusBar');
  let lastFixPos = null; // editor position of the last fix, search hint for the next one
  setProgressBar(0);
  statusBar.innerHTML = 'Checking meter conformance... 0 of ' + list.length + ' elements checked.';
  let n = 0;
  let measuresChecked = 0;

  /**
   * Iterate through all meter definitions and measures and check for
   * duration of elements in the measure. Works in time slices of BUDGET_MS and
   * reschedules itself with setTimeout() for GUI updates.
   */
  function processMeasures() {
    const t0 = performance.now();
    while (n < list.length) {
      const el = list[n++];
      if (el.nodeName !== 'measure') {
        meters.feed(el);
      } else if (el.getAttribute('metcon') !== 'false') {
        checkMeasure(el);
        measuresChecked++;
      }
      if (performance.now() - t0 > BUDGET_MS) break;
    }
    if (n < list.length) {
      setProgressBar((100 * n) / list.length);
      statusBar.innerHTML = 'Checking meter conformance... ' + n + ' of ' + list.length + ' elements checked.';
      setTimeout(processMeasures, 0);
    } else {
      setProgressBar(0);
      statusBar.innerHTML = 'Meter conformance: ' + measuresChecked + ' measures checked.';
      v.finalizeCodeCheckerPanel(translator.lang.codeCheckerMeterConformanceMessage.text);
      v.allowCursorActivity = true;
    }
  } // processMeasures()

  /**
   * Checks the duration of all staves of one measure against the current meter.
   * @param {Element} measure
   */
  function checkMeasure(measure) {
    measure.querySelectorAll('staff').forEach((staff) => {
      const meter = meters.get(speed.getStaffNumber(staff));
      const meterUnit = utils.parseMeterNumber(meter.unit);
      const meterCount = utils.parseMeterNumber(meter.count);
      let duration = 0;
      // iterate through all layers in the staff
      staff.querySelectorAll('layer').forEach((layer) => {
        let layerDuration = 0;
        for (const element of topLevelElements(layer, DURATION_SELECTOR)) {
          if (element.nodeName === 'fTrem') {
            // fTrem elements are counted as half the duration of the note/chord duration
            let ftremDuration = 0;
            for (const e of topLevelElements(element, DURATION_SELECTOR)) {
              ftremDuration += speed.getDurationOfElement(e, meterUnit);
            }
            layerDuration += ftremDuration / 2;
          } else {
            layerDuration += speed.getDurationOfElement(element, meterUnit);
          }
        }
        if (layerDuration > duration) {
          duration = layerDuration;
        }
      });
      const ignore = staff.querySelector(IGNORE_SELECTOR) !== null;
      if (ignore || utils.compareNumbersWithTolerance(duration, meterCount, defaults.beatTolerance)) {
        return; // conformant
      }
      // display non conformance message as entry in code checker panel
      let data = {};
      data.xmlId = staff.getAttribute('xml:id') || ''; // click to jump to element
      data.html =
        translator.lang.codeCheckerMeasure.text +
        ' ' +
        (measure.getAttribute('n') || '') +
        ' ' +
        translator.lang.codeCheckerStaff.text +
        ' ' +
        (staff.getAttribute('n') || '') +
        ' ' +
        translator.lang.codeCheckerHasADurationOf.text +
        ' ' +
        duration +
        ' ' +
        translator.lang.codeCheckerInsteadOf.text +
        ' ' +
        meterCount +
        '. ';
      data.correct = () => {
        v.allowCursorActivity = false;
        // Only the attribute is written into the measure's start tag, leaving the
        // measure content untouched (no reserialization, no forced DOM reload). One
        // measure gets an entry per non-conforming staff; it is written only once.
        if (measure.getAttribute('metcon') !== 'false') {
          const range = editor.setAttributeInEditor(cm, measure, 'metcon', 'false', lastFixPos);
          if (range.start?.line >= 0) lastFixPos = range.start;
        }
        // jump to the measure for a single fix; "Fix all" blocks changes and scrolls nowhere
        if (!cm.blockChanges) utils.setCursorToId(cm, measure.getAttribute('xml:id'));
        v.allowCursorActivity = true;
      };
      v.addCodeCheckerEntry(data);
      console.debug(data.html);
    });
  } // checkMeasure()

  processMeasures();
} // checkMeterConformance()

/**
 * Checks all linking attributes (startid, endid, plist, copyof, corresp, etc.)
 * for references to non-existent xml:id targets within the MEI document.
 * External links (values containing ':') are skipped.
 *
 * @param {Viewer} v
 * @param {CodeMirror} cm
 */
export function checkLinkedElements(v, cm) {
  v.allowCursorActivity = false;
  v.initCodeCheckerPanel(translator.lang.linkedElementsCodeCheckerTitle.text);
  // No automatic fix exists for broken links — remove the Fix all / Ignore all buttons
  document.querySelectorAll('#codeCheckerTitle .btn').forEach((btn) => btn.remove());

  try {
    v.loadXml(cm.getValue(), true);

    // Walk all elements once: collect xml:ids AND filter to those with linking attrs
    const allIds = new Set();
    const elements = [];
    const allElements = v.xmlDoc.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const id = el.getAttribute('xml:id');
      if (id) allIds.add(id);
      if (att.attLinking.some((a) => el.hasAttribute(a))) elements.push(el);
    }
    console.log('checkLinkedElements: allIds=' + allIds.size + ', elements with linking attrs=' + elements.length);

    setProgressBar(0);
    let n = 0;
    const increment = elements.length / 100;
    let step = increment;

    function processNext() {
      try {
        if (n < elements.length) {
          const el = elements[n];

          if (n > step) {
            setProgressBar((100 * n) / elements.length);
            step += increment;
          }

          const elName = el.nodeName;
          const elId = el.getAttribute('xml:id') || '';

          for (const attrName of att.attLinking) {
            const attrVal = el.getAttribute(attrName);
            if (attrVal === null) continue; // attribute not present on this element

            if (attrVal.trim() === '') {
              const data = {};
              data.xmlId = elId;
              data.html =
                `<b>${elName}</b>` +
                (elId ? ` <code>#${elId}</code>` : '') +
                `: @${attrName} ` +
                translator.lang.codeCheckerLinkingAttrEmpty.text;
              v.addCodeCheckerEntry(data);
              continue;
            }

            // Check for multiple consecutive blanks (or leading/trailing whitespace) in plist
            if (attrName === 'plist') {
              const normalized = attrVal.trim().replace(/\s+/g, ' ');
              if (attrVal !== normalized) {
                const data = {};
                data.xmlId = elId;
                data.html =
                  `<b>${elName}</b>` +
                  (elId ? ` <code>#${elId}</code>` : '') +
                  `: @plist ` +
                  translator.lang.codeCheckerPlistMultipleBlanks.text;
                data.correct = () => {
                  v.allowCursorActivity = false;
                  el.setAttribute('plist', normalized);
                  editor.replaceInEditor(cm, el, false);
                  v.allowCursorActivity = true;
                };
                v.addCodeCheckerEntry(data);
              }
            }

            for (const ref of attrVal.trim().split(/\s+/)) {
              // skip empty values and external links (URIs containing ':')
              if (!ref || ref.includes(':')) continue;
              const targetId = utils.rmHash(ref);
              if (!targetId) {
                const data = {};
                data.xmlId = elId;
                data.html =
                  `<b>${elName}</b>` +
                  (elId ? ` <code>#${elId}</code>` : '') +
                  `: @${attrName}=<code>"${ref}"</code> ` +
                  translator.lang.codeCheckerLinkingAttrEmpty.text;
                v.addCodeCheckerEntry(data);
                continue;
              }

              if (!allIds.has(targetId)) {
                const data = {};
                data.xmlId = elId;
                data.html =
                  `<b>${elName}</b>` +
                  (elId ? ` <code>#${elId}</code>` : '') +
                  `: @${attrName}=<code>"${ref}"</code> ` +
                  translator.lang.codeCheckerLinkedElementNotFound.text;
                v.addCodeCheckerEntry(data);
              }
            }
          }

          n++;
          setTimeout(processNext, 0);
        } else {
          setProgressBar(0);
          v.finalizeCodeCheckerPanel(translator.lang.codeCheckerNoLinkedElementsIssues.text);
          v.allowCursorActivity = true;
        }
      } catch (err) {
        console.error('checkLinkedElements processNext error at n=' + n + ':', err);
        v.allowCursorActivity = true;
      }
    }
    processNext();
  } catch (err) {
    console.error('checkLinkedElements setup error:', err);
    v.allowCursorActivity = true;
  }
} // checkLinkedElements()

/**
 * Debug function:
 * Test all note, chord etc elements in the xmlDoc
 * for a meter signature and report it.
 */
function checkMeterSignature(v) {
  let elements = v.xmlDoc.querySelectorAll('note,rest,chord,space');
  elements.forEach((element) => {
    let meter = speed.getMeterForElement(v.xmlDoc, element);
    if (meter && meter.count && meter.unit) {
      console.log(element.nodeName + ' (' + element.getAttribute('xml:id') + '): ' + meter.count + '/' + meter.unit);
    } else {
      console.log('No scoreDef found for ' + element.nodeName + ' (' + element.getAttribute('xml:id') + ')');
    }
  });
} // checkMeterSignature()
