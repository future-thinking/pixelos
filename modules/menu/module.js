class Menu {
  constructor(screen_interface) {
    this.interface = screen_interface;
    console.log("blallblblalalblalbla:" + this.interface);
    this.ended = false;
    this.page = 0;
    this.direction = "up";
  }

  start(players) {
    console.log("menu start");
<<<<<<< HEAD
    interface.clearScreen();
    for(var x; x < interface.getWidth, x++;) {
      interface.setPixel(x,0, 255,255,255)
    }
    interface.showFullscreenPng('./logo.png');
    interface.updateScreen;
=======
    this.interface.clearScreen();
    for(var i; i < this.interface.getWidth)
>>>>>>> 0e2e1363e6a2985b0790e126bb013bdbd1d25184
  }

  isEnded() {
    return this.ended;
  }

  update() {
    console.log("game tick");
    this.interface.updateScreen();

  }

  end() {
    console.log("menu end");
  }

  //on player input player_socket = player type: direction_change,
  playerInput(player_socket, type, content) {
    if (type="direction_change" && players.indexOf(player_socket == 0)) {
      this.playerObjs[this.players.indexOf(player_socket)].setDirection(content);
    }
  }

  setDirection(direction) {
    if (direction.w) {
      if (this.direction != "down") {
        this.direction = "up";
      }
    }
    if (direction.d) {
      if (this.direction != "left") {
        this.direction = "right";
      }
    }
    if (direction.s) {
      if (this.direction != "up") {
        this.direction = "down";
      }
    }
    if (direction.a) {
      if (this.direction != "right") {
        this.direction = "left";
      }
    }
  }

  applyDirection() {
    switch (this.direction) {
      case "up":
        this.y += 1;
        break;
      case "down":
        this.y += -1;
        break;
      case "right":
        this.x += 1;
        break;
      case "left":
        this.x -= 1;
        break;
    }
  }

  showMenu() {
    this.interface.clearScreen();

  }

}

module.exports = Menu;
