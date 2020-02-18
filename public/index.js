var socket = io();

var orientation = 0;

function getCorrectCoords(dir) {
  let x = 0;
  let y = 0;
  switch (dir) {
    case 'UP':
      y = 1;
      break;
    case 'DOWN':
      y = -1;
      break;
    case 'RIGHT':
      x = 1;
      break;
    case 'LEFT':
      x = -1;
      break;
  }

  let xt = x;
  switch (orientation) {
    case 0:
      x = -x;
      break;
    case 2:
      x = -x;
      y = -y;
      break;
    case 1:
      x = y;
      y = xt;
      x = -x;
      y = -y;
      break;
    case 3:
      x = y;
      y = xt;
      break;
  }

  let output = {'x': x, 'y': y};
  return output;
}

function setOrientation(ori) {
  orientation = ori;
}

socket.on('ori', function(msg) {
  setOrientation(msg);
})
