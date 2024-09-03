/**
 * Language file for Ukranian
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'Про mei-friend ' },
  showSplashScreen: {
    text: 'Показувати початковий екран при завантаженні',
    description: 'Показувати початковий екран mei-friend при завантаженні додатку',
  },
  splashBody: {
    html: `
    <p>
      mei-friend - це редактор для <a href="https://music-encoding.org">музичних кодувань</a>, розміщений на
      <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Університеті музики та виконавських мистецтв у Відні</a>. 
      Будь ласка, ознайомтеся з нашою <a href="https://mei-friend.github.io" target="_blank">розширеною документацією</a> для 
      отримання додаткової інформації.
    </p>
    <p>
      Незважаючи на те, що mei-friend є веб-додатком, ваші особисті дані (включаючи кодування, яке ви редагуєте, налаштування додатку та поточні дані входу, якщо такі є) зберігаються в локальному сховищі вашого веб-переглядача
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"
        >local storage</a
      > і не передаються або не зберігаються на наших серверах.
    </p>
    <p>
      Дані передаються на GitHub лише тоді, коли ви це явно запитуєте (наприклад, коли ви входите в систему на GitHub, завантажуєте ваше кодування з репозиторію GitHub або фіксуєте його, або коли ви запитуєте виконання робочого процесу GitHub Action). Точно так само дані передаються на обраний вами провайдер Solid лише тоді, коли ви це явно запитуєте (наприклад, коли ви входите в систему Solid або завантажуєте або зберігаєте анотації станд-офу).
    </p>
    <p>
      Ми використовуємо <a href="https://matomo.org/" target="_blank">Matomo</a>
      для збору анонімних статистичних даних про використання. До них належать скорочена IP-адреса (дозволяє визначити геолокацію лише на рівні країни, але не дозволяє вище), ваш веб-переглядач та операційна система, з якої ви прийшли (тобто посилаючий сайт), час і тривалість вашого візиту та сторінки, які ви відвідали. Ця інформація зберігається на інсталяції Matomo, яка працює на серверах mdw &ndash; Університет музики та виконавських мистецтв у Відні, і не передається жодній третій стороні.
    </p>
    <p>
      Табулатури лютні конвертуються у MEI за допомогою <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a>, 
      розробленого Полом Овереллом, 
      через сервіс <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui</a>, 
      розроблений Стефаном Сзепе і <a href="https://luteconv.mdw.ac.at" target="_blank">розміщений на mdw</a>. 
      Цей сервіс створює доступні в Інтернеті копії ваших кодувань як частину процесу конвертації, 
      але вони доступні лише через унікальне значення хешу посилання і періодично видаляються.
    </p>
    <p>
      Набір інструментів Verovio завантажується зі сторінки <a href="https://verovio.org" target="_blank">https://verovio.org</a>, розміщеної на
      <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
      Це дозволяє mei-friend бути в актуальному стані з останньою версією і
      надавати вибір всіх підтримуваних версій через панель налаштувань. 
      Під час використання mei-friend ваша IP-адреса тому видима для RISM Digital.
    </p>
    <p>
      Нарешті, відтворення MIDI використовується з використанням звукового шрифту SGM_plus, наданого Google Magenta, і надається через googleapis.com. Тому ваша IP-адреса видима для Google при ініціюванні відтворення MIDI. Якщо ви не бажаєте, щоб це сталося, утримайтеся від використання функції відтворення MIDI.
    </p>
    <p>
      mei-friend розроблений
      <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Вернер Гебль</a> і
      <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">Девід М. Вайгль</a> на кафедрі музичної акустики &ndash; Віденський музичний стиль при Університеті музики та виконавських мистецтв у Відні, і
      ліцензується під
      <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
        >GNU Affero General Public License версія 3.0</a
      >. Будь ласка, ознайомтеся з нашою
      <a href="https://mei-friend.github.io/about/" target="_blank">сторінкою подяк</a> за додатковою
      інформацією про учасників та відкриті компоненти, що використовуються в нашому проекті. Ми вдячні нашим колегам за їх внесок і керівництво.
    </p>
    <p>
      Розробка веб-додатка mei-friend фінансується
      <a href="https://fwf.ac.at" target="_blank">Австрійським фондом науки (FWF)</a> в рамках проектів
      <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
        >P 34664-G (Signature Sound Vienna)</a
      >
      і <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
    </p>`,
  },
  splashGotItButtonText: { text: 'Зрозуміло!' },
  splashVersionText: { text: 'Версія' },
  splashAlwaysShow: {
    text: 'Завжди показувати цей початковий екран',
    description: 'Завжди показувати початковий екран mei-friend при завантаженні додатку',
  },
  splashAlwaysShowLabel: {
    text: 'Завжди показувати цей початковий екран',
    description: 'Завжди показувати початковий екран mei-friend при завантаженні додатку',
  },

  // Main menu bar
  githubLoginLink: { text: 'Увійти' },

  month: {
    jan: 'Січень',
    feb: 'Лютий',
    mar: 'Березень',
    apr: 'Квітень',
    may: 'Травень',
    jun: 'Червень',
    jul: 'Липень',
    aug: 'Серпень',
    sep: 'Вересень',
    oct: 'Жовтень',
    nov: 'Листопад',
    dec: 'Грудень',
  },
  // FILE MENU ITEM
  fileMenuTitle: { text: 'Файл' },
  openMeiText: { text: 'Відкрити файл' },
  openUrlText: { text: 'Відкрити URL' },
  openExample: {
    text: 'Публічний репертуар',
    description: 'Відкрити список репертуару загального користування',
  },
  importMusicXml: { text: 'Імпортувати MusicXML' },
  importHumdrum: { text: 'Імпортувати Humdrum' },
  importPae: { text: 'Імпортувати PAE, ABC' },
  saveMeiText: { text: 'Зберегти MEI' },
  saveMeiBasicText: { text: 'Зберегти як MEI Basic' },
  saveSvg: { text: 'Зберегти SVG' },
  saveMidi: { text: 'Зберегти MIDI' },
  printPreviewText: { text: 'Переглянути PDF' },
  generateUrlText: { text: 'Створити посилання mei-friend' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Код' },
  undoMenuText: { text: 'Скасувати' },
  redoMenuText: { text: 'Повторити' },
  startSearchText: { text: 'Пошук' },
  findNextText: { text: 'Знайти наступне' },
  findPreviousText: { text: 'Знайти попереднє' },
  replaceMenuText: { text: 'Замінити' },
  replaceAllMenuText: { text: 'Замінити все' },
  indentSelectionText: { text: 'Вставити відступ в виділене' },
  surroundWithTagsText: { text: 'Обгорнути тегами' },
  surroundWithLastTagText: { text: 'Обгорнути останнім тегом' },
  jumpToLineText: { text: 'Перейти до рядка' },
  toMatchingTagText: { text: 'Перейти до відповідного тега' },
  manualValidateText: { text: 'Валідувати' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Вид' },
  notationTop: { text: 'Нотація зверху' },
  notationBottom: { text: 'Нотація знизу' },
  notationLeft: { text: 'Нотація зліва' },
  notationRight: { text: 'Нотація справа' },
  showSettingsMenuText: { text: 'Панель налаштувань' },
  showAnnotationMenuText: { text: 'Панель анотацій' },
  showFacsimileMenuText: { text: 'Панель факсиміле' },
  showPlaybackControlsText: { text: 'Елементи управління відтворенням' },
  facsimileTop: { text: 'Факсиміле зверху' },
  facsimileBottom: { text: 'Факсиміле знизу' },
  facsimileLeft: { text: 'Факсиміле зліва' },
  facsimileRight: { text: 'Факсиміле справа' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Маніпуляції' },
  invertPlacementText: { text: 'Обернути розміщення' },
  betweenPlacementText: { text: 'Міжрозміщення' },
  addVerticalGroupText: { text: 'Додати вертикальну групу' },
  deleteText: { text: 'Видалити елемент' },
  pitchChromUpText: { text: 'Збільшити висоту хроматично' },
  pitchChromDownText: { text: 'Зменшити висоту хроматично' },
  pitchUpDiatText: { text: 'Збільшити висоту діатонічно' },
  pitchDownDiatText: { text: 'Зменшити висоту діатонічно' },
  pitchOctaveUpText: { text: 'Збільшити висоту на 1 октаву' },
  pitchOctaveDownText: { text: 'Зменшити висоту на 1 октаву' },
  staffUpText: { text: 'Перемістити на 1 лінію вгору' },
  staffDownText: { text: 'Перемістити на 1 лінію вниз' },
  increaseDurText: { text: 'Збільшити тривалість' },
  decreaseDurText: { text: 'Зменшити тривалість' },
  toggleDotsText: { text: 'перемикання пунктиру' },
  cleanAccidText: { text: 'Перевірити @accid.ges' },
  renumberMeasuresTestText: { text: 'Перенумерувати такти (тест)' },
  renumberMeasuresExecText: { text: 'Перенумерувати такти (виконати)' },
  addIdsText: { text: 'Додати ідентифікатори до MEI' },
  removeIdsText: { text: 'Видалити ідентифікатори з MEI' },
  reRenderMeiVerovio: { text: 'Перерендерити через Verovio' },
  addFacsimile: { text: 'Додати елемент факсиміле' },
  ingestFacsimileText: { text: 'Завантажити факсиміле' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Вставити' },
  addNoteText: { text: 'Додати ноту' },
  convertNoteToRestText: { text: 'Нота(и) <=> пауза(и)' },
  toggleChordText: { text: 'Нота(и) <=> акорд' },
  addDoubleSharpText: { html: 'Подвійний діез &#119082;' },
  addSharpText: { html: 'Дієз &#9839;' },
  addNaturalText: { html: 'Натураль &#9838;' },
  addFlatText: { html: 'Бемоль &#9837;' },
  addDoubleFlatText: { html: 'Подвійний бемоль &#119083;' },
  addTempoText: { text: 'Темп' },
  addDirectiveText: { text: 'Директива' },
  addDynamicsText: { text: 'Динаміка' },
  addSlurText: { text: 'Лясо' },
  addTieText: { text: "Зв'язка" },
  addCrescendoHairpinText: { text: 'Кресцендо (клинчатий)' },
  addDiminuendoHairpinText: { text: 'Димінуендо (клинчатий)' },
  addBeamText: { text: 'Група нот' },
  addBeamSpanText: { text: 'Спан групи нот' },
  addArpeggioText: { text: 'Арпеджіо' },
  addFermataText: { text: 'Фермата' },
  addGlissandoText: { text: 'Глісандо' },
  addPedalDownText: { text: 'Педаль (опустити)' },
  addPedalUpText: { text: 'Педаль (підняти)' },
  addTrillText: { text: 'Тремоло' },
  addTurnText: { text: 'Поворот' },
  addTurnLowerText: { text: 'Поворот вниз' },
  addMordentText: { text: 'Мордент' },
  addMordentUpperText: { text: 'Верхній мордент' },
  addOctave8AboveText: { text: 'Вісімка вище' },
  addOctave15AboveText: { text: "П'ятнадцятка вище" },
  addOctave8BelowText: { text: 'Вісімка нижче' },
  addOctave15BelowText: { text: "П'ятнадцятка нижче" },
  addGClefChangeBeforeText: { text: 'Зміна кліва G перед' },
  addGClefChangeAfterText: { text: 'Зміна кліва G після' },
  addFClefChangeBeforeText: { text: 'Зміна кліва F перед' },
  addFClefChangeAfterText: { text: 'Зміна кліва F після' },
  addCClefChangeBeforeText: { text: 'Зміна кліва C перед' },
  addCClefChangeAfterText: { text: 'Зміна кліва C після' },
  toggleStaccText: { text: 'Стацкато' },
  toggleAccentText: { text: 'Акцент' },
  toggleTenutoText: { text: 'Тенуто' },
  toggleMarcatoText: { text: 'Маркато' },
  toggleStaccissText: { text: 'Стачіссімо' },
  toggleSpiccText: { text: 'Спіккато' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Допомога' },
  goToHelpPageText: { text: 'Сторінка довідки mei-friend' },
  goToCheatSheet: { text: 'Шпаргалка mei-friend' },
  showChangelog: { text: 'Журнал змін mei-friend' },
  goToGuidelines: { text: 'МЕІ-посібник' },
  consultGuidelinesForElementText: { text: 'Посібник для поточного елемента' },
  provideFeedback: { text: 'Залишити відгук' },
  resetDefault: { text: 'Скинути налаштування' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Увімкнути панель керування MIDI відтворенням' },
  showFacsimileButton: { description: 'Увімкнути панель факсиміле' },
  showAnnotationsButton: { description: 'Увімкнути панель анотацій' },
  showSettingsButton: { description: 'Показати панель налаштувань' },

  // Footer texts
  leftFooter: {
    html:
      'Розміщено на <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'в <a href="https://mdw.ac.at">mdw</a>, з ' +
      heart +
      ' Відня. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Інформація</a>.',
  },
  loadingVerovio: { text: 'Завантаження Verovio' },
  verovioLoaded: { text: 'завантажено' },
  convertedToPdf: { text: 'конвертовано в PDF' },
  statusBarCompute: { text: 'Обчислення' },
  middleFooterPage: { text: 'сторінка' },
  middleFooterOf: { text: 'з' },
  middleFooterLoaded: { text: 'завантажено' },

  // Control menu
  verovioIcon: {
    description: `Активність mei-friend worker:
    годинниковий хід позначає активність Verovio,
    швидкість обертання проти годинникової стрілки - активність робітника`,
  },
  decreaseScaleButton: { description: 'Зменшити розмір нотації' },
  verovioZoom: { description: 'Масштабування розміру нотації' },
  increaseScaleButton: { description: 'Збільшити розмір нотації' },
  pagination1: { html: 'Сторінка&nbsp;' },
  pagination3: { html: '&nbsp;з' },
  sectionSelect: { description: 'Перехід до закодованої секції/завершення' },
  firstPageButton: { description: 'Перейти на першу сторінку' },
  previousPageButton: { description: 'Перейти на попередню сторінку' },
  paginationLabel: {
    description: 'Навігація сторінками: натисніть, щоб вручну ввести номер сторінки для відображення',
  },
  nextPageButton: { description: 'Перейти на наступну сторінку' },
  lastPageButton: { description: 'Перейти на останню сторінку' },
  flipCheckbox: { description: 'Автоматичний перехід на сторінку в позицію курсора кодування' },
  flipButton: { description: 'Ручний перехід на сторінку в позицію курсора кодування' },
  breaksSelect: { description: 'Визначте поведінку розривів систем/сторінок нотації' },
  breaksSelectNone: { text: 'Відсутні' },
  breaksSelectAuto: { text: 'Автоматичні' },
  breaksSelectMeasure: { text: 'За тактами' },
  breaksSelectLine: { text: 'За системами' },
  breaksSelectEncoded: { text: 'За системами та сторінками' },
  breaksSelectSmart: { text: 'Розумні' },
  choiceSelect: { description: 'Виберіть відображений вміст для елементів вибору' },
  choiceDefault: { text: '(стандартний вибір)' },
  noChoice: { text: '(немає доступних варіантів)' },
  updateControlsLabel: { text: 'Оновлення', description: 'Поведінка оновлення нотації після змін в кодуванні' },
  liveUpdateCheckbox: { description: 'Автоматичне оновлення нотації після змін в кодуванні' },
  codeManualUpdateButton: { description: 'Ручне оновлення нотації' },
  engravingFontSelect: { description: 'Вибір шрифту для гравіювання' },
  backwardsButton: { description: 'Перейти вліво в нотації' },
  forwardsButton: { description: 'Перейти вправо в нотації' },
  upwardsButton: { description: 'Перейти вгору в нотації' },
  downwardsButton: { description: 'Перейти вниз в нотації' },
  speedLabel: {
    text: 'Режим швидкості',
    description:
      'У режимі швидкості на Verovio відсилається лише поточна сторінка, щоб зменшити час рендерингу для великих файлів',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: 'Зберегти PDF', description: 'Зберегти у форматі PDF' },
  pdfCloseButton: { description: 'Закрити перегляд друку' },
  pagesLegendLabel: { text: 'Діапазон сторінок', singlePage: 'сторінка', multiplePages: 'сторінки' },
  selectAllPagesLabel: { text: 'Всі' },
  selectCurrentPageLabel: { text: 'Поточна сторінка' },
  selectFromLabel: { text: 'з:' },
  selectToLabel: { text: 'до:' },
  selectPageRangeLabel: { text: 'Діапазон сторінок:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'В PDF відображається лише поточна сторінка, оскільки увімкнено режим швидкості. ' +
      'Скасуйте режим швидкості, щоб вибрати всі сторінки.',
  },
  pdfPreviewNormalModeTitle: { text: 'Виберіть діапазон сторінок для збереження у форматі PDF.' },

  // Facsimile panel
  facsimileIcon: { description: 'Панель факсиміле' },
  facsimileDecreaseZoomButton: { description: 'Зменшити зображення нотації' },
  facsimileZoom: { description: 'Змінити розмір зображення нотації' },
  facsimileIncreaseZoomButton: { description: 'Збільшити зображення нотації' },
  facsimileFullPageLabel: { text: 'Повна сторінка', description: 'Показати повну сторінку факсиміле' },
  facsimileFullPageCheckbox: { description: 'Показати повну сторінку факсиміле' },
  facsimileShowZonesLabel: { text: 'Показувати області', description: 'Показувати області факсиміле' },
  facsimileShowZonesCheckbox: { description: 'Показувати області факсиміле' },
  facsimileEditZonesCheckbox: { description: 'Редагувати області факсиміле' },
  facsimileEditZonesLabel: { text: 'Редагувати області', description: 'Редагувати області факсиміле' },
  facsimileCloseButton: { description: 'Закрити панель факсиміле' },
  facsimileDefaultWarning: { text: 'Немає вмісту факсиміле для відображення.' },
  facsimileNoSurfaceWarning: {
    text: 'На цій сторінці не знайдено елементу surface.\n(Можливо, відсутній початковий елемент pb.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Факсиміле без областей видно лише в режимі повної сторінки.' },
  facsimileImgeNotLoadedWarning: { text: 'Не вдалося завантажити зображення' },

  // Drag'n'drop
  dragOverlayText: { text: 'Перетягніть ваш файл сюди.' },

  // Public repertoire
  openUrlHeading: { text: 'Відкрити кодування, розміщене в інтернеті за URL' },
  openUrlInstructions: {
    text:
      'Будь ласка, виберіть із загальної репертуару або введіть URL-адресу ' +
      'музичного кодування, розміщену в інтернеті, нижче. Зауважте: Сервер-господар ' +
      'має підтримувати спільний доступ до ресурсів (CORS).',
  },
  publicRepertoireSummary: { text: 'Загальний репертуар' },
  sampleEncodingsComposerLabel: { text: 'Композитор:' },
  sampleEncodingsEncodingLabel: { text: 'Кодування:' },
  sampleEncodingsOptionLabel: { text: 'Виберіть кодування...' },
  openUrlButton: { text: 'Відкрити URL' },
  openUrlCancel: { text: 'Скасувати' },
  proposePublicRepertoire: {
    html:
      'Ми вітаємо пропозиції щодо ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'додавання до загального репертуару' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Виберіть кодування...' },
  openUrlChooseComposerText: { text: 'Виберіть композитора...' },
  openUrlOpenEncodingByUrlText: { text: 'Відкрити кодування, розміщене в інтернеті за URL' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Запит на виконання дії GitHub:' },
  githubActionsDescription: {
    text: 'Клацніть "Виконати дію" для запиту API GitHub на виконання вищезазначеної дії з використанням конфігурації введеної нижче. Ваше кодування буде перезавантажено в останній версії після завершення виконання дії.',
  },
  githubActionStatusMsgPrompt: { text: 'Не вдалося виконати дію - GitHub повідомляє' },
  githubActionStatusMsgWaiting: { text: 'Будь ласка, будьте терплячими, поки GitHub обробляє вашу дію...' },
  githubActionStatusMsgFailure: { text: 'Не вдалося виконати дію - GitHub повідомляє' },
  githubActionStatusMsgSuccess: { text: 'Виконання дії завершено - GitHub повідомляє' },
  githubActionsRunButton: { text: 'Виконати дію' },
  githubActionsRunButtonReload: { text: 'Перезавантажити файл MEI' },
  githubActionsCancelButton: { text: 'Скасувати' },
  githubActionsInputSetterFilepath: { text: 'Скопіювати поточний шлях до файлу у вхідні дані' },
  githubActionsInputSetterSelection: { text: 'Скопіювати поточний вибір MEI до вхідних даних' },
  githubActionsInputContainerHeader: { text: 'Конфігурація вхідних даних' },

  // Fork modals
  forkRepoGithubText: { text: 'Створити репозиторій на GitHub' },
  forkRepoGithubExplanation: {
    text:
      'Посилання, яке ви перейшли, ' +
      'створить форк репозиторію GitHub за такою адресою для редагування у mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Це вам підходить?' },
  forkRepositoryInstructions: {
    text:
      'Будь ласка, виберіть із загального репертуару або введіть ' +
      "ім'я користувача чи організації GitHub та ім'я репозиторію GitHub, нижче. " +
      'Ваш форк репозиторію стане доступним з меню GitHub.',
  },
  forkRepositoryGithubText: { text: 'Створити репозиторій на GitHub' },
  forkRepertoireSummary: { text: 'Загальний репертуар' },
  forkRepertoireComposerLabel: { text: 'Композитор:' },
  forkRepertoireOrganizationLabel: { text: 'Організація:' },
  forkRepertoireOrganizationOption: { text: 'Виберіть організацію GitHub...' },
  forkRepertoireRepositoryLabel: { text: 'Репозиторій:' },
  forkRepertoireRepositoryOption: { text: 'Виберіть кодування...' },
  forkRepositoryInputName: { placeholder: "Ім'я користувача або організації GitHub" },
  forkRepositoryInputRepoOption: { text: 'Виберіть репозиторій' },
  forkRepositoryToSelectorText: { text: 'Форк в: ' },
  forkRepositoryButton: { text: 'Створити форк репозиторію' },
  forkRepositoryCancel: { text: 'Скасувати' },
  forkProposePublicRepertoire: {
    html:
      'Ми вітаємо пропозиції щодо ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'додавання до загального репертуару' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Замкнути тегом' },
  selectTagNameForEnclosureOkButton: { value: 'ОК' },
  selectTagNameForEnclosureCancelButton: { value: 'Скасувати' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      "Solid - це децентралізована платформа для соціальної платформи з підтримкою зв'язаних даних. Увійдіть в систему Solid, щоб створювати анотації, використовуючи зв'язані дані (RDF).",
  },
  solidProvider: { description: 'Будь ласка, виберіть постачальника ідентифікації Solid (IdP) або вкажіть свого.' },
  solidLoginBtn: { text: 'Увійти' },
  solidOverlayCancel: { html: 'Відновлення сесії Solid - натисніть <span>esc</span> або клікніть сюди для скасування' },
  solidWelcomeMsg: { text: 'Ласкаво просимо, ' },
  solidLogout: { text: 'Вийти' },
  solidLoggedOutWarning: {
    html: `Ви вийшли з інтеграції Solid у mei-friend, але ваш браузер все ще увійшов в систему Solid!
    <a id="solidIdPLogoutLink" target="_blank">Натисніть тут, щоб вийти з системи Solid</a>.`,
  },
  // Annotation panel
  annotationCloseButtonText: { text: 'Закрити панель анотацій' },
  hideAnnotationPanelButton: { description: 'Закрити панель анотацій' },
  closeAnnotationPanelButton: { description: 'Закрити панель анотацій' },
  annotationToolsButton: { description: 'Інструменти анотацій' },
  annotationListButton: { description: 'Список анотацій' },
  writeAnnotStandoffText: { text: 'Web анотація' },
  annotationToolsIdentifyTitle: { text: 'Визначити' },
  annotationToolsIdentifySpan: { text: "Визначити музичний об'єкт" },
  annotationToolsHighlightTitle: { text: 'Виділити' },
  annotationToolsHighlightSpan: { text: 'Виділити' },
  annotationToolsDescribeTitle: { text: 'Описати' },
  annotationToolsDescribeSpan: { text: 'Описати' },
  annotationToolsLinkTitle: { text: 'Посилання' },
  annotationToolsLinkSpan: { text: 'Посилання' },
  listAnnotations: { text: 'Анотацій немає.' },
  addWebAnnotation: { text: 'Завантажити Web анотації' },
  loadWebAnnotationMessage: { text: 'Введіть URL веб-анотації або контейнера веб-анотацій' },
  loadWebAnnotationMessage1: { text: 'Не вдалося завантажити вказану URL-адресу' },
  loadWebAnnotationMessage2: { text: 'спробуйте ще раз' },
  noAnnotationsToDisplay: { text: 'Немає анотацій для відображення' },
  flipPageToAnnotationText: { description: 'Перейти до цієї анотації' },
  describeMarkup: { description: 'Опишіть цей розмітка' },
  deleteMarkup: { description: 'Видалити цей розмітка' },
  deleteMarkupConfirmation: { text: 'Ви впевнені, що хочете видалити цей розмітка?' },
  deleteAnnotation: { description: 'Видалити цю анотацію' },
  deleteAnnotationConfirmation: { text: 'Ви впевнені, що хочете видалити цю анотацію?' },
  makeStandOffAnnotation: {
    description: 'Stand-off статус (RDF)',
    descriptionSolid: 'Записати у Solid як RDF',
    descriptionToLocal: 'Відкрити stand-off (RDF) анотацію в новій вкладці',
  },
  makeInlineAnnotation: {
    description: 'Клікніть, щоб вставити анотацію в текст',
    descriptionCopy: 'Скопіювати xml:id анотації в буфер обміну',
  },
  pageAbbreviation: { text: 'стор.' },
  elementsPlural: { text: 'елементи' },
  askForLinkUrl: { text: 'Будь ласка, введіть URL для посилання' },
  drawLinkUrl: { text: 'Відкрити в новій вкладці' },
  askForDescription: { text: 'Будь ласка, введіть текстовий опис' },
  maxNumberOfAnnotationAlert: {
    text1: 'Кількість елементів annot перевищує налаштований "Максимальна кількість анотацій"',
    text2: 'Нові анотації все ще можуть бути створені та відображені, якщо ввімкнено "Показати анотації".',
  },
  annotationsOutsideScoreWarning: {
    text: 'На жаль, зараз неможливо створювати анотації, розміщені поза &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: "Неможливо створити анотацію, оскільки як xml:id для точки прив'язки MEI відсутній.",
    text2:
      'Будь ласка, присвойте ідентифікатори, вибравши "Маніпулювати" -> "Перерендер MEI (з id)" і повторіть спробу.',
  },
  // Markup tools
  respSelect: {
    text: 'Вибір відповідальності за розмітку',
    description: 'Вибір ідентифікатора відповідальності',
  },
  selectionSelect: {
    text: 'Стандартний вибір для розмітки',
    description: 'Виберіть, чи новостворена розмітка повинна включати вибрані елементи, артикуляції чи випадкові знаки',
    labels: ['Вибрані елементи', 'Артикуляція', 'Випадковий'],
    valuesDescriptions: [
      'Додайте розмітку до вибраних елементів.',
      'Додайте розмітку до артикуляцій в виділенні.',
      'Додайте розмітку до випадкових елементів в виділенні.'
    ],
  },
  alternativeEncodingsGrp: {
    text: 'Альтернативні кодування',
    description: 'Елементи розмітки, які містять кілька версій.',
  },
  addChoiceText: {
    text: '<choice>',
    description: 'Групує кілька альтернативних кодувань для того ж самого місця в тексті.',
  },
  choiceSicCorr: {
    description: 'Помістіть вибір у <sic> і додайте <corr>.'
  },
  choiceCorrSic: {
    description: 'Помістіть вибір у <corr> і додайте <sic>.'
  },
  choiceOrigReg: {
    description: 'Помістіть вибір у <orig> і додайте <reg>.'
  },
  choiceRegOrig: {
    description: 'Помістіть вибір у <reg> і додайте <orig>.'
  },
  choiceContentTarget: {
    text: '(виберіть вміст)',
    description: 'Спочатку виберіть вміст для цього елемента, навівши на <choice>.',
  },
  addSubstText: {
    text: '<subst>',
    description:
      '(заміна) - Групує транскрипційні елементи, коли комбінація повинна розглядатися як єдиний втручання в текст.',
  },
  substAddDel: {
    description: 'Помістіть вибір у <add> і додайте <del>.'
  },
  substDelAdd: {
    description: 'Помістіть вибір у <del> і додайте <add>.'
  },
  substContentTarget: {
    text: '(виберіть вміст)',
    description: 'Спочатку виберіть вміст для цього елемента, навівши на <subst>.',
  },
  editInterventionsGrp: {
    text: 'Редакційні втручання',
    description: 'Елементи розмітки, які використовуються для кодування редакційних втручань.',
  },
  addSuppliedText: {
    text: '<supplied>',
    description: 'Містить матеріал, наданий транскрибером чи редактором з будь-якої причини.',
  },
  addUnclearText: {
    text: '<unclear>',
    description:
      'Містить матеріал, який не може бути транскрибований із впевненістю через його нерозбірливість або незчутливість у джерелі.',
  },
  addSicText: { text: '<sic>', description: 'Містить, ймовірно, невірний або неточний матеріал.' },
  addCorrText: {
    text: '<corr>',
    description: '(виправлення) - Містить правильну форму видимо помилкового уривка.',
  },
  addOrigText: {
    text: '<orig>',
    description:
      '(оригінальний) - Містить матеріал, який позначено як слідуючий оригіналу, а не нормалізований чи виправлений.',
  },
  addRegText: {
    text: '<reg>',
    description: '(регуляризація) - Містить матеріал, який було регуляризовано чи нормалізовано в певному сенсі.',
  },
  descMarkupGrp: {
    text: 'Описова розмітка',
    description: 'Елементи розмітки, використовувані для кодування втручань в джерело.',
  },
  addAddText: { text: '<add>', description: '(додаток) - Позначає додаток до тексту.' },
  addDelText: {
    text: '<del>',
    description:
      '(видалення) - Містить інформацію, видалену, позначену як видалену або інакше вказану як зайву або фальшиву в копіювальному тексті автором, копістом, анотатором або виправником.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Режим швидкості',
    description:
      'Активовано режим швидкості; грається лише MIDI для поточної сторінки. Щоб відтворити весь кодування, вимкніть режим швидкості.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Сховати панель управління відтворенням MIDI' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'Налаштування mei-friend',
    description: 'Налаштування mei-friend',
  },
  mfReset: {
    text: 'За умовчанням',
    description: 'Скинути до налаштувань mei-friend за умовчанням',
  },
  filterSettings: {
    placeholder: 'Фільтрувати налаштування',
    description: 'Введіть текст для фільтрування налаштувань',
  },
  closeSettingsButton: {
    description: 'Закрити панель налаштувань',
  },
  hideSettingsButton: {
    description: 'Закрити панель налаштувань',
  },
  titleGeneral: {
    text: 'Загальні',
    description: 'Загальні налаштування mei-friend',
  },
  selectToolkitVersion: {
    text: 'Версія Verovio',
    description:
      'Виберіть версію набору інструментів Verovio ' +
      '(* Переключення на старі версії до 3.11.0 ' +
      "може вимагати оновлення через питання пам'яті.)",
  },
  toggleSpeedMode: {
    text: 'Режим швидкості',
    description:
      'Увімкнути/вимкнути режим швидкості Verovio. ' +
      'У режимі швидкості на Verovio відправляється лише поточна сторінка, ' +
      'щоб скоротити час рендерінгу з великими файлами',
  },
  selectIdStyle: {
    text: 'Стиль згенерованих xml:ids',
    description:
      'Стиль новостворених xml:ids (існуючі xml:ids не змінюються)' +
      'наприклад, оригінальний Verovio: "note-0000001318117900", ' +
      'базовий 36-річний стиль Verovio: "nophl5o", ' +
      'стиль mei-friend: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Вставити заяву додатка',
    description:
      'Додайте заяву додатка до опису кодування в заголовку MEI, вказавши ' +
      'назву додатка, версію, дату першої та останньої редагування',
  },
  selectLanguage: {
    text: 'Мова',
    description: 'Виберіть мову інтерфейсу mei-friend.',
  },

  // Drag select
  dragSelection: {
    text: 'Виділити за допомогою перетягування',
    description: 'Вибір елементів в нотації за допомогою перетягування миші',
  },
  dragSelectNotes: {
    text: 'Вибрати ноти',
    description: 'Вибір нот',
  },
  dragSelectRests: {
    text: 'Вибрати паузи',
    description: 'Вибір пауз та повторень (pause, mPause, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Вибрати елементи розміщення ',
    description: 'Вибір елементів розміщення (тобто з атрибутом @placement: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Вибрати ламки ',
    description: 'Вибір ламок (тобто елементів з атрибутом @curvature: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Вибрати такти ',
    description: 'Вибір тактів',
  },

  // Control menu
  controlMenuSettings: {
    text: 'Панель управління нотацією',
    description: 'Визначення елементів, які показуватимуться в панелі управління над нотацією',
  },
  controlMenuFlipToPageControls: {
    text: 'Показувати елементи керування переходом на сторінку',
    description: 'Показувати елементи керування переходом на сторінку в панелі управління нотацією',
  },
  controlMenuUpdateNotation: {
    text: 'Показувати елементи керування оновленням нотації',
    description: 'Показувати елементи керування поведінкою оновлення нотації в панелі управління нотацією',
  },
  controlMenuFontSelector: {
    text: 'Показувати селектор шрифту нотації',
    description: 'Показувати селектор шрифту нотації (SMuFL) в панелі управління нотацією',
  },
  controlMenuNavigateArrows: {
    text: 'Показувати стрілки навігації',
    description: 'Показувати стрілки навігації нотації в панелі управління нотацією',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Показувати прапорець режиму швидкості',
    description: 'Показувати прапорець режиму швидкості в панелі управління нотацією',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'Відтворення MIDI',
    description: 'Налаштування відтворення MIDI',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Показати скорочення відтворення',
    description:
      'Призводить до відображення скорочення (бульбашка в лівому нижньому куті; ' +
      'клікніть, щоб негайно почати відтворення) при закритій панелі управління відтворенням MIDI',
  },
  showMidiPlaybackControlBar: {
    text: 'Показати панель управління відтворенням MIDI',
    description: 'Показувати панель управління відтворенням MIDI',
  },
  scrollFollowMidiPlayback: {
    text: 'Автопрокрутка при відтворенні MIDI',
    description: 'Прокручувати панель нотації, щоб слідкувати за відтворенням MIDI на поточній сторінці',
  },
  pageFollowMidiPlayback: {
    text: 'Автоперехід сторінки при відтворенні MIDI',
    description: 'Автоматично переходити на сторінку, щоб слідкувати за відтворенням MIDI',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Виділити в даний момент звучащі ноти',
    description: 'Візуально виділяти в даний момент звучащі ноти в панелі нотації під час відтворення MIDI',
  },
  selectMidiExpansion: {
    text: 'Розширення відтворення',
    description: 'Виберіть елемент розширення, який буде використовуватися для відтворення MIDI',
  },

  // Transposition
  titleTransposition: {
    text: 'Транспонування',
    description: 'Інформація про транспонування нотації',
  },
  enableTransposition: {
    text: 'Увімкнути транспонування',
    description:
      'Увімкнути налаштування транспонування, які застосовуватимуться за допомогою кнопки транспонування нижче. Транспонування буде застосовано лише до нотації, кодування залишається без змін, якщо ви не натиснете елемент "Перерендерити через Verovio" в меню "Маніпулювати".',
  },
  transposeInterval: {
    text: 'Транспонувати за інтервалом',
    description:
      'Транспонувати кодування за допомогою хроматичного інтервалу за допомогою найбільш поширених інтервалів (Verovio підтримує систему базового 40)',
    labels: [
      'Досконала прима',
      'Збільшена прима',
      'Зменшена секунда',
      'Малий секунда',
      'Велика секунда',
      'Збільшена секунда',
      'Зменшена терція',
      'Малий терція',
      'Велика терція',
      'Збільшена терція',
      'Зменшена кварта',
      'Досконала кварта',
      'Збільшена кварта',
      'Зменшена квінта',
      'Досконала квінта',
      'Збільшена квінта',
      'Зменшена секста',
      'Малий секста',
      'Велика секста',
      'Збільшена секста',
      'Зменшена септима',
      'Малий септима',
      'Велика септима',
      'Збільшена септима',
      'Зменшена октава',
      'Досконала октава',
    ],
  },
  transposeKey: {
    text: 'Транспонувати до тональності',
    description: 'Транспонувати до тональності',
    labels: [
      'C# мажор / A# мінор',
      'F# мажор / D# мінор',
      'B мажор / G# мінор',
      'E мажор / C# мінор',
      'A мажор / F# мінор',
      'D мажор / B мінор',
      'G мажор / E мінор',
      'C мажор / A мінор',
      'F мажор / D мінор',
      'Bb мажор / G мінор',
      'Eb мажор / C мінор',
      'Ab мажор / F мінор',
      'Db мажор / Bb мінор',
      'Gb мажор / Eb мінор',
      'Cb мажор / Ab мінор',
    ],
  },
  transposeDirection: {
    text: 'Напрям транспонування',
    description: 'Напрям транспонування (вгору/вниз)',
    labels: ['Вгору', 'Вниз', 'Найближчий'],
  },
  transposeButton: {
    text: 'Транспонувати',
    description:
      'Застосувати транспонування з налаштуваннями вище до нотації, при цьому MEI кодування залишається без змін. Для транспонування MEI кодування з поточними налаштуваннями використовуйте "Перерендерити через Verovio" у меню "Маніпулювати".',
  },

  // Renumber measures
  renumberMeasuresHeading: {
    text: 'Перенумерувати такти',
    description: 'Налаштування для перенумерування тактів',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Продовжити через неповні такти',
    description: 'Продовжити номери тактів через неповні такти (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Суфікс для неповних тактів',
    description: 'Використовувати суфікс для неповних тактів (наприклад, 23-продовження)',
    labels: ['немає', '-продовження'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Продовжити через закінчення',
    description: 'Продовжити номери тактів через закінчення',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Суфікс для закінчень',
    description: 'Використовувати суфікс для закінчень (наприклад, 23-а)',
  },

  // Annotations
  titleAnnotations: {
    text: 'Анотації',
    description: 'Налаштування анотацій',
  },
  showAnnotations: {
    text: 'Показати анотації',
    description: 'Показати анотації в нотації',
  },
  showAnnotationPanel: {
    text: 'Показати панель анотацій',
    description: 'Показати панель анотацій',
  },
  annotationDisplayLimit: {
    text: 'Максимальна кількість анотацій',
    description: 'Максимальна кількість анотацій для відображення (велика кількість може сповільнити mei-friend)',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: 'Панель факсиміле',
    description: 'Показувати зображення з джерела, якщо вони доступні',
  },
  showFacsimilePanel: {
    text: 'Показати панель факсиміле',
    description: 'Показати зображення з джерела, які надані в елементі факсиміле',
  },
  selectFacsimilePanelOrientation: {
    text: 'Позиція панелі факсиміле',
    description: 'Виберіть позицію панелі факсиміле відносно нотації',
    labels: ['ліво', 'право', 'верх', 'низ'],
  },
  facsimileZoomInput: {
    text: 'Масштаб зображення факсиміле (%)',
    description: 'Рівень масштабу зображення факсиміле (у відсотках)',
  },
  showFacsimileFullPage: {
    text: 'Показати повну сторінку',
    description: 'Показати зображення факсиміле на повній сторінці',
  },
  showFacsimileZones: {
    text: 'Показати області факсиміле',
    description: 'Показати межі областей факсиміле',
  },
  editFacsimileZones: {
    text: 'Редагувати області факсиміле',
    description: "Редагувати області факсиміле (пов'язані межі з областями факсиміле)",
  },
  showFacsimileTitles: {
    text: 'Показати назви факсиміле',
    description: 'Показати назви факсиміле над зображеннями',
  },

  // Supplied element
  titleSupplied: {
    text: 'Обробка редакційного вмісту',
    description: 'Керування обробкою редакційної розмітки',
  },
  showMarkup: {
    text: 'Показати елементи редакційної розмітки',
    description: 'Виділити всі елементи, що містяться в елементах редакційної розмітки',
  },
  markupToPDF: {
    text: 'Розмітка в PDF',
    description: 'Включити редакційну розмітку у PDF-файл',
  },
  alternativeVersionContent: {
    text: 'Вибір вмісту за замовчуванням для альтернативних кодувань',
    description: 'Вибір, чи новостворені альтернативні кодування є порожніми або копіями оригінального читання',
    labels: ['порожнє', 'копія'],
  },
  suppliedColor: {
    text: 'Вибір кольору підсвічування для <supplied>',
    description: 'Вибір кольору підсвічування для <supplied>',
  },
  unclearColor: {
    text: 'Вибір кольору підсвічування для <unclear>',
    description: 'Вибір кольору підсвічування для <unclear>',
  },
  sicColor: {
    text: 'Вибір кольору підсвічування для <sic>',
    description: 'Вибір кольору підсвічування для <sic>',
  },
  corrColor: {
    text: 'Вибір кольору підсвічування для <corr>',
    description: 'Вибір кольору підсвічування для <corr>',
  },
  origColor: {
    text: 'Вибір кольору підсвічування для <orig>',
    description: 'Вибір кольору підсвічування для <orig>',
  },
  regColor: {
    text: 'Вибір кольору підсвічування для <reg>',
    description: 'Вибір кольору підсвічування для <reg>',
  },
  addColor: {
    text: 'Вибір кольору підсвічування для <add>',
    description: 'Вибір кольору підсвічування для <add>',
  },
  delColor: {
    text: 'Вибір кольору підсвічування для <del>',
    description: 'Вибір кольору підсвічування для <del>',
  },
  // EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'Налаштування редактора',
  },
  cmReset: {
    text: 'За замовчуванням',
    description: 'Скинути до налаштувань за замовчуванням mei-friend',
  },
  titleAppearance: {
    text: 'Вигляд редактора',
    description: 'Керує виглядом редактора',
  },
  zoomFont: {
    text: 'Розмір шрифту (%)',
    description: 'Змінити розмір шрифту редактора (у відсотках)',
  },
  theme: {
    text: 'Тема',
    description: 'Виберіть тему редактора',
  },
  matchTheme: {
    text: 'Нотація відповідає темі',
    description: 'Співпадає кольорова тема нотації з темою редактора',
  },
  tabSize: {
    text: 'Розмір відступу',
    description: 'Кількість пробільних символів для кожного рівня відступу',
  },
  lineWrapping: {
    text: 'Перенесення рядків',
    description: 'Чи потрібно переносити рядки в кінці панелі',
  },
  lineNumbers: {
    text: 'Номери рядків',
    description: 'Показувати номери рядків',
  },
  firstLineNumber: {
    text: 'Номер першого рядка',
    description: 'Встановити номер першого рядка',
  },
  foldGutter: {
    text: 'Згортання коду',
    description: 'Увімкнути згортання коду через бічну панель',
  },
  titleEditorOptions: {
    text: 'Поведінка редактора',
    description: 'Керує поведінкою редактора',
  },
  autoValidate: {
    text: 'Автоматична перевірка',
    description: 'Автоматично перевіряти код на відповідність схемі після кожного редагування',
  },
  autoShowValidationReport: {
    text: 'Автоматично показувати звіт про перевірку',
    description: 'Автоматично показувати звіт про перевірку після виконання перевірки',
  },
  autoCloseBrackets: {
    text: 'Автоматично закривати дужки',
    description: 'Автоматично закривати дужки при введенні',
  },
  autoCloseTags: {
    text: 'Автоматично закривати теги',
    description: 'Автоматично закривати теги при введенні',
    type: 'bool',
  },
  matchTags: {
    text: 'Співпадають теги',
    description: 'Виділяти співпадаючі теги поблизу курсора редактора',
  },
  showTrailingSpace: {
    text: 'Підсвічувати зайві пробіли',
    description: 'Підсвічувати непотрібні пробіли в кінці рядків',
  },
  keyMap: {
    text: 'Карта клавіш',
    description: 'Вибрати карту клавіш',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Налаштування Verovio',
  },
  vrvReset: {
    text: 'За замовчуванням',
    description: 'Скинути налаштування Verovio до налаштувань за замовчуванням mei-friend',
  },

  // main.js alert messages
  isSafariWarning: {
    text: 'Схоже, що ви використовуєте Safari як свій браузер, на якому на жаль, mei-friend не підтримує схемну перевірку. Будь ласка, використовуйте інший браузер для повної підтримки перевірки.',
  },
  githubLoggedOutWarning: {
    text: `Ви вийшли зі свого облікового запису GitHub у mei-friend, але ваш браузер все ще залишається увійденим в GitHub! <a href="https://github.com/logout" target="_blank">Клацніть тут, щоб вийти з GitHub</a>.`,
  },
  generateUrlError: {
    text: 'Не вдалося згенерувати URL для локального файлу',
  },
  generateUrlSuccess: {
    text: 'URL успішно скопійовано в буфер обміну',
  },
  generateUrlNotCopied: {
    text: 'URL не скопійовано в буфер обміну, спробуйте ще раз!',
  },
  errorCode: { text: 'Код помилки' },
  submitBugReport: { text: 'Надіслати звіт про помилку' },
  loadingSchema: { text: 'Завантаження схеми' },
  schemaLoaded: { text: 'Схема завантажена' },
  noSchemaFound: { text: 'Не знайдено інформації про схему в MEI.' },
  schemaNotFound: { text: 'Схему не знайдено' },
  errorLoadingSchema: { text: 'Помилка при завантаженні схеми' },
  notValidated: { text: 'Не перевірено. Натисніть тут, щоб перевірити.' },
  validatingAgainst: { text: 'Перевірка за' },
  validatedAgainst: { text: 'Перевірено за' },
  validationMessages: { text: 'повідомленнями про перевірку' },
  validationComplete: { text: 'Перевірка завершена' },
  validationFailed: { text: 'Перевірка не пройшла' },
  noErrors: { text: 'немає помилок' },
  errorsFound: { text: 'знайдено помилок' }, // 5 помилок знайдено

  // GitHub-menu.js
  githubRepository: { text: 'Сховище' },
  githubBranch: { text: 'Гілка' },
  githubFilepath: { text: 'Шлях' },
  githubCommit: { text: 'Зафіксувати' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Зафіксувати як новий файл' } }, value: 'Зафіксувати' },
  commitLog: { text: 'Журнал фіксацій' },
  githubDate: { text: 'Дата' },
  githubAuthor: { text: 'Автор' },
  githubMessage: { text: 'Повідомлення' },
  none: { text: 'Немає' },
  commitFileNameText: { text: 'Назва файлу' },
  forkRepository: { text: 'Розгалужити сховище' },
  forkError: { text: 'На жаль, не вдалося розгалужити сховище' },
  loadingFile: { text: 'Завантаження файлу' },
  loadingFromGithub: { text: 'Завантаження з GitHub' },
  logOut: { text: 'Вийти' },
  githubLogout: { text: 'Вийти' },
  selectRepository: { text: 'Вибрати сховище' },
  selectBranch: { text: 'Вибрати гілку' },
  commitMessageInput: { placeholder: 'Оновлено за допомогою mei-friend online' },
  reportIssueWithEncoding: { value: 'Повідомити про проблему з кодуванням' },
  clickToOpenInMeiFriend: { text: 'Клацніть, щоб відкрити в mei-friend' },
  repoAccessError: { text: 'На жаль, не вдалося отримати доступ до сховищ користувача або організації' },
  allComposers: { text: 'Всі композитори' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Перенумерувати такти' },
  renumberMeasuresModalTest: { text: 'Тест' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'буде' },
  renumberMeasuresChangedTo: { text: 'змінено на' },
  renumberMeasureMeasuresRenumbered: { text: 'перенумеровані такти' },

  // Code checker @accid.ges
  codeCheckerTitle: {
    text: "Перевірка атрибутів @accid.ges (відповідно до ключового підпису, атрибутів @accid в тактах та зв'язків).",
  },
  codeCheckerFix: { text: 'Виправити' },
  codeCheckerFixAll: { text: 'Виправити все' },
  codeCheckerIgnore: { text: 'Ігнорувати' },
  codeCheckerIgnoreAll: { text: 'Ігнорувати все' },
  codeCheckerCheckingCode: { text: 'Перевірка коду...' },
  codeCheckerNoAccidMessagesFound: { text: 'Всі атрибути @accid.ges виглядають правильно.' },
  codeCheckerMeasure: { text: 'Такт' },
  codeCheckerNote: { text: 'Нота' },
  codeCheckerHasBoth: { text: 'має обидва' },
  codeCheckerAnd: { text: 'та' },
  codeCheckerRemove: { text: 'Видалити' },
  codeCheckerFixTo: { text: 'Виправити на' },
  codeCheckerAdd: { text: 'Додати' },
  codeCheckerWithContradictingContent: { text: 'з суперечливим змістом' },
  codeCheckerTiedNote: { text: "Зв'язана нота" },
  codeCheckerNotSamePitchAs: { text: 'не той же звук, що й' },
  codeCheckerNotSameOctaveAs: { text: 'не та ж октава, що й' },
  codeCheckerNotSameAsStartingNote: { text: 'не та ж сама, що й у початковій ноті' },
  codeCheckerExtra: { text: 'зайвий' }, // надмірний
  codeCheckerHasExtra: { text: 'має зайвий' }, // має надмірний
  codeCheckerLacksAn: { text: 'не має' },
  codeCheckerBecauseAlreadyDefined: { text: 'оскільки він вже визначений раніше в такту' },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: 'mei-friend не може прокрутити вибрані елементи в кодуванні. Будь ласка, додайте ідентифікатори до кодування.',
  },
};
