const ws281x = require('rpi-ws281x-v2');
var PNG = require('png-js');
const convert = require('color-convert');

class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  getCorrectColor(r, g, b) {
    let color = "0x" + convert.rgb.hex(r, g, b);
    return color;
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
    this.pixels[this.translatePixelCoordinates(x, y)] = this.getCorrectColor(r, b, g);
  }

  constructor(pixel_amount) {
    this.pixel_amount = pixel_amount;
    ws281x.configure({leds:this.pixel_amount, gpio:18, strip:'rgb'});
    this.pixels = new Uint32Array(pixel_amount);
    this.width = Math.sqrt(this.pixel_amount);
  }

  clearScreen() {
    for (let p = 0; p < this.pixel_amount; p++) {
        this.pixels[p] = 0x000000;
  }
}

  fillScreen(r,g,b) {
    for (let p = 0; p < this.pixel_amount; p++) {
      this.pixels[p] = r,g,b;
  }
}

  drawFullscreenImage(path){
    PNG.decode(path, function(pixels) {
    // pixels is a 1d array (in rgba order) of decoded pixel data
    console.log(pixels);
      for (let p = 0; p < this.pixel_amount; p++) {
        color = pixels;
          this.pixels[p] = pixels
      }
    });
  }

}

module.exports = Interface
