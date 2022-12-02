/* eslint-disable max-len */

import { getSiblings } from './helpers';

export default function nbimTableScrollIndicator() {
    const indicators = document.getElementsByClassName('nbim-responsive-table__scroll-indicator');

    const calculateAndToggleIndicators = () => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0, j = indicators.length; i < j; i++) {
            const indicator = indicators[i];
            const tableWrapper = getSiblings(indicators[i])[0];
            const table = tableWrapper ? tableWrapper.children[0] : null;
            // Bring this back when we drop support to IE11
            // const tableOuterContainer = tableWrapper ? tableWrapper.closest('.nbim-responsive-table__outer-container') : null;
            const tableOuterContainer = tableWrapper ? tableWrapper.parentElement.parentElement : null;

            // Compare table and outer container with.
            // Add scroll indicator if overflow is too large.
            if (table && tableOuterContainer) {
                if (table.offsetWidth - 20 > tableOuterContainer.offsetWidth) {
                    indicator.classList.add('nbim-responsive-table__scroll-indicator--visible');
                    table.style.paddingRight = '20px';
                    indicator.addEventListener('click', () => {
                        // scroll smoothly
                        let scrolledAmount = 0;
                        const slideTimer = setInterval(() => {
                            // eslint-disable-next-line max-len
                            if (scrolledAmount >= table.offsetWidth - tableOuterContainer.offsetWidth) {
                                window.clearInterval(slideTimer);
                            } else {
                                table.parentNode.scrollLeft += 15;
                                scrolledAmount += 15;
                            }
                        }, 25);
                    });
                } else {
                    // Remove indicator if overflow size changes by window resize.
                    indicator.classList.remove('nbim-responsive-table__scroll-indicator--visible');
                    table.style.paddingRight = '0';
                }
            }
        }
    };

    const reportWindowSize = () => {
        if (indicators) {
            calculateAndToggleIndicators();
        }
    };

    if (indicators) {
        calculateAndToggleIndicators();
    }

    window.onresize = reportWindowSize;
}
