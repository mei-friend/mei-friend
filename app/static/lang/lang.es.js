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
  showLanguageSelectionButton: { description: 'Mostrar selección de idiomas' },
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
    text: 'Modo de velocidad',
    description:
      'En modo de velocidad (speed mode), solo se envía la página actual a Verovio para reducir el tiempo de renderización con archivos grandes',
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
  meiFriendSettingsHeader: { text: 'Configuración' },
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

  // Transposition / Transposición
  titleTransposition: {
    text: 'Transposición',
    description: 'Transponer la notación',
  },
  enableTransposition: {
    text: 'Activar transposición',
    description:
      'Activar la transposición que se aplicará mediante el botón "Transponer" debajo. ' +
      'La transposición solo se aplicará a la notación, la codificación permanecerá sin cambios, ' +
      'a menos que haga clic en la opción "Renderizar nuevamente con Verovio" en el menú desplegable "Manipular".',
  },
  transposeInterval: {
    text: 'Por intervalos',
    description:
      'Transponer la codificación por intervalos cromáticos utilizando los intervalos más comunes ' +
      '(Verovio admite el sistema base 40)',
    labels: [
      'Unísono',
      'Segunda mayor',
      'Segunda menor',
      'Tercera mayor',
      'Tercera menor',
      'Cuarta justa',
      'Cuarta aumentada',
      'Quinta disminuida',
      'Quinta justa',
      'Quinta aumentada',
      'Sexta menor',
      'Sexta mayor',
      'Séptima menor',
      'Séptima mayor',
      'Octava justa',
      'Octava aumentada',
    ],
  },
  transposeKey: {
    text: 'Transponer a la tonalidad',
    description: 'Transponer a la tonalidad',
    labels: [
      'Do sostenido mayor / la bemol menor',
      'Fa sostenido mayor / re bemol menor',
      'Si mayor / sol sostenido menor',
      'Mi mayor / do sostenido menor',
      'La mayor / fa sostenido menor',
      'Re mayor / si menor',
      'Sol mayor / mi menor',
      'Do mayor / la menor',
      'Fa mayor / re menor',
      'Si bemol mayor / sol menor',
      'Mi bemol mayor / do menor',
      'La bemol mayor / fa menor',
      'Re bemol mayor / si bemol menor',
      'Sol bemol mayor / mi bemol menor',
      'Do bemol mayor / la bemol menor',
    ],
  },
  transposeDirection: {
    text: 'Dirección de transposición',
    description: 'Dirección de transposición (arriba/abajo)',
    labels: ['Arriba', 'Abajo', 'Más cercano'],
  },
  transposeButton: {
    text: 'Transponer',
    description:
      'Aplicar la transposición con las configuraciones anteriores a la notación, ' +
      'la codificación MEI permanecerá sin cambios. Para transponer también la codificación MEI ' +
      'con las configuraciones actuales, utilice "Renderizar nuevamente con Verovio" en el menú desplegable "Manipular".',
  },

  // Renumber measures / Renumerar medidas
  renumberMeasuresHeading: {
    text: 'Renumerar medidas',
    description: 'Configuraciones para renumerar medidas',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Continuar en medidas incompletas',
    description: 'Continuar los números de las medidas en medidas incompletas (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Sufijo en medidas incompletas',
    description: 'Usar un sufijo numérico en medidas incompletas (por ejemplo, 23-cont)',
    labels: ['ninguno', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Continuar en los finales',
    description: 'Continuar los números de las medidas en los finales',
  },
  renumberMeasuresUseSuffixAtEndings: {
    text: 'Sufijo en los finales',
    description: 'Usar un sufijo numérico en los finales (por ejemplo, 23-a)',
  },

  // Annotations / Anotaciones
  titleAnnotations: {
    text: 'Anotaciones',
    description: 'Configuraciones de anotaciones',
  },
  showAnnotations: {
    text: 'Mostrar anotaciones',
    description: 'Mostrar anotaciones en la notación',
  },
  showAnnotationPanel: {
    text: 'Mostrar panel de anotaciones',
    description: 'Mostrar el panel de anotaciones',
  },
  annotationDisplayLimit: {
    text: 'Número máximo de anotaciones',
    description: 'Número máximo de anotaciones para mostrar (números grandes pueden ralentizar a mei-friend)',
  },

  // Facsimile/ Facsímil
  titleFacsimilePanel: {
    text: 'Panel de facsímil',
    description: 'Mostrar las imágenes de facsímil de la edición fuente, si están disponibles',
  },
  showFacsimilePanel: {
    text: 'Mostrar panel de facsímil',
    description: 'Mostrar las imágenes de partituras de la edición fuente proporcionadas en el elemento de facsímil',
  },
  selectFacsimilePanelOrientation: {
    text: 'Posición del panel de facsímil',
    description: 'Seleccionar la posición del panel de facsímil en relación a la notación',
    labels: ['izquierda', 'derecha', 'arriba', 'abajo'],
  },
  facsimileZoomInput: {
    text: 'Zoom de la imagen de facsímil (%)',
    description: 'Nivel de zoom de la imagen de facsímil (en porcentaje)',
  },
  showFacsimileFullPage: {
    text: 'Mostrar página completa',
    description: 'Mostrar la imagen de facsímil en la página completa',
  },
  showFacsimileZones: {
    text: 'Mostrar cuadros de zona de facsímil',
    description: 'Mostrar los cuadros delimitadores de zona de facsímil',
  },
  editFacsimileZones: {
    text: 'Editar zonas de facsímil',
    description: 'Editar zonas de facsímil (vinculará los recuadros delimitadores a las zonas de facsímil)',
  },

  // Supplied element / Elemento suministrado
  titleSupplied: {
    text: 'Manejar contenido editorial',
    description: 'Controlar el manejo de elementos <supplied>',
  },
  showSupplied: {
    text: 'Mostrar elementos <supplied>',
    description: 'Destacar todos los elementos contenidos por un elemento <supplied>',
  },
  suppliedColor: {
    text: 'Seleccionar color de resaltado <supplied>',
    description: 'Seleccionar color de resaltado <supplied>',
  },
  respSelect: {
    text: 'Seleccionar responsabilidad <supplied>',
    description: 'Seleccionar ID de responsabilidad',
  },

  //  EDITOR SETTINGS / CODEMIRROR SETTINGS // CONFIGURACIÓN DEL EDITOR / CONFIGURACIÓN DE CODEMIRROR
  editorSettingsHeader: {
    text: 'Configuración',
  },
  cmReset: {
    text: 'Restaurar valores predeterminados',
    description: 'Restablecer a los valores predeterminados de mei-friend',
  },
  titleAppearance: {
    title: 'Apariencia del editor',
    description: 'Controla la apariencia del editor',
  },
  zoomFont: {
    title: 'Tamaño de fuente (%)',
    description: 'Cambiar el tamaño de fuente del editor (en porcentaje)',
  },
  theme: {
    title: 'Tema',
    description: 'Seleccione el tema del editor',
  },
  matchTheme: {
    title: 'La notación coincide con el tema',
    description: 'Coincidir la notación con el tema de color del editor',
  },
  tabSize: {
    title: 'Tamaño de sangría',
    description: 'Número de caracteres de espacio para cada nivel de sangría',
  },
  lineWrapping: {
    title: 'Ajuste de línea',
    description: 'Si las líneas se ajustan o no al final del panel',
  },
  lineNumbers: {
    title: 'Números de línea',
    description: 'Mostrar números de línea',
  },
  firstLineNumber: {
    title: 'Número de primera línea',
    description: 'Establecer el número de primera línea',
  },
  foldGutter: {
    title: 'Plegado de código',
    description: 'Permite plegar el código a través de los separadores de plegado',
  },
  titleEditorOptions: {
    title: 'Comportamiento del editor',
    description: 'Controla el comportamiento del editor',
  },
  autoValidate: {
    title: 'Validación automática',
    description: 'Validar la codificación automáticamente después de cada edición',
  },
  autoCloseBrackets: {
    title: 'Cerrar corchetes automáticamente',
    description: 'Cerrar automáticamente los corchetes al escribir',
  },
  autoCloseTags: {
    title: 'Cerrar etiquetas automáticamente',
    description: 'Cerrar automáticamente las etiquetas al escribir',
    type: 'bool',
  },
  matchTags: {
    title: 'Coincidir etiquetas',
    description: 'Resalta las etiquetas coincidentes alrededor del cursor del editor',
  },
  showTrailingSpace: {
    title: 'Resaltar espacios finales',
    description: 'Resalta los espacios innecesarios al final de las líneas',
  },
  keyMap: {
    title: 'Mapa de teclas',
    description: 'Seleccione el mapa de teclas',
  },

  // Verovio settings / Configuraciones de Verovio
  verovioSettingsHeader: {
    text: 'Configuraciones de Verovio',
  },
  vrvReset: {
    text: 'Predeterminado',
    description: 'Restablece Verovio a los valores predeterminados de mei-friend',
  },

  //  main.js alert messages / Mensajes de alerta de main.js
  isSafariWarning: {
    text: 'Parece que estás utilizando Safari como navegador, en el que desafortunadamente mei-friend aún no admite la validación de esquemas. Utilice otro navegador para obtener soporte completo de validación.',
  },
  githubLoggedOutWarning: {
    text: 'Ha cerrado la sesión de integración de GitHub de mei-friend, ¡pero su navegador todavía tiene la sesión iniciada en GitHub! <a href="https://github.com/logout" target="_blank">Haga clic aquí para cerrar la sesión de GitHub</a>.',
  },
  generateUrlError: {
    text: 'No se puede generar URL para el archivo local ',
  },
  generateUrlSuccess: {
    text: 'URL copiada con éxito al portapapeles',
  },
  generateUrlNotCopied: {
    text: 'La URL no se copió al portapapeles, ¡inténtelo de nuevo!',
  },
  errorCode: { text: 'Código de error' },
  submitBugReport: { text: 'Enviar informe de error' },
  loadingSchema: { text: 'Cargando esquema' },
  schemaLoaded: { text: 'Esquema cargado' },
  noSchemaFound: { text: 'No se encontró información de esquema en MEI.' },
  schemaNotFound: { text: 'Esquema no encontrado' },
  errorLoadingSchema: { text: 'Error al cargar el esquema' },
  notValidated: { text: 'No validado. Haga clic aquí para validar.' },
  validatingAgainst: { text: 'Validando contra' },
  validatedAgainst: { text: 'Validado contra' },
  validationMessages: { text: 'Mensajes de validación' },
  validationComplete: { text: 'Validación completa' },
  validationFailed: { text: 'Validación fallida' },
  noErrors: { text: 'ningún error' },
  errorsFound: { text: 'Errores encontrados' }, // 5 errores encontrados

  // github-menu.js / github-menu.js
  repository: { text: 'Repositorio' },
  branch: { text: 'Rama' },
  path: { text: 'Ruta' },
  commit: { text: 'Confirmar' },
  commitLog: { text: 'Registro de confirmaciones' },
  commitAsNewFile: { text: 'Confirmar como nuevo archivo' },
  date: { text: 'Fecha' },
  author: { text: 'Autor' },
  message: { text: 'Mensaje' },
  none: { text: 'Ninguno' },
  fileName: { text: 'Nombre del archivo' },
  forkRepository: { text: 'Forkar repositorio' },
  forkError: { text: 'Lo siento, no se pudo forkar el repositorio' },
  loadingFile: { text: 'Cargando archivo' },
  loadingFromGithub: { text: 'Cargando desde Github' },
  logOut: { text: 'Cerrar sesión' },
  githubLogout: { text: 'Cerrar sesión' },
  selectRepository: { text: 'Seleccionar repositorio' },
  selectBranch: { text: 'Seleccionar rama' },
  commitPlaceholder: { text: 'Actualizado utilizando mei-friend en línea' },
  reportIssueWithEncoding: { text: 'Informar problema con la codificación' },
  clickToOpenInMeiFriend: { text: 'Haga clic para abrir en mei-friend' },
  repoAccessError: {
    text: 'Lo siento, no se pueden acceder a los repositorios para el usuario u organización suministrados',
  },
  allComposers: { text: 'Todos los compositores' }, // fork-repository.js

  // utils renumber measures
  renumberMeasuresModalText: { text: 'Renumerar compases' },
  renumberMeasuresModalTest: { text: 'Prueba' },
  renumberMeasuresWillBe: { text: '' },
  renumberMeasuresWouldBe: { text: 'sería' },
  renumberMeasuresChangedTo: { text: 'cambiado a' },
  renumberMeasureMeasuresRenumbered: { text: 'compases renumerados' },
};
