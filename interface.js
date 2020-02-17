var ws281x = require('rpi-ws281x-v2');
var PNG = require('png-js');

class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  translatePixelCoordinates(x, y) {
      return y * this.side + x;
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
    this.side = Math.sqrt(this.pixel_amount);
  }

  clearScreen() {
    for (let x, x <= this.side, x++) {
      for (let y, y <= this.side, y++) {
        setPixel(x,y,0,0,0);
      }
    }
  }

}

module.exports = Interface
