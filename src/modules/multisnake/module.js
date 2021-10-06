const { Color } = require("../../interface");
const { Player } = require("../../playerManager");
class MultiSnake {
  /**
   * type {Interface}
   */
  interface;

  players = [];

  constructor(screen_interface) {
    this.interface = screen_interface;
  }

  /**
   * @type {Function}
   */
  endGame;

  start(players, endGame) {
    this.endGame = endGame;

    this.players = [];
    players.forEach((player, i) => {
      this.players.push(new SnakePlayer(player, i + 1, this));
    });
    this.spawnFood();
  }

  stop() {}

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
      console.log(this.players);
      this.players.forEach((player) => {
        player.body.forEach((bodyPart) => {
          if (bodyPart.x == this.foodx && bodyPart.y == this.foody) {
            works = false;
          }
        });
      });
    } while (!works);
  }

  tick() {
    console.log("update");
    this.interface.clearScreen();
    this.players.forEach((player) => {
      if (player.alive) {
        player.moveBody();
      }
    });
    let deaths = [];
    this.players.forEach((player) => {
      if (player.alive) {
        if (player.collisionCheck()) {
          deaths.push(player);
        }
      }
    });

    this.players.forEach((player) => {
      if (player.alive) {
        player.render();
      }
    });

    deaths.forEach((item, i) => {
      item.alive = false;
    });
    this.players.forEach((player) => {
      if (player.alive) {
        player.checkEat();
      }
    });

    this.interface.setPixel(this.foodx, this.foody, new Color(255, 255, 255));
    this.interface.updateScreen();

    let totalPlayers = this.players.length;
    let deadPlayers = 0;
    this.players.forEach((item, i) => {
      if (!item.alive) {
        deadPlayers++;
      }
    });
    let alivePlayers = totalPlayers - deadPlayers;

    if (alivePlayers < 2) {
      if (alivePlayers < 1) {
        this.interface.fillScreen(new Color(255, 255, 255));
        this.interface.updateScreen();
        this.endGame();
        return;
      }
      this.players.forEach((item, i) => {
        if (item.alive) {
          this.interface.fillScreen(item.headColor);
        }
      });
      console.log("stopping game");
      this.interface.updateScreen();
      this.endGame();
      return;
    }
  }

  end() {
    console.log("multisnake end");
  }
}

class SnakePlayer {
  /**
   *
   * @param {Player} player
   * @param {*} playerNumber
   * @param {*} game
   */
  constructor(player, playerNumber, game) {
    this.interface = game.interface;
    this.game = game;
    this.direction = "up";
    this.oldDirection = "up";
    this.alive = true;
    this.playerNumber = playerNumber;

    player.onDirectionChange((input) => this.setDirection(input));

    switch (
      playerNumber //grb
    ) {
      case 1:
        this.x = 1;
        this.y = 9;
        this.color = new Color(0, 0, 180);
        this.headColor = new Color(0, 0, 255);
        break;
      case 2:
        this.x = 10;
        this.y = 9;
        this.color = new Color(180, 0, 0);
        this.headColor = new Color(255, 0, 0);
        break;
      case 3:
        this.x = 3;
        this.y = 9;
        this.color = new Color(0, 180, 0);
        this.headColor = new Color(0, 255, 0);
        break;
      case 4:
        this.x = 7;
        this.y = 9;
        this.color = new Color(180, 180, 0);
        this.headColor = new Color(255, 255, 0);
        break;
      default:
    }

    this.body = [];
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
      if (item.x == this.game.foodx && item.y == this.game.foody) {
        this.game.spawnFood();
        this.eaten = true;
      }
    });
  }

  render() {
    this.body.forEach((item, i) => {
      this.interface.setPixel(item.x, item.y, this.color);
    });
    this.interface.setPixel(this.x, this.y, this.headColor);
  }

  collisionCheck() {
    this.diedNow = false;
    this.game.players.forEach((player, i) => {
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
        this.y += -1;
        break;
      case "down":
        this.y += 1;
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

module.exports = (screen) => new MultiSnake(screen);
