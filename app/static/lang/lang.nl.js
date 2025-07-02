/**
 * Language file for Dutch language.
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'Over mei-friend' },
  showSplashScreen: {
    text: 'Toon opstartscherm bij laden',
    description: 'Toon het mei-friend opstartscherm wanneer de applicatie wordt geladen',
  },
  splashUpdateIndicator: {
    html: `
      De volgende tekst is bijgewerkt sinds de laatste keer dat u het opstartscherm heeft erkend. Voor details, raadpleeg de <a href="${getChangelogUrl()}" target="_blank">changelog</a>.`,
  },
  splashLastUpdated: { text: 'Tekst laatst bijgewerkt op: ' },
  splashBody: {
    html: `
      <p>
        mei-friend is een editor voor <a href="https://music-encoding.org">muziekcoderingen</a>, gehost bij de
        <a href="https://mdw.ac.at" target="_blank">mdw – Universiteit voor Muziek en Podiumkunsten Wenen</a>.
        Raadpleeg onze <a href="https://mei-friend.github.io" target="_blank">uitgebreide documentatie</a> voor
        meer informatie.
      </p>
      <p>
        Hoewel mei-friend een browsergebaseerde applicatie is, worden uw persoonlijke gegevens (inclusief de codering die u bewerkt, uw applicatie-instellingen en huidige inloggegevens indien aanwezig) opgeslagen in de <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">lokale opslag</a> van uw browser en niet op onze servers.
      </p>
      <p>
        Gegevens worden alleen naar GitHub verzonden wanneer u hier expliciet om vraagt (bijvoorbeeld wanneer u inlogt bij GitHub, uw codering laadt vanuit of commit naar een GitHub-repository, of wanneer u een GitHub Action workflow aanvraagt). Evenzo worden gegevens alleen naar uw gekozen Solid-provider verzonden wanneer u hier expliciet om vraagt (bijvoorbeeld wanneer u inlogt bij Solid, of stand-off annotaties laadt of opslaat). Om technische redenen vereisen bepaalde interacties met GitHub (zoals het klonen van een repository naar uw browser bij het eerste openen van een codering, of het committen van wijzigingen naar een repository) dat gegevens worden verzonden naar een proxyserver gehost door de mdw – Universiteit voor Muziek en Podiumkunsten Wenen. Deze server fungeert als tussenpersoon tussen uw browser en GitHub, en slaat geen gegevens op die erdoor worden verzonden.
      </p>
      <p>
        We gebruiken <a href="https://matomo.org/" target="_blank">Matomo</a>
        om anonieme gebruiksstatistieken te verzamelen. Deze omvatten uw afgeknotte IP-adres (waardoor geolocatie op landniveau mogelijk is, maar verdere identificatie niet), uw browser en besturingssysteem, waar u vandaan kwam (d.w.z. de verwijzende website), de tijd en duur van uw bezoek, en de pagina's die u bezocht. Deze informatie wordt opgeslagen op de Matomo-instantie die draait op de servers van de mdw – Universiteit voor Muziek en Podiumkunsten Wenen en wordt niet gedeeld met derden.
      </p>
      <p>
        Luit-tabulaturen worden naar MEI omgezet met behulp van
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a> ontwikkeld door Paul Overell,
        via de <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui service</a>
        ontwikkeld door Stefan Szepe en <a href="https://luteconv.mdw.ac.at" target="_blank">gehost door de mdw</a>.
        Deze service maakt webtoegankelijke kopieën van uw coderingen als onderdeel van het conversieproces, maar deze zijn alleen toegankelijk via een unieke link-hashwaarde en worden periodiek verwijderd.
      </p>
      <p>
        De Verovio-toolkit wordt geladen vanaf <a href="https://verovio.org" target="_blank">https://verovio.org</a>, gehost door
        <a href="https://rism.digital/" target="_blank">RISM Digital Zwitserland</a>.
        Hierdoor kan mei-friend up-to-date blijven met de nieuwste toolkit-versie en
        de keuze bieden van alle ondersteunde versies via het instellingenpaneel.
        Wanneer u mei-friend gebruikt, is uw IP-adres dus zichtbaar voor RISM Digital.
      </p>
      <p>
        Ten slotte wordt MIDI-afspelen gepresenteerd met behulp van de SGM_plus soundfont geleverd door Google Magenta, en geserveerd
        via googleapis.com. Uw IP-adres is daarom zichtbaar voor Google wanneer u MIDI-afspelen start. Als u niet wilt dat dit gebeurt, gebruik dan de MIDI-afspeelfunctie niet.
      </p>
      <p>
        mei-friend is ontwikkeld door
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> en
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> aan de afdeling Muziek
        Akoestiek – Wiener Klangstil aan de mdw – Universiteit voor Muziek en Podiumkunsten Wenen, en
        is gelicentieerd onder de
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
          >GNU Affero General Public License v3.0</a>.
        Raadpleeg onze
        <a href="https://mei-friend.github.io/about/" target="_blank">erkenningspagina</a> voor meer informatie
        over bijdragers en de open-sourcecomponenten die in ons project worden hergebruikt. We danken onze
        collega's voor hun bijdragen en begeleiding.
      </p>
      <p>
        De ontwikkeling van de mei-friend webapplicatie wordt gefinancierd door het
        <a href="https://fwf.ac.at" target="_blank">Austrian Science Fund (FWF)</a> onder projecten
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
          >P 34664-G (Signature Sound Vienna)</a>
        en <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
      </p>`,
  },
  splashGotItButtonText: { text: 'Begrepen!' },
  splashVersionText: { text: 'Versie' },
  splashAlwaysShow: {
    text: 'Dit opstartscherm altijd tonen',
    description: 'Dit opstartscherm altijd tonen bij het laden van de applicatie',
  },
  splashAlwaysShowLabel: {
    text: 'Dit opstartscherm altijd tonen',
    description: 'Dit opstartscherm altijd tonen bij het laden van de applicatie',
  },

  // Main menu bar
  githubLoginLink: { text: 'Inloggen' },

  month: {
    jan: 'Januari',
    feb: 'Februari',
    mar: 'Maart',
    apr: 'April',
    may: 'Mei',
    jun: 'Juni',
    jul: 'Juli',
    aug: 'Augustus',
    sep: 'September',
    oct: 'Oktober',
    nov: 'November',
    dec: 'December',
  },

  // FILE MENU ITEM
  fileMenuTitle: { text: 'Bestand' },
  openMeiText: { text: 'Bestand openen' },
  openUrlText: { text: 'URL openen' },
  openExample: {
    text: 'Openbare repertoire',
    description: 'Een lijst met publiek domein repertoire openen',
  },
  importMusicXml: { text: 'MusicXML importeren' },
  importHumdrum: { text: 'Humdrum importeren' },
  importPae: { text: 'PAE, ABC importeren' },
  saveMeiText: { text: 'MEI opslaan' },
  saveMeiBasicText: { text: 'Opslaan als MEI Basic' },
  saveSvg: { text: 'SVG opslaan' },
  saveMidi: { text: 'MIDI opslaan' },
  printPreviewText: { text: 'PDF voorbeeld' },
  generateUrlText: { text: 'mei-friend URL genereren' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Code' },
  undoMenuText: { text: 'Ongedaan maken' },
  redoMenuText: { text: 'Opnieuw doen' },
  startSearchText: { text: 'Zoeken' },
  findNextText: { text: 'Volgende zoeken' },
  findPreviousText: { text: 'Vorige zoeken' },
  replaceMenuText: { text: 'Vervangen' },
  replaceAllMenuText: { text: 'Alles vervangen' },
  indentSelectionText: { text: 'Selectie inspringen' },
  surroundWithTagsText: { text: 'Omringen met tags' },
  surroundWithLastTagText: { text: 'Omringen met' },
  jumpToLineText: { text: 'Ga naar regel' },
  toMatchingTagText: { text: 'Ga naar bijpassende tag' },
  manualValidateText: { text: 'Valideren' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Weergave' },
  notationTop: { text: 'Notatie boven' },
  notationBottom: { text: 'Notatie onder' },
  notationLeft: { text: 'Notatie links' },
  notationRight: { text: 'Notatie rechts' },
  showSettingsMenuText: { text: 'Instellingenpaneel' },
  showAnnotationMenuText: { text: 'Annotatiespaneel' },
  showFacsimileMenuText: { text: 'Facsimilepaneel' },
  showPlaybackControlsText: { text: 'Afspelen bediening' },
  facsimileTop: { text: 'Facsimile boven' },
  facsimileBottom: { text: 'Facsimile onder' },
  facsimileLeft: { text: 'Facsimile links' },
  facsimileRight: { text: 'Facsimile rechts' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Manipuleren' },
  invertPlacementText: { text: 'Plaatsing omkeren' },
  betweenPlacementText: { text: 'Tussen plaatsing' },
  addVerticalGroupText: { text: 'Verticale groep toevoegen' },
  deleteText: { text: 'Element verwijderen' },
  pitchChromUpText: { text: 'Chromatisch verhogen' },
  pitchChromDownText: { text: 'Chromatisch verlagen' },
  pitchUpDiatText: { text: 'Diatonisch verhogen' },
  pitchDownDiatText: { text: 'Diatonisch verlagen' },
  pitchOctaveUpText: { text: 'Octaaf verhogen' },
  pitchOctaveDownText: { text: 'Octaaf verlagen' },
  staffUpText: { text: 'Element een staf omhoog' },
  staffDownText: { text: 'Element een staf omlaag' },
  increaseDurText: { text: 'Duur verlengen' },
  decreaseDurText: { text: 'Duur verkorten' },
  toggleDotsText: { text: 'Puntjes wisselen' },
  cleanAccidText: { text: 'Controleer @accid.ges' },
  meterConformanceText: { text: 'Controleer @metcon' },
  renumberMeasuresTestText: { text: 'Herhaal maten (test)' },
  renumberMeasuresExecText: { text: 'Herhaal maten (uitvoeren)' },
  addIdsText: { text: 'Ids toevoegen aan MEI' },
  removeIdsText: { text: 'Ids verwijderen uit MEI' },
  reRenderMeiVerovio: { text: 'Opnieuw renderen via Verovio' },
  addFacsimile: { text: 'Facsimile element toevoegen' },
  ingestFacsimileText: { text: 'Facsimile verwerken' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Invoegen' },
  addNoteText: { text: 'Noot toevoegen' },
  convertNoteToRestText: { text: 'Noot <=> rust' },
  toggleChordText: { text: 'Noot <=> akkoord' },
  addDoubleSharpText: { html: 'Dubbel kruis &#119082;' },
  addSharpText: { html: 'Kruis &#9839;' },
  addNaturalText: { html: 'Herstellingsteken &#9838;' },
  addFlatText: { html: 'Mol &#9837;' },
  addDoubleFlatText: { html: 'Dubbel mol &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Instructie' },
  addDynamicsText: { text: 'Dynamiek' },
  addSlurText: { text: 'Boog' },
  addTieText: { text: 'Bindboog' },
  addCrescendoHairpinText: { text: 'Crescendo haak' },
  addDiminuendoHairpinText: { text: 'Diminuendo haak' },
  addBeamText: { text: 'Balk' },
  addBeamSpanText: { text: 'Balkspan' },
  addSuppliedText: { text: 'Toegevoegd' },
  addSuppliedArticText: { text: 'Toegevoegd (Articulatie)' },
  addSuppliedAccidText: { text: 'Toegevoegd (Accident)' },
  addArpeggioText: { text: 'Arpeggio' },
  addFermataText: { text: 'Fermate' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pedaal neer' },
  addPedalUpText: { text: 'Pedaal omhoog' },
  addTrillText: { text: 'Triller' },
  addTurnText: { text: 'Omkeer' },
  addTurnLowerText: { text: 'Lager omkeer' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Hogere mordent' },
  addOctave8AboveText: { text: 'Octaaf (8va boven)' },
  addOctave15AboveText: { text: 'Octaaf (15va boven)' },
  addOctave8BelowText: { text: 'Octaaf (8va onder)' },
  addOctave15BelowText: { text: 'Octaaf (15va onder)' },
  addGClefChangeBeforeText: { text: 'G sleutel voor' },
  addGClefChangeAfterText: { text: 'G sleutel na' },
  addFClefChangeBeforeText: { text: 'F sleutel voor' },
  addFClefChangeAfterText: { text: 'F sleutel na' },
  addCClefChangeBeforeText: { text: 'C sleutel voor' },
  addCClefChangeAfterText: { text: 'C sleutel na' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Accent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Hulp' },
  goToHelpPageText: { text: "mei-friend helppagina's" },
  goToCheatSheet: { text: 'mei-friend spiekbriefje' },
  showChangelog: { text: 'mei-friend changelog' },
  goToGuidelines: { text: 'MEI-richtlijnen' },
  consultGuidelinesForElementText: { text: 'Richtlijnen voor huidige element' },
  provideFeedback: { text: 'Feedback geven' },
  resetDefault: { text: 'Herstellen naar standaard' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'MIDI-afspeelbedieningsbalk wisselen' },
  showFacsimileButton: { description: 'Facsimilepaneel wisselen' },
  showAnnotationsButton: { description: 'Annotatiespaneel wisselen' },
  showSettingsButton: { description: 'Instellingenpaneel tonen' },

  // Footer texts
  leftFooter: {
    html:
      'Gehost door <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'bij <a href="https://mdw.ac.at">mdw</a>, met ' +
      heart +
      ' uit Wenen. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Impressum</a>.',
  },
  loadingVerovio: { text: 'Verovio laden' },
  verovioLoaded: { text: 'geladen' },
  convertedToPdf: { text: 'omgezet naar PDF' },
  statusBarCompute: { text: 'Berekenen' },
  middleFooterPage: { text: 'pagina' },
  middleFooterOf: { text: 'van' },
  middleFooterLoaded: { text: 'geladen' },

  // Control menu
  verovioIcon: {
    description: `mei-friend worker activiteit:
    de klok mee rotatie geeft Verovio activiteit aan,
    tegen de klok in rotatie snelheid worker activiteit`,
  },
  decreaseScaleButton: { description: 'Notatie verkleinen' },
  verovioZoom: { description: 'Schaal van de notatie aanpassen' },
  increaseScaleButton: { description: 'Notatie vergroten' },
  pagination1: { html: 'Pagina&nbsp;' },
  pagination3: { html: '&nbsp;van' },
  sectionSelect: { description: 'Navigeer naar gecodeerde sectie/eindstructuur' },
  firstPageButton: { description: 'Naar eerste pagina gaan' },
  previousPageButton: { description: 'Naar vorige pagina gaan' },
  paginationLabel: {
    description: 'Paginanavigatie: klik om handmatig paginanummer in te voeren dat moet worden weergegeven',
  },
  nextPageButton: { description: 'Naar volgende pagina gaan' },
  lastPageButton: { description: 'Naar laatste pagina gaan' },
  flipCheckbox: { description: 'Automatisch naar pagina bladeren naar coderingscursorpositie' },
  flipButton: { description: 'Handmatig naar pagina bladeren naar coderingscursorpositie' },
  breaksSelect: { description: 'Definieer systeem-/paginabreaks gedrag van notatie' },
  breaksSelectNone: { text: 'Geen' },
  breaksSelectAuto: { text: 'Automatisch' },
  breaksSelectMeasure: { text: 'Maat' },
  breaksSelectLine: { text: 'Systeem' },
  breaksSelectEncoded: { text: 'Systeem en pagina' },
  breaksSelectSmart: { text: 'Slim' },
  updateControlsLabel: {
    text: 'Bijwerken',
    description: 'Controleer bijwerkgedrag van notatie na wijzigingen in codering',
  },
  liveUpdateCheckbox: { description: 'Notatie automatisch bijwerken na wijzigingen in codering' },
  codeManualUpdateButton: { description: 'Notatie handmatig bijwerken' },
  engravingFontSelect: { description: 'Selecteer graveerlettertype' },
  backwardsButton: { description: 'Navigeren naar links in notatie' },
  forwardsButton: { description: 'Navigeren naar rechts in notatie' },
  upwardsButton: { description: 'Navigeren naar boven in notatie' },
  downwardsButton: { description: 'Navigeren naar beneden in notatie' },
  speedLabel: {
    text: 'Snelheidsmodus',
    description:
      'In snelheidsmodus wordt alleen de huidige pagina naar Verovio verzonden om de weergavetijd met grote bestanden te verminderen',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: 'PDF opslaan', description: 'Opslaan als PDF' },
  pdfCloseButton: { description: 'Sluit afdrukvoorbeeld' },
  pagesLegendLabel: { text: 'Paginabereik', singlePage: 'pagina', multiplePages: "Pagina's" },
  selectAllPagesLabel: { text: 'Alles' },
  selectCurrentPageLabel: { text: 'Huidige pagina' },
  selectFromLabel: { text: 'van:' },
  selectToLabel: { text: 'tot:' },
  selectPageRangeLabel: { text: 'Paginabereik:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Alleen de huidige pagina wordt naar PDF gerenderd, omdat de snelheidsmodus is geactiveerd. ' +
      "Schakel snelheidsmodus uit om uit alle pagina's te selecteren.",
  },
  pdfPreviewNormalModeTitle: { text: 'Selecteer het paginabereik om op te slaan in PDF.' },

  // Facsimile panel
  facsimileIcon: { description: 'Facsimilepaneel' },
  facsimileDecreaseZoomButton: { description: 'Notatieafbeelding verkleinen' },
  facsimileZoom: { description: 'Grootte van de notatieafbeelding aanpassen' },
  facsimileIncreaseZoomButton: { description: 'Notatieafbeelding vergroten' },
  facsimileFullPageLabel: { text: 'Volledige pagina', description: 'Toon volledige pagina van facsimileafbeelding' },
  facsimileFullPageCheckbox: { description: 'Toon volledige pagina van facsimileafbeelding' },
  facsimileShowZonesLabel: { text: 'Toon zoneboxen', description: 'Toon zoneboxen van facsimile' },
  facsimileShowZonesCheckbox: { description: 'Toon zoneboxen van facsimile' },
  facsimileEditZonesCheckbox: { description: 'Bewerk zones van facsimile' },
  facsimileEditZonesLabel: { text: 'Bewerk zones', description: 'Bewerk zones van facsimile' },
  facsimileCloseButton: { description: 'Facsimilepaneel sluiten' },
  facsimileDefaultWarning: { text: 'Geen facsimile-inhoud om weer te geven.' },
  facsimileNoSurfaceWarning: {
    text: 'Geen oppervlakte-element gevonden voor deze pagina.\n(Er ontbreekt mogelijk een initieel pb-element.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Facsimile zonder zones alleen zichtbaar in volledige paginamodus.' },
  facsimileImgeNotLoadedWarning: { text: 'Kon afbeelding niet laden' },

  // Drag'n'drop
  dragOverlayText: { text: 'Sleep uw invoerbestand hierheen.' },

  // Public repertoire
  openUrlHeading: { text: 'Open web-gehoste codering via URL' },
  openUrlInstructions: {
    text:
      'Kies alstublieft uit het openbare repertoire of voer de URL in van ' +
      'een web-gehoste muziekcodering hieronder. Opmerking: de hostserver moet ' +
      'cross-origin resource sharing (CORS) ondersteunen.',
  },
  publicRepertoireSummary: { text: 'Openbare repertoire' },
  sampleEncodingsComposerLabel: { text: 'Componist:' },
  sampleEncodingsEncodingLabel: { text: 'Codering:' },
  sampleEncodingsOptionLabel: { text: 'Kies een codering...' },
  openUrlButton: { text: 'URL openen' },
  openUrlCancel: { text: 'Annuleren' },
  proposePublicRepertoire: {
    html:
      'We verwelkomen voorstellen voor ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank">toevoegingen aan het openbare repertoire</a>.',
  },
  openUrlChooseEncodingText: { text: 'Kies een codering...' },
  openUrlChooseComposerText: { text: 'Kies een componist...' },
  openUrlOpenEncodingByUrlText: { text: 'Open web-gehoste codering via URL' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Vraag GitHub Action workflow aan:' },
  githubActionsDescription: {
    text: 'Klik op "Workflow uitvoeren" om de GitHub API te vragen de bovenstaande workflow voor u uit te voeren, met gebruik van de hieronder gespecificeerde invoerconfiguratie. Uw codering wordt opnieuw geladen in de nieuwste versie zodra de workflow is voltooid.',
  },
  githubActionStatusMsgPrompt: { text: 'Kon workflow niet uitvoeren - GitHub zegt' },
  githubActionStatusMsgWaiting: { text: 'Even geduld terwijl GitHub uw workflow verwerkt...' },
  githubActionStatusMsgFailure: { text: 'Kon workflow niet uitvoeren - GitHub zegt' },
  githubActionStatusMsgSuccess: { text: 'Workflow voltooid - GitHub zegt' },
  githubActionsRunButton: { text: 'Workflow uitvoeren' },
  githubActionsRunButtonReload: { text: 'MEI-bestand opnieuw laden' },
  githubActionsCancelButton: { text: 'Annuleren' },
  githubActionsInputSetterFilepath: { text: 'Huidig bestandspad naar invoer kopiëren' },
  githubActionsInputSetterSelection: { text: 'Huidige MEI-selectie naar invoer kopiëren' },
  githubActionsInputContainerHeader: { text: 'Invoerconfiguratie' },

  // Fork modals
  forkRepoGithubText: { text: 'Fork Github-repository' },
  forkRepoGithubExplanation: {
    text:
      'De link die u heeft gevolgd ' +
      'zal een GitHub fork maken van de volgende repository voor bewerking in mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Is dit OK?' },
  forkRepositoryInstructions: {
    text:
      'Kies alstublieft uit het openbare repertoire of voer de ' +
      'GitHub (gebruiker of organisatie) naam en de repository naam van een GitHub-gehoste repository hieronder in. ' +
      'Uw geforkte repository wordt beschikbaar vanuit het GitHub-menu.',
  },
  forkRepositoryGithubText: { text: 'Fork Github-repository' },
  forkRepertoireSummary: { text: 'Openbare repertoire' },
  forkRepertoireComposerLabel: { text: 'Componist:' },
  forkRepertoireOrganizationLabel: { text: 'Organisatie:' },
  forkRepertoireOrganizationOption: { text: 'Kies een GitHub-organisatie...' },
  forkRepertoireRepositoryLabel: { text: 'Repository:' },
  forkRepertoireRepositoryOption: { text: 'Kies een codering...' },
  forkRepositoryInputName: { placeholder: 'GitHub-gebruiker of organisatie' },
  forkRepositoryInputRepoOption: { text: 'Kies een repository' },
  forkRepositoryToSelectorText: { text: 'Fork naar: ' },
  forkRepositoryButton: { text: 'Fork repository' },
  forkRepositoryCancel: { text: 'Annuleren' },
  forkProposePublicRepertoire: {
    html:
      'We verwelkomen voorstellen voor ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">toevoegingen aan het openbare repertoire</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Omsluiten met tagnaam' },
  selectTagNameForEnclosureOkButton: { value: 'OK' },
  selectTagNameForEnclosureCancelButton: { value: 'Annuleren' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solid is een gedecentraliseerd platform voor sociale gelinkte data. Log in op Solid om stand-off annotaties te maken met behulp van gelinkte data (RDF).',
  },
  solidProvider: { description: 'Kies een Solid-identiteitsprovider (IdP) of specificeer uw eigen.' },
  solidLoginBtn: { text: 'Inloggen' },
  solidOverlayCancel: { html: 'Solid-sessie herstellen - druk op <span>esc</span> of klik hier om te annuleren' },
  solidWelcomeMsg: { text: 'Welkom, ' },
  solidLogout: { text: 'Uitloggen' },
  solidLoggedOutWarning: {
    html: `U bent uitgelogd van mei-friend's Solid-integratie, maar uw browser is nog steeds ingelogd bij Solid!
      <a id="solidIdPLogoutLink" target="_blank">Klik hier om uit te loggen van Solid</a>.`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: 'Annotatiespaneel sluiten' },
  hideAnnotationPanelButton: { description: 'Annotatiespaneel sluiten' },
  closeAnnotationPanelButton: { description: 'Annotatiespaneel sluiten' },
  annotationToolsButton: { text: 'Gereedschappen', description: 'Annotatiegereedschappen' },
  annotationListButton: { text: 'Lijst', description: 'Annotaties lijst' },
  writeAnnotStandoffText: { text: 'Web Annotatie' },
  annotationToolsIdentifyTitle: { text: 'Identificeren' },
  annotationToolsIdentifySpan: { text: 'Muzikaal Object Identificeren' },
  annotationToolsHighlightTitle: { text: 'Markeren' },
  annotationToolsHighlightSpan: { text: 'Markeren' },
  annotationToolsDescribeTitle: { text: 'Beschrijving' },
  annotationToolsDescribeSpan: { text: 'Beschrijving' },
  annotationToolsLinkTitle: { text: 'Link' },
  annotationToolsLinkSpan: { text: 'Link' },
  listAnnotations: { text: 'Geen annotaties aanwezig.' },
  addWebAnnotation: { text: 'Laad Web Annotatie(s)' },
  loadWebAnnotationMessage: { text: 'Voer URL van Web Annotatie of Web Annotatie Container in' },
  loadWebAnnotationMessage1: { text: 'Kon opgegeven URL niet laden' },
  loadWebAnnotationMessage2: { text: 'probeer het opnieuw' },
  noAnnotationsToDisplay: { text: 'Geen annotaties om weer te geven' },
  flipPageToAnnotationText: { description: 'Blader naar deze annotatie' },
  deleteAnnotation: { description: 'Verwijder deze annotatie' },
  deleteAnnotationConfirmation: { text: 'Weet u zeker dat u deze annotatie wilt verwijderen?' },
  makeStandOffAnnotation: {
    description: 'Stand-off status (RDF)',
    descriptionSolid: 'Schrijven naar Solid als RDF',
    descriptionToLocal: 'Open stand-off (RDF) annotatie in nieuw tabblad',
  },
  makeInlineAnnotation: {
    description: 'Klik om inline annotatie te maken',
    descriptionCopy: 'Kopieer <annot> xml:id naar klembord',
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'elementen' },
  askForLinkUrl: { text: 'Voer een URL in om te linken naar' },
  drawLinkUrl: { text: 'Open in nieuw tabblad' },
  askForDescription: { text: 'Voer een tekstuele beschrijving in om toe te passen' },
  maxNumberOfAnnotationAlert: {
    text1: 'Aantal annotatie-elementen overschrijdt configureerbare "Maximaal aantal annotaties"',
    text2:
      'Nieuwe annotaties kunnen nog steeds worden gegenereerd en worden weergegeven als "Toon annotaties" is ingesteld.',
  },
  annotationsOutsideScoreWarning: {
    text: 'Sorry, kan momenteel geen annotaties buiten &lt;score&gt; plaatsen',
  },
  annotationWithoutIdWarning: {
    text1: 'Kan geen annotatie schrijven omdat MEI ankerpunt geen xml:id heeft.',
    text2:
      'Wijs ID\'s toe door te selecteren "Manipuleren" -> "Opnieuw renderen via Verovio (met ids)" en probeer het opnieuw.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Snelheidsmodus',
    description:
      'Snelheidsmodus is actief; alleen MIDI voor huidige pagina wordt afgespeeld. Om de hele codering af te spelen, schakelt u de snelheidsmodus uit.',
  },
  closeMidiPlaybackControlBarButton: { description: 'MIDI-afspeelbedieningsbalk verbergen' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend instellingen',
    description: 'mei-friend instellingen',
  },
  mfReset: {
    text: 'Standaard',
    description: 'Herstellen naar mei-friend standaardinstellingen',
  },
  filterSettings: {
    placeholder: 'Instellingen filteren',
    description: 'Typ hier om instellingen te filteren',
  },
  closeSettingsButton: {
    description: 'Instellingenpaneel sluiten',
  },
  hideSettingsButton: {
    description: 'Instellingenpaneel sluiten',
  },
  titleGeneral: {
    text: 'Algemeen',
    description: 'Algemene mei-friend instellingen',
  },
  selectToolkitVersion: {
    text: 'Verovio versie',
    description:
      'Selecteer Verovio toolkit versie ' +
      '(* Omschakelen naar oudere versies voor 3.11.0 ' +
      'kan een verversing vereisen vanwege geheugenproblemen.)',
  },
  toggleSpeedMode: {
    text: 'Snelheidsmodus',
    description:
      'Verovio snelheidsmodus wisselen. ' +
      'In snelheidsmodus wordt alleen de huidige pagina ' +
      'naar Verovio verzonden om de weergavetijd ' +
      'met grote bestanden te verminderen',
  },
  selectIdStyle: {
    text: 'Stijl van gegenereerde xml:ids',
    description:
      'Stijl van nieuw gegenereerde xml:ids (bestaande xml:ids worden niet gewijzigd)' +
      'bijv. Verovio origineel: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend stijl: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Applicatieverklaring invoegen',
    description:
      'Voeg een applicatieverklaring toe aan de codering ' +
      'beschrijving in de MEI-header, identificerend ' +
      'applicatienaam, versie, datum van eerste ' +
      'en laatste bewerking',
  },
  selectLanguage: {
    text: 'Taal',
    description: 'Selecteer de taal van de mei-friend interface.',
  },

  // Drag select
  dragSelection: {
    text: 'Sleep selecteren',
    description: 'Selecteer elementen in notatie met muissleep',
  },
  dragSelectNotes: {
    text: 'Selecteer noten',
    description: 'Selecteer noten',
  },
  dragSelectRests: {
    text: 'Selecteer rusten',
    description: 'Selecteer rusten en herhalingen (rust, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Selecteer plaatsingselementen',
    description:
      'Selecteer plaatsingselementen (d.w.z. met een @placement attribuut: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Selecteer bogen',
    description: 'Selecteer bogen (d.w.z. elementen met @curvature attribuut: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Selecteer maten',
    description: 'Selecteer maten',
  },

  // Control menu
  controlMenuSettings: {
    text: 'Notatiebedieningsbalk',
    description: 'Definieer items die moeten worden weergegeven in het bedieningsmenu boven de notatie',
  },
  controlMenuFlipToPageControls: {
    text: 'Toon bladerbediening',
    description: 'Toon bladerbediening in het notatiebedieningsmenu',
  },
  controlMenuUpdateNotation: {
    text: 'Toon notatie-update bediening',
    description: 'Toon notatie-update gedrag bediening in het notatiebedieningsmenu',
  },
  controlMenuFontSelector: {
    text: 'Toon notatielettertype selector',
    description: 'Toon notatielettertype (SMuFL) selector in het notatiebedieningsmenu',
  },
  controlMenuNavigateArrows: {
    text: 'Toon navigatiepijlen',
    description: 'Toon notatienavigatiepijlen in het notatiebedieningsmenu',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Toon snelheidsmodus selectievakje',
    description: 'Toon snelheidsmodus selectievakje in het notatiebedieningsmenu',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI-afspelen',
    description: 'MIDI-afspeelinstellingen',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Toon afspeel snelkoppeling',
    description:
      'Veroorzaakt een snelkoppeling (bubbel in de linkerbenedenhoek; ' +
      'klik om onmiddellijk afspelen te starten) om te verschijnen ' +
      'wanneer de MIDI-afspeelbedieningsbalk is gesloten',
  },
  showMidiPlaybackControlBar: {
    text: 'Toon MIDI-afspeel bedieningsbalk',
    description: 'Toon MIDI-afspeelbedieningsbalk',
  },
  scrollFollowMidiPlayback: {
    text: 'Scroll-volg MIDI-afspelen',
    description: 'Scroll notatiepaneel om MIDI-afspelen op de huidige pagina te volgen',
  },
  pageFollowMidiPlayback: {
    text: 'Pagina-volg MIDI-afspelen',
    description: 'Automatisch bladeren om MIDI-afspelen te volgen',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Markeer momenteel klinkende noten',
    description: 'Visueel markeer momenteel klinkende noten in het notatiepaneel tijdens MIDI-afspelen',
  },
  selectMidiExpansion: {
    text: 'Afspeeluitbreiding',
    description: 'Selecteer uitbreidings element voor MIDI-afspelen',
  },

  // Transposition
  titleTransposition: {
    text: 'Transponeren',
    description: 'Transponeer partituurinformatie',
  },
  enableTransposition: {
    text: 'Transponeren inschakelen',
    description:
      'Schakel transpositie-instellingen in, om toe te passen via de transpose-knop hieronder. De transpositie wordt alleen op de notatie toegepast, de codering blijft ongewijzigd, tenzij u op het item "Opnieuw renderen via Verovio" klikt in het "Manipuleren" dropdownmenu.',
  },
  transposeInterval: {
    text: 'Transponeren op interval',
    description:
      'Transponeer codering op chromatisch interval door de meest voorkomende intervallen (Verovio ondersteunt het base-40 systeem)',
    labels: [
      'Perfecte Prime',
      'Vergrote Prime',
      'Verminderde Secunde',
      'Kleine Secunde',
      'Grote Secunde',
      'Vergrote Secunde',
      'Verminderde Terts',
      'Kleine Terts',
      'Grote Terts',
      'Vergrote Terts',
      'Verminderde Kwart',
      'Perfecte Kwart',
      'Vergrote Kwart',
      'Verminderde Kwint',
      'Perfecte Kwint',
      'Vergrote Kwint',
      'Verminderde Sext',
      'Kleine Sext',
      'Grote Sext',
      'Vergrote Sext',
      'Verminderde Septiem',
      'Kleine Septiem',
      'Grote Septiem',
      'Vergrote Septiem',
      'Verminderde Octaaf',
      'Perfecte Octaaf',
    ],
  },
  transposeKey: {
    text: 'Transponeren naar toonsoort',
    description: 'Transponeren naar toonsoort',
    labels: [
      'C# groot / A# klein',
      'F# groot / D# klein',
      'B groot / G# klein',
      'E groot / C# klein',
      'A groot / F# klein',
      'D groot / B klein',
      'G groot / E klein',
      'C groot / A klein',
      'F groot / D klein',
      'Bb groot / G klein',
      'Eb groot / C klein',
      'Ab groot / F klein',
      'Db groot / Bb klein',
      'Gb groot / Eb klein',
      'Cb groot / Ab klein',
    ],
  },
  transposeDirection: {
    text: 'Transponeren richting',
    description: 'Toonhoogte richting van transponeren (omhoog/omlaag)',
    labels: ['Omhoog', 'Omlaag', 'Dichtstbijzijnde'],
  },
  transposeButton: {
    text: 'Transponeren',
    description:
      'Pas transponeren toe met bovenstaande instellingen op de notatie, terwijl de MEI-codering ongewijzigd blijft. Om ook de MEI-codering met de huidige instellingen te transponeren, gebruikt u "Opnieuw renderen via Verovio" in het "Manipuleren" dropdownmenu.',
  },

  // Renumber measures
  renumberMeasuresHeading: {
    text: 'Maten hernummeren',
    description: 'Instellingen voor het hernummeren van maten',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Doorgaan bij onvolledige maten',
    description: 'Doorgaan met maatnummers bij onvolledige maten (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Achtervoegsel bij onvolledige maten',
    description: 'Gebruik nummer achtervoegsel bij onvolledige maten (bijv. 23-cont)',
    labels: ['geen', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Doorgaan bij eindes',
    description: 'Doorgaan met maatnummers bij eindes',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Achtervoegsel bij eindes',
    description: 'Gebruik nummer achtervoegsel bij eindes (bijv. 23-a)',
  },

  // Annotations
  titleAnnotations: {
    text: 'Annotaties',
    description: 'Annotatie instellingen',
  },
  showAnnotations: {
    text: 'Toon annotaties',
    description: 'Toon annotaties in notatie',
  },
  showAnnotationPanel: {
    text: 'Toon annotatiepaneel',
    description: 'Toon annotatiepaneel',
  },
  annotationDisplayLimit: {
    text: 'Maximaal aantal annotaties',
    description: 'Maximaal aantal annotaties om weer te geven (grote aantallen kunnen mei-friend vertragen)',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: 'Facsimilepaneel',
    description: 'Toon de facsimile afbeeldingen van de broneditie, indien beschikbaar',
  },
  showFacsimilePanel: {
    text: 'Toon facsimilepaneel',
    description: 'Toon de partituren van de broneditie die in het facsimile-element zijn opgenomen',
  },
  selectFacsimilePanelOrientation: {
    text: 'Facsimilepaneel positie',
    description: 'Selecteer facsimilepaneel positie ten opzichte van de notatie',
    labels: ['links', 'rechts', 'boven', 'onder'],
  },
  facsimileZoomInput: {
    text: 'Facsimile afbeelding zoom (%)',
    description: 'Zoomniveau van facsimile afbeelding (in procent)',
  },
  showFacsimileFullPage: {
    text: 'Toon volledige pagina',
    description: 'Toon facsimile afbeelding op volledige pagina',
  },
  showFacsimileZones: {
    text: 'Toon facsimile zoneboxen',
    description: 'Toon facsimile zone begrenzingsboxen',
  },
  editFacsimileZones: {
    text: 'Bewerk facsimile zones',
    description: 'Bewerk facsimile zones (zal begrenzingsboxen koppelen aan facsimile zones)',
  },
  showFacsimileTitles: {
    text: 'Toon facsimile titels',
    description: 'Toon facsimile titels boven bronafbeeldingen',
  },

  // Supplied element
  titleSupplied: {
    text: 'Redactionele inhoud beheren',
    description: 'Controleer de behandeling van <supplied> elementen',
  },
  showSupplied: {
    text: 'Toon <supplied> elementen',
    description: 'Markeer alle elementen die door een <supplied> element worden omvat',
  },
  suppliedColor: {
    text: 'Selecteer <supplied> markeerkleur',
    description: 'Selecteer <supplied> markeerkleur',
  },
  respSelect: {
    text: 'Selecteer <supplied> verantwoordelijkheid',
    description: 'Selecteer verantwoordelijkheids-id',
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'Editor instellingen',
  },
  cmReset: {
    text: 'Standaard',
    description: 'Herstellen naar mei-friend standaardinstellingen',
  },
  titleAppearance: {
    text: 'Editor uiterlijk',
    description: 'Beheert het uiterlijk van de editor',
  },
  zoomFont: {
    text: 'Lettergrootte (%)',
    description: 'Wijzig de lettergrootte van de editor (in procent)',
  },
  theme: {
    text: 'Thema',
    description: 'Selecteer het thema van de editor',
  },
  matchTheme: {
    text: 'Notatie komt overeen met thema',
    description: 'Pas notatie aan op kleurthema van de editor',
  },
  tabSize: {
    text: 'Inspringgrootte',
    description: 'Aantal spaties voor elk inspringniveau',
  },
  lineWrapping: {
    text: 'Regelterugloop',
    description: 'Of regels aan het einde van het paneel worden afgebroken',
  },
  lineNumbers: {
    text: 'Regelnummers',
    description: 'Toon regelnummers',
  },
  firstLineNumber: {
    text: 'Eerste regelnummer',
    description: 'Stel eerste regelnummer in',
  },
  foldGutter: {
    text: 'Code samenvouwen',
    description: 'Schakel codesamenvouwen in door samenvouwgoten',
  },
  titleEditorOptions: {
    text: 'Editor gedrag',
    description: 'Beheert het gedrag van de editor',
  },
  autoValidate: {
    text: 'Automatische validatie',
    description: 'Valideer codering automatisch na elke bewerking tegen schema',
  },
  autoShowValidationReport: {
    text: 'Automatisch validatierapport weergeven',
    description: 'Automatisch validatierapport weergeven na validatie',
  },
  autoCloseBrackets: {
    text: 'Automatisch haakjes sluiten',
    description: 'Sluit haakjes automatisch bij invoer',
  },
  autoCloseTags: {
    text: 'Automatisch tags sluiten',
    description: 'Sluit tags automatisch bij invoer',
    type: 'bool',
  },
  matchTags: {
    text: 'Tags matchen',
    description: 'Markeer gematchte tags rond editorcursor',
  },
  showTrailingSpace: {
    text: 'Markeer overtollige spaties',
    description: 'Markeer overtollige spaties aan het einde van regels',
  },
  keyMap: {
    text: 'Toetsenbordindeling',
    description: 'Selecteer toetsenbordindeling',
  },
  persistentSearch: {
    text: 'Persistente zoekbalk',
    description:
      'Gebruik het gedrag van de persistente zoekbalk (zoekbalk blijft open totdat deze expliciet wordt gesloten)',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Verovio instellingen',
  },
  vrvReset: {
    text: 'Standaard',
    description: 'Herstellen naar Verovio voor mei-friend standaardinstellingen',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      'Het lijkt erop dat u Safari als uw browser gebruikt, waarop ' +
      'mei-friend helaas geen schema validatie ondersteunt. ' +
      'Gebruik een andere browser voor volledige validatieondersteuning.',
  },
  githubLoggedOutWarning: {
    text: `U bent uitgelogd van mei-friend's GitHub-integratie, maar uw browser is nog steeds ingelogd bij GitHub!
      <a href="https://github.com/logout" target="_blank">Klik hier om uit te loggen van GitHub</a>.`,
  },
  generateUrlError: {
    text: 'Kan geen URL genereren voor lokaal bestand',
  },
  generateUrlSuccess: {
    text: 'URL succesvol gekopieerd naar klembord',
  },
  generateUrlNotCopied: {
    text: 'URL niet gekopieerd naar klembord, probeer het opnieuw!',
  },
  errorCode: { text: 'Foutcode' },
  submitBugReport: { text: 'Fout melden' },
  loadingSchema: { text: 'Schema laden' },
  schemaLoaded: { text: 'Schema geladen' },
  noSchemaFound: { text: 'Geen schema-informatie gevonden in MEI.' },
  schemaNotFound: { text: 'Schema niet gevonden' },
  errorLoadingSchema: { text: 'Fout bij het laden van schema' },
  notValidated: { text: 'Niet gevalideerd. Klik hier om te valideren.' },
  validatingAgainst: { text: 'Valideren tegen' },
  validatedAgainst: { text: 'Gevalideerd tegen' },
  validationMessages: { text: 'validatieberichten' },
  validationComplete: { text: 'Validatie voltooid' },
  validationFailed: { text: 'Validatie mislukt' },
  noErrors: { text: 'geen fouten' },
  errorsFound: { text: 'gevonden fouten' }, // 5 errors found

  // GitHub-menu.js
  githubRepository: { text: 'Repository' },
  githubBranch: { text: 'Tak' },
  githubFilepath: { text: 'Pad' },
  githubCommit: { text: 'Commit' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Commit als nieuw bestand' } }, value: 'Commit' },
  commitLog: { text: 'Commitlogboek' },
  githubDate: { text: 'Datum' },
  githubAuthor: { text: 'Auteur' },
  githubMessage: { text: 'Bericht' },
  none: { text: 'Geen' },
  commitFileNameText: { text: 'Bestandsnaam' },
  forkRepository: { text: 'Fork repository' },
  forkError: { text: 'Sorry, kon repository niet fork' },
  loadingFile: { text: 'Bestand laden' },
  loadingFromGithub: { text: 'Laden van Github' },
  logOut: { text: 'Uitloggen' },
  githubLogout: { text: 'Uitloggen' },
  selectRepository: { text: 'Selecteer repository' },
  selectBranch: { text: 'Selecteer tak' },
  commitMessageInput: { placeholder: 'Bijgewerkt met mei-friend online' },
  reportIssueWithEncoding: { value: 'Meld een probleem met codering' },
  clickToOpenInMeiFriend: { text: 'Klik om te openen in mei-friend' },
  repoAccessError: { text: 'Sorry, kan geen toegang krijgen tot repositories voor opgegeven gebruiker of organisatie' },
  allComposers: { text: 'Alle componisten' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Maten hernummeren' },
  renumberMeasuresModalTest: { text: 'Testen' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'zou zijn' },
  renumberMeasuresChangedTo: { text: 'veranderd naar' },
  renumberMeasureMeasuresRenumbered: { text: 'maten hernummerd' },

  // Code checker @accid.ges
  accidGesCodeCheckerTitle: { text: 'Controleer @accid.ges attributen (tegen toonsoort, maat-accidenten en bindbogen).' },
  codeCheckerFix: { text: 'Repareren' },
  codeCheckerFixAll: { text: 'Alles repareren' },
  codeCheckerIgnore: { text: 'Negeren' },
  codeCheckerIgnoreAll: { text: 'Alles negeren' },
  codeCheckerCheckingCode: { text: 'Code controleren...' },
  codeCheckerNoAccidMessagesFound: { text: 'Alle accid.ges attributen lijken correct.' },
  codeCheckerMeasure: { text: 'Maat' },
  codeCheckerNote: { text: 'Noot' },
  codeCheckerHasBoth: { text: 'heeft beide' },
  codeCheckerAnd: { text: 'en' },
  codeCheckerRemove: { text: 'Verwijderen' },
  codeCheckerFixTo: { text: 'Repareren naar' },
  codeCheckerAdd: { text: 'Toevoegen' },
  codeCheckerWithContradictingContent: { text: 'met tegenstrijdige inhoud' },
  codeCheckerTiedNote: { text: 'Gebonden noot' },
  codeCheckerNotSamePitchAs: { text: 'niet dezelfde toonhoogte als' },
  codeCheckerNotSameOctaveAs: { text: 'niet hetzelfde octaaf als' },
  codeCheckerNotSameAsStartingNote: { text: 'niet hetzelfde als begintonen' },
  codeCheckerExtra: { text: 'extra' }, // superfluous
  codeCheckerHasExtra: { text: 'heeft extra' }, // has superfluous
  codeCheckerLacksAn: { text: 'mist een' },
  codeCheckerBecauseAlreadyDefined: { text: 'omdat het eerder in de maat is gedefinieerd' },

  // Warning for missing ids
  missingIdsWarningAlertOnScrolling: {
    text: "mei-friend kan niet naar de geselecteerde elementen in de codering scrollen. Voeg id's toe aan de codering.",
  },
  missingIdsWarningAlertOnLoading: {
    text: 'Er is minstens één markup-element omgeven door een bovenliggend element zonder xml:id. mei-friend kan geen markup verwerken in bestanden zonder id\'s. Voeg alstublieft id\'s toe aan de codering.'
  },  
};
