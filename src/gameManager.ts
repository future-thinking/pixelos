export default class GameManager {
  gameInstance: GameInstance | null = null;

  constructor() {}

  endGame() {
    this.gameInstance.onEnd();
    this.gameInstance = null;
  }

  startGame(game: Game) {
    if (this.gameInstance != null) {
      this.endGame();
    }

    this.gameInstance = game.factory();
    this.gameInstance.onStart();
  }
}

export abstract class GameInstance {
  gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  abstract onEnd(): void;
  abstract onStart(): void;
  abstract hasEnded(): boolean;
}

type factoryFunction = () => GameInstance;

export interface Game {
  name: string;
  minimumPlayers: number;
  factory: factoryFunction;
}

type TickerFunction = (delta: number) => void | Function;

export class Ticker {
  tps: number;

  running: boolean = true;

  currentTimeout: ReturnType<typeof setTimeout>;
  gameInstance: GameInstance;

  tickerFunction: TickerFunction;

  lastTickTime: number;

  constructor(
    tps: number,
    gameInstance: GameInstance,
    tickerFunction: TickerFunction
  ) {
    this.tps = tps;
    this.gameInstance = gameInstance;
    this.tickerFunction = tickerFunction;

    this.start();
  }

  start() {
    this.lastTickTime = this.getCurrentTime();
    this.running = true;

    this.tick();
  }

  stop() {
    this.running = false;
    clearTimeout(this.currentTimeout);
  }

  private getCurrentTime() {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000 + hrTime[1] / 1000;
  }

  private tick() {
    if (!this.gameInstance.hasEnded() && this.running) {
      const currentTime = this.getCurrentTime();
      const absoluteTimeDelta = currentTime - this.lastTickTime;
      const expectedTimeDelta = this.getIntervalTime() * 1000;
      this.tickerFunction(absoluteTimeDelta / expectedTimeDelta);
      this.currentTimeout = setTimeout(() => {
        this.tick();
      }, this.getIntervalTime());
    }
  }

  private getIntervalTime(): number {
    return 1000 / this.tps;
  }
}
