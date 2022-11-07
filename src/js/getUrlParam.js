/* ===================================
* Get URL param
*
* Nearly the same as the script below, but modernized and linted
* https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
====================================== */

export default function getUrlParam(param, url) {
    let theUrl = url;
    if (!url) {
        theUrl = location.href;
    }
    const theParam = param.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = `[\\?&]${theParam}=([^&#]*)`;
    const regex = new RegExp(regexS);
    const results = regex.exec(theUrl);
    return results === null ? null : results[1];
}

// Usage:
//
// getUrlParam('q', 'http://example.com/?q=abc') // returns 'abc'
// or:
// getUrlParam('q')
