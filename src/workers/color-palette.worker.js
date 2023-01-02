importScripts("./colors/average");
importScripts("./colors/image-data");

/**
 * @typedef ColorPaletteWorkerPayload
 * @property {ImageData} imageData
 * @property {number} nbColorsPalette
 */

/**
 * @param {MessageEvent<ColorPaletteWorkerPayload>} e
 */
onmessage = (e) => {
  const { imageData, nbColorsPalette } = e.data;

  const colors = extractColors(imageData).filter((color) => color[3] !== 0);

  const palette = getColorsPalette(colors, nbColorsPalette);

  postMessage({
    palette,
  });
};

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
