import { on, isIE11 } from './helpers';

/**
 * Scroll to element if triggerElementId is passed. Otherwise scroll to top.
 * @param {string} triggerElementId pass clicked element id as the first argument.
 * @param {string} targetElementId optional target id could be passed as
 * the second argument or the scroll will be set to page top or 0.
 * @param {boolean} fastDuration leave empty or add true to speed up duration.
 */
function nbimScrollTo(triggerElementId = null, targetElementId = null, fastDuration = false) {
    const triggerElement = document.getElementById(triggerElementId);
    const targetElement = document.getElementById(targetElementId);

    const scroll = (start, stop) => {
        let currentPosition = start;

        setInterval(() => {
            if (start < stop) {
                if (currentPosition <= stop) {
                    currentPosition += fastDuration ? 40 : 20;
                    window.scroll(0, currentPosition);
                } else {
                    clearInterval();
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (currentPosition >= stop) {
                    currentPosition -= fastDuration ? 40 : 20;
                    window.scroll(0, currentPosition);
                } else {
                    clearInterval();
                }
            }
        }, fastDuration ? 1 : 5);
    };

    if (triggerElement && triggerElement !== null) {
        if (isIE11) {
            triggerElement.style.display = 'none';
        } else {
            on(triggerElement, 'click', (e) => {
                e.preventDefault();
                const start = document.documentElement.scrollTop;
                const stop = targetElement ? targetElement.offsetTop : 0;
                scroll(start, stop);
            });
            // Up button is visible when scrolled over 814px.
            if (triggerElementId === 'nbimScrollUpButton') {
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset >= 815) {
                        triggerElement.classList.remove('page-arrow-up');
                        triggerElement.classList.add('page-arrow-up--visible');
                    } else {
                        triggerElement.classList.remove('page-arrow-up--visible');
                        triggerElement.classList.add('page-arrow-up');
                    }
                });
            }
        }
    }
}

export default nbimScrollTo;
