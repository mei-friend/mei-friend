/**
 * Language file for Spanish Espagnol
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';
import { getChangelogUrl } from '../lib/utils.js';

export const lang = {
  // Pantalla de bienvenida
  aboutMeiFriend: { text: 'Acerca de mei-friend' },
  showSplashScreen: {
    text: 'Mostrar pantalla de bienvenida al cargar',
    description: 'Mostrar la pantalla de bienvenida de mei-friend cuando se carga la aplicación',
  },
  splashUpdateIndicator: {
    html: `
      El siguiente texto ha sido actualizado desde la última vez que reconociste la pantalla de bienvenida. Para más detalles, por favor <a href="${getChangelogUrl()}" target="_blank">consulta la lista de cambios</a>.`,
  },
  splashLastUpdated: { text: 'Texto actualizado por última vez el: ' },
  splashBody: {
    html: `
      <p>
        mei-friend es un editor de <a href="https://music-encoding.org">codificaciones musicales</a>, alojado en la
        <a href="https://mdw.ac.at" target="_blank">mdw &ndash; Universidad de Música y Artes Escénicas de Viena</a>. 
        Consulta nuestra <a href="https://mei-friend.github.io" target="_blank">documentación extensa</a> para obtener
        más información.
      </p>
      <p>
        Aunque mei-friend es una aplicación basada en el navegador, tus datos personales (incluyendo la codificación que estás editando, tus configuraciones de la aplicación y los detalles de inicio de sesión actuales, si los hay) se almacenan en el <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">almacenamiento local</a> de tu navegador y no se almacenan en nuestros servidores.
      </p>
      <p>
        Los datos se transmiten a GitHub solo cuando lo solicitas explícitamente (por ejemplo, cuando inicias sesión en GitHub, cargas tu codificación desde o confirmas en un repositorio de GitHub, o cuando solicitas que se ejecute un flujo de trabajo de GitHub Action para ti). De manera similar, los datos se transmiten a tu proveedor de Solid elegido solo cuando lo solicitas explícitamente (por ejemplo, cuando inicias sesión en Solid, o cargas o guardas anotaciones stand-off). Por razones técnicas, ciertas interacciones con GitHub (clonar un repositorio a tu navegador al abrir una codificación por primera vez, o confirmar cambios en un repositorio) requieren que los datos se transmitan a un servidor proxy alojado por la mdw – Universidad de Música y Artes Escénicas de Viena. Este servidor actúa como intermediario entre tu navegador y GitHub, y no almacena ningún dato transmitido a través de él.
      </p>
      <p>
        Utilizamos <a href="https://matomo.org/" target="_blank">Matomo</a>
        para recopilar estadísticas de uso anónimas. Estas incluyen tu dirección IP truncada (permitiendo la geolocalización
        a nivel de país pero sin identificación adicional), tu navegador y sistema operativo, desde dónde llegaste (es decir,
        el sitio web de referencia), la hora y duración de tu visita y las páginas que visitaste. Esta información se almacena
        en la instancia de Matomo que se ejecuta en los servidores de la Universidad de Música y Artes Escénicas de Viena (mdw)
        y no se comparte con ningún tercero.
      </p>
      <p>
        Las tablaturas de laúd se convierten a MEI utilizando 
        <a href="https://bitbucket.org/bayleaf/luteconv/" target="_blank">luteconv</a> desarrollado por Paul Overell, 
        a través del servicio <a href="https://codeberg.org/mdwRepository/luteconv-webui" target="_blank">luteconv-webui</a> 
        desarrollado por Stefan Szepe y <a href="https://luteconv.mdw.ac.at" target="_blank">alojado por el mdw</a>. 
        Este servicio crea copias accesibles en la web de tus codificaciones como parte del proceso de conversión, 
        pero estas solo son accesibles a través de un valor de hash de enlace único y son eliminadas periódicamente.
      </p>
      <p>
        La herramienta Verovio se carga desde <a href="https://verovio.org" target="_blank">https://verovio.org</a>, 
        alojada por <a href="https://rism.digital/" target="_blank">RISM Digital Switzerland</a>. 
        Esto permite que mei-friend esté siempre actualizado con la última versión de la herramienta
        y ofrezca la opción de todas las versiones admitidas a través del panel de configuración. 
        Cuando usas mei-friend, tu dirección IP es visible para RISM Digital.
      </p>
      <p>
        Por último, la reproducción MIDI se presenta utilizando la fuente de sonido SGM_plus proporcionada por Google Magenta y
        servida a través de googleapis.com. Por lo tanto, tu dirección IP es visible para Google al iniciar la reproducción MIDI.
        Si no deseas que esto ocurra, abstente de utilizar la función de reproducción MIDI.
      </p>
      <p>
        mei-friend está desarrollado por
        <a href="https://iwk.mdw.ac.at/werner-goebl" target="_blank">Werner Goebl</a> y
        <a href="https://iwk.mdw.ac.at/david-weigl" target="_blank">David M. Weigl</a> en el Departamento de Acústica Musical 
        &ndash; Wiener Klangstil de la mdw &ndash; Universidad de Música y Artes Escénicas de Viena y está bajo licencia de la
        <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html" target="_blank"
          >Licencia Pública General Affero de GNU versión 3.0 (GNU AGPLv3)</a
        >. Consulta nuestra <a href="https://mei-friend.github.io/about/" target="_blank">página de agradecimientos</a> para
        obtener más información sobre los colaboradores y los componentes de código abierto reutilizados en nuestro proyecto.
        Agradecemos a nuestros colegas por sus contribuciones y orientación.
      </p>
      <p>
        El desarrollo de la aplicación web de mei-friend está financiado por el
        <a href="https://fwf.ac.at" target="_blank">Fondo de Ciencia de Austria (FWF)</a> en los proyectos
        <a href="https://iwk.mdw.ac.at/signature-sound-vienna/" target="_blank"
          >P 34664-G (Signature Sound Vienna)</a
        >
        e <a href="https://e-laute.info">I 6019 (E-LAUTE)</a>.
      </p>
    `,
  },
  splashGotItButtonText: { text: '¡Entendido!' },
  splashVersionText: { text: 'Versión' },
  splashAlwaysShow: {
    text: 'Mostrar siempre esta pantalla de bienvenida',
    description: 'Mostrar siempre esta pantalla de bienvenida al cargar la aplicación',
  },
  splashAlwaysShowLabel: {
    text: 'Mostrar siempre esta pantalla de bienvenida',
    description: 'Mostrar siempre esta pantalla de bienvenida al cargar la aplicación',
  },

  // Main menu bar / Menú principal
  githubLoginLink: { text: 'Iniciar sesión en GitHub' },

  month: {
    jan: 'Enero',
    feb: 'Febrero',
    mar: 'Marzo',
    apr: 'Abril',
    may: 'Mayo',
    jun: 'Junio',
    jul: 'Julio',
    aug: 'Agosto',
    sep: 'Septiembre',
    oct: 'Octubre',
    nov: 'Noviembre',
    dec: 'Diciembre',
  },

  // FILE MENU ITEM / ELEMENTOS DEL MENÚ ARCHIVO
  fileMenuTitle: { text: 'Archivo' },
  openMeiText: { text: 'Abrir archivo' },
  openUrlText: { text: 'Abrir URL' },
  openExample: { text: 'Repositorio público', description: 'Lista de repertorio con licencia pública' },
  importMusicXml: { text: 'Importar MusicXML' },
  importHumdrum: { text: 'Importar Humdrum' },
  importPae: { text: 'Importar PAE, ABC' },
  saveMeiText: { text: 'Guardar MEI' },
  saveMeiBasicText: { text: 'Guardar como MEI Basic' },
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
  surroundWithTagsText: { text: 'Envolver con tags' },
  surroundWithLastTagText: { text: 'Envolver con ' },
  jumpToLineText: { text: 'Ir a línea' },
  toMatchingTagText: { text: 'Ir al tag correspondiente' },
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
  pitchChromUpText: { text: 'Tono cromático más alto' },
  pitchChromDownText: { text: 'Tono cromático más bajo' },
  pitchUpDiatText: { text: 'Tono diatónico más alto' },
  pitchDownDiatText: { text: 'Tono diatónico más bajo' },
  pitchOctaveUpText: { text: 'Aumentar altura en una octava' },
  pitchOctaveDownText: { text: 'Disminuir altura en una octava' },
  staffUpText: { text: 'Mover elemento una línea de pentagrama hacia arriba' },
  staffDownText: { text: 'Mover elemento una línea de pentagrama hacia abajo' },
  increaseDurText: { text: 'Aumentar duración de nota' },
  decreaseDurText: { text: 'Disminuir duración de nota' },
  toggleDotsText: { text: 'Alternar el punteado' },
  cleanAccidText: { text: 'Verificar @accid.ges' },
  meterConformanceText: { text: 'Verificar @metcon' },
  renumberMeasuresTestText: { text: 'Renumerar compases (prueba)' },
  renumberMeasuresExecText: { text: 'Renumerar compases (ejecutar)' },
  addIdsText: { text: 'Añadir IDs a MEI' },
  removeIdsText: { text: 'Eliminar IDs de MEI' },
  reRenderMeiVerovio: { text: 'Volver a renderizar con Verovio' },
  addFacsimile: { text: 'Añadir elemento de faksimile' },
  ingestFacsimileText: { text: 'Leer información de faksimile' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Insertar' },
  addNoteText: { text: 'Añadir nota' },
  convertNoteToRestText: { text: 'Nota(s) <=> silencio(s)' },
  toggleChordText: { text: 'Nota(s) <=> acorde' },
  addDoubleSharpText: { html: 'Doble stostenido &#119082;' },
  addSharpText: { html: 'Sostenido &#9839;' },
  addNaturalText: { html: 'Becuadro &#9838;' },
  addFlatText: { html: 'Bemol &#9837;' },
  addDoubleFlatText: { html: 'Doble bemol &#119083;' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Directiva de juego' },
  addDynamicsText: { text: 'Dinámica' },
  addSlurText: { text: 'Ligadura' },
  addTieText: { text: 'Atadura' },
  addCrescendoHairpinText: { text: 'Crecendo' },
  addDiminuendoHairpinText: { text: 'Disminuendo' },
  addBeamText: { text: 'Haz' },
  addBeamSpanText: { text: 'Extensión de haz' },
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
  goToHelpPageText: { text: 'Páginas de ayuda de mei-friend' },
  goToCheatSheet: { text: 'Hoja de trucos de mei-friend' },
  showChangelog: { text: 'Lista de cambios de mei-friend' },
  goToGuidelines: { text: 'Directrices de MEI' },
  consultGuidelinesForElementText: { text: 'Directrices para el elemento actual' },
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
  breaksSelectNone: { text: 'Ninguno' },
  breaksSelectAuto: { text: 'Automático' },
  breaksSelectLine: { text: 'Sistema' },
  breaksSelectMeasure: { text: 'Compás' },
  breaksSelectEncoded: { text: 'Sistema y página' },
  breaksSelectSmart: { text: 'Smart' },
  choiceSelect: { description: 'Elegir contenido mostrado para elementos de elección' },
  choiceDefault: { text: '(elección por defecto)' },
  noChoice: { text: '(ninguna opción disponible)' },
  updateControlsLabel: {
    text: 'Actualizar',
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

  // GitHub actions modal
  githubActionsHeadingText: { text: 'Solicitar flujo de trabajo de GitHub:' },
  githubActionsDescription: {
    text: 'Haz clic en "Ejecutar flujo de trabajo" para solicitar a la API de GitHub que ejecute el flujo de trabajo mencionado arriba para ti, utilizando la configuración de entrada especificada a continuación. Tu codificación se recargará en su versión más reciente una vez que se complete la ejecución del flujo de trabajo.',
  },
  githubActionStatusMsgPrompt: { text: 'No se pudo ejecutar el flujo de trabajo: GitHub dice' },
  githubActionStatusMsgWaiting: { text: 'Por favor, ten paciencia mientras GitHub procesa tu flujo de trabajo...' },
  githubActionStatusMsgFailure: { text: 'No se pudo ejecutar el flujo de trabajo: GitHub dice' },
  githubActionStatusMsgSuccess: { text: 'Ejecución del flujo de trabajo completada: GitHub dice' },
  githubActionsRunButton: { text: 'Ejecutar flujo de trabajo' },
  githubActionsRunButtonReload: { text: 'Recargar archivo MEI' },
  githubActionsCancelButton: { text: 'Cancelar' },
  githubActionsInputSetterFilepath: { text: 'Copiar la ruta actual del archivo a la entrada' },
  githubActionsInputSetterSelection: { text: 'Copiar la selección actual de MEI a la entrada' },
  githubActionsInputContainerHeader: { text: 'Configuración de entrada' },

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

  // CodeMirror editor
  selectTagNameForEnclosure: { text: 'Encerrar con nombre de elemento' },
  selectTagNameForEnclosureOkButton: { value: 'Vale' },
  selectTagNameForEnclosureCancelButton: { value: 'Cancelar' },

  // restore Solid session overlay
  solidExplanation: {
    description:
      'Solid es una plataforma descentralizada para datos vinculados sociales. Inicie sesión en Solid para crear anotaciones de desacople utilizando datos vinculados (RDF).',
  },
  solidProvider: {
    description: 'Por favor, elija un proveedor de identidad Solid (IdP) o especifique el suyo propio.',
  },
  solidLoginBtn: { text: 'Iniciar sesión' },
  solidOverlayCancel: {
    html: 'Restaurando sesión de Solid - presione <span>Esc</span> o haga clic aquí para cancelar.',
  },
  solidWelcomeMsg: { text: 'Bienvenido, ' },
  solidLogout: { text: 'Cerrar sesión' },
  solidLoggedOutWarning: {
    html: `Has cerrado sesión en la integración Solid de mei-friend, ¡pero tu navegador todavía está iniciado en Solid!
    <a id="solidIdPLogoutLink" target="_blank">Haz clic aquí para cerrar sesión en Solid</a>.`,
  },

  // annotation panel / panel de anotaciones
  annotationCloseButtonText: { text: 'Cerrar panel de anotaciones' },
  hideAnnotationPanelButton: { description: 'Cerrar panel de anotaciones' },
  closeAnnotationPanelButton: { description: 'Cerrar panel de anotaciones' },
  markupToolsButton: { description: 'Herramientas de marcado' },
  annotationToolsButton: { description: 'Herramientas de anotación' },
  annotationListButton: { description: 'Lista de anotaciones' },
  writeAnnotStandoffText: { text: 'Anotación Web' },
  annotationToolsIdentifyTitle: { text: 'Identificar' },
  annotationToolsIdentifySpan: { text: 'Identificar objeto musical' },
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
  describeMarkup: { description: 'Describir este marcado' },
  deleteMarkup: { description: 'Eliminar este marcado' },
  deleteMarkupConfirmation: { text: '¿Estás seguro/a de que deseas eliminar este marcado?' },
  deleteAnnotation: { description: 'Eliminar esta anotación' },
  deleteAnnotationConfirmation: { text: '¿Estás seguro de que deseas eliminar esta anotación?' },
  makeStandOffAnnotation: {
    description: 'Estado stand-off (RDF)',
    descriptionSolid: 'Escribir en Solid como RDF',
    descriptionToLocal: 'Abrir anotación stand-off (RDF) en una nueva pestaña',
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
  // MENÚ DE MARCADO
  respSelect: {
    text: 'Seleccionar responsabilidad de marcado',
    description: 'Seleccionar ID de responsabilidad',
  },
  selectionSelect: {
    text: 'Selección predeterminada para marcar',
    description:
      'Elija si la marca recién creada debe incluir los elementos seleccionados, articulaciones o alteraciones',
    labels: ['Elementos seleccionados', 'Articulación', 'Accidental'],
    valuesDescriptions: [
      'Añade marcado a los elementos seleccionados.',
      'Añade marcado a las articulaciones dentro de la selección.',
      'Añade marcado a los accidentales dentro de la selección.',
    ],
  },
  alternativeEncodingsGrp: {
    text: 'Codificaciones alternativas',
    description: 'Elementos de marcado que contienen múltiples versiones.',
  },
  addChoiceText: {
    text: '<choice>',
    description: 'Agrupa varias codificaciones alternativas para el mismo punto en un texto.',
  },
  choiceSicCorr: {
    description: 'Coloca la selección en <sic> y añade <corr>.',
  },
  choiceCorrSic: {
    description: 'Coloca la selección en <corr> y añade <sic>.',
  },
  choiceOrigReg: {
    description: 'Coloca la selección en <orig> y añade <reg>.',
  },
  choiceRegOrig: {
    description: 'Coloca la selección en <reg> y añade <orig>.',
  },
  choiceContentTarget: {
    description: 'Primero, selecciona el contenido para este elemento pasando el cursor sobre <elección>.',
  },
  addSubstText: {
    text: '<subst>',
    description:
      '(sustitución) – Agrupa elementos de transcripción cuando la combinación debe considerarse como una intervención única en el texto.',
  },
  substAddDel: {
    description: 'Coloca la selección en <add> y añade <del>.',
  },
  substDelAdd: {
    description: 'Coloca la selección en <del> y añade <add>.',
  },
  substContentTarget: {
    description: 'Primero, selecciona el contenido para este elemento pasando el cursor sobre <sustitución>.',
  },
  editInterventionsGrp: {
    text: 'Intervenciones editoriales',
    description: 'Elementos de marcado utilizados para codificar intervenciones editoriales.',
  },
  addSuppliedText: {
    text: '<supplied>',
    description: 'Contiene material suministrado por el transcriptor o editor por cualquier motivo.',
  },
  addUnclearText: {
    text: '<unclear>',
    description:
      'Contiene material que no se puede transcribir con certeza porque es ilegible o inaudible en la fuente.',
  },
  addSicText: { text: '<sic>', description: 'Contiene material aparentemente incorrecto o inexacto.' },
  addCorrText: {
    text: '<corr>',
    description: '(corrección) – Contiene la forma correcta de un pasaje aparentemente erróneo.',
  },
  addOrigText: {
    text: '<orig>',
    description:
      '(original) – Contiene material que se marca como siguiendo el original, en lugar de ser normalizado o corregido.',
  },
  addRegText: {
    text: '<reg>',
    description: '(regularización) – Contiene material que ha sido regularizado o normalizado en algún sentido.',
  },
  descMarkupGrp: {
    text: 'Marcado descriptivo',
    description: 'Elementos de marcado utilizados para codificar intervenciones en el material fuente.',
  },
  addAddText: { text: '<add>', description: '(adición) – Marca una adición al texto.' },
  addDelText: {
    text: '<del>',
    description:
      '(eliminación) – Contiene información eliminada, marcada como eliminada, o indicada como superflua o espuria en el texto copiado por un autor, escribano, anotador o corrector.',
  },

  // MIDI // MIDI
  midiSpeedmodeIndicator: {
    text: 'Modo de velocidad',
    description:
      'Modo de velocidad activado; solo se está reproduciendo MIDI para la página actual. Para reproducir todo el archivo, desactivar el modo de velocidad.',
  },
  closeMidiPlaybackControlBarButton: { description: 'Ocultar la barra de control de reproducción de MIDI' },

  // mei-friend SETTINGS MENU / MEI-FRIEND MENU DE CONFIGURACIÓN
  meiFriendSettingsHeader: {
    text: 'Configuración',
    description: 'Configuración de mei-friend',
  },
  mfReset: {
    text: 'Predeterminado',
    description: 'Restablecer a los valores predeterminados de mei-friend',
  },
  filterSettings: {
    placeholder: 'Ajustes del filtro',
    description: 'Escriba aquí para filtrar los ajustes',
  },
  closeSettingsButton: {
    description: 'Cerrar panel de configuración',
  },
  hideSettingsButton: {
    description: 'Cerrar panel de configuración',
  },
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
  dragSelectMeasures: {
    text: 'Seleccionar compases',
    description: 'Seleccionar compases',
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
  selectMidiExpansion: {
    text: 'Expansión de reproducción',
    description: 'Seleccione el elemento de expansión que se utilizará para la reproducción MIDI',
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
      'Unísono aumentada',
      'Segunda disminuida',
      'Segunda menor',
      'Segunda mayor',
      'Segunda aumentada',
      'Tercera disminuida',
      'Tercera menor',
      'Tercera mayor',
      'Tercera aumentada',
      'Cuarta disminuida',
      'Cuarta justa',
      'Cuarta aumentada',
      'Quinta disminuida',
      'Quinta justa',
      'Quinta aumentada',
      'Sexta disminuida',
      'Sexta menor',
      'Sexta mayor',
      'Sexta aumentada',
      'Séptima disminuida',
      'Séptima menor',
      'Séptima mayor',
      'Séptima aumentada',
      'Octava disminuida',
      'Octava justa',
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

  // Renumber measures / Renumerar compases
  renumberMeasuresHeading: {
    text: 'Renumerar compases',
    description: 'Configuraciones para renumerar compases',
  },
  renumberMeasureContinueAcrossIncompleteMeasures: {
    text: 'Continuar en compases incompletas',
    description: 'Continuar los números de las compases en compases incompletas (@metcon="false")',
  },
  renumberMeasuresUseSuffixAtMeasures: {
    text: 'Sufijo en compases incompletas',
    description: 'Usar un sufijo numérico en compases incompletas (por ejemplo, 23-cont)',
    labels: ['ninguno', '-cont'],
  },
  renumberMeasuresContinueAcrossEndings: {
    text: 'Continuar en los finales',
    description: 'Continuar los números de las compases en los finales',
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
  showFacsimileTitles: {
    text: 'Mostrar títulos de facsímiles',
    description: 'Mostrar títulos de facsímiles sobre las imágenes de facsímil',
  },

  // Supplied element / Elemento suministrado
  titleSupplied: {
    text: 'Gestionar contenido editorial',
    description: 'Controlar el manejo del marcado editorial',
  },
  showMarkup: {
    text: 'Mostrar elementos de marcado editorial',
    description: 'Resaltar todos los elementos contenidos por elementos de marcado editorial',
  },
  markupToPDF: {
    text: 'Mostrar marcado editorial en PDF',
    description: 'Mostrar marcado editorial en PDF',
  },
  alternativeVersionContent: {
    text: 'Contenido predeterminado para codificaciones alternativas',
    description:
      'Elegir si las codificaciones alternativas recién creadas están vacías o son copias de la lectura original',
    labels: ['vacío', 'copia'],
  },
  suppliedColor: {
    text: 'Seleccionar color de resaltado para <supplied>',
    description: 'Seleccionar color de resaltado para <supplied>',
  },
  unclearColor: {
    text: 'Seleccionar color de resaltado para <unclear>',
    description: 'Seleccionar color de resaltado para <unclear>',
  },
  sicColor: {
    text: 'Seleccionar color de resaltado para <sic>',
    description: 'Seleccionar color de resaltado para <sic>',
  },
  corrColor: {
    text: 'Seleccionar color de resaltado para <corr>',
    description: 'Seleccionar color de resaltado para <corr>',
  },
  origColor: {
    text: 'Seleccionar color de resaltado para <orig>',
    description: 'Seleccionar color de resaltado para <orig>',
  },
  regColor: {
    text: 'Seleccionar color de resaltado para <reg>',
    description: 'Seleccionar color de resaltado para <reg>',
  },
  addColor: {
    text: 'Seleccionar color de resaltado para <add>',
    description: 'Seleccionar color de resaltado para <add>',
  },
  delColor: {
    text: 'Seleccionar color de resaltado para <del>',
    description: 'Seleccionar color de resaltado para <del>',
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
    text: 'Apariencia del editor',
    description: 'Controla la apariencia del editor',
  },
  zoomFont: {
    text: 'Tamaño de fuente (%)',
    description: 'Cambiar el tamaño de fuente del editor (en porcentaje)',
  },
  theme: {
    text: 'Tema',
    description: 'Seleccione el tema del editor',
  },
  matchTheme: {
    text: 'La notación coincide con el tema',
    description: 'Coincidir la notación con el tema de color del editor',
  },
  tabSize: {
    text: 'Tamaño de sangría',
    description: 'Número de caracteres de espacio para cada nivel de sangría',
  },
  lineWrapping: {
    text: 'Ajuste de línea',
    description: 'Si las líneas se ajustan o no al final del panel',
  },
  lineNumbers: {
    text: 'Números de línea',
    description: 'Mostrar números de línea',
  },
  firstLineNumber: {
    text: 'Número de primera línea',
    description: 'Establecer el número de primera línea',
  },
  foldGutter: {
    text: 'Plegado de código',
    description: 'Permite plegar el código a través de los separadores de plegado',
  },
  titleEditorOptions: {
    text: 'Comportamiento del editor',
    description: 'Controla el comportamiento del editor',
  },
  autoValidate: {
    text: 'Validación automática',
    description: 'Validar la codificación automáticamente después de cada edición',
  },
  autoShowValidationReport: {
    text: 'Mostrar informe de validación automáticamente',
    description: 'Mostrar el informe de validación automáticamente después de que se haya realizado la validación',
  },
  autoCloseBrackets: {
    text: 'Cerrar corchetes automáticamente',
    description: 'Cerrar automáticamente los corchetes al escribir',
  },
  autoCloseTags: {
    text: 'Cerrar etiquetas automáticamente',
    description: 'Cerrar automáticamente las etiquetas al escribir',
    type: 'bool',
  },
  matchTags: {
    text: 'Coincidir etiquetas',
    description: 'Resalta las etiquetas coincidentes alrededor del cursor del editor',
  },
  showTrailingSpace: {
    text: 'Resaltar espacios finales',
    description: 'Resalta los espacios innecesarios al final de las líneas',
  },
  keyMap: {
    text: 'Mapa de teclas',
    description: 'Seleccione el mapa de teclas',
  },
  // Persistent Search / Búsqueda persistente
  persistentSearch: {
    text: 'Caja de búsqueda persistente',
    description:
      'Utilizar el comportamiento de la caja de búsqueda persistente (la caja de búsqueda permanece abierta hasta que se cierre explícitamente)',
  },

  // Verovio settings / Configuraciones de Verovio
  verovioSettingsHeader: {
    text: 'Configuraciones',
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
  githubRepository: { text: 'Repositorio' },
  githubBranch: { text: 'Rama' },
  githubFilepath: { text: 'Ruta' },
  githubCommit: { text: 'Commit' },
  githubCommitButton: { classes: { commitAsNewFile: { value: 'Confirmar como nuevo archivo' } }, value: 'Confirmar' },
  commitLog: { text: 'Registro de confirmaciones' },
  githubDate: { text: 'Fecha' },
  githubAuthor: { text: 'Autor' },
  githubMessage: { text: 'Mensaje' },
  none: { text: 'Ninguno' },
  commitFileNameText: { text: 'Nombre del archivo' },
  forkRepository: { text: 'Forkar repositorio' },
  forkError: { text: 'Lo siento, no se pudo forkar el repositorio' },
  loadingFile: { text: 'Cargando archivo' },
  loadingFromGithub: { text: 'Cargando desde Github' },
  logOut: { text: 'Cerrar sesión' },
  githubLogout: { text: 'Cerrar sesión' },
  selectRepository: { text: 'Seleccionar repositorio' },
  selectBranch: { text: 'Seleccionar rama' },
  commitMessageInput: { placeholder: 'Actualizado utilizando mei-friend en línea' },
  reportIssueWithEncoding: { value: 'Informar problema con la codificación' },
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

  // Code checker panel (accid.ges)
  accidGesCodeCheckerTitle: {
    text: 'Verificar los atributos @accid.ges (en relación con la armadura de clave, los accid. por compás y las ligaduras).',
  },
  metConCodeCheckerTitle: {
    text: 'Verificando conformidad métrica (al menos una capa por pentagrama tiene número de pulso según la firma de compás).',
  },
  codeCheckerFix: { text: 'Corregir' },
  codeCheckerFixAll: { text: 'Corregir todo' },
  codeCheckerIgnore: { text: 'Ignorar' },
  codeCheckerIgnoreAll: { text: 'Ignorar todo' },
  codeCheckerCheckingCode: { text: 'Verificando código...' },
  codeCheckerNoAccidMessagesFound: { text: 'Todos los atributos accid.ges parecen correctos.' },
  codeCheckerMeterConformanceMessage: { text: 'Todos los compases se ajustan a sus firmas métricas.' },
  codeCheckerMeasure: { text: 'Compás' },
  codeCheckerNote: { text: 'Nota' },
  codeCheckerHasBoth: { text: 'tiene ambos' },
  codeCheckerAnd: { text: 'y' },
  codeCheckerHasADurationOf: { text: 'tiene una duración de' },
  codeCheckerInsteadOf: { text: 'en lugar de' },
  codeCheckerRemove: { text: 'Eliminar' },
  codeCheckerFixTo: { text: 'Corregir a' },
  codeCheckerAdd: { text: 'Agregar' },
  codeCheckerWithContradictingContent: { text: 'con contenido contradictorio' },
  codeCheckerTiedNote: { text: 'Nota ligada' },
  codeCheckerNotSamePitchAs: { text: 'no misma altura que' },
  codeCheckerNotSameOctaveAs: { text: 'no mismo octavo que' },
  codeCheckerNotSameAsStartingNote: { text: 'no es igual que la nota de inicio' },
  codeCheckerExtra: { text: 'extra' },
  codeCheckerHasExtra: { text: 'tiene extra' },
  codeCheckerLacksAn: { text: 'carece de un' },
  codeCheckerBecauseAlreadyDefined: { text: 'porque ya se ha definido anteriormente en el compás' },

  // Warning for missing ids
  missingIdsWarningAlertOnScrolling: {
    text: 'mei-friend no puede desplazarse a los elementos seleccionados en la codificación. Por favor, añade ids a la codificación.',
  },
  missingIdsWarningAlertOnLoading: {
    text: 'Hay al menos un elemento de marcado encerrado por un elemento padre sin xml:id. mei-friend no puede manejar el marcado en archivos sin identificadores. Por favor, añade identificadores a la codificación.'
  },  
};
