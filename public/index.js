function updatePlayerCount(count) {
  for (let i = 1; i < 5; i++) {
    document.getElementById("player_"  + i).style.backgroundColor = "white";
  }
  for (let i = 1; i < count + 1; i++) {
    document.getElementById("player_"  + i).style.backgroundColor = "blue";
  }
}

var socket = io();

socket.on('player_number_info', (msg) => {
  updatePlayerCount(msg);
});

socket.on('game_full', (msg) => {
  document.body.innerHTML = "Error, game full!";
  socket.disconnect();
});
