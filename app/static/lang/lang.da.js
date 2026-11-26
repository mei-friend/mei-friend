/**
 * Language file for Danish
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'Om mei-friend' },
  showSplashScreen: {
    text: 'Vis splash skærm ved indlæsning',
    description: 'Vis mei-friend splash skærm, når applikationen indlæses',
  },
  splashUpdateIndicator: {
    html: `
      Følgende tekst er blevet opdateret siden sidste gang du anerkendte splash skærmen. For detaljer, se venligst <a href="${getChangelogUrl()}" target="_blank">ændringsloggen</a>.`,
  },
  splashLastUpdated: { text: 'Tekst sidst opdateret den: ' },
  splashBody: {
    html: `
      <p>
        mei-friend er en editor for <a href="https://music-encoding.org" target="_blank">musik kodninger</a>, hostet på
        <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Universität für Musik und darstellende Kunst Wien</a>.
        Se venligst vores <a href="https://mei-friend.github.io" target="_blank">omfattende dokumentation</a> for
        yderligere information.
      </p>
      <p>
        Selvom mei-friend er en browserbaseret applikation, gemmes dine personlige data (inklusive den kodning, du redigerer, og dine applikationsindstillinger) i din browsers <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">lokale lager</a> og gemmes ikke på vores servere. For at beskytte dine GitHub-adgangsoplysninger opbevares din GitHub-loginsession (inklusive dit adgangstoken) på mei-friend-serveren i stedet for i din browser; din browser indeholder kun en uigennemsigtig sessionsidentifikator.
      </p>
      <p>
        Data overføres kun til GitHub, når du eksplicit anmoder om det (f.eks. når du logger ind på GitHub, indlæser din kodning fra eller committer til et GitHub-repository, eller når du anmoder om, at en GitHub Action workflow køres for dig). Tilsvarende overføres data kun til din valgte Solid-udbyder, når du eksplicit anmoder om det (f.eks. når du logger ind på Solid, eller indlæser eller gemmer stand-off-annotationer). For at holde dine adgangsoplysninger sikre dirigeres alle interaktioner med GitHub gennem en proxyserver hostet af mdw – Universität für Musik und darstellende Kunst Wien, som vedhæfter dine adgangsoplysninger til disse forespørgsler fra din loginsession. Denne server fungerer som en mellemmand mellem din browser og GitHub og gemmer ikke det indhold, der overføres gennem den; som med enhver webserver kan forespørgselsmetadata (såsom navnene på de repositories og filer, du tilgår) optræde i dens tekniske logfiler.
      </p>
      <p>
        Vi bruger <a href="https://matomo.org/" target="_blank">Matomo</a> til at indsamle anonyme brugsstatistikker.
        Disse inkluderer din afkortede IP-adresse (muliggør geolokalisering på landniveau men ingen yderligere identifikation),
        din browser og operativsystem, hvor du kom fra (dvs. den henvisende hjemmeside), tidspunkt og varighed af dit besøg,
        og de sider, du besøgte. Disse oplysninger gemmes på Matomo-instansen, der kører på servere fra
        mdw &ndash; Universität für Musik und darstellende Kunst Wien, og deles ikke med nogen tredjepart.
      </p>
      <p>
        Lutetablaturer konverteres til MEI ved hjælp af
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a>, udviklet af Paul Overell,
        via <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui tjenesten</a>,
        udviklet af Stefan Szepe og <a href="https://luteconv.mdw.ac.at" target="_blank">hostet af mdw</a>.
        Denne tjeneste skaber web-tilgængelige kopier af dine kodninger som en del af konverteringsprocessen,
        men disse er kun tilgængelige via en unik link hash værdi, og bliver periodisk slettet.
      </p>
      <p>
        Verovio værktøjskassen indlæses fra <a href="https://verovio.org" target="_blank">https://verovio.org</a>, hostet af
        <a href="https://rism.digital/" target="_blank">RISM Digital Schweiz</a>.
        Dette gør det muligt for mei-friend at være opdateret med den nyeste værktøjsversion og
        at tilbyde valget af alle understøttede versioner gennem indstillingspanelet.
        Når du bruger mei-friend, er din IP-adresse derfor synlig for RISM Digital.
      </p>
      <p>
        Endelig præsenteres MIDI-afspilning ved hjælp af SGM_plus-lydfonten leveret af Google Magenta og serveret
        via googleapis.com. Din IP-adresse er derfor synlig for Google, når du starter MIDI-afspilning.
        Hvis du ikke ønsker, at dette sker, bedes du undlade at bruge MIDI-afspilningsfunktionen.
      </p>
      <p>
        mei-friend er udviklet af
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> og
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> ved Institut for Musikkunst
        &ndash; Wiener Klangstil på mdw &ndash; Universität für Musik und darstellende Kunst Wien, og er licenseret under
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank">GNU Affero General Public License v3.0</a>.
        Se venligst vores
        <a href="https://mei-friend.github.io/about/" target="_blank">anerkendelsesside</a> for yderligere
        information om bidragsydere og de open-source komponenter, der genbruges inden for vores projekt. Vi takker vores
        kolleger for deres bidrag og vejledning.
      </p>
      <p>
        Udviklingen af mei-friend webapplikationen er finansieret af
        <a href="https://fwf.ac.at" target="_blank">Austrian Science Fund (FWF)</a> under projekterne
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank">P 34664-G (Signature Sound Vienna)</a>,
        <a href="https://e-laute.info" target="_blank">I 6019 (E-LAUTE)</a> og <a href="https://lets-encode.mdw.ac.at" target="_blank">PAT 2277625 (Let's\u00a0Encode!)</a>.
      </p>`,
  },
  splashGotItButtonText: { text: 'Forstået!' },
  splashVersionText: { text: 'Version' },
  splashAlwaysShow: {
    text: 'Vis altid denne splash skærm',
    description: 'Vis altid denne splash skærm ved applikationsindlæsning',
  },
  splashAlwaysShowLabel: {
    text: 'Vis altid denne splash skærm',
    description: 'Vis altid denne splash skærm ved applikationsindlæsning',
  },

  // Main menu bar
  githubLoginLink: { text: 'Log ind' },

  month: {
    jan: 'Januar',
    feb: 'Februar',
    mar: 'Marts',
    apr: 'April',
    may: 'Maj',
    jun: 'Juni',
    jul: 'Juli',
    aug: 'August',
    sep: 'September',
    oct: 'Oktober',
    nov: 'November',
    dec: 'December',
  },

  // FILE MENU ITEM
  fileMenuTitle: { text: 'Fil' },
  openMeiText: { text: 'Åbn fil' },
  openUrlText: { text: 'Åbn URL' },
  openExample: {
    text: 'Offentligt repertoire',
    description: 'Åbn en liste over public domain repertoire',
  },
  importMusicXml: { text: 'Importer MusicXML' },
  importHumdrum: { text: 'Importer Humdrum' },
  importPae: { text: 'Importer PAE, ABC' },
  saveMeiText: { text: 'Gem MEI' },
  saveMeiBasicText: { text: 'Gem som MEI Basic' },
  saveSvg: { text: 'Gem SVG' },
  saveMidi: { text: 'Gem MIDI' },
  printPreviewText: { text: 'Forhåndsvis PDF' },
  generateUrlText: { text: 'Generer mei-friend URL' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Kode' },
  undoMenuText: { text: 'Fortryd' },
  redoMenuText: { text: 'Gentag' },
  startSearchText: { text: 'Søg' },
  findNextText: { text: 'Find næste' },
  findPreviousText: { text: 'Find forrige' },
  replaceMenuText: { text: 'Erstat' },
  replaceAllMenuText: { text: 'Erstat alle' },
  indentSelectionText: { text: 'Indryk markering' },
  reformatEncodingText: {
    text: 'Omformater via XML-parser',
    description:
      'Omformaterer hele kodningen via XML-parseren: attributter sorteret (xml:id først, derefter alfabetisk), normaliseret XML-serialisering (f.eks. dobbelte anførselstegn, tomme elementer som selvlukkende tags, tegnreferencer som tegn), alle linjer indrykket.',
  },
  reformatEncodingDone: { text: 'Kodningen er omformateret via XML-parseren ({lines} linjer).' },
  reformatEncodingParseError: { text: 'Kan ikke omformatere: kodningen er ikke velformet XML.' },
  surroundWithTagsText: { text: 'Omslut med tags' },
  surroundWithLastTagText: { text: 'Omslut med ' },
  jumpToLineText: { text: 'Hop til linje' },
  toMatchingTagText: { text: 'Gå til matchende tag' },
  manualValidateText: { text: 'Validér' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Vis' },
  notationTop: { text: 'Notation top' },
  notationBottom: { text: 'Notation bund' },
  notationLeft: { text: 'Notation venstre' },
  notationRight: { text: 'Notation højre' },
  showSettingsMenuText: { text: 'Indstillingspanel' },
  showAnnotationMenuText: { text: 'Annotationspanel' },
  showFacsimileMenuText: {
    text: 'Facsim ile panel',
  },
  showPlaybackControlsText: { text: 'Afspilningskontrol' },
  showMeiToolboxMenuText: { text: 'MEI-værktøjskasse' },
  facsimileTop: { text: 'Facsimile top' },
  facsimileBottom: { text: 'Facsimile bund' },
  facsimileLeft: { text: 'Facsimile venstre' },
  facsimileRight: { text: 'Facsimile højre' },
  meiToolboxTop: { text: 'MEI-værktøjskasse øverst' },
  meiToolboxBottom: { text: 'MEI-værktøjskasse nederst' },
  meiToolboxLeft: { text: 'MEI-værktøjskasse til venstre' },
  meiToolboxRight: { text: 'MEI-værktøjskasse til højre' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Manipuler' },
  invertPlacementText: { text: 'Inverter placering' },
  betweenPlacementText: { text: 'Mellem placering' },
  addVerticalGroupText: { text: 'Tilføj vertikal gruppe' },
  deleteText: { text: 'Slet element' },
  pitchChromUpText: { text: 'Kromatisk tone op' },
  pitchChromDownText: { text: 'Kromatisk tone ned' },
  pitchUpDiatText: { text: 'Diatonisk tone op' },
  pitchDownDiatText: { text: 'Diatonisk tone ned' },
  pitchOctaveUpText: { text: 'Tone 1 oktav op' },
  pitchOctaveDownText: { text: 'Tone 1 oktav ned' },
  staffUpText: { text: 'Element 1 linje op' },
  staffDownText: { text: 'Element 1 linje ned' },
  increaseDurText: { text: 'Forøg varighed' },
  decreaseDurText: { text: 'Formindsk varighed' },
  toggleDotsText: { text: 'Skift punktering' },
  cleanAccidText: { text: 'Kontroller @accid.ges' },
  meterConformanceText: { text: 'Kontroller @metcon' },
  renumberMeasuresTestText: { text: 'Omdøbn mål (test)' },
  renumberMeasuresExecText: { text: 'Omdøbn mål (exec)' },
  convertAttributesToElementsText: {
    text: 'Konverter attributter til elementer',
    description:
      'Konverterer attributter, der også kan udtrykkes som elementer, til disse elementer, f.eks. @accid, @artic, @syl, @fermata, @tie, @slur, @gliss på noder og akkorder eller nøgle-, toneart- og taktattributter på staffDef og scoreDef.',
  },
  convertAttributesToElementsSummary: { text: 'Attributter konverteret til {list}.' },
  convertAttributesToElementsNone: { text: 'Ingen attributter fundet, der kan konverteres til elementer.' },
  convertAttributesToElementsProblems: { text: '{count} attributter kunne ikke konverteres.' },
  // CHECKER PANEL
  meiToolboxTabCheck: {
    text: 'Kontrol',
    description:
      'Kontrollerer kodningen for klingende fortegn (@accid.ges), taktvarigheder (@metcon) og links mellem elementer (@startid, @endid, @plist, …). Viser hvert fundet problem, med en rettelse hvor det er muligt.',
  },
  meiToolboxTabConvert: {
    text: 'Konverter',
    description:
      'Konverterer valgte attributter til tilsvarende elementer (f.eks. @accid til <accid>), eller elementer tilbage til attributter, hvor ingen information går tabt.',
  },
  meiToolboxTabRenumber: {
    text: 'Omnummerer',
    description:
      'Omnummererer takterne (@n) fortløbende, med indstillelige suffikser for takter, der fortsætter en tidligere takt, og for takter i volter.',
  },
  meiToolboxCheckButton: { text: 'Kontroller' },
  meiToolboxTestButton: { text: 'Test', description: 'Vis hvad der ville blive ændret, uden at ændre kodningen' },
  meiToolboxRenumberButton: { text: 'Omnummerer' },
  meiToolboxAttrToElButton: { text: 'Attributter → elementer' },
  meiToolboxElToAttrButton: { text: 'Elementer → attributter', description: 'Konverterer elementer til attributter, hvor ingen information går tabt; andre elementer bevares og vises.' },
  meiToolboxAll: { text: 'alle' },
  meiToolboxNone: { text: 'ingen' },
  meiToolboxFilter: { text: 'Filtrer resultater' },
  meiToolboxRunAgain: { text: 'Kør igen' },
  meiToolboxHideOptions: { text: 'Skjul indstillinger' },
  meiToolboxOutdated: { text: '(kodningen er ændret siden, resultaterne kan være forældede)' },
  meiToolboxNoResults: { text: 'Ingen resultater endnu. Vælg indstillingerne og kør.' },
  meiToolboxGroupsSelected: { text: '{n} af {total} attributgrupper' },
  meiToolboxCheckAccidGes: { text: 'Fortegn (@accid.ges)' },
  meiToolboxCheckMetcon: { text: 'Taktvarigheder (@metcon)' },
  meiToolboxCheckLinked: { text: 'Forbundne elementer (@startid, @endid, @plist, …)' },
  meiToolboxClose: { text: 'Luk MEI-værktøjskassen' },
  meiToolboxTabIds: {
    text: 'Id’er',
    description:
      'Tilføjer xml:id’er til elementer uden en, giver hvert element en ny eller fjerner dem, undtagen dem der henvises til. Henvisninger i kodningen opdateres.',
  },
  meiToolboxTabFacsimile: {
    text: 'Faksimile',
    description:
      'Forbinder kodningen med sidebilleder: indlæser et faksimile fra en anden fil eller tilføjer de manglende surfaces, én pr. sideskift.',
  },
  meiToolboxTabReformat: {
    text: 'Reformatér',
    description:
      'Skriver hele kodningen på ny, via Verovio eller XML-parseren, og fastlægger den attributrækkefølge, mei-friend bruger, når elementer skrives tilbage.',
  },
  meiToolboxIdsAdd: { text: 'Tilføj xml:id (til elementer uden)' },
  meiToolboxIdsChange: {
    text: 'Skift xml:id (et nyt til hvert element)',
    description: 'Tildeler hvert element et nyt xml:id. Referencer inden for denne kodning opdateres, men links fra andre filer, annotationer, faksimileværktøjer eller URL’er, der peger på de gamle xml:id’er, virker ikke længere.',
  },
  meiToolboxIdsRemove: { text: 'Fjern xml:id (undtagen dem, der henvises til)' },
  meiToolboxIdsButton: { text: 'Anvend' },
  meiToolboxIdsAdded: { text: '{n} tilføjet' },
  meiToolboxIdsChanged: { text: '{n} ændret' },
  meiToolboxIdsRemoved: { text: '{n} fjernet' },
  meiToolboxIdsKept: { text: '{n} bevaret' },
  meiToolboxIdsReferences: { text: '{n} referencer opdateret' },
  meiToolboxIdsKeptReason: { text: 'der henvises til det i kodningen' },
  meiToolboxIdsNothing: { text: 'Intet at gøre: ingen xml:id blev tilføjet, ændret eller fjernet.' },
  meiToolboxIdsCancelled: { text: 'Annulleret, kodningen er uændret.' },
  meiToolboxFacsimileInfo: {
    text: 'Forbind kodningen med sidebillederne: indlæs en faksimile fra en anden fil, eller tilføj de surfaces, der stadig mangler, én pr. sideskift.',
  },
  meiToolboxFacsimileIngest: { text: 'Indlæs faksimile…' },
  meiToolboxFacsimileAddMissing: {
    text: 'Tilføj manglende surfaces',
    description: 'Tilføjer det, der mangler: en faksimile, hvis der ingen er, en surface med en pladsholder-graphic til hver side, der ikke har en endnu, og pb@facs, der peger på den. Sider knyttes til de surfaces, der allerede er der, og som ikke ændres.',
  },
  meiToolboxFacsimileAdded: { text: 'Tilføjede surfaces: {n}' },
  meiToolboxFacsimileLinked: { text: 'Sider forbundet med en surface, der allerede var der: {n}' },
  meiToolboxFacsimileCreated: { text: 'Faksimile tilføjet.' },
  meiToolboxFacsimileUpToDate: { text: 'Hver side har allerede sin surface; intet blev tilføjet.' },
  meiToolboxFacsimileZones: { text: '{n} zoner' },
  meiToolboxFacsimileSummary: { text: '{surfaces} surfaces, {zones} zoner' },
  meiToolboxFacsimileNone: { text: 'Denne kodning har ingen faksimile.' },
  meiToolboxReformatVerovio: {
    text: 'Via Verovio',
    description: 'Lader Verovio skrive kodningen på ny ud fra sin egen repræsentation.',
  },
  meiToolboxReformatVerovioNote: {
    text: 'Verovio skriver kodningen ud fra sin egen repræsentation, i sin egen formatering og attributrækkefølge.',
  },
  meiToolboxReformatXml: {
    text: 'Via XML-parseren',
    description: 'Reformaterer kodningen via XML-parseren: indholdet bevares, kun formateringen og attributrækkefølgen ændres. Samme som Kode → Reformatér via XML-parseren.',
  },
  meiToolboxReformatUnchanged: { text: 'Kodningen er uændret.' },
  meiToolboxReformatDone: { text: '{lines} linjer' },
  meiToolboxAttributeOrder: {
    text: 'Attributrækkefølge',
    description: 'Den rækkefølge, attributter skrives i, hver gang mei-friend skriver et element tilbage.',
    labels: ['som kodet', 'alfabetisk', 'xml:id først, derefter alfabetisk', 'tilpasset…'],
  },
  meiToolboxAttributeOrderPattern: {
    text: 'Rækkefølgemønster',
    description: 'Attributnavne adskilt af mellemrum eller kommaer, i den ønskede rækkefølge, f.eks. “xml:id n label *”. Et navn, der ender på *, matcher alle attributter med det præfiks (clef.*). Et enkelt * står for alle ikke-nævnte attributter i alfabetisk orden; uden det bevarer de deres rækkefølge til sidst. Namespace-erklæringer kommer altid først.',
  },
  codeCheckerFixShown: { text: 'Ret {n} viste' },
  codeCheckerIgnoreShown: { text: 'Ignorer {n} viste' },
  convertGroupAccid: { text: 'Noterede fortegn (@accid)' },
  convertGroupAccidGes: { text: 'Klingende fortegn (@accid.ges)' },
  convertGroupArtic: { text: 'Artikulationer (@artic, @artic.ges)' },
  convertGroupSyl: { text: 'Sangtekst (@syl)' },
  convertGroupFermata: { text: 'Fermater (@fermata)' },
  convertGroupTie: { text: 'Bindebuer (@tie)' },
  convertGroupSlur: { text: 'Legatobuer (@slur)' },
  convertGroupGliss: { text: 'Glissandi (@gliss)' },
  convertGroupDefinitions: { text: 'Nøgle, toneart, taktart, mensur (staffDef, scoreDef)' },
  convertGroupLabels: { text: 'Gruppesymboler og etiketter (staffGrp, staffDef)' },
  convertAttributesToElementsTestSummary: { text: 'Attributter ville blive konverteret til {list}.' },
  convertElementsToAttributesSummary: { text: 'Elementer konverteret til attributter: {list}.' },
  convertElementsToAttributesTestSummary: { text: 'Elementer ville blive konverteret til attributter: {list}.' },
  convertElementsToAttributesProblems: { text: '{count} elementer kunne ikke konverteres.' },
  convertElementsToAttributesNone: { text: 'Ingen elementer fundet, der kan konverteres til attributter.' },
  elementsToAttributesConfirmation: { text: '<b>Elementer → attributter</b>\n\nAdvarsel: denne handling kan ødelægge eksterne links.\n\n{count} af de elementer, der konverteres, har en xml:id, som fjernes sammen med elementet. Elementer, der henvises til i denne fil, konverteres ikke.\n\nLinks fra andre filer, annotationer gemt uden for denne fil, faksimileværktøjer eller URL\'er, der peger på disse xml:id\'er, vil ikke længere virke.' },
  elementsToAttributesProceed: { text: 'Konverter' },
  elementsToAttributesCancel: { text: 'Annuller' },
  convertScopeAll: { text: 'Omfang: hele kodningen (markér tekst i editoren for at begrænse konverteringen)' },
  convertScopeSelection: { text: 'Omfang: markering, linje {from}–{to}' },
  convertSelectionSuffix: { text: 'markering' },
  renumberMeasuresStartNumber: {
    text: 'Startnummer',
    description:
      'Nummeret på den første fuldstændige takt; alle følgende takter nummereres ud fra det. En ufuldstændig første takt (@metcon="false", f.eks. en optakt) får ét nummer mindre, så med startnummer 1 får den 0 (medmindre ‘Fortsæt på tværs af ufuldstændige mål’ er slået til).',
  },
  renumberMeasuresUnchanged: { text: 'uændret' },
  renumberMeasuresSummary: { text: '{total} takter, {changed} omnummereret.' },
  renumberMeasuresSummaryTest: { text: '{total} takter, {changed} ville blive omnummereret.' },
  renumberMeasuresNoMeasures: { text: 'Ingen takter fundet.' },
  addIdsText: { text: 'Tilføj ids til MEI' },
  removeIdsText: { text: 'Fjern ids fra MEI' },
  changeIdsText: {
    text: 'Ændr ids i MEI (bryder eksterne links)',
    description:
      'Tildeler et nyt xml:id til hvert element (eller til de valgte elementer). Referencer i denne fil opdateres, men links fra andre filer, annotationer, faksimileværktøjer eller URL’er, der peger på de gamle xml:id’er, vil ikke længere virke.',
  },
  changeIdsConfirmation: {
    text: '<b>Ændr ids i MEI</b>\n\nAdvarsel: denne handling bryder eksterne links.\n\n{changed} xml:id’er ændres, og {added} nye xml:id’er tilføjes; {references} referencer i denne fil opdateres.\n\nLinks fra andre filer, annotationer, faksimileværktøjer eller URL’er, der peger på de gamle xml:id’er, vil ikke længere virke.',
  },
  changeIdsProceed: { text: 'Ændr ids' },
  changeIdsCancel: { text: 'Annuller' },
  reRenderMeiVerovio: { text: 'Genrender via Verovio' },
  addFacsimile: { text: 'Tilføj facsimile element' },
  ingestFacsimileText: { text: 'Indtag facsimile' },
  ingestFacsimileTitle: { text: 'Indlæser facsimile' },
  ingestFacsimileProgress: { text: '{file}: {done} af {total} zoner behandlet.' },
  ingestFacsimileDoneTitle: { text: 'Facsimile indlæst' },
  ingestFacsimileStoppedTitle: { text: 'Indlæsning af facsimile stoppet' },
  ingestFacsimileSummary: {
    text: 'Facsimile fra {file} med {surfaces} sider (surface) og {zones} zoner indsat før body; @facs-attributter tilføjet til {added} elementer.',
  },
  ingestFacsimileStopped: {
    text: 'Stoppet efter {done} af {total} zoner. De hidtidige ændringer kan fortrydes i ét trin.',
  },
  ingestFacsimileProblems: { text: 'Der opstod {count} problemer:' },
  ingestFacsimileNotFound: { text: '{type} med n="{n}" ikke fundet.' },
  ingestFacsimileNotUnique: { text: '{type} med n="{n}" ikke entydig.' },
  ingestFacsimileNoId: { text: '{type} med n="{n}" har ingen xml:id, @facs ikke tilføjet.' },
  ingestFacsimileNotInEditor: { text: '{type} med n="{n}" ikke fundet i editoren, @facs ikke tilføjet.' },
  ingestFacsimileNoFacsimile: { text: 'Indlæsning af facsimile mislykkedes: intet facsimile-element fundet i {file}.' },
  ingestFacsimileNoBody: { text: 'Indlæsning af facsimile mislykkedes: intet body-element fundet i kodningen.' },
  ingestFacsimileNoBodyInEditor: {
    text: 'Intet body-element fundet i editoren, facsimile-elementet blev ikke indsat.',
  },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Indsæt' },
  addNoteText: { text: 'Tilføj note' },
  convertNoteToRestText: { text: 'Note <=> pause' },
  toggleChordText: { text: 'Note <=> akkord' },
  addDoubleSharpText: { html: 'Dobbelt skarp &#119082;' },
  addSharpText: { html: 'Skarp &#9839;' },
  addNaturalText: { html: 'Naturlig &#9838;' },
  addFlatText: { html: 'Flad &#9837;' },
  addDoubleFlatText: { html: 'Dobbelt flad &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Direktiv' },
  addDynamicsText: { text: 'Dynamik' },
  addSlurText: { text: 'Bindebue' },
  addTieText: { text: 'Sløjfe' },
  addCrescendoHairpinText: { text: 'Crescendo hårnål' },
  addDiminuendoHairpinText: { text: 'Diminuendo hårnål' },
  addBeamText: { text: 'Bjælke' },
  addBeamSpanText: { text: 'Bjælke span' },
  addSuppliedText: { text: 'Tilføjet' },
  addSuppliedArticText: { text: 'Tilføjet (Artic)' },
  addSuppliedAccidText: { text: 'Tilføjet (Accid)' },
  addArpeggioText: { text: 'Arpeggio' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pedal ned' },
  addPedalUpText: { text: 'Pedal op' },
  addTrillText: { text: 'Trille' },
  addTurnText: { text: 'Drejning' },
  addTurnLowerText: { text: 'Drejning lavere' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Øvre mordent' },
  addOctave8AboveText: { text: 'Oktav (8va over)' },
  addOctave15AboveText: { text: 'Oktav (15va over)' },
  addOctave8BelowText: { text: 'Oktav (8va under)' },
  addOctave15BelowText: { text: 'Oktav (15va under)' },
  addGClefChangeBeforeText: { text: 'G-nøgle før' },
  addGClefChangeAfterText: { text: 'G-nøgle efter' },
  addFClefChangeBeforeText: { text: 'F-nøgle før' },
  addFClefChangeAfterText: { text: 'F-nøgle efter' },
  addCClefChangeBeforeText: { text: 'C-nøgle før' },
  addCClefChangeAfterText: { text: 'C-nøgle efter' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Accent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Hjælp' },
  goToHelpPageText: { text: 'mei-friend hjælp sider' },
  goToCheatSheet: { text: 'mei-friend snydeark' },
  showChangelog: { text: 'mei-friend ændringslog' },
  goToGuidelines: { text: 'MEI Retningslinjer' },
  consultGuidelinesForElementText: { text: 'Retningslinjens indgang for nuværende element' },
  provideFeedback: { text: 'Giv feedback' },
  resetDefault: { text: 'Nulstil til standard' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Skift MIDI afspilnings kontrolbar' },
  showFacsimileButton: { description: 'Skift facsimile panel' },
  showAnnotationsButton: { description: 'Skift annotations panel' },
  showSettingsButton: { description: 'Vis indstillingspanel' },

  // Footer texts
  leftFooter: {
    html:
      'Hostet af <a href="https://iwk.mdw.ac.at" target="_blank">IWK</a> ' +
      'på <a href="https://mdw.ac.at" target="_blank">mdw</a>, med ' +
      heart +
      ' fra Wien. ' +
      '<a href="https://iwk.mdw.ac.at/impressum" target="_blank">Impressum</a>.',
  },
  loadingVerovio: { text: 'Indlæser Verovio' },
  verovioLoaded: { text: 'indlæst' },
  convertedToPdf: { text: 'konverteret til PDF' },
  statusBarCompute: { text: 'Beregne' },
  middleFooterPage: { text: 'side' },
  middleFooterOf: { text: 'af' },
  middleFooterLoaded: { text: 'indlæst' },

  // Control menu
  verovioIcon: {
    description: `mei-friend arbejder aktivitet:
    med urets rotation angiver Verovio aktivitet,
    mod urets rotation hastighed arbejder aktivitet`,
  },
  decreaseScaleButton: { description: 'Formindsk notation' },
  verovioZoom: { description: 'Skala størrelse af notation' },
  increaseScaleButton: { description: 'Forøg notation' },
  pagination1: { html: 'Side&nbsp;' },
  pagination3: { html: '&nbsp;af' },
  sectionSelect: { description: 'Naviger kodet sektion/afslutningsstruktur' },
  firstPageButton: { description: 'Gå til første side' },
  previousPageButton: { description: 'Gå til forrige side' },
  paginationLabel: { description: 'Side navigation: klik for manuelt at indtaste sidetal, der skal vises' },
  nextPageButton: { description: 'Gå til næste side' },
  lastPageButton: { description: 'Gå til sidste side' },
  flipCheckbox: { description: 'Automatisk skift side til kodnings markør position' },
  flipButton: { description: 'Manuelt skift side til kodnings markør position' },
  breaksSelect: { description: 'Definer system/sideskift opførsel af notation' },
  breaksSelectNone: { text: 'Ingen' },
  breaksSelectAuto: { text: 'Automatisk' },
  breaksSelectMeasure: { text: 'Mål' },
  breaksSelectLine: { text: 'System' },
  breaksSelectEncoded: { text: 'System og side' },
  breaksSelectSmart: { text: 'Smart' },
  updateControlsLabel: {
    text: 'Opdater',
    description: 'Kontroller opdateringsopførsel af notation efter ændringer i kodning',
  },
  liveUpdateCheckbox: { description: 'Opdater automatisk notation efter ændringer i kodning' },
  codeManualUpdateButton: { description: 'Opdater notation manuelt' },
  engravingFontSelect: { description: 'Vælg gravering skrifttype' },
  backwardsButton: { description: 'Naviger til venstre i notation' },
  forwardsButton: { description: 'Naviger til højre i notation' },
  upwardsButton: { description: 'Naviger opad i notation' },
  downwardsButton: { description: 'Naviger nedad i notation' },
  speedLabel: {
    text: 'Hastigheds mode',
    description:
      'I hastigheds mode sendes kun den nuværende side til Verovio for at reducere render tid med store filer',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: 'Gem PDF', description: 'Gem som PDF' },
  pdfCloseButton: { description: 'Luk print visning' },
  pagesLegendLabel: { text: 'Side rækkevidde', singlePage: 'side', multiplePages: 'Sider' },
  selectAllPagesLabel: { text: 'Alle' },
  selectCurrentPageLabel: { text: 'Nuværende side' },
  selectFromLabel: { text: 'fra:' },
  selectToLabel: { text: 'til:' },
  selectPageRangeLabel: { text: 'Side rækkevidde:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Kun den nuværende side er renderet til PDF, fordi hastigheds mode er aktiveret. ' +
      'Fravælg hastigheds mode for at vælge fra alle sider.',
  },
  pdfPreviewNormalModeTitle: { text: 'Vælg side rækkevidde der skal gemmes i PDF.' },

  // Facsimile panel
  facsimileIcon: { description: 'Facsimile panel' },
  facsimileDecreaseZoomButton: { description: 'Formindsk notation billede' },
  facsimileZoom: { description: 'Juster størrelse på notation billede' },
  facsimileIncreaseZoomButton: { description: 'Forøg notation billede' },
  facsimileFullPageLabel: { text: 'Fuld side', description: 'Vis fuld side af facsimile billede' },
  facsimileFullPageCheckbox: { description: 'Vis fuld side af facsimile billede' },
  facsimileShowZonesLabel: { text: 'Vis zone bokse', description: 'Vis zone bokse af facsimile' },
  facsimileShowZonesCheckbox: { description: 'Vis zone bokse af facsimile' },
  facsimileEditZonesCheckbox: { description: 'Rediger zoner af facsimile' },
  facsimileEditZonesLabel: { text: 'Rediger zoner', description: 'Rediger zoner af facsimile' },
  facsimileCloseButton: { description: 'Luk facsimile panel' },
  facsimileDefaultWarning: { text: 'Ingen facsimile indhold at vise.' },
  facsimileNoSurfaceWarning: {
    text: 'Ingen overfladeelement fundet for denne side.\n(Et initial pb element kan mangle.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Facsimile uden zoner kun synlig i fuld side mode.' },
  facsimileImgeNotLoadedWarning: { text: 'Kunne ikke indlæse billede' },

  // Drag'n'drop
  dragOverlayText: { text: 'Træk din inputfil her.' },

  // Public repertoire
  openUrlHeading: { text: 'Åbn web-hostet kodning via URL' },
  openUrlInstructions: {
    text:
      "Vælg venligst fra det offentlige repertoire eller indtast URL'en på " +
      'en web-hostet musikkodning nedenfor. Bemærk: Værtsserveren skal ' +
      'understøtte cross-origin resource sharing (CORS).',
  },
  publicRepertoireSummary: { text: 'Offentligt repertoire' },
  sampleEncodingsComposerLabel: { text: 'Komponist:' },
  sampleEncodingsEncodingLabel: { text: 'Kodning:' },
  sampleEncodingsOptionLabel: { text: 'Vælg en kodning...' },
  openUrlButton: { text: 'Åbn URL' },
  openUrlCancel: { text: 'Annuller' },
  proposePublicRepertoire: {
    html:
      'Vi byder forslag velkommen til ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank">' +
      'tilføjelser til det offentlige repertoire' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Vælg en kodning...' },
  openUrlChooseComposerText: { text: 'Vælg en komponist...' },
  openUrlOpenEncodingByUrlText: { text: 'Åbn web-hostet kodning via URL' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Anmod GitHub Action workflow:' },
  githubActionStatusMsgWaiting: { text: 'Vær tålmodig, mens GitHub behandler din workflow...' },
  githubActionStatusMsgFailure: { text: 'Kunne ikke køre workflow - GitHub-status' },
  githubActionsRunCompletedMsg: { text: 'Workflow-kørsel afsluttet:' },
  githubActionsRunFailedMsg: { text: 'Workflow-kørsel kunne ikke afsluttes:' },
  githubActionsGitHubStatusLink: { text: 'GitHub-status' },
  githubActionsRunButton: { text: 'Kør workflow' },
  githubActionsSupplyWorkpackageDefinition: { text: 'Angiv arbejdspakkedefinition' },
  githubActionsRequiresWorkpackageDefinition: {
    text: 'Denne GitHub Action kræver en arbejdspakkedefinition. Angiv venligst en (URL til et JSON-definitionsobjekt) i mei-friend-indstillingerne.',
  },
  githubActionsRunButtonReload: { text: 'Genindlæs MEI fil' },
  githubActionsCancelButton: { text: 'Annuller' },
  githubActionsInputSetterFilepath: { text: 'Kopier nuværende filsti til input' },
  githubActionsInputSetterSelection: { text: 'Kopier nuværende MEI markering til input' },
  githubActionsNoSummaryProvided: { text: 'Ingen oversigt tilgængelig. Se GitHub-statuslinket ovenfor for detaljer.' },
  githubActionsWaitingOpenLink: { text: 'Følg workflow-status på GitHub' },
  githubActionsDisabledTooltip: {
    text: 'Åbn en kodning fra dette repository for at køre GitHub Actions-workflows.',
  },
  githubActionsDisabledDirtyTooltip: {
    text: 'Commit dine lokale ændringer for at køre GitHub Actions-workflows.',
  },
  githubActionsWorkpackageConfigInvalidResponse: {
    text: 'Den angivne JSON-konfigurationsfil overholder ikke det forventede skema. Se dokumentationen for detaljer.',
  },
  titleGithubActions: {
    text: 'Brug GitHub Actions',
    description: 'Arbejd med GitHub Actions, når de er tilgængelige i et repository',
  },
  enableGithubActions: {
    text: 'Vis tilgængelige GitHub Actions',
    description: 'Vis tilgængelige GitHub Actions ved navigation i repository i GitHub-menuen',
  },
  supplyWorkpackageGithubActionsConfiguration: {
    text: 'Arbejdspakkedefinition',
    description: 'Brug en GitHub Actions arbejdspakkedefinitionsfil',
  },

  // Fork modals
  forkRepoGithubText: { text: 'Fork Github repository' },
  forkRepoGithubExplanation: {
    text: 'Linket du har fulgt ' + 'vil oprette en GitHub fork af følgende repository til redigering i mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Er dette OK?' },
  forkRepositoryInstructions: {
    text:
      'Vælg venligst fra det offentlige repertoire eller indtast ' +
      'Github (bruger eller organisation) navn og repository navn på et Github-hostet repository nedenfor. ' +
      'Dit forkede repository vil blive tilgængeligt fra Github menuen.',
  },
  forkRepositoryGithubText: { text: 'Fork Github repository' },
  forkRepertoireSummary: { text: 'Offentligt repertoire' },
  forkRepertoireComposerLabel: { text: 'Komponist:' },
  forkRepertoireOrganizationLabel: { text: 'Organisation:' },
  forkRepertoireOrganizationOption: { text: 'Vælg en GitHub organisation...' },
  forkRepertoireRepositoryLabel: { text: 'Repository:' },
  forkRepertoireRepositoryOption: { text: 'Vælg en kodning...' },
  forkRepositoryInputName: { placeholder: 'Github bruger eller organisation' },
  forkRepositoryInputRepoOption: { text: 'Vælg et repository' },
  forkRepositoryToSelectorText: { text: 'Fork til: ' },
  forkRepositoryButton: { text: 'Fork repository' },
  forkRepositoryCancel: { text: 'Annuller' },
  forkProposePublicRepertoire: {
    html:
      'Vi byder forslag velkommen til ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'tilføjelser til det offentlige repertoire' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Omslut med tag navn' },
  selectTagNameForEnclosureOkButton: { value: 'OK' },
  selectTagNameForEnclosureCancelButton: { value: 'Annuller' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solid er en decentraliseret platform for sociale linked data platforme. Log ind på Solid for at oprette stand-off-annotationer ved hjælp af linked data (RDF).',
  },
  solidProvider: { description: 'Vælg venligst en Solid identitetsudbyder (IdP) eller specificer din egen.' },
  solidLoginBtn: { text: 'Log ind' },
  solidOverlayCancel: { html: 'Gendanner Solid session - tryk <span>esc</span> eller klik her for at annullere' },
  solidWelcomeMsg: { text: 'Velkommen, ' },
  solidLogout: { text: 'Log ud' },
  solidLoggedOutWarning: {
    html: `Du er logget ud af mei-friends Solid integration, men din browser er stadig logget ind på Solid!
      <a id="solidIdPLogoutLink" target="_blank">Klik her for at logge ud af Solid</a>.`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: 'Luk annotationspanel' },
  hideAnnotationPanelButton: { description: 'Luk annotationspanel' },
  closeAnnotationPanelButton: { description: 'Luk annotationspanel' },
  annotationToolsButton: { text: 'Værktøjer', description: 'Annotations værktøjer' },
  annotationListButton: { text: 'Liste', description: 'Liste over annotationer' },
  writeAnnotStandoffText: { text: 'Web Annotation' },
  annotationToolsIdentifyTitle: { text: 'Identificer' },
  annotationToolsIdentifySpan: { text: 'Identificer musisk objekt' },
  annotationToolsHighlightTitle: { text: 'Fremhæv' },
  annotationToolsHighlightSpan: { text: 'Fremhæv' },
  annotationToolsDescribeTitle: { text: 'Beskriv' },
  annotationToolsDescribeSpan: { text: 'Beskriv' },
  annotationToolsLinkTitle: { text: 'Link' },
  annotationToolsLinkSpan: { text: 'Link' },
  listAnnotations: { text: 'Ingen annotationer til stede.' },
  addWebAnnotation: { text: 'Indlæs web annotation(er)' },
  loadWebAnnotationMessage: { text: 'Indtast URL på web annotation eller web annotation container' },
  loadWebAnnotationMessage1: { text: 'Kunne ikke indlæse den angivne URL' },
  loadWebAnnotationMessage2: { text: 'prøv venligst igen' },
  noAnnotationsToDisplay: { text: 'Ingen annotationer at vise' },
  flipPageToAnnotationText: { description: 'Skift side til denne annotation' },
  deleteAnnotation: { description: 'Slet denne annotation' },
  deleteAnnotationConfirmation: { text: 'Er du sikker på, at du ønsker at slette denne annotation?' },
  makeStandOffAnnotation: {
    description: 'Stand-off status (RDF)',
    descriptionSolid: 'Skriv til Solid som RDF',
    descriptionToLocal: 'Åbn stand-off (RDF) annotation i nyt faneblad',
  },
  makeInlineAnnotation: {
    description: 'Klik for in-line annotation',
    descriptionCopy: 'Kopier <annot> xml:id til udklipsholder',
  },
  pageAbbreviation: { text: 's.' },
  elementsPlural: { text: 'elementer' },
  askForLinkUrl: { text: 'Indtast venligst en URL at linke til' },
  drawLinkUrl: { text: 'Åbn i nyt faneblad' },
  askForDescription: { text: 'Indtast venligst en tekstbeskrivelse at anvende' },
  maxNumberOfAnnotationAlert: {
    text1: 'Antallet af annot elementer overstiger konfigurerbare "Maksimalt antal annotationer"',
    text2: 'Nye annotationer kan stadig genereres og vil blive vist, hvis "Vis annotationer" er indstillet.',
  },
  annotationsOutsideScoreWarning: {
    text: 'Beklager, kan i øjeblikket ikke skrive annotationer placeret uden for &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: 'Kan ikke skrive annotation, da MEI forankringspunktet mangler xml:id.',
    text2: 'Tildel venligst identifikatorer ved at vælge "Manipuler" -> "Genrender MEI (med ids)" og prøv igen.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Hastigheds mode',
    description:
      'Hastigheds mode er aktiv; kun afspilning af MIDI for nuværende side. For at afspille hele kodningen, fjern markeringen i dette felt.',
  },
  midiExpansionSelectorTitle: {
    text: 'Vælg ekspansionselement til MIDI-afspilning',
  },
  midiExpansionSelectorDisabledTitle: {
    text: 'Deaktiveret i hastighedsmode (kun den aktuelle side gengives).',
  },
  noExpansionOption: {
    text: 'Ingen ekspansion',
  },
  closeMidiPlaybackControlBarButton: { description: 'Skjul MIDI afspilnings kontrolbar' },
  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend indstillinger',
    description: 'mei-friend indstillinger',
  },
  mfReset: {
    text: 'Standard',
    description: 'Nulstil til mei-friend standarder',
  },
  filterSettings: {
    placeholder: 'Filtrer indstillinger',
    description: 'Skriv her for at filtrere indstillinger',
  },
  closeSettingsButton: {
    description: 'Luk indstillingspanel',
  },
  hideSettingsButton: {
    description: 'Luk indstillingspanel',
  },
  titleGeneral: {
    text: 'Generelt',
    description: 'Generelle mei-friend indstillinger',
  },
  selectToolkitVersion: {
    text: 'Verovio version',
    description:
      'Vælg Verovio værktøjskasse version ' +
      '(* Skift til ældre versioner før 3.11.0 ' +
      'kan kræve en opdatering på grund af hukommelsesproblemer.)',
  },
  toggleSpeedMode: {
    text: 'Hastigheds mode',
    description:
      'Skift Verovio hastigheds mode. ' +
      'I hastigheds mode sendes kun den nuværende side ' +
      'til Verovio for at reducere render tid med store filer',
  },
  selectIdStyle: {
    text: 'Stil af genererede xml:ids',
    description:
      'Stil af nyligt genererede xml:ids (eksisterende xml:ids ændres ikke)' +
      'f.eks., Verovio original: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend stil: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Indsæt applikationsudtalelse',
    description:
      'Indsæt en applikationsudtalelse til kodningsbeskrivelsen i MEI headeren, identificerende ' +
      'applikationsnavn, version, dato for første og sidste redigering',
  },
  selectLanguage: {
    text: 'Sprog',
    description: 'Vælg sprog af mei-friend grænseflade.',
  },

  // Drag select
  dragSelection: {
    text: 'Træk vælg',
    description: 'Vælg elementer i notation med musedrag',
  },
  dragSelectNotes: {
    text: 'Vælg noter',
    description: 'Vælg noter',
  },
  dragSelectRests: {
    text: 'Vælg pauser',
    description: 'Vælg pauser og gentagelser (pause, mPause, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Vælg placerings elementer ',
    description: 'Vælg placerings elementer (dvs. med en @placement attribut: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Vælg bindebuer ',
    description: 'Vælg bindebuer (dvs. elementer med @curvature attribut: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Vælg mål ',
    description: 'Vælg mål',
  },

  // Control menu
  controlMenuSettings: {
    text: 'Notations kontrolbar',
    description: 'Definer elementer, der skal vises i kontrolmenuen over notation',
  },
  controlMenuFlipToPageControls: {
    text: 'Vis skift til side kontroller',
    description: 'Vis skift til side kontroller i notations kontrolmenu',
  },
  controlMenuUpdateNotation: {
    text: 'Vis notations opdaterings kontroller',
    description: 'Vis notations opdaterings opførsels kontroller i notations kontrolmenu',
  },
  controlMenuFontSelector: {
    text: 'Vis notations skrifttype vælger',
    description: 'Vis notations skrifttype (SMuFL) vælger i notations kontrolmenu',
  },
  controlMenuNavigateArrows: {
    text: 'Vis navigationspile',
    description: 'Vis navigationspile i notations kontrolmenu',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Vis hastigheds mode afkrydsningsfelt',
    description: 'Vis hastigheds mode afkrydsningsfelt i notations kontrolmenu',
  },
  notationControlMenuOverflowIcon: {
    description: 'Vis ekstra kontrolknapper',
  },

  facsimileControlMenuOverflowIcon: {
    description: 'Vis ekstra kontrolknapper',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI afspilning',
    description: 'MIDI afspilnings indstillinger',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Vis afspilningsgenvej',
    description:
      'Forårsager en genvej (boble i nederste venstre hjørne; ' +
      'klik for straks at starte afspilning) at dukke op ' +
      'når MIDI afspilnings kontrolbar er lukket',
  },
  showMidiPlaybackControlBar: {
    text: 'Vis MIDI afspilnings kontrolbar',
    description: 'Vis MIDI afspilnings kontrolbar',
  },
  scrollFollowMidiPlayback: {
    text: 'Rul-følg MIDI afspilning',
    description: 'Rul notationspanel for at følge MIDI afspilning på nuværende side',
  },
  pageFollowMidiPlayback: {
    text: 'Side-følg MIDI afspilning',
    description: 'Skift automatisk sider for at følge MIDI afspilning',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Fremhæv nuværende klingende noter',
    description: 'Visuelt fremhæv nuværende klingende noter i notationspanelet under MIDI afspilning',
  },
  selectMidiExpansion: {
    text: 'Afspilnings udvidelse',
    description: 'Vælg udvidelseselement, der skal bruges til MIDI afspilning',
  },

  // Transposition
  titleTransposition: {
    text: 'Transponer',
    description: 'Transponer noder',
  },
  enableTransposition: {
    text: 'Aktiver transponering',
    description:
      'Aktiver transponering indstillinger, der skal anvendes gennem transponer knappen nedenfor. Transponeringen vil blive anvendt på notationen kun, kodningen forbliver uændret, medmindre du klikker på elementet "Genrender via Verovio" i "Manipuler" dropdown-menuen.',
  },
  transposeInterval: {
    text: 'Transponer ved interval',
    description:
      'Transponer kodning ved kromatisk interval ved de mest almindelige intervaller (Verovio understøtter base-40 systemet)',
    labels: [
      'Perfekt unison',
      'Forstørret unison',
      'Formindsket sekund',
      'Mindre sekund',
      'Større sekund',
      'Forstørret sekund',
      'Formindsket tert',
      'Mindre tert',
      'Større tert',
      'Forstørret tert',
      'Formindsket kvart',
      'Perfekt kvart',
      'Forstørret kvart',
      'Formindsket kvint',
      'Perfekt kvint',
      'Forstørret kvint',
      'Formindsket sekst',
      'Mindre sekst',
      'Større sekst',
      'Forstørret sekst',
      'Formindsket septim',
      'Mindre septim',
      'Større septim',
      'Forstørret septim',
      'Formindsket oktav',
      'Perfekt oktav',
    ],
  },
  transposeKey: {
    text: 'Transponer til toneart',
    description: 'Transponer til toneart',
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
    text: 'Tone retning',
    description: 'Tone retning af transponering (op/ned)',
    labels: ['Op', 'Ned', 'Nærmeste'],
  },
  transposeButton: {
    text: 'Transponer',
    description:
      'Anvend transponering med ovenstående indstillinger på notationen, mens MEI-kodningen forbliver uændret. For også at transponere MEI-kodningen med de nuværende indstillinger, brug "Genrender via Verovio" i "Manipuler" dropdown-menuen.',
  },

  // Renumber measures
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Fortsæt på tværs af ufuldstændige mål',
    description: 'Fortsæt målnumre på tværs af ufuldstændige mål (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Suffiks ved ufuldstændige mål',
    description: 'Brug numresuffiks ved ufuldstændige mål (f.eks., 23-cont)',
    labels: ['ingen', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Fortsæt på tværs af afslutninger',
    description: 'Fortsæt målnumre på tværs af afslutninger',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Suffiks ved afslutninger',
    description: 'Brug numresuffiks ved afslutninger (f.eks., 23-a)',
  },

  // Annotations
  titleAnnotations: {
    text: 'Annotationer',
    description: 'Annoteringsindstillinger',
  },
  showAnnotations: {
    text: 'Vis annotationer',
    description: 'Vis annotationer i notation',
  },
  showAnnotationPanel: {
    text: 'Vis annotationspanel',
    description: 'Vis annotationspanel',
  },
  annotationDisplayLimit: {
    text: 'Maksimalt antal annotationer',
    description: 'Maksimalt antal annotationer der skal vises (store antal kan sænke mei-friend)',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: 'Facsimile panel',
    description: 'Vis facsimile billeder af kildeudgaven, hvis tilgængelig',
  },
  showFacsimilePanel: {
    text: 'Vis facsimile panel',
    description: 'Vis noderne billeder af kildeudgaven leveret i facsimile elementet',
  },
  selectFacsimilePanelOrientation: {
    text: 'Facsimile panel position',
    description: 'Vælg facsimile panel position i forhold til notation',
    labels: ['venstre', 'højre', 'top', 'bund'],
  },
  facsimileZoomInput: {
    text: 'Facsimile billede zoom (%)',
    description: 'Zoomniveau for facsimile billede (i procent)',
  },
  showFacsimileFullPage: {
    text: 'Vis fuld side',
    description: 'Vis facsimile billede på fuld side',
  },
  showFacsimileZones: {
    text: 'Vis facsimile zone bokse',
    description: 'Vis facsimile zone afgrænsningsbokse',
  },
  editFacsimileZones: {
    text: 'Rediger facsimile zoner',
    description: 'Rediger facsimile zoner (vil linke afgrænsningsbokse til facsimile zoner)',
  },
  showFacsimileTitles: {
    text: 'Vis facsimile titler',
    description: 'Vis facsimile titler over kildebilleder',
  },
  titleMeiToolbox: {
    text: 'MEI-værktøjskasse',
    description: 'Kontroller og ændringer af kodningen i et panel ved siden af editoren',
  },
  showMeiToolbox: {
    text: 'Vis MEI-værktøjskassen',
    description: 'Vis MEI-værktøjskassen med fanerne Kontrollér, Konvertér, Omnummerér, Id’er, Faksimile og Gengiv igen',
  },
  selectMeiToolboxOrientation: {
    text: 'MEI-værktøjskassens placering',
    description: 'Vælg MEI-værktøjskassens placering i forhold til editoren',
    labels: ['venstre', 'højre', 'øverst', 'nederst'],
  },

  // Supplied element
  titleSupplied: {
    text: 'Håndter redaktionelt indhold',
    description: 'Kontroller håndtering af <supplied> elementer',
  },
  showSupplied: {
    text: 'Vis <supplied> elementer',
    description: 'Fremhæv alle elementer indeholdt af et <supplied> element',
  },
  suppliedColor: {
    text: 'Vælg <supplied> fremhævningsfarve',
    description: 'Vælg <supplied> fremhævningsfarve',
  },
  respSelect: {
    text: 'Vælg <supplied> ansvar',
    description: 'Vælg ansvar id',
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'Editor indstillinger',
  },
  cmReset: {
    text: 'Standard',
    description: 'Nulstil til mei-friend standarder',
  },
  titleAppearance: {
    text: 'Editor udseende',
    description: 'Kontrollerer udseendet af editoren',
  },
  zoomFont: {
    text: 'Skriftstørrelse (%)',
    description: 'Skift skriftstørrelse i editoren (i procent)',
  },
  theme: {
    text: 'Tema',
    description: 'Vælg tema for editoren',
  },
  matchTheme: {
    text: 'Notation matcher tema',
    description: 'Match notation til editorens farvetema',
  },
  tabSize: {
    text: 'Indrykningsstørrelse',
    description: 'Antal mellemrumstegn for hver indrykningsniveau',
  },
  lineWrapping: {
    text: 'Linjebrydning',
    description: 'Om linjer brydes ved slutningen af panelet',
  },
  lineNumbers: {
    text: 'Linenumre',
    description: 'Vis linjenumre',
  },
  firstLineNumber: {
    text: 'Første linjenummer',
    description: 'Sæt første linjenummer',
  },
  foldGutter: {
    text: 'Kodefoldning',
    description: 'Aktiver kodefoldning gennem fold gutter',
  },
  titleEditorOptions: {
    text: 'Editor opførsel',
    description: 'Kontrollerer editorens opførsel',
  },
  autoValidate: {
    text: 'Automatisk validering',
    description: 'Valider kodning mod schema automatisk efter hver redigering',
  },
  autoShowValidationReport: {
    text: 'Automatisk vis valideringsrapport',
    description: 'Vis valideringsrapport automatisk efter validering er udført',
  },
  autoCloseBrackets: {
    text: 'Automatisk luk klammer',
    description: 'Luk klammer automatisk ved indtastning',
  },
  autoCloseTags: {
    text: 'Automatisk luk tags',
    description: 'Luk tags automatisk ved indtastning',
    type: 'bool',
  },
  matchTags: {
    text: 'Match tags',
    description: 'Fremhæver matchende tags omkring editor markør',
  },
  showLinkedElements: {
    text: 'Vis tilknyttede elementer',
    description: 'Fremhæv elementer, der refereres til af det valgte element (f.eks. startid/endid/plist) i editoren og notationen',
  },
  showTrailingSpace: {
    text: 'Fremhæv unødvendige mellemrum',
    description: 'Fremhæver unødvendige mellemrum ved slutningen af linjer',
  },
  keyMap: {
    text: 'Tastaturgenveje',
    description: 'Vælg tastaturgenveje',
  },
  persistentSearch: {
    text: 'Vedvarende søgefelt',
    description: 'Brug vedvarende søgefeltadfærd (søgefeltet forbliver åbent, indtil det eksplicit lukkes)',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Verovio indstillinger',
  },
  vrvReset: {
    text: 'Standard',
    description: 'Nulstil Verovio til mei-friend standarder',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      'Det ser ud til, at du bruger Safari som din browser, på hvilken ' +
      'mei-friend desværre ikke understøtter schema validering. ' +
      'Brug venligst en anden browser for fuld valideringsunderstøttelse.',
  },
  githubLoggedOutWarning: {
    text: `Du er logget ud af mei-friends GitHub integration, men din browser er stadig logget ind på GitHub!
      <a href="https://github.com/logout" target="_blank">Klik her for at logge ud af GitHub</a>.`,
  },
  generateUrlError: {
    text: 'Kan ikke generere URL til lokal fil ',
  },
  generateUrlSuccess: {
    text: 'URL kopieret til udklipsholder',
  },
  generateUrlNotCopied: {
    text: 'URL ikke kopieret til udklipsholder, prøv igen!',
  },
  errorCode: { text: 'Fejlkode' },
  submitBugReport: { text: 'Indsend fejlrapport' },
  loadingSchema: { text: 'Indlæser schema' },
  schemaLoaded: { text: 'Schema indlæst' },
  noSchemaFound: { text: 'Ingen schema oplysninger fundet i MEI.' },
  schemaNotFound: { text: 'Schema ikke fundet' },
  errorLoadingSchema: { text: 'Fejl ved indlæsning af schema' },
  notValidated: { text: 'Ikke valideret. Tryk her for at validere.' },
  validatingAgainst: { text: 'Validerer mod' },
  validatedAgainst: { text: 'Valideret mod' },
  validationMessages: { text: 'valideringsbeskeder' },
  validationComplete: { text: 'Validering fuldført' },
  validationFailed: { text: 'Validering mislykkedes' },
  noErrors: { text: 'ingen fejl' },
  errorsFound: { text: 'fejl fundet' }, // 5 fejl fundet

  // GitHub-menu.js
  githubRepository: { text: 'Repository' },
  githubBranch: { text: 'Gren' },
  githubFilepath: { text: 'Sti' },
  githubCommit: { text: 'Commit' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Commit som ny fil' } }, value: 'Commit' },
  // Let's Encode! campaign mode (see lib/lets-encode.js)
  splashLetsEncode: {
    html:
      "<p>Du kommer fra <strong>Let's\u00a0Encode!</strong> for at arbejde på en kodningsopgave. mei-friend er en af de editorer, som »Let's\u00a0Encode!« tilbyder til dette arbejde. Brug <strong>Gem</strong> i menuen <strong>Opgavestyring</strong> (øverst til venstre) til at gemme dine fremskridt undervejs, og <strong>Afslut opgave</strong>, når du er færdig, for at bidrage med dit arbejde til kampagnen.</p>",
  },
  letsEncodeCompleteTaskButton: { text: 'Afslut opgave' },
  letsEncodeMenuLabel: { text: 'Opgavestyring' },
  letsEncodeLoggedInAs: { text: 'Logget ind som' },
  letsEncodeSaveButton: { text: 'Gem' },
  letsEncodeSaving: { text: 'Gemmer dit arbejde…' },
  letsEncodeSaveFailed: { text: 'Dit arbejde kunne ikke gemmes.' },
  letsEncodeDismiss: { value: 'Luk' },
  letsEncodeLastSave: { text: 'Sidst gemt:' },
  letsEncodeLastAutosave: { text: 'Automatisk gemt:' },
  letsEncodeSavedAt: { text: 'Gemt' },
  letsEncodeExpiresAt: { text: 'Udløber' },
  letsEncodeTimeRemaining: { text: 'tilbage til at afslutte opgaven' },
  letsEncodeHoursShort: { text: 't' },
  letsEncodeMinutesShort: { text: 'min' },
  letsEncodeDaysShort: { text: 'd' },
  letsEncodeAgo: { text: 'for {n} siden' },
  letsEncodeJustNow: { text: 'lige nu' },
  letsEncodeTimeExpired: { text: 'Tiden til at afslutte opgaven er udløbet' },
  letsEncodeAutosaveMinutes: {
    title: 'Interval for automatisk gemning (minutter)',
    description:
      'Hvor ofte dit arbejde gemmes automatisk, mens du redigerer, i minutter. Der gemmes kun, når du har lavet ændringer; 0 slår automatisk gemning fra.',
  },
  titleLetsEncode: { title: 'Let\'s\u00a0Encode!', description: "Indstillinger for den »Let's\u00a0Encode!«-opgave, du arbejder på" },
  letsEncodeAbandonTaskButton: { text: 'Opgiv opgave' },
  letsEncodeKeepWorking: { value: 'Arbejd videre' },
  letsEncodeCompleteAnyway: { value: 'Afslut opgaven alligevel' },
  letsEncodeAbandonConfirm: { value: 'Opgiv opgave' },
  letsEncodeNoChangesPrompt: {
    text:
      'Du har ikke ændret denne kodning. Det tæller også: når du afslutter opgaven, registreres det, at den ikke krævede ændringer. Du kan også arbejde videre.',
  },
  letsEncodeConfirmCompletePrompt: {
    text: "Vil du afslutte denne opgave? Dit arbejde gemmes og overdrages til »Let's\u00a0Encode!«, og opgaven lukkes.",
  },
  letsEncodeAbandonPrompt: {
    text:
      "Opgive denne opgave? Dit arbejde med den går tabt, også det, du allerede har gemt, og »Let's\u00a0Encode!« får besked om, at du ikke afsluttede opgaven.",
  },
  letsEncodeLoading: { text: "Henter din opgave fra »Let's\u00a0Encode!«…" },
  letsEncodeLogoLinkTitle: { text: "Åbn din »Let's\u00a0Encode!«-kampagne i en ny fane (din opgave forbliver åben her)" },
  letsEncodeDragOverlayText: { text: "Andre filer kan ikke åbnes under en »Let's\u00a0Encode!«-opgave." },
  letsEncodeCommitting: { text: 'Afslutter din opgave…' },
  letsEncodeCompleted: { text: "Opgaven er afsluttet — du sendes tilbage til »Let's\u00a0Encode!«…" },
  letsEncodeCommitFailed: { text: 'Din opgave kunne ikke afsluttes.' },
  letsEncodeRetryButton: { value: 'Prøv igen' },
  letsEncodeAbandonButton: { value: "Tilbage til »Let's\u00a0Encode!«" },
  letsEncodeNoCampaignError: {
    text:
      "Dette »Let's\u00a0Encode!«-link er ufuldstændigt: det nævner ingen kampagne, så resultatet kan ikke meldes tilbage nogen steder. Gå tilbage til »Let's\u00a0Encode!«, og åbn opgaven igen.",
  },
  letsEncodeMissingParameterError: { text: "Overdragelsen fra »Let's\u00a0Encode!« manglede en påkrævet parameter:" },
  letsEncodeFileError: { text: 'Den overdragne fil kunne ikke åbnes på GitHub.' },
  letsEncodeCloneError: { text: 'Din opgave kunne ikke indlæses fra GitHub.' },
  letsEncodeRemoteChangedError: {
    text: 'Filen blev ændret på GitHub, mens du arbejdede, så dit arbejde kunne ikke gemmes.',
  },
  commitLog: { text: 'Commit log' },
  githubDate: { text: 'Dato' },
  githubAuthor: { text: 'Forfatter' },
  githubMessage: { text: 'Besked' },
  none: { text: 'Ingen' },
  commitFileNameText: { text: 'Filnavn' },
  forkRepository: { text: 'Fork repository' },
  forkError: { text: 'Beklager, kunne ikke fork repository' },
  forkBranchMissingError: {
    text: 'Beklager, din eksisterende fork indeholder ikke den ønskede gren, og den kunne ikke oprettes der. Opdater eller slet venligst din fork og prøv igen. Gren',
  },
  loadingFile: { text: 'Indlæser fil' },
  loadFileError: { text: 'Beklager, filen kunne ikke læses fra repositoriet' },
  loadingFromGithub: { text: 'Indlæser fra Github' },
  logOut: { text: 'Log ud' },
  githubLogout: { text: 'Log ud' },
  selectRepository: { text: 'Vælg repository' },
  selectBranch: { text: 'Vælg gren' },
  commitMessageInput: { placeholder: 'Opdateret ved hjælp af mei-friend online' },
  reportIssueWithEncoding: { value: 'Rapportér problem med kodning' },
  clickToOpenInMeiFriend: { text: 'Klik for at åbne i mei-friend' },
  repoAccessError: { text: 'Beklager, kan ikke få adgang til repositories for den angivne bruger eller organisation' },
  allComposers: { text: 'Alle komponister' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Omdøb mål' },

  // Code checker @accid.ges
  accidGesCodeCheckerTitle: { text: 'Kontroller @accid.ges attributter (mod toneart, mål accids og bindinger).' },
  codeCheckerFix: { text: 'Fix' },
  codeCheckerFixAll: { text: 'Fix alle' },
  codeCheckerIgnore: { text: 'Ignorer' },
  codeCheckerIgnoreAll: { text: 'Ignorer alle' },
  codeCheckerCheckingCode: { text: 'Kontrollerer kode...' },
  codeCheckerNoAccidMessagesFound: { text: 'Alle accid.ges attributter synes korrekte.' },
  codeCheckerMeasure: { text: 'Mål' },
  codeCheckerNote: { text: 'Note' },
  codeCheckerHasBoth: { text: 'har både' },
  codeCheckerAnd: { text: 'og' },
  codeCheckerRemove: { text: 'Fjern' },
  codeCheckerFixTo: { text: 'Fix til' },
  codeCheckerAdd: { text: 'Tilføj' },
  codeCheckerWithContradictingContent: { text: 'med modstridende indhold' },
  codeCheckerTiedNote: { text: 'Bundet note' },
  codeCheckerNotSamePitchAs: { text: 'ikke samme tone som' },
  codeCheckerNotSameOctaveAs: { text: 'ikke samme oktav som' },
  codeCheckerNotSameAsStartingNote: { text: 'ikke samme som i startnote' },
  codeCheckerExtra: { text: 'ekstra' }, // overflødig
  codeCheckerHasExtra: { text: 'har ekstra' }, // har overflødig
  codeCheckerLacksAn: { text: 'mangler en' },
  codeCheckerBecauseAlreadyDefined: { text: 'fordi det er defineret tidligere i målet' },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: 'mei-friend kan ikke rulle til de valgte elementer i kodningen. Tilføj venligst ids til kodningen.',
  },
};
