chrome.webRequest.onCompleted.addListener(
  details => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const requestPath = details.url.slice(details.initiator.length);
      const requestPathSplit = requestPath.split("/");

      chrome.tabs.sendMessage(tabs[0].id, {
        issuePath: requestPathSplit.slice(0, -1).join("/"),
        popoverType: requestPathSplit.slice(-1)[0]
      });
    });
  },
  {
    urls: [
      "https://github.com/*/*/issues/*/hovercard",
      "https://github.com/*/*/issues/*/show_from_project"
    ]
  }
);

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.openOptionsPage();
});
