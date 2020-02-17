var express = require('express');
var app = express();
var mysql = require('mysql');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('PixelOS Web listening on port 3000!');
});
