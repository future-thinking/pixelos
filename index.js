var express = require('express');
var app = express();
var mysql = require('mysql');
var ws281x = require('rpi-ws281x-v2');

// One time initialization
ws281x.configure({leds:144, gpio:1, strip:rgb});

// Create my pixels
var pixels = new Uint32Array(144);

var red = 255, green = 0, blue = 0;
var color = (red << 16) | (green << 8)| blue;

pixels[5] = color;

// Render pixels to the Neopixel strip
ws281x.render(pixels);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('PixelOS Web listening on port 3000!');
});
