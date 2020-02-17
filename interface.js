var ws281x = require('rpi-ws281x-v2');
class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  translatePixelCoordinates(x, y) {
      x = x % Math.sqrt(this.pixel_amount);
      y = y % Math.sqrt(this.pixel_amount);
      if (y % 2 == 0) {
        x = -x;
      }
      return y * Math.sqrt(this.pixel_amount) + x;
  }

  setPixel(x, y, r, g, b) {
    let color = r | g | b
    this.pixels[this.translatePixelCoordinates(x, y)] = color;
  }

  constructor(pixel_amount) {
    this.pixel_amount = pixel_amount;
    ws281x.configure({leds:this.pixel_amount, gpio:18, strip:'rgb'});
    this.pixels = new Uint32Array(pixel_amount);
  }
}

module.exports = Interface
