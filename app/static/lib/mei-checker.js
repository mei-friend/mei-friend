import * as dutils from './dom-utils.js';
import * as editor from './editor.js';
import { translator } from './main.js';
import * as speed from './speed.js';
import * as utils from './utils.js';

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
  v.initCodeCheckerPanel(translator.lang.codeCheckerTitle.text);

  let d = true; // send debug info to console
  setTimeout(() => {
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
        if (!startId) console.log('Tie ' + t.getAttribute('xml:id') + ' without startId. ');
        else ties[endId] = startId;
      }
    });

    let count = 0;
    let measureAccids = {}; // accidentals within a measure[staff][oct][pname]
    let list = v.xmlDoc.querySelectorAll('[key\\.sig],keySig,measure,note');
    list.forEach((element) => {
      if (element.nodeName === 'scoreDef' && element.hasAttribute('key.sig')) {
        // key.sig inside scoreDef: write @sig to all staves
        const value = element.getAttribute('key.sig');
        for (let k in keySignatures) keySignatures[k] = value;
        if (d) console.debug('New key.sig in scoreDef: ' + value);
      } else if (element.nodeName === 'staffDef' && element.hasAttribute('key.sig')) {
        // key.sig inside staffDef: write @sig to that staff
        const n = parseInt(element.getAttribute('n'));
        const value = element.getAttribute('key.sig');
        if (n && n > 0 && n <= keySignatures.length) keySignatures[n - 1] = value;
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
          for (let k in keySignatures) keySignatures[k] = value;
          if (d) console.debug('New keySig("' + element.getAttribute('xml:id') + '")@sig in all staves: ' + value);
        }
      } else if (element.nodeName === 'measure') {
        // clear measureAccids object
        measureAccids = getAccidsInMeasure(element);
      } else if (element.nodeName === 'note') {
        // found a note to check!
        let data = {};
        data.xmlId = element.getAttribute('xml:id') || '';
        data.measure = element.closest('measure')?.getAttribute('n') || '';
        // find staff number for note
        const staffNumber = parseInt(element.closest('staff')?.getAttribute('n'));
        const tstamp = speed.getTstampForElement(v.xmlDoc, element);
        const pName = element.getAttribute('pname') || '';
        const oct = element.getAttribute('oct') || '';

        // array of note names affected by keySig@sig or @key.sig and keySigAccid 's', 'n', 'f'
        const { affectedNotes, keySigAccid } = dutils.getAffectedNotesFromKeySig(keySignatures[staffNumber - 1]);

        let accid = element.getAttribute('accid') || element.querySelector('[accid]')?.getAttribute('accid');
        let accidGesEncoded =
          element.getAttribute('accid.ges') || element.querySelector('[accid\\.ges]')?.getAttribute('accid.ges');
        let accidGesMeaning =
          element.getAttribute('accid.ges') || element.querySelector('[accid\\.ges]')?.getAttribute('accid.ges') || 'n';
        let mAccid = ''; // measure accid for current note
        if (
          staffNumber in measureAccids &&
          oct in measureAccids[staffNumber] &&
          pName in measureAccids[staffNumber][oct]
        ) {
          // get accids for all tstamps, sort them, and remember last before current
          let mTstamps = measureAccids[staffNumber][oct][pName];
          Object.keys(mTstamps)
            .map((v) => parseFloat(v))
            .sort()
            .forEach((t) => {
              if (t <= tstamp) mAccid = mTstamps[t];
            });
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
            v.allowCursorActivity = false;
            element.removeAttribute('accid.ges');
            editor.replaceInEditor(cm, element, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
        }

        if (data.xmlId && data.xmlId in ties) {
          // Check whether note tied by starting note
          let startingNote = v.xmlDoc.querySelector('[*|id="' + ties[data.xmlId] + '"]');
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
                ties[data.xmlId] +
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
                ties[data.xmlId];
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
                  (' ' + translator.lang.codeCheckerNotSameAsStartingNote.text + ' ' + ties[data.xmlId] + ': ') +
                  ('"' + startingAccidMeaning + '".') +
                  (' ' + translator.lang.codeCheckerFixTo.text + ' accid.ges="' + startingAccidMeaning + '". ');
                data.correct = () => {
                  v.allowCursorActivity = false;
                  element.setAttribute('accid.ges', startingAccidMeaning);
                  editor.replaceInEditor(cm, element, false);
                  v.allowCursorActivity = true;
                };
              } else {
                data.html +=
                  translator.lang.codeCheckerExtra.text +
                  ' ' +
                  (accid ? 'accid="' + accid + '"' : accidGesEncoded ? 'accid.ges="' + accidGesEncoded + '"' : '') +
                  (' ' + translator.lang.codeCheckerNotSameAsStartingNote.text + ' ' + ties[data.xmlId] + ': ') +
                  ('"' + startingAccidMeaning + '". ') +
                  (translator.lang.codeCheckerRemove.text + ' accid.ges. ');
                data.correct = () => {
                  v.allowCursorActivity = false;
                  element.removeAttribute('accid.ges');
                  editor.replaceInEditor(cm, element, false);
                  v.allowCursorActivity = true;
                };
              }
              v.addCodeCheckerEntry(data);
              if (d) console.debug(data.html);
            }
          } else {
            console.log('No starting note found for tie ' + ties[data.xmlId]);
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
            v.allowCursorActivity = false;
            element.setAttribute('accid.ges', mAccid);
            editor.replaceInEditor(cm, element, false);
            v.allowCursorActivity = true;
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
            v.allowCursorActivity = false;
            element.setAttribute('accid.ges', keySigAccid);
            editor.replaceInEditor(cm, element, false);
            v.allowCursorActivity = true;
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
            v.allowCursorActivity = false;
            element.removeAttribute('accid.ges');
            editor.replaceInEditor(cm, element, false);
            v.allowCursorActivity = true;
          };
          v.addCodeCheckerEntry(data);
          if (d) console.debug(data.html);
        }
      }
    });
    v.finalizeCodeCheckerPanel('All accid.ges attributes seem correct.');
  }, 0);

  v.allowCursorActivity = true;

  /**
   * Search for @accid attributes in measure and store them in
   * an object measureAccids[staffNumber][oct][pName][tstamp] = accid
   * @param {Element} measure
   * @returns {Object} measureAccids
   */
  function getAccidsInMeasure(measure) {
    let measureAccids = {};
    // list all @accid attributes in measure
    measure.querySelectorAll('[accid]').forEach((el) => {
      let note = el.closest('note');
      if (note) {
        const staffNumber = parseInt(el.closest('staff')?.getAttribute('n'));
        const oct = note.getAttribute('oct') || '';
        const pName = note.getAttribute('pname') || '';
        const accid = el.getAttribute('accid');
        const tstamp = speed.getTstampForElement(v.xmlDoc, note);

        if (staffNumber && oct && pName && accid && tstamp >= 0) {
          if (!Object.hasOwn(measureAccids, staffNumber)) {
            measureAccids[staffNumber] = {};
          }
          if (!Object.hasOwn(measureAccids[staffNumber], oct)) {
            measureAccids[staffNumber][oct] = {};
          }
          if (!Object.hasOwn(measureAccids[staffNumber][oct], pName)) {
            measureAccids[staffNumber][oct][pName] = {};
          }
          measureAccids[staffNumber][oct][pName][tstamp] = accid;
        }
      }
    });
    return measureAccids;
  } // getAccidsInMeasure()
} // checkAccidGes()
