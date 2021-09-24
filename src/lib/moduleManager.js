const fs = require('fs');

module.exports = class moduleManager {
    constructor(screen) {
        this.modules = new Array();
        this.current = -1;
        this.last = -1;

        this.players;

        let module_folders = this.getDirectories("./src/modules");
        module_folders.forEach((item) => {
          let module =  require("../modules/" + item + "/module.js");
          modules.push(new module(screen));
        });

        setInterval(this.update, 50);
    }

    getCurrent() {
        return this.modules[this.current];
    }

    setPlayers(players) {
        this.players = players;
    }

    start(module) {
        if (current != -1) {
        modules[current].end();
        }
        if (module != undefined) {
        current = module;
        modules[current].start(players);
        last = current;
        }
        else {
        console.log("module undefined")
        }
    }

    update() {
        if (current != -1) {
            modules[current].update();
            if (modules[current].isEnded()) {
            modules[current].end();
            current = -1;
            }
        }
    }
    
    restart() {
        this.start(this.current);
    }

    getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
          return fs.statSync(path+'/'+file).isDirectory();
        });
      }

}
