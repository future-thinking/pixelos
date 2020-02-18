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
      this.playerObjs.push(new SnakePlayer(item, this.interface, i, this));
    });
    this.ticks = 0;
  }

  update() {
    console.log("game tick");
    this.ticks++;
    if (this.ticks >= 50) {
      this.interface.clearScreen();
      this.playerObjs.forEach((item, i) => {
        item.tick();
      });
      this.ticks == 0;
      this.interface.updateScreen();
    }
  }

  end() {
    console.log("multisnake end");
  }

  playerDie(player) {
    this.playerObjs.splice(this.playerObjs.indexOf(player), 1);
  }

  playerInput(player_socket, type, content) {
    if (type="direction_change") {
      this.playerObjs[this.players.indexOf(player_socket)].setDirection(content);
    }
  }
}

class SnakePlayer {
  constructor(socket, screen_interface, player_num, maingame) {
    this.interface = screen_interface;
    this.dir = "up";
    this.maingame = maingame;
    switch (player_num) {
      case 0:
        this.x = 1;
        this.y = 1;
        this.color = 0xFF0000;
        break;
      case 1:
        this.x = 10;
        this.y = 1;
        this.color = 0x00FF00;
        break;
      case 2:
        this.x = 10;
        this.y = 10;
        this.color = 0x0000FF;
        break;
      case 3:
        this.x = 1;
        this.y = 10;
        this.color = 0xFF00FF;
        break;
      default:

    }

    this.body = new Array();
    this.body.push({'x': this.x, 'y': this.y});
    this.body.push({'x': this.x, 'y': this.y});
    this.body.push({'x': this.x, 'y': this.y});
  }

  applyDirection() {
    switch (this.direction) {
      case "up":
        this.y += 1;
        break;
      case "down":
        this.y += -1;
        break;
      case "right":
        this.x += 1;
        break;
      case "left":
        this.x -= 1;
        break;
    }
    if (this.x > 11) {this.x = 0;}
    if (this.y > 11) {this.y = 0;}
  }

  tick() {
    this.body.splice(this.body.length - 1);
    this.applyDirection();
    if (this.body.includes({'x': this.x, 'y': this.y})) {

    }
    this.body.unshift({'x': this.x, 'y': this.y});
    this.body.forEach((item, i) => {
          this.interface.setPixelHex(item.x, item.y, this.color);
    });
  }

  setDirection(direction) {
    if (direction.w) {
      if (this.direction != "down") {
          this.direction = "up";
      }
    }
    if (direction.d) {
      if (this.direction != "left") {
        this.direction = "right";
    }
    }
    if (direction.s) {
      if (this.direction != "up") {
        this.direction = "down";
      }
    }
    if (direction.a) {
      if (this.direction != "right") {
        this.direction = "left";
      }
    }
  }
}

module.exports = MultiSnake;
