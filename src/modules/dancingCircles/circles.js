const { Interface, Color } = require("../../interface");

class Rainbow {
  /**
   * @type {Interface}
   */
  screen;

  circles = [
    {
      hue: 0.3,
      x: 15,
      y: 3,
      dir: 0.2,
    },
    {
      hue: 0.6,
      x: 9,
      y: 6,
      dir: -0.9,
    },
    {
      hue: 1,
      x: 6,
      y: 9,
      dir: 0.8,
    },
  ];

  constructor(screen) {
    this.screen = screen;
  }

  start(players) {
    this.screen.fillScreen(new Color(255, 0, 255));
    this.screen.updateScreen();
    console.log("players", players);
    players.forEach((player) => player.onDirectionChange(console.log));
  }

  stop() {}

  tick() {
    this.screen.clearScreen();

    for (const circle of this.circles) {
      const speed = 0.2;
      circle.x += speed * circle.dir;
      circle.y += speed - speed * circle.dir;
      circle.dir += 0.1;
      circle.dir = ((circle.dir + 1) % 1) - 1;
    }

    for (let x = 0; x < this.screen.width; x++) {
      for (let y = 0; y < this.screen.width; y++) {
        for (let circle of this.circles) {
          const [cX, cY] = [
            circle.x % this.screen.width,
            circle.y % this.screen.width,
          ];
          const dX = Math.min(Math.abs(x - cX), Math.abs(x - 11 - cX));
          const dY = Math.min(Math.abs(y - cY), Math.abs(y - 11 - cY));

          const d = Math.abs(Math.sqrt(dX * dX + dY * dY));

          const circleSize = 3;

          let v = 1 - d / circleSize;

          v = Math.max(0, v);

          if (v > 0)
            this.screen.setPixel(
              x,
              y,
              new Color(...HSVtoRGB(circle.hue, 1, v))
            );
        }
      }
    }

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

//colorChannelA and colorChannelB are ints ranging from 0 to 255
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix) {
  var channelA = colorChannelA * amountToMix;
  var channelB = colorChannelB * (1 - amountToMix);
  return parseInt(channelA + channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB, amountToMix) {
  var r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  var g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  var b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return [r, g, b];
}

module.exports = (screen) => new Rainbow(screen);
