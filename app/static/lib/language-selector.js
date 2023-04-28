import { supportedLanguages } from './defaults.js';
import { translator } from './main.js';

/**
 * Builds html structure for language selection globe icon
 */
export function buildLanguageSelection() {
  const langTable = document.querySelector('#languageSelectionList table');
  Object.keys(supportedLanguages)
    .sort()
    .forEach((l) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td id='lang_${l}_code'>${l}</td>`;
      row.innerHTML += `<td id='lang_${l}_native'>${supportedLanguages[l][l]}</td>`;
      row.innerHTML += `<td id='lang_${l}_selected'/>`;
      row.id = 'row_' + l;
      row.addEventListener('click', onClickLanguageSelection);
      langTable.insertAdjacentElement('beforeend', row);
    });
  translateLanguageSelection(translator.langCode);
} // buildLanguageSelector()

/**
 * Updates language selection menu state
 * AND
 * selectLanguage select in mei-friend settings
 * @param {*} selected
 */
export function translateLanguageSelection(selected = 'en') {
  Object.keys(supportedLanguages).forEach((l) => {
    const selectedSpan = document.getElementById('lang_' + l + '_selected');
    if (selectedSpan) selectedSpan.innerText = supportedLanguages[selected][l];
  });
  // clear prev selected row indicator from language table
  document.querySelectorAll('.selectedLang').forEach((row) => row.classList.remove('selectedLang'));
  // add new selected row indicator
  const selectedLangRow = document.getElementById('row_' + selected);
  if (selectedLangRow) {
    selectedLangRow.classList.add('selectedLang');
  }

  // translate selectLanguage select in mei-friend settings menu
  const langSettings = document.getElementById('selectLanguage');
  if (langSettings) {
    langSettings.value = selected;
    langSettings.querySelectorAll('option').forEach((o) => {
      o.innerText = supportedLanguages[o.value][o.value] + ' / ' + supportedLanguages[selected][o.value];
    });
  }
} // translateLanguageSelection()

/**
 * Click handler for when language is clicked in language selection globe icon menu
 */
function onClickLanguageSelection(e) {
  // control language selection in settings based on clicked table row
  const target = e.target.nodeName === 'TR' ? e.target : e.target.closest('tr');
  if (target) {
    // trigger translator (1st cell == language code)
    const code = target.querySelector(':nth-child(1)').innerText;
    translator.changeLanguage(code);
    let storage = window.localStorage;
    if (storage) storage['mf-selectLanguage'] = code;
  } else {
    console.warn("Couldn't locate target language row on click: ", e);
  }
} // selectLanguage()
