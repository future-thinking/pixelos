import bodyParser from "body-parser";
import EventEmitter from "events";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import PixelOS from "./pixelOs";

export default class WebManager extends EventEmitter {
  app: express.Application;
  ioServer: Server;

  playerManager: PlayerManager;

  constructor() {
    super();

    this.playerManager = new PlayerManager(this);

    this.app = express();

    this.app.use(express.static("client/dist"));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const http = createServer(this.app);
    this.ioServer = new Server(http, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.initSocketIO();

    const port = process.env.PORT ?? 3000;
    http.listen(port, function () {
      console.log("listening on *:" + port);
    });
  }

  clients: Set<WebClient> = new Set<WebClient>();

  initSocketIO() {
    this.ioServer.on("connection", (socket) => {
      console.log("a user connected");
      const client = new WebClient(socket, this);
      this.emit("clientConnect", client);
      this.clients.add(client);
    });
  }

  getIo() {
    return this.ioServer;
  }
}

export class PlayerManager extends EventEmitter {
  webManager: WebManager;

  players: Set<Player> = new Set<Player>();

  currentPlayerUuid: number;

  constructor(webManager: WebManager) {
    super();
    this.webManager = webManager;
  }

  createUser(webClient: WebClient): Player {
    const player = new Player(webClient, this);
    this.players.add(player);

    return player;
  }
}

export class Player {
  webClient: WebClient;
  playerManager: PlayerManager;
  uuid: number;
  name: number;

  constructor(webClient: WebClient, playerManager: PlayerManager) {
    this.playerManager = playerManager;
    this.webClient = webClient;

    this.uuid = playerManager.currentPlayerUuid++;

    this.playerManager.emit("playerConnect", this);
  }

  getPlayerNumber() {
    return [...this.playerManager.players.values()].indexOf(this) + 1;
  }

  onDisconnect() {
    this.playerManager.emit("playerDisconnect", this);
    this.playerManager.players.delete(this);
  }
}

enum clientType {
  PLAYER,
}

export class WebClient {
  socket: Socket;
  clientType: clientType;
  webManager: WebManager;

  player: Player | null = null;

  constructor(socket: Socket, webManager: WebManager) {
    this.socket = socket;
    this.clientType = clientType.PLAYER;

    if (this.clientType == clientType.PLAYER) {
      // this.player =
      //   PixelOS.getInstance().webManager.playerManager.createUser(this);
    }

    socket.on("disconnect", () => {
      this.webManager.clients.delete(this);
      this.webManager.emit("clientDisconnect", this);

      if (this.clientType == clientType.PLAYER) {
        this.player.onDisconnect();
      }
    });
  }
}
