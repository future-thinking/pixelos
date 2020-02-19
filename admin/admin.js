function restartButtonPress() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/restartgame", true);
  xhttp.send();
}

function gamestartButtonPress() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/tempstartpost", true);
  xhttp.send();
}
