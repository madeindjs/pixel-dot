import { getFitDimensions } from "./geo";

/**
 * @param {HTMLImageElement} img
 * @param {string | undefined} filter
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function loadCanvasWithImage(img, filter = undefined) {
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const [canvasWidth, canvasHeight] = getFitDimensions(imgWidth, imgHeight);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d");
  if (context === null) throw Error();

  if (filter) context.filter = filter;

  let s = {
    width: canvasWidth,
    height: canvasHeight,
    offsetX: (img.naturalWidth - canvasWidth) * 0.5,
    offsetY: (img.naturalHeight - canvasHeight) * 0.5,
  };

  console.log("Loading image", s);

  context.drawImage(img, s.offsetX, s.offsetY, s.width, s.height, 0, 0, canvasWidth, canvasHeight);

  // console.log(context);

  return canvas;
}
