function Vehicle(x, y, target){
  this.pos = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.target = target;
  this.angle = 0; //angle of rotation of the vehicle
  this.view = PI / 2; //field of vision
  this.inside = false; //within the field of vision
  this.r = 15;

  this.update = function(){
    this.approach(this.target);

    this.vel.add(this.acc);
    this.vel.limit(maxVel);

    this.pos.add(this.vel);

    this.acc.mult(0);

    this.detect();
  }

  this.show = function(){
    push();
    if(this.inside)
      fill(0, 0, 255);
    else {
      fill(0, 255, 0);
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    pop();
  }

  this.approach = function(target){
    let dir = p5.Vector.sub(this.target.pos, this.pos);
    dir.setMag(maxVel);

    let steer = p5.Vector.sub(dir, this.vel);
    steer.limit(maxForce);

    this.acc = steer;
  }

  this.detect = function(){
    let x = this.pos.x + 2 * this.r * cos(this.angle);
    let y = this.pos.y + 2 * this.r * sin(this.angle);

    this.angle = atan2(this.vel.y, this.vel.x);

    var vision = {
      leftX: this.pos.x + 2 * this.r * cos(this.angle - this.view / 2),
      leftY: this.pos.y + 2 * this.r * sin(this.angle - this.view / 2),
      rightX: this.pos.x + 2 * this.r * cos(this.angle + this.view / 2),
      rightY: this.pos.y + 2 * this.r * sin(this.angle + this.view / 2)
    }

    line(this.pos.x, this.pos.y, vision.leftX, vision.leftY);
    line(this.pos.x, this.pos.y, vision.rightX, vision.rightY);

    //ellipse(x, y, 10, 10);

    let target = createVector(mouseX, mouseY);

    let vectA = p5.Vector.sub(this.target.pos, this.pos);
    let vectB = this.vel;
    let theta = floor(Vehicle.angleBetween(vectA, vectB));

    if(map(theta, 0, 180, 0, PI) < (this.view / 2)){
      this.inside = true;
    }else{
      this.inside = false;
    }
    console.log(theta);
  }

  Vehicle.angleBetween = function(a, b){
    let dotProduct = a.x * b.x + a.y * b.y;
    let aMag = a.mag();
    let bMag = b.mag();
    let magProduct = aMag * bMag;
    let theta = acos(dotProduct / magProduct);
    return map(theta, 0, PI, 0, 180);
  }
}
