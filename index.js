var app = require('express')();
var http = require('http').createServer(app);
var mysql = require('mysql');
var interface_module = require('./interface.js');
var io = require('socket.io')(http);

var interface = new interface_module(144);

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('button', function (coords) {
    console.log("better: " + coords.x + " " + coords.y);
  })
});

app.get('/', function (req, res) {
  res.sendFile('/public/test.html');
});

app.listen(3000, function () {
  console.log('PixelOS Web listening on port 3000!');
});
