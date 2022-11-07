import { isNotEmptyArray } from '../../utils/isEmptyUtil';

export const isIE11 = !!window.msCrypto; // https://stackoverflow.com/questions/21825157/internet-explorer-11-detection/21825207#21825207

// helper that sets multiple attributes in one iteration
export const setAttrs = (element, obj) => {
    // eslint-disable-next-line
    for (const p in obj) {
        if ({}.hasOwnProperty.call(obj, p)) {
            element.setAttribute([p], obj[p]);
        }
    }
};
// helper that sets multiple styles in one iteration
export const setStyle = (element, obj) => {
    // eslint-disable-next-line
    for (const p in obj) {
        // eslint-disable-next-line
        element.style[p] = obj[p];
    }
};
// on event handler
export const on = (to, type, fn) => {
    if (document.addEventListener) {
        to.addEventListener(type, fn, false);
    } else if (document.attachEvent) {
        to.attachEvent(`on${type}`, fn);
    } else {
        // eslint-disable-next-line
        to[`on${type}`] = fn; // legacy fallback
    }
};
// has class helper
export const hasClass = (el, cl, hasChildren = false) => {
    if (hasChildren) {
        for (const child of el) {
            if (child.classList.contains(cl)) {
                return true;
            }
        }
    } else if (el.classList.contains(cl)) {
        return true;
    }
    return false;
};
// array contains an item with a particular string
const arrayContainsString = (arr, str) => {
    if (Array.prototype.includes) {
        return arr.includes(str);
    }
    return arr.toString().indexOf(str) !== -1;
};

// Check which environment/origin we're on.
// If we're in one of the origins we want to exclude, return false.
// Useful to exclude 'production'.
export const excludeHosts = (locationOrigins) => {
    let state = true;
    const origins = [];
    if (typeof parent.window.location === 'object') {
        if (locationOrigins && isNotEmptyArray(locationOrigins)) {
            locationOrigins.map((item) => {
                const regex = new RegExp(item);
                if (regex.test(parent.window.location.origin)) {
                    origins.push('false');
                }
                return null; // '.map()' expects something to be returned
            });
        }
        if (arrayContainsString(origins, 'false')) {
            state = false;
        }
    }
    return state;
};
// Show console messages only when supported
export const logMessage = (message, styles) => {
    if (typeof parent.window.console === 'object' && excludeHosts([
        'http://nbim.no',
        'http://www.nbim.no',
        'https://nbim.no',
        'https://www.nbim.no',
        'http://inte.nbim.no',
        'https://inte.nbim.no',
    ])) {
        parent.window.console.log(message, styles);
    }
};
// check if value is empty
export const isEmpty = value => (value == null || value.length === 0);
// check if we are in the path slug we expect to be, so that we can do things
export const isPath = (path) => {
    let status = false;
    if (path || path === '') {
        const currentUrl = window.location.pathname;
        if (currentUrl !== '' && currentUrl !== undefined) {
            const slug = currentUrl.replace('/', '').replace('.html', '');
            if (path === slug) {
                status = true;
            }
        }
    }
    return status;
};

export const getSiblings = (elem) => {
    // Setup siblings array and get the first sibling
    const siblings = [];
    let sibling = elem.parentNode.firstChild;

    // Loop through each sibling and push to the array
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

// retrieve the value of a selected option (in a 'select' element)
export const setSelectedOption = sel => sel.value;
