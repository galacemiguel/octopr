import octiconCheck from "../img/octicon-check.svg";

const form = document.querySelector(".token-form");
const input = form.querySelector('input[name="access-token"]');
const btn = document.querySelector('button[type="submit"]');

chrome.storage.sync.get("accessToken", data => {
  if (data.accessToken) {
    input.value = data.accessToken;
    input.style.backgroundImage = `url(${octiconCheck})`;
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  chrome.storage.sync.set({ accessToken: input.value });
  input.style.backgroundImage = `url(${octiconCheck})`;
  btn.disabled = true;
});

input.addEventListener("input", event => {
  input.style.backgroundImage = "none";
  btn.disabled = !event.target.value;
});
