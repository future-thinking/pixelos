class MultiSnake() {
  constructor(interface) {
    this.interface = interface;
  }

  start(players) {
    console.log("multisnake start");
    this.players = players;
    this.playerObjs = new Array();
    this.players.forEach((item, i) => {
      this.playerObjs.push(new SnakePlayer(item));
    });

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

class SnakePlayer() {
  constructor(socket) {
    this.dir = "up";
    this.x = 5;
    this.y = 5;
    interface.setPixel(this.x, this.y, 255, 0, 0);
    interface.updateScreen();
  }

  setDirection(direction) {
    if (direction.w) {
      this.direction = "up";
      this.y += 1;
    }
    if (direction.d) {
      this.direction = "right";
      this.x += 1;
    }
    if (direction.s) {
      this.direction = "down";
      this.y += -1;
    }
    if (direction.a) {
      this.direction = "left";
      this.x += -1;
    }
    interface.setPixel(this.x, this.y, 255, 0, 0);
    interface.updateScreen();
  }
}

module.exports = MultiSnake;
