/**
 * Language file for Chinese (zh)
 * Thanks to Jian Jiang for proofreading and substantial corrections.
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Splash screen
  aboutMeiFriend: { text: '关于 mei-friend' },
  showSplashScreen: {
    text: '加载时显示启动画面',
    description: '当应用程序加载时显示 mei-friend 启动画面',
  },
  splashUpdateIndicator: {
    html: `
      自您上次确认启动画面以来，以下文本已更新。有关详细信息，请<a href="${getChangelogUrl()}" target="_blank">查阅更新日志</a>。`,
  },
  splashLastUpdated: { text: '文本最后更新于：' },
  splashBody: {
    html: `
      <p>
        mei-friend 是一个 <a href="https://music-encoding.org">音乐编码</a> 编辑器，托管在
        <a href="https://mdw.ac.at" target="_blank">维也纳音乐与表演艺术大学</a>。
        请查阅我们的<a href="https://mei-friend.github.io" target="_blank">详细文档</a>以获取更多信息。
      </p>
      <p>
        尽管 mei-friend 是一个基于浏览器的应用程序，但您的个人数据（包括您正在编辑的编码、应用程序设置以及当前的登录详细信息（如果有））存储在您浏览器的<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">本地存储</a>中，并未存储在我们的服务器上。
      </p>
      <p>
        仅当您明确请求时（例如，当您登录 GitHub，从 GitHub 仓库加载您的编码或提交到 GitHub 仓库，或当您请求运行 GitHub Action 工作流时），数据才会传输到 GitHub。同样，仅当您明确请求时（例如，当您登录 Solid，或加载或保存独立注释时），数据才会传输到您选择的 Solid 提供商。出于技术原因，与 GitHub 的某些交互（在首次打开编码时将仓库克隆到您的浏览器，或提交更改到仓库）需要将数据传输到由维也纳音乐与表演艺术大学托管的代理服务器。该服务器充当您的浏览器和 GitHub 之间的中介，不会存储通过它传输的任何数据。
      </p>
      <p>
        我们使用 <a href="https://matomo.org/" target="_blank">Matomo</a>
        收集匿名使用统计信息。这些信息包括您的截断 IP 地址（允许国家级地理位置但不能进一步识别）、您的浏览器和操作系统、您从哪里到达（即，引用网站）、访问的时间和持续时间以及访问的页面。
        这些信息存储在运行在维也纳音乐与表演艺术大学服务器上的 Matomo 实例中，不会与任何第三方共享。
      </p>
      <p>
        鲁特类指法谱使用由 Paul Overell 开发的 
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a>转换为 MEI，通过由 Stefan Szepe 开发的
        <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui 服务</a> 托管于
        <a href="https://luteconv.mdw.ac.at" target="_blank">维也纳音乐与表演艺术大学</a> 。
        该服务在转换过程中创建您编码的 Web 可访问副本，但这些副本仅通过唯一的链接哈希值可访问，并会定期删除。
      </p>
      <p>
        Verovio 工具包从 <a href="https://verovio.org" target="_blank">https://verovio.org</a> 加载，由
        <a href="https://rism.digital/" target="_blank">瑞士 RISM 数字</a> 托管。
        这使得 mei-friend 能够保持最新的工具包版本，并通过设置面板提供所有支持版本的选择。
        因此，当使用 mei-friend 时，您的 IP 地址将对 RISM 数字可见。
      </p>
      <p>
        MIDI 回放使用 Google Magenta 提供的 SGM_plus 音色，并通过 googleapis.com 提供。
        当启动 MIDI 回放时，您的 IP 地址将对 Google 可见。如果您不希望这样，请不要使用 MIDI 回放功能。
      </p>
      <p>
        mei-friend 由
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> 和
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> 在
        维也纳音乐与表演艺术大学的音乐声学系开发，
        并根据
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank">GNU Affero 通用公共许可证第3版</a>
        许可。请查阅我们的
        <a href="https://mei-friend.github.io/about/" target="_blank">致谢页面</a>以获取有关贡献者和我们项目中重用的开源组件的更多信息。感谢我们的同事们的贡献和指导。
      </p>
      <p>
        mei-friend Web 应用程序的开发由
        <a href="https://fwf.ac.at" target="_blank">奥地利科学基金会（FWF）</a> 项目
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank">P 34664-G（维也纳签名声音）</a>
        和 <a href="https://e-laute.info">I 6019（E-LAUTE）</a> 资助。
      </p>`,
  },
  splashGotItButtonText: { text: '知道了！' },
  splashVersionText: { text: '版本' },
  splashAlwaysShow: {
    text: '始终显示此启动画面',
    description: '应用程序加载时始终显示此启动画面',
  },
  splashAlwaysShowLabel: {
    text: '始终显示此启动画面',
    description: '应用程序加载时始终显示此启动画面',
  },

  // Main menu bar
  githubLoginLink: { text: '登录' },

  month: {
    jan: '一月',
    feb: '二月',
    mar: '三月',
    apr: '四月',
    may: '五月',
    jun: '六月',
    jul: '七月',
    aug: '八月',
    sep: '九月',
    oct: '十月',
    nov: '十一月',
    dec: '十二月',
  },

  // FILE MENU ITEM
  fileMenuTitle: { text: '文件' },
  openMeiText: { text: '打开文件' },
  openUrlText: { text: '打开 URL' },
  openExample: {
    text: '公共曲目',
    description: '打开公共领域曲目列表',
  },
  importMusicXml: { text: '导入 MusicXML' },
  importHumdrum: { text: '导入 Humdrum' },
  importPae: { text: '导入 PAE，ABC' },
  saveMeiText: { text: '保存 MEI' },
  saveMeiBasicText: { text: '另存为 MEI 基本版' },
  saveSvg: { text: '保存 SVG' },
  saveMidi: { text: '保存 MIDI' },
  printPreviewText: { text: '预览 PDF' },
  generateUrlText: { text: '生成 mei-friend URL' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: '代码' },
  undoMenuText: { text: '撤销' },
  redoMenuText: { text: '重做' },
  startSearchText: { text: '搜索' },
  findNextText: { text: '查找下一个' },
  findPreviousText: { text: '查找上一个' },
  replaceMenuText: { text: '替换' },
  replaceAllMenuText: { text: '全部替换' },
  indentSelectionText: { text: '缩进选择' },
  surroundWithTagsText: { text: '用标签包围' },
  surroundWithLastTagText: { text: '用上一个标签包围' },
  jumpToLineText: { text: '跳到行' },
  toMatchingTagText: { text: '转到匹配标签' },
  manualValidateText: { text: '验证' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: '视图' },
  notationTop: { text: '乐谱顶部' },
  notationBottom: { text: '乐谱底部' },
  notationLeft: { text: '乐谱左侧' },
  notationRight: { text: '乐谱右侧' },
  showSettingsMenuText: { text: '设置面板' },
  showAnnotationMenuText: { text: '注释面板' },
  showFacsimileMenuText: { text: '摹本面板' },
  showPlaybackControlsText: { text: '播放控制' },
  facsimileTop: { text: '摹本顶部' },
  facsimileBottom: { text: '摹本底部' },
  facsimileLeft: { text: '摹本左侧' },
  facsimileRight: { text: '摹本右侧' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: '操作' },
  invertPlacementText: { text: '反转布局' },
  betweenPlacementText: { text: '在布局之间' },
  addVerticalGroupText: { text: '添加纵向组' },
  deleteText: { text: '删除元素' },
  pitchChromUpText: { text: '半音升高' },
  pitchChromDownText: { text: '半音降低' },
  pitchUpDiatText: { text: '自然音升高' },
  pitchDownDiatText: { text: '自然音降低' },
  pitchOctaveUpText: { text: '升高一个八度' },
  pitchOctaveDownText: { text: '降低一个八度' },
  staffUpText: { text: '元素上移一个谱表' },
  staffDownText: { text: '元素下移一个谱表' },
  increaseDurText: { text: '增加时值' },
  decreaseDurText: { text: '减少时值' },
  toggleDotsText: { text: '切换附点' },
  cleanAccidText: { text: '检查 @accid.ges' },
  meterConformanceText: { text: '检查 @metcon' },
  renumberMeasuresTestText: { text: '重编号小节（测试）' },
  renumberMeasuresExecText: { text: '重编号小节（执行）' },
  addIdsText: { text: '为 MEI 添加 id' },
  removeIdsText: { text: '从 MEI 中移除 id' },
  reRenderMeiVerovio: { text: '通过 Verovio 重新渲染' },
  addFacsimile: { text: '添加摹本元素' },
  ingestFacsimileText: { text: '摄取摹本' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: '插入' },
  addNoteText: { text: '添加音符' },
  convertNoteToRestText: { text: '音符 <=> 休止符' },
  toggleChordText: { text: '音符 <=> 和弦' },
  addDoubleSharpText: { html: '重升号 &#119082;' },
  addSharpText: { html: '升号 &#9839;' },
  addNaturalText: { html: '还原号 &#9838;' },
  addFlatText: { html: '降号 &#9837;' },
  addDoubleFlatText: { html: '重降号 &#119083;' },
  addTempoText: { text: '速度' },
  addDirectiveText: { text: '指示' },
  addDynamicsText: { text: '力度' },
  addSlurText: { text: '连音线' },
  addTieText: { text: '连线' },
  addCrescendoHairpinText: { text: '渐强' },
  addDiminuendoHairpinText: { text: '渐弱' },
  addBeamText: { text: '符尾连线' },
  addBeamSpanText: { text: '符尾连线范围' },
  addSuppliedText: { text: '补充' },
  addSuppliedArticText: { text: '补充（Artic）' },
  addSuppliedAccidText: { text: '补充（Accid）' },
  addArpeggioText: { text: '琶音' },
  addFermataText: { text: '延长' },
  addGlissandoText: { text: '滑音' },
  addPedalDownText: { text: '踩踏板' },
  addPedalUpText: { text: '放开踏板' },
  addTrillText: { text: '颤音' },
  addTurnText: { text: '回音' },
  addTurnLowerText: { text: '下回音' },
  addMordentText: { text: '波音' },
  addMordentUpperText: { text: '上波音' },
  addOctave8AboveText: { text: '八度（8va 上）' },
  addOctave15AboveText: { text: '八度（15va 上）' },
  addOctave8BelowText: { text: '八度（8va 下）' },
  addOctave15BelowText: { text: '八度（15va 下）' },
  addGClefChangeBeforeText: { text: 'G 谱号在前面' },
  addGClefChangeAfterText: { text: 'G 谱号在后面' },
  addFClefChangeBeforeText: { text: 'F 谱号在前面' },
  addFClefChangeAfterText: { text: 'F 谱号在后面' },
  addCClefChangeBeforeText: { text: 'C 谱号在前面' },
  addCClefChangeAfterText: { text: 'C 谱号在后面' },
  toggleStaccText: { text: '断音Staccato' },
  toggleAccentText: { text: '重音Accent' },
  toggleTenutoText: { text: '保持音Tenuto' },
  toggleMarcatoText: { text: '强调音Marcato' },
  toggleStaccissText: { text: '极断音Staccatissimo' },
  toggleSpiccText: { text: '跳音Spiccato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: '帮助' },
  goToHelpPageText: { text: 'mei-friend 帮助页面' },
  goToCheatSheet: { text: 'mei-friend 备忘单' },
  showChangelog: { text: 'mei-friend 更新日志' },
  goToGuidelines: { text: 'MEI 指南' },
  consultGuidelinesForElementText: { text: '当前元素的指南条目' },
  provideFeedback: { text: '提供反馈' },
  resetDefault: { text: '恢复默认' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: '切换 MIDI 播放控制栏' },
  showFacsimileButton: { description: '切换摹本面板' },
  showAnnotationsButton: { description: '切换注释面板' },
  showSettingsButton: { description: '显示设置面板' },

  // Footer texts
  leftFooter: {
    html:
      '托管于 <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      '在 <a href="https://mdw.ac.at">mdw</a>，来自维也纳的 ' +
      heart +
      '。 ' +
      '<a href="https://iwk.mdw.ac.at/impressum">版权声明</a>。',
  },
  loadingVerovio: { text: '正在加载 Verovio' },
  verovioLoaded: { text: '已加载' },
  convertedToPdf: { text: '转换为 PDF' },
  statusBarCompute: { text: '计算' },
  middleFooterPage: { text: '第' },
  middleFooterOf: { text: '页，共' },
  middleFooterLoaded: { text: '页已加载' },

  // Control menu
  verovioIcon: {
    description: `mei-friend 工作器活动：
    顺时针旋转表示 Verovio 活动，
    逆时针旋转表示工作器活动速度`,
  },
  decreaseScaleButton: { description: '缩小乐谱' },
  verovioZoom: { description: '调整乐谱大小' },
  increaseScaleButton: { description: '放大乐谱' },
  pagination1: { html: '页&nbsp;' },
  pagination3: { html: '&nbsp;共' },
  sectionSelect: { description: '导航编码部分/结尾结构' },
  firstPageButton: { description: '翻到第一页' },
  previousPageButton: { description: '翻到上一页' },
  paginationLabel: { description: '页面导航：点击手动输入要显示的页码' },
  nextPageButton: { description: '翻到下一页' },
  lastPageButton: { description: '翻到最后一页' },
  flipCheckbox: { description: '自动翻页到编码光标位置' },
  flipButton: { description: '手动翻页到编码光标位置' },
  breaksSelect: { description: '定义乐谱系统/分页符行为' },
  breaksSelectNone: { text: '无' },
  breaksSelectAuto: { text: '自动' },
  breaksSelectMeasure: { text: '小节' },
  breaksSelectLine: { text: '系统' },
  breaksSelectEncoded: { text: '系统和页面' },
  breaksSelectSmart: { text: '智能' },
  updateControlsLabel: { text: '更新', description: '在编码变化后控制乐谱更新行为' },
  liveUpdateCheckbox: { description: '在编码变化后自动更新乐谱' },
  codeManualUpdateButton: { description: '手动更新乐谱' },
  engravingFontSelect: { description: '选择雕刻字体' },
  backwardsButton: { description: '在乐谱中向左导航' },
  forwardsButton: { description: '在乐谱中向右导航' },
  upwardsButton: { description: '在乐谱中向上导航' },
  downwardsButton: { description: '在乐谱中向下导航' },
  speedLabel: {
    text: '速度模式',
    description: '在速度模式下，仅将当前页发送到 Verovio 以减少大文件的渲染时间',
  },

  // PDF/print preview panel
  pdfSaveButton: { text: '保存 PDF', description: '保存为 PDF' },
  pdfCloseButton: { description: '关闭打印预览' },
  pagesLegendLabel: { text: '页码范围', singlePage: '页', multiplePages: '页' },
  selectAllPagesLabel: { text: '全部' },
  selectCurrentPageLabel: { text: '当前页' },
  selectFromLabel: { text: '从：' },
  selectToLabel: { text: '到：' },
  selectPageRangeLabel: { text: '页码范围：' },
  pdfPreviewSpeedModeWarning: {
    text: '由于激活了速度模式，仅将当前页渲染为 PDF。' + '取消选中速度模式以选择所有页面。',
  },
  pdfPreviewNormalModeTitle: { text: '选择要保存为 PDF 的页码范围。' },

  // Facsimile panel
  facsimileIcon: { description: '摹本面板' },
  facsimileDecreaseZoomButton: { description: '缩小摹本' },
  facsimileZoom: { description: '调整摹本大小' },
  facsimileIncreaseZoomButton: { description: '放大摹本' },
  facsimileFullPageLabel: { text: '全页', description: '显示摹本全页' },
  facsimileFullPageCheckbox: { description: '显示摹本全页' },
  facsimileShowZonesLabel: { text: '显示区域框', description: '显示摹本区域框' },
  facsimileShowZonesCheckbox: { description: '显示摹本区域框' },
  facsimileEditZonesCheckbox: { description: '编辑摹本区域' },
  facsimileEditZonesLabel: { text: '编辑区域', description: '编辑摹本区域' },
  facsimileCloseButton: { description: '关闭摹本面板' },
  facsimileDefaultWarning: { text: '没有摹本内容可显示。' },
  facsimileNoSurfaceWarning: {
    text: '未找到此页面的表面元素。\n（可能缺少初始 pb 元素。）',
  },
  facsimileNoZonesFullPageWarning: { text: '没有区域的摹本仅在全页模式下可见。' },
  facsimileImgeNotLoadedWarning: { text: '无法加载图片' },

  // Drag'n'drop
  dragOverlayText: { text: '将输入文件拖到此处。' },

  // Public repertoire
  openUrlHeading: { text: '通过 URL 打开 Web 托管的编码' },
  openUrlInstructions: {
    text: '请选择公共曲目或输入下方的 Web 托管音乐编码的 URL。注意：主机服务器必须支持跨域资源共享（CORS）。',
  },
  publicRepertoireSummary: { text: '公共曲目' },
  sampleEncodingsComposerLabel: { text: '作曲家：' },
  sampleEncodingsEncodingLabel: { text: '编码：' },
  sampleEncodingsOptionLabel: { text: '选择编码...' },
  openUrlButton: { text: '打开 URL' },
  openUrlCancel: { text: '取消' },
  proposePublicRepertoire: {
    html:
      '我们欢迎 ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank">公共曲目添加建议</a>。',
  },
  openUrlChooseEncodingText: { text: '选择编码...' },
  openUrlChooseComposerText: { text: '选择作曲家...' },
  openUrlOpenEncodingByUrlText: { text: '通过 URL 打开 Web 托管的编码' },

  // GitHub actions modal
  githubActionsHeadingText: { text: '请求 GitHub Action 工作流：' },
  githubActionsDescription: {
    text: '点击“运行工作流”以请求 GitHub API 为您运行上述工作流，使用下面指定的输入配置。工作流运行完成后，您的编码将重新加载为最新版本。',
  },
  githubActionStatusMsgPrompt: { text: '无法运行工作流 - GitHub 显示' },
  githubActionStatusMsgWaiting: { text: '请耐心等待 GitHub 处理您的工作流...' },
  githubActionStatusMsgFailure: { text: '无法运行工作流 - GitHub 显示' },
  githubActionStatusMsgSuccess: { text: '工作流运行完成 - GitHub 显示' },
  githubActionsRunButton: { text: '运行工作流' },
  githubActionsRunButtonReload: { text: '重新加载 MEI 文件' },
  githubActionsCancelButton: { text: '取消' },
  githubActionsInputSetterFilepath: { text: '复制当前文件路径到输入' },
  githubActionsInputSetterSelection: { text: '复制当前 MEI 选择到输入' },
  githubActionsInputContainerHeader: { text: '输入配置' },

  // Fork modals
  forkRepoGithubText: { text: 'Fork Github 仓库' },
  forkRepoGithubExplanation: {
    text: '您跟随的链接将创建以下仓库的 GitHub fork 以便在 mei-friend 中编辑：',
  },
  forkRepoGithubConfirm: { text: '这样可以吗？' },
  forkRepositoryInstructions: {
    text: '请选择公共曲目或输入 Github（用户或组织）名称和 Github 托管仓库的仓库名称。您 fork 的仓库将从 Github 菜单中可用。',
  },
  forkRepositoryGithubText: { text: 'Fork Github 仓库' },
  forkRepertoireSummary: { text: '公共曲目' },
  forkRepertoireComposerLabel: { text: '作曲家：' },
  forkRepertoireOrganizationLabel: { text: '组织：' },
  forkRepertoireOrganizationOption: { text: '选择一个 GitHub 组织...' },
  forkRepertoireRepositoryLabel: { text: '仓库：' },
  forkRepertoireRepositoryOption: { text: '选择编码...' },
  forkRepositoryInputName: { placeholder: 'Github 用户或组织' },
  forkRepositoryInputRepoOption: { text: '选择一个仓库' },
  forkRepositoryToSelectorText: { text: 'Fork 到：' },
  forkRepositoryButton: { text: 'Fork 仓库' },
  forkRepositoryCancel: { text: '取消' },
  forkProposePublicRepertoire: {
    html:
      '我们欢迎 ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">公共曲目添加建议</a>。',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: '用标签名包围' },
  selectTagNameForEnclosureOkButton: { value: '确定' },
  selectTagNameForEnclosureCancelButton: { value: '取消' },

  // Restore Solid session overlay
  solidExplanation: {
    description: 'Solid 是一个去中心化的社交链接数据平台。登录 Solid 以使用链接数据（RDF）创建独立注释。',
  },
  solidProvider: { description: '请选择一个 Solid 身份提供商（IdP）或指定您自己的。' },
  solidLoginBtn: { text: '登录' },
  solidOverlayCancel: { html: '正在恢复 Solid 会话 - 按 <span>esc</span> 或点击此处取消' },
  solidWelcomeMsg: { text: '欢迎，' },
  solidLogout: { text: '登出' },
  solidLoggedOutWarning: {
    html: `您已注销 mei-friend 的 Solid 集成，但您的浏览器仍然登录 Solid！
      <a id="solidIdPLogoutLink" target="_blank">点击此处退出 Solid</a>。`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: '关闭注释面板' },
  hideAnnotationPanelButton: { description: '关闭注释面板' },
  closeAnnotationPanelButton: { description: '关闭注释面板' },
  annotationToolsButton: { text: '工具', description: '注释工具' },
  annotationListButton: { text: '列表', description: '列出注释' },
  writeAnnotStandoffText: { text: '网络注释' },
  annotationToolsIdentifyTitle: { text: '识别' },
  annotationToolsIdentifySpan: { text: '识别音乐对象' },
  annotationToolsHighlightTitle: { text: '高亮' },
  annotationToolsHighlightSpan: { text: '高亮' },
  annotationToolsDescribeTitle: { text: '描述' },
  annotationToolsDescribeSpan: { text: '描述' },
  annotationToolsLinkTitle: { text: '链接' },
  annotationToolsLinkSpan: { text: '链接' },
  listAnnotations: { text: '无注释。' },
  addWebAnnotation: { text: '加载网络注释' },
  loadWebAnnotationMessage: { text: '输入网络注释或网络注释容器的 URL' },
  loadWebAnnotationMessage1: { text: '无法加载提供的 URL' },
  loadWebAnnotationMessage2: { text: '请再试一次' },
  noAnnotationsToDisplay: { text: '无注释显示' },
  flipPageToAnnotationText: { description: '翻页到此注释' },
  deleteAnnotation: { description: '删除此注释' },
  deleteAnnotationConfirmation: { text: '确定要删除此注释吗？' },
  makeStandOffAnnotation: {
    description: '独立状态（RDF）',
    descriptionSolid: '以 RDF 形式写入 Solid',
    descriptionToLocal: '在新标签页中打开独立（RDF）注释',
  },
  makeInlineAnnotation: {
    description: '点击进行内联注释',
    descriptionCopy: '复制 <annot> xml:id 到剪贴板',
  },
  pageAbbreviation: { text: '页。' },
  elementsPlural: { text: '元素' },
  askForLinkUrl: { text: '请输入要链接的 URL' },
  drawLinkUrl: { text: '在新标签页中打开' },
  askForDescription: { text: '请输入要应用的文本描述' },
  maxNumberOfAnnotationAlert: {
    text1: '注释元素的数量超过可配置的“最大注释数量”',
    text2: '如果设置为“显示注释”，仍然可以生成新的注释并显示。',
  },
  annotationsOutsideScoreWarning: {
    text: '抱歉，当前无法在 &lt;score&gt; 之外的地方写注释',
  },
  annotationWithoutIdWarning: {
    text1: '由于 MEI 锚点缺少 xml:id，无法写注释。',
    text2: '请选择“操作” -> “重新渲染 MEI（带 ids）”并重试。',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: '速度模式',
    description: '速度模式已激活；仅播放当前页面的 MIDI。要播放整个编码，请禁用速度模式。',
  },
  closeMidiPlaybackControlBarButton: { description: '隐藏 MIDI 播放控制栏' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend 设置',
    description: 'mei-friend 设置',
  },
  mfReset: {
    text: '默认',
    description: '恢复 mei-friend 默认设置',
  },
  filterSettings: {
    placeholder: '筛选设置',
    description: '在此输入以筛选设置',
  },
  closeSettingsButton: {
    description: '关闭设置面板',
  },
  hideSettingsButton: {
    description: '关闭设置面板',
  },
  titleGeneral: {
    text: '常规',
    description: '常规 mei-friend 设置',
  },
  selectToolkitVersion: {
    text: 'Verovio 版本',
    description: '选择 Verovio 工具包版本 ' + '(* 切换到 3.11.0 之前的旧版本可能需要刷新以解决内存问题。)',
  },
  toggleSpeedMode: {
    text: '速度模式',
    description: '切换 Verovio 速度模式。' + '在速度模式下，仅将当前页' + '发送到 Verovio 以减少大文件的' + '渲染时间',
  },
  selectIdStyle: {
    text: '生成的 xml:ids 样式',
    description:
      '新生成的 xml:ids 样式（现有 xml:ids 不会改变）' +
      '例如，Verovio 原始："note-0000001318117900", ' +
      'Verovio base 36："nophl5o", ' +
      'mei-friend 样式："note-ophl5o"',
  },
  addApplicationNote: {
    text: '插入应用声明',
    description: '在 MEI 头部的编码描述中插入应用声明，标识' + '应用名称、版本、首次' + '和最后编辑日期',
  },
  selectLanguage: {
    text: '语言',
    description: '选择 mei-friend 界面的语言。',
  },

  // Drag select
  dragSelection: {
    text: '拖动选择',
    description: '用鼠标拖动选择乐谱中的元素',
  },
  dragSelectNotes: {
    text: '选择音符',
    description: '选择音符',
  },
  dragSelectRests: {
    text: '选择休止符',
    description: '选择休止符和重复（休止符，mRest，beatRpt，halfmRpt，mRpt）',
  },
  dragSelectControlElements: {
    text: '选择布局元素',
    description: '选择布局元素（即具有 @placement 属性的元素：' + att.attPlacement.join(', ') + '）',
  },
  dragSelectSlurs: {
    text: '选择连音线',
    description: '选择连音线（即具有 @curvature 属性的元素：' + att.attCurvature.join(', ') + '）',
  },
  dragSelectMeasures: {
    text: '选择小节',
    description: '选择小节',
  },

  // Control menu
  controlMenuSettings: {
    text: '乐谱控制栏',
    description: '定义乐谱上方控制菜单中要显示的项目',
  },
  controlMenuFlipToPageControls: {
    text: '显示翻页控制',
    description: '在乐谱控制菜单中显示翻页控制',
  },
  controlMenuUpdateNotation: {
    text: '显示乐谱更新控制',
    description: '在乐谱控制菜单中显示乐谱更新行为控制',
  },
  controlMenuFontSelector: {
    text: '显示乐谱字体选择器',
    description: '在乐谱控制菜单中显示乐谱字体（SMuFL）选择器',
  },
  controlMenuNavigateArrows: {
    text: '显示导航箭头',
    description: '在乐谱控制菜单中显示乐谱导航箭头',
  },
  controlMenuSpeedmodeCheckbox: {
    text: '显示速度模式复选框',
    description: '在乐谱控制菜单中显示速度模式复选框',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI 回放',
    description: 'MIDI 回放设置',
  },
  showMidiPlaybackContextualBubble: {
    text: '显示播放快捷方式',
    description: '当 MIDI 播放控制栏关闭时，会出现快捷方式（左下角的气泡；点击即可立即开始播放）',
  },
  showMidiPlaybackControlBar: {
    text: '显示 MIDI 播放控制栏',
    description: '显示 MIDI 播放控制栏',
  },
  scrollFollowMidiPlayback: {
    text: '滚动跟随 MIDI 播放',
    description: '滚动乐谱面板以跟随当前页面的 MIDI 播放',
  },
  pageFollowMidiPlayback: {
    text: '分页跟随 MIDI 播放',
    description: '自动翻页以跟随 MIDI 播放',
  },
  highlightCurrentlySoundingNotes: {
    text: '高亮当前发音音符',
    description: '在 MIDI 播放期间在乐谱面板中视觉上高亮当前发音音符',
  },
  selectMidiExpansion: {
    text: '播放扩展',
    description: '选择用于 MIDI 回放的扩展元素',
  },

  // Transposition
  titleTransposition: {
    text: '移调',
    description: '移调乐谱信息',
  },
  enableTransposition: {
    text: '启用移调',
    description:
      '启用移调设置，通过下面的移调按钮应用。移调将仅应用于乐谱，编码保持不变，除非您在“操作”下拉菜单中点击“通过 Verovio 重新渲染”。',
  },
  transposeInterval: {
    text: '按音程移调',
    description: '按最常见的音程移调编码（Verovio 支持 base-40 系统）',
    labels: [
      '纯一度',
      '增一度',
      '减二度',
      '小二度',
      '大二度',
      '增二度',
      '减三度',
      '小三度',
      '大三度',
      '增三度',
      '减四度',
      '纯四度',
      '增四度',
      '减五度',
      '纯五度',
      '增五度',
      '减六度',
      '小六度',
      '大六度',
      '增六度',
      '减七度',
      '小七度',
      '大七度',
      '增七度',
      '减八度',
      '纯八度',
    ],
  },
  transposeKey: {
    text: '移调到调',
    description: '移调到调',
    labels: [
      '升 C 大调 / 升 A 小调',
      '升 F 大调 / 升 D 小调',
      'B 大调 / 升 G 小调',
      'E 大调 / 升 C 小调',
      'A 大调 / 升 F 小调',
      'D 大调 / B 小调',
      'G 大调 / E 小调',
      'C 大调 / A 小调',
      'F 大调 / D 小调',
      '降 B 大调 / G 小调',
      '降 E 大调 / C 小调',
      '降 A 大调 / F 小调',
      '降 D 大调 / 降 B 小调',
      '降 G 大调 / 降 E 小调',
      '降 C 大调 / 降 A 小调',
    ],
  },
  transposeDirection: {
    text: '移调方向',
    description: '移调的音高方向（上/下）',
    labels: ['上', '下', '最近'],
  },
  transposeButton: {
    text: '移调',
    description:
      '将上述设置应用于乐谱，MEI 编码保持不变。要将当前设置应用于 MEI 编码，请在“操作”下拉菜单中使用“通过 Verovio 重新渲染”。',
  },

  // Renumber measures
  renumberMeasuresHeading: {
    text: '重新编号小节',
    description: '重新编号小节的设置',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: '跨不完整小节继续',
    description: '跨不完整小节继续编号（@metcon="false"）',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: '在不完整小节使用后缀',
    description: '在不完整小节使用编号后缀（例如，23-cont）',
    labels: ['无', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: '跨结尾继续',
    description: '跨结尾继续编号',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: '在结尾使用后缀',
    description: '在结尾使用编号后缀（例如，23-a）',
  },

  // Annotations
  titleAnnotations: {
    text: '注释',
    description: '注释设置',
  },
  showAnnotations: {
    text: '显示注释',
    description: '在乐谱中显示注释',
  },
  showAnnotationPanel: {
    text: '显示注释面板',
    description: '显示注释面板',
  },
  annotationDisplayLimit: {
    text: '最大注释数量',
    description: '显示的最大注释数量（数量过大会减慢 mei-friend）',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: '摹本面板',
    description: '显示来源版本的摹本（如有）',
  },
  showFacsimilePanel: {
    text: '显示摹本面板',
    description: '显示 facsimile 元素中提供的来源版本的乐谱摹本',
  },
  selectFacsimilePanelOrientation: {
    text: '摹本面板位置',
    description: '选择摹本面板相对于乐谱的位置',
    labels: ['左', '右', '上', '下'],
  },
  facsimileZoomInput: {
    text: '摹本缩放（%）',
    description: '摹本缩放级别（百分比）',
  },
  showFacsimileFullPage: {
    text: '显示全页',
    description: '显示摹本全页',
  },
  showFacsimileZones: {
    text: '显示摹本区域框',
    description: '显示摹本区域边界框',
  },
  editFacsimileZones: {
    text: '编辑摹本区域',
    description: '编辑摹本区域（将边界框链接到摹本区域）',
  },
  showFacsimileTitles: {
    text: '显示摹本标题',
    description: '在来源摹本上方显示摹本标题',
  },

  // Supplied element
  titleSupplied: {
    text: '处理编辑内容',
    description: '控制 <supplied> 元素的处理',
  },
  showSupplied: {
    text: '显示 <supplied> 元素',
    description: '突出显示所有包含在 <supplied> 元素中的元素',
  },
  suppliedColor: {
    text: '选择 <supplied> 高亮颜色',
    description: '选择 <supplied> 高亮颜色',
  },
  respSelect: {
    text: '选择 <supplied> 责任',
    description: '选择责任 id',
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: '编辑器设置',
  },
  cmReset: {
    text: '默认',
    description: '恢复 mei-friend 默认设置',
  },
  titleAppearance: {
    text: '编辑器外观',
    description: '控制编辑器的外观',
  },
  zoomFont: {
    text: '字体大小（%）',
    description: '更改编辑器的字体大小（百分比）',
  },
  theme: {
    text: '主题',
    description: '选择编辑器的主题',
  },
  matchTheme: {
    text: '乐谱匹配主题',
    description: '将乐谱与编辑器的颜色主题匹配',
  },
  tabSize: {
    text: '缩进大小',
    description: '每个缩进级别的空格字符数',
  },
  lineWrapping: {
    text: '换行',
    description: '是否在面板末尾换行',
  },
  lineNumbers: {
    text: '显示行号',
    description: '显示行号',
  },
  firstLineNumber: {
    text: '第一行行号',
    description: '设置第一行的行号',
  },
  foldGutter: {
    text: '代码折叠',
    description: '通过折叠边栏启用代码折叠',
  },
  titleEditorOptions: {
    text: '编辑器行为',
    description: '控制编辑器的行为',
  },
  autoValidate: {
    text: '自动验证',
    description: '每次编辑后自动验证编码与模式',
  },
  autoShowValidationReport: {
    text: '自动显示验证报告',
    description: '验证后自动显示验证报告',
  },
  autoCloseBrackets: {
    text: '自动闭合括号',
    description: '在输入时自动闭合括号',
  },
  autoCloseTags: {
    text: '自动闭合标签',
    description: '在输入时自动闭合标签',
    type: 'bool',
  },
  matchTags: {
    text: '匹配标签',
    description: '高亮编辑器光标周围的匹配标签',
  },
  showTrailingSpace: {
    text: '高亮尾随空格',
    description: '高亮行尾的不必要尾随空格',
  },
  keyMap: {
    text: '键映射',
    description: '选择键映射',
  },
  // translate the values of the following persistentSearch object
  persistentSearch: {
    text: '持久搜索框',
    description: '使用持久搜索框行为（搜索框保持打开直到显式关闭）',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Verovio 设置',
  },
  vrvReset: {
    text: '默认',
    description: '恢复 Verovio 为 mei-friend 默认设置',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      '看起来您正在使用 Safari 浏览器，' +
      'mei-friend 在 Safari 上不支持模式验证。' +
      '请使用其他浏览器以获得完整的验证支持。',
  },
  githubLoggedOutWarning: {
    text: `您已注销 mei-friend 的 GitHub 集成，但您的浏览器仍然登录 GitHub！
      <a href="https://github.com/logout" target="_blank">点击此处退出 GitHub</a>。`,
  },
  generateUrlError: {
    text: '无法为本地文件生成 URL',
  },
  generateUrlSuccess: {
    text: 'URL 已成功复制到剪贴板',
  },
  generateUrlNotCopied: {
    text: 'URL 未复制到剪贴板，请再试一次！',
  },
  errorCode: { text: '错误代码' },
  submitBugReport: { text: '提交错误报告' },
  loadingSchema: { text: '正在加载模式' },
  schemaLoaded: { text: '模式已加载' },
  noSchemaFound: { text: '在 MEI 中未找到模式信息。' },
  schemaNotFound: { text: '未找到模式' },
  errorLoadingSchema: { text: '加载模式时出错' },
  notValidated: { text: '未验证。点击此处验证。' },
  validatingAgainst: { text: '验证中，针对' },
  validatedAgainst: { text: '验证通过，针对' },
  validationMessages: { text: '验证消息' },
  validationComplete: { text: '验证完成' },
  validationFailed: { text: '验证失败' },
  noErrors: { text: '没有错误' },
  errorsFound: { text: '发现错误' }, // 5 errors found

  // GitHub-menu.js
  githubRepository: {
    text: '仓库',
  },
  githubBranch: { text: '分支' },
  githubFilepath: { text: '路径' },
  githubCommit: { text: '提交' },
  githubCommitButton: { classes: { commitAsNewFile: { value: '提交为新文件' } }, value: '提交' },
  commitLog: { text: '提交日志' },
  githubDate: { text: '日期' },
  githubAuthor: { text: '作者' },
  githubMessage: { text: '消息' },
  none: { text: '无' },
  commitFileNameText: { text: '文件名' },
  forkRepository: { text: 'Fork 仓库' },
  forkError: { text: '抱歉，无法 fork 仓库' },
  loadingFile: { text: '正在加载文件' },
  loadingFromGithub: { text: '正在从 Github 加载' },
  logOut: { text: '登出' },
  githubLogout: { text: '登出' },
  selectRepository: { text: '选择仓库' },
  selectBranch: { text: '选择分支' },
  commitMessageInput: { placeholder: '使用 mei-friend 在线更新' },
  reportIssueWithEncoding: { value: '报告编码问题' },
  clickToOpenInMeiFriend: { text: '点击在 mei-friend 中打开' },
  repoAccessError: { text: '抱歉，无法访问提供的用户或组织的仓库' },
  allComposers: { text: '所有作曲家' }, // fork-repository.js

  // Utils renumber measures
  renumberMeasuresModalText: { text: '重新编号小节' },
  renumberMeasuresModalTest: { text: '测试' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: '将被' },
  renumberMeasuresChangedTo: { text: '更改为' },
  renumberMeasureMeasuresRenumbered: { text: '小节重新编号' },

  // Code checker @accid.ges
  accidGesCodeCheckerTitle: { text: '检查 @accid.ges 属性（针对调号、小节内音调和连音）。' },
  codeCheckerFix: { text: '修复' },
  codeCheckerFixAll: { text: '修复所有' },
  codeCheckerIgnore: { text: '忽略' },
  codeCheckerIgnoreAll: { text: '全部忽略' },
  codeCheckerCheckingCode: { text: '检查代码...' },
  codeCheckerNoAccidMessagesFound: { text: '所有 accid.ges 属性看起来都是正确的。' },
  codeCheckerMeasure: { text: '小节' },
  codeCheckerNote: { text: '音符' },
  codeCheckerHasBoth: { text: '都有' },
  codeCheckerAnd: { text: '和' },
  codeCheckerRemove: { text: '移除' },
  codeCheckerFixTo: { text: '修复为' },
  codeCheckerAdd: { text: '添加' },
  codeCheckerWithContradictingContent: { text: '内容矛盾' },
  codeCheckerTiedNote: { text: '连音符' },
  codeCheckerNotSamePitchAs: { text: '音高不同于' },
  codeCheckerNotSameOctaveAs: { text: '八度不同于' },
  codeCheckerNotSameAsStartingNote: { text: '与起始音符不相同' },
  codeCheckerExtra: { text: '多余' }, // superfluous
  codeCheckerHasExtra: { text: '有多余的' }, // has superfluous
  codeCheckerLacksAn: { text: '缺少' },
  codeCheckerBecauseAlreadyDefined: { text: '因为它在小节中已经定义' },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: 'mei-friend 无法滚动到编码中的所选元素。请为编码添加 id。',
  },
};
