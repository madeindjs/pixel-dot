const sum = (a) => a.reduce((a, b) => a + b.a, 0);

/**
 * Average color, the right way
 * https://sighack.com/post/averaging-rgb-colors-the-right-way
 *
 * @param {Uint8ClampedArray[]} colors
 */
export function getAverageColor(...colors) {
  const qty = colors.length;

  const color = [0, 1, 2]
    // sum every pow element
    .map((i) => colors.map((c) => Math.pow(c[i], 2)).reduce((a, b) => a + b, 0))
    .map((c) => Math.sqrt(c / qty));

  return new Uint8ClampedArray(color);
}
