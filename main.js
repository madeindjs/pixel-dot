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
/** @type {HTMLInputElement} */
// @ts-ignore
const filter = document.getElementById("filter");
/** @type {HTMLButtonElement} */
// @ts-ignore
const saveImage = document.getElementById("saveImage");
/** @type {HTMLInputElement} */
// @ts-ignore
const showOriginalImage = document.getElementById("showOriginalImage");

const getSvg = () => document.querySelector("svg");

showOriginalImage.onchange = () => {
  if (!app) throw Error();

  app.innerHTML = "";

  if (showOriginalImage.checked) {
    const img = new Image();
    img.setAttribute("src", "image2.jpeg");
    app?.appendChild(img);
  } else {
    refresh();
  }
};

async function refresh() {
  getSvg()?.remove();
  const svg = await draw("image2.jpeg", {
    padding: Number(paddingEl.value),
    nbOfCirclePerWidth: Number(nbOfCirclePerWidth.value),
    filter: filter.value,
  });
  app?.appendChild(svg);
}

paddingEl.onchange = refresh;
nbOfCirclePerWidth.onchange = refresh;
filter.onchange = refresh;
window.onload = refresh;
saveImage.onclick = () => {
  const svg = getSvg();
  if (svg) downloadSvg(svg);
};
