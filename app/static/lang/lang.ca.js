/**
 * Language file for Catalan / Katalanisch
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Pantalla d'inici
  aboutMeiFriend: { text: 'Sobre mei-friend' },
  showSplashScreen: {
    text: "Mostra la pantalla d'inici al carregar",
    description: "Mostra la pantalla d'inici de mei-friend quan es carrega l'aplicació",
  },
  splashUpdateIndicator: {
    html: `
      El text següent s'ha actualitzat des de l'última vegada que vas reconèixer la pantalla d'inici. Per a més detalls, si us plau <a href="${getChangelogUrl()}" target="_blank">consulta el registre de canvis</a>.`,
  },
  splashLastUpdated: { text: 'Text actualitzat per última vegada el: ' },
  splashBody: {
    html: `
      <p>
        mei-friend és un editor per a les <a href="https://music-encoding.org">codificacions musicals</a>, allotjat a
        <a href="https://mdw.ac.at" target="_blank">la Universitat de Música i Arts Escèniques de Viena</a>. 
        Consulta la nostra <a href="https://mei-friend.github.io" target="_blank">documentació extensa</a> per a
        més informació.
      </p>
      <p> 
        Tot i que mei-friend és una aplicació basada en el navegador, les teves dades personals (incloent-hi la codificació que estàs editant, la configuració de l'aplicació i els detalls d'inici de sessió actuals, si n'hi ha) s'emmagatzemen en el <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">emmagatzematge local</a> del teu navegador i no s'emmagatzemen als nostres servidors. 
      </p>
      <p> 
        Les dades es transmeten a GitHub només quan ho sol·licites explícitament (per exemple, quan inicies sessió a GitHub, carregues la teva codificació des d'un repositori de GitHub o hi confirmes canvis, o quan sol·licites que s'executi un flux de treball de GitHub Action per a tu). De la mateixa manera, les dades es transmeten al proveïdor de Solid que hagis triat només quan ho sol·licites explícitament (per exemple, quan inicies sessió a Solid, o carregues o deses anotacions desacoblades). Per raons tècniques, certes interaccions amb GitHub (clonar un repositori al teu navegador quan obres una codificació per primera vegada, o confirmar canvis en un repositori) requereixen que les dades es transmetin a un servidor intermediari allotjat per la mdw – Universitat de Música i Arts Escèniques de Viena. Aquest servidor actua com a intermediari entre el teu navegador i GitHub, i no emmagatzema cap dada transmesa a través seu. 
      </p>
      <p>
        Fem servir <a href="https://matomo.org/" target="_blank">Matomo</a>
        per recopilar estadístiques d'ús anònimes. Aquestes inclouen la teva adreça IP truncada (que permet la geolocalització a
        nivell de país però sense identificació addicional), el teu navegador i sistema operatiu, des d'on has obert la pàgina (és a dir, el
        lloc web de referència), l'hora i durada de la teva visita i les pàgines que hi has visitat. Aquesta informació s'emmagatzema 
        a la instància de Matomo que s'executa als servidors de la Universitat de Música i Arts Escèniques de
        Viena i no es comparteix amb cap tercer.
      </p>
      <p>
        Les tablatures de llaüt es converteixen a MEI utilitzant 
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a> desenvolupat per Paul Overell, 
        a través del servei <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui</a> 
        desenvolupat per Stefan Szepe i <a href="https://luteconv.mdw.ac.at" target="_blank">allotjat per la mdw</a>. 
        Aquest servei crea còpies accessibles a la web de les teves codificacions com a part del procés de conversió, 
        però aquestes només són accessibles a través d'un valor únic de hash d'enllaç i són eliminades periòdicament.
      </p>
      <p>
        La caixa d'eines Verovio es carrega des de <a href="https://verovio.org" target="_blank">https://verovio.org</a>, 
        allotjada per <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
        Això permet a mei-friend de mantenir-se actualitzat amb l'última versió de la caixa d'eines
        i oferir la opció de totes les versions compatibles a través del panell de configuració. 
        Quan utilitzeu mei-friend, la vostra adreça IP és visible per RISM Digital.
      </p>
      <p>
        Finalment, la reproducció MIDI es presenta utilitzant la font de so SGM_plus proporcionada per Google Magenta i
        servida a través de googleapis.com. Per tant, la teva adreça IP és visible per a Google quan s'inicia la reproducció
        MIDI. Si no vols que això passi, abstén-te d'utilitzar la funció de reproducció MIDI.
      </p>
      <p>
        mei-friend està desenvolupat per
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> i
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> al Departament d'Acústica Musical -
        Wiener Klangstil de la Universitat de Música i Arts Escèniques de Viena i està llicenciat sota la
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
          >Llicència Pública General Affero de GNU versió 3.0 (GNU AGPLv3)</a
        >. Consulta la nostra <a href="https://mei-friend.github.io/about/" target="_blank">pàgina d'agraïments</a> per a
        obtenir més informació sobre les persones que hi han col·labort i els components de codi obert reutilitzats en el nostre projecte.
        Agraim als nostres companys i companyes per la seva contribució i orientació.
      </p>
      <p>
        El desenvolupament de l'aplicació web de mei-friend està finançat per 
        <a href="https://fwf.ac.at" target="_blank">Austrian Science Fund (FWF)</a> en els projectes
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
          >P 34664-G (Signature Sound Vienna)</a
        >
        i <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
      </p>
    `,
  },
  splashGotItButtonText: { text: 'Ho he entès!' },
  splashVersionText: { text: 'Versió' },
  splashAlwaysShow: {
    text: "Mostra sempre aquesta pantalla d'inici",
    description: "Mostra sempre aquesta pantalla d'inici al carregar l'aplicació",
  },
  splashAlwaysShowLabel: {
    text: "Mostra sempre aquesta pantalla d'inici",
    description: "Mostra sempre aquesta pantalla d'inici al carregar l'aplicació",
  },

  // Main menu bar
  githubLoginLink: { text: 'Inicia sessió' },

  month: {
    jan: 'Gener',
    feb: 'Febrer',
    mar: 'Març',
    apr: 'Abril',
    may: 'Maig',
    jun: 'Juny',
    jul: 'Juliol',
    aug: 'Agost',
    sep: 'Setembre',
    oct: 'Octubre',
    nov: 'Novembre',
    dec: 'Desembre',
  },

  // FILE MENU ITEM / ELEMENT DEL MENU DE FITXER
  fileMenuTitle: { text: 'Fitxer' },
  openMeiText: { text: 'Obre fitxer' },
  openUrlText: { text: 'Obre URL' },
  openExample: {
    text: 'Repertori públic',
    description: 'Obre una llista de repertori de domini públic',
  },
  importMusicXml: { text: 'Importa MusicXML' },
  importHumdrum: { text: 'Importa Humdrum' },
  importPae: { text: 'Importa PAE, ABC' },
  saveMeiText: { text: 'Desa MEI' },
  saveMeiBasicText: { text: 'Desa com a MEI Basic' },
  saveSvg: { text: 'Desa SVG' },
  saveMidi: { text: 'Desa MIDI' },
  printPreviewText: { text: 'Visualitza PDF' },
  generateUrlText: { text: 'Genera URL de mei-friend' },

  // EDIT/CODE MENU ITEM / ELEMENT DEL MENU D'EDICIÓ/CODI
  editMenuTitle: { text: 'Codi' },
  undoMenuText: { text: 'Desfés' },
  redoMenuText: { text: 'Refés' },
  startSearchText: { text: 'Cerca' },
  findNextText: { text: 'Cerca següent' },
  findPreviousText: { text: 'Cerca anterior' },
  replaceMenuText: { text: 'Reemplaça' },
  replaceAllMenuText: { text: 'Reemplaça-ho tot' },
  indentSelectionText: { text: 'Indentar selecció' },
  surroundWithTagsText: { text: 'Envoltar amb tags' },
  surroundWithLastTagText: { text: 'Envoltar amb ' },
  jumpToLineText: { text: 'Salta a la línia' },
  toMatchingTagText: { text: 'Anar al tag coincident' },
  manualValidateText: { text: 'Valida' },

  // VIEW MENU ITEM / ELEMENT DEL MENU DE VISUALITZACIÓ
  viewMenuTitle: { text: 'Visualització' },
  notationTop: { text: 'Notació a dalt' },
  notationBottom: { text: 'Notació a baix' },
  notationLeft: { text: "Notació a l'esquerra" },
  notationRight: { text: 'Notació a la dreta' },
  showSettingsMenuText: { text: 'Panell de configuració' },
  showAnnotationMenuText: { text: "Panell d'anotacions" },
  showFacsimileMenuText: { text: 'Panell de facsímil' },
  showPlaybackControlsText: { text: 'Controls de reproducció' },
  facsimileTop: { text: 'Facsímil a dalt' },
  facsimileBottom: { text: 'Facsímil a baix' },
  facsimileLeft: { text: "Facsímil a l'esquerra" },
  facsimileRight: { text: 'Facsímil a la dreta' },

  // MANIPULATE MENU ITEM / MANIPULACIÓ DELS ELEMENTS DEL MENÚ
  manipulateMenuTitle: { text: 'Manipula' },
  invertPlacementText: { text: 'Inverteix posició' },
  betweenPlacementText: { text: 'Posició entre' },
  addVerticalGroupText: { text: 'Afegeix grup vertical' },
  deleteText: { text: 'Esborra element' },
  pitchChromUpText: { text: 'Tonalitat cromàtica més alta' },
  pitchChromDownText: { text: 'Tonalitat cromàtica més baixa' },
  pitchUpDiatText: { text: 'Tonalitat diatònica més alta' },
  pitchDownDiatText: { text: 'Tonalitat diatònica més baixa' },
  pitchOctaveUpText: { text: 'Augmenta 1 octava' },
  pitchOctaveDownText: { text: 'Disminueix 1 octava' },
  staffUpText: { text: 'Element 1 pauta amunt' },
  staffDownText: { text: 'Element 1 pauta avall' },
  increaseDurText: { text: 'Augmenta durada' },
  decreaseDurText: { text: 'Disminueix durada' },
  toggleDotsText: { text: 'Afegeix un punt' },
  cleanAccidText: { text: 'Verificar @accid.ges' },
  meterConformanceText: { text: 'Verificar @metcon' },
  renumberMeasuresTestText: { text: 'Reenumera compassos (prova)' },
  renumberMeasuresExecText: { text: 'Reenumera compassos (execució)' },
  addIdsText: { text: 'Afegeix IDs a MEI' },
  removeIdsText: { text: 'Elimina IDs de MEI' },
  reRenderMeiVerovio: { text: 'Torna a renderitzar via Verovio' },
  addFacsimile: { text: 'Afegeix element facsímil' },
  ingestFacsimileText: { text: 'Incorpora facsímil' },

  // INSERT MENU ITEM / INSERCIÓ DELS ELEMENTS DEL MENÚ
  insertMenuTitle: { text: 'Insereix' },
  addNoteText: { text: 'Afegeix nota' },
  convertNoteToRestText: { text: 'Nota(es) <=> silenci(s)' },
  toggleChordText: { text: 'Nota(es) <=> acord' },
  addDoubleSharpText: { html: 'Doble sostingut &#119082;' },
  addSharpText: { html: 'Sostingut &#9839;' },
  addNaturalText: { html: 'Becaire &#9838;' },
  addFlatText: { html: 'Bemoll &#9837;' },
  addDoubleFlatText: { html: 'Doble bemoll &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Anotació de sistema (directive)' },
  addDynamicsText: { text: 'Dinàmica' },
  addSlurText: { text: 'Lligadura (slur)' },
  addTieText: { text: 'Lligadura (tie)' },
  addCrescendoHairpinText: { text: 'Crescendo' },
  addDiminuendoHairpinText: { text: 'Diminuendo' },
  addBeamText: { text: 'Barra (unir pliques)' },
  addBeamSpanText: { text: 'Amplada de la barra' },
  addSuppliedText: { text: 'Afegit (supplied)' },
  addSuppliedArticText: { text: 'Afegit (articulació)' },
  addSuppliedAccidText: { text: 'Afegit (accidentals)' },
  addArpeggioText: { text: 'Arpeggio' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pedal (accionar)' },
  addPedalUpText: { text: 'Pedal (desaccionar)' },
  addTrillText: { text: 'Trinat' },
  addTurnText: { text: 'Grupetto' },
  addTurnLowerText: { text: 'Grupetto invertit' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Mordent superior' },
  addOctave8AboveText: { text: 'Octava (8va per sobre)' },
  addOctave15AboveText: { text: 'Octava (15va per sobre)' },
  addOctave8BelowText: { text: 'Octava (8va per sota)' },
  addOctave15BelowText: { text: 'Octava (15va per sota)' },
  addGClefChangeBeforeText: { text: 'Clau de sol abans' },
  addGClefChangeAfterText: { text: 'Clau de sol després' },
  addFClefChangeBeforeText: { text: 'Clau de fa abans' },
  addFClefChangeAfterText: { text: 'Clau de fa després' },
  addCClefChangeBeforeText: { text: 'Clau de do abans' },
  addCClefChangeAfterText: { text: 'Clau de do després' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Accent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM / ELEMENTS DEL MENÚ D'AJUDA
  helpMenuTitle: { text: 'Ajuda' },
  goToHelpPageText: { text: "Pàgines d'ajuda de mei-friend" },
  goToCheatSheet: { text: 'Full de trucs de mei-friend' },
  showChangelog: { text: 'Mostra el registre de canvis de mei-friend' },
  goToGuidelines: { text: 'Mostra les directrius MEI' },
  consultGuidelinesForElementText: { text: "Consulta les directrius per a l'element actual" },
  provideFeedback: { text: 'Proporciona feedback' },
  resetDefault: { text: 'Restableix per defecte' },

  // panel icons / icones del panell
  showMidiPlaybackControlBarButton: { description: 'Activa/desactiva la barra de control de reproducció MIDI' },
  showFacsimileButton: { description: 'Activa/desactiva el panell del facsímil' },
  showAnnotationsButton: { description: "Activa/desactiva el panell d'anotacions" },
  showSettingsButton: { description: 'Mostra el panell de configuració' },

  // Footer texts // Textos del peu de pàgina
  leftFooter: {
    html:
      'Allotjat per <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'a <a href="https://mdw.ac.at">mdw</a>, amb ' +
      heart +
      ' des de Viena. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Avís legal</a>.',
  },
  loadingVerovio: { text: "S'està carregant Verovio" },
  verovioLoaded: { text: 'carregat' },
  convertedToPdf: { text: 'convertit a PDF' },
  statusBarCompute: { text: 'Calcular' },
  middleFooterPage: { text: 'pàgina' },
  middleFooterOf: { text: 'de' },
  middleFooterLoaded: { text: 'carregat' },

  // control menu / menú de control
  verovioIcon: {
    description: `activitat del worker mei-friend: 
    la rotació en sentit horari indica activitat de Verovio, 
    la velocitat de la rotació en sentit antihorari indica activitat del worker`,
  },
  decreaseScaleButton: { description: 'Disminueix la notació' },
  verovioZoom: { description: 'Escala la grandària de la notació' },
  increaseScaleButton: { description: 'Aumenta la notació' },
  pagination1: { html: 'Pàgina ' },
  pagination3: { html: ' de' },
  sectionSelect: { description: "Navega per l'estructura d'encodings de secció/ending" },
  firstPageButton: { description: 'Ves a la primera pàgina' },
  previousPageButton: { description: 'Ves a la pàgina anterior' },
  paginationLabel: {
    description: 'Navegació per pàgines: fes clic per introduir manualment el número de pàgina que es mostrarà',
  },
  nextPageButton: { description: 'Ves a la següent pàgina' },
  lastPageButton: { description: "Ves a l'última pàgina" },
  flipCheckbox: { description: "Gira automàticament la pàgina fins a la posició del cursor d'encoding" },
  flipButton: { description: "Gira manualment la pàgina fins a la posició del cursor d'encoding" },
  breaksSelect: { description: 'Defineix el comportament de les ruptures de sistema/pàgina de la notació' },
  breaksSelectNone: { text: 'Cap' },
  breaksSelectAuto: { text: 'Automàtic' },
  breaksSelectMeasure: { text: 'Compàs' },
  breaksSelectLine: { text: 'Sistema' },
  breaksSelectEncoded: { text: 'Sistema i pàgina' },
  breaksSelectSmart: { text: 'Intel·ligent' },
  choiceSelect: { description: 'Trieu el contingut mostrat pels elements de selecció' },
  choiceDefault: { text: '(opció per defecte)' },
  noChoice: { text: '(cap opció disponible)' },
  updateControlsLabel: {
    text: 'Actualitzar',
    description: "Comportament d'actualització dels controls de la notació després de canvis en l'encoding",
  },
  liveUpdateCheckbox: { description: 'Actualitza automàticament la notació després de canvis en la codificació' },
  codeManualUpdateButton: { description: 'Actualitza la notació manualment' },
  engravingFontSelect: { description: 'Selecciona la font de gravat' },
  backwardsButton: { description: "Navega a l'esquerra en la notació" },
  forwardsButton: { description: 'Navega a la dreta en la notació' },
  upwardsButton: { description: 'Navega cap amunt en la notació' },
  downwardsButton: { description: 'Navega cap avall en la notació' },
  speedLabel: {
    text: 'Mode de velocitat',
    description:
      'En el mode de velocitat, només esenvia la pàgina actual a Verovio per reduir el temps de renderització amb fitxers grans',
  },

  // PDF/print preview panel / panell de vista prèvia PDF/impressió
  pdfSaveButton: { text: 'Desa PDF', description: 'Desa com a PDF' },
  pdfCloseButton: { description: "Tanca la vista d'impressió" },
  pagesLegendLabel: { text: 'Rang de pàgines', singlePage: 'pàgina', multiplePages: 'pàgines' },
  selectAllPagesLabel: { text: 'Totes' },
  selectCurrentPageLabel: { text: 'Pàgina actual' },
  selectFromLabel: { text: 'de:' },
  selectToLabel: { text: 'a:' },
  selectPageRangeLabel: { text: 'Rang de pàgines:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Només es renderitza la pàgina actual a PDF, perquè el mode de velocitat està activat. ' +
      'Desmarqueu el mode de velocitat per seleccionar totes les pàgines.',
  },
  pdfPreviewNormalModeTitle: { text: 'Seleccioneu el rang de pàgines que voleu desar com a PDF.' },

  // facsimile panel / panell de facsímil
  facsimileIcon: { description: 'Panell de facsímil' },
  facsimileDecreaseZoomButton: { description: 'Disminueix la imatge de notació' },
  facsimileZoom: { description: 'Ajusta la mida de la imatge de notació' },
  facsimileIncreaseZoomButton: { description: 'Augmenta la imatge de notació' },
  facsimileFullPageLabel: {
    text: 'Pàgina completa',
    description: 'Mostra la pàgina completa de la imatge de facsímil',
  },
  facsimileFullPageCheckbox: { description: 'Mostra la pàgina completa de la imatge de facsímil' },
  facsimileShowZonesLabel: { text: 'Mostra les caixes de zona', description: 'Mostra les caixes de zona del facsímil' },
  facsimileShowZonesCheckbox: { description: 'Mostra les caixes de zona del facsímil' },
  facsimileEditZonesCheckbox: { description: 'Edita les zones del facsímil' },
  facsimileEditZonesLabel: { text: 'Edita les zones', description: 'Edita les zones del facsímil' },
  facsimileCloseButton: { description: 'Tanca el panell del facsímil' },
  facsimileDefaultWarning: { text: 'No hi ha contingut del facsímil per mostrar.' },
  facsimileNoSurfaceWarning: {
    text: "No s'ha trobat cap element de superfície per aquesta pàgina. (Pot faltar un element pb inicial.)",
  },
  facsimileNoZonesFullPageWarning: { text: 'Facsímil sense zones només visible en mode de pàgina completa.' },
  facsimileImgeNotLoadedWarning: { text: "No s'ha pogut carregar la imatge" },

  // drag'n'drop / arrossega i deixa anar
  dragOverlayText: { text: "Arrossega el teu fitxer d'entrada aquí." },

  // public repertoire / repertori públic
  openUrlHeading: { text: 'Obre la codificació allotjada a la web per URL' },
  openUrlInstructions: {
    text: "Si us plau, tria del repertori públic o introdueix l'URL d'una codificació de música allotjada a la web, a continuació. Nota: El servidor ha de suportar el compartiment de recursos en origen creuat (CORS).",
  },
  publicRepertoireSummary: { text: 'Repertori públic' },
  sampleEncodingsComposerLabel: { text: 'Compositor:' },
  sampleEncodingsEncodingLabel: { text: 'Codificació:' },
  sampleEncodingsOptionLabel: { text: 'Tria una codificació...' },
  openUrlButton: { text: 'Obre la URL' },
  openUrlCancel: { text: 'Cancel·la' },
  proposePublicRepertoire: {
    html:
      'Acollim propostes per a <a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'afegir al repertori públic' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Tria una codificació...' },
  openUrlChooseComposerText: { text: 'Tria un compositor...' },
  openUrlOpenEncodingByUrlText: { text: 'Obre la codificació allotjada a la web per URL' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Sol·licita el flux de treball de GitHub:' },
  githubActionsDescription: {
    text: "Feu clic a \"Executa el flux de treball\" per demanar a l'API de GitHub que executi el flux de treball anterior, utilitzant la configuració d'entrada especificada a continuació. El vostre codi es recarregarà a la seva darrera versió una vegada que s'hagi completat la execució del flux de treball.",
  },
  githubActionStatusMsgPrompt: { text: "No s'ha pogut executar el flux de treball: GitHub diu" },
  githubActionStatusMsgWaiting: {
    text: 'Si us plau, tingueu paciència mentre GitHub processa el vostre flux de treball...',
  },
  githubActionStatusMsgFailure: { text: "No s'ha pogut executar el flux de treball: GitHub diu" },
  githubActionStatusMsgSuccess: { text: 'Execució del flux de treball completada: GitHub diu' },
  githubActionsRunButton: { text: 'Executa el flux de treball' },
  githubActionsRunButtonReload: { text: "Torna a carregar l'arxiu MEI" },
  githubActionsCancelButton: { text: 'Cancel·la' },
  githubActionsInputSetterFilepath: { text: "Copia la ruta actual de l'arxiu a l'entrada" },
  githubActionsInputSetterSelection: { text: "Copia la selecció actual de MEI a l'entrada" },
  githubActionsInputContainerHeader: { text: "Configuració d'entrada" },

  // fork modals // forquilles modals
  forkRepoGithubText: { text: 'Fer una forquilla del repositori de Github' },
  forkRepoGithubExplanation: {
    text: "L'enllaç que has seguit crearà una forquilla de Github del següent repositori per a la seva edició en mei-friend:",
  },
  forkRepoGithubConfirm: { text: 'Està bé això?' },
  forkRepositoryInstructions: {
    text:
      "Si us plau, trieu del repertori públic o introduïu el nom de l'usuari o organització de Github " +
      'i el nom del repositori allotjat a Github, a continuació. ' +
      'La vostra forquilla del repositori estarà disponible des del menú Github.',
  },
  forkRepositoryGithubText: { text: 'Fer una forquilla del repositori de Github' },
  forkRepertoireSummary: { text: 'Repertori públic' },
  forkRepertoireComposerLabel: { text: 'Compositor:' },
  forkRepertoireOrganizationLabel: { text: 'Organització:' },
  forkRepertoireOrganizationOption: { text: 'Tria una Organització de GitHub...' },
  forkRepertoireRepositoryLabel: { text: 'Repositori:' },
  forkRepertoireRepositoryOption: { text: 'Tria una codificació...' },
  forkRepositoryInputName: { placeholder: 'Usuari o organització de Github' },
  forkRepositoryInputRepoOption: { text: 'Tria un repositori' },
  forkRepositoryToSelectorText: { text: 'Fer una forquilla a: ' },
  forkRepositoryButton: { text: 'Fer una forquilla del repositori' },
  forkRepositoryCancel: { text: 'Cancel·la' },
  forkProposePublicRepertoire: {
    html:
      'Donem la benvinguda a les propostes per a ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'afegir al repertori públic' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: "Tancar amb el nom de l'element" },
  selectTagNameForEnclosureOkButton: { value: "D'acord" },
  selectTagNameForEnclosureCancelButton: { value: 'Cancel·la' },

  // restore Solid session overlay
  solidExplanation: {
    description:
      'Solid és una plataforma descentralitzada de dades enllaçades socials. Inicieu la sessió a Solid per crear anotacions de desacobrament utilitzant dades enllaçades (RDF).',
  },
  solidProvider: {
    description: "Si us plau, escolliu un proveïdor d'identitat Solid (IdP) o especifiqueu el vostre propi.",
  },
  solidLoginBtn: { text: 'Iniciar sessió' },
  solidOverlayCancel: {
    html: 'Restaurant la sessió de Solid - premeu <span>Esc</span> o feu clic aquí per cancel·lar.',
  },
  solidWelcomeMsg: { text: 'Benvingut, ' },
  solidLogout: { text: 'Tancar la sessió' },
  solidLoggedOutWarning: {
    html: `T'has desconnectat de la integració Solid de mei-friend, però el teu navegador encara està connectat a Solid!
      <a id="solidIdPLogoutLink" target="_blank">Feu clic aquí per desconnectar-vos de Solid</a>.`,
  },

  // annotation panel  / panell d'annotacions
  annotationCloseButtonText: { text: "Tanca el panell d'annotacions" },
  hideAnnotationPanelButton: { description: "Tanca el panell d'annotacions" },
  closeAnnotationPanelButton: { description: "Tanca el panell d'annotacions" },
  markupToolsButton: { description: 'Eines de marcatge' },
  annotationToolsButton: { description: "Eines d'annotació" },
  annotationListButton: { description: "Llista d'annotacions" },
  writeAnnotStandoffText: { text: 'Anotació web' },
  annotationToolsIdentifyTitle: { text: 'Identifica' },
  annotationToolsIdentifySpan: { text: 'Identifica objecte musical' },
  annotationToolsHighlightTitle: { text: 'Resalta' },
  annotationToolsHighlightSpan: { text: 'Resalta' },
  annotationToolsDescribeTitle: { text: 'Descriu' },
  annotationToolsDescribeSpan: { text: 'Descriu' },
  annotationToolsLinkTitle: { text: 'Enllaç' },
  annotationToolsLinkSpan: { text: 'Enllaç' },
  listAnnotations: { text: 'No hi ha cap anotació present.' },
  addWebAnnotation: { text: 'Carrega anotació(s) web' },
  loadWebAnnotationMessage: { text: "Introdueix l'URL de l'anotació web o del contenidor d'anotacions web" },
  loadWebAnnotationMessage1: { text: "No s'ha pogut carregar l'URL proporcionada" },
  loadWebAnnotationMessage2: { text: 'Si us plau, intenta-ho de nou' },
  noAnnotationsToDisplay: { text: 'No hi ha cap anotació per mostrar' },
  flipPageToAnnotationText: { description: 'Gira la pàgina fins a aquesta anotació' },
  describeMarkup: { description: 'Descriu aquest marcatge' },
  deleteMarkup: { description: 'Elimina aquest marcatge' },
  deleteMarkupConfirmation: { text: 'Esteu segur que voleu eliminar aquest marcatge?' },
  deleteAnnotation: { description: 'Elimina aquesta anotació' },
  deleteAnnotationConfirmation: { text: 'Esteu segur que voleu eliminar aquesta anotació?' },
  makeStandOffAnnotation: {
    description: 'Estat stand-off (RDF)',
    descriptionSolid: 'Escriu a Solid com a RDF',
    descriptionToLocal: "Obre l'anotació stand-off (RDF) en una pestanya nova",
  },
  makeInlineAnnotation: {
    description: 'Feu clic per a una anotació en línia',
    descriptionCopy: "Copia la id de l'etiqueta <annot> al porta-retalls",
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'elements' },
  askForLinkUrl: { text: 'Si us plau, introdueix una URL per enllaçar' },
  drawLinkUrl: { text: 'Obre en una nova pestanya' },
  askForDescription: { text: 'Si us plau, introdueix una descripció textual per aplicar' },
  maxNumberOfAnnotationAlert: {
    text1: `El nombre d'elements d'anotació supera la "quantitat màxima d'anotacions" configurable`,
    text2: 'Les noves anotacions encara es poden generar i es mostraran si es configura "Mostra anotacions".',
  },
  annotationsOutsideScoreWarning: {
    text: 'Ho sentim, actualment no es poden escriure anotacions situades fora de <score>',
  },
  annotationWithoutIdWarning: {
    text1: "No es pot escriure l'annotació perquè el punt d'ancoratge MEI no té xml:id.",
    text2:
      'Assigneu identificadors seleccionant "Manipula" -> "Torna a renderitzar MEI (amb ids)" i torneu-ho a intentar.',
  },
  // MENÚ DE MARCATGE
  respSelect: {
    text: 'Seleccionar la responsabilitat de la marca',
    description: "Seleccionar l'ID de la responsabilitat",
  },
  selectionSelect: {
    text: 'Selecció per defecte per a la marca',
    description:
      "Trieu si la marca de nova creació hauria d'envoltar els elements seleccionats, les articulacions o els accidentals",
    labels: ['Elements seleccionats', 'Articulació', 'Accidental'],
    valuesDescriptions: [
      'Afegeix marcatge als elements seleccionats.',
      'Afegeix marcatge a les articulacions dins la selecció.',
      'Afegeix marcatge als accidentals dins la selecció.',
    ],
  },
  alternativeEncodingsGrp: {
    text: 'Codificacions alternatives',
    description: 'Elements de marcatge que contenen múltiples versions.',
  },
  addChoiceText: {
    text: '<choice>',
    description: 'Agrupa diverses codificacions alternatives pel mateix punt en un text.',
  },
  choiceSicCorr: {
    description: 'Posa la selecció a <sic> i afegeix <corr>.',
  },
  choiceCorrSic: {
    description: 'Posa la selecció a <corr> i afegeix <sic>.',
  },
  choiceOrigReg: {
    description: 'Posa la selecció a <orig> i afegeix <reg>.',
  },
  choiceRegOrig: {
    description: 'Posa la selecció a <reg> i afegeix <orig>.',
  },
  choiceContentTarget: {
    description: 'Primer, selecciona contingut per a aquest element passant el ratolí sobre <choice>.',
  },
  addSubstText: {
    text: '<subst>',
    description:
      '(substitució) – Agrupa elements de transcripció quan la combinació ha de ser considerada com una intervenció única en el text.',
  },
  substAddDel: {
    description: 'Posa la selecció a <add> i afegeix <del>.',
  },
  substDelAdd: {
    description: 'Posa la selecció a <del> i afegeix <add>.',
  },
  substContentTarget: {
    description: 'Primer, selecciona contingut per a aquest element passant el ratolí sobre <subst>.',
  },
  editInterventionsGrp: {
    text: 'Intervencions editorials',
    description: 'Elements de marcatge utilitzats per codificar intervencions editorials.',
  },
  addSuppliedText: {
    text: '<supplied>',
    description: 'Conté material subministrat pel transcriptor o editor per qualsevol motiu.',
  },
  addUnclearText: {
    text: '<unclear>',
    description: 'Conté material que no es pot transcriure amb certesa perquè és il·legible o inaudible a la font.',
  },
  addSicText: { text: '<sic>', description: 'Conté material aparentment incorrecte o inexacte.' },
  addCorrText: {
    text: '<corr>',
    description: "(correcció) – Conté la forma correcta d'un passatge aparentment erroni.",
  },
  addOrigText: {
    text: '<orig>',
    description: "(original) – Conté material marcat com a següent l'original, en lloc de ser normalitzat o corregit.",
  },
  addRegText: {
    text: '<reg>',
    description: "(regularització) – Conté material que ha estat regularitzat o normalitzat d'alguna manera.",
  },
  descMarkupGrp: {
    text: 'Marcatge Descriptiu',
    description: 'Elements de marcatge utilitzats per codificar intervencions en el material font.',
  },
  addAddText: { text: '<add>', description: '(addició) – Marca una addició al text.' },
  addDelText: {
    text: '<del>',
    description:
      '(supressió) – Conté informació eliminada, marcada com a eliminada o indicada com a superflua o espúria al text original per un autor, escriptor, annotador o corrector.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Mode de velocitat',
    description:
      'El mode de velocitat està actiu; només es reprodueix el MIDI per a la pàgina actual. Per reproduir tota la codificació, desactiveu el mode de velocitat.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Amaga la barra de control de reproducció MIDI' },

  // mei-friend SETTINGS MENU / MEI-FRIEND MENU DE CONFIGURACIÓ
  meiFriendSettingsHeader: {
    text: 'Configuració de mei-friend',
    description: 'Configuració de mei-friend',
  },
  mfReset: {
    text: 'Per defecte',
    description: 'Restableix els valors per defecte de mei-friend',
  },
  filterSettings: {
    placeholder: 'Filtra les opcions',
    description: 'Escriviu aquí per filtrar les opcions',
  },
  closeSettingsButton: {
    description: 'Tanca el panell de configuració',
  },
  hideSettingsButton: {
    description: 'Amaga el panell de configuració',
  },
  titleGeneral: {
    text: 'General',
    description: 'Configuració general de mei-friend',
  },
  selectToolkitVersion: {
    text: 'Versió de Verovio',
    description:
      "Seleccioneu la versió de l'eina Verovio " +
      '(* Canviar a versions anteriors a la 3.11.0 ' +
      'podria requerir un refrescament per qüestions de memòria.)',
  },
  toggleSpeedMode: {
    text: 'Mode de velocitat',
    description:
      'Activa o desactiva el mode de velocitat de Verovio. ' +
      'En el mode de velocitat, només es processa la pàgina actual ' +
      'per reduir el temps de renderització amb fitxers grans',
  },
  selectIdStyle: {
    text: 'Estil dels xml:ids generats',
    description:
      'Estil dels xml:ids generats (els xml:ids existents no es canviaran)' +
      'p. ex., original de Verovio: "note-0000001318117900", ' +
      'base 36 de Verovio: "nophl5o", ' +
      'estil de mei-friend: "note-ophl5o"',
  },
  addApplicationNote: {
    text: "Inserir declaració d'aplicació",
    description:
      "Inseriu una declaració d'aplicació a la descripció " +
      "de la codificació al capçalera MEI, identificant el nom de l'aplicació, " +
      'la versió, la data de la primera i última edició',
  },
  selectLanguage: {
    text: 'Idioma',
    description: "Seleccioneu l'idioma de la interfície de mei-friend.",
  },

  // Drag select / Selecció per arrossegament
  dragSelection: {
    text: 'Selecciona per arrossegament',
    description: 'Selecciona elements de la notació amb arrossegament del ratolí',
  },
  dragSelectNotes: {
    text: 'Selecciona notes',
    description: 'Selecciona notes',
  },
  dragSelectRests: {
    text: 'Selecciona pauses',
    description: 'Selecciona pauses i repeticions (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Selecciona elements de posició',
    description:
      'Selecciona elements de posició (és a dir, amb un atribut @placement: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Selecciona lligadures',
    description:
      "Selecciona lligadures (és a dir, elements amb l'atribut @curvature: " + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Selecciona compassos',
    description: 'Selecciona compassos',
  },

  // Control menu / Menú de control
  controlMenuSettings: {
    text: 'Barra de control de la notació',
    description: 'Defineix els elements que es mostraran en el menú de control sobre la notació',
  },
  controlMenuFlipToPageControls: {
    text: 'Mostra controls per girar pàgina',
    description: 'Mostra controls per girar pàgina en el menú de control de la notació',
  },
  controlMenuUpdateNotation: {
    text: "Mostra controls d'actualització de la notació",
    description: "Mostra controls de comportament d'actualització de la notació en el menú de control de la notació",
  },
  controlMenuFontSelector: {
    text: 'Mostra selector de font de notació',
    description: 'Mostra el selector de fonts de notació (SMuFL) en el menú de control de la notació',
  },
  controlMenuNavigateArrows: {
    text: 'Mostra fletxes de navegació',
    description: 'Mostra les fletxes de navegació de la notació en el menú de control de la notació',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Mostra casella de selecció de mode de velocitat',
    description: 'Mostra la casella de selecció de mode de velocitat en el menú de control de la notació',
  },

  // MIDI Playback / Reproducció MIDI
  titleMidiPlayback: {
    text: 'Reproducció MIDI',
    description: 'Configuració de reproducció MIDI',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Mostra la drecera de reproducció',
    description:
      'Fa que aparegui una drecera (bombolla a la cantonada inferior esquerra; ' +
      'fes clic per iniciar immediatament la reproducció) ' +
      'quan la barra de control de reproducció MIDI està tancada',
  },
  showMidiPlaybackControlBar: {
    text: 'Mostra la barra de control de reproducció MIDI',
    description: 'Mostra la barra de control de reproducció MIDI',
  },
  scrollFollowMidiPlayback: {
    text: 'Segueix la reproducció MIDI al desplaçament',
    description: 'Desplaça el panell de notació per seguir la reproducció MIDI a la pàgina actual',
  },
  pageFollowMidiPlayback: {
    text: 'Segueix la reproducció MIDI a la pàgina',
    description: 'Gira les pàgines automàticament per seguir la reproducció MIDI',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Destaca les notes que sonen actualment',
    description: 'Destaca visualment les notes que sonen actualment al panell de notació durant la reproducció MIDI',
  },
  selectMidiExpansion: {
    text: 'Expansió de la reproducció',
    description: "Seleccioneu l'element d'expansió a utilitzar per a la reproducció MIDI",
  },

  // Transposition / Transposició
  titleTransposition: {
    text: 'Transposició',
    description: 'Transposa la informació de la partitura',
  },
  enableTransposition: {
    text: 'Activa la transposició',
    description:
      "Activa la configuració de transposició, per aplicar-la a través del botó de transposició que hi ha a sota. La transposició només s'aplica a la notació, l'encodatge es manté sense canvis, llevat que facis clic a l'element 'Torna a renderitzar via Verovio' al menú desplegable 'Manipular'.",
  },
  transposeInterval: {
    text: 'Transposa per interval',
    description:
      "Transposa l'encodatge per interval cromàtic, amb els intervals més comuns (Verovio suporta el sistema base-40)",
    labels: [
      'Uníson perfecte',
      'Uníson augmentat',
      'Segona disminuïda',
      'Segona menor',
      'Segona major',
      'Segona augmentada',
      'Tercera disminuïda',
      'Tercera menor',
      'Tercera major',
      'Tercera augmentada',
      'Quarta disminuïda',
      'Quarta perfecta',
      'Quarta augmentada',
      'Cinquena disminuïda',
      'Cinquena perfecta',
      'Cinquena augmentada',
      'Sisena disminuïda',
      'Sisena menor',
      'Sisena major',
      'Sisena augmentada',
      'Setena disminuïda',
      'Setena menor',
      'Setena major',
      'Setena augmentada',
      'Octava disminuïda',
      'Octava perfecta',
    ],
  },
  transposeKey: {
    text: 'Transposar a tonalitat',
    description: 'Transposar a tonalitat',
    labels: [
      'Do# major / La# menor',
      'Fa# major / Re# menor',
      'Si major / Sol# menor',
      'Mi major / Do# menor',
      'La major / Fa# menor',
      'Re major / Si menor',
      'Sol major / Mi menor',
      'Do major / La menor',
      'Fa major / Re menor',
      'Sib major / Sol menor',
      'Mib major / Do menor',
      'Lab major / Fa menor',
      'Reb major / Sib menor',
      'Solb major / Mib menor',
      'Dob major / Lab menor',
    ],
  },
  transposeDirection: {
    text: 'Direcció de transposició',
    description: 'Direcció de transposició (amunt/avall)',
    labels: ['Amunt', 'Avall', 'Més proper'],
  },
  transposeButton: {
    text: 'Transposar',
    description:
      "Aplicar transposició amb les opcions anteriors a la notació, mentre que l'encodatge MEI roman inalterat. Per transposar també l'encodatge MEI amb les opcions actuals, utilitzeu 'Tornar a renderitzar via Verovio' al menú desplegable 'Manipular'.",
  },

  // Renumber measures / Renumber measures
  renumberMeasuresHeading: {
    text: 'Reenumerar compassos',
    description: 'Opcions per reenumerar els compassos',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Continuar a través de compassos incomplets',
    description: "Continuar la numeració de compassos a través de compassos incomplets (@metcon='false')",
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Sufix als compassos incomplets',
    description: 'Utilitzar sufix numèric als compassos incomplets (p. ex. 23-cont)',
    labels: ['cap', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Continuar a través de finals',
    description: 'Continuar la numeració de compassos a través de finals',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Sufix als finals',
    description: 'Utilitzar sufix numèric als finals (p. ex. 23-a)',
  },

  // Annotations / Annotations
  titleAnnotations: {
    text: 'Anotacions',
    description: "Opcions d'annotació",
  },
  showAnnotations: {
    text: 'Mostrar anotacions',
    description: 'Mostrar anotacions a la notació',
  },
  showAnnotationPanel: {
    text: "Mostrar panell d'annotació",
    description: "Mostrar panell d'annotació",
  },
  annotationDisplayLimit: {
    text: "Nombre màxim d'anotacions",
    description: "Nombre màxim d'anotacions a mostrar (nombres grans poden afectar el rendiment de mei-friend)",
  },

  // Facsimile / / Facsímil
  titleFacsimilePanel: {
    text: 'Panell de facsímil',
    description: "Mostra les imatges de facsímil de l'edició font, si estan disponibles",
  },
  showFacsimilePanel: {
    text: 'Mostra el panell de facsímil',
    description: "Mostra les imatges de partitura de l'edició font proporcionades a l'element de facsímil",
  },
  selectFacsimilePanelOrientation: {
    text: 'Posició del panell de facsímil',
    description: 'Selecciona la posició del panell de facsímil en relació amb la notació',
    labels: ['esquerra', 'dreta', 'superior', 'inferior'],
  },
  facsimileZoomInput: {
    text: "Zoom d'imatge de facsímil (%)",
    description: 'Nivell de zoom de la imatge de facsímil (en percentatge)',
  },
  showFacsimileFullPage: {
    text: 'Mostra la pàgina completa',
    description: 'Mostra la imatge de facsímil a la pàgina completa',
  },
  showFacsimileZones: {
    text: 'Mostra les caixes de zona de facsímil',
    description: 'Mostra les caixes delimitadores de zona de facsímil',
  },
  editFacsimileZones: {
    text: 'Edita les zones de facsímil',
    description: 'Edita les zones de facsímil (vincularà les caixes delimitadores a les zones de facsímil)',
  },
  showFacsimileTitles: {
    text: 'Mostra els títols dels facsímils',
    description: 'Mostra els títols dels facsímils sobre les imatges de facsímil',
  },

  // Supplied element / Element subministrat
  titleSupplied: {
    text: 'Gestionar el contingut editorial',
    description: 'Controlar el tractament de la marca editorial',
  },
  showMarkup: {
    text: 'Mostrar elements de marca editorial',
    description: 'Destacar tots els elements continguts per elements de marca editorial',
  },
  markupToPDF: {
    text: 'Mostrar elements de marca editorial a PDF',
    description: 'Mostrar elements de marca editorial a la sortida PDF',
  },
  alternativeVersionContent: {
    text: 'Contingut per defecte per a les codificacions alternatives',
    description: 'Trieu si les codificacions alternatives de nova creació estan buides o còpies de la lectura original',
    labels: ['buit', 'còpia'],
  },
  suppliedColor: {
    text: "Seleccionar el color d'ús de <supplied>",
    description: "Seleccionar el color d'ús de <supplied>",
  },
  unclearColor: {
    text: "Seleccionar el color d'ús de <unclear>",
    description: "Seleccionar el color d'ús de <unclear>",
  },
  sicColor: {
    text: "Seleccionar el color d'ús de <sic>",
    description: "Seleccionar el color d'ús de <sic>",
  },
  corrColor: {
    text: "Seleccionar el color d'ús de <corr>",
    description: "Seleccionar el color d'ús de <corr>",
  },
  origColor: {
    text: "Seleccionar el color d'ús de <orig>",
    description: "Seleccionar el color d'ús de <orig>",
  },
  regColor: {
    text: "Seleccionar el color d'ús de <reg>",
    description: "Seleccionar el color d'ús de <reg>",
  },
  addColor: {
    text: "Seleccionar el color d'ús de <add>",
    description: "Seleccionar el color d'ús de <add>",
  },
  delColor: {
    text: "Seleccionar el color d'ús de <del>",
    description: "Seleccionar el color d'ús de <del>",
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS // CONFIGURACIÓ DE L'EDITOR / CONFIGURACIÓ DE CODEMIRROR
  editorSettingsHeader: {
    text: "Configuració de l'editor",
  },
  cmReset: {
    text: 'Per defecte',
    description: 'Restableix els valors per defecte de mei-friend',
  },
  titleAppearance: {
    text: "Aparença de l'editor",
    description: "Controla l'aparença de l'editor",
  },
  zoomFont: {
    text: 'Mida de la font (%)',
    description: "Canvia la mida de la font de l'editor (en percentatge)",
  },
  theme: {
    text: 'Tema',
    description: "Selecciona el tema de l'editor",
  },
  matchTheme: {
    text: 'La notació coincideix amb el tema',
    description: "Fes que la notació coincideixi amb el tema de colors de l'editor",
  },
  tabSize: {
    text: 'Mida de la tabulació',
    description: "Nombre de caràcters d'espai per cada nivell de tabulació",
  },
  lineWrapping: {
    text: 'Salt de línia',
    description: "Indica si les línies s'han de tallar al final del panell",
  },
  lineNumbers: {
    text: 'Nombres de línia',
    description: 'Mostra els nombres de línia',
  },
  firstLineNumber: {
    text: 'Primer número de línia',
    description: 'Estableix el primer número de línia',
  },
  foldGutter: {
    text: 'Plegament de codi',
    description: 'Permet plegar el codi a través de les barres de plegament',
  },
  titleEditorOptions: {
    text: "Comportament de l'editor",
    description: "Controla el comportament de l'editor",
  },
  autoValidate: {
    text: 'Validació automàtica',
    description: 'Valida la codificació automàticament després de cada edició',
  },
  autoShowValidationReport: {
    text: 'Mostra el informe de validació automàticament',
    description: "Mostra l'informe de validació automàticament després que s'hagi realitzat la validació",
  },
  autoCloseBrackets: {
    text: 'Tancament automàtic de claudàtors',
    description: 'Tanca els claudàtors automàticament en introduir-los',
  },
  autoCloseTags: {
    text: 'Tancament automàtic de etiquetes',
    description: 'Tanca les etiquetes automàticament en introduir-les',
    type: 'bool',
  },
  matchTags: {
    text: "Coincidència d'etiquetes",
    description: "Resalta les etiquetes coincidents al voltant del cursor de l'editor",
  },
  showTrailingSpace: {
    text: 'Resalta els espais finals',
    description: 'Resalta els espais innecessaris al final de les línies',
  },
  keyMap: {
    text: 'Mapa de tecles',
    description: 'Selecciona el mapa de tecles',
  },
  persistentSearch: {
    text: 'Caixa de cerca persistent',
    description:
      'Utilitza el comportament de la caixa de cerca persistent (la caixa de cerca roman oberta fins que es tanca explícitament)',
  },

  // Verovio settings / Configuració de Verovio
  verovioSettingsHeader: {
    text: 'Configuració de Verovio',
  },
  vrvReset: {
    text: 'Predeterminat',
    description: 'Restableix Verovio als valors per defecte de mei-friend',
  },

  // main.js alert messages / Missatges d'alerta del fitxer main.js
  isSafariWarning: {
    text: "Sembla que esteu utilitzant Safari com a navegador, el qual, desafortunadament, no és compatible actualment amb la validació de l'esquema de mei-friend. Si us plau, utilitzeu un altre navegador per obtenir suport complet de validació.",
  },
  githubLoggedOutWarning: {
    text: `Heu tancat la sessió d'integració de mei-friend amb GitHub, 
    però el vostre navegador encara té oberta la sessió a GitHub! 
    <a href="https://github.com/logout" target="_blank">Cliqueu aquí per tancar la sessió a GitHub</a>.`,
  },
  generateUrlError: {
    text: 'No es pot generar la URL per al fitxer local ',
  },
  generateUrlSuccess: {
    text: 'URL copiada al porta-retalls correctament',
  },
  generateUrlNotCopied: {
    text: "La URL no s'ha copiat al porta-retalls, si us plau, torneu-ho a provar!",
  },
  errorCode: { text: "Codi d'error" },
  submitBugReport: { text: 'Enviar informe d’error' },
  loadingSchema: { text: 'Carregant esquema' },
  schemaLoaded: { text: 'Esquema carregat' },
  noSchemaFound: { text: "No s'ha trobat informació d'esquema a MEI." },
  schemaNotFound: { text: "No s'ha trobat l'esquema" },
  errorLoadingSchema: { text: 'Error en carregar l’esquema' },
  notValidated: { text: 'No validat. Cliqueu aquí per validar.' },
  validatingAgainst: { text: 'Validant contra' },
  validatedAgainst: { text: 'Validat contra' },
  validationMessages: { text: 'missatges de validació' },
  validationComplete: { text: 'Validació completa' },
  validationFailed: { text: 'Validació fallida' },
  noErrors: { text: 'sense errors' },
  errorsFound: { text: `s’han trobat errors` }, // 5 errors trobats // 5 errors found

  // github-menu.js / github-menu.js
  githubRepository: { text: 'Repositori' },
  githubBranch: { text: 'Branca' },
  githubFilepath: { text: 'Camí' },
  githubCommit: { text: 'Commit' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Confirmar com a nou fitxer' } }, value: 'Confirmar' },
  commitLog: { text: 'Registre de confirmacions' },
  githubDate: { text: 'Data' },
  githubAuthor: { text: 'Autor' },
  githubMessage: { text: 'Missatge' },
  none: { text: 'Cap' },
  commitFileNameText: { text: 'Nom del fitxer' },
  forkRepository: { text: 'Bifurcar el repositori' },
  forkError: { text: "Ho sentim, no s'ha pogut bifurcar el repositori" },
  loadingFile: { text: 'Carregant fitxer' },
  loadingFromGithub: { text: 'Carregant des de Github' },
  logOut: { text: 'Tancar sessió' },
  githubLogout: { text: 'Tancar sessió' },
  selectRepository: { text: 'Seleccionar repositori' },
  selectBranch: { text: 'Seleccionar branca' },
  commitMessageInput: { placeholder: 'Actualitzat amb mei-friend en línia' },
  reportIssueWithEncoding: { value: "Informar d'un problema amb la codificació" },
  clickToOpenInMeiFriend: { text: 'Feu clic per obrir a mei-friend' },
  repoAccessError: {
    text: "Ho sentim, no es poden accedir als repositoris per a l'usuari o organització subministrada",
  },
  allComposers: { text: 'Tots els compositors' },

  // utils renumber measures / fork-repository.js
  renumberMeasuresModalText: { text: 'Reenumerar compassos' },
  renumberMeasuresModalTest: { text: 'Prova' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'seria' },
  renumberMeasuresChangedTo: { text: 'canviat a' },
  renumberMeasureMeasuresRenumbered: { text: 'compassos reenumerades' },

  // Code checker panel (accid.ges)
  accidGesCodeCheckerTitle: {
    text: 'Verifica els atributs @accid.ges (en comparació amb la clau de sol, els accid. per compàs i les lligadures).',
  },
  metConCodeCheckerTitle: {
    text: 'Comprovant conformitat mètrica (almenys una capa per pentagrama té número de pulsació segons la signatura de compàs).',
  },
  codeCheckerFix: { text: 'Corregeix' },
  codeCheckerFixAll: { text: 'Corregir tot' },
  codeCheckerIgnore: { text: 'Ignora' },
  codeCheckerIgnoreAll: { text: 'Ignora tot' },
  codeCheckerCheckingCode: { text: 'Comprovant codi...' },
  codeCheckerNoAccidMessagesFound: { text: 'Tots els atributs accid.ges semblen correctes.' },
  codeCheckerMeterConformanceMessage: { text: 'Tots els compassos compleixen amb les seves signatures de compàs.' },
  codeCheckerMeasure: { text: 'compàs' },
  codeCheckerNote: { text: 'Nota' },
  codeCheckerHasBoth: { text: 'té ambdós' },
  codeCheckerAnd: { text: 'i' },
  codeCheckerHasADurationOf: { text: 'té una durada de' },
  codeCheckerInsteadOf: { text: 'en lloc de' },
  codeCheckerRemove: { text: 'Suprimeix' },
  codeCheckerFixTo: { text: 'Corregir a' },
  codeCheckerAdd: { text: 'Afegir' },
  codeCheckerWithContradictingContent: { text: 'amb contingut contradictori' },
  codeCheckerTiedNote: { text: 'Nota lligada' },
  codeCheckerNotSamePitchAs: { text: 'no té la mateixa alçada que' },
  codeCheckerNotSameOctaveAs: { text: 'no té el mateix octavatge que' },
  codeCheckerNotSameAsStartingNote: { text: "no és la mateixa que la nota d'inici" },
  codeCheckerExtra: { text: 'extra' },
  codeCheckerHasExtra: { text: 'té extra' },
  codeCheckerLacksAn: { text: 'li falta un' },
  codeCheckerBecauseAlreadyDefined: { text: "perquè ja s'ha definit anteriorment a la compàs" },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: 'mei-friend no pot fer scroll als elements seleccionats en la codificació. Si us plau, afegiu identificadors a la codificació.',
  },
};
