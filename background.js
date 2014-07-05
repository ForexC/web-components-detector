(function () {
'use strict';
/*global chrome */

var config = {
		autoinit: false
	},

	icons = {
		19: 'images/icon-19.png',
		38: 'images/icon-38.png'
	},

	iconsGs = {
		19: 'images/icon-19-gs.png',
		38: 'images/icon-38-gs.png'
	},

	tabStates = {},

	/*
	 * Updates browser action icon based on tab state.
	 * tabId <int>: a tab ID
	 */
	updateIcon = function (tabId) {

		var state = tabStates[tabId];

		if (state === undefined) {
			chrome.browserAction.setIcon({path: iconsGs});
			chrome.browserAction.setTitle({title: 'Web Components Detector'});
			chrome.browserAction.setBadgeText({text: ''});
		} else {
			chrome.browserAction.setIcon({path: state.isActive ? icons : iconsGs});
			chrome.browserAction.setTitle({title: '' + state.count + ' web components detected on this page'});
			chrome.browserAction.setBadgeText({text: '' + state.count});
			chrome.browserAction.setBadgeBackgroundColor({color: '#555'});
		}
	},

	/*
	 * Sends a message to a tab, injects content scripts and styles on demand.
	 * tabId <int>: a tab ID
	 * message <any>: a message
	 */
	sendMessage = function (tabId, message) {

		if (tabStates[tabId] === undefined) {
			chrome.tabs.insertCSS(tabId, {file: 'content.css'}, function () {
				chrome.tabs.executeScript(tabId, {file: 'content.js'}, function () {
					chrome.tabs.sendMessage(tabId, message);
				});
			});
		} else {
			chrome.tabs.sendMessage(tabId, message);
		}
	},

	/*
	 * Listens for content script messages
	 * message <object>:
	 *   .isActive <boolean>: whether icon should be in active state
	 *   .count <int>: number of deteced web component elements
	 * sender <object>: Chrome Sender object
	 */
	onMessage = function (message, sender) {

		tabStates[sender.tab.id] = message;
		updateIcon(sender.tab.id);
	},

	/*
	 * Listens for icon clicks
	 * tab <obj>: Chrome Tab object
	 */
	onClicked = function (tab) {

		sendMessage(tab.id, {clicked: true});
	},

	onTabActivated = function (info) {

		updateIcon(info.tabId);
	},

	onTabUpdated = function (tabId, info) {

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
	},

	onStorageChanged = function () {

		chrome.storage.sync.get(config, function (items) { config = items; });
	};


/* load config */
onStorageChanged();

/* Bind listeners */
chrome.storage.onChanged.addListener(onStorageChanged);
chrome.runtime.onMessage.addListener(onMessage);
chrome.browserAction.onClicked.addListener(onClicked);
chrome.tabs.onActivated.addListener(onTabActivated);
chrome.tabs.onUpdated.addListener(onTabUpdated);

}());
