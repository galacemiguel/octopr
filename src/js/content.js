import insertPullShortcut from "./pull_shortcut";

chrome.storage.sync.get("accessToken", data => {
  chrome.runtime.onMessage.addListener(message => {
    switch (message.type) {
      case "PULL_SHORTCUT":
        insertPullShortcut(message.payload, {
          accessToken: data.accessToken
        });
        break;
    }
  });
});
