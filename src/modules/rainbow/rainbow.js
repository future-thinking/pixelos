const { Interface, Color } = require("../../interface");

class Rainbow {
  /**
   * @type {Interface}
   */
  screen;

  constructor(screen) {
    this.screen = screen;
  }

  start(players) {
    this.screen.fillScreen(new Color(255, 0, 255));
    this.screen.updateScreen();
    console.log("players", players);
    players.forEach((player) => player.onDirectionChange(console.log));
  }
}

module.exports = (screen) => new Rainbow(screen);
