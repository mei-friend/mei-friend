import {
  calcSizeOfContainer
} from './resizer.js';
import { 
  sampleEncodings,
  samp
} from './main.js';

function fillInSampleUrl(e) {
  document.getElementById("openUrlInput").value = 
    e.target.value;
}

export function openUrl() {
  let sz = calcSizeOfContainer();
  let fc = document.querySelector('.openUrlOverlay');
  fc.width = sz.width * .25;
  fc.height = sz.height * .25;
  fc.style.display = "block";
  let sampleEncodingsSelector = fc.querySelector("#sampleEncodings")
  // arrange by composer
  let byComposer = {};
  sampleEncodings.forEach(s => {
    if (s[samp.COMPOSER] in byComposer) {
      byComposer[s[samp.COMPOSER]].push(s);
    } else { 
      byComposer[s[samp.COMPOSER]] = [s];
    }
  })

  const dummyOpt = document.createElement('option')
  dummyOpt.text = "Choose a sample encoding...";
  dummyOpt.value = "";
  dummyOpt.classList.add("sampleEntry");
  sampleEncodingsSelector.appendChild(dummyOpt)

  // alphabetically by composer...
  Object.keys(byComposer).sort().forEach( c => {
    /*
    const composerOpt = document.createElement('option');
    composerOpt.text = byComposer[c][samp.COMPOSER];
    composerOpt.value = byComposer[c][samp.COMPOSER];
    sampleEncodingsSelector.appendChild(composerOpt);
    */
    const composerEntries  = byComposer[c];
    // alphabetically by work title
    composerEntries.sort((a,b) => a[samp.TITLE] - b[samp.TITLE]).forEach(e => {
      const entryOpt = document.createElement('option');
      entryOpt.text = e[samp.COMPOSER]+ ": " + 
        e[samp.TITLE] + " - " + e[samp.FILE];
      entryOpt.value = e[samp.URL]
      entryOpt.classList.add("sampleEntry");
      sampleEncodingsSelector.appendChild(entryOpt);
    })
  })
  sampleEncodingsSelector.removeEventListener("change", fillInSampleUrl);
  sampleEncodingsSelector.addEventListener("change", fillInSampleUrl);
}

export function openUrlCancel() {
  // user has cancelled the "Open URL" action
  // => hide Open URL interface, show file status display
  let fileStatusElement = document.querySelector(".fileStatus");
  let openUrlElement = document.querySelector(".openUrlOverlay");
  // show file status, hide openUrl
  openUrlElement.style.display = "none";
}
