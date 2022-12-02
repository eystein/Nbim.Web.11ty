/**
 * Fold and unfold large tables.
 * The trick is css transition and max-height.
 * This function can be used on multiple tables.
 * Todo: Completely remove old js from this file when deploying new folded tables.
 */
import { hasClass } from './helpers';

export default function nbimFoldedTableToggler() {
    const responsiveFoldedTables = document.getElementsByClassName('nbim-responsive-table--folded');
    const foldedTableTogglers = document.getElementsByClassName('nbim-responsive-table--folded__toggler');
    const focused = 'is-focused';
    const scrollToPos = [];

    if (responsiveFoldedTables && foldedTableTogglers) {
        const scrollTo = (e, position) => {
            if (e && typeof position === 'number') {
                window.scrollTo({
                    top: position,
                    left: 0,
                    behavior: 'smooth',
                });
            }
        };
        const tableToggler = (i, e) => {
            const body = responsiveFoldedTables[i].querySelector('tbody');
            const footer = responsiveFoldedTables[i].querySelector('tfoot');
            const button = e ? e.target : null;

            // eslint-disable-next-line no-plusplus
            for (let tr = 3; tr < body.children.length; tr++) {
                const rowClass = body.children[tr].classList;
                if (rowClass.contains('visually-hidden')) {
                    body.children[tr].classList.remove('visually-hidden');
                    foldedTableTogglers[i].classList.add('up');
                    foldedTableTogglers[i].setAttribute('aria-expanded', true);
                } else {
                    body.children[tr].classList.add('visually-hidden');
                    foldedTableTogglers[i].classList.remove('up');
                    foldedTableTogglers[i].setAttribute('aria-expanded', false);
                    foldedTableTogglers[i].classList.remove(focused);

                    // Add scroll up event
                    if (e) {
                        scrollTo(e, scrollToPos[i]);
                    }
                }

                if (footer && body.children.length === tr + 1) {
                    if (footer.classList.contains('visually-hidden')) {
                        footer.classList.remove('visually-hidden');
                    } else {
                        footer.classList.add('visually-hidden');
                    }
                }
            }

            if (button) {
                const currentText = button.textContent;
                const dataText = button.getAttribute('data-button-text');
                button.setAttribute('data-button-text', currentText);
                button.textContent = dataText;
            }
        };

        // Set height and add eventlistener to the buttons.
        // eslint-disable-next-line no-plusplus
        for (let i = 0, j = foldedTableTogglers.length; i < j; i++) {
            if (responsiveFoldedTables) {
                scrollToPos.push(
                    responsiveFoldedTables[i].getBoundingClientRect().top + (window.scrollY - 100)
                );
            }
            // Init on document ready to close tables.
            tableToggler(i);

            // Add event listener for each toggler for later use.
            foldedTableTogglers[i].addEventListener('click', (e) => {
                e.preventDefault();
                tableToggler(i, e);
            });
        }
    }

    // The code below should be removed when new folded tables goes to production.
    // Most of our tables are using the new table structure. There might still be some left at holdings page.
    // TODO: investigate and remove when possible.
    const buttons = document.getElementsByClassName('nbim-table-container--button');
    const tables = document.getElementsByClassName('nbim-folded-table');
    const tablesHeight = [];
    const minimizeClassName = 'nbim-folded-table--minimize';

    if (buttons !== null) {
        const buttonToggler = (e, i) => {
            e.preventDefault();

            if (typeof tables[i] !== 'undefined') {
                const buttonText = buttons[i].textContent;
                const dataText = buttons[i].getAttribute('data-text');

                if (hasClass(tables[i], minimizeClassName)) {
                    tables[i].classList.remove(minimizeClassName);
                    tables[i].style.maxHeight = typeof tablesHeight[i] !== 'undefined' ? `${tablesHeight[i]}px` : '100%';
                } else {
                    tables[i].classList.add(minimizeClassName);
                    tables[i].style.maxHeight = '325px';
                }
                buttons[i].textContent = dataText;
                buttons[i].setAttribute('data-text', buttonText);
            }
        };

        // Set height and add eventlistener to the buttons.
        // eslint-disable-next-line no-plusplus
        for (let i = 0, j = buttons.length; i < j; i++) {
            if (typeof tables[i] !== 'undefined') {
                tablesHeight[i] = tables[i].offsetHeight;
                tables[i].style.maxHeight = '325px';
            }

            // Add event listener for each button.
            buttons[i].addEventListener('click', (e) => {
                e.preventDefault();
                buttonToggler(e, i);
            });
        }
    }
}
