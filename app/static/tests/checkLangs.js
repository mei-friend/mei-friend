import { supportedLanguages } from '../lib/defaults.js';
import { translator } from '../lib/main.js';

export function runLanguageChecks() { 
    const langs = Object.keys(supportedLanguages).sort();
    let langPackPromises = langs.map(l => translator.requestLanguagePack(l)); // load language packs
    console.log(langPackPromises)
    Promise.all(langPackPromises).then(langPacks => { 
        const diffs = {};
        console.debug("PACKS: ", langPacks);
        langs.forEach((l, ix) => { 
            diffs[l] = checkStructureMatches(translator.defaultLang, langPacks[ix].lang);
        });
        console.debug("DETERMINED THE FOLLOWING DIFFERENCES", diffs);
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
    if(typeof refObj !== 'object' && typeof refObj === typeof testObj) { 
        // base case -- identically structured (leaf) values
        return true;
    }
    const ref = Object.keys(refObj);
    const test = Object.keys(testObj);
    // check for missing and inserted keys
    diff['__missing'] = ref.filter( k => !test.includes(k));
    diff['__inserted'] = test.filter( k => !ref.includes(k));
    // check for type mismatches among shared keys
    diff['__mismatched'] = ref.filter( k => test.includes(k) ).filter( k => {
        // check for mismatch of type, or one is array and one isn't (both would be typeof object)
        return typeof ref[k] !== typeof test[k] || Array.isArray(ref[k]) !== Array.isArray(test[k])
     });
     // for matching properties, recur deeper into the struture where required
    ref.filter( k => !diff['__missing'].includes(k) && !diff['__mismatched'].includes(k)) // matching properties
     .forEach(k => diff[k] = checkStructureMatches(refObj[k], testObj[k]));
    // hand object up to the next level
    return diff;
}

    

