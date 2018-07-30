var targets = [];
var vehicle;
var maxVel = 5;
var maxForce = 0.1;
var counter = 0;
var check;

function setup(){
    createCanvas(500, 500);

    targets.push(new Target(width / 2, height / 2));

    vehicle = new Vehicle(50, height / 2, targets);
}

function draw(){
    background(51);
    counter++;

    targets.forEach(target => {
      target.update();
      target.show();
    });

    vehicle.update();
    vehicle.show();

    if(counter % 10 == 0)
      targets.push(new Target(width + 10, random(height)));

    if(counter % 5 == 0){
      targets.push(new Target(width + 10, 0));
      targets.push(new Target(width + 10, height));
    }

    for(let i = targets.length - 1; i >= 0; i--){
      if(targets[i].pos.x < 0){
        targets.splice(i, 1);
      }
    }

    if(vehicle.edge.top){
      //targets.push(new Target(width + 10, vehicle.r));
    }

    if(vehicle.edge.bottom){
      //targets.push(new Target(width + 10, height - vehicle.r));
    }

    fill(255, 255, 255, 100);
    textSize(32);
    text("Hit Counter: " + Vehicle.hitCounter, 5 * width / 10, 9 * height / 10);
}

function mousePressed(){
  targets.push(new Target(mouseX, mouseY));
}
