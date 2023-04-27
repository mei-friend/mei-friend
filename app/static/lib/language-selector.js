import { supportedLanguages } from './defaults.js';

export function buildLanguageSelection() {
 const langTable = document.querySelector("#languageSelectionList table");
 Object.keys(supportedLanguages).sort().forEach(l => { 
    const row = document.createElement("tr");
    row.innerHTML = `<td id='lang_${l}_code'>${l}</td>`;
    row.innerHTML += `<td id='lang_${l}_native'>${supportedLanguages[l][l]}</td>`;
    row.innerHTML += `<td id='lang_${l}_selected'/>`;
    langTable.insertAdjacentElement("beforeend", row);
 })
} // buildLanguageSelector()

export function translateLanguageSelection(selected = 'en') { 
 const langList = document.getElementById("languageSelectionList");
 Object.keys(supportedLanguages).forEach(l => { 
    const selectedSpan = document.getElementById("lang_" + l + "_selected");
    if(selectedSpan)
        selectedSpan.innerText = supportedLanguages[selected][l];
 })
} // translateLanguageSelection()
