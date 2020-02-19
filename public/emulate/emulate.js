var socket = io();

socket.emit("only_emul", "");

socket.on('pixup', (pixels) => {
  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel.startsWith("0x")) {
        pixel = "#" + pixel.substr(2);
      }
      document.getElementById("pixelTable").childNodes[y].childNodes[x].style.backgroundColor = pixel;
    });
  });
});
