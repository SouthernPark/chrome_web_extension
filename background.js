// listen from content scripts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // check if it's from "revolve.com"
        let re = /.*\.revolve\.com.*/
        if (sender.tab.url.search(re) !== -1) {
            console.log(sender.tab.url);
            console.log(request);
        }
    }
);


