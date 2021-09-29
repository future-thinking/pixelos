const isOnlyEmulating = process.argv.includes("-e") ? true : false;

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fs = require("fs");

const interface_module = require("./interface.js");
global.interface = new interface_module(144, isOnlyEmulating);

const bodyParser = require("body-parser");

app.use(require("express").static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var players = new Array();

global.emulating_sockets = new Array();

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}

var games = new Array();

let module_folders = getDirectories("./modules");
module_folders.forEach((item) => {
  let game = require("./modules/" + item + "/module.js");
  games.push(new game(interface));
});

var currentGame = -1;
var lastGame = -1;

function startGame(game) {
  if (currentGame != -1) {
    games[currentGame].end();
  }
  if (game != undefined) {
    currentGame = game;
    games[currentGame].start(players);
    lastGame = currentGame;
  } else {
    console.log("game undefined");
  }
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/eval", function (req, res) {
  res.sendFile(__dirname + "/public/eval.html");
});

app.post("/restartgame", function (req, res) {
  startGame(currentGame);
});

app.post("/startgame", function (req, res) {
  console.log("/startgame");
  startGame(req.body.game);
});

app.post("/evalpost", (req, res) => {
  console.log("Eval: " + req.body.eval);
  eval(req.body.eval);
  res.redirect("/eval");
});

app.post("/adminloginattemp", (req, res) => {
  console.log("adminloginattemp by: " + req.body.username);
  if (req.body.username == "pixel" && req.body.pass == "pixelos") {
    console.log(req.body.username + " " + req.body.pass);
  }
  res.sendFile(__dirname + "/admin/admin.html");
});

app.post("/startgamepost", (req, res) => {
  console.log("startgamepost: " + req.body.game);
  if (req.body.game != -1) {
    startGame(req.body.game);
  }
});

app.post("/tempstartpost", (req, res) => {
  startGame(1);
  res.redirect("/temp_starter.html");
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

http.listen(3000, function () {
  console.log("listening on *:3000");
});

setInterval(function () {
  if (currentGame != -1) {
    games[currentGame].update();
    if (games[currentGame].isEnded()) {
      games[currentGame].end();
      currentGame = -1;
    }
  }
}, 50);
