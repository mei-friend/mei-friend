/**
 * Language file for French / Français
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Main menu bar
  githubLoginLink: { text: 'Connexion' },

  month: {
    jan: 'Janvier',
    feb: 'Février',
    mar: 'Mars',
    apr: 'Avril',
    may: 'Mai',
    jun: 'Juin',
    jul: 'Juillet',
    aug: 'Août',
    sep: 'Septembre',
    oct: 'Octobre',
    nov: 'Novembre',
    dec: 'Décembre',
  },

  // FILE MENU ITEM / ÉLÉMENT DE MENU FICHIER
  fileMenuTitle: { text: 'Fichier' },
  openMeiText: { text: 'Ouvrir le fichier' },
  openUrlText: { text: "Ouvrir l'URL" },
  openExample: {
    text: 'Répertoire public',
    description: 'Ouvrir une liste de répertoire de domaine public',
  },
  importMusicXml: { text: 'Importer MusicXML' },
  importHumdrum: { text: 'Importer Humdrum' },
  importPae: { text: 'Importer PAE, ABC' },
  saveMeiText: { text: 'Enregistrer MEI' },
  saveSvg: { text: 'Enregistrer SVG' },
  saveMidi: { text: 'Enregistrer MIDI' },
  printPreviewText: { text: 'Aperçu PDF' },
  generateUrlText: { text: 'Générer URL mei-friend' },

  // EDIT/CODE MENU ITEM / ÉLÉMENT DE MENU ÉDITION/ CODE
  editMenuTitle: { text: 'Code' },
  undoMenuText: { text: 'Annuler' },
  redoMenuText: { text: 'Rétablir' },
  startSearchText: { text: 'Rechercher' },
  findNextText: { text: 'Trouver le suivant' },
  findPreviousText: { text: 'Trouver le précédent' },
  replaceMenuText: { text: 'Remplacer' },
  replaceAllMenuText: { text: 'Tout remplacer' },
  indentSelectionText: { text: "Sélection d'indentation" },
  surroundWithTagsText: { text: 'Entourer de tags' },
  surroundWithLastTagText: { text: 'Entourer de ' },
  jumpToLineText: { text: 'Aller à la ligne' },
  toMatchingTagText: { text: 'Aller au tag correspondant' },
  manualValidateText: { text: 'Valider' },

  // VIEW MENU ITEM / ELEMENT DE MENU AFFICHAGE
  viewMenuTitle: { text: 'Afficher' },
  notationTop: { text: 'Notation en haut' },
  notationBottom: { text: 'Notation en bas' },
  notationLeft: { text: 'Notation à gauche' },
  notationRight: { text: 'Notation à droite' },
  showSettingsMenuText: { text: 'Panneau des paramètres' },
  showAnnotationMenuText: { text: 'Panneau des annotations' },
  showFacsimileMenuText: { text: 'Panneau des fac-similés' },
  showPlaybackControlsText: { text: 'Contrôles de lecture' },
  facsimileTop: { text: 'Fac-similé en haut' },
  facsimileBottom: { text: 'Fac-similé en bas' },
  facsimileLeft: { text: 'Fac-similé à gauche' },
  facsimileRight: { text: 'Fac-similé à droite' },

  // MANIPULATE MENU ITEM / ELEMENT DE MENU MANIPULATION
  manipulateMenuTitle: { text: 'Manipuler' },
  invertPlacementText: { text: 'Inverser le placement' },
  betweenPlacementText: { text: 'Placement entre deux' },
  addVerticalGroupText: { text: 'Ajouter un groupe vertical' },
  deleteText: { text: "Supprimer l'élément" },
  pitchUpText: { text: "Monter d'un ton" },
  pitchDownText: { text: "Descendre d'un ton" },
  pitchOctaveUpText: { text: "Monter d'une octave" },
  pitchOctaveDownText: { text: "Descendre d'une octave" },
  staffUpText: { text: "Élément d'un personnel vers le haut" },
  staffDownText: { text: "Élément d'un personnel vers le bas" },
  increaseDurText: { text: 'Augmenter la durée' },
  decreaseDurText: { text: 'Réduire la durée' },
  cleanAccidText: { text: 'Vérifier les @accid.ges' },
  renumberMeasuresTestText: { text: 'Renommer les mesures (test)' },
  renumberMeasuresExecText: { text: 'Renommer les mesures (exécution)' },
  addIdsText: { text: 'Ajouter des identifiants à MEI' },
  removeIdsText: { text: 'Supprimer les identifiants de MEI' },
  reRenderMeiVerovio: { text: 'Rendu à nouveau via Verovio' },
  addFacsimile: { text: 'Ajouter un élément de fac-similé' },
  ingestFacsimileText: { text: 'Ingestion de fac-similé' },

  // INSERT MENU ITEM  ELEMENT DE MENU INSERTION
  insertMenuTitle: { text: 'Insérer' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Directive' },
  addDynamicsText: { text: 'Dynamique' },
  addSlurText: { text: 'Liaison' },
  addTieText: { text: 'Ligature' },
  addCrescendoHairpinText: { text: 'Crescendo' },
  addDiminuendoHairpinText: { text: 'Diminuendo' },
  addBeamText: { text: 'Faisceau' },
  addBeamSpanText: { text: 'Envergure de faisceau' },
  addSuppliedText: { text: 'Fourni' },
  addSuppliedArticText: { text: 'Fourni (artic)' },
  addSuppliedAccidText: { text: 'Fourni (accid)' },
  addArpeggioText: { text: 'Arpège' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pédale enfoncée' },
  addPedalUpText: { text: 'Pédale relevée' },
  addTrillText: { text: 'Trille' },
  addTurnText: { text: 'Tour' },
  addTurnLowerText: { text: 'Tour vers le bas' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Mordent supérieur' },
  addOctave8AboveText: { text: 'Octave (8va au-dessus)' },
  addOctave15AboveText: { text: 'Octave (15ma au-dessus)' },
  addOctave8BelowText: { text: 'Octave (8va en-dessous)' },
  addOctave15BelowText: { text: 'Octave (15ma en-dessous)' },
  addGClefChangeBeforeText: { text: 'Changement de clef de sol avant' },
  addGClefChangeAfterText: { text: 'Changement de clef de sol après' },
  addFClefChangeBeforeText: { text: 'Changement de clef de fa avant' },
  addFClefChangeAfterText: { text: 'Changement de clef de fa après' },
  addCClefChangeBeforeText: { text: 'Changement de clef de do avant' },
  addCClefChangeAfterText: { text: 'Changement de clef de do après' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Accent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM / ÉLÉMENT DE MENU D'AIDE
  helpMenuTitle: { text: 'Aide' },
  goToHelpPage: { text: "Pages d'aide de mei-friend" },
  showChangelog: { text: 'Afficher le journal des modifications de mei-friend' },
  goToGuidelines: { text: 'Afficher les lignes directrices MEI' },
  consultGuidelinesForElementText: { text: "Consulter les lignes directrices pour l'élément actuel" },
  provideFeedback: { text: 'Fournir des commentaires' },
  resetDefault: { text: 'Réinitialiser par défaut' },

  // panel icons / icônes du panneau
  showMidiPlaybackControlBarButton: { description: 'Basculer la barre de contrôle de lecture MIDI' },
  showFacsimileButton: { description: 'Basculer le panneau de fac-similé' },
  showAnnotationsButton: { description: "Afficher/Masquer le panneau d'annotations" },
  showSettingsButton: { description: 'Afficher le panneau des paramètres' },

  // Footer texts / Textes du pied de page
  leftFooter: {
    html:
      'Hébergé par <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      'à <a href="https://mdw.ac.at">mdw</a>, avec ' +
      heart +
      ' de Vienne. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Mentions légales</a>.',
  },
  loadingVerovio: { text: 'Chargement de Verovio' },
  verovioLoaded: { text: 'chargé' },
  convertedToPdf: { text: 'converti en PDF' },
  statusBarCompute: { text: 'Calculer' },
  middleFooterPage: { text: 'page' },
  middleFooterOf: { text: 'sur' },
  middleFooterLoaded: { text: 'chargées' },

  // control menu / Menu de contrôle
  verovioIcon: {
    description: `Activité de travail de mei-friend : 
  la rotation dans le sens horaire indique l'activité de Verovio, 
  la rotation dans le sens antihoraire indique l'activité du travailleur`,
  },
  decreaseScaleButton: { description: 'Réduire la notation' },
  verovioZoom: { description: 'Modifier la taille de la notation' },
  increaseScaleButton: { description: 'Augmenter la notation' },
  pagination1: { html: 'Page ' },
  pagination3: { html: ' sur' },
  sectionSelect: { description: "Naviguer dans la structure d'encodage des sections/fins" },
  firstPageButton: { description: 'Aller à la première page' },
  previousPageButton: { description: 'Aller à la page précédente' },
  paginationLabel: {
    description: 'Navigation de la page : cliquez pour entrer manuellement le numéro de page à afficher',
  },
  nextPageButton: { description: 'Aller à la page suivante' },
  lastPageButton: { description: 'Aller à la dernière page' },
  flipCheckbox: { description: "Tourner automatiquement la page vers la position du curseur d'encodage" },
  flipButton: { description: "Tourner manuellement la page vers la position du curseur d'encodage" },
  breaksSelect: { description: 'Définir le comportement des sauts de système/page de la notation' },
  breaksSelectNone: { text: 'Aucun' },
  breaksSelectAuto: { text: 'Automatique' },
  breaksSelectMeasure: { text: 'Mesure' },
  breaksSelectLine: { text: 'Système' },
  breaksSelectEncoded: { text: 'Système et page' },
  breaksSelectSmart: { text: 'Intelligent' },
  updateControlsLabel: {
    text: 'Mise à jour',
    description: "Comportement de mise à jour des contrôles de la notation après les modifications de l'encodage",
  },
  liveUpdateCheckbox: {
    description: "Mettre automatiquement à jour la notation après les modifications de l'encodage",
  },
  codeManualUpdateButton: { description: 'Mettre manuellement à jour la notation' },
  engravingFontSelect: { description: 'Sélectionnez la police de gravure' },
  backwardsButton: { description: 'Naviguer vers la gauche dans la notation' },
  forwardsButton: { description: 'Naviguer vers la droite dans la notation' },
  upwardsButton: { description: 'Naviguer vers le haut dans la notation' },
  downwardsButton: { description: 'Naviguer vers le bas dans la notation' },
  speedLabel: {
    text: 'Mode de vitesse',
    description:
      'En mode de vitesse, seule la page actuelle est envoyée à Verovio pour réduire le temps de rendu avec des fichiers volumineux',
  },

  // PDF/print preview panel / Panneau d'aperçu PDF/impression
  pdfSaveButton: { text: 'Enregistrer en PDF', description: 'Enregistrer en tant que PDF' },
  pdfCloseButton: { description: "Fermer l'aperçu d'impression" },
  pagesLegendLabel: { text: 'Plage de pages', singlePage: 'page', multiplePages: 'pages' },
  selectAllPagesLabel: { text: 'Tout' },
  selectCurrentPageLabel: { text: 'Page actuelle' },
  selectFromLabel: { text: 'de :' },
  selectToLabel: { text: 'à :' },
  selectPageRangeLabel: { text: 'Plage de pages :' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Seule la page actuelle est rendue en PDF, car le mode de vitesse est activé. ' +
      'Décochez le mode de vitesse pour sélectionner toutes les pages.',
  },
  pdfPreviewNormalModeTitle: { text: 'Sélectionnez la plage de pages à enregistrer en PDF.' },

  // facsimile panel / Panneau de fac-similé
  facsimileIcon: { description: 'Panneau de fac-similé' },
  facsimileDecreaseZoomButton: { description: "Réduire l'image de notation" },
  facsimileZoom: { description: "Ajuster la taille de l'image de notation" },
  facsimileIncreaseZoomButton: { description: "Agrandir l'image de notation" },
  facsimileFullPageLabel: { text: 'Page complète', description: "Afficher la page complète de l'image de fac-similé" },
  facsimileFullPageCheckbox: { description: "Afficher la page complète de l'image de fac-similé" },
  facsimileShowZonesLabel: { text: 'Afficher les zones', description: 'Afficher les zones de la fac-similé' },
  facsimileShowZonesCheckbox: { description: 'Afficher les zones de la fac-similé' },
  facsimileEditZonesCheckbox: { description: 'Modifier les zones de la fac-similé' },
  facsimileEditZonesLabel: { text: 'Modifier les zones', description: 'Modifier les zones de la fac-similé' },
  facsimileCloseButton: { description: 'Fermer le panneau de fac-similé' },
  facsimileDefaultWarning: { text: 'Aucun contenu de fac-similé à afficher.' },
  facsimileNoSurfaceWarning: {
    text: 'Aucun élément de surface trouvé pour cette page. (Un élément pb initial pourrait être manquant.)',
  },
  facsimileNoZonesFullPageWarning: { text: 'Fac-similé sans zones uniquement visible en mode page entière.' },
  facsimileImgeNotLoadedWarning: { text: "Impossible de charger l'image." },

  // drag'n'drop
  dragOverlayText: { text: "Faites glisser votre fichier d'entrée ici." },

  // public repertoire / répertoire public
  openUrlHeading: { text: 'Ouvrir une encodage hébergée sur le Web via une URL' },
  openUrlInstructions: {
    text: "Veuillez choisir dans le répertoire public ou entrer l'URL d'un encodage musical hébergé sur le Web, ci-dessous. Remarque: Le serveur hôte doit prendre en charge le partage de ressources entre origines différentes (CORS).",
  },
  publicRepertoireSummary: { text: 'Répertoire public' },
  sampleEncodingsComposerLabel: { text: 'Compositeur :' },
  sampleEncodingsEncodingLabel: { text: 'Encodage :' },
  sampleEncodingsOptionLabel: { text: 'Choisissez un encodage...' },
  openUrlButton: { text: "Ouvrir l'URL" },
  openUrlCancel: { text: 'Annuler' },
  proposePublicRepertoire: {
    html:
      "Nous accueillons les propositions d'ajout au " +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'répertoire public' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Choisissez un encodage...' },
  openUrlChooseComposerText: { text: 'Choisissez un compositeur...' },
  openUrlOpenEncodingByUrlText: { text: 'Ouvrir une encodage hébergée sur le Web via une URL' },

  // Modal GitHub actions
  githubActionsHeadingText: { text: 'Demander le flux de travail GitHub :' },
  githubActionsDescription: {
    text: "Cliquez sur \"Exécuter le flux de travail\" pour demander à l'API GitHub d'exécuter le flux de travail ci-dessus pour vous, en utilisant la configuration d'entrée spécifiée ci-dessous. Votre encodage sera rechargé dans sa dernière version une fois que l'exécution du flux de travail sera terminée.",
  },
  githubActionStatusMsgPrompt: { text: "Impossible d'exécuter le flux de travail - GitHub dit :" },
  githubActionStatusMsgWaiting: { text: 'Veuillez patienter pendant que GitHub traite votre flux de travail...' },
  githubActionStatusMsgFailure: { text: "Impossible d'exécuter le flux de travail - GitHub dit :" },
  githubActionStatusMsgSuccess: { text: 'Exécution du flux de travail terminée - GitHub dit :' },
  githubActionsRunButton: { text: 'Exécuter le flux de travail' },
  githubActionsRunButtonReload: { text: 'Recharger le fichier MEI' },
  githubActionsCancelButton: { text: 'Annuler' },
  githubActionsInputSetterFilepath: { text: "Copier le chemin du fichier actuel dans l'entrée" },
  githubActionsInputSetterSelection: { text: "Copier la sélection MEI actuelle dans l'entrée" },
  githubActionsInputContainerHeader: { text: "Configuration d'entrée" },

  // fork modals / fenêtres modales de fork
  forkRepoGithubText: { text: 'Créer une copie du dépôt Github' },
  forkRepoGithubExplanation: {
    text: 'Le lien que vous avez suivi ' + "créera une copie du dépôt GitHub suivant pour l'édition dans mei-friend :",
  },
  forkRepoGithubConfirm: { text: 'Est-ce correct ?' },
  forkRepositoryInstructions: {
    text: "Veuillez choisir dans le répertoire public ou entrer le nom GitHub (utilisateur ou organisation) et le nom du dépôt d'un dépôt hébergé sur GitHub, ci-dessous. Votre dépôt forké sera disponible dans le menu Github.",
  },
  forkRepositoryGithubText: { text: 'Créer une copie du dépôt Github' },
  forkRepertoireSummary: { text: 'Répertoire public' },
  forkRepertoireComposerLabel: { text: 'Compositeur : ' },
  forkRepertoireOrganizationLabel: { text: 'Organisation : ' },
  forkRepertoireOrganizationOption: { text: 'Choisir une organisation GitHub...' },
  forkRepertoireRepositoryLabel: { text: 'Dépôt : ' },
  forkRepertoireRepositoryOption: { text: 'Choisir un encodage...' },
  forkRepositoryInputName: { placeholder: "Nom d'utilisateur ou d'organisation Github" },
  forkRepositoryInputRepoOption: { text: 'Choisir un dépôt' },
  forkRepositoryToSelectorText: { text: 'Fork vers : ' },
  forkRepositoryButton: { text: 'Forker le dépôt' },
  forkRepositoryCancel: { text: 'Annuler' },
  forkProposePublicRepertoire: {
    html:
      'Nous acceptons les propositions pour des ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'ajouts au répertoire public' +
      '</a>.',
  },

  // CodeMirror editor
  selectTagNameForEnclosure: { text: "Entourer du nom de l'élément" },
  selectTagNameForEnclosureOkButton: { value: 'OK' },
  selectTagNameForEnclosureCancelButton: { value: 'Annuller' },

  // restore Solid session overlay
  solidExplanation: {
    description:
      'Solid est une plateforme décentralisée pour les données liées sociales. Connectez-vous à Solid pour créer des annotations stand-off en utilisant des données liées (RDF).',
  },
  solidProvider: { description: "Veuillez choisir un fournisseur d'identité Solid (IdP) ou spécifier le vôtre." },
  solidLoginBtn: { text: 'Se connecter' },

  solidOverlayCancel: {
    html: 'Restauration de la session Solid - appuyez sur <span>Esc</span> ou cliquez ici pour annuler.',
  },
  solidWelcomeMsg: { text: 'Bienvenue, ' },
  solidLogout: { text: 'Déconnectez-vous' },
  solidLoggedOutWarning: {
    html: `Vous vous êtes déconnecté de l'intégration Solid de mei-friend, mais votre navigateur est toujours connecté à Solid !
      <a id="solidIdPLogoutLink" target="_blank">Cliquez ici pour vous déconnecter de Solid</a>.`,
  },

  // annotation panel / panneau d'annotation
  annotationCloseButtonText: { text: "Fermer le panneau d'annotations" },
  hideAnnotationPanelButton: { description: "Fermer le panneau d'annotations" },
  closeAnnotationPanelButton: { description: "Fermer le panneau d'annotations" },
  annotationToolsButton: { text: 'Outils', description: "Outils d'annotation" },
  annotationListButton: { text: 'Liste', description: 'Liste des annotations' },
  writeAnnotStandoffText: { text: 'Annotation Web' },
  annotationToolsIdentifyTitle: { text: 'Identifier' },
  annotationToolsIdentifySpan: { text: 'Identifier un objet musical' },
  annotationToolsHighlightTitle: { text: 'Surligner' },
  annotationToolsHighlightSpan: { text: 'Surligner' },
  annotationToolsDescribeTitle: { text: 'Décrire' },
  annotationToolsDescribeSpan: { text: 'Décrire' },
  annotationToolsLinkTitle: { text: 'Lien' },
  annotationToolsLinkSpan: { text: 'Lien' },
  listAnnotations: { text: 'Aucune annotation présente.' },
  addWebAnnotation: { text: 'Charger les annotation(s) web' },
  loadWebAnnotationMessage: { text: "Entrez l'URL de l'annotation web ou du conteneur d'annotations web" },
  loadWebAnnotationMessage1: { text: "Impossible de charger l'URL fournie" },
  loadWebAnnotationMessage2: { text: 'veuillez réessayer' },
  noAnnotationsToDisplay: { text: 'Aucune annotation à afficher' },
  flipPageToAnnotationText: { description: 'Aller à cette annotation' },
  deleteAnnotation: { description: 'Supprimer cette annotation' },
  deleteAnnotationConfirmation: { text: 'Êtes-vous sûr de vouloir supprimer cette annotation ?' },
  makeStandOffAnnotation: {
    description: 'Statut stand-off (RDF)',
    descriptionSolid: 'Écrire sur Solid en RDF',
    descriptionToLocal: "Ouvrir l'annotation stand-off (RDF) dans un nouvel onglet",
  },
  makeInlineAnnotation: {
    description: 'Cliquez pour une annotation en ligne',
    descriptionCopy: "Copier l'xml:id de l'annotation dans le presse-papiers",
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'éléments' },
  askForLinkUrl: { text: 'Veuillez entrer une URL pour lier à' },
  drawLinkUrl: { text: 'Ouvrir dans un nouvel onglet' },
  askForDescription: { text: 'Veuillez entrer une description textuelle à appliquer' },
  maxNumberOfAnnotationAlert: {
    text1: `Le nombre d'éléments annotés dépasse le "Nombre maximum d'annotations" configurable`,
    text2: `De nouvelles annotations peuvent encore être générées et seront affichées si "Afficher les annotations" est activé.`,
  },
  annotationsOutsideScoreWarning: {
    text: "Désolé, il est actuellement impossible d'écrire des annotations placées à l'extérieur de la balise <score>",
  },
  annotationWithoutIdWarning: {
    text1: "Impossible d'écrire une annotation car le point d'ancrage MEI ne possède pas d'identifiant xml:",
    text2:
      'Veuillez assigner des identifiants en sélectionnant "Manipuler" -> "Re-render MEI (avec ids)" et réessayer.',
  },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Mode de vitesse',
    description:
      "Le mode de vitesse est actif ; seuls les fichiers MIDI pour la page en cours sont joués. Pour jouer l'ensemble de l'encodage, désactivez le mode de vitesse.",
  },
  closeMidiPlaybackControlBarButton: {
    description: 'Masquer la barre de contrôle de lecture MIDI',
  },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'Paramètres mei-friend',
    description: 'Paramètres mei-friend',
  },
  mfReset: {
    text: 'Réinitialiser',
    description: 'Réinitialiser aux paramètres par défaut de mei-friend',
  },
  filterSettings: {
    placeholder: 'Filtrer les paramètres',
    description: 'Tapez ici pour filtrer les paramètres',
  },
  closeSettingsButton: {
    description: 'Fermer le panneau des paramètres',
  },
  hideSettingsButton: {
    description: 'Fermer le panneau des paramètres',
  },
  titleGeneral: {
    text: 'Général',
    description: 'Paramètres généraux de mei-friend',
  },
  selectToolkitVersion: {
    text: 'Version de Verovio',
    description:
      "Sélectionnez la version de la trousse d'outils Verovio " +
      '(* Le passage à des versions antérieures à 3.11.0 ' +
      'peut nécessiter un rafraîchissement en raison de problèmes de mémoire.)',
  },
  toggleSpeedMode: {
    text: 'Mode de vitesse',
    description:
      'Activer/désactiver le mode de vitesse Verovio. ' +
      'En mode de vitesse, seule la page en cours ' +
      'est envoyée à Verovio pour réduire le temps de rendu ' +
      'avec des fichiers volumineux',
  },
  selectIdStyle: {
    text: 'Style des xml:ids générés',
    description:
      'Style des xml:ids nouvellement générés (les xml:ids existants ne sont pas modifiés)' +
      'par exemple, Verovio original : "note-0000001318117900", ' +
      'base 36 Verovio : "nophl5o", ' +
      'style mei-friend : "note-ophl5o"',
  },
  addApplicationNote: {
    text: "Insérer une déclaration d'application",
    description:
      "Insérer une déclaration d'application dans la description " +
      "d'encodage dans l'en-tête MEI, identifiant " +
      "le nom de l'application, la version, la date de première " +
      'et de dernière édition',
  },
  selectLanguage: {
    text: 'Langue',
    description: "Sélectionnez la langue de l'interface mei-friend.",
  },

  // Drag select / Sélection par glisser-déposer
  dragSelection: {
    text: 'Sélection par glisser-déposer',
    description: 'Sélectionner des éléments dans la notation en faisant glisser la souris',
  },
  dragSelectNotes: {
    text: 'Sélectionner les notes',
    description: 'Sélectionner les notes',
  },
  dragSelectRests: {
    text: 'Sélectionner les pauses',
    description: 'Sélectionner les pauses et les répétitions (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Sélectionner les éléments de placement',
    description:
      "Sélectionner les éléments de placement (c'est-à-dire ceux avec un attribut @placement : ' + att.attPlacement.join(', ') + ')",
  },
  dragSelectSlurs: {
    text: 'Sélectionner les liaisons',
    description:
      "Sélectionner les liaisons (c'est-à-dire les éléments avec un attribut @curvature : ' + att.attCurvature.join(', ') + ')",
  },
  dragSelectMeasures: {
    text: 'Sélectionner les mesures',
    description: 'Sélectionner les mesures',
  },

  // Control menu// Menu de contrôle
  controlMenuSettings: {
    text: 'Barre de contrôle de notation',
    description: 'Définir les éléments à afficher dans le menu de contrôle au-dessus de la notation',
  },
  controlMenuFlipToPageControls: {
    text: 'Afficher les contrôles de changement de page',
    description: 'Afficher les contrôles de changement de page dans le menu de contrôle de notation',
  },
  controlMenuUpdateNotation: {
    text: 'Afficher les contrôles de mise à jour de notation',
    description:
      'Afficher les contrôles de comportement de mise à jour de notation dans le menu de contrôle de notation',
  },
  controlMenuFontSelector: {
    text: 'Afficher le sélecteur de police de notation',
    description: 'Afficher le sélecteur de police de notation (SMuFL) dans le menu de contrôle de notation',
  },
  controlMenuNavigateArrows: {
    text: 'Afficher les flèches de navigation',
    description: 'Afficher les flèches de navigation de notation dans le menu de contrôle de notation',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Afficher la case de mode rapide',
    description: 'Afficher la case de mode rapide dans le menu de contrôle de notation',
  },

  // MIDI Playback / Lecture MIDI
  titleMidiPlayback: {
    text: 'Lecture MIDI',
    description: 'Paramètres de lecture MIDI',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Afficher le raccourci de lecture',
    description:
      'Fait apparaître un raccourci (bulle dans le coin inférieur gauche ; ' +
      'cliquez pour démarrer immédiatement la lecture) ' +
      'lorsque la barre de contrôle de lecture MIDI est fermée',
  },
  showMidiPlaybackControlBar: {
    text: 'Afficher la barre de contrôle de lecture MIDI',
    description: 'Afficher la barre de contrôle de lecture MIDI',
  },
  scrollFollowMidiPlayback: {
    text: 'Suivi de lecture MIDI par défilement',
    description: 'Fait défiler le panneau de notation pour suivre la lecture MIDI sur la page actuelle',
  },
  pageFollowMidiPlayback: {
    text: 'Suivi de lecture MIDI par page',
    description: 'Fait défiler automatiquement les pages pour suivre la lecture MIDI',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Surligner les notes actuellement en train de sonner',
    description:
      'Surligner visuellement les notes actuellement en train de sonner dans le panneau de notation pendant la lecture MIDI',
  },
  selectMidiExpansion: {
    text: 'Extension de lecture',
    description: "Sélectionnez l'élément d'extension à utiliser pour la lecture MIDI",
  },

  // Transposition // Transposition
  titleTransposition: {
    text: 'Transposition',
    description: 'Transposer les informations de partition',
  },
  enableTransposition: {
    text: 'Activer la transposition',
    description:
      "Activer les réglages de transposition, qui seront appliqués grâce au bouton de transposition ci-dessous. La transposition sera appliquée uniquement à la notation, l'encodage restera inchangé, à moins que vous ne cliquiez sur l'option 'Rerender via Verovio' dans le menu déroulant 'Manipuler'.",
  },
  transposeInterval: {
    text: 'Transposer par intervalle',
    description:
      "Transposer l'encodage par intervalle chromatique en utilisant les intervalles les plus courants (Verovio prend en charge le système base-40)",
    labels: [
      'Unisson parfait',
      'Unisson augmenté',
      'Seconde diminuée',
      'Seconde mineure',
      'Seconde majeure',
      'Seconde augmentée',
      'Tierce diminuée',
      'Tierce mineure',
      'Tierce majeure',
      'Tierce augmentée',
      'Quarte diminuée',
      'Quarte juste',
      'Quarte augmentée',
      'Quinte diminuée',
      'Quinte juste',
      'Quinte augmentée',
      'Sixte diminuée',
      'Sixte mineure',
      'Sixte majeure',
      'Sixte augmentée',
      'Septième diminuée',
      'Septième mineure',
      'Septième majeure',
      'Septième augmentée',
      'Octave diminuée',
      'Octave juste',
    ],
  },
  transposeKey: {
    text: 'Transposer vers la tonalité',
    description: 'Transposer vers la tonalité',
    labels: [
      'Ut dièse majeur / La dièse mineur',
      'Fa dièse majeur / Ré dièse mineur',
      'Si majeur / Sol dièse mineur',
      'Mi majeur / Ut dièse mineur',
      'La majeur / Fa dièse mineur',
      'Ré majeur / Si mineur',
      'Sol majeur / Mi mineur',
      'Ut majeur / La mineur',
      'Fa majeur / Ré mineur',
      'Si bémol majeur / Sol mineur',
      'Mi bémol majeur / Ut mineur',
      'La bémol majeur / Fa mineur',
      'Ré bémol majeur / Si bémol mineur',
      'Sol bémol majeur / Mi bémol mineur',
      'Ut bémol majeur / La bémol mineur',
    ],
  },
  transposeDirection: {
    text: 'Direction de transposition',
    description: 'Direction de transposition (vers le haut / vers le bas)',
    labels: ['Vers le haut', 'Vers le bas', 'Le plus proche'],
  },
  transposeButton: {
    text: 'Transposer',
    description: `Appliquer la transposition avec les réglages ci-dessus à la notation, tandis que l'encodage MEI reste inchangé. Pour transposer également l'encodage MEI avec les réglages actuels, utilisez "Rendre via Verovio" dans le menu déroulant "Manipuler".`,
  },

  // Renumber measures / Renommer les mesures
  renumberMeasuresHeading: {
    text: 'Renommer les mesures',
    description: 'Paramètres pour renommer les mesures',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Continuer à travers les mesures incomplètes',
    description: "Continuer les numéros de mesure à travers les mesures incomplètes (@metcon = 'false')",
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Suffixe pour les mesures incomplètes',
    description: 'Utiliser un suffixe numérique pour les mesures incomplètes (par exemple, 23-cont)',
    labels: ['aucun', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Continuer à travers les fins',
    description: 'Continuer les numéros de mesure à travers les fins',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Suffixe pour les fins',
    description: 'Utiliser un suffixe numérique pour les fins (par exemple, 23-a)',
  },

  // Annotations
  titleAnnotations: {
    text: 'Annotations',
    description: "Paramètres d'annotation",
  },
  showAnnotations: {
    text: 'Afficher les annotations',
    description: 'Afficher les annotations dans la notation',
  },
  showAnnotationPanel: {
    text: "Afficher le panneau d'annotation",
    description: "Afficher le panneau d'annotation",
  },
  annotationDisplayLimit: {
    text: "Nombre maximal d'annotations",
    description: "Nombre maximal d'annotations à afficher (les grands nombres peuvent ralentir mei-friend)",
  },

  // Facsimile / Fac-similé
  titleFacsimilePanel: {
    text: 'Panneau de fac-similé',
    description: "Afficher les images de fac-similé de l'édition source, si disponibles",
  },
  showFacsimilePanel: {
    text: 'Afficher le panneau de fac-similé',
    description: "Afficher les images de la partition de l'édition source fournies dans l'élément fac-similé",
  },
  selectFacsimilePanelOrientation: {
    text: 'Position du panneau de fac-similé',
    description: 'Sélectionner la position du panneau de fac-similé par rapport à la notation',
    labels: ['gauche', 'droite', 'haut', 'bas'],
  },
  facsimileZoomInput: {
    text: "Zoom de l'image de fac-similé (%)",
    description: "Niveau de zoom de l'image de fac-similé (en pourcentage)",
  },
  showFacsimileFullPage: {
    text: 'Afficher la page complète',
    description: "Afficher l'image de fac-similé sur une page complète",
  },
  showFacsimileZones: {
    text: 'Afficher les zones de fac-similé',
    description: 'Afficher les zones de délimitation de fac-similé',
  },
  editFacsimileZones: {
    text: 'Modifier les zones de fac-similé',
    description: 'Modifier les zones de fac-similé (liera les zones de délimitation aux zones de fac-similé)',
  },

  // Supplied element / Élément fourni
  titleSupplied: {
    text: 'Gérer le contenu éditorial',
    description: 'Contrôle la gestion des éléments <fournis>',
  },
  showSupplied: {
    text: 'Afficher les éléments <fournis>',
    description: 'Surligne tous les éléments contenus par un élément <fourni>',
  },
  suppliedColor: {
    text: 'Sélectionner la couleur de surlignage <fourni>',
    description: 'Sélectionnez la couleur de surlignage <fourni>',
  },
  respSelect: {
    text: 'Sélectionner la responsabilité <fournie>',
    description: "Sélectionner l'identifiant de responsabilité",
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS / PARAMÈTRES DE L'ÉDITEUR / PARAMÈTRES DE CODEMIRROR
  editorSettingsHeader: {
    text: "Paramètres de l'éditeur",
  },
  cmReset: {
    text: 'Défaut',
    description: 'Réinitialiser aux valeurs par défaut de mei-friend',
  },
  titleAppearance: {
    text: "Apparence de l'éditeur",
    description: "Contrôle l'apparence de l'éditeur",
  },
  zoomFont: {
    text: 'Taille de police (%)',
    description: "Modifier la taille de la police de l'éditeur (en pourcentage)",
  },
  theme: {
    text: 'Thème',
    description: "Sélectionnez le thème de l'éditeur",
  },
  matchTheme: {
    text: 'La notation correspond au thème',
    description: "Fait correspondre la notation au thème de couleur de l'éditeur",
  },
  tabSize: {
    text: "Taille de l'indentation",
    description: "Nombre de caractères d'espace pour chaque niveau d'indentation",
  },
  lineWrapping: {
    text: 'Retour automatique à la ligne',
    description: 'Indique si les lignes sont ou non renvoyées à la fin du panneau',
  },
  lineNumbers: {
    text: 'Numéros de ligne',
    description: 'Affiche les numéros de ligne',
  },
  firstLineNumber: {
    text: 'Numéro de la première ligne',
    description: 'Définir le numéro de la première ligne',
  },
  foldGutter: {
    text: 'Pliage de code',
    description: 'Activer le pliage de code via les plis de la gouttière',
  },
  titleEditorOptions: {
    text: "Comportement de l'éditeur",
    description: "Contrôle le comportement de l'éditeur",
  },
  autoValidate: {
    text: 'Validation automatique',
    description: "Valide automatiquement l'encodage par rapport au schéma après chaque édition",
  },
  autoShowValidationReport: {
    text: 'Afficher le rapport de validation automatiquement',
    description: 'Afficher automatiquement le rapport de validation après que la validation a été effectuée',
  },
  autoCloseBrackets: {
    text: 'Fermeture automatique des crochets',
    description: "Ferme automatiquement les crochets à l'entrée",
  },
  autoCloseTags: {
    text: 'Fermeture automatique des balises',
    description: "Ferme automatiquement les balises à l'entrée",
    type: 'bool',
  },
  matchTags: {
    text: 'Correspondance des balises',
    description: "Surligne les balises correspondantes autour du curseur de l'éditeur",
  },
  showTrailingSpace: {
    text: 'Mettre en évidence les espaces en fin de ligne',
    description: 'Met en évidence les espaces inutiles en fin de ligne',
  },
  keyMap: {
    text: 'Carte des touches',
    description: 'Sélectionnez la carte des touches',
  },

  // Verovio settings / Paramètres Verovio
  verovioSettingsHeader: {
    text: 'Paramètres Verovio',
  },
  vrvReset: {
    text: 'Défaut',
    description: 'Réinitialise Verovio aux valeurs par défaut de mei-friend',
  },

  // main.js alert messages / Messages d'alerte main.js
  isSafariWarning: {
    text:
      'Il semble que vous utilisez Safari comme navigateur, sur lequel ' +
      'mei-friend ne prend malheureusement pas en charge la validation de schéma pour le moment. ' +
      'Veuillez utiliser un autre navigateur pour une validation complète.',
  },
  githubLoggedOutWarning: {
    text: `Vous vous êtes déconnecté de l'intégration GitHub de mei-friend, 
  mais votre navigateur est toujours connecté à GitHub! 
  <a href="https://github.com/logout" target="_blank">Cliquez ici pour vous déconnecter de GitHub</a>.`,
  },
  generateUrlError: {
    text: "Impossible de générer l'URL pour le fichier local ",
  },
  generateUrlSuccess: {
    text: 'URL copiée avec succès dans le presse-papiers',
  },
  generateUrlNotCopied: {
    text: 'URL non copiée dans le presse-papiers, veuillez réessayer !',
  },
  errorCode: { text: "Code d'erreur" },
  submitBugReport: { text: 'Soumettre un rapport de bogue' },
  loadingSchema: { text: 'Chargement du schéma' },
  schemaLoaded: { text: 'Schéma chargé' },
  noSchemaFound: { text: 'Aucune information de schéma trouvée dans MEI.' },
  schemaNotFound: { text: 'Schéma introuvable' },
  errorLoadingSchema: { text: 'Erreur lors du chargement du schéma' },
  notValidated: { text: 'Non validé. Appuyez ici pour valider.' },
  validatingAgainst: { text: 'Validation par rapport à' },
  validatedAgainst: { text: 'Validé par rapport à' },
  validationMessages: { text: 'messages de validation' },
  validationComplete: { text: 'Validation terminée' },
  validationFailed: { text: 'Validation échouée' },
  noErrors: { text: "pas d'erreurs" },
  errorsFound: { text: 'erreurs trouvées' }, // 5 erreurs trouvées / 5 errors found

  // github-menu.js // github-menu.js
  githubRepository: { text: 'Répertoire' },
  githubBranch: { text: 'Branche' },
  githubFilepath: { text: 'Chemin' },
  githubCommit: { text: 'Commit' },
  githubCommitButton: {
    classes: { commitAsNewFile: { value: 'Valider en tant que nouveau fichier' } },
    value: 'Validation',
  },
  commitLog: { text: 'Journal des validations' },
  githubDate: { text: 'Date' },
  githubAuthor: { text: 'Auteur' },
  githubMessage: { text: 'Message' },
  none: { text: 'Aucun' },
  commitFileNameText: { text: 'Nom du fichier' },
  forkRepository: { text: 'Créer une copie du répertoire' },
  forkError: { text: 'Désolé, impossible de créer une copie du répertoire' },
  loadingFile: { text: 'Chargement du fichier' },
  loadingFromGithub: { text: 'Chargement depuis Github' },
  logOut: { text: 'Déconnexion' },
  githubLogout: { text: 'Déconnexion de Github' },
  selectRepository: { text: 'Sélectionner le répertoire' },
  selectBranch: { text: 'Sélectionner la branche' },
  commitMessageInput: { placeholder: 'Mis à jour avec mei-friend en ligne' },
  reportIssueWithEncoding: { value: "Signaler un problème d'encodage" },
  clickToOpenInMeiFriend: { text: 'Cliquez pour ouvrir dans mei-friend' },
  repoAccessError: {
    text: "Désolé, impossible d'accéder aux répertoires pour l'utilisateur ou l'organisation fourni(e)",
  },
  allComposers: { text: 'Tous les compositeurs' }, // fork-repository.js

  // utils renumber measures
  renumberMeasuresModalText: { text: 'Renommer les mesures' },
  renumberMeasuresModalTest: { text: 'Tester' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'serait' },
  renumberMeasuresChangedTo: { text: 'changé en' },
  renumberMeasureMeasuresRenumbered: { text: 'mesures renommées' },

  // Code checker panel (accid.ges)
  codeCheckerTitle: {
    text: 'Vérifiez les attributs @accid.ges (par rapport à la signature de clé, les accid. par mesure et les liaisons).',
  },
  codeCheckerFix: { text: 'Corriger' },
  codeCheckerFixAll: { text: 'Tout corriger' },
  codeCheckerIgnore: { text: 'Ignorer' },
  codeCheckerIgnoreAll: { text: 'Tout ignorer' },
  codeCheckerCheckingCode: { text: 'Vérification du code en cours...' },
  codeCheckerNoAccidMessagesFound: { text: 'Tous les attributs accid.ges semblent corrects.' },
  codeCheckerMeasure: { text: 'Mesure' },
  codeCheckerNote: { text: 'Note' },
  codeCheckerHasBoth: { text: 'possède les deux' },
  codeCheckerAnd: { text: 'et' },
  codeCheckerRemove: { text: 'Retirer' },
  codeCheckerFixTo: { text: 'Corriger à' },
  codeCheckerAdd: { text: 'Ajouter' },
  codeCheckerWithContradictingContent: { text: 'avec un contenu contradictoire' },
  codeCheckerTiedNote: { text: 'Note liée' },
  codeCheckerNotSamePitchAs: { text: 'pas la même hauteur que' },
  codeCheckerNotSameOctaveAs: { text: 'pas le même octave que' },
  codeCheckerNotSameAsStartingNote: { text: 'pas identique à la note de départ' },
  codeCheckerExtra: { text: 'supplémentaire' },
  codeCheckerHasExtra: { text: 'possède un élément supplémentaire' },
  codeCheckerLacksAn: { text: "manque d'un" },
  codeCheckerBecauseAlreadyDefined: { text: 'car il a été défini plus tôt dans la mesure' },
};
