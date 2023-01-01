import { getColorsPalette } from "./palette";
// const {getPalette} = require('./color-palette')

describe(getColorsPalette.name, () => {
  const getColor = (i) => new Uint8ClampedArray([i, i, i]);

  xit("should get middle with 3 items", () =>
    expect(
      getColorsPalette(
        new Array(3).fill(undefined).map((_, i) => getColor(i)),
        1
      )
    ).toStrictEqual([new Uint8ClampedArray([1, 1, 1])]));

  it("should get middle with 5 items", () =>
    expect(
      getColorsPalette(
        new Array(5).fill(undefined).map((_, i) => getColor(i)),
        2
      )
    ).toStrictEqual([new Uint8ClampedArray([1, 1, 1]), new Uint8ClampedArray([4, 4, 4])]));
});
