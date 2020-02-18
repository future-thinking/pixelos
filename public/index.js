function updatePlayerCount(count) {
  for (let i = 1; i < 5; i++) {
    document.getElementById("player_"  + i).style.backgroundColor = "white";
  }
  for (let i = 1; i < count + 1; i++) {
    document.getElementById("player_"  + i).style.backgroundColor = "blue";
  }
}

var socket = io();

var w_press = false; //87
  var s_press = false; //83
  var a_press = false; //65
  var d_press = false; //68

  function changed() {
    var dirobj = {
      "w":w_press,
      "s":s_press,
      "a":a_press,
      "d":d_press
    }
    //console.log(dirobj);
    socket.emit('direction_change', dirobj);
  }


  document.onkeydown = function (e) {
    //console.log(e);
    if (e.keyCode == 87) {
      if (!w_press) {
        w_press = true;
        changed();
      }
    }
    if (e.keyCode == 83) {
      if (!s_press) {
        s_press = true;
        changed();
      }
    }
    if (e.keyCode == 65) {
      if (!a_press) {
        a_press = true;
        changed();
      }
    }
    if (e.keyCode == 68) {
      if (!d_press) {
        d_press = true;
        changed();
      }
    }
  };

  document.onkeyup = function (e) {
    if (e.keyCode == 87) {
      if (w_press) {
        w_press = false;
        changed();
      }
    }
    if (e.keyCode == 83) {
      if (s_press) {
        s_press = false;
        changed();
      }
    }
    if (e.keyCode == 65) {
      if (a_press) {
        a_press = false;
        changed();
      }
    }
    if (e.keyCode == 68) {
      if (d_press) {
        d_press = false;
        changed();
      }
    }
  };

socket.on('player_number_info', (msg) => {
  updatePlayerCount(msg);
});

socket.on('game_full', (msg) => {
  document.body.innerHTML = "Error, game full!";
  socket.disconnect();
});
