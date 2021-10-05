var socket = io();

socket.emit("only_emul", "");

socket.on("pixel_update", (pixels) => {
  pixels.forEach((row, y) => {
    row.forEach((pixel, x) => {
      let color = pixel.toString(16);
      color = color + "";
      color = "#" + color.padStart(6, "0");
      console.log(color);
      document.getElementById("pixelTable").rows[y].cells[
        x
      ].style.backgroundColor = color;
    });
  });
});
