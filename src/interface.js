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
                this.setPixel(y, x, new Color(r, g, b));
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
      console.log();
      for (let row = 0; row < width; row++) {
        let line = "";
        for (let col = 0; col < width; col++) {
          line += chalk.rgb(...this.pixels[row][col].asArray()).bold("■ ");
        }
        console.log(line);
      }
      return;
    }

    const pixelStrip = new Uint32Array(pixelAmount);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        let pix = 0;
        if (y % 2 == 0) {
          pix = y * width + x;
        } else {
          pix = y * width + width - 1 - x;
        }

        pixelStrip[pix] = pixels[x][y].getUInt();
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
    return (this.red << 16) | (this.green << 8) | this.blue;
  }

  asArray() {
    return [this.r, this.g, this.b];
  }
}

module.exports = { Interface, Color };
