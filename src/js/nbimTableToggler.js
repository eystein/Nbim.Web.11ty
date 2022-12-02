import { hasClass, on } from './helpers';

export default function nbimTableToggler() {
    const button = document.getElementById('nbim-folded-table--toggler');

    if (button !== null) {
        on(button, 'click', (e) => {
            e.preventDefault();
            const table = document.getElementsByClassName('nbim-folded-table');

            if (hasClass(table[0], 'hidden')) {
                table[0].classList.remove('hidden');
            } else {
                table[0].classList.add('hidden');
            }
        });
    }
}
