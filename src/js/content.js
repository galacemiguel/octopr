import insertPullShortcut from "./pull_shortcut";
import insertDeploymentShortcut from "./deployment_shortcut";

chrome.storage.sync.get("accessToken", data => {
  chrome.runtime.onMessage.addListener(message => {
    switch (message.type) {
      case "PULL_SHORTCUT":
        insertPullShortcut(message.payload, {
          accessToken: data.accessToken
        });
        break;
      case "DEPLOYMENT_SHORTCUT":
        insertDeploymentShortcut(message.payload);
    }
  });
});
