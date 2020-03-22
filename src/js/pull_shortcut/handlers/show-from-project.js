class ShowFromProjectHandler {
  constructor(issuePath) {
    this.issuePath = issuePath;
  }

  getElBefore() {
    const popoverEl = document.querySelector(".js-project-card-details-pane");
    const elBefore = popoverEl.querySelector(`a[href="${this.issuePath}"]`)
      .nextElementSibling;

    return elBefore;
  }

  decorateLinkList(linkList) {
    linkList.className = "mt-2";
  }
}

export default ShowFromProjectHandler;
