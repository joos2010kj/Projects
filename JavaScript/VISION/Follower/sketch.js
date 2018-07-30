var target;
var vehicles = [];
var maxVel = 5;
var maxForce = 0.1;
var counter = 0;

function setup(){
    createCanvas(500, 500);
    target = new Target();

    for(let i = 0; i < 1; i++)
      vehicles[i] = new Vehicle(random(width), random(height), target);
}

function draw(){
    background(51);

    target.update();
    target.show();

    vehicles.forEach(vehicle => {
      vehicle.update();
      vehicle.show();
    });
}
