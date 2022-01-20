import { AppManager } from "./appManager";
import ScreenInterface from "./screenInterface";
import WebManager from "./webManager";

export default class PixelOS {
  private static _instance: PixelOS;

  webManager: WebManager;
  appManager: AppManager;
  screenInterface: ScreenInterface;

  emulating: boolean;

  constructor() {
    this.emulating = process.argv.includes("-e") ? true : false;

    this.screenInterface = new ScreenInterface(
      process.env.WIDTH,
      process.env.HEIGHT,
      this.emulating
    );

    this.webManager = new WebManager();
  }

  public static get Instance(): PixelOS {
    return this._instance ?? (this._instance = new PixelOS());
  }

  public static getInterface(): ScreenInterface {
    return this.Instance.screenInterface;
  }
}
