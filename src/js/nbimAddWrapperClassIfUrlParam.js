import getUrlParam from './getUrlParam';

export default function nbimAddWrapperClassIfUrlParam(wrapperClass, param) {
    const b = document.querySelector('body');
    // Only proceed if 'body' is found on the page
    if (b !== null) {
        if (getUrlParam(param)) {
            b.classList.add(wrapperClass);
        }
    }
}
