async function getCurrentTabUrl() {
    const tabs = await chrome.tabs.query({ active: true })
    return tabs[0].url
}

// inject content script into resolve.com web pages



