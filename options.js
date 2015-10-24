'use strict';

const defaults = {
    autoinit: false
};

function saveOptions() {
    chrome.storage.sync.set({
        autoinit: document.getElementById('autoinit').checked
    });
}

function restoreOptions() {
    chrome.storage.sync.get(defaults, items => {
        document.getElementById('autoinit').checked = items.autoinit;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('autoinit').addEventListener('change', saveOptions);
