import { on, hasClass } from './helpers';

export default function nbimMenuMobileToggler(headerId) {
    // Find header on page
    const header = document.getElementById(headerId);
    // Only proceed if the id above is found on the page
    if (header !== null) {
        const menuMobileToggler = document.getElementById('menu-mobile');
        
        on(menuMobileToggler, 'click', (e) => {
            e.preventDefault();
            // Change the menu-mobile status to 'active'
            if (hasClass(header, 'menu-mobile-inactive')) {
                header.classList.remove('menu-mobile-inactive');
                header.classList.add('menu-mobile-active');
            } else {
                header.classList.remove('menu-mobile-active');
                header.classList.add('menu-mobile-inactive');
            }
        });
    }
}
