/**
 * Language file for English
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // スプラッシュ画面
  aboutMeiFriend: { text: 'mei-friendについて' },
  showSplashScreen: {
    text: 'アプリケーションの読み込み時にスプラッシュ画面を表示',
    description: 'mei-friendの読み込み時にスプラッシュ画面を表示します',
  },
  splashBody: {
    html: `
      <p>
        mei-friendは<a href="https://music-encoding.org">音楽エンコーディング</a>のエディタで、
        <a href="https://mdw.ac.at" target="_blank">mdw - ウィーン音楽・演劇アート大学</a>でホストされています。
        詳細な情報については<a href="https://mei-friend.github.io" target="_blank">詳細なドキュメンテーション</a>
        をご覧ください。
      </p>
      <p>
        mei-friendはブラウザベースのアプリケーションですが、個人データ（編集中のエンコード、アプリケーションの設定、および
        ログイン詳細など）はブラウザの
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank"
          >ローカルストレージ</a
        >に保存され、サーバーに送信または保存されません。
      </p>
      <p>
        データはGitHubに明示的にリクエストした場合にのみ送信されます（たとえば、GitHubにログインし、GitHubのリポジトリからエンコードを読み込む、またはGitHub Actionのワークフローをリクエストする場合など）。同様に、選択したSolidプロバイダーに対しても、明示的にリクエストした場合にのみデータが送信されます（たとえば、Solidにログインし、スタンドオフの注釈を読み込むまたは保存する場合など）。
      </p>
      <p>
        無記名の使用統計情報を収集するために<a href="https://matomo.org/" target="_blank">Matomo</a>
        を使用しています。これには切り捨てられたIPアドレス（国のレベルでの地理的位置情報を許可しますが、それ以上の識別情報は含まれません）、ブラウザとオペレーティングシステム、リファリングウェブサイトからのアクセス先、訪問の時間と期間、および訪問したページが含まれます。この情報はmdw - ウィーン音楽・演劇アート大学のサーバーで実行されているMatomoインスタンスに保存され、第三者とは共有されません。
      </p>
      <p>
        Verovioツールキットは<a href="https://verovio.org" target="_blank">https://verovio.org</a>からロードされ、
        <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>がホストしています。 
        これにより、mei-friendは常に最新のツールキットバージョンを使用できるだけでなく、
        設定パネルを介してすべてのサポートされているバージョンの選択を提供できます。 
        mei-friendを使用する際、IPアドレスはRISM Digitalによって表示されるため、注意してください。
      </p>
      <p>
        最後に、MIDI再生はGoogle Magentaが提供するSGM_plusサウンドフォントを使用し、googleapis.comを介して提供されます。そのため、MIDI再生を開始する際にGoogleに対してIPアドレスが表示されます。これを望まない場合は、MIDI再生機能の使用を避けてください。
      </p>
      <p>
        mei-friendは、mdw - ウィーン音楽・演劇アート大学の音楽音響学部 - ヴィーナークランクシュティールで
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a>および
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a>によって開発され、
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
          >GNU Affero General Public License v3.0</a
        >の下でライセンスされています。詳細な情報については、
        <a href="https://mei-friend.github.io/about/" target="_blank">謝辞ページ</a>をご覧ください。
        このプロジェクトで再利用されるオープンソースコンポーネントについての情報も提供しており、貢献者とガイダンスに感謝しています。
      </p>
      <p>
        mei-friend Webアプリケーションの開発は、
        <a href="https://fwf.ac.at" target="_blank">オーストリア科学振興基金（FWF）</a>のプロジェクト
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
          >P 34664-G（Signature Sound Vienna）</a
        >
        および<a href="https://e-laute.info">I 6019（E-LAUTE）</a>
        によって資金提供されています。
      </p>
    `,
  },
  splashGotItButtonText: { text: '了解しました！' },
  splashVersionText: { text: 'バージョン' },
  splashAlwaysShow: {
    text: '常にこのスプラッシュ画面を表示',
    description: 'アプリケーションの読み込み時に常にこのスプラッシュ画面を表示',
  },
  splashAlwaysShowLabel: {
    text: '常にこのスプラッシュ画面を表示',
    description: 'アプリケーションの読み込み時に常にこのスプラッシュ画面を表示',
  },

  // Main menu bar
  githubLoginLink: { text: 'ログイン' },

  month: {
    jan: '1月',
    feb: '2月',
    mar: '3月',
    apr: '4月',
    may: '5月',
    jun: '6月',
    jul: '7月',
    aug: '8月',
    sep: '9月',
    oct: '10月',
    nov: '11月',
    dec: '12月',
  },

  // FILE MENU ITEM
  fileMenuTitle: { text: 'ファイル' },
  openMeiText: { text: 'ファイルを開く' },
  openUrlText: { text: 'URLを開く' },
  openExample: {
    text: '公共レパートリー',
    description: 'パブリックドメインのレパートリーのリストを開く',
  },
  importMusicXml: { text: 'MusicXMLをインポート' },
  importHumdrum: { text: 'Humdrumをインポート' },
  importPae: { text: 'PAE、ABCをインポート' },
  saveMeiText: { text: 'MEIを保存' },
  saveMeiBasicText: { text: 'MEI Basicで保存' },
  saveSvg: { text: 'SVGを保存' },
  saveMidi: { text: 'MIDIを保存' },
  printPreviewText: { text: 'PDFプレビュー' },
  generateUrlText: { text: 'mei-friend URLを生成' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'コード' },
  undoMenuText: { text: '元に戻す' },
  redoMenuText: { text: 'やり直し' },
  startSearchText: { text: '検索' },
  findNextText: { text: '次を検索' },
  findPreviousText: { text: '前を検索' },
  replaceMenuText: { text: '置換' },
  replaceAllMenuText: { text: 'すべて置換' },
  indentSelectionText: { text: '選択範囲をインデント' },
  surroundWithTagsText: { text: 'タグで囲む' },
  surroundWithLastTagText: { text: '前のタグで囲む' },
  jumpToLineText: { text: '行にジャンプ' },
  toMatchingTagText: { text: '一致するタグに移動' },
  manualValidateText: { text: '検証' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: '表示' },
  notationTop: { text: 'プレビューを上に表示' },
  notationBottom: { text: 'プレビューを下に表示' },
  notationLeft: { text: 'プレビューを左に表示' },
  notationRight: { text: 'プレビューを右に表示' },
  showSettingsMenuText: { text: '設定パネル' },
  showAnnotationMenuText: { text: 'アノテーションパネル' },
  showFacsimileMenuText: { text: 'ファクシミリパネル' },
  showPlaybackControlsText: { text: '再生コントロール' },
  facsimileTop: { text: 'ファクシミリを上に表示' },
  facsimileBottom: { text: 'ファクシミリを下に表示' },
  facsimileLeft: { text: 'ファクシミリを左に表示' },
  facsimileRight: { text: 'ファクシミリを右に表示' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: '操作' },
  invertPlacementText: { text: '配置を反転' },
  betweenPlacementText: { text: '配置を中間に' },
  addVerticalGroupText: { text: '垂直グループを追加' },
  deleteText: { text: '要素を削除' },
  pitchChromUpText: { text: '半音上げる' },
  pitchChromDownText: { text: '半音下げる' },
  pitchUpDiatText: { text: '全音上げる' },
  pitchDownDiatText: { text: '全音下げる' },
  pitchOctaveUpText: { text: '1オクターブ上げる' },
  pitchOctaveDownText: { text: '1オクターブ下げる' },
  staffUpText: { text: '要素を1段階上げる' },
  staffDownText: { text: '要素を1段階下げる' },
  increaseDurText: { text: '音価を増やす' },
  decreaseDurText: { text: '音価を減らす' },
  toggleDotsText: { text: 'トグル・ドッティング' },
  cleanAccidText: { text: '@accid.gesを確認' },
  renumberMeasuresTestText: { text: '小節を再番号付け（テスト）' },
  renumberMeasuresExecText: { text: '小節を再番号付け（実行）' },
  addIdsText: { text: 'MEIにIDを追加' },
  removeIdsText: { text: 'MEIからIDを削除' },
  reRenderMeiVerovio: { text: 'Verovioで再レンダリング' },
  addFacsimile: { text: 'ファクシミリを追加' },
  ingestFacsimileText: { text: 'ファクシミリ取り込み' },
  insertMenuTitle: { text: '挿入' },
  addDoubleSharpText: { html: 'ダブルシャープ &#119082;' },
  addSharpText: { html: 'シャープ &#9839;' },
  addNaturalText: { html: 'ナチュラル &#9838;' },
  addFlatText: { html: 'フラット &#9837;' },
  addDoubleFlatText: { html: 'ダブルフラット &#119083;' },
  addTempoText: { text: 'テンポ' },
  addDirectiveText: { text: '指示' },
  addDynamicsText: { text: 'ダイナミクス' },
  addSlurText: { text: 'スラー' },
  addTieText: { text: 'タイ' },
  addCrescendoHairpinText: { text: 'クレッシェンド' },
  addDiminuendoHairpinText: { text: 'ディミヌエンド' },
  addBeamText: { text: '連桁' },
  addBeamSpanText: { text: '小節をまたぐ連桁' },
  addSuppliedText: { text: '供給' },
  addSuppliedArticText: { text: '供給（アーティキュレーション）' },
  addSuppliedAccidText: { text: '供給（アクシデント）' },
  addArpeggioText: { text: 'アルペジオ' },
  addFermataText: { text: 'フェルマータ' },
  addGlissandoText: { text: 'グリッサンド' },
  addPedalDownText: { text: 'ペダルダウン' },
  addPedalUpText: { text: 'ペダルアップ' },
  addTrillText: { text: 'トリル' },
  addTurnText: { text: 'ターン' },
  addTurnLowerText: { text: '転回ターン' },
  addMordentText: { text: 'モルデント' },
  addMordentUpperText: { text: 'プラルトリラー' },
  addOctave8AboveText: { text: 'オクターブ（上8度）' },
  addOctave15AboveText: { text: 'オクターブ（上15度）' },
  addOctave8BelowText: { text: 'オクターブ（下8度）' },
  addOctave15BelowText: { text: 'オクターブ（下15度）' },
  addGClefChangeBeforeText: { text: '要素の前にト音記号' },
  addGClefChangeAfterText: { text: '要素の後にト音記号' },
  addFClefChangeBeforeText: { text: '要素の前にヘ音記号' },
  addFClefChangeAfterText: { text: '要素の後にヘ音記号' },
  addCClefChangeBeforeText: { text: '要素の前にハ音記号' },
  addCClefChangeAfterText: { text: '要素の後にハ音記号' },
  toggleStaccText: { text: 'スタッカート' },
  toggleAccentText: { text: 'アクセント' },
  toggleTenutoText: { text: 'テヌート' },
  toggleMarcatoText: { text: 'マルカート' },
  toggleStaccissText: { text: 'スタッカーティシモ' },
  toggleSpiccText: { text: 'スピカート' },
  // HELP MENU ITEM
  helpMenuTitle: { text: 'ヘルプ' },
  goToHelpPageText: { text: 'mei-friendヘルプページ' },
  goToCheatSheet: { text: 'mei-friendチートシート' },
  showChangelog: { text: 'mei-friend変更履歴' },
  goToGuidelines: { text: 'MEIガイドライン' },
  consultGuidelinesForElementText: { text: '現在の要素に対するガイドラインの項目' },
  provideFeedback: { text: 'フィードバックを提供' },
  resetDefault: { text: 'デフォルトにリセット' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'MIDI再生コントロールバーの表示/非表示' },
  showFacsimileButton: { description: 'ファクシミリパネルの表示/非表示' },
  showAnnotationsButton: { description: 'アノテーションパネルの表示/非表示' },
  showSettingsButton: { description: '設定パネルの表示/非表示' },

  // Footer texts
  leftFooter: {
    // No translation needed for HTML links, 'heart', and place names
    html:
      'Hosted by <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'at <a href="https://mdw.ac.at">mdw</a>, with ' +
      heart +
      ' from Vienna. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Imprint</a>.',
  },
  loadingVerovio: { text: 'Verovioを読み込む' },
  verovioLoaded: { text: '読み込み完了' },
  convertedToPdf: { text: 'PDFに変換' },
  statusBarCompute: { text: '計算' },
  middleFooterPage: { text: 'ページ' },
  middleFooterOf: { text: '全' },
  middleFooterLoaded: { text: '読み込み完了' },

  // コントロールメニュー
  verovioIcon: {
    description: `mei-friendのワーカー活動：
        時計回りの回転はVerovioの活動を示し、
        反時計回りの回転速度はワーカーの活動を示します`,
  },
  decreaseScaleButton: { description: '楽譜を縮小' },
  verovioZoom: { description: '楽譜のサイズを調整' },
  increaseScaleButton: { description: '楽譜を拡大' },
  pagination1: { html: 'ページ&nbsp;' },
  pagination3: { html: '&nbsp;の' },
  sectionSelect: { description: 'エンコードされたセクション/エンディング構造へ移動' },
  firstPageButton: { description: '最初のページに移動' },
  previousPageButton: { description: '前のページに移動' },
  paginationLabel: { description: 'ページナビゲーション：表示するページ番号を手動で入力するにはクリックしてください' },
  nextPageButton: { description: '次のページに移動' },
  lastPageButton: { description: '最後のページに移動' },
  flipCheckbox: { description: 'エンコードカーソル位置に自動的にページ移動' },
  flipButton: { description: 'エンコードカーソル位置にページを手動で移動' },
  breaksSelect: { description: '楽譜のシステム/ページ区切りの動作を定義' },
  breaksSelectNone: { text: 'なし' },
  breaksSelectAuto: { text: '自動' },
  breaksSelectMeasure: { text: '小節' },
  breaksSelectLine: { text: 'システム' },
  breaksSelectEncoded: { text: 'システムとページ' },
  breaksSelectSmart: { text: 'スマート' },
  updateControlsLabel: { text: '更新', description: 'エンコード変更後の楽譜の制御更新動作' },
  liveUpdateCheckbox: { description: 'エンコード変更後に楽譜を自動的に更新' },
  codeManualUpdateButton: { description: '楽譜を手動で更新' },
  engravingFontSelect: { description: '楽譜フォントの選択' },
  backwardsButton: { description: '楽譜内を左に移動' },
  forwardsButton: { description: '楽譜内を右に移動' },
  upwardsButton: { description: '楽譜内を上に移動' },
  downwardsButton: { description: '楽譜内を下に移動' },
  speedLabel: {
    text: 'スピードモード',
    description: '大きなファイルのレンダリング時間を短縮するため、現在のページのみがVerovioに送信されます',
  },

  // PDF/印刷プレビューパネル
  pdfSaveButton: { text: 'PDFを保存', description: 'PDFとして保存' },
  pdfCloseButton: { description: '印刷ビューを閉じる' },
  pagesLegendLabel: { text: 'ページ範囲', singlePage: 'ページ', multiplePages: 'ページ' },
  selectAllPagesLabel: { text: 'すべて' },
  selectCurrentPageLabel: { text: '現在のページ' },
  selectFromLabel: { text: '開始:' },
  selectToLabel: { text: '終了:' },
  selectPageRangeLabel: { text: 'ページ範囲指定:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'スピードモードがアクティブ化されているため、現在のページのみがPDFにレンダリングされます。' +
      'すべてのページから印刷範囲を選択するにはスピードモードのチェックを外してください。',
  },
  pdfPreviewNormalModeTitle: { text: 'PDFに保存するページ範囲を選択してください。' },

  // ファクシミリパネル
  facsimileIcon: { description: 'ファクシミリパネル' },
  facsimileDecreaseZoomButton: { description: '画像を縮小' },
  facsimileZoom: { description: '画像のサイズを調整' },
  facsimileIncreaseZoomButton: { description: '画像を拡大' },
  facsimileFullPageLabel: { text: '全体表示', description: 'ファクシミリ画像の全体表示' },
  facsimileFullPageCheckbox: { description: 'ファクシミリ画像の全体表示' },
  facsimileShowZonesLabel: { text: 'ゾーンボックスを表示', description: 'ファクシミリのゾーンボックスを表示' },
  facsimileShowZonesCheckbox: { description: 'ファクシミリのゾーンボックスを表示' },
  facsimileEditZonesCheckbox: { description: 'ファクシミリのゾーンを編集' },
  facsimileEditZonesLabel: { text: 'ゾーンを編集', description: 'ファクシミリのゾーンを編集' },
  facsimileCloseButton: { description: 'ファクシミリパネルを閉じる' },
  facsimileDefaultWarning: { text: '表示するファクシミリコンテンツはありません。' },
  facsimileNoSurfaceWarning: {
    text: 'このページにはsurface要素が見つかりません。\n(最初ののpb要素がない可能性があります。)',
  },
  facsimileNoZonesFullPageWarning: { text: 'ゾーンのないファクシミリは全体表示モードでのみ表示されます。' },
  facsimileImgeNotLoadedWarning: { text: '画像を読み込めませんでした' },

  // Drag'n'drop
  dragOverlayText: { text: 'ここに入力ファイルをドラッグしてください。' },

  // Public repertoire
  openUrlHeading: { text: 'URLで公開されたエンコーディングを開く' },
  openUrlInstructions: {
    text: '公開されたレパートリーから選択するか、下記にWebホストされた楽譜エンコーディングのURLを入力してください。注意: ホストサーバーはオリジン間リソース共有（CORS）をサポートしている必要があります。',
  },
  publicRepertoireSummary: { text: '公開レパートリー' },
  sampleEncodingsComposerLabel: { text: '作曲者:' },
  sampleEncodingsEncodingLabel: { text: 'エンコーディング:' },
  sampleEncodingsOptionLabel: { text: 'エンコーディングを選択...' },
  openUrlButton: { text: 'URLを開く' },
  openUrlCancel: { text: 'キャンセル' },
  proposePublicRepertoire: {
    html:
      '公開レパートリーへの ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      '追加提案' +
      '</a> を歓迎します。',
  },
  openUrlChooseEncodingText: { text: 'エンコーディングを選択...' },
  openUrlChooseComposerText: { text: '作曲者を選択...' },
  openUrlOpenEncodingByUrlText: { text: 'URLでWebホストされたエンコーディングを開く' },

  // GitHub actions modal
  githubActionsHeadingText: { text: 'GitHubアクションワークフローをリクエスト:' },
  githubActionsDescription: {
    text: '上記の設定を使用してGitHub APIにワークフローを実行するために「ワークフローを実行」をクリックしてください。ワークフロー実行が完了すると、エンコーディングが最新バージョンにリロードされます。',
  },
  githubActionStatusMsgPrompt: { text: 'ワークフローの実行に失敗しました - GitHubの応答:' },
  githubActionStatusMsgWaiting: { text: 'GitHubがワークフローを処理している間お待ちください...' },
  githubActionStatusMsgFailure: { text: 'ワークフローの実行に失敗しました - GitHubの応答:' },
  githubActionStatusMsgSuccess: { text: 'ワークフローの実行が完了しました - GitHubの応答:' },
  githubActionsRunButton: { text: 'ワークフローを実行' },
  githubActionsRunButtonReload: { text: 'MEIファイルを再読み込み' },
  githubActionsCancelButton: { text: 'キャンセル' },
  githubActionsInputSetterFilepath: { text: '現在のファイルパスを入力にコピー' },
  githubActionsInputSetterSelection: { text: '現在のMEI選択範囲を入力にコピー' },
  githubActionsInputContainerHeader: { text: '入力設定' },

  // Fork modals
  forkRepoGithubText: { text: 'GitHubリポジトリをフォーク' },
  forkRepoGithubExplanation: {
    text: '以下のリンクをクリックすると、次のリポジトリがmei-friendで編集用にGitHubでフォークされます:',
  },
  forkRepoGithubConfirm: { text: 'よろしいですか？' },
  forkRepositoryInstructions: {
    text: '公開レパートリーから選択するか、下記にGitHubでホストされたリポジトリのGitHub（ユーザーまたは組織）名とリポジトリ名を入力してください。フォークされたリポジトリはGitHubメニューから利用できるようになります。',
  },
  forkRepositoryGithubText: { text: 'GitHubリポジトリをフォーク' },
  forkRepertoireSummary: { text: '公開レパートリー' },
  forkRepertoireComposerLabel: { text: '作曲者:' },
  forkRepertoireOrganizationLabel: { text: '組織:' },
  forkRepertoireOrganizationOption: { text: 'GitHub組織を選択...' },
  forkRepertoireRepositoryLabel: { text: 'リポジトリ:' },
  forkRepertoireRepositoryOption: { text: 'エンコーディングを選択...' },
  forkRepositoryInputName: { placeholder: 'GitHubユーザーまたは組織' },
  forkRepositoryInputRepoOption: { text: 'リポジトリを選択' },
  forkRepositoryToSelectorText: { text: 'フォーク先: ' },
  forkRepositoryButton: { text: 'リポジトリをフォーク' },
  forkRepositoryCancel: { text: 'キャンセル' },
  forkProposePublicRepertoire: {
    html:
      '公開レパートリーへの ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      '追加提案' +
      '</a> を歓迎します。',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'タグ名で囲む' },
  selectTagNameForEnclosureOkButton: { value: 'OK' },
  selectTagNameForEnclosureCancelButton: { value: 'キャンセル' },

  // Restore Solid session overlay
  solidExplanation: {
    description:
      'Solidはリンクトデータ（RDF）を使用してスタンドオフ注釈を作成するための分散型プラットフォームです。Solidにログインしてリンクトデータアノテーションを作成できるようになります。',
  },
  solidProvider: { description: 'Solid Identity Provider (IdP)を選択または独自のIdPを指定してください。' },
  solidLoginBtn: { text: 'ログイン' },
  solidOverlayCancel: { html: 'Solidセッションを復元中 - <span>esc</span>を押すか、こちらをクリックしてキャンセル' },
  solidWelcomeMsg: { text: 'ようこそ、' },
  solidLogout: { text: 'ログアウト' },
  solidLoggedOutWarning: {
    html: `mei-friendのSolid統合からログアウトしましたが、ブラウザはまだSolidにログインしています！
        <a id="solidIdPLogoutLink" target="_blank">ここをクリックしてSolidからログアウト</a>してください。`,
  },

  // Annotation panel
  annotationCloseButtonText: { text: '注釈パネルを閉じる' },
  hideAnnotationPanelButton: { description: '注釈パネルを閉じる' },
  closeAnnotationPanelButton: { description: '注釈パネルを閉じる' },
  annotationToolsButton: { text: 'ツール', description: '注釈ツール' },
  annotationListButton: { text: 'リスト', description: '注釈のリスト' },
  writeAnnotStandoffText: { text: 'Web注釈' },
  annotationToolsIdentifyTitle: { text: '識別' },
  annotationToolsIdentifySpan: { text: '音楽オブジェクトを識別' },
  annotationToolsHighlightTitle: { text: 'ハイライト' },
  annotationToolsHighlightSpan: { text: 'ハイライト' },
  annotationToolsDescribeTitle: { text: '説明' },
  annotationToolsDescribeSpan: { text: '説明' },
  annotationToolsLinkTitle: { text: 'リンク' },
  annotationToolsLinkSpan: { text: 'リンク' },
  listAnnotations: { text: '注釈はありません。' },
  addWebAnnotation: { text: 'Web注釈を読み込む' },
  loadWebAnnotationMessage: { text: 'Web注釈またはWeb注釈コンテナのURLを入力してください' },
  loadWebAnnotationMessage1: { text: '提供されたURLを読み込むことができませんでした' },
  loadWebAnnotationMessage2: { text: 'もう一度お試しください' },
  noAnnotationsToDisplay: { text: '表示する注釈がありません' },
  flipPageToAnnotationText: { description: 'この注釈にページをめくる' },
  deleteAnnotation: { description: 'この注釈を削除' },
  deleteAnnotationConfirmation: { text: 'この注釈を削除してもよろしいですか？' },
  makeStandOffAnnotation: {
    description: 'スタンドオフステータス（RDF）',
    descriptionSolid: 'RDFとしてSolidに書き込む',
    descriptionToLocal: '新しいタブでスタンドオフ（RDF）注釈を開く',
  },
  makeInlineAnnotation: {
    description: 'インライン注釈をクリック',
    descriptionCopy: 'クリップボードに<annot> xml:idをコピー',
  },
  pageAbbreviation: { text: 'ページ' },
  elementsPlural: { text: '要素' },
  askForLinkUrl: { text: 'リンクするURLを入力してください' },
  drawLinkUrl: { text: '新しいタブで開く' },
  askForDescription: { text: '適用するテキストの説明を入力してください' },
  maxNumberOfAnnotationAlert: {
    text1: 'annot要素の数が設定可能な「注釈の最大数」を超えています',
    text2: '「注釈を表示」が設定されている場合、新しい注釈が生成され、表示されます。',
  },
  annotationsOutsideScoreWarning: {
    text: '&lt;score&gt;の外に配置された注釈を書き込むことはできません。',
  },
  annotationWithoutIdWarning: {
    text1: 'MEIアンカーポイントにxml:idがないため、注釈を書き込むことができません。',
    text2: '「操作」->「MEIの再レンダリング（ID付き）」を選択して識別子を割り当て、もう一度お試しください。',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'スピードモード',
    description:
      'スピードモードがアクティブです。現在のページのMIDIのみ再生します。スピードモードを無効にすると、エンコーディング全体が再生されます。',
  },
  closeMidiPlaybackControlBarButton: { description: 'MIDI再生コントロールバーを非表示' },
  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mei-friend設定',
    description: 'mei-friend設定',
  },
  mfReset: {
    text: 'デフォルト',
    description: 'mei-friendのデフォルトにリセット',
  },
  filterSettings: {
    placeholder: '設定をフィルター',
    description: 'ここに入力して設定をフィルタリング',
  },
  closeSettingsButton: {
    description: '設定パネルを閉じる',
  },
  hideSettingsButton: {
    description: '設定パネルを閉じる',
  },
  titleGeneral: {
    text: '一般',
    description: '一般的なmei-friend設定',
  },
  selectToolkitVersion: {
    text: 'Verovioバージョン',
    description:
      'Verovioツールキットバージョンを選択' +
      '（3.11.0以前の古いバージョンに切り替える場合は、メモリの問題のためリフレッシュが必要です）',
  },
  toggleSpeedMode: {
    text: 'スピードモード',
    description:
      'Verovioスピードモードを切り替えます。' +
      'スピードモードでは、現在のページのみが' +
      '大きなファイルのレンダリング時間を短縮するためにVerovioに送信されます。',
  },
  selectIdStyle: {
    text: '生成されたxml:idsのスタイル',
    description:
      '新しく生成されたxml:idsのスタイル（既存のxml:idsは変更されません）' +
      '例：Verovioオリジナル："note-0000001318117900"、' +
      'Verovioベース36："nophl5o"、' +
      'mei-friendスタイル："note-ophl5o"',
  },
  addApplicationNote: {
    text: 'アプリケーションステートメントを挿入',
    description:
      'エンコーディングのMEIヘッダーの説明にアプリケーションステートメントを挿入し、' +
      'アプリケーション名、バージョン、最初の編集日、最後の編集日を識別します。',
  },
  selectLanguage: {
    text: '言語',
    description: 'mei-friendインターフェースの言語を選択します。',
  },

  // Drag select
  dragSelection: {
    text: 'ドラッグ選択',
    description: 'マウスドラッグで音符の要素を選択',
  },
  dragSelectNotes: {
    text: '音符を選択',
    description: '音符を選択',
  },
  dragSelectRests: {
    text: '休符を選択',
    description: '休符とリピート（rest、mRest、beatRpt、halfmRpt、mRpt）を選択',
  },
  dragSelectControlElements: {
    text: '配置要素を選択',
    description: '配置要素を選択（@placement属性を持つ要素: ' + att.attPlacement.join(', ') + '）',
  },
  dragSelectSlurs: {
    text: 'スラーを選択',
    description: 'スラーを選択（@curvature属性を持つ要素: ' + att.attCurvature.join(', ') + '）',
  },
  dragSelectMeasures: {
    text: '小節を選択',
    description: '小節を選択',
  },
  // Control menu
  controlMenuSettings: {
    text: '楽譜操作メニュー',
    description: '楽譜上部に表示される操作メニューの項目を定義します',
  },
  controlMenuFlipToPageControls: {
    text: 'ページめくりコントロールを表示',
    description: '楽譜操作メニューにページめくりコントロールを表示',
  },
  controlMenuUpdateNotation: {
    text: '楽譜更新コントロールを表示',
    description: '楽譜操作メニューに楽譜更新動作コントロールを表示',
  },
  controlMenuFontSelector: {
    text: '楽譜フォントセレクタを表示',
    description: '楽譜操作メニューに楽譜フォント（SMuFL）セレクタを表示',
  },
  controlMenuNavigateArrows: {
    text: 'ナビゲーション矢印を表示',
    description: '楽譜操作メニューに楽譜ナビゲーション矢印を表示',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'スピードモードチェックボックスを表示',
    description: '楽譜操作メニューにスピードモードチェックボックスを表示',
  },

  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI再生',
    description: 'MIDI再生設定',
  },
  showMidiPlaybackContextualBubble: {
    text: '再生ショートカットを表示',
    description:
      'MIDI再生コントロールバーが閉じられたときに、ショートカット（左下隅にバブルが表示され、クリックしてすぐに再生を開始できます）を表示させます',
  },
  showMidiPlaybackControlBar: {
    text: 'MIDI再生コントロールバーを表示',
    description: 'MIDI再生コントロールバーを表示',
  },
  scrollFollowMidiPlayback: {
    text: 'MIDI再生に合わせてスクロール',
    description: '現在のページのMIDI再生に合わせて楽譜パネルをスクロール',
  },
  pageFollowMidiPlayback: {
    text: 'ページに合わせてMIDI再生',
    description: 'MIDI再生に合わせて自動的にページをめくります',
  },
  highlightCurrentlySoundingNotes: {
    text: '現在の演奏中の音符を強調表示',
    description: 'MIDI再生中に楽譜パネルで現在演奏中の音符を視覚的に強調表示します',
  },
  selectMidiExpansion: {
    text: '再生拡張',
    description: 'MIDI再生に使用される拡張要素を選択',
  },

  // Transposition
  titleTransposition: {
    text: '移調',
    description: '楽譜情報を移調',
  },
  enableTransposition: {
    text: '移調を有効にする',
    description:
      '移調設定を有効にし、下の移調ボタンをクリックして適用します。移調は楽譜にのみ適用され、エンコードは変更されません。"Manipulate"ドロップダウンメニューで"Verovioを介して再レンダリング"をクリックしない限り。',
  },
  transposeInterval: {
    text: '音程で移調',
    description: '最も一般的な音程（Verovioはベース40システムをサポート）による音程でエンコードを移調',
    labels: [
      '完全一度',
      '増四度',
      '減二度',
      '短2度',
      '長2度',
      '増2度',
      '減3度',
      '短3度',
      '長3度',
      '増3度',
      '減4度',
      '完全4度',
      '増4度',
      '減5度',
      '完全5度',
      '増5度',
      '減6度',
      '短6度',
      '長6度',
      '増6度',
      '減7度',
      '短7度',
      '長7度',
      '増7度',
      '減8度',
      '完全8度',
    ],
  },
  // Transposition
  transposeKey: {
    text: 'キーに移調',
    description: 'キーに移調',
    labels: [
      'C#メジャー / A#マイナー',
      'F#メジャー / D#マイナー',
      'Bメジャー / G#マイナー',
      'Eメジャー / C#マイナー',
      'Aメジャー / F#マイナー',
      'Dメジャー / Bマイナー',
      'Gメジャー / Eマイナー',
      'Cメジャー / Aマイナー',
      'Fメジャー / Dマイナー',
      'B♭メジャー / Gマイナー',
      'E♭メジャー / Cマイナー',
      'A♭メジャー / Fマイナー',
      'D♭メジャー / B♭マイナー',
      'G♭メジャー / E♭マイナー',
      'C♭メジャー / A♭マイナー',
    ],
  },
  transposeDirection: {
    text: '音高の方向',
    description: '移調の音高の方向（上/下）',
    labels: ['上', '下', '最も近い'],
  },
  transposeButton: {
    text: '移調',
    description:
      '上記の設定で楽譜に移調を適用します。ただし、MEIエンコーディングは変更されず、現在の設定でMEIエンコーディングも移調するには、"Manipulate"ドロップダウンメニューで"Verovioを介して再レンダリング"を使用してください。',
  },

  // Renumber measures
  renumberMeasuresHeading: {
    text: '小節番号の振り直し',
    description: '小節番号の振り直しの設定',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: '不完全な小節を振り直し続ける',
    description: '不完全な小節（@metcon="false"の場合）を振り直し続ける',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: '不完全な小節に接尾辞を使用',
    description: '不完全な小節に番号の接尾辞を使用（例：23-cont）',
    labels: ['なし', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'エンディングを振り直し続ける',
    description: 'エンディングを振り直し続ける',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'エンディングに接尾辞を使用',
    description: 'エンディングに番号の接尾辞を使用（例：23-a）',
  },

  // Annotations
  titleAnnotations: {
    text: '注釈',
    description: '注釈設定',
  },
  showAnnotations: {
    text: '注釈を表示',
    description: '楽譜に注釈を表示',
  },
  showAnnotationPanel: {
    text: '注釈パネルを表示',
    description: '注釈パネルを表示',
  },
  annotationDisplayLimit: {
    text: '注釈の最大数',
    description: '表示する注釈の最大数（大きな数値はmei-friendを遅くする可能性があります）',
  },

  // Facsimile
  titleFacsimilePanel: {
    text: '写真パネル',
    description: 'ソース版の写真イメージを表示します（利用可能な場合）',
  },
  showFacsimilePanel: {
    text: '写真パネルを表示',
    description: '写真パネルで提供されたソース版のスコアイメージを表示',
  },
  selectFacsimilePanelOrientation: {
    text: '写真パネルの位置',
    description: '楽譜に対する写真パネルの位置を選択',
    labels: ['左', '右', '上', '下'],
  },
  facsimileZoomInput: {
    text: '写真イメージのズーム（％）',
    description: '写真イメージのズームレベル（パーセント単位）',
  },
  showFacsimileFullPage: {
    text: 'フルページを表示',
    description: 'フルページで写真イメージを表示',
  },
  showFacsimileZones: {
    text: '写真ゾーンボックスを表示',
    description: '写真ゾーンの境界ボックスを表示',
  },
  editFacsimileZones: {
    text: '写真ゾーンを編集',
    description: '写真ゾーンを編集（境界ボックスを写真ゾーンにリンクします）',
  },
  // Supplied element
  titleSupplied: {
    text: '編集コンテンツを操作',
    description: '<supplied>要素の操作を制御します',
  },
  showSupplied: {
    text: '<supplied>要素を表示',
    description: '<supplied>要素に含まれるすべての要素を強調表示します',
  },
  suppliedColor: {
    text: '<supplied>の強調表示色を選択',
    description: '<supplied>の強調表示色を選択',
  },
  respSelect: {
    text: '<supplied>の責任者を選択',
    description: '責任者IDを選択',
  },

  // EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'エディタ設定',
  },
  cmReset: {
    text: 'デフォルト',
    description: 'mei-friendのデフォルトにリセット',
  },
  titleAppearance: {
    text: 'エディタの外観',
    description: 'エディタの外観を制御します',
  },
  zoomFont: {
    text: 'フォントサイズ（％）',
    description: 'エディタのフォントサイズを変更します（パーセント単位）',
  },
  theme: {
    text: 'テーマ',
    description: 'エディタのテーマを選択',
  },
  matchTheme: {
    text: '楽譜がテーマに一致',
    description: '楽譜をエディタのカラーテーマに合わせる',
  },
  tabSize: {
    text: 'インデントサイズ',
    description: '各インデントレベルに対するスペース文字の数',
  },
  lineWrapping: {
    text: '行の折り返し',
    description: 'パネルの末尾で行が折り返されるかどうか',
  },
  lineNumbers: {
    text: '行番号',
    description: '行番号を表示',
  },
  firstLineNumber: {
    text: '最初の行番号',
    description: '最初の行番号を設定',
  },
  foldGutter: {
    text: 'コードの折りたたみ',
    description: '折りたたみガターを介したコードの折りたたみを有効にする',
  },
  titleEditorOptions: {
    text: 'エディタの動作',
    description: 'エディタの動作を制御します',
  },
  autoValidate: {
    text: '自動検証',
    description: '各編集後にスキーマに対して自動的にエンコーディングを検証',
  },
  autoShowValidationReport: {
    text: '自動的に検証レポートを表示',
    description: '検証が実行された後、自動的に検証レポートを表示',
  },
  autoCloseBrackets: {
    text: '自動的に括弧を閉じる',
    description: '入力時に自動的に括弧を閉じる',
  },
  autoCloseTags: {
    text: '自動的にタグを閉じる',
    description: '入力時に自動的にタグを閉じる',
    type: 'bool',
  },
  matchTags: {
    text: 'タグの一致',
    description: 'エディタカーソル周りの一致したタグを強調表示',
  },
  showTrailingSpace: {
    text: 'トレーリングスペースを強調表示',
    description: '行末の不要なトレーリングスペースを強調表示',
  },
  keyMap: {
    text: 'キーマップ',
    description: 'キーマップを選択',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Verovio設定',
  },
  vrvReset: {
    text: 'デフォルト',
    description: 'mei-friendのデフォルトにVerovioをリセット',
  },

  // main.js alert messages
  isSafariWarning: {
    text: 'お使いのブラウザはSafariのようです。残念ながら、mei-friendは現在スキーマ検証をサポートしていないため、完全な検証サポートのために他のブラウザをご使用ください。',
  },
  githubLoggedOutWarning: {
    text: `mei-friendのGitHub統合からログアウトしましたが、お使いのブラウザはまだGitHubにログインしています！
          <a href="https://github.com/logout" target="_blank">こちらをクリックしてGitHubからログアウト</a>してください。`,
  },
  generateUrlError: {
    text: 'ローカルファイルのURLを生成できません',
  },
  generateUrlSuccess: {
    text: 'URLがクリップボードに正常にコピーされました',
  },
  generateUrlNotCopied: {
    text: 'URLがクリップボードにコピーされませんでした。もう一度お試しください。',
  },
  errorCode: { text: 'エラーコード' },
  submitBugReport: { text: 'バグ報告を提出' },
  loadingSchema: { text: 'スキーマを読み込み中' },
  schemaLoaded: { text: 'スキーマが読み込まれました' },
  noSchemaFound: { text: 'MEI内でスキーマ情報が見つかりません' },
  schemaNotFound: { text: 'スキーマが見つかりません' },
  errorLoadingSchema: { text: 'スキーマの読み込み中にエラーが発生しました' },
  notValidated: { text: '検証されていません。ここをクリックして検証してください。' },
  validatingAgainst: { text: '検証中' },
  validatedAgainst: { text: '検証済み' },
  validationMessages: { text: '検証メッセージ' },
  validationComplete: { text: '検証完了' },
  validationFailed: { text: '検証に失敗しました' },
  noErrors: { text: 'エラーなし' },
  errorsFound: { text: 'エラーが見つかりました（エラー数：5）' },

  // GitHub-menu.js
  githubRepository: { text: 'リポジトリ' },
  githubBranch: { text: 'ブランチ' },
  githubFilepath: { text: 'ファイルパス' },
  githubCommit: { text: 'コミット' },
  githubCommitButton: { classes: { commitAsNewFile: { value: '新しいファイルとしてコミット' } }, value: 'コミット' },
  commitLog: { text: 'コミットログ' },
  githubDate: { text: '日付' },
  githubAuthor: { text: '著者' },
  githubMessage: { text: 'メッセージ' },
  none: { text: 'なし' },
  commitFileNameText: { text: 'ファイル名' },
  forkRepository: { text: 'リポジトリをフォーク' },
  forkError: { text: '申し訳ありません、リポジトリをフォークできませんでした' },
  loadingFile: { text: 'ファイルを読み込み中' },
  loadingFromGithub: { text: 'GitHubから読み込み中' },
  logOut: { text: 'ログアウト' },
  githubLogout: { text: 'ログアウト' },
  selectRepository: { text: 'リポジトリを選択' },
  selectBranch: { text: 'ブランチを選択' },
  commitMessageInput: { placeholder: 'mei-friendオンラインで更新' },
  reportIssueWithEncoding: { value: 'エンコーディングの問題を報告' },
  clickToOpenInMeiFriend: { text: 'mei-friendで開くにはクリックしてください' },
  repoAccessError: { text: '申し訳ありません、指定されたユーザーまたは組織のリポジトリにアクセスできません' },
  allComposers: { text: 'すべての作曲家' },

  // Utils renumber measures
  renumberMeasuresModalText: { text: '小節番号を再番号付け' },
  renumberMeasuresModalTest: { text: 'テスト' },
  renumberMeasuresWillBe: { text: 'になります' },
  renumberMeasuresWouldBe: { text: 'になります' },
  renumberMeasuresChangedTo: { text: 'に変更されました' },
  renumberMeasureMeasuresRenumbered: { text: '小節が再番号付けされました' },

  // Code checker @accid.ges
  codeCheckerTitle: { text: '@accid.ges属性をチェック（調号、小節ごとのaccids、タイ）' },
  codeCheckerFix: { text: '修正' },
  codeCheckerFixAll: { text: 'すべて修正' },
  codeCheckerIgnore: { text: '無視' },
  codeCheckerIgnoreAll: { text: 'すべて無視' },
  codeCheckerCheckingCode: { text: 'コードをチェック中...' },
  codeCheckerNoAccidMessagesFound: { text: 'すべてのaccid.ges属性が正しいようです' },
  codeCheckerMeasure: { text: '小節' },
  codeCheckerNote: { text: '音符' },
  codeCheckerHasBoth: { text: '両方を持つ' },
  codeCheckerAnd: { text: 'および' },
  codeCheckerRemove: { text: '削除' },
  codeCheckerFixTo: { text: '次に修正' },
  codeCheckerAdd: { text: '追加' },
  codeCheckerWithContradictingContent: { text: '矛盾するコンテンツを持つ' },
  codeCheckerTiedNote: { text: 'タイした音符' },
  codeCheckerNotSamePitchAs: { text: '同じ音高ではありません' },
  codeCheckerNotSameOctaveAs: { text: '同じオクターブではありません' },
  codeCheckerNotSameAsStartingNote: { text: '開始音符と同じではありません' },
  codeCheckerExtra: { text: '余分な' }, // 余分な
  codeCheckerHasExtra: { text: '余分な' }, // 余分な
  codeCheckerLacksAn: { text: '持っていません' },
  codeCheckerBecauseAlreadyDefined: { text: '以前に同じ要素が定義されているため' },

  // Warning for missing ids
  missingIdsWarningAlert: {
    text: '「メイフレンドはエンコーディング内の選択された要素にスクロールできません。エンコーディングにIDを追加してください。 (メイフレンドはエンコーディングないのせんたくされたようそにすくろーるできません。エンコーディングにIDをついかしてください。)',
  },
};
