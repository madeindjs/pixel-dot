/**
 * @param {HTMLImageElement} img
 * @param {string | undefined} filter
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function loadCanvasWithImage(img, filter = undefined) {
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = imgWidth;
  canvas.height = imgHeight;

  const context = canvas.getContext("2d");
  if (context === null) throw Error();

  if (filter) context.filter = filter;

  console.log("Loading image", { imgWidth, imgHeight });

  context.drawImage(img, 0, 0, imgWidth, imgHeight);

  return canvas;
}

/**
 * @param {ImageData} imageData
 */
export function extractColors(imageData) {
  const rgbValues = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    rgbValues.push(new Uint8ClampedArray([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]));
  }
  return rgbValues;
}
