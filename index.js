var express = require('express');
var app = express();
var http = require('http').createServer(app);
var mysql = require('mysql');
var interface_module = require('./interface.js');
var io = require('socket.io').listen(server);

var server = http.createServer(app);

var interface = new interface_module(144);

//app.use(express.static('public'));

var x = 5;
var y = 5;

interface.setPixel(5, 5, 255, 0, 0);
interface.updateScreen();

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('button', function (coords) {
    interface.setPixel(x, y, 0, 0, 0);
    x = x + coords.x;
    y = y + coords.y;
    interface.setPixel(x, y, 255, 0, 0);
    interface.updateScreen();
  })
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/test.html');
});

app.listen(3000, function () {
  console.log('PixelOS Web listening on port 3000!');
});
