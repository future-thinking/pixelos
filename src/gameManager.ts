export default class GameManager {
  gameInstance: GameInstance;

  constructor() {}

  endGame() {
    this.gameInstance.onEnd();
  }
}

export abstract class GameInstance {
  gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  abstract onEnd(): void;

  endGame() {
    this.gameManager.endGame();
  }
}

type factoryFunction = () => GameInstance;

export interface Game {
  name: string;
  minimumPlayers: number;
  factory: factoryFunction;
}
