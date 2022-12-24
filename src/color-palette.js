/**
 * @param {ImageData} imageData

 */
function extractColors(imageData) {
  const rgbValues = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    // const rgb = ;
    rgbValues.push(new Uint8ClampedArray([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]));
  }
  return rgbValues;
}

/**
 * @param {Uint8ClampedArray[]} rgbValues
 * @returns
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
 * @param {Uint8ClampedArray[]} rgbValues
 * @param {number} depth
 */
function quantization(rgbValues, depth) {
  const MAX_DEPTH = 4;

  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const [r, g, b] = rgbValues.reduce(([pr, pg, pb], [r, g, b]) => {
      return new Uint8ClampedArray([(pr += r), (pg += g), (pb += b)]);
    }, new Uint8ClampedArray([0, 0, 0]));

    return [
      new Uint8ClampedArray([
        Math.round(r / rgbValues.length),
        Math.round(g / rgbValues.length),
        Math.round(b / rgbValues.length),
      ]),
    ];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = rgbValues.length / 2;
  return [...quantization(rgbValues.slice(0, mid), depth + 1), ...quantization(rgbValues.slice(mid + 1), depth + 1)];
}

console.log(
  quantization(
    [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ],
    1
  )
);
