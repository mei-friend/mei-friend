/**
 * Language file for English
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
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
  notationLeft: { text: 'Notacja po lewej' },
  notationRight: { text: 'Notacja po prawej' },
  showSettingsMenuText: { text: 'Panel ustawień' },
  showAnnotationMenuText: { text: 'Panel adnotacji' },
  showFacsimileMenuText: { text: 'Panel faksymile' },
  showPlaybackControlsText: { text: 'Elementy sterowania odtwarzaniem' },
  facsimileTop: { text: 'Faksymile u góry' },
  facsimileBottom: { text: 'Faksymile na dole' },
  facsimileLeft: { text: 'Faksymile po lewej' },
  facsimileRight: { text: 'Faksymile po prawej' },

  // INSERT MENU ITEM // ELEMENT MENU ITEM
  manipulateMenuTitle: { text: 'Manipuluj' },
  invertPlacementText: { text: 'Odwróć umiejscowienie' },
  betweenPlacementText: { text: 'Pomiędzy umiejscowienie' },
  addVerticalGroupText: { text: 'Dodaj pionową grupę' },
  deleteText: { text: 'Usuń element' },
  pitchUpText: { text: 'Podnieś dźwięk o pół tonu' },
  pitchDownText: { text: 'Obniż dźwięk o pół tonu' },
  pitchOctaveUpText: { text: 'Podnieś dźwięk o oktawę' },
  pitchOctaveDownText: { text: 'Obniż dźwięk o oktawę' },
  staffUpText: { text: 'Element 1 pięciolinii w górę' },
  staffDownText: { text: 'Element 1 pięciolinii w dół' },
  increaseDurText: { text: 'Zwiększ długość' },
  decreaseDurText: { text: 'Zmniejsz długość' },
  cleanAccidText: { text: 'Usuń znaki akcydentalne @accid.ges' },
  renumberMeasuresTestText: { text: 'Numeruj taktowania (test)' },
  renumberMeasuresExecText: { text: 'Numeruj taktowania (wykonaj)' },
  addIdsText: { text: 'Dodaj identyfikatory do MEI' },
  removeIdsText: { text: 'Usuń identyfikatory z MEI' },
  reRenderMeiVerovio: { text: 'Ponownie renderuj za pomocą Verovio' },
  addFacsimile: { text: 'Dodaj element faksymile' },
  ingestFacsimileText: { text: 'Zaimportuj faksymile' },

  // INSERT MENU ITEM // WSTAW ELEMENT MENU
  insertMenuTitle: { text: 'Wstaw' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Dyrektywa' },
  addDynamicsText: { text: 'Dynamika' },
  addSlurText: { text: 'Legato' },
  addTieText: { text: 'Łącznik' },
  addCrescendoHairpinText: { text: 'Crescendo' },
  addDiminuendoHairpinText: { text: 'Diminuendo' },
  addBeamText: { text: 'Belka' },
  addBeamSpanText: { text: 'Rozciągnięcie belki' },
  addSuppliedText: { text: 'Uzupełnione' },
  addSuppliedArticText: { text: 'Uzupełnione (Artic)' },
  addSuppliedAccidText: { text: 'Uzupełnione (Accid)' },
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
  goToHelpPage: { text: 'Strony pomocy mei-friend' },
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
      'na <a href="https://mdw.ac.at">mdw</a>, z sercem ' +
      'z Wiednia. ' +
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
  githubActionStatusMsgPrompt: { text: 'Nie udało się uruchomić zadania - GitHub mówi' },
  githubActionStatusMsgWaiting: { text: 'Proszę być cierpliwym, GitHub przetwarza twoje zadanie...' },
  githubActionStatusMsgFailure: { text: 'Nie udało się uruchomić zadania - GitHub mówi' },
  githubActionStatusMsgSuccess: { text: 'Zadanie wykonane pomyślnie - GitHub mówi' },
  githubActionsRunBtn: { text: 'Uruchom zadanie' },
  githubActionsRunBtnReload: { text: 'Przeładuj plik MEI' },
  githubActionsCancelBtn: { text: 'Anuluj' },
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
  annotationToolsButton: { text: 'Narzędzia', description: 'Narzędzia adnotacji' },
  annotationListButton: { text: 'Lista', description: 'Lista adnotacji' },
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
  deleteAnnotation: { description: 'Usuń tę adnotację' },
  deleteAnnotationConfirmation: { text: 'Czy na pewno chcesz usunąć tę adnotację?' },
  makeStandOffAnnotation: {
    description: 'Stan adnotacji (adnotacja sieci Web)',
    descriptionSolid: 'Zapisz do Solid jako adnotacja sieci Web',
    descriptionToLocal: 'Skopiuj identyfikator URI adnotacji sieci Web do schowka',
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

  // Supplied element
  titleSupplied: {
    text: 'Obsługa treści redakcyjnych',
    description: 'Kontroluj obsługę elementów <supplied>',
  },
  showSupplied: {
    text: 'Pokaż elementy <supplied>',
    description: 'Podświetl wszystkie elementy zawarte w elemencie <supplied>',
  },
  suppliedColor: {
    text: 'Wybierz kolor podświetlenia <supplied>',
    description: 'Wybierz kolor podświetlenia <supplied>',
  },
  respSelect: {
    text: 'Wybierz odpowiedzialność <supplied>',
    description: 'Wybierz identyfikator odpowiedzialności',
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
};
