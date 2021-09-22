class MultiSnake {
  constructor(screen_interface) {
    this.interface = screen_interface;
    this.ended = false;
  }

  start(players) {
    console.log("multisnake start");
    this.players = new Array();
    players.forEach((item, i) => {
      this.players.push(item);
    });

    this.playerObjs = new Array();
    this.players.forEach((item, i) => {
      this.playerObjs.push(new SnakePlayer(item, this.interface, i, this));
    });
    this.ticks = 0;
    this.foodx = Math.random();
    this.doody = Math.random();
    this.ended = false;
    this.spawnFood();
    this.alive_players = players.length;
    this.deads = new Array();
  }

  isEnded() {
    return this.ended;
  }

  spawnFood() {
    this.foodx = parseInt(Math.random() * 11);
    this.foody = parseInt(Math.random() * 11);
  }

  update() {
    if (this.ended) return;
    this.deads.forEach((item, i) => {
      item.alive = false;
    });

    console.log("game tick");
    this.ticks++;
    if (this.ticks >= 10) {
      this.interface.clearScreen();
      this.playerObjs.forEach((item, i) => {
        item.move();
      });
      this.playerObjs.forEach((item, i) => {
        item.collisionCheck();
      });
      if (this.ended) return;
      this.playerObjs.forEach((item, i) => {
        item.render();
      });
      this.ticks = 0;

      this.interface.setPixelHex(this.foodx, this.foody, 0xFFFFFF);

      this.interface.updateScreen();
    }
  }

  end() {
    console.log("multisnake end");
  }

  playerDie(player) {
    let totalPlayers = 0;
    this.deads.push(player);
    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        totalPlayers++;
      }
    });

    if (this.deads.length >= (this.playerObjs.length - 1)) {
      this.playerObjs.forEach((item, i) => {
        if (!this.deads.includes(item)) {
          this.interface.fillScreenHex(item.color);
        }
      });
      this.ended = true;
      this.interface.updateScreen();
    }
  }

  playerInput(player_socket, type, content) {
    if (type="direction_change") {
      if (this.players.includes(player_socket)) {
        if (this.playerObjs.length > this.players.indexOf(player_socket)) {
          this.playerObjs[this.players.indexOf(player_socket)].setDirection(content);
        }
      }
    }
  }
}

class SnakePlayer {
  constructor(socket, screen_interface, player_num, maingame) {
    this.interface = screen_interface;
    this.maingame = maingame;
    this.direction = "up";
    this.alive = true;
    switch (player_num) { //grb
      case 0:
        this.x = 1;
        this.y = 1;
        this.color = 0x000088;
        this.headColor = 0x0000FF;
        break;
      case 1:
        this.x = 10;
        this.y = 1;
        this.color = 0x008800;
        this.headColor = 0x00FF00;
        break;
      case 2:
        this.x = 3;
        this.y = 1;
        this.color = 0x880000;
        this.headColor = 0xFF0000;
        break;
      case 3:
        this.x = 7;
        this.y = 1;
        this.color = 0x888800;
        this.headColor = 0xFFFF00;
        break;
      default:

    }

    this.body = new Array();
    this.body.push({'x': this.x, 'y': this.y});
    this.eaten = false;
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
    if (this.x > 11 || this.x < 0) {this.maingame.playerDie(this);}
    if (this.y > 11 || this.y < 0) {this.maingame.playerDie(this);}
  }

  move() {
    if (!this.alive) {
      return;
    }
    this.applyDirection();
    if (!this.eaten) {
      this.body.splice(this.body.length - 1);
    }
    this.eaten = false;
    this.body.unshift({'x': this.x, 'y': this.y});
  }

  collisionCheck() {
    this.body.forEach((item, i) => {
      let alr = false;
      if (item.x == this.x && item.y == this.y) {
        if (alr) {
          this.maingame.playerDie(this);
          return;
        }
        alr = true;
      }
    });

    this.maingame.playerObjs.forEach((item, i) => {
      if (item != this && item.alive) {
        item.body.forEach((itemb, i) => {
          if (itemb.x == this.x && itemb.y == this.y) {
            if (item.x == itemb.x && item.y == itemb.y) {
              this.maingame.playerDie(item);
            }
            this.maingame.playerDie(this);
            return;
          }
        });
      }
    });


    if (this.maingame.foodx == this.x && this.maingame.foody == this.y) {
      this.maingame.spawnFood();
      this.eaten = true;
    }
  }

  render() {
    if (!this.alive) {
      return;
    }
    this.body.forEach((item, i) => {
          this.interface.setPixelHex(item.x, item.y, this.color);
    });
    this.interface.setPixelHex(this.body[0].x, this.body[0].y, this.headColor);
  }

  setDirection(direction) {
    if (direction.w) {
      //if (this.direction != "down") {
          this.direction = "up";
      //}
    }
    if (direction.d) {
      //if (this.direction != "left") {
        this.direction = "right";
      //}
    }
    if (direction.s) {
      //if (this.direction != "up") {
        this.direction = "down";
      //}
    }
    if (direction.a) {
      //if (this.direction != "right") {
        this.direction = "left";
      //}
    }
  }
}

module.exports = MultiSnake;
