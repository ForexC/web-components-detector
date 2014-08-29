(function () {
'use strict';
/*global chrome */

var defaults = {
        autoinit: false
    };

function saveOptions() {

    chrome.storage.sync.set({
        autoinit: document.getElementById('autoinit').checked
    });
}

function restoreOptions() {

    chrome.storage.sync.get(defaults, function (items) {

        document.getElementById('autoinit').checked = items.autoinit;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('autoinit').addEventListener('change', saveOptions);

}());
