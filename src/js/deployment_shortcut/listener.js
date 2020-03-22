const sendDeploymentShortcutMessage = details => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "DEPLOYMENT_SHORTCUT",
      payload: {
        path: details.url
      }
    });
  });
};

const deploymentShortcutEventFilter = {
  urls: ["https://github.com/*/*/pull/*"]
};

const listenToDeploymentShortcutEvent = () => {
  chrome.webNavigation.onCompleted.addListener(
    sendDeploymentShortcutMessage,
    deploymentShortcutEventFilter
  );

  chrome.webRequest.onCompleted.addListener(
    sendDeploymentShortcutMessage,
    deploymentShortcutEventFilter
  );
};

export default listenToDeploymentShortcutEvent;
