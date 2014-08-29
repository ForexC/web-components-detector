(function () {
'use strict';
/*global chrome */

var html = document.getElementsByTagName('html')[0];

/*
 * Marker Classes
 * classActive: to mark <html> element if state is active
 * classComponent: to mark all matched web components (might be more fine grained in future)
 */
var classActive = 'crx-wcd-active';
var classComponent = 'crx-wcd-component';
var classComponentX = 'crx-wcd-component-x';
var classComponentIs = 'crx-wcd-component-is';

/*
 * Current State
 * isActive <boolean>: highlight web components if true
 * components <list of elements>: all matched and marked elements
 */
var isActive = false;
var components = [];

/*
 * Finds and classifies web components.
 * Actually the heart of this Chrome extension and based
 * on https://gist.github.com/ebidel/4bdbe9db55d8a775d0a4
 * returns <list of elements>: all matched and marked elements
 */
function markComponents() {

    return Array.prototype.slice.call(document.getElementsByTagName('*')).filter(function (element) {

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
    });
}

/*
 * Updates styles and icon to reflect internal state
 */
function update() {

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
        isActive: isActive,
        count: components.length
    });
}

/*
 * Listens for background script messages
 * message <object>:
 *   .clicked <boolean>: whether icon was clicked
 */
function onMessage(message) {

    if (message.clicked || message.autoinit) {
        /* toggle state and update */
        isActive = !isActive;
        update();
    }
}


/*
 * Bind message listener
 */
chrome.runtime.onMessage.addListener(onMessage);

}());
