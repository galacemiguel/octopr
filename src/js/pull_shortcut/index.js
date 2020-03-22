import HovercardHandler from "./handlers/hovercard";
import ShowFromProjectHandler from "./handlers/show-from-project";
import { createPrOcticon, getPulls } from "../utils";
import "../../css/content.css";

const POPOVER_HANDLER_MAP = {
  show_from_project: ShowFromProjectHandler,
  hovercard: HovercardHandler
};

const insertPullShortcut = (payload, { accessToken }) => {
  const issueDataSplit = payload.issuePath.split("/");
  const issueData = {
    owner: issueDataSplit[1],
    repo: issueDataSplit[2],
    number: issueDataSplit[4]
  };

  getPulls(accessToken, issueData, pulls => {
    const issueRepo = `${issueData.owner}/${issueData.repo}`;
    const pullLinks = buildPullLinks(pulls, issueRepo);

    const popoverHandler = new POPOVER_HANDLER_MAP[payload.popoverType](
      payload.issuePath
    );
    const elBefore = popoverHandler.getElBefore();

    popoverHandler.decorateLinkList(pullLinks);
    elBefore.parentNode.insertBefore(pullLinks, elBefore.nextElementSibling);
  });
};

const buildPullLinks = (pulls, issueRepo) => {
  if (!pulls.length) {
    return;
  }

  const pullList = document.createElement("ul");
  pullList.style.lineHeight = "0";

  pulls.forEach(pull => {
    const pullListItem = document.createElement("li");
    pullListItem.className = "d-inline-block mr-1 mb-1";

    const pullLink = buildPullLink(pull, issueRepo);

    pullListItem.appendChild(pullLink);
    pullList.appendChild(pullListItem);
  });

  return pullList;
};

const buildPullLink = (pull, issueRepo) => {
  const pullLink = document.createElement("a");
  pullLink.className = "TableObject-item";
  pullLink.href = pull.url;
  pullLink.target = "_blank";
  pullLink.rel = "noopener";
  pullLink.title = pull.title;
  pullLink.style.width = "unset";

  const pullIcon = createPrOcticon();
  pullIcon.setAttribute("class", "octicon octicon-git-pull-request");

  const pullSpan = document.createElement("span");
  pullSpan.className = "State State-outline";

  const textNode = document.createTextNode(
    pull.Repo === issueRepo ? `#${pull.number}` : ` ${pull.repo}#${pull.number}`
  );

  pullSpan.appendChild(pullIcon);
  pullSpan.appendChild(textNode);

  pullLink.appendChild(pullSpan);

  return pullLink;
};

export default insertPullShortcut;
