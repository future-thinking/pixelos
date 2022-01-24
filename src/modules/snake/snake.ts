import { spawn } from "child_process";
import { runInThisContext } from "vm";
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
interface Snake {
  head: Pixel;
  direction: Direction;
  body: Pixel[];
}

const spawns: [Pixel, Direction][] = [
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
];

class SnakeInstance implements GameInstance {
  position: [number, number] = [2, 2];
  direction: Direction = Direction.CENTER;

  players: { [id: number]: SnakePlayer } = {};

  onStart(): void {
    // PixelOS.getInterface().fill(new Color(0, 255, 0)).update();
    // PixelOS.getInstance().webManager.playerManager.players.forEach((player) => {
    //   this.players[player.uuid] = {
    //     webPlayer: player,
    //     snake: {
    //       head: spawns[player.getPlayerNumber()][0],
    //       direction: spawn[player.getPlayerNumber()][1],
    //       body: [],
    //     },
    //   };
    // });
    // PixelOS.getInstance().webManager.playerManager.on(
    //   "playerDirectionUpdate",
    //   (event: IPlayerDirectionUpdate) => {
    //     if (event.direction == Direction.CENTER) return;
    //     if (this.players[event.player.uuid]) {
    //       this.players[event.player.uuid].snake.direction = event.direction;
    //     }
    //   }
    // );
    // new Ticker(2, this, () => {
    //   PixelOS.getInterface().clear();
    //   for (const player in this.players) {
    //     const snake = this.players[player].snake;
    //     const [dx, dy] = getDirectionDelta(snake.direction);
    //     snake.body.push(snake.head);
    //     snake.head = {
    //       x: snake.head.x + dx,
    //       y: snake.head.y + dy,
    //     };
    //     PixelOS.getInterface().setPixel(
    //       snake.head.x,
    //       snake.head.y,
    //       new Color(255, 0, 0)
    //     );
    //     snake.body.forEach((pixel) => {
    //       PixelOS.getInterface().setPixel(
    //         pixel.x,
    //         pixel.y,
    //         new Color(255, 0, 0)
    //       );
    //     });
    //   }
    //   PixelOS.getInterface().update();
    // });
  }
  gameManager: gameManager;
  onEnd(): void {}

  hasEnded(): boolean {
    return false;
  }
}
