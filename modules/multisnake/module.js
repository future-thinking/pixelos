class MultiSnake {
  constructor(screen_interface) {
    this.interface = screen_interface;
    this.ended = false;
  }

  start(players) {
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
    this.foodx = parseInt(Math.random() * 11);
    this.foody = parseInt(Math.random() * 11);
  }

  update() {
    this.tick++;
    if (!(this.tick >= 10)) {
      return;
    }
    this.interface.fillScreenHex(0x000000);
    this.tick = 0;
    console.log("game tick 2");
    if (this.ended) {
      return;
    }
    console.log("survived");
    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        item.moveBody();
      }
    });
    let deaths = new Array();
    this.playerObjs.forEach((item, i) => {
      console.log("PLAYER: " + item.num + " alive: " + item.alive);
      if (item.alive) {
        console.log("test col:");
        console.log(item.collisionCheck());
        console.log("end test col");
        if (item.collisionCheck()) {
          console.log("test col:");
          console.log(item.collisionCheck());
          console.log("end test col")
          console.log("death pushed");
          deaths.push(item);
        }
      }
    });

    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        item.render();
      }
    });


    console.log("Deaths: " + deaths);
    console.log("All players: " + this.playerObjs);
    deaths.forEach((item, i) => {
      item.alive = false;
    });
    this.playerObjs.forEach((item, i) => {
      if (item.alive) {
        console.log("eat check");
        item.checkEat();
      }
    });

    this.interface.setPixelHex(this.foodx, this.foody, 0xFFFFFF);
    console.log("screen update");
    this.interface.updateScreen();

    let totalPlayers = this.playerObjs.length;
    let deadPlayers = 0;
    this.playerObjs.forEach((item, i) => {
      if (!item.alive) {
        deadPlayers++;
      }
    });
    let alivePlayers = totalPlayers - deadPlayers;

    console.log("alive: " + alivePlayers);

    if (alivePlayers < 2) {
      this.ended = true;
      console.log("game ended");
      if (alivePlayers < 1) {
        this.interface.fillScreenHex(0xFFFFFF);
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
    if (type="direction_change") {
      this.playerObjs.forEach((item, i) => {
        if (item.num == player_num) {
          item.setDirection(content);
        }
      });

      // if (this.players.includes(player_socket)) {
      //   if (this.playerObjs.length > this.players.indexOf(player_socket)) {
      //     this.playerObjs[this.players.indexOf(player_socket)].setDirection(content);
      //   }
      // }
    }
  }
}

class SnakePlayer {
  constructor(socket, screen_interface, player_num, maingame) {
    this.interface = screen_interface;
    this.maingame = maingame;
    this.direction = "up";
    this.alive = true;
    this.num = player_num;
    switch (player_num) { //grb
      case 1:
        this.x = 1;
        this.y = 1;
        this.color = 0x000088;
        this.headColor = 0x0000FF;
        break;
      case 2:
        this.x = 10;
        this.y = 1;
        this.color = 0x008800;
        this.headColor = 0x00FF00;
        break;
      case 3:
        this.x = 3;
        this.y = 1;
        this.color = 0x880000;
        this.headColor = 0xFF0000;
        break;
      case 4:
        this.x = 7;
        this.y = 1;
        this.color = 0x888800;
        this.headColor = 0xFFFF00;
        break;
      default:

    }

    this.body = new Array();
    this.body.push({'x': this.x, 'y': this.y});
    this.body.push({'x': this.x, 'y': this.y + 1});

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
  }

  moveBody() {
    this.applyDirection();
    this.body.unshift({'x': this.x, 'y': this.y});
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
    console.log("snake render, body: " + this.body);
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
                console.log("Player died from collision: " + this.num + " by " + player.num);
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
      console.log("Player died from wall: " + this.num);
      return true;
    }
    return false;
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
