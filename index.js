const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const interface_module = require('./interface.js');
const interface = new interface_module(144);

const bodyParser = require('body-parser');

app.use(require('express').static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var players = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/eval', function(req, res){
  res.sendFile(__dirname + '/public/eval.html');
});


app.post('/evalpost', (req, res) => {
  console.log('Eval: ' + req.body.eval);
  eval(req.body.eval);
  res.redirect('/eval');
});

io.on('connection', function(socket) {
  if (players.length >= 4) {
    socket.emit('game_full', "");
    console.log("Player got kicked for 'Game Full!'");
  }
  players.push(socket);
  console.log("Player connected as player" + players.length + ".");
  updatePlayerNumbers();
  socket.on('disconnect', () => {
    console.log('User left.');
    if (players.includes(socket)) {
      players.splice(players.indexOf(socket), 1);
    }
    updatePlayerNumbers();
  });
  console.log('');
});

function updatePlayerNumbers() {
  console.log("players: " + players);
  players.forEach(function(item, index, array) {
      item.emit("player_number_info", index + 1);
  });
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
