import { loadCanvasWithImage } from "./canvas";
import { loadImage } from "./image";

const svgNS = "http://www.w3.org/2000/svg";

/**
 * @typedef DrawOptions
 * @property {number} [padding]
 * @property {number} [nbOfCirclePerWidth]
 * @property {number} [nbColorsPalette] define the limit of color to display the image
 * @property {string} [filter]
 */

/**
 * @param {string | HTMLInputElement} imagePath
 * @param {DrawOptions} opts
 */
export async function draw(imagePath, opts = {}) {
  const nbOfCirclePerWidth = opts.nbOfCirclePerWidth ?? 50;
  const padding = opts.padding ?? 3;

  const img = await loadImage(imagePath);

  // console.log(a);

  const canvas = await loadCanvasWithImage(img, opts.filter);

  const context = canvas.getContext("2d");
  if (context === null) throw Error("could not get context");

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
  svg.setAttribute("height", "100%");
  svg.setAttribute("width", "100%");

  const worker = new Worker(new URL("../drawer.worker.js", import.meta.url));
  worker.postMessage({ imageData, opts: { nbOfCirclePerWidth, padding, nbColorsPalette: opts.nbColorsPalette } });

  /**
   *
   * @param {MessageEvent<{cx: string, cy: string, r: string, fill: string}>} e
   */
  worker.onmessage = (e) => {
    const circle = document.createElementNS(svgNS, "circle");

    const { cx, cy, fill, r } = e.data;

    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", fill);
    svg.appendChild(circle);
  };

  return svg;
}
