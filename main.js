import { Alert } from "./src/components/alert";
import { Progress } from "./src/components/progress";
import { downloadSvg } from "./src/download";
import { draw } from "./src/draw";
import { loadImage } from "./src/image";
import "./style.css";

const app = document.getElementById("app");

/** @type {HTMLInputElement} */
// @ts-ignore
const imageInput = document.getElementById("imageInput");
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
/** @type {HTMLInputElement} */
// @ts-ignore
const paletteEl = document.getElementById("nbPalette");

const getSvg = () => document.querySelector("svg");

showOriginalImage.onchange = () => {
  if (!app) throw Error();

  app.innerHTML = "";

  if (showOriginalImage.checked) {
    loadImage(imageInput).then((img) => app?.appendChild(img));
  } else {
    refresh();
  }
};

async function refresh() {
  if (!app) throw Error();

  app.innerHTML = "";

  if (!imageInput.files?.length) {
    app?.append(Alert("You need to upload an image"));
    return;
  }

  const { element: progress, update: updateProgress } = Progress();

  document.querySelector(".toolbar__settings")?.append(progress);

  try {
    const svg = await draw(
      imageInput,
      {
        padding: Number(paddingEl.value),
        nbOfCirclePerWidth: Number(nbOfCirclePerWidth.value),
        filter: filter.value,
        nbColorsPalette: Number(paletteEl.value) || undefined,
      },
      updateProgress
    );
    app.appendChild(svg);
  } catch (e) {
    const retry = document.createElement("button");
    retry.innerText = "Oops! Retry";
    retry.onclick = refresh;

    app.append(retry);
  } finally {
    progress.remove();
  }
}

imageInput.onchange = refresh;
paddingEl.onchange = refresh;
nbOfCirclePerWidth.onchange = refresh;
paletteEl.onchange = refresh;
filter.onchange = refresh;
window.onload = refresh;
saveImage.onclick = () => {
  const svg = getSvg();
  if (svg) downloadSvg(svg);
};
