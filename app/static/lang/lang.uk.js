/**
 * Language file for Ukranian
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'Про mei-friend ' },
  showSplashScreen: {
    text: 'Показувати початковий екран при завантаженні',
    description: 'Показувати початковий екран mei-friend при завантаженні додатку',
  },
  splashUpdateIndicator: {
    html: `
      Наступний текст було оновлено з моменту останнього підтвердження початкового екрану. Для деталей, будь ласка, <a href="${getChangelogUrl()}" target="_blank">ознайомтеся з журналом змін</a>.`,
  },
  splashLastUpdated: { text: 'Текст востаннє оновлено: ' },
  splashBody: {
    html: `
    <p>
      mei-friend - це редактор для <a href="https://music-encoding.org" target="_blank">музичних кодувань</a>, розміщений на
      <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Університеті музики та виконавських мистецтв у Відні</a>. 
      Будь ласка, ознайомтеся з нашою <a href="https://mei-friend.github.io" target="_blank">розширеною документацією</a> для 
      отримання додаткової інформації.
    </p>
    <p>
      Хоча mei-friend є додатком на основі браузера, ваші особисті дані (включаючи кодування, яке ви редагуєте, та налаштування додатку) зберігаються у <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">локальному сховищі</a> вашого браузера і не зберігаються на наших серверах. Для захисту ваших облікових даних GitHub ваша сесія входу GitHub (включаючи ваш токен доступу) зберігається на сервері mei-friend, а не у вашому браузері; ваш браузер містить лише непрозорий ідентифікатор сесії.
    </p>
    <p>
      Дані передаються на GitHub лише тоді, коли ви явно запитуєте це (наприклад, коли ви входите в GitHub, завантажуєте своє кодування з або фіксуєте в репозиторій GitHub, або коли ви запитуєте виконання робочого процесу GitHub Action для вас). Аналогічно, дані передаються до обраного вами постачальника Solid лише тоді, коли ви явно запитуєте це (наприклад, коли ви входите в Solid, або завантажуєте чи зберігаєте stand-off анотації). Для безпеки ваших облікових даних усі взаємодії з GitHub спрямовуються через проксі-сервер, розміщений mdw – Університетом музики та виконавських мистецтв у Відні, який додає до цих запитів ваші облікові дані з вашої сесії входу. Цей сервер діє як посередник між вашим браузером і GitHub і не зберігає вміст, що передається через нього; як і у випадку будь-якого веб-сервера, метадані запитів (наприклад, назви репозиторіїв і файлів, до яких ви звертаєтеся) можуть з'являтися в його технічних журналах.
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
      >,
      <a href="https://e-laute.info" target="_blank">I 6019 (E-LAUTE)</a> і <a href="https://lets-encode.mdw.ac.at" target="_blank">PAT 2277625 (Let's\u00a0Encode!)</a>.
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
  reformatEncodingText: {
    text: 'Переформатувати через XML-парсер',
    description:
      'Переформатовує все кодування через XML-парсер: атрибути впорядковано (спочатку xml:id, потім за абеткою), нормалізована серіалізація XML (напр. подвійні лапки, порожні елементи як самозакривні теги, посилання на символи як символи), усі рядки з відступами.',
  },
  reformatEncodingDone: { text: 'Кодування переформатовано через XML-парсер ({lines} рядків).' },
  reformatEncodingParseError: { text: 'Неможливо переформатувати: кодування не є правильно сформованим XML.' },
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
  showMeiToolboxMenuText: { text: 'Набір інструментів MEI' },
  facsimileTop: { text: 'Факсиміле зверху' },
  facsimileBottom: { text: 'Факсиміле знизу' },
  facsimileLeft: { text: 'Факсиміле зліва' },
  facsimileRight: { text: 'Факсиміле справа' },
  meiToolboxTop: { text: 'Набір інструментів MEI зверху' },
  meiToolboxBottom: { text: 'Набір інструментів MEI знизу' },
  meiToolboxLeft: { text: 'Набір інструментів MEI ліворуч' },
  meiToolboxRight: { text: 'Набір інструментів MEI праворуч' },

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
  meterConformanceText: { text: 'Перевірити @metcon' },
  renumberMeasuresTestText: { text: 'Перенумерувати такти (тест)' },
  renumberMeasuresExecText: { text: 'Перенумерувати такти (виконати)' },
  convertAttributesToElementsText: {
    text: 'Перетворити атрибути на елементи',
    description:
      'Перетворює атрибути, які також можна виразити як елементи, на ці елементи, напр. @accid, @artic, @syl, @fermata, @tie, @slur, @gliss у нотах і акордах або атрибути ключа, тональності та розміру в staffDef і scoreDef.',
  },
  convertAttributesToElementsSummary: { text: 'Атрибути перетворено на {list}.' },
  convertAttributesToElementsNone: { text: 'Не знайдено атрибутів, які можна перетворити на елементи.' },
  convertAttributesToElementsProblems: { text: 'Не вдалося перетворити {count} атрибутів.' },
  // CHECKER PANEL
  meiToolboxTabCheck: {
    text: 'Перевірка',
    description:
      'Перевіряє в кодуванні звукові знаки альтерації (@accid.ges), тривалості тактів (@metcon) і зв’язки між елементами (@startid, @endid, @plist, …). Показує кожну знайдену проблему, де можливо — з виправленням.',
  },
  meiToolboxTabConvert: {
    text: 'Перетворення',
    description:
      'Перетворює вибрані атрибути на рівнозначні елементи (наприклад, @accid на <accid>) або елементи назад на атрибути, якщо інформація не втрачається.',
  },
  meiToolboxTabRenumber: {
    text: 'Перенумерація',
    description:
      'Послідовно перенумеровує такти (@n), з налаштовуваними суфіксами для тактів, що продовжують попередній, і для тактів у вольтах.',
  },
  meiToolboxCheckButton: { text: 'Перевірити' },
  meiToolboxTestButton: { text: 'Тест', description: 'Показати, що буде змінено, не змінюючи кодування' },
  meiToolboxRenumberButton: { text: 'Перенумерувати' },
  meiToolboxAttrToElButton: { text: 'Атрибути → елементи' },
  meiToolboxElToAttrButton: { text: 'Елементи → атрибути', description: 'Перетворює елементи на атрибути, якщо при цьому не втрачається інформація; інші елементи зберігаються та наводяться в списку.' },
  meiToolboxAll: { text: 'усі' },
  meiToolboxNone: { text: 'жодного' },
  meiToolboxFilter: { text: 'Фільтрувати результати' },
  meiToolboxRunAgain: { text: 'Запустити знову' },
  meiToolboxHideOptions: { text: 'Сховати параметри' },
  meiToolboxOutdated: { text: '(кодування відтоді змінилося, результати можуть бути застарілими)' },
  meiToolboxNoResults: { text: 'Результатів ще немає. Виберіть параметри та запустіть.' },
  meiToolboxGroupsSelected: { text: '{n} з {total} груп атрибутів' },
  meiToolboxCheckAccidGes: { text: 'Знаки альтерації (@accid.ges)' },
  meiToolboxCheckMetcon: { text: 'Тривалості тактів (@metcon)' },
  meiToolboxCheckLinked: { text: 'Пов\'язані елементи (@startid, @endid, @plist, …)' },
  meiToolboxClose: { text: 'Закрити набір інструментів MEI' },
  meiToolboxTabIds: {
    text: 'Ід',
    description:
      'Додає xml:id елементам, які його не мають, надає кожному елементу новий або видаляє їх, крім тих, на які є посилання. Посилання в кодуванні оновлюються.',
  },
  meiToolboxTabFacsimile: {
    text: 'Факсиміле',
    description:
      'Пов’язує кодування із зображеннями сторінок: імпортує факсиміле з іншого файлу або додає відсутні surfaces, по одному на кожен розрив сторінки.',
  },
  meiToolboxTabReformat: {
    text: 'Переформатувати',
    description:
      'Записує все кодування наново, через Verovio або XML-парсер, і задає порядок атрибутів, який mei-friend використовує під час запису елементів.',
  },
  meiToolboxTabTranspose: {
    text: 'Транспонувати',
    description:
      'Транспонує нотний текст в іншу тональність або на інтервал. Транспонується лише нотний текст; кодування залишається незмінним.',
  },
  meiToolboxIdsAdd: { text: 'Додати xml:id (до елементів без нього)' },
  meiToolboxIdsChange: {
    text: 'Змінити xml:id (новий для кожного елемента)',
    description: 'Призначає новий xml:id кожному елементу. Посилання всередині цього кодування оновлюються, але посилання з інших файлів, анотацій, інструментів факсиміле чи URL на старі xml:id більше не працюватимуть.',
  },
  meiToolboxIdsRemove: { text: 'Вилучити xml:id (крім тих, на які є посилання)' },
  meiToolboxIdsButton: { text: 'Застосувати' },
  meiToolboxIdsAdded: { text: '{n} додано' },
  meiToolboxIdsChanged: { text: '{n} змінено' },
  meiToolboxIdsRemoved: { text: '{n} вилучено' },
  meiToolboxIdsKept: { text: '{n} збережено' },
  meiToolboxIdsReferences: { text: '{n} посилань оновлено' },
  meiToolboxIdsKeptReason: { text: 'на нього посилаються в кодуванні' },
  meiToolboxIdsNothing: { text: 'Немає що робити: жодного xml:id не додано, не змінено й не вилучено.' },
  meiToolboxIdsCancelled: { text: 'Скасовано, кодування не змінено.' },
  meiToolboxFacsimileInfo: {
    text: 'Пов’яжіть кодування із зображеннями сторінок: імпортуйте факсиміле з іншого файлу або додайте surfaces, яких ще бракує, по одній на кожен розрив сторінки.',
  },
  meiToolboxFacsimileIngest: { text: 'Імпортувати факсиміле…' },
  meiToolboxFacsimileAddMissing: {
    text: 'Додати відсутні surfaces',
    description: 'Додає те, чого бракує: факсиміле, якщо його немає, surface із тимчасовим graphic для кожної сторінки, яка ще її не має, і pb@facs, що на неї вказує. Сторінки зіставляються з наявними surfaces, які залишаються без змін.',
  },
  meiToolboxFacsimileAdded: { text: 'Додано surfaces: {n}' },
  meiToolboxFacsimileLinked: { text: 'Сторінок пов’язано з наявною surface: {n}' },
  meiToolboxFacsimileCreated: { text: 'Факсиміле додано.' },
  meiToolboxFacsimileUpToDate: { text: 'Кожна сторінка вже має свою surface; нічого не додано.' },
  meiToolboxFacsimileZones: { text: '{n} зон' },
  meiToolboxFacsimileSummary: { text: '{surfaces} surfaces, {zones} зон' },
  meiToolboxFacsimileNone: { text: 'Це кодування не має факсиміле.' },
  meiToolboxReformatVerovio: {
    text: 'Через Verovio',
    description: 'Дозволяє Verovio переписати кодування з власного подання.',
  },
  meiToolboxReformatVerovioNote: {
    text: 'Verovio записує кодування з власного подання, у власному форматуванні та порядку атрибутів.',
  },
  meiToolboxReformatXml: {
    text: 'Через XML-парсер',
    description: 'Переформатовує кодування через XML-парсер: вміст зберігається, змінюються лише форматування та порядок атрибутів. Те саме, що Код → Переформатувати через XML-парсер.',
  },
  meiToolboxReformatUnchanged: { text: 'Кодування не змінено.' },
  meiToolboxReformatDone: { text: '{lines} рядків' },
  meiToolboxAttributeOrder: {
    text: 'Порядок атрибутів',
    description: 'Порядок, у якому записуються атрибути щоразу, коли mei-friend записує елемент назад.',
    labels: ['як закодовано', 'за абеткою', 'спершу xml:id, потім за абеткою', 'власний…'],
  },
  meiToolboxAttributeOrderPattern: {
    text: 'Шаблон порядку',
    description: 'Імена атрибутів, розділені пробілами або комами, у потрібному порядку, напр. «xml:id n label *». Ім’я, що закінчується на *, відповідає всім атрибутам із цим префіксом (clef.*). Одинарна * позначає всі неназвані атрибути за абеткою; без неї вони зберігають свій порядок у кінці. Оголошення просторів імен завжди йдуть першими.',
  },

  // MEI TOOLBOX: Transpose tab
  meiToolboxTransposeInfo: {
    text: 'Транспонує лише нотний текст; кодування залишається незмінним, окрім примітки нижче. Щоб транспонувати й саме кодування, транспонуйте тут, а потім перезапишіть його через «Через Verovio» на вкладці Переформатувати.',
  },
  meiToolboxTransposeReset: {
    text: 'Скинути',
    description: 'Знімає транспонування, тож нотний текст знову показується в закодованій висоті.',
  },
  meiToolboxTransposeDone: { text: 'Нотний текст транспоновано ({what}).' },
  meiToolboxTransposeRemoved: { text: 'Транспонування знято.' },
  meiToolboxTransposeNone: { text: 'Нічого робити: транспонування не застосовано.' },
  meiToolboxTransposeAddDirective: {
    text: 'Додати примітку про транспонування',
    description:
      'Записує до pgHead партитури рядок із тональністю транспонування та тональністю кодування. Під час скидання транспонування його буде вилучено.',
  },
  meiToolboxTransposeDirectiveText: { text: 'Транспоновано до {new}\nоригінал: {original}' },
  meiToolboxTransposeDirectiveUnknown: { text: 'Транспоновано: {what}' },
  meiToolboxTransposeDirectiveAdded: { text: 'Примітку про транспонування записано до pgHead.' },
  meiToolboxTransposeDirectiveRemoved: { text: 'Примітку про транспонування вилучено з pgHead.' },

  codeCheckerFixShown: { text: 'Виправити {n} показаних' },
  codeCheckerIgnoreShown: { text: 'Ігнорувати {n} показаних' },
  convertGroupAccid: { text: 'Записані знаки альтерації (@accid)' },
  convertGroupAccidGes: { text: 'Звукові знаки альтерації (@accid.ges)' },
  convertGroupArtic: { text: 'Артикуляції (@artic, @artic.ges)' },
  convertGroupSyl: { text: 'Текст (@syl)' },
  convertGroupFermata: { text: 'Фермати (@fermata)' },
  convertGroupTie: { text: 'Ліги подовження (@tie)' },
  convertGroupSlur: { text: 'Ліги (@slur)' },
  convertGroupGliss: { text: 'Глісандо (@gliss)' },
  convertGroupDefinitions: { text: 'Ключ, тональність, розмір, мензура (staffDef, scoreDef)' },
  convertGroupLabels: { text: 'Символи груп і мітки (staffGrp, staffDef)' },
  convertAttributesToElementsTestSummary: { text: 'Атрибути було б перетворено на {list}.' },
  convertElementsToAttributesSummary: { text: 'Елементи перетворено на атрибути: {list}.' },
  convertElementsToAttributesTestSummary: { text: 'Елементи було б перетворено на атрибути: {list}.' },
  convertElementsToAttributesProblems: { text: 'Не вдалося перетворити {count} елементів.' },
  convertElementsToAttributesNone: { text: 'Не знайдено елементів, які можна перетворити на атрибути.' },
  elementsToAttributesConfirmation: { text: '<b>Елементи → атрибути</b>\n\nУвага: ця операція може зламати зовнішні посилання.\n\n{count} з елементів, що перетворюються, мають xml:id, який буде видалено разом з елементом. Елементи, на які є посилання в цьому файлі, не перетворюються.\n\nПосилання з інших файлів, анотації, збережені поза цим файлом, інструменти факсиміле або URL-адреси, що вказують на ці xml:id, більше не працюватимуть.' },
  elementsToAttributesProceed: { text: 'Перетворити' },
  elementsToAttributesCancel: { text: 'Скасувати' },
  convertScopeAll: { text: 'Обсяг: усе кодування (виділіть текст у редакторі, щоб обмежити перетворення)' },
  convertScopeSelection: { text: 'Обсяг: виділення, рядки {from}–{to}' },
  convertSelectionSuffix: { text: 'виділення' },
  renumberMeasuresStartNumber: {
    text: 'Початковий номер',
    description:
      'Номер першого повного такту; усі наступні такти нумеруються від нього. Неповний перший такт (@metcon="false", напр. затакт) отримує номер на один менший, тож за початкового номера 1 він отримує 0 (якщо не ввімкнено ‘Продовжити через неповні такти’).',
  },
  renumberMeasuresRestartAtMdiv: {
    text: 'Починати знову з кожного mdiv',
    description:
      'Починає нумерацію заново з початкового номера в кожному mdiv (частині), замість наскрізної нумерації по всьому кодуванню.',
  },
  renumberMeasuresUnchanged: { text: 'без змін' },
  renumberMeasuresSummary: { text: '{total} тактів, {changed} перенумеровано.' },
  renumberMeasuresSummaryTest: { text: '{total} тактів, {changed} було б перенумеровано.' },
  renumberMeasuresNoMeasures: { text: 'Тактів не знайдено.' },
  addIdsText: { text: 'Додати ідентифікатори до MEI' },
  removeIdsText: { text: 'Видалити ідентифікатори з MEI' },
  changeIdsText: {
    text: 'Змінити ідентифікатори в MEI (порушує зовнішні посилання)',
    description:
      'Призначає новий xml:id кожному елементу (або вибраним елементам). Посилання в цьому файлі оновлюються, але посилання з інших файлів, анотацій, інструментів для факсиміле чи URL-адрес на старі xml:id більше не працюватимуть.',
  },
  changeIdsConfirmation: {
    text: '<b>Змінити ідентифікатори в MEI</b>\n\nУвага: ця операція порушує зовнішні посилання.\n\nБуде змінено {changed} xml:id і додано {added} нових xml:id; буде оновлено {references} посилань у цьому файлі.\n\nПосилання з інших файлів, анотацій, інструментів для факсиміле чи URL-адрес на старі xml:id більше не працюватимуть.',
  },
  changeIdsProceed: { text: 'Змінити ідентифікатори' },
  changeIdsCancel: { text: 'Скасувати' },
  reRenderMeiVerovio: { text: 'Перерендерити через Verovio' },
  addFacsimile: { text: 'Додати елемент факсиміле' },
  ingestFacsimileText: { text: 'Завантажити факсиміле' },
  ingestFacsimileTitle: { text: 'Завантаження факсиміле' },
  ingestFacsimileProgress: { text: '{file}: оброблено {done} з {total} областей.' },
  ingestFacsimileDoneTitle: { text: 'Факсиміле завантажено' },
  ingestFacsimileStoppedTitle: { text: 'Завантаження факсиміле зупинено' },
  ingestFacsimileSummary: {
    text: 'Факсиміле з {file} із {surfaces} поверхнями (surface) та {zones} областями вставлено перед body; атрибути @facs додано до {added} елементів.',
  },
  ingestFacsimileStopped: {
    text: 'Зупинено після {done} з {total} областей. Зроблені зміни можна скасувати одним кроком.',
  },
  ingestFacsimileProblems: { text: 'Виявлено {count} проблем:' },
  ingestFacsimileNotFound: { text: '{type} з n="{n}" не знайдено.' },
  ingestFacsimileNotUnique: { text: '{type} з n="{n}" не унікальний.' },
  ingestFacsimileNoId: { text: '{type} з n="{n}" не має xml:id, @facs не додано.' },
  ingestFacsimileNotInEditor: { text: '{type} з n="{n}" не знайдено в редакторі, @facs не додано.' },
  ingestFacsimileNoFacsimile: { text: 'Завантаження факсиміле не вдалося: елемент facsimile не знайдено у {file}.' },
  ingestFacsimileNoBody: { text: 'Завантаження факсиміле не вдалося: елемент body не знайдено в кодуванні.' },
  ingestFacsimileNoBodyInEditor: { text: 'Елемент body не знайдено в редакторі, елемент facsimile не вставлено.' },

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
      'Розміщено на <a href="https://iwk.mdw.ac.at" target="_blank">IWK</a> ' +
      'в <a href="https://mdw.ac.at" target="_blank">mdw</a>, з ' +
      heart +
      ' Відня. ' +
      '<a href="https://iwk.mdw.ac.at/impressum" target="_blank">Інформація</a>.',
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
  githubActionStatusMsgWaiting: { text: 'Будь ласка, будьте терплячими, поки GitHub обробляє вашу дію...' },
  githubActionStatusMsgFailure: { text: 'Не вдалося виконати дію - Статус GitHub' },
  githubActionsRunCompletedMsg: { text: 'Виконання робочого процесу завершено:' },
  githubActionsRunFailedMsg: { text: 'Не вдалося завершити виконання робочого процесу:' },
  githubActionsGitHubStatusLink: { text: 'Статус GitHub' },
  githubActionsRunButton: { text: 'Виконати дію' },
  githubActionsSupplyWorkpackageDefinition: { text: 'Надайте визначення робочого пакета' },
  githubActionsRequiresWorkpackageDefinition: {
    text: "Ця GitHub Action потребує визначення робочого пакета. Будь ласка, надайте його (URL JSON-об'єкта визначення) в налаштуваннях mei-friend.",
  },
  githubActionsRunButtonReload: { text: 'Перезавантажити файл MEI' },
  githubActionsCancelButton: { text: 'Скасувати' },
  githubActionsInputSetterFilepath: { text: 'Скопіювати поточний шлях до файлу у вхідні дані' },
  githubActionsInputSetterSelection: { text: 'Скопіювати поточний вибір MEI до вхідних даних' },
  githubActionsNoSummaryProvided: { text: 'Підсумок не надано. Дивіться посилання на статус GitHub вище для деталей.' },
  githubActionsWaitingOpenLink: { text: 'Відстежувати статус робочого процесу на GitHub' },
  githubActionsDisabledTooltip: {
    text: 'Відкрийте кодування з цього репозиторію, щоб запустити робочі процеси GitHub Actions.',
  },
  githubActionsDisabledDirtyTooltip: {
    text: 'Зафіксуйте локальні зміни, щоб запускати робочі процеси GitHub Actions.',
  },
  githubActionsWorkpackageConfigInvalidResponse: {
    text: 'Вказаний файл конфігурації JSON не відповідає очікуваній схемі. Зверніться до документації для отримання деталей.',
  },
  titleGithubActions: {
    text: 'Використовувати GitHub Actions',
    description: 'Працювати з GitHub Actions, коли вони доступні в репозиторії',
  },
  enableGithubActions: {
    text: 'Показати доступні GitHub Actions',
    description: 'Показати доступні GitHub Actions під час навігації репозиторієм у меню GitHub',
  },
  supplyWorkpackageGithubActionsConfiguration: {
    text: 'Визначення робочого пакета',
    description: 'Використовуйте файл визначення робочого пакета для GitHub Actions',
  },

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
      'Додайте розмітку до випадкових елементів в виділенні.',
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
    description: 'Помістіть вибір у <sic> і додайте <corr>.',
  },
  choiceCorrSic: {
    description: 'Помістіть вибір у <corr> і додайте <sic>.',
  },
  choiceOrigReg: {
    description: 'Помістіть вибір у <orig> і додайте <reg>.',
  },
  choiceRegOrig: {
    description: 'Помістіть вибір у <reg> і додайте <orig>.',
  },
  choiceContentTarget: {
    description: 'Спочатку виберіть вміст для цього елемента, навівши на <choice>.',
  },
  addSubstText: {
    text: '<subst>',
    description:
      '(заміна) - Групує транскрипційні елементи, коли комбінація повинна розглядатися як єдиний втручання в текст.',
  },
  substAddDel: {
    description: 'Помістіть вибір у <add> і додайте <del>.',
  },
  substDelAdd: {
    description: 'Помістіть вибір у <del> і додайте <add>.',
  },
  substContentTarget: {
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
      'Активовано режим швидкості; грається лише MIDI для поточної сторінки. Щоб відтворити весь кодування, зніміть позначку з цього поля.',
  },
  midiExpansionSelectorTitle: {
    text: 'Виберіть елемент розширення для відтворення MIDI',
  },
  midiExpansionSelectorDisabledTitle: {
    text: 'Вимкнено в режимі швидкості (відображається лише поточна сторінка).',
  },
  noExpansionOption: {
    text: 'Без розширення',
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
  notationControlMenuOverflowIcon: {
    description: 'Показати додаткові кнопки керування',
  },

  facsimileControlMenuOverflowIcon: {
    description: 'Показати додаткові кнопки керування',
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
    description: 'Застосовує транспонування до нотного тексту; кодування лишається незмінним.',
  },

  // Renumber measures
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
  titleMeiToolbox: {
    text: 'Набір інструментів MEI',
    description: 'Перевірки та зміни кодування на панелі поруч із редактором',
  },
  showMeiToolbox: {
    text: 'Показати набір інструментів MEI',
    description: 'Показати набір інструментів MEI із вкладками Перевірити, Перетворити, Перенумерувати, Ід, Факсиміле та Перебудувати',
  },
  selectMeiToolboxOrientation: {
    text: 'Положення набору інструментів MEI',
    description: 'Виберіть положення набору інструментів MEI відносно редактора',
    labels: ['ліворуч', 'праворуч', 'зверху', 'знизу'],
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
  showLinkedElements: {
    text: 'Показати пов\'язані елементи',
    description: 'Виділити елементи, на які посилається вибраний елемент (наприклад, startid/endid/plist) у редакторі та нотації',
  },
  showTrailingSpace: {
    text: 'Підсвічувати зайві пробіли',
    description: 'Підсвічувати непотрібні пробіли в кінці рядків',
  },
  keyMap: {
    text: 'Карта клавіш',
    description: 'Вибрати карту клавіш',
  },
  persistentSearch: {
    text: 'Постійний пошуковий блок',
    description:
      'Використовуйте поведінку постійного пошукового блоку (пошуковий блок залишається відкритим до явного закриття)',
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
  // Let's Encode! campaign mode (see lib/lets-encode.js)
  splashLetsEncode: {
    html:
      "<p>Ви перейшли з <strong>Let's\u00a0Encode!</strong>, щоб працювати над завданням з кодування. mei-friend — один із редакторів, які «Let's\u00a0Encode!» пропонує для цієї роботи. Використовуйте <strong>Зберегти</strong> в меню <strong>Керування завданням</strong> (угорі ліворуч), щоб зберігати свій прогрес під час роботи, і <strong>Завершити завдання</strong>, коли закінчите, щоб зробити свій внесок у кампанію.</p>",
  },
  letsEncodeCompleteTaskButton: { text: 'Завершити завдання' },
  letsEncodeMenuLabel: { text: 'Керування завданням' },
  letsEncodeLoggedInAs: { text: 'Ви увійшли як' },
  letsEncodeSaveButton: { text: 'Зберегти' },
  letsEncodeSaving: { text: 'Збереження вашої роботи…' },
  letsEncodeSaveFailed: { text: 'Не вдалося зберегти вашу роботу.' },
  letsEncodeDismiss: { value: 'Закрити' },
  letsEncodeLastSave: { text: 'Останнє збереження:' },
  letsEncodeLastAutosave: { text: 'Автозбереження:' },
  letsEncodeSavedAt: { text: 'Збережено' },
  letsEncodeExpiresAt: { text: 'Спливає' },
  letsEncodeTimeRemaining: { text: 'на завершення завдання' },
  letsEncodeHoursShort: { text: 'год' },
  letsEncodeMinutesShort: { text: 'хв' },
  letsEncodeDaysShort: { text: 'д' },
  letsEncodeAgo: { text: '{n} тому' },
  letsEncodeJustNow: { text: 'щойно' },
  letsEncodeTimeExpired: { text: 'Час на виконання цього завдання вичерпано' },
  letsEncodeAutosaveMinutes: {
    title: 'Інтервал автозбереження (хвилини)',
    description:
      'Як часто, у хвилинах, ваша робота автоматично зберігається під час редагування. Збереження відбувається лише тоді, коли ви внесли зміни; 0 вимикає автозбереження.',
  },
  titleLetsEncode: { title: 'Let\'s\u00a0Encode!', description: "Налаштування завдання «Let's\u00a0Encode!», над яким ви працюєте" },
  letsEncodeAbandonTaskButton: { text: 'Відмовитися від завдання' },
  letsEncodeKeepWorking: { value: 'Продовжити роботу' },
  letsEncodeCompleteAnyway: { value: 'Усе одно завершити завдання' },
  letsEncodeAbandonConfirm: { value: 'Відмовитися від завдання' },
  letsEncodeNoChangesPrompt: {
    text:
      'Ви не змінили це кодування. Це теж має значення: завершивши завдання, ви зафіксуєте, що змін не було потрібно. Або ж можете продовжити роботу.',
  },
  letsEncodeConfirmCompletePrompt: {
    text: "Завершити це завдання? Вашу роботу буде збережено й передано до «Let's\u00a0Encode!», а завдання буде закрито.",
  },
  letsEncodeAbandonPrompt: {
    text:
      "Відмовитися від цього завдання? Вашу роботу над ним буде втрачено, зокрема й те, що ви вже зберегли, а «Let's\u00a0Encode!» отримає повідомлення, що ви не завершили завдання.",
  },
  letsEncodeLoading: { text: "Завантаження вашого завдання з «Let's\u00a0Encode!»…" },
  letsEncodeLogoLinkTitle: {
    text: "Відкрити вашу кампанію «Let's\u00a0Encode!» у новій вкладці (завдання залишиться відкритим тут)",
  },
  letsEncodeDragOverlayText: { text: "Під час завдання «Let's\u00a0Encode!» інші файли відкрити не можна." },
  letsEncodeCommitting: { text: 'Завершення вашого завдання…' },
  letsEncodeCompleted: { text: "Завдання завершено — повертаємо вас до «Let's\u00a0Encode!»…" },
  letsEncodeCommitFailed: { text: 'Не вдалося завершити ваше завдання.' },
  letsEncodeRetryButton: { value: 'Спробувати ще раз' },
  letsEncodeAbandonButton: { value: "Повернутися до «Let's\u00a0Encode!»" },
  letsEncodeNoCampaignError: {
    text:
      "Це посилання «Let's\u00a0Encode!» неповне: у ньому не вказано кампанію, тож немає куди повідомити результат. Поверніться до «Let's\u00a0Encode!» і відкрийте завдання знову.",
  },
  letsEncodeMissingParameterError: { text: "Під час передачі з «Let's\u00a0Encode!» бракувало обов’язкового параметра:" },
  letsEncodeFileError: { text: 'Не вдалося відкрити на GitHub переданий файл.' },
  letsEncodeCloneError: { text: 'Не вдалося завантажити ваше завдання з GitHub.' },
  letsEncodeRemoteChangedError: {
    text: 'Файл було змінено на GitHub, поки ви працювали, тому вашу роботу не вдалося зберегти.',
  },
  commitLog: { text: 'Журнал фіксацій' },
  githubDate: { text: 'Дата' },
  githubAuthor: { text: 'Автор' },
  githubMessage: { text: 'Повідомлення' },
  none: { text: 'Немає' },
  commitFileNameText: { text: 'Назва файлу' },
  forkRepository: { text: 'Розгалужити сховище' },
  forkError: { text: 'На жаль, не вдалося розгалужити сховище' },
  forkBranchMissingError: {
    text: 'На жаль, ваш наявний форк не містить запитаної гілки, і її не вдалося там створити. Будь ласка, оновіть або видаліть свій форк і спробуйте ще раз. Гілка',
  },
  loadingFile: { text: 'Завантаження файлу' },
  loadFileError: { text: 'На жаль, не вдалося прочитати файл зі сховища' },
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

  // Code checker @accid.ges
  accidGesCodeCheckerTitle: {
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
