export default class ScreenInterface {}

export class Color {
  /**
   *
   * @param {Number} r
   * @param {Number} g
   * @param {Number} b
   */
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /**
   * @returns {string}
   */
  getHex() {
    return "0x" + convert.rgb.hex(r, g, b);
  }

  /**
   *
   * @returns {Number}
   */
  getUInt() {
    return (this.r << 16) | (this.g << 8) | this.b;
  }

  asArray() {
    return [this.r, this.g, this.b];
  }
}

export type Frame = Color[][];
