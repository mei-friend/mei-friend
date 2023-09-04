/**
 * Applies language packs to GUI elements
 * Language packs need to be listed in supportedLanguages in defaults.js
 */
import * as l from '../lang/lang.en.js'; // default language
import { translateLanguageSelection } from './language-selector.js';
import { drawRightFooter, updateStatusBar } from './main.js';

/**
 * Translator class
 */
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
    // update language selection
    translateLanguageSelection(languageCode);
    // change language, only if not default and different from current lang pack
    if (languageCode !== this.defaultLangCode && languageCode !== this.langCode) {
      const languagePack = '../lang/lang.' + languageCode + '.js';
      console.log('Loading language pack: ', languagePack);
      import(languagePack).then((p) => {
        for (let key in p.lang) this.lang[key] = p.lang[key];
        this.langCode = languageCode;
        console.log('Language pack loaded: ' + languageCode + ', now translating.');
        this.translateGui();
      });
    } else if (languageCode === this.defaultLangCode) {
      for (let key in this.defaultLang) this.lang[key] = this.defaultLang[key];
      console.log('Translating back to default language: ' + this.defaultLangCode);
      this.langCode = languageCode;
      this.translateGui();
    }
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
   * Sets the class variable langCode
   * @param {string} langCode
   */
  setLangCode(langCode) {
    this.langCode = langCode;
  } // setLangCode()

  /**
   * Refresh language of all mei-friend GUI items
   */
  translateGui() {
    for (let key in this.lang) {
      let el = document.getElementById(key);
      if (el) {
        // check if we need to consider classes
        if ('classes' in this.lang[key]) {
          for (let c of Object.keys(this.lang[key]['classes'])) {
            if (el.classList.contains(c)) {
              this.doTranslation(el, key, c);
              break;
            }
          }
        } else {
          this.doTranslation(el, key);
        }
      }
    }
    updateStatusBar();
    drawRightFooter();
  } // translateGui()

  /**
   *
   * @param {Element} el
   * @param {string} key
   */
  doTranslation(el, key, className = '') {
    const v = false; // debug verbosity
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
    // plus for all other items (menu items etc.) with IDs
    if (el) {
      let translationItem = this.lang[key];
      if (className) {
        if ('classes' in this.lang[key] && className in this.lang[key]['classes']) {
          translationItem = this.lang[key]['classes'][className];
        } else {
          console.warning(
            'doTranslation(): Called with className but cannot translate, reverting to default: ',
            el,
            key,
            className
          );
        }
      }
      if ('text' in translationItem) {
        if (el.nodeName.toLowerCase() === 'input' && el.getAttribute('type') === 'button') {
          el.value = translationItem.text;
        } else {
          el.textContent = translationItem.text;
        }
      }
      if ('value' in translationItem) el.value = translationItem.value;
      if ('description' in translationItem) el.title = translationItem.description;
      if ('html' in translationItem) el.innerHTML = translationItem.html;
      if ('placeholder' in translationItem) el.setAttribute('placeholder', translationItem.placeholder);
    }
  }
} // class Translator()
