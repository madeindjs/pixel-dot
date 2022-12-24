import { loadCanvasWithImage } from "./canvas";

const svgNS = "http://www.w3.org/2000/svg";

/**
 * @param {string} imagePath
 * @param {{padding?: number, nbOfCirclePerWidth?: number, filter?: string}} opts
 */
export async function draw(imagePath, opts = {}) {
  const nbOfCirclePerWidth = opts.nbOfCirclePerWidth ?? 50;
  const padding = opts.padding ?? 3;

  const canvas = await loadCanvasWithImage(imagePath, opts.filter);

  const context = canvas.getContext("2d");
  if (context === null) throw Error("could not get context");

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

  const worker = new Worker(new URL("../drawer.worker.js", import.meta.url));
  worker.postMessage({ imageData, opts: { nbOfCirclePerWidth, padding } });

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
