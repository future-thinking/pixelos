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
          this.modules.push(new module(screen));
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
        if (this.current != -1) {
        this.modules[this.current].end();
        }
        if (module != undefined) {
        this.current = module;
        this.modules[this.current].start(this.players);
        this.last = this.current;
        }
        else {
        console.log("module undefined")
        }
    }

    update() {
        if (this.current != -1) {
            this.modules[this.current].update();
            if (this.modules[this.current].isEnded()) {
            this.modules[this.current].end();
            this.current = -1;
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
