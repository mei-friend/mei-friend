/**
 * Language file for German Deutsch
 */

import * as att from '../lib/attribute-classes.js';

export const lang = {
  // Main menu bar
  GithubLoginLink: { text: 'Login' },

  // FILE MENU ITEM
  FileMenuTitle: { text: 'Datei' },
  OpenMeiText: { text: 'Datei öffnen' },
  OpenUrlText: { text: 'URL öffnen' },
  OpenExpample: { text: 'Öffentliches Repertoire' },
  ImportMusicXml: { text: 'MusicXML importieren' },
  ImportHumdrum: { text: 'Humdrum importieren' },
  ImportPae: { text: 'PAE, ABC importieren' },
  SaveMeiText: { text: 'MEI speichern' },
  SaveSvg: { text: 'SVG speichern' },
  SaveMidi: { text: 'MIDI speichern' },
  PrintPreviewText: { text: 'PDF Vorschau' },
  GenerateUrlText: { text: 'mei-friend URL erzeugen' },

  // EDIT/CODE MENU ITEM
  EditMenuTitle: { text: 'Code' },
  UndoMenuText: { text: 'Rückgängig' },
  RedoMenuText: { text: 'Wiederherstellen' },
  StartSearchText: { text: 'Suchen' },
  FindNextText: { text: 'Weitersuchen' },
  FindPreviousText: { text: 'Vorheriges suchen' },
  ReplaceMenuText: { text: 'Ersetzen' },
  ReplaceAllMenuText: { text: 'Alles ersetzen' },
  IndentSelectionText: { text: 'Auswahl einrücken' },
  JumpToLineText: { text: 'Zu Zeile gehen' },
  ManualValidateText: { text: 'Validieren' },

  // VIEW MENU ITEM
  ViewMenuTitle: { text: 'Ansicht' },
  NotationTop: { text: 'Notation oben' },
  NotationBottom: { text: 'Notation unten' },
  NotationLeft: { text: 'Notation links' },
  NotationRight: { text: 'Notation rechts' },
  ShowSettingsMenuText: { text: 'Einstellungen' },
  ShowAnnotationMenuText: { text: 'Anmerkungen' },
  ShowFacsimileMenuText: { text: 'Faksimile' },
  ShowPlaybackControlsText: { text: 'Wiedergabe' },
  FacsimileTop: { text: 'Faksimile oben' },
  FacsimileBottom: { text: 'Faksimile unten' },
  FacsimileLeft: { text: 'Faksimile links' },
  FacsimileRight: { text: 'Faksimile rechts' },

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

  // mei-friend SETTINGS MENU
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
    text: 'Auswahl der Notenschrift',
    description: 'Auswahl der Notenschrift (SMuFL font) in der Notationskontrollleiste anzeigen',
  },
  controlMenuNavigateArrows: {
    text: 'Navigationspfeile anzeigen',
    description: 'Anzeigen der Navigationspfeile in der Notationskontrollleiste',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Speed Mode Auswahl anzeigen',
    description: 'Speed Mode Auswahl anzeigen in der Notationskontrollleiste',
  },
  controlMenuSettings: {
    text: 'Notation control bar',
    description: 'Define items to be shown in control menu above the notation',
  },
  controlMenuFlipToPageControls: {
    text: 'Show flip to page controls',
    description: 'Show flip to page controls in notation control menu',
  },
  controlMenuUpdateNotation: {
    text: 'Show notation update controls',
    description: 'Show notation update behavior controls in notation control menu',
  },
  controlMenuFontSelector: {
    text: 'Show notation font selector',
    description: 'Show notation font (SMuFL) selector in notation control menu',
  },
  controlMenuNavigateArrows: {
    text: 'Show navigation arrows',
    description: 'Show notation navigation arrows in notation control menu',
  },
  controlMenuSpeedmodeCheckbox: {
    text: 'Show speed mode checkbox',
    description: 'Show speed mode checkbox in notation control menu',
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
    text: 'Annotations',
    description: 'Annotation settings',
  },
  showAnnotations: {
    text: 'Show annotations',
    description: 'Show annotations in notation',
  },
  showAnnotationPanel: {
    text: 'Show annotation panel',
    description: 'Show annotation panel',
  },
  annotationDisplayLimit: {
    text: 'Maximum number of annotations',
    description: 'Maximum number of annotations to display ' + '(large numbers may slow mei-friend)',
  },
  // Facsimile
  titleFacsimilePanel: {
    text: 'Facsimile panel',
    description: 'Show the facsimile imiages of the source edition, if available',
  },
  showFacsimilePanel: {
    text: 'Show facsimile panel',
    description: 'Show the score images of the source edition provided in the facsimile element',
  },
  selectFacsimilePanelOrientation: {
    text: 'Facsimile panel position',
    description: 'Select facsimile panel position relative to notation',
    labels: ['left', 'right', 'top', 'bottom'],
  },
  facsimileZoomInput: {
    text: 'Facsimile image zoom (%)',
    description: 'Zoom level of facsimile image (in percent)',
  },
  showFacsimileFullPage: {
    text: 'Show full page',
    description: 'Show facsimile image on full page',
  },
  showFacsimileZones: {
    text: 'Show facsimile zone boxes',
    description: 'Show facsimile zone bounding boxes',
  },
  editFacsimileZones: {
    text: 'Edit facsimile zones',
    description: 'Edit facsimile zones (will link bounding boxes to facsimile zones)',
  },
  // Supplied element
  titleSupplied: {
    text: 'Handle editorial content',
    description: 'Control handling of <supplied> elements',
  },
  showSupplied: {
    text: 'Show <supplied> elements',
    description: 'Highlight all elements contained by a <supplied> element',
  },
  suppliedColor: {
    text: 'Select <supplied> highlight color',
    description: 'Select <supplied> highlight color',
  },
  respSelect: {
    text: 'Select <supplied> responsibility',
    description: 'Select responsibility id',
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
  validatingAgainst: { text: 'Validieren gegen' },
  validationComplete: { text: 'Validierung abgeschlossen' },
  noErrors: { text: 'keine Fehler' },
  errorsFound: { text: 'Fehler gefunden' }, // 5 errors found
};
