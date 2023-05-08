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
    text: 'Impostazioni',
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

  // Drag select / Selezione tramite trascinamento
  dragSelection: {
    text: 'Selezione tramite trascinamento',
    description: 'Seleziona gli elementi nella notazione con il trascinamento del mouse',
  },
  dragSelectNotes: {
    text: 'Seleziona le note',
    description: 'Seleziona le note',
  },
  dragSelectRests: {
    text: 'Seleziona le pause',
    description: 'Seleziona le pause e le ripetizioni (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Seleziona gli elementi di posizionamento',
    description:
      'Seleziona gli elementi di posizionamento (cioè con un attributo @placement: ' +
      att.attPlacement.join(', ') +
      ')',
  },
  dragSelectSlurs: {
    text: 'Seleziona le legature',
    description:
      "Seleziona le legature (cioè gli elementi con l'attributo @curvature: " + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Seleziona le misure',
    description: 'Seleziona le misure',
  },

  // Control menu / Menu di controllo
  controlMenuSettings: {
    text: 'Barra di controllo della notazione',
    description: 'Definisci gli elementi da mostrare nel menu di controllo sopra la notazione',
  },
  controlMenuFlipToPageControls: {
    text: 'Mostra i controlli per girare la pagina',
    description: 'Mostra i controlli per girare la pagina nel menu di controllo della notazione',
  },
  controlMenuUpdateNotation: {
    text: "Mostra i controlli per l'aggiornamento della notazione",
    description:
      'Mostra i controlli per il comportamento di aggiornamento della notazione nel menu di controllo della notazione',
  },
  controlMenuFontSelector: {
    text: 'Mostra il selettore del carattere di notazione',
    description: 'Mostra il selettore del carattere di notazione (SMuFL) nel menu di controllo della notazione',
  },
  controlMenuNavigateArrows: {
    text: 'Mostra le frecce di navigazione',
    description: 'Mostra le frecce di navigazione nella notazione nel menu di controllo della notazione',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Mostra la casella di controllo della modalità di velocità',
    description: 'Mostra la casella di controllo della modalità di velocità nel menu di controllo della notazione',
  },

  // MIDI Playback / Riproduzione MIDI
  titleMidiPlayback: {
    text: 'Riproduzione MIDI',
    description: 'Impostazioni riproduzione MIDI',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Mostra scorciatoia riproduzione',
    description:
      "Fa apparire una scorciatoia (una bolla nell'angolo in basso a sinistra; " +
      'clicca per avviare immediatamente la riproduzione) quando la barra di controllo della riproduzione MIDI è chiusa',
  },
  showMidiPlaybackControlBar: {
    text: 'Mostra barra di controllo riproduzione MIDI',
    description: 'Mostra barra di controllo riproduzione MIDI',
  },
  scrollFollowMidiPlayback: {
    text: 'Scorrimento segui riproduzione MIDI',
    description: 'Scorri il pannello di notazione per seguire la riproduzione MIDI sulla pagina corrente',
  },
  pageFollowMidiPlayback: {
    text: 'Pagina segue riproduzione MIDI',
    description: 'Passa automaticamente alle pagine per seguire la riproduzione MIDI',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Evidenzia note attualmente suonate',
    description:
      'Evidenzia visivamente le note attualmente suonate nel pannello di notazione durante la riproduzione MIDI',
  },

  // Transposition // Trasposizione
  titleTransposition: {
    text: 'Trasposizione',
    description: 'Trasponi informazioni di punteggio',
  },
  enableTransposition: {
    text: 'Abilita la trasposizione',
    description:
      'Abilita le impostazioni di trasposizione, da applicare tramite il pulsante di trasposizione sottostante. La trasposizione verrà applicata solo alla notazione, la codifica rimane inalterata, a meno che non si clicchi su "Rerender via Verovio" nel menu a discesa "Manipulate".',
  },
  transposeInterval: {
    text: 'Trasponi per intervallo',
    description:
      'Trasponi la codifica per intervallo cromatico attraverso gli intervalli più comuni (Verovio supporta il sistema base-40)',
    labels: [
      'Unisono Perfetto',
      'Unisono Aumentato',
      'Seconda diminuita',
      'Seconda minore',
      'Seconda maggiore',
      'Seconda aumentata',
      'Terza diminuita',
      'Terza minore',
      'Terza maggiore',
      'Terza aumentata',
      'Quarta diminuita',
      'Quarta Perfetta',
      'Quarta aumentata',
      'Quinta diminuita',
      'Quinta Perfetta',
      'Quinta aumentata',
      'Sesta diminuita',
      'Sesta minore',
      'Sesta maggiore',
      'Sesta aumentata',
      'Settima diminuita',
      'Settima minore',
      'Settima maggiore',
      'Settima aumentata',
      'Ottava diminuita',
      'Ottava Perfetta',
    ],
  },
  transposeKey: {
    text: 'Trasponi per tonalità',
    description: 'Trasponi per tonalità',
    labels: [
      'Do# maggiore / La# minore',
      'Fa# maggiore / Re# minore',
      'Si maggiore / Sol# minore',
      'Mi maggiore / Do# minore',
      'La maggiore / Fa# minore',
      'Re maggiore / Si minore',
      'Sol maggiore / Mi minore',
      'Do maggiore / La minore',
      'Fa maggiore / Re minore',
      'Si♭ maggiore / Sol minore',
      'Mi♭ maggiore / Do minore',
      'La♭ maggiore / Fa minore',
      'Re♭ maggiore / Si♭ minore',
      'Sol♭ maggiore / Mi♭ minore',
      'Do♭ maggiore / La♭ minore',
    ],
  },
  transposeDirection: {
    text: 'Direzione di trasposizione',
    description: 'Direzione di trasposizione (su/giù)',
    labels: ['Su', 'Giù', 'Più vicino'],
  },
  transposeButton: {
    text: 'Trasponi',
    description:
      'Applica la trasposizione con le impostazioni sopra indicate alla notazione, mantenendo invariata la codifica MEI. Per trasporre anche la codifica MEI con le attuali impostazioni, utilizzare "Rerender via Verovio" nel menu a tendina "Manipulate".',
  },

  // Renumber measures / Rinumerazione misure
  renumberMeasuresHeading: {
    text: 'Rinumera misure',
    description: 'Impostazioni per la rinumerazione delle misure',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Continua tra le misure incomplete',
    description: 'Continua i numeri delle misure tra le misure incomplete (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Aggiungi suffisso alle misure incomplete',
    description: 'Aggiungi un suffisso numerico alle misure incomplete (ad esempio, 23-cont)',
    labels: ['nessuno', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Continua tra le chiusure',
    description: 'Continua i numeri delle misure tra le chiusure',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Aggiungi suffisso alle chiusure',
    description: 'Aggiungi un suffisso numerico alle chiusure (ad esempio, 23-a)',
  },

  // Annotations / Annotazioni
  titleAnnotations: {
    text: 'Annotazioni',
    description: 'Impostazioni delle annotazioni',
  },
  showAnnotations: {
    text: 'Mostra annotazioni',
    description: 'Mostra le annotazioni nella notazione',
  },
  showAnnotationPanel: {
    text: 'Mostra pannello annotazioni',
    description: 'Mostra il pannello delle annotazioni',
  },
  annotationDisplayLimit: {
    text: 'Numero massimo di annotazioni',
    description: 'Numero massimo di annotazioni da visualizzare (numeri elevati possono rallentare mei-friend)',
  },

  // Facsimile / Facsimile
  titleFacsimilePanel: {
    text: 'Pannello di facsimile',
    description: "Mostra le immagini di facsimile dell'edizione originale, se disponibili",
  },
  showFacsimilePanel: {
    text: 'Mostra il pannello di facsimile',
    description: "Mostra le immagini dello spartito dell'edizione originale fornite nell'elemento di facsimile",
  },
  selectFacsimilePanelOrientation: {
    text: 'Posizione del pannello di facsimile',
    description: 'Seleziona la posizione del pannello di facsimile rispetto alla notazione',
    labels: ['sinistra', 'destra', 'alto', 'basso'],
  },
  facsimileZoomInput: {
    text: 'Zoom immagine di facsimile (%)',
    description: "Livello di zoom dell'immagine di facsimile (in percentuale)",
  },
  showFacsimileFullPage: {
    text: 'Mostra pagina intera',
    description: "Mostra l'immagine di facsimile su tutta la pagina",
  },
  showFacsimileZones: {
    text: 'Mostra le zone del facsimile',
    description: 'Mostra le zone di delimitazione del facsimile',
  },
  editFacsimileZones: {
    text: 'Modifica le zone del facsimile',
    description: 'Modifica le zone del facsimile (collegando le zone delimitate ai facsimile)',
  },

  // Supplied element // Supplied element
  titleSupplied: {
    text: 'Gestisci il contenuto editoriale',
    description: 'Controlla la gestione degli elementi <supplied>',
  },
  showSupplied: {
    text: 'Mostra gli elementi <supplied>',
    description: "Evidenzia tutti gli elementi contenuti nell'elemento <supplied>",
  },
  suppliedColor: {
    text: "Seleziona il colore per l'evidenziazione di <supplied>",
    description: "Seleziona il colore per l'evidenziazione di <supplied>",
  },
  respSelect: {
    text: 'Seleziona la responsabilità di <supplied>',
    description: "Seleziona l'id della responsabilità",
  },

  // EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: "Impostazioni dell'editor",
  },
  cmReset: {
    text: 'Predefinito',
    description: 'Reimposta alle impostazioni predefinite di mei-friend',
  },
  titleAppearance: {
    text: "Aspetto dell'editor",
    description: "Controlla l'aspetto dell'editor",
  },
  zoomFont: {
    text: 'Dimensione del carattere (%)',
    description: "Cambia la dimensione del carattere dell'editor (in percentuale)",
  },
  theme: {
    text: 'Tema',
    description: "Seleziona il tema dell'editor",
  },
  matchTheme: {
    text: 'La notazione corrisponde al tema',
    description: "Corrispondenza della notazione al tema di colore dell'editor",
  },
  tabSize: {
    text: 'Dimensione indentazione',
    description: 'Numero di spazi per ogni livello di indentazione',
  },
  lineWrapping: {
    text: 'Rientro righe',
    description: 'Indica se le righe vengono spezzate a fine pannello',
  },
  lineNumbers: {
    text: 'Numeri di riga',
    description: 'Mostra i numeri di riga',
  },
  firstLineNumber: {
    text: 'Primo numero di riga',
    description: 'Imposta il primo numero di riga',
  },
  foldGutter: {
    text: 'Piegatura codice',
    description: 'Abilita la piegatura del codice attraverso la piega delle linee',
  },
  titleEditorOptions: {
    text: "Comportamento dell'editor",
    description: "Controlla il comportamento dell'editor",
  },
  autoValidate: {
    text: 'Validazione automatica',
    description: 'Valida automaticamente la codifica rispetto allo schema dopo ogni modifica',
  },
  autoCloseBrackets: {
    text: 'Chiusura parentesi automatica',
    description: 'Chiude automaticamente le parentesi quando vengono inserite',
  },
  autoCloseTags: {
    text: 'Chiusura tag automatica',
    description: 'Chiude automaticamente i tag quando vengono inseriti',
    type: 'bool',
  },
  matchTags: {
    text: 'Corrispondenza tag',
    description: "Evidenzia i tag corrispondenti intorno al cursore dell'editor",
  },
  showTrailingSpace: {
    text: 'Evidenzia spazi finali',
    description: 'Evidenzia gli spazi inutili alla fine delle righe',
  },
  keyMap: {
    text: 'Mappa tasti',
    description: 'Seleziona la mappa tasti',
  },

  // Verovio settings / Impostazioni di Verovio
  verovioSettingsHeader: {
    text: 'Impostazioni',
  },
  vrvReset: {
    text: 'Predefinito',
    description: 'Ripristina Verovio ai valori predefiniti di mei-friend',
  },

  // main.js alert messages / messaggi di avviso di main.js
  isSafariWarning: {
    text:
      'Sembra che stai utilizzando Safari come browser, su cui ' +
      'mei-friend attualmente non supporta la validazione dello schema. ' +
      'Per il pieno supporto alla validazione, utilizza un altro browser.',
  },
  githubLoggedOutWarning: {
    text:
      "Hai effettuato il logout dall'integrazione di GitHub di mei-friend, " +
      'ma il tuo browser è ancora connesso a GitHub! ' +
      '<a href="https://github.com/logout" target="_blank">Clicca qui per effettuare il logout da GitHub</a>.',
  },
  generateUrlError: {
    text: "Impossibile generare l'URL per il file locale ",
  },
  generateUrlSuccess: {
    text: 'URL copiato negli appunti con successo',
  },
  generateUrlNotCopied: {
    text: 'URL non copiato negli appunti, riprova!',
  },
  errorCode: { text: 'Codice errore' },
  submitBugReport: { text: 'Invia segnalazione di bug' },
  loadingSchema: { text: 'Caricamento schema' },
  schemaLoaded: { text: 'Schema caricato' },
  noSchemaFound: { text: 'Nessuna informazione di schema trovata in MEI.' },
  schemaNotFound: { text: 'Schema non trovato' },
  errorLoadingSchema: { text: 'Errore nel caricamento dello schema' },
  notValidated: { text: 'Non validato. Premere qui per validare.' },
  validatingAgainst: { text: 'Validazione contro' },
  validatedAgainst: { text: 'Validato contro' },
  validationMessages: { text: 'messaggi di validazione' },
  validationComplete: { text: 'Validazione completa' },
  validationFailed: { text: 'Validazione fallita' },
  noErrors: { text: 'nessun errore' },
  errorsFound: { text: 'errori trovati' }, // 5 errori trovati

  // github-menu.js / github-menu.js
  repository: { text: 'Repository' },
  branch: { text: 'Ramo' },
  path: { text: 'Percorso' },
  commit: { text: 'Commit' },
  commitLog: { text: 'Registro commit' },
  commitAsNewFile: { text: 'Commit come nuovo file' },
  date: { text: 'Data' },
  author: { text: 'Autore' },
  message: { text: 'Messaggio' },
  none: { text: 'Nessuno' },
  fileName: { description: 'Nome del file' },
  forkRepository: { text: 'Fork del repository' },
  forkError: { text: 'Spiacenti, non è possibile eseguire il fork del repository' },
  loadingFile: { text: 'Caricamento file' },
  loadingFromGithub: { text: 'Caricamento da Github' },
  logOut: { text: 'Esci' },
  githubLogout: { text: 'Esci' },
  selectRepository: { text: 'Seleziona repository' },
  selectBranch: { text: 'Seleziona ramo' },
  commitPlaceholder: { text: 'Aggiornato usando mei-friend online' },
  reportIssueWithEncoding: { text: 'Segnala problema di codifica' },
  clickToOpenInMeiFriend: { text: 'Clicca per aprire in mei-friend' },
  repoAccessError: {
    text: "Spiacenti, non è possibile accedere ai repository per l'utente o l'organizzazione forniti",
  },
  allComposers: { text: 'Tutti i compositori' }, // fork-repository.js

  // utils renumber measures
  renumberMeasuresModalText: { text: 'Rinumera misure' },
  renumberMeasuresModalTest: { text: 'Test' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'sarebbe' },
  renumberMeasuresChangedTo: { text: 'cambiato in' },
  renumberMeasureMeasuresRenumbered: { text: 'misure rinumerate' },
};
