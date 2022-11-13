/*
 * Lists of elements contained by attribute classes, MEI 4.0.1
 */

// elements with @curveDir
export const attCurvature = ['bend', 'curve', 'lv', 'phrase', 'slur', 'tie'];

// see att.placement @place in MEI 4.0.1 definition: 'measure' taken out
export const attPlacement = [
  'accid', 'artic', 'attacca', 'breath', 'caesura', 'cpMark', 'dir', 'dynam',
  'dynam', 'f', 'fermata', 'fing', 'fingGrp', 'hairpin', 'harm', 'harpPedal',
  'lg', 'line', 'metaMark', 'mNum', 'mordent', 'ornam', 'pedal',
  'refrain', 'reh', 'sp', 'stageDir', 'syl', 'tempo', 'trill', 'turn', 'verse'
];

// elements with @vgrp (pedal not yet in vertical group, but supported by Verovio)
// attacca, tempo not supported
export const attVerticalGroup = [
  'attacca', 'dir', 'dynam', 'hairpin', 'tempo', 'pedal'
];

// elements with @place
export const dataPlacement = ['above', 'within', 'between', 'below'];

// elements with @stem.dir
export const attStems = ['note', 'chord', 'ambNote'];

// control elements (not sure whether all listed...)
export const modelControlEvents = ['anchoredText', 'arpeg', 'bracket',
  'bracketspan', 'breath', 'dir', 'dynam', 'fermata', 'fing', 'gliss',
  'hairpin', 'harm', 'mordent', 'mnum', 'octave', 'pedal', 'phrase', 'reh',
  'slur', 'tempo', 'tie', 'trill', 'turn'
];

// array of pitch names
export const pnames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

// according to Verovio 3.9's implementation of timeSpanningInterface()
// better: att.startEndId and att.timestamp2.logical
export const timeSpanningElements = [
  'bracketspan', 'dir', 'dynam', 'gliss', 'hairpin', 'harm', 'lv', 'octave',
  'pedal', 'pitchinflection', 'slur', 'tie', 'trill', 'syl'
];