# mei-friend-online CHANGELOG.md

### 0.6.4 patch: display schema info
* Update Verovio release version list to include release 3.12.0
### 0.6.3 patch: display schema info
* Display schema info before file name
* Automatically load schema from provided `@meiversion` attribute, when no schema is given in <xml-model>
* Filter settings through text input panel (incl. settings refactoring)
* Annotation list layout fixes
* Support autoValidate (true|false) as URL parameter
### 0.6.2 patch: small bug fixes
* Bugfix: create valid <ptr/> objects for linking annotations
* Bugfix: guard against edge-cases when switching vrvTk versions
### 0.6.1 Verovio toolkit version selection
* Added Verovio toolkit versions before 3.11.0 with warning for a refresh upon memory slip.
* Bugfix: ensure <annot>s are generated in a valid location within the MEI
### 0.6.0 XML code validation (based on Laurent Pugin's code from the Verovio editor)
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
### 0.5.0: Support for source image display
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
### 0.4.0: Initial support for annotations
* Implement annotation panel (activate from mei-friend settings)
* Annotation tools for highlight, describe, link 
* Reading and writing of <annot> elements
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
* Accelerate speedMode using tXml in a separate worker for pre-computing time-spanning elements with @startid/@endid attributes
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
* Support for speedMode to be en/disabled through checkbox
* SpeedMode support also for breaks='auto|smart' by computing breaks upon loading
* Quick first page view when opening file in speedMode with automatic breaks
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
* Verovio label removed and speedmode checkbox added (still disabled)
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
