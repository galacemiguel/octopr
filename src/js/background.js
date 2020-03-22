import listenToPullShortcutEvent from "./pull_shortcut/listener";

listenToPullShortcutEvent();

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.openOptionsPage();
});
