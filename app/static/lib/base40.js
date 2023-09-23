/**
 * Implements base-40 system of pitch representation through integers.
 * See https://wiki.ccarh.org/wiki/Base_40 (accessed 23 Sept 2023)
 *
 * C4 is 162
 * pitch = octave * 40 + chroma
 * octave = value / 40
 * chroma = value - octave * 40
 */

import * as att from './attribute-classes.js';

// number of the diatonic steps in base-40 system
const diatonicSteps = [2, 8, 14, 19, 25, 31, 37]; 

// accid.ges and theirs consequences in semi-tones
const accidGesturalAndAlternation = {
  s: 1,
  f: -1,
  ss: 2,
  ff: -2,
  ts: 3,
  tf: -3,
  n: 0,
};

// accid and their semi-tone consequences
const accidWrittenAndAlternation = {
  s: 1,
  f: -1,
  x: 2,
  ss: 2,
  ff: -2,
  xs: 3,
  sx: 3,
  ts: 3,
  tf: -3,
  n: 0,
  nf: -1,
  ns: 1,
};

/**
 * Returns accid.ges conform string for alteration integer (in semi-tones)
 * @param {string|number} alteration (e.g., -3, -2, -1, 0, 1, 2, 3)
 * @returns {string|null}
 */
export function alterationToAccidGes(alteration = 0) {
  if (alteration <= 3 && alteration >= -3) {
    let i = Object.values(accidGesturalAndAlternation).indexOf(alteration);
    return Object.keys(accidGesturalAndAlternation)[i];
  } else {
    console.log('Provide numbers between -2 and +2.');
    return null;
  }
} // alterationToAccidGes()

/**
 * Returns accid.written conform string for alteration integer (in semi-tones).
 * For 2 it returns 'x', for 3 'xs' among the choices.
 * @param {string|number} alteration (e.g., -3, -2, -1, 0, 1, 2, 3)
 * @returns {string|null}
 */
export function alterationToAccidWritten(alteration = 0) {
  if (alteration <= 3 && alteration >= -3) {
    let i = Object.values(accidWrittenAndAlternation).indexOf(alteration);
    return Object.keys(accidWrittenAndAlternation)[i];
  } else {
    console.log('Provide numbers between -3 and +3.');
    return null;
  }
} // alterationToAccidWritten()

/**
 * Returns alteration integer (-2 for 'ff', 1 for 's') for accid.ges values
 * @param {string} accidGes
 * @returns {number|null}
 */
export function accidGesToAlteration(accidGes = 'n') {
  if (att.dataAccidentalGestural.includes(accidGes)) {
    return accidGesturalAndAlternation[accidGes];
  } else {
    console.log('Please provide valid values for accid.ges.');
    return null;
  }
} // accidGesToAlteration()

/**
 * Returns alteration integer (-2 for 'ff', 3 for 'xs') for accid.written values
 * @param {string} accidGes
 * @returns {number|null}
 */
export function accidWrittenToAlteration(accid = 'n') {
  if (att.dataAccidentalWritten.includes(accid)) {
    return accidWrittenAndAlternation[accid];
  } else {
    console.log('Please provide valid values for accid.written.');
    return null;
  }
} // accidWrittenToAlteration()

/**
 * Converts base-40 integer to object with keys: pname, accidGes, oct
 * @param {number} base40int
 * @returns {Object|null} with keys pname, accid.gestural.basic, and oct
 * When extracting base-40 chroma, just ignore oct=0.
 * Return null for negative input values.
 *
 * Usage: const { oct, pname, accidGes } = base40ToPitch(value)
 */
export function base40ToPitch(base40int = 0) {
  if (base40int < 0) {
    console.log('Cannot convert negative base-40 integer values to pitch.');
    return null;
  }
  const octValue = Math.floor(base40int / 40);
  base40int = base40int % 40;
  // go through diatonic steps and find correct pitch name
  for (const [i, step] of diatonicSteps.entries()) {
    if (base40int < step + 3) {
      return {
        oct: octValue,
        pname: att.pnames[i],
        accidGes: alterationToAccidGes(base40int - step),
      };
    }
  }
} // base40ToPitch()

/**
 * Converts pname and accid.ges into base-40 integer
 * @param {string} pname
 * @param {string} accidGes
 * @param {number} octValue (optional)
 * @returns {number|null}
 */
export function pitchToBase40(pname, accidGes = 'n', octValue = 0) {
  if (!att.pnames.includes(pname)) {
    console.log('Please provide a valid value for pname.');
    return null;
  }
  if (att.dataAccidentalGestural.includes(accidGes) && !isNaN(octValue) && octValue >= 0) {
    return 40 * octValue + diatonicSteps.at(att.pnames.indexOf(pname)) + accidGesToAlteration(accidGes);
  } else {
    console.log('Please provide valid values for accid.ges and oct.');
    return null;
  }
} // pitchToBase40()
