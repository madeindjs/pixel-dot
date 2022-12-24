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
export function getPixelColor(imageData, x, y) {
  const [r, g, b, a] = getColorIndicesForCoord(x, y, imageData.width);

  const data = imageData.data;

  return new Uint8ClampedArray([data[r], data[g], data[b], data[a]]);
}
