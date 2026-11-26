/**
 * Language file for Bosnian-Croatian-Serbian (latin script).
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'O mei-friend ' },
  showSplashScreen: {
    text: 'Prikaži ekran pri pokretanju',
    description: 'Prikazuje mei-friend ekran pri pokretanju aplikacije',
  },
  splashUpdateIndicator: {
    html: `
      Sledeći tekst je ažuriran od poslednjeg puta kada ste potvrdili početni ekran. Za detalje, molimo vas da <a href="${getChangelogUrl()}" target="_blank">pogledate dnevnik promena</a>.`,
  },
  splashLastUpdated: { text: 'Tekst poslednji put ažuriran:' },
  splashBody: {
    html: `
    <p>
      mei-friend je uređivač za <a href="https://music-encoding.org" target="_blank">muzičke kodove</a>, hostiran na
      <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Univerzitetu muzike i izvođačkih umetnosti u Beču</a>. 
      Molimo vas da pogledate našu <a href="https://mei-friend.github.io" target="_blank">obimnu dokumentaciju</a> za 
      dodatne informacije.
    </p>
    <p>
      Iako je mei-friend aplikacija zasnovana na pretraživaču, vaši lični podaci (uključujući kodiranje koje uređujete i postavke aplikacije) čuvaju se u <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">lokalnoj memoriji</a> vašeg pretraživača i nisu pohranjeni na našim serverima. Radi zaštite vaših GitHub pristupnih podataka, vaša GitHub sesija prijave (uključujući vaš pristupni token) čuva se na mei-friend serveru, a ne u vašem pretraživaču; vaš pretraživač sadrži samo neprozirni identifikator sesije.
    </p>
    <p>
      Podaci se prenose na GitHub samo kada to izričito zatražite (npr. kada se prijavite na GitHub, učitate svoje kodiranje iz ili komitujete u GitHub repozitorijum, ili kada zatražite da se za vas pokrene GitHub Action tok). Slično tome, podaci se prenose na vaš odabrani Solid provajder samo kada to izričito zatražite (npr. kada se prijavite na Solid, ili učitate ili sačuvate stand-off napomene). Radi sigurnosti vaših pristupnih podataka, sve interakcije sa GitHub-om usmjeravaju se kroz proxy server hostovan od strane mdw – Univerziteta muzike i izvođačkih umetnosti u Beču, koji ovim zahtjevima prilaže vaše pristupne podatke iz vaše sesije prijave. Ovaj server deluje kao posrednik između vašeg pretraživača i GitHub-a, i ne pohranjuje sadržaj koji se prenosi kroz njega; kao i kod svakog web servera, metapodaci zahtjeva (poput naziva repozitorijuma i datoteka kojima pristupate) mogu se pojaviti u njegovim tehničkim logovima.
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
      >,
      <a href="https://e-laute.info" target="_blank">I 6019 (E-LAUTE)</a> i <a href="https://lets-encode.mdw.ac.at" target="_blank">PAT 2277625 (Let's\u00a0Encode!)</a>.
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
  githubLoginLink: { text: 'Login' },

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
  reformatEncodingText: {
    text: 'Preformatiraj putem XML parsera',
    description:
      'Preformatira cijelo kodiranje putem XML parsera: atributi sortirani (najprije xml:id, zatim abecedno), normalizirana XML serijalizacija (npr. dvostruki navodnici, prazni elementi kao samozatvarajuće oznake, reference znakova kao znakovi), svi retci uvučeni.',
  },
  reformatEncodingDone: { text: 'Kodiranje preformatirano putem XML parsera ({lines} redaka).' },
  reformatEncodingParseError: { text: 'Preformatiranje nije moguće: kodiranje nije dobro oblikovan XML.' },
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
  showMeiToolboxMenuText: { text: 'MEI alatnica' },
  facsimileTop: { text: 'Faksimil gore' },
  facsimileBottom: { text: 'Faksimil dole' },
  facsimileLeft: { text: 'Faksimil levo' },
  facsimileRight: { text: 'Faksimil desno' },
  meiToolboxTop: { text: 'MEI alatnica gore' },
  meiToolboxBottom: { text: 'MEI alatnica dolje' },
  meiToolboxLeft: { text: 'MEI alatnica lijevo' },
  meiToolboxRight: { text: 'MEI alatnica desno' },

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
  toggleDotsText: { text: 'Toggle dotting' }, // TODO: translate
  cleanAccidText: { text: 'Proveri @accid.ges' },
  meterConformanceText: { text: 'Proveri @metcon' },
  renumberMeasuresTestText: { text: ' Renumeriraj mere (test)' },
  renumberMeasuresExecText: { text: ' Renumeriraj mere (izvrši)' },
  convertAttributesToElementsText: {
    text: 'Pretvori atribute u elemente',
    description:
      'Pretvara atribute koji se mogu izraziti i kao elementi u te elemente, npr. @accid, @artic, @syl, @fermata, @tie, @slur, @gliss na notama i akordima, ili atribute ključa, predznaka i mjere na staffDef i scoreDef.',
  },
  convertAttributesToElementsSummary: { text: 'Atributi pretvoreni u {list}.' },
  convertAttributesToElementsNone: { text: 'Nisu pronađeni atributi koji se mogu pretvoriti u elemente.' },
  convertAttributesToElementsProblems: { text: '{count} atributa nije moguće pretvoriti.' },
  // CHECKER PANEL
  meiToolboxTabCheck: {
    text: 'Provjera',
    description:
      'Provjerava u kodiranju gestualne predznake (@accid.ges), trajanja taktova (@metcon) i veze između elemenata (@startid, @endid, @plist, …). Navodi svaki pronađeni problem, s ispravkom gdje je to moguće.',
  },
  meiToolboxTabConvert: {
    text: 'Pretvaranje',
    description:
      'Pretvara odabrane atribute u ekvivalentne elemente (npr. @accid u <accid>) ili elemente natrag u atribute, ako se pritom ne gubi nikakva informacija.',
  },
  meiToolboxTabRenumber: {
    text: 'Renumeriranje',
    description:
      'Uzastopno renumerira taktove (@n), s podesivim sufiksima za taktove koji nastavljaju prethodni i za taktove u završecima (voltama).',
  },
  meiToolboxCheckButton: { text: 'Provjeri' },
  meiToolboxTestButton: { text: 'Testiraj', description: 'Prikaži što bi bilo promijenjeno, bez mijenjanja kodiranja' },
  meiToolboxRenumberButton: { text: 'Renumeriraj' },
  meiToolboxAttrToElButton: { text: 'Atributi → elementi' },
  meiToolboxElToAttrButton: { text: 'Elementi → atributi', description: 'Pretvara elemente u atribute kada se ne gubi nikakva informacija; ostali elementi se zadržavaju i navode.' },
  meiToolboxAll: { text: 'sve' },
  meiToolboxNone: { text: 'ništa' },
  meiToolboxFilter: { text: 'Filtriraj rezultate' },
  meiToolboxRunAgain: { text: 'Pokreni ponovno' },
  meiToolboxHideOptions: { text: 'Sakrij opcije' },
  meiToolboxOutdated: { text: '(kodiranje je u međuvremenu promijenjeno, rezultati su možda zastarjeli)' },
  meiToolboxNoResults: { text: 'Još nema rezultata. Odaberite opcije i pokrenite.' },
  meiToolboxGroupsSelected: { text: '{n} od {total} grupa atributa' },
  meiToolboxCheckAccidGes: { text: 'Predznaci (@accid.ges)' },
  meiToolboxCheckMetcon: { text: 'Trajanja taktova (@metcon)' },
  meiToolboxCheckLinked: { text: 'Povezani elementi (@startid, @endid, @plist, …)' },
  meiToolboxClose: { text: 'Zatvori MEI alatnicu' },
  meiToolboxTabIds: {
    text: 'Id-ovi',
    description:
      'Dodaje xml:id elementima koji ga nemaju, daje svakom elementu novi ili ih uklanja, osim onih na koje se upućuje. Reference unutar kodiranja se ažuriraju.',
  },
  meiToolboxTabFacsimile: {
    text: 'Faksimil',
    description:
      'Povezuje kodiranje sa slikama stranica: preuzima faksimil iz druge datoteke ili dodaje nedostajuće surfaces, po jedan za svaki prijelom stranice.',
  },
  meiToolboxTabReformat: {
    text: 'Preoblikuj',
    description:
      'Ispisuje cijelo kodiranje iznova, putem Verovija ili XML parsera, i određuje redoslijed atributa koji mei-friend koristi pri ponovnom zapisivanju elemenata.',
  },
  meiToolboxIdsAdd: { text: 'Dodaj xml:id (elementima bez njega)' },
  meiToolboxIdsChange: {
    text: 'Promijeni xml:id (novi za svaki element)',
    description: 'Dodjeljuje novi xml:id svakom elementu. Reference unutar ovog kodiranja se ažuriraju, ali poveznice iz drugih datoteka, anotacija, alata za faksimil ili URL-ova koje pokazuju na stare xml:id-ove više neće raditi.',
  },
  meiToolboxIdsRemove: { text: 'Ukloni xml:id (osim onih na koje se upućuje)' },
  meiToolboxIdsButton: { text: 'Primijeni' },
  meiToolboxIdsAdded: { text: '{n} dodano' },
  meiToolboxIdsChanged: { text: '{n} promijenjeno' },
  meiToolboxIdsRemoved: { text: '{n} uklonjeno' },
  meiToolboxIdsKept: { text: '{n} zadržano' },
  meiToolboxIdsReferences: { text: '{n} referenci ažurirano' },
  meiToolboxIdsKeptReason: { text: 'na njega se upućuje unutar kodiranja' },
  meiToolboxIdsNothing: { text: 'Nema što raditi: nijedan xml:id nije dodan, promijenjen ni uklonjen.' },
  meiToolboxIdsCancelled: { text: 'Otkazano, kodiranje je nepromijenjeno.' },
  meiToolboxFacsimileInfo: {
    text: 'Povežite kodiranje sa slikama stranica: uvezite faksimil iz druge datoteke ili dodajte površine koje još nedostaju, po jednu za svaki prijelom stranice.',
  },
  meiToolboxFacsimileIngest: { text: 'Uvezi faksimil…' },
  meiToolboxFacsimileAddMissing: {
    text: 'Dodaj površine koje nedostaju',
    description: 'Dodaje ono što nedostaje: faksimil ako ga nema, površinu s rezerviranim grafikom za svaku stranicu koja je još nema, i pb@facs koji na nju upućuje. Stranice se povezuju s već postojećim površinama, koje ostaju nepromijenjene.',
  },
  meiToolboxFacsimileAdded: { text: 'Dodano površina: {n}' },
  meiToolboxFacsimileLinked: { text: 'Stranica povezanih s već postojećom površinom: {n}' },
  meiToolboxFacsimileCreated: { text: 'Faksimil dodan.' },
  meiToolboxFacsimileUpToDate: { text: 'Svaka stranica već ima svoju površinu; ništa nije dodano.' },
  meiToolboxFacsimileZones: { text: '{n} zona' },
  meiToolboxFacsimileSummary: { text: '{surfaces} površina, {zones} zona' },
  meiToolboxFacsimileNone: { text: 'Ovo kodiranje nema faksimil.' },
  meiToolboxReformatVerovio: {
    text: 'Preko Verovija',
    description: 'Pušta Verovio da iznova ispiše kodiranje iz vlastitog prikaza.',
  },
  meiToolboxReformatVerovioNote: {
    text: 'Verovio ispisuje kodiranje iz vlastitog prikaza, u vlastitom oblikovanju i redoslijedu atributa.',
  },
  meiToolboxReformatXml: {
    text: 'Preko XML parsera',
    description: 'Preoblikuje kodiranje kroz XML parser: sadržaj ostaje isti, mijenjaju se samo oblikovanje i redoslijed atributa. Isto kao Kôd → Preoblikuj preko XML parsera.',
  },
  meiToolboxReformatUnchanged: { text: 'Kodiranje je nepromijenjeno.' },
  meiToolboxReformatDone: { text: '{lines} redaka' },
  meiToolboxAttributeOrder: {
    text: 'Redoslijed atributa',
    description: 'Redoslijed kojim se atributi ispisuju kad god mei-friend zapiše element natrag.',
    labels: ['kako je kodirano', 'abecedno', 'prvo xml:id, zatim abecedno', 'prilagođeno…'],
  },
  meiToolboxAttributeOrderPattern: {
    text: 'Uzorak redoslijeda',
    description: 'Imena atributa odvojena razmacima ili zarezima, redoslijedom kojim ih želite, npr. „xml:id n label *”. Ime koje završava s * odgovara svim atributima s tim prefiksom (clef.*). Jedan * označava sve neimenovane atribute, abecedno; bez njega zadržavaju svoj redoslijed na kraju. Deklaracije imenskih prostora uvijek dolaze prve.',
  },
  codeCheckerFixShown: { text: 'Popravi {n} prikazanih' },
  codeCheckerIgnoreShown: { text: 'Zanemari {n} prikazanih' },
  convertGroupAccid: { text: 'Pisani predznaci (@accid)' },
  convertGroupAccidGes: { text: 'Zvučni predznaci (@accid.ges)' },
  convertGroupArtic: { text: 'Artikulacije (@artic, @artic.ges)' },
  convertGroupSyl: { text: 'Tekst (@syl)' },
  convertGroupFermata: { text: 'Fermate (@fermata)' },
  convertGroupTie: { text: 'Ligature (@tie)' },
  convertGroupSlur: { text: 'Lukovi (@slur)' },
  convertGroupGliss: { text: 'Glisanda (@gliss)' },
  convertGroupDefinitions: { text: 'Ključ, predznaci, mjera, menzura (staffDef, scoreDef)' },
  convertGroupLabels: { text: 'Simboli grupa i oznake (staffGrp, staffDef)' },
  convertAttributesToElementsTestSummary: { text: 'Atributi bi bili pretvoreni u {list}.' },
  convertElementsToAttributesSummary: { text: 'Elementi pretvoreni u atribute: {list}.' },
  convertElementsToAttributesTestSummary: { text: 'Elementi bi bili pretvoreni u atribute: {list}.' },
  convertElementsToAttributesProblems: { text: '{count} elemenata nije moguće pretvoriti.' },
  convertElementsToAttributesNone: { text: 'Nisu pronađeni elementi koji se mogu pretvoriti u atribute.' },
  elementsToAttributesConfirmation: { text: '<b>Elementi → atributi</b>\n\nPozor: ova operacija može prekinuti vanjske poveznice.\n\n{count} elemenata koji se pretvaraju ima xml:id, koji se uklanja zajedno s elementom. Elementi na koje se upućuje unutar ove datoteke ne pretvaraju se.\n\nPoveznice iz drugih datoteka, anotacije pohranjene izvan ove datoteke, alati za faksimile ili URL-ovi koji upućuju na ove xml:id-ove više neće raditi.' },
  elementsToAttributesProceed: { text: 'Pretvori' },
  elementsToAttributesCancel: { text: 'Odustani' },
  convertScopeAll: { text: 'Opseg: cijelo kodiranje (označite tekst u uređivaču da ograničite pretvaranje)' },
  convertScopeSelection: { text: 'Opseg: odabir, retci {from}–{to}' },
  convertSelectionSuffix: { text: 'odabir' },
  renumberMeasuresStartNumber: {
    text: 'Početni broj',
    description:
      'Broj prvog potpunog takta; svi sljedeći taktovi numeriraju se od njega. Nepotpun prvi takt (@metcon="false", npr. predtakt) dobiva broj manje, pa uz početni broj 1 dobiva 0 (osim ako je uključeno ‘Nastavi preko nepotpunih taktova’).',
  },
  renumberMeasuresRestartAtMdiv: {
    text: 'Počni ispočetka kod svakog mdiv',
    description:
      'Numeriranje počinje ispočetka od početnog broja kod svakog mdiv (stavka), umjesto da se nastavlja kroz cijelo kodiranje.',
  },
  renumberMeasuresUnchanged: { text: 'nepromijenjeno' },
  renumberMeasuresSummary: { text: '{total} taktova, {changed} renumerirano.' },
  renumberMeasuresSummaryTest: { text: '{total} taktova, {changed} bi bilo renumerirano.' },
  renumberMeasuresNoMeasures: { text: 'Nisu pronađeni taktovi.' },
  addIdsText: { text: 'Dodaj ID-ove MEI' },
  removeIdsText: { text: 'Ukloni ID-ove iz MEI' },
  changeIdsText: {
    text: 'Promijeni ID-ove u MEI (prekida vanjske poveznice)',
    description:
      'Dodjeljuje novi xml:id svakom elementu (ili odabranim elementima). Reference unutar ove datoteke se ažuriraju, ali poveznice iz drugih datoteka, anotacija, alata za faksimile ili URL-ova koje upućuju na stare xml:id-ove više neće raditi.',
  },
  changeIdsConfirmation: {
    text: '<b>Promijeni ID-ove u MEI</b>\n\nPažnja: ova operacija prekida vanjske poveznice.\n\nBit će promijenjeno {changed} xml:id-ova i dodano {added} novih xml:id-ova; bit će ažurirano {references} referenci unutar ove datoteke.\n\nPoveznice iz drugih datoteka, anotacija, alata za faksimile ili URL-ova koje upućuju na stare xml:id-ove više neće raditi.',
  },
  changeIdsProceed: { text: 'Promijeni ID-ove' },
  changeIdsCancel: { text: 'Odustani' },
  reRenderMeiVerovio: { text: ' Ponovo renderuj putem Verovio' },
  addFacsimile: { text: 'Dodaj element faksimila' },
  ingestFacsimileText: { text: 'Unesi faksimil' },
  ingestFacsimileTitle: { text: 'Unos faksimila' },
  ingestFacsimileProgress: { text: '{file}: obrađeno {done} od {total} zona.' },
  ingestFacsimileDoneTitle: { text: 'Faksimil unesen' },
  ingestFacsimileStoppedTitle: { text: 'Unos faksimila prekinut' },
  ingestFacsimileSummary: {
    text: 'Faksimil iz {file} s {surfaces} površina (surface) i {zones} zona umetnut prije body; atributi @facs dodani u {added} elemenata.',
  },
  ingestFacsimileStopped: {
    text: 'Prekinuto nakon {done} od {total} zona. Dosadašnje promjene mogu se poništiti u jednom koraku.',
  },
  ingestFacsimileProblems: { text: 'Pojavilo se {count} problema:' },
  ingestFacsimileNotFound: { text: '{type} s n="{n}" nije pronađen.' },
  ingestFacsimileNotUnique: { text: '{type} s n="{n}" nije jedinstven.' },
  ingestFacsimileNoId: { text: '{type} s n="{n}" nema xml:id, @facs nije dodan.' },
  ingestFacsimileNotInEditor: { text: '{type} s n="{n}" nije pronađen u uređivaču, @facs nije dodan.' },
  ingestFacsimileNoFacsimile: { text: 'Unos faksimila nije uspio: u {file} nije pronađen element facsimile.' },
  ingestFacsimileNoBody: { text: 'Unos faksimila nije uspio: u kodiranju nije pronađen element body.' },
  ingestFacsimileNoBodyInEditor: { text: 'Element body nije pronađen u uređivaču, element facsimile nije umetnut.' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Umetni' },
  addNoteText: { text: 'Add note' }, // TODO: translate
  convertNoteToRestText: { text: 'Note(s) <=> rest(s)' }, // TODO: translate
  toggleChordText: { text: 'Note(s) <=> chord' }, // TODO: translate
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
      'Hosted by <a href="https://iwk.mdw.ac.at" target="_blank">IWK</a> ' +
      'at <a href="https://mdw.ac.at" target="_blank">mdw</a>, with ' +
      heart +
      ' from Vienna. ' +
      '<a href="https://iwk.mdw.ac.at/impressum" target="_blank">Impresum</a>.',
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
  githubActionStatusMsgWaiting: { text: 'Molimo vas da budete strpljivi dok GitHub obradi vaš tok...' },
  githubActionStatusMsgFailure: { text: 'Tok se nije mogao izvršiti - GitHub status' },
  githubActionsRunCompletedMsg: { text: 'Izvršavanje tijeka rada završeno:' },
  githubActionsRunFailedMsg: { text: 'Nije moguće završiti izvršavanje tijeka rada:' },
  githubActionsGitHubStatusLink: { text: 'GitHub status' },
  githubActionsRunButton: { text: 'Pokreni tok' },
  githubActionsSupplyWorkpackageDefinition: { text: 'Dostavite definiciju radnog paketa' },
  githubActionsRequiresWorkpackageDefinition: {
    text: 'Ova GitHub Action zahtijeva definiciju radnog paketa. Molimo dostavite jednu (URL JSON objekta definicije) u postavkama mei-frienda.',
  },
  githubActionsRunButtonReload: { text: 'Učitaj MEI fajl ponovo' },
  githubActionsCancelButton: { text: 'Otkaži' },
  githubActionsInputSetterFilepath: { text: 'Kopiraj trenutnu putanju fajla u unos' },
  githubActionsInputSetterSelection: { text: 'Kopiraj trenutnu MEI selekciju u unos' },
  githubActionsNoSummaryProvided: {
    text: 'Nije dostavljen sažetak. Pogledajte gornju GitHub statusnu poveznicu za detalje.',
  },
  githubActionsWaitingOpenLink: { text: 'Prati status tijeka rada na GitHubu' },
  githubActionsDisabledTooltip: {
    text: 'Otvorite kodiranje iz ovog repozitorija kako biste pokrenuli GitHub Actions tijekove rada.',
  },
  githubActionsDisabledDirtyTooltip: {
    text: 'Commitajte lokalne promjene kako biste pokrenuli GitHub Actions tijekove rada.',
  },
  githubActionsWorkpackageConfigInvalidResponse: {
    text: 'Navedena JSON konfiguracijska datoteka nije u skladu s očekivanom shemom. Molimo provjerite dokumentaciju za detalje.',
  },
  titleGithubActions: {
    text: 'Koristi GitHub Actions',
    description: 'Radite s GitHub Actions kada su dostupne u repozitoriju',
  },
  enableGithubActions: {
    text: 'Prikaži dostupne GitHub Actions',
    description: 'Prikaži dostupne GitHub Actions pri navigaciji unutar repozitorija u GitHub izborniku',
  },
  supplyWorkpackageGithubActionsConfiguration: {
    text: 'Definicija radnog paketa',
    description: 'Koristite datoteku definicije radnog paketa za GitHub Actions',
  },

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
      'Aktivan je režim brzine; reprodukcija MIDI-ja je moguća samo za trenutnu stranicu. Da biste reprodukovali cijeli zapis, odznačite ovaj okvir.',
  },
  midiExpansionSelectorTitle: {
    text: 'Odaberi element ekspanzije za MIDI reprodukciju',
  },
  midiExpansionSelectorDisabledTitle: {
    text: 'Onemogućeno u režimu brzine (prikazuje se samo trenutna stranica).',
  },
  noExpansionOption: {
    text: 'Bez ekspanzije',
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
  notationControlMenuOverflowIcon: {
    description: 'Prikaži dodatna kontrolna dugmad',
  },

  facsimileControlMenuOverflowIcon: {
    description: 'Prikaži dodatna kontrolna dugmad',
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
  showFacsimileTitles: {
    text: 'Show facsimile titles', // TODO: translate
    description: 'Show facsimile titles above source images', // TODO: translate
  },
  titleMeiToolbox: { text: 'MEI alatnica', description: 'Provjere i izmjene kodiranja, u ploči pored uređivača' },
  showMeiToolbox: {
    text: 'Prikaži MEI alatnicu',
    description: 'Prikaži MEI alatnicu s karticama Provjeri, Pretvori, Prenumeriraj, Id-ovi, Faksimil i Ponovno iscrtaj',
  },
  selectMeiToolboxOrientation: {
    text: 'Položaj MEI alatnice',
    description: 'Odaberite položaj MEI alatnice u odnosu na uređivač',
    labels: ['lijevo', 'desno', 'gore', 'dolje'],
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
  showLinkedElements: {
    text: 'Prikaži povezane elemente',
    description: 'Istakni elemente na koje upućuje odabrani element (npr. startid/endid/plist) u uređivaču i notaciji',
  },
  showTrailingSpace: {
    text: 'Ističi prazna mesta na kraju',
    description: 'Ističe nepotrebna prazna mesta na kraju linija',
  },
  keyMap: {
    text: 'Mapa tastera',
    description: 'Izaberi mapu tastera',
  },
  persistentSearch: {
    text: 'Tražilica koja ostaje otvorena',
    description:
      'Koristi ponašanje tražilice koja ostaje otvorena (tražilica ostaje otvorena sve dok se eksplicitno ne zatvori)',
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
  // Let's Encode! campaign mode (see lib/lets-encode.js)
  splashLetsEncode: {
    html:
      "<p>Došli ste s <strong>Let's\u00a0Encode!</strong> kako biste radili na zadatku kodiranja. mei-friend jedan je od uređivača koje „Let's\u00a0Encode!“ nudi za ovaj rad. Upotrijebite <strong>Spremi</strong> u izborniku <strong>Upravljanje zadatkom</strong> (gore lijevo) kako biste usput spremali svoj napredak, a <strong>Završi zadatak</strong> kada završite, kako biste dali svoj doprinos kampanji.</p>",
  },
  letsEncodeCompleteTaskButton: { text: 'Završi zadatak' },
  letsEncodeMenuLabel: { text: 'Upravljanje zadatkom' },
  letsEncodeLoggedInAs: { text: 'Prijavljeni ste kao' },
  letsEncodeSaveButton: { text: 'Spremi' },
  letsEncodeSaving: { text: 'Vaš se rad sprema…' },
  letsEncodeSaveFailed: { text: 'Vaš rad nije bilo moguće spremiti.' },
  letsEncodeDismiss: { value: 'Zatvori' },
  letsEncodeLastSave: { text: 'Posljednje spremanje:' },
  letsEncodeLastAutosave: { text: 'Automatski spremljeno:' },
  letsEncodeSavedAt: { text: 'Spremljeno' },
  letsEncodeExpiresAt: { text: 'Istječe' },
  letsEncodeTimeRemaining: { text: 'preostalo za završetak zadatka' },
  letsEncodeHoursShort: { text: 'h' },
  letsEncodeMinutesShort: { text: 'min' },
  letsEncodeDaysShort: { text: 'd' },
  letsEncodeAgo: { text: 'prije {n}' },
  letsEncodeJustNow: { text: 'upravo sada' },
  letsEncodeTimeExpired: { text: 'Vrijeme za završetak ovog zadatka je isteklo' },
  letsEncodeAutosaveMinutes: {
    title: 'Interval automatskog spremanja (minute)',
    description:
      'Koliko se često vaš rad automatski sprema dok uređujete, u minutama. Sprema se samo ako ste nešto izmijenili; 0 isključuje automatsko spremanje.',
  },
  titleLetsEncode: { title: 'Let\'s\u00a0Encode!', description: "Postavke zadatka „Let's\u00a0Encode!“ na kojem radite" },
  letsEncodeAbandonTaskButton: { text: 'Odustani od zadatka' },
  letsEncodeKeepWorking: { value: 'Nastavi s radom' },
  letsEncodeCompleteAnyway: { value: 'Ipak završi zadatak' },
  letsEncodeAbandonConfirm: { value: 'Odustani od zadatka' },
  letsEncodeNoChangesPrompt: {
    text:
      'Niste mijenjali ovo kodiranje. I to se računa: završetkom zadatka bilježi se da izmjene nisu bile potrebne. Možete i nastaviti s radom.',
  },
  letsEncodeConfirmCompletePrompt: {
    text:
      "Želite li završiti ovaj zadatak? Vaš će rad biti spremljen i proslijeđen platformi „Let's\u00a0Encode!“, a zadatak će biti zatvoren.",
  },
  letsEncodeAbandonPrompt: {
    text:
      "Odustati od ovog zadatka? Vaš će rad na njemu biti izgubljen, uključujući ono što ste već spremili, a platforma „Let's\u00a0Encode!“ bit će obaviještena da niste završili zadatak.",
  },
  letsEncodeLoading: { text: "Učitavanje vašeg zadatka s platforme „Let's\u00a0Encode!“…" },
  letsEncodeLogoLinkTitle: {
    text: "Otvorite svoju kampanju „Let's\u00a0Encode!“ u novoj kartici (vaš zadatak ostaje ovdje otvoren)",
  },
  letsEncodeDragOverlayText: { text: "Druge datoteke ne mogu se otvoriti tijekom zadatka „Let's\u00a0Encode!“." },
  letsEncodeCommitting: { text: 'Završavanje vašeg zadatka…' },
  letsEncodeCompleted: { text: "Zadatak je završen — vraćamo vas na „Let's\u00a0Encode!“…" },
  letsEncodeCommitFailed: { text: 'Vaš zadatak nije bilo moguće završiti.' },
  letsEncodeRetryButton: { value: 'Pokušaj ponovno' },
  letsEncodeAbandonButton: { value: "Povratak na „Let's\u00a0Encode!“" },
  letsEncodeNoCampaignError: {
    text:
      "Ova poveznica „Let's\u00a0Encode!“ nije potpuna: ne navodi nijednu kampanju, pa nema kamo prijaviti rezultat. Vratite se na „Let's\u00a0Encode!“ i ponovno otvorite zadatak.",
  },
  letsEncodeMissingParameterError: { text: "Pri predaji s platforme „Let's\u00a0Encode!“ nedostajao je obvezan parametar:" },
  letsEncodeFileError: { text: 'Predanu datoteku nije bilo moguće otvoriti na GitHubu.' },
  letsEncodeCloneError: { text: 'Vaš zadatak nije bilo moguće učitati s GitHuba.' },
  letsEncodeRemoteChangedError: {
    text: 'Datoteka je izmijenjena na GitHubu dok ste radili, pa vaš rad nije bilo moguće spremiti.',
  },
  commitLog: { text: 'Zapis komita' },
  githubDate: { text: 'Datum' },
  githubAuthor: { text: 'Autor' },
  githubMessage: { text: 'Poruka' },
  none: { text: 'Ništa' },
  commitFileNameText: { text: 'Ime fajla' },
  forkRepository: { text: 'Forkuj repozitorijum' },
  forkError: { text: 'Izvinjavamo se, nije moguće forkovanje repozitorijuma' },
  forkBranchMissingError: {
    text: 'Izvinjavamo se, vaš postojeći fork ne sadrži traženu granu i nije je bilo moguće tamo kreirati. Molimo ažurirajte ili izbrišite svoj fork i pokušajte ponovo. Grana',
  },
  loadingFile: { text: 'Učitavanje fajla' },
  loadFileError: { text: 'Izvinjavamo se, nije moguće pročitati fajl iz repozitorijuma' },
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

  // Code checker @accid.ges
  accidGesCodeCheckerTitle: {
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
