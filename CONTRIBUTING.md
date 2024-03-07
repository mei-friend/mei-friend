# Contributing to mei-friend

mei-friend is developed in an open-source environment and we welcome contributions from the community. This document provides guidelines for contributing to mei-friend.

## How can I contribute?

We are grateful for contributions to the mei-friend project in the following areas: bug reports, feature requests, contributing encodings to the public repertoire, contributing translation fixes and new translations, and contributing to the mei-friend codebase.

## Reporting Bugs

If you find a bug in mei-friend, please raise an issue on the [mei-friend GitHub repository's issue tracker](https://github.com/mei-friend/mei-friend/issues/new/choose). Please follow the template provided, entering as much information as possible, including the version of mei-friend you are using, the operating system you are using, and the steps to reproduce the bug.

## Requesting new features

If you have an idea for a new feature in mei-friend, please raise an issue on the [mei-friend GitHub repository's issue tracker](https://github.com/mei-friend/mei-friend/issues/new/choose). Again, please follow the provided template, clearly describing the problem to be solved, your proposed solution, and any additional context.

## Contributing encodings to the public repertoire

If you have would like to contribute a publicly licenced encoding to mei-friend's public repertoire (accessible in mei-friend under `File` -> `Public repertoire`), please raise an issue on the [mei-friend GitHub repository's issue tracker](https://github.com/mei-friend/mei-friend/issues/new/choose). The relevant template will provide you with the required contribution form. Please note that we can only accept contributions that meet the following requirements:

- Supported encoding format: MEI, Kern, MusicXML (raw and compressed), ABC, PAE.
- Available via public Github repositories.
- Available under a public (e.g., a Creative Commons) license.
- The licensing of the encoding must be explicitly stated in the GitHub repository and/or in the encoding itself, e.g. using the MEI [useRestrict](https://music-encoding.org/guidelines/v5/elements/useRestrict) element.

## Contributing translation fixes and new translations

mei-friend's interface supports a growing number of natural languages, which can be selected from the 'globe' menu and the 'mei-friend settings' dialog. These translations are maintained as JavaScript objects within files in a [dedicated folder in mei-friend's codebase](https://github.com/mei-friend/mei-friend/tree/develop/app/static/lang). To contribute a new translation or fix an existing translation, please first [fork the mei-friend repository](https://github.com/mei-friend/mei-friend/fork), and then make your changes to the relevant language file(s).

Notice that the JavaScript `lang` objects within these files are structured such that the top-level keys are the identifier values of the HTML elements to be translated. Underneath this level, `text` keys contain the textual values of the HTML elements; `description` keys contain the title attribute values (longer descriptions that pop up when the mouse hovers over the HTML element); `html` keys contain the innerHTML values of the HTML elements; `value` contains the value attribute of input elements; and `placeholder` contains the placeholder attribute of input elements. Please translate _only_ the string values associated with these keys, leaving the keys themselves unchanged.

Once you have made your changes, please raise a Pull Request to the `develop` branch of the mei-friend repository, and the mei-friend development team will review your changes with a view toward merging them.

### Contributing a new translation

When contributing a new translation, please create a new file in the `lang` folder, named according to the [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of the language you are translating to, followed by the `.js` file extension. For example, the file for a translation to French is named `lang.fr.js`. Please copy the structure of the `lang.en.js` file, and replace the English text with the translated text.

As a final step, your new language needs to be added to the
menu of supported languages. This is a little complicated, as it requires adding both all supported languages' names to your new language's object, and your new language's name to all other supported languages' objects. Please contact the mei-friend development team for assistance with this step if required.

Concretely, the object `supportedLanguages` within [the file `defaults.js` inside the `lib` folder](https://github.com/mei-friend/mei-friend/tree/develop/app/static/lang) is used to generate the list of available languages in the mei-friend interface. Please add the ISO 639-1 language code of your translation to this object; your new key should contain a sub-object with keys for the ISO 639-1 codes for all supported languages, and values for the names of the languages in your new language. Finally, you will need to add your new language's ISO 639-1 code as a key to all other existing languages' sub-objects, with a value of the name of your new language in that previously supported language.

## Contributing to the mei-friend codebase

We welcome code contributions for new features to mei-friend. Before getting to work coding, please get in contact with the mei-friend developer team to discuss your proposed changes by creating a [feature request](#Requesting new features) on the issue tracker. Once you have received feedback and approval, please [fork the mei-friend repository](https://github.com/mei-friend/mei-friend/fork), implement your changes, noting that the mei-friend code repository contains a `.prettierrc` file to enforce code formatting. After testing that your changes work as agreed, please raise a Pull Request to the `develop` branch of the mei-friend repository. The mei-friend development team will then review your changes with a view toward merging them.

## Code of conduct

As a project developed within the open community environment of the Music Encoding Initiative, we adhere to the [MEI Community Code of Conduct](https://music-encoding.org/community/code-of-conduct.html). Please familiarize yourself with this document before contributing to mei-friend.
