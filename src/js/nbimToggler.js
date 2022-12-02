import { on, hasClass, setAttrs, getSiblings } from './helpers';

export default function nbimToggler(wrapperId) {
    // Find wrapper on document
    const w = document.getElementById(wrapperId);
    // Only proceed if the id above is found on the page
    if (w !== null) {
        const togglers = w.getElementsByClassName('toggler');
        const theTogglers = [...togglers];
        for (const [i, t] of theTogglers.entries()) {
            setAttrs(t, {
                id: `${wrapperId}-toggler-id-${i}`,
            });
            const toggleItems = getSiblings(t);
            const theToggleItems = [...toggleItems];
            for (const tI of theToggleItems.entries()) {
                tI[1].classList.add(`${wrapperId}-toggle-item-id-${i}`);
            }
        }
        // Retrieve a NodeList with matching ids, for togglers
        const triggers = document.querySelectorAll(`button[id^="${wrapperId}-toggler-id-"]`);
        // Iterate over triggers
        // eslint-disable-next-line
        for (let i = 0; i < triggers.length; i++) {
            // The item
            const x = triggers[i];
            // The 'id' attribute for the item (for clarity)
            const id = x.id;
            // Remove unused part of 'id' name and keep only the number
            const idNumber = id.replace(`${wrapperId}-toggler-id-`, '');
            // 't' is short for 'triggered' (what is triggered by the trigger)
            const matchingToggleItems = document.getElementsByClassName(`${wrapperId}-toggle-item-id-${idNumber}`);
            const theMatchingToggleItems = [...matchingToggleItems];
            // When clicking on children anchor tags or buttons, do not toggle
            const childrenAnchors = x.getElementsByTagName('a');
            if (childrenAnchors.length > 0) {
                // eslint-disable-next-line
                for (let y = 0; y < childrenAnchors.length; y++) {
                    on(childrenAnchors[y], 'click', (e) => {
                        e.stopPropagation();
                    });
                }
            }
            // Set 'aria' states on load
            if (hasClass(x, 'toggler-on')) {
                setAttrs(x, {
                    'aria-pressed': true,
                    'aria-expanded': true,
                });
            } else if (hasClass(x, 'toggler-off')) {
                setAttrs(x, {
                    'aria-pressed': false,
                    'aria-expanded': false,
                });
            }
            // On click, expand or collapse the respective toggle-items
            on(x, 'click', (e) => {
                e.preventDefault();

                // Toggle button text if it should be togglable.
                const toggleTitleItems = x.getElementsByClassName('toggle-item');
                const tti = [...toggleTitleItems];

                for (const it of tti.entries()) {
                    if (hasClass(it[1], 'toggle-show')) {
                        it[1].classList.remove('toggle-show');
                        it[1].classList.add('toggle-hide');
                    } else {
                        it[1].classList.remove('toggle-hide');
                        it[1].classList.add('toggle-show');
                    }
                }

                // Toggle triggered state, which shows their content
                for (const mti of theMatchingToggleItems.entries()) {
                    if (hasClass(mti[1], 'toggle-show')) {
                        mti[1].classList.remove('toggle-show');
                        mti[1].classList.add('toggle-hide');
                    } else if (hasClass(mti[1], 'toggle-hide')) {
                        mti[1].classList.remove('toggle-hide');
                        mti[1].classList.add('toggle-show');
                    }
                }
                // Toggle trigger state, which changes the chevron icon and current 'aria' state
                if (hasClass(x, 'toggler-on')) {
                    x.classList.remove('toggler-on');
                    x.classList.add('toggler-off');
                    setAttrs(x, {
                        'aria-pressed': false,
                        'aria-expanded': false,
                    });
                } else if (hasClass(x, 'toggler-off')) {
                    x.classList.remove('toggler-off');
                    x.classList.add('toggler-on');
                    setAttrs(x, {
                        'aria-pressed': true,
                        'aria-expanded': true,
                    });
                }
            });
        }
    }
}
