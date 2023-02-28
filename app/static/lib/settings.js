// Settings panel functions

import * as att from './attribute-classes.js';
import { cm, defaultVerovioVersion, fontList, supportedVerovioVersions, validate } from './main.js';
import * as utils from './utils.js';

var v; // viewer class

export function addMeiFriendOptionsToSettingsPanel(_v, restoreFromLocalStorage = true) {
  v = _v;
  let optionsToShow = {
    titleGeneral: {
      title: 'General',
      description: 'General mei-friend settings',
      type: 'header',
      default: true,
    },
    selectToolkitVersion: {
      title: 'Verovio version',
      description:
        'Select Verovio toolkit version ' +
        '(* Switching to older versions before 3.11.0 ' +
        'might require a refresh due to memory issues.)',
      type: 'select',
      default: defaultVerovioVersion,
      values: Object.keys(supportedVerovioVersions),
      valuesDescriptions: Object.keys(supportedVerovioVersions).map((key) => {
        let desc = supportedVerovioVersions[key].description;
        if (supportedVerovioVersions[key].hasOwnProperty('releaseDate')) {
          desc += ' (' + supportedVerovioVersions[key].releaseDate + ')';
        }
        return desc;
      }),
    },
    toggleSpeedMode: {
      title: 'Speed mode',
      description:
        'Toggle Verovio Speed Mode. ' +
        'In speed mode, only the current page ' +
        'is sent to Verovio to reduce rendering ' +
        'time with large files',
      type: 'bool',
      default: true,
    },
    selectIdStyle: {
      title: 'Style of generated xml:ids',
      description:
        'Style of newly generated xml:ids (existing xml:ids are not changed)' +
        'e.g., Verovio original: "note-0000001318117900", ' +
        'Verovio base 36: "nophl5o", ' +
        'mei-friend style: "note-ophl5o"',
      type: 'select',
      values: ['Original', 'Base36', 'mei-friend'],
      valuesDescriptions: ['note-0000001018877033', 'n34z4wz2', 'note-34z4wz2'],
      default: 'Base36',
    },
    addApplicationNote: {
      title: 'Insert application statement',
      description:
        'Insert an application statement to the encoding ' +
        'description in the MEI header, identifying ' +
        'application name, version, date of first ' +
        'and last edit',
      type: 'bool',
      default: true,
    },
    dragSelection: {
      title: 'Drag select',
      description: 'Select elements in notation with mouse drag',
      type: 'header',
      default: true,
    },
    dragSelectNotes: {
      title: 'Select notes',
      description: 'Select notes',
      type: 'bool',
      default: true,
    },
    dragSelectRests: {
      title: 'Select rests',
      description: 'Select rests and repeats (rest, mRest, beatRpt, halfmRpt, mRpt)',
      type: 'bool',
      default: true,
    },
    dragSelectControlElements: {
      title: 'Select placement elements ',
      description: 'Select placement elements (i.e., with a @placement attribute: ' + att.attPlacement.join(', ') + ')',
      type: 'bool',
      default: false,
    },
    dragSelectSlurs: {
      title: 'Select slurs ',
      description: 'Select slurs (i.e., elements with @curvature attribute: ' + att.attCurvature.join(', ') + ')',
      type: 'bool',
      default: false,
    },
    dragSelectMeasures: {
      title: 'Select measures ',
      description: 'Select measures',
      type: 'bool',
      default: false,
    },
    controlMenuSettings: {
      title: 'Notation control bar',
      description: 'Define items to be shown in control menu above the notation',
      type: 'header',
      default: true,
    },
    // flip-checkbox, flip-btn
    controlMenuFlipToPageControls: {
      title: 'Show flip to page controls',
      description: 'Show flip to page controls in notation control menu',
      type: 'bool',
      default: true,
    },
    controlMenuUpdateNotation: {
      title: 'Show notation update controls',
      description: 'Show notation update behavior controls in notation control menu',
      type: 'bool',
      default: true,
    },
    controlMenuFontSelector: {
      title: 'Show notation font selector',
      description: 'Show notation font (SMuFL) selector in notation control menu',
      type: 'bool',
      default: false,
    },
    controlMenuNavigateArrows: {
      title: 'Show navigation arrows',
      description: 'Show notation navigation arrows in notation control menu',
      type: 'bool',
      default: false,
    },
    controlMenuSpeedmodeCheckbox: {
      title: 'Show speed mode checkbox',
      description: 'Show speed mode checkbox in notation control menu',
      type: 'bool',
      default: true,
    },
    titleMidiPlayback: {
      title: 'MIDI playback',
      description: 'MIDI playback settings',
      type: 'header',
      default: true,
    },
    showMidiPlaybackContextualBubble: {
      title: 'Show playback shortcut',
      description:
        'Causes a shortcut (bubble in bottom left corner; click to immediately start playback) to appear when the MIDI playback control bar is closed',
      type: 'bool',
      default: true,
    },
    showMidiPlaybackControlBar: {
      title: 'Show MIDI playback control bar',
      description: 'Show MIDI playback control bar',
      type: 'bool',
      default: false,
    },
    scrollFollowMidiPlayback: {
      title: 'Scroll-follow MIDI playback',
      description: 'Scroll notation panel to follow MIDI playback on current page',
      type: 'bool',
      default: true,
    },
    pageFollowMidiPlayback: {
      title: 'Page-follow MIDI playback',
      description: 'Automatically flip pages to follow MIDI playback',
      type: 'bool',
      default: true,
    },
    renumberMeasuresHeading: {
      title: 'Renumber measures',
      description: 'Settings for renumbering measures',
      type: 'header',
      default: true,
    },
    renumberMeasureContinueAcrossIncompleteMeasures: {
      title: 'Continue across incomplete measures',
      description: 'Continue measure numbers across incomplete measures (@metcon="false")',
      type: 'bool',
      default: false,
    },
    renumberMeasuresUseSuffixAtMeasures: {
      title: 'Use suffix at incomplete measures',
      description: 'Use number suffix at incomplete measures (e.g., 23-cont)',
      type: 'select',
      values: ['none', '-cont'],
      default: false,
    },
    renumberMeasuresContinueAcrossEndings: {
      title: 'Continue across endings',
      description: 'Continue measure numbers across endings',
      type: 'bool',
      default: false,
    },
    renumberMeasuresUseSuffixAtEndings: {
      title: 'Use suffix at endings',
      description: 'Use number suffix at endings (e.g., 23-a)',
      type: 'select',
      values: ['none', 'ending@n', 'a/b/c', 'A/B/C', '-a/-b/-c', '-A/-B/-C'],
      default: 'a/b/c',
    },
    // annotationPanelSeparator: {
    //   title: 'options-line', // class name of hr element
    //   type: 'line'
    // },
    highlightCurrentlySoundingNotes: {
      title: 'Highlight currently-sounding notes',
      description: 'Visually highlight currently-sounding notes in the notation panel during MIDI playback ',
      type: 'bool',
      default: true,
    },
    titleAnnotations: {
      title: 'Annotations',
      description: 'Annotation settings',
      type: 'header',
      default: true,
    },
    showAnnotations: {
      title: 'Show annotations',
      description: 'Show annotations in notation',
      type: 'bool',
      default: true,
    },
    showAnnotationPanel: {
      title: 'Show annotation panel',
      description: 'Show annotation panel',
      type: 'bool',
      default: false,
    },
    annotationDisplayLimit: {
      title: 'Maximum number of annotations',
      description: 'Maximum number of annotations to display ' + '(large numbers may slow mei-friend)',
      type: 'int',
      min: 0,
      step: 100,
      default: 100,
    },
    titleFacsimilePanel: {
      title: 'Facsimile panel',
      description: 'Show the facsimile imiages of the source edition, if available',
      type: 'header',
      open: false,
      default: false,
    },
    showFacsimilePanel: {
      title: 'Show facsimile panel',
      description: 'Show the score images of the source edition provided in the facsimile element',
      type: 'bool',
      default: false,
    },
    selectFacsimilePanelOrientation: {
      title: 'Facsimile panel position',
      description: 'Select facsimile panel position relative to notation',
      type: 'select',
      values: ['left', 'right', 'top', 'bottom'],
      default: 'bottom',
    },
    facsimileZoomInput: {
      title: 'Facsimile image zoom (%)',
      description: 'Zoom level of facsimile image (in percent)',
      type: 'int',
      min: 10,
      max: 300,
      step: 5,
      default: 100,
    },
    showFacsimileFullPage: {
      title: 'Show full page',
      description: 'Show facsimile image on full page',
      type: 'bool',
      default: false,
    },
    editFacsimileZones: {
      title: 'Edit facsimile zones',
      description: 'Edit facsimile zones (will link bounding boxes to facsimile zones)',
      type: 'bool',
      default: false,
    },
    // sourcefacsimilePanelSeparator: {
    //   title: 'options-line', // class name of hr element
    //   type: 'line'
    // },
    titleSupplied: {
      title: 'Handle editorial content',
      description: 'Control handling of <supplied> elements',
      type: 'header',
      open: false,
      default: false,
    },
    showSupplied: {
      title: 'Show <supplied> elements',
      description: 'Highlight all elements contained by a <supplied> element',
      type: 'bool',
      default: true,
    },
    suppliedColor: {
      title: 'Select <supplied> highlight color',
      description: 'Select <supplied> highlight color',
      type: 'color',
      default: '#e69500',
    },
    respSelect: {
      title: 'Select <supplied> responsibility',
      description: 'Select responsibility id',
      type: 'select',
      default: 'none',
      values: [],
    },
    // dragLineSeparator: {
    //   title: 'options-line', // class name of hr element
    //   type: 'line'
    // },
  };
  let mfs = document.getElementById('meiFriendSettings');
  let addListeners = false; // add event listeners only the first time
  let rt = document.querySelector(':root');
  if (!/\w/g.test(mfs.innerHTML)) addListeners = true;
  mfs.innerHTML = '<div class="settingsHeader">mei-friend Settings</div>';
  let storage = window.localStorage;
  let currentHeader;
  Object.keys(optionsToShow).forEach((opt) => {
    let o = optionsToShow[opt];
    let value = o.default;
    if (storage.hasOwnProperty('mf-' + opt)) {
      if (restoreFromLocalStorage && opt !== 'showMidiPlaybackControlBar') {
        // WG: showMidiPlaybackControlBar always default
        value = storage['mf-' + opt];
        if (typeof value === 'string' && (value === 'true' || value === 'false')) value = value === 'true';
      } else {
        delete storage['mf-' + opt];
      }
    }
    // set default values for mei-friend settings
    switch (opt) {
      case 'selectToolkitVersion':
        v.vrvWorker.postMessage({
          cmd: 'loadVerovio',
          msg: value,
          url:
            value in supportedVerovioVersions
              ? supportedVerovioVersions[value].url
              : supportedVerovioVersions[o.default].url,
        });
        break;
      case 'selectIdStyle':
        v.xmlIdStyle = value;
        break;
      case 'toggleSpeedMode':
        document.getElementById('midiSpeedmodeIndicator').style.display = v.speedMode ? 'inline' : 'none';
        break;
      case 'showSupplied':
        rt.style.setProperty('--suppliedColor', value ? 'var(--defaultSuppliedColor)' : 'var(--notationColor)');
        rt.style.setProperty(
          '--suppliedHighlightedColor',
          value ? 'var(--defaultSuppliedHighlightedColor)' : 'var(--highlightColor)'
        );
        break;
      case 'suppliedColor':
        let checked = document.getElementById('showSupplied').checked;
        rt.style.setProperty('--defaultSuppliedColor', checked ? value : 'var(--notationColor)');
        rt.style.setProperty(
          '--defaultSuppliedHighlightedColor',
          checked ? utils.brighter(value, -50) : 'var(--highlightColor)'
        );
        rt.style.setProperty('--suppliedColor', checked ? value : 'var(--notationColor)');
        rt.style.setProperty(
          '--suppliedHighlightedColor',
          checked ? utils.brighter(value, -50) : 'var(--highlightColor)'
        );
        break;
      case 'respSelect':
        if (v.xmlDoc)
          o.values = Array.from(v.xmlDoc.querySelectorAll('corpName[*|id]')).map((e) => e.getAttribute('xml:id'));
        break;
      case 'controlMenuFontSelector':
        document.getElementById('font-ctrls').style.display = value ? 'inherit' : 'none';
        break;
      case 'controlMenuSpeedmodeCheckbox':
        document.getElementById('speed-div').style.display = value ? 'inherit' : 'none';
        break;
      case 'controlMenuNavigateArrows':
        document.getElementById('navigate-ctrls').style.display = value ? 'inherit' : 'none';
        break;
      case 'controlMenuFlipToPageControls':
        document.getElementById('flip-checkbox').style.display = value ? 'inherit' : 'none';
        document.getElementById('flip-btn').style.display = value ? 'inherit' : 'none';
        break;
      case 'controlMenuUpdateNotation':
        document.getElementById('update-ctrls').style.display = value ? 'inherit' : 'none';
        break;
      case 'showFacsimileFullPage':
        document.getElementById('facsimile-full-page-checkbox').checked = value;
        break;
      case 'editFacsimileZones':
        document.getElementById('facsimile-edit-zones-checkbox').checked = value;
        break;
      case 'showMidiPlaybackControlBar':
        // do nothing, as it is always the default display: none
        break;
    }
    let div = createOptionsItem(opt, o, value);
    if (div) {
      if (div.classList.contains('optionsSubHeading')) {
        currentHeader = div;
        mfs.appendChild(currentHeader);
      } else if (currentHeader) {
        currentHeader.appendChild(div);
      } else {
        mfs.appendChild(div);
      }
    }
    if (opt === 'respSelect') v.respId = document.getElementById('respSelect').value;
    if (opt === 'renumberMeasuresUseSuffixAtEndings') {
      v.disableElementThroughCheckbox('renumberMeasuresContinueAcrossEndings', 'renumberMeasuresUseSuffixAtEndings');
    }
    if (opt === 'renumberMeasuresUseSuffixAtMeasures') {
      v.disableElementThroughCheckbox(
        'renumberMeasureContinueAcrossIncompleteMeasures',
        'renumberMeasuresUseSuffixAtMeasures'
      );
    }
  });
  mfs.innerHTML +=
    '<input type="button" title="Reset to mei-friend defaults" id="mfReset" class="resetButton" value="Default" />';

  if (addListeners) {
    // add change listeners
    mfs.addEventListener('input', (ev) => {
      // console.log('meiFriend settings event listener: ', ev);
      let option = ev.target.id;
      let value = ev.target.value;
      if (ev.target.type === 'checkbox') value = ev.target.checked;
      if (ev.target.type === 'number') value = parseFloat(value);
      let col = document.getElementById('suppliedColor').value;
      switch (option) {
        case 'selectToolkitVersion':
          v.vrvWorker.postMessage({
            cmd: 'loadVerovio',
            msg: value,
            url: supportedVerovioVersions[value].url,
          });
          break;
        case 'selectIdStyle':
          v.xmlIdStyle = value;
          break;
        case 'toggleSpeedMode':
          let sb = document.getElementById('speed-checkbox');
          if (sb) {
            sb.checked = value;
            sb.dispatchEvent(new Event('change'));
          }
          break;
        case 'showAnnotations':
          v.updateLayout();
          break;
        case 'showAnnotationPanel':
          v.toggleAnnotationPanel();
          break;
        case 'showMidiPlaybackControlBar':
          cmd.toggleMidiPlaybackControlBar(false);
          break;
        case 'editFacsimileZones':
          document.getElementById('facsimile-edit-zones-checkbox').checked = value;
          drawFacsimile();
          break;
        case 'showFacsimilePanel':
          value ? cmd.showFacsimilePanel() : cmd.hideFacsimilePanel();
          break;
        case 'selectFacsimilePanelOrientation':
          drawFacsimile();
          break;
        case 'showFacsimileFullPage':
          document.getElementById('facsimile-full-page-checkbox').checked = value;
          drawFacsimile();
          break;
        case 'facsimileZoomInput':
          zoomFacsimile();
          let facsZoom = document.getElementById('facsimile-zoom');
          if (facsZoom) facsZoom.value = value;
          break;
        case 'showSupplied':
          rt.style.setProperty('--suppliedColor', value ? col : 'var(--notationColor)');
          rt.style.setProperty(
            '--suppliedHighlightedColor',
            value ? utils.brighter(col, -50) : 'var(--highlightColor)'
          );
          break;
        case 'suppliedColor':
          let checked = document.getElementById('showSupplied').checked;
          rt.style.setProperty('--suppliedColor', checked ? col : 'var(--notationColor)');
          rt.style.setProperty(
            '--suppliedHighlightedColor',
            checked ? utils.brighter(col, -50) : 'var(--highlightColor)'
          );
          break;
        case 'respSelect':
          v.respId = document.getElementById('respSelect').value;
          break;
        case 'controlMenuFontSelector':
          document.getElementById('font-ctrls').style.display = document.getElementById('controlMenuFontSelector')
            .checked
            ? 'inherit'
            : 'none';
          break;
        case 'controlMenuSpeedmodeCheckbox':
          document.getElementById('speed-div').style.display = document.getElementById('controlMenuSpeedmodeCheckbox')
            .checked
            ? 'inherit'
            : 'none';
          break;
        case 'controlMenuNavigateArrows':
          document.getElementById('navigate-ctrls').style.display = document.getElementById('controlMenuNavigateArrows')
            .checked
            ? 'inherit'
            : 'none';
          break;
        case 'controlMenuFlipToPageControls':
          const v = document.getElementById('controlMenuFlipToPageControls').checked;
          document.getElementById('flip-checkbox').style.display = v ? 'inherit' : 'none';
          document.getElementById('flip-btn').style.display = v ? 'inherit' : 'none';
          break;
        case 'controlMenuUpdateNotation':
          const u = document.getElementById('controlMenuUpdateNotation').checked;
          document.getElementById('update-ctrls').style.display = u ? 'inherit' : 'none';
          break;
        case 'renumberMeasuresContinueAcrossEndings':
          v.disableElementThroughCheckbox(
            'renumberMeasuresContinueAcrossEndings',
            'renumberMeasuresUseSuffixAtEndings'
          );
          break;
        case 'renumberMeasureContinueAcrossIncompleteMeasures':
          v.disableElementThroughCheckbox(
            'renumberMeasureContinueAcrossIncompleteMeasures',
            'renumberMeasuresUseSuffixAtMeasures'
          );
          break;
      }
      if (value === optionsToShow[option].default) {
        delete storage['mf-' + option]; // remove from storage object when default value
      } else {
        storage['mf-' + option] = value; // save changes in localStorage object
      }
    });
    // add event listener for details toggling
    // v.addToggleListener(mfs, 'mf-');
    // let storageSuffix = 'mf-';
    // mfs.addEventListener('toggle', (ev) => {
    //   console.log('ToggleListener: ', ev.target);
    //   if (ev.target.hasAttribute('type') && ev.target.getAttribute('type') === 'header') {
    //     let option = ev.target.id;
    //     let value = ev.target.hasAttribute('open') ? true : false;
    //     if (value === optionsToShow[option].default) {
    //       delete storage[storageSuffix + option]; // remove from storage object when default value
    //     } else {
    //       storage[storageSuffix + option] = value; // save changes in localStorage object
    //     }
    //   }
    // });
    // add event listener for reset button
    mfs.addEventListener('click', (ev) => {
      if (ev.target.id === 'mfReset') {
        addMeiFriendOptionsToSettingsPanel(v, false);
        applySettingsFilter();
      }
    });
  }
} // addMeiFriendOptionsToSettingsPanel()

export function addCmOptionsToSettingsPanel(v, mfDefaults, restoreFromLocalStorage = true) {
  let optionsToShow = {
    // key as in CodeMirror
    titleAppearance: {
      title: 'Editor appearance',
      description: 'Controls the appearance of the editor',
      type: 'header',
      open: true,
      default: true,
    },
    zoomFont: {
      title: 'Font size (%)',
      description: 'Change font size of editor (in percent)',
      type: 'int',
      default: 100,
      min: 45,
      max: 300,
      step: 5,
    },
    theme: {
      title: 'Theme',
      description: 'Select the theme of the editor',
      type: 'select',
      default: 'default',
      values: [
        'default',
        'abbott',
        'base16-dark',
        'base16-light',
        'cobalt',
        'darcula',
        'dracula',
        'eclipse',
        'elegant',
        'monokai',
        'idea',
        'juejin',
        'mdn-like',
        'neo',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'solarized dark',
        'solarized light',
        'xq-dark',
        'xq-light',
        'yeti',
        'yonce',
        'zenburn',
      ],
    },
    matchTheme: {
      title: 'Notation matches theme',
      description: 'Match notation to editor color theme',
      type: 'bool',
      default: false,
    },
    tabSize: {
      title: 'Indentation size',
      description: 'Number of space characters for each indentation level',
      type: 'int',
      min: 1,
      max: 12,
      step: 1,
      default: 3,
    },
    lineWrapping: {
      title: 'Line wrapping',
      description: 'Whether or not lines are wrapped at end of panel',
      type: 'bool',
      default: false,
    },
    lineNumbers: {
      title: 'Line numbers',
      description: 'Show line numbers',
      type: 'bool',
      default: true,
    },
    firstLineNumber: {
      title: 'First line number',
      description: 'Set first line number',
      type: 'int',
      min: 0,
      max: 1,
      step: 1,
      default: 1,
    },
    foldGutter: {
      title: 'Code folding',
      description: 'Enable code folding through fold gutters',
      type: 'bool',
      default: true,
    },
    titleEditorOptions: {
      title: 'Editor behavior',
      description: 'Controls the behavior of the editor',
      type: 'header',
      open: true,
      default: true,
    },
    autoValidate: {
      title: 'Auto validation',
      description: 'Validate encoding against schema automatically after each edit',
      type: 'bool',
      default: true,
    },
    autoCloseBrackets: {
      title: 'Auto close brackets',
      description: 'Automatically close brackets at input',
      type: 'bool',
      default: true,
    },
    autoCloseTags: {
      title: 'Auto close tags',
      description: 'Automatically close tags at input',
      type: 'bool',
      default: true,
    },
    matchTags: {
      title: 'Match tags',
      description: 'Highlights matched tags around editor cursor',
      type: 'bool',
      default: true,
    },
    showTrailingSpace: {
      title: 'Highlight trailing spaces',
      description: 'Highlights unnecessary trailing spaces at end of lines',
      type: 'bool',
      default: true,
    },
    keyMap: {
      title: 'Key map',
      description: 'Select key map',
      type: 'select',
      default: 'default',
      values: ['default', 'vim', 'emacs'],
    },
  };
  let storage = window.localStorage;
  let cmsp = document.getElementById('editorSettings');
  let addListeners = false; // add event listeners only the first time
  let currentHeader;
  if (!/\w/g.test(cmsp.innerHTML)) addListeners = true;
  cmsp.innerHTML = '<div class="settingsHeader">Editor Settings</div>';
  Object.keys(optionsToShow).forEach((opt) => {
    let o = optionsToShow[opt];
    let value = o.default;
    if (mfDefaults.hasOwnProperty(opt)) {
      value = mfDefaults[opt];
      if (opt === 'matchTags' && typeof value === 'object') value = true;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && opt === 'theme') {
      value = mfDefaults['defaultDarkTheme']; // take a dark scheme for dark mode
    }
    if (storage.hasOwnProperty('cm-' + opt)) {
      if (restoreFromLocalStorage) value = storage['cm-' + opt];
      else delete storage['cm-' + opt];
    }
    let div = createOptionsItem(opt, o, value);
    if (div) {
      if (div.classList.contains('optionsSubHeading')) {
        currentHeader = div;
        cmsp.appendChild(currentHeader);
      } else if (currentHeader) {
        currentHeader.appendChild(div);
      } else {
        cmsp.appendChild(div);
      }
    }
    applyEditorOption(v, cm, opt, value);
  });
  cmsp.innerHTML +=
    '<input type="button" title="Reset to mei-friend defaults" id="cmReset" class="resetButton" value="Default" />';

  if (addListeners) {
    // add change listeners
    cmsp.addEventListener('input', (ev) => {
      let option = ev.target.id;
      let value = ev.target.value;
      if (ev.target.type === 'checkbox') value = ev.target.checked;
      if (ev.target.type === 'number') value = parseFloat(value);
      applyEditorOption(
        v,
        cm,
        option,
        value,
        storage.hasOwnProperty('cm-matchTheme') ? storage['cm-matchTheme'] : mfDefaults['matchTheme']
      );
      if (option === 'theme' && storage.hasOwnProperty('cm-matchTheme')) {
        v.setNotationColors(
          storage.hasOwnProperty('cm-matchTheme') ? storage['cm-matchTheme'] : mfDefaults['matchTheme']
        );
      }
      if (
        (mfDefaults.hasOwnProperty(option) &&
          option !== 'theme' &&
          mfDefaults[option].toString() === value.toString()) ||
        (option === 'theme' &&
          (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? mfDefaults.defaultDarkTheme
            : mfDefaults.defaultBrightTheme) === value.toString())
      ) {
        delete storage['cm-' + option]; // remove from storage object when default value
      } else {
        storage['cm-' + option] = value; // save changes in localStorage object
      }
      if (option === 'autoValidate') {
        // validate if auto validation is switched on again
        if (value) {
          validate(cm.getValue(), v.updateLinting, {
            forceValidate: true,
          });
        } else {
          v.setValidationStatusToManual();
        }
      }
    });
    // add event listener for details toggling
    // v.addToggleListener(cmsp, optionsToShow, 'cm-');
    // reset CodeMirror options to default
    cmsp.addEventListener('click', (ev) => {
      if (ev.target.id === 'cmReset') {
        addCmOptionsToSettingsPanel(v, mfDefaults, false);
        applySettingsFilter();
      }
    });
    // automatically switch color scheme, if on default schemes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (ev) => {
      // system changes from dark to bright or otherway round
      if (!storage.hasOwnProperty('cm-theme')) {
        // only if not changed by user
        let matchTheme = storage.hasOwnProperty('cm-matchTheme')
          ? storage['cm-matchTheme']
          : mfDefaults['cm-matchTheme'];
        if (ev.matches) {
          // event listener for dark/bright mode changes
          document.getElementById('theme').value = mfDefaults['defaultDarkTheme'];
          applyEditorOption(v, cm, 'theme', mfDefaults['defaultDarkTheme'], matchTheme);
        } else {
          document.getElementById('theme').value = mfDefaults['defaultBrightTheme'];
          applyEditorOption(v, cm, 'theme', mfDefaults['defaultBrightTheme'], matchTheme);
        }
      }
    });
  }
} // addCmOptionsToSettingsPanel()

export function clearVrvOptionsSettingsPanel(v) {
  v.vrvOptions = {};
  document.getElementById('verovioSettings').innerHTML = '';
} // clearVrvOptionsSettingsPanel()

// initializes the settings panel by filling it with content
export function addVrvOptionsToSettingsPanel(v, tkAvailableOptions, defaultVrvOptions, restoreFromLocalStorage = true) {
  // skip these options (in part because they are handled in control menu)
  let skipList = ['breaks', 'engravingDefaults', 'expand', 'svgAdditionalAttribute', 'handwrittenFont'];
  let vsp = document.getElementById('verovioSettings');
  let addListeners = false; // add event listeners only the first time
  if (!/\w/g.test(vsp.innerHTML)) addListeners = true;
  vsp.innerHTML = '<div class="settingsHeader">Verovio Settings</div>';
  let storage = window.localStorage;

  Object.keys(tkAvailableOptions.groups).forEach((grp, i) => {
    let group = tkAvailableOptions.groups[grp];
    let groupId = group.name.replaceAll(' ', '_');
    // skip these two groups: base handled by mei-friend; sel to be thought (TODO)
    if (!group.name.startsWith('Base short') && !group.name.startsWith('Element selectors')) {
      let details = document.createElement('details');
      details.innerHTML += `<summary id="vrv-${groupId}">${group.name}</summary>`;
      Object.keys(group.options).forEach((opt) => {
        let o = group.options[opt]; // vrv available options
        let value = o.default; // available options defaults
        if (defaultVrvOptions.hasOwnProperty(opt))
          // mei-friend vrv defaults
          value = defaultVrvOptions[opt];
        if (storage.hasOwnProperty(opt)) {
          if (restoreFromLocalStorage) value = storage[opt];
          else delete storage[opt];
        }
        if (!skipList.includes(opt)) {
          let div = createOptionsItem('vrv-' + opt, o, value);
          if (div) details.appendChild(div);
        }
        // set all options so that toolkit is always completely cleared
        if (['bool', 'int', 'double', 'std::string-list', 'array'].includes(o.type)) {
          v.vrvOptions[opt.split('vrv-').pop()] = value;
        }
      });
      if (i === 1) details.setAttribute('open', 'true');
      vsp.appendChild(details);
    }
  });

  vsp.innerHTML +=
    '<input type="button" title="Reset to mei-friend defaults" id="vrvReset" class="resetButton" value="Default" />';
  if (addListeners) {
    // add change listeners
    vsp.addEventListener('input', (ev) => {
      let opt = ev.target.id;
      let value = ev.target.value;
      if (ev.target.type === 'checkbox') value = ev.target.checked;
      if (ev.target.type === 'number') value = parseFloat(value);
      v.vrvOptions[opt.split('vrv-').pop()] = value;
      if (
        defaultVrvOptions.hasOwnProperty(opt) && // TODO check vrv default values
        defaultVrvOptions[opt].toString() === value.toString()
      ) {
        delete storage[opt]; // remove from storage object when default value
      } else {
        storage[opt] = value; // save changes in localStorage object
      }
      if (opt === 'vrv-font') {
        document.getElementById('font-select').value = value;
      } else if (opt.startsWith('vrv-midi')) {
        if (document.getElementById('showMidiPlaybackControlBar').checked) {
          startMidiTimeout(true);
        }
        return; // skip updating notation when midi options changed
      }
      window.clearTimeout(v.vrvTimeout);
      v.vrvTimeout = window.setTimeout(() => v.updateLayout(v.vrvOptions), v.timeoutDelay);
    });
    // add event listener for details toggling
    // v.addToggleListener(vsp, 'vrv-');
    // add listener for the reset button
    vsp.addEventListener('click', (ev) => {
      if (ev.target.id === 'vrvReset') {
        addVrvOptionsToSettingsPanel(v, tkAvailableOptions, defaultVrvOptions, false);
        v.updateLayout(v.vrvOptions);
        applySettingsFilter();
        if (document.getElementById('showMidiPlaybackControlBar').checked) {
          startMidiTimeout(true);
        }
      }
    });
  }
} // addVrvOptionsToSettingsPanel()

/**
 * Go through current active tab of settings menu and filter option items (make invisible)
 */
export function applySettingsFilter() {
  const filterSettingsString = document.getElementById('filterSettings').value;
  const resetButton = document.getElementById('filterReset');
  if (resetButton) resetButton.style.visibility = 'hidden';

  // current active tab
  const activeTabButton = document.querySelector('#settingsPanel .tablink.active');
  if (activeTabButton) {
    const activeTab = document.getElementById(activeTabButton.dataset.tab);
    if (activeTab) {
      // restore any previously filtered out settings
      const optionsList = activeTab.querySelectorAll('div.optionsItem,details');
      let i = 0;
      optionsList.forEach((opt) => {
        opt.classList.remove('odd');
        opt.style.display = 'flex'; // reset to active...
        if (opt.nodeName.toLowerCase() === 'details') {
          i = 0; // reset counter at each details element
        } else {
          opt.dataset.tab = activeTab.id;
          const optInput = opt.querySelector('input,select');
          const optLabel = opt.querySelector('label');
          // if we're filtering and don't have a match
          if (
            filterSettingsString &&
            optInput &&
            optLabel &&
            !(
              optInput.id.toLowerCase().includes(filterSettingsString.toLowerCase()) ||
              optLabel.innerText.toLowerCase().includes(filterSettingsString.toLowerCase())
            )
          ) {
            opt.style.display = 'none'; // filter out
          } else {
            // add class "odd" to every other displayed element
            if (++i % 2 === 1) opt.classList.add('odd');
          }
        }
      });

      // additional filter-specific layout modifications
      if (filterSettingsString) {
        // remove dividing lines
        activeTab.querySelectorAll('hr.options-line').forEach((l) => (l.style.display = 'none'));
        // open all flaps
        activeTab.querySelectorAll('details').forEach((d) => {
          d.setAttribute('open', 'true');
          if (!d.querySelector('div.optionsItem[style="display: flex;"]')) d.style.display = 'none';
        });
        if (resetButton) resetButton.style.visibility = 'visible';
      } else {
        // show dividing lines
        activeTab.querySelectorAll('hr.options-line').forEach((l) => (l.style.display = 'block'));
        activeTab.querySelectorAll('details').forEach((d) => (d.style.display = 'block'));
        // open only the first flap
        // Array.from(activeTab.getElementsByTagName("details")).forEach((d, ix) => {
        //   if (ix === 0)
        //     d.setAttribute("open", "true");
        //   else
        //     d.removeAttribute("open");
        // })
      }
    }
  }
} // applySettingsFilter()

// TODO: does not get called (WG., 12 Okt 2022)
// adds an event listener to the targetNode, to listen to 'header' elements (details/summary)
// and storing this information in local storage, using the storageSuffix in the variable name
function addToggleListener(targetNode, optionsToShow, storageSuffix = 'mf-') {
  targetNode.addEventListener('toggle', (ev) => {
    console.log('ToggleListener: ', ev.target);
    if (ev.target.hasAttribute('type') && ev.target.getAttribute('type') === 'header') {
      let option = ev.target.id;
      let value = ev.target.hasAttribute('open') ? true : false;
      if (value === optionsToShow[option].default) {
        delete storage[storageSuffix + option]; // remove from storage object when default value
      } else {
        storage[storageSuffix + option] = value; // save changes in localStorage object
      }
    }
  });
} // addToggleListener()

// Apply options to CodeMirror object and handle other specialized options
function applyEditorOption(v, cm, option, value, matchTheme = false) {
  switch (option) {
    case 'zoomFont':
      v.changeEditorFontSize(value);
      break;
    case 'matchTheme':
      v.setNotationColors(value);
      break;
    case 'matchTags':
      cm.setOption(
        option,
        value
          ? {
              bothTags: true,
            }
          : {}
      );
      break;
    case 'tabSize':
      cm.setOption('indentUnit', value); // sync tabSize and indentUnit
      cm.setOption(option, value);
      break;
    default:
      if (value === 'true' || value === 'false') value = value === 'true';
      cm.setOption(option, value);
      if (option === 'theme') {
        v.setMenuColors();
        v.setNotationColors(matchTheme);
      }
  }
} // applyEditorOption()

/**
 * Creates an option div with a label and input/select depending of o.keys
 * @param {string} opt (e.g. 'vrv-pageHeight', 'controlMenuFlipToPageControls')
 * @param {object} o
 * @param {string} optDefault
 * @returns {Element}
 */
function createOptionsItem(opt, o, optDefault) {
  if (o.type === 'header') {
    // create a details>summary structure instead of header
    let details = document.createElement('details');
    details.classList.add('optionsSubHeading');
    details.open = o.hasOwnProperty('default') ? optDefault : true;
    details.setAttribute('id', opt);
    details.setAttribute('type', 'header');
    let summary = document.createElement('summary');
    summary.setAttribute('title', o.description);
    summary.innerText = o.title;
    details.appendChild(summary);
    return details;
  }
  let div = document.createElement('div');
  div.classList.add('optionsItem');
  let label = document.createElement('label');
  let title = o.description;
  if (o.default) title += ' (default: ' + o.default + ')';
  label.setAttribute('title', title);
  label.setAttribute('for', opt);
  label.innerText = o.title;
  div.appendChild(label);
  let input;
  let step = 0.05;
  switch (o.type) {
    case 'bool':
      input = document.createElement('input');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('name', opt);
      input.setAttribute('id', opt);
      if ((typeof optDefault === 'string' && optDefault === 'true') || (typeof optDefault === 'boolean' && optDefault))
        input.setAttribute('checked', true);
      break;
    case 'int':
      step = 1;
    case 'double':
      input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.setAttribute('name', opt);
      input.setAttribute('id', opt);
      let optKeys = Object.keys(o);
      if (optKeys.includes('min')) input.setAttribute('min', o.min);
      if (optKeys.includes('max')) input.setAttribute('max', o.max);
      input.setAttribute('step', optKeys.includes('step') ? o.step : step);
      input.setAttribute('value', optDefault);
      break;
    case 'std::string':
      if (opt.endsWith('font')) {
        input = document.createElement('select');
        input.setAttribute('name', opt);
        input.setAttribute('id', opt);
        fontList.forEach((str, i) =>
          input.add(new Option(str, str, fontList.indexOf(optDefault) === i ? true : false))
        );
      }
      break;
    case 'select':
    case 'std::string-list':
      input = document.createElement('select');
      input.setAttribute('name', opt);
      input.setAttribute('id', opt);
      o.values.forEach((str, i) => {
        let option = new Option(str, str, o.values.indexOf(optDefault) === i ? true : false);
        if ('valuesDescriptions' in o) option.title = o.valuesDescriptions[i];
        input.add(option);
      });
      break;
    case 'color':
      input = document.createElement('input');
      input.setAttribute('type', 'color');
      input.setAttribute('name', opt);
      input.setAttribute('id', opt);
      input.setAttribute('value', optDefault);
      break;
    case 'line':
      div.removeChild(label);
      div.classList.remove('optionsItem');
      let line = document.createElement('hr');
      line.classList.add(o.title);
      div.appendChild(line);
      break;
    default:
      console.log(
        'Creating Verovio Options: Unhandled data type: ' +
          o.type +
          ', title: ' +
          o.title +
          ' [' +
          o.type +
          '], default: [' +
          optDefault +
          ']'
      );
  }
  if (input) div.appendChild(input);
  return input || o.type === 'header' || o.type === 'line' ? div : null;
} // createOptionsItem()
