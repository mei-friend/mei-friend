/**
 * Default values for mei-friend
 */

import * as att from './attribute-classes.js';

// export let platform = navigator.platform.toLowerCase(); // TODO
export const platform = (navigator?.userAgentData?.platform || navigator?.platform || 'unknown').toLowerCase();
export const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

// guidelines base URL, needed to construct element / attribute URLs
// TODO ideally determine version part automatically
export const guidelinesBase = 'https://music-encoding.org/guidelines/v4/';

/**
 * Object of common MEI schemas,
 * by meiProfile ('CMN', 'Mensural', 'Neumes', 'All', 'Any')
 * and meiVersion ('4.0.1', etc.)
 */
export const commonSchemas = {
  CMN: {
    '2.1.1': 'https://music-encoding.org/schema/2.1.1/mei-CMN.rng',
    '3.0.0': 'https://music-encoding.org/schema/3.0.0/mei-CMN.rng',
    '4.0.0': 'https://music-encoding.org/schema/4.0.0/mei-CMN.rng',
    '4.0.1': 'https://music-encoding.org/schema/4.0.1/mei-CMN.rng',
    '5.0.0-dev': 'https://music-encoding.org/schema/dev/mei-CMN.rng',
  },
  Mensural: {
    '2.1.1': 'https://music-encoding.org/schema/2.1.1/mei-Mensural.rng',
    '3.0.0': 'https://music-encoding.org/schema/3.0.0/mei-Mensural.rng',
    '4.0.0': 'https://music-encoding.org/schema/4.0.0/mei-Mensural.rng',
    '4.0.1': 'https://music-encoding.org/schema/4.0.1/mei-Mensural.rng',
    '5.0.0-dev': 'https://music-encoding.org/schema/dev/mei-Mensural.rng',
  },
  Neumes: {
    '2.1.1': 'https://music-encoding.org/schema/2.1.1/mei-Neumes.rng',
    '3.0.0': 'https://music-encoding.org/schema/3.0.0/mei-Neumes.rng',
    '4.0.0': 'https://music-encoding.org/schema/4.0.0/mei-Neumes.rng',
    '4.0.1': 'https://music-encoding.org/schema/4.0.1/mei-Neumes.rng',
    '5.0.0-dev': 'https://music-encoding.org/schema/dev/mei-Neumes.rng',
  },
  All: {
    '2.1.1': 'https://music-encoding.org/schema/2.1.1/mei-all.rng',
    '3.0.0': 'https://music-encoding.org/schema/3.0.0/mei-all.rng',
    '4.0.0': 'https://music-encoding.org/schema/4.0.0/mei-all.rng',
    '4.0.1': 'https://music-encoding.org/schema/4.0.1/mei-all.rng',
    '5.0.0-dev': 'https://music-encoding.org/schema/dev/mei-all.rng',
  },
  Any: {
    '2.1.1': 'https://music-encoding.org/schema/2.1.1/mei-all_anyStart.rng',
    '3.0.0': 'https://music-encoding.org/schema/3.0.0/mei-all_anyStart.rng',
    '4.0.0': 'https://music-encoding.org/schema/4.0.0/mei-all_anyStart.rng',
    '4.0.1': 'https://music-encoding.org/schema/4.0.1/mei-all_anyStart.rng',
    '5.0.0-dev': 'https://music-encoding.org/schema/dev/mei-all_anyStart.rng',
  },
};
export const defaultMeiVersion = '4.0.1';
export const defaultMeiProfile = 'CMN';
export const defaultSchema = commonSchemas[defaultMeiProfile][defaultMeiVersion];

export const defaultVerovioVersion = 'latest'; // 'develop', '3.10.0'

export let supportedVerovioVersions = {};
if (env === 'develop') {
  supportedVerovioVersions.local = {
    url: `${root}local/verovio-toolkit-hum.js`,
    description: 'Locally compiled Verovio toolkit version for debugging',
  };
}
supportedVerovioVersions.develop = {
  url: 'https://www.verovio.org/javascript/develop/verovio-toolkit-wasm.js',
  description: 'Current Verovio develop version',
};
supportedVerovioVersions.latest = {
  url: 'https://www.verovio.org/javascript/latest/verovio-toolkit-hum.js',
  description: 'Current Verovio release',
};
supportedVerovioVersions['3.15.0'] = {
  url: 'https://www.verovio.org/javascript/3.15.0/verovio-toolkit-hum.js',
  description: 'Verovio release 3.15.0',
  releaseDate: '1 Mar 2023',
};
supportedVerovioVersions['3.14.0'] = {
  url: 'https://www.verovio.org/javascript/3.14.0/verovio-toolkit-hum.js',
  description: 'Verovio release 3.14.0',
  releaseDate: '23 Dec 2022',
};
supportedVerovioVersions['3.13.1'] = {
  url: 'https://www.verovio.org/javascript/3.13.1/verovio-toolkit-hum.js',
  description: 'Verovio release 3.13.1',
  releaseDate: '28 Nov 2022',
};
supportedVerovioVersions['3.13.0'] = {
  url: 'https://www.verovio.org/javascript/3.13.0/verovio-toolkit-hum.js',
  description: 'Verovio release 3.13.0',
  releaseDate: '23 Nov 2022',
};
supportedVerovioVersions['3.12.1'] = {
  url: 'https://www.verovio.org/javascript/3.12.1/verovio-toolkit-hum.js',
  description: 'Verovio release 3.12.1',
  releaseDate: '6 Oct 2022',
};
supportedVerovioVersions['3.12.0'] = {
  url: 'https://www.verovio.org/javascript/3.12.0/verovio-toolkit-hum.js',
  description: 'Verovio release 3.12.0',
  releaseDate: '29 Sept 2022',
};
supportedVerovioVersions['3.11.0'] = {
  url: 'https://www.verovio.org/javascript/3.11.0/verovio-toolkit-hum.js',
  description: 'Verovio release 3.11.0',
  releaseDate: '15 Jul 2022',
};
supportedVerovioVersions['3.10.0*'] = {
  url: 'https://www.verovio.org/javascript/3.10.0/verovio-toolkit-hum.js',
  description:
    'Verovio release 3.10.0. *ATTENTION: Switching to this version might require a refresh due to memory issues.',
  releaseDate: '25 May 2022',
};
supportedVerovioVersions['3.9.0*'] = {
  url: 'https://www.verovio.org/javascript/3.9.0/verovio-toolkit-hum.js',
  description:
    'Verovio release 3.9.0. *ATTENTION: Switching to this version might require a refresh due to memory issues.',
  releaseDate: '22 Feb 2022',
};
supportedVerovioVersions['3.8.1*'] = {
  url: 'https://www.verovio.org/javascript/3.8.1/verovio-toolkit-hum.js',
  description:
    'Verovio release 3.8.1. *ATTENTION: Switching to this version might require a refresh due to memory issues.',
  releaseDate: '10 Jan 2022',
};
supportedVerovioVersions['3.7.0*'] = {
  url: 'https://www.verovio.org/javascript/3.7.0/verovio-toolkit-hum.js',
  description:
    'Verovio release 3.7.0. *ATTENTION: Switching to this version might require a refresh due to memory issues.',
  releaseDate: '22 Nov 2021',
};

export const fontList = ['Leipzig', 'Bravura', 'Gootville', 'Leland', 'Petaluma'];

// const defaultMeiFileName = `${root}Beethoven_WoOAnh5_Nr1_1-Breitkopf.mei`;
export const defaultMeiFileName = `${root}Beethoven_WoO70-Breitkopf.mei`;

export const defaultVerovioOptions = {
  scale: 55,
  breaks: 'line',
  header: 'encoded',
  footer: 'encoded',
  inputFrom: 'mei',
  adjustPageHeight: true,
  mdivAll: true,
  graceFactor: 0.66,
  hairpinSize: 2,
  outputIndent: 3,
  pageMarginLeft: 50,
  pageMarginRight: 50,
  pageMarginBottom: 15,
  pageMarginTop: 50,
  spacingLinear: 0.2,
  spacingNonLinear: 0.5,
  minLastJustification: 0,
  // transposeToSoundingPitch: true,
  // clefChangeFactor: .83, // option removed in Verovio 3.10.0
  svgAdditionalAttribute: ['layer@n', 'staff@n', 'dir@vgrp', 'dynam@vgrp', 'hairpin@vgrp', 'pedal@vgrp', 'measure@n'],
  bottomMarginArtic: 1.2,
  topMarginArtic: 1.2,
};

// Viewer
export const defaultSpeedMode = true;
export const defaultViewerTimeoutDelay = 300; // ms, time interval within which concurrent clicks are treated as one update

/**
 * mei-friend settings object.
 * Note that 'title', 'description', 'labels' will be coined by
 * language pack files in ../lang/lang.XX.js Don't edit texts here.
 */
export const meiFriendSettingsOptions = {
  titleGeneral: {
    title: 'General',
    description: '',
    type: 'header',
    default: true,
  },
  selectToolkitVersion: {
    title: 'Verovio version',
    description: '',
    type: 'select',
    default: defaultVerovioVersion,
    values: Object.keys(supportedVerovioVersions),
    valuesDescriptions: Object.keys(supportedVerovioVersions).map((key) => {
      let desc = supportedVerovioVersions[key].description;
      if (supportedVerovioVersions[key].hasOwnProperty('releaseDate')) {
        desc += ' (' + supportedVerovioVersions[key].releaseDate + ')';
      }
      return desc;
    }),
  },
  toggleSpeedMode: {
    title: 'Speed mode',
    description: '',
    type: 'bool',
    default: true,
  },
  selectIdStyle: {
    title: 'Style of generated xml:ids',
    description: '',
    type: 'select',
    values: ['Original', 'Base36', 'mei-friend'],
    valuesDescriptions: ['note-0000001018877033', 'n34z4wz2', 'note-34z4wz2'],
    default: 'Base36',
  },
  addApplicationNote: {
    title: 'Insert application statement',
    description: '',
    type: 'bool',
    default: true,
  },
  selectLanguage: {
    title: 'Language',
    description: 'filled in by language packs.',
    type: 'select',
    values: ['English', 'Deutsch'],
    valuesDescriptions: ['English', 'Deutsch'],
    default: 'English',
  },
  dragSelection: {
    title: 'Drag select',
    description: 'filled in by language packs',
    type: 'header',
    default: true,
  },
  dragSelectNotes: {
    title: 'Select notes',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  dragSelectRests: {
    title: 'Select rests',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  dragSelectControlElements: {
    title: 'Select placement elements ',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  dragSelectSlurs: {
    title: 'Select slurs ',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  dragSelectMeasures: {
    title: 'Select measures ',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  controlMenuSettings: {
    title: 'Notation control bar',
    description: 'filled in by language packs',
    type: 'header',
    default: true,
  },
  // flipCheckbox, flipButton
  controlMenuFlipToPageControls: {
    title: 'Show flip to page controls',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  controlMenuUpdateNotation: {
    title: 'Show notation update controls',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  controlMenuFontSelector: {
    title: 'Show notation font selector',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  controlMenuNavigateArrows: {
    title: 'Show navigation arrows',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  controlMenuSpeedmodeCheckbox: {
    title: 'Show speed mode checkbox',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  // MIDI Playback
  titleMidiPlayback: {
    title: 'MIDI playback',
    description: 'filled in by language packs',
    type: 'header',
    default: true,
  },
  showMidiPlaybackContextualBubble: {
    title: 'Show playback shortcut',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  showMidiPlaybackControlBar: {
    title: 'Show MIDI playback control bar',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  scrollFollowMidiPlayback: {
    title: 'Scroll-follow MIDI playback',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  pageFollowMidiPlayback: {
    title: 'Page-follow MIDI playback',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  highlightCurrentlySoundingNotes: {
    title: 'Highlight currently-sounding notes',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  // Transposition
  titleTransposition: {
    title: 'Transpose',
    description: 'filled in by language packs',
    type: 'header',
    default: true,
  },
  enableTransposition: {
    title: 'Enable transposition',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  transposeInterval: {
    title: 'Transpose by interval',
    description: 'filled in by language packs',
    type: 'select',
    labels: [],
    values: [
      'P1',
      'A1',
      'd2',
      'm2',
      'M2',
      'A2',
      'd3',
      'm3',
      'M3',
      'A3',
      'd4',
      'P4',
      'A4',
      'd5',
      'P5',
      'A5',
      'd6',
      'm6',
      'M6',
      'A6',
      'd7',
      'm7',
      'M7',
      'A7',
      'd8',
      'P8',
    ],
    default: 'P1',
    radioId: 'byInterval',
    radioName: 'transposeMode',
  },
  transposeKey: {
    title: 'Transpose to key',
    description: 'filled in by language packs',
    type: 'select',
    labels: [],
    values: ['cs', 'fs', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bf', 'ef', 'af', 'df', 'gf', 'cf'],
    default: 'c',
    radioId: 'toKey',
    radioName: 'transposeMode',
    radioChecked: 'true',
  },
  transposeDirection: {
    title: 'Pitch direction',
    description: 'filled in by language packs',
    type: 'select',
    labels: ['Up', 'Down', 'Closest'],
    values: ['+', '-', ''],
    default: '+', // refers to values
  },
  transposeButton: {
    title: 'Transpose',
    description: 'filled in by language packs',
    type: 'button',
  },
  // renumber measures
  renumberMeasuresHeading: {
    title: 'Renumber measures',
    description: 'filled in by language packs',
    type: 'header',
    default: true,
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    title: 'Continue across incomplete measures',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  renumberMeasuresUseSuffixAtMeasures: {
    title: 'Suffix at incomplete measures',
    description: 'filled in by language packs',
    type: 'select',
    values: ['none', '-cont'],
    default: false,
  },
  renumberMeasuresContinueAcrossEndings: {
    title: 'Continue across endings',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  renumberMeasuresUseSuffixAtEndings: {
    title: 'Suffix at endings',
    description: 'filled in by language packs',
    type: 'select',
    values: ['none', 'ending@n', 'a/b/c', 'A/B/C', '-a/-b/-c', '-A/-B/-C'],
    default: 'a/b/c',
  },
  // Annotations
  titleAnnotations: {
    title: 'Annotations',
    description: 'filled in by language packs',
    type: 'header',
    default: true,
  },
  showAnnotations: {
    title: 'Show annotations',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  showAnnotationPanel: {
    title: 'Show annotation panel',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  annotationDisplayLimit: {
    title: 'Maximum number of annotations',
    description: 'filled in by language packs',
    type: 'int',
    min: 0,
    step: 100,
    default: 100,
  },
  // Facsimile
  titleFacsimilePanel: {
    title: 'Facsimile panel',
    description: 'filled in by language packs',
    type: 'header',
    open: false,
    default: false,
  },
  showFacsimilePanel: {
    title: 'Show facsimile panel',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  selectFacsimilePanelOrientation: {
    title: 'Facsimile panel position',
    description: 'filled in by language packs',
    type: 'select',
    values: ['left', 'right', 'top', 'bottom'],
    default: 'bottom',
  },
  facsimileZoomInput: {
    title: 'Facsimile image zoom (%)',
    description: 'filled in by language packs',
    type: 'int',
    min: 10,
    max: 300,
    step: 5,
    default: 100,
  },
  showFacsimileFullPage: {
    title: 'Show full page',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  showFacsimileZones: {
    title: 'Show facsimile zone boxes',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  editFacsimileZones: {
    title: 'Edit facsimile zones',
    description: 'filled in by language packs',
    type: 'bool',
    default: false,
  },
  // Supplied element
  titleSupplied: {
    title: 'Handle editorial content',
    description: 'filled in by language packs',
    type: 'header',
    open: false,
    default: false,
  },
  showSupplied: {
    title: 'Show <supplied> elements',
    description: 'filled in by language packs',
    type: 'bool',
    default: true,
  },
  suppliedColor: {
    title: 'Select <supplied> highlight color',
    description: 'filled in by language packs',
    type: 'color',
    default: '#e69500',
  },
  respSelect: {
    title: 'Select <supplied> responsibility',
    description: 'filled in by language packs',
    type: 'select',
    default: 'none',
    values: [],
  },
}; // meiFriendSettingsOptions object

/**
 * Please note: title & description will be overridden by language packs lang.XX.js
 */
export const codeMirrorSettingsOptions = {
  // key as in CodeMirror
  titleAppearance: {
    title: 'Editor appearance',
    description: 'Controls the appearance of the editor',
    type: 'header',
    open: true,
    default: true,
  },
  zoomFont: {
    title: 'Font size (%)',
    description: 'Change font size of editor (in percent)',
    type: 'int',
    default: 100,
    min: 45,
    max: 300,
    step: 5,
  },
  theme: {
    title: 'Theme',
    description: 'Select the theme of the editor',
    type: 'select',
    default: 'default',
    values: [
      'default',
      'abbott',
      'base16-dark',
      'base16-light',
      'cobalt',
      'darcula',
      'dracula',
      'eclipse',
      'elegant',
      'monokai',
      'idea',
      'juejin',
      'mdn-like',
      'neo',
      'paraiso-dark',
      'paraiso-light',
      'pastel-on-dark',
      'solarized dark',
      'solarized light',
      'xq-dark',
      'xq-light',
      'yeti',
      'yonce',
      'zenburn',
    ],
  },
  matchTheme: {
    title: 'Notation matches theme',
    description: 'Match notation to editor color theme',
    type: 'bool',
    default: false,
  },
  tabSize: {
    title: 'Indentation size',
    description: 'Number of space characters for each indentation level',
    type: 'int',
    min: 1,
    max: 12,
    step: 1,
    default: 3,
  },
  lineWrapping: {
    title: 'Line wrapping',
    description: 'Whether or not lines are wrapped at end of panel',
    type: 'bool',
    default: false,
  },
  lineNumbers: {
    title: 'Line numbers',
    description: 'Show line numbers',
    type: 'bool',
    default: true,
  },
  firstLineNumber: {
    title: 'First line number',
    description: 'Set first line number',
    type: 'int',
    min: 0,
    max: 1,
    step: 1,
    default: 1,
  },
  foldGutter: {
    title: 'Code folding',
    description: 'Enable code folding through fold gutters',
    type: 'bool',
    default: true,
  },
  titleEditorOptions: {
    title: 'Editor behavior',
    description: 'Controls the behavior of the editor',
    type: 'header',
    open: true,
    default: true,
  },
  autoValidate: {
    title: 'Auto validation',
    description: 'Validate encoding against schema automatically after each edit',
    type: 'bool',
    default: true,
  },
  autoCloseBrackets: {
    title: 'Auto close brackets',
    description: 'Automatically close brackets at input',
    type: 'bool',
    default: true,
  },
  autoCloseTags: {
    title: 'Auto close tags',
    description: 'Automatically close tags at input',
    type: 'bool',
    default: true,
  },
  matchTags: {
    title: 'Match tags',
    description: 'Highlights matched tags around editor cursor',
    type: 'bool',
    default: true,
  },
  showTrailingSpace: {
    title: 'Highlight trailing spaces',
    description: 'Highlights unnecessary trailing spaces at end of lines',
    type: 'bool',
    default: true,
  },
  keyMap: {
    title: 'Key map',
    description: 'Select key map',
    type: 'select',
    default: 'default',
    values: ['default', 'vim', 'emacs'],
  },
};

// for facsimile
export const defaultFacsimileRectangleLineWidth = 6; // px facsimile zone bounding box line width
export const defaultFacsimileRectangleColor = 'darkred'; // facsimile zone bounding box color

// for resizer
export const defaultNotationResizerWidth = 8; // pixel
export const defaultNotationOrientation = 'bottom';
export const defaultNotationProportion = 0.5;
export const defaultFacsimileResizerWidth = 8; // px, compare to css facsimile-[left/right/top/bottom].css
export const defaultFacsimileOrientation = 'bottom'; // notationOrientation of facsimile relative to notation
export const defaultFacsimileProportion = 0.65;
export const annotationPanelExtent = 250; // px, width/height of annotation panel, taken away from width of friendContainer
