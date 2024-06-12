/**
 * Language file for Bosnian-Croatian-Serbian (latin script).
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'O mei-friend ' },
  showSplashScreen: {
    text: 'Prikaži ekran pri pokretanju',
    description: 'Prikazuje mei-friend ekran pri pokretanju aplikacije',
  },
  splashBody: {
    html: `
    <p>
      mei-friend je uređivač za <a href="https://music-encoding.org">muzičke kodove</a>, hostiran na
      <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Univerzitetu muzike i izvođačkih umetnosti u Beču</a>. 
      Molimo vas da pogledate našu <a href="https://mei-friend.github.io" target="_blank">obimnu dokumentaciju</a> za 
      dodatne informacije.
    </p>
    <p>
      Iako je mei-friend aplikacija zasnovana na pregledaču, vaši lični podaci (uključujući kod koji
      uređujete, postavke aplikacije i trenutne prijave ako ih ima) se čuvaju u lokalnom skladištu vašeg pregledača
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"
        >lokalnog skladišta</a
      > i ne šalju se ili ne čuvaju na našim serverima.
    </p>
    <p>
      Podaci se prenose na GitHub samo kada ih izričito zatražite (npr. kada se prijavite na GitHub, učitate
      svoj kod iz repozitorijuma na GitHub-u ili kada zatražite GitHub akcioni radni tok da se
      pokrene za vas). Slično tome, podaci se prenose vašem odabranom Solid provajderu samo kada ih izričito
      zatražite (npr. kada se prijavite na Solid, učitate ili sačuvate notacije sa odstupanjem).
    </p>
    <p>
      Koristimo <a href="https://matomo.org/" target="_blank">Matomo</a>
      za prikupljanje anonimnih statistika o upotrebi. To uključuje vašu skraćenu IP adresu (omogućava geolokaciju na
      nivou države, ali ne i daljnju identifikaciju), vaš pregledač i operativni sistem, odakle ste došli
      (tj. web stranica s koje ste došli), vreme i trajanje vaše posete i stranice koje ste posetili. Ove
      informacije se čuvaju na instanci Matomo koja se izvršava na serverima mdw &ndash; Univerziteta muzike i
      izvođačkih umetnosti u Beču i ne dele se sa trećim licima.
    </p>
    <p>
      Toolkit Verovio se učitava sa <a href="https://verovio.org" target="_blank">https://verovio.org</a>, hostiran od
      strane <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
      To omogućava mei-friend da bude u toku sa najnovijom verzijom toolkit-a i
      da pruži izbor svih podržanih verzija preko panela sa podešavanjima. 
      Kada koristite mei-friend, vaša IP adresa je vidljiva RISM Digital-u.
    </p>
    <p>
      Na kraju, MIDI reprodukcija se prikazuje koristeći SGM_plus zvukovni font koji pruža Google Magenta, i služi
      preko googleapis.com. Vaša IP adresa je stoga vidljiva Google-u prilikom iniciranja MIDI reprodukcije. Ako
      ne želite da se ovo dešava, molimo vas da se suzdržite od korišćenja funkcije MIDI reprodukcije.
    </p>
    <p>
      mei-friend je razvijen od strane
      <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Wernera Goebla</a> i
      <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">Davida M. Weigla</a> na Katedri za Muzičku
      Akustiku &ndash; Bečki Stil u mdw &ndash; Univerzitetu muzike i izvođačkih umetnosti u Beču, i
      licenciran je pod
      <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
        >GNU Affero General Public License v3.0</a
      >. Molimo vas da pogledate našu
      <a href="https://mei-friend.github.io/about/" target="_blank">stranicu zahvalnosti</a> za dodatne
      informacije o saradnicima i open-source komponentama koje su ponovo korišćene u našem projektu. Zahvaljujemo
      se našim kolegama na njihovim doprinosima i vođstvu.
    </p>
    <p>
      Razvoj mei-friend Web aplikacije finansira
      <a href="https://fwf.ac.at" target="_blank">Austrian Science Fund (FWF)</a> u okviru projekata
      <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
        >P 34664-G (Signature Sound Vienna)</a
      >
      i <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
    </p>`,
  },
  splashGotItButtonText: { text: 'Razumem!' },
  splashVersionText: { text: 'Verzija' },
  splashAlwaysShow: {
    text: 'Uvek prikazuj ovaj početni ekran',
    description: 'Uvek prikazuj ovaj početni ekran prilikom pokretanja aplikacije',
  },
  splashAlwaysShowLabel: {
    text: 'Uvek prikazuj ovaj početni ekran',
    description: 'Uvek prikazuj ovaj početni ekran prilikom pokretanja aplikacije',
  },

  // Glavna traka sa menijem
  githubLoginLinkText: { text: 'git' },

  month: {
    jan: 'Januar',
    feb: 'Februar',
    mar: 'Mart',
    apr: 'April',
    may: 'Maj',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Avgust',
    sep: 'Septembar',
    oct: 'Oktobar',
    nov: 'Novembar',
    dec: 'Decembar',
  },

  // FILE MENU ITEM
  fileMenuTitle: { text: 'Datoteka' },
  openMeiText: { text: 'Otvori datoteku' },
  openUrlText: { text: 'Otvori URL' },
  openExample: {
    text: 'Javni repertoar',
    description: 'Otvori listu javnih repertoara',
  },
  importMusicXml: { text: 'Uvezi MusicXML' },
  importHumdrum: { text: 'Uvezi Humdrum' },
  importPae: { text: 'Uvezi PAE, ABC' },
  saveMeiText: { text: 'Sačuvaj MEI' },
  saveMeiBasicText: { text: 'Sačuvaj kao MEI osnovni' },
  saveSvg: { text: 'Sačuvaj SVG' },
  saveMidi: { text: 'Sačuvaj MIDI' },
  printPreviewText: { text: 'Pregledaj PDF' },
  generateUrlText: { text: 'Generiši mei-friend URL' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Kod' },
  undoMenuText: { text: 'Poništi' },
  redoMenuText: { text: 'Ponovi' },
  startSearchText: { text: 'Pretraži' },
  findNextText: { text: 'Pronađi sledeće' },
  findPreviousText: { text: 'Pronađi prethodno' },
  replaceMenuText: { text: 'Zameni' },
  replaceAllMenuText: { text: 'Zameni sve' },
  indentSelectionText: { text: 'Uvuci izbor' },
  surroundWithTagsText: { text: 'Ograniči oznakama' },
  surroundWithLastTagText: { text: 'Ograniči sa ' },
  jumpToLineText: { text: 'Idi na liniju' },
  toMatchingTagText: { text: 'Idi na odgovarajuću oznaku' },
  manualValidateText: { text: 'Validiraj' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Prikaz' },
  notationTop: { text: 'Notacija gore' },
  notationBottom: { text: 'Notacija dole' },
  notationLeft: { text: 'Notacija levo' },
  notationRight: { text: 'Notacija desno' },
  showSettingsMenuText: { text: 'Panel sa podešavanjima' },
  showAnnotationMenuText: { text: 'Panel sa napomenama' },
  showFacsimileMenuText: { text: 'Panel sa faksimilom' },
  showPlaybackControlsText: { text: 'Kontrole reprodukcije' },
  facsimileTop: { text: 'Faksimil gore' },
  facsimileBottom: { text: 'Faksimil dole' },
  facsimileLeft: { text: 'Faksimil levo' },
  facsimileRight: { text: 'Faksimil desno' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Manipulacija' },
  invertPlacementText: { text: 'Invertuj postavljanje' },
  betweenPlacementText: { text: 'Između postavljanja' },
  addVerticalGroupText: { text: 'Dodaj vertikalnu grupu' },
  deleteText: { text: 'Obriši element' },
  pitchChromUpText: { text: 'Visinski pomak hromatski gore' },
  pitchChromDownText: { text: 'Visinski pomak hromatski dole' },
  pitchUpDiatText: { text: 'Visinski pomak dijatonski gore' },
  pitchDownDiatText: { text: 'Visinski pomak dijatonski dole' },
  pitchOctaveUpText: { text: 'Visinski pomak 1 oktavu gore' },
  pitchOctaveDownText: { text: 'Visinski pomak 1 oktavu dole' },
  staffUpText: { text: 'Element 1 stav gore' },
  staffDownText: { text: 'Element 1 stav dole' },
  increaseDurText: { text: 'Povećaj trajanje' },
  decreaseDurText: { text: 'Smanji trajanje' },
  cleanAccidText: { text: 'Proveri @accid.ges' },
  renumberMeasuresTestText: { text: ' Renumeriraj mere (test)' },
  renumberMeasuresExecText: { text: ' Renumeriraj mere (izvrši)' },
  addIdsText: { text: 'Dodaj ID-ove MEI' },
  removeIdsText: { text: 'Ukloni ID-ove iz MEI' },
  reRenderMeiVerovio: { text: ' Ponovo renderuj putem Verovio' },
  addFacsimile: { text: 'Dodaj element faksimila' },
  ingestFacsimileText: { text: 'Unesi faksimil' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Umetni' },
  addDoubleSharpText: { html: 'Dupla oštrica &#119082;' },
  addSharpText: { html: 'Oštrica &#9839;' },
  addNaturalText: { html: 'Naturalna oznaka &#9838;' },
  addFlatText: { html: 'Meka oznaka &#9837;' },
  addDoubleFlatText: { html: 'Dvostruka meka oznaka &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Direktiva' },
  addDynamicsText: { text: 'Dinamika' },
  addSlurText: { text: 'Legato' },
  addTieText: { text: 'Legiranje' },
  addCrescendoHairpinText: { text: 'Krescendo dužina' },
  addDiminuendoHairpinText: { text: 'Diminuendo dužina' },
  addBeamText: { text: 'Grupa nota' },
  addBeamSpanText: { text: 'Razmak između grupa nota' },
  addSuppliedText: { text: 'Ispravka' },
  addSuppliedArticText: { text: 'Ispravka (Artikulacija)' },
  addSuppliedAccidText: { text: 'Ispravka (Akcent)' },
  addArpeggioText: { text: 'Arpeđo' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Gliđando' },
  addPedalDownText: { text: 'Pedala dolje' },
  addPedalUpText: { text: 'Pedala gore' },
  addTrillText: { text: 'Tril' },
  addTurnText: { text: 'Obrt' },
  addTurnLowerText: { text: 'Obrt prema dole' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Mordent prema gore' },
  addOctave8AboveText: { text: 'Oktava (8va iznad)' },
  addOctave15AboveText: { text: 'Oktava (15va iznad)' },
  addOctave8BelowText: { text: 'Oktava (8va ispod)' },
  addOctave15BelowText: { text: 'Oktava (15va ispod)' },
  addGClefChangeBeforeText: { text: 'Promena G ključa pre' },
  addGClefChangeAfterText: { text: 'Promena G ključa posle' },
  addFClefChangeBeforeText: { text: 'Promena F ključa pre' },
  addFClefChangeAfterText: { text: 'Promena F ključa posle' },
  addCClefChangeBeforeText: { text: 'Promena C ključa pre' },
  addCClefChangeAfterText: { text: 'Promena C ključa posle' },
  toggleStaccText: { text: 'Stakato' },
  toggleAccentText: { text: 'Akcent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Markato' },
  toggleStaccissText: { text: 'Stakatisimo' },
  toggleSpiccText: { text: 'Spikato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Pomoć' },
  goToHelpPageText: { text: 'mei-friend stranice za pomoć' },
  goToCheatSheet: { text: 'mei-friend prečaci' },
  showChangelog: { text: 'mei-friend dnevnik promjena' },
  goToGuidelines: { text: 'MEI Smjernice' },
  consultGuidelinesForElementText: { text: 'Smjernice za trenutni element' },
  provideFeedback: { text: 'Dajte povratnu informaciju' },
  resetDefault: { text: 'Vrati na zadano' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Prikaži MIDI kontrolnu traku za reprodukciju' },
  showFacsimileButton: { description: 'Prikaži Facsimile panel' },
  showAnnotationsButton: { description: 'Prikaži panel sa napomenama' },
  showSettingsButton: { description: 'Prikaži panel sa postavkama' },

  // Footer texts
  leftFooter: {
    html:
      'Hosted by <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'at <a href="https://mdw.ac.at">mdw</a>, with ' +
      heart +
      ' from Vienna. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Impresum</a>.',
  },
  loadingVerovio: { text: 'Učitavanje Verovija' },
  verovioLoaded: { text: 'učitan' },
  convertedToPdf: { text: 'pretvoren u PDF' },
  statusBarCompute: { text: 'Izračun' },
  middleFooterPage: { text: 'stranica' },
  middleFooterOf: { text: 'od' },
  middleFooterLoaded: { text: 'učitano' },

  // Control menu
  verovioIcon: {
    description: `Aktivnost mei-friend radnika:
  kazaljka na satu označava aktivnost Verovija,
  kontra-kazaljka na satu brzinu aktivnosti radnika`,
  },
  decreaseScaleButton: { description: 'Smanji notnu lestvicu' },
  verovioZoom: { description: 'Promijeni veličinu notacije' },
  increaseScaleButton: { description: 'Povećaj notnu lestvicu' },
  pagination1: { html: 'Stranica&nbsp;' },
  pagination3: { html: '&nbsp;od' },
  sectionSelect: { description: 'Navigirajte do trenutnog elementa' },
  firstPageButton: { description: 'Idi na prvu stranicu' },
  previousPageButton: { description: 'Idi na prethodnu stranicu' },
  paginationLabel: { description: 'Navigacija stranicom: kliknite da biste ručno uneli broj stranice za prikazivanje' },
  nextPageButton: { description: 'Idi na sljedeću stranicu' },
  lastPageButton: { description: 'Idi na posljednju stranicu' },
  flipCheckbox: { description: 'Automatski prebacite stranicu na trenutni položaj kodiranja' },
  flipButton: { description: 'Ručno prebacite stranicu na trenutni položaj kodiranja' },
  breaksSelect: { description: 'Definirajte ponašanje prekida sistema/stranice notacije' },
  breaksSelectNone: { text: 'Nijedan' },
  breaksSelectAuto: { text: 'Automatski' },
  breaksSelectMeasure: { text: 'Mjera' },
  breaksSelectLine: { text: 'Sistem' },
  breaksSelectEncoded: { text: 'Sistem i stranica' },
  breaksSelectSmart: { text: 'Pametno' },
  updateControlsLabel: {
    text: 'Ažuriraj',
    description: 'Ponašanje ažuriranja kontrole notacije nakon promjena u kodiranju',
  },
  liveUpdateCheckbox: { description: 'Automatski ažuriraj notaciju nakon promjena u kodiranju' },
  codeManualUpdateButton: { description: 'Ručno ažuriraj notaciju' },
  engravingFontSelect: { description: 'Odabir graviranog fonta' },
  backwardsButton: { description: 'Navigacija u lijevo u notaciji' },
  forwardsButton: { description: 'Navigacija u desno u notaciji' },
  upwardsButton: { description: 'Navigacija prema gore u notaciji' },
  downwardsButton: { description: 'Navigacija prema dolje u notaciji' },
  speedLabel: {
    text: 'Brzi režim',
    description:
      'U brzom režimu, samo trenutna stranica se šalje Veroviu kako bi se smanjilo vrijeme rendiranja kod velikih datoteka',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: 'Spremi PDF', description: 'Spremi kao PDF' },
  pdfCloseButton: { description: 'Zatvori prikaz ispisa' },
  pagesLegendLabel: { text: 'Raspon stranica', singlePage: 'stranica', multiplePages: 'Stranice' },
  selectAllPagesLabel: { text: 'Sve' },
  selectCurrentPageLabel: { text: 'Trenutna stranica' },
  selectFromLabel: { text: 'od:' },
  selectToLabel: { text: 'do:' },
  selectPageRangeLabel: { text: 'Raspon stranica:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Samo trenutna stranica je renderirana u PDF-u, jer je aktiviran brzi režim. ' +
      'Poništite brzi režim kako biste odabrali iz svih stranica.',
  },
  pdfPreviewNormalModeTitle: { text: 'Odaberite raspon stranica za spremanje u PDF.' },

  // Facsimile panel
  facsimileIcon: { description: 'Facsimile panel' },
  facsimileDecreaseZoomButton: { description: 'Smanji sliku notacije' },
  facsimileZoom: { description: 'Prilagodi veličinu slike notacije' },
  facsimileIncreaseZoomButton: { description: 'Povećaj sliku notacije' },
  facsimileFullPageLabel: { text: 'Puna stranica', description: 'Prikaži punu stranicu facsimile slike' },
  facsimileFullPageCheckbox: { description: 'Prikaži punu stranicu facsimile slike' },
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
  dragOverlayText: { text: 'Povucite svoju ulaznu datoteku ovde.' },

  // Public repertoire
  openUrlHeading: { text: 'Otvorite enkodiranje na vebu putem URL-a' },
  openUrlInstructions: {
    text:
      'Molimo vas da izaberete iz javnog repertoara ili unesete URL ' +
      'enkodiranja muzike na vebu ispod. Napomena: Server domaćin mora ' +
      'da podržava deljenje resursa putem različitih izvora (CORS).',
  },
  publicRepertoireSummary: { text: 'Javni repertoar' },
  sampleEncodingsComposerLabel: { text: 'Kompozitor:' },
  sampleEncodingsEncodingLabel: { text: 'Enkodiranje:' },
  sampleEncodingsOptionLabel: { text: 'Izaberite enkodiranje...' },
  openUrlButton: { text: 'Otvorite URL' },
  openUrlCancel: { text: 'Otkaži' },
  proposePublicRepertoire: {
    html:
      'Dobrodošli su predlozi za ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'dodatke javnom repertoaru' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Izaberite enkodiranje...' },
  openUrlChooseComposerText: { text: 'Izaberite kompozitora...' },
  openUrlOpenEncodingByUrlText: { text: 'Otvorite enkodiranje na vebu putem URL-a' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Zahtev za GitHub Action tok:' },
  githubActionsDescription: {
    text: 'Kliknite na "Pokreni tok" da biste zatražili da GitHub API izvrši tok iznad za vas, koristeći konfiguraciju unetu ispod. Vaša enkodiranja će se ponovo učitati u svojoj najnovijoj verziji nakon završetka izvršenja toka.',
  },
  githubActionStatusMsgPrompt: { text: 'Tok se nije mogao izvršiti - GitHub javlja' },
  githubActionStatusMsgWaiting: { text: 'Molimo vas da budete strpljivi dok GitHub obradi vaš tok...' },
  githubActionStatusMsgFailure: { text: 'Tok se nije mogao izvršiti - GitHub javlja' },
  githubActionStatusMsgSuccess: { text: 'Izvršen je tok - GitHub javlja' },
  githubActionsRunButton: { text: 'Pokreni tok' },
  githubActionsRunButtonReload: { text: 'Učitaj MEI fajl ponovo' },
  githubActionsCancelButton: { text: 'Otkaži' },
  githubActionsInputSetterFilepath: { text: 'Kopiraj trenutnu putanju fajla u unos' },
  githubActionsInputSetterSelection: { text: 'Kopiraj trenutnu MEI selekciju u unos' },
  githubActionsInputContainerHeader: { text: 'Konfiguracija unosa' },

  // Fork modals
  forkRepoGithubText: { text: 'Napravi kopiju GitHub repozitorijuma' },
  forkRepoGithubExplanation: {
    text: 'Link koji ste pratili ' + 'će kreirati GitHub kopiju sledećeg repozitorijuma za uređivanje u mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Da li je ovo u redu?' },
  forkRepositoryInstructions: {
    text:
      'Molimo vas da izaberete iz javnog repertoara ili unesete ' +
      'ime korisnika ili organizacije na GitHubu i ime repozitorijuma na GitHubu ispod. ' +
      'Vaša kopija repozitorijuma postaće dostupna u meniju za GitHub.',
  },
  forkRepositoryGithubText: { text: 'Napravi kopiju GitHub repozitorijuma' },
  forkRepertoireSummary: { text: 'Javni repertoar' },
  forkRepertoireComposerLabel: { text: 'Kompozitor:' },
  forkRepertoireOrganizationLabel: { text: 'Organizacija:' },
  forkRepertoireOrganizationOption: { text: 'Izaberite GitHub organizaciju...' },
  forkRepertoireRepositoryLabel: { text: 'Repozitorijum:' },
  forkRepertoireRepositoryOption: { text: 'Izaberite enkodiranje...' },
  forkRepositoryInputName: { placeholder: 'Korisnik na GitHubu ili organizacija' },
  forkRepositoryInputRepoOption: { text: 'Izaberite repozitorijum' },
  forkRepositoryToSelectorText: { text: 'Kopiraj u: ' },
  forkRepositoryButton: { text: 'Napravi kopiju repozitorijuma' },
  forkRepositoryCancel: { text: 'Otkaži' },
  forkProposePublicRepertoire: {
    html:
      'Dobrodošli su predlozi za ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'dodatke javnom repertoaru' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Okruži tagom' },
  selectTagNameForEnclosureOkButton: { value: 'U redu' },
  selectTagNameForEnclosureCancelButton: { value: 'Otkaži' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solid je decentralizovana platforma za društveni linked data platform. Prijavite se na Solid da biste kreirali anotacije sa linked podacima (RDF).',
  },
  solidProvider: { description: 'Molimo vas da izaberete Solid identitet provajdera (IdP) ili navedete svoj.' },
  solidLoginBtn: { text: 'Prijavite se' },
  solidOverlayCancel: { html: 'Povratak Solid sesije - pritisnite <span>esc</span> ili kliknite ovde za otkazivanje' },
  solidWelcomeMsg: { text: 'Dobrodošli, ' },
  solidLogout: { text: 'Odjava' },
  solidLoggedOutWarning: {
    html: `Odjavili ste se iz mei-friend-ove Solid integracije, ali vaš pretraživač je i dalje prijavljen na Solidu!
      <a id="solidIdPLogoutLink" target="_blank">Kliknite ovde da se odjavite sa Solida</a>.`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: 'Zatvori panel sa napomenama' },
  hideAnnotationPanelButton: { description: 'Zatvori panel sa napomenama' },
  closeAnnotationPanelButton: { description: 'Zatvori panel sa napomenama' },
  annotationToolsButton: { text: 'Alatke', description: 'Alatke za napomene' },
  annotationListButton: { text: 'Lista', description: 'Lista napomena' },
  writeAnnotStandoffText: { text: 'Web napomena' },
  annotationToolsIdentifyTitle: { text: 'Identifikacija' },
  annotationToolsIdentifySpan: { text: 'Identifikacija muzičkog objekta' },
  annotationToolsHighlightTitle: { text: 'Istakni' },
  annotationToolsHighlightSpan: { text: 'Istakni' },
  annotationToolsDescribeTitle: { text: 'Opis' },
  annotationToolsDescribeSpan: { text: 'Opis' },
  annotationToolsLinkTitle: { text: 'Veza' },
  annotationToolsLinkSpan: { text: 'Veza' },
  listAnnotations: { text: 'Nema dostupnih napomena.' },
  addWebAnnotation: { text: 'Učitaj Web napomene' },
  loadWebAnnotationMessage: { text: 'Unesite URL Web napomene ili spremnika Web napomena' },
  loadWebAnnotationMessage1: { text: 'Nije moguće učitati navedeni URL' },
  loadWebAnnotationMessage2: { text: 'pokušajte ponovo' },
  noAnnotationsToDisplay: { text: 'Nema napomena za prikaz' },
  flipPageToAnnotationText: { description: 'Pređite na ovu napomenu' },
  deleteAnnotation: { description: 'Obrišite ovu napomenu' },
  deleteAnnotationConfirmation: { text: 'Da li ste sigurni da želite da obrišete ovu napomenu?' },
  makeStandOffAnnotation: {
    description: 'Stand-off status (RDF)',
    descriptionSolid: 'Upiši u Solid kao RDF',
    descriptionToLocal: 'Otvori stand-off (RDF) napomenu u novom tabu',
  },
  makeInlineAnnotation: {
    description: 'Kliknite za in-line napomenu',
    descriptionCopy: 'Kopirajte xml:id u klipbord',
  },
  pageAbbreviation: { text: 'str.' },
  elementsPlural: { text: 'elementi' },
  askForLinkUrl: { text: 'Unesite URL za povezivanje' },
  drawLinkUrl: { text: 'Otvori u novom tabu' },
  askForDescription: { text: 'Unesite tekstualni opis za primenu' },
  maxNumberOfAnnotationAlert: {
    text1: 'Broj elemenata napomene premašuje konfigurabilni "Maksimalni broj napomena"',
    text2: 'Nove napomene se još uvek mogu generisati i prikazivati ako je postavljeno "Prikaži napomene".',
  },
  annotationsOutsideScoreWarning: {
    text: 'Nažalost, trenutno nije moguće upisivanje napomena van &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: 'Nije moguće upisivanje napomene jer MEI referentna tačka nema xml:id.',
    text2:
      'Molimo vas da dodelite identifikatore tako što ćete izabrati "Manipulacija" -> "Ponovno renderovanje MEI (s ID-ima)" i pokušati ponovo.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Režim brzine',
    description:
      'Aktivan je režim brzine; reprodukcija MIDI-ja je moguća samo za trenutnu stranicu. Da biste reprodukovali ceo zapis, onemogućite režim brzine.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Sakrij traku za kontrolu reprodukcije MIDI-ja' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend Postavke',
    description: 'mei-friend Postavke',
  },
  mfReset: {
    text: 'Podrazumevane',
    description: 'Vrati na mei-friend podrazumevane postavke',
  },
  filterSettings: {
    placeholder: 'Filtriraj postavke',
    description: 'Ovde unesite tekst za filtriranje postavki',
  },
  closeSettingsButton: {
    description: 'Zatvori panel postavki',
  },
  hideSettingsButton: {
    description: 'Zatvori panel postavki',
  },
  titleGeneral: {
    text: 'Opšte',
    description: 'Opšte mei-friend postavke',
  },
  selectToolkitVersion: {
    text: 'Verzija Verovio alatki',
    description:
      'Izaberite verziju Verovio alatki ' +
      '(* Premeštanje na starije verzije pre 3.11.0 ' +
      'može zahtevati osveženje zbog problema sa memorijom.)',
  },
  toggleSpeedMode: {
    text: 'Režim brzine',
    description:
      'Prekidač za Verovio režim brzine. ' +
      'U režimu brzine, samo trenutna stranica ' +
      'se šalje Verovio-u kako bi se smanjilo vreme za renderovanje ' +
      'sa velikim datotekama',
  },
  selectIdStyle: {
    text: 'Stil generisanih xml:id-ova',
    description:
      'Stil novih generisanih xml:id-ova (postojeći xml:id-ovi se ne menjaju)' +
      'npr., Verovio original: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend stil: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Dodaj izjavu o aplikaciji',
    description:
      'Dodajte izjavu o aplikaciji u opis kodiranja u MEI zaglavlju, koja identifikuje naziv aplikacije, verziju, datum prvog i poslednjeg uređivanja',
  },
  selectLanguage: {
    text: 'Jezik',
    description: 'Izaberite jezik sučelja mei-friend-a.',
  },
  // Drag select
  dragSelection: {
    text: 'Izaberite prevlačenjem',
    description: 'Izaberite elemente u notaciji pomoću prevlačenja mišem',
  },
  dragSelectNotes: {
    text: 'Izaberite note',
    description: 'Izaberite note',
  },
  dragSelectRests: {
    text: 'Izaberite odmore',
    description: 'Izaberite odmore i ponavljanja (odmor, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Izaberite elemente pozicije',
    description: 'Izaberite elemente pozicije (tj. s atributom @placement: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Izaberite laktove',
    description: 'Izaberite laktove (tj. elemente s atributom @curvature: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Izaberite taktove',
    description: 'Izaberite taktove',
  },

  // Control menu
  controlMenuSettings: {
    text: 'Traka kontrole notacije',
    description: 'Definirajte stavke koje će biti prikazane u izborniku kontrole iznad notacije',
  },
  controlMenuFlipToPageControls: {
    text: 'Prikaži kontrole za prelazak na stranicu',
    description: 'Prikaži kontrole za prelazak na stranicu u izborniku kontrole notacije',
  },
  controlMenuUpdateNotation: {
    text: 'Prikaži kontrole za ažuriranje notacije',
    description: 'Prikaži kontrole za ponašanje ažuriranja notacije u izborniku kontrole notacije',
  },
  controlMenuFontSelector: {
    text: 'Prikaži odabir fonta notacije',
    description: 'Prikaži odabir fonta (SMuFL) u izborniku kontrole notacije',
  },
  controlMenuNavigateArrows: {
    text: 'Prikaži strelice za navigaciju',
    description: 'Prikaži strelice za navigaciju notacije u izborniku kontrole notacije',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Prikaži kućicu za brzi način',
    description: 'Prikaži kućicu za brzi način notacije u izborniku kontrole notacije',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI reprodukcija',
    description: 'Postavke MIDI reprodukcije',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Prikaži prečicu za reprodukciju',
    description:
      'Izaziva prikaz prečice (balon u donjem lijevom kutu; ' +
      'kliknite da odmah započnete reprodukciju) kada je traka kontrole MIDI reprodukcije zatvorena',
  },
  showMidiPlaybackControlBar: {
    text: 'Prikaži traku kontrole MIDI reprodukcije',
    description: 'Prikaži traku kontrole MIDI reprodukcije',
  },
  scrollFollowMidiPlayback: {
    text: 'Slijedi MIDI reprodukciju prevlačenjem',
    description: 'Pomiče panel notacije kako bi slijedio MIDI reprodukciju na trenutnoj stranici',
  },
  pageFollowMidiPlayback: {
    text: 'Slijedi stranicu prema MIDI reprodukciji',
    description: 'Automatski prelazi stranice kako bi slijedio MIDI reprodukciju',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Istakni trenutno zvučne note',
    description: 'Vizualno istakni trenutno zvučne note u panelu notacije tijekom MIDI reprodukcije ',
  },
  selectMidiExpansion: {
    text: 'Proširenje reprodukcije',
    description: 'Izaberite element proširenja koji će se koristiti za MIDI reprodukciju',
  },

  // Transposition
  titleTransposition: {
    text: 'Transponiraj',
    description: 'Transponiraj informacije o notama',
  },
  enableTransposition: {
    text: 'Omogući transponiranje',
    description:
      'Omogućuje postavke transponiranja koje će se primijeniti klikom na gumb za transponiranje ispod. Transponiranje će se primijeniti samo na notaciju, kodiranje ostaje nepromijenjeno, osim ako ne kliknete stavku "Ponovno izmijenite putem Verovija" u izborniku "Manipuliraj".',
  },
  transposeInterval: {
    text: 'Transponiraj po intervalu',
    description:
      'Transponiraj kodiranje po kromatskom intervalu uz najčešće intervale (Verovio podržava osnovni sustav brojeva 40)',
    labels: [
      'Savršena primna',
      'Povećana primna',
      'Smanjena sekunda',
      'Mala sekunda',
      'Velika sekunda',
      'Povećana sekunda',
      'Smanjena terca',
      'Mala terca',
      'Velika terca',
      'Povećana terca',
      'Smanjeni kvart',
      'Savršeni kvart',
      'Povećani kvart',
      'Smanjena kvinta',
      'Savršena kvinta',
      'Povećana kvinta',
      'Smanjena seksta',
      'Mala seksta',
      'Velika seksta',
      'Povećana seksta',
      'Smanjena sedma',
      'Mala sedma',
      'Velika sedma',
      'Povećana sedma',
      'Smanjena osma',
      'Savršena osma',
    ],
  },
  transposeKey: {
    text: 'Transponiraj do tona',
    description: 'Transponiraj do tona',
    labels: [
      'C# dur / A# mol',
      'F# dur / D# mol',
      'B dur / G# mol',
      'E dur / C# mol',
      'A dur / F# mol',
      'D dur / B mol',
      'G dur / E mol',
      'C dur / A mol',
      'F dur / D mol',
      'Bb dur / G mol',
      'Eb dur / C mol',
      'Ab dur / F mol',
      'Db dur / Bb mol',
      'Gb dur / Eb mol',
      'Cb dur / Ab mol',
    ],
  },
  transposeDirection: {
    text: 'Smjer transponiranja',
    description: 'Smjer transponiranja (gore/dole)',
    labels: ['Gore', 'Dole', 'Najbliži'],
  },
  transposeButton: {
    text: 'Transponiraj',
    description:
      'Primijeni transponiranje s postavkama iznad na notaciju, dok kodiranje ostaje nepromijenjeno. Da biste također transponirali kodiranje MEI sa trenutnim postavkama, koristite "Ponovno izmijenite putem Verovija" u izborniku "Manipuliraj".',
  },

  // Renumeracija takta
  renumberMeasuresHeading: {
    text: 'Renumeracija takta',
    description: 'Postavke za renumeraciju taktova',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Nastavi preko nepotpunih taktova',
    description: 'Nastavi brojanje taktova preko nepotpunih taktova (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Sufiks kod nepotpunih taktova',
    description: 'Koristi brojni sufiks kod nepotpunih taktova (npr. 23-cont)',
    labels: ['ništa', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Nastavi preko kraja',
    description: 'Nastavi brojanje taktova preko krajeva',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Sufiks kod krajeva',
    description: 'Koristi brojni sufiks kod krajeva (npr. 23-a)',
  },

  // Napomene
  titleAnnotations: {
    text: 'Napomene',
    description: 'Postavke za napomene',
  },
  showAnnotations: {
    text: 'Prikaži napomene',
    description: 'Prikaži napomene u notaciji',
  },
  showAnnotationPanel: {
    text: 'Prikaži panel za napomene',
    description: 'Prikaži panel za napomene',
  },
  annotationDisplayLimit: {
    text: 'Maksimalan broj napomena',
    description: 'Maksimalan broj napomena za prikazivanje (veliki brojevi mogu usporiti mei-friend)',
  },

  // Faksimil
  titleFacsimilePanel: {
    text: 'Faksimil panel',
    description: 'Prikaži slike izvornog izdanja, ako su dostupne',
  },
  showFacsimilePanel: {
    text: 'Prikaži faksimil panel',
    description: 'Prikaži slike note iz izvornog izdanja koje su priložene u elementu faksimila',
  },
  selectFacsimilePanelOrientation: {
    text: 'Položaj faksimil panela',
    description: 'Odaberi položaj faksimil panela u odnosu na notaciju',
    labels: ['levo', 'desno', 'gore', 'dole'],
  },
  facsimileZoomInput: {
    text: 'Uvećanje faksimil slike (%)',
    description: 'Nivo uvećanja faksimil slike (u procentima)',
  },
  showFacsimileFullPage: {
    text: 'Prikaži celu stranicu',
    description: 'Prikaži faksimil sliku na celoj stranici',
  },
  showFacsimileZones: {
    text: 'Prikaži okvire za faksimil',
    description: 'Prikaži okvire za oblasti faksimila',
  },
  editFacsimileZones: {
    text: 'Uredi oblasti faksimila',
    description: 'Uredi oblasti faksimila (povezaće okvire sa oblastima faksimila)',
  },

  // Elementi dopune
  titleSupplied: {
    text: 'Rukovanje uredničkim sadržajem',
    description: 'Kontrola rukovanja <supplied> elementima',
  },
  showSupplied: {
    text: 'Prikaži <supplied> elemente',
    description: 'Istakni sve elemente sadržane u <supplied> elementu',
  },
  suppliedColor: {
    text: 'Izbor boje za <supplied> elemente',
    description: 'Izbor boje za isticanje <supplied> elemenata',
  },
  respSelect: {
    text: 'Izbor odgovornosti za <supplied> elemente',
    description: 'Izbor odgovornosti ID-a',
  },

  // POSTAVKE UREĐIVAČA / POSTAVKE KODMIRA
  editorSettingsHeader: {
    text: 'Postavke uređivača',
  },
  cmReset: {
    text: 'Podrazumevano',
    description: 'Vrati se na mei-friend podrazumevane postavke',
  },
  titleAppearance: {
    text: 'Izgled uređivača',
    description: 'Kontroliše izgled uređivača',
  },
  zoomFont: {
    text: 'Veličina fonta (%)',
    description: 'Promeni veličinu fonta uređivača (u procentima)',
  },
  theme: {
    text: 'Tema',
    description: 'Izaberi temu uređivača',
  },
  matchTheme: {
    text: 'Notacija odgovara temi',
    description: 'Upari notaciju sa temom boja uređivača',
  },
  tabSize: {
    text: 'Veličina tabulatora',
    description: 'Broj praznih mesta za svaki nivo uvlačenja',
  },
  lineWrapping: {
    text: 'Prelamanje linija',
    description: 'Da li se linije prelamaju na kraju panela ili ne',
  },
  lineNumbers: {
    text: 'Brojevi linija',
    description: 'Prikaži brojeve linija',
  },
  firstLineNumber: {
    text: 'Prvi broj linije',
    description: 'Postavi prvi broj linije',
  },
  foldGutter: {
    text: 'Sklapanje koda',
    description: 'Omogući sklapanje koda putem rubova za sklapanje',
  },
  titleEditorOptions: {
    text: 'Ponašanje uređivača',
    description: 'Kontroliše ponašanje uređivača',
  },
  autoValidate: {
    text: 'Automatska validacija',
    description: 'Automatski validiraj kod prema šemi nakon svake izmene',
  },
  autoShowValidationReport: {
    text: 'Automatski prikaži izveštaj o validaciji',
    description: 'Automatski prikaži izveštaj o validaciji nakon što je validacija izvršena',
  },
  autoCloseBrackets: {
    text: 'Automatsko zatvaranje zagrada',
    description: 'Automatski zatvaraj zagrade prilikom unosa',
  },
  autoCloseTags: {
    text: 'Automatsko zatvaranje etiketa',
    description: 'Automatski zatvaraj etikete prilikom unosa',
    type: 'bool',
  },
  matchTags: {
    text: 'Uparivanje etiketa',
    description: 'Ističe uparene etikete oko kursora uređivača',
  },
  showTrailingSpace: {
    text: 'Ističi prazna mesta na kraju',
    description: 'Ističe nepotrebna prazna mesta na kraju linija',
  },
  keyMap: {
    text: 'Mapa tastera',
    description: 'Izaberi mapu tastera',
  },

  // Postavke Verovia
  verovioSettingsHeader: {
    text: 'Postavke Verovia',
  },
  vrvReset: {
    text: 'Podrazumevane',
    description: 'Poništi Verovia na mei-friend podrazumevane postavke',
  },

  // Alert poruke u main.js
  isSafariWarning: {
    text:
      'Čini se da koristite Safari kao svoj preglednik, na kojem ' +
      'mei-friend, nažalost, ne podržava validaciju šeme. ' +
      'Molimo koristite drugi preglednik za potpunu podršku za validaciju.',
  },
  githubLoggedOutWarning: {
    text: `Izlogovali ste se iz mei-friend GitHub integracije, ali vaš preglednik je i dalje prijavljen na GitHub!
    <a href="https://github.com/logout" target="_blank">Kliknite ovde da se izlogujete sa GitHub-a</a>.`,
  },
  generateUrlError: {
    text: 'Nije moguće generisati URL za lokalni fajl ',
  },
  generateUrlSuccess: {
    text: 'URL uspešno kopiran u privremenu memoriju',
  },
  generateUrlNotCopied: {
    text: 'URL nije kopiran u privremenu memoriju, molimo pokušajte ponovo!',
  },
  errorCode: { text: 'Kod greške' },
  submitBugReport: { text: 'Pošalji izveštaj o grešci' },
  loadingSchema: { text: 'Učitavanje šeme' },
  schemaLoaded: { text: 'Šema učitana' },
  noSchemaFound: { text: 'Nema informacija o šemi u MEI.' },
  schemaNotFound: { text: 'Šema nije pronađena' },
  errorLoadingSchema: { text: 'Greška pri učitavanju šeme' },
  notValidated: { text: 'Nije validirano. Pritisnite ovde da biste validirali.' },
  validatingAgainst: { text: 'Validacija protiv' },
  validatedAgainst: { text: 'Validirano protiv' },
  validationMessages: { text: 'poruke o validaciji' },
  validationComplete: { text: 'Validacija završena' },
  validationFailed: { text: 'Validacija nije uspela' },
  noErrors: { text: 'nema grešaka' },
  errorsFound: { text: 'pronađene su greške' }, // pronađeno 5 grešaka

  // GitHub-menu.js
  githubRepository: { text: 'Repozitorijum' },
  githubBranch: { text: 'Grana' },
  githubFilepath: { text: 'Putanja' },
  githubCommit: { text: 'Komit' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Komituj kao novi fajl' } }, value: 'Komituj' },
  commitLog: { text: 'Zapis komita' },
  githubDate: { text: 'Datum' },
  githubAuthor: { text: 'Autor' },
  githubMessage: { text: 'Poruka' },
  none: { text: 'Ništa' },
  commitFileNameText: { text: 'Ime fajla' },
  forkRepository: { text: 'Forkuj repozitorijum' },
  forkError: { text: 'Izvinjavamo se, nije moguće forkovanje repozitorijuma' },
  loadingFile: { text: 'Učitavanje fajla' },
  loadingFromGithub: { text: 'Učitavanje sa GitHub-a' },
  logOut: { text: 'Odjavi se' },
  githubLogout: { text: 'Odjavi se' },
  selectRepository: { text: 'Izaberite repozitorijum' },
  selectBranch: { text: 'Izaberite granu' },
  commitMessageInput: { placeholder: 'Ažurirano korišćenjem mei-friend online' },
  reportIssueWithEncoding: { value: 'Prijavi problem sa kodiranjem' },
  clickToOpenInMeiFriend: { text: 'Kliknite da otvorite u mei-friend' },
  repoAccessError: { text: 'Izvinjavamo se, nemoguć pristup repozitorijumima za datog korisnika ili organizaciju' },
  allComposers: { text: 'Svi kompozitori' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Renumeracija takta' },
  renumberMeasuresModalTest: { text: 'Test' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'biće' },
  renumberMeasuresChangedTo: { text: 'promenjeno u' },
  renumberMeasureMeasuresRenumbered: { text: 'taktova je renumerisano' },

  // Code checker @accid.ges
  codeCheckerTitle: {
    text: 'Provera atributa @accid.ges (protiv ključnog tona, akcidentalnog tona u svakom taktu i veza).',
  },
  codeCheckerFix: { text: 'Popravi' },
  codeCheckerFixAll: { text: 'Popravi sve' },
  codeCheckerIgnore: { text: 'Zanemari' },
  codeCheckerIgnoreAll: { text: 'Zanemari sve' },
  codeCheckerCheckingCode: { text: 'Proveravanje koda...' },
  codeCheckerNoAccidMessagesFound: { text: 'Svi atributi @accid.ges izgledaju ispravno.' },
  codeCheckerMeasure: { text: 'Takt' },
  codeCheckerNote: { text: 'Napomena' },
  codeCheckerHasBoth: { text: 'ima i' },
  codeCheckerAnd: { text: 'i' },
  codeCheckerRemove: { text: 'Ukloni' },
  codeCheckerFixTo: { text: 'Popravi na' },
  codeCheckerAdd: { text: 'Dodaj' },
  codeCheckerWithContradictingContent: { text: 'sa kontradiktornim sadržajem' },
  codeCheckerTiedNote: { text: 'Povezana nota' },
  codeCheckerNotSamePitchAs: { text: 'nije istog tona kao' },
  codeCheckerNotSameOctaveAs: { text: 'nije iste oktave kao' },
  codeCheckerNotSameAsStartingNote: { text: 'nije isto kao u početnoj noti' },
  codeCheckerExtra: { text: 'dodatno' }, // suvišno
  codeCheckerHasExtra: { text: 'ima dodatno' }, // ima suvišno
  codeCheckerLacksAn: { text: 'nema' },
  codeCheckerBecauseAlreadyDefined: { text: 'jer je već definisano ranije u taktu' },

  // Upozorenje o nedostajućim ID-ovima
  missingIdsWarningAlert: {
    text: 'mei-friend nije u mogućnosti da se pomera do odabranih elemenata u kodiranju. Molimo dodajte ID-ove u kodiranje.',
  },
};
