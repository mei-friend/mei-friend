/**
 * Language file for English
 */
export const lang = {
  // Main menu bar
  GithubLoginLink: { text: 'Login' },

  // FILE MENU ITEM
  FileMenuTitle: { text: 'File' },
  OpenMeiText: { text: 'Open file' },
  OpenUrlText: { text: 'Open URL' },
  OpenExpample: { text: 'Public repertoire' },
  ImportMusicXml: { text: 'Import MusicXML' },
  ImportHumdrum: { text: 'Import Humdrum' },
  ImportPae: { text: 'Import PAE, ABC' },
  SaveMeiText: { text: 'Save MEI' },
  SaveSvg: { text: 'Save SVG' },
  SaveMidi: { text: 'Save MIDI' },
  PrintPreviewText: { text: 'Preview PDF' },
  GenerateUrlText: { text: 'Generate mei-friend URL' },

  // EDIT/CODE MENU ITEM
  EditMenuTitle: { text: 'Code' },
  UndoMenuText: { text: 'Undo' },
  RedoMenuText: { text: 'Redo' },
  StartSearchText: { text: 'Search' },
  FindNextText: { text: 'Find next' },
  FindPreviousText: { text: 'Find previous' },
  ReplaceMenuText: { text: 'Replace' },
  ReplaceAllMenuText: { text: 'Replace all' },
  IndentSelectionText: { text: 'Indent selection' },
  JumpToLineText: { text: 'Jump to line' },
  ManualValidateText: { text: 'Validate' },

  // VIEW MENU ITEM
  ViewMenuTitle: { text: 'View' },
  NotationTop: { text: 'Notation top' },
  NotationBottom: { text: 'Notation bottom' },
  NotationLeft: { text: 'Notation left' },
  NotationRight: { text: 'Notation right' },
  ShowSettingsMenuText: { text: 'Settings panel' },
  ShowAnnotationMenuText: { text: 'Annotations panel' },
  ShowFacsimileMenuText: { text: 'Facsimile panel' },
  ShowPlaybackControlsText: { text: 'Playback controls' },
  FacsimileTop: { text: 'Facsimile top' },
  FacsimileBottom: { text: 'Facsimile bottom' },
  FacsimileLeft: { text: 'Facsimile left' },
  FacsimileRight: { text: 'Facsimile right' },

  // mei-friend SETTINGS MENU
  //   titleGeneral: { text: 'General', description: 'General mei-friend settings' },
  selectToolkitVersion: {
    text: 'Verovio version',
    description:
      'Select Verovio toolkit version ' +
      '(* Switching to older versions before 3.11.0 ' +
      'might require a refresh due to memory issues.)',
  },
  toggleSpeedMode: {
    text: 'Speed mode',
    description:
      'Toggle Verovio Speed Mode. ' +
      'In speed mode, only the current page ' +
      'is sent to Verovio to reduce rendering ' +
      'time with large files',
  },
  selectIdStyle: {
    text: 'Style of generated xml:ids',
    description:
      'Style of newly generated xml:ids (existing xml:ids are not changed)' +
      'e.g., Verovio original: "note-0000001318117900", ' +
      'Verovio base 36: "nophl5o", ' +
      'mei-friend style: "note-ophl5o"',
  },
  addApplicationNote: {
    text: 'Insert application statement',
    description:
      'Insert an application statement to the encoding ' +
      'description in the MEI header, identifying ' +
      'application name, version, date of first ' +
      'and last edit',
  },
  selectLanguage: { text: 'Language', description: 'Select language of mei-friend interface.' },
};
