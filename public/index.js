var socket = io();

function updatePlayerCount(count) {
  color = "blue";
  switch (count) {
    case 2:
      color="red";
      break;
    case 3:
      color="green";
      break;
    case 4:
      color="yellow";
      break;
  }
  for (let i = 1; i < 5; i++) {
    document.getElementById("player_"  + i).style.backgroundColor = "white";
  }
  for (let i = 1; i < count + 1; i++) {
    document.getElementById("player_"  + i).style.backgroundColor = color;
  }
}



var w_press = false; //87
  var s_press = false; //83
  var a_press = false; //65
  var d_press = false; //68
  var r_press = false; //82
  var up_press = false; //38
  var down_press = false; //40
  var left_press = false; //37
  var right_press = false; //39

  var joystick = new VirtualJoystick();

var joydir = "no";

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

  funtion restartgamesignal() {
    secket.emit('restart_game', "");
  }

  function pressed(key) {
    eval(key + "_press = true;");
    changed();
  }

  function release(key) {
    eval(key + "_press = false;");
    changed();
  }

  document.onkeydown = function (e) {
    //console.log(e);
    if (e.keyCode == 87 || e.keyCode == 38) {
      if (!w_press) {
        w_press = true;
        changed();
      }
    }
    if (e.keyCode == 83 || e.keyCode == 40) {
      if (!s_press) {
        s_press = true;
        changed();
      }
    }
    if (e.keyCode == 65 || e.keyCode == 37) {
      if (!a_press) {
        a_press = true;
        changed();
      }
    }
    if (e.keyCode == 68 || e.keyCode == 39) {
      if (!d_press) {
        d_press = true;
        changed();
      }
    }
    if (e.keyCode == 82) {
      if (!r_press) {
        r_press = true;
        restartgamesignal();
      }
    }
  };

  document.onkeyup = function (e) {
    if (e.keyCode == 87 || e.keyCode == 38) {
      if (w_press) {
        w_press = false;
        changed();
      }
    }
    if (e.keyCode == 83 || e.keyCode == 40) {
      if (s_press) {
        s_press = false;
        changed();
      }
    }
    if (e.keyCode == 65 || e.keyCode == 37) {
      if (a_press) {
        a_press = false;
        changed();
      }
    }
    if (e.keyCode == 68 || e.keyCode == 39) {
      if (d_press) {
        d_press = false;
        changed();
      }
    }
    if (e.keyCode == 82) {
      if (!r_press) {
        r_press = true;
        restartgamesignal();
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

function restartButtonPress() {
var xhttp = new XMLHttpRequest();
xhttp.open("POST", "/restartgame", true);
xhttp.send();
}

setInterval(function () {
  let newDir = "no";
  if (!(joystick.deltaX() == 0 && joystick.deltaY() == 0)) {
    if (Math.abs(joystick.deltaX()) > Math.abs(joystick.deltaY())) {
      if (joystick.deltaX() > 0) {
        newDir = "d";
      } else {
        newDir = "a";
      }
    } else {
      if (joystick.deltaY() < 0) {
        newDir = "w";
      } else {
        newDir = "s";
      }
    }
  }
  if (newDir != joydir) {
    joydir = newDir;
    a_press = false;
    s_press = false;
    d_press = false;
    w_press = false;
    if (newDir != "no") {
      eval(newDir + "_press = true;");
    }
    changed();
  }
}, 10);
