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
  }

  tick() {
    for (let x = 0; x < this.screen.width; x++) {
      for (let y = 0; y < this.screen.width; y++) {
        this.screen.setPixel(x, y, new Color(random(), random(), random()));
      }
    }

    this.screen.updateScreen();
  }

  stop() {}
}

function random() {
  return Math.round(Math.random() * 255);
}

module.exports = (screen) => new Rainbow(screen);
