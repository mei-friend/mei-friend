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
  transposeToSoundingPitch: true,
  // clefChangeFactor: .83, // option removed in Verovio 3.10.0
  svgAdditionalAttribute: ['layer@n', 'staff@n', 'dir@vgrp', 'dynam@vgrp', 'hairpin@vgrp', 'pedal@vgrp', 'measure@n'],
  bottomMarginArtic: 1.2,
  topMarginArtic: 1.2,
};

// Viewer
export const defaultSpeedMode = true;
export const defaultViewerTimeoutDelay = 300; // ms, time interval within which concurrent clicks are treated as one update

export const meiFriendSettingsOptions = {
  titleGeneral: {
    title: 'General',
    description: 'General mei-friend settings',
    type: 'header',
    default: true,
  },
  selectToolkitVersion: {
    title: 'Verovio version',
    description:
      'Select Verovio toolkit version ' +
      '(* Switching to older versions before 3.11.0 ' +
      'might require a refresh due to memory issues.)',
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
    description:
      'Toggle Verovio Speed Mode. ' +
      'In speed mode, only the current page ' +
      'is sent to Verovio to reduce rendering ' +
      'time with large files',
    type: 'bool',
    default: true,
  },
  selectIdStyle: {
    title: 'Style of generated xml:ids',
    description:
      'Style of newly generated xml:ids (existing xml:ids are not changed)' +
      'e.g., Verovio original: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend style: "note-ophl5o"',
    type: 'select',
    values: ['Original', 'Base36', 'mei-friend'],
    valuesDescriptions: ['note-0000001018877033', 'n34z4wz2', 'note-34z4wz2'],
    default: 'Base36',
  },
  addApplicationNote: {
    title: 'Insert application statement',
    description:
      'Insert an application statement to the encoding ' +
      'description in the MEI header, identifying ' +
      'application name, version, date of first ' +
      'and last edit',
    type: 'bool',
    default: true,
  },
  dragSelection: {
    title: 'Drag select',
    description: 'Select elements in notation with mouse drag',
    type: 'header',
    default: true,
  },
  dragSelectNotes: {
    title: 'Select notes',
    description: 'Select notes',
    type: 'bool',
    default: true,
  },
  dragSelectRests: {
    title: 'Select rests',
    description: 'Select rests and repeats (rest, mRest, beatRpt, halfmRpt, mRpt)',
    type: 'bool',
    default: true,
  },
  dragSelectControlElements: {
    title: 'Select placement elements ',
    description: 'Select placement elements (i.e., with a @placement attribute: ' + att.attPlacement.join(', ') + ')',
    type: 'bool',
    default: false,
  },
  dragSelectSlurs: {
    title: 'Select slurs ',
    description: 'Select slurs (i.e., elements with @curvature attribute: ' + att.attCurvature.join(', ') + ')',
    type: 'bool',
    default: false,
  },
  dragSelectMeasures: {
    title: 'Select measures ',
    description: 'Select measures',
    type: 'bool',
    default: false,
  },
  controlMenuSettings: {
    title: 'Notation control bar',
    description: 'Define items to be shown in control menu above the notation',
    type: 'header',
    default: true,
  },
  // flip-checkbox, flip-btn
  controlMenuFlipToPageControls: {
    title: 'Show flip to page controls',
    description: 'Show flip to page controls in notation control menu',
    type: 'bool',
    default: true,
  },
  controlMenuUpdateNotation: {
    title: 'Show notation update controls',
    description: 'Show notation update behavior controls in notation control menu',
    type: 'bool',
    default: true,
  },
  controlMenuFontSelector: {
    title: 'Show notation font selector',
    description: 'Show notation font (SMuFL) selector in notation control menu',
    type: 'bool',
    default: false,
  },
  controlMenuNavigateArrows: {
    title: 'Show navigation arrows',
    description: 'Show notation navigation arrows in notation control menu',
    type: 'bool',
    default: false,
  },
  controlMenuSpeedmodeCheckbox: {
    title: 'Show speed mode checkbox',
    description: 'Show speed mode checkbox in notation control menu',
    type: 'bool',
    default: true,
  },
  titleMidiPlayback: {
    title: 'MIDI playback',
    description: 'MIDI playback settings',
    type: 'header',
    default: true,
  },
  showMidiPlaybackContextualBubble: {
    title: 'Show playback shortcut',
    description:
      'Causes a shortcut (bubble in bottom left corner; click to immediately start playback) to appear when the MIDI playback control bar is closed',
    type: 'bool',
    default: true,
  },
  showMidiPlaybackControlBar: {
    title: 'Show MIDI playback control bar',
    description: 'Show MIDI playback control bar',
    type: 'bool',
    default: false,
  },
  scrollFollowMidiPlayback: {
    title: 'Scroll-follow MIDI playback',
    description: 'Scroll notation panel to follow MIDI playback on current page',
    type: 'bool',
    default: true,
  },
  pageFollowMidiPlayback: {
    title: 'Page-follow MIDI playback',
    description: 'Automatically flip pages to follow MIDI playback',
    type: 'bool',
    default: true,
  },
  titleTransposition: {
    title: 'Transpose',
    description: 'Transpose score information',
    type: 'header',
    default: true,
  },
  enableTransposition: {
    title: 'Enable transposition',
    description:
      'Enable transposition settings, to be applied through the transpose button below. The transposition will be applied to the notation only, the encoding remains unchanged, unless you click the item "Rerender via Verovio" in the "Manipulate" dropdown menu.',
    type: 'bool',
    default: false,
  },
  transposeInterval: {
    title: 'Transpose by interval',
    description:
      'Transpose encoding by chromatic interval by the most common intervals (Verovio supports the base-40 system)',
    type: 'select',
    labels: [
      'Perfect Unison',
      'Augmented Unison',
      'Diminished Second',
      'Minor Second',
      'Major Second',
      'Augmented Second',
      'Diminished Third',
      'Minor Third',
      'Major Third',
      'Augmented Third',
      'Diminished Fourth',
      'Perfect Fourth',
      'Augmented Fourth',
      'Diminished Fifth',
      'Perfect Fifth',
      'Augmented Fifth',
      'Diminished Sixth',
      'Minor Sixth',
      'Major Sixth',
      'Augmented Sixth',
      'Diminished Seventh',
      'Minor Seventh',
      'Major Seventh',
      'Augmented Seventh',
      'Diminished Octave',
      'Perfect Octave',
    ],
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
    description: 'Transpose to key',
    type: 'select',
    labels: [
      'C# major / A# minor',
      'F# major / D# minor',
      'B major / G# minor',
      'E major / C# minor',
      'A major / F# minor',
      'D major / B minor',
      'G major / E minor',
      'C major / E minor',
      'F major / D minor',
      'Bb major / G minor',
      'Eb major / C minor',
      'Ab major / F minor',
      'Db major / Bb minor',
      'Gb major / Eb minor',
      'Cb major / Ab minor',
    ],
    values: ['cs', 'fs', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bf', 'ef', 'af', 'df', 'gf', 'cf'],
    default: 'c',
    radioId: 'toKey',
    radioName: 'transposeMode',
    radioChecked: 'true',
  },
  transposeDirection: {
    title: 'Pitch direction',
    description: 'Pitch direction of transposition (up/down)',
    type: 'select',
    labels: ['Up', 'Down', 'Closest'],
    values: ['+', '-', ''],
    default: '+', // refers to values
  },
  transposeButton: {
    title: 'Transpose',
    description:
      'Apply transposition with above settings to the notation, while the MEI encoding remains unchanged. To also transpose the MEI encoding with the current settings, use "Rerender via Verovio" in the "Manipulate" dropdown menu.',
    type: 'button',
  },
  renumberMeasuresHeading: {
    title: 'Renumber measures',
    description: 'Settings for renumbering measures',
    type: 'header',
    default: true,
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    title: 'Continue across incomplete measures',
    description: 'Continue measure numbers across incomplete measures (@metcon="false")',
    type: 'bool',
    default: false,
  },
  renumberMeasuresUseSuffixAtMeasures: {
    title: 'Suffix at incomplete measures',
    description: 'Use number suffix at incomplete measures (e.g., 23-cont)',
    type: 'select',
    values: ['none', '-cont'],
    default: false,
  },
  renumberMeasuresContinueAcrossEndings: {
    title: 'Continue across endings',
    description: 'Continue measure numbers across endings',
    type: 'bool',
    default: false,
  },
  renumberMeasuresUseSuffixAtEndings: {
    title: 'Suffix at endings',
    description: 'Use number suffix at endings (e.g., 23-a)',
    type: 'select',
    values: ['none', 'ending@n', 'a/b/c', 'A/B/C', '-a/-b/-c', '-A/-B/-C'],
    default: 'a/b/c',
  },
  // annotationPanelSeparator: {
  //   title: 'options-line', // class name of hr element
  //   type: 'line'
  // },
  highlightCurrentlySoundingNotes: {
    title: 'Highlight currently-sounding notes',
    description: 'Visually highlight currently-sounding notes in the notation panel during MIDI playback ',
    type: 'bool',
    default: true,
  },
  titleAnnotations: {
    title: 'Annotations',
    description: 'Annotation settings',
    type: 'header',
    default: true,
  },
  showAnnotations: {
    title: 'Show annotations',
    description: 'Show annotations in notation',
    type: 'bool',
    default: true,
  },
  showAnnotationPanel: {
    title: 'Show annotation panel',
    description: 'Show annotation panel',
    type: 'bool',
    default: false,
  },
  annotationDisplayLimit: {
    title: 'Maximum number of annotations',
    description: 'Maximum number of annotations to display ' + '(large numbers may slow mei-friend)',
    type: 'int',
    min: 0,
    step: 100,
    default: 100,
  },
  titleFacsimilePanel: {
    title: 'Facsimile panel',
    description: 'Show the facsimile imiages of the source edition, if available',
    type: 'header',
    open: false,
    default: false,
  },
  showFacsimilePanel: {
    title: 'Show facsimile panel',
    description: 'Show the score images of the source edition provided in the facsimile element',
    type: 'bool',
    default: false,
  },
  selectFacsimilePanelOrientation: {
    title: 'Facsimile panel position',
    description: 'Select facsimile panel position relative to notation',
    type: 'select',
    values: ['left', 'right', 'top', 'bottom'],
    default: 'bottom',
  },
  facsimileZoomInput: {
    title: 'Facsimile image zoom (%)',
    description: 'Zoom level of facsimile image (in percent)',
    type: 'int',
    min: 10,
    max: 300,
    step: 5,
    default: 100,
  },
  showFacsimileFullPage: {
    title: 'Show full page',
    description: 'Show facsimile image on full page',
    type: 'bool',
    default: false,
  },
  showFacsimileZones: {
    title: 'Show facsimile zone boxes',
    description: 'Show facsimile zone bounding boxes',
    type: 'bool',
    default: true,
  },
  editFacsimileZones: {
    title: 'Edit facsimile zones',
    description: 'Edit facsimile zones (will link bounding boxes to facsimile zones)',
    type: 'bool',
    default: false,
  },
  // sourcefacsimilePanelSeparator: {
  //   title: 'options-line', // class name of hr element
  //   type: 'line'
  // },
  titleSupplied: {
    title: 'Handle editorial content',
    description: 'Control handling of <supplied> elements',
    type: 'header',
    open: false,
    default: false,
  },
  showSupplied: {
    title: 'Show <supplied> elements',
    description: 'Highlight all elements contained by a <supplied> element',
    type: 'bool',
    default: true,
  },
  suppliedColor: {
    title: 'Select <supplied> highlight color',
    description: 'Select <supplied> highlight color',
    type: 'color',
    default: '#e69500',
  },
  respSelect: {
    title: 'Select <supplied> responsibility',
    description: 'Select responsibility id',
    type: 'select',
    default: 'none',
    values: [],
  },
  // dragLineSeparator: {
  //   title: 'options-line', // class name of hr element
  //   type: 'line'
  // },
  titleGitHubActions: {
    title: 'Use GitHub Actions',
    description: 'Work with GitHub Actions when available in a repository',
    type: 'header',
    open: false,
    default: false,
  },
  enableGitHubActions: {
    title: 'Show available GitHub Actions',
    description: 'List available GitHub Actions when navigating within repository in GitHub menu', 
    type: 'bool',
    default: false,
  },
};

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
