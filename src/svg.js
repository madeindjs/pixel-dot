import { loadCanvasWithImage } from "./canvas";
import { getAverageColor } from "./color";
import { getPixelColor } from "./image-data";

const svgNS = "http://www.w3.org/2000/svg";

/**
 * @param {string} imagePath
 * @param {{padding?: number, nbOfCirclePerWidth?: number}} opts
 */
export async function draw(imagePath, opts = {}) {
  const nbOfCirclePerWidth = opts.nbOfCirclePerWidth ?? 50;
  const padding = opts.padding ?? 3;

  const canvas = await loadCanvasWithImage(imagePath);

  const context = canvas.getContext("2d");
  if (context === null) throw Error("could not get context");

  const maxSize = canvas.width > canvas.height ? canvas.width : canvas.height;

  const pixelSize = Math.round(maxSize / nbOfCirclePerWidth);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  /**
   * @param {number} x
   * @param {number} y
   */
  const getAverageColorFromPart = (x, y) => {
    const colors = [];

    const xMax = x + pixelSize;
    const yMax = y + pixelSize;

    for (let px = x; px < xMax; px++) {
      for (let py = y; py < yMax; py++) {
        const color = getPixelColor(imageData, px, py);

        colors.push(color);
      }
    }
    const color = getAverageColor(...colors);

    return color;
  };

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

  for (let x = 0; x <= canvas.width; x += pixelSize) {
    console.log("computePixelMap : %s%", Math.round((x / canvas.width) * 100));
    for (let y = 0; y <= canvas.height; y += pixelSize) {
      context.getImageData(x, y, 1, 1).data;

      const [red, blue, green] = getAverageColorFromPart(x, y);
      const color = `rgb(${red}, ${blue}, ${green})`;

      const circle = document.createElementNS(svgNS, "circle");

      circle.setAttribute("cx", String(x + pixelSize / 2));
      circle.setAttribute("cy", String(y + pixelSize / 2));
      circle.setAttribute("r", String(pixelSize / 2 - padding));
      circle.setAttribute("fill", color);

      svg.appendChild(circle);
    }
  }

  return svg;
}
