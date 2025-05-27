# mei-friend-online CHANGELOG.md

### 1.2.6 patch
* Initial implementation of Annote integration for ranged annotations ([#149](https://github.com/mei-friend/mei-friend/issues/149))
* Fix bug on Chrome that selected all notes upon mouse click (tks Clara Byom for raising the issue)
* Restore cursor position and viewport in CodeMirror after xml:id manipulations (thanks [@aaaaalbert](https://github.com/aaaaalbert) for [#150](https://github.com/mei-friend/mei-friend/issues/150), [#151](https://github.com/mei-friend/mei-friend/issues/151), [#152](https://github.com/mei-friend/mei-friend/issues/152), [#153](https://github.com/mei-friend/mei-friend/issues/153))
* Support for import of CMME files  (Computerized Mensural Music Editing, thanks to [@annplaksin](https://github.com/annplaksin) for raising [#155](https://github.com/mei-friend/mei-friend/issues/155)), 
  with dedicated warning when using Verovio before version 5.3.1
* Do not add applicationInfo to files with MEI Basic schema ([#156](https://github.com/mei-friend/mei-friend/issues/156))

### 1.2.5 patch (released 7 May 2025)
* Retrieve SVG coordinate values from `getBBox()` instead of `use[x/y]` to address changes in Verovio ([PR#4039](https://github.com/rism-digital/verovio/pull/4039))
* Update accid.ges checker for MEI 5 (i.e. `@keysig` instead of `@key.sig`)
* Change error icon to alert-fill octicon ([#147](https://github.com/mei-friend/mei-friend/issues/147) thanks [@ahankinson](https://github.com/ahankinson))

### 1.2.4 patch
* Add meter conformance checker ([#142](https://github.com/mei-friend/mei-friend/issues/142)) that inspects the duration of each staff within a measure relative to the current time signature
  * Known shortcomings: 
      - missing support for markup elements `choice`, `subst`
      - `meterSigGrp` not handled (`func="mixed,alternating"`)
* Improve handling of remote changes to Git-managed files

### 1.2.3 patch
* Add latest Vervio release 5.1.0
* Better accommodate Solid Pods hosted on providers running Community Solid Server

### 1.2.2 patch
* Avoid multiple search dialogs and ensure focus on search dialog (thx [@maxrothman](https://github.com/maxrothman) for spotting the bug)
* Reload expansion options on toggle of MIDI playback control bar (thx [@maxrothman](https://github.com/maxrothman) for the suggestion)
* Fix undo behavior after using surrounding with tag function (thx [@maxrothman](https://github.com/maxrothman), fixes [#135](https://github.com/mei-friend/mei-friend/issues/135))
* Add latest releases of Verovio (4.5.1, 4.5.0)

### 1.2.1 patch
* Improve key bindings mechanism and scope 
* Fix switch focus and lookup guidelines key bindings in editor (and others)
* Fix broken tests for facsimile and MIDI playback
* Ensure focus of search field in persistent search

## 1.2.0 Enrichment panel, editorial mark-up, GitHub improvements (released on 17 January 2025)
- Release of major new functionalities: 

  - expansion of mei-friend's facilities for editorial mark-up through a re-worked annotation panel (now renamed to enrichment panel). Thanks to [@annplaksin](https://github.com/annplaksin)!
  - redevelopment of git integration for more stable and sustainable collaborative editing.
- Changes to splash screen text – extend paragraph on data transmission to announce new proxy server requirement for GitHub interactions: commit [`e7458da`](https://github.com/mei-friend/mei-friend/commit/e7458daba4bc0a7960efc0b8bbfd85e16e08a6c4) (english text) and commit [`ac94ef1`](https://github.com/mei-friend/mei-friend/commit/ac94ef1309bcd728f6c107027b20cb857744bcf8) (translations):

> For technical reasons, certain interactions with GitHub (cloning a repository to your browser when first opening an encoding, or committing changes to a repository) require data to be transmitted to a proxy server hosted by the mdw – University of Music and Performing Arts Vienna. This server acts as an intermediary between your browser and GitHub, and does not store any data transmitted through it.

- Implement mechanism to track and display date of last splash screen text change, and to trigger the screen to show if user has not yet acknowledged the latest version of the text.
- Resizer reworked to ensure visibility of x and y scroll bars
- Clear undo history upon file loading to prevent undoing freshly loaded MEI file (fixes #117)
- Allow default key bindings in Solid URL text field
- Fix bug that prevented Fronimo files being opened via the git integration
- Improve display of long filenames (thx [@maxrothman](https://github.com/maxrothman))
- Set Ludwig Baumann's "Mondnacht am Meer" as default demo encoding at start-up and add it to the public repertoire list

### 1.1.8 Merge isomorphic-git and mark-up enrichment developments

- Merges patches 1.0.17 (migration to isomorphic-git) and 1.1.7 (enrichment panel and editorial markup) in preparation for 1.2.0 release

### 1.1.7 patch

- Support for markup color export to PDF ([#108](https://github.com/mei-friend/mei-friend/issues/108))
- Add checkbox to control markup color export to PDF
- Improve UIX of markup panel
- Interactively highlight current markup item in list when clicking or drag-selecting notation and/or navigating in encoding

### 1.1.6 patch

- Fix version selection and parsing in speed mode
- Fix and markup deletion in speed mode
- Improve markup UI

### 1.1.5 patch

- Include filtering for different versions inside `<choice>` or `<subst>` in speed mode.
- Update midi on switching versions in the notation panel.
- Horizontal layout for markup panel added.

### 1.1.4 Refine Editorial Markup

- Add subst element to markup tools.
- Moved responsibility select from mei-friend settings to markup tools.
- Complete translations and tooltips for markup tools.
- Fix generation of new xml:ids to copied elements.
- Add resp label to markup items within list tab in Enrichment Panel.
- Add 'Describe Markup' button to markup list items.
- Improve sorting of list items in Enrichment Panel's List tab.
- Refresh list items on language change.

### 1.1.3 <choice>

- Add choice element to markup tools.

- Add choice select to switch versions visible in the notation panel.
- Add logic to handle markup for alternative versions.

### 1.1.2 Enrichment Panel

- Annotation panel has been refactored to Enrichment panel.
- List tab in the Enrichment panel now shows annotations and markup.
- Markup menu has been moved to new markup tools tab in the Enrichment Panel.

### 1.1.1 Basic integration of Editorial Markup

- Add support for markup elements: unclear, sic, corr, orig, reg, add, del.
- Markup elements wrap multiple adjacent elements.
- Add warning modal if missing xml:ids would affect markup creation.
- Add settings to change highighting colors for markup elements.
- Change option labels in responsibility select to text content.

### 1.0.17 Refactor and extend git functionality

- Migrate from jsgit to isomorphic-git
- Implement branching-on-conflict and automatic pull requests to improve safe collaborative editing
- Prepare for future implementation of non-GitHub cloud providers

### 1.0.16 Patch 
* Fix infinite loop when having an incomplete choice element (#109, thx [@maxrothman](https://github.com/maxrothman))
* Implement persistent search bar behavior (#110, thx [@maxrothman](https://github.com/maxrothman)) with checkbox to toggle
* Update Verovio release version list

### 1.0.15 Patch

- Add support for new languages (Bosnian, Chinese, Croatian, Danish, Dutch, Serbian)
- Fix bug preventing file load from GitHub with whitespace sequences in filenames (#95, thx [@maxrothman](https://github.com/maxrothman))

### 1.0.14 Patch (released on 23 May 2024 for JOSS publication https://doi.org/10.21105/joss.06002)

- Update path for matomo usage statics
- Add Verovio release 4.2.0 to toolkit list
- Secure facsimile image drawing, addressing #100
- Add git hook to run Playwright tests before pushes to publicly hosted branches (see INSTALL.md)
- Make sure a facsimile source image is always shown when solely referenced by pb elements

### 1.0.13 Support for multiple facsimile source images

- Add support for displaying multiple source image files referenced in the @facs attributes of the notation displayed (#94). Thus, when selecting `@breaks=none`, all source images referenced in the facsimile element will be shown in the facsimile panel.
- Settings item added to control display of source image title
- Confirm button of splash screen now in focus by default, so it can be clicked by keyboard swiftly
- Clicking on notation elements or facsimile zones will scroll to the corresponding element in the other panels (encoding, facsimile, notation)

### 1.0.12 patch

- Add PlayWright end-to-end tests for the main functionality of mei-friend

### 1.0.11 patch

- Extend documentation with a new file `CONTRIBUTING.md` to provide guidelines for contributing to mei-friend
- Update external documentation pages at https://mei-friend.github.io including updated installation instructions,
  information on the code structure, and an updated page on contributing to mei-friend
- Fix bug when loading facsimile source images from URLs starting with raw.githubusercontent (#93)

### 1.0.10 patch

- Scroll to facsimile image zones corresponding to selected element in editor or notation
- Make sure zone element edits are reloaded and redrawn in facsimile panel
- Drawing new zones in non-fullpage mode corrected for Firefox and other browsers
- New zones remain selected after insertion
- Clicking on elements with `@facs` attribute will highlight linked zone also in zone edit mode

### 1.0.9 patch

- Facsimile panel GUI elements update local storage
- Verovio settings retrieved from local storage

### 1.0.8 patch (released on 21 Jan 2024)

- Handle facsimile graphics path correctly in GitHub repos with subdirectories
- Optimize facsimile redrawing after editing the encoding
- Polish facsimile updating and size handling

### 1.0.7 patch (released on 16 Jan 2024)

- Fix for issue #76 removing `SHIFT + R` as keyboard shortcut for testing measure renumbering, but allowing to enter an upper-case `R`.
- Small language fixes in DE, PO, and EO.

### 1.0.6 patch (released on 20 Dec 2023)

- Key signature information is taken into account, when shifting pitch of a note (#38)
- Several navigation keyboard shortcuts removed from encoding panel (#66)
- Bug fix for #73 to correctly handle unknown language code
- Transparently open and convert Fronimo lute tablature format using luteconv-webui

### 1.0.5 patch

- Add Ukrainian and Esperanto language packs (still to be proof-read)
- Keyboard shortcut (`SHIFT + SPACE`) to switch focus between notation and encoding panel (#55)
- Keyboard shortcut (`N`) to duplicate a selected chord, note or rest, or insert a new note into an empty layer (#57)
- Keyboard shortcut (`SHIFT + N`) to convert selected notes to rests and rests to notes (#57)
- Keyboard shortcut (`.`) to add or remove `dots="1"` to notes, chords, etc.
- Keyboard shortcut (`C`) to embed selected notes inside a new chord element, and vice versa (remove chord and leave notes)
- Misleading warning when clicking on elements without ID fixed (#52)

### 1.0.4 patch

- Tweak CSS select and translations (German)
- Fix typo at forking via URL parameters

### 1.0.3 patch (released 1 Nov 2023)

- Enable navigation link to generated MAO objects (identify object annotations)

### 1.0.2 Splash screen (released 3 Oct 2023)

- Add splash screen on application load explaining data storage (#41)
- Fix bug when drag-selected elements contain non-note elements and blocked inserting control elements on them (such as slurs) (#48)
- Support for @meter.sym/@sym information (#49). No slur (spanning element) inserted when on same time stamps.
- Support keyboard shortcuts (with os-dependent modifier keys) in encoding editor (#50)
- Show warning message when clicking on or drag-selecting elements without xml:ids (#10)
- Drag'n'drop on CodeMirror editor now shows drag overlay screen
- Take language from browser locale

### 1.0.1 patch

- Reduce mei-friend-specific Verovio defaults
- Add auto-translated draft of Japanese language pack
- Add keyboard shortcuts to editor for saving, loading and printing files
- Generate URL with all available parameters and lower precision
- Fix for facsimile images not loading without zone elements (#45)
- Fix bug when modified MEI encoding was not restored from local storage when working from GitHub
- Always show validation report upon manual validation, but not during auto validation

## 1.0.0 Version 1.0 (released 4 September 2023)

- Delete notes, chords, rests (together with enclosing elements such as beams, tuplets, as well as elements pointing towards them, such as a slur through `@startid` or `@endid`) (#37)
- Move notes in pitch chromatically (`SHIFT + UP/DOWN`) with adding sharps when going upwards and flats when going downwards (enhancement #36)
- Provide menu items and keyboard shortcuts to insert accidentals (+, -, =) (feature request #35)
- Fix bug that prevented encoded @color to be shown (#34)
- Fix bug that prevented MEI and SVG download in Safari (#33)
- Implement loading of Web Annotations using DataCatalog discovery model

### 0.10.4

- Add UI panel inside editor panel to check and interactively fix all occurrences of @accid.ges against key signature, measure-wise accids, ties, and redundant information.
- Settings checkbox for enabling automatic display of validation report (off by default)
- Update data model for stand-off annotation discovery service to use schema.org DataCatalogs / Datasets

### 0.10.3 Expansion support for MIDI playback

- Add drop-down GUI element to MIDI toolbar to select expansion element from encoding
- Support for MIDI playback of selected expansion element (for handling repeated sections)
- Improved MIDI playback handling in the background
- MIDI toolbar disappears when editing encoding

### 0.10.2

- Improve UI around Solid handleIncomingRedirect
- Provide translations for Solid UI
- Set cursor position to matching tag name in editor
- Add auto-translated draft of Polish language pack
- Bug that did not show elements within a choice in speed mode fixed

### 0.10.1

- Fix contextual enabling / disabling of stand-off annotation interface
- Improve responsiveness of polling for GitHub Action Workflow outcomes

### 0.10.0-p

- Patch gunicorn logging config

### 0.10.0 Solid integration and Music Annotation Ontology support

- Enable log-in to Solid Pod
- Allow creation of Music Annotation Ontology objects in response to selections

### 0.9.1 patch

- Fix bug with undefined lang variable under Safari (addresses #25)

### 0.9.0 GitHub Actions integration (release 2 July 2023)

- Configurably display any GitHub Actions (dispatch workflows) available in the current repository / branch
- List any configured inputs and set values from UI with shortcuts for 'current filepath' and 'current selection'
- Launch Actions (dispatch) workflows from within mei-friend
- Display workflow results (success / failure), with link to detailed GitHub page
- On success, reload encoding to update with Actions-modified version

### 0.8.11 Editor functionality

- Surround selection in editor with tags (`CTRL-E` or `CMD-E`): opens a user interface to enter tag name
- `CTRL-/` or `CMD-/` surrounds selection in editor with previously selected tag name
- When editing a tag name in editor (both starting or ending tag), matching tag will be modified accordingly
- Link to new documentation pages at https://mei-friend.github.io from help menu

### 0.8.10 Internationalization

- Multi-language support with separate language pack files per language
- Language packs currently available for English and German, more language packs to come
- First draft of spanish, italian, french, and catalan language pack
- Automatic test to check for key identity and completeness of language packs
- Remove transposeTosoundingPitch default flag for Verovio
- Fix #21 spanning elements with mixed `@startid/@endid` and `@tstamp/@tstamp2` attributes

### 0.8.9 patch

- Fix bug when notation zooming resulted in missing notation when MIDI manu bar is activated

### 0.8.8 patch

- Control display of zone bounding boxes through checkbox
- Menu item to generate mei-friend URL with all search parameters deviating from default values
- Use same generate URL feature to build a full backlink with params for 'Report issue with encoding'
- Code refactoring with separate defaults.js file

### 0.8.7 transposition (release 27 Mar 2023)

- Add transposition settings panel to the mei-friend settings to specify transposition by key, by interval, and pitch direction.
- Enable ?file= param to open files from private repos (when logged in)
- Add "Report issue with encoding" feature (creates issue with reciprocal mei-friend link)

### 0.8.6 patch

- Insert control elements with time stamps (`@tstamp`/`tstamp2`) instead of ids (`startid`/`endid`) by using the `ALT` (Mac: `CTRL`) modifier key with keyboard shortcut
- Check time stamps when inserting control elements, handle selected elements on the same time stamp correctly (by omitting `@tstamp2`) or throw warning, if no fix is possible
- Fix between placement (`SHIFT + X`) with control elements without `@startid`.
- Various GitHub fixes, incl. loading compressed MusicXML via Git
- Unselect element(s) when `CTRL/CMD` clicking or drag-selecting already selected element(s)
- `SHIFT LEFT/RIGHT` de/increases duration (`@dur`) of selected element(s), if they have such attribute

### 0.8.5 PDF export

- Preview PDF mode with page-view of notation, triggered via menu item or `CMD/CTRL + P`
- PDF preview with click-select and drag-select disabled
- Page range selector for selecting all, current, page range, or individual pages (e.g., 2,5-8)
- Download PDF file (with pages as selected in page-range settings)

### 0.8.4 patch (release 1 Mar 2023)

- Drag-select and click-select chord instead of note with `ALT` modifier
- Add `@staff` to clef change element
- Change of keyboard shortcuts (for inserting C clef, tenuto, spiccato)

### 0.8.3 patch

- Show modifyer keys as text (ALT, CTRL...) on Windows/Linux systems
- Insert `arpeg` with `@order="up"` per default (or `@order="down"` with `CTRL + A`)
- Insert control elements with @staff attribute of selected elements (fix for #12)
- Fix trailing space in `arpeg@plist`(fix for #13)
- Support for inserting supplied elements around artic/accid attributes (that get converted to elements) (fix for #14)
- Support for inserting supplied elements around artic/accid child elements of selected elements
- Do not save and insert slur below with `CTRL + S` on Windows/Linux (fix for #15)
- Support for `@place="between"` on control elements (fix for #16)
- Several improvements and harmonization in editor code
- Change keyboard shortcut for tenuto to `SHIFT + E`
- Insert control elements without placement by default
- Remove `CTRL + ` for inserting control elements below
- On multiple selected elements, insert pedal up on first and pedal down on last

### 0.8.2 patch

- Fixes to highlight synchronization edge-cases caused by rounding issues
- Implement MIDI playback shortcut (bubble) to open control bar and start playback immediately
- Implement space-bar and esc keyboard shortcuts
- Implement close button on control bar
- Improve highlighting after page turn
- Re-render MIDI after Verovio MIDI options change (or when default button clicked)
- Unhighlight notes before rests

### 0.8.1 patch

- Support automatic scroll-following of midi playback (feature request by [@annplaksin](https://github.com/annplaksin))
- Improve scroll-to-element behavior (during playback and navigation)

## 0.8.0 MIDI playback

- Add MIDI playback control bar and settings
- Implement playback using html-midi-player
- Support configurable automatic page-following during playback
- Support configurable highlighting of currently-sounding notes
- Modification to getPageWithElement to work with and without speed mode
- Modularise and adapt left footer message

### 0.7.1

- Adding and removing xml:ids to and from encoding done natively inside mei-friend
- Bug fixes: Reduce processing time while indenting code; sync tabSize & indentUnit
- Skip git branch selection when only one branch exists in repository

## 0.7.0 Complete speed mode improvements

- Support for time-spanning elements with `@startid/endid` that start before and end after current page (thus, spanning across current page)
- Support for time-spanning elements with `@tstamp/tstamp2` attributes, starting or ending on current page as well as those spanning across current page (start before and end afterwards)
- Download current speed mode page triple (current page with a dummy page before and after, normally not shown) with `CTRL-SHIFT-S` (or on MacOS `CMD-SHIFT-S`)

### 0.6.9 patch

- Settings item for selecting different xml:id styles of newly inserted elements
- Insert application statement with name, version, and date information
- Settings checkbox for managing application statement insertion
- Flag user that they are still logged in to GitHub (due to OAuth) when logging out of mei-friend
- Fix for `#9` to correctly handle breaks within endings in speed mode

### 0.6.8 patch: enhance facsimile functionality

- Support for inserting facsimile element with `pb@facs` references to new surface elements
- Support for displaying empty surface images
- Support for inserting zones on empty surface on selected elements (creating `@facs` attribute on all att.facsimile elements supported by Verovio)
- Support for inserting zones with parallel insertion of measure element (`CMD/CTRL`+`click`)
- Support for deleting zones with (`CMD/CTRL`+`DELETE`) or without (`DELETE`) removing pointing elements
- Menu item for smart indenting encoding
- Typescript checks, refactoring and documentation of speed mode (thanks to [@th-we](https://github.com/th-we))

### 0.6.7 patch: facsimile panel re-organisation

- Facsimile panel with separate control menu
- Resizing of facsimile panel via mouse drag
- Intuitive (kebab/burger) icon on both resizers to enhance GUI affordance
- When facsimile element present/absent, facsimile panel automatically shown/hidden and facsimile settings details opened/folded away
- Notation and facsimile orientation and proportion values as URL parameters and in local storage
- Verovio icon (activity status) moved to beginning of notation control menu

### 0.6.6 patch: small fixes and refinements (26 Oct 2022)

- Correctly reset GitHub menu when switching to local file (via menu or drag'n'drop)
- Make filename in file status display editable when working locally
- Make undo and redo graphically available via `Code` menu

### 0.6.5 patch: code refinements

- Show link to changelog to the branch corresponding to `env`
- Reduce verbosity and fix small glitches
- Extended annotations configurability, gracefully handle large amounts of annot elements

### 0.6.4 patch: display schema info

- Display warning message in Safari for missing validation support
- Introduce some Safari tweaks (logos in png)
- During drag-select, editor follows the element closest to cursor
- Update Verovio release version list to include release 3.12.0

### 0.6.3 patch: display schema info

- Display schema info before file name
- Automatically load schema from provided `@meiversion` attribute, when no schema is given in <xml-model>
- Filter settings through text input panel (incl. settings refactoring)
- Annotation list layout fixes
- Support autoValidate (true|false) as URL parameter

### 0.6.2 patch: small bug fixes

- Bugfix: create valid `<ptr/>` objects for linking annotations
- Bugfix: guard against edge-cases when switching vrvTk versions

### 0.6.1 Verovio toolkit version selection

- Added Verovio toolkit versions before 3.11.0 with warning for a refresh upon memory slip.
- Bugfix: ensure `<annot>`s are generated in a valid location within the MEI

## 0.6.0 XML code validation (based on Laurent Pugin's code from the Verovio editor and Gnome xmllint)

- Automatically derive schema URL from MEI (upon each text change)
- Fetch (new) schema and load it both for code completion and schema validation
- Automatically validate MEI encoding upon text change
- Checkbox added to set validation mode to manual
- UI elements for displaying validation status and report
- Click and key handlers for showing/hiding report and initiating validation
- Selector to change Verovio toolkit version (develop, latest, specific versions 3.11.0 and up)
- Bugfix: make annotation page numbers work in annotation panel when not in speed mode

### 0.5.2 patch: small bug fixes

- Add chord to beamSpan when notes are selected
- Fix font selector

### 0.5.1 patch: forkAndOpen

- Implement 'fork' parameter that directs user to fork and open raw github resources specified via 'file' param

## 0.5.0: Support for source image display

- Parsing facsimile information and display source image zones
- Providing options to activate, position, resize and zoom source image pane
- Full-page option to show entire source page with zone bounding boxes
- Option to edit zone coordinates (rather than displaying linked elements, e.g., measures)
- Support for selecting zone with mouse or through encoding
- Support for resizing selected zone at 8 locations and pan with mouse drag
- Support for inserting new zone/measure with mouse click and drag
- Support for deleting selected zone/measure with DEL key or through menu
- Menu item to ingest facsimile information to MEI file (assuming measure@n equality among target and skeleton file)
- General alert panel added with 'error', 'warning', 'info', and 'success' as levels
- Source images loaded locally, from URL origin, or directly from github

## 0.4.0: Initial support for annotations

- Implement annotation panel (activate from mei-friend settings)
- Annotation tools for highlight, describe, link
- Reading and writing of `<annot>` elements
- Listing of annotations in annotation panel
- Loading and interpreting simple Web Annotations

### 0.3.13 patch: hotfix

- Filter comment nodes in speed mode

### 0.3.12 patch: Settings improvements

- Address page processing bug with page/system beginnings inside apparatus element
- Make font select appear in Verovio options
- Control visibility of font select, update controls, navigation arrows
  in control menu through mei-friend settings pane
- Control measure renumbering behavior across endings through mei-friend settings pane
- Add demo animated GIFs to README.md

### 0.3.11 patch:

- Tooltips displayed as html title attributes
- Clean control menu appearance
- Track deployment environment and add use warning to 'staging' environment

### 0.3.10 patch: URL parameters and GitHub improvements

- Some update call optimizations
- Support for `breaks`, `select`, `page`, and `speed` as additional URL parameters
- Support for all URL parameters to be stored to and retrieved from local storage
- Support for file renaming (new file creation) with Github commit UI
- Automatically propose renaming for converted encodings
- Implement GitHub issue reporting features

### 0.3.9 patch: Public repertoire

- Introduce CSV file listing public MEI repertoire (patches welcome!)
- Add mechanisms to access this repertoire, via fork or via Open URL
- Add 'Public repertoire' menu point as an alternate entry route for Open URL
- Fix bug that was preventing initial fork attempts from displaying success

### 0.3.8 patch: Github fixes and improvements

- Refactor writing to github, fixing write-to-subdirectory in the process
- Github menu navigation fixes
- Fallback to login name when username unavailable for commits
- Implement handleEncoding pipeline when reading from Github
- Upgrade Python Authlib dependency to fix OAuth CSRF issue

### 0.3.7 patch

- Address issue with ALT-F interfering with EMACS keymap
- Support for drag-selecting different element categories with mouse
- Added edit dropdown menu for search/replace/jump-to-line functionality

### 0.3.6 patch: mei-friend settings and new functionality

- Support for surrounding selected elements with a `supplied` element
- Settings to control supplied element display, color, and responsibility statement
- Support to insert vertical group attributes to selected elements (automatically finding unused vgrp value on page)
- Support for inserting, inverting and deleting beamSpan elements

### 0.3.5 patch: Dark mode support

- mei-friend appearance matches the selected theme
- Option to enable notation to match editor theme colors
- Theme changes automatically upon OS appearance change (e.g., from bright to dark) when in default theme

### 0.3.4 patch: Settings panel

- Settings panel supporting the majority of Verovio options
- Settings panel supporting CodeMirror options

### 0.3.3 patch

- Add 'Show MEI Guidelines' in Help menu
- Implement 'Consult Guidelines' feature ('alt-.')

### 0.3.2 patch: Accelerating speed mode

- Accelerate speed mode using tXml in a separate worker for pre-computing time-spanning elements with @startid/@endid attributes
- Support for toggling _spiccato_ articulation with Shift+P

### 0.3.1 patch

- Implement fork repository functionality
- Support for `file`, `orientation`, and `scale` as URL parameters

## 0.3.0 minor: Autocompletion (first release 28 Jan 2022)

- Incorporate CodeMirror's hint addons (show-hint, xml-hint)
- Implement context-sensitive autocompletion
- Supply mei-CMN and mei-all 4.0.1 RNGs as schemaInfo objects
- Remember orientation upon refresh in local storage

### 0.2.6 patch

- Set breaks to 'line' when sb/pb elements found in encoding, to 'auto' otherwise
- CodeMirror stays focussed after cursor activity

### 0.2.5 patch

- Refactor local storage handling
- Implement storage override where filesizes exceed storage quota

### 0.2.4 patch

- Implement "Reset to default" feature (in Help menu)
- Improved error reporting from worker with incomplete MEI files
- WoO 70 as default piece
- Small bug fixes (correct page counting with <incip> data)

### 0.2.3 patch

- Support CodeMirror search/replace etc functionality

### 0.2.2 patch

- Fix regression error where storage was ignored on vrvLoaded
- Fix Github menu navigation issue causing empty repo list in certain conditions
- Move OpenUrl functionality into a new modal display
- Support multiple encoding formats at openURL

### 0.2.1 patch: Local storage support

- Implement local storage for files and github credentials
- Improve Flask routing, add session storage
- Implement file status and change tracking
- Implement OpenUrl function

## 0.2.0 minor: Speed mode support

- Support for speed mode to be en/disabled through checkbox
- Speed mode support also for breaks='auto|smart' by computing breaks upon loading
- Quick first page view when opening file in speed mode with automatic breaks
- Verovio icon animation during worker activity
- Center selected elements in editor upon notation click
- Shift pitch of notes/rests inside selected parent elements (e.g., beams)
- Insert G/F/C clef change before/after selected element
- Clef change on selected note inserted before/after chord element
- Center SVG to selected element upon cursor activity
- Activate fold gutters in editor
- Allow page numbers to be entered manually at mei-friend control menu

### 0.1.5 patch

- Fix github commit behaviour

### 0.1.4 patch

- Verovio label removed and speed mode checkbox added (still disabled)
- Some editor code optimizations
- Open and download keyboard shortcuts added
- Incorporate new .env variables for production deployment
- Bug-fixes and layout improvements for Github menu
- Add cute Github loading indicator animation

### 0.1.3 patch

- Fix commit message and button clicking-interaction behaviour with menu

### 0.1.2 patch

- Inverting fermata changes form
- Re-render MEI without xml:id option

### 0.1.1 patch: Add menu items

- Add menu items
- Support for downloading MEI, SVG, MIDI
- Some editor improvements
- Github menu moved to be first, styling improved

## 0.1.0 minor: Support for GitHub integration

- Add in Github menu
- Allow user login to Github via OAuth
- List user repositories
- List repository branches
- List branch files
- Allow navigation of branch files
- Load encoding file from branch
- Author commit message and commit changes

### 0.0.9 patch: Help added

- Help page added and linked

### 0.0.8 patch: Editor functionality added

- Adding/deleting control elements
- Support for inverting placement (X)
- Support for toggling articulations (SHIFT + S, V, I, N, O)
- Support for shifting pitch up/down step-wise, octave-wise
- Support for moving notes/elements across staves
- Support for adding and deleting octave elements
- Support for update encoding through Verovio
- Support for inserting and deleting beam elements
- Support for cleaning accid.ges attributes
- Support for renumbering measures
- Tooltips activated
- Menu bar behavior changed to match MacOS conventions

### 0.0.7 patch

- Listen to changes in editor and update notation
- Flip to page buttons
- Update notation buttons

### 0.0.6 patch

- Re-load bug
- Set orientation with resizing
- Zoom slider with layout reflow

### 0.0.5 patch

- First note highlighting, layout beautifications
- Support for key maps
- Support for mouse wheel scrolling

### 0.0.4 patch

- Complete re-organisation of worker logic (patched instead of spaghetti)

### 0.0.3 patch

- functionality added to control menu: zooming, page turning, navigation

### 0.0.2 patch

- toolkit loaded from verovio.org
- control menu bar added

## develop release

- Initial commits for testing
