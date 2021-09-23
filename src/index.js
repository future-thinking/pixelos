const isOnlyEmulating = ((process.argv.includes("-e")) ? true : false);

const app = require('express')();
const http = require('http').createServer(app);

global.interface = new (require('./lib/interface'))(144, isOnlyEmulating);

const moduleManager = new (require('./lib/moduleManager'))();
const socketManager =  require('./sockets')(http, moduleManager);

app.use(require('express').static('public'));
app.use(express.urlencoded());
app.use(require('./router')(moduleManager));

http.listen(3000, function(){
  console.log('listening on *:3000');
});
