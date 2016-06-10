const html = document.getElementsByTagName('html')[0];

/*
 * Marker Classes
 * classActive: to mark <html> element if state is active
 * classComponent: to mark all matched web components (might be more fine grained in future)
 */
const classActive = 'crx-wcd-active';
const classComponent = 'crx-wcd-component';
const classComponentX = 'crx-wcd-component-x';
const classComponentIs = 'crx-wcd-component-is';

/*
 * Current State
 * isActive <boolean>: highlight web components if true
 * components <list of elements>: all matched and marked elements
 */
let isActive = false;
let components = [];

/*
 * Finds and classifies web components.
 * Actually the heart of this Chrome extension and based
 * on https://gist.github.com/ebidel/4bdbe9db55d8a775d0a4
 * returns <list of elements>: all matched and marked elements
 */
const markComponents = () => {
    return Array.from(document.getElementsByTagName('*')).filter(element => {
        if (element.localName.indexOf('x-') === 0) {
            element.classList.add(classComponentX);
            return true;
        }

        if (element.getAttribute('is')) {
            element.classList.add(classComponentIs);
            return true;
        }

        if (element.localName.indexOf('-') >= 0) {
            element.classList.add(classComponent);
            return true;
        }

        return false;
    });
};

/*
 * Updates styles and icon to reflect internal state
 */
const update = () => {
    /* update element styles based on current state */
    if (isActive) {
        // refresh component marks (useful on dynamic DOM changes)
        components = markComponents();
        html.classList.add(classActive);
    } else {
        html.classList.remove(classActive);
    }

    /* send current state to background script to update icon */
    chrome.runtime.sendMessage({
        isActive,
        count: components.length
    });
};

/*
 * Listens for background script messages
 * message <object>:
 *   .clicked <boolean>: whether icon was clicked
 */
const onMessage = message => {
    if (message.clicked || message.autoinit) {
        /* toggle state and update */
        isActive = !isActive;
        update();
    }
};


/*
 * Bind message listener
 */
chrome.runtime.onMessage.addListener(onMessage);
