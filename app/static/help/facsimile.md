# mei-friend facsimile support

The [https://music-encoding.org/guidelines/v4/elements/facsimile](facsimile element) contains image information of the written notation source. mei-friend is able to display this information (given that the graphical sources are available online), to edit the zones (change size, pan, insert, delete) and ingest facsimile information of a skeleton MEI file (such as exported from [https://measure-detector.edirom.de/](Deep Optical Measure Detector)) to a given MEI file.

## Explore an MEI file with facsimile information
To demonstrate the functionality, please load our example file [https://mei-friend.mdw.ac.at/?notationOrientation=top&notationProportion=.6&facsimileOrientation=left&facsimileProportion=.45&breaks=line&file=https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_Op76_BreitkopfHaertel/master/Beethoven_Op76-Breitkopf-Haertel.mei](Beethoven WoO57 Andante favori) from our public-domain github repository. Upon opening, the facsimile panel will be activated automatically that shows the image information provided in the MEI file. The facsimile panel can be hidden through the close bottom on the right side of the facsimile menu, and shown again using the facsimile icon in the upper right corner of mei-friend. The facsimile source images may be linked through `<graphic@target>` and can be provided as absolute URLs or as paths relative to the github repository's root folder or in an image folder `img`.

### Adjusting the facsimile display

To zoom the displayed image, use the slider in the above menu or `CTRL - mouse wheel` (on MacOS `CMD - mouse wheel`). To change the relative position of the facsimile panel relative to the notation, use the View – Facsimile top/bottom/left/right in the mei-friend control menu. Drag the borders to adjust the size of the facsimile panel. All these settings will be stored in the local storage and restored after the mei-friend is reloaded. By default, only the zones corresponding to the displayed measures in the notation panel are shown. If you want to see the entire page, please activate `Show full page` in the facsimile menu.
### Navigating with facsimile





## Creating your own MEI file with facsimile information

### Editing a skeleton file
To create an MEI file with facsimile information, you may use [https://measure-detector.edirom.de/](Deep Optical Measure Detector), an online tool that detects zones in notation images for each measure. This tool accepts individual images and outputs a skeleton (empty) minimal MEI file containing empty measures with the corresponding coordinates in the separate zone elements inside facsimile. 

To edit this skeleton file, please activate `Edit zones` in the facsimile menu. You now may adjust the size and position of existing zones. You may insert new zones by click-dragging on the image. It will insert an new zone and a new measure after the currently selected zone. Selected zones (and their references measure element) may be deleted using the `DEL` key.
### Obtaining a fixed number of measures

### Ingesting facsimile into an MEI file

To ingest the facsimile information of the skeleton file into the currently open MEI file, make sure that both files, the skeleton and the target MEI file, have the identical measure numbers (`measure@n`), because mei-friend is comparing this attribute to add a `@facs` attribute to each measure. After the ingestion, you may re-number your measure as you like. 

Make sure that the body element of your target MEI file has an `xml:id` attribute.

