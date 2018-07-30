function Vehicle(x, y, targets){
  this.pos = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.targets = targets;
  this.angle = 0; //angle of rotation of the vehicle
  this.view = PI / 1.8  /* PI / 1.5 */ ; //field of vision
  this.inside = false; //within the field of vision
  this.r = 15; //radius of the vehicle
  this.sight = 100; //How far ahead it sees
  this.curveSpeed = 3; //How fast it makes a curve
  this.edge = {
    top: false,
    bottom: false
  };

  Vehicle.hitCounter = 0;

  this.update = function(){
    this.walk(this.targets);
    this.detect();

    this.vel.add(this.acc);
    this.vel.limit(maxVel);

    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  this.show = function(){
    push();
    if(this.inside)
      fill(0, 0, 255);
    else
      fill(0, 255, 0);

    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    pop();
  }

  this.walk = function(){
    this.vel = createVector(1, 0);

    vehicle.edge.bottom = false;
    vehicle.edge.top = false;

    if(this.pos.y < 3 * this.r){
      this.edge.top = true;
    }

    if(this.pos.y > height - 3 * this.r){
      this.edge.bottom = true;
    }
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

    let closest = dist(this.targets[0].pos.x, this.targets[0].pos.y, this.pos.x, this.pos.y);
    let closestTarget = this.targets[0];

    for(let i = 0; i < this.targets.length; i++){
      let distance = dist(this.targets[i].pos.x, this.targets[i].pos.y, this.pos.x, this.pos.y);
      if(closest > distance && this.targets[i].pos.x > this.pos.x){
        closest = distance;
        closestTarget = this.targets[i];
      }

      if(closest < this.r)
        Vehicle.hitCounter++;
    }

    let vectA = p5.Vector.sub(createVector(closestTarget.pos.x, closestTarget.pos.y), this.pos);
    let vectB = this.vel;
    let theta = floor(Vehicle.angleBetween(vectA, vectB));
    let piTheta = map(theta, 0, 180, 0, PI);


    if(piTheta < (this.view / 2)){
      if(vectA.mag() < this.sight){
        this.inside = true;
        let newVel;

        if(closestTarget.pos.y > this.pos.y){ //below me
          newVel = p5.Vector.fromAngle(-piTheta);
        } else{
          newVel = p5.Vector.fromAngle(piTheta);
        }

        newVel.y = newVel.y / newVel.mag();
        newVel.y *= (this.curveSpeed / closest * this.sight);
        newVel.x = 0;

        this.vel = newVel;

        if(this.vel.x == 0 && this.vel.y == 0){
          this.vel = p5.Vector.random2D();
        }
      }
      else{
        this.vel = createVector(0, 0);
      }
    }else{
      this.inside = false;
      this.vel = createVector(0, 0);
    }
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
