class PacMan {
  constructor(screen_interface) {
    this.interface = screen_interface;
    this.ended = false;
    this.tick = 0;
  }

  start(players) {
    if (player.length < 2) {
      this.ended = true;
      return;
    }
    this.pacman = new PacManPlayer(players[0]);

    this.ghosts = new Array();

    for (let ghostPlayerId = 1; ghostPlayerId < players.length) {
      ghosts.push(new Ghost(players[ghostPlayerId]));
    }
  }

  isEnded() { return this.ended; }


  update() {
    this.tick++;
    if (!(this.tick >= 10)) {return;}
    this.tick = 0;

  }

  end() {console.log("PackMan Ended");}
  playerInput(player_socket, player_num, type, content) {

  }
}

class PacManPlayer {
  constructor(player_socket) {
    this.socket = player_socket;
  }
}

class Ghost() {
  constructor(player_socket, ghost_num) {
    this.socket = player_socket;
  }
}

class Map {
  constructor(maingame) {
    this.maingame = maingame
    this.map = new Array();
    for (let x = 0; x < 12; x++) {
      this.map.push(new Array());
      for (let y = 0; y < 12; y++) {
        this.map[x].push(((Math.random() * 5) > 5) ? 1 : 0);
      }
    }
    this.food = new Array();
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        if (this.map[x][y] == 0) {
          food.push({'x': x, 'y': y});
        }
      }
    }
    this.pills = new Array();
    this.pills.push({'x': 5, 'y': 5});
  }

  render() {
    this.map.forEach((row, x) => {
      x.forEach((block, y) => {
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
