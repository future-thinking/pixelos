var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var interface_module = require('./interface.js');
var interface = new interface_module(144);

app.use(require('express').static('public'));

var x = 5;
var y = 5;

interface.setPixel(5, 5, 255, 0, 0);
interface.updateScreen();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/test.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('ori', 3);
  socket.on('button', function (coords) {
    interface.setPixel(x, y, 0, 0, 0);
    x = x + coords.x;
    y = y + coords.y;
    interface.setPixel(x, y, 255, 0, 0);
    interface.updateScreen();
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
