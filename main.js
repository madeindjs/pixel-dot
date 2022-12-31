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

const getSvg = () => document.querySelector("svg");

showOriginalImage.onchange = () => {
  if (!app) throw Error();

  app.innerHTML = "";

  if (showOriginalImage.checked) {
    loadImage(imageInput).then((img) => app?.appendChild(img));
    // const img = new Image();
    // img.setAttribute("src", "image2.jpeg");
    // ;
  } else {
    refresh();
  }
};

// function getImageUrlInput() {
//   return new Promise((resolve, reject) => {
//     const images = imageInput.files;

//     if (images === null) {
//       return reject("cannot get image");
//     }

//     const reader = new FileReader();

//     // reader.onload = function (e) {
//       $("#imageThumb").attr("src", e.target.result);
//     };
//     reader.readAsDataURL(input.files[0]);
//   });
// }

async function refresh() {
  getSvg()?.remove();
  // const images = imageInput.files;
  // console.log(images[0]);
  // const reader = new FileReader();
  // const path = reader.readAsDataURL(images[0]);

  // const path = window.URL.createObjectURL(images[0]);
  // console.log(path);

  const svg = await draw(imageInput, {
    padding: Number(paddingEl.value),
    nbOfCirclePerWidth: Number(nbOfCirclePerWidth.value),
    filter: filter.value,
  });
  console.log(svg);
  app?.appendChild(svg);
}

imageInput.onchange = refresh;
paddingEl.onchange = refresh;
nbOfCirclePerWidth.onchange = refresh;
filter.onchange = refresh;
window.onload = refresh;
saveImage.onclick = () => {
  const svg = getSvg();
  if (svg) downloadSvg(svg);
};
