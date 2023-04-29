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

  // Footer texts/ Testi di piè di pagina
  leftFooter: {
    html:
      'Ospitato da <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'a <a href="https://mdw.ac.at">mdw</a>, con ' +
      heart +
      ' da Vienna. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Imprint</a>.',
  },
  loadingVerovio: { text: 'Caricamento Verovio' },
  verovioLoaded: { text: 'caricato' },
  convertedToPdf: { text: 'convertito in PDF' },
  statusBarCompute: { text: 'Calcola' },
  middleFooterPage: { text: 'pagina' },
  middleFooterOf: { text: 'di' },
  middleFooterLoaded: { text: 'caricato' },

  // control menu/ menu di controllo
  verovioIcon: {
    description: `attività del worker di mei-friend: 
    la rotazione in senso orario indica l'attività di Verovio, 
    la velocità di rotazione in senso antiorario indica l'attività del worker`,
  },
  decreaseScaleButton: { description: 'Riduci notazione' },
  verovioZoom: { description: 'Scala dimensioni della notazione' },
  increaseScaleButton: { description: 'Aumenta notazione' },
  pagination1: { html: 'Pagina ' },
  pagination3: { html: ' di' },
  sectionSelect: { description: 'Naviga la struttura di sezione/finale codificata' },
  firstPageButton: { description: 'Vai alla prima pagina' },
  previousPageButton: { description: 'Vai alla pagina precedente' },
  paginationLabel: {
    description: 'Navigazione della pagina: fai clic per inserire manualmente il numero di pagina da visualizzare',
  },
  nextPageButton: { description: 'Vai alla pagina successiva' },
  lastPageButton: { description: "Vai all'ultima pagina" },
  flipCheckbox: { description: 'Passa automaticamente alla posizione del cursore di codifica' },
  flipButton: { description: 'Passa manualmente alla posizione del cursore di codifica' },
  breaksSelect: { description: 'Definisci il comportamento degli intervalli/pagine di sistema nella notazione' },
  breaksSelectNone: { text: 'Nessuno' },
  breaksSelectAuto: { text: 'Automatico' },
  breaksSelectMeasure: { text: 'Misura' },
  breaksSelectLine: { text: 'Sistema' },
  breaksSelectEncoded: { text: 'Sistema e pagina' },
  breaksSelectSmart: { text: 'Intelligente' },
  updateControlsLabel: {
    text: 'Aggiorna',
    description: 'Aggiorna il comportamento di controllo della notazione dopo le modifiche nella codifica',
  },
  liveUpdateCheckbox: { description: 'Aggiorna automaticamente la notazione dopo le modifiche nella codifica' },
  codeManualUpdateButton: { description: 'Aggiorna manualmente la notazione' },
  engravingFontSelect: { description: 'Seleziona il carattere di incisione' },
  backwardsButton: { description: 'Vai a sinistra nella notazione' },
  forwardsButton: { description: 'Vai a destra nella notazione' },
  upwardsButton: { description: "Naviga verso l'alto nella notazione" },
  downwardsButton: { description: 'Naviga verso il basso nella notazione' },
  speedLabel: {
    text: 'Modalità di velocità',
    description:
      'In modalità di velocità, solo la pagina corrente viene inviata a Verovio per ridurre i tempi di rendering con file di grandi dimensioni',
  },

  // PDF/print preview panel / Pannello di anteprima PDF/stampa
  pdfSaveButton: { text: 'Salva PDF', description: 'Salva come PDF' },
  pdfCloseButton: { description: 'Chiudi vista di stampa' },
  pagesLegendLabel: { text: 'Intervallo di pagine', singlePage: 'pagina', multiplePages: 'Pagine' },
  selectAllPagesLabel: { text: 'Tutte' },
  selectCurrentPageLabel: { text: 'Pagina corrente' },
  selectFromLabel: { text: 'da:' },
  selectToLabel: { text: 'a:' },
  selectPageRangeLabel: { text: 'Intervallo di pagine:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Solo la pagina corrente viene renderizzata in PDF, poiché è attivata la modalità di velocità. ' +
      'Deseleziona la modalità di velocità per selezionare tutte le pagine.',
  },
  pdfPreviewNormalModeTitle: { text: "Seleziona l'intervallo di pagine da salvare in PDF." },

  // facsimile panel/ pannello facsimile
  facsimileIcon: { description: 'Pannello facsimile' },
  facsimileDecreaseZoomButton: { description: "Riduci l'immagine della notazione" },
  facsimileZoom: { description: "Regola la dimensione dell'immagine della notazione" },
  facsimileIncreaseZoomButton: { description: "Ingrandisci l'immagine della notazione" },
  facsimileFullPageLabel: {
    text: 'Pagina intera',
    description: "Mostra l'intera pagina dell'immagine del facsimile",
  },
  facsimileFullPageCheckbox: { description: "Mostra l'intera pagina dell'immagine del facsimile" },
  facsimileShowZonesLabel: {
    text: 'Mostra riquadri delle zone',
    description: 'Mostra i riquadri delle zone del facsimile',
  },
  facsimileShowZonesCheckbox: { description: 'Mostra i riquadri delle zone del facsimile' },
  facsimileEditZonesCheckbox: { description: 'Modifica le zone del facsimile' },
  facsimileEditZonesLabel: {
    text: 'Modifica le zone',
    description: 'Modifica le zone del facsimile',
  },
  facsimileCloseButton: { description: 'Chiudi il pannello facsimile' },
  facsimileDefaultWarning: { text: 'Nessun contenuto facsimile da visualizzare.' },
  facsimileNoSurfaceWarning: {
    text: 'Nessun elemento di superficie trovato per questa pagina.\n(Potrebbe mancare un elemento pb iniziale.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Facsimile senza zone visibile solo in modalità pagina intera.' },
  facsimileImgeNotLoadedWarning: { text: "Impossibile caricare l'immagine" },

  // drag'n'drop / trascina e rilascia
  dragOverlayText: { text: 'Trascina il file di input qui.' },

  // public repertoire / repertorio pubblico
  openUrlHeading: { text: "Apri l'encoding ospitato sul Web tramite URL" },
  openUrlInstructions: {
    text: "Scegli tra il repertorio pubblico o inserisci l'URL dell'encoding musicale ospitato sul Web, di seguito. Nota: il server di hosting deve supportare la condivisione di risorse tra origini diverse (CORS).",
  },
  publicRepertoireSummary: { text: 'Repertorio pubblico' },
  sampleEncodingsComposerLabel: { text: 'Compositore:' },
  sampleEncodingsEncodingLabel: { text: 'Encoding:' },
  sampleEncodingsOptionLabel: { text: 'Scegli un encoding...' },
  openUrlButton: { text: 'Apri URL' },
  openUrlCancel: { text: 'Annulla' },
  proposePublicRepertoire: {
    html:
      'Accettiamo proposte per ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'aggiunte al repertorio pubblico' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Scegli un encoding...' },
  openUrlChooseComposerText: { text: 'Scegli un compositore...' },
  openUrlOpenEncodingByUrlText: { text: "Apri l'encoding ospitato sul Web tramite URL" },

  // fork modals / fork modals
  forkRepoGithubText: { text: 'Fork Repository Github' },
  forkRepoGithubExplanation: {
    text: 'Il link che hai seguito ' + 'creerà una fork del seguente repository GitHub per la modifica in mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Va bene?' },
  forkRepositoryInstructions: {
    text:
      'Scegli dal repertorio pubblico o inserisci il nome Github (utente o organizzazione) e il nome del repository di un repository ospitato su Github, qui sotto. ' +
      'La tua repository forked sarà disponibile dal menu di Github.',
  },
  forkRepositoryGithubText: { text: 'Fork Repository Github' },
  forkRepertoireSummary: { text: 'Repertorio pubblico' },
  forkRepertoireComposerLabel: { text: 'Compositore:' },
  forkRepertoireOrganizationLabel: { text: 'Organizzazione:' },
  forkRepertoireOrganizationOption: { text: "Scegli un'organizzazione GitHub..." },
  forkRepertoireRepositoryLabel: { text: 'Repository:' },
  forkRepertoireRepositoryOption: { text: 'Scegli una codifica...' },
  forkRepositoryInputName: { placeholder: 'Nome utente o organizzazione Github' },
  forkRepositoryInputRepoOption: { text: 'Scegli un repository' },
  forkRepositoryToSelectorText: { text: 'Fork a: ' },
  forkRepositoryButton: { text: 'Fork repository' },
  forkRepositoryCancel: { text: 'Annulla' },
  forkProposePublicRepertoire: {
    html:
      'Accettiamo proposte per ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'aggiunte al repertorio pubblico' +
      '</a>.',
  },

  // annotation panel / annotation panel
  annotationCloseButtonText: { text: 'Chiudi pannello di annotazione' },
  hideAnnotationPanelButton: { description: 'Chiudi pannello di annotazione' },
  closeAnnotationPanelButton: { description: 'Chiudi pannello di annotazione' },
  annotationToolsButton: { text: 'Strumenti', description: 'Strumenti di annotazione' },
  annotationListButton: { text: 'Lista', description: 'Elenco delle annotazioni' },
  writeAnnotStandoffText: { text: 'Annotazione Web' },
  annotationToolsHighlightTitle: { text: 'Evidenzia' },
  annotationToolsHighlightSpan: { text: 'Evidenzia' },
  annotationToolsDescribeTitle: { text: 'Descrivi' },
  annotationToolsDescribeSpan: { text: 'Descrivi' },
  annotationToolsLinkTitle: { text: 'Link' },
  annotationToolsLinkSpan: { text: 'Link' },
  listAnnotations: { text: 'Nessuna annotazione presente.' },
  addWebAnnotation: { text: 'Carica annotazione/i Web' },
  loadWebAnnotationMessage: { text: "Inserisci l'URL dell'annotazione Web o del contenitore dell'annotazione Web" },
  loadWebAnnotationMessage1: { text: "Impossibile caricare l'URL fornito" },
  loadWebAnnotationMessage2: { text: 'per favore riprova' },
  noAnnotationsToDisplay: { text: 'Nessuna annotazione da visualizzare' },
  flipPageToAnnotationText: { description: 'Passa alla pagina di questa annotazione' },
  deleteAnnotation: { description: 'Elimina questa annotazione' },
  deleteAnnotationConfirmation: { text: 'Sei sicuro di voler eliminare questa annotazione?' },
  makeStandOffAnnotation: {
    description: 'Stato di stand-off (Web Annotation)',
    descriptionSolid: 'Scrivi su Solid come Web Annotation',
    descriptionToLocal: "Copia l'URI della Web Annotation negli appunti",
  },
  makeInlineAnnotation: {
    description: 'Clicca per annotazione in-linea',
    descriptionCopy: "Copia l'xml:id di <annot> negli appunti",
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'elementi' },
  askForLinkUrl: { text: "Inserisci l'URL a cui collegare" },
  drawLinkUrl: { text: 'Apri in una nuova scheda' },
  askForDescription: { text: 'Inserisci una descrizione testuale da applicare' },
  maxNumberOfAnnotationAlert: {
    text1: 'Il numero di elementi <annot> supera il valore massimo configurabile di "Numero massimo di annotazioni"',
    text2:
      'Nuove annotazioni possono ancora essere generate e saranno visualizzate se "Mostra annotazioni" è attivato.',
  },
  annotationsOutsideScoreWarning: {
    text: 'Spiacente, non è possibile scrivere annotazioni al di fuori del tag <score>',
  },
  annotationWithoutIdWarning: {
    text1: "Impossibile scrivere l'annotazione perché il punto di ancoraggio MEI non ha un xml:id.",
    text2: 'Assegna un identificativo selezionando "Manipola" -> "Rendi il MEI di nuovo con id" e riprova.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Modalità di velocità',
    description:
      "La modalità di velocità è attiva; viene riprodotto solo il MIDI per la pagina corrente. Per riprodurre l'intera codifica, disabilita la modalità di velocità.",
  },
  closeMidiPlaybackControlBarButton: { description: 'Nascondi la barra di controllo della riproduzione MIDI' },

  // mei-friend SETTINGS MENU// MENU IMPOSTAZIONI di mei-friend
  meiFriendSettingsHeader: {
    text: 'Impostazioni di mei-friend',
  },
  mfReset: {
    text: 'Predefinito',
    description: 'Reimposta ai valori predefiniti di mei-friend',
  },
  filterSettings: {
    placeholder: 'Filtra le impostazioni',
    description: 'Digita qui per filtrare le impostazioni',
  },
  closeSettingsButton: {
    description: 'Chiudi il pannello delle impostazioni',
  },
  hideSettingsButton: {
    description: 'Chiudi il pannello delle impostazioni',
  },
  titleGeneral: {
    text: 'Generale',
    description: 'Impostazioni generali di mei-friend',
  },
  selectToolkitVersion: {
    text: 'Versione di Verovio',
    description:
      'Seleziona la versione del toolkit Verovio ' +
      '(*Passare a versioni precedenti alla 3.11.0 ' +
      'potrebbe richiedere un aggiornamento a causa di problemi di memoria.)',
  },
  toggleSpeedMode: {
    text: 'Modalità di velocità',
    description:
      'Attiva/Disattiva la modalità di velocità di Verovio. ' +
      'In modalità di velocità, solo la pagina corrente ' +
      'viene inviata a Verovio per ridurre il tempo di rendering ' +
      'con file di grandi dimensioni',
  },
  selectIdStyle: {
    text: 'Stile degli xml:id generati',
    description:
      'Stile degli xml:id appena generati (gli xml:id esistenti non vengono modificati)' +
      'ad esempio, originale di Verovio: "note-0000001318117900", ' +
      'base 36 di Verovio: "nophl5o", ' +
      'stile di mei-friend: "note-ophl5o"',
  },
  addApplicationNote: {
    text: "Inserisci dichiarazione dell'applicazione",
    description:
      "Inserisci una dichiarazione dell'applicazione nell'intestazione MEI, identificando" +
      "nome dell'applicazione, versione, data della prima e ultima modifica",
  },
  selectLanguage: {
    text: 'Lingua',
    description: "Seleziona la lingua dell'interfaccia di mei-friend.",
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
