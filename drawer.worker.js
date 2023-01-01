/**
 * @typedef Payload
 * @property {ImageData} imageData
 * @property {{padding: number, nbOfCirclePerWidth: number, nbColorsPalette: number}} opts
 */

/**
 * @param {MessageEvent<Payload>} e
 */
onmessage = (e) => {
  const imageData = e.data.imageData;
  const maxSize = imageData.width > imageData.height ? imageData.width : imageData.height;

  const { nbOfCirclePerWidth, padding, nbColorsPalette } = e.data.opts;

  let palette = undefined;

  if (nbColorsPalette) {
    console.log("Extracting color palette");
    palette = getColorsPalette(extractColors(imageData), nbColorsPalette);
    console.log("Extracting color palette done");
  }

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
    const color = getAverageColor(colors);

    return color;
  };

  const r = pixelSize / 2 - padding;

  if (r < 1) throw Error("padding is too high");

  /**
   * @param {Uint8ClampedArray} color
   */
  const colorToRgb = ([red, blue, green]) => `rgb(${red}, ${blue}, ${green})`;

  for (let x = 0; x <= imageData.width; x += pixelSize) {
    // console.log("computePixelMap : %s%", Math.round((x / imageData.width) * 100));
    for (let y = 0; y <= imageData.height; y += pixelSize) {
      let color = getAverageColorFromPart(x, y);

      if (color.every((c) => c > 250)) continue;

      if (palette) {
        color = getClosestColor(color, palette);
      }

      postMessage({
        cx: String(x + pixelSize / 2),
        cy: String(y + pixelSize / 2),
        r: String(r),
        fill: colorToRgb(color),
      });
    }
  }
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
function getAverageColor(colors) {
  const qty = colors.length;

  const color = [0, 1, 2]
    // sum every pow element
    .map((i) => colors.map((c) => Math.pow(c[i], 2)).reduce((a, b) => a + b, 0))
    .map((c) => Math.sqrt(c / qty));

  return new Uint8ClampedArray(color);
}

/**
 * Do an euclidean distance over all colors and find the closest
 * @param {Uint8ClampedArray} color
 * @param {Uint8ClampedArray[]} palette
 */
function getClosestColor(color, palette) {
  let i = 0;
  let distance = Infinity;

  const [cr, cg, cb] = color;

  for (let index = 0; index < palette.length; index++) {
    const [r, g, b] = palette[index];
    const currentDistance = Math.sqrt(Math.pow(cr - r, 2) + Math.pow(cg - g, 2) + Math.pow(cb - b, 2));
    if (distance > currentDistance) {
      i = index;
      distance = currentDistance;
    }
  }

  return palette[i];
}

/**
 * @param {Uint8ClampedArray[]} rgbValues
 */
function findBiggestColorRange(rgbValues) {
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbValues.forEach(([r, g, b]) => {
    rMin = Math.min(rMin, r);
    gMin = Math.min(gMin, g);
    bMin = Math.min(bMin, b);

    rMax = Math.max(rMax, r);
    gMax = Math.max(gMax, g);
    bMax = Math.max(bMax, b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return 0;
  } else if (biggestRange === gRange) {
    return 1;
  } else {
    return 2;
  }
}

/**
 * https://dev.to/producthackers/creating-a-color-palette-with-javascript-44ip
 * @param {Uint8ClampedArray[]} rgbValues
 * @param {number} nb
 * @param {number} depth
 */
function getColorsPalette(rgbValues, nb, depth = 0) {
  if (depth >= nb - 1 || rgbValues.length === 0) {
    return [getAverageColor(rgbValues)];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = rgbValues.length / 2;
  return [
    ...getColorsPalette(rgbValues.slice(0, mid), nb, depth + 1),
    ...getColorsPalette(rgbValues.slice(mid + 1), nb, depth + 1),
  ];
}

/**
 * @param {ImageData} imageData
 */
function extractColors(imageData) {
  const rgbValues = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    rgbValues.push(new Uint8ClampedArray([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]));
  }
  return rgbValues;
}
