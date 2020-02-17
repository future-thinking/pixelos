var ws281x = require('rpi-ws281x-v2');
class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  constructor(pixels) {
    ws281x.configure({leds:pixels, gpio:18, strip:'rgb'});
    this.pixels = new Uint32Array(pixels);

    var red = 255, green = 0, blue = 0;
    var color = (red << 16) | (green << 8)| blue;

    this.pixels[15] = color;

    this.updateScreen();
  }

}

module.exports = Interface
