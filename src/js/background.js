import listenToPullShortcutEvent from "./pull_shortcut/listener";
import listenToDeploymentShortcutEvent from "./deployment_shortcut/listener";

listenToPullShortcutEvent();
listenToDeploymentShortcutEvent();

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.openOptionsPage();
});
