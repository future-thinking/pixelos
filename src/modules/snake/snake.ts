import gameManager, { Game, GameInstance, Ticker } from "../../gameManager";
import PixelOS from "../../pixelOs";
import { Color } from "../../screenInterface";
import {
  Direction,
  getDirectionDelta,
  IPlayerDirectionUpdate,
  Player,
} from "../../webManager";

export const SnakeGame: Game = {
  name: "Snake",
  minimumPlayers: 1,
  maximumPlayers: 4,
  factory: function (): GameInstance {
    return new SnakeInstance();
  },
};

interface SnakePlayer {
  webPlayer: Player;
  snake: Snake;
}

interface Pixel {
  x: number;
  y: number;
}

const colors: [Color, Color][] = [
  [new Color(0, 0, 255), new Color(0, 0, 160)],
  [new Color(255, 0, 0), new Color(160, 0, 0)],
  [new Color(0, 255, 0), new Color(0, 160, 0)],
  [new Color(255, 255, 0), new Color(160, 160, 0)],
];

class SnakeInstance implements GameInstance {
  snakes: Snake[] = [];

  ended = false;

  onStart(): void {
    PixelOS.getInstance().webManager.playerManager.players.forEach((player) => {
      this.snakes.push(new Snake(player));
    });

    PixelOS.getInstance().webManager.playerManager.on(
      "playerDirectionUpdate",
      (event: IPlayerDirectionUpdate) => {
        if (event.direction == Direction.CENTER) return;
        this.snakes.forEach((snake) => snake.someSnakeDirectionUpdate(event));
      }
    );
    new Ticker(0.5, this, () => {
      // PixelOS.getInterface().clear();
      // // for (const snake of this.snakes) {
      // //   snake.move();
      // //   snake.render();
      // // }
      // PixelOS.getInterface().update();
    });
  }
  gameManager: gameManager;
  onEnd(): void {
    console.log("snake ended");
    this.ended = true;
  }

  hasEnded(): boolean {
    return this.ended;
  }
}

class Snake {
  webPlayer: Player;
  playerIndex: number;
  head: Pixel;
  direction: Direction;
  body: Pixel[] = [];

  constructor(webPlayer: Player) {
    this.webPlayer = webPlayer;

    this.playerIndex = this.webPlayer.getPlayerNumber() - 1;

    const [headSpawn, direction] = getSpawn[this.playerIndex];

    this.direction = direction;

    this.head = headSpawn;

    const [dx, dy] = getDirectionDelta(this.direction);
    for (let i = 0; i < 2; i++) {
      this.body.push({
        x: this.head.x + dx * i,
        y: this.head.y + dy * i,
      });
    }
  }

  move() {
    const [dx, dy] = getDirectionDelta(this.direction);
    this.head = {
      x: this.head.x + dx,
      y: this.head.y + dy,
    };
    this.body.push(this.head);
  }

  render() {
    const [headColor, bodyColor] = colors[this.playerIndex];
    this.body.forEach((pixel) => {
      PixelOS.getInterface().setPixel(pixel.x, pixel.y, bodyColor);
    });
    PixelOS.getInterface().setPixel(this.head.x, this.head.y, headColor);
  }

  someSnakeDirectionUpdate(update: IPlayerDirectionUpdate) {
    if (update.player.uuid == this.webPlayer.uuid) {
      this.direction = update.direction;
    }
  }
}

function getSpawn(playerIndex): [Pixel, Direction] {
  return [
    [{ x: 1, y: 1 }, Direction.DOWN],
    [{ x: PixelOS.getInterface().width - 2, y: 1 }, Direction.DOWN],
    [{ x: 1, y: PixelOS.getInterface().height - 2 }, Direction.UP],
    [
      {
        x: PixelOS.getInterface().width - 2,
        y: PixelOS.getInterface().height - 2,
      },
      Direction.UP,
    ],
  ][playerIndex] as [Pixel, Direction];
}
