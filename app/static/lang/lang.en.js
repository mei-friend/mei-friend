/**
 * Language file for English
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'About mei-friend ' },
  showSplashScreen: {
    text: 'Show splash screen on load',
    description: 'Show the mei-friend splash screen when the application is loaded',
  },
  splashBody: {
    html: `
      <p>
        mei-friend is an editor for <a href="https://music-encoding.org">music encodings</a>, hosted at the
        <a href="https://mdw.ac.at" target="_blank">mdw &ndash; University of Music and Performing Arts Vienna</a>. 
        Please consult our <a href="https://mei-friend.github.io" target="_blank">extensive documentation</a> for 
        further information.
      </p>
      <p>
        Though mei-friend is a browser-based application, your personal data (including the encoding you
        are editing, your application settings, and current login details if any) are stored in your browser's
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"
          >local storage</a
        > and are not transmitted to or stored on our servers.
      </p>
      <p>
        Data is transmitted to GitHub only when you explicitly request it (e.g., when you log in to GitHub, load
        your encoding from or commit to a GitHub repository, or when you request a GitHub Action workflow to be
        run for you). Similarly, data is transmitted to your chosen Solid provider only when you explicitly
        request it (e.g., when you log in to Solid, or load or save stand-off annotations).
      </p>
      <p>
        We use <a href="https://matomo.org/" target="_blank">Matomo</a>
        to collect anonymous usage statistics. These include your truncated IP address (permitting geolocation on
        the country level but no further identification), your browser and operating system, where you arrived
        from (i.e., the referring website), the time and duration of your visit, and the pages you visited. This
        information is stored on the Matomo instance running on servers of the mdw &ndash; University of Music and
        Performing Arts Vienna, and is not shared with any third party.
      </p>
      <p>
        Lute tablatures are converted to MEI using 
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a> developed by Paul Overell, 
        via the <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui service</a> 
        developed by Stefan Szepe and <a href="https://luteconv.mdw.ac.at" target="_blank">hosted by the mdw</a>. 
        This service creates Web-accessible copies of your encodings as part of the conversion process, but these are 
        accessible only via a unique link hash value, and are periodically deleted. 
      </p>
      <p>
        The Verovio toolkit is loaded from <a href="https://verovio.org" target="_blank">https://verovio.org</a>, hosted by
        <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
        This allows mei-friend to stay up-to-date with the latest toolkit version and
        to provide the choice of all supported versions through the settings panel. 
        When using mei-friend, your IP address is therefore visible by RISM Digital.
      </p>
      <p>
        Finally, MIDI playback is presented using the SGM_plus sound font provided by Google Magenta, and served
        via googleapis.com. Your IP address is therefore visible to Google when initiating MIDI playback. If you 
        do not wish for this to happen, please refrain from using the MIDI playback feature.
      </p>
      <p>
        mei-friend is developed by
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> and
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> at the Department of Music
        Acoustics &ndash; Wiener Klangstil at the mdw &ndash; University of Music and Performing Arts Vienna, and
        is licensed under the
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
          >GNU Affero General Public License v3.0</a
        >. Please consult our
        <a href="https://mei-friend.github.io/about/" target="_blank">acknowledgements page</a> for further
        information about contributors and the open-source components reused within our project. We thank our
        colleagues for their contributions and guidance.
      </p>
      <p>
        Development of the mei-friend Web application is funded by the
        <a href="https://fwf.ac.at" target="_blank">Austrian Science Fund (FWF)</a> under projects
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
          >P 34664-G (Signature Sound Vienna)</a
        >
        and <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
      </p>`,
  },
  splashGotItButtonText: { text: 'Got it!' },
  splashVersionText: { text: 'Version' },
  splashAlwaysShow: {
    text: 'Always show this splash screen',
    description: 'Always show this splash screen on application load',
  },
  splashAlwaysShowLabel: {
    text: 'Always show this splash screen',
    description: 'Always show this splash screen on application load',
  },

  // Main menu bar
  githubLoginLink: { text: 'Login' },

  month: {
    jan: 'January',
    feb: 'February',
    mar: 'March',
    apr: 'April',
    may: 'May',
    jun: 'June',
    jul: 'July',
    aug: 'August',
    sep: 'September',
    oct: 'October',
    nov: 'November',
    dec: 'December',
  },

  // FILE MENU ITEM
  fileMenuTitle: { text: 'File' },
  openMeiText: { text: 'Open file' },
  openUrlText: { text: 'Open URL' },
  openExample: {
    text: 'Public repertoire',
    description: 'Open a list of public-domain repertoire',
  },
  importMusicXml: { text: 'Import MusicXML' },
  importHumdrum: { text: 'Import Humdrum' },
  importPae: { text: 'Import PAE, ABC' },
  saveMeiText: { text: 'Save MEI' },
  saveMeiBasicText: { text: 'Save as MEI Basic' },
  saveSvg: { text: 'Save SVG' },
  saveMidi: { text: 'Save MIDI' },
  printPreviewText: { text: 'Preview PDF' },
  generateUrlText: { text: 'Generate mei-friend URL' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Code' },
  undoMenuText: { text: 'Undo' },
  redoMenuText: { text: 'Redo' },
  startSearchText: { text: 'Search' },
  findNextText: { text: 'Find next' },
  findPreviousText: { text: 'Find previous' },
  replaceMenuText: { text: 'Replace' },
  replaceAllMenuText: { text: 'Replace all' },
  indentSelectionText: { text: 'Indent selection' },
  surroundWithTagsText: { text: 'Surround with tags' },
  surroundWithLastTagText: { text: 'Surround with ' },
  jumpToLineText: { text: 'Jump to line' },
  toMatchingTagText: { text: 'Go to matching tag' },
  manualValidateText: { text: 'Validate' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'View' },
  notationTop: { text: 'Notation top' },
  notationBottom: { text: 'Notation bottom' },
  notationLeft: { text: 'Notation left' },
  notationRight: { text: 'Notation right' },
  showSettingsMenuText: { text: 'Settings panel' },
  showAnnotationMenuText: { text: 'Annotations panel' },
  showFacsimileMenuText: { text: 'Facsimile panel' },
  showPlaybackControlsText: { text: 'Playback controls' },
  facsimileTop: { text: 'Facsimile top' },
  facsimileBottom: { text: 'Facsimile bottom' },
  facsimileLeft: { text: 'Facsimile left' },
  facsimileRight: { text: 'Facsimile right' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Manipulate' },
  invertPlacementText: { text: 'Invert placement' },
  betweenPlacementText: { text: 'Between placement' },
  addVerticalGroupText: { text: 'Add vertical group' },
  deleteText: { text: 'Delete element' },
  pitchChromUpText: { text: 'Pitch chromatically up' },
  pitchChromDownText: { text: 'Pitch chromatically down' },
  pitchUpDiatText: { text: 'Pitch diatonically up' },
  pitchDownDiatText: { text: 'Pitch diatonically down' },
  pitchOctaveUpText: { text: 'Pitch 1 octave up' },
  pitchOctaveDownText: { text: 'Pitch 1 octave down' },
  staffUpText: { text: 'Element 1 staff up' },
  staffDownText: { text: 'Element 1 staff down' },
  increaseDurText: { text: 'Increase duration' },
  decreaseDurText: { text: 'Decrease duration' },
  toggleDotsText: { text: 'Toggle dotting' },
  cleanAccidText: { text: 'Check @accid.ges' },
  renumberMeasuresTestText: { text: ' Renumber measures (test)' },
  renumberMeasuresExecText: { text: ' Renumber measures (exec)' },
  addIdsText: { text: 'Add ids to MEI' },
  removeIdsText: { text: 'Remove ids from MEI' },
  reRenderMeiVerovio: { text: ' Rerender via Verovio' },
  addFacsimile: { text: 'Add facsimile element' },
  ingestFacsimileText: { text: 'Ingest facsimile' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Insert' },
  addNoteText: { text: 'Add note' },
  convertNoteToRestText: { text: 'Note(s) <=> rest(s)' },
  toggleChordText: { text: 'Note(s) <=> chord' },
  addDoubleSharpText: { html: 'Double sharp &#119082;' },
  addSharpText: { html: 'Sharp &#9839;' },
  addNaturalText: { html: 'Natural &#9838;' },
  addFlatText: { html: 'Flat &#9837;' },
  addDoubleFlatText: { html: 'Double flat &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Directive' },
  addDynamicsText: { text: 'Dynamics' },
  addSlurText: { text: 'Slur' },
  addTieText: { text: 'Tie' },
  addCrescendoHairpinText: { text: 'Crescendo hairpin' },
  addDiminuendoHairpinText: { text: 'Diminuendo hairpin' },
  addBeamText: { text: 'Beam' },
  addBeamSpanText: { text: 'Beamspan' },
  addArpeggioText: { text: 'Arpeggio' },
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
  goToHelpPageText: { text: 'mei-friend help pages' },
  goToCheatSheet: { text: 'mei-friend cheat sheet' },
  showChangelog: { text: 'mei-friend changelog' },
  goToGuidelines: { text: 'MEI Guidelines' },
  consultGuidelinesForElementText: { text: "Guidelines' entry for current element" },
  provideFeedback: { text: 'Provide feedback' },
  resetDefault: { text: 'Reset to default' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Toggle MIDI Playback Control Bar' },
  showFacsimileButton: { description: 'Toggle Facsimile Panel' },
  showAnnotationsButton: { description: 'Toggle Annotations Panel' },
  showSettingsButton: { description: 'Show Settings Panel' },

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

  // Control menu
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
  choiceSelect: { description: 'Choose displayed content for choice elements' },
  choiceDefault: { text: '(default choice)' },
  noChoice: { text: '(no choice available)' },
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

  // Facsimile panel
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

  // Drag'n'drop
  dragOverlayText: { text: 'Drag your input file here.' },

  // Public repertoire
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

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Request GitHub Action workflow:' },
  githubActionsDescription: {
    text: 'Click on "Run workflow" to ask the GitHub API to run the above workflow for you, using the input configuration specified below. Your encoding will be reloaded in its latest version once the workflow run completes. ',
  },
  githubActionStatusMsgPrompt: { text: 'Could not run workflow - GitHub says' },
  githubActionStatusMsgWaiting: { text: 'Please be patient while GitHub is processing your workflow...' },
  githubActionStatusMsgFailure: { text: 'Could not run workflow - GitHub says' },
  githubActionStatusMsgSuccess: { text: 'Workflow run completed - GitHub says' },
  githubActionsRunButton: { text: 'Run workflow' },
  githubActionsRunButtonReload: { text: 'Reload MEI file' },
  githubActionsCancelButton: { text: 'Cancel' },
  githubActionsInputSetterFilepath: { text: 'Copy current file path to input' },
  githubActionsInputSetterSelection: { text: 'Copy current MEI selection to input' },
  githubActionsInputContainerHeader: { text: 'Input configuration' },

  // Fork modals
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

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Enclose with tag name' },
  selectTagNameForEnclosureOkButton: { value: 'OK' },
  selectTagNameForEnclosureCancelButton: { value: 'Cancel' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solid is a decentralised platform for social linked data platform. Log in to Solid to create stand-off annotations using linked data (RDF).',
  },
  solidProvider: { description: 'Please choose a Solid identity provider (IdP) or specify your own.' },
  solidLoginBtn: { text: 'Login' },
  solidOverlayCancel: { html: 'Restoring Solid session - press <span>esc</span> or click here to cancel' },
  solidWelcomeMsg: { text: 'Welcome, ' },
  solidLogout: { text: 'Log out' },
  solidLoggedOutWarning: {
    html: `You have logged out of mei-friend's Solid integration, but your browser is still logged in to Solid!
      <a id="solidIdPLogoutLink" target="_blank">Click here to logout from Solid</a>.`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: 'Close Annotations Panel' },
  hideAnnotationPanelButton: { description: 'Close Annotations Panel' },
  closeAnnotationPanelButton: { description: 'Close Annotations Panel' },
  markupToolsButton: { description: 'Markup tools' },
  annotationToolsButton: { description: 'Annotation tools' },
  annotationListButton: { description: 'List annotations' },
  writeAnnotStandoffText: { text: 'Web Annotation' },
  annotationToolsIdentifyTitle: { text: 'Identify' },
  annotationToolsIdentifySpan: { text: 'Identify Musical Object' },
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
  describeMarkup: { description: 'Describe this markup' },
  deleteMarkup: { description: 'Delete this markup' },
  deleteMarkupConfirmation: { text: 'Are you sure you wish to delete this markup?' },
  deleteAnnotation: { description: 'Delete this annotation' },
  deleteAnnotationConfirmation: { text: 'Are you sure you wish to delete this annotation?' },
  makeStandOffAnnotation: {
    description: 'Stand-off status (RDF)',
    descriptionSolid: 'Write to Solid as RDF',
    descriptionToLocal: 'Open stand-off (RDF) annotation in new tab',
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
  // MARKUP MENU
  respSelect: {
    text: 'Select markup responsibility',
    description: 'Select responsibility id',
  },
  selectionSelect: {
    text: 'Default selection for markup',
    description: 'Choose if newly created markup should enclose the selected elements, articulation or accidentals',
    labels: ['Selected elements','Articulation', 'Accidentals'],
    valuesDescriptions: [
      'Add markup to selected elements.', 
      'Add markup to articulations within selection.', 
      'Add markup to accidentals within selection.'
    ],
  },
  alternativeEncodingsGrp: {
    text: 'Alternative encodings',
    description: 'Markup elements that contain multiple versions.',
  },
  addChoiceText: {
    text: '<choice>',
    description: 'Groups a number of alternative encodings for the same point in a text. ',
  },
  choiceSicCorr: { 
    description: 'Put selection in <sic> and add <corr>.' 
  },
  choiceCorrSic: { 
    description: 'Put selection in <corr> and add <sic>.' 
  },
  choiceOrigReg: { 
    description: 'Put selection in <orig> and add <reg>.' 
  },
  choiceRegOrig: { 
    description: 'Put selection in <reg> and add <orig>.' 
  },
  choiceContentTarget: {
    text: '(select content)',
    description: 'First, select content for this element by hovering over <choice>.',
  },
  addSubstText: {
    text: '<subst>',
    description:
      '(substitution) – Groups transcriptional elements when the combination is to be regarded as a single intervention in the text.',
  },
  substAddDel: { 
    description: 'Put selection in <add> and add <del>.' 
  },
  substDelAdd: { 
    description: 'Put selection in <del> and add <add>.' 
  },
  substContentTarget: {
    text: '(select content)',
    description: 'First, select content for this element by hovering over <subst>.',
  },
  editInterventionsGrp: {
    text: 'Editorial interventions',
    description: 'Markup elements used to encode editorial interventions.',
  },
  addSuppliedText: {
    text: '<supplied>',
    description: 'Contains material supplied by the transcriber or editor for any reason.',
  },
  addUnclearText: {
    text: '<unclear>',
    description:
      'Contains material that cannot be transcribed with certainty because it is illegible or inaudible in the source.',
  },
  addSicText: { text: '<sic>', description: 'Contains apparently incorrect or inaccurate material.' },
  addCorrText: {
    text: '<corr>',
    description: '(correction) – Contains the correct form of an apparent erroneous passage.',
  },
  addOrigText: {
    text: '<orig>',
    description:
      '(original) – Contains material which is marked as following the original, rather than being normalized or corrected.',
  },
  addRegText: {
    text: '<reg>',
    description: '(regularization) – Contains material which has been regularized or normalized in some sense.',
  },
  descMarkupGrp: {
    text: 'Descriptive Markup',
    description: 'Markup elements used to encode interventions in the source material.',
  },
  addAddText: { text: '<add>', description: '(addition) – Marks an addition to the text.' },
  addDelText: {
    text: '<del>',
    description:
      '(deletion) – Contains information deleted, marked as deleted, or otherwise indicated as superfluous or spurious in the copy text by an author, scribe, annotator, or corrector.',
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
    description: 'mei-friend Settings',
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
  selectMidiExpansion: {
    text: 'Playback expansion',
    description: 'Select expansion element to be used for MIDI playback',
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
  showFacsimileTitles: {
    text: 'Show facsimile titles',
    description: 'Show facsimile titles above source images',
  },

  // Supplied element
  titleSupplied: {
    text: 'Handle editorial content',
    description: 'Control handling of editorial markup',
  },
  showMarkup: {
    text: 'Show editorial markup elements',
    description: 'Highlight all elements contained by editorial markup elements',
  },
  markupToPDF: {
    text: 'Show markup in PDF',
    description: 'Show editorial markup in PDF export',
  },
  alternativeVersionContent: {
    text: 'Content alternative encodings',
    description: 'Choose default content of alternative encodings: newly created alternative encodings are empty or copies of the original reading',
    labels: ['empty', 'copy'],
  },
  suppliedColor: {
    text: 'Select <supplied> highlight color',
    description: 'Select <supplied> highlight color',
  },
  unclearColor: {
    text: 'Select <unclear> highlight color',
    description: 'Select <unclear> highlight color',
  },
  sicColor: {
    text: 'Select <sic> highlight color',
    description: 'Select <sic> highlight color',
  },
  corrColor: {
    text: 'Select <corr> highlight color',
    description: 'Select <corr> highlight color',
  },
  origColor: {
    text: 'Select <orig> highlight color',
    description: 'Select <orig> highlight color',
  },
  regColor: {
    text: 'Select <reg> highlight color',
    description: 'Select <reg> highlight color',
  },
  addColor: {
    text: 'Select <add> highlight color',
    description: 'Select <add> highlight color',
  },
  delColor: {
    text: 'Select <del> highlight color',
    description: 'Select <del> highlight color',
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
    text: 'Editor appearance',
    description: 'Controls the appearance of the editor',
  },
  zoomFont: {
    text: 'Font size (%)',
    description: 'Change font size of editor (in percent)',
  },
  theme: {
    text: 'Theme',
    description: 'Select the theme of the editor',
  },
  matchTheme: {
    text: 'Notation matches theme',
    description: 'Match notation to editor color theme',
  },
  tabSize: {
    text: 'Indentation size',
    description: 'Number of space characters for each indentation level',
  },
  lineWrapping: {
    text: 'Line wrapping',
    description: 'Whether or not lines are wrapped at end of panel',
  },
  lineNumbers: {
    text: 'Line numbers',
    description: 'Show line numbers',
  },
  firstLineNumber: {
    text: 'First line number',
    description: 'Set first line number',
  },
  foldGutter: {
    text: 'Code folding',
    description: 'Enable code folding through fold gutters',
  },
  titleEditorOptions: {
    text: 'Editor behavior',
    description: 'Controls the behavior of the editor',
  },
  autoValidate: {
    text: 'Auto validation',
    description: 'Validate encoding against schema automatically after each edit',
  },
  autoShowValidationReport: {
    text: 'Auto show validation report',
    description: 'Show validation report automatically after validation has been performed',
  },
  autoCloseBrackets: {
    text: 'Auto close brackets',
    description: 'Automatically close brackets at input',
  },
  autoCloseTags: {
    text: 'Auto close tags',
    description: 'Automatically close tags at input',
    type: 'bool',
  },
  matchTags: {
    text: 'Match tags',
    description: 'Highlights matched tags around editor cursor',
  },
  showTrailingSpace: {
    text: 'Highlight trailing spaces',
    description: 'Highlights unnecessary trailing spaces at end of lines',
  },
  keyMap: {
    text: 'Key map',
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
      'mei-friend unfortunately does not support schema validation. ' +
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

  // GitHub-menu.js
  githubRepository: { text: 'Repository' },
  githubBranch: { text: 'Branch' },
  githubFilepath: { text: 'Path' },
  githubCommit: { text: 'Commit' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Commit as new file' } }, value: 'Commit' },
  commitLog: { text: 'Commit log' },
  githubDate: { text: 'Date' },
  githubAuthor: { text: 'Author' },
  githubMessage: { text: 'Message' },
  none: { text: 'None' },
  commitFileNameText: { text: 'File name' },
  forkRepository: { text: 'Fork repository' },
  forkError: { text: 'Sorry, could not fork repository' },
  loadingFile: { text: 'Loading file' },
  loadingFromGithub: { text: 'Loading from Github' },
  logOut: { text: 'Log out' },
  githubLogout: { text: 'Log out' },
  selectRepository: { text: 'Select repository' },
  selectBranch: { text: 'Select branch' },
  commitMessageInput: { placeholder: 'Updated using mei-friend online' },
  reportIssueWithEncoding: { value: 'Report issue with encoding' },
  clickToOpenInMeiFriend: { text: 'Click to open in mei-friend' },
  repoAccessError: { text: 'Sorry, cannot access repositories for supplied user or organisation' },
  allComposers: { text: 'All composers' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Renumber measures' },
  renumberMeasuresModalTest: { text: 'Test' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'would be' },
  renumberMeasuresChangedTo: { text: 'changed to' },
  renumberMeasureMeasuresRenumbered: { text: 'measures renumbered' },

  // Code checker @accid.ges
  codeCheckerTitle: { text: 'Check @accid.ges attributes (against key signature, measure-wise accids, and ties).' },
  codeCheckerFix: { text: 'Fix' },
  codeCheckerFixAll: { text: 'Fix all' },
  codeCheckerIgnore: { text: 'Ignore' },
  codeCheckerIgnoreAll: { text: 'Ignore all' },
  codeCheckerCheckingCode: { text: 'Checking code...' },
  codeCheckerNoAccidMessagesFound: { text: 'All accid.ges attributes seem correct.' },
  codeCheckerMeasure: { text: 'Measure' },
  codeCheckerNote: { text: 'Note' },
  codeCheckerHasBoth: { text: 'has both' },
  codeCheckerAnd: { text: 'and' },
  codeCheckerRemove: { text: 'Remove' },
  codeCheckerFixTo: { text: 'Fix to' },
  codeCheckerAdd: { text: 'Add' },
  codeCheckerWithContradictingContent: { text: 'with contradicting content' },
  codeCheckerTiedNote: { text: 'Tied note' },
  codeCheckerNotSamePitchAs: { text: 'not same pitch as' },
  codeCheckerNotSameOctaveAs: { text: 'not same octave as' },
  codeCheckerNotSameAsStartingNote: { text: 'not same as in starting note' },
  codeCheckerExtra: { text: 'extra' }, // superfluous
  codeCheckerHasExtra: { text: 'has extra' }, // has superfluous
  codeCheckerLacksAn: { text: 'lacks an' },
  codeCheckerBecauseAlreadyDefined: { text: 'because it has been defined earlier in the measure' },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: 'mei-friend is unable to scroll to the selected elements in the encoding. Please add ids to the encoding.',
  },
};
