/**
 * @param {HTMLInputElement} input
 * @returns {Promise<HTMLImageElement>}
 */
function loadImageFromInput(input) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      if (!e.target?.result) {
        return reject("could not lod image");
      }

      // @ts-ignore
      img.src = e.target.result;
      resolve(img);
    };

    if (!input.files?.[0]) {
      return reject("File not uploaded");
    }

    reader.readAsDataURL(input.files[0]);
  });
}

/**
 * @param {string} path
 * @returns {Promise<HTMLImageElement>}
 */
function loadImageFromPath(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("src", path);

    img.onload = () => {
      resolve(img);
    };
  });
}

/**
 * @param {string | HTMLInputElement} path
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(path) {
  if (typeof path === "string") {
    return loadImageFromPath(path);
  }
  return loadImageFromInput(path);
}
