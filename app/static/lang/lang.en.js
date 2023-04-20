/**
 * Language file for English
 */
import * as att from '../lib/attribute-classes.js';

export const lang = {
  // Main menu bar
  GithubLoginLink: { text: 'Login' },

  // FILE MENU ITEM
  FileMenuTitle: { text: 'File' },
  OpenMeiText: { text: 'Open file' },
  OpenUrlText: { text: 'Open URL' },
  OpenExpample: { text: 'Public repertoire' },
  ImportMusicXml: { text: 'Import MusicXML' },
  ImportHumdrum: { text: 'Import Humdrum' },
  ImportPae: { text: 'Import PAE, ABC' },
  SaveMeiText: { text: 'Save MEI' },
  SaveSvg: { text: 'Save SVG' },
  SaveMidi: { text: 'Save MIDI' },
  PrintPreviewText: { text: 'Preview PDF' },
  GenerateUrlText: { text: 'Generate mei-friend URL' },

  // EDIT/CODE MENU ITEM
  EditMenuTitle: { text: 'Code' },
  UndoMenuText: { text: 'Undo' },
  RedoMenuText: { text: 'Redo' },
  StartSearchText: { text: 'Search' },
  FindNextText: { text: 'Find next' },
  FindPreviousText: { text: 'Find previous' },
  ReplaceMenuText: { text: 'Replace' },
  ReplaceAllMenuText: { text: 'Replace all' },
  IndentSelectionText: { text: 'Indent selection' },
  JumpToLineText: { text: 'Jump to line' },
  ManualValidateText: { text: 'Validate' },

  // VIEW MENU ITEM
  ViewMenuTitle: { text: 'View' },
  NotationTop: { text: 'Notation top' },
  NotationBottom: { text: 'Notation bottom' },
  NotationLeft: { text: 'Notation left' },
  NotationRight: { text: 'Notation right' },
  ShowSettingsMenuText: { text: 'Settings panel' },
  ShowAnnotationMenuText: { text: 'Annotations panel' },
  ShowFacsimileMenuText: { text: 'Facsimile panel' },
  ShowPlaybackControlsText: { text: 'Playback controls' },
  FacsimileTop: { text: 'Facsimile top' },
  FacsimileBottom: { text: 'Facsimile bottom' },
  FacsimileLeft: { text: 'Facsimile left' },
  FacsimileRight: { text: 'Facsimile right' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Manipulate' },
  invertPlacementText: { text: 'Invert placement' },
  betweenPlacementText: { text: 'Between placement' },
  addVerticalGroupText: { text: 'Add vertical group' },
  deleteText: { text: 'Delete element' },
  pitchUpText: { text: 'Pitch 1 tone up' },
  pitchDownText: { text: 'Pitch 1 tone down' },
  pitchOctaveUpText: { text: 'Pitch 1 octave up' },
  pitchOctaveDownText: { text: 'Pitch 1 octave down' },
  staffUpText: { text: 'Element 1 staff up' },
  staffDownText: { text: 'Element 1 staff down' },
  increaseDurText: { text: 'Increase duration' },
  decreaseDurText: { text: 'Decrease duration' },
  cleanAccidText: { text: 'Clean @accid.ges' },
  renumberMeasuresTestText: { text: ' Renumber measures (test)' },
  renumberMeasuresExecText: { text: ' Renumber measures (exec)' },
  addIdsText: { text: 'Add ids to MEI' },
  removeIdsText: { text: 'Remove ids from MEI' },
  reRenderMeiVerovio: { text: ' Rerender via Verovio' },
  addFacsimile: { text: 'Add facsimile element' },
  ingestFacsimileText: { text: 'Ingest facsimile' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Insert' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Directive' },
  addDynamicsText: { text: 'Dynamics' },
  addSlurText: { text: 'Slur' },
  addTieText: { text: 'Tie' },
  addCrescendoHairpinText: { text: 'Crescendo hairpin' },
  addDiminuendoHairpinText: { text: 'Diminuendo hairpin' },
  addBeamText: { text: 'Beam' },
  addBeamSpanText: { text: 'Beamspan' },
  addSuppliedText: { text: 'Supplied' },
  addSuppliedArticText: { text: 'Supplied (Artic)' },
  addSuppliedAccidText: { text: 'Supplied (Accid)' },
  addArpeggioText: { text: 'Arepggio' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pedal down' },
  addPedalUpText: { text: 'Pedal up' },
  addTrillText: { text: 'Trill' },
  addTurnText: { text: 'Turn' },
  addTurnLowerText: { text: 'Turn lower' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Mordent upper' },
  addOctave8AboveText: { text: 'Octave (8va above)' },
  addOctave15AboveText: { text: 'Octave (15va above)' },
  addOctave8BelowText: { text: 'Octave (8va below)' },
  addOctave15BelowText: { text: 'Octave (15va below)' },
  addGClefChangeBeforeText: { text: 'G clef before' },
  addGClefChangeAfterText: { text: 'G clef after' },
  addFClefChangeBeforeText: { text: 'F clef before' },
  addFClefChangeAfterText: { text: 'F clef after' },
  addCClefChangeBeforeText: { text: 'C clef before' },
  addCClefChangeAfterText: { text: 'C clef after' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Accent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Help' },
  goToHelpPage: { text: 'mei-friend help pages' },
  showChangelog: { text: 'Show mei-friend changelog' },
  goToGuidelines: { text: 'Show MEI Guidelines' },
  consultGuidelinesForElementText: { text: 'Consult Guidelines for current element' },
  provideFeedback: { text: 'Provide feedback' },
  resetDefault: { text: 'Reset to default' },

  // mei-friend SETTINGS MENU
  titleGeneral: {
    text: 'General',
    description: 'General mei-friend settings',
  },
  selectToolkitVersion: {
    text: 'Verovio version',
    description:
      'Select Verovio toolkit version ' +
      '(* Switching to older versions before 3.11.0 ' +
      'might require a refresh due to memory issues.)',
  },
  toggleSpeedMode: {
    text: 'Speed mode',
    description:
      'Toggle Verovio Speed Mode. ' +
      'In speed mode, only the current page ' +
      'is sent to Verovio to reduce rendering ' +
      'time with large files',
  },
  selectIdStyle: {
    text: 'Style of generated xml:ids',
    description:
      'Style of newly generated xml:ids (existing xml:ids are not changed)' +
      'e.g., Verovio original: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend style: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Insert application statement',
    description:
      'Insert an application statement to the encoding ' +
      'description in the MEI header, identifying ' +
      'application name, version, date of first ' +
      'and last edit',
  },
  selectLanguage: {
    text: 'Language',
    description: 'Select language of mei-friend interface.',
  },
  // Drag select
  dragSelection: {
    text: 'Drag select',
    description: 'Select elements in notation with mouse drag',
  },
  dragSelectNotes: {
    text: 'Select notes',
    description: 'Select notes',
  },
  dragSelectRests: {
    text: 'Select rests',
    description: 'Select rests and repeats (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Select placement elements ',
    description: 'Select placement elements (i.e., with a @placement attribute: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Select slurs ',
    description: 'Select slurs (i.e., elements with @curvature attribute: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Select measures ',
    description: 'Select measures',
  },
  // Control menu
  controlMenuSettings: {
    text: 'Notation control bar',
    description: 'Define items to be shown in control menu above the notation',
  },
  controlMenuFlipToPageControls: {
    text: 'Show flip to page controls',
    description: 'Show flip to page controls in notation control menu',
  },
  controlMenuUpdateNotation: {
    text: 'Show notation update controls',
    description: 'Show notation update behavior controls in notation control menu',
  },
  controlMenuFontSelector: {
    text: 'Show notation font selector',
    description: 'Show notation font (SMuFL) selector in notation control menu',
  },
  controlMenuNavigateArrows: {
    text: 'Show navigation arrows',
    description: 'Show notation navigation arrows in notation control menu',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Show speed mode checkbox',
    description: 'Show speed mode checkbox in notation control menu',
  },
  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI playback',
    description: 'MIDI playback settings',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Show playback shortcut',
    description:
      'Causes a shortcut (bubble in bottom left corner; ' +
      'click to immediately start playback) to appear ' +
      'when the MIDI playback control bar is closed',
  },
  showMidiPlaybackControlBar: {
    text: 'Show MIDI playback control bar',
    description: 'Show MIDI playback control bar',
  },
  scrollFollowMidiPlayback: {
    text: 'Scroll-follow MIDI playback',
    description: 'Scroll notation panel to follow MIDI playback on current page',
  },
  pageFollowMidiPlayback: {
    text: 'Page-follow MIDI playback',
    description: 'Automatically flip pages to follow MIDI playback',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Highlight currently-sounding notes',
    description: 'Visually highlight currently-sounding notes in the notation panel during MIDI playback ',
  },
  // Transposition
  titleTransposition: {
    text: 'Transpose',
    description: 'Transpose score information',
  },
  enableTransposition: {
    text: 'Enable transposition',
    description:
      'Enable transposition settings, to be applied through the transpose button below. The transposition will be applied to the notation only, the encoding remains unchanged, unless you click the item "Rerender via Verovio" in the "Manipulate" dropdown menu.',
  },
  transposeInterval: {
    text: 'Transpose by interval',
    description:
      'Transpose encoding by chromatic interval by the most common intervals (Verovio supports the base-40 system)',
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
  },
  transposeKey: {
    text: 'Transpose to key',
    description: 'Transpose to key',
    labels: [
      'C# major / A# minor',
      'F# major / D# minor',
      'B major / G# minor',
      'E major / C# minor',
      'A major / F# minor',
      'D major / B minor',
      'G major / E minor',
      'C major / A minor',
      'F major / D minor',
      'Bb major / G minor',
      'Eb major / C minor',
      'Ab major / F minor',
      'Db major / Bb minor',
      'Gb major / Eb minor',
      'Cb major / Ab minor',
    ],
  },
  transposeDirection: {
    text: 'Pitch direction',
    description: 'Pitch direction of transposition (up/down)',
    labels: ['Up', 'Down', 'Closest'],
  },
  transposeButton: {
    text: 'Transpose',
    description:
      'Apply transposition with above settings to the notation, while the MEI encoding remains unchanged. To also transpose the MEI encoding with the current settings, use "Rerender via Verovio" in the "Manipulate" dropdown menu.',
  },
  // Renumber measures
  renumberMeasuresHeading: {
    text: 'Renumber measures',
    description: 'Settings for renumbering measures',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Continue across incomplete measures',
    description: 'Continue measure numbers across incomplete measures (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Suffix at incomplete measures',
    description: 'Use number suffix at incomplete measures (e.g., 23-cont)',
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Continue across endings',
    description: 'Continue measure numbers across endings',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Suffix at endings',
    description: 'Use number suffix at endings (e.g., 23-a)',
  },
  // Annotations
  titleAnnotations: {
    text: 'Annotations',
    description: 'Annotation settings',
  },
  showAnnotations: {
    text: 'Show annotations',
    description: 'Show annotations in notation',
  },
  showAnnotationPanel: {
    text: 'Show annotation panel',
    description: 'Show annotation panel',
  },
  annotationDisplayLimit: {
    text: 'Maximum number of annotations',
    description: 'Maximum number of annotations to display ' + '(large numbers may slow mei-friend)',
  },
  // Facsimile
  titleFacsimilePanel: {
    text: 'Facsimile panel',
    description: 'Show the facsimile imiages of the source edition, if available',
  },
  showFacsimilePanel: {
    text: 'Show facsimile panel',
    description: 'Show the score images of the source edition provided in the facsimile element',
  },
  selectFacsimilePanelOrientation: {
    text: 'Facsimile panel position',
    description: 'Select facsimile panel position relative to notation',
    labels: ['left', 'right', 'top', 'bottom'],
  },
  facsimileZoomInput: {
    text: 'Facsimile image zoom (%)',
    description: 'Zoom level of facsimile image (in percent)',
  },
  showFacsimileFullPage: {
    text: 'Show full page',
    description: 'Show facsimile image on full page',
  },
  showFacsimileZones: {
    text: 'Show facsimile zone boxes',
    description: 'Show facsimile zone bounding boxes',
  },
  editFacsimileZones: {
    text: 'Edit facsimile zones',
    description: 'Edit facsimile zones (will link bounding boxes to facsimile zones)',
  },
  // Supplied element
  titleSupplied: {
    text: 'Handle editorial content',
    description: 'Control handling of <supplied> elements',
  },
  showSupplied: {
    text: 'Show <supplied> elements',
    description: 'Highlight all elements contained by a <supplied> element',
  },
  suppliedColor: {
    text: 'Select <supplied> highlight color',
    description: 'Select <supplied> highlight color',
  },
  respSelect: {
    text: 'Select <supplied> responsibility',
    description: 'Select responsibility id',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      'It seems that you are using Safari as your browser, on which ' +
      'mei-friend unfortunately does not currently support schema validation. ' +
      'Please use another browser for full validation support.',
  },
};
