/**
 * Language file for German Deutsch
 */

import * as att from '../lib/attribute-classes.js';
import { heart } from '../css/icons.js';

export const lang = {
  // Main menu bar
  githubLoginLink: { text: 'Anmelden' },

  // FILE MENU ITEM
  fileMenuTitle: { text: 'Datei' },
  openMeiText: { text: 'Datei öffnen' },
  openUrlText: { text: 'URL öffnen' },
  openExpample: { text: 'Öffentliches Repertoire', description: 'Liste von öffentlich lizensiertem Repertoire' },
  importMusicXml: { text: 'MusicXML importieren' },
  importHumdrum: { text: 'Humdrum importieren' },
  importPae: { text: 'PAE, ABC importieren' },
  saveMeiText: { text: 'MEI speichern' },
  saveSvg: { text: 'SVG speichern' },
  saveMidi: { text: 'MIDI speichern' },
  printPreviewText: { text: 'PDF Vorschau' },
  generateUrlText: { text: 'mei-friend URL erzeugen' },

  // EDIT/CODE MENU ITEM
  editMenuTitle: { text: 'Code' },
  undoMenuText: { text: 'Rückgängig' },
  redoMenuText: { text: 'Wiederherstellen' },
  startSearchText: { text: 'Suchen' },
  findNextText: { text: 'Weitersuchen' },
  findPreviousText: { text: 'Vorheriges suchen' },
  replaceMenuText: { text: 'Ersetzen' },
  replaceAllMenuText: { text: 'Alles ersetzen' },
  indentSelectionText: { text: 'Auswahl einrücken' },
  jumpToLineText: { text: 'Zu Zeile gehen' },
  manualValidateText: { text: 'Validieren' },

  // VIEW MENU ITEM
  viewMenuTitle: { text: 'Ansicht' },
  notationTop: { text: 'Notation oben' },
  notationBottom: { text: 'Notation unten' },
  notationLeft: { text: 'Notation links' },
  notationRight: { text: 'Notation rechts' },
  showSettingsMenuText: { text: 'Einstellungen' },
  showAnnotationMenuText: { text: 'Anmerkungen' },
  showFacsimileMenuText: { text: 'Faksimile' },
  showPlaybackControlsText: { text: 'Wiedergabe' },
  facsimileTop: { text: 'Faksimile oben' },
  facsimileBottom: { text: 'Faksimile unten' },
  facsimileLeft: { text: 'Faksimile links' },
  facsimileRight: { text: 'Faksimile rechts' },

  // MANIPULATE MENU ITEM
  manipulateMenuTitle: { text: 'Verändern' },
  invertPlacementText: { text: 'Platzierung invertieren' },
  betweenPlacementText: { text: 'Platzierung dazwischen' },
  addVerticalGroupText: { text: 'Vertikale Gruppe hinzufügen' },
  deleteText: { text: 'Element löschen' },
  pitchUpText: { text: 'Tonhöhe um Halbton höher' },
  pitchDownText: { text: 'Tonhöhe um Halbton niedriger' },
  pitchOctaveUpText: { text: 'Tonhöhe eine Oktave höher' },
  pitchOctaveDownText: { text: 'Tonhöhe eine Oktave niedriger' },
  staffUpText: { text: 'Element eine Notenzeile höher' },
  staffDownText: { text: 'Element eine Notenzeile niedriger' },
  increaseDurText: { text: 'Notendauer erhöhen' },
  decreaseDurText: { text: 'Notendauer verringern' },
  cleanAccidText: { text: '@accid.ges putzen' },
  renumberMeasuresTestText: { text: ' Takte neu nummerieren (test)' },
  renumberMeasuresExecText: { text: ' Takte neu nummerieren (exec)' },
  addIdsText: { text: 'Ids zu MEI hinzufügen' },
  removeIdsText: { text: 'Ids von MEI entfernen' },
  reRenderMeiVerovio: { text: 'Mit Verovio neu rendern' },
  addFacsimile: { text: 'Faksimile-Element hinzufügen' },
  ingestFacsimileText: { text: 'Faksimile-Information einlesen' },

  // INSERT MENU ITEM
  insertMenuTitle: { text: 'Einfügen' },
  addTempoText: { text: 'Tempo' },
  addDirectiveText: { text: 'Spielanweisung' },
  addDynamicsText: { text: 'Dynamik' },
  addSlurText: { text: 'Bogen' },
  addTieText: { text: 'Bindebogen' },
  addCrescendoHairpinText: { text: 'Crescendo-Gabel' },
  addDiminuendoHairpinText: { text: 'Diminuendo-Gabel' },
  addBeamText: { text: 'Balken' },
  addBeamSpanText: { text: 'Balkenspanner' },
  addSuppliedText: { text: 'Supplied' },
  addSuppliedArticText: { text: 'Supplied (Artic)' },
  addSuppliedAccidText: { text: 'Supplied (Accid)' },
  addArpeggioText: { text: 'Arepggio' },
  addFermataText: { text: 'Fermate' },
  addGlissandoText: { text: 'Glissando' },
  addPedalDownText: { text: 'Pedal drücken' },
  addPedalUpText: { text: 'Pedal loslassen' },
  addTrillText: { text: 'Triller' },
  addTurnText: { text: 'Doppleschlag' },
  addTurnLowerText: { text: 'Doppelschlag nach unten' },
  addMordentText: { text: 'Mordent' },
  addMordentUpperText: { text: 'Pralltriller' },
  addOctave8AboveText: { text: 'Oktave (8va nach oben)' },
  addOctave15AboveText: { text: 'Oktave (15va nach oben)' },
  addOctave8BelowText: { text: 'Oktave (8va nach unten)' },
  addOctave15BelowText: { text: 'Oktave (15va nach unten)' },
  addGClefChangeBeforeText: { text: 'Violinschlüssel davor' },
  addGClefChangeAfterText: { text: 'Violinschlüssel danach' },
  addFClefChangeBeforeText: { text: 'Bassschlüssel davor' },
  addFClefChangeAfterText: { text: 'Bassschlüssel danach' },
  addCClefChangeBeforeText: { text: 'C-Schlüssel davor' },
  addCClefChangeAfterText: { text: 'C-Schlüssel danach' },
  toggleStaccText: { text: 'Staccato' },
  toggleAccentText: { text: 'Akzent' },
  toggleTenutoText: { text: 'Tenuto' },
  toggleMarcatoText: { text: 'Marcato' },
  toggleStaccissText: { text: 'Staccatissimo' },
  toggleSpiccText: { text: 'Spiccato' },

  // HELP MENU ITEM
  helpMenuTitle: { text: 'Hilfe' },
  goToHelpPage: { text: 'mei-friend Hilfeseiten' },
  showChangelog: { text: 'mei-friend Änderungsliste anzeigen' },
  goToGuidelines: { text: 'MEI Guidelines anzeigen' },
  consultGuidelinesForElementText: { text: 'Guidelines für aktuelles Element anzeigen' },
  provideFeedback: { text: 'Feedback geben' },
  resetDefault: { text: 'Auf Standardwerte zurücksetzen' },

  // Footer texts
  leftFooter: {
    html:
      'Gehosted von <a href="https://iwk.mdw.ac.at">IWK</a> ' +
      '@ <a href="https://mdw.ac.at">mdw</a>, mit ' +
      heart +
      ' aus Wien. ' +
      '<a href="https://iwk.mdw.ac.at/impressum">Impressum</a>.',
  },

  // drag'n'drop
  dragOverlayText: { text: 'Input-Datei hierher ziehen.' },

  // public repertoire
  openUrlHeading: { text: 'Web-gehostete Kodierung per URL öffnen' },
  openUrlInstructions: {
    text:
      'Bitte wählen Sie aus dem öffentlichen Repertoire oder geben Sie die URL von ' +
      'einer im Web gehosteten Musikkodierung ein, siehe unten. Hinweis: Der Host-Server muss ' +
      'Cross-origin Resource Sharing (CORS) unterstützen.',
  },
  publicRepertoireSummary: { text: 'Öffentliches Repertoire' },
  sampleEncodingsComposerLabel: { text: 'Komponist:' },
  sampleEncodingsEncodingLabel: { text: 'Kodierung:' },
  sampleEncodingsOptionLabel: { text: 'Kodierung wählen...' },
  openUrlButton: { text: 'URL Öffenen' },
  openUrlCancel: { text: 'Abbrechen' },
  proposePublicRepertoire: {
    html:
      'Wir begrüßen Vorschläge für ' +
      '<a href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md" target="_blank" >' +
      'Ergänzungen des öffentlichen Repertoires' +
      '</a>.',
  },

  // fork modals
  forkRepoGithubText: { text: 'Github Repositorium Forken' },
  forkRepoGithubExplanation: {
    text:
      'Der Link, dem Sie gefolgt sind, ' +
      'erzeugt einen GitHub-Branch des folgenden Repositoriums zur Bearbeitung in mei-friend:',
  },
  forkRepoGithubConfirm: { text: 'Ist das OK?' },
  forkRepositoryInstructions: {
    text:
      'Bitte wählen Sie aus dem öffentlichen Repertoire oder geben Sie den ' +
      'Namen des Github-Benutzers oder der Github-Organisation und den Repository-Namen ' +
      'eines von Github gehosteten Repositorys ein. ' +
      'Ihr geforktes Repository wird im Github-Menü verfügbar sein.',
  },
  forkRepositoryGithubText: { text: 'Github Repositorium Forken' },
  forkRepertoireSummary: { text: 'Öffentliches Repertoire' },
  forkRepertoireComposerLabel: { text: 'Komponist:' },
  forkRepertoireOrganizationLabel: { text: 'Organisation:' },
  forkRepertoireOrganizationOption: { text: 'GitHub Organisation wählen...' },
  forkRepertoireRepositoryLabel: { text: 'Repo:' },
  forkRepertoireRepositoryOption: { text: 'Kodierung wählen...' },
  forkRepositoryInputName: { placeholder: 'Github Benutzer oder Organisation' },
  forkRepositoryInputRepoOption: { text: 'Repo wählen' },
  forkRepositoryToSelectorText: { text: 'Forken zu: ' },
  forkRepositoryButton: { text: 'Repo forken' },
  forkRepositoryCancel: { text: 'Abbrechen' },
  forkProposePublicRepertoire: {
    html:
      'Wir begrüßen Vorschläge für ' +
      '<a target="_blank" href="https://github.com/mei-friend/mei-friend/issues/new?template=public_repertoire.md">' +
      'Ergänzungen des öffentlichen Repertoires' +
      '</a>.',
  },

  // annotation panel
  annotationCloseButtonText: { text: 'Panel für Anmerkungen schließen' },
  annotationToolsButton: { text: 'Werkzeuge', title: 'Anmerkungswerkzeuge' },
  annotationListButton: { text: 'Liste', title: 'Anmerkungen auflisten' },
  writeAnnotStandoffText: { text: 'Web Anmerkungen' },
  annotationToolsHighlightTitle: { text: 'Hervorheben' },
  annotationToolsHighlightSpan: { text: 'Hervorheben' },
  annotationToolsDescribeTitle: { text: 'Beschreiben' },
  annotationToolsDescribeSpan: { text: 'Beschreiben' },
  annotationToolsLinkTitle: { text: 'Verlinken' },
  annotationToolsLinkSpan: { text: 'Verlinken' },
  listAnnotations: { text: 'Keine Anmerkungen gefunden.' },

  // MIDI
  midiSpeedmodeIndicator: {
    text: 'Speed mode',
    description:
      'Der Speed Mode ist aktiv, es werden nur die MIDI-Daten der aktuellen Seite abgespielt. ' +
      'Um die gesamte Codierung abzuspielen, bitte Speed Mode deaktivieren.',
  },
  closeMidiPlaybackControlBarButton: { description: 'MIDI-Wiedergabe-Steuerleiste ausblenden' },

  // mei-friend SETTINGS MENU
  meiFriendSettingsHeader: {
    text: 'mf-Einstellungen',
    description: 'mei-friend-Einstellungen',
  },
  mfReset: {
    text: 'Zurücksetzen',
    description: 'mei-friend Einstellungen auf Standard zurücksetzen',
  },
  titleGeneral: {
    text: 'Allgemein',
    description: 'Allgemeine mei-friend Einstellungen',
  },
  selectToolkitVersion: {
    text: 'Verovio Version',
    description:
      'Wählen Sie die Toolkit Version von Verovio aus.' +
      '(* Versionsnummern älter als 3.11.0 ' +
      'benötigen unter Umständen ein Neuladen des Browserfensters.)',
  },
  toggleSpeedMode: {
    text: 'Speed mode',
    description:
      'Verovio Speed Mode umschalten. ' +
      'Im Speed Mode wird nur die aktuelle Seite ' +
      'an Verovio gesendet, um die Renderingzeit ' +
      'bei großen Dateien zu reduzieren',
  },
  selectIdStyle: {
    text: 'Form der erzeugten xml:ids',
    description:
      'Form der neu erzeugten xml:ids (bestehende xml:ids werden nicht verändert)' +
      'e.g., Verovio original: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend stil: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Application statement einfügen',
    description:
      'Einfügen eines Application Statements in die ' +
      'Kodierungsbeschreibung im MEI-Header mit Angabe ' +
      'von Anwendungsname, Version, sowie Datum der ersten ' +
      'und letzten Bearbeitung,',
  },
  selectLanguage: {
    text: 'Sprache',
    description: 'Wählen Sie die Sprache des mei-friend Interface.',
  },
  // Drag select
  dragSelection: {
    text: 'Elementauswahl mit der Maus',
    description: 'Element durch Klicken und Ziehen mit der Maus auswählen',
  },
  dragSelectNotes: {
    text: 'Noten auswählen',
    description: 'Noten auswählen',
  },
  dragSelectRests: {
    text: 'Pausen auswählen',
    description: 'Pausen und Wiederholungen auswählen (rest, mRest, beatRpt, halfmRpt, mRpt)',
  },
  dragSelectControlElements: {
    text: 'Platzierungs-Elemente auswählen',
    description:
      'Platzierungs-Elemente auswählen (d.h. jene mit einem @placement-Attribut: ' + att.attPlacement.join(', ') + ')',
  },
  dragSelectSlurs: {
    text: 'Bögen auswählen ',
    description: 'Bögen auswählen (d.h. Elemente mit einem @curvature-Attribut: ' + att.attCurvature.join(', ') + ')',
  },
  dragSelectMeasures: {
    text: 'Takte auswählen ',
    description: 'Takte auswählen (measures)',
  },
  // Control menu
  controlMenuSettings: {
    text: 'Notationskontrollleiste',
    description: 'Elemente in der Notationskontrollleiste definieren',
  },
  controlMenuFlipToPageControls: {
    text: 'Automatisch Blättern',
    description: 'Steuerung anzeigen zum automatisches Blättern zur aktuellen Editor-Position ',
  },
  controlMenuUpdateNotation: {
    text: 'Automatische Notationsaktualisierung',
    description: 'Steuerung anzeigen zur automatischen Notationsaktualisierung',
  },
  controlMenuFontSelector: {
    text: 'Auswahl der Notationsschrift',
    description: 'Auswahl der Notationsschrift (SMuFL font) in der Notationskontrollleiste anzeigen',
  },
  controlMenuNavigateArrows: {
    text: 'Navigationspfeile anzeigen',
    description: 'Anzeigen der Navigationspfeile in der Notationskontrollleiste',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Speed Mode Auswahl anzeigen',
    description: 'Speed Mode Auswahl anzeigen in der Notationskontrollleiste',
  },
  // MIDI Playback
  titleMidiPlayback: {
    text: 'MIDI-Wiedergabe',
    description: 'Einstellungen für MIDI-Wiedergabe',
  },
  showMidiPlaybackContextualBubble: {
    text: 'Wiedergabeblase anzeigen',
    description:
      'Ein kleines Wiedergabe-Icon (kleine Blase in der Ecke links unten) ' +
      'wird angezeigt; durck Mausklick (oder Leertaste) wird die ' +
      'MIDI-Wiedergabeleiste angezeigt und MIDI-die Wiedergabe gestartet.',
  },
  showMidiPlaybackControlBar: {
    text: 'MIDI-Wiedergabeleiste anzeigen',
    description: 'MIDI-Wiedergabeleiste anzeigen',
  },
  scrollFollowMidiPlayback: {
    text: 'MIDI-Wiedergabe mitscrollen',
    description: 'Die angezeigte Notation folgt der MIDI-Wiedergabe (scrollen)',
  },
  pageFollowMidiPlayback: {
    text: 'MIDI-Wiedergabe mitblättern',
    description: 'Die angezeigte Notation blättert, um der MIDI-Wiedergabe zu folgen',
  },
  highlightCurrentlySoundingNotes: {
    text: 'Klingende Noten hervorheben',
    description: 'Aktuell klingende Noten im Notationsfeld visuell hervorheben',
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
    description: 'Maximale Anzahl der anzuzeigenden Anmerkungen (eine große Anzahl könnte mei-friend verlangsamen)',
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
};
