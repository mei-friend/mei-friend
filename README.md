<img src="https://raw.githubusercontent.com/Signature-Sound-Vienna/mei-friend-online/main/app/static/svg/menu-logo.svg" title="mei-friend" width="33%">

#  [The *mei-friend* Web Application: Editing MEI in the Browser](https://mei-friend.mdw.ac.at)

*mei-friend* is a ‘last mile’ editor for [MEI music encodings](https://music-encoding.org) intended to alleviate the common task of cleaning up encodings generated via optical music recognition, or via conversion from other formats, originally implemented as a [plugin package for the Atom text editor](https://atom.io/packages/mei-friend). The [*mei-friend* Web Application](https://mei-friend.mdw.ac.at) is a reworking of the tool as a full-featured, cross-browser compatible Web application, with optimised performance and an extended set of features. The application is available online at https://mei-friend.mdw.ac.at.

### Fundamental functionalities
![mei-friend fundamental functionalities](https://github.com/Signature-Sound-Vienna/mei-friend-online/blob/develop/demo/mei-friend-01.gif)


### Github workflow
![mei-friend github workflow](https://github.com/Signature-Sound-Vienna/mei-friend-online/blob/develop/demo/mei-friend-02.gif)

## Components
We use [CodeMirror](https://codemirror.net) as our text editor, and [Verovio](https://www.verovio.org) as our music engraving engine. [GitHub](https://github.org) integration is provided using [jsgit](https://github.com/creationix/jsgit), [jsgit-browser](https://github.com/LivelyKernel/js-git-browser), and the [GitHub REST API](https://docs.github.com/en/rest). XML-DOM manipulations are performed using [tXml](https://github.com/TobiasNickel/tXml).

## Features

**Editor**. The CodeMirror editor implements important coding conveniences including code folding, line numbering, tag- and bracket matching and auto-closing; as well as alternate key mappings (e.g., ‘vim’, ‘emacs’). MEI-schema-informed autocomplete is also available.

**File input and output**. Files may be opened from the local file system (via a menu option or using drag’n’drop); from the Web via URL; or from GitHub, by specifying a user/organisation and selecting from the available repositories. GitHub integration allows users to log in, fork repositories, view logs, and commit changes. All Verovio-supported encoding formats are supported (MEI, uncompressed and compressed MusicXML, Humdrum, ABC, PAE). The current encoding can be downloaded as MEI, MIDI, and SVG. All interactions occur locally in the browser; nothing is uploaded anywhere, excepting GitHub commits. Editor content is persisted in local storage through page refreshes and browser restarts; support for persisting multiple files simultaneously is envisioned for future development.

**Public repertoire**. Our codebase includes a CSV file recording publicly licensed music encodings, which are offered through the ‘fork repository’ and ‘open URL’ interfaces, alongside a dedicated ‘public repertoire’ access point. Proposed additions to this repertoire meeting our requirements (publicly licensed files; available via GitHub or hosted on a CORS-enabled Web server) are gladly accepted via Github Issue or Pull Request.
Configurable display. Many aspects of the tool’s interface are user-configurable, including the orientation and size of the notation and editor panes; their scale factor / font-size; and colouring, via a selection of preconfigured themes, with the option of having the notation match the editor theme (or remain black on white); and, optionally setting the interface to follow the local system’s bright / dark mode settings. Crucially, Eulise’s circadian rhythm adjusts accordingly. These configurations are done via a dedicated ‘settings’ menu, which also exposes a large collection of tool-specific options for CodeMirror and Verovio.

**Navigation**. The interface supports musically meaningful navigation according to encoded sections, pages (first, prev, next, last, specified page number), and within displayed notes/rests. Due to the tightly coupled interaction between encoding (MEI text) and engraving (SVG image), selection and navigation occurs seamlessly across both modalities.

**Pedagogy**. To smooth the learning curve of users new to MEI, the MEI Guidelines are linked to from the ‘Help’ menu; further, users are able to directly look up documentation for the currently selected element through a keyboard shortcut / help menu item.

**Editor functions**. In addition to all features of the Atom plugin package, we now offer commands to insert and delete clefs, beam-spans, and spiccato articulation; to insert the vertical group (vgrp) attribute for selected elements supporting this attribute (such as dynam, dir, hairpin), with dynamic number attribution; and, to insert the supplied element around a selection and show all supplied elements in a configurable colour.

## Publications
Goebl, W. & Weigl, D. M. (2021). Alleviating the Last Mile of Encoding: The mei-friend Package for the Atom Text Editor. Music Encoding Conference 2021. [forthcoming]

Goebl, W. & Weigl, D. M. (2022). The mei-friend Web Application: Editing MEI in the Browser. Music Encoding Conference 2022 [Late-breaking Reports]. [forthcoming].

## Acknowledgements

The *mei-friend* Web application is developed by [Werner Goebl](https://iwk.mdw.ac.at/werner-goebl) ([@wergo](https://github.com/wergo)) and [David M. Weigl](https://iwk.mdw.ac.at/david-weigl) ([@musicog](https://github.com/musicog)), [Department of Music Acoustics](https://iwk.mdw.ac.at), [mdw - University of Music and Performing Arts Vienna](https://mdw.ac.at). Development is undertaken as part of the [Signature Sound Vienna Project](https://iwk.mdw.ac.at/signature-sound-vienna). This research was funded by the [Austrian Science Fund (FWF)](https://fwf.ac.at) P 34664-G. The *mei-friend* Atom plugin package was developed as part of [TROMPA](https://trompamusic.eu) (Towards Richer Online Music Public-domain Archives), with funding from the [European Union's Horizon 2020 research and innovation programme](https://ec.europa.eu/info/research-and-innovation/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-2020_en) H2020-EU.3.6.3.1. under grant agreement No 770376.





## License
The *mei-friend* Web application is published under the [GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html) license.
