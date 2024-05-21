---
title: 'mei-friend: An Interactive Web-based Editor for Digital Music Encodings'
tags:
  - MEI
  - Music Encoding Initiative
  - Linked Data
authors:
  - name: Werner Goebl
    orcid: 0000-0002-1722-0718
    equal-contrib: true
    corresponding: true
    affiliation: 1 # (Multiple affiliations must be quoted)
  - name: David M. Weigl
    orcid: 0000-0003-1502-1528
    equal-contrib: true # (This is how you can denote equal contributions between multiple authors)
    affiliation: 1
affiliations:
 - name: Department of Music Acoustics – Wiener Klangstil (IWK), mdw – University of Music and Performing Arts Vienna, Austria
   index: 1
date: 21 May 2024
bibliography: paper.bib
---

# Summary
Digital music encodings are machine-readable representations of music score documents. Beyond the visual information captured by score images or PDFs, music encodings explicitly capture the musical semantics of the score. This makes it possible to use them as research data objects for musicological analyses [@rizo2019mei], and to build digital score interfaces for applications in music scholarship, rehearsal, and performance [@Pugin2018interaction]. 

mei-friend is a friendly, interactive, browser-based editor for music encodings. It opens music encodings in a variety of formats and converts these to MEI, the XML-based format developed by the Music Encoding Initiative, a community of music scholars, librarians, and technologists. Alongside a rich set of interactive editing operations, mei-friend offers specialized functionalities targeted at music scholars, including panels to display facsimile score images and to author score annotations. Collaborative encoding practices are supported through integration with GitHub and Solid, and by remote configuration capabilities via hyperlink (URL parameters). Important MEI community resources are also integrated, supporting direct reference to documentation [@MEI_Guidelines] for currently-selected elements, and auto-completion and validation using the MEI-XML schema definitions. Also provided are curated links to openly-licensed reference music encodings.

The editor targets an audience of music scholars, students, librarians, performers, and enthusiasts. It is not conceived as a replacement for commercial music notation software, but rather as a complement opening up the affordances of machine-readable semantic music encodings to a broader audience. Our tool is the only currently available editor with comprehensive, native MEI-editing support in Common Western Music Notation (CMN). Editing directly in MEI avoids conversion errors (due to bugs or inherent differences in supported features) from other formats, while supporting interactive use of those capabilities of the MEI schema that other formats simply do not support, such as editorial markup, annotation, and facsimile integration. 

# Statement of Need

Music encodings are machine-readable representations of music scores with important affordances for digital music research, preservation of cultural heritage, and music rehearsal and performance [@Geertinger_2021].
MEI, the family of XML schemas promoted and continually developed by the community of the Music Encoding Initiative, is noted for its richly comprehensive representation of music semantics, including facilities for digital scholarly edition, analytical markup, and capturing catalogue-level metadata and source descriptions alongside the music content; and, for its support for a variety of notations including tablatures, neumes, and mensural notation alongside common western music notation [@Crawford2016music]. These capabilities set MEI apart for scholarly use from less richly elaborated but more widespread competitors such as MusicXML, which, unlike MEI, can be exported by most commercial notation software [@Pugin2018interaction]. Conversely, the retention of XML as a technological basis, with advantages particularly in terms of interoperability and addressability, speak for MEI in favour of other research-focused formats such as Humdrum Kern in the context of FAIR data management [@Weigl_etal_EMR2021]. 

![mei-friend interface: MEI encoding of Beethoven's WoO 57 (right panel), digital score rendering (top-left panel), and associated facsimile image of the source edition (bottom-left panel), with the currently-selected measure highlighted in each modality.\label{fig:example}](mei-friend-WoO57-facsimile-3.png){ width="100%" }

These properties have led to the use of MEI as a de-facto encoding standard in music scholarship and cultural heritage preservation in recent years, as evidenced by its adoption as a recommended preservation format for digital scores by the @loc2019mei. However, the relatively scarce availability of high-quality, publicly-licensed music encodings remains a limiting factor, and the creation of such encodings, particularly at scale, is a high-effort activity with a relatively steep learning curve. 

mei-friend is a feature-rich music encoding editor that aims to alleviate the difficulty of learning and working with MEI. 
Initially implemented as a plugin for the Atom text editor [@Goebl_Weigl_MEC2021], it has been reworked as a cross-browser-compatible Web application using vanilla JavaScript, with optimised performance and an extended set of features. The interface exposes two main panels: an MEI-XML editor (\autoref{fig:example}, right panel) using CodeMirror&nbsp;5 [@codemirror] and a panel for digital notation rendered from the MEI&nbsp;XML using the Verovio engraving tool [@pugin2014verovio] (top-left panel). These panels are interconnected such that navigating or selecting elements in one panel causes equivalent actions in the other. The application can open several different digital notation formats, including MusicXML and Kern, converting them to MEI on load. It exports MEI alongside SVG and MIDI renderings. Additional conveniences include a PDF-printing interface and a built-in MIDI player capable of interactive note-highlighting and page-turning during playback.

The application provides editing functionalities to manipulate and insert notation elements, simultaneously updating the MEI-XML and digital notation panels with each action. All major functionalities are available through both a graphical interface and via keyboard shortcuts. Integrations for other Web services are provided, including GitHub for versioned encoding storage and access, and the Solid platform for Social Linked Data [@Mansour_etal_2016].

Specialized functionalities supporting music scholarship include the display of facsimile score images referenced from the music encoding (\autoref{fig:example}, bottom-left panel), enabling the interactive association of reference image regions with encoded score elements; and, an annotation panel for authoring different types of score annotation, both within the MEI (using the `<annot>` element) and as stand-off Linked Data using the W3C Web Annotation Data Model and associated domain ontologies [@Lewis_DLfM2022]. 
By exposing several internal variables as URL parameters, such as the encoding file URL, various layout and display settings, and the XML identifiers of elements to be preselected on load, mei-friend can be remotely configured via hyperlinks which can be distributed among collaborating users; an important feature for pedagogical and crowd-sourcing applications.

The official application instance, available at <https://mei-friend.mdw.ac.at/>, is sustainably hosted within the institutional repository of the mdw -- University of Music and Performing Arts Vienna. The code base is licensed under the AGPL 3.0 open-source license, and is published at <https://github.com/mei-friend/mei-friend/>. Development of the editor and its comprehensive documentation, available <https://mei-friend.github.io/>, is ongoing, with feature proposals, bug reports, and code contributions provided by community members. The editor's user interface is available in a growing number of languages, thus applicable for uses in international contexts. 

The mei-friend development process operates over four distinct environments: *production*, served from the `main` branch of the mei-friend code repository; *staging*, served from the `staging` branch and accessible for public verification before release at <https://staging.mei-friend.mdw.ac.at>; *testing*, served from the `testing` branch and used to coordinate development of contributions by community members at <https://testing.mei-friend.mdw.ac.at>; and *develop*, served from the `develop` branch. The application adjusts to its environment context, running tests when in develop and altering the logo to alert users when in staging or testing.

The editor has seen significant and growing adoption by the MEI community, currently receiving more than six-hundred distinct visitor sessions each month on its hosted instance.
The predecessor Atom plugin was reviewed as part of editorial work for the *Digital Interactive Mozart Edition* [@Sapov_2022] and used to edit a large collection of Beethoven solo-piano pieces [@weigl2019interweaving].
The Web application is central to ongoing Digital Musicology research projects analysing and comparing orchestral performances aligned with digital score encodings [@Weigl_etal_DLfM2023] and establishing a digital edition of German lute tablatures of the 15th and 16th centuries [@elaute2023mec]. 
A further community-based project is underway to extend mei-friend's support for scholarly edition and markup [@nfdi4culture_Plaksin2022]. 
mei-friend has been used to teach music encoding at universities in Boston, Vienna, and Würzburg; academic events, including the Digital Humanities @ Oxford Summer School and the *Semana HD* organized by South American Digital Humanities associations; and conferences, including the *Music Encoding Conference* (MEC), the *Medieval and Renaissance Music Conference* (MedRen), and the *Extended Semantic Web Conference* (ESWC). 

# Acknowledgements

We acknowledge support from the Austrian Science Fund (FWF) through the projects "Signature Sound Vienna" P34664 and "E-LAUTE" I6019, and from the European Commision via the research and innovation action EU H2020 TROMPA – Towards Richer Online Music Public-domain Archives, grant no. 770376. Extensions for scholarly markup by Anna Plaksin are funded by the Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) under the National Research Data Infrastructure – 441958017. We are grateful for contributions by members of the MEI community including Laurent Pugin, Thomas Weber, and many others. 

# References
