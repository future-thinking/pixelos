class PlayerManager {
  /**
   * @type {Player[]}
   */
  players = [];

  constructor(io) {
    io.on("connection", (socket) => {
      if (this.players.length >= 4) {
        socket.emit("game_full", "");
        return;
      }

      this.players.push(new Player(socket, this));
      console.log("Player connected as player" + this.players.length + ".");
      this.updatePlayerNumbers();
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
  }
}

module.exports = { Player, PlayerManager };
