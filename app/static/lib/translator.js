/**
 * Applies language packs to GUI elements
 *
 */
import * as l from '../lang/lang.en.js'; // default language

export default class Translator {
  constructor() {
    this.defaultLangCode = 'en';
    this.defaultLang = { ...l.lang }; // global object for default (English) language pack
    this.langCode = this.defaultLangCode;
    this.lang = { ...l.lang }; // global lang object from language pack files
  } // constructor()

  /**
   * Change language of mei-friend GUI and refresh all menu items
   * @param {string} languageCode
   */
  changeLanguage(languageCode) {
    // change language, only if not default and different from current lang pack
    if (languageCode !== this.defaultLangCode && languageCode !== this.langCode) {
      const languagePack = '../lang/lang.' + languageCode + '.js';
      console.log('Loading language pack: ', languagePack);
      import(languagePack).then((p) => {
        for (let key in p.lang) this.lang[key] = p.lang[key];
        console.log('Language pack loaded: ' + languageCode + ', now translating.');
        this.translateGui();
      });
    } else if (languageCode === this.defaultLangCode) {
      for (let key in this.defaultLang) this.lang[key] = this.defaultLang[key];
      console.log('Translating back to default language: ' + this.defaultLangCode);
      this.translateGui();
    }
    this.langCode = languageCode;
  } // changeLanguage()

  /**
   * Returns promise for importing the language pack for the language code
   * @param {string} languageCode
   */
  async requestLanguagePack(languageCode) {
    const languagePack = '../lang/lang.' + languageCode + '.js';
    console.log('Loading language pack: ', languagePack);
    return import(languagePack);
  } //

  /**
   * Copy all keys of language object to internal translator.lang
   * @param {object} language
   */
  setLang(language) {
    for (let key in language) this.lang[key] = language[key];
  } // setLang()

  /**
   * Refresh language of all mei-friend GUI items
   */
  translateGui() {
    const v = false; // debug verbosity
    for (let key in this.lang) {
      let el = document.getElementById(key);
      if (el) {
        if (v) console.log('key: ' + key + ' nodeName: ' + el.nodeName + ', el: ', el);
        if (el.closest('div.optionsItem')) {
          // for settings items
          if (el.nodeName.toLowerCase() === 'select' && 'labels' in this.lang[key]) {
            // modify values for select inputs
            el.childNodes.forEach((opt, i) => {
              if (i < this.lang[key].labels.length) opt.textContent = this.lang[key].labels[i];
            });
          }
          if (el.nodeName.toLowerCase() === 'input' && el.getAttribute('type') === 'button') {
            if (v) console.log('Found button: ', el);
          } else {
            el = el.parentElement.querySelector('label');
            if (v) console.log('Found label: ', el);
          }
        } else if (el.nodeName.toLowerCase() === 'details') {
          // for settings headers with details and summary
          el = el.querySelector('summary');
          if (v) console.log('Found summary: ', el);
        }
        // plus for all other items (menu items etc.)
        if (el) {
          if ('text' in this.lang[key]) {
            if (el.nodeName.toLowerCase() === 'input' && el.getAttribute('type') === 'button') {
              el.value = this.lang[key].text;
            } else {
              el.textContent = this.lang[key].text;
            }
          }
          if ('description' in this.lang[key]) el.title = this.lang[key].description;
          if ('html' in this.lang[key]) el.innerHTML = this.lang[key].html;
          if ('placeholder' in this.lang[key]) el.setAttribute('placeholder', this.lang[key].placeholder);
        }
      }
    }
  } // translateGui()
} // class Translator()
