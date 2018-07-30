function Target(x, y){
  this.pos = createVector(x, y);
  this.vel = createVector(-3, 0);

  this.update = function(){
    this.pos.add(this.vel);
  }

  this.show = function(){
    push();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
    pop();
  }
}
