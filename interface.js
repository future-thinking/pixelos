var ws281x = require('rpi-ws281x-v2');
class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  translatePixelCoordinates(x, y) {
      return y * Math.sqrt(this.pixel_amount) + x;
  }

  setPixel(x, y, r, g, b) {
    let color = r | g | b
    this.pixels[transatePixelCoordinates(x, y)] = color;
  }

  constructor(pixels) {
    this.pixel_amount = pixels;
    ws281x.configure({leds:pixels, gpio:18, strip:'rgb'});
    this.updateScreen();
    this.pixels = new Uint32Array(pixels);
  }
}

module.exports = Interface
