//first installation
chrome.runtime.onInstalled.addListener(function(details) {
	chrome.storage.sync.set({eradicate: true});
});

//tab update
chrome.tabs.onUpdated.addListener(function(id, info, tab) {
	if (tab.url.toLowerCase().indexOf("facebook.com") > -1) {
		chrome.pageAction.show(tab.id);
	}
});