# mei-friend-online CHANGELOG.md
### 0.8.6 patch
* Insert control elements with time stamps (`@tstamp`/`tstamp2`) instead of ids (`startid`/`endid`) through `ALT` (Mac: `CTRL`) modifier key
* Check time stamps when inserting control elements, handle elements on the same time stamp correctly and throw warning (e.g., for slur, tie)
* Fix between placement (`SHIFT + X`) with control elements without `@startid`. 
* Various GitHub fixes, incl. loading compressed MusicXML via Git
* Unselect element(s) when `CTRL/CMD` clicking or drag-selecting already selected element(s)
* `SHIFT LEFT/RIGHT` de/increases duration (`@dur`) of selected element(s), if they have such attribute

### 0.8.5 PDF export
* Preview PDF mode with page-view of notation, triggered via menu item or `CMD/CTRL + P`
* PDF preview with click-select and drag-select disabled
* Page range selector for selecting all, current, page range, or individual pages (e.g., 2,5-8)
* Download PDF file (with pages as selected in page-range settings)

### 0.8.4 patch
* Drag-select chord instead of note with `ALT`
* Add @staff to clef change element
* Change of keyboard shortcuts (for inserting C clef, tenuto, spiccato)
### 0.8.3 patch
* Show modifyer keys as text (ALT, CTRL...) on Windows/Linux systems
* Insert `arpeg` with `@order="up"` per default (or `@order="down"` with `CTRL + A`)
* Insert control elements with @staff attribute of selected elements (fix for #12)
* Fix trailing space in `arpeg@plist`(fix for #13)
* Support for inserting supplied elements around artic/accid attributes (that get converted to elements) (fix for #14)
* Support for inserting supplied elements around artic/accid child elements of selected elements
* Do not save and insert slur below with `CTRL + S` on Windows/Linux (fix for #15)
* Support for `@place="between"` on control elements (fix for #16)
* Several improvements and harmonization in editor code
* Change keyboard shortcut for tenuto to `SHIFT + E`
* Insert control elements without placement by default
* Remove `CTRL + ` for inserting control elements below
* On multiple selected elements, insert pedal up on first and pedal down on last 
### 0.8.2 patch
* Fixes to highlight synchronization edge-cases caused by rounding issues
* Implement MIDI playback shortcut (bubble) to open control bar and start playback immediately
* Implement space-bar and esc keyboard shortcuts
* Implement close button on control bar
* Improve highlighting after page turn
* Re-render MIDI after Verovio MIDI options change (or when default button clicked)
* Unhighlight notes before rests
### 0.8.1 patch
* Support automatic scroll-following of midi playback (feature request by @annplaksin)
* Improve scroll-to-element behavior (during playback and navigation)
## 0.8.0 MIDI playback
* Add MIDI playback control bar and settings
* Implement playback using html-midi-player
* Support configurable automatic page-following during playback
* Support configurable highlighting of currently-sounding notes
* Modification to getPageWithElement to work with and without speed mode
* Modularise and adapt left footer message
### 0.7.1
* Adding and removing xml:ids to and from encoding done natively inside mei-friend
* Bug fixes: Reduce processing time while indenting code; sync tabSize & indentUnit
* Skip git branch selection when only one branch exists in repository
## 0.7.0 Complete speed mode improvements
* Support for time-spanning elements with `@startid/endid` that start before and end after current page (thus, spanning across current page)
* Support for time-spanning elements with `@tstamp/tstamp2` attributes, starting or ending on current page as well as those spanning across current page (start before and end afterwards)
* Download current speed mode page triple (current page with a dummy page before and after, normally not shown) with `CTRL-SHIFT-S` (or on MacOS `CMD-SHIFT-S`)
### 0.6.9 patch
* Settings item for selecting different xml:id styles of newly inserted elements
* Insert application statement with name, version, and date information
* Settings checkbox for managing application statement insertion
* Flag user that they are still logged in to GitHub (due to OAuth) when logging out of mei-friend
* Fix for `#9` to correctly handle breaks within endings in speed mode
### 0.6.8 patch: enhance facsimile functionality
* Support for inserting facsimile element with `pb@facs` references to new surface elements
* Support for displaying empty surface images
* Support for inserting zones on empty surface on selected elements (creating `@facs` attribute on all att.facsimile elements supported by Verovio)
* Support for inserting zones with parallel insertion of measure element (`CMD/CTRL`+`click`)
* Support for deleting zones with (`CMD/CTRL`+`DELETE`) or without (`DELETE`) removing pointing elements
* Menu item for smart indenting encoding
* Typescript checks, refactoring and documentation of speed mode (thanks to @th-we)
### 0.6.7 patch: facsimile panel re-organisation
* Facsimile panel with separate control menu
* Resizing of facsimile panel via mouse drag
* Intuitive (kebab/burger) icon on both resizers to enhance GUI affordance
* When facsimile element present/absent, facsimile panel automatically shown/hidden and facsimile settings details opened/folded away
* Notation and facsimile orientation and proportion values as URL parameters and in local storage
* Verovio icon (activity status) moved to beginning of notation control menu
### 0.6.6 patch: small fixes and refinements
* Correctly reset GitHub menu when switching to local file (via menu or drag'n'drop)
* Make filename in file status display editable when working locally
* Make undo and redo graphically available via `Code` menu
### 0.6.5 patch: code refinements
* Show link to changelog to the branch corresponding to `env`
* Reduce verbosity and fix small glitches
* Extended annotations configurability, gracefully handle large amounts of annot elements
### 0.6.4 patch: display schema info
* Display warning message in Safari for missing validation support
* Introduce some Safari tweaks (logos in png)
* During drag-select, editor follows the element closest to cursor
* Update Verovio release version list to include release 3.12.0
### 0.6.3 patch: display schema info
* Display schema info before file name
* Automatically load schema from provided `@meiversion` attribute, when no schema is given in <xml-model>
* Filter settings through text input panel (incl. settings refactoring)
* Annotation list layout fixes
* Support autoValidate (true|false) as URL parameter
### 0.6.2 patch: small bug fixes
* Bugfix: create valid `<ptr/>` objects for linking annotations
* Bugfix: guard against edge-cases when switching vrvTk versions
### 0.6.1 Verovio toolkit version selection
* Added Verovio toolkit versions before 3.11.0 with warning for a refresh upon memory slip.
* Bugfix: ensure `<annot>`s are generated in a valid location within the MEI

## 0.6.0 XML code validation (based on Laurent Pugin's code from the Verovio editor and Gnome xmllint)
* Automatically derive schema URL from MEI (upon each text change)
* Fetch (new) schema and load it both for code completion and schema validation
* Automatically validate MEI encoding upon text change
* Checkbox added to set validation mode to manual
* UI elements for displaying validation status and report
* Click and key handlers for showing/hiding report and initiating validation
* Selector to change Verovio toolkit version (develop, latest, specific versions 3.11.0 and up)
* Bugfix: make annotation page numbers work in annotation panel when not in speed mode
### 0.5.2 patch: small bug fixes
* Add chord to beamSpan when notes are selected
* Fix font selector
### 0.5.1 patch: forkAndOpen
* Implement 'fork' parameter that directs user to fork and open raw github resources specified via 'file' param

## 0.5.0: Support for source image display
* Parsing facsimile information and display source image zones
* Providing options to activate, position, resize and zoom source image pane
* Full-page option to show entire source page with zone bounding boxes
* Option to edit zone coordinates (rather than displaying linked elements, e.g., measures)
* Support for selecting zone with mouse or through encoding
* Support for resizing selected zone at 8 locations and pan with mouse drag  
* Support for inserting new zone/measure with mouse click and drag
* Support for deleting selected zone/measure with DEL key or through menu
* Menu item to ingest facsimile information to MEI file (assuming measure@n equality among target and skeleton file)
* General alert panel added with 'error', 'warning', 'info', and 'success' as levels
* Source images loaded locally, from URL origin, or directly from github
## 0.4.0: Initial support for annotations
* Implement annotation panel (activate from mei-friend settings)
* Annotation tools for highlight, describe, link 
* Reading and writing of `<annot>` elements
* Listing of annotations in annotation panel
* Loading and interpreting simple Web Annotations
### 0.3.13 patch: hotfix
* Filter comment nodes in speed mode
### 0.3.12 patch: Settings improvements
* Address page processing bug with page/system beginnings inside apparatus element
* Make font select appear in Verovio options
* Control visibility of font select, update controls, navigation arrows
in control menu through mei-friend settings pane
* Control measure renumbering behavior across endings through mei-friend settings pane
* Add demo animated GIFs to README.md
### 0.3.11 patch:
* Tooltips displayed as html title attributes
* Clean control menu appearance
* Track deployment environment and add use warning to 'staging' environment
### 0.3.10 patch: URL parameters and GitHub improvements
* Some update call optimizations
* Support for `breaks`, `select`, `page`, and `speed` as additional URL parameters
* Support for all URL parameters to be stored to and retrieved from local storage
* Support for file renaming (new file creation) with Github commit UI
* Automatically propose renaming for converted encodings
* Implement GitHub issue reporting features
### 0.3.9 patch: Public repertoire
* Introduce CSV file listing public MEI repertoire (patches welcome!)
* Add mechanisms to access this repertoire, via fork or via Open URL
* Add 'Public repertoire' menu point as an alternate entry route for Open URL
* Fix bug that was preventing initial fork attempts from displaying success
### 0.3.8 patch: Github fixes and improvements
* Refactor writing to github, fixing write-to-subdirectory in the process
* Github menu navigation fixes
* Fallback to login name when username unavailable for commits
* Implement handleEncoding pipeline when reading from Github
* Upgrade Python Authlib dependency to fix OAuth CSRF issue
### 0.3.7 patch
* Address issue with ALT-F interfering with EMACS keymap
* Support for drag-selecting different element categories with mouse
* Added edit dropdown menu for search/replace/jump-to-line functionality
### 0.3.6 patch: mei-friend settings and new functionality
* Support for surrounding selected elements with a `supplied` element
* Settings to control supplied element display, color, and responsibility statement
* Support to insert vertical group attributes to selected elements (automatically finding unused vgrp value on page)
* Support for inserting, inverting and deleting beamSpan elements
### 0.3.5 patch: Dark mode support
* mei-friend appearance matches the selected theme
* Option to enable notation to match editor theme colors
* Theme changes automatically upon OS appearance change (e.g., from bright to dark) when in default theme
### 0.3.4 patch: Settings panel
* Settings panel supporting the majority of Verovio options
* Settings panel supporting CodeMirror options
### 0.3.3 patch
* Add 'Show MEI Guidelines' in Help menu
* Implement 'Consult Guidelines' feature ('alt-.')
### 0.3.2 patch: Accelerating speed mode
* Accelerate speed mode using tXml in a separate worker for pre-computing time-spanning elements with @startid/@endid attributes
* Support for toggling *spiccato* articulation with Shift+P
### 0.3.1 patch
* Implement fork repository functionality
* Support for `file`, `orientation`, and `scale` as URL parameters
## 0.3.0 minor: Autocompletion
* Incorporate CodeMirror's hint addons (show-hint, xml-hint)
* Implement context-sensitive autocompletion
* Supply mei-CMN and mei-all 4.0.1 RNGs as schemaInfo objects
* Remember orientation upon refresh in local storage
### 0.2.6 patch
* Set breaks to 'line' when sb/pb elements found in encoding, to 'auto' otherwise
* CodeMirror stays focussed after cursor activity
### 0.2.5 patch
* Refactor local storage handling
* Implement storage override where filesizes exceed storage quota
### 0.2.4 patch
* Implement "Reset to default" feature (in Help menu)
* Improved error reporting from worker with incomplete MEI files
* WoO 70 as default piece
* Small bug fixes (correct page counting with <incip> data)
### 0.2.3 patch
* Support CodeMirror search/replace etc functionality
### 0.2.2 patch
* Fix regression error where storage was ignored on vrvLoaded
* Fix Github menu navigation issue causing empty repo list in certain conditions
* Move OpenUrl functionality into a new modal display
* Support multiple encoding formats at openURL
### 0.2.1 patch: Local storage support
* Implement local storage for files and github credentials
* Improve Flask routing, add session storage
* Implement file status and change tracking
* Implement OpenUrl function
## 0.2.0 minor: Speed mode support
* Support for speed mode to be en/disabled through checkbox
* Speed mode support also for breaks='auto|smart' by computing breaks upon loading
* Quick first page view when opening file in speed mode with automatic breaks
* Verovio icon animation during worker activity
* Center selected elements in editor upon notation click
* Shift pitch of notes/rests inside selected parent elements (e.g., beams)
* Insert G/F/C clef change before/after selected element
* Clef change on selected note inserted before/after chord element
* Center SVG to selected element upon cursor activity
* Activate fold gutters in editor
* Allow page numbers to be entered manually at mei-friend control menu
### 0.1.5 patch
* Fix github commit behaviour
### 0.1.4 patch
* Verovio label removed and speed mode checkbox added (still disabled)
* Some editor code optimizations
* Open and download keyboard shortcuts added
* Incorporate new .env variables for production deployment
* Bug-fixes and layout improvements for Github menu
* Add cute Github loading indicator animation
### 0.1.3 patch
* Fix commit message and button clicking-interaction behaviour with menu
### 0.1.2 patch
* Inverting fermata changes form
* Re-render MEI without xml:id option
### 0.1.1 patch: Add menu items
* Add menu items
* Support for downloading MEI, SVG, MIDI
* Some editor improvements
* Github menu moved to be first, styling improved
## 0.1.0 minor: Support for GitHub integration
* Add in Github menu
* Allow user login to Github via OAuth
* List user repositories
* List repository branches
* List branch files
* Allow navigation of branch files
* Load encoding file from branch
* Author commit message and commit changes
### 0.0.9 patch: Help added
* Help page added and linked
### 0.0.8 patch: Editor functionality added
* Adding/deleting control elements
* Support for inverting placement (X)
* Support for toggling articulations (SHIFT + S, V, I, N, O)
* Support for shifting pitch up/down step-wise, octave-wise
* Support for moving notes/elements across staves
* Support for adding and deleting octave elements
* Support for update encoding through Verovio
* Support for inserting and deleting beam elements
* Support for cleaning accid.ges attributes
* Support for renumbering measures
* Tooltips activated
* Menu bar behavior changed to match MacOS conventions
### 0.0.7 patch
* Listen to changes in editor and update notation
* Flip to page buttons
* Update notation buttons
### 0.0.6 patch
* Re-load bug
* Set orientation with resizing
* Zoom slider with layout reflow
### 0.0.5 patch
* First note highlighting, layout beautifications
* Support for key maps
* Support for mouse wheel scrolling
### 0.0.4 patch
* Complete re-organisation of worker logic (patched instead of spaghetti)
### 0.0.3 patch
* functionality added to control menu: zooming, page turning, navigation
### 0.0.2 patch
* toolkit loaded from verovio.org
* control menu bar added
## develop release
* Initial commits for testing
