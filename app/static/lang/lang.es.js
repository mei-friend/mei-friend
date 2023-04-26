/**
 * Language file for Spanish Espagnol
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Main menu bar / Menú principal
  githubLoginLink: { text: 'Iniciar sesión en GitHub' },

  // FILE MENU ITEM / ELEMENTOS DEL MENÚ ARCHIVO
  fileMenuTitle: { text: 'Archivo' },
  openMeiText: { text: 'Abrir archivo' },
  openUrlText: { text: 'Abrir URL' },
  openExpample: { text: 'Repositorio público', description: 'Lista de repertorio con licencia pública' },
  importMusicXml: { text: 'Importar MusicXML' },
  importHumdrum: { text: 'Importar Humdrum' },
  importPae: { text: 'Importar PAE, ABC' },
  saveMeiText: { text: 'Guardar MEI' },
  saveSvg: { text: 'Guardar SVG' },
  saveMidi: { text: 'Guardar MIDI' },
  printPreviewText: { text: 'Vista previa en PDF' },
  generateUrlText: { text: 'Generar URL de mei-friend' },

  // EDIT/CODE MENU ITEM / ELEMENTOS DEL MENÚ EDICIÓN/CÓDIGO
  editMenuTitle: { text: 'Código' },
  undoMenuText: { text: 'Deshacer' },
  redoMenuText: { text: 'Rehacer' },
  startSearchText: { text: 'Buscar' },
  findNextText: { text: 'Buscar siguiente' },
  findPreviousText: { text: 'Buscar anterior' },
  replaceMenuText: { text: 'Reemplazar' },
  replaceAllMenuText: { text: 'Reemplazar todo' },
  indentSelectionText: { text: 'Indentar selección' },
  jumpToLineText: { text: 'Ir a línea' },
  manualValidateText: { text: 'Validar' },

  // VIEW MENU ITEM / ELEMENTOS DEL MENÚ VER
  viewMenuTitle: { text: 'Ver' },
  notationTop: { text: 'Notación arriba' },
  notationBottom: { text: 'Notación abajo' },
  notationLeft: { text: 'Notación izquierda' },
  notationRight: { text: 'Notación derecha' },
  showSettingsMenuText: { text: 'Configuración' },
  showAnnotationMenuText: { text: 'Anotaciones' },
  showFacsimileMenuText: { text: 'Facsímil' },
  showPlaybackControlsText: { text: 'Reproducción' },
  facsimileTop: { text: 'Facsímil arriba' },
  facsimileBottom: { text: 'Facsímil abajo' },
  facsimileLeft: { text: 'Facsímil izquierda' },
  facsimileRight: { text: 'Facsímil derecha' },

  // MANIPULATE MENU ITEM / MANIPULAR EL ELEMENTO DEL MENÚ
  manipulateMenuTitle: { text: 'Manipular' },
  invertPlacementText: { text: 'Invertir colocación' },
  betweenPlacementText: { text: 'Colocar en medio' },
  addVerticalGroupText: { text: 'Añadir grupo vertical' },
  deleteText: { text: 'Eliminar elemento' },
  pitchUpText: { text: 'Aumentar altura en un semitono' },
  pitchDownText: { text: 'Disminuir altura en un semitono' },
  pitchOctaveUpText: { text: 'Aumentar altura en una octava' },
  pitchOctaveDownText: { text: 'Disminuir altura en una octava' },
  staffUpText: { text: 'Mover elemento una línea de pentagrama hacia arriba' },
  staffDownText: { text: 'Mover elemento una línea de pentagrama hacia abajo' },
  increaseDurText: { text: 'Aumentar duración de nota' },
  decreaseDurText: { text: 'Disminuir duración de nota' },
  cleanAccidText: { text: 'Limpiar @accid.ges' },
  renumberMeasuresTestText: { text: 'Renumerar compases (prueba)' },
  renumberMeasuresExecText: { text: 'Renumerar compases (ejecutar)' },
  addIdsText: { text: 'Añadir IDs a MEI' },
  removeIdsText: { text: 'Eliminar IDs de MEI' },
  reRenderMeiVerovio: { text: 'Volver a renderizar con Verovio' },
  addFacsimile: { text: 'Añadir elemento de faksimile' },
  ingestFacsimileText: { text: 'Leer información de faksimile' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Insertar' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Directiva de juego' },
  addDynamicsText: { text: 'Dinámica' },
  addSlurText: { text: 'Ligadura' },
  addTieText: { text: 'Atadura' },
  addCrescendoHairpinText: { text: 'Crecendo' },
  addDiminuendoHairpinText: { text: 'Disminuendo' },
  addBeamText: { text: 'Haz' },
  addBeamSpanText: { text: 'Extensión de haz' },
  addSuppliedText: { text: 'Suministrado' },
  addSuppliedArticText: { text: 'Suministrado (articulación)' },
  addSuppliedAccidText: { text: 'Suministrado (acento)' },
  addArpeggioText: { text: 'Arpegio' },
  addFermataText: { text: 'Fermata' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pulsar pedal' },
  addPedalUpText: { text: 'Soltar pedal' },
  addTrillText: { text: 'Trino' },
  addTurnText: { text: 'Gruppetto' },
  addTurnLowerText: { text: 'Gruppetto hacia abajo' },
  addMordentText: { text: 'Mordente' },
  addMordentUpperText: { text: 'Trino superior' },
  addOctave8AboveText: { text: 'Octava (8va arriba)' },
  addOctave15AboveText: { text: 'Octava (15va arriba)' },
  addOctave8BelowText: { text: 'Octava (8va abajo)' },
  addOctave15BelowText: { text: 'Octava (15va abajo)' },
  addGClefChangeBeforeText: { text: 'Cambio de clave de Sol antes' },
  addGClefChangeAfterText: { text: 'Cambio de clave de Sol después' },
  addFClefChangeBeforeText: { text: 'Cambio de clave de Fa antes' },
  addFClefChangeAfterText: { text: 'Cambio de clave de Fa después' },
  addCClefChangeBeforeText: { text: 'Cambio de clave de Do antes' },
  addCClefChangeAfterText: { text: 'Cambio de clave de Do después' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Acento' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Ayuda' },
  goToHelpPage: { text: 'Páginas de ayuda de mei-friend' },
  showChangelog: { text: 'Mostrar lista de cambios de mei-friend' },
  goToGuidelines: { text: 'Mostrar directrices de MEI' },
  consultGuidelinesForElementText: { text: 'Mostrar directrices para el elemento actual' },
  provideFeedback: { text: 'Proporcionar comentarios' },
  resetDefault: { text: 'Restablecer valores predeterminados' },

  // panel icons
  showMidiPlaybackControlBarButton: { description: 'Mostrar/Ocultar barra de control de reproducción MIDI' },
  showFacsimileButton: { description: 'Mostrar/Ocultar barra de control de faksímil' },
  showAnnotationsButton: { description: 'Mostrar/Ocultar barra de control de anotaciones' },
  showSettingsButton: { description: 'Mostrar barra de control de configuración' },

  // Footer texts
  leftFooter: {
    html:
      'Alojado por <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      '@ <a href="https://mdw.ac.at">mdw</a>, con ' +
      heart +
      ' desde Viena. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Impressum</a>.',
  },
  loadingVerovio: { text: 'Cargando Verovio' },
  verovioLoaded: { text: 'cargado' },
  convertedToPdf: { text: 'Convirtiendo a PDF' },
  statusBarCompute: { text: 'Calculando' },
  middleFooterPage: { text: 'Página' },
  middleFooterOf: { text: 'de' },
  middleFooterLoaded: { text: 'cargado' },

  // control menu/ menú de control
  verovioIcon: {
    description: `Actividad de mei-friend worker: 
    la rotación en sentido horario denota la actividad de Verovio, 
    la velocidad de rotación en sentido antihorario denota la actividad del worker,`,
  },
  decreaseScaleButton: { description: 'Reducir la notación' },
  verovioZoom: { description: 'Escalar el tamaño de la notación' },
  increaseScaleButton: { description: 'Aumentar la notación' },
  pagination1: { html: 'Página ' },
  pagination3: { html: ' de' },
  sectionSelect: { description: 'Navegar por la estructura de sección/fin codificada' },
  firstPageButton: { description: 'Ir a la primera página' },
  previousPageButton: { description: 'Ir a la página anterior' },
  paginationLabel: {
    description: 'Navegación de página: haz clic para introducir manualmente el número de página que se mostrará',
  },
  nextPageButton: { description: 'Ir a la siguiente página' },
  lastPageButton: { description: 'Ir a la última página' },
  flipCheckbox: { description: 'Voltear automáticamente la página a la posición del cursor de codificación' },
  flipButton: { description: 'Voltear la página manualmente a la posición del cursor de codificación' },
  breaksSelect: { description: 'Definir el comportamiento de los saltos de sistema/página en la notación' },
  updateControlsLabel: {
    description: 'Controlar el comportamiento de actualización de la notación después de cambios en la codificación',
  },
  liveUpdateCheckbox: { description: 'Actualizar automáticamente la notación después de cambios en la codificación' },
  codeManualUpdateButton: { description: 'Actualizar manualmente la notación' },
  engravingFontSelect: { description: 'Seleccionar la fuente de grabado' },
  backwardsButton: { description: 'Navegar hacia la izquierda en la notación' },
  forwardsButton: { description: 'Navegar hacia la derecha en la notación' },
  upwardsButton: { description: 'Navegar hacia arriba en la notación' },
  downwardsButton: { description: 'Navegar hacia abajo en la notación' },
  speedLabel: {
    description:
      'En modo de velocidad, solo se envía la página actual a Verovio para reducir el tiempo de renderización con archivos grandes',
  },

  // Print preview PDF / Panel de vista previa de impresión/PDF
  pdfSaveButton: { text: 'Guardar PDF', description: 'Guardar como PDF' },
  pdfCloseButton: { description: 'Cerrar vista de impresión' },
  pagesLegendLabel: { text: 'Rango de páginas', singlePage: 'página', multiplePages: 'páginas' },
  selectAllPagesLabel: { text: 'Todo' },
  selectCurrentPageLabel: { text: 'Página actual' },
  selectFromLabel: { text: 'desde:' },
  selectToLabel: { text: 'hasta:' },
  selectPageRangeLabel: { text: 'Rango de páginas:' },
  pdfPreviewSpeedModeWarning: {
    text:
      'Solo se renderiza la página actual para PDF, porque el modo de velocidad está activado. ' +
      'Desactive el modo de velocidad para seleccionar de todas las páginas.',
  },
  pdfPreviewNormalModeTitle: { text: 'Seleccione el rango de páginas para guardar en PDF.' },

  // Facsimile panel / Panel de facsímil
  facsimileIcon: { description: 'Panel de facsímil' },
  facsimileDecreaseZoomButton: { description: 'Reducir imagen de notación' },
  facsimileZoom: { description: 'Ajustar tamaño de imagen de notación' },
  facsimileIncreaseZoomButton: { description: 'Aumentar imagen de notación' },
  facsimileFullPageLabel: { text: 'Página completa', description: 'Mostrar página completa de la imagen de facsímil' },
  facsimileFullPageCheckbox: { description: 'Mostrar página completa de la imagen de facsímil' },
  facsimileShowZonesLabel: { text: 'Mostrar cajas de zona', description: 'Mostrar cajas de zona del facsímil' },
  facsimileShowZonesCheckbox: { description: 'Mostrar cajas de zona del facsímil' },
  facsimileEditZonesCheckbox: { description: 'Editar zonas del facsímil' },
  facsimileEditZonesLabel: { text: 'Editar zonas', description: 'Editar zonas del facsímil' },
  facsimileCloseButton: { description: 'Cerrar panel de facsímil' },
  facsimileDefaultWarning: { text: 'No hay contenido de facsímil para mostrar.' },
  facsimileNoSurfaceWarning: {
    text: 'No se encontró elemento de superficie para esta página.\n(Podría faltar un elemento inicial de pb).',
  },
  facsimileNoZonesFullPageWarning: { text: 'El facsímil sin zonas solo es visible en el modo de página completa.' },
  facsimileImgeNotLoadedWarning: { text: 'No se pudo cargar la imagen' },

  // Arrastrar y soltar
  dragOverlayText: { text: 'Arrastre su archivo de entrada aquí.' },

  // Repertorio público
  openUrlHeading: { text: 'Abrir codificación alojada en la web por URL' },
  openUrlInstructions: {
    text:
      'Elija del repertorio público o ingrese la URL de ' +
      'una codificación de música alojada en la web, a continuación. Nota: El servidor host debe ' +
      'soportar el intercambio de recursos entre orígenes (CORS).',
  },
  publicRepertoireSummary: { text: 'Repertorio público' },
  sampleEncodingsComposerLabel: { text: 'Compositor:' },
  sampleEncodingsEncodingLabel: { text: 'Codificación:' },
  sampleEncodingsOptionLabel: { text: 'Elija una codificación...' },
  openUrlButton: { text: 'Abrir URL' },
  openUrlCancel: { text: 'Cancelar' },
  proposePublicRepertoire: {
    html:
      'Agradecemos propuestas para ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'añadir al repertorio público' +
      '</a>.',
  },
  openUrlChooseEncodingText: { text: 'Elija una codificación...' },
  openUrlChooseComposerText: { text: 'Elija un compositor...' },
  openUrlOpenEncodingByUrlText: { text: 'Abrir codificación alojada en la web por URL' },

  // modales de fork
  forkRepoGithubText: { text: 'Hacer un fork del repositorio de Github' },
  forkRepoGithubExplanation: {
    text:
      'El enlace que ha seguido ' + 'creará un fork de Github del siguiente repositorio para editarlo en mei-friend:',
  },
  forkRepoGithubConfirm: { text: '¿Está bien?' },
  forkRepositoryInstructions: {
    text:
      'Por favor, elija entre el repertorio público o introduzca el nombre del usuario u organización de Github y el nombre del repositorio alojado en Github a continuación. ' +
      'Su repositorio bifurcado estará disponible desde el menú de Github.',
  },
  forkRepositoryGithubText: { text: 'Hacer un fork del repositorio de Github' },
  forkRepertoireSummary: { text: 'Repertorio público' },
  forkRepertoireComposerLabel: { text: 'Compositor:' },
  forkRepertoireOrganizationLabel: { text: 'Organización:' },
  forkRepertoireOrganizationOption: { text: 'Elija una organización de GitHub...' },
  forkRepertoireRepositoryLabel: { text: 'Repositorio:' },
  forkRepertoireRepositoryOption: { text: 'Elija una codificación...' },
  forkRepositoryInputName: { placeholder: 'Usuario u organización de Github' },
  forkRepositoryInputRepoOption: { text: 'Elija un repositorio' },
  forkRepositoryToSelectorText: { text: 'Hacer un fork en: ' },
  forkRepositoryButton: { text: 'Hacer un fork del repositorio' },
  forkRepositoryCancel: { text: 'Cancelar' },
  forkProposePublicRepertoire: {
    html:
      'Agradecemos propuestas para ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'añadir al repertorio público' +
      '</a>.',
  },

  // annotation panel / panel de anotaciones
  annotationCloseButtonText: { text: 'Cerrar panel de anotaciones' },
  hideAnnotationPanelButton: { description: 'Cerrar panel de anotaciones' },
  closeAnnotationPanelButton: { description: 'Cerrar panel de anotaciones' },
  annotationToolsButton: { text: 'Herramientas', description: 'Herramientas de anotación' },
  annotationListButton: { text: 'Lista', description: 'Listar anotaciones' },
  writeAnnotStandoffText: { text: 'Anotación Web' },
  annotationToolsHighlightTitle: { text: 'Resaltar' },
  annotationToolsHighlightSpan: { text: 'Resaltar' },
  annotationToolsDescribeTitle: { text: 'Describir' },
  annotationToolsDescribeSpan: { text: 'Describir' },
  annotationToolsLinkTitle: { text: 'Enlazar' },
  annotationToolsLinkSpan: { text: 'Enlazar' },
  listAnnotations: { text: 'No hay anotaciones presentes.' },
  addWebAnnotation: { text: 'Cargar anotación(es) web' },
  loadWebAnnotationMessage: { text: 'Introduce la URL de la anotación web o contenedor de anotación web' },
  loadWebAnnotationMessage1: { text: 'No se pudo cargar la URL proporcionada' },
  loadWebAnnotationMessage2: { text: 'por favor, inténtalo de nuevo' },
  noAnnotationsToDisplay: { text: 'No hay anotaciones para mostrar' },
  flipPageToAnnotationText: { description: 'Ir a esta anotación' },
  deleteAnnotation: { description: 'Eliminar esta anotación' },
  deleteAnnotationConfirmation: { text: '¿Estás seguro de que deseas eliminar esta anotación?' },
  makeStandOffAnnotation: {
    description: 'Estado Stand-off (anotación web)',
    descriptionSolid: 'Escribir en Solid como anotación web',
    descriptionToLocal: 'Copiar URI de anotación web al portapapeles',
  },
  makeInlineAnnotation: {
    description: 'Hacer clic para anotación en línea',
    descriptionCopy: 'Copiar xml:id de <annot> al portapapeles',
  },
  pageAbbreviation: { text: 'p.' },
  elementsPlural: { text: 'elementos' },
  askForLinkUrl: { text: 'Por favor, introduce una URL para enlazar' },
  drawLinkUrl: { text: 'Abrir en una pestaña nueva' },
  askForDescription: { text: 'Por favor, introduce una descripción textual para aplicar' },
  maxNumberOfAnnotationAlert: {
    text1: 'El número de elementos de anotación supera el valor máximo configurado para "Máximo número de anotaciones"',
    text2: 'Las nuevas anotaciones todavía pueden generarse y se mostrarán si se activa "Mostrar anotaciones".',
  },
  annotationsOutsideScoreWarning: {
    text: 'Lo siento, actualmente no se pueden escribir anotaciones fuera de <score>',
  },
  annotationWithoutIdWarning: {
    text1: 'No se puede escribir la anotación porque el punto de anclaje MEI carece de xml:id.',
    text2:
      'Asigna identificadores seleccionando "Manipular" -> "Volver a renderizar MEI (con identificadores)" e inténtalo de nuevo.',
  },

  // MIDI // MIDI
  midiSpeedmodeIndicator: {
    text: 'Modo de velocidad',
    description:
      'Modo de velocidad activado; solo se está reproduciendo MIDI para la página actual. Para reproducir todo el archivo, desactivar el modo de velocidad.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Ocultar la barra de control de reproducción de MIDI' },

  // mei-friend SETTINGS MENU / MEI-FRIEND MENU DE CONFIGURACIÓN
  meiFriendSettingsHeader: { text: 'Configuración de mei-friend' },
  mfReset: { text: 'Predeterminado', description: 'Restablecer a los valores predeterminados de mei-friend' },

  titleGeneral: {
    text: 'General',
    description: 'Configuraciones generales de mei-friend',
  },
  selectToolkitVersion: {
    text: 'Versión de Verovio',
    description:
      'Seleccionar la versión de la herramienta Verovio ' +
      '(* Cambiar a versiones anteriores a 3.11.0 ' +
      'podría requerir una actualización debido a problemas de memoria.)',
  },
  toggleSpeedMode: {
    text: 'Modo de velocidad',
    description:
      'Alternar el modo de velocidad de Verovio. ' +
      'En el modo de velocidad, solo se envía la página actual ' +
      'a Verovio para reducir el tiempo de renderización ' +
      'con archivos grandes',
  },
  selectIdStyle: {
    text: 'Estilo de xml:ids generados',
    description:
      'Estilo de xml:ids generados (los xml:ids existentes no cambian)' +
      'por ejemplo, original de Verovio: "note-0000001318117900", ' +
      'base 36 de Verovio: "nophl5o", ' +
      'estilo de mei-friend: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Insertar declaración de aplicación',
    description:
      'Insertar una declaración de aplicación en la descripción ' +
      'de la codificación en el encabezado MEI, identificando ' +
      'el nombre de la aplicación, versión, fecha de primera ' +
      'y última edición',
  },
  selectLanguage: {
    text: 'Idioma',
    description: 'Seleccionar el idioma de la interfaz de mei-friend.',
  },
  // Drag select / Selección de arrastre
  dragSelection: {
    text: 'Selección de arrastre',
    description: 'Seleccionar elementos en la notación con arrastre del mouse',
  },
  dragSelectNotes: {
    text: 'Seleccionar notas',
    description: 'Seleccionar notas',
  },
  dragSelectRests: {
    text: 'Seleccionar silencios',
    description: 'Seleccionar silencios y repeticiones (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Seleccionar elementos de posición ',
    description:
      'Seleccionar elementos de posición (es decir, con un atributo @placement: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Seleccionar ligaduras ',
    description:
      'Seleccionar ligaduras (es decir, elementos con el atributo @curvature: ' + att.attCurvature.join(', ') + ')',
  },

  // Control menu / Menú de control
  controlMenuSettings: {
    text: 'Barra de control de notación',
    description: 'Define los elementos que se mostrarán en el menú de control sobre la notación',
  },
  controlMenuFlipToPageControls: {
    text: 'Mostrar controles de cambio de página',
    description: 'Mostrar controles de cambio de página en el menú de control de notación',
  },
  controlMenuUpdateNotation: {
    text: 'Mostrar controles de actualización de notación',
    description: 'Mostrar controles de comportamiento de actualización de notación en el menú de control de notación',
  },
  controlMenuFontSelector: {
    text: 'Mostrar selector de fuente de notación',
    description: 'Mostrar selector de fuente de notación (SMuFL) en el menú de control de notación',
  },
  controlMenuNavigateArrows: {
    text: 'Mostrar flechas de navegación',
    description: 'Mostrar flechas de navegación de notación en el menú de control de notación',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Mostrar casilla de verificación de modo de velocidad',
    description: 'Mostrar casilla de verificación de modo de velocidad en el menú de control de notación',
  },
  // MIDI Playback / Reproducción MIDI
  titleMidiPlayback: {
    text: 'Reproducción MIDI',
    description: 'Configuraciones de reproducción MIDI',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Mostrar acceso directo de reproducción',
    description:
      'Hace que aparezca un acceso directo (burbuja en la esquina inferior izquierda;' +
      'haga clic para iniciar la reproducción inmediatamente) cuando se cierra la barra de control de reproducción MIDI',
  },
  showMidiPlaybackControlBar: {
    text: 'Mostrar barra de control de reproducción MIDI',
    description: 'Mostrar barra de control de reproducción MIDI',
  },
  scrollFollowMidiPlayback: {
    text: 'Seguir reproducción MIDI al desplazarse',
    description: 'Desplaza el panel de notación para seguir la reproducción MIDI en la página actual',
  },
  pageFollowMidiPlayback: {
    text: 'Seguir reproducción MIDI al cambiar de página',
    description: 'Girar automáticamente las páginas para seguir la reproducción MIDI',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Resaltar notas que suenan actualmente',
    description:
      'Destacar visualmente las notas que suenan actualmente en el panel de notación durante la reproducción MIDI',
  },
  // Transposition
  titleTransposition: {
    text: 'Transposition',
    description: 'Notation transponieren',
  },
  enableTransposition: {
    text: 'Transposition aktivieren',
    description:
      'Transposition aktivieren, die über die Schaltfläche ' +
      '"Transponieren" weiter unten angewendet werden soll. ' +
      'Die Transposition wird nur auf die Notation angewendet, ' +
      'die Kodierung bleibt unverändert, es sei denn, Sie klicken ' +
      'im Dropdown-Menü "Manipulieren" auf den Eintrag "Mit Verovio neu rendern".',
  },
  transposeInterval: {
    text: 'Nach Intervallen',
    description:
      'Transponieren der Kodierung nach chromatischen Intervallen ' +
      'durch die gebräuchlichsten Intervalle (Verovio unterstützt das Basis-40-System)',
    labels: [
      'Reine Prim',
      'Übermässige Prim',
      'Verminderte Sekund',
      'Kleine Sekund',
      'Große Sekund',
      'Übermässige Sekund',
      'Verminderte Terz',
      'Kleine Terz',
      'Große Terz',
      'Übermässige Terz',
      'Verminderte Quart',
      'Reine Quart',
      'Übermässige Quart',
      'Verminderte Quint',
      'Reine Quint',
      'Übermässige Quint',
      'Verminderte Sext',
      'Kleine Sext',
      'Große Sext',
      'Übermässige Sext',
      'Verminderte Sept',
      'Kleine Sept',
      'Große Sept',
      'Übermässige Sept',
      'Verminderte Oktav',
      'Reine Oktav',
    ],
  },
  transposeKey: {
    text: 'Transponieren zur Tonart',
    description: 'Transponieren zur Tonart',
    labels: [
      'Cis-Dur / ais-Moll',
      'Fis-Dur / dis-Moll',
      'H-Dur / gis-Moll',
      'E-Dur / cis-Moll',
      'A-Dur / fis-Moll',
      'D-Dur / h-Moll',
      'G-Dur / e-Moll',
      'C-Dur / a-Moll',
      'F-Dur / d-Moll',
      'B-Dur / g-Moll',
      'Es-Dur / c-Moll',
      'As-Dur / f-Moll',
      'Des-Dur / b-Moll',
      'Ges-Dur / es-Moll',
      'Ces-Dur / as-Moll',
    ],
  },
  transposeDirection: {
    text: 'Transpositionsrichtung',
    description: 'Transpositionsrichtung (Hinauf/hinunter)',
    labels: ['Hinauf', 'Hinunter', 'Näheste'],
  },
  transposeButton: {
    text: 'Transponieren',
    description:
      'Transposition mit obigen Einstellungen auf die Notation anwenden, ' +
      'die MEI-Kodierung bleibt unverändert. Um auch die MEI-Kodierung ' +
      'mit den aktuellen Einstellungen zu transponieren, verwenden Sie ' +
      '"Mit Verovio neu rendern" im Dropdown-Menü "Manipulieren".',
  },
  // Renumber measures
  renumberMeasuresHeading: {
    text: 'Takte neu nummerieren',
    description: 'Einstellungen für Takte neu nummerieren',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Weiter bei unvollständigen Takten',
    description: 'Taktnummer wird bei unvollständigen Takten erhöht (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Suffix bei unvollständigen Takten',
    description: 'Suffix bei Taktnummern von unvollständigen Takten verwenden (z.B. 23-cont)',
    labels: ['kein', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Weiter bei Volten',
    description: 'Taktnummern werden bei Volten (endings) erhöht',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Suffix bei Volten',
    description: 'Suffix zu Taktnummern bei Volten (endings) verwenden (z.B. 23-a)',
  },
  // Annotations
  titleAnnotations: {
    text: 'Annotationen',
    description: 'Einstellungen für Annotationen',
  },
  showAnnotations: {
    text: 'Annotationen anzeigen',
    description: 'Zeige Annotationen in der Notation',
  },
  showAnnotationPanel: {
    text: 'Annotationenbedienfeld anzeigen',
    description: 'Annotationenbedienfeld anzeigen',
  },
  annotationDisplayLimit: {
    text: 'Maximale Anzahl von Annotationen',
    description: 'Maximale Anzahl der anzuzeigenden Annotationen (eine große Anzahl könnte mei-friend verlangsamen)',
  },
  // Facsimile
  titleFacsimilePanel: {
    text: 'Faksimile-Panel',
    description: 'Faksimile-Panel',
  },
  showFacsimilePanel: {
    text: 'Faksimile-Panel anzeigen',
    description: 'Faksimile-Bilder der Quelledition anzeigen, falls vorhanden',
  },
  selectFacsimilePanelOrientation: {
    text: 'Position des Faksimile-Panel',
    description: 'Position des Faksimile-Panel relativ zur Notation auswählen',
    labels: ['Links', 'Rechts', 'Oben', 'Unten'],
  },
  facsimileZoomInput: {
    text: 'Größe der Faksimile-Bilder (%)',
    description: 'Größe der Faksimile-Bilder verändern (in Prozent)',
  },
  showFacsimileFullPage: {
    text: 'Ganze Seite anzeigen',
    description: 'Zeige die gesamten Faksimile-Bilder',
  },
  showFacsimileZones: {
    text: 'Faksimile-Zonenfelder anzeigen',
    description: 'Faksimile-Zonenbegrenzungsfelder anzeigen',
  },
  editFacsimileZones: {
    text: 'Faksimile-Zonenfelder bearbeiten',
    description: 'Faksimile-Zonenfelder bearbeiten',
  },
  // Supplied element
  titleSupplied: {
    text: 'Editorische Inhalte',
    description: 'Editorische Inhalte im MEI',
  },
  showSupplied: {
    text: 'Zeige Supplied-Element',
    description: 'Hebe Inhalte, die von <supplied>-Elementen umgeben sind, hervor',
  },
  suppliedColor: {
    text: 'Farbe für Supplied',
    description: 'Farbe für Supplied auswählen',
  },
  respSelect: {
    text: 'Responsibility wählen',
    description: 'Responsibility id für Supplied-Element auswählen',
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS
  editorSettingsHeader: {
    text: 'Editor-Einstellungen',
  },
  cmReset: {
    text: 'Zurücksetzen',
    description: 'Editor-Einstellungen zu Grundeinstellungen zurücksetzen',
  },
  titleAppearance: {
    text: 'Aussehen des Editors',
    description: 'Aussehen des Editors anpassen.',
  },
  zoomFont: {
    text: 'Schriftgröße (%)',
    description: 'Größe der Notenschrift anpassen (in Prozent)',
  },
  theme: {
    text: 'Farbschema',
    description: 'Farbschema (theme) des Editors auswählen',
  },
  matchTheme: {
    text: 'Notation an Farbschema anpassen',
    description: 'Notation an Farbschema anpassen',
  },
  tabSize: {
    text: 'Größe des Einzugs',
    description: 'Anzahl der Leerzeichen pro Einzugsebene',
  },
  lineWrapping: {
    text: 'Zeilenumbruch',
    description: 'Harter Zeilenumbruch am Fenster',
  },
  lineNumbers: {
    text: 'Zeilennummern',
    description: 'Zeilennummern anzeigen',
  },
  firstLineNumber: {
    text: 'Erste Zeilennummer',
    description: 'Erste Zeilennummer festlegen',
  },
  foldGutter: {
    text: 'Code-Faltung',
    description: 'Code-Faltung aktivieren',
  },
  titleEditorOptions: {
    text: 'Verhalten des Editors',
    description: 'Editor-Verhalten einstellen',
  },
  autoValidate: {
    text: 'Automatische Validatierung',
    description: 'Automatische Validierung der Kodierung nach jeder Eingabe',
  },
  autoCloseBrackets: {
    text: 'Klammern schließen',
    description: 'Klammern automatisch schließen',
  },
  autoCloseTags: {
    text: 'XML-Tags schließen',
    description: 'XML-Tags automatisch schließen',
    type: 'bool',
  },
  matchTags: {
    text: 'Passende Tags hervorheben',
    description: 'Passende XML-Tags hervorheben',
  },
  showTrailingSpace: {
    text: 'Nachstehende Leerzeichen',
    description: 'Überflüssige nachstehende Leerzeichen hervorheben',
  },
  keyMap: {
    text: 'Tastenbelegung',
    description: 'Tastaturbelegung auswählen',
  },

  // Verovio settings
  verovioSettingsHeader: {
    text: 'Verovio-Einstellungen',
  },
  vrvReset: {
    text: 'Zurücksetzen',
    description: 'Verovio auf mei-friend Standardwerte zurücksetzen',
  },

  // main.js alert messages
  isSafariWarning: {
    text:
      'Es scheint, dass Sie Safari als Browser verwenden, auf dem derzeit leider ' +
      'keine Schema-Validierung durch mei-friend unterstützt wird. Bitte verwenden ' +
      'Sie einen anderen Browser für volle Validierungsunterstützung.',
  },
  githubLoggedOutWarning: {
    text: `Sie haben sich bei mei-friend von Github abgemeldet, aber Ihr Browser ist noch bei GitHub angemeldet!
      <a href="https://github.com/logout" target="_blank">Bitte hier klicken, um sich von GitHub abzumelden</a>.`,
  },
  generateUrlError: {
    text: 'URL für lokale Datei kann nicht erzeugt werden. ',
  },
  generateUrlSuccess: {
    text: 'URL erfolgreich in die Zwischenablage kopiert. ',
  },
  generateUrlNotCopied: {
    text: 'URL nicht in die Zwischenablage kopiert, bitte versuchen Sie es erneut!',
  },
  errorCode: { text: 'Fehlerkode' },
  submitBugReport: { text: 'Fehlerbericht übermitteln' },
  loadingSchema: { text: 'Lade Schema' },
  schemaLoaded: { text: 'Schema geladen' },
  noSchemaFound: { text: 'Keine Schema-Information in MEI gefunden.' },
  schemaNotFound: { text: 'Schema nicht gefunden' },
  errorLoadingSchema: { text: 'Fehler beim Laden des Schemas' },
  notValidated: { text: 'Nicht validiert. Zum Validieren hier klicken.' },
  validatingAgainst: { text: 'Validieren gegen' },
  validatedAgainst: { text: 'Validiert gegen' },
  validationMessages: { text: 'Validierungsmeldungen' },
  validationComplete: { text: 'Validierung abgeschlossen' },
  validationFailed: { text: 'Validierung fehlgeschlagen' },
  noErrors: { text: 'keine Fehler' },
  errorsFound: { text: 'Fehler gefunden' }, // 5 errors found

  // github-menu.js
  repository: { text: 'Repo' },
  branch: { text: 'Branch' },
  path: { text: 'Pfad' },
  commit: { text: 'Commit' },
  commitLog: { text: 'Commit-Log' },
  commitAsNewFile: { text: 'Commit als neue Datei' },
  date: { text: 'Datum' },
  author: { text: 'Author' },
  message: { text: 'Nachricht' },
  none: { text: 'Kein' },
  fileName: { text: 'Dateiname' },
  forkRepository: { text: 'Repo forken' },
  forkError: { text: 'Konnte Repo leider nicht forken' },
  loadingFile: { text: 'Lade Datei' },
  loadingFromGithub: { text: 'Lade von Github' },
  logOut: { text: 'Abmelden' },
  githubLogout: { text: 'Abmelden' },
  selectRepository: { text: 'Repo auswählen' },
  selectBranch: { text: 'Branch auswählen' },
  commitPlaceholder: { text: 'Mit mei-friend online aktualisiert' },
  reportIssueWithEncoding: { text: 'Problem mit Kodierung melden' },
  clickToOpenInMeiFriend: { text: 'Klicken, um mit mei-friend zu öffnen' },
  repoAccessError: {
    text: 'Auf die Repositories der angegebenen Benutzer oder Organisationen kann nicht zugegriffen werden.',
  },
  allComposers: { text: 'Alle Komponisten' }, // fork-repository.js (TODO: wohl nicht Komponisten, was sonst?)

  // utils renumber measures
  renumberMeasuresModalText: { text: 'Takte neu nummerieren' },
  renumberMeasuresModalTest: { text: 'Test' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'würde' },
  renumberMeasuresChangedTo: { text: 'geändert in' },
  renumberMeasureMeasuresRenumbered: { text: 'Takte nummeriert' },
};
