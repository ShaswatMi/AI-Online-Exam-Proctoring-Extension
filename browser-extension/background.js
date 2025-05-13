let isInitialLoad = true;

// Track which tabs have the extension functionality enabled
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
        
        // Check if this tab is enabled for the extension
        if (enabledTabs.has(tabId)) {
            // Send message to content script to show the button
            chrome.tabs.sendMessage(tabId, { action: 'showFullscreenButton' })
                .catch(err => console.log('Error sending message or content script not loaded'));
        }
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Toggle this tab in the enabled list
    if (enabledTabs.has(tab.id)) {
        enabledTabs.delete(tab.id);
        // Send message to hide button
        chrome.tabs.sendMessage(tab.id, { action: 'hideFullscreenButton' })
            .catch(err => console.log('Error sending message or content script not loaded'));
    } else {
        enabledTabs.add(tab.id);
        // Send message to show button
        chrome.tabs.sendMessage(tab.id, { action: 'showFullscreenButton' })
            .catch(err => console.log('Error sending message or content script not loaded'));
    }
});

// Handle tab close to clean up the Set
chrome.tabs.onRemoved.addListener((tabId) => {
    if (enabledTabs.has(tabId)) {
        enabledTabs.delete(tabId);
    }
});

// Add a message listener to handle fullscreen requests
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