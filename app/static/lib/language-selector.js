import { supportedLanguages } from './defaults.js';
import { translator } from './main.js'

export function buildLanguageSelection() {
 const langTable = document.querySelector("#languageSelectionList table");
 Object.keys(supportedLanguages).sort().forEach(l => { 
    const row = document.createElement("tr");
    row.innerHTML = `<td id='lang_${l}_code'>${l}</td>`;
    row.innerHTML += `<td id='lang_${l}_native'>${supportedLanguages[l][l]}</td>`;
    row.innerHTML += `<td id='lang_${l}_selected'/>`;
    row.id = "row_"+l;
    row.addEventListener("click", selectLanguage);
    langTable.insertAdjacentElement("beforeend", row);
 })
 // make default language selected
 document.getElementById("row"+translator.defaultLangCode)
} // buildLanguageSelector()

export function translateLanguageSelection(selected = 'en') { 
 Object.keys(supportedLanguages).forEach(l => { 
    const selectedSpan = document.getElementById("lang_" + l + "_selected");
    if(selectedSpan)
        selectedSpan.innerText = supportedLanguages[selected][l];
 });
 // clear prev selected row indicator from language table
 document.querySelectorAll(".selectedLang").forEach(row => row.classList.remove("selectedLang"));
 // add new selected row indicator
 const selectedLangRow = document.getElementById("row_"+selected);
 if(selectedLangRow) { 
   selectedLangRow.classList.add("selectedLang");
 }
} // translateLanguageSelection()

function selectLanguage(e) { 
   // control language selection in settings based on clicked table row
   const langSettings = document.getElementById("selectLanguage");
   const target = e.target.nodeName === "TR" ? e.target : e.target.closest("tr");
   if(target) { 
      // set value in settings to native language text (2nd cell in row)
      langSettings.value = target.querySelector(":nth-child(2)").innerText;
      // trigger translator (1st cell == language code)
      const code = target.querySelector(":nth-child(1)").innerText;
      translator.changeLanguage(code);
      // translate language selection drop-down
      translateLanguageSelection(code);
   } else { 
      console.warn("Couldn't locate target language row on click: ", e);
   }
} // selectLanguage()
