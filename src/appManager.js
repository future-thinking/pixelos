const path = require("path");
const fs = require("fs");

class AppManager {
  /**
   * type {App[]}
   */
  apps = [];

  constructor(appRoot, screen) {
    this.screen = screen;

    const appConfigs = fs
      .readdirSync(appRoot)
      .map((file) => appRoot + "/" + file)
      .filter((file) => fs.statSync(file).isDirectory())
      .filter((file) => fs.existsSync(path.join(file, "app.json")))
      .map((file) => path.join(file, "app.json"));

    appConfigs.forEach((path) => this.apps.push(new App(path, screen)));

    console.log(appConfigs);
  }

  getAppByIndex(index) {
    return this.apps[index];
  }

  startApp(app) {
    app.start();
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

  constructor(configPath, screen) {
    this.screen = screen;

    configPath = path.join(__dirname, "..", configPath);

    this.config = require(configPath);
    this.factory = require(path.join(configPath, "..", this.config.main));
  }

  stop() {
    if (this.instance) {
      this.instance.stop();
      delete this.instance;
    }
  }
  start() {
    console.log("starting", this.config.name);

    this.stop();

    this.instance = this.factory(this.screen);

    console.log(this.instance);

    this.instance.start();
  }
}

module.exports = { AppManager };
