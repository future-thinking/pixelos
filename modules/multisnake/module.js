class MultiSnake {
  constructor(screen_interface) {
    this.interface = screen_interface;
    console.log("blallblblalalblalbla:" + this.interface);
  }

  start(players) {
    console.log("multisnake start");
    this.players = players;
    this.playerObjs = new Array();
    this.players.forEach((item, i) => {
      this.playerObjs.push(new SnakePlayer(item, this.interface));
    });
  }

  update() {
    console.log("game tick");
  }

  end() {
    console.log("multisnake end");
  }

  playerInput(player_socket, type, content) {
    if (type="direction_change") {
      this.playerObjs[this.players.indexOf(player_socket)].setDirection(content);
    }
  }
}

class SnakePlayer {
  constructor(socket, screen_interface) {
    this.interface = screen_interface;
    this.dir = "up";
    this.x = 5;
    this.y = 5;
    this.interface.setPixel(this.x, this.y, 255, 0, 0);
    this.interface.updateScreen();
  }

  setDirection(direction) {
    if (direction.w) {
      this.direction = "up";
    }
    if (direction.d) {
      this.direction = "right";
    }
    if (direction.s) {
      this.direction = "down";
    }
    if (direction.a) {
      this.direction = "left";
    }
    this.interface.setPixel(this.x, this.y, 255, 0, 0);
    this.interface.updateScreen();
  }
}

module.exports = MultiSnake;
