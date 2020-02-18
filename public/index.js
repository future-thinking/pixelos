var socket = io();

socket.on('player_number_info', (msg) => {
  document.getElementById("player_id_display").innerHTML = msg;
});

socket.on('game_full', (msg) => {
  document.body.innerHTML = "Error, game full!";
  socket.disconnect();
})
