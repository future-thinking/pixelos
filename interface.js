var ws281x = require('rpi-ws281x-v2');
class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  translatePixelCoordinates(x, y) {
    x = x % this.width;
    y = y % this.width;

    let pix = 0;
    if(y % 2 == 0) {
      pix = y * this.width + x;
    } else {
      pix = y * this.width + this.width - 1 - x;
    }

    return pix;
  }

  setPixel(x, y, r, g, b) {
    let color = r | g | b
    this.pixels[this.translatePixelCoordinates(x, y)] = color;
  }

  constructor(pixel_amount) {
    this.pixel_amount = pixel_amount;
    ws281x.configure({leds:this.pixel_amount, gpio:18, strip:'rgb'});
    this.pixels = new Uint32Array(pixel_amount);
    this.width = Math.sqrt(this.pixel_amount);
  }
}

module.exports = Interface
