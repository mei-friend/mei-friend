/**
 * Applies language packs to GUI elements
 *
 */

var lang; // global lang object from language pack files

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
    let el = document.getElementById(key);
    console.log('key: ' + key + ': el: ', el);
    if (el) {
      // for settings items
      if (el.closest('div.optionsItem')) {
        el = el.parentElement.querySelector('label');
        console.log('Found label: ', el);
        // for settings headers with details and summary
      } else if (el.nodeName.toLowerCase() === 'details') {
        el = el.querySelector('summary');
        console.log('Found summary: ', el);
      }
      // plus for all other items (and those above)
      if (el) {
        if ('text' in lang[key]) el.textContent = lang[key].text;
        if ('description' in lang[key]) el.title = lang[key].description;
      }
    }
  }
} // translateGui()
