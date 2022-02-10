// lists of elements contained by attribute classes

export const attCurvature = ['bend', 'curve', 'lv', 'phrase', 'slur', 'tie'];

export const attPlacement = [
  'accid', 'artic', 'attacca', 'breath', 'caesura', 'cpMark', 'dir', 'dynam',
  'dynam', 'f', 'fermata', 'fing', 'fingGrp', 'hairpin', 'harm', 'harpPedal',
  'lg', 'line', 'measure', 'metaMark', 'mNum', 'mordent', 'ornam', 'pedal',
  'refrain', 'reh', 'sp', 'stageDir', 'syl', 'tempo', 'trill', 'turn', 'verse'
];

export const dataPlacement = ['above', 'within', 'between', 'below'];

export const attStems = ['note', 'chord', 'ambNote'];

// not sure whether all listed...
export const modelControlEvents = ['anchoredText', 'arpeg', 'bracket',
  'bracketspan', 'breath', 'dir', 'dynam', 'fermata', 'fing', 'gliss',
  'hairpin', 'harm', 'mordent', 'mnum', 'octave', 'pedal', 'phrase', 'reh',
  'slur', 'tempo', 'tie', 'trill', 'turn'
];

export const pnames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

// according to Verovio 3.9's implementation of timeSpanningInterface()
// better: att.startEndId and att.timestamp2.logical
export const timeSpanningElements = [
  'bracketspan', 'dir', 'dynam', 'gliss', 'hairpin', 'harm', 'lv', 'octave',
  'pedal', 'pitchinflection', 'slur', 'tie', 'trill', 'syl'
];
