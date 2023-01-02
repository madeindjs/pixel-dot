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
 * @param {((progress: number, status: string) => void) | undefined} progressCallBack
 */
export async function draw(imagePath, opts = {}, progressCallBack = undefined) {
  const nbOfCirclePerWidth = opts.nbOfCirclePerWidth ?? 50;
  const padding = opts.padding ?? 3;

  progressCallBack?.(0, "Loading image");

  const img = await loadImage(imagePath);

  progressCallBack?.(5, "Generating canvas");

  const canvas = await loadCanvasWithImage(img, opts.filter);

  const context = canvas.getContext("2d");
  if (context === null) throw Error("could not get context");

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
  svg.setAttribute("height", "100%");
  svg.setAttribute("width", "100%");

  let palette = undefined;

  if (opts.nbColorsPalette) {
    progressCallBack?.(10, "Generating color palette");
    console.log(img);

    const cacheKey = JSON.stringify({
      filter: opts.filter,
      nbColorsPalette: opts.nbColorsPalette,
      path: img.src.slice(0, 100),
    });

    const cache = localStorage.getItem(cacheKey);

    if (cache) {
      palette = JSON.parse(cache).palette;
      // console.log(palette);
    } else {
      palette = await getPalette(imageData, opts.nbColorsPalette);
      localStorage.setItem(cacheKey, JSON.stringify({ palette }));
    }
  }

  progressCallBack?.(50, "Drawing SVG");

  const worker = new Worker(new URL("./workers/drawer.worker.js", import.meta.url));
  worker.postMessage({ imageData, opts: { nbOfCirclePerWidth, padding, palette } });

  /**
   *
   * @param {MessageEvent<{cx: string, cy: string, r: string, fill: string, progress: number}>} e
   */
  worker.onmessage = (e) => {
    const circle = document.createElementNS(svgNS, "circle");

    const { cx, cy, fill, r, progress } = e.data;

    progressCallBack?.(50 + (50 * progress) / 100, "Drawing SVG");

    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", fill);
    svg.appendChild(circle);
  };

  return svg;
}

function getPalette(imageData, nbColorsPalette) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./workers/color-palette.worker.js", import.meta.url));
    /**
     * @param {MessageEvent<{palette: Uint8ClampedArray[]}>} e
     */
    worker.onmessage = (e) => resolve(e.data.palette);
    worker.postMessage({ imageData, nbColorsPalette });
  });
}
