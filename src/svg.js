import averageColor from "@bencevans/color-array-average";

const svgNS = "http://www.w3.org/2000/svg";

/**
 * @param {string} path
 * @returns {Promise<HTMLCanvasElement>}
 */
function loadCanvasWithImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("src", path);

    img.onload = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = imgWidth;
      canvas.height = imgHeight;

      canvas.getContext("2d")?.drawImage(img, 0, 0);

      resolve(canvas);
    };
  });
}

/**
 * @param {Uint8ClampedArray} color
 */
function rgbToHex(color) {
  return color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
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
    if (cache) return cache;

    for (let px = x; px < xMax; px++) {
      for (let py = y; py < yMax; py++) {
        const color = context.getImageData(px, py, 1, 1).data;

        colors.push(rgbToHex(color));
      }
    }
    const color = averageColor(colors);

    localStorage.setItem(cacheKey, color);
    return color;
  };

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

  for (let x = 0; x <= canvas.width; x += pixelSize) {
    console.log("computePixelMap : %s%", Math.round((x / canvas.width) * 100));
    for (let y = 0; y <= canvas.height; y += pixelSize) {
      context.getImageData(x, y, 1, 1).data;

      const color = getAverageColorFromPart(x, y);

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
