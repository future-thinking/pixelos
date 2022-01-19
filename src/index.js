const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { Interface, Color } = require("./interface.js");
const { AppManager } = require("./appManager");

require("dotenv").config();
const isOnlyEmulating = process.argv.includes("-e") ? true : false;

const screen = new Interface(144, isOnlyEmulating);

screen.drawPng("img/heart.png").then(() => screen.updateScreen());

const { PlayerManager } = require("./playerManager.js");
const { default: WebManager } = require("./webManager.js");

const webManager = new WebManager();

const playerManager = new PlayerManager(webManager.getIo(), screen);

const appManager = new AppManager("./src/modules", screen, playerManager);
global.appManager = appManager;
