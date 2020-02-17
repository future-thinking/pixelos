var express = require('express');
var app = express();
var mysql = require('mysql');
var leds = require("rpi-ws2801");

leds.connect(144);
leds.fill(255, 0, 255);
leds.update();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('PixelOS Web listening on port 3000!');
});
