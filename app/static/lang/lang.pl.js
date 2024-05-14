/**
 * Language file for Polish
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Ekran powitalny
  aboutMeiFriend: { text: 'O mei-friend' },
  showSplashScreen: {
    text: 'Pokaż ekran powitalny przy ładowaniu',
    description: 'Pokaż ekran powitalny mei-friend podczas ładowania aplikacji',
  },
  splashBody: {
    html: `
      <p>
        mei-friend to edytor dla <a href="https://music-encoding.org">kodowań muzycznych</a>, hostowany na
        <a href="https://mdw.ac.at" target="_blank">Uniwersytecie Muzycznym i Sztuk Widowiskowych w Wiedniu</a>. 
        Prosimy o zapoznanie się z naszą <a href="https://mei-friend.github.io" target="_blank">rozszerzoną dokumentacją</a> 
        dla dalszych informacji.
      </p>
      <p>
        Chociaż mei-friend to aplikacja oparta na przeglądarkę, Twoje dane osobowe (w tym kodowanie, które edytujesz, ustawienia
        aplikacji i aktualne dane logowania, jeśli takie istnieją) są przechowywane w przeglądarce w
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"
          >lokalnym magazynie</a
        > przeglądarki i nie są przesyłane ani przechowywane na naszych serwerach.
      </p>
      <p>
        Dane są przesyłane do GitHuba tylko wtedy, gdy wyraźnie o to poprosisz (np. gdy się zalogujesz do GitHuba, załadujesz
        kodowanie z repozytorium GitHuba lub poprosisz o uruchomienie workflow GitHub Action). Podobnie dane są przesyłane do
        wybranego dostawcy Solid tylko wtedy, gdy wyraźnie o to poprosisz (np. gdy się zalogujesz do Solid, załadujesz lub
        zapiszesz adnotacje stand-off).
      </p>
      <p>
        Używamy <a href="https://matomo.org/" target="_blank">Matomo</a>
        do zbierania anonimowych statystyk użytkowania. Obejmuje to skrócony adres IP (umożliwiający geolokalizację na poziomie
        kraju, ale bez dalszej identyfikacji), przeglądarkę i system operacyjny, skąd przyszliście (czyli witrynę, z której
        przyszliście), czas i czas trwania wizyty oraz odwiedzone strony. Te informacje są przechowywane na instancji Matomo
        działającej na serwerach Uniwersytetu Muzycznego i Sztuk Widowiskowych w Wiedniu i nie są udostępniane żadnej trzeciej
        stronie.
      </p>
      <p>
        Tabulatury lutniowe są konwertowane do MEI przy użyciu 
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a> opracowanego przez Paula Overella, 
        za pośrednictwem usługi <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui</a> 
        opracowanej przez Stefana Szepe i <a href="https://luteconv.mdw.ac.at" target="_blank">hostowanej przez mdw</a>. 
        Ta usługa tworzy dostępne w sieci kopie twoich kodowań jako część procesu konwersji, 
        ale są one dostępne tylko za pośrednictwem unikalnej wartości hasha linku i są okresowo usuwane.
      </p>
      <p>
        Zestaw narzędzi Verovio jest ładowany z <a href="https://verovio.org" target="_blank">https://verovio.org</a>, 
        hostowany przez <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
        Dzięki temu mei-friend może być zawsze aktualny z najnowszą wersją narzędzi
        i umożliwia wybór wszystkich obsługiwanych wersji za pomocą panelu ustawień. 
        Korzystając z mei-friend, twój adres IP jest widoczny przez RISM Digital.
      </p>
      <p>
        Wreszcie, odtwarzanie MIDI jest prezentowane za pomocą fontu dźwiękowego SGM_plus dostarczanego przez Google Magenta
        i obsługiwanego za pomocą googleapis.com. Twój adres IP jest widoczny dla Google podczas uruchamiania odtwarzania MIDI.
        Jeśli nie chcesz, aby to się zdarzyło, prosimy o powstrzymanie się od korzystania z funkcji odtwarzania MIDI.
      </p>
      <p>
        mei-friend został opracowany przez
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Wernera Goebla</a> i
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">Davida M. Weigla</a> w Katedrze Akustyki Muzycznej -
        Wiener Klangstil na Uniwersytecie Muzycznym i Sztuk Widowiskowych w Wiedniu i jest licencjonowany na
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
          >licencji GNU Affero General Public License v3.0</a
        >. Proszę o konsultację naszej <a href="https://mei-friend.github.io/about/" target="_blank">strony podziękowań</a>
        dla dalszych informacji o współtwórcach i komponentach open source używanych w naszym projekcie. Dziękujemy naszym
        kolegom za ich wkład i wsparcie.
      </p>
      <p>
        Rozwój aplikacji internetowej mei-friend jest finansowany przez
        <a href="https://fwf.ac.at" target="_blank">Austriacki Fundusz Nauki (FWF)</a> w ramach projektów
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
          >P 34664-G (Signature Sound Vienna)</a
        >
        i <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
      </p>
    `,
  },
  splashGotItButtonText: { text: 'Rozumiem!' },
  splashVersionText: { text: 'Wersja' },
  splashAlwaysShow: {
    text: 'Zawsze wyświetl ten ekran powitalny',
    description: 'Zawsze wyświetl ten ekran powitalny podczas ładowania aplikacji',
  },
  splashAlwaysShowLabel: {
    text: 'Zawsze wyświetl ten ekran powitalny',
    description: 'Zawsze wyświetl ten ekran powitalny podczas ładowania aplikacji',
  },

  // Main menu bar
  githubLoginLink: { text: 'Zaloguj się' },

  month: {
    jan: 'Styczeń',
    feb: 'Luty',
    mar: 'Marzec',
    apr: 'Kwiecień',
    may: 'Maj',
    jun: 'Czerwiec',
    jul: 'Lipiec',
    aug: 'Sierpień',
    sep: 'Wrzesień',
    oct: 'Październik',
    nov: 'Listopad',
    dec: 'Grudzień',
  },

  // ELEMENT MENU ITEM
  fileMenuTitle: { text: 'Plik' },
  openMeiText: { text: 'Otwórz plik' },
  openUrlText: { text: 'Otwórz URL' },
  openExample: {
    text: 'Repozytorium publiczne',
    description: 'Otwórz listę repertuaru dostępnego w domenie publicznej',
  },
  importMusicXml: { text: 'Importuj MusicXML' },
  importHumdrum: { text: 'Importuj Humdrum' },
  importPae: { text: 'Importuj PAE, ABC' },
  saveMeiText: { text: 'Zapisz MEI' },
  saveMeiBasicText: { text: 'Zapisz jako MEI Basic' },
  saveSvg: { text: 'Zapisz SVG' },
  saveMidi: { text: 'Zapisz MIDI' },
  printPreviewText: { text: 'Podgląd PDF' },
  generateUrlText: { text: 'Generuj URL mei-friend' },

  // EDIT/CODE MENU ITEM // EDYCJA/KOD ELEMENTU MENU
  editMenuTitle: { text: 'Kod' },
  undoMenuText: { text: 'Cofnij' },
  redoMenuText: { text: 'Ponów' },
  startSearchText: { text: 'Szukaj' },
  findNextText: { text: 'Znajdź następny' },
  findPreviousText: { text: 'Znajdź poprzedni' },
  replaceMenuText: { text: 'Zastąp' },
  replaceAllMenuText: { text: 'Zastąp wszystko' },
  indentSelectionText: { text: 'Wcięcie zaznaczenia' },
  surroundWithTagsText: { text: 'Obejmij znacznikami' },
  surroundWithLastTagText: { text: 'Obejmij ostatnim znacznikiem ' },
  jumpToLineText: { text: 'Skocz do wiersza' },
  toMatchingTagText: { text: 'Idź do pasującego znacznika' },
  manualValidateText: { text: 'Sprawdź poprawność' },

  // VIEW MENU ITEM // WIDOK ELEMENTU MENU
  viewMenuTitle: { text: 'Widok' },
  notationTop: { text: 'Notacja u góry' },
  notationBottom: { text: 'Notacja na dole' },
  notationLeft: { text: 'Notacja po lewej stronie' },
  notationRight: { text: 'Notacja po prawej stronie' },
  showSettingsMenuText: { text: 'Panel ustawień' },
  showAnnotationMenuText: { text: 'Panel adnotacji' },
  showFacsimileMenuText: { text: 'Panel faksymile' },
  showPlaybackControlsText: { text: 'Elementy sterowania odtwarzaniem' },
  facsimileTop: { text: 'Faksymile u góry' },
  facsimileBottom: { text: 'Faksymile na dole' },
  facsimileLeft: { text: 'Faksymile po lewej stronie' },
  facsimileRight: { text: 'Faksymile po prawej stronie' },

  // INSERT MENU ITEM // ELEMENT MENU ITEM
  manipulateMenuTitle: { text: 'Manipuluj' },
  invertPlacementText: { text: 'Odwróć umiejscowienie' },
  betweenPlacementText: { text: 'Pomiędzy umiejscowienie' },
  addVerticalGroupText: { text: 'Dodaj pionową grupę' },
  deleteText: { text: 'Usuń element' },
  pitchChromUpText: { text: 'Wyższa wysokość chromatyczna' },
  pitchChromDownText: { text: 'Niższa wysokość chromatyczna' },
  pitchUpDiatText: { text: 'Wyższa wysokość diatonicznie' },
  pitchDownDiatText: { text: 'Niższa wysokość diatonicznie' },
  pitchOctaveUpText: { text: 'Podnieś dźwięk o oktawę' },
  pitchOctaveDownText: { text: 'Obniż dźwięk o oktawę' },
  staffUpText: { text: 'Element 1 pięciolinii w górę' },
  staffDownText: { text: 'Element 1 pięciolinii w dół' },
  increaseDurText: { text: 'Zwiększ długość' },
  decreaseDurText: { text: 'Zmniejsz długość' },
  toggleDotsText: { text: 'Przełączanie kropkowania' },
  cleanAccidText: { text: 'Sprawdzić @accid.ges' },
  renumberMeasuresTestText: { text: 'Numeruj taktowania (test)' },
  renumberMeasuresExecText: { text: 'Numeruj taktowania (wykonaj)' },
  addIdsText: { text: 'Dodaj identyfikatory do MEI' },
  removeIdsText: { text: 'Usuń identyfikatory z MEI' },
  reRenderMeiVerovio: { text: 'Ponownie renderuj za pomocą Verovio' },
  addFacsimile: { text: 'Dodaj element faksymile' },
  ingestFacsimileText: { text: 'Zaimportuj faksymile' },

  // INSERT MENU ITEM // WSTAW ELEMENT MENU
  insertMenuTitle: { text: 'Wstaw' },
  addNoteText: { text: 'Dodaj nutę' },
  convertNoteToRestText: { text: 'Nuta(y) <=> pauza(y)' },
  toggleChordText: { text: 'Nuta(y) <=> akord' },
  addDoubleSharpText: { html: 'Podwójny krzyżyk &#119082;' },
  addSharpText: { html: 'Krzyżyk &#9839;' },
  addNaturalText: { html: 'Kasownik &#9838;' },
  addFlatText: { html: 'Bemol &#9837;' },
  addDoubleFlatText: { html: 'Podwójny bemol &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Dyrektywa' },
  addDynamicsText: { text: 'Dynamika' },
  addSlurText: { text: 'Legato' },
  addTieText: { text: 'Łącznik' },
  addCrescendoHairpinText: { text: 'Crescendo' },
  addDiminuendoHairpinText: { text: 'Diminuendo' },
  addBeamText: { text: 'Belka' },
  addBeamSpanText: { text: 'Rozciągnięcie belki' },
  addArpeggioText: { text: 'Arpeggio' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pedal w dół' },
  addPedalUpText: { text: 'Pedal w górę' },
  addTrillText: { text: 'Tryl' },
  addTurnText: { text: 'Turn' },
  addTurnLowerText: { text: 'Turn dolny' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Mordent górny' },
  addOctave8AboveText: { text: 'Oktawa (8va) w górę' },
  addOctave15AboveText: { text: 'Oktawa (15va) w górę' },
  addOctave8BelowText: { text: 'Oktawa (8va) w dół' },
  addOctave15BelowText: { text: 'Oktawa (15va) w dół' },
  addGClefChangeBeforeText: { text: 'Zmiana klucza g przed' },
  addGClefChangeAfterText: { text: 'Zmiana klucza g po' },
  addFClefChangeBeforeText: { text: 'Zmiana klucza f przed' },
  addFClefChangeAfterText: { text: 'Zmiana klucza f po' },
  addCClefChangeBeforeText: { text: 'Zmiana klucza c przed' },
  addCClefChangeAfterText: { text: 'Zmiana klucza c po' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Akcent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM // POMOC ELEMENT MENU
  helpMenuTitle: { text: 'Pomoc' },
  goToHelpPageText: { text: 'Strony pomocy mei-friend' },
  goToCheatSheet: { text: 'Ściągawka mei-friend' },
  showChangelog: { text: 'Pokaż dziennik zmian mei-friend' },
  goToGuidelines: { text: 'Pokaż Wytyczne MEI' },
  consultGuidelinesForElementText: { text: 'Sprawdź Wytyczne dla bieżącego elementu' },
  provideFeedback: { text: 'Daj opinię' },
  resetDefault: { text: 'Przywróć ustawienia domyślne' },

  // Panel icons // Ikony panelu
  showMidiPlaybackControlBarButton: { description: 'Przełącz pasek kontroli odtwarzania MIDI' },
  showFacsimileButton: { description: 'Przełącz panel faksymile' },
  showAnnotationsButton: { description: 'Przełącz panel adnotacji' },
  showSettingsButton: { description: 'Pokaż panel ustawień' },

  // Footer texts // Teksty stopki
  leftFooter: {
    html:
      'Hostowany przez <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'na <a href="https://mdw.ac.at">mdw</a>, z ' +
      heart +
      ' z Wiednia. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Oświadczenie</a>.',
  },
  loadingVerovio: { text: 'Wczytywanie Verovio' },
  verovioLoaded: { text: 'wczytany' },
  convertedToPdf: { text: 'przekonwertowany na PDF' },
  statusBarCompute: { text: 'Oblicz' },
  middleFooterPage: { text: 'strona' },
  middleFooterOf: { text: 'z' },
  middleFooterLoaded: { text: 'wczytane' },

  // Control meno // Menu kontrolne
  verovioIcon: {
    description: `Aktywność pracownika mei-friend:
  obrót zgodny z ruchem wskazówek zegara oznacza aktywność Verovio,
  obrót przeciwnie do ruchu wskazówek zegara oznacza aktywność pracownika`,
  },
  decreaseScaleButton: { description: 'Zmniejsz notację' },
  verovioZoom: { description: 'Skaluj rozmiar notacji' },
  increaseScaleButton: { description: 'Zwiększ notację' },
  pagination1: { html: 'Strona&nbsp;' },
  pagination3: { html: '&nbsp;z' },
  sectionSelect: { description: 'Nawiguj po zakodowanej strukturze sekcji/zakończeń' },
  firstPageButton: { description: 'Przejdź do pierwszej strony' },
  previousPageButton: { description: 'Przejdź do poprzedniej strony' },
  paginationLabel: { description: 'Nawigacja strony: kliknij, aby ręcznie wprowadzić numer strony do wyświetlenia' },
  nextPageButton: { description: 'Przejdź do następnej strony' },
  lastPageButton: { description: 'Przejdź do ostatniej strony' },
  flipCheckbox: { description: 'Automatycznie przewijaj stronę do pozycji kursora kodowania' },
  flipButton: { description: 'Ręcznie przewiń stronę do pozycji kursora kodowania' },
  breaksSelect: { description: 'Określ zachowanie podziałów systemów/stron notacji' },
  breaksSelectNone: { text: 'Brak' },
  breaksSelectAuto: { text: 'Automatycznie' },
  breaksSelectMeasure: { text: 'Takt' },
  breaksSelectLine: { text: 'System' },
  breaksSelectEncoded: { text: 'System i strona' },
  breaksSelectSmart: { text: 'Inteligentnie' },
  choiceSelect: { description: 'Wybierz wyświetlaną zawartość dla elementów wyboru' },
  choiceDefault: { text: '(domyślny wybór)' },
  noChoice: { text: '(brak dostępnych opcji)' },
  updateControlsLabel: {
    text: 'Aktualizuj',
    description: 'Zachowanie aktualizacji sterowania notacją po zmianach w kodowaniu',
  },
  liveUpdateCheckbox: { description: 'Automatycznie aktualizuj notację po zmianach w kodowaniu' },
  codeManualUpdateButton: { description: 'Aktualizuj notację ręcznie' },
  engravingFontSelect: { description: 'Wybierz czcionkę grawerowania' },
  backwardsButton: { description: 'Przejdź do lewej w notacji' },
  forwardsButton: { description: 'Przejdź do prawej w notacji' },
  upwardsButton: { description: 'Przejdź do góry w notacji' },
  downwardsButton: { description: 'Przejdź na dół w notacji' },
  speedLabel: {
    text: 'Tryb szybki',
    description:
      'W trybie szybkim do Verovio wysyłana jest tylko bieżąca strona, aby skrócić czas renderowania w przypadku dużych plików',
  },

  // PDF/print preview panel // Panel PDF/Podgląd wydruku
  pdfSaveButton: { text: 'Zapisz PDF', description: 'Zapisz jako PDF' },
  pdfCloseButton: { description: 'Zamknij widok wydruku' },
  pagesLegendLabel: { text: 'Zakres stron', singlePage: 'strona', multiplePages: 'Strony' },
  selectAllPagesLabel: { text: 'Wszystkie' },
  selectCurrentPageLabel: { text: 'Bieżąca strona' },
  selectFromLabel: { text: 'od:' },
  selectToLabel: { text: 'do:' },
  selectPageRangeLabel: { text: 'Zakres stron:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Tylko bieżąca strona jest renderowana do PDF, ponieważ aktywowany jest tryb szybki. ' +
      'Wyłącz tryb szybki, aby wybrać ze wszystkich stron.',
  },
  pdfPreviewNormalModeTitle: { text: 'Wybierz zakres stron do zapisania w PDF.' },

  // Facsimile panel // Panel faksymile
  facsimileIcon: { description: 'Panel faksymile' },
  facsimileDecreaseZoomButton: { description: 'Zmniejsz obraz notacji' },
  facsimileZoom: { description: 'Dostosuj rozmiar obrazu notacji' },
  facsimileIncreaseZoomButton: { description: 'Zwiększ obraz notacji' },
  facsimileFullPageLabel: { text: 'Pełna strona', description: 'Wyświetl pełną stronę obrazu faksymile' },
  facsimileFullPageCheckbox: { description: 'Wyświetl pełną stronę obrazu faksymile' },
  facsimileShowZonesLabel: { text: 'Pokaż obszary', description: 'Pokaż obszary faksymile' },
  facsimileShowZonesCheckbox: { description: 'Pokaż obszary faksymile' },
  facsimileEditZonesCheckbox: { description: 'Edytuj obszary faksymile' },
  facsimileEditZonesLabel: { text: 'Edytuj obszary', description: 'Edytuj obszary faksymile' },
  facsimileCloseButton: { description: 'Zamknij panel faksymile' },
  facsimileDefaultWarning: { text: 'Brak zawartości faksymile do wyświetlenia.' },
  facsimileNoSurfaceWarning: {
    text: 'Nie znaleziono elementu powierzchni dla tej strony.\n(Może brakować początkowego elementu pb.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Faksymile bez obszarów widoczne tylko w trybie pełnoekranowym.' },
  facsimileImgeNotLoadedWarning: { text: 'Nie można wczytać obrazu' },

  // Drag'n'drop // Przeciągnij i upuść
  dragOverlayText: { text: 'Przeciągnij swój plik wejściowy tutaj.' },

  // Public repertoire // Repertuar publiczny
  openUrlHeading: { text: 'Otwórz zakodowanie hostowane w sieci za pomocą adresu URL' },
  openUrlInstructions: {
    text:
      'Proszę wybierz spośród repertuaru publicznego lub wprowadź adres URL ' +
      'kodowania muzycznego hostowanego w sieci poniżej. Uwaga: Serwer hosta musi ' +
      'obsługiwać udostępnianie zasobów pomiędzy różnymi domenami (CORS).',
  },
  publicRepertoireSummary: { text: 'Repertuar publiczny' },
  sampleEncodingsComposerLabel: { text: 'Kompozytor:' },
  sampleEncodingsEncodingLabel: { text: 'Kodowanie:' },
  sampleEncodingsOptionLabel: { text: 'Wybierz kodowanie...' },
  openUrlButton: { text: 'Otwórz URL' },
  openUrlCancel: { text: 'Anuluj' },
  proposePublicRepertoire: {
    html:
      'Zapraszamy do zgłaszania propozycji na ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'dodanie do repertuaru publicznego' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Wybierz kodowanie...' },
  openUrlChooseComposerText: { text: 'Wybierz kompozytora...' },
  openUrlOpenEncodingByUrlText: { text: 'Otwórz zakodowanie hostowane w sieci za pomocą adresu URL' },

  // GitHub actions modal // Okno modalne akcji GitHub

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Zażądaj pracy akcji GitHub:' },
  githubActionsDescription: {
    text: 'Kliknij "Uruchom pracę" aby poprosić o wykonanie przez API GitHuba pracy akcji powyżej, używając konfiguracji wejściowej podanej poniżej. Twoje kodowanie zostanie przeładowane do jego najnowszej wersji po zakończeniu pracy akcji.',
  },
  githubActionStatusMsgPrompt: { text: 'Nie udało się uruchomić zadania - GitHub mówi' },
  githubActionStatusMsgWaiting: { text: 'Proszę być cierpliwym, GitHub przetwarza twoje zadanie...' },
  githubActionStatusMsgFailure: { text: 'Nie udało się uruchomić zadania - GitHub mówi' },
  githubActionStatusMsgSuccess: { text: 'Zadanie wykonane pomyślnie - GitHub mówi' },
  githubActionsRunButton: { text: 'Uruchom zadanie' },
  githubActionsRunButtonReload: { text: 'Przeładuj plik MEI' },
  githubActionsCancelButton: { text: 'Anuluj' },
  githubActionsInputSetterFilepath: { text: 'Kopiuj bieżącą ścieżkę pliku do wejścia' },
  githubActionsInputSetterSelection: { text: 'Kopiuj bieżący wybór MEI do wejścia' },
  githubActionsInputContainerHeader: { text: 'Konfiguracja wejścia' },

  // Fork modals // Okna modalne fork
  forkRepoGithubText: { text: 'Forkuj Repozytorium Github' },
  forkRepoGithubExplanation: {
    text: 'Łącze, które śledzisz, ' + 'utworzy GitHub fork następującego repozytorium do edycji w mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Czy to jest OK?' },
  forkRepositoryInstructions: {
    text:
      'Proszę wybierz spośród repertuaru publicznego lub wprowadź ' +
      'nazwę GitHub (użytkownika lub organizacji) oraz nazwę repozytorium Github-hostowanego poniżej. ' +
      'Twoje forkowane repozytorium stanie się dostępne w menu Github.',
  },
  forkRepositoryGithubText: { text: 'Forkuj Repozytorium Github' },
  forkRepertoireSummary: { text: 'Repertuar publiczny' },
  forkRepertoireComposerLabel: { text: 'Kompozytor:' },
  forkRepertoireOrganizationLabel: { text: 'Organizacja:' },
  forkRepertoireOrganizationOption: { text: 'Wybierz Organizację GitHub...' },
  forkRepertoireRepositoryLabel: { text: 'Repozytorium:' },
  forkRepertoireRepositoryOption: { text: 'Wybierz kodowanie...' },
  forkRepositoryInputName: { placeholder: 'Nazwa użytkownika GitHub lub organizacji' },
  forkRepositoryInputRepoOption: { text: 'Wybierz repozytorium' },
  forkRepositoryToSelectorText: { text: 'Forkuj do: ' },
  forkRepositoryButton: { text: 'Forkuj repozytorium' },
  forkRepositoryCancel: { text: 'Anuluj' },
  forkProposePublicRepertoire: {
    html:
      'Zapraszamy do zgłaszania propozycji na ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'dodanie do repertuaru publicznego' +
      '</a>.',
  },

  // CodeMirror editor // Edytor CodeMirror
  selectTagNameForEnclosure: { text: 'Obejmij nazwą tagu' },
  selectTagNameForEnclosureOkButton: { value: 'OK' },
  selectTagNameForEnclosureCancelButton: { value: 'Anuluj' },

  // Restore Solid session overlay // Nakładka przywracania sesji Solid
  solidExplanation: {
    description:
      'Solid to zdecentralizowana platforma do obsługi połączonych danych społecznościowych. Zaloguj się do Solid, aby tworzyć adnotacje typu stand-off za pomocą połączonych danych (RDF).',
  },
  solidProvider: { description: 'Proszę wybierz dostawcę tożsamości Solid (IdP) lub podaj własny.' },
  solidLoginBtn: { text: 'Zaloguj się' },
  solidOverlayCancel: {
    html: 'Przywracanie sesji Solid - naciśnij klawisz <span>Esc</span> lub kliknij tutaj, aby anulować',
  },
  solidWelcomeMsg: { text: 'Witaj, ' },
  solidLogout: { text: 'Wyloguj się' },
  solidLoggedOutWarning: {
    html: `Wylogowano z integracji mei-friend z Solid, ale przeglądarka jest nadal zalogowana w Solid!
    <a id="solidIdPLogoutLink" target="_blank">Kliknij tutaj, aby wylogować się z Solid</a>.`,
  },

  // Annotation panel // Panel adnotacji
  annotationCloseButtonText: { text: 'Zamknij panel adnotacji' },
  hideAnnotationPanelButton: { description: 'Zamknij panel adnotacji' },
  closeAnnotationPanelButton: { description: 'Zamknij panel adnotacji' },
  markupToolsButton: { description: 'Narzędzia znaczników' },
  annotationToolsButton: { description: 'Narzędzia adnotacji' },
  annotationListButton: { description: 'Lista adnotacji' },
  writeAnnotStandoffText: { text: 'Adnotacja sieci Web' },
  annotationToolsIdentifyTitle: { text: 'Identyfikuj' },
  annotationToolsIdentifySpan: { text: 'Identyfikuj obiekt muzyczny' },
  annotationToolsHighlightTitle: { text: 'Podświetl' },
  annotationToolsHighlightSpan: { text: 'Podświetl' },
  annotationToolsDescribeTitle: { text: 'Opisz' },
  annotationToolsDescribeSpan: { text: 'Opisz' },
  annotationToolsLinkTitle: { text: 'Link' },
  annotationToolsLinkSpan: { text: 'Link' },
  listAnnotations: { text: 'Brak dostępnych adnotacji.' },
  addWebAnnotation: { text: 'Wczytaj adnotację sieci Web' },
  loadWebAnnotationMessage: { text: 'Wprowadź adres URL adnotacji sieci Web lub kontenera adnotacji sieci Web' },
  loadWebAnnotationMessage1: { text: 'Nie udało się wczytać podanego adresu URL' },
  loadWebAnnotationMessage2: { text: 'spróbuj ponownie' },
  noAnnotationsToDisplay: { text: 'Brak dostępnych adnotacji do wyświetlenia' },
  flipPageToAnnotationText: { description: 'Przełącz stronę do tej adnotacji' },
  describeMarkup: { description: 'Opisz ten znacznik' },
  deleteMarkup: { description: 'Usuń ten znacznik' },
  deleteMarkupConfirmation: { text: 'Czy na pewno chcesz usunąć ten znacznik?' },
  deleteAnnotation: { description: 'Usuń tę adnotację' },
  deleteAnnotationConfirmation: { text: 'Czy na pewno chcesz usunąć tę adnotację?' },
  makeStandOffAnnotation: {
    description: 'Status stand-off (RDF)',
    descriptionSolid: 'Zapisz w Solid jako RDF',
    descriptionToLocal: 'Otwórz adnotację stand-off (RDF) w nowej karcie',
  },
  makeInlineAnnotation: {
    description: 'Kliknij, aby dodać adnotację w linii',
    descriptionCopy: 'Skopiuj xml:id <annot> do schowka',
  },
  pageAbbreviation: { text: 'str.' },
  elementsPlural: { text: 'elementy' },
  askForLinkUrl: { text: 'Wprowadź adres URL do linkowania' },
  drawLinkUrl: { text: 'Otwórz w nowej karcie' },
  askForDescription: { text: 'Wprowadź opis tekstowy do zastosowania' },
  maxNumberOfAnnotationAlert: {
    text1: 'Liczba elementów annot przekracza konfigurowalną "Maksymalną liczbę adnotacji"',
    text2: 'Nowe adnotacje nadal mogą być generowane i będą wyświetlane, jeśli jest ustawione "Pokaż adnotacje".',
  },
  annotationsOutsideScoreWarning: {
    text: 'Przepraszamy, aktualnie nie można zapisywać adnotacji umieszczonych poza elementem &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: 'Nie można zapisać adnotacji, ponieważ punkt kotwiczenia MEI nie zawiera xml:id.',
    text2:
      'Proszę przypisać identyfikatory, wybierając "Manipulate" -> "Rerenderuj MEI (z identyfikatorami)" i spróbuj ponownie.',
  },
  // MENU ZNACZNIKÓW
  respSelect: {
    text: 'Wybierz odpowiedzialność znacznika',
    description: 'Wybierz identyfikator odpowiedzialności',
  },
  selectionSelect: {
    text: 'Domyślne zaznaczenie dla znaczników',
    description: 'Wybierz, czy nowo utworzony znacznik powinien otaczać wybrane elementy, artykulacje lub znaki przygodne',
    labels: ['Wybrane elementy','Artykulacja', 'Przypadkowy'],
    valuesDescriptions: [
      'Dodaj znacznik do wybranych elementów.', 
      'Dodaj znacznik do artykulacji w zaznaczeniu.', 
      'Dodaj znacznik do przypadkowych elementów w zaznaczeniu.'
    ],
  },
  alternativeEncodingsGrp: {
    text: 'Alternatywne kodowania',
    description: 'Elementy znaczników zawierające wiele wersji.',
  },
  addChoiceText: {
    text: '<choice>',
    description: 'Grupuje wiele alternatywnych kodowań dla tego samego punktu w tekście.',
  },
  choiceSicCorr: { 
    description: 'Umieść wybór w znaczniku <sic> i dodaj <corr>.' 
},
  choiceCorrSic: { 
    description: 'Umieść wybór w znaczniku <corr> i dodaj <sic>.' 
},
  choiceOrigReg: { 
    description: 'Umieść wybór w znaczniku <orig> i dodaj <reg>.' 
  },
  choiceRegOrig: { 
    description: 'Umieść wybór w znaczniku <reg> i dodaj <orig>.' 
  },
  choiceContentTarget: {
    text: '(wybierz zawartość)',
    description: 'Najpierw wybierz zawartość dla tego elementu, najeżdżając na <choice>.',
  },
  addSubstText: {
    text: '<subst>',
    description:
      '(zastąpienie) - Grupuje elementy transkrypcyjne, gdy kombinacja ma być traktowana jako pojedyncza interwencja w tekście.',
  },
  substAddDel: { 
    description: 'Umieść wybór w znaczniku <add> i dodaj <del>.' 
  },
  substDelAdd: { 
    description: 'Umieść wybór w znaczniku <del> i dodaj <add>.' 
  },
  substContentTarget: {
    text: '(wybierz zawartość)',
    description: 'Najpierw wybierz zawartość dla tego elementu, najeżdżając na <subst>.',
  },
  editInterventionsGrp: {
    text: 'Interwencje redakcyjne',
    description: 'Elementy znaczników używane do kodowania interwencji redakcyjnych.',
  },
  addSuppliedText: {
    text: '<supplied>',
    description: 'Zawiera materiał dostarczony przez transkryptora lub redaktora z dowolnego powodu.',
  },
  addUnclearText: {
    text: '<unclear>',
    description:
      'Zawiera materiał, który nie może być transkrybowany z pewnością, ponieważ jest nieczytelny lub niesłyszalny w źródle.',
  },
  addSicText: {
    text: '<sic>',
    description: 'Zawiera materiał, który jest prawdopodobnie niepoprawny lub niedokładny.',
  },
  addCorrText: {
    text: '<corr>',
    description: '(poprawka) - Zawiera poprawną formę pozornie błędnego fragmentu.',
  },
  addOrigText: {
    text: '<orig>',
    description:
      '(oryginalny) - Zawiera materiał oznaczony jako zgodny z oryginałem, a nie jako znormalizowany lub poprawiony.',
  },
  addRegText: {
    text: '<reg>',
    description: '(normalizacja) - Zawiera materiał, który został znormalizowany lub zharmonizowany w pewnym sensie.',
  },
  descMarkupGrp: {
    text: 'Opisowy znacznik',
    description: 'Elementy znaczników używane do kodowania interwencji w materiał źródłowy.',
  },
  addAddText: { text: '<add>', description: '(dodanie) - Oznacza dodatek do tekstu.' },
  addDelText: {
    text: '<del>',
    description:
      '(usunięcie) - Zawiera informacje usunięte, oznaczone jako usunięte lub w inny sposób wskazane jako zbędne lub fałszywe w tekście źródłowym przez autora, skrybę, adnotatora lub poprawiacza.',
  },

  // MIDI // MIDI
  midiSpeedmodeIndicator: {
    text: 'Tryb szybki',
    description:
      'Tryb szybki jest aktywny; odtwarzanie MIDI odbywa się tylko dla bieżącej strony. Aby odtworzyć całe kodowanie, wyłącz tryb szybki.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Ukryj pasek kontrolny odtwarzania MIDI' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'Ustawienia mei-friend',
    description: 'Ustawienia mei-friend',
  },
  mfReset: {
    text: 'Domyślne',
    description: 'Przywróć domyślne ustawienia mei-friend',
  },
  filterSettings: {
    placeholder: 'Filtruj ustawienia',
    description: 'Wpisz tutaj, aby filtrować ustawienia',
  },
  closeSettingsButton: {
    description: 'Zamknij panel ustawień',
  },
  hideSettingsButton: {
    description: 'Zamknij panel ustawień',
  },
  titleGeneral: {
    text: 'Ogólne',
    description: 'Ogólne ustawienia mei-friend',
  },
  selectToolkitVersion: {
    text: 'Wersja Verovio',
    description:
      'Wybierz wersję narzędzia Verovio ' +
      '(* Przełączenie się na starsze wersje przed 3.11.0 ' +
      'może wymagać odświeżenia ze względu na problemy z pamięcią.)',
  },
  toggleSpeedMode: {
    text: 'Tryb szybki',
    description:
      'Przełącz tryb szybki Verovio. ' +
      'W trybie szybkim tylko bieżąca strona ' +
      'jest przesyłana do Verovio, aby skrócić czas renderowania ' +
      'dla dużych plików',
  },
  selectIdStyle: {
    text: 'Styl generowanych xml:id',
    description:
      'Styl nowo generowanych xml:id (istniejące xml:id nie zostaną zmienione) ' +
      'np. oryginalny styl Verovio: "note-0000001318117900", ' +
      'styl bazujący na systemie 36: "nophl5o", ' +
      'styl mei-friend: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Wstaw oświadczenie aplikacji',
    description:
      'Wstaw oświadczenie aplikacji do opisu kodowania ' +
      'w nagłówku MEI, identyfikujące nazwę aplikacji, wersję, datę pierwszej ' +
      'i ostatniej edycji',
  },
  selectLanguage: {
    text: 'Język',
    description: 'Wybierz język interfejsu mei-friend.',
  },

  // Drag select
  dragSelection: {
    text: 'Przeciągnij wybór',
    description: 'Wybierz elementy w notacji przeciągając myszką',
  },
  dragSelectNotes: {
    text: 'Wybierz nuty',
    description: 'Wybierz nuty',
  },
  dragSelectRests: {
    text: 'Wybierz pauzy',
    description: 'Wybierz pauzy i powtórzenia (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Wybierz elementy umieszczenia ',
    description: 'Wybierz elementy umieszczenia (tj. z atrybutem @placement: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Wybierz łuki ',
    description: 'Wybierz łuki (tj. elementy z atrybutem @curvature: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Wybierz takty ',
    description: 'Wybierz takty',
  },

  // Control menu
  controlMenuSettings: {
    text: 'Pasek sterowania notacją',
    description: 'Zdefiniuj elementy wyświetlane w menu sterowania notacją powyżej notacji',
  },
  controlMenuFlipToPageControls: {
    text: 'Pokaż przyciski przełączania stron',
    description: 'Pokaż przyciski przełączania stron w menu sterowania notacją',
  },
  controlMenuUpdateNotation: {
    text: 'Pokaż elementy aktualizacji notacji',
    description: 'Pokaż elementy sterowania zachowaniem aktualizacji notacji w menu sterowania notacją',
  },
  controlMenuFontSelector: {
    text: 'Pokaż selektor czcionek notacji',
    description: 'Pokaż selektor czcionek notacji (SMuFL) w menu sterowania notacją',
  },
  controlMenuNavigateArrows: {
    text: 'Pokaż strzałki nawigacji',
    description: 'Pokaż strzałki nawigacji w menu sterowania notacją',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Pokaż pole wyboru trybu szybkiego',
    description: 'Pokaż pole wyboru trybu szybkiego w menu sterowania notacją',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'Odtwarzanie MIDI',
    description: 'Ustawienia odtwarzania MIDI',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Pokaż skrót odtwarzania',
    description:
      'Powoduje wyświetlenie skrótu (bąbelka w lewym dolnym rogu; ' +
      'kliknij, aby natychmiast rozpocząć odtwarzanie) po zamknięciu paska sterowania odtwarzaniem MIDI',
  },
  showMidiPlaybackControlBar: {
    text: 'Pokaż pasek sterowania odtwarzaniem MIDI',
    description: 'Pokaż pasek sterowania odtwarzaniem MIDI',
  },
  scrollFollowMidiPlayback: {
    text: 'Śledź odtwarzanie MIDI podczas przewijania',
    description: 'Przewijaj panel notacji, aby śledzić odtwarzanie MIDI na bieżącej stronie',
  },
  pageFollowMidiPlayback: {
    text: 'Śledź odtwarzanie MIDI w stronach',
    description: 'Automatycznie przełączaj strony, aby śledzić odtwarzanie MIDI',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Podświetl aktualnie brzmiące nuty',
    description: 'Podświetl wizualnie aktualnie brzmiące nuty w panelu notacji podczas odtwarzania MIDI',
  },
  selectMidiExpansion: {
    text: 'Expansion odtwarzania',
    description: 'Wybierz element expansion, który ma być używany do odtwarzania MIDI',
  },

  // Transposition
  titleTransposition: {
    text: 'Transpozycja',
    description: 'Ustawienia transpozycji',
  },
  enableTransposition: {
    text: 'Włącz transpozycję',
    description:
      'Włącz ustawienia transpozycji, aby je zastosować za pomocą przycisku transpozycji poniżej. Transpozycja będzie stosowana tylko do notacji, kodowanie pozostaje niezmienione, chyba że klikniesz element "Rerender via Verovio" w menu rozwijanym "Manipulate".',
  },
  // Transposition
  transposeInterval: {
    text: 'Transponuj o interwał',
    description:
      'Transponuj kodowanie o interwał chromatyczny przy użyciu najczęstszych interwałów (Verovio obsługuje system 40-tonowy)',
    labels: [
      'Czysta unisono',
      'Zwiększona unisono',
      'Zmniejszona sekunda',
      'Mała sekunda',
      'Duża sekunda',
      'Zwiększona sekunda',
      'Zmniejszona tercja',
      'Mała tercja',
      'Duża tercja',
      'Zwiększona tercja',
      'Zmniejszona kwarta',
      'Czysta kwarta',
      'Zwiększona kwarta',
      'Zmniejszona kwinta',
      'Czysta kwinta',
      'Zwiększona kwinta',
      'Zmniejszona seksta',
      'Mała seksta',
      'Duża seksta',
      'Zwiększona seksta',
      'Zmniejszona septyma',
      'Mała septyma',
      'Duża septyma',
      'Zwiększona septyma',
      'Zmniejszona oktawa',
      'Czysta oktawa',
    ],
  },
  transposeKey: {
    text: 'Transponuj do tonacji',
    description: 'Transponuj do tonacji',
    labels: [
      'C# dur / A# moll',
      'F# dur / D# moll',
      'B dur / G# moll',
      'E dur / C# moll',
      'A dur / F# moll',
      'D dur / H moll',
      'G dur / E moll',
      'C dur / A moll',
      'F dur / D moll',
      'Bb dur / G moll',
      'Eb dur / C moll',
      'Ab dur / F moll',
      'Db dur / Bb moll',
      'Gb dur / Eb moll',
      'Cb dur / Ab moll',
    ],
  },
  transposeDirection: {
    text: 'Kierunek transpozycji',
    description: 'Kierunek wysokości transpozycji (w górę/w dół)',
    labels: ['W górę', 'W dół', 'Najbliżej'],
  },
  transposeButton: {
    text: 'Transponuj',
    description:
      'Zastosuj transpozycję z powyższymi ustawieniami do notacji, zachowując kodowanie MEI bez zmian. Aby również dokonać transpozycji kodowania MEI z bieżącymi ustawieniami, użyj "Rerender via Verovio" w menu rozwijanym "Manipulate".',
  },

  // Renumber measures
  renumberMeasuresHeading: {
    text: 'Przyporządkuj ponownie taktowanie',
    description: 'Ustawienia przyporządkowywania ponownego taktowania',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Kontynuuj przez niedokończone taktowania',
    description: 'Kontynuuj numerację taktów przez niedokończone taktowania (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Przyrostek w niedokończonych taktach',
    description: 'Użyj przyrostka liczby w niedokończonych taktach (np. 23-cont)',
    labels: ['brak', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Kontynuuj przez zakończenia',
    description: 'Kontynuuj numerację taktów przez zakończenia',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Przyrostek w zakończeniach',
    description: 'Użyj przyrostka liczby w zakończeniach (np. 23-a)',
  },

  // Annotations
  titleAnnotations: {
    text: 'Adnotacje',
    description: 'Ustawienia adnotacji',
  },
  showAnnotations: {
    text: 'Pokaż adnotacje',
    description: 'Pokaż adnotacje na nutach',
  },
  showAnnotationPanel: {
    text: 'Pokaż panel adnotacji',
    description: 'Pokaż panel adnotacji',
  },
  annotationDisplayLimit: {
    text: 'Maksymalna liczba adnotacji',
    description: 'Maksymalna liczba adnotacji do wyświetlenia (duże liczby mogą spowolnić mei-friend)',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: 'Panel z facsimile',
    description: 'Pokaż obrazy facsimile edycji źródłowej, jeśli dostępne',
  },
  showFacsimilePanel: {
    text: 'Pokaż panel z facsimile',
    description: 'Pokaż obrazy partytury edycji źródłowej dostarczone w elemencie facsimile',
  },
  selectFacsimilePanelOrientation: {
    text: 'Pozycja panelu z facsimile',
    description: 'Wybierz pozycję panelu z facsimile w stosunku do nutacji',
    labels: ['lewo', 'prawo', 'góra', 'dół'],
  },
  facsimileZoomInput: {
    text: 'Zoom obrazu facsimile (%)',
    description: 'Poziom przybliżenia obrazu facsimile (w procentach)',
  },
  showFacsimileFullPage: {
    text: 'Pokaż całą stronę',
    description: 'Pokaż obraz facsimile na całej stronie',
  },
  showFacsimileZones: {
    text: 'Pokaż obszary facsimile',
    description: 'Pokaż ramki ograniczające obszary facsimile',
  },
  editFacsimileZones: {
    text: 'Edytuj obszary facsimile',
    description: 'Edytuj obszary facsimile (połączy ramki ograniczające z obszarami facsimile)',
  },

  // Supplied element // Element dostarczony
  titleSupplied: {
    text: 'Zarządzaj treścią redakcyjną',
    description: 'Kontroluj obsługę znaczników redakcyjnych',
  },
  showMarkup: {
    text: 'Pokaż elementy znacznika redakcyjnego',
    description: 'Podświetl wszystkie elementy zawarte w elementach znacznika redakcyjnego',
  },
  alternativeVersionContent: {
    text: 'Wybierz domyślną zawartość dla alternatywnych kodowań',
    description: 'Wybierz, czy nowo utworzone alternatywne kodowania są puste czy kopie oryginalnego odczytu',
    labels: ['puste', 'kopia'],
  },
  suppliedColor: {
    text: 'Wybierz kolor podświetlenia <supplied>',
    description: 'Wybierz kolor podświetlenia <supplied>',
  },
  unclearColor: {
    text: 'Wybierz kolor podświetlenia <unclear>',
    description: 'Wybierz kolor podświetlenia <unclear>',
  },
  sicColor: {
    text: 'Wybierz kolor podświetlenia <sic>',
    description: 'Wybierz kolor podświetlenia <sic>',
  },
  corrColor: {
    text: 'Wybierz kolor podświetlenia <corr>',
    description: 'Wybierz kolor podświetlenia <corr>',
  },
  origColor: {
    text: 'Wybierz kolor podświetlenia <orig>',
    description: 'Wybierz kolor podświetlenia <orig>',
  },
  regColor: {
    text: 'Wybierz kolor podświetlenia <reg>',
    description: 'Wybierz kolor podświetlenia <reg>',
  },
  addColor: {
    text: 'Wybierz kolor podświetlenia <add>',
    description: 'Wybierz kolor podświetlenia <add>',
  },
  delColor: {
    text: 'Wybierz kolor podświetlenia <del>',
    description: 'Wybierz kolor podświetlenia <del>',
  },

  // EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'Ustawienia edytora',
  },
  cmReset: {
    text: 'Domyślne',
    description: 'Przywróć ustawienia domyślne mei-friend',
  },
  titleAppearance: {
    text: 'Wygląd edytora',
    description: 'Kontroluj wygląd edytora',
  },
  zoomFont: {
    text: 'Rozmiar czcionki (%)',
    description: 'Zmień rozmiar czcionki edytora (w procentach)',
  },
  theme: {
    text: 'Motyw',
    description: 'Wybierz motyw edytora',
  },
  matchTheme: {
    text: 'Notacja zgodna z motywem',
    description: 'Dopasuj notację do kolorowego motywu edytora',
  },
  tabSize: {
    text: 'Rozmiar wcięcia',
    description: 'Liczba znaków spacji dla każdego poziomu wcięcia',
  },
  lineWrapping: {
    text: 'Zawijanie wierszy',
    description: 'Czy wiersze mają być zawijane na końcu panelu',
  },
  lineNumbers: {
    text: 'Numery wierszy',
    description: 'Pokaż numery wierszy',
  },
  firstLineNumber: {
    text: 'Numer pierwszego wiersza',
    description: 'Ustaw numer pierwszego wiersza',
  },
  foldGutter: {
    text: 'Złożenie kodu',
    description: 'Włącz składanie kodu za pomocą wskaźników złożenia',
  },
  titleEditorOptions: {
    text: 'Zachowanie edytora',
    description: 'Kontroluj zachowanie edytora',
  },
  autoValidate: {
    text: 'Automatyczna walidacja',
    description: 'Automatycznie waliduj kod przeciwko schematowi po każdej edycji',
  },
  autoShowValidationReport: {
    text: 'Automatycznie pokaż raport walidacji',
    description: 'Automatycznie pokaż raport walidacji po przeprowadzeniu walidacji',
  },
  autoCloseBrackets: {
    text: 'Automatyczne zamykanie nawiasów',
    description: 'Automatycznie zamykaj nawiasy po wprowadzeniu',
  },
  autoCloseTags: {
    text: 'Automatyczne zamykanie tagów',
    description: 'Automatycznie zamykaj tagi po wprowadzeniu',
    type: 'bool',
  },
  matchTags: {
    text: 'Zaznacz pasujące tagi',
    description: 'Podświetl dopasowane tagi wokół kursora edytora',
  },
  showTrailingSpace: {
    text: 'Podświetlanie zbędnych spacji',
    description: 'Podświetl zbędne spacje na końcu linii',
  },
  keyMap: {
    text: 'Mapa klawiszy',
    description: 'Wybierz mapę klawiszy',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Ustawienia Verovio',
  },
  vrvReset: {
    text: 'Domyślne',
    description: 'Przywróć Verovio do domyślnych ustawień mei-friend',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      'Wygląda na to, że używasz przeglądarki Safari, która ' +
      'niestety obecnie nie obsługuje pełnej walidacji schematu w mei-friend. ' +
      'Proszę użyć innej przeglądarki, aby uzyskać pełne wsparcie dla walidacji.',
  },
  githubLoggedOutWarning: {
    text: `Wylogowałeś się z integracji GitHub mei-friend, ale twoja przeglądarka wciąż jest zalogowana do GitHub!
      <a href="https://github.com/logout" target="_blank">Kliknij tutaj, aby się wylogować z GitHub</a>.`,
  },
  generateUrlError: {
    text: 'Nie można wygenerować URL dla lokalnego pliku ',
  },
  generateUrlSuccess: {
    text: 'URL został skopiowany do schowka pomyślnie',
  },
  generateUrlNotCopied: {
    text: 'URL nie został skopiowany do schowka, proszę spróbować ponownie!',
  },
  errorCode: { text: 'Kod błędu' },
  submitBugReport: { text: 'Prześlij raport o błędzie' },
  loadingSchema: { text: 'Wczytywanie schematu' },
  schemaLoaded: { text: 'Schemat wczytany' },
  noSchemaFound: { text: 'Nie znaleziono informacji o schemacie w MEI.' },
  schemaNotFound: { text: 'Nie znaleziono schematu' },
  errorLoadingSchema: { text: 'Błąd podczas wczytywania schematu' },
  notValidated: { text: 'Nie zwalidowano. Kliknij tutaj, aby zwalidować.' },
  validatingAgainst: { text: 'Walidacja względem' },
  validatedAgainst: { text: 'Zwalidowano względem' },
  validationMessages: { text: 'wiadomości walidacji' },
  validationComplete: { text: 'Walidacja zakończona' },
  validationFailed: { text: 'Walidacja nie powiodła się' },
  noErrors: { text: 'brak błędów' },
  errorsFound: { text: 'znaleziono błędy' }, // znaleziono 5 błędów

  // GitHub-menu.js
  githubRepository: { text: 'Repozytorium' },
  githubBranch: { text: 'Gałąź' },
  githubFilepath: { text: 'Ścieżka' },
  githubCommit: { text: 'Zatwierdź' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Zatwierdź jako nowy plik' } }, value: 'Zatwierdź' },
  commitLog: { text: 'Dziennik zatwierdzeń' },
  githubDate: { text: 'Data' },
  githubAuthor: { text: 'Autor' },
  githubMessage: { text: 'Wiadomość' },
  none: { text: 'Brak' },
  commitFileNameText: { text: 'Nazwa pliku' },
  forkRepository: { text: 'Rozgałęź repozytorium' },
  forkError: { text: 'Przepraszamy, nie można rozgałęzić repozytorium' },
  loadingFile: { text: 'Wczytywanie pliku' },
  loadingFromGithub: { text: 'Wczytywanie z GitHub' },
  logOut: { text: 'Wyloguj się' },
  githubLogout: { text: 'Wyloguj się' },
  selectRepository: { text: 'Wybierz repozytorium' },
  selectBranch: { text: 'Wybierz gałąź' },
  commitMessageInput: { placeholder: 'Zaktualizowane za pomocą mei-friend online' },
  reportIssueWithEncoding: { value: 'Zgłoś problem z kodowaniem' },
  clickToOpenInMeiFriend: { text: 'Kliknij, aby otworzyć w mei-friend' },
  repoAccessError: {
    text: 'Przepraszamy, nie można uzyskać dostępu do repozytoriów podanego użytkownika lub organizacji',
  },
  allComposers: { text: 'Wszyscy kompozytorzy' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Numeruj takty' },
  renumberMeasuresModalTest: { text: 'Test' },
  renumberMeasuresWillBe: { text: 'będą' },
  renumberMeasuresWouldBe: { text: 'byłyby' },
  renumberMeasuresChangedTo: { text: 'zmienione na' },
  renumberMeasureMeasuresRenumbered: { text: 'takty zostały ponumerowane' },

  // Code checker panel (accid.ges)
  codeCheckerTitle: {
    text: 'Sprawdź atrybuty @accid.ges (w stosunku do znaku klucza, akcydenckie na takt oraz wiązania).',
  },
  codeCheckerFix: { text: 'Popraw' },
  codeCheckerFixAll: { text: 'Popraw wszystko' },
  codeCheckerIgnore: { text: 'Ignoruj' },
  codeCheckerIgnoreAll: { text: 'Zignoruj wszystko' },
  codeCheckerCheckingCode: { text: 'Sprawdzanie kodu...' },
  codeCheckerNoAccidMessagesFound: { text: 'Wszystkie atrybuty accid.ges wydają się poprawne.' },
  codeCheckerMeasure: { text: 'Takt' },
  codeCheckerNote: { text: 'Nutę' },
  codeCheckerHasBoth: { text: 'ma oba' },
  codeCheckerAnd: { text: 'i' },
  codeCheckerRemove: { text: 'Usuń' },
  codeCheckerFixTo: { text: 'Popraw na' },
  codeCheckerAdd: { text: 'Dodaj' },
  codeCheckerWithContradictingContent: { text: 'z zawartością sprzeczną' },
  codeCheckerTiedNote: { text: 'Połączona nuta' },
  codeCheckerNotSamePitchAs: { text: 'nie tej samej wysokości co' },
  codeCheckerNotSameOctaveAs: { text: 'nie tej samej oktawy co' },
  codeCheckerNotSameAsStartingNote: { text: 'nie ta sama co w nutę początkową' },
  codeCheckerExtra: { text: 'dodatkową' },
  codeCheckerHasExtra: { text: 'ma dodatkowe' },
  codeCheckerLacksAn: { text: 'brakuje' },
  codeCheckerBecauseAlreadyDefined: { text: 'ponieważ zostało to już zdefiniowane wcześniej w takcie' },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: 'mei-friend nie może przewinąć do wybranych elementów w kodowaniu. Dodaj identyfikatory do kodowania.',
  },
};
