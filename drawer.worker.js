// import { getPixelColor } from "./src/image-data";

// getPixelColor();

/**
 * @typedef Payload
 * @property {ImageData} imageData
 * @property {{padding: number, nbOfCirclePerWidth: number}} opts
 */

/**
 * @param {MessageEvent<Payload>} e
 */
onmessage = (e) => {
  const imageData = e.data.imageData;
  const maxSize = imageData.width > imageData.height ? imageData.width : imageData.height;

  const { nbOfCirclePerWidth, padding } = e.data.opts;

  const pixelSize = Math.round(maxSize / nbOfCirclePerWidth);

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

  // const svg = document.createElementNS(svgNS, "svg");
  // svg.setAttribute("viewBox", `0 0 ${imageData.width} ${imageData.height}`);

  for (let x = 0; x <= imageData.width; x += pixelSize) {
    console.log("computePixelMap : %s%", Math.round((x / imageData.width) * 100));
    for (let y = 0; y <= imageData.height; y += pixelSize) {
      // context.getImageData(x, y, 1, 1).data;

      const [red, blue, green] = getAverageColorFromPart(x, y);
      const color = `rgb(${red}, ${blue}, ${green})`;

      postMessage({
        cx: String(x + pixelSize / 2),
        cy: String(y + pixelSize / 2),
        r: String(pixelSize / 2 - padding),
        fill: color,
      });
    }
  }

  // return svg;

  // console.log("Message received from main script", e.data);
  // const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  // console.log("Posting message back to main script");
  // postMessage(workerResult);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 */
function getColorIndicesForCoord(x, y, width) {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
}

/**
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 */
function getPixelColor(imageData, x, y) {
  const [r, g, b, a] = getColorIndicesForCoord(x, y, imageData.width);

  const data = imageData.data;

  return new Uint8ClampedArray([data[r], data[g], data[b], data[a]]);
}

/**
 * Average color, the right way
 * https://sighack.com/post/averaging-rgb-colors-the-right-way
 *
 * @param {Uint8ClampedArray[]} colors
 */
function getAverageColor(...colors) {
  const qty = colors.length;

  const color = [0, 1, 2]
    // sum every pow element
    .map((i) => colors.map((c) => Math.pow(c[i], 2)).reduce((a, b) => a + b, 0))
    .map((c) => Math.sqrt(c / qty));

  return new Uint8ClampedArray(color);
}