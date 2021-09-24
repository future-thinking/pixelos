const isOnlyEmulating = ((process.argv.includes("-e")) ? true : false);

const app = require('express')();
const http = require('http').createServer(app);

global.interface = new (require('./lib/interface'))(144, isOnlyEmulating);

const moduleManager = new (require('./lib/moduleManager'))(interface);
const socketManager =  require('./sockets')(http, moduleManager);

app.use(require('express').static('public'));
app.use(require('express').urlencoded());
app.use(require('./router')(moduleManager));
app.use(function (req, res, next) {
  console.log(Date.now() + '  ' + req.baseUrl)
  next()
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
