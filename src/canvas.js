import { getFitDimensions } from "./geo";

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
 * @param {string} path
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function loadCanvasWithImage(path) {
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
