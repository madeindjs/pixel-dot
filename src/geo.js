/**
 * @param {number} width
 * @param {number} height
 */
export function getFitDimensions(width, height, max = 1000) {
  const maxSize = width > height ? width : height;

  if (maxSize < max) return [width, height];

  const ratio = maxSize / max;

  return [width * ratio, height * ratio, ratio];
}
