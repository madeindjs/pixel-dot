/**
 * @param {ImageData} imageData
 */
function extractColors(imageData) {
  const rgbValues = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    rgbValues.push(
      new Uint8ClampedArray([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]])
    );
  }
  return rgbValues;
}

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
