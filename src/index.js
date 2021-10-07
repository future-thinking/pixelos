const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { Interface, Color } = require("./interface.js");
const { AppManager } = require("./appManager");

require("dotenv").config();
const isOnlyEmulating = process.argv.includes("-e") ? true : false;

const screen = new Interface(144, isOnlyEmulating);

screen.drawPng("img/heart.png").then(() => screen.updateScreen());

const bodyParser = require("body-parser");
const { PlayerManager } = require("./playerManager.js");

app.use(require("express").static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

global.emulating_sockets = new Array();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT;
http.listen(port, function () {
  console.log("listening on *:" + port);
});

const playerManager = new PlayerManager(io, screen);

const appManager = new AppManager("./src/modules", screen, playerManager);
global.appManager = appManager;