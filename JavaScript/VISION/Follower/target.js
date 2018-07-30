function Target(){
  this.pos = createVector(mouseX, mouseY);

  this.update = function(){
    this.pos = createVector(mouseX, mouseY);
  }

  this.show = function(){
    push();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
    pop();
  }
}
