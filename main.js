import { downloadSvg } from "./src/download";
import { draw } from "./src/svg";
import "./style.css";

const app = document.getElementById("app");
/** @type {HTMLInputElement} */
// @ts-ignore
const paddingEl = document.getElementById("padding");
/** @type {HTMLInputElement} */
// @ts-ignore
const nbOfCirclePerWidth = document.getElementById("nbOfCirclePerWidth");
/** @type {HTMLButtonElement} */
// @ts-ignore
const clearCache = document.getElementById("clearCache");
/** @type {HTMLButtonElement} */
// @ts-ignore
const saveImage = document.getElementById("saveImage");

async function refresh() {
  document.querySelector("svg")?.remove();
  const svg = await draw("image2.jpeg", {
    padding: Number(paddingEl.value),
    nbOfCirclePerWidth: Number(nbOfCirclePerWidth.value),
  });
  app?.appendChild(svg);
}

clearCache.onclick = () => {
  localStorage.clear();
  refresh();
};

paddingEl.onchange = refresh;
nbOfCirclePerWidth.onchange = refresh;
window.onload = refresh;
saveImage.onclick = () => {
  downloadSvg(document.querySelector("svg"));
};
