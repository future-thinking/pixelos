
var players = new Array();

global.emulating_sockets = new Array();

module.exports = function (http, moduleManager) {
    const io = require('socket.io')(http);
    
    io.on('connection', function(socket) {
        if (players.length >= 4) {
          socket.emit('game_full', "");
          console.log("Player got kicked for 'Game Full!'");
          return;
        }
      
        players.push(socket);
        console.log("Player connected as player" + players.length + ".");
        updatePlayerNumbers();
      
        socket.on('disconnect', () => {
          console.log('User left.');
          if (players.includes(socket)) {
            players.splice(players.indexOf(socket), 1);
          }
          if (emulating_sockets.includes(socket)) {
            emulating_sockets.splice(emulating_sockets.indexOf(socket), 1);
          }
          updatePlayerNumbers();
        });
      
        socket.on("only_emul", (msg) => {
          console.log("Emulate Request received.");
          if (players.includes(socket)) {
            players.splice(players.indexOf(socket), 1);
          }
          if (!emulating_sockets.includes(socket)) {
            emulating_sockets.push(socket);
          }
          updatePlayerNumbers();
          console.log("Emulating Sockets: " + emulating_sockets);
        });
      
        socket.on('direction_change', (dir) => {
          if (moduleManager.getCurrent() != -1) {
            moduleManager.getCurrent().playerInput(socket, players.indexOf(socket) + 1, "direction_change", dir);
          }
        });
      
        socket.on('restart_game', (msg) => {
          moduleManager.restart();
          console.log("Started game: " + moduleManager.getCurrent());
        });
        console.log('');
    });
      
      function updatePlayerNumbers() {
        console.log("players: " + players);
        moduleManager.setPlayers(players);
        players.forEach(function(item, index) {
            item.emit("player_number_info", index + 1);
        });
      }
}