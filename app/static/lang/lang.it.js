/**
 * Language file for Italian
 */
import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Main menu bar
  githubLoginLink: { text: 'Accesso' },

  // FILE MENU ITEM// MENU FILE
  fileMenuTitle: { text: 'File' },
  openMeiText: { text: 'Apri file' },
  openUrlText: { text: 'Apri URL' },
  openExample: {
    text: 'Repertorio pubblico',
    description: 'Apri una lista di repertorio di pubblico dominio',
  },
  importMusicXml: { text: 'Importa MusicXML' },
  importHumdrum: { text: 'Importa Humdrum' },
  importPae: { text: 'Importa PAE, ABC' },
  saveMeiText: { text: 'Salva MEI' },
  saveSvg: { text: 'Salva SVG' },
  saveMidi: { text: 'Salva MIDI' },
  printPreviewText: { text: 'Anteprima PDF' },
  generateUrlText: { text: 'Genera URL di mei-friend' },

  // EDIT/CODE MENU ITEM / MENU EDIT/CODE
  editMenuTitle: { text: 'Codice' },
  undoMenuText: { text: 'Annulla' },
  redoMenuText: { text: 'Ripristina' },
  startSearchText: { text: 'Cerca' },
  findNextText: { text: 'Trova successivo' },
  findPreviousText: { text: 'Trova precedente' },
  replaceMenuText: { text: 'Sostituisci' },
  replaceAllMenuText: { text: 'Sostituisci tutto' },
  indentSelectionText: { text: 'Indenta selezione' },
  jumpToLineText: { text: 'Vai alla riga' },
  manualValidateText: { text: 'Convalida' },

  // VIEW MENU ITEM / MENU VISUALIZZA
  viewMenuTitle: { text: 'Visualizza' },
  notationTop: { text: 'Notazione in alto' },
  notationBottom: { text: 'Notazione in basso' },
  notationLeft: { text: 'Notazione a sinistra' },
  notationRight: { text: 'Notazione a destra' },
  showSettingsMenuText: { text: 'Pannello di impostazioni' },
  showAnnotationMenuText: { text: 'Pannello di annotazioni' },
  showFacsimileMenuText: { text: 'Pannello di facsimili' },
  showPlaybackControlsText: { text: 'Controlli di riproduzione' },
  facsimileTop: { text: 'Facsimile in alto' },
  facsimileBottom: { text: 'Facsimile in basso' },
  facsimileLeft: { text: 'Facsimile a sinistra' },
  facsimileRight: { text: 'Facsimile a destra' },

  // MANIPULATE MENU ITEM/ MENU MANIPOLA
  manipulateMenuTitle: { text: 'Manipola' },
  invertPlacementText: { text: 'Inverti posizione' },
  betweenPlacementText: { text: 'Tra posizioni' },
  addVerticalGroupText: { text: 'Aggiungi gruppo verticale' },
  deleteText: { text: 'Elimina elemento' },
  pitchUpText: { text: 'Alza di un tono' },
  pitchDownText: { text: 'Abbassa di un tono' },
  pitchOctaveUpText: { text: "Alza di un'ottava" },
  pitchOctaveDownText: { text: "Abbassa di un'ottava" },
  staffUpText: { text: 'Elemento su 1 rigo' },
  staffDownText: { text: 'Elemento giù 1 rigo' },
  increaseDurText: { text: 'Aumenta durata' },
  decreaseDurText: { text: 'Riduci durata' },
  cleanAccidText: { text: 'Pulisci @accid.ges' },
  renumberMeasuresTestText: { text: 'Rinumera misure (test)' },
  renumberMeasuresExecText: { text: 'Rinumera misure (esegui)' },
  addIdsText: { text: 'Aggiungi ids a MEI' },
  removeIdsText: { text: 'Rimuovi ids da MEI' },
  reRenderMeiVerovio: { text: 'Ridisegna tramite Verovio' },
  addFacsimile: { text: 'Aggiungi elemento facsimile' },
  ingestFacsimileText: { text: 'Incorpora facsimile' },

  // INSERT MENU ITEM / INSERISCI VOCE DI MENU
  insertMenuTitle: { text: 'Inserisci' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Direttiva' },
  addDynamicsText: { text: 'Dinamica' },
  addSlurText: { text: 'Fraseggio' },
  addTieText: { text: 'Legatura' },
  addCrescendoHairpinText: { text: 'Crescendo' },
  addDiminuendoHairpinText: { text: 'Diminuendo' },
  addBeamText: { text: 'Raggruppa note' },
  addBeamSpanText: { text: 'Raggruppa note su più battute' },
  addSuppliedText: { text: 'Aggiungi simbolo mancante' },
  addSuppliedArticText: { text: 'Aggiungi simbolo mancante (Artic)' },
  addSuppliedAccidText: { text: 'Aggiungi simbolo mancante (Accid)' },
  addArpeggioText: { text: 'Arpeggio' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissato' },
  addPedalDownText: { text: 'Pedale giù' },
  addPedalUpText: { text: 'Pedale su' },
  addTrillText: { text: 'Trillo' },
  addTurnText: { text: 'Gruppetto' },
  addTurnLowerText: { text: 'Gruppetto inferiore' },
  addMordentText: { text: 'Mordente' },
  addMordentUpperText: { text: 'Mordente superiore' },
  addOctave8AboveText: { text: 'Ottava (8va sopra)' },
  addOctave15AboveText: { text: 'Ottava (15ma sopra)' },
  addOctave8BelowText: { text: 'Ottava (8va sotto)' },
  addOctave15BelowText: { text: 'Ottava (15ma sotto)' },
  addGClefChangeBeforeText: { text: 'Cambio di chiave di violino prima' },
  addGClefChangeAfterText: { text: 'Cambio di chiave di violino dopo' },
  addFClefChangeBeforeText: { text: 'Cambio di chiave di basso prima' },
  addFClefChangeAfterText: { text: 'Chiave di basso dopo' },
  addCClefChangeBeforeText: { text: 'Chiave di violino prima' },
  addCClefChangeAfterText: { text: 'Chiave di violino dopo' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Accento' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM / VOCE DI MENU AIUTO
  helpMenuTitle: { text: 'Aiuto' },
  goToHelpPage: { text: 'Pagina di aiuto di mei-friend' },
  showChangelog: { text: 'Mostra il registro delle modifiche di mei-friend' },
  goToGuidelines: { text: 'Mostra le linee guida MEI' },
  consultGuidelinesForElementText: { text: "Consulta le linee guida per l'elemento corrente" },
  provideFeedback: { text: 'Fornisci un feedback' },
  resetDefault: { text: 'Ripristina impostazioni predefinite' },

  // panel icons/ icone pannello
  showMidiPlaybackControlBarButton: { description: 'Attiva/Disattiva barra di controllo della riproduzione MIDI' },
  showFacsimileButton: { description: 'Attiva/Disattiva pannello Facsimile' },
  showAnnotationsButton: { description: 'Attiva/Disattiva pannello Annotazioni' },
  showSettingsButton: { description: 'Mostra il pannello delle impostazioni' },

  // Footer texts
  leftFooter: {
    html:
      'Hosted by <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'at <a href="https://mdw.ac.at">mdw</a>, with ' +
      heart +
      ' from Vienna. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Imprint</a>.',
  },
  loadingVerovio: { text: 'Loading Verovio' },
  verovioLoaded: { text: 'loaded' },
  convertedToPdf: { text: 'converted to PDF' },
  statusBarCompute: { text: 'Compute' },
  middleFooterPage: { text: 'page' },
  middleFooterOf: { text: 'of' },
  middleFooterLoaded: { text: 'loaded' },

  // control menu
  verovioIcon: {
    description: `mei-friend worker activity:
    clockwise rotation denotes Verovio activity,
    anticlockwise rotation speed worker activity`,
  },
  decreaseScaleButton: { description: 'Decrease notation' },
  verovioZoom: { description: 'Scale size of notation' },
  increaseScaleButton: { description: 'Increase notation' },
  pagination1: { html: 'Page&nbsp;' },
  pagination3: { html: '&nbsp;of' },
  sectionSelect: { description: 'Navigate encoded section/ending structure' },
  firstPageButton: { description: 'Flip to first page' },
  previousPageButton: { description: 'Flip to previous page' },
  paginationLabel: { description: 'Page navigation: click to manually enter page number to be displayed' },
  nextPageButton: { description: 'Flip to next page' },
  lastPageButton: { description: 'Flip to last page' },
  flipCheckbox: { description: 'Automatically flip page to encoding cursor position' },
  flipButton: { description: 'Flip page manually to encoding cursor position' },
  breaksSelect: { description: 'Define system/page breaks behavior of notation' },
  breaksSelectNone: { text: 'None' },
  breaksSelectAuto: { text: 'Automatic' },
  breaksSelectMeasure: { text: 'Measure' },
  breaksSelectLine: { text: 'System' },
  breaksSelectEncoded: { text: 'System and page' },
  breaksSelectSmart: { text: 'Smart' },
  updateControlsLabel: { text: 'Update', description: 'Control update behavior of notation after changes in encoding' },
  liveUpdateCheckbox: { description: 'Automatically update notation after changes in encoding' },
  codeManualUpdateButton: { description: 'Update notation manually' },
  engravingFontSelect: { description: 'Select engraving font' },
  backwardsButton: { description: 'Navigate to left in notation' },
  forwardsButton: { description: 'Navigate to right in notation' },
  upwardsButton: { description: 'Navigate upwards in notation' },
  downwardsButton: { description: 'Navigate downwards in notation' },
  speedLabel: {
    text: 'Speed mode',
    description: 'In speed mode, only the current page is sent to Verovio to reduce rendering time with large files',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: 'Save PDF', description: 'Save as PDF' },
  pdfCloseButton: { description: 'Close print view' },
  pagesLegendLabel: { text: 'Page range', singlePage: 'page', multiplePages: 'Pages' },
  selectAllPagesLabel: { text: 'All' },
  selectCurrentPageLabel: { text: 'Current page' },
  selectFromLabel: { text: 'from:' },
  selectToLabel: { text: 'to:' },
  selectPageRangeLabel: { text: 'Page range:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Only the current page is rendered to PDF, because speed mode is activated. ' +
      'Uncheck speed mode to select from all pages.',
  },
  pdfPreviewNormalModeTitle: { text: 'Select page range to be saved in PDF.' },

  // facsimile panel
  facsimileIcon: { description: 'Facsimile panel' },
  facsimileDecreaseZoomButton: { description: 'Decrease notation image' },
  facsimileZoom: { description: 'Adjust size of notation image' },
  facsimileIncreaseZoomButton: { description: 'Increase notation image' },
  facsimileFullPageLabel: { text: 'Full page', description: 'Display full page of facsimile image' },
  facsimileFullPageCheckbox: { description: 'Display full page of facsimile image' },
  facsimileShowZonesLabel: { text: 'Show zone boxes', description: 'Show zone boxes of facsimile' },
  facsimileShowZonesCheckbox: { description: 'Show zone boxes of facsimile' },
  facsimileEditZonesCheckbox: { description: 'Edit zones of facsimile' },
  facsimileEditZonesLabel: { text: 'Edit zones', description: 'Edit zones of facsimile' },
  facsimileCloseButton: { description: 'Close facsimile panel' },
  facsimileDefaultWarning: { text: 'No facsimile content to display.' },
  facsimileNoSurfaceWarning: {
    text: 'No surface element found for this page.\n(An initial pb element might be missing.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Facsimile without zones only visible in full page mode.' },
  facsimileImgeNotLoadedWarning: { text: 'Could not load image' },

  // drag'n'drop
  dragOverlayText: { text: 'Drag your input file here.' },

  // public repertoire
  openUrlHeading: { text: 'Open Web-hosted encoding by URL' },
  openUrlInstructions: {
    text:
      'Please choose from the public repertoire or enter the URL of ' +
      'a Web-hosted music encoding, below. Note:  Host server must ' +
      'support cross-origin resource sharing (CORS).',
  },
  publicRepertoireSummary: { text: 'Public repertoire' },
  sampleEncodingsComposerLabel: { text: 'Composer:' },
  sampleEncodingsEncodingLabel: { text: 'Encoding:' },
  sampleEncodingsOptionLabel: { text: 'Choose an encoding...' },
  openUrlButton: { text: 'Open URL' },
  openUrlCancel: { text: 'Cancel' },
  proposePublicRepertoire: {
    html:
      'We welcome proposals for ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'additions to the public repertoire' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Choose an encoding...' },
  openUrlChooseComposerText: { text: 'Choose a composer...' },
  openUrlOpenEncodingByUrlText: { text: 'Open Web-hosted encoding by URL' },

  // fork modals
  forkRepoGithubText: { text: 'Fork Github Repository' },
  forkRepoGithubExplanation: {
    text:
      'The link you have followed ' +
      'will create a GitHub fork of the following repository for editing in mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Is this OK?' },
  forkRepositoryInstructions: {
    text:
      'Please choose from the public repertoire or enter the ' +
      'Github (user or organization) name and the repository name of a Github-hosted repository, below. ' +
      'Your forked repository will become available from  the Github menu.',
  },
  forkRepositoryGithubText: { text: 'Fork Github Repository' },
  forkRepertoireSummary: { text: 'Public repertoire' },
  forkRepertoireComposerLabel: { text: 'Composer:' },
  forkRepertoireOrganizationLabel: { text: 'Organization:' },
  forkRepertoireOrganizationOption: { text: 'Choose a GitHub Organization...' },
  forkRepertoireRepositoryLabel: { text: 'Repository:' },
  forkRepertoireRepositoryOption: { text: 'Choose an encoding...' },
  forkRepositoryInputName: { placeholder: 'Github user or organization' },
  forkRepositoryInputRepoOption: { text: 'Choose a repository' },
  forkRepositoryToSelectorText: { text: 'Fork to: ' },
  forkRepositoryButton: { text: 'Fork repository' },
  forkRepositoryCancel: { text: 'Cancel' },
  forkProposePublicRepertoire: {
    html:
      'We welcome proposals for ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'additions to the public repertoire' +
      '</a>.',
  },

  // annotation panel
  annotationCloseButtonText: { text: 'Close Annotations Panel' },
  hideAnnotationPanelButton: { description: 'Close Annotations Panel' },
  closeAnnotationPanelButton: { description: 'Close Annotations Panel' },
  annotationToolsButton: { text: 'Tools', description: 'Annotation tools' },
  annotationListButton: { text: 'List', description: 'List annotations' },
  writeAnnotStandoffText: { text: 'Web Annotation' },
  annotationToolsHighlightTitle: { text: 'Highlight' },
  annotationToolsHighlightSpan: { text: 'Highlight' },
  annotationToolsDescribeTitle: { text: 'Describe' },
  annotationToolsDescribeSpan: { text: 'Describe' },
  annotationToolsLinkTitle: { text: 'Link' },
  annotationToolsLinkSpan: { text: 'Link' },
  listAnnotations: { text: 'No annotations present.' },
  addWebAnnotation: { text: 'Load Web Annotation(s)' },
  loadWebAnnotationMessage: { text: 'Enter URL of Web Annotation or Web Annotation Container' },
  loadWebAnnotationMessage1: { text: 'Could not load URL provided' },
  loadWebAnnotationMessage2: { text: 'please try again' },
  noAnnotationsToDisplay: { text: 'No annotations to display' },
  flipPageToAnnotationText: { description: 'Flip page to this annotation' },
  deleteAnnotation: { description: 'Delete this annotation' },
  deleteAnnotationConfirmation: { text: 'Are you sure you wish to delete this annotation?' },
  makeStandOffAnnotation: {
    description: 'Stand-off status (Web Annotation)',
    descriptionSolid: 'Write to Solid as Web Annotation',
    descriptionToLocal: 'Copy Web Annotation URI to clipboard',
  },
  makeInlineAnnotation: {
    description: 'Click to in-line annotation',
    descriptionCopy: 'Copy <annot> xml:id to clipboard',
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'elements' },
  askForLinkUrl: { text: 'Please enter a URL to link to' },
  drawLinkUrl: { text: 'Open in new tab' },
  askForDescription: { text: 'Please enter a textual description to apply' },
  maxNumberOfAnnotationAlert: {
    text1: 'Number of annot elements exceeds configurable "Maximum number of annotations"',
    text2: 'New annotations can still be generated and will be displayed if "Show annotations" is set.',
  },
  annotationsOutsideScoreWarning: {
    text: 'Sorry, cannot currently write annotations placed outside &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: 'Cannot write annotation as MEI anchor-point lacks xml:id.',
    text2: 'Please assign identifiers by selecting "Manipulate" -> "Re-render MEI (with ids)" and try again.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Speed mode',
    description:
      'Speed mode is active; only playing MIDI for current page. To play the entire encoding, disable speed mode.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Hide MIDI Playback Control Bar' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend Settings',
  },
  mfReset: {
    text: 'Default',
    description: 'Reset to mei-friend defaults',
  },
  filterSettings: {
    placeholder: 'Filter settings',
    description: 'Type here to filter settings',
  },
  closeSettingsButton: {
    description: 'Close settings panel',
  },
  hideSettingsButton: {
    description: 'Close settings panel',
  },
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
    labels: ['none', '-cont'],
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
    description: 'Maximum number of annotations to display (large numbers may slow mei-friend)',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: 'Facsimile panel',
    description: 'Show the facsimile images of the source edition, if available',
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

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'Editor Settings',
  },
  cmReset: {
    text: 'Default',
    description: 'Reset to mei-friend defaults',
  },
  titleAppearance: {
    title: 'Editor appearance',
    description: 'Controls the appearance of the editor',
  },
  zoomFont: {
    title: 'Font size (%)',
    description: 'Change font size of editor (in percent)',
  },
  theme: {
    title: 'Theme',
    description: 'Select the theme of the editor',
  },
  matchTheme: {
    title: 'Notation matches theme',
    description: 'Match notation to editor color theme',
  },
  tabSize: {
    title: 'Indentation size',
    description: 'Number of space characters for each indentation level',
  },
  lineWrapping: {
    title: 'Line wrapping',
    description: 'Whether or not lines are wrapped at end of panel',
  },
  lineNumbers: {
    title: 'Line numbers',
    description: 'Show line numbers',
  },
  firstLineNumber: {
    title: 'First line number',
    description: 'Set first line number',
  },
  foldGutter: {
    title: 'Code folding',
    description: 'Enable code folding through fold gutters',
  },
  titleEditorOptions: {
    title: 'Editor behavior',
    description: 'Controls the behavior of the editor',
  },
  autoValidate: {
    title: 'Auto validation',
    description: 'Validate encoding against schema automatically after each edit',
  },
  autoCloseBrackets: {
    title: 'Auto close brackets',
    description: 'Automatically close brackets at input',
  },
  autoCloseTags: {
    title: 'Auto close tags',
    description: 'Automatically close tags at input',
    type: 'bool',
  },
  matchTags: {
    title: 'Match tags',
    description: 'Highlights matched tags around editor cursor',
  },
  showTrailingSpace: {
    title: 'Highlight trailing spaces',
    description: 'Highlights unnecessary trailing spaces at end of lines',
  },
  keyMap: {
    title: 'Key map',
    description: 'Select key map',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Verovio Settings',
  },
  vrvReset: {
    text: 'Default',
    description: 'Reset Verovio to mei-friend defaults',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      'It seems that you are using Safari as your browser, on which ' +
      'mei-friend unfortunately does not currently support schema validation. ' +
      'Please use another browser for full validation support.',
  },
  githubLoggedOutWarning: {
    text: `You have logged out of mei-friend's GitHub integration, but your browser is still logged in to GitHub!
      <a href="https://github.com/logout" target="_blank">Click here to logout from GitHub</a>.`,
  },
  generateUrlError: {
    text: 'Cannot generate URL for local file ',
  },
  generateUrlSuccess: {
    text: 'URL successfully copied to clipboard',
  },
  generateUrlNotCopied: {
    text: 'URL not copied to clipboard, please try again!',
  },
  errorCode: { text: 'Error Code' },
  submitBugReport: { text: 'Submit bug report' },
  loadingSchema: { text: 'Loading Schema' },
  schemaLoaded: { text: 'Schema loaded' },
  noSchemaFound: { text: 'No schema information found in MEI.' },
  schemaNotFound: { text: 'Schema not found' },
  errorLoadingSchema: { text: 'Error at loading schema' },
  notValidated: { text: 'Not validated. Press here to validate.' },
  validatingAgainst: { text: 'Validating against' },
  validatedAgainst: { text: 'Validated against' },
  validationMessages: { text: 'validation messages' },
  validationComplete: { text: 'Validation complete' },
  validationFailed: { text: 'Validation failed' },
  noErrors: { text: 'no errors' },
  errorsFound: { text: 'errors found' }, // 5 errors found

  // github-menu.js
  repository: { text: 'Repository' },
  branch: { text: 'Branch' },
  path: { text: 'Path' },
  commit: { text: 'Commit' },
  commitLog: { text: 'Commit log' },
  commitAsNewFile: { text: 'Commit as new file' },
  date: { text: 'Date' },
  author: { text: 'Author' },
  message: { text: 'Message' },
  none: { text: 'None' },
  fileName: { description: 'File name' },
  forkRepository: { text: 'Fork repository' },
  forkError: { text: 'Sorry, could not fork repository' },
  loadingFile: { text: 'Loading file' },
  loadingFromGithub: { text: 'Loading from Github' },
  logOut: { text: 'Log out' },
  githubLogout: { text: 'Log out' },
  selectRepository: { text: 'Select repository' },
  selectBranch: { text: 'Select branch' },
  commitPlaceholder: { text: 'Updated using mei-friend online' },
  reportIssueWithEncoding: { text: 'Report issue with encoding' },
  clickToOpenInMeiFriend: { text: 'Click to open in mei-friend' },
  repoAccessError: { text: 'Sorry, cannot access repositories for supplied user or organisation' },
  allComposers: { text: 'All composers' }, // fork-repository.js

  // utils renumber measures
  renumberMeasuresModalText: { text: 'Renumber measures' },
  renumberMeasuresModalTest: { text: 'Test' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'would be' },
  renumberMeasuresChangedTo: { text: 'changed to' },
  renumberMeasureMeasuresRenumbered: { text: 'measures renumbered' },
};
