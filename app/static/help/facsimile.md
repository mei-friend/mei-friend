# mei-friend facsimile support

The [https://music-encoding.org/guidelines/v4/elements/facsimile](facsimile element) contains image information of the written notation source. mei-friend is able to display this information (given that the graphical sources are available online), to edit the zones (change size, pan, insert, delete) and ingest facsimile information of a skeleton MEI file (such as exported from [https://measure-detector.edirom.de/](Deep Optical Measure Detector)) to a given MEI file.

## Explore an MEI file with facsimile information
To demonstrate the functionality, please load our example file WoO57 Andante favori from our public-domain github repository. Upon opening, the facsimile panel will be activated automatically that shows the image information provided in the MEI file. The facsimile source images are stored in the github repository in a separate folder ìmg`.

### Adjusting the facsimile display

Size and position of the facsimile panel can be adjusted through the settings panel. By default, only the zones corresponding to the displayed measures in the notation panel are shown. If you want to see the entire page, please activate `Show full page` in the settings panel. 

### Navigating with facsimile



## Creating your own MEI file with facsimile information

### Editing a skeleton file
To create an MEI file with facsimile information, you may use [https://measure-detector.edirom.de/](Deep Optical Measure Detector), an online tool that detects zones in notation images for each measure. 

### Obtaining a fixed number of measures

### Ingesting facsimile into an MEI file

To ingest the facsimile information of the skeleton file into the currently open MEI file, make sure that both files, the skeleton and the target MEI file, have the identical measure numbers (`measure@n`), because mei-friend is comparing this attribute to add a `@facs` attribute to each measure. After the ingestion, you may re-number your measure as you like. 

Make sure that the body element of your target MEI file has an `xml:id` attribute.

