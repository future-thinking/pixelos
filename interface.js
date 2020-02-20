const ws281x = require('rpi-ws281x-v2');
const convert = require('color-convert');
var PNG = require('png-js');


class Interface {

  constructor(pixel_amount, isOnlyEmulating) {
    this.isOnlyEmulating = isOnlyEmulating;
    this.pixel_amount = pixel_amount;
    if (!isOnlyEmulating) {
      ws281x.configure({leds:this.pixel_amount, gpio:18, strip:'rgb'});
    }
    this.pixels = new Uint32Array(pixel_amount);
    this.width = Math.sqrt(this.pixel_amount);
  }

  getWidth() {
    return this.width;
  }

  updateScreen() {
    if (!this.isOnlyEmulating) {
      ws281x.render(this.pixels);
    }
    if (emulating_sockets.length > 0) {
      let rows = new Array();
      for (let row = 0; row < 12; row++) {
        rows.push(new Array());
        for (let pixel = 0; pixel < 12; pixel++) {
          rows[row].push(this.pixels[this.translatePixelCoordinates(pixel, row)]);
        }
      }
      emulating_sockets.forEach((emu_socket, i) => {
        emu_socket.emit('pixup', rows);
      });
    }
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

  setPixelHex(x,y,hex){
    var orientation = 0;
    var xnew = 0;
    var ynew = 0;
    switch (orientation) {
      case 0:
      xnew = y;
      ynew = x;
      break;
      case 1:
      xnew = y;
      ynew = -x;
      break;
      case 2:
      xnew = -x;
      ynew = -y;
      break;
      case 3:
      xnew = y;
      ynew = -x;
      break;
    }
    this.pixels[this.translatePixelCoordinates(xnew, ynew)] = hex;
  }

  setPixel(x, y, r, g, b) {
    this.setPixelHex(x,y,this.getCorrectColor(r, g, b));
  }

  clearScreen() {
    for (let p = 0; p < this.pixel_amount; p++) {
      this.pixels[p] = 0x000000;
    }
  }

  fillScreen(r,g,b) {
    for (let p = 0; p < this.pixel_amount; p++) {
      this.pixels[p] = this.getCorrectColor(r,g,b);
    }
  }

  fillScreenHex(hex) {
    for (let p = 0; p < this.pixel_amount; p++) {
      this.pixels[p] = hex
    }
  }

  showFullscreenPng(path) {
    PNG.decode(path, function(color) {
      // pixels is a 1d array (in rgba order) of decoded pixel data
      for(var p = 0; p <= this.pixels-1, p += 3;) {
        this.pixels[p] = this.getCorrectColor(color[p], color[p+1], color[p+2]);
      }
      console.log(pixels);
    });
  }

}

module.exports = Interface
