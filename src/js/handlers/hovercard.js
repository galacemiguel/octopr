class HovercardHandler {
  constructor(issuePath) {
    this.issuePath = issuePath;
  }

  getElBefore() {
    const popoverEl = document.querySelector(".js-hovercard-content");
    const elBefore = popoverEl.querySelector(`a[href="${this.issuePath}"]`)
      .parentElement.parentElement;

    return elBefore;
  }

  decorateLinkList(linkList) {
    linkList.className = "border-top mr-n3 ml-n3 mt-3 pt-3 px-3";
  }
}

export default HovercardHandler;
