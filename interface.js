var ws281x = require('rpi-ws281x-v2');
var PNG = require('png-js');

class Interface {
  updateScreen() {
      ws281x.render(this.pixels);
  }

  translatePixelCoordinates(x, y) {
<<<<<<< HEAD
      return y * this.side + x;
=======
    x = x % this.width;
    y = y % this.width;

    let pix = 0;
    if(y % 2 == 0) {
      pix = y * this.width + x;
    } else {
      pix = y * this.width + this.width - 1 - x;
    }

    return pix;
>>>>>>> 1e6428dbdd721af9b9146e8e546f9b2da687268e
  }

  setPixel(x, y, r, g, b) {
    let color = r | g | b
    this.pixels[this.translatePixelCoordinates(x, y)] = color;
  }

<<<<<<< HEAD
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
=======
  constructor(pixel_amount) {
    this.pixel_amount = pixel_amount;
    ws281x.configure({leds:this.pixel_amount, gpio:18, strip:'rgb'});
    this.pixels = new Uint32Array(pixel_amount);
    this.width = Math.sqrt(this.pixel_amount);
>>>>>>> 1e6428dbdd721af9b9146e8e546f9b2da687268e
  }

}

module.exports = Interface
