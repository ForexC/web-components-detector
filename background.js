let config = {
    autoinit: false
};

const icons = {
    19: 'images/icon-19.png',
    38: 'images/icon-38.png'
};

const iconsGs = {
    19: 'images/icon-19-gs.png',
    38: 'images/icon-38-gs.png'
};

const tabStates = {};

/*
 * Updates browser action icon based on tab state.
 * tabId <int>: a tab ID
 */
const updateIcon = tabId => {
    const state = tabStates[tabId];

    if (state === undefined) {
        chrome.browserAction.setIcon({path: iconsGs});
        chrome.browserAction.setTitle({title: 'Web Components Detector'});
        chrome.browserAction.setBadgeText({text: ''});
    } else {
        chrome.browserAction.setIcon({path: state.isActive ? icons : iconsGs});
        chrome.browserAction.setTitle({title: `${state.count} web components detected on this page`});
        chrome.browserAction.setBadgeText({text: `${state.count}`});
        chrome.browserAction.setBadgeBackgroundColor({color: '#555'});
    }
};

/*
 * Sends a message to a tab, injects content scripts and styles on demand.
 * tabId <int>: a tab ID
 * message <any>: a message
 */
const sendMessage = (tabId, message) => {
    if (tabStates[tabId] === undefined) {
        chrome.tabs.insertCSS(tabId, {file: 'content.css'}, () => {
            chrome.tabs.executeScript(tabId, {file: 'content.js'}, () => {
                chrome.tabs.sendMessage(tabId, message);
            });
        });
    } else {
        chrome.tabs.sendMessage(tabId, message);
    }
};

/*
 * Listens for content script messages
 * message <object>:
 *   .isActive <boolean>: whether icon should be in active state
 *   .count <int>: number of deteced web component elements
 * sender <object>: Chrome Sender object
 */
const onMessage = (message, sender) => {
    tabStates[sender.tab.id] = message;
    updateIcon(sender.tab.id);
};

/*
 * Listens for icon clicks
 * tab <obj>: Chrome Tab object
 */
const onClicked = tab => {
    sendMessage(tab.id, {clicked: true});
};

const onTabActivated = info => {
    updateIcon(info.tabId);
};

const onTabUpdated = (tabId, info) => {
    if (info.status === 'loading') {
        // clean state
        tabStates[tabId] = undefined;
        updateIcon(tabId);
    }

    if (info.status === 'complete') {
        if (config.autoinit) {
            sendMessage(tabId, {autoinit: true});
        }
    }
};

const onStorageChanged = () => {
    chrome.storage.sync.get(config, items => {
        config = items;
    });
};


/* load config */
onStorageChanged();

/* Bind listeners */
chrome.storage.onChanged.addListener(onStorageChanged);
chrome.runtime.onMessage.addListener(onMessage);
chrome.browserAction.onClicked.addListener(onClicked);
chrome.tabs.onActivated.addListener(onTabActivated);
chrome.tabs.onUpdated.addListener(onTabUpdated);
