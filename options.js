const defaults = {
    autoinit: false
};

const saveOptions = () => {
    chrome.storage.sync.set({
        autoinit: document.getElementById('autoinit').checked
    });
};

const restoreOptions = () => {
    chrome.storage.sync.get(defaults, items => {
        document.getElementById('autoinit').checked = items.autoinit;
    });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('autoinit').addEventListener('change', saveOptions);
