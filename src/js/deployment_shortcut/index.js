import { authorizedFetch, getStorageData, setStorageData } from "../utils";

const fetchPullCommits = async ({ owner, repo, pullNumber }) => {
  const response = await authorizedFetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/commits`
  );
  const data = await response.json();

  return data;
};

const fetchDeployments = async ({ owner, repo, sha }) => {
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/deployments`
  );
  const searchParams = new URLSearchParams(
    sha.map(s => `sha[]=${s}`).join("&")
  );
  url.search = searchParams;
  const response = await authorizedFetch(url);
  const data = await response.json();

  return data;
};

const fetchDeploymentStatuses = async urls => {
  const responses = await Promise.all(urls.map(url => authorizedFetch(url)));
  const data = await Promise.all(responses.map(response => response.json()));

  return data.map(d => d[0]);
};

const createDeploymentButton = deploymentStatus => {
  const element = document.createElement("a");
  element.setAttribute("data-octopr", "");
  element.setAttribute("class", "btn btn-sm btn-outline ml-2 float-right");
  element.setAttribute("target", "_blank");
  element.setAttribute("rel", "noopener noreferrer");
  element.setAttribute("href", deploymentStatus.target_url);
  element.textContent = deploymentStatus.environment;

  return element;
};

const insertButtonsIntoHeader = buttons => {
  const mainHeader = document.querySelector(".gh-header-meta");

  buttons.forEach(button => {
    const container = document.createElement("div");
    container.setAttribute("class", "TableObject-item");
    container.appendChild(button.cloneNode(true));
    mainHeader.appendChild(container);
  });

  const stickyHeader = document.querySelector(".gh-header-sticky.js-sticky");
  const container = document.createElement("div");

  stickyHeader.firstElementChild.firstElementChild.appendChild(container);

  buttons.forEach(button => {
    container.appendChild(button.cloneNode(true));
  });
};

const insertDeploymentShortcut = async payload => {
  const pathSplit = payload.path.split("/").splice(3);
  const [owner, repo, , pullNumber] = pathSplit;
  const pullCommits = await fetchPullCommits({ owner, repo, pullNumber });
  const pullCommitHashes = pullCommits.map(commit => commit.sha);

  const pullDeployments = await fetchDeployments({
    owner,
    repo,
    sha: pullCommitHashes
  });
  // Reverse because deployments are returned in reverse chronological order
  pullDeployments.reverse();
  const pullDeploymentEnvs = {};
  pullDeployments.forEach(deployment => {
    pullDeploymentEnvs[deployment.environment] = deployment;
  });

  const statusesUrls = Object.values(pullDeploymentEnvs).map(
    deployments => deployments.statuses_url
  );
  const deploymentStatuses = await fetchDeploymentStatuses(statusesUrls);

  const deploymentButtons = deploymentStatuses.map(createDeploymentButton);
  insertButtonsIntoHeader(deploymentButtons);
};

const main = async payload => {
  const isDeploymentShortcutPending = await getStorageData(
    "isDeploymentShortcutPending"
  );

  if (isDeploymentShortcutPending || document.querySelector("[data-octopr]")) {
    return;
  }

  await setStorageData({ isDeploymentShortcutPending: true });

  try {
    await insertDeploymentShortcut(payload);
  } finally {
    setStorageData({ isDeploymentShortcutPending: false });
  }
};

export default main;
