const path = require("path");
const fs = require("fs");
const { PlayerManager } = require("./playerManager");

class AppManager {
  /**
   * @type {App[]}
   */
  apps = [];

  /**
   * @type {App | null}
   */
  running = null;

  /**
   * @type {PlayerManager}
   */
  playerManager;

  constructor(appRoot, screen, playerManager) {
    this.screen = screen;
    this.playerManager = playerManager;

    const appConfigs = fs
      .readdirSync(appRoot)
      .map((file) => appRoot + "/" + file)
      .filter((file) => fs.statSync(file).isDirectory())
      .filter((file) => fs.existsSync(path.join(file, "app.json")))
      .map((file) => path.join(file, "app.json"));

    appConfigs.forEach((path) =>
      this.apps.push(new App(path, screen, playerManager, this))
    );

    console.log(appConfigs);
  }

  getAppByIndex(index) {
    return this.apps[index];
  }

  getAppByName(name) {
    return this.apps.filter((app) => app.config.name == name)[0];
  }

  appStarted(app) {
    if (this.running != null) {
      console.log("stopping old app");
      this.running.stop();
      this.running = null;
    }

    this.running = app;
  }

  stopApp() {
    if (this.running) {
      this.running.stop();
    }
  }

  appStopped(app) {
    this.running = null;
    console.log("stopped app");
    this.screen.clearScreen();
    this.screen.drawPng("img/heart.png").then(() => this.screen.updateScreen());
    this.playerManager.clearListeners();
  }
}

class App {
  config;
  /**
   * type {Function}
   */
  factory;
  instance;
  screen;
  /**
   * @type {PlayerManager}
   */
  playerManager;
  /**
   * @type {AppManager}
   */
  appManager;

  /**
   * @type {Ticker}
   */
  ticker;

  constructor(configPath, screen, playerManager, appManager) {
    this.screen = screen;
    this.playerManager = playerManager;
    this.appManager = appManager;

    configPath = path.join(__dirname, "..", configPath);

    this.config = require(configPath);
    this.factory = require(path.join(configPath, "..", this.config.main));

    if (this.config.tickRate) {
      this.ticker = new Ticker(this.config.tickRate);
    }
  }

  stop() {
    if (this.ticker) {
      this.ticker.stop();
    }

    if (this.instance) {
      this.instance.stop();
      delete this.instance;
      this.appManager.appStopped(this);
    }
  }

  /**
   *
   * @param {Player[]} players
   */
  start() {
    console.log("Starting", this.config.name);

    this.stop();

    this.instance = this.factory(this.screen);

    this.appManager.appStarted(this);

    this.instance.start(this.playerManager.getPlayersMirror(), () => {
      console.log("application ended");
      this.stop();
    });

    if (this.ticker) {
      this.ticker.start(() => {
        this.instance.tick();
      });
    }
  }
}

class Ticker {
  ms;
  interval;
  cb;
  running = false;

  constructor(ms) {
    this.ms = ms;
  }

  start(cb) {
    this.stop();
    this.cb = cb;
    this.running = true;
    this._tick();
  }

  stop() {
    clearTimeout(this.interval);
    this.running = false;
  }

  _tick() {
    if (this.running) {
      this.cb();
      this.interval = setTimeout(() => this._tick(), this.ms);
    }
  }
}

module.exports = { AppManager };
