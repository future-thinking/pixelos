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

var socket = io();

var w_press = false; //87
  var s_press = false; //83
  var a_press = false; //65
  var d_press = false; //68
  var up_press = false; //38
  var down_press = false; //40
  var left_press = false; //37
  var right_press = false; //39

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
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  xhttp.open("GET", "/restartgame", true);
  xhttp.send();
}
