import { logMessage } from './helpers';

/* ===================================
* Only lazy-load 3rd party script tag once the placeholder that interacts with it
* is visible on viewport.
*
* Copyright (c) 2017, Wallace Sidhrée
* MIT License
====================================== */

export default function lazyScript(elId, scriptUrl = null, threshold, cb) {
    // polyfill for custom events
    /* eslint-disable */
    (function () {
        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
    /* eslint-enable */
    // get element
    const getElement = id => document.getElementById(id);
    // get dimensions
    const windowHeight = () => window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = () => window.innerWidth || document.documentElement.clientWidth;
    let notCalled = true;
    let scrollingHandler;
    let checkViewport;
    // fire when ready
    const fireWhenReady = (el, straightAway = false) => {
        const event = new CustomEvent('inViewPort');
        checkViewport = () => {
            const rect = el.getBoundingClientRect();
            if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= windowHeight() + (windowHeight() / 2) &&
                rect.right <= windowWidth()
            ) {
                el.dispatchEvent(event);
                notCalled = false;
            } else if (straightAway) {
                el.dispatchEvent(event);
                notCalled = false;
            }
        };
        scrollingHandler = () => notCalled && requestAnimationFrame(checkViewport);
        window.addEventListener('scroll', scrollingHandler);
    };
    // inject scripts through script tags
    const injectJS = (url, callback) => {
        // inject url
        const injs = document.createElement('script');
        injs.src = url;
        injs.type = 'text/javascript';
        injs.async = true;
        // output message on load callback
        const success = logMessage(`[injectJS] ${url} has loaded as a script!`);
        if (injs.addEventListener) {
            injs.addEventListener('load', success, false);
        }
        document.body.appendChild(injs);
        const doCallback = (() => callback)();
        doCallback();
    };
    const containerScript = getElement(elId);

    const doScript = (inViewPort = false) => {
        if (scriptUrl) {
            injectJS(scriptUrl, () => {
                logMessage(`[lazyScript] ${elId} was lazy-loaded!`, '');
                if (inViewPort) window.removeEventListener('scroll', scrollingHandler);
                // run callback function passed as 4th parameter of 'lazyScript'
                if (cb) {
                    // A little delay so that the script we just appended gets
                    // properly downloaded and exposed
                    setTimeout(() => {
                        cb();
                    }, 300);
                }
            });
        } else {
            setTimeout(() => {
                /* eslint-disable */
                cb ? cb() : logMessage('Callback is not defined', '');
                /* eslint-enable */
                logMessage(`[lazyScript] ${elId} was lazy-loaded!`, '');
            }, 300);
        }
    };

    // set event and what it will execute
    if (containerScript) {
        const containerPosition = containerScript.getBoundingClientRect().top;
        if ((containerPosition + window.scrollY) <= window.scrollY) {
            doScript();
            // trigger event when it's ready and visible on viewport
            fireWhenReady(containerScript);
        } else {
            // Scroll 1px to init eventlistener for viewport.
            window.scroll(0, window.scrollY + 1);

            containerScript.addEventListener('inViewPort', () => {
                doScript(true);
            });
            // Fire lazyload event straight away if container is in first fold
            // or listen to viewport event.
            if (window.scrollY < 100 && containerPosition <= window.innerHeight) {
                fireWhenReady(containerScript, true);
            } else {
                fireWhenReady(containerScript);
            }
        }
    }
}
