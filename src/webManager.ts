import bodyParser from "body-parser";
import EventEmitter from "events";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import PixelOS from "./pixelOs";
import { Dir } from "fs";
import { SocketAddress } from "net";
import { ClientSessionOptions } from "http2";
import { SnakeGame } from "./modules/snake/snake";

export default class WebManager extends EventEmitter {
  app: express.Application;
  ioServer: Server;

  playerManager: PlayerManager;

  lastPing: number = Date.now();

  clients: Set<WebClient> = new Set<WebClient>();

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

    setInterval(() => {
      for (const client of this.clients) {
        client.socket.emit("ping");
      }
      this.lastPing = Date.now();
    }, 2000);
  }

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

  currentPlayerUuid: number = 0;

  constructor(webManager: WebManager) {
    super();
    this.webManager = webManager;
  }

  createUser(webClient: WebClient): Player {
    const player = new Player(webClient, this);
    this.players.add(player);

    setTimeout(() => {
      PixelOS.getInstance().gameManager.startGame(SnakeGame);
    }, 10);
    return player;
  }
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  CENTER,
}

export function getDirectionDelta(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.UP:
      return [0, -1];
    case Direction.DOWN:
      return [0, 1];
    case Direction.LEFT:
      return [-1, 0];
    case Direction.RIGHT:
      return [1, 0];
    case Direction.CENTER:
      return [0, 0];
  }
}

export interface IPlayerDirectionUpdate {
  player: Player;
  direction: Direction;
}
export class Player {
  webClient: WebClient;
  playerManager: PlayerManager;
  uuid: number;
  name: number;

  direction: Direction = Direction.CENTER;

  constructor(webClient: WebClient, playerManager: PlayerManager) {
    this.playerManager = playerManager;
    this.webClient = webClient;

    this.uuid = playerManager.currentPlayerUuid++;

    this.playerManager.emit("playerConnect", this);

    this.setupSocketHooks();
  }

  setupSocketHooks() {
    this.webClient.socket.on("direction_update", (direction: Direction) => {
      if (this.direction != direction) {
        this.direction = direction;
        this.playerManager.emit("playerDirectionUpdate", {
          player: this,
          direction: this.direction,
        } as IPlayerDirectionUpdate);
      }
    });
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

  ping: number = -1;

  constructor(socket: Socket, webManager: WebManager) {
    this.socket = socket;
    this.clientType = clientType.PLAYER;
    this.webManager = webManager;

    if (this.clientType == clientType.PLAYER) {
      this.player = this.webManager.playerManager.createUser(this);
    }

    socket.on("disconnect", () => {
      this.webManager.clients.delete(this);
      this.webManager.emit("clientDisconnect", this);

      if (this.clientType == clientType.PLAYER) {
        this.player.onDisconnect();
      }
    });

    socket.on("ping", (pingId) => {
      socket.emit("pong", pingId);
    });

    socket.on("pong", () => {
      this.ping = Date.now() - this.webManager.lastPing;
      socket.emit("pingValue", this.ping);

      console.log("got ponged with ping of " + this.ping);
    });
  }
}
