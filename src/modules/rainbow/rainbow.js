const { Interface, Color } = require("../../interface");

class Rainbow {
  /**
   * @type {Interface}
   */
  screen;

  constructor(screen) {
    this.screen = screen;
  }

  start() {
    this.screen.fillScreen(new Color(255, 0, 255));
    this.screen.updateScreen();
  }
}

module.exports = (screen) => new Rainbow(screen);
