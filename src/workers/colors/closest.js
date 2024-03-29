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
    const currentDistance = Math.sqrt(
      [0, 1, 2].map((i) => Math.pow(color[i] - palette[index][i], 2)).reduce((acc, v) => acc + v, 0)
    );

    // const [r, g, b] = palette[index];
    // const currentDistance = Math.sqrt(Math.pow(cr - r, 2) + Math.pow(cg - g, 2) + Math.pow(cb - b, 2));
    if (distance > currentDistance) {
      i = index;
      distance = currentDistance;
    }
  }

  return palette[i];
}
