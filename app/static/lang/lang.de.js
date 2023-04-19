/**
 * Language file for German Deutsch
 */
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

  // mei-friend SETTINGS MENU
//   titleGeneral: { text: 'Allgemein' },
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
  selectLanguage: { text: 'Sprache', description: 'Wählen Sie die Sprache des mei-friend Interface.' },
};
