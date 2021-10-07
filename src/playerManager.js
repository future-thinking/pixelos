const { Color } = require("./interface");

const playerColors = [
  new Color(0, 0, 255),
  new Color(255, 0, 0),
  new Color(0, 255, 0),
  new Color(255, 255, 0),
];
class PlayerManager {
  /**
   * @type {Player[]}
   */
  players = [];

  /**
   * @type{Interface}
   */
  screen;

  constructor(io, screen) {
    this.screen = screen;
    io.on("connection", (socket) => {
      if (this.players.length >= 4) {
        socket.emit("game_full", "");
        return;
      }

      this.displayStatus();

      this.players.push(new Player(socket, this));
      console.log("Player connected as player" + this.players.length + ".");
      this.updatePlayerNumbers();

      socket.emit(
        "games",
        global.appManager.apps.map((app) => app.config.name)
      );
    });
  }
  updatePlayerNumbers() {
    console.log("players: " + this.players);
    this.players.forEach((player, index) => {
      console.log("emitting", index + 1);
      player.socket.emit("player_number_info", index + 1);
    });
  }
  getPlayersMirror() {
    return [...this.players];
  }

  clearListeners() {
    this.players.forEach((player) => player.clearListeners());
  }

  statusTimeout;
  statusIteration = 0;

  displayStatus() {
    clearTimeout(this.statusTimeout);
    this.statusIteration = 0;
    this._status();
  }

  _status() {
    if (this.statusIteration < 8) {
      for (let i = 0; i < 4; i++) {
        this.screen.setPixel(8 + i, 0, new Color(255, 255, 255));
        if (this.statusIteration % 2 == 0 && this.players.length > i) {
          this.screen.setPixel(8 + i, 0, playerColors[i]);
        }
      }
      this.screen.updateScreen();

      this.statusTimeout = setTimeout(() => this._status(), 100);
    } else if (this.statusIteration > 8) {
      for (let i = 0; i < 4; i++) {
        this.screen.setPixel(8 + i, 0, new Color(0, 0, 0));
      }
      this.screen.updateScreen();
    }
    this.statusIteration++;
  }
}

class Player {
  /**
   * @type {PlayerManager}
   */
  playerManager;

  direction;

  directionListeners = [];

  onDirectionChange(callback) {
    this.directionListeners.push(callback);
  }

  clearListeners() {
    this.directionListeners = [];
  }

  constructor(socket, playerManager) {
    this.socket = socket;
    this.playerManager = playerManager;

    socket.on("disconnect", () => {
      console.log("User left.");
      playerManager.players.splice(playerManager.players.indexOf(this), 1);
      playerManager.updatePlayerNumbers();
    });

    socket.on("direction_change", (input) => {
      this.direction = input;
      this.directionListeners.forEach((cb) => cb(input));
    });

    socket.on("start_game", (game) => {
      global.appManager.getAppByName(game).start();
    });

    socket.on("stop_game", (game) => {
      global.appManager.stopApp();
    });

    socket.on("clear_screen", (game) => {
      global.appManager.stopApp();
      this.playerManager.screen.clearScreen();
      this.playerManager.screen.updateScreen();
    });
  }
}

module.exports = { Player, PlayerManager };
