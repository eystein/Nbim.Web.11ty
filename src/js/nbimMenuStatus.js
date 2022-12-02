import { isPath } from './helpers';

export default function nbimMenuStatus(menuId, slugs) {
    // Find menu on page
    const menu = document.getElementById(menuId);
    // Only proceed if the id above is found on the page
    if (menu !== null) {
        const menuItems = menu.getElementsByClassName('menu-item');
        for (const menuItem of menuItems) {
            menuItem.classList.remove('active');
        }
        for (const slug of slugs) {
            if (isPath(slug)) {
                const menuItemActive = document.getElementsByClassName(`menu-${slug}`)[0];
                menuItemActive.classList.add('active');
            }
        }
    }
}
