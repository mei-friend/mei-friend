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

// pitch names for sharps and flats, defined in keySig@sig or @key.sig
export const sharps = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
export const flats = ['b', 'e', 'a', 'd', 'g', 'c', 'f'];

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

// model.transcriptionLike
export const modelTranscriptionLike = [
  'add',
  'corr',
  //'damage', (leave out for now, no markup)
  'del',
  //'gap', (leave out for now, no markup)
  //'handShift', (leave out for now)
  'orig',
  'reg',
  // 'restore' (leave out for now)
  'sic',
  'supplied',
  'unclear',
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
