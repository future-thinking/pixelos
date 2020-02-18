const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const interface_module = require('./interface.js');
const interface = new interface_module(144);

const bodyParser = require('body-parser');

app.use(require('express').static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/eval', function(req, res){
  res.sendFile(__dirname + '/public/eval.html');
});


app.post('/evalpost', (req, res) => {
  console.log('Eval: ' + req.body.eval);
  Eval(req.body.eval);
  res.redirect('/eval');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('ori', 3);
)};

http.listen(3000, function(){
  console.log('listening on *:3000');
});
