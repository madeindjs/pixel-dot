importScripts("./colors/average");
importScripts("./colors/closest");
importScripts("./colors/image-data");

/**
 * @typedef DrawerPayload
 * @property {ImageData} imageData
 * @property {{padding: number, nbOfCirclePerWidth: number, palette: Uint8ClampedArray[]}} opts
 */

/**
 * @param {MessageEvent<DrawerPayload>} e
 */
onmessage = (e) => {
  const imageData = e.data.imageData;
  const maxSize = imageData.width > imageData.height ? imageData.width : imageData.height;

  const { nbOfCirclePerWidth, padding, palette } = e.data.opts;

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

        if (color[3] === 0) continue;

        colors.push(color);
      }
    }
    const color = getAverageColor(colors);

    return color;
  };

  const r = pixelSize / 2 - padding;

  if (r < 1) throw Error("padding is too high");

  /**
   * @param {Uint8ClampedArray} color
   */
  const colorToRgb = (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

  for (let x = 0; x <= imageData.width; x += pixelSize) {
    for (let y = 0; y <= imageData.height; y += pixelSize) {
      let color = getAverageColorFromPart(x, y);

      const shouldDrawPalette = palette && y === 0 && x > imageData.width - palette.length * pixelSize;

      if (shouldDrawPalette) {
        const currentWidth = imageData.width - x;
        const i = Math.floor(currentWidth / pixelSize);
        color = palette[i];
      } else if (color[3] === 0 || color.every((c) => c > 250)) {
        // default color
        color = new Uint8ClampedArray([240, 250, 250]);
      } else if (palette) {
        if ((palette && y === 0) || y === 1) continue;
        color = getClosestColor(color, palette);
      }

      postMessage({
        cx: String(x + pixelSize / 2),
        cy: String(y + pixelSize / 2),
        r: String(r),
        fill: colorToRgb(color),
        progress: Math.round((x / imageData.width) * 100),
      });
    }
  }
};
