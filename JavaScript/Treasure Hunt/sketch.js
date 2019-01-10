let map;
const size = {
  len: 500,
  scale: 50
}

function setup(){
  createCanvas(size.len, size.len);
  map = new Map(size.len, size.scale);
  this.temp = map;
}

function draw(){
  background(255);
  map.show();
  map.update();
}

function keyPressed() {
  map.player.action(keyCode);
}
