import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

export default class WebManager {
  app: express.Application;
  ioServer: Server;

  constructor() {
    this.app = express();

    this.app.use(express.static("public"));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.get("/", function (req, res) {
      res.sendFile(__dirname + "/public/index.html");
    });

    const http = createServer(this.app);
    this.ioServer = new Server(http);

    const port = process.env.PORT ?? 3000;
    http.listen(port, function () {
      console.log("listening on *:" + port);
    });
  }

  clients: WebClient[] = [];

  initSocketIO() {
    this.ioServer.on("connection", function (socket) {
      console.log("a user connected");
      this.clients.push(new WebClient(socket));
    });
  }

  getIo() {
    return this.ioServer;
  }
}

export class WebClient {
  socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
}
