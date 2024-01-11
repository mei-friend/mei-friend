/**
 * Language file for Esperanto.
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'Pri mei-friend ' },
  showSplashScreen: {
    text: 'Montri komenca ekrano ĉe ŝarĝo',
    description: 'Montru la mei-friend komenca ekrano kiam la aplikaĵo estas ŝargita',
  },
  splashBody: {
    html: `
    <p>
      mei-friend estas redaktanto por <a href="https://music-encoding.org">muzikaj kodadoj</a>, gastigita ĉe
      <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Universitato de Muziko kaj Artaj Artoj de Vieno</a>. 
      Bonvolu konsulti nian <a href="https://mei-friend.github.io" target="_blank">ampleksan dokumentadon</a> por 
      pliaj informoj.
    </p>
    <p>
      Kvankam mei-friend estas retumila aplikaĵo, viaj personaĵaj datumoj (inkluzive la kodo kiun
      vi redaktas, viaj aplikaĵaj agordoj, kaj aktualegaj ensalutinformoj se ili ekzistas) estas konservitaj en via retumila navigilo en
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"
        >lokal memoro</a
      > kaj ne estas senditaj al aŭ konservitaj sur niaj serviloj.
    </p>
    <p>
      Datumoj estas senditaj al GitHub nur kiam vi eksplice petas tion (ekzemple, kiam vi ensalutas al GitHub, ŝargas
      vian kodon de aŭ al GitHub-repozitorio, aŭ kiam vi petas ke GitHub-agonaj laborfluo estu ekigita por vi). Sammaniere, datumoj estas senditaj al via elektita Solid provizanto nur kiam vi eksplice petas tion (ekzemple, kiam vi ensalutas al Solid, aŭ ŝargas aŭ konservas standoff-anotaciojn).
    </p>
    <p>
      Ni uzas <a href="https://matomo.org/" target="_blank">Matomo</a>
      por kolekti anonimajn uzo-statistikojn. Tio inkluzivas vian mallongan IP-adreson (permesanta geolokigon ĝis landnivelo, sed neniun plian identigon), vian foliumilon kaj operaciumon, de kie vi venis (t.e., la referanta retejo), la tempon kaj daŭron de via vizito, kaj la paĝojn kiujn vi vizitis. Tiu informo estas konservita en la Matomo-okaziga servilo situanta sur serviloj de mdw &ndash; Universitato de Muziko kaj Artaj Artoj de Vieno, kaj ne estas dividata kun triaj partioj.
    </p>
    <p>
      Lut-tabulaturoj estas konvertitaj al MEI uzante 
      <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a> disvolvita de Paul Overell, 
      per la <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui servo</a> 
      disvolvita de Stefan Szepe kaj <a href="https://luteconv.mdw.ac.at" target="_blank">gastigita de la mdw</a>. 
      Ĉi tiu servo kreas rete alireblajn kopiojn de viaj kodadoj kiel parto de la konverta procezo, 
      sed ĉi tiuj estas alireblaj nur per unika ligila haŝvaloro, kaj estas perioda forigita.
    </p>
    <p>
      La Verovio-ilareto estas ŝargita el <a href="https://verovio.org" target="_blank">https://verovio.org</a>, gastigata de
      <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
      Tio ebligas al mei-friend resti aktualigita kun la plej nova ilaretoversio kaj
      provizi elekton de ĉiuj subtenataj versioj tra la agordaro. 
      Kiam uzante mei-friend, do via IP-adreso estas videbla por RISM Digital.
    </p>
    <p>
      Fine, MIDI ludado estas prezentata uzante la SGM_plus sonfonton provizitan de Google Magenta, kaj liverita
      tra googleapis.com. Via IP-adreso estas do videbla por Google kiam vi ekigas MIDI ludadon. Se vi
      ne deziras tion okazi, bonvolu eviti la uzon de la MIDI ludofunkcio.
    </p>
    <p>
      mei-friend estas disvolvita de
      <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> kaj
      <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> ĉe la Departemento de Muzika
      Akustiko &ndash; Viennan Stilon ĉe mdw &ndash; Universitato de Muziko kaj Artaj Artoj de Vieno, kaj
      estas permesita sub la
      <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
        >GNU Affero General Public License v3.0</a
      >. Bonvolu konsulti nian
      <a href="https://mei-friend.github.io/about/" target="_blank">rekonaĵopaĝon</a> por pliaj
      informoj pri kontribuantoj kaj la malfermfontaj komponentoj kiuj estas reuzitaj en nia projekto. Ni dankas
      niajn kunlaborantojn pro iliaj kontribuoj kaj gvidado.
    </p>
    <p>
      La disvolvado de la mei-friend estas financita per la
      <a href="https://fwf.ac.at" target="_blank">Aŭstra Scienco-Fondo (FWF)</a> sub la projektoj
      <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
        >P 34664-G (Signature Sound Vienna)</a
      >
      kaj <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
    </p>`,
  },
  splashGotItButtonText: { text: 'Mi komprenas!' },
  splashVersionText: { text: 'Versio' },
  splashAlwaysShow: {
    text: 'Ĉiam montru ĉi tiun komenca ekrano',
    description: 'Ĉiam montru ĉi tiun komenca ekrano ĉe la ŝarĝo de la aplikaĵo',
  },
  splashAlwaysShowLabel: {
    text: 'Ĉiam montru ĉi tiun komenca ekrano',
    description: 'Ĉiam montru ĉi tiun komenca ekrano ĉe la ŝarĝo de la aplikaĵo',
  },

  // Ĉefmenuo
  githubLoginLink: { text: 'Ensaluti' },

  month: {
    jan: 'Januaro',
    feb: 'Februaro',
    mar: 'Marto',
    apr: 'Aprilo',
    may: 'Majo',
    jun: 'Junio',
    jul: 'Julio',
    aug: 'Aŭgusto',
    sep: 'Septembro',
    oct: 'Oktobro',
    nov: 'Novembro',
    dec: 'Decembro',
  },
  // FILE MENU ITEM
  fileMenuTitle: { text: 'Dosierujo' },
  openMeiText: { text: 'Malfermi dosieron' },
  openUrlText: { text: 'Malfermi URL-on' },
  openExample: {
    text: 'Publika repertuaro',
    description: 'Malfermi liston de publika-domena repertuaro',
  },
  importMusicXml: { text: 'Importi MusicXML' },
  importHumdrum: { text: 'Importi Humdrum' },
  importPae: { text: 'Importi PAE, ABC' },
  saveMeiText: { text: 'Konservi MEI' },
  saveMeiBasicText: { text: 'Konservi kiel Basan MEI' },
  saveSvg: { text: 'Konservi SVG' },
  saveMidi: { text: 'Konservi MIDI' },
  printPreviewText: { text: 'Antaŭrigardi PDF' },
  generateUrlText: { text: 'Generi mei-friend URL-on' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Kodo' },
  undoMenuText: { text: 'Malfari' },
  redoMenuText: { text: 'Refari' },
  startSearchText: { text: 'Serĉi' },
  findNextText: { text: 'Trovi venontan' },
  findPreviousText: { text: 'Trovi antaŭan' },
  replaceMenuText: { text: 'Anstataŭi' },
  replaceAllMenuText: { text: 'Anstataŭi ĉion' },
  indentSelectionText: { text: 'Indentigi elekton' },
  surroundWithTagsText: { text: 'Ĉirkaŭi per etikedoj' },
  surroundWithLastTagText: { text: 'Ĉirkaŭi per ' },
  jumpToLineText: { text: 'Salti al linio' },
  toMatchingTagText: { text: 'Iri al kongrua etikedo' },
  manualValidateText: { text: 'Validigi' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Vido' },
  notationTop: { text: 'Notado supre' },
  notationBottom: { text: 'Notado malsupre' },
  notationLeft: { text: 'Notado maldekstre' },
  notationRight: { text: 'Notado dekstre' },
  showSettingsMenuText: { text: 'Agordoj panelo' },
  showAnnotationMenuText: { text: 'Priskriba panelo' },
  showFacsimileMenuText: { text: 'Facsimila panelo' },
  showPlaybackControlsText: { text: 'Stiraj kontroliloj' },
  facsimileTop: { text: 'Facsimila supre' },
  facsimileBottom: { text: 'Facsimila malsupre' },
  facsimileLeft: { text: 'Facsimila maldekstre' },
  facsimileRight: { text: 'Facsimila dekstre' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Manipuli' },
  invertPlacementText: { text: 'Inverti lokon' },
  betweenPlacementText: { text: 'Interlokigo' },
  addVerticalGroupText: { text: 'Aldoni vertikalan grupon' },
  deleteText: { text: 'Forigi elementon' },
  pitchChromUpText: { text: 'Kromatike pli supren' },
  pitchChromDownText: { text: 'Kromatike pli malsupren' },
  pitchUpDiatText: { text: 'Diatonike pli supren' },
  pitchDownDiatText: { text: 'Diatonike pli malsupren' },
  pitchOctaveUpText: { text: 'Transpreni 1 oktavon supren' },
  pitchOctaveDownText: { text: 'Transpreni 1 oktavon malsupren' },
  staffUpText: { text: 'Elemento 1 personalo supren' },
  staffDownText: { text: 'Elemento 1 personalo malsupren' },
  increaseDurText: { text: 'Pligrandigi daŭron' },
  decreaseDurText: { text: 'Malpligrandigi daŭron' },
  toggleDotsText: { text: 'Ŝalti punktadon' },
  cleanAccidText: { text: 'Kontroli @accid.ges' },
  renumberMeasuresTestText: { text: ' Reenumeri mezurojn (testo)' },
  renumberMeasuresExecText: { text: ' Reenumeri mezurojn (ekzekuti)' },
  addIdsText: { text: 'Aldoni id-ojn al MEI' },
  removeIdsText: { text: 'Forigi id-ojn el MEI' },
  reRenderMeiVerovio: { text: ' Reeldoni per Verovio' },
  addFacsimile: { text: 'Aldoni facsimilan elementon' },
  ingestFacsimileText: { text: 'Enkonsumi facsimilan' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Enmeti' },
  addNoteText: { text: 'Aldoni noton' },
  convertNoteToRestText: { text: 'Noto(j) <=> paŭzo(j)' },
  toggleChordText: { text: 'Noto(j) <=> akordo' },
  addDoubleSharpText: { html: 'Duobla diezo &#119082;' },
  addSharpText: { html: 'Diezo &#9839;' },
  addNaturalText: { html: 'Natura &#9838;' },
  addFlatText: { html: 'Bema &#9837;' },
  addDoubleFlatText: { html: 'Duba bema &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Direktivo' },
  addDynamicsText: { text: 'Dinamiko' },
  addSlurText: { text: 'Ligilo' },
  addTieText: { text: 'Ligilo' },
  addCrescendoHairpinText: { text: 'Kresĉendo harpuno' },
  addDiminuendoHairpinText: { text: 'Malgrandigo harpuno' },
  addBeamText: { text: 'Traveto' },
  addBeamSpanText: { text: 'Travetospaco' },
  addArpeggioText: { text: 'Arpegio' },
  addFermataText: { text: 'Fermato' },
  addGlissandoText: { text: 'Glisado' },
  addPedalDownText: { text: 'Pedalo malsupren' },
  addPedalUpText: { text: 'Pedalo supren' },
  addTrillText: { text: 'Trilo' },
  addTurnText: { text: 'Turniĝo' },
  addTurnLowerText: { text: 'Suba turniĝo' },
  addMordentText: { text: 'Mordento' },
  addMordentUpperText: { text: 'Supra mordento' },
  addOctave8AboveText: { text: 'Okavo (8va supre)' },
  addOctave15AboveText: { text: 'Okavo (15va supre)' },
  addOctave8BelowText: { text: 'Okavo (8va malsupre)' },
  addOctave15BelowText: { text: 'Okavo (15va malsupre)' },
  addGClefChangeBeforeText: { text: 'G-klavaro antaŭe' },
  addGClefChangeAfterText: { text: 'G-klavaro poste' },
  addFClefChangeBeforeText: { text: 'F-klavaro antaŭe' },
  addFClefChangeAfterText: { text: 'F-klavaro poste' },
  addCClefChangeBeforeText: { text: 'C-klavaro antaŭe' },
  addCClefChangeAfterText: { text: 'C-klavaro poste' },
  toggleStaccText: { text: 'Stakato' },
  toggleAccentText: { text: 'Akĉento' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Markato' },
  toggleStaccissText: { text: 'Stakatisimo' },
  toggleSpiccText: { text: 'Spicato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Helpo' },
  goToHelpPageText: { text: 'mei-friend helpaj paĝoj' },
  goToCheatSheet: { text: 'mei-friend furora folio' },
  showChangelog: { text: 'mei-friend ŝanĝoprotokolo' },
  goToGuidelines: { text: 'MEI Orientlinioj' },
  consultGuidelinesForElementText: { text: 'Orientlinioj por nuna elemento' },
  provideFeedback: { text: 'Proponi reenigojn' },
  resetDefault: { text: 'Rekomenci al defaŭlta' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Ŝalti MIDI Stirkontrolan Barilon' },
  showFacsimileButton: { description: 'Ŝalti Facsimila Panelo' },
  showAnnotationsButton: { description: 'Ŝalti Priskriban Panelon' },
  showSettingsButton: { description: 'Montri Agordojn Panelon' },

  // Footer texts
  leftFooter: {
    html:
      'Gastigita de <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'ĉe <a href="https://mdw.ac.at">mdw</a>, kun ' +
      heart +
      ' el Vieno. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Imprinto</a>.',
  },
  loadingVerovio: { text: 'Ŝarĝante Verovio' },
  verovioLoaded: { text: 'ŝargita' },
  convertedToPdf: { text: 'konvertita al PDF' },
  statusBarCompute: { text: 'Kalkuli' },
  middleFooterPage: { text: 'paĝo' },
  middleFooterOf: { text: 'de' },
  middleFooterLoaded: { text: 'ŝargita' },

  // Control menu
  verovioIcon: {
    description: `mei-friend laboraktiveco:
    horloĝa rotacio montras Verovia aktiveco,
    kontraŭhorloĝa rotacismo rapideco de laboranto`,
  },
  decreaseScaleButton: { description: 'Malkreski notadon' },
  verovioZoom: { description: 'Skaligi grandon de notado' },
  increaseScaleButton: { description: 'Pligrandigi notadon' },
  pagination1: { html: 'Paĝo&nbsp;' },
  pagination3: { html: '&nbsp;de' },
  sectionSelect: { description: 'Navigi al koditsekcio/fina strukturo' },
  firstPageButton: { description: 'Iri al unua paĝo' },
  previousPageButton: { description: 'Iri al antaŭa paĝo' },
  paginationLabel: { description: 'Navigado de paĝo: klaku por enigi mem-manan paĝon por montri' },
  nextPageButton: { description: 'Iri al sekva paĝo' },
  lastPageButton: { description: 'Iri al lasta paĝo' },
  flipCheckbox: { description: 'Aŭtomate flugi al kodokursora pozicio' },
  flipButton: { description: 'Mane flugi al kodokursora pozicio' },
  breaksSelect: { description: 'Difini sistemo/paĝa-pauza konduto de notado' },
  breaksSelectNone: { text: 'Nenio' },
  breaksSelectAuto: { text: 'Aŭtomata' },
  breaksSelectMeasure: { text: 'Mezuro' },
  breaksSelectLine: { text: 'Sistemo' },
  breaksSelectEncoded: { text: 'Sistemo kaj paĝo' },
  breaksSelectSmart: { text: 'Saĝa' },
  choiceSelect: { description: 'Choose displayed content for choice elements' },
  choiceDefault: { text: '(default choice)' },
  noChoice: { text: '(nenia elekto disponebla)' },
  updateControlsLabel: { text: 'Ĝisdatigo', description: 'KontrolĜisdatigo konduto de notado post ŝanĝoj en kodado' },
  liveUpdateCheckbox: { description: 'Aŭtomate ĝisdatigi notadon post ŝanĝoj en kodado' },
  codeManualUpdateButton: { description: 'Mane ĝisdatigi notadon' },
  engravingFontSelect: { description: 'Elekti gravejfonton' },
  backwardsButton: { description: 'Navigi maldekstren en notado' },
  forwardsButton: { description: 'Navigi dekstren en notado' },
  upwardsButton: { description: 'Navigi supren en notado' },
  downwardsButton: { description: 'Navigi malsupren en notado' },
  speedLabel: {
    text: 'Rapidigado',
    description:
      'En rapidigada reĝimo, nur la nuna paĝo estas sendita al Verovio por malpliiĝi la rendertempo kun grandaj dosieroj',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: 'Konservi PDF-on', description: 'Konservi kiel PDF-on' },
  pdfCloseButton: { description: 'Fermi vidon por presado' },
  pagesLegendLabel: { text: 'Paĝoramo', singlePage: 'paĝo', multiplePages: 'Paĝoj' },
  selectAllPagesLabel: { text: 'Ĉiuj' },
  selectCurrentPageLabel: { text: 'Nuna paĝo' },
  selectFromLabel: { text: 'de' },
  selectToLabel: { text: 'al' },
  selectPageRangeLabel: { text: 'Paĝoramo:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Nur la nuna paĝo estas rendigita al PDF, ĉar estas aktivigita rapidigada reĝimo. ' +
      'Forvitu rapidigada reĝimo por elekti de ĉiuj paĝoj.',
  },
  pdfPreviewNormalModeTitle: { text: 'Elektu paĝoramon por konservi en PDF.' },

  // Facsimile panel
  facsimileIcon: { description: 'Facsimila panelo' },
  facsimileDecreaseZoomButton: { description: 'Malkreski notadon bildon' },
  facsimileZoom: { description: 'Agordi grandon de notadobildo' },
  facsimileIncreaseZoomButton: { description: 'Pligrandigi notadon bildon' },
  facsimileFullPageLabel: { text: 'Plena paĝo', description: 'Montri tutan facsimilan bildon de paĝo' },
  facsimileFullPageCheckbox: { description: 'Montri tutan facsimilan bildon de paĝo' },
  facsimileShowZonesLabel: { text: 'Montri zonajn kadrojn', description: 'Montri zonajn kadrojn de facsimilo' },
  facsimileShowZonesCheckbox: { description: 'Montri zonajn kadrojn de facsimilo' },
  facsimileEditZonesCheckbox: { description: 'Redakti zonojn de facsimilo' },
  facsimileEditZonesLabel: { text: 'Redakti zonojn', description: 'Redakti zonojn de facsimilo' },
  facsimileCloseButton: { description: 'Fermi facsimilan panelon' },
  facsimileDefaultWarning: { text: 'Neniu facsimila enhavo por montri.' },
  facsimileNoSurfaceWarning: {
    text: 'Neniu surfaca elemento trovita por ĉi tiu paĝo.\n(Eble mankas komenca pb elemento.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Facsimilo sen zonoj nur videbla en plenpaĝa reĝimo.' },
  facsimileImgeNotLoadedWarning: { text: 'Bildo ne ŝargiĝis' },

  // Drag'n'drop
  dragOverlayText: { text: 'Alglitu vian eniran dosieron ĉi tien.' },

  // Public repertoire
  openUrlHeading: { text: 'Malfermi rete alŝutitan kodon per URL' },
  openUrlInstructions: {
    text:
      'Bonvolu elekti el la publika repertuaro aŭ enigi la URL de ' +
      'rete alŝutita muzika kodo sube. Noto: La gastiga servilo devas ' +
      'subteni CORS (cross-origin resource sharing - kunhavigo de fontoj inter diversaj originoj).',
  },
  publicRepertoireSummary: { text: 'Publika repertuaro' },
  sampleEncodingsComposerLabel: { text: 'Komponisto:' },
  sampleEncodingsEncodingLabel: { text: 'Kodo:' },
  sampleEncodingsOptionLabel: { text: 'Elektu kodon...' },
  openUrlButton: { text: 'Malfermi URL' },
  openUrlCancel: { text: 'Malfari' },
  proposePublicRepertoire: {
    html:
      'Ni bonvenigas proponojn por ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'aldonoj al la publika repertuaro' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Elektu kodon...' },
  openUrlChooseComposerText: { text: 'Elektu komponiston...' },
  openUrlOpenEncodingByUrlText: { text: 'Malfermi rete alŝutitan kodon per URL' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Peti GitHub ago-fluon:' },
  githubActionsDescription: {
    text: 'Alklaku "Ruli fluon" por peti de la GitHub API ruli la supran fluon por vi, uzante la enigan konfiguradon indikitaj sube. Via kodo estos reŝutita en ĝia plej lasta versio post la kompletigo de la fluo.',
  },
  githubActionStatusMsgPrompt: { text: 'Ne povis ruli la fluon - GitHub diras' },
  githubActionStatusMsgWaiting: { text: 'Bonvolu esti pacienca dum GitHub pritraktas vian fluon...' },
  githubActionStatusMsgFailure: { text: 'Ne povis ruli la fluon - GitHub diras' },
  githubActionStatusMsgSuccess: { text: 'Fluo estas kompletigita - GitHub diras' },
  githubActionsRunButton: { text: 'Ruli fluon' },
  githubActionsRunButtonReload: { text: 'Reŝargi MEI-dosieron' },
  githubActionsCancelButton: { text: 'Malfari' },
  githubActionsInputSetterFilepath: { text: 'Kopii nunan dosieran vojon al enigo' },
  githubActionsInputSetterSelection: { text: 'Kopii nunan MEI-elekton al enigo' },
  githubActionsInputContainerHeader: { text: 'Eniga agordo' },

  // Fork modals
  forkRepoGithubText: { text: 'Branĉi GitHub deponejon' },
  forkRepoGithubExplanation: {
    text: 'La ligilo, kiun vi sekvis, ' + 'kreos branĉon de la sekva deponejo por redaktado en mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Ĉu tio estas en ordo?' },
  forkRepositoryInstructions: {
    text:
      'Bonvolu elekti el la publika repertuaro aŭ enigi la ' +
      'nomon de GitHub-uzanto aŭ organizo kaj la nomon de la deponejo sur GitHub sube. ' +
      'Via branĉo estos havebla en la menuo GitHub.',
  },
  forkRepositoryGithubText: { text: 'Branĉi GitHub deponejon' },
  forkRepertoireSummary: { text: 'Publika repertuaro' },
  forkRepertoireComposerLabel: { text: 'Komponisto:' },
  forkRepertoireOrganizationLabel: { text: 'Organizo:' },
  forkRepertoireOrganizationOption: { text: 'Elektu GitHub-organizon...' },
  forkRepertoireRepositoryLabel: { text: 'Deponejo:' },
  forkRepertoireRepositoryOption: { text: 'Elektu kodon...' },
  forkRepositoryInputName: { placeholder: 'GitHub-uzanto aŭ organizo' },
  forkRepositoryInputRepoOption: { text: 'Elektu deponejon' },
  forkRepositoryToSelectorText: { text: 'Branĉi al: ' },
  forkRepositoryButton: { text: 'Branĉi deponejon' },
  forkRepositoryCancel: { text: 'Malfari' },
  forkProposePublicRepertoire: {
    html:
      'Ni bonvenigas proponojn por ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'aldonoj al la publika repertuaro' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Elekti etikedon por ĉirkaŭaĵo' },
  selectTagNameForEnclosureOkButton: { value: 'En ordo' },
  selectTagNameForEnclosureCancelButton: { value: 'Malfari' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solid estas decentralizita platformo por socia ligita datumaro. Ensaluti en Solid por krei starajn antaŭeco-analizojn uzante ligita datumaro (RDF).',
  },
  solidProvider: { description: 'Bonvolu elekti Solid identa provizanton (IdP) aŭ precizigi vian propran.' },
  solidLoginBtn: { text: 'Ensaluti' },
  solidOverlayCancel: {
    html: 'Restarigi Solid-sesonon - premu la <span>esc</span> klavon aŭ klaku ĉi tie por malfari',
  },
  solidWelcomeMsg: { text: 'Bonvenon, ' },
  solidLogout: { text: 'Elsaluti' },
  solidLoggedOutWarning: {
    html: `Vi elsalutis el mei-friend's Solid-integrado, sed via retumilo ankoraŭ estas ensalutita en Solid!
      <a id="solidIdPLogoutLink" target="_blank">Klaku ĉi tie por elsaluti el Solid</a>.`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: 'Fermi la Panelon de Notoj' },
  hideAnnotationPanelButton: { description: 'Fermi la Panelon de Notoj' },
  closeAnnotationPanelButton: { description: 'Fermi la Panelon de Notoj' },
  annotationToolsButton: { description: 'Iloj de Notoj' },
  annotationListButton: { description: 'Listigi Notojn' },
  writeAnnotStandoffText: { text: 'Reteja Noto' },
  annotationToolsIdentifyTitle: { text: 'Identigi' },
  annotationToolsIdentifySpan: { text: 'Identigi Muzikan Objekton' },
  annotationToolsHighlightTitle: { text: 'Emfazi' },
  annotationToolsHighlightSpan: { text: 'Emfazi' },
  annotationToolsDescribeTitle: { text: 'Priskribi' },
  annotationToolsDescribeSpan: { text: 'Priskribi' },
  annotationToolsLinkTitle: { text: 'Ligi' },
  annotationToolsLinkSpan: { text: 'Ligi' },
  listAnnotations: { text: 'Neniu notoj disponeblas.' },
  addWebAnnotation: { text: 'Ŝargi Retejan Noto(n)' },
  loadWebAnnotationMessage: { text: 'Entajpu la URL de Reteja Noto aŭ Enhavo de Retejaj Notoj' },
  loadWebAnnotationMessage1: { text: 'Ne eblis ŝargi la provizitan URL-on' },
  loadWebAnnotationMessage2: { text: 'bonvolu reprovi' },
  noAnnotationsToDisplay: { text: 'Neniu notoj por montri' },
  flipPageToAnnotationText: { description: 'Turni paĝon al ĉi tiu noto' },
  describeMarkup: { description: 'Priskribu ĉi tiun markadon' },
  deleteMarkup: { description: 'Forigu ĉi tiun markadon' },
  deleteMarkupConfirmation: { text: 'Ĉu vi certas, ke vi volas forigi ĉi tiun markadon?' },
  deleteAnnotation: { description: 'Forigi ĉi tiun noton' },
  deleteAnnotationConfirmation: { text: 'Ĉu vi certas ke vi volas forigi ĉi tiun noton?' },
  makeStandOffAnnotation: {
    description: 'Stenda-RDF Statuso',
    descriptionSolid: 'Konservi en Solid kiel RDF',
    descriptionToLocal: 'Malfermi stenda-RDF noton en nova langeto',
  },
  makeInlineAnnotation: {
    description: 'Klaku por enlinia noto',
    descriptionCopy: 'Kopii xml:id al la poŝtelefono',
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'elementoj' },
  askForLinkUrl: { text: 'Bonvolu enmeti URL-adreson por ligi' },
  drawLinkUrl: { text: 'Malfermi en nova langeto' },
  askForDescription: { text: 'Bonvolu enmeti tekstan priskribon por apliki' },
  maxNumberOfAnnotationAlert: {
    text1: 'La nombro de anot-elementoj superas agordeblan "Maksimuman nombron de notoj"',
    text2: 'Novaj notoj ankoraŭ povas esti kreitaj kaj montrataj se "Montri notojn" estas ŝaltita.',
  },
  annotationsOutsideScoreWarning: {
    text: 'Bedaŭrinde, estas neeble enmeti notojn ekster &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: 'Ne eblas enmeti noton ĉar la MEI ankorpunkto ne havas xml:id.',
    text2: 'Bonvolu aljuđi identigilojn elektante "Mankanĝi" -> "Re-rendi MEI (kun id-etoj)" kaj provi denove.',
  },
  // Markup tools
  respSelect: {
    text: 'Elekti markad-respondecon',
    description: 'Elekti identigilon de respondeco',
  },
  alternativeEncodingsGrp: {
    text: 'Alternativaj kodoj',
    description: 'Markigoj kiuj enhavas multoblajn versiojn.',
  },
  addChoiceText: {
    text: '<choice>',
    description: 'Grupigas nombron da alternativaj kodoj por la sama punkto en teksto.',
  },
  choiceSicCorr: { text: 'sic | corr', description: 'Metu elekton en <sic> kaj aldonu <corr>.' },
  choiceCorrSic: { text: 'corr | sic', description: 'Metu elekton en <corr> kaj aldonu <sic>.' },
  choiceOrigReg: { text: 'orig | reg', description: 'Metu elekton en <orig> kaj aldonu <reg>.' },
  choiceRegOrig: { text: 'reg | orig', description: 'Metu elekton en <reg> kaj aldonu <orig>.' },
  choiceContentTarget: {
    text: '(elektu enhavon)',
    description: 'Unue elektu enhavon por tiu elemento pasante la muson super <elekto>.',
  },
  addChoice: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addChoiceArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addChoiceAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addSubstText: {
    text: '<subst>',
    description:
      '(anstataŭigo) – Grupigas transskriptajn elementojn kiam la kombino devas esti rigardata kiel unuopa interveno en la teksto.',
  },
  substAddDel: { text: 'add | del', description: 'Metu elekton en <add> kaj aldonu <del>.' },
  substDelAdd: { text: 'del | add', description: 'Metu elekton en <del> kaj aldonu <add>.' },
  substContentTarget: {
    text: '(elektu enhavon)',
    description: 'Unue elektu enhavon por tiu elemento pasante la muson super <anstataŭigo>.',
  },
  addSubst: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addSubstArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addSubstAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  editInterventionsGrp: {
    text: 'Redakciaj intervenoj',
    description: 'Markigoj uzataj por enkodi redakciajn intervenojn.',
  },
  addSuppliedText: {
    text: '<supplied>',
    description: 'Enhavas materialon provizitan de la transskribanto aŭ redaktoro pro iu kialo.',
  },
  addSupplied: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addSuppliedArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addSuppliedAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addUnclearText: {
    text: '<unclear>',
    description:
      'Enhavas materialon kiun oni ne povas transskribi kun certeco ĉar ĝi estas nelegebla aŭ neaŭdebla en la fonto.',
  },
  addUnclear: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addUnclearArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addUnclearAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addSicText: { text: '<sic>', description: 'Enhavas ŝajne malĝustan aŭ eraran materialon.' },
  addSic: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addSicArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addSicAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addCorrText: {
    text: '<corr>',
    description: '(korekto) – Enhavas la ĝustan formon de ŝajne erara pasiĝo.',
  },
  addCorr: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addCorrArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addCorrAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addOrigText: {
    text: '<orig>',
    description:
      '(originalo) – Enhavas materialon kiu estas markita kiel sekva la originalon, anstataŭ esti normaligita aŭ korektita.',
  },
  addOrig: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addOrigArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addOrigAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addRegText: {
    text: '<reg>',
    description: '(reguligo) – Enhavas materialon kiu estas reguligita aŭ normaligita iam ajn.',
  },
  addReg: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addRegArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addRegAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  descMarkupGrp: {
    text: 'Priskriba Markigo',
    description: 'Markigoj uzataj por enkodi intervenojn en la fontmateriaĵo.',
  },
  addAddText: { text: '<add>', description: '(aldono) – Markas aldono al la teksto.' },
  addAdd: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addAddArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addAddAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },
  addDelText: {
    text: '<del>',
    description:
      '(forigo) – Enhavas informon forigitan, markitan kiel forigita, aŭ alie indikitan kiel superflua aŭ fuŝa en la kopia teksto de aŭtoro, skribanto, notanto, aŭ korektisto.',
  },
  addDel: { text: 'Elektitaj elementoj', description: 'Aldonu markigon al elektitaj elementoj.' },
  addDelArtic: { text: 'Artikulado', description: 'Aldonu markigon al artikuladoj en la elektado.' },
  addDelAccid: { text: 'Okaza', description: 'Aldonu markigon al okazaĵoj en la elektado.' },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Rapida Reĝimo',
    description:
      'La rapida reĝimo estas aktiva; nur ludante MIDI-on por la nuntempa paĝo. Por ludi la tutan kodon, malŝaltu la rapidan reĝimon.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Kaŝi la MIDI Ludado-Kontrolobaron' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend Agordoj',
    description: 'mei-friend Agordoj',
  },
  mfReset: {
    text: 'Restaŭri',
    description: 'Restaŭri al mei-friend defaŭlt-agordoj',
  },
  filterSettings: {
    placeholder: 'Filtru agordojn',
    description: 'Tajpu ĉi tie por filtri agordojn',
  },
  closeSettingsButton: {
    description: 'Fermi la Agordojn Panelon',
  },
  hideSettingsButton: {
    description: 'Kaŝi la Agordojn Panelon',
  },
  titleGeneral: {
    text: 'Ĝenerala',
    description: 'Ĝenerala mei-friend agordoj',
  },
  selectToolkitVersion: {
    text: 'Verovio Version',
    description:
      'Elektu Verovio-ilon version ' +
      '(* Ŝanĝante al pli malnovaj versioj antaŭ 3.11.0 ' +
      'eble necesos reŝarĝi pro memorio-problemoj.)',
  },
  toggleSpeedMode: {
    text: 'Rapida Reĝimo',
    description:
      'Baskulo por ŝalti aŭ malŝalti Verovio Rapidan Reĝimon. ' +
      'En rapida reĝimo, nur la nuntempa paĝo ' +
      'estas sendita al Verovio por malpliigi desegnadan tempon kun grandaj dosieroj',
  },
  selectIdStyle: {
    text: 'Stilo de generitaj xml:id-oj',
    description:
      'Stilo de novaj generitaj xml:id-oj (ekzistantaj xml:id-oj ne ŝanĝiĝas)' +
      'ekz., Verovio originala: "note-0000001318117900", ' +
      'Verovio baza 36: "nophl5o", ' +
      'mei-friend stilo: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Enmeti Aplikaĵan Nodon',
    description:
      'Enmeti aplikaĵan noton en la MEI kapon por identigi aplikaĵnomon, version, daton de unua kaj lasta redaktado',
  },
  selectLanguage: {
    text: 'Lingvo',
    description: 'Elektu la lingvon de mei-friend interfaco.',
  },
  // Drag Select
  dragSelection: {
    text: 'Elektu per ŝvebado',
    description: 'Elektu elementojn en la muzika notado per musa ŝvebo',
  },
  dragSelectNotes: {
    text: 'Elektu notojn',
    description: 'Elektu notojn',
  },
  dragSelectRests: {
    text: 'Elektu paŭzojn',
    description: 'Elektu paŭzojn kaj ripetojn (paŭzo, mPaŭzo, batoRipeto, duonoPaŭzoRipeto, paŭzoRipeto)',
  },
  dragSelectControlElements: {
    text: 'Elektu lokigo-elementojn',
    description: 'Elektu lokigo-elementojn (t.e., kun atributo @lokigo: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Elektu ligojn',
    description: 'Elektu ligojn (t.e., elementojn kun atributo @kurbiĝo: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Elektu taktojn',
    description: 'Elektu taktojn',
  },

  // Control Menu
  controlMenuSettings: {
    text: 'Menuo de notacia kontrolado',
    description: 'Definu erojn por montri en la menuo super la muzika notado',
  },
  controlMenuFlipToPageControls: {
    text: 'Montri flipton al paĝaj kontroliloj',
    description: 'Montri flipton al paĝaj kontroliloj en la menuo de notacia kontrolado',
  },
  controlMenuUpdateNotation: {
    text: 'Montri notaciajn ĝisdatigadojn',
    description: 'Montri notaciajn ĝisdatigadojn kaj kondutado de kontroliloj en la menuo de notacia kontrolado',
  },
  controlMenuFontSelector: {
    text: 'Montri tiparon de notado',
    description: 'Montri tiparan (SMuFL) elekton en la menuo de notacia kontrolado',
  },
  controlMenuNavigateArrows: {
    text: 'Montri navigaciajn sagojn',
    description: 'Montri navigaciajn sagojn en la menuo de notacia kontrolado',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Montri rapidan modan markobutonon',
    description: 'Montri rapidan modan markobutonon en la menuo de notacia kontrolado',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI ludado',
    description: 'Agordoj por MIDI ludado',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Montri ludadan ŝprucon',
    description:
      'Kaŭzas montrigon de ŝpruco (bublo en maldekstra suba angulo; ' +
      'klaku por tuj ekigi la ludadon) kiam la MIDI ludkontrolilo estas fermita',
  },
  showMidiPlaybackControlBar: {
    text: 'Montri MIDI ludkontrolilon',
    description: 'Montri MIDI ludkontrolilon',
  },
  scrollFollowMidiPlayback: {
    text: 'Ruli sekvante MIDI ludadon',
    description: 'Ruli la panelon de notado por sekvi la MIDI ludadon sur aktuala paĝo',
  },
  pageFollowMidiPlayback: {
    text: 'Paĝo-sekvanta MIDI ludado',
    description: 'Aŭtomate ŝalti paĝojn por sekvi la MIDI ludadon',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Emfazi nuna sonantaĵojn',
    description: 'Vizuele emfazi la nuna sonantaĵojn en la panelo de notado dum MIDI ludado ',
  },
  selectMidiExpansion: {
    text: 'Ludu-expando',
    description: 'Elektu la ludon de ekspansia elemento por MIDI ludado',
  },

  // Transposition
  titleTransposition: {
    text: 'Transpozicio',
    description: 'Transpozicio de muzika notado',
  },
  enableTransposition: {
    text: 'Ebligi transpozicion',
    description:
      'Ebligi agordojn de transpozicio, kiuj estos aplikitaj per la transpozicia butono sube. La transpozicio estos aplikita nur al la muzika notado, la kodado restas sen ŝanĝo, se vi ne klakas la elementon "Rekrei per Verovio" en la menuo "Manipuli".',
  },
  transposeInterval: {
    text: 'Transpozi per intervalo',
    description:
      'Transpozi la kodadon per kromatika intervalo uzante plej oftajn intervalojn (Verovio subtenas la bazan sistemon de nombroj 40)',
    labels: [
      'Perfekta unisono',
      'Pligrandigita unisono',
      'Malpligrandigita dua',
      'Malgranda dua',
      'Granda dua',
      'Pligrandigita dua',
      'Malpligrandigita tria',
      'Malgranda tria',
      'Granda tria',
      'Pligrandigita tria',
      'Malpligrandigita kvara',
      'Perfekta kvara',
      'Pligrandigita kvara',
      'Malpligrandigita kvinta',
      'Perfekta kvinta',
      'Pligrandigita kvinta',
      'Malpligrandigita sesa',
      'Malgranda sesa',
      'Granda sesa',
      'Pligrandigita sesa',
      'Malpligrandigita sepa',
      'Malgranda sepa',
      'Granda sepa',
      'Pligrandigita sepa',
      'Malpligrandigita okava',
      'Perfekta okava',
    ],
  },
  transposeKey: {
    text: 'Transpozi al tono',
    description: 'Transpozi al tono',
    labels: [
      'C# majora / A# minora',
      'F# majora / D# minora',
      'B majora / G# minora',
      'E majora / C# minora',
      'A majora / F# minora',
      'D majora / B minora',
      'G majora / E minora',
      'C majora / A minora',
      'F majora / D minora',
      'Bb majora / G minora',
      'Eb majora / C minora',
      'Ab majora / F minora',
      'Db majora / Bb minora',
      'Gb majora / Eb minora',
      'Cb majora / Ab minora',
    ],
  },
  transposeDirection: {
    text: 'Direkto de transpozicio',
    description: 'Direkto de transpozicio (supren/malsupren/proksime)',
    labels: ['Supren', 'Malsupren', 'La plej proksima'],
  },
  transposeButton: {
    text: 'Transpozi',
    description:
      'Apliku transpozicion kun supraj agordoj al la muzika notado, dum la MEI kodado restas sen ŝanĝo. Por ankaŭ transpozi la MEI kodadon per la nuna agordo, uzu "Rekrei per Verovio" en la menuo "Manipuli".',
  },

  // Renombri taktojn
  renumberMeasuresHeading: {
    text: 'Renombri taktojn',
    description: 'Agordoj por renombrado de taktaj eroj',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Daŭrigi trans nekompletajn taktojn',
    description: 'Daŭrigi numeradon de taktoj trans nekompletajn taktojn (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Sufikso ĉe nekompletaj taktoj',
    description: 'Uzi numeran sufikson ĉe nekompletaj taktoj (ekz., 23-cont)',
    labels: ['neniu', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Daŭrigi trans finojn',
    description: 'Daŭrigi numeradon de taktoj trans finojn',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Sufikso ĉe finoj',
    description: 'Uzi numeran sufikson ĉe finoj (ekz., 23-a)',
  },

  // Notoj
  titleAnnotations: {
    text: 'Notoj',
    description: 'Agordoj pri muzikaj notoj',
  },
  showAnnotations: {
    text: 'Montri notojn',
    description: 'Montri muzikajn notojn en notaro',
  },
  showAnnotationPanel: {
    text: 'Montri panelon de notoj',
    description: 'Montri panelon de muzikaj notoj',
  },
  annotationDisplayLimit: {
    text: 'Maksimuma nombro de notoj',
    description: 'Maksimuma nombro de muzikaj notoj por montri (grandaj nombroj povas malrapidigi mei-friend)',
  },

  // Facsimilo
  titleFacsimilePanel: {
    text: 'Facsimila panelo',
    description: 'Montri bildojn de la fonteldono, se haveblas',
  },
  showFacsimilePanel: {
    text: 'Montri facsimilan panelon',
    description: 'Montri bildojn de la fonteldono provizitajn en la elemento de facsimilo',
  },
  selectFacsimilePanelOrientation: {
    text: 'Loko de facsimila panelo',
    description: 'Elekti lokon de facsimila panelo rilate al notaro',
    labels: ['maldekstre', 'dekstre', 'supre', 'sube'],
  },
  facsimileZoomInput: {
    text: 'Zoomo de facsimila bildo (%)',
    description: 'Nivelo de la zoomo de facsimila bildo (en procentoj)',
  },
  showFacsimileFullPage: {
    text: 'Montri tutan paĝon',
    description: 'Montri facsimilan bildon sur la tuta paĝo',
  },
  showFacsimileZones: {
    text: 'Montri zonojn de facsimilo',
    description: 'Montri limzonojn de facsimila bildo',
  },
  editFacsimileZones: {
    text: 'Redakti zonojn de facsimilo',
    description: 'Redakti limzonojn de facsimila bildo (ligos limzonojn al facsimilaj zonoj)',
  },

  // Supplied element
  titleSupplied: {
    text: 'Trakti redaktecan enhavon',
    description: 'Kontroli traktadon de redakteca markado',
  },
  showMarkup: {
    text: 'Montri redaktecajn markilojn',
    description: 'Emfazi ĉiujn elementojn enhavitajn de redaktecaj markiloj',
  },
  alternativeVersionContent: {
    text: 'Elekti defaŭltan enhavon por alternativaj kodumoj',
    description: 'Elekti ĉu novkreitaj alternativaj kodumoj estas malplenaj aŭ kopioj de la originala legado',
    labels: ['malplena', 'kopia'],
  },
  suppliedColor: {
    text: 'Elekti koloron por <supplied>',
    description: 'Elekti koloron por <supplied>',
  },
  unclearColor: {
    text: 'Elekti koloron por <unclear>',
    description: 'Elekti koloron por <unclear>',
  },
  sicColor: {
    text: 'Elekti koloron por <sic>',
    description: 'Elekti koloron por <sic>',
  },
  corrColor: {
    text: 'Elekti koloron por <corr>',
    description: 'Elekti koloron por <corr>',
  },
  origColor: {
    text: 'Elekti koloron por <orig>',
    description: 'Elekti koloron por <orig>',
  },
  regColor: {
    text: 'Elekti koloron por <reg>',
    description: 'Elekti koloron por <reg>',
  },
  addColor: {
    text: 'Elekti koloron por <add>',
    description: 'Elekti koloron por <add>',
  },
  delColor: {
    text: 'Elekti koloron por <del>',
    description: 'Elekti koloron por <del>',
  },

  // AGORDOJ DE REDAKCIA ARAJ / AGORDOJ DE KODMIRRO
  editorSettingsHeader: {
    text: 'Agordoj de redakcio',
  },
  cmReset: {
    text: 'Rekomenci',
    description: 'Rekomenci al la mei-friend defaŭltoj',
  },
  titleAppearance: {
    text: 'Aspekto de redaktoro',
    description: 'Kontroli la aspekton de la redaktoro',
  },
  zoomFont: {
    text: 'Fontgrandeco (%)',
    description: 'Ŝanĝi la fontgrandeco de la redaktoro (en procentoj)',
  },
  theme: {
    text: 'Stilo',
    description: 'Elekti la stilon de la redaktoro',
  },
  matchTheme: {
    text: 'Notaro kongruas kun la stilo',
    description: 'Kongruigi la notaron kun la stilo de la redaktoro',
  },
  tabSize: {
    text: 'Grando de registruminterespacoj',
    description: 'Nombro de spacaj signoj por ĉiu registruminterespaco',
  },
  lineWrapping: {
    text: 'Linia envolvo',
    description: 'Ĉu linioj envolviĝas ĉe la fino de la panelo aŭ ne',
  },
  lineNumbers: {
    text: 'Liniaj nombroj',
    description: 'Montri liniajn nombrojn',
  },
  firstLineNumber: {
    text: 'Unua linia nombro',
    description: 'Agordi la unuan linian nombron',
  },
  foldGutter: {
    text: 'Faldi kodblokojn',
    description: 'Ebligi kodblokojn per faldigitaj flugiloj',
  },
  titleEditorOptions: {
    text: 'Agordoj de redaktoro',
    description: 'Kontroli la konduton de la redaktoro',
  },
  autoValidate: {
    text: 'Aŭtomata validigo',
    description: 'Aŭtomate validigi kodon kontraŭ ŝablono post ĉiu redakto',
  },
  autoShowValidationReport: {
    text: 'Aŭtomate montri raporton pri validigo',
    description: 'Aŭtomate montri raporton pri validigo post validigo',
  },
  autoCloseBrackets: {
    text: 'Aŭtomate fermi krampojn',
    description: 'Aŭtomate fermi krampojn post entajpado',
  },
  autoCloseTags: {
    text: 'Aŭtomate fermi etikedojn',
    description: 'Aŭtomate fermi etikedojn post entajpado',
    type: 'bool',
  },
  matchTags: {
    text: 'Kongruecaj etikedoj',
    description: 'Emfazi kongruecajn etikedojn ĉirkaŭ la kursoro de la redaktoro',
  },
  showTrailingSpace: {
    text: 'Emfazi finspacojn',
    description: 'Emfazi senbezonajn finspacojn ĉe la fino de linioj',
  },
  keyMap: {
    text: 'Klavara mapo',
    description: 'Elekti klavaran mapon',
  },

  // Verovio-agordoj
  verovioSettingsHeader: {
    text: 'Verovio-agordoj',
  },
  vrvReset: {
    text: 'Rekomendiĝoj',
    description: 'Rekomencigi Verovion al la mei-friend rekomendiĝoj',
  },

  // Alert-mesaĝoj en main.js
  isSafariWarning: {
    text:
      'Ŝajnas, ke vi uzas Safari kiel vian retumilon, sur kiu ' +
      'mei-friend bedaŭrinde ne subtenas ŝemvalidan. ' +
      'Bonvolu uzi alian retumilon por plena validan subteno.',
  },
  githubLoggedOutWarning: {
    text: `Vi elsalutis el mei-friend's GitHub-integriĝo, sed via retumilo ankoraŭ estas ensalutita en GitHub!
    <a href="https://github.com/logout" target="_blank">Klaku ĉi tie por elsaluti el GitHub</a>.`,
  },
  generateUrlError: {
    text: 'Ne povis generi URL-on por loka dosiero ',
  },
  generateUrlSuccess: {
    text: 'URL sukcese kopiita en poŝmemoron',
  },
  generateUrlNotCopied: {
    text: 'URL ne kopiita en poŝmemoron, bonvolu reprovi!',
  },
  errorCode: { text: 'Erarkodo' },
  submitBugReport: { text: 'Sendu eraraporton' },
  loadingSchema: { text: 'Ŝargante ŝemeron' },
  schemaLoaded: { text: 'Ŝemero ŝargita' },
  noSchemaFound: { text: 'Neniu informo pri ŝemero trovita en MEI.' },
  schemaNotFound: { text: 'Ŝemero ne trovita' },
  errorLoadingSchema: { text: 'Eraro dum ŝargado de ŝemero' },
  notValidated: { text: 'Ne validigita. Premu ĉi tie por validigi.' },
  validatingAgainst: { text: 'Validigante kontraŭ' },
  validatedAgainst: { text: 'Validigita kontraŭ' },
  validationMessages: { text: 'validigaj mesaĝoj' },
  validationComplete: { text: 'Validigo kompletigita' },
  validationFailed: { text: 'Validigo malsukcesis' },
  noErrors: { text: 'neniaj eraroj' },
  errorsFound: { text: 'eraroj trovitaj' }, // 5 eraroj trovitaj

  // GitHub-menu.js
  githubRepository: { text: 'Deponejo' },
  githubBranch: { text: 'Branĉo' },
  githubFilepath: { text: 'Vojo' },
  githubCommit: { text: 'Kontribuo' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Kontribui kiel nova dosiero' } }, value: 'Kontribui' },
  commitLog: { text: 'Kontribuaj protokoloj' },
  githubDate: { text: 'Dato' },
  githubAuthor: { text: 'Aŭtoro' },
  githubMessage: { text: 'Mesaĝo' },
  none: { text: 'Neniu' },
  commitFileNameText: { text: 'Dosiernomo' },
  forkRepository: { text: 'Forki deponejon' },
  forkError: { text: 'Pardonu, ne povis forki deponejon' },
  loadingFile: { text: 'Ŝargante dosieron' },
  loadingFromGithub: { text: 'Ŝargante el GitHub' },
  logOut: { text: 'Elsaluti' },
  githubLogout: { text: 'Elsaluti' },
  selectRepository: { text: 'Elektu deponejon' },
  selectBranch: { text: 'Elektu branĉon' },
  commitMessageInput: { placeholder: 'Ĝisdatigita uzante mei-friend rete' },
  reportIssueWithEncoding: { value: 'Raportu problemon kun kodigado' },
  clickToOpenInMeiFriend: { text: 'Klaku por malfermi en mei-friend' },
  repoAccessError: { text: 'Pardonu, ne povas aliri deponejojn por donita uzanto aŭ organizaĵo' },
  allComposers: { text: 'Ĉiuj komponistoj' }, // fork-repository.js

  // Utilaj mezuraj renumerigi
  renumberMeasuresModalText: { text: 'Renombre mezurojn' },
  renumberMeasuresModalTest: { text: 'Testo' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'estus' },
  renumberMeasuresChangedTo: { text: 'ŝanĝis al' },
  renumberMeasureMeasuresRenumbered: { text: 'mezuroj renumerigis' },

  // Kodo-kontrolilo @accid.ges
  codeCheckerTitle: {
    text: 'Kontroli @accid.ges atributojn (kontraŭ ŝlosilsigno, mezur-spezifaj akcidentoj, kaj ligoj).',
  },
  codeCheckerFix: { text: 'Korekti' },
  codeCheckerFixAll: { text: 'Korekti ĉion' },
  codeCheckerIgnore: { text: 'Ignori' },
  codeCheckerIgnoreAll: { text: 'Ignori ĉion' },
  codeCheckerCheckingCode: { text: 'Kontrolante kodo...' },
  codeCheckerNoAccidMessagesFound: { text: 'Ŝajnas, ke ĉiuj @accid.ges atributoj estas ĝustaj.' },
  codeCheckerMeasure: { text: 'Mezuro' },
  codeCheckerNote: { text: 'Noto' },
  codeCheckerHasBoth: { text: 'havas kaj' },
  codeCheckerAnd: { text: 'kaj' },
  codeCheckerRemove: { text: 'Forigi' },
  codeCheckerFixTo: { text: 'Korekti al' },
  codeCheckerAdd: { text: 'Aldoni' },
  codeCheckerWithContradictingContent: { text: 'kun kontraŭdiranta enhavo' },
  codeCheckerTiedNote: { text: 'Ligita noto' },
  codeCheckerNotSamePitchAs: { text: 'ne la sama alteco kiel' },
  codeCheckerNotSameOctaveAs: { text: 'ne la sama oktavo kiel' },
  codeCheckerNotSameAsStartingNote: { text: 'ne la sama kiel la komenca noto' },
  codeCheckerExtra: { text: 'ekstra' }, // superflua
  codeCheckerHasExtra: { text: 'havas ekstran' }, // havas superfluan
  codeCheckerLacksAn: { text: 'mankas unu' },
  codeCheckerBecauseAlreadyDefined: { text: 'ĉar ĝi jam estas difinita antaŭe en la mezuro' },

  // Averto pri mankantaj ID-oj
  missingIdsWarningAlert: {
    text: 'mei-friend ne povas ruli al la elektitaj elementoj en la kodo. Bonvolu aldoni ID-ojn al la kodo.',
  },
};
