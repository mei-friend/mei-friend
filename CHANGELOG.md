# mei-friend-online CHANGELOG.md

### 0.3.12 patch: Settings improvements
* Address page processing bug with page/system beginnings inside apparatus element
* Make font select appear in Verovio options
* Control visibility of font select, update controls, navigation arrows
in control menu through mei-friend settings pane
* Control measure renumbering behavior across endings through mei-friend settings pane
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
