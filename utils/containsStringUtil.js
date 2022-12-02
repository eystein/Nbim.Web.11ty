/* ===================================
* String contains string
====================================== */

export default function containsString(theFullString, theStringToCheck) {
    let status = false;
    if (theFullString.toLowerCase().indexOf(theStringToCheck.toLowerCase()) !== -1) {
        status = true;
    }
    return status;
}

// Usage:
//
// containsString('this is so cool', 'cool') // returns true
// or:
// containsString('this is so cool', 'boring') // returns false
//
// PS:
// ES6 supports
// 'this is so cool'.includes('cool'), but there's no IE support :'(
// https://caniuse.com/#feat=es6-string-includes
