class PacMan {
  constructor(screen_interface) {
    this.interface = screen_interface;
    this.ended = false;
  }

  start(players) {}
  isEnded() { return this.ended; }
  update() {

  }
  end() {console.log("PackMan Ended");}
  playerInput(player_socket, player_num, type, content) {

  }
}

class PacManPlayer() {

}

class Map() {
  constructor() {
    this.map = new Array();
    for (int x = 0; x < 12; x++) {
      this.map.push(new Array());
      for (int y = 0; y < 12; y++) {
        this.map[x].push(((Math.random() * 5) > 5) ? 1 : 0);
      }
    }
    this.food = new Array();
    for (int x = 0; x < 12; x++) {
      for (int y = 0; y < 12; y++) {
        if (this.map[x][y] == 0) {
          food.push({'x': x, 'y': y});
        }
      }
    }
  }
}

module.exports = PacMan;
