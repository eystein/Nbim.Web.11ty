/**
 * Fold and unfold large tables.
 * The trick is css transition and max-height.
 * This function can be used on multiple tables.
 */
export default function nbimTableColumnToggler() {
    const buttons = document.getElementsByClassName('nbim-responsive-table__toggler');
    const selected = 'is-selected';
    const focused = 'is-focused';

    if (buttons !== null) {
        const columnToggler = (i) => {
            // Bring this back when we drop support to IE11
            // const row = buttons[i].closest('tr');
            const row = buttons[i].parentElement.parentElement;
            const isSelected = row.classList.contains(selected);

            if (isSelected) {
                row.classList.remove(selected);
                buttons[i].classList.remove(selected);
                buttons[i].setAttribute('aria-expanded', false);
            } else {
                row.classList.add(selected);
                buttons[i].classList.remove(focused);
                buttons[i].setAttribute('aria-expanded', true);
                buttons[i].classList.add(selected);
            }
        };

        // Set height and add eventlistener to the buttons.
        // eslint-disable-next-line no-plusplus
        for (let i = 0, j = buttons.length; i < j; i++) {
            // Add event listener for each button.<
            buttons[i].addEventListener('click', () => {
                columnToggler(i);
            });
        }
    }
};
