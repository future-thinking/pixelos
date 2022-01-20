import gameManager, { Game, GameInstance, Ticker } from "../../gameManager";
import PixelOS from "../../pixelOs";
import { Color } from "../../screenInterface";

export const SnakeGame: Game = {
  name: "Snake",
  minimumPlayers: 1,
  maximumPlayers: 4,
  factory: function (): GameInstance {
    return new SnakeInstance();
  },
};

class SnakeInstance implements GameInstance {
  onStart(): void {
    PixelOS.getInterface().fill(new Color(0, 255, 0)).update();

    new Ticker(2, this, () => {
      PixelOS.getInterface().fill(Color.random()).update();
    });
  }
  gameManager: gameManager;
  onEnd(): void {}

  hasEnded(): boolean {
    return false;
  }
}
