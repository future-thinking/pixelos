const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { Interface } = require("./interface.js");
const { AppManager } = require("./appManager");

require("dotenv").config();
const isOnlyEmulating = process.argv.includes("-e") ? true : false;

const screen = new Interface(144, isOnlyEmulating);

const bodyParser = require("body-parser");

app.use(require("express").static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var players = new Array();

global.emulating_sockets = new Array();

var games = new Array();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", function (socket) {
  if (players.length >= 4) {
    socket.emit("game_full", "");
    console.log("Player got kicked for 'Game Full!'");
    return;
  }
  players.push(socket);
  console.log("Player connected as player" + players.length + ".");
  updatePlayerNumbers();
  socket.on("disconnect", () => {
    console.log("User left.");
    if (players.includes(socket)) {
      players.splice(players.indexOf(socket), 1);
    }
    if (emulating_sockets.includes(socket)) {
      emulating_sockets.splice(emulating_sockets.indexOf(socket), 1);
    }
    updatePlayerNumbers();
  });
  socket.on("only_emul", (msg) => {
    console.log("Emulate Request recieved.");
    if (players.includes(socket)) {
      players.splice(players.indexOf(socket), 1);
    }
    if (!emulating_sockets.includes(socket)) {
      emulating_sockets.push(socket);
    }
    updatePlayerNumbers();
    console.log("Emulating Sockets: " + emulating_sockets);
  });
  socket.on("direction_change", (dir) => {
    if (currentGame != -1) {
      games[currentGame].playerInput(
        socket,
        players.indexOf(socket) + 1,
        "direction_change",
        dir
      );
    }
  });
  socket.on("restart_game", (msg) => {
    startGame(1);
    console.log("Started game: " + lastGame);
  });
  console.log("");
});

function updatePlayerNumbers() {
  console.log("players: " + players);
  players.forEach((socket, index) => {
    console.log("emitting", index + 1);
    socket.emit("player_number_info", index + 1);
  });
}

const port = process.env.PORT;
http.listen(port, function () {
  console.log("listening on *:" + port);
});

const appManager = new AppManager("./src/modules", screen);
appManager.startApp(appManager.getAppByIndex(1));
