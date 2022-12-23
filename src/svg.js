import { getAverageColor } from "./color";

const svgNS = "http://www.w3.org/2000/svg";

function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("src", path);

    img.onload = () => {
      resolve(img);
    };
  });
}

/**
 * @param {number} width
 * @param {number} height
 */
function getFitDimensions(width, height, max = 1000) {
  const maxSize = width > height ? width : height;

  if (maxSize < max) return [width, height];

  const ratio = maxSize / max;

  return [width * ratio, height * ratio, ratio];
}

/**
 * @param {string} path
 * @returns {Promise<HTMLCanvasElement>}
 */
async function loadCanvasWithImage(path) {
  const img = await loadImage(path);

  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const [canvasWidth, canvasHeight] = getFitDimensions(imgWidth, imgHeight);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d");
  if (context === null) throw Error();

  let s = {
    width: canvasWidth,
    height: canvasHeight,
    offsetX: (img.naturalWidth - canvasWidth) * 0.5,
    offsetY: (img.naturalHeight - canvasHeight) * 0.5,
  };
  context.drawImage(img, s.offsetX, s.offsetY, s.width, s.height, 0, 0, canvasWidth, canvasHeight);

  return canvas;
}

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

  const pixelSize = Math.round(canvas.width / nbOfCirclePerWidth);

  /**
   * @param {number} x
   * @param {number} y
   */
  const getAverageColorFromPart = (x, y) => {
    const colors = [];

    const xMax = x + pixelSize;
    const yMax = y + pixelSize;

    const cacheKey = JSON.stringify({ imagePath, pixelSize, x, y });
    const cache = localStorage.getItem(cacheKey);
    // if (cache) return JSON.parse(cache);

    for (let px = x; px < xMax; px++) {
      for (let py = y; py < yMax; py++) {
        const color = context.getImageData(px, py, 1, 1).data;

        colors.push(color);
      }
    }
    const color = getAverageColor(...colors);

    // localStorage.setItem(cacheKey, JSON.stringify(color));
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
