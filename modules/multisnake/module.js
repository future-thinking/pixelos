class MultiSnake {
  constructor(screen_interface) {
    this.interface = screen_interface;
    console.log("blallblblalalblalbla:" + this.interface);
    this.ended = false;
    this.foods = new Array();
  }

  start(players) {
    console.log("multisnake start");
    this.players = players;
    this.playerObjs = new Array();
    this.players.forEach((item, i) => {
      this.playerObjs.push(new SnakePlayer(item, this.interface, i, this));
    });
    this.ticks = 0;
    this.totalTicks = 0;
    this.foods = new Array();
  }

  isEnded() {
    return this.ended;
  }

  spawnFood() {
    this.foods.push({'x': (Math.random() * 5 + 3), 'y': (Math.random() * 5 + 3)});
  }

  update() {
    console.log("game tick");
    this.ticks++;
    if (this.ticks >= 10) {
      this.interface.clearScreen();
      this.playerObjs.forEach((item, i) => {
        item.tick();
      });
      this.ticks = 0;
      this.totalTicks++;
      if (this.totalTicks > 10) {
        this.spawnFood();
      }

      this.foods.forEach((item, i) => {
        this.interface.setPixelHex(item.x, item.y, 0xFFFFFF);
      });


      this.interface.updateScreen();
    }
  }

  end() {
    console.log("multisnake end");
  }

  playerDie(player) {
    this.playerObjs.splice(this.playerObjs.indexOf(player), 1);
    this.players.splice(this.playerObjs.indexOf(player), 1);
    if (this.players.length < 2) {
      this.maingame.ended = true;
    }
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
    //if (this.x > 11 || this.x < 0) {this.maingame.playerDie(this);}
    //if (this.y > 11 || this.y < 0) {this.maingame.playerDie(this);}
  }

  tick() {
    this.applyDirection();
    //if (this.body.includes({'x': this.x, 'y': this.y})) {
    //  this.maingame.playerDie(this);
    //}
    let food = -1;
    this.foods.forEach((item, i) => {
      if (item.x == this.x && item.y == this.y) {
        food = i;
      }
    });

    if (food != -1) {
      this.foods.splice(food, 1);
    }else {
      this.body.splice(this.body.length - 1);
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
