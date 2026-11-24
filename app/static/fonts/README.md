# Music fonts

SMuFL music fonts that Verovio no longer bundles. From the Verovio release that introduced runtime font
registration (`toolkit.registerMusicFont()`), only Leipzig and Bravura come with the toolkit; mei-friend registers
the fonts below from here when one is selected. The PDF export uses the same files.

| Font                         | Source                                                                                                            | Licence                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Gootville 1.3                | [Verovio `fonts/Gootville`](https://github.com/rism-digital/verovio/tree/develop/fonts/Gootville) (glyph subset)  | SIL OFL 1.1, [OFL.txt](Gootville/OFL.txt)     |
| Leland 0.80                  | [Verovio `fonts/Leland`](https://github.com/rism-digital/verovio/tree/develop/fonts/Leland) (glyph subset)        | SIL OFL 1.1, [LICENSE.txt](Leland/LICENSE.txt) |
| Petaluma 1.1                 | [steinbergmedia/petaluma](https://github.com/steinbergmedia/petaluma/tree/master/redist)                          | SIL OFL 1.1, [OFL.txt](Petaluma/OFL.txt)      |

Each folder holds the font (`.otf`) and its SMuFL metadata (`<name>_metadata.json`), which `registerMusicFont()`
requires. Gootville and Leland are the subsets Verovio rendered with before the change, so the engraving looks the
same as with earlier toolkit versions.
