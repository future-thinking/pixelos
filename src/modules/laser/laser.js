const { Color } = require("../../interface");
const { Player } = require("../../playerManager");

class MultiSnake {
  /**
   * type {Interface}
   */
  interface;

  constructor(screen_interface) {
    this.interface = screen_interface;
  }

  /**
   * @type {Function}
   */
  endGame;

  start(players, endGame) {}

  stop() {}

  end() {
    console.log("multisnake end");
  }
}

module.exports = (screen) => new LaserGame(screen);
