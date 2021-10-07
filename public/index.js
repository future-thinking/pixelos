var socket = io();

var currentCount = 0;

const isMobile = window.innerWidth < 800;

function updatePlayerCount(count) {
  if (count == currentCount) {
    return;
  }
  currentCount = count;
  color = "blue";
  switch (count) {
    case 2:
      color = "red";
      break;
    case 3:
      color = "green";
      break;
    case 4:
      color = "yellow";
      break;
  }
  for (let i = 1; i < 5; i++) {
    document.getElementById("player_" + i).style.backgroundColor =
      "transparent";
  }
  for (let i = 1; i < count + 1; i++) {
    document.getElementById("player_" + i).style.backgroundColor = color;
  }
}

const Direction = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

if (isMobile) {
  const joy = new JoyStick("joyDiv", {
    internalFillColor: "#ffffff",
    internalStrokeColor: "#ffffff",
    externalStrokeColor: "#ffffff",
  });

  let lastDirection = undefined;

  setInterval(() => {
    let currentDirection = undefined;
    const [x, y] = [joy.GetX(), joy.GetY()];
    const [absX, absY] = [Math.abs(x), Math.abs(y)];

    const d = Math.sqrt(x * x + y * y);

    if (d > 40) {
      if (absX > absY) {
        if (x > 0) {
          currentDirection = Direction.RIGHT;
        } else {
          currentDirection = Direction.LEFT;
        }
      } else {
        if (y > 0) {
          currentDirection = Direction.UP;
        } else {
          currentDirection = Direction.DOWN;
        }
      }
    }

    if (currentDirection != lastDirection) {
      lastDirection = currentDirection;
      socket.emit("direction_change", {
        w: currentDirection == Direction.UP,
        s: currentDirection == Direction.DOWN,
        a: currentDirection == Direction.LEFT,
        d: currentDirection == Direction.RIGHT,
      });
      console.log({
        w: currentDirection == Direction.UP,
        s: currentDirection == Direction.DOWN,
        a: currentDirection == Direction.LEFT,
        d: currentDirection == Direction.RIGHT,
      });
    }
  }, 20);
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

function changed() {
  socket.emit("direction_change", {
    w: w_press,
    s: s_press,
    a: a_press,
    d: d_press,
  });
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

socket.on("player_number_info", (msg) => {
  updatePlayerCount(msg);
});

socket.on("game_full", (msg) => {
  document.body.innerHTML = "Error, game full!";
  socket.disconnect();
});

socket.on("games", (games) => {
  const gamesEl = document.getElementById("games");
  gamesEl.innerHTML = "";
  for (const game of games) {
    gamesEl.innerHTML += `<button onclick="socket.emit('start_game', '${game}');">${game}</button`;
  }
});
