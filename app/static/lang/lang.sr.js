/**
 * Language file for Bosnian-Croatian-Serbian (cyrillic script).
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: 'О меи-френд ' },
  showSplashScreen: {
    text: 'Прикажи почетни екран при подизању',
    description: 'Прикажи меи-френд почетни екран при подизању апликације',
  },
  splashUpdateIndicator: {
    html: `
      Следећи текст је ажуриран од последњег пута када сте признали почетни екран. За детаље, молимо вас да <a href="${getChangelogUrl()}" target="_blank">консултујете дневник промена</a>.`,
  },
  splashLastUpdated: { text: 'Текст последњи пут ажуриран: ' },
  splashBody: {
    html: `
    <p>
      mei-friend је уређивач за <a href="https://music-encoding.org">музичке кодове</a>, хостован на
      <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Универзитету музике и извођачких уметности у Бечу</a>. 
      Молимо вас да консултујете нашу <a href="https://mei-friend.github.io" target="_blank">обимну документацију</a> за 
      додатне информације.
    </p>
    <p>
      Иако је mei-friend апликација заснована на прегледачу, ваши лични подаци (укључујући кодирање које уређујете, подешавања апликације и тренутне податке за пријаву, ако их има) се чувају у <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">локалној меморији</a> вашег прегледача и нису сачувани на нашим серверима.
    </p>
    <p>
      Подаци се преносе на GitHub само када то изричито затражите (нпр. када се пријавите на GitHub, учитате своје кодирање из или комитујете у GitHub репозиторијум, или када затражите да се за вас покрене GitHub Action радни ток). Слично томе, подаци се преносе вашем изабраном Solid провајдеру само када то изричито затражите (нпр. када се пријавите на Solid, или учитате или сачувате stand-off напомене). Из техничких разлога, одређене интеракције са GitHub-ом (клонирање репозиторијума у ваш прегледач при првом отварању кодирања, или комитовање промена у репозиторијум) захтевају пренос података на прокси сервер хостован од стране mdw – Универзитета музике и извођачких уметности у Бечу. Овај сервер делује као посредник између вашег прегледача и GitHub-а, и не чува никакве податке који се преносе кроз њега.
    </p>
    <p>
      Користимо <a href="https://matomo.org/" target="_blank">Matomo</a>
      за прикупљање анонимних статистика о коришћењу. То укључује вашу скраћену IP адресу (омогућава геолокацију на
      нивоу државе, али не и далешњу идентификацију), ваш прегледач и оперативни систем, одакле сте дошли
      (тј. веб страница с које сте дошли), време и трајање ваше посете и странице које сте посетили. Ове
      информације се чувају на инстанци Matomo која се извршава на серверима mdw &ndash; Универзитета музике и
      извођачких уметности у Бечу и не деле се са трећим лицима.
    </p>
    <p>
      Toolkit Verovio се учитава са <a href="https://verovio.org" target="_blank">https://verovio.org</a>, хостован од
      стране <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
      Ово омогућава mei-friend да буде у току са најновијом верзијом toolkit-a и
      да пружи избор свих подржаних верзија преко панела са поставкама. 
      Када користите mei-friend, ваша IP адреса је видљива RISM Digital-у.
    </p>
    <p>
      На крају, MIDI репродукција се приказује користећи SGM_plus звучни фонт који пружа Google Magenta, и обавља
      преко googleapis.com. Ваша IP адреса је стога видљива Google-у када се иницира MIDI репродукција. Ако
      не желите да се ово дешава, молимо вас да се суздржите од коришћења функције MIDI репродукције.
    </p>
    <p>
      mei-friend је развијен од стране
      <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Вернера Гебла</a> и
      <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">Давида М. Веигла</a> на Катедри за Музичку
      Акустику &ndash; Бечки Стил на mdw &ndash; Универзитету музике и извођачких уметности у Бечу, и
      лиценциран је под
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
            >GNU Affero General Public License v3.0</a
        >. Молимо вас да погледате нашу
        <a href="https://mei-friend.github.io/about/" target="_blank">страницу за признатост</a> за додатне
        информације о сарадницима и open-source компонентама које су поново коришћене у нашем пројекту. Захваљујемо
        се нашим колегама на њиховим доприносима и вођству.
        </p>
        <p>
        Развој mei-friend Веб апликације финансира
        <a href="https://fwf.ac.at" target="_blank">Аустријски фонд за науку (FWF)</a> у оквиру пројеката
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
            >P 34664-G (Signature Sound Vienna)</a
        >
        и <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
        </p>`,
  },
  splashGotItButtonText: { text: 'Разумем!' },
  splashVersionText: { text: 'Верзија' },
  splashAlwaysShow: {
    text: 'Увек приказуј овај почетни екран',
    description: 'Увек приказуј овај почетни екран при подизању апликације',
  },
  splashAlwaysShowLabel: {
    text: 'Увек приказуј овај почетни екран',
    description: 'Увек приказуј овај почетни екран при подизању апликације',
  },

  // Главна трака са менијем
  githubLoginLink: { text: 'Login' },

  month: {
    jan: 'Јануар',
    feb: 'Фебруар',
    mar: 'Март',
    apr: 'Април',
    may: 'Мај',
    jun: 'Јун',
    jul: 'Јул',
    aug: 'Август',
    sep: 'Септембар',
    oct: 'Октобар',
    nov: 'Новембар',
    dec: 'Децембар',
  },
  // FILE MENU ITEM
  fileMenuTitle: { text: 'Датотека' },
  openMeiText: { text: 'Отвори датотеку' },
  openUrlText: { text: 'Отвори УРЛ' },
  openExample: {
    text: 'Јавни репертоар',
    description: 'Отвори листу јавних репертоара',
  },
  importMusicXml: { text: 'Увези МузиксМЛ' },
  importHumdrum: { text: 'Увези Хумдрум' },
  importPae: { text: 'Увези ПАЕ, АБЦ' },
  saveMeiText: { text: 'Сачувај МЕИ' },
  saveMeiBasicText: { text: 'Сачувај као МЕИ основни' },
  saveSvg: { text: 'Сачувај СВГ' },
  saveMidi: { text: 'Сачувај МИДИ' },
  printPreviewText: { text: 'Прегледај ПДФ' },
  generateUrlText: { text: 'Генериши меи-фриенд УРЛ' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Код' },
  undoMenuText: { text: 'Поништи' },
  redoMenuText: { text: 'Понови' },
  startSearchText: { text: 'Претражи' },
  findNextText: { text: 'Пронађи следеће' },
  findPreviousText: { text: 'Пронађи претходно' },
  replaceMenuText: { text: 'Замени' },
  replaceAllMenuText: { text: 'Замени све' },
  indentSelectionText: { text: 'Увуци избор' },
  surroundWithTagsText: { text: 'Ограничи ознакама' },
  surroundWithLastTagText: { text: 'Ограничи са ' },
  jumpToLineText: { text: 'Иди на линију' },
  toMatchingTagText: { text: 'Иди на одговарајућу ознаку' },
  manualValidateText: { text: 'Валидирај' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Приказ' },
  notationTop: { text: 'Нотација горе' },
  notationBottom: { text: 'Нотација доле' },
  notationLeft: { text: 'Нотација лево' },
  notationRight: { text: 'Нотација десно' },
  showSettingsMenuText: { text: 'Панел са подешавањима' },
  showAnnotationMenuText: { text: 'Панел са напоменама' },
  showFacsimileMenuText: { text: 'Панел са факсимилом' },
  showPlaybackControlsText: { text: 'Контроле репродукције' },
  facsimileTop: { text: 'Факсимил горе' },
  facsimileBottom: { text: 'Факсимил доле' },
  facsimileLeft: { text: 'Факсимил лево' },
  facsimileRight: { text: 'Факсимил десно' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Манипулација' },
  invertPlacementText: { text: 'Инвертуј постављање' },
  betweenPlacementText: { text: 'Између постављања' },
  addVerticalGroupText: { text: 'Додај вертикалну групу' },
  deleteText: { text: 'Обриши елемент' },
  pitchChromUpText: { text: 'Висински помак хроматски горе' },
  pitchChromDownText: { text: 'Висински помак хроматски доле' },
  pitchUpDiatText: { text: 'Висински помак дијатонски горе' },
  pitchDownDiatText: { text: 'Висински помак дијатонски доле' },
  pitchOctaveUpText: { text: 'Висински помак 1 октаву горе' },
  pitchOctaveDownText: { text: 'Висински помак 1 октаву доле' },
  staffUpText: { text: 'Елемент 1 став горе' },
  staffDownText: { text: 'Елемент 1 став доле' },
  increaseDurText: { text: 'Повећај трајање' },
  decreaseDurText: { text: 'Смањи трајање' },
  toggleDotsText: { text: 'Toggle dotting' }, // TODO: translate
  cleanAccidText: { text: 'Провери @accid.ges' },
  renumberMeasuresTestText: { text: ' Ренумерирај мере (тест)' },
  renumberMeasuresExecText: { text: ' Ренумерирај мере (изврши)' },
  addIdsText: { text: 'Додај ИД-ове МЕИ' },
  removeIdsText: { text: 'Уклони ИД-ове из МЕИ' },
  reRenderMeiVerovio: { text: ' Поново рендеруј путем Веровио' },
  addFacsimile: { text: 'Додај елемент факсимила' },
  ingestFacsimileText: { text: 'Унеси факсимил' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Уметни' },
  addNoteText: { text: 'Add note' }, // TODO: translate
  convertNoteToRestText: { text: 'Note(s) <=> rest(s)' }, // TODO: translate
  toggleChordText: { text: 'Note(s) <=> chord' }, // TODO: translate
  addDoubleSharpText: { html: 'Дупла оштрица &#119082;' },
  addSharpText: { html: 'Оштрица &#9839;' },
  addNaturalText: { html: 'Природна ознака &#9838;' },
  addFlatText: { html: 'Мека ознака &#9837;' },
  addDoubleFlatText: { html: 'Двострука мека ознака &#119083;' },
  addTempoText: { text: 'Темпо' },
  addDirectiveText: { text: 'Директива' },
  addDynamicsText: { text: 'Динамика' },
  addSlurText: { text: 'Легато' },
  addTieText: { text: 'Легирање' },
  addCrescendoHairpinText: { text: 'Кресцендо дужина' },
  addDiminuendoHairpinText: { text: 'Диминуендо дужина' },
  addBeamText: { text: 'Група нота' },
  addBeamSpanText: { text: 'Размак између група нота' },
  addSuppliedText: { text: 'Исправка' },
  addSuppliedArticText: { text: 'Исправка (Артикулација)' },
  addSuppliedAccidText: { text: 'Исправка (Акцент)' },
  addArpeggioText: { text: 'Арпеджо' },
  addFermataText: { text: 'Фермата' },
  addGlissandoText: { text: 'Глиђандо' },
  addPedalDownText: { text: 'Педала доле' },
  addPedalUpText: { text: 'Педала горе' },
  addTrillText: { text: 'Трил' },
  addTurnText: { text: 'Обрт' },
  addTurnLowerText: { text: 'Обрт према доле' },
  addMordentText: { text: 'Мордент' },
  addMordentUpperText: { text: 'Мордент према горе' },
  addOctave8AboveText: { text: 'Октава (8va изнад)' },
  addOctave15AboveText: { text: 'Октава (15va изнад)' },
  addOctave8BelowText: { text: 'Октава (8va испод)' },
  addOctave15BelowText: { text: 'Октава (15va испод)' },
  addGClefChangeBeforeText: { text: 'Промена Г клуча пре' },
  addGClefChangeAfterText: { text: 'Промена Г клуча после' },
  addFClefChangeBeforeText: { text: 'Промена Ф клуча пре' },
  addFClefChangeAfterText: { text: 'Промена Ф клуча после' },
  addCClefChangeBeforeText: { text: 'Промена Ц клуча пре' },
  addCClefChangeAfterText: { text: 'Промена Ц клуча после' },
  toggleStaccText: { text: 'Стацкато' },
  toggleAccentText: { text: 'Акцент' },
  toggleTenutoText: { text: 'Тенуто' },
  toggleMarcatoText: { text: 'Маркато' },
  toggleStaccissText: { text: 'Стацатисимо' },
  toggleSpiccText: { text: 'Спикато' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Помоћ' },
  goToHelpPageText: { text: 'mei-friend странице за помоћ' },
  goToCheatSheet: { text: 'mei-friend пречице' },
  showChangelog: { text: 'mei-friend дневник промена' },
  goToGuidelines: { text: 'MEI Упутства' },
  consultGuidelinesForElementText: { text: 'Упутства за тренутни елемент' },
  provideFeedback: { text: 'Дајте повратне информације' },
  resetDefault: { text: 'Врати на задато' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Прикажи MIDI контролну траку за репродукцију' },
  showFacsimileButton: { description: 'Прикажи Facsimile панел' },
  showAnnotationsButton: { description: 'Прикажи панел са напоменама' },
  showSettingsButton: { description: 'Прикажи панел са подешавањима' },

  // Footer texts
  leftFooter: {
    html:
      'Hosted by <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'at <a href="https://mdw.ac.at">mdw</a>, with ' +
      heart +
      ' from Vienna. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Импресум</a>.',
  },
  loadingVerovio: { text: 'Учитавање Verovio' },
  verovioLoaded: { text: 'учитан' },
  convertedToPdf: { text: 'претворен у PDF' },
  statusBarCompute: { text: 'Израчун' },
  middleFooterPage: { text: 'страница' },
  middleFooterOf: { text: 'од' },
  middleFooterLoaded: { text: 'учитано' },

  // Control menu
  verovioIcon: {
    description: `Активност mei-friend радника:
    казалјка на сату означава активност Verovija,
    контра-казалјка на сату брзину активности радника`,
  },
  decreaseScaleButton: { description: 'Смањи нотну лествицу' },
  verovioZoom: { description: 'Промени величину нотације' },
  increaseScaleButton: { description: 'Повећај нотну лествицу' },
  pagination1: { html: 'Страница&nbsp;' },
  pagination3: { html: '&nbsp;од' },
  sectionSelect: { description: 'Навигирајте до тренутног елемента' },
  firstPageButton: { description: 'Иди на прву страницу' },
  previousPageButton: { description: 'Иди на претходну страницу' },
  paginationLabel: { description: 'Навигација страницом: кликните да бисте ручно унели број странице за приказивање' },
  nextPageButton: { description: 'Иди на следећу страницу' },
  lastPageButton: { description: 'Иди на последњу страницу' },
  flipCheckbox: { description: 'Аутоматски пребаците страницу на тренутни положај кодирања' },
  flipButton: { description: 'Ручно пребаците страницу на тренутни положај кодирања' },
  breaksSelect: { description: 'Дефинирајте понашање прекида система/странице нотације' },
  breaksSelectNone: { text: 'Ниједан' },
  breaksSelectAuto: { text: 'Аутоматски' },
  breaksSelectMeasure: { text: 'Мјера' },
  breaksSelectLine: { text: 'Систем' },
  breaksSelectEncoded: { text: 'Систем и страница' },
  breaksSelectSmart: { text: 'Паметно' },
  updateControlsLabel: {
    text: 'Ажурирај',
    description: 'Понашање ажурирања контроле нотације након промена у кодирању',
  },
  liveUpdateCheckbox: { description: 'Аутоматски ажурирај нотацију након промена у кодирању' },
  codeManualUpdateButton: { description: 'Ручно ажурирај нотацију' },
  engravingFontSelect: { description: 'Одабир гравирани фонт' },
  backwardsButton: { description: 'Навигација у лево у нотацији' },
  forwardsButton: { description: 'Навигација у десно у нотацији' },
  upwardsButton: { description: 'Навигација према горе у нотацији' },
  downwardsButton: { description: 'Навигација према доле у нотацији' },
  speedLabel: {
    text: 'Брзи режим',
    description:
      'У брзом режиму, само тренутна страница се шаље Veroviu како би се смањило време рендирања код великих датотека',
  },
  // PDF/print preview panel
  pdfSaveButton: { text: 'Сачувај PDF', description: 'Сачувај као PDF' },
  pdfCloseButton: { description: 'Затвори приказ за штампу' },
  pagesLegendLabel: { text: 'Распон страница', singlePage: 'страница', multiplePages: 'Странице' },
  selectAllPagesLabel: { text: 'Све' },
  selectCurrentPageLabel: { text: 'Тренутна страница' },
  selectFromLabel: { text: 'од:' },
  selectToLabel: { text: 'до:' },
  selectPageRangeLabel: { text: 'Распон страница:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Сачуван је само тренутни PDF, јер је активиран брзи режим. ' +
      'Искључите брзи режим да бисте изабрали из свих страница.',
  },
  pdfPreviewNormalModeTitle: { text: 'Изаберите распон страница за сачувати у PDF формату.' },

  // Facsimile panel
  facsimileIcon: { description: 'Панел факсимила' },
  facsimileDecreaseZoomButton: { description: 'Смањи слику нотације' },
  facsimileZoom: { description: 'Прилагоди величину слике нотације' },
  facsimileIncreaseZoomButton: { description: 'Повећај слику нотације' },
  facsimileFullPageLabel: { text: 'Цела страница', description: 'Прикажи целу страницу факсимилне слике' },
  facsimileFullPageCheckbox: { description: 'Прикажи целу страницу факсимилне слике' },
  facsimileShowZonesLabel: { text: 'Прикажи облачиће', description: 'Прикажи облачиће факсимиле' },
  facsimileShowZonesCheckbox: { description: 'Прикажи облачиће факсимиле' },
  facsimileEditZonesCheckbox: { description: 'Уреди облачиће факсимиле' },
  facsimileEditZonesLabel: { text: 'Уреди облачиће', description: 'Уреди облачиће факсимиле' },
  facsimileCloseButton: { description: 'Затвори панел факсимиле' },
  facsimileDefaultWarning: { text: 'Нема садржаја факсимиле за приказ.' },
  facsimileNoSurfaceWarning: {
    text: 'Није пронађен елемент површи за ову страницу.\n(Могуће да недостаје почетни елемент pb.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Факсимиле без облачића је видљиво само у режиму целе странице.' },
  facsimileImgeNotLoadedWarning: { text: 'Слика се не може учитати' },
  // Drag'n'drop
  dragOverlayText: { text: 'Превуците свој улазни фајл овде.' },

  // Public repertoire
  openUrlHeading: { text: 'Отворите енкодирање на вебу путем УРЛ-а' },
  openUrlInstructions: {
    text:
      'Молимо вас да изаберете из јавног репертоара или унесете УРЛ ' +
      'енкодирања музике на вебу испод. Напомена: Сервер домаћин мора ' +
      'да подржава дељење ресурса путем различитих извора (CORS).',
  },
  publicRepertoireSummary: { text: 'Јавни репертоар' },
  sampleEncodingsComposerLabel: { text: 'Композитор:' },
  sampleEncodingsEncodingLabel: { text: 'Енкодирање:' },
  sampleEncodingsOptionLabel: { text: 'Изаберите енкодирање...' },
  openUrlButton: { text: 'Отворите УРЛ' },
  openUrlCancel: { text: 'Откажи' },
  proposePublicRepertoire: {
    html:
      'Добродошли су предлози за ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'додатке јавном репертоару' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Изаберите енкодирање...' },
  openUrlChooseComposerText: { text: 'Изаберите композитора...' },
  openUrlOpenEncodingByUrlText: { text: 'Отворите енкодирање на вебу путем УРЛ-а' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Захтев за GitHub акцијски радни ток:' },
  githubActionsDescription: {
    text: 'Кликните на "Покрени радни ток" како бисте затражили од GitHub API-ја да изврши радни ток за вас, користећи конфигурацију уноса наведену испод. Ваше енкодирање ће се учитати у својој најновијој верзији након што се радни ток заврши.',
  },
  githubActionStatusMsgPrompt: { text: 'Ток се није могао извршити - GitHub обавештава' },
  githubActionStatusMsgWaiting: { text: 'Молимо вас да будете стрпљиви док GitHub обрађује ваш ток...' },
  githubActionStatusMsgFailure: { text: 'Ток се није могао извршити - GitHub обавештава' },
  githubActionStatusMsgSuccess: { text: 'Извршен је ток - GitHub обавештава' },
  githubActionsRunButton: { text: 'Покрени радни ток' },
  githubActionsRunButtonReload: { text: 'Учитај MEI фајл поново' },
  githubActionsCancelButton: { text: 'Откажи' },
  githubActionsInputSetterFilepath: { text: 'Копирај тренутну путању фајла у унос' },
  githubActionsInputSetterSelection: { text: 'Копирај тренутну MEI селекцију у унос' },
  githubActionsInputContainerHeader: { text: 'Конфигурација уноса' },

  // Fork modals
  forkRepoGithubText: { text: 'Направи копију GitHub репозиторијума' },
  forkRepoGithubExplanation: {
    text: 'Линк који сте пратили ' + 'ће направити GitHub копију следећег репозиторијума за уређивање у mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Да ли је ово у реду?' },
  forkRepositoryInstructions: {
    text:
      'Молимо вас да изаберете из јавног репертоара или унесете ' +
      'име корисника или организације на GitHub-у и име репозиторијума на GitHub-у испод. ' +
      'Ваша копија репозиторијума постаће доступна из менија за GitHub.',
  },
  forkRepositoryGithubText: { text: 'Направи копију GitHub репозиторијума' },
  forkRepertoireSummary: { text: 'Јавни репертоар' },
  forkRepertoireComposerLabel: { text: 'Композитор:' },
  forkRepertoireOrganizationLabel: { text: 'Организација:' },
  forkRepertoireOrganizationOption: { text: 'Изаберите GitHub организацију...' },
  forkRepertoireRepositoryLabel: { text: 'Репозиторијум:' },
  forkRepertoireRepositoryOption: { text: 'Изаберите енкодирање...' },
  forkRepositoryInputName: { placeholder: 'Корисник на GitHub-у или организација' },
  forkRepositoryInputRepoOption: { text: 'Изаберите репозиторијум' },
  forkRepositoryToSelectorText: { text: 'Копирај у: ' },
  forkRepositoryButton: { text: 'Направи копију репозиторијума' },
  forkRepositoryCancel: { text: 'Откажи' },
  forkProposePublicRepertoire: {
    html:
      'Добродошли су предлози за ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'додатке јавном репертоару' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Окружи тагом' },
  selectTagNameForEnclosureOkButton: { value: 'У реду' },
  selectTagNameForEnclosureCancelButton: { value: 'Откажи' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solid је децентрализована платформа за друштвени линковани подаци. Пријавите се на Solid како бисте креирали анотације користећи линковане податке (RDF).',
  },
  solidProvider: { description: 'Молимо вас да изаберете Solid идентитет провајдера (IdP) или наведете свој.' },
  solidLoginBtn: { text: 'Пријавите се' },
  solidOverlayCancel: { html: 'Повратак Solid сесије - притисните <span>esc</span> или кликните овде за отказивање' },
  solidWelcomeMsg: { text: 'Добродошли, ' },
  solidLogout: { text: 'Одјава' },
  solidLoggedOutWarning: {
    html: `Одјавили сте се из mei-friend-ове Solid интеграције, али ваш прегледач је и даље пријављен на Solid!
        <a id="solidIdPLogoutLink" target="_blank">Кликните овде да се одјавите са Солида</a>.`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: 'Затвори панел са напоменама' },
  hideAnnotationPanelButton: { description: 'Затвори панел са напоменама' },
  closeAnnotationPanelButton: { description: 'Затвори панел са напоменама' },
  annotationToolsButton: { text: 'Алатке', description: 'Алатке за напомене' },
  annotationListButton: { text: 'Листа', description: 'Листа напомена' },
  writeAnnotStandoffText: { text: 'Web напомена' },
  annotationToolsIdentifyTitle: { text: 'Идентификација' },
  annotationToolsIdentifySpan: { text: 'Идентификација музичког објекта' },
  annotationToolsHighlightTitle: { text: 'Истакни' },
  annotationToolsHighlightSpan: { text: 'Истакни' },
  annotationToolsDescribeTitle: { text: 'Опис' },
  annotationToolsDescribeSpan: { text: 'Опис' },
  annotationToolsLinkTitle: { text: 'Веза' },
  annotationToolsLinkSpan: { text: 'Веза' },
  listAnnotations: { text: 'Нема доступних напомена.' },
  addWebAnnotation: { text: 'Учитај Web напомене' },
  loadWebAnnotationMessage: { text: 'Унесите URL Web напомене или контејнера Web напомена' },
  loadWebAnnotationMessage1: { text: 'Није могуће учитати наведени URL' },
  loadWebAnnotationMessage2: { text: 'покушајте поново' },
  noAnnotationsToDisplay: { text: 'Нема напомена за приказ' },
  flipPageToAnnotationText: { description: 'Пређите на ову напомену' },
  deleteAnnotation: { description: 'Обришите ову напомену' },
  deleteAnnotationConfirmation: { text: 'Да ли сте сигурни да желите да обришете ову напомену?' },
  makeStandOffAnnotation: {
    description: 'Станд-оф статус (RDF)',
    descriptionSolid: 'Упиши у Солид као RDF',
    descriptionToLocal: 'Отвори станд-оф (RDF) напомену у новом табу',
  },
  makeInlineAnnotation: {
    description: 'Кликните за ин-лине напомену',
    descriptionCopy: 'Копирајте xml:id у клипборд',
  },
  pageAbbreviation: { text: 'стр.' },
  elementsPlural: { text: 'елементи' },
  askForLinkUrl: { text: 'Унесите URL за повезивање' },
  drawLinkUrl: { text: 'Отвори у новом табу' },
  askForDescription: { text: 'Унесите текстуални опис за примену' },
  maxNumberOfAnnotationAlert: {
    text1: 'Број елемената напомене прелази конфигурабилни "Максимални број напомена"',
    text2: 'Нове напомене се још увек могу генерисати и приказивати ако је постављено "Прикажи напомене".',
  },
  annotationsOutsideScoreWarning: {
    text: 'Нажалост, тренутно није могуће уписивање напомена изван &lt;score&gt;',
  },
  annotationWithoutIdWarning: {
    text1: 'Није могуће уписивање напомене јер MEI референтна тачка нема xml:id.',
    text2:
      'Молимо вас да доделите идентификаторе тако што ћете изабрати "Манипулација" -> "Поновно рендеровање MEI (са ID-овима)" и покушати поново.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Режим брзине',
    description:
      'Активан је режим брзине; репродукција MIDI-ја је могућа само за тренутну страницу. Да бисте репродуковали цео запис, онемогућите режим брзине.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Сакриј траку за контролу репродукције MIDI-ја' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend Поставке',
    description: 'mei-friend Поставке',
  },
  mfReset: {
    text: 'Подразумеване',
    description: 'Врати на mei-friend подразумеване поставке',
  },
  filterSettings: {
    placeholder: 'Филтрирај поставке',
    description: 'Унесите овде текст за филтрирање поставки',
  },
  closeSettingsButton: {
    description: 'Затвори панел поставки',
  },
  hideSettingsButton: {
    description: 'Затвори панел поставки',
  },
  titleGeneral: {
    text: 'Опште',
    description: 'Опште mei-friend поставке',
  },
  selectToolkitVersion: {
    text: 'Верзија Verovio алатки',
    description:
      'Изаберите верзију Verovio алатки ' +
      '(* Прелазак на старије верзије пре 3.11.0 ' +
      'може захтевати освежавање због проблема са меморијом.)',
  },
  toggleSpeedMode: {
    text: 'Режим брзине',
    description:
      'Прекидач за Verovio режим брзине. ' +
      'У режиму брзине, само тренутна страница ' +
      'се шаље Verovio-у како би се смањило време за рендеровање ' +
      'са великим датотекама',
  },
  selectIdStyle: {
    text: 'Стил генерисаних xml:id-ова',
    description:
      'Стил нових генерисаних xml:id-ова (постојећи xml:id-ови се не мењају)' +
      'нпр., Verovio оригинал: "note-0000001318117900", ' +
      'Verovio база 36: "nophl5o", ' +
      'mei-friend стил: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Додај изјаву о апликацији',
    description:
      'Додајте изјаву о апликацији у опис кодирања у MEI заглављу, која идентификује име апликације, верзију, датум првог и последњег уређивања',
  },
  selectLanguage: {
    text: 'Језик',
    description: 'Изаберите језик интерфејса mei-friend-a.',
  },

  // Drag select
  dragSelection: {
    text: 'Изаберите превлачењем',
    description: 'Изаберите елементе у нотацији помоћу превлачења мишем',
  },
  dragSelectNotes: {
    text: 'Изаберите ноте',
    description: 'Изаберите ноте',
  },
  dragSelectRests: {
    text: 'Изаберите паузе',
    description: 'Изаберите паузе и повторе (пауза, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Изаберите елементе позиције',
    description: 'Изаберите елементе позиције (тј. са @placement атрибутом: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Изаберите лакте',
    description: 'Изаберите лакте (тј. елементе са @curvature атрибутом: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Изаберите мере',
    description: 'Изаберите мере',
  },

  // Control menu
  controlMenuSettings: {
    text: 'Трака контроле нотације',
    description: 'Дефинише ставке које ће бити приказане у менију контроле изнад нотације',
  },
  controlMenuFlipToPageControls: {
    text: 'Прикажи контроле за прелазак на страну',
    description: 'Прикажи контроле за прелазак на страну у менију контроле нотације',
  },
  controlMenuUpdateNotation: {
    text: 'Прикажи контроле ажурирања нотације',
    description: 'Прикажи контроле ажурирања нотације у менију контроле нотације',
  },
  controlMenuFontSelector: {
    text: 'Прикажи бирач фонта нотације',
    description: 'Прикажи бирач фонта (SMuFL) у менију контроле нотације',
  },
  controlMenuNavigateArrows: {
    text: 'Прикажи стрелице навигације',
    description: 'Прикажи стрелице навигације нотације у менију контроле нотације',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Прикажи кућицу за режим брзине',
    description: 'Прикажи кућицу за режим брзине нотације у менију контроле нотације',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI репродукција',
    description: 'Поставке MIDI репродукције',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Прикажи пречицу за репродукцију',
    description:
      'Узрокује приказ пречице (мехурић у долатњем левом углу; ' +
      'кликните да одмах почнете репродукцију) када је трака контроле MIDI репродукције затворена',
  },
  showMidiPlaybackControlBar: {
    text: 'Прикажи траку контроле MIDI репродукције',
    description: 'Прикажи траку контроле MIDI репродукције',
  },
  scrollFollowMidiPlayback: {
    text: 'Прати MIDI репродукцију превлачењем',
    description: 'Померај панел нотације како би следио MIDI репродукцију на тренутној страници',
  },
  pageFollowMidiPlayback: {
    text: 'Прати MIDI репродукцију по странама',
    description: 'Аутоматски прелази на стране како би следио MIDI репродукцију',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Истакните тренутно звучне ноте',
    description: 'Визуелно истакните тренутно звучне ноте у панелу нотације током MIDI репродукције ',
  },
  selectMidiExpansion: {
    text: 'Репродукција проширења',
    description: 'Изаберите елемент проширења који ће се користити за MIDI репродукцију',
  },

  // Transposition
  titleTransposition: {
    text: 'Транспоновање',
    description: 'Транспоновање информација о нотама',
  },
  enableTransposition: {
    text: 'Омогућите транспоновање',
    description:
      'Омогућите поставке транспоновања, које ће се применити кликом на дугме за транспоновање испод. Транспоновање ће се применити само на нотацију, кодирање остане непромењено, осим ако не кликнете на ставку "Поново рендерујте помоћу Веровио" у менију "Манипулиши".',
  },
  transposeInterval: {
    text: 'Транспонујте по интервалу',
    description:
      'Транспонујте кодирање по хроматском интервалу помоћу најчешћих интервала (Веровио подржава основни систем бројева 40)',
    labels: [
      'Савршен унизон',
      'Повећани унизон',
      'Уманјени други',
      'Мален други',
      'Велики други',
      'Повећани други',
      'Уманјени трећи',
      'Мален трећи',
      'Велики трећи',
      'Повећани трећи',
      'Уманјени четврти',
      'Савршен четврти',
      'Повећани четврти',
      'Уманјени пети',
      'Савршен пети',
      'Повећани пети',
      'Уманјени шести',
      'Мален шести',
      'Велики шести',
      'Повећани шести',
      'Уманјени седми',
      'Мален седми',
      'Велики седми',
      'Повећани седми',
      'Уманјени осмина',
      'Савршена осмина',
    ],
  },
  transposeKey: {
    text: 'Транспонујте до тона',
    description: 'Транспонујте до тона',
    labels: [
      'C# дур / A# мол',
      'F# дур / D# мол',
      'B дур / G# мол',
      'E дур / C# мол',
      'A дур / F# мол',
      'D дур / B мол',
      'G дур / E мол',
      'C дур / A мол',
      'F дур / D мол',
      'Bb дур / G мол',
      'Eb дур / C мол',
      'Ab дур / F мол',
      'Db дур / Bb мол',
      'Gb дур / Eb мол',
      'Cb дур / Ab мол',
    ],
  },
  transposeDirection: {
    text: 'Смер транспоновања',
    description: 'Смер транспоновања (горе/доле)',
    labels: ['Горе', 'Доле', 'Најближи'],
  },
  transposeButton: {
    text: 'Транспонујте',
    description:
      'Примените транспоновање са поставкама изнад на нотацију, док кодирање остане непромењено. Да бисте такође транспоновали кодирање MEI са тренутним поставкама, користите "Поново рендерујте помоћу Веровио" у менију "Манипулиши".',
  },

  // Ренумерација такта
  renumberMeasuresHeading: {
    text: 'Ренумерација такта',
    description: 'Поставке за ренумерацију тактова',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Настави преко непотпуних тактова',
    description: 'Настави бројање тактова преко непотпуних тактова (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Суфикс код непотпуних тактова',
    description: 'Користи бројни суфикс код непотпуних тактова (нпр. 23-cont)',
    labels: ['ништа', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Настави преко крајева',
    description: 'Настави бројање тактова преко крајева',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Суфикс код крајева',
    description: 'Користи бројни суфикс код крајева (нпр. 23-a)',
  },

  // Напомене
  titleAnnotations: {
    text: 'Напомене',
    description: 'Поставке за напомене',
  },
  showAnnotations: {
    text: 'Прикажи напомене',
    description: 'Прикажи напомене у нотацији',
  },
  showAnnotationPanel: {
    text: 'Прикажи панел за напомене',
    description: 'Прикажи панел за напомене',
  },
  annotationDisplayLimit: {
    text: 'Максималан број напомена',
    description: 'Максималан број напомена за приказивање (велики бројеви могу усчитати mei-friend)',
  },

  // Факсимил
  titleFacsimilePanel: {
    text: 'Факсимил панел',
    description: 'Прикажи слике изворног издања, ако су доступне',
  },
  showFacsimilePanel: {
    text: 'Прикажи факсимил панел',
    description: 'Прикажи слике ноте из изворног издања које су приложене у елементу факсимила',
  },
  selectFacsimilePanelOrientation: {
    text: 'Положај факсимил панела',
    description: 'Одабери положај факсимил панела у односу на нотацију',
    labels: ['лево', 'десно', 'горе', 'доле'],
  },
  facsimileZoomInput: {
    text: 'Увећање факсимил слике (%)',
    description: 'Ниво увећања факсимил слике (у процентима)',
  },
  showFacsimileFullPage: {
    text: 'Прикажи целу страницу',
    description: 'Прикажи факсимил слику на целој страници',
  },
  showFacsimileZones: {
    text: 'Прикажи оквире за факсимил',
    description: 'Прикажи оквире за области факсимила',
  },
  editFacsimileZones: {
    text: 'Уреди области факсимила',
    description: 'Уреди области факсимила (повезаће оквире са областима факсимила)',
  },
  showFacsimileTitles: {
    text: 'Show facsimile titles', // TODO: translate
    description: 'Show facsimile titles above source images', // TODO: translate
  },

  // Елементи допуне
  titleSupplied: {
    text: 'Управљање уредничким садржајем',
    description: 'Контрола управљања <supplied> елементима',
  },
  showSupplied: {
    text: 'Прикажи <supplied> елементе',
    description: 'Истакни све елементе садржане у <supplied> елементу',
  },
  suppliedColor: {
    text: 'Изабери боју за <supplied> елементе',
    description: 'Изабери боју за истицање <supplied> елемената',
  },
  respSelect: {
    text: 'Изабери одговорност за <supplied> елементе',
    description: 'Изабери одговорност ID-а',
  },

  // ПОСТАВКЕ УРЕЂИВАЧА / ПОСТАВКЕ КОДМИРА
  editorSettingsHeader: {
    text: 'Поставке уређивача',
  },
  cmReset: {
    text: 'Подразумевано',
    description: 'Врати се на mei-friend подразумеване поставке',
  },
  titleAppearance: {
    text: 'Изглед уређивача',
    description: 'Контролише изглед уређивача',
  },
  zoomFont: {
    text: 'Величина фонта (%)',
    description: 'Промени величину фонта уређивача (у процентима)',
  },
  theme: {
    text: 'Тема',
    description: 'Изабери тему уређивача',
  },
  matchTheme: {
    text: 'Нотација одговара теми',
    description: 'Упари нотацију са темом боја уређивача',
  },
  tabSize: {
    text: 'Величина табулатора',
    description: 'Број празних места за сваки ниво увлачења',
  },
  lineWrapping: {
    text: 'Преламање линија',
    description: 'Да ли се линије преламају на крају панела или не',
  },
  lineNumbers: {
    text: 'Бројеви линија',
    description: 'Прикажи бројеве линија',
  },
  firstLineNumber: {
    text: 'Први број линије',
    description: 'Постави први број линије',
  },
  foldGutter: {
    text: 'Склапање кода',
    description: 'Омогући склапање кода путем рубова за склапање',
  },
  titleEditorOptions: {
    text: 'Понашање уређивача',
    description: 'Контролише понашање уређивача',
  },
  autoValidate: {
    text: 'Аутоматска валидација',
    description: 'Аутоматски валидирај код према шеми након сваке измене',
  },
  autoShowValidationReport: {
    text: 'Аутоматски прикажи извештај о валидацији',
    description: 'Аутоматски прикажи извештај о валидацији након што је валидација извршена',
  },
  autoCloseBrackets: {
    text: 'Аутоматско затварање заграда',
    description: 'Аутоматски затварај заграде приликом уноса',
  },
  autoCloseTags: {
    text: 'Аутоматско затварање ознака',
    description: 'Аутоматски затварај ознаке приликом уноса',
    type: 'bool',
  },
  matchTags: {
    text: 'Упаривање ознака',
    description: 'Истиче упарене ознаке око курсора уређивача',
  },
  showTrailingSpace: {
    text: 'Истичи празна места на крају',
    description: 'Истиче непотребна празна места на крају линија',
  },
  keyMap: {
    text: 'Мапа тастера',
    description: 'Изабери мапу тастера',
  },
  persistentSearch: {
    text: 'Trajni pretraživač',
    description: 'Koristi ponašanje trajnog pretraživača (pretraživač ostaje otvoren dok se eksplicitno ne zatvori)',
  },

  // Поставке Веровиа
  verovioSettingsHeader: {
    text: 'Поставке Веровиа',
  },
  vrvReset: {
    text: 'Подразумевано',
    description: 'Поништи Веровио на меи-фриенд подразумеване поставке',
  },

  // Alert поруке у main.js
  isSafariWarning: {
    text:
      'Чини се да користите Сафари као свој прегледник, на којем ' +
      'меи-фриенд, на жалост, не подржава валидацију шеме. ' +
      'Молимо користите други прегледник за потпуну подршку за валидацију.',
  },
  githubLoggedOutWarning: {
    text: `Излоговали сте се из меи-фриенд GitHub интеграције, али ваш прегледник је и даље пријављен на GitHub!
    <a href="https://github.com/logout" target="_blank">Кликните овде да се излогујете са GitHub-а</a>.`,
  },
  generateUrlError: {
    text: 'Није могуће генерисати URL за локални фајл ',
  },
  generateUrlSuccess: {
    text: 'URL успешно копиран у привремену меморију',
  },
  generateUrlNotCopied: {
    text: 'URL није копиран у привремену меморију, молимо покушајте поново!',
  },
  errorCode: { text: 'Код грешке' },
  submitBugReport: { text: 'Пошаљи извештај о грешци' },
  loadingSchema: { text: 'Учитавање шеме' },
  schemaLoaded: { text: 'Шема учитана' },
  noSchemaFound: { text: 'Нема информација о шеми у MEI.' },
  schemaNotFound: { text: 'Шема није пронађена' },
  errorLoadingSchema: { text: 'Грешка при учитавању шеме' },
  notValidated: { text: 'Није валидирано. Притисните овде да бисте валидирали.' },
  validatingAgainst: { text: 'Валидација против' },
  validatedAgainst: { text: 'Валидирано против' },
  validationMessages: { text: 'поруке о валидацији' },
  validationComplete: { text: 'Валидација завршена' },
  validationFailed: { text: 'Валидација није успела' },
  noErrors: { text: 'нема грешака' },
  errorsFound: { text: 'пронађене су грешке' }, // пронађено 5 грешака

  // GitHub-menu.js
  githubRepository: { text: 'Репозиторијум' },
  githubBranch: { text: 'Грана' },
  githubFilepath: { text: 'Путања' },
  githubCommit: { text: 'Комит' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Комитуј као нови фајл' } }, value: 'Комитуј' },
  commitLog: { text: 'Запис комита' },
  githubDate: { text: 'Датум' },
  githubAuthor: { text: 'Аутор' },
  githubMessage: { text: 'Порука' },
  none: { text: 'Ништа' },
  commitFileNameText: { text: 'Име фајла' },
  forkRepository: { text: 'Форкуј репозиторијум' },
  forkError: { text: 'Извињавамо се, није могуће форковање репозиторијума' },
  loadingFile: { text: 'Учитавање фајла' },
  loadingFromGithub: { text: 'Учитавање са GitHub-а' },
  logOut: { text: 'Одјави се' },
  githubLogout: { text: 'Одјави се' },
  selectRepository: { text: 'Изаберите репозиторијум' },
  selectBranch: { text: 'Изаберите грану' },
  commitMessageInput: { placeholder: 'Ажурирано коришћењем mei-friend онлине' },
  reportIssueWithEncoding: { value: 'Пријави проблем са кодирањем' },
  clickToOpenInMeiFriend: { text: 'Кликните да отворите у mei-friend' },
  repoAccessError: { text: 'Извињавамо се, немогућ приступ репозиторијумима за датог корисника или организацију' },
  allComposers: { text: 'Сви композитори' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: 'Пребројавање тактова' },
  renumberMeasuresModalTest: { text: 'Тест' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'било би' },
  renumberMeasuresChangedTo: { text: 'промењено у' },
  renumberMeasureMeasuresRenumbered: { text: 'тактова је пребројано' },

  // Code checker @accid.ges
  codeCheckerTitle: { text: 'Провера @accid.ges атрибута (против тонова, акциденталних тонова по тактовима и веза).' },
  codeCheckerFix: { text: 'Исправи' },
  codeCheckerFixAll: { text: 'Исправи све' },
  codeCheckerIgnore: { text: 'Занемари' },
  codeCheckerIgnoreAll: { text: 'Занемари све' },
  codeCheckerCheckingCode: { text: 'Проверавање кода...' },
  codeCheckerNoAccidMessagesFound: { text: 'Сви @accid.ges атрибути изгледају исправно.' },
  codeCheckerMeasure: { text: 'Такт' },
  codeCheckerNote: { text: 'Напомена' },
  codeCheckerHasBoth: { text: 'има и' },
  codeCheckerAnd: { text: 'и' },
  codeCheckerRemove: { text: 'Уклони' },
  codeCheckerFixTo: { text: 'Исправи на' },
  codeCheckerAdd: { text: 'Додај' },
  codeCheckerWithContradictingContent: { text: 'са контрадикторним садржајем' },
  codeCheckerTiedNote: { text: 'Повезана нота' },
  codeCheckerNotSamePitchAs: { text: 'није истог тона као' },
  codeCheckerNotSameOctaveAs: { text: 'није исте октаве као' },
  codeCheckerNotSameAsStartingNote: { text: 'није исто као у почетној ноти' },
  codeCheckerExtra: { text: 'сувишно' }, // суперфлуозно
  codeCheckerHasExtra: { text: 'има сувишно' }, // има суперфлуозно
  codeCheckerLacksAn: { text: 'недостаје' },
  codeCheckerBecauseAlreadyDefined: { text: 'зато што је већ дефинисано раније у такту' },

  // Упозорење за недостајућим идентификаторима
  missingIdsWarningAlertOnScrolling: {
    text: 'mei-friend не може да се помери до изабраних елемената у кодирању. Молимо додајте идентификаторе у кодирање.',
  },
  missingIdsWarningAlertOnLoading: {
    text: 'Постоји барем један markup елемент унутар надређеног елемента без xml:id. mei-friend не може обрадити markup у фајловима без ID-ова. Молимо додајте ID-ове у кодирање.'
  },  
};
