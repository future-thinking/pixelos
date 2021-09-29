class MultiSnake {
  constructor(screen_interface) {
    this.interface = screen_interface;
    this.ended = false;
  }

  start(players) {
    if (players.length == 0) {
      this.ended = true;
      return;
    }
    console.log("multisnake start");
    this.players = players;
    this.playerObjs = new Array();
    this.players.forEach((item, i) => {
      this.playerObjs.push(new SnakePlayer(item, this.interface, i + 1, this));
    });
    this.spawnFood();
    this.ended = false;
    this.tick = 0;
  }

  isEnded() {
    return this.ended;
  }

  negateDirection(direction) {
    if (direction == "up") {
      return "down";
    }
    if (direction == "down") {
      return "up";
    }
    if (direction == "right") {
      return "left";
    }
    return "right";
  }

  spawnFood() {
    let works = true;
    do {
      this.foodx = parseInt(Math.random() * 11);
      this.foody = parseInt(Math.random() * 11);
      works = true;
      this.playerObjs.forEach((item, i) => {
        item.body.forEach((bodyPart, i) => {
          if (bodyPart.x == this.foodx && bodyPart.y == this.foody) {
            works = false;
          }
        });
      });
    } while (!works);
  }

  update() {
    this.tick++;
    if (!(this.tick >= 10)) {
      return;
    }
    this.interface.fillScreenHex(0x000000);
    this.tick = 0;
    if (this.ended) {
      return;
    }
    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        item.moveBody();
      }
    });
    let deaths = new Array();
    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        if (item.collisionCheck()) {
          deaths.push(item);
        }
      }
    });

    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        item.render();
      }
    });

    deaths.forEach((item, i) => {
      item.alive = false;
    });
    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        item.checkEat();
      }
    });

    this.interface.setPixelHex(this.foodx, this.foody, 0xffffff);
    this.interface.updateScreen();

    let totalPlayers = this.playerObjs.length;
    let deadPlayers = 0;
    this.playerObjs.forEach((item, i) => {
      if (!item.alive) {
        deadPlayers++;
      }
    });
    let alivePlayers = totalPlayers - deadPlayers;

    if (alivePlayers < 2) {
      this.ended = true;
      if (alivePlayers < 1) {
        this.interface.fillScreenHex(0x555555);
        this.interface.updateScreen();
        return;
      }
      this.playerObjs.forEach((item, i) => {
        if (item.alive) {
          this.interface.fillScreenHex(item.headColor);
        }
      });

      this.interface.updateScreen();
      return;
    }
  }

  end() {
    console.log("multisnake end");
  }

  playerInput(player_socket, player_num, type, content) {
    if ((type = "direction_change")) {
      this.playerObjs.forEach((item, i) => {
        if (item.num == player_num) {
          item.setDirection(content);
        }
      });
    }
  }
}

class SnakePlayer {
  constructor(socket, screen_interface, player_num, maingame) {
    this.interface = screen_interface;
    this.maingame = maingame;
    this.direction = "up";
    this.oldDirection = "up";
    this.alive = true;
    this.num = player_num;
    switch (
      player_num //grb
    ) {
      case 1:
        this.x = 1;
        this.y = 1;
        this.color = 0x000099;
        this.headColor = 0x0000ff;
        break;
      case 2:
        this.x = 10;
        this.y = 1;
        this.color = 0x990000;
        this.headColor = 0xff0000;
        break;
      case 3:
        this.x = 3;
        this.y = 1;
        this.color = 0x009900;
        this.headColor = 0x00ff00;
        break;
      case 4:
        this.x = 7;
        this.y = 1;
        this.color = 0x999900;
        this.headColor = 0xffff00;
        break;
      default:
    }

    this.body = new Array();
    this.body.push({ x: this.x, y: this.y });
    this.body.push({ x: this.x, y: this.y + 1 });
  }

  moveBody() {
    this.applyDirection();
    this.body.unshift({ x: this.x, y: this.y });
    if (!this.eaten) {
      this.body.splice(this.body.length - 1, 1);
    }
    this.eaten = false;
  }

  checkEat() {
    this.body.forEach((item, i) => {
      if (item.x == this.maingame.foodx && item.y == this.maingame.foody) {
        this.maingame.spawnFood();
        this.eaten = true;
      }
    });
  }

  render() {
    this.body.forEach((item, i) => {
      this.maingame.interface.setPixelHex(item.x, item.y, this.color);
    });
    this.maingame.interface.setPixelHex(this.x, this.y, this.headColor);
  }

  collisionCheck() {
    this.diedNow = false;
    this.maingame.playerObjs.forEach((player, i) => {
      if (player.alive) {
        player.body.forEach((bodyPart, i) => {
          if (!(player == this && i == 0)) {
            if (this.x == bodyPart.x && this.y == bodyPart.y) {
              this.diedNow = true;
            }
          }
        });
      }
    });
    if (this.diedNow) {
      return true;
    }
    if (this.x > 11 || this.x < 0 || this.y > 11 || this.y < 0) {
      return true;
    }
    return false;
  }

  applyDirection() {
    this.oldDirection = this.direction;
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
  }

  setDirection(direction) {
    if (direction.w) {
      if (this.oldDirection != "down") {
        this.direction = "up";
      }
    }
    if (direction.d) {
      if (this.oldDirection != "left") {
        this.direction = "right";
      }
    }
    if (direction.s) {
      if (this.oldDirection != "up") {
        this.direction = "down";
      }
    }
    if (direction.a) {
      if (this.oldDirection != "right") {
        this.direction = "left";
      }
    }
  }
}

module.exports = MultiSnake;
