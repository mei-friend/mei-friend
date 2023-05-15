import { supportedLanguages } from '../lib/defaults.js';
import { translator } from '../lib/main.js';

const basecaseIndicator = '__basecase';
const missingIndicator = '__missing';
const insertedIndicator = '__inserted';

/**
 * Run test: language pack comparison checks
 */
export function runLanguageChecks() {
  const langs = Object.keys(supportedLanguages).sort();
  let langPackPromises = langs.map((l) => translator.requestLanguagePack(l)); // load language packs
  Promise.all(langPackPromises).then((langPacks) => {
    const diffs = {};
    langs.forEach((l, ix) => {
      diffs[l] = checkStructureMatches(translator.defaultLang, langPacks[ix].lang);
    });
    console.debug('TEST: CHECK LANGUAGES - determined the following differences:', diffs);
  });
}

/**
 * Checks for identical structure (n.b. not values!) on a given level of a JS object;
 * Recursive to check through the whole object
 * @param {*} refObj Reference object
 * @param {*} testObj Object to be checked
 */
function checkStructureMatches(refObj, testObj) {
  const diff = {};
  if (typeof refObj !== 'object' && typeof refObj === typeof testObj) {
    // base case -- identically structured (leaf) values
    return basecaseIndicator;
  }
  const ref = Object.keys(refObj);
  const test = Object.keys(testObj);
  // check for missing and inserted keys
  diff[missingIndicator] = ref.filter((k) => !test.includes(k));
  diff[insertedIndicator] = test.filter((k) => !ref.includes(k));
  // for matching properties, recur deeper into the struture where required
  ref
    .filter((k) => !diff[missingIndicator].includes(k)) // matching properties
    .forEach((k) => (diff[k] = checkStructureMatches(refObj[k], testObj[k])));
  // remove base-case matches
  Object.keys(diff).forEach((k) => {
    if (diff[k] === basecaseIndicator || (typeof diff[k] === 'object' && !Object.keys(diff[k]).length)) delete diff[k];
  });
  // hand object up to the next level
  return diff;
}
