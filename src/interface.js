const convert = require("color-convert");
const PNG = require("pngjs").PNG;
const fs = require("fs");
const chalk = require("chalk");

class Interface {
  /**
   * @type {Color[][]}
   */
  pixels;

  /**
   *
   * @param {number} pixelAmount
   * @param {boolean} isOnlyEmulating
   */
  constructor(pixelAmount, isOnlyEmulating) {
    this.isOnlyEmulating = isOnlyEmulating;
    this.pixelAmount = pixelAmount;

    this.width = Math.sqrt(pixelAmount);

    if (!isOnlyEmulating) {
      this.ws281x = require("rpi-ws281x");
      this.ws281x.configure({ leds: pixelAmount, gpio: 18, strip: "rgb" });
    }

    this.clearScreen();
  }

  getWidth() {
    return this.width;
  }

  async drawPng(file) {
    return new Promise((resolve) => {
      fs.createReadStream(file)
        .pipe(new PNG())
        .on("parsed", (data) => {
          for (let y = 0; y < 12; y++) {
            for (let x = 0; x < 12; x++) {
              const idx = (12 * y + x) << 2;

              const [r, g, b, a] = [
                data[idx + 0],
                data[idx + 1],
                data[idx + 2],
                data[idx + 3],
              ];

              if (a > 128) {
                this.setPixel(x, y, new Color(r, g, b));
              }
            }
          }

          resolve(this);
        });
    });
  }

  updateScreen() {
    const { pixelAmount, width, pixels } = this;

    if (this.isOnlyEmulating) {
      let fieldPrint = "";
      for (let row = 0; row < width; row++) {
        fieldPrint += "\n";
        for (let col = 0; col < width; col++) {
          fieldPrint += chalk
            .rgb(...this.pixels[col][row].asArray())
            .bold("■ ");
        }
      }
      console.log(fieldPrint);
      return;
    }

    const pixelStrip = new Uint32Array(pixelAmount);

    let orientedPixels = getCopyOfMatrix(pixels);

    const orientation = process.env.ORIENTATION || 0;

    for (let i = 0; i < orientation; i++) {
      orientedPixels = rotate(orientedPixels);
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        let pix = 0;
        if (y % 2 == 0) {
          pix = y * width + x;
        } else {
          pix = y * width + width - 1 - x;
        }

        pixelStrip[pix] = orientedPixels[x][y].getUInt();
      }
    }

    this.ws281x.render(pixelStrip);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {Color} color
   */
  setPixel(x, y, color) {
    if (x < this.width && y < this.width && x >= 0 && y >= 0)
      this.pixels[x][y] = color;
  }

  clearScreen() {
    this.fillScreen(new Color(0, 0, 0));
  }

  /**
   *
   * @param {Color} color
   */
  fillScreen(color) {
    this.pixels = [...Array(this.width)].map((e) =>
      Array(this.width).fill(color)
    );
  }
}

class Color {
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

module.exports = { Interface, Color };

function rotate(matrix) {
  const n = matrix.length;
  const x = Math.floor(n / 2);
  const y = n - 1;
  for (let i = 0; i < x; i++) {
    for (let j = i; j < y - i; j++) {
      k = matrix[i][j];
      matrix[i][j] = matrix[y - j][i];
      matrix[y - j][i] = matrix[y - i][y - j];
      matrix[y - i][y - j] = matrix[j][y - i];
      matrix[j][y - i] = k;
    }
  }

  return matrix;
}

function getCopyOfMatrix(mat) {
  return mat.map((row) => row.map((col) => col));
}
