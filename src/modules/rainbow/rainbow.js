const { Interface, Color } = require("../../interface");

class Rainbow {
  /**
   * @type {Interface}
   */
  screen;

  atHue = 0;
  stepSize = 0.1;

  constructor(screen) {
    this.screen = screen;
  }

  start(players) {
    this.screen.fillScreen(new Color(255, 0, 255));
    this.screen.updateScreen();
    console.log("players", players);
    players.forEach((player) => player.onDirectionChange(console.log));
  }

  tick() {
    for (let x = 0; x < this.screen.width; x++) {
      for (let y = 0; y < this.screen.width; y++) {
        this.screen.setPixel(
          x,
          y,
          new Color(
            ...HSVtoRGB((this.atHue + (x + y / 2) * this.stepSize) % 1, 1, 1)
          )
        );
      }
    }

    this.atHue += this.stepSize;
    this.atHue %= 1;

    this.screen.updateScreen();
  }
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports = (screen) => new Rainbow(screen);
