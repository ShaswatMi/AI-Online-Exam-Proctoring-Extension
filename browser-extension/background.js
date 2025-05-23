let isInitialLoad = true;

const enabledTabs = new Set();

chrome.tabs.onActivated.addListener((activeInfo) => {
    if (isInitialLoad) {
        console.log('Ignoring initial load.');
        isInitialLoad = false;
        return;
    }

    chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log(`Switched to tab: ${tab.title}`);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log(`Tab updated: ${tab.title}`);
        
        
        if (enabledTabs.has(tabId)) {
            chrome.tabs.sendMessage(tabId, { action: 'showFullscreenButton' })
                .catch(err => console.log('Error sending message or content script not loaded'));
        }
    }
});

chrome.action.onClicked.addListener((tab) => {
    if (enabledTabs.has(tab.id)) {
        enabledTabs.delete(tab.id);
        chrome.tabs.sendMessage(tab.id, { action: 'hideFullscreenButton' })
            .catch(err => console.log('Error sending message or content script not loaded'));
    } else {
        enabledTabs.add(tab.id);
        chrome.tabs.sendMessage(tab.id, { action: 'showFullscreenButton' })
            .catch(err => console.log('Error sending message or content script not loaded'));
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (enabledTabs.has(tabId)) {
        enabledTabs.delete(tabId);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleFullscreen') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    function: () => {
                        if (document.fullscreenElement) {
                            document.exitFullscreen();
                        } else {
                            document.documentElement.requestFullscreen()
                                .catch(err => console.error(`Error attempting to enable fullscreen: ${err.message}`));
                        }
                    }
                }).catch(err => console.error(`Error executing script: ${err.message}`));
            }
        });
    }
    return true;
});

chrome.management.getAll((extensions) => {
    const active = extensions.filter(ext => ext.enabled);
    console.log(active);
  });