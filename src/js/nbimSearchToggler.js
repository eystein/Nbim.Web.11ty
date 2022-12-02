import { on, hasClass } from './helpers';

export default function nbimSearchToggler(headerId) {
    // Find header on page
    const header = document.getElementById(headerId);
    // Only proceed if the id above is found on the page
    if (header !== null) {
        const searchOpen = document.getElementById('search-open');
        const searchOpenInput = document.getElementById('search-input');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');

        on(searchOpen, 'click', (e) => {
            e.preventDefault();
            // Change the search status to 'active'
            if (hasClass(header, 'search-inactive')) {
                header.classList.remove('search-inactive');
                header.classList.add('search-active');
            }
            searchInput.focus();
        });

        on(searchOpenInput, 'keydown', (e) => {
            if ('key' in e) {
                if (e.keyCode === 13 && hasClass(header, 'search-inactive') && hasClass(header, 'menu-mobile-inactive')) {
                    e.preventDefault();
                    header.classList.remove('search-inactive');
                    header.classList.add('search-active');
                    searchInput.focus();
                }
            }
        });

        on(searchClose, 'click', (e) => {
            e.preventDefault();
            // Change the search status to 'inactive'
            if (hasClass(header, 'search-active')) {
                header.classList.remove('search-active');
                header.classList.add('search-inactive');
            }
        });

        // Watch for keypress on 'Esc'
        on(document, 'keydown', (e) => {
            let isEsc = false;
            if ('key' in e) {
                if (e.key === 'Escape' || e.key === 'Esc') {
                    isEsc = true;
                }
            } else if (e.keyCode === 27) { // fallback; will eventually deprecate
                isEsc = true;
            }
            if (isEsc) {
                // Change the search status to 'inactive'
                if (hasClass(header, 'search-active')) {
                    header.classList.remove('search-active');
                    header.classList.add('search-inactive');
                }
            }
        });
    }
}
