import Octokit from "@octokit/rest";

export const getPulls = (accessToken, issueData, callback) => {
  const octokit = Octokit({
    auth: accessToken
  });

  octokit.issues
    .listEventsForTimeline({
      owner: issueData.owner,
      repo: issueData.repo,
      issue_number: issueData.number,
      per_page: 100
    })
    .then(result => {
      const pulls = result.data
        .filter(event => {
          return (
            event.event === "cross-referenced" &&
            event.source.issue.pull_request
          );
        })
        .map(event => {
          return {
            repo: event.source.issue.repository.full_name,
            number: event.source.issue.number,
            url: event.source.issue.html_url
          };
        });

      callback(pulls);
    });
};

export const createPrOcticon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 12 16");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("fill-rule", "evenodd");
  path.setAttribute(
    "d",
    "M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"
  );

  svg.appendChild(path);

  return svg;
};
