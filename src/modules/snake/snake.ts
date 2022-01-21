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

class SnakeInstance implements GameInstance {
  position: [number, number] = [2, 2];
  direction: Direction = Direction.CENTER;

  onStart(): void {
    PixelOS.getInterface().fill(new Color(0, 255, 0)).update();

    PixelOS.getInstance().webManager.playerManager.on(
      "playerDirectionUpdate",
      (event: IPlayerDirectionUpdate) => {
        this.direction = event.direction;
      }
    );

    new Ticker(10, this, () => {
      // console.log(
      //   this.direction,
      //   directionDelta,
      //   getDirectionDelta(this.direction)
      // );
      console.log(typeof Direction.CENTER, typeof this.direction);
      console.log(Direction.CENTER, this.direction);
      const delta = getDirectionDelta(this.direction);
      // console.log(delta);
      this.position[0] += delta[0];
      this.position[1] += delta[1];

      this.position[0] =
        this.position[0] % PixelOS.getInstance().screenInterface.width;
      this.position[1] =
        this.position[1] % PixelOS.getInstance().screenInterface.height;
      PixelOS.getInterface()
        .clear()
        .setPixel(this.position[0], this.position[1], new Color(255, 0, 0))
        .update();
    });
  }
  gameManager: gameManager;
  onEnd(): void {}

  hasEnded(): boolean {
    return false;
  }
}
