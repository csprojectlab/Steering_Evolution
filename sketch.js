let population = [];
let food = [];
let poison = [];
let nutrition = [0.1, -1];
let debug;   // Additional information.

// Canvas variables
let canvasWidth = 800;
let canvasHeight = 600;

// Add Vehicle by dragging mouse.
function mouseDragged() {
    population.push(new Vehicle(mouseX, mouseY));
}

// If debug key is pressed
function keyPressed() {
    if (key == 'r' || key == 'R') {
        debug.checked(!debug.checked())
    }
}

function setup () {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvascontainer')
    debug = select("#debug");

    // angleMode(RADIANS);
    for (let i = 0; i < 10; i++)
        population[i] = new Vehicle(width / 2, height / 2);
    for (let i = 0; i < 10; i++) 
        food[i] = createVector(random(width), random(height))
    for (let i = 0; i < 5; i++)
        poison[i] = createVector(random(width), random(height));
}

function draw () {
    background(255);
    // 10% chance of new food.
    if (random(1) < 0.05)
        food.push(createVector(random(width), random(height)));
    // 1% chance of new poison.
    if (random(1) < 0.05)
        poison.push(createVector(random(width), random(height)));

    // Go Through all the vehicles.
    for (let i = population.length - 1; i >= 0; i--) {
        let v = population[i];
        // Eat the food. (index 0)
        v.eat(poison, 1);
        v.eat(food, 0);
        // Eat the poision (index 1)
        // Check the boundaries
        v.boundaries();

        // Update and draw.
        v.update();
        v.display();

        // If vehicle has died.
        if (v.dead()) {
            population.splice(i, 1);
        } else {
            // Every vehicle has a chance of cloning itself.
            let child = v.birth();
            if (child != null)
                population.push(child);
        }
    }

    // Draw all the food and poison.
    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 4);
    }
    for (let i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 4);
    }
}