import GameManager from "./gameManager";
import { SnakeGame } from "./modules/snake/snake";
import ScreenInterface, { Color } from "./screenInterface";
import WebManager from "./webManager";

export default class PixelOS {
  private static _instance: PixelOS;

  webManager: WebManager;
  gameManager: GameManager;
  screenInterface: ScreenInterface;

  emulating: boolean;

  constructor() {}

  start() {
    this.emulating = process.argv.includes("-e") ? true : false;

    this.screenInterface = new ScreenInterface(
      process.env.WIDTH,
      process.env.HEIGHT,
      this.emulating
    );

    this.screenInterface.fill(new Color(255, 200, 100)).update();

    this.webManager = new WebManager();

    this.gameManager = new GameManager();
  }

  public static init(): PixelOS {
    this._instance = new PixelOS();
    return this._instance;
  }

  public static getInstance(): PixelOS {
    return PixelOS._instance;
  }

  public static getInterface(): ScreenInterface {
    return PixelOS.getInstance().screenInterface;
  }
}
