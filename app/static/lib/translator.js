/**
 * Applies language packs to GUI elements
 *
 */

var lang;

/**
 * Change language of mei-friend GUI and refresh all menu items
 * @param {string} languageCode
 */
export function changeLanguage(languageCode) {
  let languagePack = '../lang/lang.' + languageCode + '.js';
  console.log('Loading language pack: ', languagePack);
  import(languagePack).then((p) => {
    lang = p.lang;
    console.log(lang); // true
    translateGui();
  });
} // changeLanguage()

/**
 * Refresh language of all mei-friend GUI items
 */
export function translateGui() {
  for (let key in lang) {
    // console.log('key: ' + key + ': ', lang[key]);
    let el = document.getElementById(key);
    if (el) {
      if (el.closest('div.optionsItem')) {
        let label = el.parentElement.querySelector('label');
        if (label) {
          if ('text' in lang[key]) label.textContent = lang[key].text;
          if ('description' in lang[key]) label.title = lang[key].description;
        }
        // TODO: if details, take summary
      } else {
        if ('text' in lang[key]) el.textContent = lang[key].text;
        if ('description' in lang[key]) el.title = lang[key].description;
      }
    }
  }
} // translateGui()
