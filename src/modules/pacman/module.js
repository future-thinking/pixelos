class PacMan {
  constructor(screen_interface) {
    this.interface = screen_interface;
    this.ended = false;
    this.tick = 0;
  }

  start(players) {
    if (players.length < 2) {
      this.ended = true;
      return;
    }
    this.pacman = new PacManPlayer(players[0], this);

    this.ghosts = new Array();

    this.map = new Map(this);

    for (let ghostPlayerId = 1; ghostPlayerId < players.length; ghostPlayerId++) {
      this.ghosts.push(new Ghost(players[ghostPlayerId], this, ghostPlayerId, ghostPlayerId + 1));
    }


  }

  isEnded() { return this.ended; }


  update() {
    if (this.ended) {
      return;
    }
    this.tick++;
    if (!(this.tick >= 10)) {return;}
    this.tick = 0;

    this.pacman.move();

    let pcd = false;

    if (this.pacman.checkDead()) {
      pcd = true;
    }

    this.ghosts.forEach((ghost, i) => {
      ghost.move();
    });

    if (this.pacman.checkDead()) {
      pcd = true;
    }

    this.pacman.eatCheck();

    if (this.map.food.length < 1 && !pcd) {
      this.ended = true;
      this.interface.fillScreenHex(0xFFFF00);
    } else if (pcd ){
      this.ended = true;
      this.interface.fillScreenHex(0x555555);
    } else {
      this.map.render();
      this.pacman.render();
      this.ghosts.forEach((ghost, i) => {
        ghost.render();
      });
    }
    this.interface.updateScreen();
  }

  end() {console.log("PackMan Ended");}

  playerInput(player_socket, player_num, type, content) {
    console.log(player_num);
    if (player_num == 1) {
      this.pacman.setDirection(content);
    } else {
      this.ghosts.forEach((ghost, i) => {
        if (ghost.num == player_num) {
          ghost.setDirection(content);
        }
      });

    }
  }
}

class PacPlayer {
  constructor(player_socket, maingame) {
    this.socket = player_socket;
    this.maingame = maingame;
    this.direction = "no";
  }

  move() {
    this.applyDirection();
    this.x = this.x % 12;
    this.y = this.y % 12;
    if (this.x < 0) {
      this.x += 12;
    }
    if (this.y < 0) {
      this.y += 12;
    }
   }

  applyDirection() {
    this.cY = this.y;
    this.cX = this.x;
    switch (this.wantsDirection) {
      case "up":
        this.cY += 1;
        break;
      case "down":
        this.cY += -1;
        break;
      case "right":
        this.cX += 1;
        break;
      case "left":
        this.cX -= 1;
        break;
    }
    if (this.maingame.map.collisionCheck(this.cX, this.cY)) {
      this.cY = this.y;
      this.cX = this.x;
      switch (this.direction) {
        case "up":
          this.cY += 1;
          break;
        case "down":
          this.cY += -1;
          break;
        case "right":
          this.cX += 1;
          break;
        case "left":
          this.cX -= 1;
          break;
      }
    } else {
      this.direction = this.wantsDirection;
    }
    if (!this.maingame.map.collisionCheck(this.cX, this.cY)) {
      this.x = this.cX;
      this.y = this.cY;
    }
  }

  setDirection(direction) {
    if (direction.w) {
        this.wantsDirection = "up";
    }
    if (direction.d) {
      this.wantsDirection = "right";
    }
    if (direction.s) {
      this.wantsDirection = "down";
    }
    if (direction.a) {
      this.wantsDirection = "left";
    }
  }
}

class PacManPlayer extends PacPlayer {
  constructor(player_socket, maingame, plnum) {
    super(player_socket, maingame);
    this.maingame = maingame;
    this.socket = player_socket;
    this.x = 1;
    this.y = 1;
    this.num = plnum;
  }

  checkDead() {
    this.maingame.ghosts.forEach((ghost, i) => {
      if (ghost.x == this.x && ghost.y == this.y) {
        return true;
      }
    });
    return false;
  }

  render() {
    this.maingame.interface.setPixelHex(this.x, this.y, 0xFFFF00);
  }

  eatCheck() {
    let eaten = ";";
    this.maingame.map.food.forEach((food, i) => {
      if (food.x == this.x && food.y == this.y) {
        eaten = food;
      }
    });
    if (this.maingame.map.food.includes(eaten)) {
      this.maingame.map.food.splice(this.maingame.map.food.indexOf(eaten), 1);
    }

  }
}

class Ghost extends PacPlayer {
  constructor(player_socket, maingame, ghost_num, plnum) {
    super(player_socket, maingame);
    this.socket = player_socket;
    this.y = 10;
    this.x = 1 + ghost_num * 3;
    this.num = plnum;
    switch (ghost_num) {
      case 1:
        this.color = 0xFF0000;
        break;
      case 2:
        this.color = 0x00FF00;
        break;
      case 3:
        this.color = 0x0000FF;
        break;
      default:

    }
  }

  render() {
    this.maingame.interface.setPixelHex(this.x, this.y, this.color);
  }
}

class Map {
  constructor(maingame) {
    this.maingame = maingame
    this.map = new Array();
    for (let x = 0; x < 12; x++) {
      this.map.push(new Array());
      for (let y = 0; y < 12; y++) {
        this.map[x].push(((Math.random() * 10) > 5) ? 1 : 0);
      }
    }
    this.food = new Array();
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        if (this.map[x][y] == 0) {
          this.food.push({'x': x, 'y': y});
        }
      }
    }
    this.pills = new Array();
    this.pills.push({'x': 5, 'y': 5});
  }

  render() {
    this.map.forEach((row, x) => {
      row.forEach((block, y) => {
        this.maingame.interface.setPixelHex(x, y, (block == 0) ? 0x000000 : 0xFFFFFF);
      });
    });

    this.food.forEach((food, i) => {
      this.maingame.interface.setPixelHex(food.x, food.y, 0x777777);
    });
  }

  renderPill() {

  }

  collisionCheck(x, y) {
    x = x % 12;
    y = y % 12;
    if (x < 0) {
      x = x + 12;
    }
    if (y < 0) {
      y = y + 12;
    }
    if (this.map[x][y] != 0) {
      return true;
    }
    return false;
  }

  checkEat(x, y) {
    let eaten = "nil";
    this.food.forEach((food, i) => {
      if (food.x == x && food.y == y) {
        eaten = food;
      }
    });
    if (eaten != "nil") {
      this.food.splice(this.food.indexOf(eaten), 1);
      return true;
    }
    return false;
  }
}
module.exports = PacMan;
