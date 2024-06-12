<img src="https://raw.githubusercontent.com/mei-friend/mei-friend/main/app/static/owl/menu-logo.svg" title="mei-friend" width="33%">

#  [The *mei-friend* Web Application: Editing MEI in the Browser](https://mei-friend.mdw.ac.at)

*mei-friend* is a ‘last mile’ editor for [MEI music encodings](https://music-encoding.org) intended to alleviate the common task of cleaning up encodings generated via optical music recognition, or via conversion from other formats, originally implemented as a [plugin package for the Atom text editor](https://atom.io/packages/mei-friend). The [*mei-friend* Web Application](https://mei-friend.mdw.ac.at) is a reworking of the tool as a full-featured, cross-browser compatible Web application, with optimised performance and an extended set of features. The application is available online at https://mei-friend.mdw.ac.at.

### Fundamental functionalities
![mei-friend fundamental functionalities](https://github.com/mei-friend/mei-friend/blob/develop/demo/mei-friend-01.gif)


### Github workflow
![mei-friend github workflow](https://github.com/mei-friend/mei-friend/blob/develop/demo/mei-friend-02.gif)

## Components
We use [CodeMirror](https://codemirror.net) as our text editor, and [Verovio](https://www.verovio.org) as our music engraving engine. [GitHub](https://github.org) integration is provided using [jsgit](https://github.com/creationix/jsgit), [jsgit-browser](https://github.com/LivelyKernel/js-git-browser), and the [GitHub REST API](https://docs.github.com/en/rest). XML-DOM manipulations are performed using [tXml](https://github.com/TobiasNickel/tXml) by Tobias Nickel. The MEI validation and RNG loading code is adapted from the implementation in the [Verovio editor](https://editor.verovio.org), kindly contributed by Laurent Pugin. It makes use of [libxml2](https://gitlab.gnome.org/GNOME/libxml2/). Lute tablature formats are converted to MEI using [luteconv](https://bitbucket.org/bayleaf/luteconv/) by Paul Overell, via the [luteconv-webui](https://codeberg.org/mdwRepository/luteconv-webui) wrapper service developed by Stefan Szepe and [hosted at mdw](https://luteconv.mdw.ac.at). PDF functionalities are provided by [PDFKit](https://github.com/foliojs/pdfkit) by Devon Govett, using [SVG-to-PDFKit](https://github.com/alafr/SVG-to-PDFKit). MIDI playback is implemented using [html-midi-player](https://github.com/cifkao/html-midi-player). This is itself powered by [Magenta.js](https://github.com/magenta/magenta-js/tree/master/music/), which also provides the [SGM_Plus sound font](https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus/soundfont.json) used to sonify your encoding. Icons are taken from GitHub's [Octicons repository](https://github.com/primer/octicons).

## Features

**Editor**. The CodeMirror editor implements important coding conveniences including code folding, line numbering, tag- and bracket matching and auto-closing; as well as alternate key mappings (e.g., ‘vim’, ‘emacs’). MEI-schema-informed autocomplete is also available.

**File input and output**. Files may be opened from the local file system (via a menu option or using drag’n’drop); from the Web via URL; or from GitHub, by specifying a user/organisation and selecting from the available repositories. GitHub integration allows users to log in, fork repositories, view logs, and commit changes. All Verovio-supported encoding formats are supported (MEI, uncompressed and compressed MusicXML, Humdrum, ABC, PAE). The current encoding can be downloaded as MEI, MIDI, and SVG. All interactions occur locally in the browser; nothing is uploaded anywhere, excepting GitHub commits. Editor content is persisted in local storage through page refreshes and browser restarts; support for persisting multiple files simultaneously is envisioned for future development.

**Public repertoire**. Our codebase includes a CSV file recording publicly licensed music encodings, which are offered through the ‘fork repository’ and ‘open URL’ interfaces, alongside a dedicated ‘public repertoire’ access point. Proposed additions to this repertoire meeting our requirements (publicly licensed files; available via GitHub or hosted on a CORS-enabled Web server) are gladly accepted via Github Issue or Pull Request.

**Configurable display**. Many aspects of the tool’s interface are user-configurable, including the orientation and size of the notation and editor panes; their scale factor / font-size; and colouring, via a selection of preconfigured themes, with the option of having the notation match the editor theme (or remain black on white); and, optionally setting the interface to follow the local system’s bright / dark mode settings. Crucially, Eulise’s circadian rhythm adjusts accordingly. These configurations are done via a dedicated ‘settings’ menu, which also exposes a large collection of tool-specific options for CodeMirror and Verovio.

**Navigation**. The interface supports musically meaningful navigation according to encoded sections, pages (first, prev, next, last, specified page number), and within displayed notes/rests. Due to the tightly coupled interaction between encoding (MEI text) and engraving (SVG image), selection and navigation occurs seamlessly across both modalities.

**Pedagogy**. To smooth the learning curve of users new to MEI, the MEI Guidelines are linked to from the ‘Help’ menu; further, users are able to directly look up documentation for the currently selected element through a keyboard shortcut / help menu item.

**Editor functions**. In addition to all features of the Atom plugin package, we now offer commands to insert and delete clefs, beam-spans, and spiccato articulation; to insert the vertical group (vgrp) attribute for selected elements supporting this attribute (such as dynam, dir, hairpin), with dynamic number attribution; and, to insert the supplied element around a selection and show all supplied elements in a configurable colour.

**Validation against MEI schema**. Based on the code of the Verovio editor kindly provided by Laurent Pugin, mei-friend automatically loads the RNG schema specified in the MEI file to validate the encoding. It makes use of Gnome’s libxml2. Validation behaviour is configurable (automatic or on-demand) through the mei-friend settings.

**Facsimile support**. mei-friend makes the content of the facsimile element accessible by displaying zone elements ontop of the surface images in a dedicated facsimile panel, providing interactive zone editing functionality (resizing, panning, inserting & deleting zones) as well as an automated workflow for ingesting external facsimile content into MEI encodings.

**Annotation support**. The annotation panel provides tooling for generating in-line <annot> elements, as well as for listing, navigating between, and visualising annotations. Support for stand-off Web Annotations is planned for future development.

## Installation
To try out mei-friend, simply navigate to the production instance on [https://mei-friend.mdw.ac.at](https://mei-friend.mdw.ac.at/). 
To run your own instance locally on your system, please follow the [installation instructions](INSTALL.md). 

## Publications
Goebl, W., & Weigl, D. M. (2024). mei-friend: An Interactive Web-based Editor for Digital Music Encodings. <em>Journal of Open Source Software</em>, 9(97), 6002. doi:[10.21105/joss.06002](https://doi.org/10.21105/joss.06002){:target="_blank"}

Goebl, W., & Weigl, D. M. (2023). mei-friend v1.0: Music Encoding in the Browser. Encoding Cultures. Joint MEC and TEI Conference 2023, Paderborn, Germany. https://teimec2023.uni-paderborn.de/contributions/159.html

Goebl, W. & Weigl, D. M. (2023). The mei-friend Web Application: Editing MEI in the Browser. Music Encoding Conference Proceedings 2022 [Late-breaking Reports]. 
doi:[10.17613/dnj6-yy29](https://dx.doi.org/10.17613/dnj6-yy29){:target="_blank"}.

Goebl, W. & Weigl, D. M. (2022). Alleviating the Last Mile of Encoding: The mei-friend Package for the Atom Text Editor.  In S. Münnich & D. Rizo (Eds.), Music Encoding Conference Proceedings 2021 (pp. 31&ndash;39). University of Alicante. doi:[10.17613/fc1c-mx52](https://doi.org/10.17613/fc1c-mx52){:target="_blank"} (**Best Paper Award MEC'21**)

## Acknowledgements

The *mei-friend* Web application is developed by [Werner Goebl](https://iwk.mdw.ac.at/goebl) ([@wergo](https://github.com/wergo)) and [David M. Weigl](https://iwk.mdw.ac.at/david-weigl) ([@musicog](https://github.com/musicog)), [Department of Music Acoustics – Wiener Klangstil (IWK)](https://iwk.mdw.ac.at), [mdw – University of Music and Performing Arts Vienna](https://mdw.ac.at). Development is undertaken as part of the [Signature Sound Vienna Project](https://iwk.mdw.ac.at/signature-sound-vienna). This research was funded by the [Austrian Science Fund (FWF)](https://fwf.ac.at) P 34664-G. The *mei-friend* Atom plugin package was developed as part of [TROMPA](https://trompamusic.eu) (Towards Richer Online Music Public-domain Archives), with funding from the [European Union's Horizon 2020 research and innovation programme](https://ec.europa.eu/info/research-and-innovation/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-2020_en) H2020-EU.3.6.3.1. under grant agreement No 770376.

## License
The *mei-friend* Web application is published under the [GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html) license.
