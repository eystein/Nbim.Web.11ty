/* eslint-disable no-console */
/* eslint-disable max-len */
import { on, hasClass, setSelectedOption, getSiblings } from './helpers';

function findOlder(newValue) {
    const childrenToAppend = [];
    const parent = document.getElementById(newValue).parentNode;
    for (const item of parent.children) {
        if (item.id.search('older') !== -1) {
            childrenToAppend.push(item.id);
        }
    }
    return childrenToAppend;
}

// * 'main' element: the element that wraps the sub-elements
// Under 'reports', the 'main' element is year
// Under 'video archive', the 'main' element is category
// * 'sub' elements: the elements wrapped by the main element
// Under 'reports', the 'sub' elements are categories
// Under 'video archive', the 'sub' elements are years
export default function nbimFilterSelect({
    mainElId,
    subElId,
    sharedListsClass,
    targetList,
    whenFilteredDoNotShow,
    whenFilteredDoShow,
}) {
    const mainFilterElement = document.getElementById(mainElId);
    const subFilterElement = document.getElementById(subElId);

    const onChangeEvent = (selectedFilter, filterType) => {
        const lists = document.getElementsByClassName(sharedListsClass);
        const theLists = [...lists];
        on(selectedFilter, 'change', (e) => {
            e.preventDefault();
            const newValue = setSelectedOption(selectedFilter);
            // Filter by 'sub''
            if (filterType === 'sub') {
                const toggle = (element, addClass, removeClass) => {
                    element.classList.add(addClass);
                    element.classList.remove(removeClass);
                };

                // * When filter has a selection - start
                if (whenFilteredDoNotShow && whenFilteredDoShow) {
                    // Find elements that should not be visible when filtering is on
                    const whenFilteredDoNotShowEls = document.getElementsByClassName(whenFilteredDoNotShow);
                    // Only proceed if we have the required elements
                    if (whenFilteredDoNotShowEls !== null) {
                        if (selectedFilter.value) {
                            // There's a selection, hide the toggler!
                            document.querySelectorAll(`.${whenFilteredDoNotShow}`).forEach((item) => {
                                item.classList.add('hide');
                            });
                            document.querySelectorAll(`.${whenFilteredDoShow}`).forEach((item) => {
                                item.classList.remove('hide');
                            });
                        } else {
                            // No selection has been made or it has been reset
                            document.querySelectorAll(`.${whenFilteredDoNotShow}`).forEach((item) => {
                                item.classList.remove('hide');
                            });
                            document.querySelectorAll(`.${whenFilteredDoShow}`).forEach((item) => {
                                item.classList.add('hide');
                            });
                        }
                    }
                }
                // * When filter has a selection - end

                const toggleVisibility = (htmlElements, subType) => {
                    const classFound = hasClass(htmlElements, subType, true);
                    for (const htmlElement of htmlElements) {
                        if (classFound) {
                            toggle(htmlElement, 'main-show', 'main-hide');
                        } else {
                            toggle(htmlElement, 'main-hide', 'main-show');
                        }
                    }

                    for (const htmlElement of htmlElements) {
                        // Remove elements first if not found.
                        if (subType === 'all') {
                            // Clear filters. 'dummy' class is used because
                            //  we can't use an empty string
                            toggle(htmlElement, 'dummy', 'toggle-show');
                            toggle(htmlElement, 'dummy', 'toggle-hide');
                            toggle(htmlElement, 'dummy', 'main-hide');
                        } else if (hasClass(htmlElement, subType)) {
                            // Filter by 'sub' option value.
                            if (hasClass(htmlElement, 'toggle-show')) {
                                // Toggle off element only if entire main should be visible.
                                if (hasClass(htmlElement, 'main-hide')) {
                                    toggle(htmlElement, 'toggle-hide', 'toggle-show');
                                } else if (hasClass(htmlElement, 'main-show')) {
                                    toggle(htmlElement, 'toggle-show', 'toggle-hide');
                                } else {
                                    // Toggle on
                                    toggle(htmlElement, 'toggle-hide', 'toggle-show');
                                }
                            } else {
                                // Toggle on element
                                toggle(htmlElement, 'toggle-show', 'toggle-hide');
                                // Toggle off siblings
                                const siblings = getSiblings(htmlElement);
                                for (const sibling of siblings) {
                                    if (!hasClass(sibling, subType)) {
                                        toggle(sibling, 'toggle-hide', 'toggle-show');
                                    }
                                }
                            }
                        }
                    }
                };

                const childrenExceptScriptTags = (kids) => {
                    const goodKids = [];
                    for (const k of kids) {
                        if (k.tagName !== 'SCRIPT') {
                            goodKids.push(k);
                        }
                    }
                    return goodKids;
                };

                for (const option of mainFilterElement.children) {
                    if (typeof option.value !== 'undefined' && option.value !== '') {
                        const main = document.getElementById(option.value);
                        // We want the 2nd element with class name 'section__reports--list' ([1]) because the 1st is the one getting hidden
                        //  when we select a year
                        const mainList = main && targetList ? main.getElementsByClassName('section__reports--list')[1] : null;
                        if (targetList) {
                            // If 'targetList' is truthy, we do things differently:
                            // The elements we will be toggling have a deeper parent
                            if (mainList && mainList.children && childrenExceptScriptTags(mainList.children)) {
                                if (newValue && newValue !== '') {
                                    toggleVisibility(childrenExceptScriptTags(mainList.children), newValue);
                                } else {
                                    toggleVisibility(childrenExceptScriptTags(mainList.children), 'all');
                                }
                            }
                        } else if (main && main.children && childrenExceptScriptTags(main.children)) {
                            // If 'targetList' is falsey, we do things as we used to:
                            // The elements we will be toggling are direct children of 'main'
                            if (newValue && newValue !== '') {
                                toggleVisibility(childrenExceptScriptTags(main.children), newValue);
                            } else {
                                toggleVisibility(childrenExceptScriptTags(main.children), 'all');
                            }
                        }
                    }
                }
            } else {
                // Filter only by 'main'.
                for (const l of theLists) {
                    const listId = l.id;
                    // Show all lists, as none were specifically selected
                    if (newValue === '' || newValue === null) {
                        if (hasClass(l, 'toggle-hide')) {
                            l.classList.remove('toggle-hide');
                        }
                        l.classList.add('toggle-show');
                    }
                    // Hide all unselected lists
                    if (listId !== newValue && newValue !== '' && newValue !== null) {
                        if (hasClass(l, 'toggle-show')) {
                            l.classList.remove('toggle-show');
                        }
                        l.classList.add('toggle-hide');
                    }
                }
                // Show element with the selected id
                // The condition below prevents errors when the user resets to default
                const elToShow = document.getElementById(newValue);
                if (newValue !== '' && newValue !== null && elToShow !== null) {
                    if (newValue.search('older') === -1) {
                        if (hasClass(elToShow, 'toggle-hide')) {
                            elToShow.classList.remove('toggle-hide');
                        }
                        elToShow.classList.add('toggle-show');
                        const siblings = getSiblings(elToShow);
                        for (const sibling of siblings) {
                            sibling.classList.add('toggle-hide');
                        }
                    } else {
                        const idsToShow = findOlder(newValue);
                        idsToShow.forEach((element) => {
                            const elForShow = document.getElementById(element);
                            if (hasClass(elForShow, 'toggle-hide')) {
                                elForShow.classList.remove('toggle-hide');
                            }
                            elForShow.classList.add('toggle-show');
                            const siblings = getSiblings(elForShow);
                            for (const sibling of siblings) {
                                if (sibling.id.search('older') === -1) {
                                    sibling.classList.add('toggle-hide');
                                }
                            }
                        });
                    }
                } else {
                    // Reset filter on 'main' filter.
                    for (const option of selectedFilter.children) {
                        if (typeof option.value !== 'undefined' && option.value !== '') {
                            const report = document.getElementById(option.value);
                            if (report) {
                                report.classList.remove('toggle-hide');
                            }
                        }
                    }
                }
            }
        });
    };

    if (mainFilterElement !== null) {
        onChangeEvent(mainFilterElement, 'main');
    }
    if (mainFilterElement !== null && subFilterElement !== null) {
        onChangeEvent(subFilterElement, 'sub');
    }
}
