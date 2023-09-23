/*
 * Lists of elements contained by attribute classes, MEI 4.0.1
 */

// elements with @curveDir
export const attCurvature = ['bend', 'curve', 'lv', 'phrase', 'slur', 'tie'];

// see att.placement @place in MEI 4.0.1 definition: 'measure' taken out
export const attPlacement = [
  'accid',
  'artic',
  'attacca',
  'breath',
  'caesura',
  'cpMark',
  'dir',
  'dynam',
  'dynam',
  'f',
  'fermata',
  'fing',
  'fingGrp',
  'hairpin',
  'harm',
  'harpPedal',
  'lg',
  'line',
  'metaMark',
  'mNum',
  'mordent',
  'ornam',
  'pedal',
  'refrain',
  'reh',
  'sp',
  'stageDir',
  'syl',
  'tempo',
  'trill',
  'turn',
  'verse',
];

// elements with @vgrp (pedal not yet in vertical group, but supported by Verovio)
// attacca, tempo not supported
export const attVerticalGroup = ['attacca', 'dir', 'dynam', 'hairpin', 'tempo', 'pedal'];

// elements with @place
export const dataPlacement = ['above', 'within', 'between', 'below'];

// elements with @stem.dir
export const attStems = ['note', 'chord', 'ambNote'];

// control elements (not sure whether all listed...)
export const modelControlEvents = [
  'anchoredText',
  'arpeg',
  'bracket',
  'bracketspan',
  'breath',
  'dir',
  'dynam',
  'fermata',
  'fing',
  'gliss',
  'hairpin',
  'harm',
  'mordent',
  'mnum',
  'octave',
  'pedal',
  'phrase',
  'reh',
  'slur',
  'tempo',
  'tie',
  'trill',
  'turn',
];

// array o diatonic pitch names
export const pnames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

export const sharpSign = '♯';
export const flatSign = '♭';

// pitch names for sharps and flats, defined in keySig@sig or @key.sig
export const sharps = ['f', 'c', 'g', 'd', 'a', 'e', 'b', 'f♯', 'c♯', 'g♯', 'd♯', 'a♯'];
export const flats = ['b', 'e', 'a', 'd', 'g', 'c', 'f', 'b♭', 'e♭', 'a♭', 'd♭', 'g♭'];

// according to Verovio 3.9's implementation of timeSpanningInterface()
// better: att.startEndId and att.timestamp2.logical
export const timeSpanningElements = [
  'bracketspan',
  'dir',
  'dynam',
  'gliss',
  'hairpin',
  'harm',
  'lv',
  'octave',
  'pedal',
  'pitchinflection',
  'slur',
  'tie',
  'trill',
  'syl',
];

// @dur
export const attDurationLogical = ['ambNote', 'bTrem', 'chord', 'fTrem', 'halfmRpt', 'note', 'rest', 'space'];

// elements allowed to contain a @facs attribute (5.0.0)
export const attFacsimile = [
  'abbr',
  'accid',
  'add',
  'anchoredText',
  'annot',
  'arpeg',
  'artic',
  'barLine',
  'beam',
  'beamSpan',
  'beatRpt',
  'bracketSpan',
  'breath',
  'caesura',
  'chord',
  'clef',
  'custos',
  'damage',
  'del',
  'dir',
  'dot',
  'dynam',
  'ending',
  'expan',
  'f',
  'fTrem',
  'fb',
  'fermata',
  'fig',
  'fing',
  'gliss',
  'graceGrp',
  'graphic',
  'grpSym',
  'hairpin',
  'halfmRpt',
  'harm',
  'keyAccid',
  'keySig',
  'label',
  'labelAbbr',
  'layer',
  'lb',
  'ligature',
  'lv',
  'mNum',
  'mRest',
  'mRpt',
  'mRpt2',
  'mSpace',
  'mdiv',
  'measure',
  'mensur',
  'meterSig',
  'meterSigGrp',
  'mordent',
  'multiRest',
  'multiRpt',
  'nc',
  'neume',
  'note',
  'num',
  'octave',
  'orig',
  'pb',
  'pedal',
  'pgFoot',
  'pgHead',
  'phrase',
  'plica',
  'proport',
  'reh',
  'rest',
  'restore',
  'sb',
  'section',
  'sic',
  'slur',
  'space',
  'staff',
  'staffGrp',
  'stem',
  'supplied',
  'syl',
  'syllable',
  'symbol',
  'tempo',
  'tie',
  'trill',
  'tuplet',
  'turn',
  'unclear',
  'verse',
];

// attributes using data.URI (according to 4.0.1), most popular moved to front
export const dataURI = [
  'startid',
  'endid',
  'plist',
  'target',
  'source',
  'sameas',
  'next',
  'prev',
  'glyph.uri',
  'facs',
  'state',
  'chordref',
  'outer.recto',
  'inner.verso',
  'recto',
  'verso',
  'instr',
  'when',
  'auth.uri',
  'xml:base',
  'class',
  'data',
  'decls',
  'hand',
  'join',
  'def',
  'copyof',
  'corresp',
  'follows',
  'precedes',
  'synch',
  'nymref',
  'head.altsym',
  'origin.startid',
  'origin.endid',
  'xlink:role',
  'resp',
  'def',
  'altsym',
];

// data.DURATION.cmn
export const dataDurationCMN = [
  'long',
  'breve',
  '1',
  '2',
  '4',
  '8',
  '16',
  '32',
  '64',
  '128',
  '256',
  '512',
  '1024',
  // '2048', not supported by Verovio
];

// data.DURATION.mensural
export const dataDurationMensural = [
  'maxima',
  'longa',
  'brevis',
  'semibrevis',
  'minima',
  'semiminima',
  'fusa',
  'semifusa',
];

// See https://wiki.ccarh.org/wiki/Base_40 (accessed 23 Sept 2023)
// C4 is 162
// pitch = octave * 40 + chroma
// octave = value / 40
// chroma = value - octave * 40

// base-40 constants
export const diatonicSteps = [2, 8, 14, 19, 25, 31, 37]; // numbers of diatonic steps in base-40 system
export const alterationToAccidGes = {
  '-3': 'tf',
  '-2': 'ff',
  '-1': 'f',
  0: 'n',
  1: 's',
  2: 'ss',
  3: 'ts',
};

/**
 * Returns alteration integer (-2 for 'ff', 1 for 's') for accid.ges values
 * @param {string} accidGes
 * @returns {number|null}
 */
export function accidGesToAlteration(accidGes = '0') {
  if (Object.values(alterationToAccidGes).includes(accidGes)) {
    let i = Object.values(alterationToAccidGes).indexOf(accidGes);
    return parseInt(Object.keys(alterationToAccidGes)[i]);
  } else {
    console.log('Please provide valid values for accid.ges.');
    return null;
  }
} // accidGesToAlteration()

/**
 * Converts base-40 integer to object with keys: pname, accidGes, oct
 * @param {number} base40int
 * @returns {Object|null} with keys pname, accid.gestural.basic, and oct
 * When extracting base-40 chroma, just ignore oct=0.
 * Return null for negative input values.
 */
export function base40ToPitch(base40int = 0) {
  if (base40int < 0) {
    console.log('Cannot convert negative base-40 integer values to pitch.');
    return null;
  }
  const oct = Math.floor(base40int / 40);
  base40int = base40int % 40;
  // go through diatonic steps and find correct pitch name
  for (const [i, step] of diatonicSteps.entries()) {
    if (base40int < step + 3) {
      return {
        oct: oct,
        pname: pnames[i],
        accidGes: alterationToAccidGes[String(base40int - step)],
      };
    }
  }
} // base40ToPitch()

/**
 * Converts pname and accid.ges into base-40 integer
 * @param {string} pname
 * @param {string} accidGes
 * @param {number} oct (optional)
 * @returns {number|null}
 */
export function pitchToBase40(pname, accidGes = 'n', oct = 0) {
  if (!pnames.includes(pname)) {
    console.log('Please provide a valid value for pname.');
    return null;
  }
  if (Object.values(alterationToAccidGes).includes(accidGes) && !isNaN(oct) && oct >= 0) {
    return 40 * oct + diatonicSteps.at(pnames.indexOf(pname)) + accidGesToAlteration(accidGes);
  } else {
    console.log('Please provide valid values for accid.ges and oct.');
    return null;
  }
} // pitchToBase40()
