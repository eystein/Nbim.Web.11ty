/* eslint-disable array-callback-return */
/**
 * Add event listener to children of tabs. They must be equal to content.
 */
import { getSiblings } from './helpers';

export default function nbimTabSwitcher(tabsWrapperClass = null, contentClass = null) {
    const tabsWrappers = document.getElementsByClassName(tabsWrapperClass);
    const sectionTabsContent = document.getElementsByClassName(contentClass);

    if (tabsWrappers) {
        const tabSwitcher = (e, clickedTab, currentSectionIndex, tabIndex) => {
            e.preventDefault();
            // Add selected class to clicked tab.
            clickedTab.classList.add('selected');
            // Remove selected class on all siblings.
            const tabsiblings = getSiblings(clickedTab);
            for (const sibling of tabsiblings) {
                sibling.classList.remove('selected');
            }
            // Find right section with content.
            const currentSectionContent = sectionTabsContent[currentSectionIndex].children;
            // Find clicked tab content index equal to tab index.
            const currentSectionTabContent = currentSectionContent[tabIndex];
            // Add selected class and remove selected from all siblings.
            currentSectionTabContent.classList.add('selected');
            const contentSiblings = getSiblings(currentSectionTabContent);
            for (const sibling of contentSiblings) {
                sibling.classList.remove('selected');
            }
        };

        Object.keys(tabsWrappers).map((i) => {
            const tabs = tabsWrappers[i].children;
            Object.keys(tabs).map((tab) => {
                tabs[tab].addEventListener('click', (e) => {
                    e.preventDefault();
                    tabs[tab].blur();
                    tabSwitcher(e, tabs[tab], i, tab);
                });
            });
        });
    }
}
