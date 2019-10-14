let population = [];
let food = [];
let poison = [];
let nutrition = [0.1, -1];
let debug;   // Additional information.

// Canvas variables
let canvasWidth = 1950;
let canvasHeight = 800;

// Population count
const TOTAL_ORGANISMS = 100
const SPAWN_BORDER = 30;
const FOOD_COUNT = 200;
const POISON_COUNT = 100;

let counter = 0;

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
    for (let i = 0; i < TOTAL_ORGANISMS; i++)
        population[i] = new Vehicle(floor(random(SPAWN_BORDER, width)), floor(random(SPAWN_BORDER, height)));
    for (let i = 0; i < FOOD_COUNT; i++) 
        food[i] = createVector(random(width), random(height))
    for (let i = 0; i < POISON_COUNT; i++)
        poison[i] = createVector(random(width), random(height));    
}

function draw () {
    counter++;          // To calculate running averages.
    background(0);
    if (food.length < FOOD_COUNT) 
        food.push(createVector(random(width), random(height)))
    if (poison.length < POISON_COUNT)
        poison.push(createVector(random(width), random(height)))

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